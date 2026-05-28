// Microwave vs Conventional Oven Heat - Food Science MicroSim
// CANVAS_HEIGHT: 620
// Two side-by-side cross-sections of a potato. Press Start Cooking and watch
// the conventional oven heat travel inward from the edge while the microwave
// heats the whole potato roughly uniformly (with small cool spots where
// water content is lower). Click any spot to read the simulated temperature.

// ----- Layout constants -----
let canvasWidth = 760;
let drawHeight = 540;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 10;
let defaultTextSize = 14;

// Top header
let titleY = 22;
let legendY = 46;
let timeY = 78;

// Panels
let panelTopY = 100;
let panelHeight = 350;
let panelGap = 10;
let panelWidth;        // computed in setup
let potatoRadius = 100;

// Explanation box below panels
let explanationY;      // computed in setup
let explanationH = 80;

// ----- Colors (book palette) -----
const COLOR_BG       = '#f1f8e9';
const COLOR_PANEL_BG = '#ffffff';
const COLOR_BORDER   = '#bdbdbd';
const COLOR_TITLE    = '#1b5e20';
const COLOR_PRIMARY  = '#2e7d32';
const COLOR_ACCENT   = '#f57c00';
const COLOR_TEXT     = '#212121';
const COLOR_MUTED    = '#616161';
const COLOR_POTATO_SKIN = '#8d6e63';

// Temperature color stops (Fahrenheit)
//   40  -> blue
//  100  -> green
//  150  -> yellow
//  180  -> orange
//  200+ -> red
const TEMP_STOPS = [
  { t:  40, c: [ 30, 136, 229] },  // blue
  { t: 100, c: [ 67, 160,  71] },  // green
  { t: 150, c: [253, 216,  53] },  // yellow
  { t: 180, c: [251, 140,   0] },  // orange
  { t: 220, c: [229,  57,  53] }   // red
];

// ----- Simulation state -----
const MAX_TIME_SEC = 300;     // 5:00
const TIME_SCALE   = 12;      // 1 real second = 12 simulated seconds (~25s real = full run)
let simTimeSec = 0;
let isRunning = false;
let lastFrameMs = 0;

// Grid samples per panel (rectangular grid, masked to the circle)
const GRID = 26;

// Microwave cool-spot field (small random pockets of lower water content)
// Each spot: {nx, ny, r} in normalized coords [-1,1]
let coolSpots = [];

// Click readout
let activeReadout = null;     // {panel:'oven'|'microwave', x, y, tempF, expl}

// UI
let startButton;
let pauseButton;
let resetButton;

function updateCanvasSize() {
  const container = document.querySelector('main').parentElement;
  if (container) {
    const w = container.clientWidth;
    if (w && w > 320) {
      canvasWidth = Math.min(w - 20, 900);
    }
  }
  panelWidth = Math.floor((canvasWidth - margin * 2 - panelGap) / 2);
  // Keep potato radius proportional but not larger than panel allows
  potatoRadius = Math.min(100, Math.floor(panelWidth * 0.28));
  explanationY = panelTopY + panelHeight + 8;
}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Segoe UI');
  textSize(defaultTextSize);

  buildCoolSpots();

  startButton = createButton('Start Cooking');
  startButton.mousePressed(onStart);

  pauseButton = createButton('Pause');
  pauseButton.mousePressed(onPause);

  resetButton = createButton('Reset');
  resetButton.mousePressed(onReset);

  positionControls();
  lastFrameMs = millis();
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function positionControls() {
  const ctrlY = drawHeight + 24;
  startButton.position(margin + 10, ctrlY);
  pauseButton.position(margin + 130, ctrlY);
  resetButton.position(margin + 210, ctrlY);
}

function buildCoolSpots() {
  coolSpots = [];
  // 5-7 small low-water pockets at random positions inside the disk
  const n = 6;
  for (let i = 0; i < n; i++) {
    let nx, ny;
    do {
      nx = random(-0.85, 0.85);
      ny = random(-0.85, 0.85);
    } while (nx * nx + ny * ny > 0.72);
    coolSpots.push({ nx, ny, r: random(0.18, 0.28) });
  }
}

function onStart() {
  if (simTimeSec >= MAX_TIME_SEC) return;
  isRunning = true;
  lastFrameMs = millis();
}

function onPause() {
  isRunning = false;
}

function onReset() {
  isRunning = false;
  simTimeSec = 0;
  activeReadout = null;
  buildCoolSpots();
}

// ---------- Heat models ----------

// Oven model: heat is conducted inward from the edge.
// At t=0  -> uniform 70 F.
// At edge -> rises toward 220 F by t=60s.
// Center  -> stays near 70 F until late; at t=300s the heat front has reached
//            only ~30% of the radius (outer 30% red, inner blue).
//
// rNorm = distance from center / potatoRadius   (0 at center, 1 at edge)
function ovenTempAtNorm(rNorm, tSec) {
  // Special case: at t=0 the whole potato is uniform room temperature.
  if (tSec <= 0.01) return 70;

  // Edge surface temp climbs quickly toward oven temp.
  const edgeTemp = lerp(70, 220, Math.min(1, tSec / 60));
  // Heat penetration depth: front advances inward from r=1 toward r=0.
  // At t=300s the front sits at r = 0.7 (so outer 30% is hot).
  const frontR = Math.max(0.0, 1.0 - (tSec / 300) * 0.30);
  // For r >= frontR (outer shell): smooth gradient from front (cool) to edge (hot).
  // For r <  frontR (inner core): essentially still room temp.
  let T;
  if (rNorm >= frontR) {
    // 0 at front, 1 at edge
    const k = (rNorm - frontR) / Math.max(0.001, 1 - frontR);
    T = lerp(70, edgeTemp, k);
  } else {
    // Inner core stays at room temperature.
    T = 70;
  }
  return T;
}

// Microwave model: water molecules vibrate everywhere at once.
// Whole potato warms roughly uniformly. By t=30s, all of it is "warm".
// By t=120s, fully heated (~190 F). Small cool spots persist where water
// content is lower (their interior stays cooler).
function microwaveTempAtNorm(nx, ny, tSec) {
  // Base uniform temperature ramp: 70 -> ~195 F over 120 seconds
  let base;
  if (tSec <= 30) {
    base = lerp(70, 140, tSec / 30);
  } else if (tSec <= 120) {
    base = lerp(140, 195, (tSec - 30) / 90);
  } else {
    // After fully heated, slow creep up toward ~205
    base = lerp(195, 205, Math.min(1, (tSec - 120) / 180));
  }
  // Subtract influence of any cool spot we're inside. Cool spots only become
  // visible as the rest of the potato heats up (they're regions of *lower*
  // water content, so they lag behind — they're not actively cold).
  // Scale the dip by how much the base has risen above room temperature.
  const heatRise = Math.max(0, base - 70);
  const coolScale = Math.min(1, heatRise / 80); // full effect once base > 150F
  let coolDelta = 0;
  for (const s of coolSpots) {
    const dx = nx - s.nx;
    const dy = ny - s.ny;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d < s.r) {
      // Gaussian-ish dip; strongest at center of spot
      const k = 1 - (d / s.r);
      coolDelta += k * 35 * coolScale; // up to ~35 F cooler once warm
    }
  }
  // Tiny edge cooling (microwaves also lose some heat to surface air)
  // negligible for visual purposes
  return Math.max(60, base - coolDelta);
}

// ---------- Color mapping ----------
function tempToColor(tempF) {
  if (tempF <= TEMP_STOPS[0].t) return color(...TEMP_STOPS[0].c);
  if (tempF >= TEMP_STOPS[TEMP_STOPS.length - 1].t)
    return color(...TEMP_STOPS[TEMP_STOPS.length - 1].c);
  for (let i = 0; i < TEMP_STOPS.length - 1; i++) {
    const a = TEMP_STOPS[i];
    const b = TEMP_STOPS[i + 1];
    if (tempF >= a.t && tempF <= b.t) {
      const k = (tempF - a.t) / (b.t - a.t);
      const r = lerp(a.c[0], b.c[0], k);
      const g = lerp(a.c[1], b.c[1], k);
      const bl = lerp(a.c[2], b.c[2], k);
      return color(r, g, bl);
    }
  }
  return color(150);
}

// ---------- Update / draw ----------
function draw() {
  background(COLOR_BG);

  // Advance time
  const nowMs = millis();
  const dtMs = nowMs - lastFrameMs;
  lastFrameMs = nowMs;
  if (isRunning) {
    simTimeSec += (dtMs / 1000) * TIME_SCALE;
    if (simTimeSec >= MAX_TIME_SEC) {
      simTimeSec = MAX_TIME_SEC;
      isRunning = false;
    }
  }

  drawHeader();
  drawLegend();
  drawTimeDisplay();

  // Two panels
  const xL = margin;
  const xR = margin + panelWidth + panelGap;
  drawPanel(xL, panelTopY, panelWidth, panelHeight, 'Conventional Oven',
            'Heat conducts inward from the hot air outside.', 'oven');
  drawPanel(xR, panelTopY, panelWidth, panelHeight, 'Microwave',
            'Microwaves vibrate water molecules throughout the food.', 'microwave');

  drawExplanationOrReadout();
  drawControlsBg();
}

function drawHeader() {
  noStroke();
  fill(COLOR_TITLE);
  textSize(18);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text('Microwave vs. Conventional Oven Heating', margin + 6, 8);
  textStyle(NORMAL);
  textSize(defaultTextSize);
}

function drawLegend() {
  // Color bar with temp labels
  const barX = margin + 6;
  const barY = legendY;
  const barW = canvasWidth - margin * 2 - 12;
  const barH = 12;
  // Build gradient by stepping
  noStroke();
  const steps = 80;
  for (let i = 0; i < steps; i++) {
    const t = lerp(40, 220, i / (steps - 1));
    fill(tempToColor(t));
    const x = barX + (barW * i) / steps;
    const w = barW / steps + 1;
    rect(x, barY, w, barH);
  }
  stroke(COLOR_BORDER);
  noFill();
  rect(barX, barY, barW, barH);
  // Tick labels
  noStroke();
  fill(COLOR_TEXT);
  textSize(11);
  textAlign(CENTER, TOP);
  const labels = [
    { t:  40, s:  '40°F'  },
    { t: 100, s: '100°F'  },
    { t: 150, s: '150°F'  },
    { t: 180, s: '180°F'  },
    { t: 220, s: '200°F+' }
  ];
  for (const L of labels) {
    const k = (L.t - 40) / (220 - 40);
    const x = barX + k * barW;
    text(L.s, x, barY + barH + 2);
  }
  textSize(defaultTextSize);
}

function drawTimeDisplay() {
  noStroke();
  fill(COLOR_MUTED);
  textAlign(LEFT, TOP);
  textSize(12);
  text('Time (shared)', margin + 6, timeY - 2);
  // Mono-ish time
  fill(COLOR_TITLE);
  textStyle(BOLD);
  textSize(18);
  textAlign(RIGHT, TOP);
  const mm = Math.floor(simTimeSec / 60);
  const ss = Math.floor(simTimeSec % 60);
  const tStr = mm + ':' + (ss < 10 ? '0' + ss : ss);
  text(tStr + ' / 5:00', canvasWidth - margin - 6, timeY - 6);
  textStyle(NORMAL);
  textSize(defaultTextSize);

  // Progress bar
  const barX = margin + 6;
  const barY = timeY + 16;
  const barW = canvasWidth - margin * 2 - 12;
  const barH = 6;
  noStroke();
  fill(225);
  rect(barX, barY, barW, barH, 3);
  fill(COLOR_PRIMARY);
  rect(barX, barY, barW * (simTimeSec / MAX_TIME_SEC), barH, 3);
}

function drawPanel(x, y, w, h, title, subtitle, kind) {
  // Panel background and border
  stroke(COLOR_BORDER);
  fill(COLOR_PANEL_BG);
  rect(x, y, w, h, 6);

  // Title bar
  noStroke();
  fill(COLOR_PRIMARY);
  rect(x, y, w, 28, 6, 6, 0, 0);
  fill(255);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(14);
  text(title, x + w / 2, y + 14);
  textStyle(NORMAL);

  // Subtitle
  fill(COLOR_MUTED);
  textAlign(CENTER, TOP);
  textSize(11);
  text(subtitle, x + w / 2, y + 32);
  textSize(defaultTextSize);

  // Potato region
  const cx = x + w / 2;
  const cy = y + 60 + potatoRadius;

  drawPotato(cx, cy, potatoRadius, kind);

  // Label for current "snapshot" beneath potato
  noStroke();
  fill(COLOR_MUTED);
  textAlign(CENTER, TOP);
  textSize(11);
  const labelY = cy + potatoRadius + 14;
  text(panelLabel(kind), x + 12, labelY, w - 24, 40);
  textSize(defaultTextSize);
}

function panelLabel(kind) {
  if (kind === 'oven') {
    if (simTimeSec < 1) return 'Cold potato. Oven air is hot, the inside is still 70°F.';
    if (simTimeSec < 60) return 'A thin hot ring is forming on the outer skin.';
    if (simTimeSec < 180) return 'Heat is creeping inward, slowly. The center is still cool.';
    return 'After 5 minutes, only the outer ~30% is hot. The center is still cool.';
  } else {
    if (simTimeSec < 1) return 'Cold potato. Microwave is off.';
    if (simTimeSec < 30) return 'Water molecules everywhere start vibrating — the whole inside warms up at once.';
    if (simTimeSec < 120) return 'Almost fully heated through. Cool spots remain where water content is lower.';
    return 'Fully heated throughout. Cool spots persist in low-water regions.';
  }
}

function drawPotato(cx, cy, R, kind) {
  // Draw potato body with a heat-colored grid clipped to a circle.
  // We use small squares; for each cell we compute its temperature and color.
  const cellSize = Math.max(4, Math.floor((R * 2) / GRID));
  const halfGrid = Math.floor(GRID / 2);

  noStroke();
  for (let gx = -halfGrid; gx <= halfGrid; gx++) {
    for (let gy = -halfGrid; gy <= halfGrid; gy++) {
      // Sample point at cell center, in normalized [-1,1]
      const nx = gx / halfGrid;
      const ny = gy / halfGrid;
      const rNorm = Math.sqrt(nx * nx + ny * ny);
      if (rNorm > 1.0) continue;

      let T;
      if (kind === 'oven') {
        T = ovenTempAtNorm(rNorm, simTimeSec);
      } else {
        T = microwaveTempAtNorm(nx, ny, simTimeSec);
      }
      fill(tempToColor(T));
      const px = cx + nx * R - cellSize / 2;
      const py = cy + ny * R - cellSize / 2;
      // +1 to avoid sub-pixel seams between adjacent cells
      rect(px, py, cellSize + 1, cellSize + 1);
    }
  }

  // Potato skin outline (slightly inset darker ring for the skin)
  noFill();
  stroke(COLOR_POTATO_SKIN);
  strokeWeight(3);
  ellipse(cx, cy, R * 2, R * 2);
  strokeWeight(1);

  // Click readout marker for this panel
  if (activeReadout && activeReadout.panel === kind) {
    const mx = cx + activeReadout.nx * R;
    const my = cy + activeReadout.ny * R;
    noFill();
    stroke(0);
    strokeWeight(2);
    ellipse(mx, my, 14, 14);
    stroke(255);
    strokeWeight(1);
    ellipse(mx, my, 10, 10);
    strokeWeight(1);
  }
  noStroke();
}

function drawExplanationOrReadout() {
  // Box below the panels: either default hint, or click readout
  const x = margin;
  const y = explanationY;
  const w = canvasWidth - margin * 2;
  const h = explanationH;

  stroke(COLOR_BORDER);
  fill(COLOR_PANEL_BG);
  rect(x, y, w, h, 6);

  noStroke();
  textAlign(LEFT, TOP);
  if (activeReadout) {
    // Header
    fill(COLOR_TITLE);
    textStyle(BOLD);
    textSize(13);
    const where = activeReadout.panel === 'oven' ? 'Oven panel' : 'Microwave panel';
    const tempStr = Math.round(activeReadout.tempF) + '°F';
    text(where + ' — reading: ' + tempStr + ' at t = ' + formatTime(simTimeSec),
         x + 10, y + 8);
    textStyle(NORMAL);
    fill(COLOR_TEXT);
    textSize(13);
    text(activeReadout.expl, x + 10, y + 30, w - 20, h - 36);
  } else {
    fill(COLOR_TITLE);
    textStyle(BOLD);
    textSize(13);
    text('Tip', x + 10, y + 8);
    textStyle(NORMAL);
    fill(COLOR_TEXT);
    textSize(13);
    text('Press Start Cooking, then click anywhere on either potato to read the simulated temperature and learn why that spot is hot or cool.',
         x + 10, y + 30, w - 20, h - 36);
  }
  textSize(defaultTextSize);
}

function drawControlsBg() {
  // Light strip behind the buttons so they read clearly
  noStroke();
  fill(245);
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke(COLOR_BORDER);
  line(0, drawHeight, canvasWidth, drawHeight);
  noStroke();
  fill(COLOR_MUTED);
  textAlign(LEFT, TOP);
  textSize(11);
  text('Both panels share the same simulation clock.',
       margin + 290, drawHeight + 30);
  textSize(defaultTextSize);
}

function formatTime(sec) {
  const mm = Math.floor(sec / 60);
  const ss = Math.floor(sec % 60);
  return mm + ':' + (ss < 10 ? '0' + ss : ss);
}

// ---------- Interaction ----------
function mousePressed() {
  // Ignore clicks in the control strip
  if (mouseY >= drawHeight) return;

  // Determine which panel (if any) was clicked
  const xL = margin;
  const xR = margin + panelWidth + panelGap;
  const cxL = xL + panelWidth / 2;
  const cxR = xR + panelWidth / 2;
  const cy  = panelTopY + 60 + potatoRadius;

  let panel = null, cx = 0;
  if (mouseX >= xL && mouseX <= xL + panelWidth) {
    panel = 'oven';
    cx = cxL;
  } else if (mouseX >= xR && mouseX <= xR + panelWidth) {
    panel = 'microwave';
    cx = cxR;
  } else {
    return;
  }

  // Convert to normalized potato coords
  const dx = mouseX - cx;
  const dy = mouseY - cy;
  const r = Math.sqrt(dx * dx + dy * dy);
  if (r > potatoRadius) {
    // Clicked outside the potato — clear readout
    activeReadout = null;
    return;
  }
  const nx = dx / potatoRadius;
  const ny = dy / potatoRadius;
  const rNorm = r / potatoRadius;

  let tempF, expl;
  if (panel === 'oven') {
    tempF = ovenTempAtNorm(rNorm, simTimeSec);
    expl = explainOven(rNorm, tempF);
  } else {
    tempF = microwaveTempAtNorm(nx, ny, simTimeSec);
    expl = explainMicrowave(nx, ny, tempF);
  }
  activeReadout = { panel, nx, ny, tempF, expl };
}

function explainOven(rNorm, tempF) {
  if (rNorm > 0.85) {
    return 'You clicked near the SURFACE. The oven heats this part first by conduction from the hot air. Skin temperatures rise fast.';
  } else if (rNorm > 0.55) {
    return 'This is the MIDDLE layer. It only gets hot after heat conducts inward from the skin — that takes several minutes.';
  } else {
    return 'You clicked near the CENTER. Conventional ovens heat from the outside in, so the very middle takes the longest to warm up.';
  }
}

function explainMicrowave(nx, ny, tempF) {
  // Detect if inside a cool spot
  let inSpot = false;
  for (const s of coolSpots) {
    const dx = nx - s.nx;
    const dy = ny - s.ny;
    if (Math.sqrt(dx * dx + dy * dy) < s.r * 0.8) { inSpot = true; break; }
  }
  if (inSpot) {
    return 'You clicked a COOL SPOT. Microwaves heat water molecules. If a region has less water (or a denser structure), it heats less — creating cool pockets.';
  }
  return 'Microwaves pass through the potato and vibrate water molecules everywhere at once, so most of the inside heats at about the same rate — not just the surface.';
}
