// Digestive System Nutrient Journey — Food Science MicroSim
// CANVAS_HEIGHT: 760
// Students click 8 hot spots on a simplified anatomical torso silhouette
// (mouth, esophagus, stomach, small intestine, liver, gallbladder,
// pancreas, large intestine) and watch a food particle travel through
// the tract. Bloom L1 (Remember / trace) + L2 (Understand / explain).

// ----- Layout constants -----
let canvasWidth = 760;
let titleHeight = 40;
let drawHeight = 520;        // torso drawing region
let infoHeight = 130;        // info panel below torso
let controlHeight = 70;
let canvasHeight = titleHeight + drawHeight + infoHeight + controlHeight;

// Palette ------------------------------------------------------
const COLOR_BG          = '#f1f8e9';
const COLOR_TITLE_BG    = '#2e7d32';
const COLOR_TITLE_TEXT  = '#ffffff';
const COLOR_PANEL_BG    = '#ffffff';
const COLOR_PANEL_BORDER= '#c8e6c9';
const COLOR_TORSO_FILL  = '#ececec';
const COLOR_TORSO_LINE  = '#5a5a5a';
const COLOR_MOUTH       = '#e57373';   // soft red
const COLOR_ESOPHAGUS   = '#bcaaa4';   // taupe tube
const COLOR_STOMACH     = '#ef5350';   // pink/red
const COLOR_SI          = '#f48fb1';   // pinkish small intestine
const COLOR_LIVER       = '#8d4a2b';   // reddish-brown
const COLOR_GALL        = '#7cb342';   // green gallbladder
const COLOR_PANCREAS    = '#fbc02d';   // yellow pancreas
const COLOR_LI          = '#bca6a6';   // grayish-pink large intestine
const COLOR_FOOD        = '#f57c00';   // accent orange
const COLOR_HIGHLIGHT   = '#ff5722';   // pulsing ring color
const COLOR_TEXT_DARK   = '#1b1b1b';
const COLOR_TEXT_MUTED  = '#555555';
const COLOR_LABEL_BG    = 'rgba(255,255,255,0.94)';

// ----- Hot spots / organs -----
// Each organ has: id, name, cx, cy, hitRadius, journeyPoint (where the
// food particle travels to), tooltip (EXACT spec text), color, and a
// draw function reference.
let organs = [];

let selectedId = null;     // currently-revealed hotspot index
let showAll = false;       // toggle every label on at once
let pulsePhase = 0;        // animates highlight rings

// UI buttons
let btnSendFood, btnReset, btnShowAll;

// ----- Food particle animation state -----
let foodActive = false;
let foodSegmentIdx = 0;    // index in journeyPath
let foodT = 0;             // 0..1 progress along current segment
let foodPauseTimer = 0;    // frames remaining of pause at a stop
let currentStopMsg = '';   // explanation shown while paused
let lastStopOrganId = null;
let foodX = 0, foodY = 0;
// "Absorption" splash to liver — when true, a small particle travels
// from the small intestine over to the liver while main particle keeps
// going.
let absorptionActive = false;
let absorptionT = 0;
let absorptionFrom = {x:0,y:0};
let absorptionTo   = {x:0,y:0};

// Sequence of (organId, action) the food particle follows.
// action: 'travel' moves to that organ; 'churn' adds a churn animation;
// 'absorb' triggers a side-particle to the liver.
let journey = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Segoe UI, Arial, sans-serif');

  buildOrgans();
  buildJourney();

  // Buttons
  let btnY = titleHeight + drawHeight + infoHeight + 22;
  btnSendFood = createButton('Send Food');
  styleButton(btnSendFood, '#2e7d32');
  btnSendFood.mousePressed(startFoodJourney);

  btnShowAll = createButton('Show All Labels');
  styleButton(btnShowAll, '#6d4c41');
  btnShowAll.mousePressed(() => { showAll = !showAll; });

  btnReset = createButton('Reset');
  styleButton(btnReset, '#f57c00');
  btnReset.mousePressed(resetSim);

  positionButtons();
}

function positionButtons() {
  let btnY = titleHeight + drawHeight + infoHeight + 22;
  // Place three buttons centered: SendFood | ShowAll | Reset
  btnSendFood.position(canvasWidth / 2 - 230, btnY);
  btnShowAll.position(canvasWidth / 2 - 90,  btnY);
  btnReset.position(canvasWidth / 2 + 130, btnY);
}

function draw() {
  background(COLOR_BG);
  pulsePhase += 0.06;

  drawTitleBar();
  drawTorso();
  drawAllOrgans();
  drawHotspotRings();
  drawHotspotLabels();
  updateAndDrawFood();
  drawInfoPanel();
}

// =============================================================
// TITLE BAR
// =============================================================
function drawTitleBar() {
  push();
  noStroke();
  fill(COLOR_TITLE_BG);
  rect(0, 0, canvasWidth, titleHeight);
  fill(COLOR_TITLE_TEXT);
  textAlign(LEFT, CENTER);
  textSize(17);
  textStyle(BOLD);
  text('Digestive System Nutrient Journey', 20, titleHeight / 2);
  textStyle(NORMAL);
  textSize(12);
  textAlign(RIGHT, CENTER);
  text('Click an organ, or press Send Food', canvasWidth - 20, titleHeight / 2);
  pop();
}

// =============================================================
// TORSO SILHOUETTE
// =============================================================
function drawTorso() {
  // Stylized head + torso. Head is a circle at top; torso is a
  // rounded trapezoid (wider at shoulders, slightly narrower at hips).
  push();
  stroke(COLOR_TORSO_LINE);
  strokeWeight(2);
  fill(COLOR_TORSO_FILL);

  // Head
  const headCx = canvasWidth / 2;
  const headCy = titleHeight + 60;
  const headR = 42;
  ellipse(headCx, headCy, headR * 2, headR * 2.1);

  // Neck
  rect(headCx - 18, headCy + headR - 4, 36, 28, 8);

  // Torso body (rounded rectangle approximating shoulders→hips)
  const torsoTop = headCy + headR + 22;
  const torsoBot = titleHeight + drawHeight - 30;
  const torsoLeft  = canvasWidth / 2 - 180;
  const torsoRight = canvasWidth / 2 + 180;
  beginShape();
  // shoulders
  vertex(torsoLeft + 10, torsoTop);
  vertex(torsoRight - 10, torsoTop);
  // right side curving in slightly at the waist then out at hips
  bezierVertex(torsoRight + 10, torsoTop + 60,
               torsoRight - 10, torsoTop + 160,
               torsoRight - 20, torsoBot - 10);
  // bottom (hips)
  bezierVertex(torsoRight - 30, torsoBot,
               torsoLeft + 30, torsoBot,
               torsoLeft + 20, torsoBot - 10);
  // left side curving back up
  bezierVertex(torsoLeft + 10, torsoTop + 160,
               torsoLeft - 10, torsoTop + 60,
               torsoLeft + 10, torsoTop);
  endShape(CLOSE);
  pop();
}

// =============================================================
// ORGAN DEFINITIONS
// =============================================================
function buildOrgans() {
  const cx = canvasWidth / 2;
  // Mouth — at the head (top)
  const mouthY = titleHeight + 70;
  // Anchor points (approximate centers) for layout
  const esoTopY    = titleHeight + 120;
  const esoBotY    = titleHeight + 230;
  const stomachX   = cx - 60;
  const stomachY   = titleHeight + 260;
  const liverX     = cx + 75;
  const liverY     = titleHeight + 245;
  const gallX      = cx + 65;
  const gallY      = titleHeight + 295;
  const pancreasX  = cx - 5;
  const pancreasY  = titleHeight + 310;
  const siCx       = cx;
  const siCy       = titleHeight + 405;
  const liCx       = cx;
  const liCy       = titleHeight + 380;

  organs = [
    {
      id: 'mouth',
      name: 'Mouth',
      cx: cx, cy: mouthY,
      hitR: 32,
      journeyPoint: {x: cx, y: mouthY + 5},
      tooltip: 'Salivary amylase begins starch digestion. Chewing increases surface area for enzymes.',
      color: COLOR_MOUTH,
      labelOffset: {x: -80, y: -30},
      draw: drawMouth
    },
    {
      id: 'esophagus',
      name: 'Esophagus',
      cx: cx, cy: (esoTopY + esoBotY) / 2,
      hitR: 26,
      journeyPoint: {x: cx, y: esoBotY - 5},
      tooltip: 'No digestion here — just transport via peristalsis. Food takes 2–3 seconds to travel from mouth to stomach.',
      color: COLOR_ESOPHAGUS,
      labelOffset: {x: 50, y: -10},
      draw: () => drawEsophagus(cx, esoTopY, esoBotY)
    },
    {
      id: 'stomach',
      name: 'Stomach',
      cx: stomachX, cy: stomachY,
      hitR: 50,
      journeyPoint: {x: stomachX, y: stomachY + 5},
      tooltip: 'pH 1.5–3.5. Pepsin digests protein. Strong churning turns food into chyme. Gastric emptying takes 2–6 hours.',
      color: COLOR_STOMACH,
      labelOffset: {x: -150, y: 0},
      draw: () => drawStomach(stomachX, stomachY)
    },
    {
      id: 'liver',
      name: 'Liver',
      cx: liverX, cy: liverY,
      hitR: 48,
      journeyPoint: {x: liverX, y: liverY},
      tooltip: 'All absorbed nutrients from the small intestine arrive here first. The liver packages fats, converts fructose, detoxifies, and regulates blood glucose.',
      color: COLOR_LIVER,
      labelOffset: {x: 60, y: -30},
      draw: () => drawLiver(liverX, liverY)
    },
    {
      id: 'gallbladder',
      name: 'Gallbladder',
      cx: gallX, cy: gallY,
      hitR: 14,
      journeyPoint: {x: gallX, y: gallY},
      tooltip: 'Stores and concentrates bile produced by the liver. Releases bile into the small intestine when fat is present.',
      color: COLOR_GALL,
      labelOffset: {x: 70, y: 10},
      draw: () => drawGallbladder(gallX, gallY)
    },
    {
      id: 'pancreas',
      name: 'Pancreas',
      cx: pancreasX, cy: pancreasY,
      hitR: 22,
      journeyPoint: {x: pancreasX, y: pancreasY},
      tooltip: 'Secretes digestive enzymes (amylase, lipase, trypsin) into the small intestine, plus hormones (insulin, glucagon) directly into the blood.',
      color: COLOR_PANCREAS,
      labelOffset: {x: -160, y: -25},
      draw: () => drawPancreas(pancreasX, pancreasY)
    },
    {
      id: 'large_intestine',
      name: 'Large intestine',
      cx: liCx + 110, cy: liCy + 80,
      hitR: 28,
      // We define a custom multi-segment path inside the LI in buildJourney
      journeyPoint: {x: liCx - 110, y: liCy + 120},
      tooltip: 'Absorbs water and electrolytes. Gut microbiome ferments fiber here. Waste transit takes 24–72 hours.',
      color: COLOR_LI,
      labelOffset: {x: 60, y: -50},
      draw: () => drawLargeIntestine(liCx, liCy)
    },
    {
      id: 'small_intestine',
      name: 'Small intestine',
      cx: siCx, cy: siCy + 15,
      hitR: 34,
      journeyPoint: {x: siCx, y: siCy + 15},
      tooltip: 'The powerhouse of digestion. 20 feet of tubing lined with villi. Fats, proteins, and carbohydrates are all fully digested and absorbed here. Bile from the liver emulsifies fat.',
      color: COLOR_SI,
      labelOffset: {x: -180, y: 30},
      draw: () => drawSmallIntestine(siCx, siCy)
    }
  ];
}

// =============================================================
// JOURNEY PATH — sequence of waypoints the food particle follows
// =============================================================
function buildJourney() {
  // Build a list of stops. At each stop we pause and show the
  // organ's tooltip text. Some stops carry a special 'action'
  // (churn, absorb). Path segments are linear between consecutive
  // (x,y) waypoints — multiple waypoints per organ create the long
  // coiled small-intestine travel.
  const cx = canvasWidth / 2;
  const top = titleHeight;

  // Helper: find organ by id
  const O = (id) => organs.find(o => o.id === id);

  journey = [
    { organId: 'mouth',     points: [O('mouth').journeyPoint], action: null },
    { organId: 'esophagus', points: [
        {x: cx, y: top + 130},
        {x: cx, y: top + 180},
        O('esophagus').journeyPoint
      ], action: null },
    { organId: 'stomach',   points: [
        {x: O('stomach').cx + 10, y: O('stomach').cy - 25},
        O('stomach').journeyPoint
      ], action: 'churn' },
    { organId: 'small_intestine', points: [
        // long coiled travel — zig-zag through SI bulk
        {x: cx - 30, y: top + 390},
        {x: cx + 35, y: top + 405},
        {x: cx - 35, y: top + 425},
        {x: cx + 35, y: top + 445},
        {x: cx,      y: top + 455}
      ], action: 'absorb' },
    { organId: 'large_intestine', points: [
        // up the right side (ascending colon)
        {x: cx + 110, y: top + 430},
        {x: cx + 110, y: top + 350},
        // across (transverse colon)
        {x: cx - 110, y: top + 345},
        // down the left side (descending colon)
        {x: cx - 110, y: top + 470},
        // out
        {x: cx - 110, y: top + 500}
      ], action: null }
  ];
}

// =============================================================
// ORGAN DRAW HELPERS
// =============================================================
function drawMouth(cx, cy) {
  push();
  const o = organs.find(x => x.id === 'mouth');
  noStroke();
  fill(COLOR_MOUTH);
  // a small smile / horizontal oval representing the mouth
  ellipse(o.cx, o.cy, 36, 14);
  stroke(120, 30, 30);
  strokeWeight(1.5);
  noFill();
  arc(o.cx, o.cy - 2, 28, 14, 0, PI);
  pop();
}

function drawEsophagus(cx, topY, botY) {
  push();
  noStroke();
  fill(COLOR_ESOPHAGUS);
  rect(cx - 9, topY, 18, botY - topY, 6);
  // peristalsis stripes
  stroke(120, 100, 90, 150);
  strokeWeight(1);
  for (let y = topY + 12; y < botY - 6; y += 14) {
    line(cx - 9, y, cx + 9, y);
  }
  pop();
}

function drawStomach(sx, sy) {
  push();
  noStroke();
  fill(COLOR_STOMACH);
  // J-shaped stomach using an ellipse with a curved tail
  beginShape();
  vertex(sx - 50, sy - 30);
  bezierVertex(sx - 70, sy - 10, sx - 60, sy + 35, sx - 20, sy + 45);
  bezierVertex(sx + 20, sy + 50, sx + 35, sy + 30, sx + 30, sy + 5);
  bezierVertex(sx + 25, sy - 25, sx - 5, sy - 45, sx - 50, sy - 30);
  endShape(CLOSE);
  // gentle highlight
  fill(255, 255, 255, 60);
  ellipse(sx - 15, sy - 10, 30, 14);
  pop();
}

function drawLiver(lx, ly) {
  push();
  noStroke();
  fill(COLOR_LIVER);
  // wedge-shaped liver
  beginShape();
  vertex(lx - 50, ly - 25);
  vertex(lx + 55, ly - 30);
  bezierVertex(lx + 65, ly + 5, lx + 35, ly + 30, lx + 5, ly + 30);
  bezierVertex(lx - 30, ly + 28, lx - 55, ly + 5, lx - 50, ly - 25);
  endShape(CLOSE);
  // lobe divider
  stroke(60, 30, 15, 150);
  strokeWeight(1.2);
  line(lx + 5, ly - 28, lx + 5, ly + 28);
  pop();
}

function drawGallbladder(gx, gy) {
  push();
  noStroke();
  fill(COLOR_GALL);
  ellipse(gx, gy, 14, 22);
  pop();
}

function drawPancreas(px, py) {
  push();
  noStroke();
  fill(COLOR_PANCREAS);
  // tadpole shape pointing right
  beginShape();
  vertex(px - 38, py + 4);
  bezierVertex(px - 30, py - 10, px + 10, py - 8, px + 30, py - 2);
  vertex(px + 38, py + 2);
  bezierVertex(px + 25, py + 8, px - 10, py + 10, px - 38, py + 4);
  endShape(CLOSE);
  pop();
}

function drawSmallIntestine(sx, sy) {
  push();
  noStroke();
  fill(COLOR_SI);
  // coiled tube approximated by overlapping rounded blobs.
  // Kept narrow enough to sit INSIDE the large intestine frame.
  const baseY = sy - 10;
  for (let i = 0; i < 3; i++) {
    const y = baseY + i * 20;
    ellipse(sx - 32, y, 76, 26);
    ellipse(sx + 32, y, 76, 26);
    ellipse(sx,       y + 9, 92, 24);
  }
  // outline strokes for texture
  stroke(190, 100, 130, 160);
  strokeWeight(1);
  noFill();
  for (let i = 0; i < 3; i++) {
    const y = baseY + i * 20;
    ellipse(sx - 32, y, 76, 26);
    ellipse(sx + 32, y, 76, 26);
  }
  pop();
}

function drawLargeIntestine(lx, ly) {
  push();
  noStroke();
  fill(COLOR_LI);
  // Inverted-U "frame": ascending (right vertical), transverse (top),
  // descending (left vertical). Drawn as thick rounded rects.
  // The frame surrounds the small intestine: transverse is above SI,
  // verticals run down past SI on either side.
  const armW = 30;     // tube thickness
  const topY = ly - 40;            // top of transverse colon
  const botY = ly + 130;           // bottom of vertical arms
  const leftX  = lx - 130;
  const rightX = lx + 130;
  // ascending (right side, goes up)
  rect(rightX - armW/2, topY, armW, botY - topY, 14);
  // descending (left side, goes down)
  rect(leftX - armW/2,  topY, armW, botY - topY, 14);
  // transverse (across the top)
  rect(leftX - armW/2,  topY, rightX - leftX + armW, armW, 14);
  // outline
  stroke(140, 110, 110);
  strokeWeight(1.2);
  noFill();
  rect(rightX - armW/2, topY, armW, botY - topY, 14);
  rect(leftX - armW/2,  topY, armW, botY - topY, 14);
  rect(leftX - armW/2,  topY, rightX - leftX + armW, armW, 14);
  pop();
}

function drawAllOrgans() {
  // Order matters: large intestine (frames), then small intestine
  // (sits inside), then accessory organs on top.
  drawLargeIntestine(canvasWidth/2, titleHeight + 390);
  drawSmallIntestine(canvasWidth/2, titleHeight + 390);

  // Accessory + upper organs
  const upperOrgans = ['stomach','liver','pancreas','gallbladder','esophagus','mouth'];
  for (const id of upperOrgans) {
    const o = organs.find(x => x.id === id);
    if (o && o.draw) o.draw(o.cx, o.cy);
  }
}

// =============================================================
// HOTSPOT RINGS + LABELS
// =============================================================
function drawHotspotRings() {
  push();
  noFill();
  const pulse = 4 + sin(pulsePhase) * 3;
  for (const o of organs) {
    const isSelected = (selectedId === o.id);
    const isHovered = isMouseOverOrgan(o);
    if (isSelected || isHovered) {
      stroke(COLOR_HIGHLIGHT);
      strokeWeight(2.5);
      ellipse(o.cx, o.cy, (o.hitR * 2) + pulse * 2, (o.hitR * 2) + pulse * 2);
    } else if (!showAll) {
      // gentle pulse on all unselected
      let c = color(COLOR_HIGHLIGHT);
      c.setAlpha(70);
      stroke(c);
      strokeWeight(1.5);
      ellipse(o.cx, o.cy, (o.hitR * 2) + pulse, (o.hitR * 2) + pulse);
    }
  }
  pop();
}

function drawHotspotLabels() {
  push();
  textSize(12);
  textStyle(BOLD);
  for (const o of organs) {
    const reveal = showAll || (selectedId === o.id);
    if (!reveal) continue;
    const lx = o.cx + o.labelOffset.x;
    const ly = o.cy + o.labelOffset.y;
    // label pill
    const labelStr = o.name;
    const w = textWidth(labelStr) + 14;
    noStroke();
    let bg = color(255, 255, 255, 240);
    fill(bg);
    rect(lx - w/2, ly - 11, w, 20, 6);
    stroke(COLOR_HIGHLIGHT);
    strokeWeight(1);
    noFill();
    rect(lx - w/2, ly - 11, w, 20, 6);
    // connector
    line(lx, ly + 9, o.cx, o.cy);
    // text
    noStroke();
    fill(COLOR_TEXT_DARK);
    textAlign(CENTER, CENTER);
    text(labelStr, lx, ly);
  }
  pop();
}

function isMouseOverOrgan(o) {
  const d = dist(mouseX, mouseY, o.cx, o.cy);
  return d <= o.hitR;
}

// =============================================================
// INFO PANEL (bottom)
// =============================================================
function drawInfoPanel() {
  push();
  const panelY = titleHeight + drawHeight;
  noStroke();
  fill(COLOR_PANEL_BG);
  rect(10, panelY + 6, canvasWidth - 20, infoHeight - 12, 8);
  stroke(COLOR_PANEL_BORDER);
  strokeWeight(1.5);
  noFill();
  rect(10, panelY + 6, canvasWidth - 20, infoHeight - 12, 8);

  noStroke();
  fill(COLOR_TEXT_DARK);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(14);

  let title = 'Click any organ above to read its role';
  let body  = 'Press Send Food to watch a particle travel through the digestive tract. Tap Show All Labels to see every organ named at once.';

  if (foodActive && currentStopMsg) {
    const stopOrgan = organs.find(o => o.id === lastStopOrganId);
    title = (stopOrgan ? stopOrgan.name : 'Traveling') + ' — food is here now';
    body  = currentStopMsg;
  } else if (selectedId) {
    const o = organs.find(x => x.id === selectedId);
    if (o) {
      title = o.name;
      body  = o.tooltip;
    }
  }

  text(title, 24, panelY + 16);
  textStyle(NORMAL);
  textSize(13);
  fill(COLOR_TEXT_MUTED);
  text(body, 24, panelY + 40, canvasWidth - 48, infoHeight - 50);
  pop();
}

// =============================================================
// FOOD PARTICLE ANIMATION
// =============================================================
function startFoodJourney() {
  foodActive = true;
  foodSegmentIdx = 0;
  foodT = 0;
  foodPauseTimer = 0;
  lastStopOrganId = null;
  currentStopMsg = '';
  selectedId = null;
  absorptionActive = false;
  // Start at mouth
  const mouth = organs.find(o => o.id === 'mouth');
  foodX = mouth.cx;
  foodY = mouth.cy - 20;  // begins just above the mouth (about to drop)
}

function updateAndDrawFood() {
  if (!foodActive) return;

  // Handle pause at a stop
  if (foodPauseTimer > 0) {
    foodPauseTimer--;
    drawFoodParticle();
    updateAbsorption();
    if (foodPauseTimer === 0) {
      // pause finished — clear msg only if continuing
      if (foodSegmentIdx >= journey.length) {
        // journey finished — finalize
        currentStopMsg = 'Digestion complete! Undigested material exits the body. Total transit time can range from 24 to 72 hours.';
        lastStopOrganId = 'large_intestine';
        // keep foodActive true so the final message stays in the panel
        // until the user resets or sends again
        return;
      }
    }
    return;
  }

  // No pause active — advance along current journey segment
  const stop = journey[foodSegmentIdx];
  if (!stop) {
    // done — show final message and turn off motion
    foodActive = false;
    return;
  }

  // We treat 'points' as an ordered polyline. foodT advances along
  // the *full polyline* of this stop. Compute total length and current
  // position by walking segments.
  const pts = [{x: foodX, y: foodY}].concat(stop.points);
  // Actually simpler: maintain a sub-index. We'll use foodT as a 0..1
  // along *one* sub-segment, and use a hidden state.
  // Instead, transform: build a flat list of micro-segments once per stop.
  if (!stop._microSegments) {
    // First entry into this stop — build sub-segments from current
    // position through each point.
    let prev = {x: foodX, y: foodY};
    stop._microSegments = [];
    for (const p of stop.points) {
      stop._microSegments.push({a: prev, b: p});
      prev = p;
    }
    stop._currentMicro = 0;
  }

  const micro = stop._microSegments[stop._currentMicro];
  foodT += 0.018;  // travel speed
  if (foodT >= 1) {
    foodT = 1;
    foodX = micro.b.x;
    foodY = micro.b.y;
    stop._currentMicro++;
    foodT = 0;
    if (stop._currentMicro >= stop._microSegments.length) {
      // Reached the final waypoint of this stop — pause & explain
      const organ = organs.find(o => o.id === stop.organId);
      lastStopOrganId = stop.organId;
      currentStopMsg = organ ? organ.tooltip : '';
      selectedId = stop.organId;     // highlight the organ
      foodPauseTimer = 90;            // ~1.5s at 60fps

      // Special actions
      if (stop.action === 'churn') {
        foodPauseTimer = 120;         // longer churn
      } else if (stop.action === 'absorb') {
        // trigger a nutrient particle to liver
        absorptionActive = true;
        absorptionT = 0;
        absorptionFrom = {x: foodX, y: foodY};
        const liver = organs.find(o => o.id === 'liver');
        absorptionTo = {x: liver.cx, y: liver.cy};
        foodPauseTimer = 130;
      }
      foodSegmentIdx++;
    }
  } else {
    foodX = lerp(micro.a.x, micro.b.x, foodT);
    foodY = lerp(micro.a.y, micro.b.y, foodT);
  }

  drawFoodParticle();
  updateAbsorption();
}

function drawFoodParticle() {
  push();
  // Stomach churn — jitter the particle a little during churn pause
  let jx = 0, jy = 0;
  if (foodPauseTimer > 0 && lastStopOrganId === 'stomach') {
    jx = random(-6, 6);
    jy = random(-4, 4);
  }
  noStroke();
  // soft glow
  let glow = color(COLOR_FOOD);
  glow.setAlpha(80);
  fill(glow);
  ellipse(foodX + jx, foodY + jy, 22, 22);
  // core
  fill(COLOR_FOOD);
  ellipse(foodX + jx, foodY + jy, 14, 14);
  // highlight
  fill(255, 255, 255, 160);
  ellipse(foodX + jx - 3, foodY + jy - 3, 5, 5);
  pop();
}

function updateAbsorption() {
  if (!absorptionActive) return;
  absorptionT += 0.02;
  if (absorptionT >= 1) {
    absorptionActive = false;
    return;
  }
  const x = lerp(absorptionFrom.x, absorptionTo.x, absorptionT);
  const y = lerp(absorptionFrom.y, absorptionTo.y, absorptionT);
  push();
  noStroke();
  let c = color(COLOR_FOOD);
  c.setAlpha(180);
  fill(c);
  ellipse(x, y, 9, 9);
  // dotted trail
  stroke(245, 124, 0, 120);
  strokeWeight(1);
  for (let i = 0; i < 5; i++) {
    const t = max(0, absorptionT - i * 0.04);
    const tx = lerp(absorptionFrom.x, absorptionTo.x, t);
    const ty = lerp(absorptionFrom.y, absorptionTo.y, t);
    point(tx, ty);
  }
  pop();
}

function resetSim() {
  foodActive = false;
  foodSegmentIdx = 0;
  foodT = 0;
  foodPauseTimer = 0;
  currentStopMsg = '';
  lastStopOrganId = null;
  selectedId = null;
  showAll = false;
  absorptionActive = false;
  // Clear cached micro-segments so next Send Food rebuilds them
  for (const s of journey) {
    delete s._microSegments;
    delete s._currentMicro;
  }
}

// =============================================================
// INTERACTION
// =============================================================
function mousePressed() {
  // Only handle clicks inside the drawing area (not over buttons or panel)
  if (mouseY < titleHeight || mouseY > titleHeight + drawHeight) return;
  // Find topmost organ under cursor
  // Iterate small-radius organs first so gallbladder/pancreas win over
  // overlapping liver/stomach.
  const ordered = [...organs].sort((a, b) => a.hitR - b.hitR);
  for (const o of ordered) {
    if (isMouseOverOrgan(o)) {
      selectedId = o.id;
      return;
    }
  }
  // Clicked empty space — clear selection
  selectedId = null;
}

// =============================================================
// BUTTON STYLING
// =============================================================
function styleButton(b, bgColor) {
  b.style('background-color', bgColor);
  b.style('color', '#ffffff');
  b.style('border', 'none');
  b.style('border-radius', '6px');
  b.style('padding', '8px 18px');
  b.style('font-size', '14px');
  b.style('font-weight', '600');
  b.style('cursor', 'pointer');
  b.style('font-family', 'Segoe UI, Arial, sans-serif');
  b.style('box-shadow', '0 1px 3px rgba(0,0,0,0.2)');
}

// =============================================================
// RESPONSIVE — fixed canvas; hook present per project convention
// =============================================================
function updateCanvasSize() {
  // Keep canvas at native size; the iframe handles container width.
  // Hook is present per project convention (must be first call in setup).
}

function windowResized() {
  if (btnSendFood && btnReset && btnShowAll) {
    positionButtons();
  }
}
