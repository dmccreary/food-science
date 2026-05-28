// Nutrient Deficiency Explorer — Food Science MicroSim
// CANVAS_HEIGHT: 720
// Students click any of 8 nutrient cards to see which body regions are
// affected by deficiency, the disease name, key symptoms, primary food
// sources, and the population at risk. A "Fortified Foods" toggle reveals
// real-world examples of nutrient fortification. Bloom L1 (Remember).

// ----- Layout constants -----
let canvasWidth   = 760;
let titleHeight   = 44;
let drawHeight    = 470;     // body + cards region
let infoHeight    = 140;     // info panel below
let controlHeight = 66;
let canvasHeight  = titleHeight + drawHeight + infoHeight + controlHeight;

// Body silhouette region (left half)
let bodyX = 20;
let bodyY = titleHeight + 10;
let bodyW = 260;
let bodyH = drawHeight - 20;

// Cards region (right half)
let cardsX = bodyX + bodyW + 20;
let cardsY = titleHeight + 10;
let cardW  = 100;
let cardH  = 80;
let cardGapX = 12;
let cardGapY = 12;
let cardCols = 4;

// Info panel
let infoX = 20;
let infoY = titleHeight + drawHeight;
let infoW = canvasWidth - 40;
let infoH = infoHeight - 10;

// Palette ------------------------------------------------------
const COLOR_BG          = '#f1f8e9';
const COLOR_TITLE_BG    = '#2e7d32';
const COLOR_TITLE_TEXT  = '#ffffff';
const COLOR_PANEL_BG    = '#ffffff';
const COLOR_PANEL_BORDER= '#c8e6c9';
const COLOR_BODY_FILL   = '#e8e8e8';
const COLOR_BODY_LINE   = '#5a5a5a';
const COLOR_CARD_BG     = '#ffffff';
const COLOR_CARD_BORDER = '#c8e6c9';
const COLOR_CARD_SEL    = '#f57c00';   // accent orange
const COLOR_CARD_HOVER  = '#a5d6a7';
const COLOR_TEXT_DARK   = '#1b1b1b';
const COLOR_TEXT_MUTED  = '#555555';
const COLOR_GREEN       = '#2e7d32';   // adequate
const COLOR_YELLOW      = '#fdd835';   // mild
const COLOR_RED         = '#e53935';   // critical
const COLOR_ORANGE      = '#f57c00';

// ----- Body region keys -----
// Each region has a draw function; severity is 'critical', 'mild',
// or 'adequate' (default).
const REGIONS = [
  'eyes', 'mouth', 'thyroid', 'brain', 'bones',
  'blood', 'spinalCord', 'nerves', 'muscles'
];

// ----- Nutrient data (established facts) -----
let nutrients = [
  {
    name: 'Vitamin A',
    short: 'A',
    color: '#ff8a65',
    disease: 'Night blindness / Xerophthalmia',
    symptoms: 'Poor night vision, dry eyes, weakened skin & immunity',
    sources: ['Carrots', 'Sweet potato', 'Leafy greens', 'Liver'],
    sourceIcons: ['🥕', '🍠', '🥬', '🥩'],
    atRisk: 'Young children in low-income regions',
    fortified: 'Margarine and some dairy products are fortified with vitamin A.',
    regions: { eyes: 'critical', mouth: 'mild' }
  },
  {
    name: 'Vitamin C',
    short: 'C',
    color: '#ffb74d',
    disease: 'Scurvy',
    symptoms: 'Bleeding gums, joint pain, slow wound healing, bruising',
    sources: ['Oranges', 'Bell peppers', 'Broccoli', 'Strawberries'],
    sourceIcons: ['🍊', '🫑', '🥦', '🍓'],
    atRisk: 'Sailors historically; modern crash dieters',
    fortified: 'Many fruit juices and breakfast cereals are fortified with vitamin C.',
    regions: { mouth: 'critical', bones: 'mild' }
  },
  {
    name: 'Vitamin D',
    short: 'D',
    color: '#fff176',
    disease: 'Rickets (kids) / Osteomalacia (adults)',
    symptoms: 'Soft, weak bones; bowed legs in children; bone pain',
    sources: ['Fortified milk', 'Sunlight', 'Fatty fish', 'Egg yolks'],
    sourceIcons: ['🥛', '☀️', '🐟', '🥚'],
    atRisk: 'Indoor lifestyles; dark-skinned people in high latitudes',
    fortified: 'Almost all U.S. milk is fortified with vitamin D since the 1930s.',
    regions: { bones: 'critical' }
  },
  {
    name: 'Iron',
    short: 'Fe',
    color: '#a1887f',
    disease: 'Iron-deficiency anemia',
    symptoms: 'Fatigue, pale skin, shortness of breath, weakness',
    sources: ['Red meat', 'Beans', 'Spinach', 'Fortified cereal'],
    sourceIcons: ['🥩', '🫘', '🥬', '🥣'],
    atRisk: 'Menstruating women and infants',
    fortified: 'Breakfast cereals and white flour are commonly iron-fortified.',
    regions: { blood: 'critical', brain: 'mild', muscles: 'mild' }
  },
  {
    name: 'Iodine',
    short: 'I',
    color: '#9575cd',
    disease: 'Goiter / Hypothyroidism',
    symptoms: 'Swollen neck (goiter); in children, slowed brain development',
    sources: ['Iodized salt', 'Seafood', 'Dairy', 'Seaweed'],
    sourceIcons: ['🧂', '🦐', '🥛', '🌿'],
    atRisk: 'Inland and mountain populations far from the sea',
    fortified: 'Iodized table salt has prevented goiter worldwide since the 1920s.',
    regions: { thyroid: 'critical', brain: 'mild' }
  },
  {
    name: 'Calcium',
    short: 'Ca',
    color: '#90caf9',
    disease: 'Osteoporosis',
    symptoms: 'Weak, brittle bones; higher fracture risk; tooth loss',
    sources: ['Milk', 'Yogurt', 'Leafy greens', 'Fortified plant milks'],
    sourceIcons: ['🥛', '🥛', '🥬', '🥤'],
    atRisk: 'Post-menopausal women and dairy avoiders',
    fortified: 'Plant milks (soy, almond, oat) are often calcium-fortified.',
    regions: { bones: 'critical', mouth: 'mild' }
  },
  {
    name: 'Folate',
    short: 'B9',
    color: '#aed581',
    disease: 'Neural tube defects (in fetuses)',
    symptoms: 'Spina bifida and anencephaly in developing babies',
    sources: ['Leafy greens', 'Beans', 'Fortified grains', 'Citrus'],
    sourceIcons: ['🥬', '🫘', '🍞', '🍊'],
    atRisk: 'Pregnant women and women of childbearing age',
    fortified: 'U.S. bread, pasta, and cereal have been folate-fortified since 1998.',
    regions: { brain: 'critical', spinalCord: 'critical' }
  },
  {
    name: 'Vitamin B12',
    short: 'B12',
    color: '#f06292',
    disease: 'Pernicious anemia / Neuropathy',
    symptoms: 'Fatigue, numbness/tingling, memory problems, weakness',
    sources: ['Meat', 'Dairy', 'Eggs', 'Fortified plant milks'],
    sourceIcons: ['🥩', '🥛', '🥚', '🥤'],
    atRisk: 'Strict vegans and older adults',
    fortified: 'Many plant milks and nutritional yeasts are B12-fortified.',
    regions: { blood: 'critical', nerves: 'critical' }
  }
];

// State
let selectedIdx = null;
let hoverIdx = null;
let showFortified = false;
let cardRects = []; // {x,y,w,h}

// Controls
let btnFortified, btnReset;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Segoe UI, Arial, sans-serif');

  layoutCards();

  btnFortified = createButton('Show Fortified Foods');
  styleButton(btnFortified, COLOR_GREEN);
  btnFortified.mousePressed(() => {
    showFortified = !showFortified;
    btnFortified.html(showFortified ? 'Hide Fortified Foods' : 'Show Fortified Foods');
  });

  btnReset = createButton('Reset');
  styleButton(btnReset, COLOR_ORANGE);
  btnReset.mousePressed(resetSim);

  positionButtons();
}

function styleButton(btn, bgHex) {
  btn.style('background-color', bgHex);
  btn.style('color', '#ffffff');
  btn.style('border', 'none');
  btn.style('border-radius', '6px');
  btn.style('padding', '8px 14px');
  btn.style('font-size', '14px');
  btn.style('font-family', 'Segoe UI, Arial, sans-serif');
  btn.style('cursor', 'pointer');
  btn.style('font-weight', '600');
}

function positionButtons() {
  let btnY = titleHeight + drawHeight + infoHeight + 16;
  // Center the two buttons
  let totalW = 200 + 14 + 90;
  let startX = (canvasWidth - totalW) / 2;
  btnFortified.position(startX, btnY);
  btnFortified.size(200, 34);
  btnReset.position(startX + 200 + 14, btnY);
  btnReset.size(90, 34);
}

function layoutCards() {
  cardRects = [];
  for (let i = 0; i < nutrients.length; i++) {
    let col = i % cardCols;
    let row = Math.floor(i / cardCols);
    let x = cardsX + col * (cardW + cardGapX);
    let y = cardsY + 30 + row * (cardH + cardGapY); // +30 for "Click a nutrient" label
    cardRects.push({ x, y, w: cardW, h: cardH });
  }
}

function resetSim() {
  selectedIdx = null;
  showFortified = false;
  btnFortified.html('Show Fortified Foods');
}

function draw() {
  background(COLOR_BG);

  drawTitle();
  drawBodySilhouette();
  drawBodyRegions();
  drawCardsHeader();
  drawCards();
  drawInfoPanel();
}

// =============================================================
// TITLE
// =============================================================
function drawTitle() {
  push();
  noStroke();
  fill(COLOR_TITLE_BG);
  rect(0, 0, canvasWidth, titleHeight);
  fill(COLOR_TITLE_TEXT);
  textAlign(CENTER, CENTER);
  textSize(18);
  textStyle(BOLD);
  text('Nutrient Deficiency Explorer', canvasWidth / 2, titleHeight / 2 - 6);
  textStyle(NORMAL);
  textSize(11);
  text('Click a nutrient to see which body parts are affected when you don’t get enough.',
       canvasWidth / 2, titleHeight / 2 + 12);
  pop();
}

// =============================================================
// BODY SILHOUETTE
// =============================================================
function drawBodySilhouette() {
  push();
  // White panel behind body
  noStroke();
  fill(COLOR_PANEL_BG);
  rect(bodyX - 4, bodyY - 4, bodyW + 8, bodyH + 8, 8);
  stroke(COLOR_PANEL_BORDER);
  noFill();
  rect(bodyX - 4, bodyY - 4, bodyW + 8, bodyH + 8, 8);

  // Body geometry: head, neck, torso, arms, legs
  let cx = bodyX + bodyW / 2;
  let headR = 38;
  let headY = bodyY + 40;            // head center
  let neckTop = headY + headR - 4;
  let neckBot = neckTop + 16;
  let torsoTop = neckBot;
  let torsoBot = torsoTop + 150;
  let hipY = torsoBot;
  let legBot = hipY + 170;

  // Legs
  noStroke();
  fill(COLOR_BODY_FILL);
  // left leg
  beginShape();
  vertex(cx - 38, hipY);
  vertex(cx - 4, hipY);
  vertex(cx - 10, legBot);
  vertex(cx - 36, legBot);
  endShape(CLOSE);
  // right leg
  beginShape();
  vertex(cx + 4, hipY);
  vertex(cx + 38, hipY);
  vertex(cx + 36, legBot);
  vertex(cx + 10, legBot);
  endShape(CLOSE);

  // Arms
  // left arm
  beginShape();
  vertex(cx - 50, torsoTop + 8);
  vertex(cx - 38, torsoTop + 8);
  vertex(cx - 40, torsoTop + 130);
  vertex(cx - 60, torsoTop + 130);
  endShape(CLOSE);
  // right arm
  beginShape();
  vertex(cx + 38, torsoTop + 8);
  vertex(cx + 50, torsoTop + 8);
  vertex(cx + 60, torsoTop + 130);
  vertex(cx + 40, torsoTop + 130);
  endShape(CLOSE);

  // Torso (trapezoid: wide shoulders -> narrower hips)
  beginShape();
  vertex(cx - 50, torsoTop);
  vertex(cx + 50, torsoTop);
  vertex(cx + 38, hipY);
  vertex(cx - 38, hipY);
  endShape(CLOSE);

  // Neck
  rect(cx - 12, neckTop, 24, neckBot - neckTop);

  // Head
  ellipse(cx, headY, headR * 2, headR * 2);

  // Outline (subtle)
  noFill();
  stroke(COLOR_BODY_LINE);
  strokeWeight(1.2);
  ellipse(cx, headY, headR * 2, headR * 2);
  rect(cx - 12, neckTop, 24, neckBot - neckTop);
  beginShape();
  vertex(cx - 50, torsoTop);
  vertex(cx + 50, torsoTop);
  vertex(cx + 38, hipY);
  vertex(cx - 38, hipY);
  endShape(CLOSE);

  // Store geometry for region overlays
  bodyGeom = {
    cx, headR, headY, neckTop, neckBot,
    torsoTop, torsoBot, hipY, legBot
  };

  pop();
}

let bodyGeom = null;

// =============================================================
// BODY REGION HIGHLIGHTS
// =============================================================
function drawBodyRegions() {
  if (!bodyGeom) return;
  let regs = (selectedIdx === null) ? {} : nutrients[selectedIdx].regions;

  // Draw each region using its severity color (or default outline if not active)
  drawRegion('eyes',       regs.eyes);
  drawRegion('brain',      regs.brain);
  drawRegion('mouth',      regs.mouth);
  drawRegion('thyroid',    regs.thyroid);
  drawRegion('bones',      regs.bones);
  drawRegion('spinalCord', regs.spinalCord);
  drawRegion('blood',      regs.blood);
  drawRegion('muscles',    regs.muscles);
  drawRegion('nerves',     regs.nerves);

  // Legend (top-right of body panel)
  drawLegend();
}

function severityColor(sev) {
  if (sev === 'critical') return color(229, 57, 53, 200);   // red
  if (sev === 'mild')     return color(253, 216, 53, 200);  // yellow
  if (sev === 'adequate') return color(46, 125, 50, 160);   // green
  return null;
}

function drawRegion(key, severity) {
  let g = bodyGeom;
  let activeCol = severityColor(severity);
  let isActive = (activeCol !== null);

  push();
  if (isActive) {
    noStroke();
    fill(activeCol);
  } else {
    // dormant: very faint outline so user knows region exists
    noFill();
    stroke(150, 150, 150, 90);
    strokeWeight(1);
  }

  if (key === 'eyes') {
    // two small ellipses on the head
    let ey = g.headY - 4;
    ellipse(g.cx - 12, ey, 10, 8);
    ellipse(g.cx + 12, ey, 10, 8);
    if (isActive) drawRegionLabel('Eyes', g.cx + 38, g.headY - 8);
  } else if (key === 'brain') {
    // arc inside upper half of head
    if (isActive) {
      noStroke();
      fill(activeCol);
      arc(g.cx, g.headY - 6, g.headR * 1.4, g.headR * 1.3, PI, TWO_PI);
      drawRegionLabel('Brain', g.cx + 38, g.headY - 22);
    } else {
      noFill();
      stroke(150, 150, 150, 90);
      arc(g.cx, g.headY - 6, g.headR * 1.4, g.headR * 1.3, PI, TWO_PI);
    }
  } else if (key === 'mouth') {
    // small arc near bottom of head
    if (isActive) {
      noStroke();
      fill(activeCol);
      ellipse(g.cx, g.headY + 18, 22, 8);
      drawRegionLabel('Mouth/Gums', g.cx + 38, g.headY + 18);
    } else {
      noFill();
      stroke(150, 150, 150, 90);
      ellipse(g.cx, g.headY + 18, 22, 8);
    }
  } else if (key === 'thyroid') {
    // small shape on neck
    if (isActive) {
      noStroke();
      fill(activeCol);
      ellipse(g.cx, (g.neckTop + g.neckBot) / 2, 22, 12);
      drawRegionLabel('Thyroid', g.cx + 38, (g.neckTop + g.neckBot) / 2);
    } else {
      noFill();
      stroke(150, 150, 150, 90);
      ellipse(g.cx, (g.neckTop + g.neckBot) / 2, 22, 12);
    }
  } else if (key === 'bones') {
    // small bone marks on arms+legs+torso
    if (isActive) {
      noStroke();
      fill(activeCol);
      // upper arm bones
      rect(g.cx - 56, g.torsoTop + 20, 6, 60, 3);
      rect(g.cx + 50, g.torsoTop + 20, 6, 60, 3);
      // thigh bones
      rect(g.cx - 28, g.hipY + 10, 6, 80, 3);
      rect(g.cx + 22, g.hipY + 10, 6, 80, 3);
      // ribcage hint
      rect(g.cx - 4, g.torsoTop + 12, 8, 80, 3);
      drawRegionLabel('Bones', g.cx + 70, g.torsoTop + 50);
    }
  } else if (key === 'spinalCord') {
    if (isActive) {
      noStroke();
      fill(activeCol);
      rect(g.cx - 3, g.neckBot, 6, g.hipY - g.neckBot, 2);
      drawRegionLabel('Spinal cord', g.cx + 38, g.torsoTop + 90);
    }
  } else if (key === 'blood') {
    // hint: heart + arms + body fill overlay
    if (isActive) {
      noStroke();
      // heart
      fill(activeCol);
      ellipse(g.cx - 8, g.torsoTop + 32, 18, 18);
      ellipse(g.cx + 8, g.torsoTop + 32, 18, 18);
      triangle(g.cx - 17, g.torsoTop + 36, g.cx + 17, g.torsoTop + 36, g.cx, g.torsoTop + 58);
      // gentle whole-body wash
      let c = color(229, 57, 53, 50);
      fill(c);
      // torso
      beginShape();
      vertex(g.cx - 50, g.torsoTop);
      vertex(g.cx + 50, g.torsoTop);
      vertex(g.cx + 38, g.hipY);
      vertex(g.cx - 38, g.hipY);
      endShape(CLOSE);
      drawRegionLabel('Blood / heart', g.cx + 56, g.torsoTop + 36);
    }
  } else if (key === 'muscles') {
    if (isActive) {
      noStroke();
      fill(activeCol);
      // arm muscles
      ellipse(g.cx - 49, g.torsoTop + 40, 18, 30);
      ellipse(g.cx + 49, g.torsoTop + 40, 18, 30);
      // thigh muscles
      ellipse(g.cx - 22, g.hipY + 40, 24, 50);
      ellipse(g.cx + 22, g.hipY + 40, 24, 50);
      drawRegionLabel('Muscles', g.cx - 88, g.torsoTop + 40);
    }
  } else if (key === 'nerves') {
    if (isActive) {
      noStroke();
      stroke(activeCol);
      strokeWeight(2);
      noFill();
      // wiggly lines down each arm and leg
      drawWiggle(g.cx - 50, g.torsoTop + 12, g.cx - 56, g.torsoTop + 130);
      drawWiggle(g.cx + 50, g.torsoTop + 12, g.cx + 56, g.torsoTop + 130);
      drawWiggle(g.cx - 22, g.hipY + 5, g.cx - 22, g.legBot - 5);
      drawWiggle(g.cx + 22, g.hipY + 5, g.cx + 22, g.legBot - 5);
      drawRegionLabel('Nerves', g.cx - 88, g.hipY + 60);
    }
  }
  pop();
}

function drawWiggle(x1, y1, x2, y2) {
  let steps = 8;
  beginShape();
  for (let i = 0; i <= steps; i++) {
    let t = i / steps;
    let bx = lerp(x1, x2, t);
    let by = lerp(y1, y2, t);
    let off = (i % 2 === 0) ? 4 : -4;
    vertex(bx + off, by);
  }
  endShape();
}

function drawRegionLabel(txt, x, y) {
  push();
  noStroke();
  fill(255, 255, 255, 230);
  let tw = textWidth(txt) + 10;
  rect(x - 2, y - 9, tw, 16, 4);
  fill(COLOR_TEXT_DARK);
  textSize(11);
  textAlign(LEFT, CENTER);
  text(txt, x + 3, y);
  pop();
}

function drawLegend() {
  push();
  let lx = bodyX + 6;
  let ly = bodyY + bodyH - 56;
  noStroke();
  fill(255, 255, 255, 230);
  rect(lx, ly, 110, 50, 4);
  stroke(COLOR_PANEL_BORDER);
  noFill();
  rect(lx, ly, 110, 50, 4);

  textSize(10);
  textAlign(LEFT, CENTER);
  // critical
  noStroke();
  fill(COLOR_RED);
  rect(lx + 6, ly + 8, 12, 10, 2);
  fill(COLOR_TEXT_DARK);
  text('Critical', lx + 22, ly + 13);
  // mild
  fill(COLOR_YELLOW);
  rect(lx + 6, ly + 22, 12, 10, 2);
  fill(COLOR_TEXT_DARK);
  text('Mild risk', lx + 22, ly + 27);
  // adequate
  fill(COLOR_GREEN);
  rect(lx + 6, ly + 36, 12, 10, 2);
  fill(COLOR_TEXT_DARK);
  text('Adequate', lx + 22, ly + 41);
  pop();
}

// =============================================================
// CARDS
// =============================================================
function drawCardsHeader() {
  push();
  noStroke();
  fill(COLOR_TEXT_DARK);
  textAlign(LEFT, CENTER);
  textSize(13);
  textStyle(BOLD);
  text('Pick a nutrient:', cardsX, cardsY + 12);
  textStyle(NORMAL);
  pop();
}

function drawCards() {
  for (let i = 0; i < nutrients.length; i++) {
    let r = cardRects[i];
    let n = nutrients[i];
    let isSel = (i === selectedIdx);
    let isHov = (i === hoverIdx);

    push();
    // shadow
    noStroke();
    fill(0, 0, 0, 18);
    rect(r.x + 2, r.y + 3, r.w, r.h, 8);

    // body
    fill(COLOR_CARD_BG);
    rect(r.x, r.y, r.w, r.h, 8);

    // border
    noFill();
    if (isSel) {
      stroke(COLOR_CARD_SEL);
      strokeWeight(3);
    } else if (isHov) {
      stroke(COLOR_CARD_HOVER);
      strokeWeight(2);
    } else {
      stroke(COLOR_CARD_BORDER);
      strokeWeight(1.5);
    }
    rect(r.x, r.y, r.w, r.h, 8);

    // colored chip in top-left
    noStroke();
    fill(n.color);
    rect(r.x, r.y, r.w, 18, 8, 8, 0, 0);

    // short label inside chip
    fill('#1b1b1b');
    textAlign(LEFT, CENTER);
    textSize(11);
    textStyle(BOLD);
    text(n.short, r.x + 8, r.y + 9);
    textStyle(NORMAL);

    // name
    fill(COLOR_TEXT_DARK);
    textAlign(CENTER, CENTER);
    textSize(13);
    textStyle(BOLD);
    text(n.name, r.x + r.w / 2, r.y + 38);
    textStyle(NORMAL);

    // hint
    fill(COLOR_TEXT_MUTED);
    textSize(10);
    text(isSel ? 'Selected' : 'Click to explore', r.x + r.w / 2, r.y + 60);
    pop();
  }
}

// =============================================================
// INFO PANEL
// =============================================================
function drawInfoPanel() {
  push();
  // panel
  noStroke();
  fill(COLOR_PANEL_BG);
  rect(infoX, infoY, infoW, infoH, 8);
  noFill();
  stroke(COLOR_PANEL_BORDER);
  rect(infoX, infoY, infoW, infoH, 8);

  noStroke();
  if (selectedIdx === null) {
    fill(COLOR_TEXT_MUTED);
    textAlign(CENTER, CENTER);
    textSize(14);
    text('← Click a nutrient card to see the deficiency disease, symptoms, food sources, and who is most at risk.',
         infoX + infoW / 2, infoY + infoH / 2);
    pop();
    return;
  }

  let n = nutrients[selectedIdx];

  // Header strip
  fill(n.color);
  rect(infoX, infoY, infoW, 26, 8, 8, 0, 0);
  fill('#1b1b1b');
  textAlign(LEFT, CENTER);
  textSize(14);
  textStyle(BOLD);
  text(n.name + '  —  Deficiency: ' + n.disease, infoX + 12, infoY + 13);
  textStyle(NORMAL);

  // Two columns of content
  let colY = infoY + 36;
  let leftX = infoX + 12;
  let rightX = infoX + infoW / 2 + 6;
  let colW = infoW / 2 - 18;

  if (showFortified) {
    // Fortified Foods mode
    fill(COLOR_ORANGE);
    textSize(12);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text('FORTIFIED FOODS', leftX, colY);
    textStyle(NORMAL);
    fill(COLOR_TEXT_DARK);
    textSize(12);
    text(n.fortified, leftX, colY + 18, infoW - 24, 70);
  } else {
    // Symptoms
    fill(COLOR_GREEN);
    textSize(11);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text('SYMPTOMS', leftX, colY);
    textStyle(NORMAL);
    fill(COLOR_TEXT_DARK);
    textSize(12);
    text(n.symptoms, leftX, colY + 16, colW, 50);

    // At-risk
    fill(COLOR_GREEN);
    textSize(11);
    textStyle(BOLD);
    text('AT-RISK GROUP', leftX, colY + 64);
    textStyle(NORMAL);
    fill(COLOR_TEXT_DARK);
    textSize(12);
    text(n.atRisk, leftX, colY + 80, colW, 30);

    // Food sources (right column)
    fill(COLOR_GREEN);
    textSize(11);
    textStyle(BOLD);
    text('PRIMARY FOOD SOURCES', rightX, colY);
    textStyle(NORMAL);
    // Icons + labels
    for (let i = 0; i < n.sources.length; i++) {
      let sx = rightX + (i % 2) * (colW / 2);
      let sy = colY + 22 + Math.floor(i / 2) * 32;
      textSize(20);
      textAlign(LEFT, CENTER);
      text(n.sourceIcons[i], sx, sy + 10);
      fill(COLOR_TEXT_DARK);
      textSize(12);
      text(n.sources[i], sx + 26, sy + 10);
      fill(COLOR_TEXT_DARK);
    }
  }
  pop();
}

// =============================================================
// INPUT
// =============================================================
function mouseMoved() {
  hoverIdx = null;
  for (let i = 0; i < cardRects.length; i++) {
    let r = cardRects[i];
    if (mouseX >= r.x && mouseX <= r.x + r.w &&
        mouseY >= r.y && mouseY <= r.y + r.h) {
      hoverIdx = i;
      cursor('pointer');
      return;
    }
  }
  cursor(ARROW);
}

function mousePressed() {
  for (let i = 0; i < cardRects.length; i++) {
    let r = cardRects[i];
    if (mouseX >= r.x && mouseX <= r.x + r.w &&
        mouseY >= r.y && mouseY <= r.y + r.h) {
      selectedIdx = (selectedIdx === i) ? null : i;
      return;
    }
  }
}

// =============================================================
// RESIZE HOOK
// =============================================================
function updateCanvasSize() {
  // Native canvas size; iframe handles container width.
}

function windowResized() {
  if (btnFortified && btnReset) {
    positionButtons();
  }
}
