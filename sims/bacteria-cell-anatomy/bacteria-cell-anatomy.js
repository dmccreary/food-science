// Bacteria Cell Structure Explorer — Food Science MicroSim
// CANVAS_HEIGHT: 620
// Students click 7 hot spots on a rod-shaped (E. coli style) bacterial
// cross-section to identify each structure and explain its function.
// Bloom L1 (Remember / identify) + L2 (Understand / explain).

// ----- Layout constants -----
let canvasWidth = 760;
let titleHeight = 40;
let drawHeight = 340;        // cell drawing region
let infoHeight = 170;        // info panel below cell
let controlHeight = 70;
let canvasHeight = titleHeight + drawHeight + infoHeight + controlHeight;

// Palette
const COLOR_BG          = '#f1f8e9';
const COLOR_TITLE_BG    = '#2e7d32';
const COLOR_TITLE_TEXT  = '#ffffff';
const COLOR_PANEL_BG    = '#ffffff';
const COLOR_PANEL_BORDER= '#c8e6c9';
const COLOR_CYTO        = '#80cbc4';   // blue-green interior
const COLOR_CYTO_DARK   = '#4db6ac';
const COLOR_WALL        = '#0277bd';   // darker blue wall
const COLOR_WALL_LIGHT  = '#4fc3f7';
const COLOR_MEMBRANE    = '#01579b';   // even darker line for membrane
const COLOR_NUCLEOID    = '#5d4037';   // brown DNA squiggle
const COLOR_RIBOSOME    = '#6a1b9a';   // purple dots
const COLOR_FLAGELLUM   = '#fbc02d';   // gold
const COLOR_PILI        = '#f57c00';   // accent orange
const COLOR_HIGHLIGHT   = '#ff5722';   // pulsing ring color
const COLOR_TEXT_DARK   = '#1b1b1b';
const COLOR_TEXT_MUTED  = '#555555';
const COLOR_LABEL_BG    = 'rgba(255,255,255,0.92)';

// ----- Bacterium geometry (computed from layout) -----
let cellCenterX, cellCenterY;
let cellWidth  = 380;   // major axis (horizontal length of capsule body)
let cellHeight = 170;   // minor axis (height of capsule body)
let flagellumLength = 110; // horizontal reach of the flagellum past cell tip

// ----- Hot spots -----
// Each hot spot is a clickable target with a position and the EXACT
// tooltip text from the spec. Positions are computed in setup() from
// cellCenter so they resize cleanly.
let hotspots = [];

let selectedId = null;     // currently-revealed hotspot index
let showAll = false;       // toggle every label on at once
let pulsePhase = 0;        // animates highlight rings

// UI buttons
let btnShowAll, btnReset;

// Pre-computed decoration positions so they don't jitter every frame
let ribosomePositions = [];
let pilusPositions = [];   // array of {x, y, angle, length}
let nucleoidPoints = [];   // polyline points for the DNA squiggle

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Segoe UI, Arial, sans-serif');

  // Shift cell slightly LEFT of canvas center so the flagellum tail
  // and its hotspot on the right end stay safely inside the canvas.
  cellCenterX = canvasWidth / 2 - 70;
  cellCenterY = titleHeight + drawHeight / 2;

  buildHotspots();
  buildDecorations();

  // Buttons centered along the bottom control strip
  let btnY = titleHeight + drawHeight + infoHeight + 22;
  btnShowAll = createButton('Show All Labels');
  styleButton(btnShowAll, '#2e7d32');
  btnShowAll.mousePressed(() => { showAll = !showAll; });

  btnReset = createButton('Reset');
  styleButton(btnReset, '#f57c00');
  btnReset.mousePressed(() => { selectedId = null; showAll = false; });

  // Position buttons after styling so widths are known
  btnShowAll.position(canvasWidth / 2 - 170, btnY);
  btnReset.position(canvasWidth / 2 + 20, btnY);
}

function draw() {
  background(COLOR_BG);
  pulsePhase += 0.06;

  drawTitleBar();
  drawBacterium();
  drawHotspotRings();
  drawHotspotLabels();
  drawInfoPanel();
}

// =============================================================
// TITLE BAR
// =============================================================
function drawTitleBar() {
  noStroke();
  fill(COLOR_TITLE_BG);
  rect(0, 0, canvasWidth, titleHeight);
  fill(COLOR_TITLE_TEXT);
  textAlign(LEFT, CENTER);
  textSize(17);
  textStyle(BOLD);
  text('Bacteria Cell Structure Explorer', 20, titleHeight / 2);
  textStyle(NORMAL);
  textSize(12);
  textAlign(RIGHT, CENTER);
  text('Click any structure to learn more', canvasWidth - 20, titleHeight / 2);
  textAlign(LEFT, BASELINE);
}

// =============================================================
// BACTERIUM DRAWING
// =============================================================
function drawBacterium() {
  // The cell is drawn as a capsule (rectangle with two semicircles).
  // We layer outward → inward: flagellum, wall, membrane, cytoplasm, contents.

  push();
  translate(cellCenterX, cellCenterY);

  drawFlagellum();
  drawPili();
  drawCellWall();
  drawCellMembrane();
  drawCytoplasm();
  drawNucleoid();
  drawRibosomes();

  pop();
}

function capsulePath(w, h) {
  // Draws a capsule centered at (0,0) using beginShape/vertex so it
  // can be filled as one shape. We approximate with bezierVertex.
  const r = h / 2;
  const flatHalf = w / 2 - r;
  beginShape();
  // Top straight edge
  vertex(-flatHalf, -r);
  vertex( flatHalf, -r);
  // Right cap (semicircle)
  bezierVertex( flatHalf + r * 0.55,  -r, flatHalf + r,  -r * 0.55, flatHalf + r, 0);
  bezierVertex( flatHalf + r,  r * 0.55, flatHalf + r * 0.55,  r,  flatHalf, r);
  // Bottom straight edge
  vertex( flatHalf, r);
  vertex(-flatHalf, r);
  // Left cap
  bezierVertex(-flatHalf - r * 0.55, r, -flatHalf - r, r * 0.55, -flatHalf - r, 0);
  bezierVertex(-flatHalf - r, -r * 0.55, -flatHalf - r * 0.55, -r, -flatHalf, -r);
  endShape(CLOSE);
}

function drawCellWall() {
  // Two concentric capsules: outer = wall, slightly inset = membrane.
  // The wall is drawn as a fat darker-blue stroke band.
  noFill();
  stroke(COLOR_WALL);
  strokeWeight(10);
  capsulePath(cellWidth, cellHeight);

  // Subtle highlight ring on the wall for depth
  stroke(COLOR_WALL_LIGHT);
  strokeWeight(2);
  capsulePath(cellWidth - 2, cellHeight - 2);
}

function drawCellMembrane() {
  noFill();
  stroke(COLOR_MEMBRANE);
  strokeWeight(2);
  capsulePath(cellWidth - 12, cellHeight - 12);
}

function drawCytoplasm() {
  // Fill the inside with blue-green
  noStroke();
  fill(COLOR_CYTO);
  capsulePath(cellWidth - 14, cellHeight - 14);
}

function drawNucleoid() {
  // A free-floating DNA squiggle near the center
  noFill();
  stroke(COLOR_NUCLEOID);
  strokeWeight(2.5);
  beginShape();
  for (const p of nucleoidPoints) {
    curveVertex(p.x, p.y);
  }
  endShape();
}

function drawRibosomes() {
  noStroke();
  fill(COLOR_RIBOSOME);
  for (const r of ribosomePositions) {
    circle(r.x, r.y, r.d);
  }
}

function drawFlagellum() {
  // Tail at the right end. A long wavy line that extends past the cell.
  push();
  const startX = cellWidth / 2 + cellHeight / 2 - 4; // start at right tip
  const startY = 0;
  noFill();
  stroke(COLOR_FLAGELLUM);
  strokeWeight(3);
  beginShape();
  for (let i = 0; i <= 60; i++) {
    const t = i / 60;
    const x = startX + t * flagellumLength;
    const y = startY + Math.sin(t * Math.PI * 4) * 12;
    vertex(x, y);
  }
  endShape();
  // Small attachment knob
  noStroke();
  fill(COLOR_FLAGELLUM);
  circle(startX, startY, 8);
  pop();
}

function drawPili() {
  // Short straight hair-like projections around the perimeter.
  noFill();
  stroke(COLOR_PILI);
  strokeWeight(2);
  for (const p of pilusPositions) {
    const x1 = p.x;
    const y1 = p.y;
    const x2 = p.x + Math.cos(p.angle) * p.length;
    const y2 = p.y + Math.sin(p.angle) * p.length;
    line(x1, y1, x2, y2);
  }
}

// =============================================================
// HOT SPOTS
// =============================================================
function buildHotspots() {
  const cx = cellCenterX;
  const cy = cellCenterY;
  const halfW = cellWidth / 2;
  const halfH = cellHeight / 2;

  hotspots = [
    {
      id: 'wall',
      name: 'Cell Wall',
      x: cx, y: cy - halfH + 2, r: 18,
      labelSide: 'top',
      info: 'The cell wall gives the bacterium its shape. Many antibiotics work by destroying the cell wall.'
    },
    {
      id: 'membrane',
      name: 'Cell Membrane',
      x: cx - halfW + 28, y: cy - halfH + 22, r: 16,
      labelSide: 'top',
      info: 'The lipid bilayer is a selective gatekeeper — nutrients enter, waste products exit.'
    },
    {
      id: 'cytoplasm',
      name: 'Cytoplasm',
      x: cx + halfW * 0.45, y: cy + halfH * 0.55, r: 18,
      labelSide: 'bottom',
      info: "The cell's interior is 70% water and packed with enzymes and chemical reactions."
    },
    {
      id: 'nucleoid',
      name: 'Nucleoid (DNA)',
      x: cx - 30, y: cy - 4, r: 22,
      labelSide: 'top',
      info: 'Bacteria have no nucleus. Their circular chromosome floats freely. A bacterium can copy it in about 20 minutes!'
    },
    {
      id: 'ribosomes',
      name: 'Ribosomes',
      x: cx + halfW * 0.5, y: cy - halfH * 0.55, r: 16,
      labelSide: 'top',
      info: 'Ribosomes read the DNA code and build proteins. Bacteria have thousands of them.'
    },
    {
      id: 'flagellum',
      name: 'Flagellum',
      x: cx + halfW + halfH * 0.5 + flagellumLength * 0.55, y: cy + 8, r: 18,
      labelSide: 'bottom',
      info: 'Some bacteria swim using their flagellum, spinning it like a propeller.'
    },
    {
      id: 'pili',
      name: 'Pili',
      x: cx - halfW * 0.4, y: cy + halfH + 22, r: 16,
      labelSide: 'bottom',
      info: 'Pili anchor bacteria to surfaces — the first step in forming a biofilm.'
    }
  ];
}

function drawHotspotRings() {
  // Pulsing dashed-style highlight rings on every hotspot to draw attention.
  // Use HSB-like alpha pulse so the rings feel alive without being noisy.
  for (let i = 0; i < hotspots.length; i++) {
    const h = hotspots[i];
    const isSelected = (selectedId === i);
    const pulse = (Math.sin(pulsePhase + i * 0.7) + 1) / 2; // 0..1

    // Outer pulsing ring (always visible — invites a click)
    noFill();
    const baseAlpha = isSelected ? 220 : 110;
    const alpha = baseAlpha + pulse * 80;
    stroke(255, 87, 34, alpha);                  // orange-red
    strokeWeight(isSelected ? 3 : 2);
    const radius = h.r * 2 + pulse * 6 + (isSelected ? 4 : 0);
    circle(h.x, h.y, radius);

    // Tiny center dot so the click target is obvious
    noStroke();
    fill(255, 87, 34, 230);
    circle(h.x, h.y, 6);
  }
}

function drawHotspotLabels() {
  // Show name labels on hover, on showAll, or on the selected hotspot.
  textSize(12);
  textStyle(BOLD);
  for (let i = 0; i < hotspots.length; i++) {
    const h = hotspots[i];
    const hovered = isHovering(h);
    if (!showAll && selectedId !== i && !hovered) continue;

    const label = h.name;
    const padX = 6, padY = 4;
    const tw = textWidth(label);
    const boxW = tw + padX * 2;
    const boxH = 18;

    let lx = h.x - boxW / 2;
    let ly = (h.labelSide === 'top') ? (h.y - h.r - 14 - boxH) : (h.y + h.r + 14);

    // Clamp to canvas
    lx = constrain(lx, 6, canvasWidth - boxW - 6);
    ly = constrain(ly, titleHeight + 4, titleHeight + drawHeight - boxH - 4);

    // Leader line from hotspot to label box
    stroke(120);
    strokeWeight(1);
    line(h.x, h.y, lx + boxW / 2, (h.labelSide === 'top') ? ly + boxH : ly);

    // Label box
    noStroke();
    fill(255, 255, 255, 235);
    rect(lx, ly, boxW, boxH, 4);
    stroke(COLOR_TITLE_BG);
    strokeWeight(1);
    noFill();
    rect(lx, ly, boxW, boxH, 4);
    noStroke();
    fill(COLOR_TEXT_DARK);
    textAlign(LEFT, CENTER);
    text(label, lx + padX, ly + boxH / 2);
  }
  textStyle(NORMAL);
  textAlign(LEFT, BASELINE);
}

function isHovering(h) {
  const d = dist(mouseX, mouseY, h.x, h.y);
  return d <= h.r;
}

// =============================================================
// INFO PANEL
// =============================================================
function drawInfoPanel() {
  const px = 16;
  const py = titleHeight + drawHeight + 12;
  const pw = canvasWidth - 32;
  const ph = infoHeight - 24;

  noStroke();
  fill(COLOR_PANEL_BG);
  rect(px, py, pw, ph, 8);
  stroke(COLOR_PANEL_BORDER);
  strokeWeight(2);
  noFill();
  rect(px, py, pw, ph, 8);

  noStroke();
  textAlign(LEFT, TOP);

  if (selectedId === null) {
    // Empty / prompt state
    fill(COLOR_TITLE_BG);
    textStyle(BOLD);
    textSize(15);
    text('Click any pulsing ring on the bacterium', px + 16, py + 14);
    textStyle(NORMAL);
    textSize(13);
    fill(COLOR_TEXT_MUTED);
    text(
      'Each hotspot marks a key structure of a rod-shaped bacterium\n' +
      '(modeled after E. coli). Click to reveal the structure name and\n' +
      'learn what it does. Use "Show All Labels" to see every name at once.',
      px + 16, py + 40
    );
  } else {
    const h = hotspots[selectedId];
    fill(COLOR_TITLE_BG);
    textStyle(BOLD);
    textSize(17);
    text(h.name, px + 16, py + 12);

    // Color swatch matching the structure
    const sw = structureSwatch(h.id);
    noStroke();
    fill(sw[0], sw[1], sw[2]);
    rect(px + pw - 40, py + 14, 22, 14, 3);

    textStyle(NORMAL);
    textSize(14);
    fill(COLOR_TEXT_DARK);
    // Wrap the info text inside the panel
    text(h.info, px + 16, py + 44, pw - 32, ph - 56);
  }

  textAlign(LEFT, BASELINE);
  textStyle(NORMAL);
}

function structureSwatch(id) {
  // Return RGB triples (avoid fill(hex, alpha) footgun by passing r,g,b).
  switch (id) {
    case 'wall':       return [2, 119, 189];     // COLOR_WALL
    case 'membrane':   return [1, 87, 155];      // COLOR_MEMBRANE
    case 'cytoplasm':  return [128, 203, 196];   // COLOR_CYTO
    case 'nucleoid':   return [93, 64, 55];      // COLOR_NUCLEOID
    case 'ribosomes':  return [106, 27, 154];    // COLOR_RIBOSOME
    case 'flagellum':  return [251, 192, 45];    // COLOR_FLAGELLUM
    case 'pili':       return [245, 124, 0];     // COLOR_PILI
    default:           return [120, 120, 120];
  }
}

// =============================================================
// INTERACTION
// =============================================================
function mousePressed() {
  // Only respond to clicks inside the drawing region.
  if (mouseY < titleHeight || mouseY > titleHeight + drawHeight) return;

  // Find the closest hotspot whose hit radius contains the click.
  let bestI = -1;
  let bestD = Infinity;
  for (let i = 0; i < hotspots.length; i++) {
    const h = hotspots[i];
    const d = dist(mouseX, mouseY, h.x, h.y);
    if (d <= h.r && d < bestD) {
      bestD = d;
      bestI = i;
    }
  }
  if (bestI >= 0) {
    selectedId = bestI;
  }
}

// =============================================================
// DECORATIONS — built once so they don't jitter every frame
// =============================================================
function buildDecorations() {
  ribosomePositions = [];
  pilusPositions = [];
  nucleoidPoints = [];

  // -- Ribosomes scattered inside the cytoplasm (avoid the nucleoid area)
  const halfW = cellWidth / 2 - 24;
  const halfH = cellHeight / 2 - 24;
  // Deterministic-ish placement using a seeded pseudo-random
  let seed = 4;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  let placed = 0;
  let attempts = 0;
  while (placed < 38 && attempts < 800) {
    attempts++;
    // Sample inside the capsule body (translated coords, center 0,0)
    const x = (rand() * 2 - 1) * halfW;
    const y = (rand() * 2 - 1) * halfH;
    // Stay inside the capsule shape: |x| <= halfW always; restrict |y|
    // toward the ends so dots don't poke outside the curved caps.
    const flat = halfW - halfH;
    let maxY = halfH;
    if (Math.abs(x) > flat) {
      const dx = Math.abs(x) - flat;
      const limit = Math.sqrt(Math.max(0, halfH * halfH - dx * dx));
      maxY = limit;
    }
    if (Math.abs(y) > maxY - 4) continue;

    // Skip a buffer around the nucleoid region (center)
    if (Math.abs(x + 30) < 70 && Math.abs(y) < 24) continue;

    ribosomePositions.push({ x: x, y: y, d: 5 + rand() * 2 });
    placed++;
  }

  // -- Pili: short hairs around the perimeter (skip the flagellum end)
  const halfWcap = cellWidth / 2;
  const halfHcap = cellHeight / 2;
  const piliCount = 22;
  for (let i = 0; i < piliCount; i++) {
    const t = i / piliCount;
    const ang = t * Math.PI * 2;
    // Capsule perimeter sample: parameterize around the capsule
    // Use a rounded-rectangle perimeter approximation.
    let px, py, normalAng;
    // Three regions: left cap, top/bottom flats, right cap
    // Use parametric capsule perimeter:
    const cosA = Math.cos(ang);
    const sinA = Math.sin(ang);
    // Project from center outward to capsule boundary
    const flat = halfWcap - halfHcap;
    if (Math.abs(cosA) * flat > Math.abs(sinA) * halfHcap || true) {
      // Use ellipse-like projection then clamp to capsule edge
      const r = halfHcap;
      // Find boundary by line from (0,0) along (cosA,sinA) hitting capsule
      const tx = cosA, ty = sinA;
      // The capsule is two halves joined to a rectangle of width 2*flat
      // Param along the line: find max s such that point is inside capsule.
      // Inside capsule iff |x|<=flat OR (|x|-flat)^2 + y^2 <= r^2
      // Binary search for boundary
      let lo = 0, hi = halfWcap + r;
      for (let k = 0; k < 24; k++) {
        const mid = (lo + hi) / 2;
        const x = tx * mid, y = ty * mid;
        const inside = (Math.abs(x) <= flat)
          ? (Math.abs(y) <= r)
          : ((Math.abs(x) - flat) * (Math.abs(x) - flat) + y * y <= r * r);
        if (inside) lo = mid; else hi = mid;
      }
      px = tx * lo;
      py = ty * lo;
      normalAng = ang;
    }
    // Skip the right cap (flagellum exits there) — pixels with x near +halfWcap
    if (px > halfWcap * 0.78) continue;
    pilusPositions.push({
      x: px, y: py, angle: normalAng, length: 14 + (i % 3) * 3
    });
  }

  // -- Nucleoid squiggle (a meandering closed-ish curve near center)
  const cx0 = -30, cy0 = 0;
  const squigglePts = [
    { x: cx0 - 50, y: cy0 - 5 },
    { x: cx0 - 35, y: cy0 + 18 },
    { x: cx0 - 10, y: cy0 + 8 },
    { x: cx0 + 5,  y: cy0 + 22 },
    { x: cx0 + 30, y: cy0 + 10 },
    { x: cx0 + 45, y: cy0 - 12 },
    { x: cx0 + 25, y: cy0 - 22 },
    { x: cx0 + 0,  y: cy0 - 18 },
    { x: cx0 - 22, y: cy0 - 24 },
    { x: cx0 - 45, y: cy0 - 12 },
    { x: cx0 - 55, y: cy0 + 4 },
    { x: cx0 - 40, y: cy0 + 16 }
  ];
  nucleoidPoints = squigglePts;
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
// RESPONSIVE — fixed canvas; placeholder for future scaling
// =============================================================
function updateCanvasSize() {
  // Keep canvas at native size; the iframe handles container width.
  // Hook is present per project convention (must be first call in setup).
}

function windowResized() {
  // Reposition buttons if the main element width changed.
  if (btnShowAll && btnReset) {
    const btnY = titleHeight + drawHeight + infoHeight + 22;
    btnShowAll.position(canvasWidth / 2 - 170, btnY);
    btnReset.position(canvasWidth / 2 + 20, btnY);
  }
}
