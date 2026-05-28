// Sourdough Rise-and-Fall Cycle - Food Science MicroSim
// CANVAS_HEIGHT: 760
// Students explore how a sourdough starter rises and falls after feeding.
// They control temperature (60-90 F) and flour type (whole wheat vs white)
// and use the float test to identify peak fermentation activity.

// ---- Layout constants ----
let canvasWidth = 740;
let topSectionH = 250;     // Jar visualizer
let graphSectionH = 290;   // Activity graph
let controlBarH  = 180;    // Bottom controls
let drawHeight   = topSectionH + graphSectionH;
let canvasHeight = drawHeight + controlBarH;
let margin = 16;

// Colors (food-science palette)
const COLOR_BG = '#f1f8e9';
const COLOR_PRIMARY = '#2e7d32';      // green - peak window
const COLOR_ACCENT = '#f57c00';       // orange
const COLOR_DARK = '#1b3a1b';
const COLOR_PANEL = '#ffffff';
const COLOR_PANEL_BORDER = '#c8e6c9';
const COLOR_TOO_EARLY = '#e53935';    // red
const COLOR_FALLING = '#fbc02d';      // yellow
const COLOR_STARTER = '#d7b56d';      // tan/beige
const COLOR_STARTER_DARK = '#a8884a';
const COLOR_BUBBLE = '#fff8e1';

// Simulation state
let simTime = 0;           // hours since feeding (0-24)
let maxTime = 24;
let isPlaying = true;
let timeScale = 1.0;       // sim-hours per real-second
let lastFrameMs = 0;

// User controls
let tempSlider;
let flourSelect;
let feedButton;
let playPauseButton;
let speedSlider;

// Inspection state
let clickedTime = -1;      // -1 means no click

// Bubbles (visual flair in jar)
let bubbles = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Segoe UI, Arial, sans-serif');

  // Temperature slider
  tempSlider = createSlider(60, 90, 75, 1);
  tempSlider.parent(document.querySelector('main'));
  tempSlider.style('width', '220px');

  // Flour type selector
  flourSelect = createSelect();
  flourSelect.parent(document.querySelector('main'));
  flourSelect.option('White Flour (slower)');
  flourSelect.option('Whole Wheat (faster)');
  flourSelect.selected('White Flour (slower)');
  flourSelect.changed(onFlourChange);

  // Feed Starter button
  feedButton = createButton('Feed Starter (Reset)');
  feedButton.parent(document.querySelector('main'));
  feedButton.mousePressed(feedStarter);

  // Play/Pause button
  playPauseButton = createButton('Pause');
  playPauseButton.parent(document.querySelector('main'));
  playPauseButton.mousePressed(togglePlay);

  // Speed slider
  speedSlider = createSlider(0.25, 4, 1, 0.25);
  speedSlider.parent(document.querySelector('main'));
  speedSlider.style('width', '160px');

  positionControls();

  lastFrameMs = millis();
  seedBubbles();

  describe('Sourdough rise-fall simulation. A jar shows starter height in real time. Below it a graph plots starter height vs hours since feeding. Adjust temperature and flour type to see how the peak shifts.', LABEL);
}

function positionControls() {
  // Layout three rows of controls under the canvas
  let y0 = drawHeight + 16;
  let y1 = drawHeight + 56;
  let y2 = drawHeight + 96;
  let y3 = drawHeight + 140;

  tempSlider.position(margin + 140, y0);
  flourSelect.position(margin + 140, y1);
  feedButton.position(margin + 140, y2);
  playPauseButton.position(margin + 320, y2);
  speedSlider.position(margin + 480, y2);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = container.offsetWidth;
    if (canvasWidth < 520) canvasWidth = 520;
    if (canvasWidth > 740) canvasWidth = 740;
  }
}

function draw() {
  // Advance sim time
  let now = millis();
  let deltaSec = (now - lastFrameMs) / 1000;
  lastFrameMs = now;
  if (isPlaying) {
    simTime += deltaSec * speedSlider.value();
    if (simTime > maxTime) {
      simTime = maxTime;
      isPlaying = false;
      playPauseButton.html('Play');
    }
  }

  background(COLOR_BG);
  drawTitle();
  drawJarSection();
  drawGraphSection();
  drawControlPanel();
}

// ---------- Title ----------
function drawTitle() {
  push();
  noStroke();
  fill(COLOR_DARK);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(18);
  text('Sourdough Rise-and-Fall Cycle', margin, 8);
  textStyle(NORMAL);
  textSize(12);
  fill(80);
  text('Watch your starter rise, peak, and fall. Catch the peak to pass the float test.', margin, 30);
  pop();
}

// ---------- Cycle model ----------
// Returns starter height percent (0-100) at hours-since-feeding t.
// Peak time and amplitude shift with temperature & flour type.
function peakTime(temp, flourFactor) {
  // 60 F -> 12h, 90 F -> 4h (linear in temp), shortened ~25% by whole wheat
  let base = map(temp, 60, 90, 12, 4);
  return base * flourFactor;   // flourFactor < 1 for whole wheat
}

function peakHeight(flourFactor) {
  // Whole wheat rises a bit higher (~90), white tops out ~75
  return flourFactor < 1 ? 92 : 78;
}

function starterHeightAt(t, temp, flourFactor) {
  if (t <= 0) return 10;
  let tp = peakTime(temp, flourFactor);
  let h = peakHeight(flourFactor);
  // Rise: smooth sigmoid up to peak
  // Fall: gentler decline from peak
  if (t <= tp) {
    // Sigmoid-ish using a cosine-eased curve: starts at 10, ends at h
    let x = t / tp;                  // 0..1
    let eased = 0.5 - 0.5 * cos(PI * x);  // 0..1 smooth
    return 10 + (h - 10) * eased;
  } else {
    // Decline: half-life style, but bounded above 25 over a few hours
    let dt = t - tp;
    let halfLife = 4;   // hours to fall halfway from peak toward baseline
    let baseline = 30;
    return baseline + (h - baseline) * pow(0.5, dt / halfLife);
  }
}

function yeastActivityAt(t, temp, flourFactor) {
  // Proxy: derivative-ish of height, but simpler: peaks at peak time
  let tp = peakTime(temp, flourFactor);
  if (t <= 0) return 5;
  if (t <= tp) {
    let x = t / tp;
    return 10 + 85 * x;          // ramps up
  } else {
    let dt = t - tp;
    return max(20, 95 - dt * 6); // falls after peak (food running out)
  }
}

function acidLevelAt(t, temp, flourFactor) {
  // Acid keeps rising over time, slows after peak
  // 0-100 scale; whole wheat builds faster
  let rate = flourFactor < 1 ? 4.2 : 3.4;
  return constrain(8 + rate * t, 0, 100);
}

function phEstimate(acidPct) {
  // Fresh feed ~ pH 5.5; mature sour ~ pH 3.6
  return map(acidPct, 0, 100, 5.5, 3.6);
}

function getFlourFactor() {
  // Whole wheat shortens peak time (factor < 1)
  return flourSelect.value().indexOf('Whole Wheat') >= 0 ? 0.75 : 1.0;
}

function passesFloatTest(t, temp, flourFactor) {
  let tp = peakTime(temp, flourFactor);
  // Pass within a 1.5h window centered on peak
  return t >= tp - 0.75 && t <= tp + 0.75;
}

function zoneForTime(t, temp, flourFactor) {
  let tp = peakTime(temp, flourFactor);
  if (t < tp - 0.75) return 'early';
  if (t <= tp + 0.75) return 'peak';
  return 'falling';
}

// ---------- Jar Section ----------
function drawJarSection() {
  push();

  let temp = tempSlider.value();
  let ff = getFlourFactor();
  let heightPct = starterHeightAt(simTime, temp, ff);
  let zone = zoneForTime(simTime, temp, ff);

  // Section background
  noStroke();
  fill(COLOR_PANEL);
  stroke(COLOR_PANEL_BORDER);
  strokeWeight(1);
  rect(margin, 50, canvasWidth - 2 * margin, topSectionH - 8, 8);

  // Jar geometry — sits inside the top panel with room for the rise badge below
  let jarX = margin + 40;
  let jarY = 72;
  let jarW = 110;
  let jarH = 130;
  let jarTopRim = 6;

  // Original (post-feeding) level mark line
  let baselinePct = 25;     // visual baseline = post-feeding fill
  let baselineY = jarY + jarH - (baselinePct / 100) * jarH;

  // Compute current starter top y inside jar
  // Scale heightPct so 100% reaches near top of jar
  let starterTopY = jarY + jarH - (heightPct / 100) * jarH;
  starterTopY = max(starterTopY, jarY + 16);

  // Draw jar back panel (slight shadow)
  noStroke();
  fill(220, 235, 200, 100);
  rect(jarX - 4, jarY - 2, jarW + 8, jarH + 8, 14);

  // Draw starter inside jar (fills from bottom to starterTopY)
  noStroke();
  fill(COLOR_STARTER);
  rect(jarX + 4, starterTopY, jarW - 8, jarY + jarH - starterTopY - 4, 0, 0, 10, 10);
  // Darker top edge (bubble crust)
  fill(COLOR_STARTER_DARK);
  rect(jarX + 4, starterTopY, jarW - 8, 6, 4);

  // Draw bubbles in starter
  updateBubbles(temp, ff, simTime);
  for (let b of bubbles) {
    let bx = jarX + 4 + b.x * (jarW - 8);
    let by = starterTopY + b.y * (jarY + jarH - starterTopY - 4);
    if (by > starterTopY + 4 && by < jarY + jarH - 4) {
      noStroke();
      fill(COLOR_BUBBLE);
      ellipse(bx, by, b.r * 2, b.r * 2);
    }
  }

  // Draw jar outline (transparent glass)
  noFill();
  stroke(120, 140, 110);
  strokeWeight(2);
  rect(jarX, jarY, jarW, jarH, 0, 0, 14, 14);
  // Jar rim
  noStroke();
  fill(180, 200, 170);
  rect(jarX - 6, jarY - jarTopRim, jarW + 12, jarTopRim, 4);

  // Baseline marker (rubber band: where it started after feeding)
  stroke(COLOR_ACCENT);
  strokeWeight(2);
  drawingContext.setLineDash([4, 4]);
  line(jarX - 8, baselineY, jarX + jarW + 8, baselineY);
  drawingContext.setLineDash([]);
  noStroke();
  fill(COLOR_ACCENT);
  textAlign(LEFT, CENTER);
  textSize(10);
  text('start line', jarX + jarW + 10, baselineY);

  // Height percent badge
  let badgeC = zone === 'peak' ? color(COLOR_PRIMARY) :
               zone === 'early' ? color(COLOR_TOO_EARLY) :
               color(COLOR_FALLING);
  noStroke();
  fill(badgeC);
  rect(jarX, jarY + jarH + 6, jarW, 22, 4);
  fill(255);
  textStyle(BOLD);
  textSize(12);
  textAlign(CENTER, CENTER);
  text('Rise: ' + Math.round(heightPct) + '%', jarX + jarW / 2, jarY + jarH + 17);

  // ---- Float test (water glass + spoonful) ----
  let glassX = jarX + jarW + 80;
  let glassY = jarY + 18;
  let glassW = 90;
  let glassH = jarH - 30;
  drawFloatTest(glassX, glassY, glassW, glassH, zone, simTime, temp, ff);

  // Right info panel
  let infoX = glassX + glassW + 24;
  let infoY = jarY - 6;
  let infoW = canvasWidth - infoX - margin - 8;
  if (infoW > 120) {
    drawJarInfo(infoX, infoY, infoW, simTime, temp, ff, heightPct, zone);
  }

  textStyle(NORMAL);
  pop();
}

function drawFloatTest(x, y, w, h, zone, t, temp, ff) {
  push();
  // Water glass
  noStroke();
  fill(220, 240, 250, 200);
  rect(x, y, w, h, 0, 0, 12, 12);
  noFill();
  stroke(140, 170, 190);
  strokeWeight(2);
  rect(x, y, w, h, 0, 0, 12, 12);
  // Water surface
  let waterY = y + 18;
  noStroke();
  fill(180, 215, 235, 220);
  rect(x + 2, waterY, w - 4, h - 22, 0, 0, 10, 10);
  // Surface highlight line
  stroke(255, 255, 255, 160);
  strokeWeight(1);
  line(x + 4, waterY, x + w - 4, waterY);

  // Label above
  noStroke();
  fill(COLOR_DARK);
  textStyle(BOLD);
  textSize(11);
  textAlign(CENTER, BOTTOM);
  text('Float Test', x + w / 2, y - 4);

  // Spoonful of starter as a blob
  let spoonR = 18;
  let blobX = x + w / 2;
  let blobY;
  if (zone === 'peak') {
    // Floats on top
    blobY = waterY + spoonR * 0.3;
  } else if (zone === 'early') {
    // Sinks to bottom
    blobY = y + h - spoonR - 4;
  } else {
    // Falling: half-sinks
    blobY = y + h * 0.6;
  }
  // Smooth bob
  blobY += sin(millis() * 0.003) * 1.5;

  // Blob shadow
  noStroke();
  fill(0, 0, 0, 30);
  ellipse(blobX + 1, blobY + 2, spoonR * 2.1, spoonR * 1.6);
  // Blob
  fill(COLOR_STARTER);
  ellipse(blobX, blobY, spoonR * 2.1, spoonR * 1.6);
  // Bubbles on blob (only when floating)
  if (zone === 'peak') {
    fill(COLOR_BUBBLE);
    ellipse(blobX - 5, blobY - 4, 4, 4);
    ellipse(blobX + 4, blobY - 6, 5, 5);
    ellipse(blobX - 2, blobY + 2, 3, 3);
  }

  // Result badge
  let pass = (zone === 'peak');
  noStroke();
  fill(pass ? color(COLOR_PRIMARY) : color(COLOR_TOO_EARLY));
  rect(x, y + h + 6, w, 22, 4);
  fill(255);
  textStyle(BOLD);
  textSize(11);
  textAlign(CENTER, CENTER);
  text(pass ? 'PASSES (floats)' : 'FAILS (sinks)', x + w / 2, y + h + 17);
  pop();
}

function drawJarInfo(x, y, w, t, temp, ff, heightPct, zone) {
  push();
  let panelH = 184;
  noStroke();
  fill(255);
  stroke(COLOR_PANEL_BORDER);
  strokeWeight(1);
  rect(x, y, w, panelH, 6);

  noStroke();
  fill(COLOR_DARK);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(12);
  text('Time since feeding', x + 10, y + 8);
  textStyle(NORMAL);
  textSize(18);
  fill(COLOR_PRIMARY);
  text(simTime.toFixed(1) + ' h', x + 10, y + 24);

  // Zone label
  textSize(11);
  textStyle(BOLD);
  let zoneC = zone === 'peak' ? color(COLOR_PRIMARY) :
              zone === 'early' ? color(COLOR_TOO_EARLY) :
              color(COLOR_FALLING);
  fill(zoneC);
  let zoneLabel = zone === 'peak' ? 'PEAK WINDOW' :
                  zone === 'early' ? 'TOO EARLY' :
                  'FALLING';
  text(zoneLabel, x + 10, y + 52);

  // Peak time hint
  textStyle(NORMAL);
  fill(60);
  textSize(10);
  let tp = peakTime(temp, ff);
  text('Predicted peak: ~' + tp.toFixed(1) + ' h', x + 10, y + 70);
  text('Temp: ' + temp + ' F  ' + (ff < 1 ? '(whole wheat)' : '(white)'), x + 10, y + 86);

  // Mini bars: yeast & acid
  let yeast = yeastActivityAt(simTime, temp, ff);
  let acid = acidLevelAt(simTime, temp, ff);
  drawMiniBar(x + 10, y + 108, w - 20, 'Yeast activity', yeast, color(COLOR_PRIMARY));
  drawMiniBar(x + 10, y + 132, w - 20, 'Acid level', acid, color(COLOR_ACCENT));

  pop();
}

function drawMiniBar(x, y, w, label, pct, c) {
  push();
  noStroke();
  fill(60);
  textSize(10);
  textAlign(LEFT, TOP);
  text(label + ': ' + Math.round(pct) + '%', x, y);
  // Track
  fill(230);
  rect(x, y + 12, w, 8, 4);
  // Fill
  fill(c);
  rect(x, y + 12, w * (pct / 100), 8, 4);
  pop();
}

// ---------- Bubbles inside jar ----------
function seedBubbles() {
  bubbles = [];
  for (let i = 0; i < 16; i++) {
    bubbles.push({
      x: random(0.1, 0.9),
      y: random(0.15, 0.95),
      r: random(2, 5),
      vy: random(0.0008, 0.0025),
    });
  }
}

function updateBubbles(temp, ff, t) {
  let activity = yeastActivityAt(t, temp, ff) / 100;
  for (let b of bubbles) {
    b.y -= b.vy * (0.5 + activity * 2);
    if (b.y < 0.05) {
      b.y = random(0.7, 0.95);
      b.x = random(0.1, 0.9);
      b.r = random(2, 5);
    }
  }
}

// ---------- Graph Section ----------
function drawGraphSection() {
  push();

  let temp = tempSlider.value();
  let ff = getFlourFactor();

  let gx = margin + 50;
  let gy = topSectionH + 40;
  let gw = canvasWidth - gx - margin - 110;
  let gh = graphSectionH - 70;

  // Panel
  noStroke();
  fill(COLOR_PANEL);
  stroke(COLOR_PANEL_BORDER);
  strokeWeight(1);
  rect(margin, topSectionH + 8, canvasWidth - 2 * margin, graphSectionH - 16, 8);

  // Section title
  noStroke();
  fill(COLOR_DARK);
  textStyle(BOLD);
  textSize(13);
  textAlign(LEFT, TOP);
  text('Activity Graph - Starter height vs. hours since feeding', margin + 12, topSectionH + 16);

  // Zone bands (background fills): early, peak, falling
  let tp = peakTime(temp, ff);
  let peakL = constrain(tp - 0.75, 0, maxTime);
  let peakR = constrain(tp + 0.75, 0, maxTime);
  drawZoneBand(gx, gy, gw, gh, 0,     peakL,    color(229, 57, 53, 40));    // red
  drawZoneBand(gx, gy, gw, gh, peakL, peakR,    color(46, 125, 50, 55));    // green
  drawZoneBand(gx, gy, gw, gh, peakR, maxTime,  color(251, 192, 45, 50));   // yellow

  // Axes
  stroke(120);
  strokeWeight(1);
  line(gx, gy, gx, gy + gh);              // y axis
  line(gx, gy + gh, gx + gw, gy + gh);    // x axis

  // X-axis ticks (every 4 hours)
  noStroke();
  fill(60);
  textSize(10);
  textAlign(CENTER, TOP);
  for (let h = 0; h <= maxTime; h += 4) {
    let xx = gx + (h / maxTime) * gw;
    stroke(180);
    strokeWeight(1);
    line(xx, gy + gh, xx, gy + gh + 4);
    noStroke();
    fill(60);
    text(h + 'h', xx, gy + gh + 6);
  }
  textAlign(CENTER, TOP);
  text('Hours since feeding', gx + gw / 2, gy + gh + 22);

  // Y-axis ticks
  textAlign(RIGHT, CENTER);
  for (let p = 0; p <= 100; p += 25) {
    let yy = gy + gh - (p / 100) * gh;
    stroke(180);
    strokeWeight(1);
    line(gx - 4, yy, gx, yy);
    noStroke();
    fill(60);
    text(p + '%', gx - 6, yy);
  }
  push();
  translate(margin + 14, gy + gh / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, CENTER);
  textSize(10);
  fill(60);
  noStroke();
  text('Starter height (%)', 0, 0);
  pop();

  // Plot the curve (sampled densely)
  noFill();
  stroke(COLOR_DARK);
  strokeWeight(2);
  beginShape();
  for (let i = 0; i <= 240; i++) {
    let tt = (i / 240) * maxTime;
    let pct = starterHeightAt(tt, temp, ff);
    let xx = gx + (tt / maxTime) * gw;
    let yy = gy + gh - (pct / 100) * gh;
    vertex(xx, yy);
  }
  endShape();

  // Current-time marker (vertical line + dot)
  let curX = gx + (simTime / maxTime) * gw;
  let curPct = starterHeightAt(simTime, temp, ff);
  let curY = gy + gh - (curPct / 100) * gh;
  stroke(COLOR_ACCENT);
  strokeWeight(1.5);
  drawingContext.setLineDash([3, 3]);
  line(curX, gy, curX, gy + gh);
  drawingContext.setLineDash([]);
  noStroke();
  fill(COLOR_ACCENT);
  ellipse(curX, curY, 10, 10);

  // Right-side bars: yeast & acid
  let barX = gx + gw + 20;
  let barW = 28;
  let barH = gh;
  let yeast = yeastActivityAt(simTime, temp, ff);
  let acid = acidLevelAt(simTime, temp, ff);
  drawVerticalBar(barX, gy, barW, barH, yeast, color(COLOR_PRIMARY), 'Yeast');
  drawVerticalBar(barX + barW + 18, gy, barW, barH, acid, color(COLOR_ACCENT), 'Acid');

  // Tooltip on clicked point
  if (clickedTime >= 0 && clickedTime <= maxTime) {
    drawTooltip(gx, gy, gw, gh, clickedTime, temp, ff);
  }

  // Legend (zones)
  let legendY = gy + gh + 38;
  drawLegendSwatch(gx,         legendY, color(229, 57, 53), 'Too early - sinks');
  drawLegendSwatch(gx + 150,   legendY, color(46, 125, 50), 'Peak - floats');
  drawLegendSwatch(gx + 310,   legendY, color(251, 192, 45), 'Falling - declining');

  pop();
}

function drawZoneBand(gx, gy, gw, gh, t0, t1, c) {
  if (t1 <= t0) return;
  let x0 = gx + (t0 / maxTime) * gw;
  let x1 = gx + (t1 / maxTime) * gw;
  noStroke();
  fill(c);
  rect(x0, gy, x1 - x0, gh);
}

function drawVerticalBar(x, y, w, h, pct, c, label) {
  push();
  // Track
  noStroke();
  fill(235);
  rect(x, y, w, h, 4);
  // Fill from bottom
  let fillH = (pct / 100) * h;
  fill(c);
  rect(x, y + h - fillH, w, fillH, 4);
  // Label above
  fill(60);
  textSize(9);
  textAlign(CENTER, BOTTOM);
  text(label, x + w / 2, y - 2);
  // Percent at top
  fill(COLOR_DARK);
  textStyle(BOLD);
  textSize(10);
  textAlign(CENTER, TOP);
  text(Math.round(pct) + '%', x + w / 2, y + h + 4);
  pop();
}

function drawLegendSwatch(x, y, c, label) {
  push();
  noStroke();
  fill(c);
  rect(x, y, 14, 12, 3);
  fill(60);
  textSize(10);
  textAlign(LEFT, CENTER);
  text(label, x + 20, y + 6);
  pop();
}

function drawTooltip(gx, gy, gw, gh, t, temp, ff) {
  push();
  let pct = starterHeightAt(t, temp, ff);
  let yeast = yeastActivityAt(t, temp, ff);
  let acid = acidLevelAt(t, temp, ff);
  let ph = phEstimate(acid);
  let zone = zoneForTime(t, temp, ff);
  let pass = zone === 'peak';

  let px = gx + (t / maxTime) * gw;
  let py = gy + gh - (pct / 100) * gh;

  // Marker dot
  noStroke();
  fill(20);
  ellipse(px, py, 7, 7);

  // Tooltip box
  let tw = 175;
  let th = 90;
  let tx = px + 10;
  if (tx + tw > gx + gw) tx = px - 10 - tw;
  let ty = py - th - 10;
  if (ty < gy) ty = py + 10;

  noStroke();
  let bg = color(30, 50, 30);
  bg.setAlpha(235);
  fill(bg);
  rect(tx, ty, tw, th, 5);

  fill(255);
  textStyle(BOLD);
  textSize(11);
  textAlign(LEFT, TOP);
  text('At ' + t.toFixed(1) + ' h after feeding', tx + 8, ty + 6);
  textStyle(NORMAL);
  textSize(10);
  text('Height: ' + Math.round(pct) + '%', tx + 8, ty + 24);
  text('Yeast activity: ' + Math.round(yeast) + '%', tx + 8, ty + 38);
  text('Estimated pH: ' + ph.toFixed(2), tx + 8, ty + 52);
  fill(pass ? color(180, 255, 180) : color(255, 180, 180));
  textStyle(BOLD);
  text('Float test: ' + (pass ? 'PASSES' : 'FAILS'), tx + 8, ty + 68);
  pop();
}

// ---------- Control Panel labels ----------
function drawControlPanel() {
  push();
  noStroke();
  fill(245);
  rect(0, drawHeight, canvasWidth, controlBarH);

  fill(COLOR_DARK);
  textStyle(BOLD);
  textSize(12);
  textAlign(LEFT, CENTER);
  text('Temperature:', margin, drawHeight + 28);
  text('Flour Type:', margin, drawHeight + 68);
  text('Controls:', margin, drawHeight + 108);
  text('Speed:', margin + 440, drawHeight + 108);

  // Show current temp value next to slider
  textStyle(NORMAL);
  textSize(11);
  fill(60);
  let temp = tempSlider.value();
  text(temp + ' F  (' +
       (temp <= 65 ? 'cold - slow' :
        temp <= 75 ? 'cool' :
        temp <= 82 ? 'warm' : 'hot - fast') + ')',
       margin + 370, drawHeight + 28);

  // Speed label
  textSize(11);
  text(speedSlider.value().toFixed(2) + ' h/sec', margin + 640, drawHeight + 108);

  // Tips at bottom
  textSize(11);
  fill(COLOR_DARK);
  textAlign(LEFT, TOP);
  text('Tip: click the graph to inspect any time point. Reach the green zone to pass the float test!',
       margin, drawHeight + 148);

  pop();
}

// ---------- Input handlers ----------
function mousePressed() {
  // Click on graph -> set clickedTime
  let temp = tempSlider.value();
  let ff = getFlourFactor();

  let gx = margin + 50;
  let gy = topSectionH + 40;
  let gw = canvasWidth - gx - margin - 110;
  let gh = graphSectionH - 70;

  if (mouseX >= gx && mouseX <= gx + gw &&
      mouseY >= gy && mouseY <= gy + gh) {
    let t = ((mouseX - gx) / gw) * maxTime;
    clickedTime = constrain(t, 0, maxTime);
    return;
  }
  // Click anywhere else in graph panel area clears tooltip
  if (mouseY > topSectionH + 8 && mouseY < drawHeight - 8) {
    clickedTime = -1;
  }
}

function feedStarter() {
  simTime = 0;
  clickedTime = -1;
  isPlaying = true;
  playPauseButton.html('Pause');
  seedBubbles();
}

function togglePlay() {
  isPlaying = !isPlaying;
  playPauseButton.html(isPlaying ? 'Pause' : 'Play');
  if (isPlaying && simTime >= maxTime) {
    simTime = 0;
  }
}

function onFlourChange() {
  // Reset clicked tooltip since curve geometry changed
  clickedTime = -1;
}
