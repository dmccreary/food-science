// Temperature Danger Zone - Food Science MicroSim
// CANVAS_HEIGHT: 760
// Students explore the temperature danger zone (40-140 deg F) and apply it to
// real food scenarios. They can change a food's temperature with a slider,
// see if it lands in the danger zone, and watch a 2-hour bacterial growth timer.

// ---- Layout constants ----
let canvasWidth = 760;
let drawHeight = 700;
let controlHeight = 60;
let canvasHeight = drawHeight + controlHeight;
let margin = 16;

// Title bar
let titleY = 8;
let subtitleY = 32;

// Thermometer geometry (left side)
let thermoX;          // center x of thermometer column
let thermoTopY = 70;  // top of mercury column
let thermoBotY = 500; // bottom of mercury column (just above bulb top)
let thermoColW = 38;  // width of the colored band column
let bulbR = 32;       // radius of bulb at the bottom
let tempMin = -20;
let tempMax = 250;

// Right panel (food cards + status)
let rightPanelX;
let rightPanelW;
let cardH = 56;
let cardGapY = 8;

// Two-hour timer panel (bottom)
let timerPanelY;
let timerPanelH = 130;

// Colors (food-science theme + zone colors)
const COLOR_BG = '#f1f8e9';
const COLOR_PRIMARY = '#2e7d32';
const COLOR_ACCENT = '#f57c00';
const COLOR_DARK = '#1b3a1b';
const COLOR_PANEL = '#ffffff';
const COLOR_PANEL_BORDER = '#c8e6c9';

// Zone colors
const ZONE_FROZEN = '#0d47a1';   // dark blue
const ZONE_FRIDGE = '#42a5f5';   // medium blue
const ZONE_DANGER = '#e53935';   // red
const ZONE_HOT = '#fb8c00';      // orange
const ZONE_COOK = '#bf360c';     // dark orange
const ZONE_BOIL = '#b71c1c';     // deep red

// Foods. safe_temp = recommended storage/serving F.
// holding = "hot hold" min F. If null, food should be cold-stored.
let foods = [
  { name: 'Chicken breast',  startTemp: 165, cookTo: 165, store: '<= 40 F',  hold: 140,
    note: 'Cook to 165 F to kill Salmonella. Then hot-hold above 140 F or chill below 40 F within 2 hours.' },
  { name: 'Sliced deli meat', startTemp: 38,  cookTo: null, store: '<= 40 F',  hold: null,
    note: 'Already cooked, but Listeria can grow in the fridge. Keep below 40 F and eat within a few days.' },
  { name: 'Potato salad',     startTemp: 72,  cookTo: null, store: '<= 40 F',  hold: null,
    note: 'Mayonnaise-based salads are a classic picnic risk. Keep on ice below 40 F.' },
  { name: 'Leftover rice',    startTemp: 95,  cookTo: 165, store: '<= 40 F',  hold: 140,
    note: 'Cooked rice can grow Bacillus cereus spores. Chill below 40 F within 1 hour if possible.' },
  { name: 'Fresh berries',    startTemp: 38,  cookTo: null, store: '<= 40 F',  hold: null,
    note: 'Low risk but mold grows faster warm. Keep refrigerated.' },
  { name: 'Cream soup',       startTemp: 130, cookTo: 165, store: '<= 40 F',  hold: 140,
    note: 'Dairy + protein = high risk. Hot-hold above 140 F or chill quickly below 40 F.' },
];

// State
let selectedFood = 2;       // start on potato salad (room temp - good teaching moment)
let currentTemp = foods[2].startTemp;
let tempSlider;
let resetButton;
let startTimerButton;

// Two-hour timer state
let timerRunning = false;
let timerStartMs = 0;
let timerElapsedMs = 0;   // accumulated when paused
let timerMaxMs = 120 * 1000; // 2 hours visualized as 120 seconds (1 sec = 1 min)
let pulsePhase = 0;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Segoe UI, Arial, sans-serif');

  layoutRegions();

  // Slider for temperature
  tempSlider = createSlider(tempMin, tempMax, currentTemp, 1);
  tempSlider.parent(document.querySelector('main'));
  tempSlider.style('width', '320px');
  tempSlider.position(margin + 90, drawHeight + 18);

  resetButton = createButton('Reset');
  resetButton.parent(document.querySelector('main'));
  resetButton.position(canvasWidth - 90, drawHeight + 14);
  resetButton.mousePressed(resetAll);

  startTimerButton = createButton('Start 2-Hour Timer');
  startTimerButton.parent(document.querySelector('main'));
  startTimerButton.position(canvasWidth - 240, drawHeight + 14);
  startTimerButton.mousePressed(toggleTimer);

  describe('Vertical thermometer showing temperature danger zone. Pick a food, adjust its temperature with the slider, and start a 2-hour timer to watch bacteria double every 20 minutes.', LABEL);
}

function layoutRegions() {
  thermoX = margin + 90;       // thermometer column center
  rightPanelX = 260;
  rightPanelW = canvasWidth - rightPanelX - margin;
  timerPanelY = drawHeight - timerPanelH - 8;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  layoutRegions();
  tempSlider.position(margin + 90, drawHeight + 18);
  resetButton.position(canvasWidth - 90, drawHeight + 14);
  startTimerButton.position(canvasWidth - 240, drawHeight + 14);
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = container.offsetWidth;
    if (canvasWidth < 480) canvasWidth = 480;
    if (canvasWidth > 760) canvasWidth = 760;
  }
}

function draw() {
  // Read slider
  currentTemp = tempSlider.value();
  pulsePhase += 0.06;

  background(COLOR_BG);

  drawTitle();
  drawThermometer();
  drawFoodCards();
  drawStatusPanel();
  drawTimerPanel();
  drawControlBar();
}

// ---- Title ----
function drawTitle() {
  noStroke();
  fill(COLOR_DARK);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(18);
  text('Temperature Danger Zone', margin, titleY);
  textStyle(NORMAL);
  textSize(12);
  fill(80);
  text('Pick a food. Move the slider. Watch bacteria multiply.', margin, subtitleY);
}

// ---- Thermometer ----
function drawThermometer() {
  // Zone bands (drawn behind the mercury column outline)
  // Each band is a horizontal slice across the thermometer width.
  drawZoneBand(212, 250, ZONE_BOIL,   'Boiling');
  drawZoneBand(165, 212, ZONE_COOK,   'Cooking temps');
  drawZoneBand(140, 165, ZONE_HOT,    'Hot holding');
  drawZoneBand(40,  140, ZONE_DANGER, 'DANGER ZONE');
  drawZoneBand(32,  40,  ZONE_FRIDGE, 'Refrigerator');
  drawZoneBand(-20, 32,  ZONE_FROZEN, 'Frozen');

  // Pulsing red glow over the danger band
  let alpha = 60 + 50 * sin(pulsePhase);
  let dangerTop = tempToY(140);
  let dangerBot = tempToY(40);
  noStroke();
  let glow = color(255, 0, 0);
  glow.setAlpha(alpha);
  fill(glow);
  rect(thermoX - thermoColW / 2 - 8, dangerTop - 4,
       thermoColW + 16, dangerBot - dangerTop + 8, 6);

  // Thermometer outline
  noFill();
  stroke(40);
  strokeWeight(2);
  rect(thermoX - thermoColW / 2, thermoTopY,
       thermoColW, thermoBotY - thermoTopY, thermoColW / 2, thermoColW / 2, 0, 0);

  // Bulb
  noStroke();
  fill(220, 50, 50);
  ellipse(thermoX, thermoBotY + bulbR - 4, bulbR * 2, bulbR * 2);
  stroke(40);
  strokeWeight(2);
  noFill();
  ellipse(thermoX, thermoBotY + bulbR - 4, bulbR * 2, bulbR * 2);

  // Tick marks every 20 F on the left side
  textAlign(RIGHT, CENTER);
  textSize(10);
  noStroke();
  fill(60);
  for (let t = -20; t <= 250; t += 20) {
    let y = tempToY(t);
    stroke(60);
    strokeWeight(1);
    line(thermoX - thermoColW / 2 - 6, y, thermoX - thermoColW / 2, y);
    noStroke();
    fill(60);
    text(t + ' F', thermoX - thermoColW / 2 - 10, y);
  }

  // Key boundary labels on right of thermometer
  drawBoundaryLabel(40, '40 F  Fridge limit');
  drawBoundaryLabel(140, '140 F Hot-hold min');
  drawBoundaryLabel(165, '165 F Safe cook');
  drawBoundaryLabel(212, '212 F Boiling');

  // Indicator arrow at currentTemp
  let arrowY = tempToY(currentTemp);
  let arrowColor = inDangerZone(currentTemp) ? color(229, 57, 53) : color(46, 125, 50);
  noStroke();
  fill(arrowColor);
  // Triangle pointing right -> at thermometer from the left
  triangle(thermoX - thermoColW / 2 - 28, arrowY - 8,
           thermoX - thermoColW / 2 - 28, arrowY + 8,
           thermoX - thermoColW / 2 - 8,  arrowY);
  // Temp label badge to the LEFT of the arrow
  drawTempBadge(thermoX - thermoColW / 2 - 90, arrowY, Math.round(currentTemp) + ' F', arrowColor);
}

function drawZoneBand(tLow, tHigh, c, label) {
  let yTop = tempToY(tHigh);
  let yBot = tempToY(tLow);
  noStroke();
  fill(c);
  rect(thermoX - thermoColW / 2, yTop, thermoColW, yBot - yTop);
}

function drawBoundaryLabel(t, label) {
  let y = tempToY(t);
  noStroke();
  fill(40);
  textAlign(LEFT, CENTER);
  textSize(10);
  text(label, thermoX + thermoColW / 2 + 10, y);
  stroke(40, 120);
  strokeWeight(1);
  line(thermoX + thermoColW / 2, y, thermoX + thermoColW / 2 + 8, y);
}

function drawTempBadge(x, y, label, c) {
  push();
  noStroke();
  fill(c);
  rect(x, y - 11, 70, 22, 4);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(12);
  textStyle(BOLD);
  text(label, x + 35, y);
  pop();
}

function tempToY(t) {
  // Map temperature to y coordinate (higher temp = higher up on thermometer)
  return map(t, tempMin, tempMax, thermoBotY, thermoTopY);
}

function inDangerZone(t) {
  return t >= 40 && t <= 140;
}

// ---- Food cards (right panel, top) ----
function drawFoodCards() {
  let cardsTop = 70;
  let cardW = (rightPanelW - 8) / 2;
  textAlign(LEFT, CENTER);

  for (let i = 0; i < foods.length; i++) {
    let col = i % 2;
    let row = Math.floor(i / 2);
    let x = rightPanelX + col * (cardW + 8);
    let y = cardsTop + row * (cardH + cardGapY);
    let isSel = (i === selectedFood);

    // Card body
    noStroke();
    if (isSel) {
      fill(COLOR_PRIMARY);
    } else {
      fill(COLOR_PANEL);
    }
    stroke(isSel ? COLOR_PRIMARY : COLOR_PANEL_BORDER);
    strokeWeight(isSel ? 2 : 1);
    rect(x, y, cardW, cardH, 6);

    // Name
    noStroke();
    fill(isSel ? 255 : COLOR_DARK);
    textStyle(BOLD);
    textSize(12);
    text(foods[i].name, x + 10, y + 18);

    // Default temp hint
    textStyle(NORMAL);
    textSize(10);
    fill(isSel ? 230 : 90);
    text('default ' + foods[i].startTemp + ' F', x + 10, y + 38);
  }
}

// ---- Status panel ----
function drawStatusPanel() {
  let panelTop = 70 + 3 * (cardH + cardGapY) + 8;
  let panelH = 130;
  let x = rightPanelX;
  let w = rightPanelW;

  // Panel body
  noStroke();
  fill(COLOR_PANEL);
  stroke(COLOR_PANEL_BORDER);
  strokeWeight(1);
  rect(x, panelTop, w, panelH, 6);

  let f = foods[selectedFood];
  let danger = inDangerZone(currentTemp);

  // Status header
  noStroke();
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(13);
  fill(COLOR_DARK);
  text(f.name + ' at ' + Math.round(currentTemp) + ' F', x + 10, panelTop + 8);

  // Danger / safe badge
  let badgeX = x + 10;
  let badgeY = panelTop + 30;
  let badgeW = 110;
  let badgeH = 22;
  noStroke();
  if (danger) {
    fill(ZONE_DANGER);
  } else {
    fill(COLOR_PRIMARY);
  }
  rect(badgeX, badgeY, badgeW, badgeH, 4);
  fill(255);
  textStyle(BOLD);
  textSize(12);
  textAlign(CENTER, CENTER);
  text(danger ? '! DANGER ZONE' : 'SAFE ZONE', badgeX + badgeW / 2, badgeY + badgeH / 2);

  // Safe time text
  textAlign(LEFT, TOP);
  textStyle(NORMAL);
  textSize(11);
  fill(COLOR_DARK);
  let safeTimeMsg = safeTimeForFood(f, currentTemp);
  text(safeTimeMsg, x + 130, badgeY + 4);

  // Recommendation
  textSize(10);
  fill(60);
  text('Store: ' + f.store + (f.hold ? '   Hot-hold: >= ' + f.hold + ' F' : ''),
       x + 10, panelTop + 62);

  // Tip note (wrapped)
  textSize(10);
  fill(40);
  textLeading(13);
  text(f.note, x + 10, panelTop + 80, w - 20, panelH - 88);
}

function safeTimeForFood(f, t) {
  if (t >= 40 && t <= 140) {
    if (t >= 90) return 'Safe for: about 1 hour';
    return 'Safe for: up to 2 hours (the "2-hour rule")';
  } else if (t < 40) {
    return 'Safe for: days (cold storage)';
  } else if (t < 165) {
    return 'Hot-holding zone: keep here for service';
  } else {
    return 'Cooked / hot enough to kill bacteria';
  }
}

// ---- Two-hour timer panel ----
function drawTimerPanel() {
  let x = margin;
  let y = timerPanelY;
  let w = canvasWidth - 2 * margin;
  let h = timerPanelH;

  noStroke();
  fill(COLOR_PANEL);
  stroke(COLOR_PANEL_BORDER);
  strokeWeight(1);
  rect(x, y, w, h, 8);

  // Header
  noStroke();
  fill(COLOR_DARK);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(13);
  text('2-Hour Rule: bacteria double every 20 min in the danger zone', x + 12, y + 10);

  // Compute elapsed
  let elapsed = timerElapsedMs;
  if (timerRunning) {
    elapsed = timerElapsedMs + (millis() - timerStartMs);
  }
  if (elapsed > timerMaxMs) {
    elapsed = timerMaxMs;
    timerRunning = false;
  }
  let minutes = Math.floor((elapsed / timerMaxMs) * 120);
  // Bacterial generations: 1 every 20 minutes -> at min m, generation = floor(m/20)
  let gen = Math.floor(minutes / 20);
  let pop = Math.pow(2, gen); // 1, 2, 4, 8, 16, 32, 64

  // Progress bar
  let barX = x + 12;
  let barY = y + 36;
  let barW = w - 24;
  let barH = 18;
  noStroke();
  fill(230);
  rect(barX, barY, barW, barH, 4);
  // Filled portion - red if currently in danger zone
  let fillC = inDangerZone(currentTemp) ? color(229, 57, 53) : color(46, 125, 50);
  fill(fillC);
  rect(barX, barY, barW * (elapsed / timerMaxMs), barH, 4);
  // Tick marks every 20 min
  stroke(120);
  strokeWeight(1);
  for (let m = 0; m <= 120; m += 20) {
    let tx = barX + (m / 120) * barW;
    line(tx, barY, tx, barY + barH);
  }
  // Labels under bar
  noStroke();
  fill(60);
  textStyle(NORMAL);
  textSize(9);
  textAlign(CENTER, TOP);
  for (let m = 0; m <= 120; m += 20) {
    let tx = barX + (m / 120) * barW;
    text(m + 'm', tx, barY + barH + 2);
  }

  // Population indicator
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(12);
  fill(COLOR_DARK);
  text('Elapsed: ' + minutes + ' min', x + 12, y + 76);
  text('Bacterial cells (per starting cell): ' + pop,
       x + 12, y + 94);

  // Visual: row of dots up to pop (cap at 64)
  let dotsStartX = x + 280;
  let dotsY = y + 82;
  let maxDots = 64;
  let dotsPerRow = 32;
  let dotR = 5;
  let dotGap = 3;
  let shown = Math.min(pop, maxDots);
  noStroke();
  fill(ZONE_DANGER);
  for (let i = 0; i < shown; i++) {
    let col = i % dotsPerRow;
    let row = Math.floor(i / dotsPerRow);
    let dx = dotsStartX + col * (dotR * 2 + dotGap);
    let dy = dotsY + row * (dotR * 2 + dotGap);
    ellipse(dx, dy, dotR * 2, dotR * 2);
  }

  // Warning if elapsed > 0 minutes and currentTemp not in danger zone
  if (timerRunning && !inDangerZone(currentTemp) && elapsed > 1000) {
    fill(COLOR_PRIMARY);
    textStyle(BOLD);
    textSize(10);
    textAlign(RIGHT, TOP);
    text('(safe temp - growth would be slower in reality)', x + w - 12, y + 12);
  }
}

// ---- Bottom control bar (labels for slider area) ----
function drawControlBar() {
  noStroke();
  fill(245);
  rect(0, drawHeight, canvasWidth, controlHeight);
  fill(COLOR_DARK);
  textStyle(BOLD);
  textSize(12);
  textAlign(LEFT, CENTER);
  text('Temperature:', margin, drawHeight + 28);
}

// ---- Input handlers ----
function mousePressed() {
  // Detect food card clicks
  let cardsTop = 70;
  let cardW = (rightPanelW - 8) / 2;
  for (let i = 0; i < foods.length; i++) {
    let col = i % 2;
    let row = Math.floor(i / 2);
    let x = rightPanelX + col * (cardW + 8);
    let y = cardsTop + row * (cardH + cardGapY);
    if (mouseX >= x && mouseX <= x + cardW &&
        mouseY >= y && mouseY <= y + cardH) {
      selectedFood = i;
      currentTemp = foods[i].startTemp;
      tempSlider.value(currentTemp);
      // Reset timer on food switch
      timerRunning = false;
      timerElapsedMs = 0;
      return;
    }
  }
}

function toggleTimer() {
  if (timerRunning) {
    // Pause
    timerElapsedMs += millis() - timerStartMs;
    timerRunning = false;
    startTimerButton.html('Resume Timer');
  } else {
    if (timerElapsedMs >= timerMaxMs) {
      timerElapsedMs = 0;
    }
    timerStartMs = millis();
    timerRunning = true;
    startTimerButton.html('Pause Timer');
  }
}

function resetAll() {
  selectedFood = 2;
  currentTemp = foods[selectedFood].startTemp;
  tempSlider.value(currentTemp);
  timerRunning = false;
  timerElapsedMs = 0;
  startTimerButton.html('Start 2-Hour Timer');
}
