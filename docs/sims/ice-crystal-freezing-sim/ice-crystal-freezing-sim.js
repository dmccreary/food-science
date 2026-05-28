// Ice Crystal Freezing MicroSim — Food Science
// CANVAS_HEIGHT: 620
// Students compare slow (home freezer, 0 F) vs fast (commercial blast, -40 F) freezing
// of a strawberry cell. Slow freeze makes a few BIG ice crystals that pierce the cell wall
// and cause heavy drip loss on thaw. Fast freeze makes MANY tiny crystals with minimal
// damage. Click any crystal to see its simulated diameter (microns) and an explanation.

// ---- Layout constants ----
let canvasWidth = 740;
let drawHeight = 540;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 16;

// Title bar
let titleY = 8;
let subtitleY = 30;

// Two panels (side by side)
let panelTopY = 64;
let panelW;          // computed in layoutRegions()
let panelH = 380;
let leftPanelX;
let rightPanelX;
let panelGap = 16;

// Strawberry cell geometry (each panel has one big cell cross-section)
let cellPadY = 32;   // padding from panel top to cell top

// Quality score bar
let scoreBarY;       // top y of score bars
let scoreBarH = 38;

// ---- Colors ----
const COLOR_BG = '#f1f8e9';
const COLOR_PRIMARY = '#2e7d32';
const COLOR_ACCENT = '#f57c00';
const COLOR_DARK = '#1b3a1b';
const COLOR_PANEL = '#ffffff';
const COLOR_PANEL_BORDER = '#c8e6c9';

const COLOR_STRAWBERRY_OUT = '#c62828';  // outer red (skin tone)
const COLOR_STRAWBERRY_IN = '#f8bbd0';   // cytoplasm pink
const COLOR_CELL_WALL = '#558b2f';       // green-ish cell wall (plant cell)
const COLOR_RUPTURE = '#b71c1c';         // bright red for tear marks
const COLOR_ICE = '#bbdefb';             // light blue ice
const COLOR_ICE_EDGE = '#1976d2';        // darker blue ice outline
const COLOR_DRIP = '#64b5f6';            // blue puddle
const COLOR_SCORE_GOOD = '#2e7d32';
const COLOR_SCORE_POOR = '#e53935';

// ---- Animation phases ----
// 0 = liquid (initial / reset)
// 1 = freezing (crystals nucleating + growing, temperature dropping)
// 2 = frozen (final state visible, ruptures shown)
// 3 = thawed (drip loss puddle appears)
const PHASE_LIQUID = 0;
const PHASE_FREEZING = 1;
const PHASE_FROZEN = 2;
const PHASE_THAWED = 3;

let phase = PHASE_LIQUID;
let phaseStartMs = 0;
const FREEZE_DURATION_MS = 4500;  // freezing animation
const FROZEN_HOLD_MS = 1500;      // hold frozen state
const THAW_DURATION_MS = 1500;    // appear-puddle transition

// Each panel has its own list of crystals
let slowPanel;
let fastPanel;

// Tooltip state
let tooltip = null; // { x, y, lines: [], panel }

// p5 controls
let freezeButton;
let resetButton;

// Click hit-test info
let lastMouseX = -1;
let lastMouseY = -1;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Segoe UI, Arial, sans-serif');

  layoutRegions();
  initPanels();

  freezeButton = createButton('Freeze Both');
  freezeButton.parent(document.querySelector('main'));
  freezeButton.position(margin, drawHeight + 16);
  freezeButton.mousePressed(startFreeze);
  freezeButton.style('font-size', '14px');
  freezeButton.style('padding', '6px 14px');
  freezeButton.style('background-color', '#1976d2');
  freezeButton.style('color', 'white');
  freezeButton.style('border', 'none');
  freezeButton.style('border-radius', '4px');
  freezeButton.style('cursor', 'pointer');

  resetButton = createButton('Reset');
  resetButton.parent(document.querySelector('main'));
  resetButton.position(margin + 130, drawHeight + 16);
  resetButton.mousePressed(resetAll);
  resetButton.style('font-size', '14px');
  resetButton.style('padding', '6px 14px');
  resetButton.style('background-color', '#757575');
  resetButton.style('color', 'white');
  resetButton.style('border', 'none');
  resetButton.style('border-radius', '4px');
  resetButton.style('cursor', 'pointer');

  describe('Side-by-side strawberry cell cross-sections comparing slow home freezing (a few big ice crystals that rupture the cell wall) vs fast blast freezing (many tiny crystals with minimal damage). Click a crystal to see its size in microns.', LABEL);
}

function layoutRegions() {
  let available = canvasWidth - 2 * margin - panelGap;
  panelW = floor(available / 2);
  leftPanelX = margin;
  rightPanelX = margin + panelW + panelGap;
  scoreBarY = panelTopY + panelH + 14;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  layoutRegions();
  freezeButton.position(margin, drawHeight + 16);
  resetButton.position(margin + 130, drawHeight + 16);
  // re-layout panels based on new width
  initPanels(true);
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = container.offsetWidth;
    if (canvasWidth < 520) canvasWidth = 520;
    if (canvasWidth > 740) canvasWidth = 740;
  }
}

// ---- Panel + crystal initialization ----
function initPanels(preservePhase) {
  let preserved = preservePhase ? phase : PHASE_LIQUID;
  slowPanel = makePanel(leftPanelX, panelTopY, panelW, panelH, 'slow');
  fastPanel = makePanel(rightPanelX, panelTopY, panelW, panelH, 'fast');
  // nucleate crystals (positions fixed; sizes animate during freezing)
  nucleateCrystals(slowPanel, 10, 30, 60);     // ~10 crystals, target visual radius 30..60 px
  nucleateCrystals(fastPanel, 50, 4, 9);       // ~50 crystals, target visual radius 4..9 px
  // ruptures: only on slow panel, several
  generateRuptures(slowPanel, 6);
  generateRuptures(fastPanel, 1);  // tiny / barely visible
  phase = preserved;
  // If the phase says we're past freezing, fill crystal sizes to max immediately
  // so a window resize during/after freeze doesn't visually reset the cells.
  if (phase === PHASE_FROZEN || phase === PHASE_THAWED) {
    for (let c of slowPanel.crystals) c.currentRadius = c.maxRadius;
    for (let c of fastPanel.crystals) c.currentRadius = c.maxRadius;
  }
}

function makePanel(x, y, w, h, kind) {
  // Cell occupies most of the panel.
  let cellCX = x + w / 2;
  let cellCY = y + cellPadY + (h - cellPadY - 60) / 2;
  let cellRX = (w - 40) / 2;
  let cellRY = (h - cellPadY - 80) / 2;
  return {
    x, y, w, h, kind,
    cellCX, cellCY, cellRX, cellRY,
    crystals: [],
    ruptures: [],
    label: kind === 'slow' ? 'Slow Freeze' : 'Fast Freeze',
    sublabel: kind === 'slow' ? 'Home freezer  (0 F / -18 C)' : 'Commercial blast  (-40 F / -40 C)',
    score: kind === 'slow' ? 45 : 88,
    dripAmount: kind === 'slow' ? 0.85 : 0.10  // fraction of max puddle width
  };
}

function nucleateCrystals(panel, count, rMin, rMax) {
  panel.crystals = [];
  // Use a simple rejection-sample so crystals don't overlap too badly
  let attempts = 0;
  while (panel.crystals.length < count && attempts < count * 60) {
    attempts++;
    // Random point inside the ellipse
    let ang = random(TWO_PI);
    let r = sqrt(random(0, 1));
    let px = panel.cellCX + cos(ang) * r * (panel.cellRX - 6);
    let py = panel.cellCY + sin(ang) * r * (panel.cellRY - 6);
    let radius = random(rMin, rMax);
    // Reject if overlaps another crystal too much
    let ok = true;
    for (let c of panel.crystals) {
      if (dist(px, py, c.x, c.y) < (radius + c.maxRadius) * 0.55) { ok = false; break; }
    }
    if (!ok) continue;
    // Convert visual radius to a microns value used in tooltip.
    // Calibration: a "big" 60 px visual ~= 250 microns; a "small" 5 px ~= 30 microns.
    // Map roughly linearly with a touch of randomness.
    let microns = round(map(radius, 4, 60, 25, 270) + random(-8, 8));
    if (microns < 10) microns = 10;
    panel.crystals.push({
      x: px, y: py,
      maxRadius: radius,
      currentRadius: 0,    // grows during freezing
      microns: microns,
      // Slight visual variation
      jitterSeed: random(1000),
      sides: panel.kind === 'slow' ? 6 : 5  // hex vs pentagon-ish
    });
  }
}

function generateRuptures(panel, count) {
  panel.ruptures = [];
  for (let i = 0; i < count; i++) {
    let ang = random(TWO_PI);
    let rx = panel.cellCX + cos(ang) * (panel.cellRX - 2);
    let ry = panel.cellCY + sin(ang) * (panel.cellRY - 2);
    panel.ruptures.push({ x: rx, y: ry, angle: ang, length: random(10, 18) });
  }
}

// ---- State control ----
function startFreeze() {
  if (phase !== PHASE_LIQUID) return;  // need to reset first
  phase = PHASE_FREEZING;
  phaseStartMs = millis();
  tooltip = null;
}

function resetAll() {
  phase = PHASE_LIQUID;
  tooltip = null;
  // Reset crystal sizes to zero
  for (let c of slowPanel.crystals) c.currentRadius = 0;
  for (let c of fastPanel.crystals) c.currentRadius = 0;
}

// ---- Main draw loop ----
function draw() {
  background(COLOR_BG);

  updatePhase();
  drawTitle();
  drawPanel(slowPanel);
  drawPanel(fastPanel);
  drawScoreBar(slowPanel);
  drawScoreBar(fastPanel);
  drawLegend();
  drawControlBar();
  drawTooltip();
}

function updatePhase() {
  if (phase === PHASE_FREEZING) {
    let t = (millis() - phaseStartMs) / FREEZE_DURATION_MS;
    if (t >= 1) {
      t = 1;
      phase = PHASE_FROZEN;
      phaseStartMs = millis();
    }
    // Grow crystals to their max radius
    let growSlow = easeOutCubic(t);
    let growFast = easeOutCubic(constrain(t * 1.2, 0, 1)); // fast freeze finishes a bit sooner
    for (let c of slowPanel.crystals) c.currentRadius = c.maxRadius * growSlow;
    for (let c of fastPanel.crystals) c.currentRadius = c.maxRadius * growFast;
  } else if (phase === PHASE_FROZEN) {
    if (millis() - phaseStartMs > FROZEN_HOLD_MS) {
      phase = PHASE_THAWED;
      phaseStartMs = millis();
    }
  }
}

function easeOutCubic(t) { return 1 - pow(1 - t, 3); }

// ---- Title ----
function drawTitle() {
  noStroke();
  fill(COLOR_DARK);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(18);
  text('Ice Crystal Size vs Freezing Speed', margin, titleY);
  textStyle(NORMAL);
  textSize(12);
  fill(80);
  text('Click "Freeze Both" to compare. Click any ice crystal to see its size in microns.',
       margin, subtitleY);
}

// ---- Panel rendering ----
function drawPanel(panel) {
  push();

  // Panel frame
  noStroke();
  fill(COLOR_PANEL);
  rect(panel.x, panel.y, panel.w, panel.h, 8);
  noFill();
  stroke(COLOR_PANEL_BORDER);
  strokeWeight(2);
  rect(panel.x, panel.y, panel.w, panel.h, 8);

  // Panel labels
  noStroke();
  fill(COLOR_DARK);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  textSize(15);
  text(panel.label, panel.x + panel.w / 2, panel.y + 8);
  textStyle(NORMAL);
  textSize(11);
  fill(90);
  text(panel.sublabel, panel.x + panel.w / 2, panel.y + 26);

  // Draw cell + contents
  drawCell(panel);

  // Draw drip-loss puddle if thawed
  if (phase === PHASE_THAWED) {
    drawDripPuddle(panel);
  }

  pop();
}

function drawCell(panel) {
  push();
  // Cytoplasm fill (or fading when thawed = lost water)
  noStroke();
  if (phase === PHASE_THAWED) {
    // Slow loses more interior color (lost juice)
    let lossAlpha = panel.kind === 'slow' ? 100 : 200;
    let c = color(COLOR_STRAWBERRY_IN);
    c.setAlpha(lossAlpha);
    fill(c);
  } else {
    fill(COLOR_STRAWBERRY_IN);
  }
  ellipse(panel.cellCX, panel.cellCY, panel.cellRX * 2, panel.cellRY * 2);

  // Subtle inner "vacuole" hint
  noStroke();
  let v = color(255, 255, 255);
  v.setAlpha(60);
  fill(v);
  ellipse(panel.cellCX - panel.cellRX * 0.2, panel.cellCY - panel.cellRY * 0.3,
          panel.cellRX * 0.5, panel.cellRY * 0.4);

  // Ice crystals
  for (let c of panel.crystals) {
    if (c.currentRadius > 0.5) drawCrystal(c, panel);
  }

  // Cell wall (drawn AFTER crystals so wall is on top, with gaps at rupture points if frozen+)
  drawCellWall(panel);

  // Rupture marks (only when frozen or thawed, only really visible on slow)
  if (phase === PHASE_FROZEN || phase === PHASE_THAWED) {
    for (let r of panel.ruptures) {
      drawRupture(r, panel);
    }
  }

  // Strawberry skin labels (a small "seed" or two for character)
  drawSeeds(panel);

  pop();
}

function drawCellWall(panel) {
  push();
  noFill();
  stroke(COLOR_STRAWBERRY_OUT);
  strokeWeight(4);
  ellipse(panel.cellCX, panel.cellCY, panel.cellRX * 2, panel.cellRY * 2);
  // Inner thin green plant cell-wall line
  stroke(COLOR_CELL_WALL);
  strokeWeight(1.5);
  ellipse(panel.cellCX, panel.cellCY, panel.cellRX * 2 - 4, panel.cellRY * 2 - 4);
  pop();
}

function drawCrystal(c, panel) {
  push();
  // Body
  noStroke();
  fill(COLOR_ICE);
  drawPolygon(c.x, c.y, c.currentRadius, c.sides, c.jitterSeed);
  // Outline
  noFill();
  stroke(COLOR_ICE_EDGE);
  strokeWeight(panel.kind === 'slow' ? 1.5 : 0.75);
  drawPolygon(c.x, c.y, c.currentRadius, c.sides, c.jitterSeed);
  // A bit of internal "sparkle" line for visual interest on big crystals
  if (c.currentRadius > 18) {
    stroke(255, 255, 255, 180);
    strokeWeight(1);
    line(c.x - c.currentRadius * 0.4, c.y - c.currentRadius * 0.4,
         c.x + c.currentRadius * 0.4, c.y + c.currentRadius * 0.4);
  }
  pop();
}

function drawPolygon(cx, cy, r, sides, seed) {
  beginShape();
  for (let i = 0; i < sides; i++) {
    let theta = (i / sides) * TWO_PI - HALF_PI;
    // Deterministic jitter so crystals look angular but stable
    let j = (sin(seed + i * 13.37) * 0.18 + 1.0);
    let px = cx + cos(theta) * r * j;
    let py = cy + sin(theta) * r * j;
    vertex(px, py);
  }
  endShape(CLOSE);
}

function drawRupture(r, panel) {
  push();
  // Bright red short jagged tear across the cell wall
  translate(r.x, r.y);
  rotate(r.angle + HALF_PI);
  stroke(COLOR_RUPTURE);
  strokeWeight(panel.kind === 'slow' ? 3.5 : 1.5);
  noFill();
  // Zigzag tear mark
  let len = panel.kind === 'slow' ? r.length : r.length * 0.4;
  beginShape();
  for (let i = -2; i <= 2; i++) {
    let x = i * (len / 4);
    let y = (i % 2 === 0) ? -3 : 3;
    vertex(x, y);
  }
  endShape();
  // Small red glow dot at center for emphasis (slow only)
  if (panel.kind === 'slow') {
    noStroke();
    let g = color(229, 57, 53);
    g.setAlpha(140);
    fill(g);
    ellipse(0, 0, 12, 12);
  }
  pop();
}

function drawSeeds(panel) {
  // Tiny strawberry seeds dotted around the outside of the cell for context
  push();
  noStroke();
  fill('#fff59d');
  let seedR = 2.4;
  let positions = [
    [-0.85, -0.5], [0.85, -0.5], [-0.85, 0.5], [0.85, 0.5],
    [0.0, -0.95], [0.0, 0.95]
  ];
  for (let p of positions) {
    let sx = panel.cellCX + p[0] * panel.cellRX;
    let sy = panel.cellCY + p[1] * panel.cellRY;
    ellipse(sx, sy, seedR * 2, seedR * 2);
  }
  pop();
}

function drawDripPuddle(panel) {
  push();
  noStroke();
  // Compute progress of thaw
  let t = constrain((millis() - phaseStartMs) / THAW_DURATION_MS, 0, 1);
  let maxW = (panel.w - 40) * panel.dripAmount;
  let w = maxW * t;
  let h = 14;
  let px = panel.cellCX;
  let py = panel.y + panel.h - 22;
  // Puddle base
  let pc = color(COLOR_DRIP);
  pc.setAlpha(200);
  fill(pc);
  ellipse(px, py, w, h);
  // Highlight
  let hi = color(255);
  hi.setAlpha(120);
  fill(hi);
  ellipse(px - w * 0.15, py - 2, w * 0.4, h * 0.35);
  // Label
  fill(COLOR_DARK);
  textAlign(CENTER, TOP);
  textSize(11);
  textStyle(BOLD);
  let label = panel.kind === 'slow' ? 'Heavy drip loss' : 'Minimal drip';
  text(label, px, py + 10);
  pop();
}

// ---- Score bar ----
function drawScoreBar(panel) {
  push();
  let x = panel.x + 12;
  let y = scoreBarY;
  let w = panel.w - 24;
  let h = scoreBarH;

  // Background track
  noStroke();
  fill('#eceff1');
  rect(x, y + 16, w, 12, 6);

  // Show score only after freezing has at least started
  let shown = (phase === PHASE_FROZEN || phase === PHASE_THAWED) ? panel.score :
              (phase === PHASE_FREEZING ?
                round(panel.score * easeOutCubic((millis() - phaseStartMs) / FREEZE_DURATION_MS)) : 0);
  let fillW = (shown / 100) * w;
  let barColor = shown >= 70 ? COLOR_SCORE_GOOD : (shown >= 50 ? COLOR_ACCENT : COLOR_SCORE_POOR);
  fill(barColor);
  rect(x, y + 16, fillW, 12, 6);

  // Label above
  fill(COLOR_DARK);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(12);
  text('Texture quality after thaw', x, y);
  // Score on right
  textAlign(RIGHT, TOP);
  textStyle(NORMAL);
  text(shown + ' / 100', x + w, y);
  pop();
}

// ---- Legend ----
function drawLegend() {
  push();
  let y = scoreBarY + scoreBarH + 14;
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(11);
  fill(COLOR_DARK);

  let lx = margin;
  // Ice swatch
  fill(COLOR_ICE);
  rect(lx, y, 14, 14, 3);
  noFill();
  stroke(COLOR_ICE_EDGE);
  rect(lx, y, 14, 14, 3);
  noStroke();
  fill(COLOR_DARK);
  text('Ice crystal', lx + 20, y + 7);

  lx += 110;
  fill(COLOR_RUPTURE);
  rect(lx, y, 14, 14, 3);
  fill(COLOR_DARK);
  text('Cell wall rupture', lx + 20, y + 7);

  lx += 140;
  fill(COLOR_DRIP);
  rect(lx, y, 14, 14, 3);
  fill(COLOR_DARK);
  text('Drip loss puddle', lx + 20, y + 7);

  lx += 140;
  fill(COLOR_STRAWBERRY_IN);
  rect(lx, y, 14, 14, 3);
  fill(COLOR_DARK);
  text('Cell cytoplasm', lx + 20, y + 7);

  pop();
}

// ---- Control bar at bottom ----
function drawControlBar() {
  push();
  // separator
  stroke(COLOR_PANEL_BORDER);
  strokeWeight(1);
  line(0, drawHeight, canvasWidth, drawHeight);

  noStroke();
  fill(COLOR_DARK);
  textAlign(LEFT, CENTER);
  textSize(12);
  let statusText = '';
  if (phase === PHASE_LIQUID)   statusText = 'Status: Liquid water inside cell.  Click "Freeze Both" to start.';
  if (phase === PHASE_FREEZING) statusText = 'Status: Freezing!  Watch crystals nucleate and grow...';
  if (phase === PHASE_FROZEN)   statusText = 'Status: Fully frozen.  Notice the cell-wall ruptures in the slow-freeze panel.';
  if (phase === PHASE_THAWED)   statusText = 'Status: Thawed.  Slow-freeze drips out juice; fast-freeze stays intact.';
  text(statusText, margin + 260, drawHeight + 30);

  // Tip
  fill(90);
  textSize(11);
  text('Tip: Click any ice crystal to see its size in microns.', margin + 260, drawHeight + 50);

  pop();
}

// ---- Tooltip ----
function drawTooltip() {
  if (!tooltip) return;
  push();
  textSize(11);
  let pad = 8;
  let lineH = 14;
  let maxW = 0;
  for (let line of tooltip.lines) {
    let w = textWidth(line);
    if (w > maxW) maxW = w;
  }
  let boxW = maxW + pad * 2;
  let boxH = tooltip.lines.length * lineH + pad * 2;
  let bx = tooltip.x + 12;
  let by = tooltip.y - boxH - 12;
  // Keep inside canvas
  if (bx + boxW > canvasWidth - 4) bx = canvasWidth - boxW - 4;
  if (by < 4) by = tooltip.y + 14;

  noStroke();
  let bg = color(33, 33, 33);
  bg.setAlpha(235);
  fill(bg);
  rect(bx, by, boxW, boxH, 6);

  fill(255);
  textAlign(LEFT, TOP);
  for (let i = 0; i < tooltip.lines.length; i++) {
    if (i === 0) textStyle(BOLD); else textStyle(NORMAL);
    text(tooltip.lines[i], bx + pad, by + pad + i * lineH);
  }
  pop();
}

// ---- Mouse interaction ----
function mousePressed() {
  // Only react inside canvas area
  if (mouseX < 0 || mouseX > canvasWidth || mouseY < 0 || mouseY > drawHeight) {
    tooltip = null;
    return;
  }
  // Test crystals in both panels (top-most last so we iterate slow then fast).
  // Pick the closest crystal whose visible body the click lies inside.
  let hit = findCrystalHit(mouseX, mouseY);
  if (hit) {
    tooltip = makeCrystalTooltip(hit.crystal, hit.panel);
  } else {
    tooltip = null;
  }
}

function findCrystalHit(mx, my) {
  let best = null;
  let bestD = Infinity;
  for (let panel of [slowPanel, fastPanel]) {
    for (let c of panel.crystals) {
      if (c.currentRadius < 2) continue; // not visible yet
      let d = dist(mx, my, c.x, c.y);
      // Use generous hit area: max(currentRadius, 6 px) for tiny ones
      let hitR = max(c.currentRadius, 6);
      if (d <= hitR && d < bestD) {
        bestD = d;
        best = { crystal: c, panel };
      }
    }
  }
  return best;
}

function makeCrystalTooltip(c, panel) {
  let lines = [];
  lines.push('Ice crystal: ~' + c.microns + ' microns across');
  if (panel.kind === 'slow') {
    lines.push('Slow freeze grows few BIG crystals.');
    lines.push('Their sharp edges pierce the cell wall,');
    lines.push('letting juice drip out when thawed.');
  } else {
    lines.push('Fast freeze makes MANY tiny crystals.');
    lines.push('Small crystals fit between cells without');
    lines.push('tearing walls, so texture is preserved.');
  }
  return { x: mouseX, y: mouseY, lines, panel };
}
