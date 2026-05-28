// Interactive Molecule Builder - Food Science MicroSim
// CANVAS_HEIGHT: 620
// Students load preset molecules (H2O, CO2, Glucose) or freeform drag atoms
// from a palette and click pairs to form bonds.

// ----- Layout constants -----
let canvasWidth = 760;
let drawHeight = 500;
let controlHeight = 120;
let canvasHeight = drawHeight + controlHeight;
let margin = 15;

// Palette (left sidebar) region
let paletteX = margin;
let paletteY = 50;
let paletteW = 90;
let paletteH = drawHeight - paletteY - margin;

// Build canvas region (right main area, before info panel)
let buildX = paletteX + paletteW + 10;
let buildY = paletteY;
// Info side panel
let panelW = 220;
let panelX;             // computed in setup
let buildW;             // computed in setup
let buildH = paletteH;

// ----- CPK Atom definitions -----
const ATOMS = {
  C: { symbol: 'C', name: 'Carbon',   color: [80, 80, 80],    stroke: [40, 40, 40],   textColor: [255, 255, 255], radius: 22,
       fact: 'Carbon forms the backbone of almost every organic molecule in food.' },
  H: { symbol: 'H', name: 'Hydrogen', color: [235, 240, 255], stroke: [120, 130, 160], textColor: [40, 40, 40],    radius: 14,
       fact: 'Hydrogen is the lightest atom; it bonds to almost every food molecule.' },
  O: { symbol: 'O', name: 'Oxygen',   color: [220, 50, 40],   stroke: [140, 25, 20],  textColor: [255, 255, 255], radius: 20,
       fact: 'Oxygen makes up most of the weight of water and many sugars.' },
  N: { symbol: 'N', name: 'Nitrogen', color: [55, 90, 200],   stroke: [25, 45, 130],  textColor: [255, 255, 255], radius: 20,
       fact: 'Nitrogen is the key atom in proteins and amino acids.' }
};

// Order of beads in the palette
const PALETTE_ORDER = ['C', 'H', 'O', 'N'];

// Atoms currently on the build canvas: {type, x, y, vx, vy, tx, ty, animating, selected, id}
let placedAtoms = [];
// Bonds between placed atoms: {a, b, order}  (order: 1 single, 2 double)
let bonds = [];
let nextAtomId = 1;
// Atom selected by user for bond creation (freeform mode)
let selectedAtomId = null;
// Atom currently being dragged
let draggingAtom = null;
let dragOffsetX = 0, dragOffsetY = 0;
// True if we are dragging a NEW atom from the palette (not an existing one)
let draggingNewType = null;

// Current preset info displayed in side panel ({ formula, name, description, angle })
let currentInfo = null;

// UI buttons
let btnWater, btnCO2, btnGlucose, btnClear;

// Hover tooltip
let hoverPaletteType = null;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Segoe UI, Arial, sans-serif');

  // Compute layout
  panelX = canvasWidth - panelW - margin;
  buildW = panelX - buildX - 10;

  // Bottom toolbar buttons
  let btnY = drawHeight + 18;
  btnWater = createButton('Water (H₂O)');
  styleButton(btnWater, '#2e7d32');
  btnWater.position(margin, btnY);
  btnWater.mousePressed(() => loadPreset('water'));
  btnWater.parent(document.querySelector('main'));

  btnCO2 = createButton('Carbon Dioxide (CO₂)');
  styleButton(btnCO2, '#2e7d32');
  btnCO2.position(margin + 130, btnY);
  btnCO2.mousePressed(() => loadPreset('co2'));
  btnCO2.parent(document.querySelector('main'));

  btnGlucose = createButton('Glucose (C₆H₁₂O₆)');
  styleButton(btnGlucose, '#2e7d32');
  btnGlucose.position(margin + 305, btnY);
  btnGlucose.mousePressed(() => loadPreset('glucose'));
  btnGlucose.parent(document.querySelector('main'));

  btnClear = createButton('Clear');
  styleButton(btnClear, '#f57c00');
  btnClear.position(margin + 470, btnY);
  btnClear.mousePressed(clearAll);
  btnClear.parent(document.querySelector('main'));

  describe('Build food molecules by dragging atom beads or loading presets (Water, CO2, Glucose). Bond pairs of atoms by clicking them.', LABEL);
}

function styleButton(b, bg) {
  b.style('background', bg);
  b.style('color', 'white');
  b.style('border', 'none');
  b.style('border-radius', '6px');
  b.style('padding', '8px 12px');
  b.style('font-size', '13px');
  b.style('font-family', 'Segoe UI, Arial, sans-serif');
  b.style('cursor', 'pointer');
  b.style('font-weight', '600');
}

function draw() {
  updateCanvasSize();

  // Draw region background
  noStroke();
  fill('#fafdf7');
  rect(0, 0, canvasWidth, drawHeight);

  // Control region background
  noStroke();
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke('silver');
  noFill();
  rect(0, 0, canvasWidth - 1, drawHeight);
  rect(0, drawHeight, canvasWidth - 1, controlHeight - 1);

  // Title
  noStroke();
  fill('#2e7d32');
  textSize(18);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text('Interactive Molecule Builder', margin, 12);

  textSize(12);
  textStyle(NORMAL);
  fill('#555');
  textAlign(RIGHT, TOP);
  text('Click a preset or drag atoms from the palette. Click two atoms to bond.',
       canvasWidth - margin, 18);

  // Palette
  drawPalette();

  // Build area
  drawBuildArea();

  // Info side panel
  drawInfoPanel();

  // Counter (in control region, above buttons)
  drawCounter();

  // Atoms (animate + render)
  updateAtoms();
  drawBonds();
  drawAtoms();

  // Draw atom being dragged from palette as a floating bead
  if (draggingNewType) {
    drawAtomBead(mouseX, mouseY, ATOMS[draggingNewType], false, 0.85);
  }

  // Tooltip for palette hover
  if (hoverPaletteType && !draggingNewType) {
    drawTooltip(hoverPaletteType);
  }
}

// ----- PALETTE -----
function drawPalette() {
  // Background panel
  noStroke();
  fill('#f1f8e9');
  rect(paletteX, paletteY, paletteW, paletteH, 8);
  stroke('#c5e1a5');
  noFill();
  rect(paletteX, paletteY, paletteW, paletteH, 8);

  noStroke();
  fill('#2e7d32');
  textSize(12);
  textStyle(BOLD);
  textAlign(CENTER, TOP);
  text('ATOMS', paletteX + paletteW / 2, paletteY + 8);

  hoverPaletteType = null;
  for (let i = 0; i < PALETTE_ORDER.length; i++) {
    let t = PALETTE_ORDER[i];
    let a = ATOMS[t];
    let cx = paletteX + paletteW / 2;
    let cy = paletteY + 50 + i * 90;
    drawAtomBead(cx, cy, a, false, 1);

    // Label below
    noStroke();
    fill('#333');
    textSize(11);
    textStyle(NORMAL);
    textAlign(CENTER, TOP);
    text(a.name, cx, cy + a.radius + 6);

    // Hover detection
    if (dist(mouseX, mouseY, cx, cy) < a.radius + 2 && !draggingAtom && !draggingNewType) {
      hoverPaletteType = t;
    }
  }
}

function drawAtomBead(cx, cy, atomDef, highlighted, alpha = 1) {
  // Glow if highlighted (selected for bonding)
  if (highlighted) {
    noFill();
    stroke('#f57c00');
    strokeWeight(3);
    ellipse(cx, cy, atomDef.radius * 2 + 8, atomDef.radius * 2 + 8);
  }
  // Bead with subtle gradient using two ellipses
  strokeWeight(2);
  stroke(atomDef.stroke[0], atomDef.stroke[1], atomDef.stroke[2], 255 * alpha);
  fill(atomDef.color[0], atomDef.color[1], atomDef.color[2], 255 * alpha);
  ellipse(cx, cy, atomDef.radius * 2, atomDef.radius * 2);
  // Highlight
  noStroke();
  fill(255, 255, 255, 90 * alpha);
  ellipse(cx - atomDef.radius * 0.35, cy - atomDef.radius * 0.35,
          atomDef.radius * 0.8, atomDef.radius * 0.55);
  // Symbol
  fill(atomDef.textColor[0], atomDef.textColor[1], atomDef.textColor[2], 255 * alpha);
  textSize(atomDef.radius * 0.9);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text(atomDef.symbol, cx, cy + 1);
  textStyle(NORMAL);
}

function drawTooltip(t) {
  let a = ATOMS[t];
  let lines = [
    a.name + ' (' + a.symbol + ')',
    a.fact
  ];
  textSize(11);
  let maxW = 240;
  // wrap fact
  let wrapped = wrapText(a.fact, maxW - 16);
  let allLines = [a.name + ' (' + a.symbol + ')', ...wrapped];

  let lineH = 15;
  let h = 12 + allLines.length * lineH;
  let w = maxW;
  let x = paletteX + paletteW + 6;
  let y = mouseY - h / 2;
  if (y < 5) y = 5;
  if (y + h > drawHeight - 5) y = drawHeight - h - 5;

  stroke('#888');
  strokeWeight(1);
  fill(255, 255, 230, 240);
  rect(x, y, w, h, 6);
  noStroke();
  fill('#2e7d32');
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  textSize(12);
  text(allLines[0], x + 8, y + 6);
  fill('#333');
  textStyle(NORMAL);
  textSize(11);
  for (let i = 1; i < allLines.length; i++) {
    text(allLines[i], x + 8, y + 6 + i * lineH + 2);
  }
}

function wrapText(s, maxW) {
  let words = s.split(' ');
  let lines = [];
  let cur = '';
  for (let w of words) {
    let test = cur ? cur + ' ' + w : w;
    if (textWidth(test) > maxW && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = test;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

// ----- BUILD AREA -----
function drawBuildArea() {
  noStroke();
  fill('white');
  rect(buildX, buildY, buildW, buildH, 8);
  stroke('#cfd8dc');
  noFill();
  rect(buildX, buildY, buildW, buildH, 8);

  if (placedAtoms.length === 0) {
    noStroke();
    fill('#9aa4ab');
    textSize(13);
    textStyle(ITALIC);
    textAlign(CENTER, CENTER);
    text('Drag atoms here from the palette,\nor click a preset molecule below.',
         buildX + buildW / 2, buildY + buildH / 2);
    textStyle(NORMAL);
  }
}

// ----- INFO PANEL -----
function drawInfoPanel() {
  noStroke();
  fill('#fff8e1');
  rect(panelX, paletteY, panelW, buildH, 8);
  stroke('#ffe082');
  noFill();
  rect(panelX, paletteY, panelW, buildH, 8);

  noStroke();
  fill('#f57c00');
  textSize(12);
  textStyle(BOLD);
  textAlign(CENTER, TOP);
  text('MOLECULE INFO', panelX + panelW / 2, paletteY + 8);

  let ix = panelX + 12;
  let iy = paletteY + 32;
  let iw = panelW - 24;

  if (!currentInfo) {
    fill('#8d6e63');
    textSize(12);
    textStyle(ITALIC);
    textAlign(LEFT, TOP);
    text('Click a preset (Water, CO₂, or Glucose) to see its formula, name, food role, and bond angle.',
         ix, iy, iw);
    textStyle(NORMAL);
    return;
  }

  // Formula
  fill('#bf360c');
  textStyle(BOLD);
  textSize(22);
  textAlign(LEFT, TOP);
  text(currentInfo.formula, ix, iy);

  // Name
  fill('#4e342e');
  textSize(14);
  text(currentInfo.name, ix, iy + 32);

  // Description
  textStyle(NORMAL);
  textSize(12);
  fill('#3e2723');
  text(currentInfo.description, ix, iy + 56, iw);

  // Angle
  fill('#2e7d32');
  textStyle(BOLD);
  textSize(12);
  let angleText = currentInfo.angle
    ? 'Bond angle: ' + currentInfo.angle
    : 'Linear geometry (180°)';
  text(angleText, ix, paletteY + buildH - 28);
  textStyle(NORMAL);
}

// ----- COUNTER -----
function drawCounter() {
  let counts = { C: 0, H: 0, O: 0, N: 0 };
  for (let a of placedAtoms) counts[a.type]++;
  noStroke();
  fill('#2e7d32');
  textSize(13);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text("You've built: ", margin, drawHeight + 60);
  let x = margin + textWidth("You've built: ");
  textStyle(NORMAL);
  for (let t of PALETTE_ORDER) {
    let a = ATOMS[t];
    fill(a.color[0], a.color[1], a.color[2]);
    noStroke();
    ellipse(x + 8, drawHeight + 67, 14, 14);
    fill('#333');
    textAlign(LEFT, CENTER);
    text(' ' + t + counts[t] + '   ', x + 16, drawHeight + 67);
    x += 16 + textWidth(' ' + t + counts[t] + '   ');
  }
  // Instruction line
  textAlign(LEFT, TOP);
  fill('#666');
  textSize(11);
  textStyle(ITALIC);
  text('Tip: After dragging two atoms onto the canvas, click each one in turn to draw a bond between them.',
       margin, drawHeight + 88);
  textStyle(NORMAL);
}

// ----- ATOMS + ANIMATION -----
function updateAtoms() {
  for (let a of placedAtoms) {
    if (a.animating) {
      let dx = a.tx - a.x;
      let dy = a.ty - a.y;
      let d = sqrt(dx * dx + dy * dy);
      if (d < 1.5) {
        a.x = a.tx;
        a.y = a.ty;
        a.animating = false;
      } else {
        a.x += dx * 0.18;
        a.y += dy * 0.18;
      }
    }
  }
}

function drawAtoms() {
  for (let a of placedAtoms) {
    let def = ATOMS[a.type];
    let highlighted = (selectedAtomId === a.id);
    drawAtomBead(a.x, a.y, def, highlighted, 1);
  }
}

function drawBonds() {
  stroke('#37474f');
  strokeWeight(3);
  for (let b of bonds) {
    let a1 = atomById(b.a);
    let a2 = atomById(b.b);
    if (!a1 || !a2) continue;
    if (b.order === 2) {
      // Draw two parallel lines
      let dx = a2.x - a1.x;
      let dy = a2.y - a1.y;
      let len = sqrt(dx * dx + dy * dy);
      if (len < 1) continue;
      let nx = -dy / len, ny = dx / len;
      let off = 3;
      line(a1.x + nx * off, a1.y + ny * off, a2.x + nx * off, a2.y + ny * off);
      line(a1.x - nx * off, a1.y - ny * off, a2.x - nx * off, a2.y - ny * off);
    } else {
      line(a1.x, a1.y, a2.x, a2.y);
    }
  }
  strokeWeight(1);
}

function atomById(id) {
  for (let a of placedAtoms) if (a.id === id) return a;
  return null;
}

// ----- PRESETS -----
function loadPreset(which) {
  placedAtoms = [];
  bonds = [];
  selectedAtomId = null;

  let cx = buildX + buildW / 2;
  let cy = buildY + buildH / 2;

  if (which === 'water') {
    // O at center, two H's at +/- 52.25 deg from vertical (104.5° apart)
    let oId = addAtom('O', cx, cy - 40);
    let r = 60;
    let half = radians(104.5 / 2);
    let h1Id = addAtom('H', cx, cy - 40);
    let h2Id = addAtom('H', cx, cy - 40);
    // Animate them to their target positions
    let o = atomById(oId);
    o.tx = cx; o.ty = cy - 20; o.animating = true;
    let h1 = atomById(h1Id);
    h1.tx = cx - sin(half) * r; h1.ty = cy - 20 + cos(half) * r; h1.animating = true;
    let h2 = atomById(h2Id);
    h2.tx = cx + sin(half) * r; h2.ty = cy - 20 + cos(half) * r; h2.animating = true;
    bonds.push({ a: oId, b: h1Id, order: 1 });
    bonds.push({ a: oId, b: h2Id, order: 1 });
    currentInfo = {
      formula: 'H₂O',
      name: 'Water',
      description: 'Water is the universal solvent. It dissolves sugars, salts, and acids, making most chemical reactions in cooking possible.',
      angle: '~104.5° (bent)'
    };
  } else if (which === 'co2') {
    let r = 60;
    let cId = addAtom('C', cx, cy);
    let o1Id = addAtom('O', cx, cy);
    let o2Id = addAtom('O', cx, cy);
    atomById(cId).tx = cx; atomById(cId).ty = cy; atomById(cId).animating = true;
    atomById(o1Id).tx = cx - r; atomById(o1Id).ty = cy; atomById(o1Id).animating = true;
    atomById(o2Id).tx = cx + r; atomById(o2Id).ty = cy; atomById(o2Id).animating = true;
    bonds.push({ a: cId, b: o1Id, order: 2 });
    bonds.push({ a: cId, b: o2Id, order: 2 });
    currentInfo = {
      formula: 'CO₂',
      name: 'Carbon Dioxide',
      description: 'Yeast and baking powder both produce CO₂ gas. This gas gets trapped in dough, making it rise.',
      angle: '180° (linear, double bonds)'
    };
  } else if (which === 'glucose') {
    // Simplified ring of 6 carbons (hexagon) with H + OH attached
    let r = 70;
    let cIds = [];
    for (let i = 0; i < 6; i++) {
      let ang = -PI / 2 + i * TWO_PI / 6;
      let id = addAtom('C', cx, cy);
      let a = atomById(id);
      a.tx = cx + cos(ang) * r;
      a.ty = cy + sin(ang) * r;
      a.animating = true;
      cIds.push(id);
    }
    // Ring bonds
    for (let i = 0; i < 6; i++) {
      bonds.push({ a: cIds[i], b: cIds[(i + 1) % 6], order: 1 });
    }
    // Attach H and O around the ring (simplified — alternating outward)
    let outR = r + 38;
    for (let i = 0; i < 6; i++) {
      let ang = -PI / 2 + i * TWO_PI / 6;
      let ox = cx + cos(ang) * outR;
      let oy = cy + sin(ang) * outR;
      // Alternate: even i gets an O (with H), odd i gets two H's (simplified to one shown)
      if (i % 2 === 0) {
        let oId = addAtom('O', cx, cy);
        atomById(oId).tx = ox; atomById(oId).ty = oy; atomById(oId).animating = true;
        bonds.push({ a: cIds[i], b: oId, order: 1 });
        // H on the O
        let hId = addAtom('H', cx, cy);
        atomById(hId).tx = cx + cos(ang) * (outR + 30);
        atomById(hId).ty = cy + sin(ang) * (outR + 30);
        atomById(hId).animating = true;
        bonds.push({ a: oId, b: hId, order: 1 });
      } else {
        let hId = addAtom('H', cx, cy);
        atomById(hId).tx = ox; atomById(hId).ty = oy; atomById(hId).animating = true;
        bonds.push({ a: cIds[i], b: hId, order: 1 });
      }
    }
    currentInfo = {
      formula: 'C₆H₆O₃',
      name: 'Glucose (simplified)',
      description: 'Glucose is a simple sugar. It is the main food source for yeast and the source of energy for your body cells.',
      angle: '~109.5° (tetrahedral C)'
    };
  }
}

function addAtom(type, x, y) {
  let id = nextAtomId++;
  placedAtoms.push({
    id: id, type: type,
    x: x, y: y, tx: x, ty: y,
    animating: false
  });
  return id;
}

function clearAll() {
  placedAtoms = [];
  bonds = [];
  selectedAtomId = null;
  currentInfo = null;
}

// ----- MOUSE -----
function mousePressed() {
  // 1. Start dragging an existing placed atom? (must be inside build area)
  if (inBuildArea(mouseX, mouseY)) {
    for (let i = placedAtoms.length - 1; i >= 0; i--) {
      let a = placedAtoms[i];
      let def = ATOMS[a.type];
      if (dist(mouseX, mouseY, a.x, a.y) < def.radius) {
        draggingAtom = a;
        dragOffsetX = mouseX - a.x;
        dragOffsetY = mouseY - a.y;
        a.movedSinceMouseDown = false;
        return;
      }
    }
  }
  // 2. Otherwise, check palette beads — start dragging a NEW atom
  for (let i = 0; i < PALETTE_ORDER.length; i++) {
    let t = PALETTE_ORDER[i];
    let a = ATOMS[t];
    let cx = paletteX + paletteW / 2;
    let cy = paletteY + 50 + i * 90;
    if (dist(mouseX, mouseY, cx, cy) < a.radius + 2) {
      draggingNewType = t;
      return;
    }
  }
}

function mouseDragged() {
  if (draggingAtom) {
    let nx = mouseX - dragOffsetX;
    let ny = mouseY - dragOffsetY;
    // Clamp inside build area
    let def = ATOMS[draggingAtom.type];
    nx = constrain(nx, buildX + def.radius, buildX + buildW - def.radius);
    ny = constrain(ny, buildY + def.radius, buildY + buildH - def.radius);
    if (abs(nx - draggingAtom.x) > 2 || abs(ny - draggingAtom.y) > 2) {
      draggingAtom.movedSinceMouseDown = true;
    }
    draggingAtom.x = nx;
    draggingAtom.y = ny;
    draggingAtom.tx = nx;
    draggingAtom.ty = ny;
    draggingAtom.animating = false;
  }
}

function mouseReleased() {
  if (draggingNewType) {
    // Drop new atom into build area if released inside it
    if (inBuildArea(mouseX, mouseY)) {
      let def = ATOMS[draggingNewType];
      let nx = constrain(mouseX, buildX + def.radius, buildX + buildW - def.radius);
      let ny = constrain(mouseY, buildY + def.radius, buildY + buildH - def.radius);
      addAtom(draggingNewType, nx, ny);
    }
    draggingNewType = null;
    return;
  }
  if (draggingAtom) {
    // If atom barely moved, treat as a CLICK on the atom (for bonding)
    if (!draggingAtom.movedSinceMouseDown) {
      handleAtomClick(draggingAtom);
    }
    draggingAtom = null;
  }
}

function handleAtomClick(atom) {
  if (selectedAtomId === null) {
    selectedAtomId = atom.id;
  } else if (selectedAtomId === atom.id) {
    selectedAtomId = null;
  } else {
    // Form a bond if one doesn't already exist
    let already = bonds.some(b =>
      (b.a === selectedAtomId && b.b === atom.id) ||
      (b.a === atom.id && b.b === selectedAtomId));
    if (!already) {
      bonds.push({ a: selectedAtomId, b: atom.id, order: 1 });
    }
    selectedAtomId = null;
  }
}

function inBuildArea(x, y) {
  return x >= buildX && x <= buildX + buildW && y >= buildY && y <= buildY + buildH;
}

// ----- RESPONSIVE -----
function updateCanvasSize() {
  const container = document.querySelector('main').elementFromPoint
    ? document.querySelector('main')
    : document.querySelector('main');
  const el = document.querySelector('main');
  if (el) {
    const w = el.getBoundingClientRect().width;
    if (w > 0 && w < canvasWidth) {
      // Could rescale, but keep fixed for now.
    }
  }
}
