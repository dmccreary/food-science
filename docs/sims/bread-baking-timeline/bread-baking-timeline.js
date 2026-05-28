// Bread Baking Timeline - Food Science MicroSim
// CANVAS_HEIGHT: 620
// LEFT panel: cross-section of a baking loaf, color-coded by temperature
// (blue cool center -> orange/red hot crust). Hover for local temp + chemistry.
// RIGHT panel: dual line chart - internal temperature (surface + center) and
// loaf volume vs. time over 25 minutes, with 6 annotated event points.
// Play/Pause + time slider lets students scrub through the bake.

// ----- Layout constants -----
let canvasWidth = 820;
let drawHeight = 540;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 10;
let defaultTextSize = 14;

// Header band
let titleY = 22;
let subtitleY = 42;

// Panels
let panelTopY = 60;
let panelHeight = 470;
let panelGap = 12;
let leftPanelW = 220;
let rightPanelW; // computed

// Loaf cross-section center
let loafCx, loafCy;
let loafRadius = 90;

// Chart area (computed in updateCanvasSize)
let chartX, chartY, chartW, chartH;

// Colors (book palette)
const COLOR_BG        = '#f1f8e9';
const COLOR_PANEL_BG  = '#ffffff';
const COLOR_BORDER    = '#bdbdbd';
const COLOR_TITLE     = '#1b5e20';
const COLOR_PRIMARY   = '#2e7d32';
const COLOR_ACCENT    = '#f57c00';
const COLOR_TEXT      = '#212121';
const COLOR_MUTED     = '#616161';
const COLOR_GRID      = '#e0e0e0';
const COLOR_TEMP_LINE = '#e53935';   // surface temp (red)
const COLOR_CENTER_LINE = '#1e88e5'; // center temp (blue)
const COLOR_VOL_LINE  = '#7e57c2';   // volume (purple)
const COLOR_EVENT     = '#f57c00';   // event dot

// Temperature axis: 50F .. 450F
const TEMP_MIN = 50;
const TEMP_MAX = 450;
// Volume axis: 100% .. 130%
const VOL_MIN = 95;
const VOL_MAX = 135;
// Time axis: 0..25 min
const TIME_MAX = 25;

// Simulation state
let currentMinute = 0;        // 0..25
let playing = false;
let lastFrameMs = 0;
const PLAY_SPEED_MIN_PER_SEC = 2.0;   // 25min in ~12.5s

// UI
let playBtn, resetBtn, timeSlider;

// Events (canonical text from spec)
const EVENTS = [
  { t: 0,  label: '0 min',  short: 'In oven',
    text: 'Dough enters oven. Surface 75°F. Center 75°F.' },
  { t: 3,  label: '3 min',  short: 'Oven spring',
    text: 'Oven spring. Yeast activated. CO₂ expands. Volume +20%.' },
  { t: 7,  label: '7 min',  short: 'Yeast die',
    text: 'Yeast die at 140°F. Surface 250°F. Maillard begins.' },
  { t: 10, label: '10 min', short: 'Gluten sets',
    text: 'Gluten sets at 160°F. Starches gelatinize. Structure permanent. Volume stabilizes.' },
  { t: 15, label: '15 min', short: 'Deep browning',
    text: 'Crust 350°F. Deep Maillard + caramelization.' },
  { t: 25, label: '25 min', short: 'Done',
    text: 'Center 205°F. Fully baked. Remove.' }
];

// ----- Temperature models -----

// Surface temperature in F at given minute.
// Anchors: t=0:75, t=7:250, t=15:350, t=25:425 (approaches oven temp)
function surfaceTempAt(t) {
  if (t <= 0) return 75;
  // smooth approach to ~450F oven, fast initial rise
  const tau = 6.0;
  return 75 + (450 - 75) * (1 - Math.exp(-t / tau));
}

// Center temperature in F at given minute.
// Anchors: t=0:75, t=10:160, t=25:205 (sigmoid-ish)
function centerTempAt(t) {
  if (t <= 0) return 75;
  // logistic curve, asymptote ~212F (boiling water inside crumb)
  const k = 0.32;
  const t0 = 9;
  const lo = 75;
  const hi = 212;
  return lo + (hi - lo) / (1 + Math.exp(-k * (t - t0)));
}

// Volume in % of starting dough volume at given minute.
// Flat 0-3, rises to ~120 by 7, holds, slight settle, then flat at 118.
function volumeAt(t) {
  if (t <= 3) return 100;
  if (t <= 7) {
    const u = (t - 3) / 4;
    return 100 + 20 * u; // 100 -> 120
  }
  if (t <= 10) {
    const u = (t - 7) / 3;
    return 120 - 2 * u;  // tiny settle to 118 as structure sets
  }
  return 118;
}

// Local temperature inside loaf at normalized radius r in [0,1]
// r=0 center, r=1 surface. Smooth interpolation surface<->center
// with a slight curve so crust transitions sharply.
function localTempAt(t, r) {
  const Ts = surfaceTempAt(t);
  const Tc = centerTempAt(t);
  // sharper near surface: use r^p
  const p = 2.2;
  const w = Math.pow(r, p);
  return Tc + (Ts - Tc) * w;
}

// Map temperature -> color (blue cool -> yellow -> orange -> red)
function tempToColor(tF) {
  // clamp to display range
  const t = Math.max(60, Math.min(450, tF));
  // anchors: 60 cool blue, 140 yellow, 250 orange, 400 deep red
  let r, g, b;
  if (t < 140) {
    const u = (t - 60) / 80;            // 0..1
    r = lerp(60,  240, u);
    g = lerp(120, 220, u);
    b = lerp(200, 120, u);
  } else if (t < 250) {
    const u = (t - 140) / 110;
    r = lerp(240, 245, u);
    g = lerp(220, 150, u);
    b = lerp(120,  60, u);
  } else {
    const u = Math.min(1, (t - 250) / 175);
    r = lerp(245, 160, u);
    g = lerp(150,  40, u);
    b = lerp( 60,  20, u);
  }
  return color(r, g, b);
}

// What's chemically happening at a given temperature?
function chemistryAt(tF) {
  if (tF < 100) return 'Cold dough. Yeast active and producing CO₂.';
  if (tF < 140) return 'Yeast going crazy! Oven spring — CO₂ expands fast.';
  if (tF < 160) return 'Yeast dying. Gluten still flexible.';
  if (tF < 180) return 'Gluten proteins setting. Starches start to gelatinize.';
  if (tF < 212) return 'Water boiling inside crumb. Structure becoming permanent.';
  if (tF < 280) return 'Surface drying out. Crust forming.';
  if (tF < 330) return 'Maillard browning. Hundreds of flavor compounds form.';
  if (tF < 400) return 'Deep Maillard + caramelization. Dark golden crust.';
  return 'Very hot crust. Risk of burning.';
}

// ----- p5 lifecycle -----

function updateCanvasSize() {
  const container = document.querySelector('main').parentElement;
  if (container) {
    const w = container.clientWidth;
    if (w && w > 320) {
      canvasWidth = Math.min(w - 20, 900);
    }
  }
  rightPanelW = canvasWidth - margin * 2 - panelGap - leftPanelW;

  loafCx = margin + leftPanelW / 2;
  loafCy = panelTopY + 30 + loafRadius + 20;

  // chart inside right panel
  const padL = 50, padR = 60, padT = 70, padB = 90;
  chartX = margin + leftPanelW + panelGap + padL;
  chartY = panelTopY + padT;
  chartW = rightPanelW - padL - padR;
  chartH = panelHeight - padT - padB;
}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Segoe UI');
  textSize(defaultTextSize);

  createControls();
  positionControls();
  lastFrameMs = millis();
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
  // slider width may need updating
  if (timeSlider) {
    timeSlider.style('width', (canvasWidth - 260) + 'px');
  }
}

// ----- UI -----

function createControls() {
  playBtn = createButton('▶ Play');
  playBtn.mousePressed(togglePlay);
  styleButton(playBtn, COLOR_PRIMARY);

  resetBtn = createButton('Reset');
  resetBtn.mousePressed(onReset);
  styleButton(resetBtn, COLOR_MUTED);

  timeSlider = createSlider(0, TIME_MAX * 10, 0, 1);  // 0..250 (0.1 min steps)
  timeSlider.style('width', (canvasWidth - 260) + 'px');
  timeSlider.input(() => {
    currentMinute = timeSlider.value() / 10;
    playing = false;
    updatePlayLabel();
  });
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

function positionControls() {
  const rowY = drawHeight + 18;
  playBtn.position(margin + 4, rowY);
  resetBtn.position(margin + 90, rowY);
  timeSlider.position(margin + 170, rowY + 6);
}

function togglePlay() {
  if (currentMinute >= TIME_MAX) {
    currentMinute = 0;
    timeSlider.value(0);
  }
  playing = !playing;
  lastFrameMs = millis();
  updatePlayLabel();
}

function updatePlayLabel() {
  playBtn.html(playing ? '⏸ Pause' : '▶ Play');
}

function onReset() {
  currentMinute = 0;
  timeSlider.value(0);
  playing = false;
  updatePlayLabel();
}

// ----- Draw -----

function draw() {
  // Advance time if playing
  const now = millis();
  const dt = (now - lastFrameMs) / 1000;
  lastFrameMs = now;
  if (playing) {
    currentMinute += dt * PLAY_SPEED_MIN_PER_SEC;
    if (currentMinute >= TIME_MAX) {
      currentMinute = TIME_MAX;
      playing = false;
      updatePlayLabel();
    }
    timeSlider.value(Math.round(currentMinute * 10));
  }

  background(COLOR_BG);

  drawHeader();
  drawLeftPanel();
  drawRightPanel();
  drawTooltip();
  drawControlsBg();
}

function drawHeader() {
  push();
  noStroke();
  fill(COLOR_TITLE);
  textSize(18);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text('What Happens Inside a Loaf as It Bakes', margin + 4, titleY - 14);

  fill(COLOR_MUTED);
  textSize(12);
  textStyle(NORMAL);
  text('Scrub or play the 25-minute bake. Hover the loaf for local temperature.',
       margin + 4, subtitleY - 14);
  pop();
}

function drawLeftPanel() {
  push();
  // panel background
  stroke(COLOR_BORDER);
  fill(COLOR_PANEL_BG);
  rect(margin, panelTopY, leftPanelW, panelHeight, 8);

  // panel title
  noStroke();
  fill(COLOR_TITLE);
  textSize(13);
  textStyle(BOLD);
  textAlign(CENTER, TOP);
  text('Loaf Cross-Section', margin + leftPanelW / 2, panelTopY + 8);

  // Draw radial temperature gradient by drawing concentric rings
  // from inside the loaf outward. Use many thin rings for smoothness.
  const rings = 50;
  noStroke();
  for (let i = rings; i >= 1; i--) {
    const rOuter = (i / rings) * loafRadius;
    const rNorm = i / rings;
    const tF = localTempAt(currentMinute, rNorm);
    const c = tempToColor(tF);
    fill(c);
    ellipse(loafCx, loafCy, rOuter * 2, rOuter * 2);
  }
  // outline
  noFill();
  stroke(80, 50, 20);
  strokeWeight(2);
  ellipse(loafCx, loafCy, loafRadius * 2, loafRadius * 2);

  // Slash on top of loaf (baker's score)
  push();
  stroke(120, 80, 40, 180);
  strokeWeight(2);
  noFill();
  arc(loafCx, loafCy - loafRadius * 0.3, loafRadius * 1.0, loafRadius * 0.5,
      PI + 0.3, TWO_PI - 0.3);
  pop();

  // Legend for temperature color scale
  drawTempLegend();

  // Current time + temps numeric display
  noStroke();
  fill(COLOR_TEXT);
  textSize(12);
  textStyle(NORMAL);
  textAlign(LEFT, TOP);
  const txtX = margin + 12;
  let txtY = loafCy + loafRadius + 48;
  text('Time: ' + currentMinute.toFixed(1) + ' min', txtX, txtY);
  txtY += 16;
  text('Surface: ' + Math.round(surfaceTempAt(currentMinute)) + '°F', txtX, txtY);
  txtY += 16;
  text('Center: '  + Math.round(centerTempAt(currentMinute))  + '°F', txtX, txtY);
  txtY += 16;
  text('Volume: ' + Math.round(volumeAt(currentMinute)) + '%', txtX, txtY);
  pop();
}

function drawTempLegend() {
  push();
  const lx = margin + 14;
  const ly = loafCy + loafRadius + 18;
  const lw = leftPanelW - 28;
  const lh = 10;
  noStroke();
  // Draw gradient bar
  for (let i = 0; i < lw; i++) {
    const u = i / (lw - 1);
    const tF = lerp(60, 425, u);
    fill(tempToColor(tF));
    rect(lx + i, ly, 1, lh);
  }
  // border
  noFill();
  stroke(COLOR_BORDER);
  rect(lx, ly, lw, lh);

  noStroke();
  fill(COLOR_MUTED);
  textSize(10);
  textAlign(LEFT, TOP);
  text('60°F', lx, ly + lh + 2);
  textAlign(RIGHT, TOP);
  text('425°F', lx + lw, ly + lh + 2);
  pop();
}

function drawRightPanel() {
  push();
  // panel bg
  stroke(COLOR_BORDER);
  fill(COLOR_PANEL_BG);
  const rpX = margin + leftPanelW + panelGap;
  rect(rpX, panelTopY, rightPanelW, panelHeight, 8);

  // title
  noStroke();
  fill(COLOR_TITLE);
  textSize(13);
  textStyle(BOLD);
  textAlign(CENTER, TOP);
  text('Temperature & Volume vs. Time', rpX + rightPanelW / 2, panelTopY + 8);

  drawChart();
  drawLegend(rpX);
  drawEventDetail(rpX);
  pop();
}

function drawChart() {
  push();
  // grid
  stroke(COLOR_GRID);
  strokeWeight(1);
  for (let i = 0; i <= 5; i++) {
    const y = chartY + (i / 5) * chartH;
    line(chartX, y, chartX + chartW, y);
  }
  for (let m = 0; m <= TIME_MAX; m += 5) {
    const x = chartX + (m / TIME_MAX) * chartW;
    line(x, chartY, x, chartY + chartH);
  }

  // axes
  stroke(COLOR_BORDER);
  strokeWeight(1.5);
  line(chartX, chartY, chartX, chartY + chartH);
  line(chartX, chartY + chartH, chartX + chartW, chartY + chartH);

  // y-axis labels: temperature (left)
  noStroke();
  fill(COLOR_TEXT);
  textSize(10);
  textAlign(RIGHT, CENTER);
  for (let i = 0; i <= 5; i++) {
    const tF = TEMP_MIN + (i / 5) * (TEMP_MAX - TEMP_MIN);
    const y = chartY + chartH - (i / 5) * chartH;
    text(Math.round(tF) + '°F', chartX - 6, y);
  }
  // right axis labels: volume %
  textAlign(LEFT, CENTER);
  fill(COLOR_VOL_LINE);
  for (let i = 0; i <= 4; i++) {
    const v = VOL_MIN + (i / 4) * (VOL_MAX - VOL_MIN);
    const y = chartY + chartH - (i / 4) * chartH;
    text(Math.round(v) + '%', chartX + chartW + 6, y);
  }
  // x-axis labels
  fill(COLOR_TEXT);
  textAlign(CENTER, TOP);
  for (let m = 0; m <= TIME_MAX; m += 5) {
    const x = chartX + (m / TIME_MAX) * chartW;
    text(m + ' min', x, chartY + chartH + 4);
  }

  // Axis titles
  fill(COLOR_MUTED);
  textSize(11);
  textAlign(CENTER, BOTTOM);
  push();
  translate(chartX - 36, chartY + chartH / 2);
  rotate(-HALF_PI);
  text('Temperature (°F)', 0, 0);
  pop();
  push();
  fill(COLOR_VOL_LINE);
  translate(chartX + chartW + 42, chartY + chartH / 2);
  rotate(HALF_PI);
  text('Volume (%)', 0, 0);
  pop();
  fill(COLOR_MUTED);
  textAlign(CENTER, TOP);
  text('Time (minutes)', chartX + chartW / 2, chartY + chartH + 22);

  // Draw lines up to currentMinute
  drawCurve((t) => surfaceTempAt(t), TEMP_MIN, TEMP_MAX, COLOR_TEMP_LINE, 2.5);
  drawCurve((t) => centerTempAt(t),  TEMP_MIN, TEMP_MAX, COLOR_CENTER_LINE, 2.5);
  drawCurve((t) => volumeAt(t),      VOL_MIN, VOL_MAX, COLOR_VOL_LINE, 2.5);

  // Ghost (faded) full curves to show future
  push();
  drawingContext.globalAlpha = 0.18;
  drawCurveFull((t) => surfaceTempAt(t), TEMP_MIN, TEMP_MAX, COLOR_TEMP_LINE, 1.5);
  drawCurveFull((t) => centerTempAt(t),  TEMP_MIN, TEMP_MAX, COLOR_CENTER_LINE, 1.5);
  drawCurveFull((t) => volumeAt(t),      VOL_MIN, VOL_MAX, COLOR_VOL_LINE, 1.5);
  drawingContext.globalAlpha = 1.0;
  pop();

  // Event dots + labels
  for (const ev of EVENTS) {
    const x = chartX + (ev.t / TIME_MAX) * chartW;
    const reached = currentMinute >= ev.t - 0.05;
    // vertical guide line
    push();
    stroke(reached ? COLOR_EVENT : 200);
    strokeWeight(reached ? 1.2 : 0.8);
    drawingContext.setLineDash([3, 3]);
    line(x, chartY, x, chartY + chartH);
    drawingContext.setLineDash([]);
    pop();

    // dot at surface-temp curve position
    const yT = tempToY(surfaceTempAt(ev.t), TEMP_MIN, TEMP_MAX);
    noStroke();
    fill(reached ? COLOR_EVENT : 200);
    ellipse(x, yT, 9, 9);

    // label above chart top — stagger to avoid crowding
    fill(reached ? COLOR_TITLE : COLOR_MUTED);
    textSize(10);
    textStyle(BOLD);
    textAlign(CENTER, BOTTOM);
    // alternate two rows so adjacent labels don't crowd
    const idx = EVENTS.indexOf(ev);
    const labelY = chartY - 4 - ((idx % 2) * 12);
    text(ev.label, x, labelY);
  }

  // Current-time vertical cursor
  const cursorX = chartX + (currentMinute / TIME_MAX) * chartW;
  push();
  stroke(COLOR_PRIMARY);
  strokeWeight(2);
  line(cursorX, chartY, cursorX, chartY + chartH);
  // marker dots at current values
  noStroke();
  fill(COLOR_TEMP_LINE);
  ellipse(cursorX, tempToY(surfaceTempAt(currentMinute), TEMP_MIN, TEMP_MAX), 8, 8);
  fill(COLOR_CENTER_LINE);
  ellipse(cursorX, tempToY(centerTempAt(currentMinute), TEMP_MIN, TEMP_MAX), 8, 8);
  fill(COLOR_VOL_LINE);
  ellipse(cursorX, tempToY(volumeAt(currentMinute), VOL_MIN, VOL_MAX), 8, 8);
  pop();
  pop();
}

function tempToY(value, vMin, vMax) {
  const u = (value - vMin) / (vMax - vMin);
  return chartY + chartH - u * chartH;
}

function drawCurve(fn, vMin, vMax, col, weight) {
  push();
  noFill();
  stroke(col);
  strokeWeight(weight);
  beginShape();
  const steps = 80;
  const maxT = Math.min(currentMinute, TIME_MAX);
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * maxT;
    const x = chartX + (t / TIME_MAX) * chartW;
    const y = tempToY(fn(t), vMin, vMax);
    vertex(x, y);
  }
  endShape();
  pop();
}

function drawCurveFull(fn, vMin, vMax, col, weight) {
  push();
  noFill();
  stroke(col);
  strokeWeight(weight);
  beginShape();
  const steps = 80;
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * TIME_MAX;
    const x = chartX + (t / TIME_MAX) * chartW;
    const y = tempToY(fn(t), vMin, vMax);
    vertex(x, y);
  }
  endShape();
  pop();
}

function drawLegend(rpX) {
  push();
  // legend sits between panel title and chart top, well above event labels
  const ly = panelTopY + 28;
  textSize(11);
  textStyle(NORMAL);
  noStroke();
  let lx = rpX + 12;

  const items = [
    { c: COLOR_TEMP_LINE,   label: 'Surface temp' },
    { c: COLOR_CENTER_LINE, label: 'Center temp' },
    { c: COLOR_VOL_LINE,    label: 'Volume' }
  ];
  for (const it of items) {
    fill(it.c);
    rect(lx, ly, 14, 3, 1);
    fill(COLOR_TEXT);
    textAlign(LEFT, CENTER);
    text(it.label, lx + 20, ly + 1);
    lx += textWidth(it.label) + 50;
  }
  pop();
}

function drawEventDetail(rpX) {
  // Find the most recent reached event
  let activeEv = EVENTS[0];
  for (const ev of EVENTS) {
    if (currentMinute >= ev.t - 0.05) activeEv = ev;
  }
  push();
  const dy = chartY + chartH + 40;
  const dx = rpX + 10;
  const dw = rightPanelW - 20;
  const dh = 50;
  noStroke();
  fill('#fff8e1');
  rect(dx, dy, dw, dh, 6);
  stroke(COLOR_ACCENT);
  noFill();
  rect(dx, dy, dw, dh, 6);

  noStroke();
  fill(COLOR_ACCENT);
  textSize(12);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text(activeEv.label, dx + 10, dy + 8);

  fill(COLOR_TEXT);
  textStyle(NORMAL);
  textSize(12);
  text(activeEv.text, dx + 70, dy + 8, dw - 80, dh - 10);
  pop();
}

function drawTooltip() {
  // Hover the loaf cross-section to show local temp + chemistry
  const dx = mouseX - loafCx;
  const dy = mouseY - loafCy;
  const dist2 = dx * dx + dy * dy;
  if (dist2 > loafRadius * loafRadius) return;
  const rNorm = Math.sqrt(dist2) / loafRadius;
  const tF = localTempAt(currentMinute, rNorm);
  const chem = chemistryAt(tF);

  push();
  textSize(11);
  const tip1 = Math.round(tF) + '°F at ' + Math.round(rNorm * 100) + '% radius';
  const tip2 = chem;
  const w1 = textWidth(tip1);
  const w2 = textWidth(tip2);
  const tw = Math.max(w1, w2) + 16;
  const th = 38;
  let tx = mouseX + 12;
  let ty = mouseY + 12;
  if (tx + tw > margin + leftPanelW) tx = mouseX - tw - 12;
  if (ty + th > drawHeight) ty = mouseY - th - 12;

  noStroke();
  fill(255, 255, 255, 240);
  stroke(COLOR_BORDER);
  rect(tx, ty, tw, th, 4);
  noStroke();
  fill(COLOR_TITLE);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text(tip1, tx + 8, ty + 4);
  fill(COLOR_TEXT);
  textStyle(NORMAL);
  text(tip2, tx + 8, ty + 20, tw - 12, th - 22);
  pop();
}

function drawControlsBg() {
  push();
  noStroke();
  fill('#e8f5e9');
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke(COLOR_BORDER);
  line(0, drawHeight, canvasWidth, drawHeight);
  noStroke();
  fill(COLOR_MUTED);
  textSize(11);
  textAlign(LEFT, TOP);
  text('Drag the slider to scrub through time, or press Play.',
       margin + 4, drawHeight + 52);
  pop();
}
