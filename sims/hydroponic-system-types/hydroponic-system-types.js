// Hydroponic System Types Comparison - Food Science MicroSim
// CANVAS_HEIGHT: 760
// Four hydroponic system cards (DWC, NFT, Kratky, Wick). Click a card to
// reveal equipment / best crops / pros / cons in a modal. Three sliders at
// the bottom (Budget, Power, Crop Size) highlight the recommended system
// with a green glow.

// ----- Layout constants -----
let canvasWidth = 760;
let drawHeight = 425;
let controlHeight = 200;
let canvasHeight = drawHeight + controlHeight;
let margin = 15;

// Card geometry
let cardTop = 60;
let cardH = 350;
let cardW;          // computed in computeLayout()
let cardGap = 10;

// Colors
const COLOR_BG = [241, 248, 233];        // #f1f8e9
const COLOR_GREEN = [46, 125, 50];       // #2e7d32
const COLOR_ORANGE = [245, 124, 0];      // #f57c00
const COLOR_WATER = [30, 136, 229];      // #1e88e5
const COLOR_PLANT = [76, 175, 80];       // leaf green
const COLOR_DARK = [33, 33, 33];
const COLOR_CARDBG = [255, 255, 255];

// System data
let systems = [
  {
    id: 'DWC',
    name: 'DWC',
    fullName: 'Deep Water Culture',
    accent: [30, 136, 229],
    equipment: ['Container / reservoir', 'Net cups', 'Air pump', 'Air stone', 'Nutrient solution'],
    bestCrops: ['Lettuce', 'Herbs', 'Basil'],
    pros: ['High yields', 'Fast growth', 'Simple to build'],
    cons: ['Needs electricity', 'Pump failure is catastrophic'],
    needsPower: true,
    cost: 'medium',
    cropSize: 'small-large'
  },
  {
    id: 'NFT',
    name: 'NFT',
    fullName: 'Nutrient Film Technique',
    accent: [33, 150, 243],
    equipment: ['Pump', 'PVC channels', 'Reservoir', 'Timer'],
    bestCrops: ['Lettuce', 'Strawberries', 'Herbs'],
    pros: ['Highly water-efficient', 'Compact', 'Recirculates nutrients'],
    cons: ['Pump-dependent', 'Roots dry out in power failure'],
    needsPower: true,
    cost: 'medium-high',
    cropSize: 'small-medium'
  },
  {
    id: 'Kratky',
    name: 'Kratky',
    fullName: 'Kratky Method',
    accent: [121, 85, 72],
    equipment: ['Opaque container', 'Net cups', 'Nutrient solution', '(No pump)'],
    bestCrops: ['Leafy greens', 'Herbs', 'Lettuce'],
    pros: ['No electricity', 'Very low cost', 'Minimal maintenance'],
    cons: ['Not for long-season crops', 'Water not recirculated', 'Limited to small/medium plants'],
    needsPower: false,
    cost: 'low',
    cropSize: 'small-medium'
  },
  {
    id: 'Wick',
    name: 'Wick',
    fullName: 'Wick System',
    accent: [141, 110, 99],
    equipment: ['Container', 'Wick material', 'Growing medium', 'Nutrient solution'],
    bestCrops: ['Herbs', 'Small lettuces', 'Microgreens'],
    pros: ['Zero moving parts', 'Lowest cost', 'Beginner-friendly'],
    cons: ['Slow nutrient delivery', 'Limited to small crops only'],
    needsPower: false,
    cost: 'low',
    cropSize: 'small'
  }
];

// Modal state
let selectedSystem = null;

// Sliders
let budgetSlider;       // 0 = low, 1 = high
let powerSlider;        // 0 = no, 1 = yes
let cropSizeSlider;     // 0 = small, 1 = large
let resetButton;

// Animation
let animPhase = 0;

// ----- Helpers -----
function updateCanvasSize() {
  const container = document.querySelector('main').parentElement;
  const rect = container.getBoundingClientRect();
  canvasWidth = Math.max(420, Math.floor(rect.width)) - 2;
  if (canvasWidth > 900) canvasWidth = 900;
}

function computeLayout() {
  // 4 cards side-by-side with gaps
  let totalGap = 5 * cardGap; // outer + 3 between + outer
  cardW = Math.floor((canvasWidth - totalGap) / 4);
  if (cardW < 140) cardW = 140;
  if (cardW > 200) cardW = 200;
}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Segoe UI, Arial, sans-serif');
  computeLayout();

  // Sliders
  let sliderY = drawHeight + 30;
  budgetSlider = createSlider(0, 100, 30, 1);
  budgetSlider.position(170, sliderY);
  budgetSlider.size(180);

  powerSlider = createSlider(0, 1, 1, 1);
  powerSlider.position(170, sliderY + 40);
  powerSlider.size(180);

  cropSizeSlider = createSlider(0, 100, 25, 1);
  cropSizeSlider.position(170, sliderY + 80);
  cropSizeSlider.size(180);

  resetButton = createButton('Reset');
  resetButton.position(15, sliderY + 120);
  resetButton.size(80, 30);
  resetButton.mousePressed(resetSim);
  resetButton.style('background-color', '#2e7d32');
  resetButton.style('color', 'white');
  resetButton.style('border', 'none');
  resetButton.style('border-radius', '4px');
  resetButton.style('cursor', 'pointer');
  resetButton.style('font-size', '13px');
  resetButton.style('font-weight', '600');
}

function resetSim() {
  selectedSystem = null;
  budgetSlider.value(30);
  powerSlider.value(1);
  cropSizeSlider.value(25);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  computeLayout();
  let sliderY = drawHeight + 30;
  budgetSlider.position(170, sliderY);
  powerSlider.position(170, sliderY + 40);
  cropSizeSlider.position(170, sliderY + 80);
  resetButton.position(15, sliderY + 120);
}

function draw() {
  background(COLOR_BG);
  animPhase += 0.04;

  drawTitle();

  // Determine recommended system from slider values
  let recommended = computeRecommended();

  // Layout: center the 4 cards
  let totalCardsW = 4 * cardW + 3 * cardGap;
  let startX = (canvasWidth - totalCardsW) / 2;

  for (let i = 0; i < systems.length; i++) {
    let x = startX + i * (cardW + cardGap);
    let isRecommended = (systems[i].id === recommended);
    drawCard(systems[i], x, cardTop, isRecommended);
  }

  drawControlPanel();

  if (selectedSystem) drawModal();
}

function drawTitle() {
  push();
  noStroke();
  fill(COLOR_DARK);
  textSize(18);
  textStyle(BOLD);
  textAlign(CENTER, TOP);
  text('Hydroponic System Types', canvasWidth / 2, 8);
  textStyle(NORMAL);
  textSize(12);
  fill(80);
  text('Click a card for details. Use the sliders below to find the recommended system.',
    canvasWidth / 2, 32);
  pop();
}

function drawCard(sys, x, y, isRecommended) {
  push();

  // Green glow if recommended
  if (isRecommended) {
    noFill();
    for (let r = 6; r >= 1; r--) {
      let glow = color(COLOR_GREEN[0], COLOR_GREEN[1], COLOR_GREEN[2]);
      glow.setAlpha(40 + (6 - r) * 12);
      stroke(glow);
      strokeWeight(r * 2);
      rect(x - r, y - r, cardW + r * 2, cardH + r * 2, 12);
    }
  }

  // Card body
  fill(COLOR_CARDBG);
  stroke(isRecommended ? COLOR_GREEN[0] : 160,
         isRecommended ? COLOR_GREEN[1] : 160,
         isRecommended ? COLOR_GREEN[2] : 160);
  strokeWeight(isRecommended ? 3 : 1);
  rect(x, y, cardW, cardH, 10);

  // Header strip
  noStroke();
  fill(sys.accent[0], sys.accent[1], sys.accent[2]);
  rect(x, y, cardW, 32, 10, 10, 0, 0);

  // Name
  fill(255);
  textSize(13);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text(sys.name, x + cardW / 2, y + 11);
  textSize(9);
  textStyle(NORMAL);
  text(sys.fullName, x + cardW / 2, y + 24);

  // Diagram area
  let diagY = y + 40;
  let diagH = 200;
  drawDiagram(sys.id, x + 8, diagY, cardW - 16, diagH);

  // Info hint
  fill(60);
  textSize(10);
  textAlign(CENTER, TOP);
  textStyle(NORMAL);
  text('Power: ' + (sys.needsPower ? 'Required' : 'None'),
       x + cardW / 2, y + 250);
  text('Cost: ' + sys.cost, x + cardW / 2, y + 264);
  text('Crop size: ' + sys.cropSize, x + cardW / 2, y + 278);

  // Recommended badge
  if (isRecommended) {
    fill(COLOR_GREEN[0], COLOR_GREEN[1], COLOR_GREEN[2]);
    noStroke();
    rect(x + 6, y + 296, cardW - 12, 20, 4);
    fill(255);
    textSize(10);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text('RECOMMENDED', x + cardW / 2, y + 306);
  }

  // "Click for details" button
  fill(COLOR_ORANGE[0], COLOR_ORANGE[1], COLOR_ORANGE[2]);
  noStroke();
  rect(x + 6, y + cardH - 28, cardW - 12, 22, 5);
  fill(255);
  textSize(11);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text('Click for Details', x + cardW / 2, y + cardH - 17);

  pop();
}

function drawDiagram(id, x, y, w, h) {
  push();
  // Diagram background
  noStroke();
  fill(245, 250, 240);
  rect(x, y, w, h, 6);

  if (id === 'DWC') drawDWC(x, y, w, h);
  else if (id === 'NFT') drawNFT(x, y, w, h);
  else if (id === 'Kratky') drawKratky(x, y, w, h);
  else if (id === 'Wick') drawWick(x, y, w, h);
  pop();
}

function drawDWC(x, y, w, h) {
  push();
  // Container outline
  let cx = x + 10, cy = y + 50;
  let cw = w - 20, ch = h - 70;
  // Water fill
  let waterCol = color(COLOR_WATER[0], COLOR_WATER[1], COLOR_WATER[2]);
  waterCol.setAlpha(180);
  fill(waterCol);
  noStroke();
  rect(cx, cy + 12, cw, ch - 12, 0, 0, 6, 6);
  // Container border
  noFill();
  stroke(80);
  strokeWeight(2);
  rect(cx, cy, cw, ch, 0, 0, 6, 6);
  // Lid (top)
  noStroke();
  fill(180);
  rect(cx - 2, cy - 4, cw + 4, 8, 2);
  // Net cup (rectangle on top)
  fill(160);
  rect(cx + cw / 2 - 12, cy - 8, 24, 12);
  // Plant leaves
  fill(COLOR_PLANT[0], COLOR_PLANT[1], COLOR_PLANT[2]);
  ellipse(cx + cw / 2 - 8, cy - 14, 14, 10);
  ellipse(cx + cw / 2 + 8, cy - 14, 14, 10);
  ellipse(cx + cw / 2, cy - 20, 14, 10);
  // Roots dangling into water
  stroke(255, 230, 200);
  strokeWeight(1);
  for (let i = -3; i <= 3; i++) {
    line(cx + cw / 2 + i * 2, cy + 4, cx + cw / 2 + i * 2 + sin(animPhase + i) * 2, cy + ch - 20);
  }
  // Air stone at bottom
  noStroke();
  fill(80);
  rect(cx + cw / 2 - 8, cy + ch - 8, 16, 4, 2);
  // Bubbles rising
  fill(255, 255, 255, 220);
  for (let i = 0; i < 5; i++) {
    let bx = cx + cw / 2 + sin(animPhase * 2 + i * 1.5) * 8;
    let by = cy + ch - 12 - ((animPhase * 25 + i * 18) % (ch - 30));
    ellipse(bx, by, 4 + (i % 2), 4 + (i % 2));
  }
  // Label
  noStroke();
  fill(60);
  textSize(9);
  textAlign(CENTER, BOTTOM);
  text('Roots submerged + air pump', x + w / 2, y + h - 2);
  pop();
}

function drawNFT(x, y, w, h) {
  push();
  // Sloped channel
  let cx1 = x + 8, cy1 = y + 40;
  let cx2 = x + w - 8, cy2 = y + h - 50;
  // Channel base (sloped rectangle approximated by trapezoid)
  stroke(80);
  strokeWeight(2);
  fill(220);
  beginShape();
  vertex(cx1, cy1);
  vertex(cx2, cy2);
  vertex(cx2, cy2 + 20);
  vertex(cx1, cy1 + 20);
  endShape(CLOSE);
  // Thin water stream along bottom
  noStroke();
  let waterCol = color(COLOR_WATER[0], COLOR_WATER[1], COLOR_WATER[2]);
  waterCol.setAlpha(200);
  fill(waterCol);
  beginShape();
  vertex(cx1, cy1 + 14);
  vertex(cx2, cy2 + 14);
  vertex(cx2, cy2 + 20);
  vertex(cx1, cy1 + 20);
  endShape(CLOSE);
  // Flowing dots
  fill(255);
  for (let i = 0; i < 4; i++) {
    let t = ((animPhase * 0.3 + i * 0.25) % 1);
    let px = lerp(cx1 + 4, cx2 - 4, t);
    let py = lerp(cy1 + 17, cy2 + 17, t);
    ellipse(px, py, 3, 3);
  }
  // Plants on top of channel (3 net cups)
  for (let i = 0; i < 3; i++) {
    let t = (i + 1) / 4;
    let px = lerp(cx1, cx2, t);
    let py = lerp(cy1, cy2, t);
    // Net cup
    fill(160);
    noStroke();
    rect(px - 8, py - 4, 16, 8);
    // Leaves
    fill(COLOR_PLANT[0], COLOR_PLANT[1], COLOR_PLANT[2]);
    ellipse(px - 5, py - 10, 9, 7);
    ellipse(px + 5, py - 10, 9, 7);
    ellipse(px, py - 14, 9, 7);
    // Roots into stream
    stroke(255, 230, 200);
    strokeWeight(1);
    line(px, py + 4, px - 2, py + 18);
    line(px + 2, py + 4, px + 3, py + 18);
  }
  // Reservoir + pump at bottom
  noStroke();
  fill(120);
  rect(cx1 - 4, cy2 + 26, 24, 14, 3);
  fill(60);
  ellipse(cx1 + 4, cy2 + 33, 8, 8);
  // Return pipe (up to high end)
  stroke(120);
  strokeWeight(2);
  noFill();
  line(cx1 + 4, cy2 + 26, cx1 + 4, cy1 + 4);
  line(cx1 + 4, cy1 + 4, cx1 + 10, cy1 + 10);
  // Label
  noStroke();
  fill(60);
  textSize(9);
  textAlign(CENTER, BOTTOM);
  text('Thin film of nutrient flows past roots', x + w / 2, y + h - 2);
  pop();
}

function drawKratky(x, y, w, h) {
  push();
  let cx = x + 10, cy = y + 50;
  let cw = w - 20, ch = h - 70;
  // Container outline
  noFill();
  stroke(80);
  strokeWeight(2);
  rect(cx, cy, cw, ch, 0, 0, 6, 6);
  // Water (bottom half only)
  noStroke();
  let waterCol = color(COLOR_WATER[0], COLOR_WATER[1], COLOR_WATER[2]);
  waterCol.setAlpha(180);
  fill(waterCol);
  let waterTop = cy + ch * 0.55;
  rect(cx + 1, waterTop, cw - 2, cy + ch - waterTop - 1, 0, 0, 6, 6);
  // Air gap shading (above water)
  fill(255, 255, 255, 90);
  rect(cx + 1, cy + 4, cw - 2, waterTop - cy - 4);
  // Air gap label arrow
  stroke(120);
  strokeWeight(1);
  line(cx + cw - 8, cy + 18, cx + cw - 8, waterTop - 4);
  noStroke();
  fill(120);
  textSize(7);
  textAlign(RIGHT, CENTER);
  text('air', cx + cw - 10, (cy + waterTop) / 2 + 2);
  // Lid + net cup
  fill(180);
  rect(cx - 2, cy - 4, cw + 4, 8, 2);
  fill(160);
  rect(cx + cw / 2 - 12, cy - 8, 24, 12);
  // Plant leaves
  fill(COLOR_PLANT[0], COLOR_PLANT[1], COLOR_PLANT[2]);
  ellipse(cx + cw / 2 - 8, cy - 14, 14, 10);
  ellipse(cx + cw / 2 + 8, cy - 14, 14, 10);
  ellipse(cx + cw / 2, cy - 20, 14, 10);
  // Aerial roots (white) in air gap
  stroke(255);
  strokeWeight(1);
  for (let i = -2; i <= 2; i++) {
    line(cx + cw / 2 + i * 3, cy + 4, cx + cw / 2 + i * 3, waterTop - 2);
  }
  // Submerged roots (blue tint)
  stroke(180, 220, 255);
  strokeWeight(1);
  for (let i = -3; i <= 3; i++) {
    line(cx + cw / 2 + i * 2, waterTop, cx + cw / 2 + i * 2 + sin(animPhase + i) * 1.5, cy + ch - 8);
  }
  // Label
  noStroke();
  fill(60);
  textSize(9);
  textAlign(CENTER, BOTTOM);
  text('Air gap + submerged roots (no pump)', x + w / 2, y + h - 2);
  pop();
}

function drawWick(x, y, w, h) {
  push();
  let cx = x + 10, cy = y + 30;
  let cw = w - 20, ch = h - 50;
  // Upper growing medium container
  let mediumH = 40;
  noStroke();
  fill(160, 100, 50);
  rect(cx + 8, cy, cw - 16, mediumH, 4);
  // Granular pattern
  fill(120, 70, 40);
  for (let i = 0; i < 18; i++) {
    let px = cx + 12 + (i * 7) % (cw - 24);
    let py = cy + 6 + Math.floor((i * 7) / (cw - 24)) * 10;
    ellipse(px, py, 3, 3);
  }
  // Plant leaves
  fill(COLOR_PLANT[0], COLOR_PLANT[1], COLOR_PLANT[2]);
  ellipse(cx + cw / 2 - 8, cy - 8, 14, 10);
  ellipse(cx + cw / 2 + 8, cy - 8, 14, 10);
  ellipse(cx + cw / 2, cy - 14, 14, 10);
  // Reservoir below
  let resTop = cy + mediumH + 30;
  let resBot = cy + ch;
  let waterCol = color(COLOR_WATER[0], COLOR_WATER[1], COLOR_WATER[2]);
  waterCol.setAlpha(180);
  fill(waterCol);
  noStroke();
  rect(cx, resTop, cw, resBot - resTop, 0, 0, 6, 6);
  // Container border
  noFill();
  stroke(80);
  strokeWeight(2);
  rect(cx, resTop, cw, resBot - resTop, 0, 0, 6, 6);
  // Wick (vertical line from reservoir up into medium)
  stroke(230, 215, 180);
  strokeWeight(4);
  noFill();
  line(cx + cw / 2, cy + mediumH, cx + cw / 2, resBot - 6);
  // Capillary motion dots (rising)
  noStroke();
  let dropCol = color(COLOR_WATER[0], COLOR_WATER[1], COLOR_WATER[2]);
  dropCol.setAlpha(220);
  fill(dropCol);
  for (let i = 0; i < 3; i++) {
    let t = ((animPhase * 0.2 + i * 0.33) % 1);
    let py = lerp(resBot - 6, cy + mediumH, t);
    ellipse(cx + cw / 2, py, 5, 5);
  }
  // Label
  noStroke();
  fill(60);
  textSize(9);
  textAlign(CENTER, BOTTOM);
  text('Wick draws water up by capillary action', x + w / 2, y + h - 2);
  pop();
}

function drawControlPanel() {
  push();
  // Panel background
  noStroke();
  fill(255, 255, 255, 220);
  stroke(200);
  strokeWeight(1);
  rect(margin, drawHeight, canvasWidth - 2 * margin, controlHeight - 5, 8);

  // Title
  noStroke();
  fill(COLOR_DARK);
  textSize(13);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text('Constraint Matcher', margin + 10, drawHeight + 6);

  // Slider labels
  textSize(11);
  textStyle(NORMAL);
  fill(50);
  textAlign(LEFT, CENTER);

  let labelX = margin + 10;
  let sliderY = drawHeight + 30;

  // Budget
  text('Budget:', labelX, sliderY + 8);
  let bv = budgetSlider.value();
  let bLabel = bv < 33 ? 'Low' : bv < 67 ? 'Medium' : 'High';
  textAlign(LEFT, CENTER);
  text(bLabel + ' ($' + (50 + bv * 4) + ')', labelX + 360, sliderY + 8);

  // Power
  text('Electricity:', labelX, sliderY + 48);
  text(powerSlider.value() === 1 ? 'Available' : 'Not available', labelX + 360, sliderY + 48);

  // Crop size
  text('Crop size:', labelX, sliderY + 88);
  let cs = cropSizeSlider.value();
  let csLabel = cs < 33 ? 'Small (herbs)' : cs < 67 ? 'Medium (lettuce)' : 'Large (tomato)';
  text(csLabel, labelX + 360, sliderY + 88);

  // Recommended explanation
  let rec = computeRecommended();
  let recSys = systems.find(s => s.id === rec);
  fill(COLOR_GREEN[0], COLOR_GREEN[1], COLOR_GREEN[2]);
  textStyle(BOLD);
  textSize(12);
  textAlign(LEFT, CENTER);
  text('Recommended: ' + recSys.fullName + ' (' + recSys.name + ')',
       labelX + 110, sliderY + 130);
  pop();
}

function computeRecommended() {
  let budget = budgetSlider.value();   // 0-100
  let power = powerSlider.value();     // 0-1
  let crop = cropSizeSlider.value();   // 0-100

  // Large crops + no power = no good option, default to Kratky (but warn via low rec)
  // Logic per spec:
  // Low budget + no power + small crops -> Wick
  // Low/medium budget + no power + small-medium crops -> Kratky
  // Higher budget + power + small-medium crops -> NFT
  // Higher budget + power + small-medium crops, high yield -> DWC

  if (power === 0) {
    // No electricity available
    if (budget < 35 && crop < 30) return 'Wick';
    return 'Kratky';
  } else {
    // Power available
    if (budget < 40) {
      // Low budget but power: still cheap options preferred
      if (crop < 30) return 'Wick';
      return 'Kratky';
    }
    // Medium-high budget + power
    if (crop > 60) {
      // Large crops need high-yield system
      return 'DWC';
    }
    if (budget < 70) {
      return 'NFT';      // water-efficient mid-range
    }
    return 'DWC';        // high budget, high yield
  }
}

function drawModal() {
  push();
  // Dim
  let dim = color(0, 0, 0);
  dim.setAlpha(150);
  fill(dim);
  noStroke();
  rect(0, 0, canvasWidth, drawHeight);

  // Modal box
  let mw = min(460, canvasWidth - 40);
  let mh = 410;
  let mx = (canvasWidth - mw) / 2;
  let my = (drawHeight - mh) / 2;
  if (my < 10) my = 10;

  fill(255);
  stroke(COLOR_GREEN[0], COLOR_GREEN[1], COLOR_GREEN[2]);
  strokeWeight(2);
  rect(mx, my, mw, mh, 10);

  // Header
  noStroke();
  fill(selectedSystem.accent[0], selectedSystem.accent[1], selectedSystem.accent[2]);
  rect(mx, my, mw, 40, 10, 10, 0, 0);
  fill(255);
  textSize(15);
  textStyle(BOLD);
  textAlign(LEFT, CENTER);
  text(selectedSystem.fullName + ' (' + selectedSystem.name + ')', mx + 14, my + 20);

  // Sections
  let sy = my + 54;
  let lh = 16;

  // Equipment
  fill(COLOR_DARK);
  textSize(12);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text('Required Equipment', mx + 14, sy);
  textStyle(NORMAL);
  textSize(11);
  fill(50);
  for (let i = 0; i < selectedSystem.equipment.length; i++) {
    text('• ' + selectedSystem.equipment[i], mx + 24, sy + 18 + i * lh);
  }
  sy += 18 + selectedSystem.equipment.length * lh + 10;

  // Best crops
  fill(COLOR_DARK);
  textSize(12);
  textStyle(BOLD);
  text('Best Crops', mx + 14, sy);
  textStyle(NORMAL);
  textSize(11);
  fill(50);
  text(selectedSystem.bestCrops.join(', '), mx + 24, sy + 18);
  sy += 40;

  // Pros (two columns)
  let colW = (mw - 30) / 2;
  let proX = mx + 14;
  let conX = mx + 14 + colW + 2;

  fill(COLOR_GREEN[0], COLOR_GREEN[1], COLOR_GREEN[2]);
  textStyle(BOLD);
  textSize(12);
  text('Pros', proX, sy);
  fill(200, 80, 60);
  text('Cons', conX, sy);

  textStyle(NORMAL);
  textSize(11);
  fill(50);
  for (let i = 0; i < selectedSystem.pros.length; i++) {
    text('+ ' + selectedSystem.pros[i], proX + 4, sy + 18 + i * lh, colW - 8);
  }
  for (let i = 0; i < selectedSystem.cons.length; i++) {
    text('- ' + selectedSystem.cons[i], conX + 4, sy + 18 + i * lh, colW - 8);
  }

  // Close button
  fill(COLOR_GREEN[0], COLOR_GREEN[1], COLOR_GREEN[2]);
  noStroke();
  rect(mx + mw / 2 - 40, my + mh - 30, 80, 22, 5);
  fill(255);
  textSize(11);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text('Close', mx + mw / 2, my + mh - 19);
  pop();
}

function modalCloseHit(mx, my) {
  if (!selectedSystem) return false;
  let mw = min(460, canvasWidth - 40);
  let mh = 410;
  let modX = (canvasWidth - mw) / 2;
  let modY = (drawHeight - mh) / 2;
  if (modY < 10) modY = 10;
  let bx = modX + mw / 2 - 40;
  let by = modY + mh - 30;
  return mx >= bx && mx <= bx + 80 && my >= by && my <= by + 22;
}

function modalContains(mx, my) {
  if (!selectedSystem) return false;
  let mw = min(460, canvasWidth - 40);
  let mh = 410;
  let modX = (canvasWidth - mw) / 2;
  let modY = (drawHeight - mh) / 2;
  if (modY < 10) modY = 10;
  return mx >= modX && mx <= modX + mw && my >= modY && my <= modY + mh;
}

function mousePressed() {
  if (mouseY > drawHeight) return; // ignore clicks in control panel

  if (selectedSystem) {
    if (modalCloseHit(mouseX, mouseY) || !modalContains(mouseX, mouseY)) {
      selectedSystem = null;
    }
    return;
  }

  // Card hit detection
  let totalCardsW = 4 * cardW + 3 * cardGap;
  let startX = (canvasWidth - totalCardsW) / 2;
  for (let i = 0; i < systems.length; i++) {
    let x = startX + i * (cardW + cardGap);
    if (mouseX >= x && mouseX <= x + cardW &&
        mouseY >= cardTop && mouseY <= cardTop + cardH) {
      selectedSystem = systems[i];
      return;
    }
  }
}
