// pH Scale Explorer - Food Science MicroSim
// CANVAS_HEIGHT: 620
// Students drag food tiles onto the pH scale to identify acidity.

// ----- Layout constants -----
let canvasWidth = 760;
let drawHeight = 560;
let controlHeight = 60;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 14;
// Vertical layout
let titleY = 10;
let subtitleY = 36;
let regionLabelY = 60;     // ACIDIC / NEUTRAL / BASIC labels
let barTopY = 78;          // pH bar top
let barHeight = 60;
// staging area starts after bar + tick labels + a "drop zone" stripe for placed tiles
let dropZoneTop;            // y where placed tiles stack
let dropZoneHeight = 100;

// Region: pH gradient bar
let barX, barY, barW, barH;

// Region: staging area (food tiles)
let stagingY, stagingH;

// ----- Food data (pH values from standard food chemistry references) -----
let foods = [
  { name: 'Lemon Juice',  ph: 2.3, explanation: 'Citric acid gives lemons their sharp sour taste.', fact: 'Lemon juice helps activate baking soda in cakes, releasing CO2 bubbles.' },
  { name: 'Vinegar',      ph: 2.8, explanation: 'Acetic acid (about 5%) makes vinegar taste sour.', fact: 'Vinegar can preserve food by killing bacteria that need a neutral pH.' },
  { name: 'Cola',         ph: 2.5, explanation: 'Phosphoric and carbonic acids make cola surprisingly acidic.', fact: 'A can of cola is about as acidic as lemon juice!' },
  { name: 'Orange Juice', ph: 3.5, explanation: 'Citric and ascorbic acid (vitamin C) make OJ tangy.', fact: 'Vitamin C in OJ is most stable in acidic conditions.' },
  { name: 'Tomato',       ph: 4.5, explanation: 'Tomatoes contain malic and citric acid.', fact: 'Cooking tomatoes concentrates their acids and sweetens them.' },
  { name: 'Black Coffee', ph: 5.0, explanation: 'Chlorogenic and quinic acids form during roasting.', fact: 'Darker roasts are slightly less acidic than light roasts.' },
  { name: 'Milk',         ph: 6.6, explanation: 'Slightly acidic from dissolved CO2 and lactic acid.', fact: 'As milk spoils, bacteria make more lactic acid and pH drops.' },
  { name: 'Pure Water',   ph: 7.0, explanation: 'Neutral - equal H+ and OH- ions.', fact: 'Pure water is the reference point for the entire pH scale.' },
  { name: 'Egg White',    ph: 8.0, explanation: 'Slightly basic due to dissolved CO2 leaving over time.', fact: 'Older eggs are MORE basic - one reason they peel easier when boiled!' },
  { name: 'Baking Soda',  ph: 9.0, explanation: 'Sodium bicarbonate releases OH- ions in water.', fact: 'Baking soda neutralizes acids, which is why it reacts with vinegar.' }
];

// Tile state
let tiles = [];           // {food, x, y, w, h, placed, shaking, shakeTime, msg, msgTime}
let draggingTile = null;
let dragOffsetX = 0, dragOffsetY = 0;
let selectedTile = null;  // for click-to-learn popup

// UI controls
let showConcentrationCheckbox;
let resetButton;

// Hover info
let hoverPh = null;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Segoe UI, Arial, sans-serif');

  // pH bar region
  barX = margin;
  barY = barTopY;
  barW = canvasWidth - 2 * margin;
  barH = barHeight;

  // Drop zone (where correctly placed tiles stack below the bar)
  dropZoneTop = barY + barH + 50; // bar + tick labels + pH/H+ caption

  // Staging area for food tiles (sits below drop zone)
  stagingY = dropZoneTop + dropZoneHeight + 10;
  stagingH = drawHeight - stagingY - 10;

  // Build tiles in staging
  layoutTiles();

  // Controls
  showConcentrationCheckbox = createCheckbox(' Show H+ Concentration', false);
  showConcentrationCheckbox.position(15, drawHeight + 18);
  showConcentrationCheckbox.style('font-size', '14px');
  showConcentrationCheckbox.parent(document.querySelector('main'));

  resetButton = createButton('Reset');
  resetButton.position(canvasWidth - 90, drawHeight + 15);
  resetButton.mousePressed(resetAll);
  resetButton.parent(document.querySelector('main'));

  describe('Drag food tiles onto a pH gradient bar to identify whether foods are acidic, neutral, or basic.', LABEL);
}

function layoutTiles() {
  tiles = [];
  let tileW = 100;
  let tileH = 60;
  let gap = 8;
  let perRow = Math.max(1, Math.floor((canvasWidth - 2 * margin + gap) / (tileW + gap)));
  let rows = Math.ceil(foods.length / perRow);
  let startY = stagingY + 30;

  for (let i = 0; i < foods.length; i++) {
    let row = Math.floor(i / perRow);
    let col = i % perRow;
    let rowCount = (row === rows - 1) ? (foods.length - row * perRow) : perRow;
    let rowWidth = rowCount * tileW + (rowCount - 1) * gap;
    let startX = (canvasWidth - rowWidth) / 2;
    let x = startX + col * (tileW + gap);
    let y = startY + row * (tileH + gap);
    tiles.push({
      food: foods[i],
      homeX: x, homeY: y,
      x: x, y: y,
      w: tileW, h: tileH,
      placed: false,
      shaking: false,
      shakeTime: 0,
      msg: null,
      msgTime: 0
    });
  }
}

function draw() {
  updateCanvasSize();

  // Background: drawing region
  noStroke();
  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);

  // Control region
  noStroke();
  fill('white');
  stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  noStroke();
  fill('#2e7d32');
  textSize(20);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  text('pH Scale Explorer', margin, titleY);
  textStyle(NORMAL);

  // Subtitle (right aligned, same row as title to save vertical space)
  fill('#555');
  textSize(12);
  textAlign(RIGHT, TOP);
  text('Drag each food onto the scale at its correct pH', canvasWidth - margin, titleY + 4);

  // Draw the pH gradient bar
  drawPhBar();

  // Drop zone (between bar tick labels and staging area) — light dashed indicator
  noFill();
  stroke('#cfd8dc');
  strokeWeight(1);
  drawingContext.setLineDash([4, 4]);
  rect(margin, dropZoneTop, canvasWidth - 2 * margin, dropZoneHeight, 6);
  drawingContext.setLineDash([]);
  strokeWeight(1);
  noStroke();
  fill('#90a4ae');
  textSize(11);
  textStyle(ITALIC);
  textAlign(CENTER, CENTER);
  // only show hint if no tiles are placed yet
  let placedCount = tiles.filter(t => t.placed).length;
  if (placedCount === 0) {
    text('Drop foods onto the bar above', canvasWidth / 2, dropZoneTop + dropZoneHeight / 2);
  }
  textStyle(NORMAL);

  // Staging area boundary + label
  noStroke();
  fill(245, 245, 245);
  rect(margin, stagingY, canvasWidth - 2 * margin, stagingH, 8);
  noStroke();
  fill('#444');
  textSize(13);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text('Food Staging Area', margin + 10, stagingY + 8);
  textStyle(NORMAL);

  // Progress tracker
  textAlign(RIGHT, TOP);
  fill('#f57c00');
  textSize(13);
  textStyle(BOLD);
  text(`Progress: ${placedCount} of ${foods.length} placed correctly`,
       canvasWidth - margin - 10, stagingY + 8);
  textStyle(NORMAL);

  // Update shake animation
  for (let t of tiles) {
    if (t.shaking) {
      t.shakeTime++;
      if (t.shakeTime > 20) {
        t.shaking = false;
        t.shakeTime = 0;
        // return to home
        t.x = t.homeX;
        t.y = t.homeY;
      }
    }
    if (t.msg && millis() - t.msgTime > 1500) {
      t.msg = null;
    }
  }

  // Draw placed tiles (so they appear above bar)
  for (let t of tiles) {
    if (t.placed && t !== draggingTile) drawTile(t);
  }

  // Draw staging tiles
  for (let t of tiles) {
    if (!t.placed && t !== draggingTile) drawTile(t);
  }

  // Draw dragging tile on top
  if (draggingTile) drawTile(draggingTile);

  // Hover info for pH bar
  if (mouseY >= barY && mouseY <= barY + barH && mouseX >= barX && mouseX <= barX + barW && !draggingTile) {
    hoverPh = ((mouseX - barX) / barW) * 14;
    drawHoverIndicator(hoverPh);
  } else {
    hoverPh = null;
  }

  // Click-to-learn popup
  if (selectedTile) {
    drawPopup(selectedTile);
  }
}

function drawPhBar() {
  // Gradient: build via vertical stripes
  noStroke();
  for (let i = 0; i < barW; i++) {
    let ph = (i / barW) * 14;
    let c = phColor(ph);
    fill(c);
    rect(barX + i, barY, 1, barH);
  }

  // Border
  noFill();
  stroke('#333');
  strokeWeight(1);
  rect(barX, barY, barW, barH);
  strokeWeight(1);

  // Tick marks and labels
  let showConc = showConcentrationCheckbox && showConcentrationCheckbox.checked();
  textAlign(CENTER, TOP);
  textSize(11);
  for (let p = 0; p <= 14; p++) {
    let tx = barX + (p / 14) * barW;
    stroke('#222');
    line(tx, barY + barH, tx, barY + barH + 6);
    noStroke();
    fill('#222');
    if (showConc) {
      // approx H+ concentration: 10^-p M
      text(`10⁻${p}`, tx, barY + barH + 9);
    } else {
      text(p, tx, barY + barH + 9);
    }
  }

  // Region labels above the bar
  noStroke();
  textAlign(CENTER, BOTTOM);
  textSize(11);
  textStyle(BOLD);
  fill('#b71c1c');
  text('ACIDIC', barX + barW * 0.15, barY - 3);
  fill('#33691e');
  text('NEUTRAL', barX + barW * 0.5, barY - 3);
  fill('#0d47a1');
  text('BASIC', barX + barW * 0.85, barY - 3);
  textStyle(NORMAL);

  // Bottom secondary label
  if (showConc) {
    noStroke();
    fill('#555');
    textSize(11);
    textAlign(CENTER, TOP);
    text('H⁺ Concentration (Molar)', barX + barW / 2, barY + barH + 28);
  } else {
    noStroke();
    fill('#555');
    textSize(11);
    textAlign(CENTER, TOP);
    text('pH', barX + barW / 2, barY + barH + 28);
  }
}

function drawHoverIndicator(ph) {
  let x = barX + (ph / 14) * barW;
  stroke('#000');
  strokeWeight(2);
  line(x, barY - 8, x, barY + barH + 8);
  strokeWeight(1);
  noStroke();
  // tooltip
  let tw = 140;
  let th = 38;
  let tx = constrain(x + 8, barX, barX + barW - tw);
  let ty = barY + barH + 45;
  fill(255, 255, 255, 240);
  stroke('#888');
  rect(tx, ty, tw, th, 5);
  noStroke();
  fill('#222');
  textAlign(LEFT, TOP);
  textSize(12);
  text(`pH ≈ ${ph.toFixed(2)}`, tx + 6, ty + 5);
  let conc = Math.pow(10, -ph);
  text(`[H⁺] ≈ ${conc.toExponential(1)} M`, tx + 6, ty + 20);
}

function drawTile(t) {
  push();
  let dx = 0;
  if (t.shaking) {
    dx = sin(t.shakeTime * 1.2) * 6;
  }
  let x = t.x + dx;
  let y = t.y;

  // Tile shadow
  noStroke();
  fill(0, 0, 0, 30);
  rect(x + 2, y + 3, t.w, t.h, 6);

  // Tile body
  if (t.placed) {
    fill('#c8e6c9'); // light green when correctly placed
    stroke('#2e7d32');
  } else if (t === draggingTile) {
    fill('#fff3e0');
    stroke('#f57c00');
  } else {
    fill('white');
    stroke('#888');
  }
  strokeWeight(t.placed ? 2 : 1);
  rect(x, y, t.w, t.h, 6);
  strokeWeight(1);

  // Tile text
  noStroke();
  fill('#222');
  textAlign(CENTER, CENTER);
  textSize(12);
  textStyle(BOLD);
  // wrap name if needed
  let nameLines = wrapText(t.food.name, t.w - 10);
  let totalH = nameLines.length * 14;
  let startY = y + t.h / 2 - totalH / 2;
  if (t.placed) startY -= 6;
  for (let i = 0; i < nameLines.length; i++) {
    text(nameLines[i], x + t.w / 2, startY + i * 14);
  }
  textStyle(NORMAL);

  if (t.placed) {
    fill('#2e7d32');
    textSize(11);
    text(`pH ${t.food.ph}`, x + t.w / 2, y + t.h - 12);
  }

  // Floating message ("Try again")
  if (t.msg) {
    fill('#b71c1c');
    textSize(11);
    textStyle(BOLD);
    text(t.msg, x + t.w / 2, y - 8);
    textStyle(NORMAL);
  }

  pop();
}

function wrapText(s, maxW) {
  let words = s.split(' ');
  let lines = [];
  let line = '';
  textSize(12);
  for (let w of words) {
    let test = line ? line + ' ' + w : w;
    if (textWidth(test) > maxW && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawPopup(t) {
  let pw = 360;
  let ph = 180;
  let px = canvasWidth / 2 - pw / 2;
  let py = dropZoneTop - 20;

  // shadow
  noStroke();
  fill(0, 0, 0, 60);
  rect(px + 4, py + 5, pw, ph, 10);

  // panel
  fill(255);
  stroke('#2e7d32');
  strokeWeight(2);
  rect(px, py, pw, ph, 10);
  strokeWeight(1);

  // header bar
  noStroke();
  fill('#2e7d32');
  rect(px, py, pw, 28, 10, 10, 0, 0);

  // title
  fill('white');
  textAlign(LEFT, CENTER);
  textSize(14);
  textStyle(BOLD);
  text(`${t.food.name}  —  pH ${t.food.ph}`, px + 12, py + 14);
  textStyle(NORMAL);

  // close X
  textAlign(CENTER, CENTER);
  textSize(16);
  text('×', px + pw - 14, py + 14);

  // body
  noStroke();
  fill('#222');
  textAlign(LEFT, TOP);
  textSize(12);
  let bx = px + 12;
  let by = py + 38;
  let bw = pw - 24;

  textStyle(BOLD);
  text('Why this pH?', bx, by);
  textStyle(NORMAL);
  by += 16;
  by = drawWrapped(t.food.explanation, bx, by, bw, 14) + 8;

  textStyle(BOLD);
  fill('#f57c00');
  text('Food Science Fact', bx, by);
  textStyle(NORMAL);
  fill('#222');
  by += 16;
  drawWrapped(t.food.fact, bx, by, bw, 14);
}

function drawWrapped(s, x, y, maxW, lh) {
  let words = s.split(' ');
  let line = '';
  let cy = y;
  for (let w of words) {
    let test = line ? line + ' ' + w : w;
    if (textWidth(test) > maxW && line) {
      text(line, x, cy);
      cy += lh;
      line = w;
    } else {
      line = test;
    }
  }
  if (line) {
    text(line, x, cy);
    cy += lh;
  }
  return cy;
}

// ----- Color spectrum for pH bar -----
function phColor(ph) {
  // 0-7 red->orange->yellow->light green; 7-14 green->blue->purple
  ph = constrain(ph, 0, 14);
  if (ph <= 2) {
    return lerpColor(color('#b71c1c'), color('#e53935'), ph / 2);
  } else if (ph <= 4) {
    return lerpColor(color('#e53935'), color('#fb8c00'), (ph - 2) / 2);
  } else if (ph <= 6) {
    return lerpColor(color('#fb8c00'), color('#fdd835'), (ph - 4) / 2);
  } else if (ph <= 7) {
    return lerpColor(color('#fdd835'), color('#aed581'), (ph - 6));
  } else if (ph <= 8) {
    return lerpColor(color('#aed581'), color('#43a047'), (ph - 7));
  } else if (ph <= 10) {
    return lerpColor(color('#43a047'), color('#1e88e5'), (ph - 8) / 2);
  } else if (ph <= 12) {
    return lerpColor(color('#1e88e5'), color('#3949ab'), (ph - 10) / 2);
  } else {
    return lerpColor(color('#3949ab'), color('#6a1b9a'), (ph - 12) / 2);
  }
}

// ----- Mouse interaction -----
function mousePressed() {
  // Popup close check
  if (selectedTile) {
    let pw = 360, popupH = 180;
    let px = canvasWidth / 2 - pw / 2;
    let py = dropZoneTop - 20;
    // click outside or on X closes
    if (mouseX < px || mouseX > px + pw || mouseY < py || mouseY > py + popupH) {
      selectedTile = null;
      return;
    }
    // X button area
    if (mouseX > px + pw - 28 && mouseX < px + pw && mouseY > py && mouseY < py + 28) {
      selectedTile = null;
      return;
    }
    return;
  }

  // Check placed tiles for click-to-learn (topmost first)
  for (let i = tiles.length - 1; i >= 0; i--) {
    let t = tiles[i];
    if (t.placed && pointInTile(mouseX, mouseY, t)) {
      selectedTile = t;
      return;
    }
  }

  // Check tiles for drag start (topmost first; skip placed)
  for (let i = tiles.length - 1; i >= 0; i--) {
    let t = tiles[i];
    if (!t.placed && !t.shaking && pointInTile(mouseX, mouseY, t)) {
      draggingTile = t;
      dragOffsetX = mouseX - t.x;
      dragOffsetY = mouseY - t.y;
      return;
    }
  }
}

function mouseDragged() {
  if (draggingTile) {
    draggingTile.x = mouseX - dragOffsetX;
    draggingTile.y = mouseY - dragOffsetY;
  }
}

function mouseReleased() {
  if (!draggingTile) return;
  let t = draggingTile;
  draggingTile = null;

  // Check if dropped on the pH bar region
  let cx = t.x + t.w / 2;
  let cy = t.y + t.h / 2;
  if (cy >= barY - 10 && cy <= barY + barH + 30 && cx >= barX && cx <= barX + barW) {
    // Compute pH at drop position
    let droppedPh = ((cx - barX) / barW) * 14;
    let diff = Math.abs(droppedPh - t.food.ph);
    if (diff <= 0.5) {
      // Snap to correct (stack in drop zone below the bar)
      let snapX = barX + (t.food.ph / 14) * barW - t.w / 2;
      // keep tile inside canvas
      snapX = constrain(snapX, margin + 2, canvasWidth - margin - t.w - 2);
      let snapY = dropZoneTop + 8 + (Math.floor(t.food.ph) % 2) * 12;
      t.x = snapX;
      t.y = snapY;
      t.placed = true;
      t.msg = null;
    } else {
      // Wrong: shake and return
      t.shaking = true;
      t.shakeTime = 0;
      t.msg = 'Try again!';
      t.msgTime = millis();
    }
  } else {
    // Dropped elsewhere: snap back home
    t.x = t.homeX;
    t.y = t.homeY;
  }
}

function pointInTile(px, py, t) {
  return px >= t.x && px <= t.x + t.w && py >= t.y && py <= t.y + t.h;
}

function resetAll() {
  for (let t of tiles) {
    t.placed = false;
    t.shaking = false;
    t.shakeTime = 0;
    t.msg = null;
    t.x = t.homeX;
    t.y = t.homeY;
  }
  selectedTile = null;
}

// ----- Responsiveness -----
function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  // Recompute bar and staging
  barX = margin;
  barW = canvasWidth - 2 * margin;
  layoutTiles();
  // Recompute drop zone & staging on resize
  dropZoneTop = barY + barH + 50;
  stagingY = dropZoneTop + dropZoneHeight + 10;
  stagingH = drawHeight - stagingY - 10;
  // Replace placed tiles back to their snapped positions
  for (let t of tiles) {
    if (t.placed) {
      let snapX = barX + (t.food.ph / 14) * barW - t.w / 2;
      t.x = constrain(snapX, margin + 2, canvasWidth - margin - t.w - 2);
      t.y = dropZoneTop + 8 + (Math.floor(t.food.ph) % 2) * 12;
    }
  }
  if (resetButton) resetButton.position(canvasWidth - 90, drawHeight + 15);
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = container.offsetWidth;
    if (canvasWidth < 400) canvasWidth = 400;
  }
}
