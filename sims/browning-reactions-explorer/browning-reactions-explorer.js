// Browning Reactions Explorer - Food Science MicroSim
// CANVAS_HEIGHT: 660
// Two side-by-side columns: Maillard (steak) vs. Caramelization (sugar).
// A shared temperature slider (200-400 deg F) drives both columns.
// Aroma popups, color transitions, melanoidin tooltips.

// ----- Layout constants -----
let canvasWidth = 760;
let drawHeight = 600;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 10;
let defaultTextSize = 14;

// Header
let titleY = 22;
let subtitleY = 46;

// Two column layout
let colTopY = 70;
let colHeight = 380;
let colGap = 10;
let colWidth;  // computed in setup

// Summary box
let summaryY;
let summaryH = 100;

// Colors (book palette)
const COLOR_BG       = '#f1f8e9';
const COLOR_PANEL_BG = '#ffffff';
const COLOR_BORDER   = '#bdbdbd';
const COLOR_TITLE    = '#1b5e20';
const COLOR_PRIMARY  = '#2e7d32';
const COLOR_ACCENT   = '#f57c00';
const COLOR_AMINO    = '#1e88e5';  // amino acid blue
const COLOR_SUGAR    = '#fdd835';  // sugar yellow
const COLOR_TEXT     = '#212121';
const COLOR_MUTED    = '#616161';
const COLOR_METAL    = '#9e9e9e';
const COLOR_RED      = '#e53935';
const COLOR_GOLD     = '#fbc02d';

// Aroma label palette
const COLOR_AROMA_MAILLARD = '#6d4c41';
const COLOR_AROMA_CARAMEL  = '#bf360c';

// State
let tempSlider;
let resetButton;
let temperature = 200;

// Animated molecules for Maillard reaction
let maillardMolecules = []; // {type: 'amino'|'sugar'|'brown', x, y, vx, vy, baseX, baseY}
// Animated molecules for Caramelization
let caramelMolecules = [];  // {x, y, baseX, baseY, phase, broken: bool}

// Aroma popups for each column
let maillardAromas = [];    // {label, x, y, alpha, vy}
let caramelAromas = [];
let lastAromaSpawnM = 0;
let lastAromaSpawnC = 0;

// Hover tooltip
let hoverTooltip = null;    // string or null

function updateCanvasSize() {
  const container = document.querySelector('main').parentElement;
  if (container) {
    const w = container.clientWidth;
    if (w && w > 320) {
      canvasWidth = Math.min(w - 20, 900);
    }
  }
  colWidth = Math.floor((canvasWidth - margin * 2 - colGap) / 2);
  summaryY = colTopY + colHeight + 14;
}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Segoe UI');
  textSize(defaultTextSize);

  initMaillardMolecules();
  initCaramelMolecules();

  // Controls
  tempSlider = createSlider(200, 400, 200, 1);
  tempSlider.style('width', '300px');

  resetButton = createButton('Reset');
  resetButton.mousePressed(onReset);

  positionControls();
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  initMaillardMolecules();
  initCaramelMolecules();
  positionControls();
}

function positionControls() {
  const ctrlY = drawHeight + 28;
  tempSlider.position(margin + 90, ctrlY);
  resetButton.position(margin + 410, ctrlY - 2);
}

function onReset() {
  tempSlider.value(200);
  maillardAromas = [];
  caramelAromas = [];
}

function initMaillardMolecules() {
  maillardMolecules = [];
  const cx = margin + colWidth / 2;
  const cy = colTopY + 250;
  // 6 amino acids on left
  for (let i = 0; i < 6; i++) {
    const ang = TWO_PI * (i / 6);
    maillardMolecules.push({
      type: 'amino',
      baseX: cx - 50 + cos(ang) * 25,
      baseY: cy + sin(ang) * 25,
      phase: random(TWO_PI)
    });
  }
  // 6 sugars on right
  for (let i = 0; i < 6; i++) {
    const ang = TWO_PI * (i / 6);
    maillardMolecules.push({
      type: 'sugar',
      baseX: cx + 50 + cos(ang) * 25,
      baseY: cy + sin(ang) * 25,
      phase: random(TWO_PI)
    });
  }
}

function initCaramelMolecules() {
  caramelMolecules = [];
  const cx = margin + colWidth + colGap + colWidth / 2;
  const cy = colTopY + 250;
  // 10 sugar molecules in a tight crystal grid
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 4; col++) {
      caramelMolecules.push({
        baseX: cx - 36 + col * 24,
        baseY: cy - 24 + row * 24,
        phase: random(TWO_PI)
      });
    }
  }
}

function draw() {
  background(COLOR_BG);
  temperature = tempSlider.value();

  drawHeader();
  drawMaillardColumn();
  drawCaramelColumn();
  drawSummary();
  drawControlBackdrop();
  spawnAromas();
  updateAndDrawAromas();
  drawHoverTooltip();
}

function drawHeader() {
  noStroke();
  fill(COLOR_TITLE);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(18);
  text('Browning Reactions: Maillard vs. Caramelization', canvasWidth / 2, titleY);
  textStyle(NORMAL);
  textSize(12);
  fill(COLOR_MUTED);
  text('Slide the temperature below. Hover the brown molecules for a tooltip.',
       canvasWidth / 2, subtitleY);
  textAlign(LEFT, BASELINE);
  textSize(defaultTextSize);
}

// ----- Maillard column (left) -----
function drawMaillardColumn() {
  const px = margin;
  const py = colTopY;
  const pw = colWidth;
  const ph = colHeight;

  // Panel background
  noStroke();
  fill(COLOR_PANEL_BG);
  rect(px, py, pw, ph, 10);
  stroke(COLOR_BORDER);
  strokeWeight(1);
  noFill();
  rect(px, py, pw, ph, 10);

  // Title bar
  noStroke();
  fill(COLOR_PRIMARY);
  rect(px, py, pw, 32, 10, 10, 0, 0);
  fill('#ffffff');
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(15);
  text('Maillard Reaction', px + pw / 2, py + 16);
  textStyle(NORMAL);

  // Subtitle: reactants
  fill(COLOR_MUTED);
  textSize(11);
  text('amino acids + sugars  +  heat', px + pw / 2, py + 46);

  // Pan + steak
  drawPanWithFood(px, py, pw, 'steak');

  // Molecules (under the pan)
  drawMaillardMolecules(px, py, pw);

  // Status label
  drawStatusLabel(px, py, pw, getMaillardStatus(), getMaillardColor());

  textAlign(LEFT, BASELINE);
  textSize(defaultTextSize);
}

function getMaillardStatus() {
  if (temperature < 280) return 'No browning yet';
  if (temperature < 320) return 'Maillard browning underway';
  return 'Deep brown — caramelization also begins now';
}

function getMaillardColor() {
  if (temperature < 280) return COLOR_MUTED;
  if (temperature < 320) return COLOR_ACCENT;
  return '#5d4037';
}

// Returns 0..1 progress through Maillard reaction
function maillardProgress() {
  if (temperature < 280) return 0;
  if (temperature >= 360) return 1;
  return (temperature - 280) / 80;
}

function drawMaillardMolecules(px, py, pw) {
  const p = maillardProgress();
  const cx = px + pw / 2;
  const moleculeAreaY = py + 235;

  // Section label
  noStroke();
  fill(COLOR_MUTED);
  textAlign(CENTER, CENTER);
  textSize(10);
  text('molecules at the surface', cx, py + 205);

  if (p < 0.05) {
    // Separate groups: amino acids cluster + sugar cluster
    for (const m of maillardMolecules) {
      const wob = 1.5;
      const x = m.baseX + sin(frameCount * 0.06 + m.phase) * wob;
      const y = m.baseY + cos(frameCount * 0.06 + m.phase) * wob;
      drawMolecule(x, y, m.type);
    }
    // Plus sign between
    fill(COLOR_TEXT);
    textSize(20);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text('+', cx, moleculeAreaY);
    textStyle(NORMAL);
    textSize(defaultTextSize);
  } else {
    // Transition: amino+sugar combine into brown cluster
    for (const m of maillardMolecules) {
      const tx = cx + (m.type === 'amino' ? -8 : 8) + sin(m.phase) * 6;
      const ty = moleculeAreaY + cos(m.phase * 1.3) * 6;
      const x = lerp(m.baseX, tx, p);
      const y = lerp(m.baseY, ty, p);
      const wob = 1.5 + p * 1.5;
      const dx = sin(frameCount * 0.08 + m.phase) * wob;
      const dy = cos(frameCount * 0.08 + m.phase) * wob;

      if (p < 0.95) {
        drawMolecule(x + dx, y + dy, m.type);
      }
    }
    // Brown melanoidin cluster (more visible as p grows)
    drawMelanoidinCluster(cx, moleculeAreaY, p);
  }

  textAlign(LEFT, BASELINE);
  textSize(defaultTextSize);
}

function drawMolecule(x, y, type) {
  noStroke();
  if (type === 'amino') {
    fill(COLOR_AMINO);
    ellipse(x, y, 11, 11);
    fill('#ffffff');
    textAlign(CENTER, CENTER);
    textSize(7);
    textStyle(BOLD);
    text('A', x, y + 0.5);
    textStyle(NORMAL);
  } else if (type === 'sugar') {
    fill(COLOR_SUGAR);
    ellipse(x, y, 11, 11);
    fill(COLOR_TEXT);
    textAlign(CENTER, CENTER);
    textSize(7);
    textStyle(BOLD);
    text('S', x, y + 0.5);
    textStyle(NORMAL);
  }
}

function drawMelanoidinCluster(cx, cy, p) {
  // Cluster grows with p; color deepens from tan to dark brown
  const clusterColor = lerpColor(color('#a1887f'), color('#3e2723'), p);
  const baseRadius = 18 + p * 14;
  // Several overlapping blobs
  noStroke();
  const seed = floor(frameCount * 0.02);
  for (let i = 0; i < 7; i++) {
    const ang = (i / 7) * TWO_PI + sin(seed * 0.1 + i) * 0.3;
    const r = baseRadius * 0.7;
    const bx = cx + cos(ang) * r * 0.6;
    const by = cy + sin(ang) * r * 0.45;
    const c = color(red(clusterColor), green(clusterColor), blue(clusterColor));
    c.setAlpha(180);
    fill(c);
    ellipse(bx, by, baseRadius, baseRadius * 0.8);
  }
  // Core
  fill(clusterColor);
  ellipse(cx, cy, baseRadius * 0.9, baseRadius * 0.7);
}

// ----- Caramelization column (right) -----
function drawCaramelColumn() {
  const px = margin + colWidth + colGap;
  const py = colTopY;
  const pw = colWidth;
  const ph = colHeight;

  // Panel
  noStroke();
  fill(COLOR_PANEL_BG);
  rect(px, py, pw, ph, 10);
  stroke(COLOR_BORDER);
  strokeWeight(1);
  noFill();
  rect(px, py, pw, ph, 10);

  // Title bar
  noStroke();
  fill(COLOR_ACCENT);
  rect(px, py, pw, 32, 10, 10, 0, 0);
  fill('#ffffff');
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(15);
  text('Caramelization', px + pw / 2, py + 16);
  textStyle(NORMAL);

  // Subtitle
  fill(COLOR_MUTED);
  textSize(11);
  text('sugars only  +  heat', px + pw / 2, py + 46);

  // Pan + sugar
  drawPanWithFood(px, py, pw, 'sugar');

  // Molecules
  drawCaramelMolecules(px, py, pw);

  // Status label
  drawStatusLabel(px, py, pw, getCaramelStatus(), getCaramelStatusColor());

  textAlign(LEFT, BASELINE);
  textSize(defaultTextSize);
}

function getCaramelStatus() {
  if (temperature < 320) return 'Crystals stable';
  if (temperature < 350) return 'Golden caramel forming';
  if (temperature < 380) return 'Amber caramel';
  return 'Dark caramel — close to burning';
}

function getCaramelStatusColor() {
  if (temperature < 320) return COLOR_MUTED;
  return COLOR_ACCENT;
}

// Returns 0..1 progress through caramelization (starts at 320 F)
function caramelProgress() {
  if (temperature < 320) return 0;
  if (temperature >= 400) return 1;
  return (temperature - 320) / 80;
}

function drawCaramelMolecules(px, py, pw) {
  const p = caramelProgress();
  const cx = px + pw / 2;
  const moleculeAreaY = py + 235;

  noStroke();
  fill(COLOR_MUTED);
  textAlign(CENTER, CENTER);
  textSize(10);
  text('sugar molecules', cx, py + 205);

  if (p < 0.05) {
    // Tight crystal grid
    for (const m of caramelMolecules) {
      const wob = 0.8;
      const x = m.baseX + sin(frameCount * 0.04 + m.phase) * wob;
      const y = m.baseY + cos(frameCount * 0.04 + m.phase) * wob;
      drawMolecule(x, y, 'sugar');
    }
  } else {
    // Molecules break apart and recombine
    for (const m of caramelMolecules) {
      const spreadX = sin(m.phase * 2.3) * 30;
      const spreadY = cos(m.phase * 1.7) * 18;
      const tx = cx + spreadX;
      const ty = moleculeAreaY + spreadY;
      const x = lerp(m.baseX, tx, p);
      const y = lerp(m.baseY, ty, p);
      const wob = 1.5 + p * 2;
      const dx = sin(frameCount * 0.1 + m.phase) * wob;
      const dy = cos(frameCount * 0.1 + m.phase) * wob;

      if (p < 0.9) {
        drawMolecule(x + dx, y + dy, 'sugar');
      }
    }
    // Caramel pool color shifts: clear -> golden -> amber -> dark brown
    drawCaramelPool(cx, moleculeAreaY, p);
  }

  textAlign(LEFT, BASELINE);
  textSize(defaultTextSize);
}

function drawCaramelPool(cx, cy, p) {
  // Color interpolation across 3 stops
  let poolColor;
  if (p < 0.33) {
    poolColor = lerpColor(color('#fff9c4'), color('#ffc107'), p / 0.33);
  } else if (p < 0.66) {
    poolColor = lerpColor(color('#ffc107'), color('#bf360c'), (p - 0.33) / 0.33);
  } else {
    poolColor = lerpColor(color('#bf360c'), color('#3e2723'), (p - 0.66) / 0.34);
  }
  noStroke();
  const c = color(red(poolColor), green(poolColor), blue(poolColor));
  c.setAlpha(220);
  fill(c);
  const w = 50 + p * 16;
  const h = 16 + p * 10;
  ellipse(cx, cy, w, h);
  // Glossy highlight
  const hi = color(255);
  hi.setAlpha(110 - p * 80);
  fill(hi);
  ellipse(cx - w * 0.18, cy - h * 0.18, w * 0.35, h * 0.3);
}

// ----- Shared pan drawing -----
function drawPanWithFood(px, py, pw, food) {
  const burnerY = py + 175;
  const panLeft = px + 30;
  const panRight = px + pw - 30;
  const panW = panRight - panLeft;

  // Burner glow (intensifies with temperature, clipped to under-pan area)
  const tNorm = constrain((temperature - 200) / 200, 0, 1);
  for (let i = 0; i < 3; i++) {
    const c = color(COLOR_ACCENT);
    c.setAlpha((50 + tNorm * 70) - i * 18);
    fill(c);
    noStroke();
    ellipse(px + pw / 2, burnerY + 14, panW - 10 + i * 8, 12 + i * 4);
  }
  // Burner element
  stroke(lerpColor(color('#bf360c'), color(COLOR_RED), tNorm));
  strokeWeight(4);
  line(panLeft + 5, burnerY + 14, panRight - 5, burnerY + 14);

  // Pan body
  noStroke();
  fill(COLOR_METAL);
  rect(panLeft, py + 110, panW, 60, 4);
  // pan handle (right side)
  fill('#616161');
  rect(panRight - 2, py + 128, 18, 12, 3);

  // Food on top of pan
  const foodCX = px + pw / 2;
  const foodY = py + 110;

  if (food === 'steak') {
    drawSteak(foodCX, foodY, panW - 24);
  } else if (food === 'sugar') {
    drawSugarCrystals(foodCX, foodY, panW - 24);
  }

  // Temperature readout above pan
  noStroke();
  fill(COLOR_TEXT);
  textAlign(CENTER, BOTTOM);
  textSize(12);
  text(`${temperature} °F`, px + pw / 2, py + 100);
  textAlign(LEFT, BASELINE);
}

function drawSteak(cx, topY, maxW) {
  // Color interpolation: pale pink -> brown -> dark brown
  const p = maillardProgress();
  let steakColor;
  if (p < 0.5) {
    steakColor = lerpColor(color('#f48fb1'), color('#a1887f'), p / 0.5);
  } else {
    steakColor = lerpColor(color('#a1887f'), color('#3e2723'), (p - 0.5) / 0.5);
  }
  // Steak sits ON the pan surface (topY is pan top)
  const steakCY = topY + 14;
  const w = min(maxW, 110);
  const h = 26;
  // Drop shadow under steak (gives it weight on the pan)
  noStroke();
  const sh = color(0);
  sh.setAlpha(60);
  fill(sh);
  ellipse(cx + 2, steakCY + 3, w, h);
  // Steak body
  fill(steakColor);
  stroke('#3e2723');
  strokeWeight(1);
  ellipse(cx, steakCY, w, h);
  // Sear marks (appear at higher temps)
  if (p > 0.3) {
    const sear = color('#3e2723');
    sear.setAlpha(80 + p * 120);
    stroke(sear);
    strokeWeight(2);
    for (let i = -1; i <= 1; i++) {
      const sx = cx + i * 18;
      line(sx - 8, steakCY, sx + 8, steakCY);
    }
  }
  noStroke();
}

function drawSugarCrystals(cx, topY, maxW) {
  const p = caramelProgress();
  // Sit on pan surface
  const surfY = topY + 14;
  if (p < 0.05) {
    // Sugar pile mound — light cream colored heap with darker outline
    const w = min(maxW, 90);
    // Mound base
    noStroke();
    const sh = color(0);
    sh.setAlpha(50);
    fill(sh);
    ellipse(cx + 2, surfY + 5, w, 14);
    fill('#fff8e1');
    stroke('#bdbdbd');
    strokeWeight(1);
    ellipse(cx, surfY, w, 18);
    // Individual crystal cubes on top
    noStroke();
    fill('#ffffff');
    stroke('#9e9e9e');
    strokeWeight(0.6);
    for (let i = 0; i < 9; i++) {
      const col = i % 5;
      const row = floor(i / 5);
      const x = cx + (col - 2) * 9;
      const y = surfY - 4 - row * 5;
      rect(x - 3, y - 3, 6, 6);
    }
  } else {
    // Caramel puddle on pan
    let pc;
    if (p < 0.33) {
      pc = lerpColor(color('#fff9c4'), color('#ffc107'), p / 0.33);
    } else if (p < 0.66) {
      pc = lerpColor(color('#ffc107'), color('#bf360c'), (p - 0.33) / 0.33);
    } else {
      pc = lerpColor(color('#bf360c'), color('#3e2723'), (p - 0.66) / 0.34);
    }
    // shadow
    noStroke();
    const sh = color(0);
    sh.setAlpha(60);
    fill(sh);
    const w = min(maxW, 100);
    ellipse(cx + 2, surfY + 4, w, 16);
    // puddle
    fill(pc);
    stroke('#3e2723');
    strokeWeight(1);
    ellipse(cx, surfY, w, 16);
    // gloss
    noStroke();
    const hi = color(255);
    hi.setAlpha(120 - p * 90);
    fill(hi);
    ellipse(cx - w * 0.2, surfY - 3, w * 0.35, 5);
  }
  noStroke();
}

// ----- Status label -----
function drawStatusLabel(px, py, pw, label, col) {
  noStroke();
  // Background pill
  const padX = 10;
  textSize(12);
  textStyle(BOLD);
  const tw = textWidth(label) + padX * 2;
  const bx = px + pw / 2 - tw / 2;
  const by = py + 320;
  fill('#fafafa');
  stroke(col);
  strokeWeight(1.5);
  rect(bx, by, tw, 22, 11);
  noStroke();
  fill(col);
  textAlign(CENTER, CENTER);
  text(label, px + pw / 2, by + 12);
  textStyle(NORMAL);
  textSize(defaultTextSize);
  textAlign(LEFT, BASELINE);
}

// ----- Summary box -----
function drawSummary() {
  const x = margin;
  const y = summaryY;
  const w = canvasWidth - margin * 2;
  const h = summaryH;

  noStroke();
  fill('#ffffff');
  rect(x, y, w, h, 8);
  stroke(COLOR_PRIMARY);
  strokeWeight(2);
  noFill();
  rect(x, y, w, h, 8);

  noStroke();
  fill(COLOR_TITLE);
  textStyle(BOLD);
  textSize(13);
  textAlign(LEFT, TOP);
  text('Key difference', x + 12, y + 8);
  textStyle(NORMAL);

  // Two side-by-side recipe boxes
  const halfW = (w - 36) / 2;
  // Left: Maillard
  fill('#e8f5e9');
  rect(x + 12, y + 30, halfW, h - 42, 6);
  fill(COLOR_PRIMARY);
  textStyle(BOLD);
  textSize(12);
  text('Maillard', x + 22, y + 36);
  textStyle(NORMAL);
  fill(COLOR_TEXT);
  textSize(12);
  text('amino acids  +  sugars  +  heat', x + 22, y + 54);
  fill(COLOR_MUTED);
  textSize(11);
  text('starts ~280°F · hundreds of compounds', x + 22, y + 72);

  // Right: Caramelization
  fill('#fff3e0');
  rect(x + 24 + halfW, y + 30, halfW, h - 42, 6);
  fill(COLOR_ACCENT);
  textStyle(BOLD);
  textSize(12);
  text('Caramelization', x + 34 + halfW, y + 36);
  textStyle(NORMAL);
  fill(COLOR_TEXT);
  textSize(12);
  text('sugars only  +  heat', x + 34 + halfW, y + 54);
  fill(COLOR_MUTED);
  textSize(11);
  text('starts ~320°F · fewer compounds', x + 34 + halfW, y + 72);

  textAlign(LEFT, BASELINE);
  textSize(defaultTextSize);
}

// ----- Aroma popups -----
function spawnAromas() {
  // Maillard aromas spawn when reaction is active
  if (maillardProgress() > 0.1 && frameCount - lastAromaSpawnM > 70) {
    const aromas = ['nutty', 'savory', 'bready', 'roasted'];
    const label = random(aromas);
    const cx = margin + colWidth / 2 + random(-40, 40);
    maillardAromas.push({
      label: label,
      x: cx,
      y: colTopY + 130,
      alpha: 220,
      vy: -0.5
    });
    lastAromaSpawnM = frameCount;
  }
  // Caramelization aromas
  if (caramelProgress() > 0.1 && frameCount - lastAromaSpawnC > 70) {
    const aromas = ['butterscotch', 'nutty', 'slightly bitter', 'toffee'];
    const label = random(aromas);
    const cx = margin + colWidth + colGap + colWidth / 2 + random(-40, 40);
    caramelAromas.push({
      label: label,
      x: cx,
      y: colTopY + 130,
      alpha: 220,
      vy: -0.5
    });
    lastAromaSpawnC = frameCount;
  }
}

function updateAndDrawAromas() {
  drawAromaList(maillardAromas, COLOR_AROMA_MAILLARD);
  drawAromaList(caramelAromas, COLOR_AROMA_CARAMEL);
}

function drawAromaList(list, textColor) {
  for (let i = list.length - 1; i >= 0; i--) {
    const a = list[i];
    a.y += a.vy;
    a.alpha -= 1.6;
    if (a.alpha <= 0) {
      list.splice(i, 1);
      continue;
    }
    noStroke();
    textSize(12);
    textStyle(ITALIC);
    textAlign(CENTER, CENTER);
    // background bubble
    const tw = textWidth(a.label) + 14;
    const bg = color(255);
    bg.setAlpha(constrain(a.alpha, 0, 220));
    fill(bg);
    stroke(textColor);
    strokeWeight(1);
    rect(a.x - tw / 2, a.y - 9, tw, 18, 9);
    noStroke();
    const tc = color(red(color(textColor)), green(color(textColor)), blue(color(textColor)));
    tc.setAlpha(constrain(a.alpha, 0, 255));
    fill(tc);
    text(a.label, a.x, a.y + 0.5);
    textStyle(NORMAL);
  }
  textAlign(LEFT, BASELINE);
  textSize(defaultTextSize);
}

// ----- Controls backdrop -----
function drawControlBackdrop() {
  noStroke();
  fill('#e8f5e9');
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke(COLOR_BORDER);
  strokeWeight(1);
  line(0, drawHeight, canvasWidth, drawHeight);
  noStroke();
  // Slider label
  fill(COLOR_TITLE);
  textStyle(BOLD);
  textSize(13);
  textAlign(LEFT, CENTER);
  text('Temperature:', margin + 10, drawHeight + 42);
  // Current value
  textStyle(NORMAL);
  fill(COLOR_TEXT);
  textSize(13);
  textAlign(LEFT, CENTER);
  text(`${temperature} °F`, margin + 410 + 70, drawHeight + 42);

  // Tick labels under slider
  fill(COLOR_MUTED);
  textSize(10);
  textAlign(CENTER, TOP);
  text('200°F (cool)', margin + 90, drawHeight + 56);
  text('280° Maillard', margin + 90 + 120, drawHeight + 56);
  text('320° Caramel', margin + 90 + 180, drawHeight + 56);
  text('400°F (hot)', margin + 90 + 300, drawHeight + 56);

  textAlign(LEFT, BASELINE);
  textSize(defaultTextSize);
}

// ----- Hover tooltip -----
function drawHoverTooltip() {
  hoverTooltip = null;
  // Check Maillard melanoidin cluster
  const mCx = margin + colWidth / 2;
  const mCy = colTopY + 235;
  if (maillardProgress() > 0.1 && dist(mouseX, mouseY, mCx, mCy) < 28) {
    hoverTooltip = 'These are called melanoidins — hundreds of different aromatic compounds formed at once.';
  }
  // Check Caramelization pool
  const cCx = margin + colWidth + colGap + colWidth / 2;
  const cCy = colTopY + 235;
  if (caramelProgress() > 0.1 && dist(mouseX, mouseY, cCx, cCy) < 28) {
    hoverTooltip = 'Caramelization produces fewer compounds than Maillard but creates distinctive sweet-bitter notes.';
  }
  // Also tooltip on the steak/sugar food
  if (maillardProgress() > 0 && insideRect(mouseX, mouseY, margin + 30, colTopY + 95, colWidth - 60, 30)) {
    if (!hoverTooltip) hoverTooltip = 'Steak surface: amino acids in protein meet residual sugars and brown via the Maillard reaction.';
  }
  if (caramelProgress() > 0 && insideRect(mouseX, mouseY, margin + colWidth + colGap + 30, colTopY + 95, colWidth - 60, 30)) {
    if (!hoverTooltip) hoverTooltip = 'Sugar breaks down on direct heat — water leaves and new caramel molecules form.';
  }

  if (!hoverTooltip) return;

  const lines = wrapText(hoverTooltip, 240);
  const lineH = 16;
  const padding = 8;
  const w = 260;
  const h = lines.length * lineH + padding * 2;
  let x = mouseX + 12;
  let y = mouseY + 12;
  if (x + w > canvasWidth - 5) x = canvasWidth - w - 5;
  if (y + h > drawHeight - 5)  y = drawHeight - h - 5;
  if (x < 5) x = 5;
  if (y < 5) y = 5;

  const shadow = color(0);
  shadow.setAlpha(40);
  fill(shadow);
  noStroke();
  rect(x + 3, y + 3, w, h, 8);

  fill('#fffde7');
  stroke(COLOR_GOLD);
  strokeWeight(2);
  rect(x, y, w, h, 8);

  noStroke();
  fill(COLOR_TEXT);
  textAlign(LEFT, TOP);
  textSize(12);
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], x + padding, y + padding + i * lineH);
  }
  textAlign(LEFT, BASELINE);
  textSize(defaultTextSize);
}

function wrapText(str, maxW) {
  const words = str.split(' ');
  const lines = [];
  let line = '';
  textSize(12);
  for (const w of words) {
    const test = line.length ? line + ' ' + w : w;
    if (textWidth(test) > maxW) {
      if (line) lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function insideRect(mx, my, x, y, w, h) {
  return mx >= x && mx <= x + w && my >= y && my <= y + h;
}
