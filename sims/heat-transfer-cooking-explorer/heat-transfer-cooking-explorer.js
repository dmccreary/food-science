// Heat Transfer in Cooking Explorer - Food Science MicroSim
// CANVAS_HEIGHT: 620
// Three side-by-side panels show Conduction, Convection, Radiation.
// A scenario selector at the top highlights which mode(s) dominate.

// ----- Layout constants -----
let canvasWidth = 760;
let drawHeight = 560;
let controlHeight = 60;
let canvasHeight = drawHeight + controlHeight;
let margin = 10;
let defaultTextSize = 14;

// Top header band
let titleY = 22;
let selectorRowY = 50;     // dropdown row

// Three panel layout
let panelTopY = 90;
let panelHeight = 320;
let panelGap = 8;
let panelWidth;            // computed in setup

// Below-panels explanation box
let explanationY;          // computed in setup
let explanationH = 110;

// Colors (book palette)
const COLOR_BG       = '#f1f8e9';
const COLOR_PANEL_BG = '#ffffff';
const COLOR_BORDER   = '#bdbdbd';
const COLOR_TITLE    = '#1b5e20';
const COLOR_PRIMARY  = '#2e7d32';   // active mode (green)
const COLOR_ACCENT   = '#f57c00';   // heat / warm
const COLOR_COOL     = '#1e88e5';   // cool
const COLOR_GOLD     = '#fbc02d';   // selected highlight
const COLOR_RED      = '#e53935';   // radiation infrared
const COLOR_METAL    = '#9e9e9e';   // pan metal
const COLOR_FOOD     = '#ffb74d';   // food piece
const COLOR_TEXT     = '#212121';
const COLOR_MUTED    = '#616161';

// ----- Scenarios -----
// modes: which of conduction/convection/radiation dominate
const scenarios = [
  { id: 'select',     label: 'Select a cooking scenario...', modes: [],
    text: 'Pick a scenario above. Each one uses one or more modes of heat transfer.' },
  { id: 'pan',        label: 'Pan-frying an egg',           modes: ['conduction','convection'],
    text: 'Pan-frying: CONDUCTION dominates as the hot metal touches the egg. A little CONVECTION happens in the oil layer.' },
  { id: 'soup',       label: 'Boiling a pot of soup',       modes: ['convection','conduction'],
    text: 'Boiling soup: CONVECTION dominates as hot liquid rises and cool liquid sinks. CONDUCTION starts the process at the pot bottom.' },
  { id: 'broil',      label: 'Broiling chicken',            modes: ['radiation'],
    text: 'Broiling: RADIATION dominates. Infrared waves from the glowing element travel through air and cook the surface.' },
  { id: 'microwave',  label: 'Microwave reheating',         modes: ['radiation'],
    text: 'Microwaving: RADIATION dominates. Microwaves (a kind of radiation) wiggle water molecules deep inside the food.' },
  { id: 'campfire',   label: 'Roasting over a campfire',    modes: ['radiation','convection'],
    text: 'Campfire roasting: RADIATION from the glowing coals + CONVECTION from rising hot air both cook the food.' }
];

let currentScenario = scenarios[0];

// ----- Animated elements -----
// Conduction: vibrating molecules
let conductionMolecules = [];   // {baseX, baseY, phase, heat}
// Convection: particles tracing a loop
let convectionParticles = [];   // {angle, speed, radius}
// Radiation: wavy lines
let radiationWavePhase = 0;

// Tooltip / click-to-learn
let activeTooltip = null;       // {x, y, w, h, lines:[]} OR null
let activeTooltipText = '';

// UI
let scenarioSelect;
let resetButton;

function updateCanvasSize() {
  const container = document.querySelector('main').parentElement;
  if (container) {
    const w = container.clientWidth;
    if (w && w > 320) {
      canvasWidth = Math.min(w - 20, 900);
    }
  }
  panelWidth = Math.floor((canvasWidth - margin * 2 - panelGap * 2) / 3);
  explanationY = panelTopY + panelHeight + 14;
}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Segoe UI');
  textSize(defaultTextSize);

  // Conduction molecules: a 6-col x 3-row lattice inside the pan
  buildConductionMolecules();
  // Convection particles: positions are computed from an angle
  for (let i = 0; i < 14; i++) {
    convectionParticles.push({
      t: i / 14,                  // 0..1 around loop
      speed: 0.0035 + random(-0.0008, 0.0008)
    });
  }

  // ----- Controls -----
  scenarioSelect = createSelect();
  for (const sc of scenarios) scenarioSelect.option(sc.label, sc.id);
  scenarioSelect.selected('select');
  scenarioSelect.changed(onScenarioChange);

  resetButton = createButton('Reset');
  resetButton.mousePressed(onReset);

  positionControls();
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  buildConductionMolecules();
  positionControls();
}

function positionControls() {
  // Place the dropdown + reset button in the controls area below the canvas
  const ctrlY = drawHeight + 16;
  scenarioSelect.position(margin + 10, ctrlY);
  scenarioSelect.size(280);
  resetButton.position(margin + 310, ctrlY);
}

function buildConductionMolecules() {
  conductionMolecules = [];
  // panel coords
  const px = margin;
  const py = panelTopY;
  const pw = panelWidth;
  const ph = panelHeight;
  // pan interior region (where molecules live) - matches pan rect drawn below
  // pan rect: x=px+12, y=py+145, w=pw-24, h=80  → bottom = py+225
  const panLeft   = px + 25;
  const panRight  = px + pw - 25;
  const panTop    = py + 155;
  const panBottom = py + 218;
  const cols = 7;
  const rows = 3;
  const dx = (panRight - panLeft) / (cols - 1);
  const dy = (panBottom - panTop) / (rows - 1);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      conductionMolecules.push({
        baseX: panLeft + c * dx,
        baseY: panTop + r * dy,
        phase: random(TWO_PI),
        // bottom row = hottest (closest to burner), top row = cooler (heat travels up)
        heat: 0.45 + (r / (rows - 1)) * 0.55
      });
    }
  }
}

function onScenarioChange() {
  const id = scenarioSelect.value();
  currentScenario = scenarios.find(s => s.id === id) || scenarios[0];
  activeTooltip = null;
}

function onReset() {
  scenarioSelect.selected('select');
  currentScenario = scenarios[0];
  activeTooltip = null;
}

// ----- Draw -----
function draw() {
  background(COLOR_BG);
  drawHeader();
  drawPanel(0, 'Conduction', 'conduction', drawConductionContents);
  drawPanel(1, 'Convection', 'convection', drawConvectionContents);
  drawPanel(2, 'Radiation',  'radiation',  drawRadiationContents);
  drawExplanationBox();
  drawControlBackdrop();
  drawTooltip();
  radiationWavePhase += 0.06;
}

function drawHeader() {
  noStroke();
  fill(COLOR_TITLE);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(18);
  text('Three Modes of Heat Transfer in Cooking', canvasWidth / 2, titleY);
  textStyle(NORMAL);
  textSize(13);
  fill(COLOR_MUTED);
  text('Choose a cooking scenario below to see which mode(s) dominate. Click molecules, currents, or waves for explanations.',
       canvasWidth / 2, selectorRowY + 5);
  textAlign(LEFT, BASELINE);
  textSize(defaultTextSize);
}

function drawPanel(index, title, modeKey, contentFn) {
  const px = margin + index * (panelWidth + panelGap);
  const py = panelTopY;
  const pw = panelWidth;
  const ph = panelHeight;

  const isActive = currentScenario.modes.includes(modeKey);

  // Gold highlight outline if active
  if (isActive) {
    noFill();
    stroke(COLOR_GOLD);
    strokeWeight(5);
    rect(px - 2, py - 2, pw + 4, ph + 4, 12);
  }

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
  fill(isActive ? COLOR_PRIMARY : '#e8f5e9');
  rect(px, py, pw, 32, 10, 10, 0, 0);
  fill(isActive ? '#ffffff' : COLOR_TITLE);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(15);
  text(title, px + pw / 2, py + 16);
  textStyle(NORMAL);
  textSize(defaultTextSize);
  textAlign(LEFT, BASELINE);

  // Mode badge (active label)
  if (isActive) {
    noStroke();
    fill(COLOR_GOLD);
    rect(px + pw - 60, py + 38, 52, 18, 9);
    fill(COLOR_TEXT);
    textAlign(CENTER, CENTER);
    textSize(11);
    textStyle(BOLD);
    text('ACTIVE', px + pw - 34, py + 47);
    textStyle(NORMAL);
    textSize(defaultTextSize);
    textAlign(LEFT, BASELINE);
  }

  // Content
  contentFn(px, py, pw, ph);
}

// ----- Conduction panel -----
function drawConductionContents(px, py, pw, ph) {
  // Caption
  noStroke();
  fill(COLOR_MUTED);
  textAlign(CENTER, TOP);
  textSize(11);
  text('Hot pan vibrates molecules.\nClick a molecule.', px + pw / 2, py + 60);
  textSize(defaultTextSize);
  textAlign(LEFT, BASELINE);

  // Burner glow under the pan
  const burnerY = py + ph - 30;
  for (let i = 0; i < 4; i++) {
    const c = color(COLOR_ACCENT);
    c.setAlpha(60 - i * 14);
    fill(c);
    noStroke();
    ellipse(px + pw / 2, burnerY, pw - 30 + i * 10, 22 + i * 8);
  }
  // Burner element line
  stroke(COLOR_RED);
  strokeWeight(4);
  line(px + 15, burnerY, px + pw - 15, burnerY);

  // Pan (metal slab)
  noStroke();
  fill(COLOR_METAL);
  rect(px + 12, py + 145, pw - 24, 80, 4);
  // pan handle
  fill('#616161');
  rect(px + pw - 18, py + 165, 14, 14, 3);

  // Upward heat arrows (3 arrows)
  stroke(COLOR_ACCENT);
  strokeWeight(2);
  for (let i = 0; i < 3; i++) {
    const ax = px + 25 + i * ((pw - 50) / 2);
    const aTop = py + 110;
    const aBot = py + 140;
    line(ax, aBot, ax, aTop);
    line(ax, aTop, ax - 4, aTop + 6);
    line(ax, aTop, ax + 4, aTop + 6);
  }
  noStroke();
  fill(COLOR_ACCENT);
  textAlign(CENTER, BOTTOM);
  textSize(10);
  text('heat', px + pw / 2, py + 108);
  textSize(defaultTextSize);
  textAlign(LEFT, BASELINE);

  // Vibrating molecules
  for (const m of conductionMolecules) {
    const amp = 2 + m.heat * 3.5;
    const x = m.baseX + sin(frameCount * 0.25 + m.phase) * amp;
    const y = m.baseY + cos(frameCount * 0.30 + m.phase) * amp;
    // color from cool blue to hot orange/red
    const r = lerp(30, 229, m.heat);
    const g = lerp(136, 57, m.heat);
    const b = lerp(229, 53, m.heat);
    fill(r, g, b);
    stroke(255);
    strokeWeight(1);
    ellipse(x, y, 12, 12);
  }
}

// ----- Convection panel -----
function drawConvectionContents(px, py, pw, ph) {
  // Caption
  noStroke();
  fill(COLOR_MUTED);
  textAlign(CENTER, TOP);
  textSize(11);
  text('Hot water rises, cool water sinks.\nClick a current.', px + pw / 2, py + 60);
  textSize(defaultTextSize);
  textAlign(LEFT, BASELINE);

  // Burner glow
  const burnerY = py + ph - 18;
  const c = color(COLOR_ACCENT);
  c.setAlpha(80);
  fill(c);
  noStroke();
  ellipse(px + pw / 2, burnerY, pw - 40, 14);

  // Pot interior region
  const potLeft = px + 25;
  const potRight = px + pw - 25;
  const potTop = py + 110;
  const potBot = py + ph - 35;
  const potW = potRight - potLeft;
  const potH = potBot - potTop;
  const potCX = (potLeft + potRight) / 2;
  const potCY = (potTop + potBot) / 2;

  // Pot body
  fill('#cfd8dc');
  stroke('#546e7a');
  strokeWeight(2);
  rect(potLeft - 5, potTop - 5, potW + 10, potH + 10, 4);

  // Water - a soft vertical gradient (cool blue top -> warm tint at bottom)
  noStroke();
  for (let i = 0; i < potH; i++) {
    const t = i / potH;
    // top: cool blue, bottom: warm peach (subtle)
    const r = lerp(200, 255, t);
    const g = lerp(225, 220, t);
    const b = lerp(245, 195, t);
    fill(r, g, b);
    rect(potLeft, potTop + i, potW, 1);
  }

  // Convection loop arrows (oval path inside the pot)
  const loopRX = potW * 0.35;
  const loopRY = potH * 0.32;
  // Up-arrow on left, down-arrow on right, plus curved indicators
  // Left ascending arrow
  stroke(COLOR_ACCENT);
  strokeWeight(2.5);
  noFill();
  // left ascending line
  line(potCX - loopRX, potCY + loopRY * 0.7, potCX - loopRX, potCY - loopRY * 0.7);
  // arrowhead up
  line(potCX - loopRX, potCY - loopRY * 0.7, potCX - loopRX - 5, potCY - loopRY * 0.7 + 7);
  line(potCX - loopRX, potCY - loopRY * 0.7, potCX - loopRX + 5, potCY - loopRY * 0.7 + 7);

  // Right descending line (cool)
  stroke(COLOR_COOL);
  line(potCX + loopRX, potCY - loopRY * 0.7, potCX + loopRX, potCY + loopRY * 0.7);
  // arrowhead down
  line(potCX + loopRX, potCY + loopRY * 0.7, potCX + loopRX - 5, potCY + loopRY * 0.7 - 7);
  line(potCX + loopRX, potCY + loopRY * 0.7, potCX + loopRX + 5, potCY + loopRY * 0.7 - 7);

  // Top connector
  stroke(COLOR_MUTED);
  strokeWeight(1.5);
  line(potCX - loopRX, potCY - loopRY * 0.7, potCX + loopRX, potCY - loopRY * 0.7);
  line(potCX - loopRX, potCY + loopRY * 0.7, potCX + loopRX, potCY + loopRY * 0.7);

  // Moving particles around loop (rectangular loop for simplicity)
  for (const p of convectionParticles) {
    p.t = (p.t + p.speed) % 1;
    const pos = loopPosition(p.t, potCX, potCY, loopRX, loopRY * 0.7);
    // Color: warm on rising side (t in [0.25..0.5]), cool on descending side
    let col;
    if (p.t < 0.5) col = color(COLOR_ACCENT);   // left ascending + top going right
    else col = color(COLOR_COOL);               // right descending + bottom going left
    noStroke();
    fill(col);
    ellipse(pos.x, pos.y, 8, 8);
  }

  // Labels
  noStroke();
  fill(COLOR_ACCENT);
  textSize(10);
  textAlign(LEFT, CENTER);
  text('hot', potCX - loopRX + 4, potCY);
  fill(COLOR_COOL);
  textAlign(RIGHT, CENTER);
  text('cool', potCX + loopRX - 4, potCY);
  textAlign(LEFT, BASELINE);
  textSize(defaultTextSize);
}

// Given a parameter t in [0,1], walk a rectangular loop CCW (up on left, right on top, down on right, left on bottom)
function loopPosition(t, cx, cy, rx, ry) {
  // segments: 0..0.25 left going up, 0.25..0.5 top going right, 0.5..0.75 right going down, 0.75..1 bottom going left
  if (t < 0.25) {
    const u = t / 0.25;
    return { x: cx - rx, y: lerp(cy + ry, cy - ry, u) };
  } else if (t < 0.5) {
    const u = (t - 0.25) / 0.25;
    return { x: lerp(cx - rx, cx + rx, u), y: cy - ry };
  } else if (t < 0.75) {
    const u = (t - 0.5) / 0.25;
    return { x: cx + rx, y: lerp(cy - ry, cy + ry, u) };
  } else {
    const u = (t - 0.75) / 0.25;
    return { x: lerp(cx + rx, cx - rx, u), y: cy + ry };
  }
}

// ----- Radiation panel -----
function drawRadiationContents(px, py, pw, ph) {
  // Caption
  noStroke();
  fill(COLOR_MUTED);
  textAlign(CENTER, TOP);
  textSize(11);
  text('Infrared waves travel through air.\nClick a wave.', px + pw / 2, py + 60);
  textSize(defaultTextSize);
  textAlign(LEFT, BASELINE);

  // Heating element at top (glowing red coil)
  const elemY = py + 110;
  const elemX1 = px + 20;
  const elemX2 = px + pw - 20;
  // glow halo
  const halo = color(COLOR_RED);
  halo.setAlpha(70);
  fill(halo);
  noStroke();
  ellipse((elemX1 + elemX2) / 2, elemY, pw - 30, 30);
  // coil (zigzag)
  stroke(COLOR_RED);
  strokeWeight(4);
  noFill();
  beginShape();
  const coils = 6;
  for (let i = 0; i <= coils; i++) {
    const cx = lerp(elemX1, elemX2, i / coils);
    const cy = elemY + (i % 2 === 0 ? -4 : 4);
    vertex(cx, cy);
  }
  endShape();

  // Chicken / food at bottom
  const foodY = py + ph - 50;
  const foodCX = px + pw / 2;
  noStroke();
  fill(COLOR_FOOD);
  ellipse(foodCX, foodY, pw - 80, 40);
  // drumstick handle
  fill('#fff3e0');
  rect(foodCX + (pw - 80) / 2 - 6, foodY - 4, 18, 8, 4);
  // chicken label
  fill(COLOR_TEXT);
  textAlign(CENTER, TOP);
  textSize(10);
  text('food', foodCX, foodY + 22);
  textAlign(LEFT, BASELINE);
  textSize(defaultTextSize);

  // Infrared wavy lines (3 wave columns)
  stroke(COLOR_RED);
  strokeWeight(2);
  noFill();
  const waveTop = elemY + 12;
  const waveBot = foodY - 24;
  const waveCount = 3;
  for (let w = 0; w < waveCount; w++) {
    const wx = lerp(px + 35, px + pw - 35, w / (waveCount - 1));
    beginShape();
    for (let y = waveTop; y <= waveBot; y += 3) {
      const dx = sin((y * 0.25) + radiationWavePhase + w * 1.2) * 6;
      vertex(wx + dx, y);
    }
    endShape();
    // arrowhead at bottom
    line(wx, waveBot, wx - 5, waveBot - 6);
    line(wx, waveBot, wx + 5, waveBot - 6);
  }
}

// ----- Explanation box -----
function drawExplanationBox() {
  const x = margin;
  const y = explanationY;
  const w = canvasWidth - margin * 2;
  const h = explanationH;

  // Box
  noStroke();
  fill('#ffffff');
  rect(x, y, w, h, 8);
  stroke(currentScenario.modes.length ? COLOR_PRIMARY : COLOR_BORDER);
  strokeWeight(2);
  noFill();
  rect(x, y, w, h, 8);

  // Label
  noStroke();
  fill(COLOR_TITLE);
  textStyle(BOLD);
  textSize(13);
  textAlign(LEFT, TOP);
  text('Scenario explanation', x + 12, y + 10);
  textStyle(NORMAL);

  // Body
  fill(COLOR_TEXT);
  textSize(14);
  textAlign(LEFT, TOP);
  text(currentScenario.text, x + 12, y + 32, w - 24, h - 40);

  // Mode chips
  if (currentScenario.modes.length > 0) {
    let cx = x + w - 12;
    for (let i = currentScenario.modes.length - 1; i >= 0; i--) {
      const m = currentScenario.modes[i];
      const label = m.charAt(0).toUpperCase() + m.slice(1);
      textSize(11);
      const tw = textWidth(label) + 16;
      cx -= tw + 6;
      noStroke();
      fill(COLOR_PRIMARY);
      rect(cx, y + 8, tw, 18, 9);
      fill(255);
      textAlign(CENTER, CENTER);
      textStyle(BOLD);
      text(label, cx + tw / 2, y + 17);
      textStyle(NORMAL);
    }
  }
  textAlign(LEFT, BASELINE);
  textSize(defaultTextSize);
}

function drawControlBackdrop() {
  noStroke();
  fill('#e8f5e9');
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke(COLOR_BORDER);
  strokeWeight(1);
  line(0, drawHeight, canvasWidth, drawHeight);
  noStroke();
  fill(COLOR_TITLE);
  textStyle(BOLD);
  textSize(12);
  textAlign(LEFT, CENTER);
  text('Scenario:', margin + 10, drawHeight + 6);
  textStyle(NORMAL);
  textSize(defaultTextSize);
  textAlign(LEFT, BASELINE);
}

// ----- Tooltip -----
function drawTooltip() {
  if (!activeTooltip) return;
  const lines = wrapText(activeTooltipText, 240);
  const lineH = 16;
  const padding = 8;
  const w = 260;
  const h = lines.length * lineH + padding * 2 + 4;
  let x = activeTooltip.x;
  let y = activeTooltip.y;
  if (x + w > canvasWidth - 5) x = canvasWidth - w - 5;
  if (y + h > drawHeight - 5)  y = drawHeight - h - 5;
  if (x < 5) x = 5;
  if (y < 5) y = 5;

  // shadow
  const shadow = color(0);
  shadow.setAlpha(40);
  fill(shadow);
  noStroke();
  rect(x + 3, y + 3, w, h, 8);

  // box
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

// ----- Interaction -----
function mousePressed() {
  // Tooltip dismiss if click outside any element
  let consumed = false;

  // Conduction: hit-test molecules
  const condX = margin;
  if (insideRect(mouseX, mouseY, condX, panelTopY, panelWidth, panelHeight)) {
    for (const m of conductionMolecules) {
      const amp = 2 + m.heat * 3.5;
      const x = m.baseX + sin(frameCount * 0.25 + m.phase) * amp;
      const y = m.baseY + cos(frameCount * 0.30 + m.phase) * amp;
      if (dist(mouseX, mouseY, x, y) < 9) {
        activeTooltipText = 'Conduction: Energy passes from hot molecules to cooler neighbors by direct contact — like a crowd doing the wave.';
        activeTooltip = { x: mouseX + 8, y: mouseY + 8 };
        consumed = true;
        break;
      }
    }
  }

  // Convection: hit-test panel area (any click in panel body shows tooltip)
  if (!consumed) {
    const convX = margin + panelWidth + panelGap;
    if (insideRect(mouseX, mouseY, convX, panelTopY + 100, panelWidth, panelHeight - 110)) {
      activeTooltipText = 'Convection: Warm fluid rises and cool fluid sinks. Heat travels by the motion of the fluid itself.';
      activeTooltip = { x: mouseX + 8, y: mouseY + 8 };
      consumed = true;
    }
  }

  // Radiation: hit-test panel area
  if (!consumed) {
    const radX = margin + (panelWidth + panelGap) * 2;
    if (insideRect(mouseX, mouseY, radX, panelTopY + 100, panelWidth, panelHeight - 110)) {
      activeTooltipText = 'Radiation: Infrared waves carry energy through empty space — no contact needed, just like sunlight warming your face.';
      activeTooltip = { x: mouseX + 8, y: mouseY + 8 };
      consumed = true;
    }
  }

  // Click on explanation box / elsewhere → dismiss tooltip
  if (!consumed) {
    activeTooltip = null;
  }
}

function insideRect(mx, my, x, y, w, h) {
  return mx >= x && mx <= x + w && my >= y && my <= y + h;
}
