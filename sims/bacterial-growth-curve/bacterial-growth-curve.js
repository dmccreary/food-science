// Bacterial Growth Curve Simulation — Food Science MicroSim
// CANVAS_HEIGHT: 520
// Students adjust temperature, nutrients, and species and watch a
// bacterial population grow through the four classic phases:
// Lag, Log, Stationary, Death. Population is plotted on a log10 axis
// from 1 to 10^9 over a 24-hour window.
// Bloom L1 (Remember — identify the 4 phases) + L3 (Apply — predict
// how temperature & nutrients change the curve).

// ---- Layout constants ----
let containerWidth;
let canvasWidth = 760;
let titleHeight = 40;
let drawHeight = 440;   // main area: left controls panel + right graph
let controlHeight = 40; // bottom strip for Start/Reset + status
let canvasHeight = titleHeight + drawHeight + controlHeight; // 520

// Left controls panel
let panelWidth = 210;
let panelPadX = 14;

// Graph plot area (computed in setup based on canvas width)
let plotX, plotY, plotW, plotH;
let plotMarginLeft = 56;     // y-axis label room
let plotMarginRight = 18;
let plotMarginTop = 30;      // room for graph title
let plotMarginBottom = 40;   // x-axis label room

// ---- Palette ----
const COLOR_BG          = '#f1f8e9';
const COLOR_TITLE_BG    = '#2e7d32';   // primary green
const COLOR_TITLE_TEXT  = '#ffffff';
const COLOR_PANEL_BG    = '#ffffff';
const COLOR_PANEL_BORDER= '#c8e6c9';
const COLOR_PLOT_BG     = '#ffffff';
const COLOR_PLOT_BORDER = '#9e9e9e';
const COLOR_AXIS        = '#424242';
const COLOR_GRID        = '#e0e0e0';
const COLOR_CURVE       = '#1b1b1b';
const COLOR_TEXT_DARK   = '#1b1b1b';
const COLOR_TEXT_MUTED  = '#555555';

// Phase band colors (per spec)
const COLOR_LAG         = [158, 158, 158]; // gray
const COLOR_LOG         = [245, 124,   0]; // accent orange
const COLOR_STAT        = [253, 216,  53]; // yellow
const COLOR_DEATH       = [ 66, 165, 245]; // blue
const BAND_ALPHA        = 70;

// Species highlight (used in legend dot)
const SPECIES = {
  salmonella:   { name: 'Salmonella',   color: '#d32f2f', rate: 1.30, lagHr: 1.5, note: 'Fast grower; warm danger-zone' },
  listeria:     { name: 'Listeria',     color: '#5e35b1', rate: 0.85, lagHr: 2.5, note: 'Cold-tolerant; grows in fridge' },
  lactobacillus:{ name: 'Lactobacillus',color: '#2e7d32', rate: 0.70, lagHr: 2.0, note: 'Beneficial; slower; makes yogurt' }
};

// ---- Simulation state ----
let tempSlider, nutSlider, speciesSelect, startButton, resetButton;
let temperatureF = 95;       // body temp default — squarely in danger zone
let nutrientsPct = 70;
let speciesKey   = 'salmonella';

// Animation: simulated time advances from 0 to 24 hours
let simHours = 0;
let simHoursMax = 24;
let isRunning = false;
let curvePoints = [];        // array of {tHr, logPop, phase}

// Cached growth model parameters for the current run
let currentLagHr, currentLogEndHr, currentStatEndHr;
let currentMaxLog, currentRatePerHr, currentDeathRatePerHr;
let willEnterDeathFromHeat = false;  // true above 165F or below 32F

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Segoe UI, Arial, sans-serif');

  layoutPlotArea();

  // Build the left-side controls panel using native p5 controls
  buildControls();

  // Initialize growth parameters from defaults
  recomputeGrowthParameters();

  describe(
    'Bacterial growth curve simulator. Adjust temperature, nutrients, ' +
    'and species, then press Start to watch the population grow through ' +
    'lag, log, stationary, and death phases on a log10 axis.',
    LABEL
  );
}

function layoutPlotArea() {
  plotX = panelWidth + plotMarginLeft;
  plotY = titleHeight + plotMarginTop;
  plotW = canvasWidth - panelWidth - plotMarginLeft - plotMarginRight;
  plotH = drawHeight - plotMarginTop - plotMarginBottom;
}

// Shared layout constants for controls panel — used by both buildControls()
// and drawControlsPanel() so labels and DOM controls stay in lockstep.
const CTRL_LABEL_GAP = 20;   // gap between top-of-label and top-of-slider
const CTRL_ROW_GAP   = 48;   // vertical distance from one slider top to the next slider's label top
const CTRL_START_Y_OFFSET = 36; // distance below title strip where first label begins

function buildControls() {
  const labelGap = CTRL_LABEL_GAP;
  const ctrlGap  = CTRL_ROW_GAP;
  let y = titleHeight + CTRL_START_Y_OFFSET;  // start a bit below the title strip

  // Temperature slider
  tempSlider = createSlider(32, 220, temperatureF, 1);
  tempSlider.position(panelPadX, y + labelGap);
  tempSlider.size(panelWidth - 2 * panelPadX);
  tempSlider.input(() => { temperatureF = tempSlider.value(); recomputeGrowthParameters(); });
  y += labelGap + ctrlGap;

  // Nutrient slider
  nutSlider = createSlider(0, 100, nutrientsPct, 1);
  nutSlider.position(panelPadX, y + labelGap);
  nutSlider.size(panelWidth - 2 * panelPadX);
  nutSlider.input(() => { nutrientsPct = nutSlider.value(); recomputeGrowthParameters(); });
  y += labelGap + ctrlGap;

  // Species selector
  speciesSelect = createSelect();
  speciesSelect.position(panelPadX, y + labelGap);
  speciesSelect.size(panelWidth - 2 * panelPadX);
  speciesSelect.option('Salmonella (fast)',         'salmonella');
  speciesSelect.option('Listeria (cold-tolerant)',  'listeria');
  speciesSelect.option('Lactobacillus (beneficial)','lactobacillus');
  speciesSelect.selected('salmonella');
  speciesSelect.changed(() => {
    speciesKey = speciesSelect.value();
    recomputeGrowthParameters();
  });
  y += labelGap + ctrlGap + 6;

  // Start / Reset buttons live in the BOTTOM strip so they don't get crowded.
  startButton = createButton('Start Simulation');
  styleButton(startButton, '#2e7d32', '#ffffff');
  startButton.position(panelPadX, titleHeight + drawHeight + 6);
  startButton.size(panelWidth - 2 * panelPadX, 28);
  startButton.mousePressed(toggleStart);

  resetButton = createButton('Reset');
  styleButton(resetButton, '#f57c00', '#ffffff');
  resetButton.position(panelWidth + plotMarginLeft, titleHeight + drawHeight + 6);
  resetButton.size(80, 28);
  resetButton.mousePressed(resetSim);
}

function styleButton(btn, bg, fg) {
  btn.style('background-color', bg);
  btn.style('color', fg);
  btn.style('border', 'none');
  btn.style('border-radius', '4px');
  btn.style('font-weight', '600');
  btn.style('font-family', 'Segoe UI, Arial, sans-serif');
  btn.style('cursor', 'pointer');
}

function toggleStart() {
  if (simHours >= simHoursMax) {
    // user pressed Start after the run finished — restart
    resetSim();
  }
  isRunning = !isRunning;
  startButton.html(isRunning ? 'Pause' : (simHours > 0 ? 'Resume' : 'Start Simulation'));
}

function resetSim() {
  isRunning = false;
  simHours = 0;
  curvePoints = [];
  recomputeGrowthParameters();
  startButton.html('Start Simulation');
}

// ---- Growth model ----
// We use a deterministic piecewise model:
//   logPop(t) = 0 to maxLog over [lag, statStart]
//   logPop(t) = maxLog over [statStart, statEnd]
//   logPop(t) = decay over [statEnd, 24]
// Temperature & nutrients shape the four parameters.
function recomputeGrowthParameters() {
  const sp = SPECIES[speciesKey];
  const T = temperatureF;
  const N = nutrientsPct / 100; // 0..1

  // ---- Lethal heat or freezing: skip growth, go straight to death ----
  willEnterDeathFromHeat = (T > 165 || T < 32);

  // ---- Temperature growth multiplier ----
  // Bell-ish curve peaking in mid danger-zone for most species.
  // Listeria gets a meaningful bump at refrigerator temps.
  let tempFactor;
  if (T < 32) {
    tempFactor = 0.0;
  } else if (T > 165) {
    tempFactor = 0.0;
  } else if (T >= 70 && T <= 110) {
    tempFactor = 1.0;          // sweet spot
  } else if (T > 40 && T < 70) {
    tempFactor = 0.35 + 0.65 * ((T - 40) / 30);  // ramp up into danger zone
  } else if (T > 110 && T <= 140) {
    tempFactor = 1.0 - 0.5 * ((T - 110) / 30);   // ramp down toward 140F
  } else if (T > 140 && T <= 165) {
    tempFactor = 0.2 - 0.2 * ((T - 140) / 25);   // collapsing fast
  } else { // 32..40 (refrigerator range)
    tempFactor = 0.10;
  }
  // Listeria bonus in the fridge (cold-tolerant)
  if (speciesKey === 'listeria' && T >= 32 && T < 50) {
    tempFactor = Math.max(tempFactor, 0.35);
  }

  // ---- Nutrient factor ----
  // Low nutrients → shorter log phase, lower max population.
  const nutFactor = 0.25 + 0.75 * N;

  // ---- Lag phase length ----
  // Cold → much longer lag. Low nutrients → longer lag.
  let lagMult = 1.0;
  if (T < 50) lagMult = 3.0;
  else if (T < 70) lagMult = 1.6;
  if (N < 0.3) lagMult *= 1.5;
  currentLagHr = Math.min(8, sp.lagHr * lagMult);

  // ---- Max log population ----
  // Healthy danger-zone + high nutrients → up to 10^9.
  // Cold/dry → caps around 10^4-10^5.
  const baseMax = 9.0;   // log10
  currentMaxLog = 1.0 + (baseMax - 1.0) * tempFactor * (0.5 + 0.5 * nutFactor);
  currentMaxLog = Math.max(1.2, Math.min(9.0, currentMaxLog));

  // ---- Log-phase growth rate (log10 units / hour) ----
  // Danger zone steepens dramatically. Species rate scales it.
  currentRatePerHr = 1.1 * tempFactor * nutFactor * sp.rate;
  if (currentRatePerHr < 0.05) currentRatePerHr = 0.05;

  // Time to reach max log starting from logPop=0 after lag ends:
  const logSpan = currentMaxLog;
  const logHours = logSpan / currentRatePerHr;
  currentLogEndHr = currentLagHr + logHours;

  // Stationary phase: longer when nutrients are abundant.
  const statHours = 4 + 6 * nutFactor;
  currentStatEndHr = Math.min(simHoursMax, currentLogEndHr + statHours);

  // Death-phase decay rate. Heat & cold accelerate it.
  if (willEnterDeathFromHeat) {
    currentDeathRatePerHr = 2.0; // rapid kill — drops 2 log per hour
  } else {
    currentDeathRatePerHr = 0.35 + 0.5 * (1 - nutFactor);
  }
}

// Compute log10 population at simulated hour t under current parameters.
function populationAt(tHr) {
  // Special case: lethal temperature — straight, rapid death from start
  if (willEnterDeathFromHeat) {
    // Start at a small "initial inoculum" of 10^3 (1000 cells) and crash
    const startLog = 3.0;
    const lp = startLog - currentDeathRatePerHr * tHr;
    return Math.max(0, lp);
  }
  if (tHr <= currentLagHr) {
    // lag — slight wobble around log10 = 0 (population ~ 1)
    return 0.05 + 0.02 * Math.sin(tHr * 1.7);
  } else if (tHr <= currentLogEndHr) {
    return (tHr - currentLagHr) * currentRatePerHr;
  } else if (tHr <= currentStatEndHr) {
    return currentMaxLog;
  } else {
    const tDeath = tHr - currentStatEndHr;
    return Math.max(0, currentMaxLog - currentDeathRatePerHr * tDeath);
  }
}

function phaseAt(tHr) {
  if (willEnterDeathFromHeat) return 'Death';
  if (tHr <= currentLagHr) return 'Lag';
  if (tHr <= currentLogEndHr) return 'Log';
  if (tHr <= currentStatEndHr) return 'Stationary';
  return 'Death';
}

function phaseDescription(p) {
  switch (p) {
    case 'Lag':        return 'Bacteria adjusting — little growth yet.';
    case 'Log':        return 'Exponential growth — population doubles fast.';
    case 'Stationary': return 'Growth balanced by death — nutrients depleting.';
    case 'Death':      return 'Population crashes — heat, cold, or starvation.';
    default:           return '';
  }
}

// ---- Draw ----
function draw() {
  background(COLOR_BG);

  drawTitleStrip();
  drawControlsPanel();
  drawPlotArea();
  drawBottomStrip();

  if (isRunning) {
    simHours += deltaTime / 1000 * 1.8;  // 1.8 sim-hours per real second
    if (simHours >= simHoursMax) {
      simHours = simHoursMax;
      isRunning = false;
      startButton.html('Restart');
    }
    // sample a fresh point onto the curve
    curvePoints.push({
      tHr: simHours,
      logPop: populationAt(simHours),
      phase: phaseAt(simHours)
    });
  }
  drawCurve();
  drawHoverTooltip();
}

function drawTitleStrip() {
  noStroke();
  fill(COLOR_TITLE_BG);
  rect(0, 0, canvasWidth, titleHeight);
  fill(COLOR_TITLE_TEXT);
  textAlign(CENTER, CENTER);
  textSize(18);
  textStyle(BOLD);
  text('Bacterial Growth Curve Simulator', canvasWidth / 2, titleHeight / 2);
  textStyle(NORMAL);
}

function drawControlsPanel() {
  // Panel background
  noStroke();
  fill(COLOR_PANEL_BG);
  rect(0, titleHeight, panelWidth, drawHeight);
  stroke(COLOR_PANEL_BORDER);
  strokeWeight(1);
  noFill();
  rect(0.5, titleHeight + 0.5, panelWidth - 1, drawHeight - 1);

  noStroke();
  fill(COLOR_TEXT_DARK);
  textAlign(LEFT, TOP);
  textSize(13);
  textStyle(BOLD);
  text('Controls', panelPadX, titleHeight + 10);
  textStyle(NORMAL);

  // Slider labels (drawn above each control's position) — must use the same
  // CTRL_* constants as buildControls() so labels sit exactly above the DOM
  // sliders rather than colliding with them.
  let y = titleHeight + CTRL_START_Y_OFFSET;
  const labelGap = CTRL_LABEL_GAP;
  const ctrlGap = CTRL_ROW_GAP;

  textSize(13);
  fill(COLOR_TEXT_DARK);
  noStroke();
  text('Temperature: ' + temperatureF + ' °F', panelPadX, y);
  drawTempBadge(y - 2);
  // drawTempBadge() leaves fill set to white — restore dark text fill before
  // drawing the subsequent labels (footgun: invisible white-on-white text).
  fill(COLOR_TEXT_DARK);
  noStroke();
  y += labelGap + ctrlGap;

  text('Nutrients: ' + nutrientsPct + '%', panelPadX, y);
  y += labelGap + ctrlGap;

  text('Species', panelPadX, y);
  y += labelGap + ctrlGap + 6;

  // Species note
  const sp = SPECIES[speciesKey];
  fill(sp.color);
  noStroke();
  ellipse(panelPadX + 6, y + 6, 10, 10);
  fill(COLOR_TEXT_MUTED);
  textSize(11);
  text(sp.note, panelPadX + 16, y, panelWidth - panelPadX - 18);

  // Legend for phase bands at the bottom of the panel
  drawPhaseLegend(titleHeight + drawHeight - 110);
}

function drawTempBadge(y) {
  // Show a small colored badge indicating temperature regime.
  // Width is dynamic so longer labels ("LETHAL HEAT") don't overflow the panel.
  let label, c;
  if (temperatureF > 165)     { label = 'LETHAL';   c = '#b71c1c'; }
  else if (temperatureF >= 40 && temperatureF <= 140) { label = 'DANGER'; c = '#e64a19'; }
  else if (temperatureF < 32) { label = 'FROZEN';   c = '#0277bd'; }
  else if (temperatureF < 40) { label = 'FRIDGE';   c = '#039be5'; }
  else                        { label = 'HOT';      c = '#ef6c00'; }

  textSize(10);
  textStyle(BOLD);
  const w = textWidth(label) + 12;
  const x = panelWidth - panelPadX - w;
  noStroke();
  fill(c);
  rect(x, y, w, 16, 3);
  fill('#ffffff');
  textAlign(CENTER, CENTER);
  text(label, x + w / 2, y + 8);
  textStyle(NORMAL);
  textAlign(LEFT, TOP);
}

function drawPhaseLegend(y0) {
  const items = [
    ['Lag',        COLOR_LAG],
    ['Log',        COLOR_LOG],
    ['Stationary', COLOR_STAT],
    ['Death',      COLOR_DEATH]
  ];
  noStroke();
  fill(COLOR_TEXT_DARK);
  textSize(12);
  textStyle(BOLD);
  text('Growth Phases', panelPadX, y0);
  textStyle(NORMAL);

  let y = y0 + 18;
  textSize(11);
  for (let i = 0; i < items.length; i++) {
    const [name, rgb] = items[i];
    noStroke();
    fill(rgb[0], rgb[1], rgb[2], 200);
    rect(panelPadX, y, 14, 12, 2);
    fill(COLOR_TEXT_DARK);
    text(name, panelPadX + 20, y - 1);
    y += 18;
  }
}

function drawPlotArea() {
  // Plot background
  noStroke();
  fill(COLOR_PLOT_BG);
  rect(plotX, plotY, plotW, plotH);

  // Phase bands stretch across the time axis using the CURRENT model.
  drawPhaseBands();

  // Grid + axes (drawn after bands, before curve)
  drawGrid();
  drawAxes();

  // Graph title
  noStroke();
  fill(COLOR_TEXT_DARK);
  textAlign(CENTER, BOTTOM);
  textSize(13);
  textStyle(BOLD);
  text('Population vs Time (log scale)', plotX + plotW / 2, plotY - 6);
  textStyle(NORMAL);

  // Plot border on top so bands don't bleed
  noFill();
  stroke(COLOR_PLOT_BORDER);
  strokeWeight(1);
  rect(plotX + 0.5, plotY + 0.5, plotW - 1, plotH - 1);
}

function drawPhaseBands() {
  // Compute pixel x-positions for each phase boundary based on the
  // CURRENT growth parameters. Each band gets a translucent fill.
  let lagEnd = currentLagHr;
  let logEnd = currentLogEndHr;
  let statEnd = currentStatEndHr;

  if (willEnterDeathFromHeat) {
    // Whole canvas = Death band
    drawBand(0, simHoursMax, COLOR_DEATH);
    return;
  }
  drawBand(0,        lagEnd,        COLOR_LAG);
  drawBand(lagEnd,   logEnd,        COLOR_LOG);
  drawBand(logEnd,   statEnd,       COLOR_STAT);
  drawBand(statEnd,  simHoursMax,   COLOR_DEATH);

  // Labels along the top of each visible band
  textAlign(CENTER, TOP);
  textSize(11);
  fill(COLOR_TEXT_DARK);
  noStroke();
  drawBandLabel('Lag',        0,       Math.min(lagEnd, simHoursMax));
  drawBandLabel('Log',        lagEnd,  Math.min(logEnd, simHoursMax));
  drawBandLabel('Stationary', logEnd,  Math.min(statEnd, simHoursMax));
  drawBandLabel('Death',      statEnd, simHoursMax);
}

function drawBand(hrStart, hrEnd, rgb) {
  if (hrEnd <= hrStart) return;
  const x1 = hrToX(Math.max(0, hrStart));
  const x2 = hrToX(Math.min(simHoursMax, hrEnd));
  noStroke();
  // Use 4-arg fill(r,g,b,a) — fill('#hex', alpha) throws.
  fill(rgb[0], rgb[1], rgb[2], BAND_ALPHA);
  rect(x1, plotY + 1, x2 - x1, plotH - 2);
}

function drawBandLabel(label, hrStart, hrEnd) {
  if (hrEnd - hrStart < 1.2) return;  // too narrow to label
  const xMid = (hrToX(hrStart) + hrToX(hrEnd)) / 2;
  text(label, xMid, plotY + 4);
}

function drawGrid() {
  stroke(COLOR_GRID);
  strokeWeight(1);
  // Horizontal grid at each log decade (0..9)
  for (let p = 0; p <= 9; p++) {
    const y = logToY(p);
    line(plotX, y, plotX + plotW, y);
  }
  // Vertical grid every 4 hours
  for (let h = 0; h <= simHoursMax; h += 4) {
    const x = hrToX(h);
    line(x, plotY, x, plotY + plotH);
  }
}

function drawAxes() {
  stroke(COLOR_AXIS);
  strokeWeight(1.5);
  // Y axis
  line(plotX, plotY, plotX, plotY + plotH);
  // X axis
  line(plotX, plotY + plotH, plotX + plotW, plotY + plotH);

  // Y-axis tick labels (powers of 10)
  noStroke();
  fill(COLOR_TEXT_DARK);
  textAlign(RIGHT, CENTER);
  textSize(10);
  for (let p = 0; p <= 9; p++) {
    const y = logToY(p);
    text('10^' + p, plotX - 6, y);
  }
  // Y-axis title (rotated)
  push();
  translate(plotX - 44, plotY + plotH / 2);
  rotate(-PI / 2);
  textAlign(CENTER, CENTER);
  textSize(12);
  text('Population (cells per mL)', 0, 0);
  pop();

  // X-axis tick labels (hours)
  textAlign(CENTER, TOP);
  textSize(10);
  for (let h = 0; h <= simHoursMax; h += 4) {
    const x = hrToX(h);
    text(h + 'h', x, plotY + plotH + 4);
  }
  textSize(12);
  text('Time (hours)', plotX + plotW / 2, plotY + plotH + 20);
}

function drawCurve() {
  if (curvePoints.length < 2) {
    // Still draw the very first point as a small dot so users see "something"
    if (curvePoints.length === 1) {
      const pt = curvePoints[0];
      fill(COLOR_CURVE);
      noStroke();
      ellipse(hrToX(pt.tHr), logToY(pt.logPop), 4, 4);
    }
    return;
  }
  noFill();
  stroke(COLOR_CURVE);
  strokeWeight(2.5);
  beginShape();
  for (let i = 0; i < curvePoints.length; i++) {
    const p = curvePoints[i];
    vertex(hrToX(p.tHr), logToY(p.logPop));
  }
  endShape();

  // Marker at the leading edge
  const last = curvePoints[curvePoints.length - 1];
  noStroke();
  fill(SPECIES[speciesKey].color);
  ellipse(hrToX(last.tHr), logToY(last.logPop), 9, 9);
}

function drawBottomStrip() {
  // Background under the buttons
  noStroke();
  fill(COLOR_PANEL_BG);
  rect(0, titleHeight + drawHeight, canvasWidth, controlHeight);
  stroke(COLOR_PANEL_BORDER);
  noFill();
  rect(0.5, titleHeight + drawHeight + 0.5, canvasWidth - 1, controlHeight - 1);

  // Status text to the right of the Reset button
  noStroke();
  fill(COLOR_TEXT_DARK);
  textAlign(LEFT, CENTER);
  textSize(12);
  const statusX = panelWidth + plotMarginLeft + 90;
  const statusY = titleHeight + drawHeight + controlHeight / 2;
  if (simHours <= 0) {
    fill(COLOR_TEXT_MUTED);
    text('Press Start to simulate 24 hours of bacterial growth.', statusX, statusY);
  } else {
    const ph = phaseAt(simHours);
    const popLog = populationAt(simHours);
    const popStr = formatPopulation(popLog);
    fill(COLOR_TEXT_DARK);
    text('t = ' + simHours.toFixed(1) + ' h  •  phase: ' + ph + '  •  ~' + popStr + ' cells/mL',
         statusX, statusY);
  }
}

// ---- Hover tooltip over the plot ----
function drawHoverTooltip() {
  if (mouseX < plotX || mouseX > plotX + plotW) return;
  if (mouseY < plotY || mouseY > plotY + plotH) return;

  const tHr = xToHr(mouseX);
  // Only show tooltip up to the current simulation time
  const tShown = Math.min(tHr, Math.max(0.01, simHours > 0 ? simHours : tHr));
  const logPop = populationAt(tShown);
  const ph = phaseAt(tShown);
  const popStr = formatPopulation(logPop);

  // Vertical guide line
  stroke(100, 100, 100, 140);
  strokeWeight(1);
  line(mouseX, plotY, mouseX, plotY + plotH);

  // Marker on the modeled curve
  const cy = logToY(logPop);
  noStroke();
  fill(SPECIES[speciesKey].color);
  ellipse(mouseX, cy, 8, 8);

  // Tooltip box
  const lines = [
    't = ' + tShown.toFixed(1) + ' h',
    'phase: ' + ph,
    '~' + popStr + ' cells/mL',
    phaseDescription(ph)
  ];
  textSize(11);
  let boxW = 0;
  for (let i = 0; i < lines.length; i++) {
    boxW = Math.max(boxW, textWidth(lines[i]));
  }
  boxW += 14;
  const boxH = lines.length * 14 + 8;

  let bx = mouseX + 12;
  let by = mouseY + 12;
  if (bx + boxW > plotX + plotW) bx = mouseX - boxW - 12;
  if (by + boxH > plotY + plotH) by = mouseY - boxH - 12;

  noStroke();
  fill(255, 255, 255, 240);
  stroke(COLOR_PLOT_BORDER);
  strokeWeight(1);
  rect(bx, by, boxW, boxH, 4);

  noStroke();
  fill(COLOR_TEXT_DARK);
  textAlign(LEFT, TOP);
  for (let i = 0; i < lines.length; i++) {
    if (i === 1) fill(COLOR_TEXT_MUTED);
    else if (i === 3) fill(COLOR_TEXT_MUTED);
    else fill(COLOR_TEXT_DARK);
    text(lines[i], bx + 7, by + 4 + i * 14);
  }
}

// ---- Helpers ----
function hrToX(hr) {
  return plotX + (hr / simHoursMax) * plotW;
}
function xToHr(x) {
  return constrain((x - plotX) / plotW * simHoursMax, 0, simHoursMax);
}
function logToY(logVal) {
  // Y axis: bottom = 0 (10^0 = 1), top = 9 (10^9). Inverted.
  return plotY + plotH - (logVal / 9) * plotH;
}

function formatPopulation(logPop) {
  if (logPop < 0.05) return '~1';
  const v = Math.pow(10, logPop);
  if (v >= 1e9) return (v / 1e9).toFixed(1) + ' billion';
  if (v >= 1e6) return (v / 1e6).toFixed(1) + ' million';
  if (v >= 1e3) return (v / 1e3).toFixed(1) + ' thousand';
  return Math.round(v).toString();
}

// ---- Responsive resize ----
function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  layoutPlotArea();
  // Resize sliders to track the panel (panel width is fixed, so this is mostly a no-op,
  // but we keep the call for parity with other MicroSims in this textbook).
  tempSlider.size(panelWidth - 2 * panelPadX);
  nutSlider.size(panelWidth - 2 * panelPadX);
  speciesSelect.size(panelWidth - 2 * panelPadX);
  // Reposition reset button to follow the new graph origin (panel width is fixed)
  resetButton.position(panelWidth + plotMarginLeft, titleHeight + drawHeight + 6);
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.max(720, Math.floor(container.width));  // floor at 720 so panel + plot still fits
  canvasWidth = containerWidth;
}
