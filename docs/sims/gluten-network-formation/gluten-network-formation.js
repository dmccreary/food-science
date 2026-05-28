// Gluten Network Formation - Food Science MicroSim
// CANVAS_HEIGHT: 700
// Two panels side by side: Flour Protein Selector (left) and Gluten Network Visualizer (right).
// Students select a flour, add water, then knead to develop gluten.
// Visual: blue glutenin and yellow gliadin "worms" progressively align and bond.
// Elasticity / Extensibility bars and a Windowpane Test give quantitative + visual feedback.

// ----- Layout constants -----
let canvasWidth = 760;
let drawHeight = 640;
let controlHeight = 60;
let canvasHeight = drawHeight + controlHeight;
let margin = 10;
let defaultTextSize = 14;

// Header band
let titleY = 22;
let subtitleY = 42;

// Two-panel layout
let panelTopY = 60;
let panelHeight = 560;
let panelGap = 12;
let leftPanelW = 230;       // flour selector
let rightPanelW;            // computed in setup

// Right-panel sub-areas
let doughCenterX;
let doughCenterY;
let doughRadius = 140;

// Colors (book palette)
const COLOR_BG        = '#f1f8e9';
const COLOR_PANEL_BG  = '#ffffff';
const COLOR_BORDER    = '#bdbdbd';
const COLOR_TITLE     = '#1b5e20';
const COLOR_PRIMARY   = '#2e7d32';   // green
const COLOR_ACCENT    = '#f57c00';   // orange
const COLOR_GOLD      = '#fbc02d';   // selected card highlight
const COLOR_GLUTENIN  = '#1e88e5';   // blue worm
const COLOR_GLIADIN   = '#fdd835';   // yellow worm
const COLOR_DOUGH     = '#f5e6c4';   // dough cross-section
const COLOR_GAS       = '#ffffff';   // gas bubble
const COLOR_TEXT      = '#212121';
const COLOR_MUTED     = '#616161';
const COLOR_BAR_BG    = '#e0e0e0';
const COLOR_RED       = '#c62828';   // torn windowpane

// ----- Flour options -----
const flours = [
  { id: 'cake', label: 'Cake Flour',       protein: 8,
    desc: 'Soft, low-protein — tender crumb.' },
  { id: 'ap',   label: 'All-Purpose Flour', protein: 11,
    desc: 'Middle ground — pancakes, cookies, biscuits.' },
  { id: 'bread',label: 'Bread Flour',      protein: 13,
    desc: 'High-protein — strong, chewy bread.' }
];

let selectedFlourIndex = 1;  // default to All-Purpose

// ----- Simulation state -----
// stage progression:
//   0: dry flour (no water)
//   1: hydrated (water added, not kneaded)
//   2..6: kneaded 1x..5x
let stage = 0;
let kneadCount = 0;
const MAX_KNEAD = 5;

// Molecules
let glutenins = [];    // {x, y, angle, len, baseX, baseY}
let gliadins  = [];    // {x, y, angle, len, baseX, baseY}
let gasBubbles = [];   // {x, y, r}

// Windowpane test
let windowpaneActive = false;
let windowpaneStretch = 0;     // 0..1 progressing while active
let windowpaneTorn = false;

// UI
let waterBtn;
let kneadBtn;
let windowpaneBtn;
let resetBtn;

function updateCanvasSize() {
  const container = document.querySelector('main').parentElement;
  if (container) {
    const w = container.clientWidth;
    if (w && w > 320) {
      canvasWidth = Math.min(w - 20, 900);
    }
  }
  rightPanelW = canvasWidth - margin * 2 - panelGap - leftPanelW;
  doughCenterX = margin + leftPanelW + panelGap + rightPanelW / 2;
  doughCenterY = panelTopY + 30 + doughRadius + 10;
}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Segoe UI');
  textSize(defaultTextSize);

  buildMolecules();
  buildGasBubbles();
  createButtons();
  positionButtons();
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionButtons();
}

// ----- Build molecule pools -----
function buildMolecules() {
  glutenins = [];
  gliadins = [];
  const protein = flours[selectedFlourIndex].protein;
  // Total molecule count scales mildly with protein content
  const totalGlutenin = Math.round(18 + (protein - 8) * 4);   // ~18..38
  const totalGliadin  = Math.round(14 + (protein - 8) * 3);   // ~14..29

  for (let i = 0; i < totalGlutenin; i++) {
    const pos = randomPointInCircle(doughCenterX, doughCenterY, doughRadius - 14);
    glutenins.push({
      baseX: pos.x, baseY: pos.y,
      x: pos.x, y: pos.y,
      angle: random(TWO_PI),
      len: random(22, 30)
    });
  }
  for (let i = 0; i < totalGliadin; i++) {
    const pos = randomPointInCircle(doughCenterX, doughCenterY, doughRadius - 14);
    gliadins.push({
      baseX: pos.x, baseY: pos.y,
      x: pos.x, y: pos.y,
      angle: random(TWO_PI),
      len: random(10, 16)
    });
  }
}

function buildGasBubbles() {
  gasBubbles = [];
  // Gas bubbles only appear at high knead with enough protein.
  const count = 10;
  for (let i = 0; i < count; i++) {
    const pos = randomPointInCircle(doughCenterX, doughCenterY, doughRadius - 28);
    gasBubbles.push({ x: pos.x, y: pos.y, r: random(6, 14) });
  }
}

function randomPointInCircle(cx, cy, r) {
  // Uniform sampling inside a circle
  const t = random(TWO_PI);
  const u = random() + random();
  const radius = (u > 1 ? 2 - u : u) * r;
  return { x: cx + radius * cos(t), y: cy + radius * sin(t) };
}

// ----- UI buttons -----
function createButtons() {
  waterBtn = createButton('Add Water');
  waterBtn.mousePressed(onAddWater);
  styleButton(waterBtn, COLOR_PRIMARY);

  kneadBtn = createButton('Knead (1 min)');
  kneadBtn.mousePressed(onKnead);
  styleButton(kneadBtn, COLOR_ACCENT);

  windowpaneBtn = createButton('Windowpane Test');
  windowpaneBtn.mousePressed(onWindowpane);
  styleButton(windowpaneBtn, '#6a1b9a');

  resetBtn = createButton('Reset');
  resetBtn.mousePressed(onReset);
  styleButton(resetBtn, '#616161');
}

function styleButton(btn, bgColor) {
  btn.style('background-color', bgColor);
  btn.style('color', '#ffffff');
  btn.style('border', 'none');
  btn.style('padding', '8px 14px');
  btn.style('border-radius', '6px');
  btn.style('font-family', 'Segoe UI, Arial, sans-serif');
  btn.style('font-size', '13px');
  btn.style('font-weight', '600');
  btn.style('cursor', 'pointer');
}

function positionButtons() {
  // Buttons sit beneath the dough cross-section inside the right panel.
  const rowY = doughCenterY + doughRadius + 22;
  const startX = margin + leftPanelW + panelGap + 14;

  waterBtn.position(startX, rowY);
  kneadBtn.position(startX + 110, rowY);
  windowpaneBtn.position(startX + 240, rowY);
  resetBtn.position(startX + 380, rowY);
}

// ----- Button handlers -----
function onAddWater() {
  if (stage === 0) {
    stage = 1;
    hydrateMolecules();
  }
}

function onKnead() {
  if (stage === 0) {
    // Auto-hydrate then knead
    stage = 1;
    hydrateMolecules();
    return;
  }
  if (kneadCount < MAX_KNEAD) {
    kneadCount++;
    stage = 1 + kneadCount;       // 2..6
    alignMolecules();
  }
}

function onWindowpane() {
  if (stage < 2) return;          // Need at least 1 knead to attempt
  windowpaneActive = true;
  windowpaneStretch = 0;
  windowpaneTorn = false;
}

function onReset() {
  stage = 0;
  kneadCount = 0;
  windowpaneActive = false;
  windowpaneStretch = 0;
  windowpaneTorn = false;
  buildMolecules();
  buildGasBubbles();
}

function hydrateMolecules() {
  // After hydration, molecules cluster slightly more — small inward pull.
  for (const g of glutenins) {
    const dx = doughCenterX - g.baseX;
    const dy = doughCenterY - g.baseY;
    g.baseX += dx * 0.06;
    g.baseY += dy * 0.06;
    g.x = g.baseX; g.y = g.baseY;
  }
  for (const g of gliadins) {
    const dx = doughCenterX - g.baseX;
    const dy = doughCenterY - g.baseY;
    g.baseX += dx * 0.04;
    g.baseY += dy * 0.04;
    g.x = g.baseX; g.y = g.baseY;
  }
}

function alignMolecules() {
  // Each knead step nudges glutenin angles toward horizontal alignment
  // (sheet-like) and packs molecules into a denser pattern.
  const t = kneadCount / MAX_KNEAD;   // 0..1
  for (const g of glutenins) {
    // Rotate toward 0 angle (horizontal)
    g.angle = lerpAngle(g.angle, 0, 0.35 * t + 0.1);
    // Pull slightly toward a layered y-grid
    const targetY = doughCenterY + Math.round((g.baseY - doughCenterY) / 20) * 20;
    g.baseY = lerp(g.baseY, targetY, 0.25 * t);
    g.y = g.baseY;
  }
  for (const g of gliadins) {
    // Gliadin stays globular — small drift only
    g.angle += random(-0.2, 0.2);
  }
}

function lerpAngle(a, b, t) {
  // Wrap-aware angle lerp
  let diff = b - a;
  while (diff > PI) diff -= TWO_PI;
  while (diff < -PI) diff += TWO_PI;
  return a + diff * t;
}

// ----- Draw loop -----
function draw() {
  background(COLOR_BG);

  drawHeader();
  drawLeftPanel();
  drawRightPanel();
  drawBars();

  if (windowpaneActive) {
    updateWindowpane();
    drawWindowpane();
  }
}

function drawHeader() {
  push();
  noStroke();
  fill(COLOR_TITLE);
  textSize(18);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text('Gluten Network Development', margin + 4, 8);

  fill(COLOR_MUTED);
  textSize(12);
  textStyle(NORMAL);
  text('Pick a flour, add water, and knead to develop the gluten network.',
       margin + 4, 32);
  pop();
}

// ----- Left panel: flour selector -----
function drawLeftPanel() {
  push();
  // Panel background
  noStroke();
  fill(COLOR_PANEL_BG);
  rect(margin, panelTopY, leftPanelW, panelHeight, 8);
  stroke(COLOR_BORDER);
  noFill();
  rect(margin, panelTopY, leftPanelW, panelHeight, 8);

  // Title
  noStroke();
  fill(COLOR_TITLE);
  textSize(14);
  textStyle(BOLD);
  textAlign(CENTER, TOP);
  text('Flour Protein Selector', margin + leftPanelW / 2, panelTopY + 10);

  // Cards
  const cardX = margin + 14;
  const cardW = leftPanelW - 28;
  const cardH = 90;
  const cardGap = 12;
  let y = panelTopY + 38;

  for (let i = 0; i < flours.length; i++) {
    const isSelected = (i === selectedFlourIndex);
    push();
    if (isSelected) {
      stroke(COLOR_GOLD);
      strokeWeight(3);
      fill('#fff8e1');
    } else {
      stroke(COLOR_BORDER);
      strokeWeight(1);
      fill('#fafafa');
    }
    rect(cardX, y, cardW, cardH, 6);
    pop();

    push();
    noStroke();
    fill(COLOR_TITLE);
    textSize(13);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text(flours[i].label, cardX + 10, y + 8);

    fill(COLOR_ACCENT);
    textSize(20);
    textStyle(BOLD);
    text(flours[i].protein + '%', cardX + 10, y + 28);

    fill(COLOR_MUTED);
    textSize(11);
    textStyle(NORMAL);
    text('protein', cardX + 60, y + 36);

    fill(COLOR_TEXT);
    textSize(11);
    text(flours[i].desc, cardX + 10, y + 58, cardW - 20, cardH - 60);
    pop();

    y += cardH + cardGap;
  }

  // Stage badge directly under the cards (not pinned to panel bottom)
  const badgeY = y + 8;
  push();
  noStroke();
  fill('#e8f5e9');
  rect(cardX, badgeY, cardW, 95, 6);
  fill(COLOR_TITLE);
  textSize(12);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text('Current Stage', cardX + 10, badgeY + 8);

  fill(COLOR_TEXT);
  textSize(12);
  textStyle(NORMAL);
  text(stageLabel(), cardX + 10, badgeY + 26, cardW - 20, 60);
  pop();

  pop();
}

function stageLabel() {
  if (stage === 0) return 'Dry flour: proteins scattered, inactive.';
  if (stage === 1) return 'Hydrated: water activates glutenin (blue) and gliadin (yellow).';
  if (kneadCount === MAX_KNEAD) {
    return 'Kneaded 5 min: organized sheet-like network with trapped gas bubbles.';
  }
  return 'Kneaded ' + kneadCount + ' min: gluten strands aligning.';
}

// ----- Right panel: dough cross-section -----
function drawRightPanel() {
  push();
  // Panel background
  noStroke();
  fill(COLOR_PANEL_BG);
  rect(margin + leftPanelW + panelGap, panelTopY,
       rightPanelW, panelHeight, 8);
  stroke(COLOR_BORDER);
  noFill();
  rect(margin + leftPanelW + panelGap, panelTopY,
       rightPanelW, panelHeight, 8);

  // Title
  noStroke();
  fill(COLOR_TITLE);
  textSize(14);
  textStyle(BOLD);
  textAlign(CENTER, TOP);
  text('Gluten Network Visualizer  (Dough Cross-Section)',
       margin + leftPanelW + panelGap + rightPanelW / 2,
       panelTopY + 10);
  pop();

  // Dough disk
  push();
  noStroke();
  fill(COLOR_DOUGH);
  ellipse(doughCenterX, doughCenterY, doughRadius * 2, doughRadius * 2);
  stroke('#bca77a');
  strokeWeight(2);
  noFill();
  ellipse(doughCenterX, doughCenterY, doughRadius * 2, doughRadius * 2);
  pop();

  // Network of bonds (drawn beneath worms so worms sit on top)
  if (kneadCount >= 1) drawBonds();
  if (kneadCount >= 4) drawGasBubbles();

  // Worms
  drawGlutenins();
  drawGliadins();

  // Knead counter
  push();
  noStroke();
  fill(COLOR_TEXT);
  textSize(12);
  textAlign(CENTER, TOP);
  text('Kneading time: ' + kneadCount + ' / ' + MAX_KNEAD + ' minutes',
       doughCenterX, doughCenterY + doughRadius + 4);
  pop();
}

function drawBonds() {
  const t = kneadCount / MAX_KNEAD;          // 0..1
  const protein = flours[selectedFlourIndex].protein;
  // Higher protein and more kneading -> longer reach + thicker bonds
  const reach = 26 + 24 * t + (protein - 8) * 2;
  const maxAlpha = 60 + 140 * t;
  const weight = 0.6 + 2.0 * t * (protein / 13);

  push();
  const c = color(COLOR_GLUTENIN);
  c.setAlpha(maxAlpha);
  stroke(c);
  strokeWeight(weight);
  for (let i = 0; i < glutenins.length; i++) {
    const a = glutenins[i];
    for (let j = i + 1; j < glutenins.length; j++) {
      const b = glutenins[j];
      const d = dist(a.x, a.y, b.x, b.y);
      if (d < reach) {
        line(a.x, a.y, b.x, b.y);
      }
    }
  }
  pop();
}

function drawGasBubbles() {
  // Only meaningful if protein is high enough to trap gas
  const protein = flours[selectedFlourIndex].protein;
  const t = (kneadCount - 3) / 2;            // 0..1 from knead 4..5
  const alpha = constrain(120 + 100 * t, 0, 230);
  const proteinFactor = constrain((protein - 7) / 6, 0, 1);
  push();
  const c = color(COLOR_GAS);
  c.setAlpha(alpha * proteinFactor);
  noStroke();
  fill(c);
  for (const b of gasBubbles) {
    ellipse(b.x, b.y, b.r * 2, b.r * 2);
  }
  // Bubble outlines
  const ring = color('#9e9e9e');
  ring.setAlpha(120 * proteinFactor);
  stroke(ring);
  strokeWeight(1);
  noFill();
  for (const b of gasBubbles) {
    ellipse(b.x, b.y, b.r * 2, b.r * 2);
  }
  pop();
}

function drawGlutenins() {
  push();
  stroke(COLOR_GLUTENIN);
  strokeWeight(3);
  noFill();
  for (const g of glutenins) {
    drawWorm(g.x, g.y, g.angle, g.len, 4);
  }
  pop();
}

function drawGliadins() {
  push();
  // Gliadin = small yellow blob-like worm
  for (const g of gliadins) {
    fill(COLOR_GLIADIN);
    stroke('#c9a200');
    strokeWeight(1);
    ellipse(g.x, g.y, g.len, g.len * 0.7);
  }
  pop();
}

function drawWorm(x, y, angle, len, amp) {
  // Draw a small wavy "worm" centered at (x,y) along `angle` of length `len`
  push();
  translate(x, y);
  rotate(angle);
  beginShape();
  const segs = 8;
  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    const px = lerp(-len / 2, len / 2, t);
    const py = sin(t * TWO_PI) * amp * 0.4;
    vertex(px, py);
  }
  endShape();
  pop();
}

// ----- Bars: Elasticity + Extensibility -----
function drawBars() {
  const t = kneadCount / MAX_KNEAD;            // 0..1
  const protein = flours[selectedFlourIndex].protein;
  let elasticity = 0;
  let extensibility = 0;
  if (stage >= 1) {
    // Hydration unlocks small baseline; kneading multiplies it.
    elasticity = constrain((protein / 13) * (0.15 + 0.85 * t), 0, 1);
    extensibility = constrain(0.25 + (1 - protein / 14) * 0.30 + 0.45 * t * (protein / 13), 0, 1);
  }

  // Bars panel sits below buttons
  const barsTop = doughCenterY + doughRadius + 76;
  const barsLeft = margin + leftPanelW + panelGap + 14;
  const barsW = rightPanelW - 28;

  push();
  noStroke();
  fill('#f9fbe7');
  rect(barsLeft, barsTop, barsW, 110, 6);
  stroke(COLOR_BORDER);
  noFill();
  rect(barsLeft, barsTop, barsW, 110, 6);
  pop();

  drawBar('Elasticity',   elasticity,   barsLeft + 10, barsTop + 18, barsW - 20, COLOR_PRIMARY);
  drawBar('Extensibility', extensibility, barsLeft + 10, barsTop + 64, barsW - 20, COLOR_ACCENT);
}

function drawBar(label, value, x, y, w, barColor) {
  push();
  noStroke();
  fill(COLOR_TEXT);
  textSize(12);
  textStyle(BOLD);
  textAlign(LEFT, BOTTOM);
  text(label, x, y);

  textAlign(RIGHT, BOTTOM);
  textStyle(NORMAL);
  fill(COLOR_MUTED);
  text(Math.round(value * 100) + '%', x + w, y);

  // Track
  fill(COLOR_BAR_BG);
  rect(x, y + 4, w, 18, 4);
  // Fill
  fill(barColor);
  rect(x, y + 4, w * value, 18, 4);
  pop();
}

// ----- Windowpane test -----
function updateWindowpane() {
  // Stretch grows over time. Whether it tears depends on protein content
  // and how much kneading has happened.
  windowpaneStretch = min(1, windowpaneStretch + 0.012);
  if (!windowpaneTorn) {
    const protein = flours[selectedFlourIndex].protein;
    const kneadT = kneadCount / MAX_KNEAD;
    // Strength of network — higher protein and more kneading = stronger
    const strength = (protein / 13) * (0.3 + 0.7 * kneadT);
    // Tears when stretched beyond the network's strength
    if (windowpaneStretch > strength * 0.85 + 0.1) {
      windowpaneTorn = true;
    }
  }
  // Auto-close after a moment so the user can re-test
  if (windowpaneStretch >= 1 || (windowpaneTorn && windowpaneStretch > 0.6)) {
    // Hold for a beat by clamping at full stretch
  }
}

function drawWindowpane() {
  // Modal overlay across full canvas
  push();
  const overlay = color(0, 0, 0);
  overlay.setAlpha(140);
  noStroke();
  fill(overlay);
  rect(0, 0, canvasWidth, canvasHeight);

  // Window box
  const boxW = min(420, canvasWidth - 60);
  const boxH = 280;
  const bx = (canvasWidth - boxW) / 2;
  const by = (canvasHeight - boxH) / 2;
  fill('#ffffff');
  stroke(COLOR_BORDER);
  strokeWeight(2);
  rect(bx, by, boxW, boxH, 10);

  noStroke();
  fill(COLOR_TITLE);
  textSize(15);
  textStyle(BOLD);
  textAlign(CENTER, TOP);
  text('Windowpane Test', bx + boxW / 2, by + 12);

  // Dough being stretched between two "fingers"
  const stripW = 220 + 80 * windowpaneStretch;
  const stripH = 100 - 30 * windowpaneStretch;
  const sx = bx + boxW / 2 - stripW / 2;
  const sy = by + 90;

  // Hands
  fill('#ffcc80');
  stroke('#bf8f3b');
  strokeWeight(1);
  rect(sx - 24, sy + stripH / 2 - 18, 22, 36, 4);
  rect(sx + stripW + 2, sy + stripH / 2 - 18, 22, 36, 4);

  // Dough sheet
  if (windowpaneTorn) {
    // Two halves
    noStroke();
    fill(COLOR_DOUGH);
    rect(sx, sy, stripW * 0.45, stripH, 8);
    rect(sx + stripW * 0.55, sy, stripW * 0.45, stripH, 8);
    // Jagged tear edges
    stroke(COLOR_RED);
    strokeWeight(2);
    noFill();
    const midX = sx + stripW / 2;
    beginShape();
    for (let i = 0; i <= 6; i++) {
      const yy = sy + (i / 6) * stripH;
      vertex(midX + (i % 2 === 0 ? -6 : 6) - 12, yy);
    }
    endShape();
    beginShape();
    for (let i = 0; i <= 6; i++) {
      const yy = sy + (i / 6) * stripH;
      vertex(midX + (i % 2 === 0 ? 6 : -6) + 12, yy);
    }
    endShape();
  } else {
    // Intact translucent sheet — alpha decreases with stretch (more see-through)
    const sheet = color(COLOR_DOUGH);
    sheet.setAlpha(255 - 130 * windowpaneStretch);
    fill(sheet);
    stroke('#bca77a');
    strokeWeight(1);
    rect(sx, sy, stripW, stripH, 8);
    // Light shading lines to imply translucency
    const line1 = color('#ffffff');
    line1.setAlpha(120 * windowpaneStretch);
    stroke(line1);
    strokeWeight(1);
    for (let i = 0; i < 6; i++) {
      const lx = sx + 10 + i * (stripW / 7);
      line(lx, sy + 6, lx + 10, sy + stripH - 6);
    }
  }

  // Verdict text
  noStroke();
  textAlign(CENTER, TOP);
  textSize(13);
  textStyle(BOLD);
  if (windowpaneTorn) {
    fill(COLOR_RED);
    text('Tore! Network is too weak — needs more protein or more kneading.',
         bx + boxW / 2, by + boxH - 80, boxW - 20, 40);
  } else if (windowpaneStretch > 0.85) {
    fill(COLOR_PRIMARY);
    text('Passed! Stretched to translucency — strong gluten network.',
         bx + boxW / 2, by + boxH - 80, boxW - 20, 40);
  } else {
    fill(COLOR_TEXT);
    textStyle(NORMAL);
    text('Stretching dough into a thin sheet...',
         bx + boxW / 2, by + boxH - 80, boxW - 20, 40);
  }

  // Close instruction
  fill(COLOR_MUTED);
  textSize(11);
  textStyle(NORMAL);
  text('Click anywhere to close', bx + boxW / 2, by + boxH - 24);
  pop();
}

// ----- Mouse interaction -----
function mousePressed() {
  // Close windowpane test overlay
  if (windowpaneActive) {
    windowpaneActive = false;
    windowpaneStretch = 0;
    windowpaneTorn = false;
    return;
  }

  // Click on flour cards
  const cardX = margin + 14;
  const cardW = leftPanelW - 28;
  const cardH = 90;
  const cardGap = 12;
  let y = panelTopY + 38;
  for (let i = 0; i < flours.length; i++) {
    if (mouseX >= cardX && mouseX <= cardX + cardW &&
        mouseY >= y && mouseY <= y + cardH) {
      if (selectedFlourIndex !== i) {
        selectedFlourIndex = i;
        onReset();
      }
      return;
    }
    y += cardH + cardGap;
  }
}
