// Experimental Variables Identifier MicroSim
// Students drag variables into IV / DV / CV drop zones for food science scenarios.

let canvasWidth = 760;
let drawHeight = 640;
let controlHeight = 60;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;
let margin = 18;

// Layout
let zoneTop = 50;
let zoneHeight = 110;
let zoneGap = 12;
let descTop = zoneTop + zoneHeight + 20;
let descHeight = 90;
let tileAreaTop = descTop + descHeight + 18;
let tileAreaHeight = 200;

// Colors (book palette)
const COLOR_PRIMARY   = '#2e7d32';
const COLOR_ACCENT    = '#f57c00';
const COLOR_BG        = '#f1f8e9';
const COLOR_ZONE_BG   = '#ffffff';
const COLOR_ZONE_EDGE = '#9ccc65';
const COLOR_TEXT      = '#1b1b1b';
const COLOR_TILE      = '#fff3e0';
const COLOR_TILE_EDGE = '#f57c00';
const COLOR_CORRECT   = '#2e7d32';
const COLOR_WRONG_BG  = '#ffebee';
const COLOR_WRONG_EDGE = '#c62828';

// Scenarios
const scenarios = [
    {
        title: 'Cookie baking experiment',
        description:
            'A student bakes three batches of cookies, each at a different oven temperature ' +
            '(300°F, 325°F, 350°F). All other recipe ingredients are the same. ' +
            'After baking, the student measures the diameter of ten cookies from each batch and records the average.',
        variables: [
            { label: 'oven temperature', type: 'IV' },
            { label: 'cookie diameter', type: 'DV' },
            { label: 'flour amount',    type: 'CV' },
            { label: 'butter amount',   type: 'CV' },
            { label: 'baking time',     type: 'CV' },
            { label: 'type of oven',    type: 'CV' }
        ]
    },
    {
        title: 'Hot cocoa sweetness experiment',
        description:
            'A student makes three cups of hot cocoa with different amounts of sugar (0 g, 10 g, 20 g). ' +
            'All other ingredients are the same. Five classmates taste each cup and rate the sweetness from 1–5.',
        variables: [
            { label: 'grams of sugar',         type: 'IV' },
            { label: 'sweetness rating',       type: 'DV' },
            { label: 'amount of cocoa powder', type: 'CV' },
            { label: 'milk volume',            type: 'CV' },
            { label: 'milk temperature',       type: 'CV' },
            { label: 'cup size',               type: 'CV' }
        ]
    },
    {
        title: 'Basil light-color experiment',
        description:
            'A student grows basil plants under three different light colors (white, blue, red) using ' +
            'identical LED strips. Plants receive the same amount of water and nutrient solution. ' +
            'After 3 weeks, the student measures the height and leaf count of each plant.',
        variables: [
            { label: 'light color',                    type: 'IV' },
            { label: 'plant height + leaf count',      type: 'DV' },
            { label: 'water amount',                   type: 'CV' },
            { label: 'nutrient solution concentration', type: 'CV' },
            { label: 'pot size',                       type: 'CV' },
            { label: 'room temperature',               type: 'CV' }
        ]
    }
];

let currentScenarioIdx = 0;
let tiles = [];
let zones = [];
let draggingTile = null;
let dragOffsetX = 0;
let dragOffsetY = 0;
let newScenarioButton;

function setup() {
    updateCanvasSize();
    const cnv = createCanvas(containerWidth, containerHeight);
    cnv.parent(document.querySelector('main'));
    textFont('Segoe UI, Arial, sans-serif');

    // Build zones (positions filled in buildZones using current width)
    buildZones();

    // New-scenario button (built-in p5 control, in control panel below canvas)
    newScenarioButton = createButton('Try a new scenario');
    newScenarioButton.parent(document.querySelector('main'));
    newScenarioButton.position(margin, drawHeight + 14);
    newScenarioButton.style('background-color', COLOR_PRIMARY);
    newScenarioButton.style('color', '#fff');
    newScenarioButton.style('border', 'none');
    newScenarioButton.style('padding', '8px 16px');
    newScenarioButton.style('border-radius', '6px');
    newScenarioButton.style('font-size', '14px');
    newScenarioButton.style('cursor', 'pointer');
    newScenarioButton.mousePressed(nextScenario);

    loadScenario(0);
}

function buildZones() {
    const zw = (containerWidth - margin * 2 - zoneGap * 2) / 3;
    zones = [
        { type: 'IV', label: 'Independent Variable',  hint: 'What I change',     x: margin,                       y: zoneTop, w: zw, h: zoneHeight, flash: 0, flashColor: null },
        { type: 'DV', label: 'Dependent Variable',    hint: 'What I measure',    x: margin + zw + zoneGap,         y: zoneTop, w: zw, h: zoneHeight, flash: 0, flashColor: null },
        { type: 'CV', label: 'Controlled Variables',  hint: 'What I keep same',  x: margin + (zw + zoneGap) * 2,   y: zoneTop, w: zw, h: zoneHeight, flash: 0, flashColor: null }
    ];
}

function loadScenario(idx) {
    currentScenarioIdx = idx;
    const sc = scenarios[idx];
    tiles = [];
    // Layout tiles in a 3-column grid in the tile area
    const cols = 3;
    const tw = (containerWidth - margin * 2 - 16 * (cols - 1)) / cols;
    const th = 44;
    const rowGap = 12;
    for (let i = 0; i < sc.variables.length; i++) {
        const v = sc.variables[i];
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = margin + col * (tw + 16);
        const y = tileAreaTop + 36 + row * (th + rowGap);
        tiles.push({
            label: v.label,
            type: v.type,
            x, y, w: tw, h: th,
            homeX: x, homeY: y,
            placed: false,          // settled into a zone (correct)
            shake: 0,               // shake timer (frames)
            flashWrong: 0,          // wrong flash timer (frames)
            flashCorrect: 0         // correct flash timer (frames)
        });
    }
    draggingTile = null;
    // clear zone flashes
    for (const z of zones) { z.flash = 0; z.flashColor = null; }
}

function nextScenario() {
    let next = (currentScenarioIdx + 1) % scenarios.length;
    loadScenario(next);
}

function updateCanvasSize() {
    const container = document.querySelector('main').parentElement;
    containerWidth = Math.floor(container.getBoundingClientRect().width);
    if (containerWidth < 320) containerWidth = 320;
    if (containerWidth > 960) containerWidth = 960;
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(containerWidth, containerHeight);
    buildZones();
    // Re-layout tiles based on new width but preserve placed state
    const sc = scenarios[currentScenarioIdx];
    const cols = 3;
    const tw = (containerWidth - margin * 2 - 16 * (cols - 1)) / cols;
    const th = 44;
    const rowGap = 12;
    for (let i = 0; i < tiles.length; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = margin + col * (tw + 16);
        const y = tileAreaTop + 36 + row * (th + rowGap);
        tiles[i].w = tw;
        tiles[i].h = th;
        tiles[i].homeX = x;
        tiles[i].homeY = y;
        if (!tiles[i].placed) {
            tiles[i].x = x;
            tiles[i].y = y;
        }
    }
    if (newScenarioButton) newScenarioButton.position(margin, drawHeight + 14);
}

function draw() {
    // Background
    background(COLOR_BG);

    // Title bar
    noStroke();
    fill('#ffffff');
    rect(0, 0, containerWidth, 36);
    fill(COLOR_PRIMARY);
    textSize(15);
    textAlign(LEFT, CENTER);
    textStyle(BOLD);
    text('Experimental Variables Identifier', margin, 18);
    textStyle(NORMAL);

    // Zones
    drawZones();

    // Scenario description
    drawScenarioDescription();

    // Tile area label
    fill(COLOR_TEXT);
    textSize(13);
    textAlign(LEFT, CENTER);
    textStyle(BOLD);
    text('Drag each variable into the correct zone above:', margin, tileAreaTop + 14);
    textStyle(NORMAL);

    // Tiles
    drawTiles();

    // Score panel (top right)
    drawScore();

    // Control panel background under canvas
    noStroke();
    fill('#e8f5e9');
    rect(0, drawHeight, containerWidth, controlHeight);
    stroke(200);
    line(0, drawHeight, containerWidth, drawHeight);
    noStroke();
}

function drawZones() {
    for (const z of zones) {
        // Flash background
        let bg = COLOR_ZONE_BG;
        let edge = COLOR_ZONE_EDGE;
        if (z.flash > 0) {
            const a = map(z.flash, 0, 20, 0, 1);
            if (z.flashColor === 'green') {
                bg = lerpColor(color(COLOR_ZONE_BG), color('#c8e6c9'), a);
                edge = COLOR_CORRECT;
            } else {
                bg = lerpColor(color(COLOR_ZONE_BG), color(COLOR_WRONG_BG), a);
                edge = COLOR_WRONG_EDGE;
            }
            z.flash -= 1;
        }
        stroke(edge);
        strokeWeight(2);
        fill(bg);
        rect(z.x, z.y, z.w, z.h, 10);

        // Labels
        noStroke();
        fill(COLOR_PRIMARY);
        textAlign(CENTER, TOP);
        textStyle(BOLD);
        textSize(14);
        text(z.label, z.x + z.w / 2, z.y + 8);
        textStyle(NORMAL);
        fill('#666');
        textSize(11);
        text('(' + z.hint + ')', z.x + z.w / 2, z.y + 26);

        // Show placed tiles inside the zone as small chips
        const placedHere = tiles.filter(t => t.placed && t.placedZone === z.type);
        let chipY = z.y + 46;
        let chipX = z.x + 6;
        const chipPad = 6;
        textSize(11);
        textAlign(LEFT, CENTER);
        for (const t of placedHere) {
            const tw = textWidth(t.label) + chipPad * 2 + 14;
            if (chipX + tw > z.x + z.w - 6) {
                chipX = z.x + 6;
                chipY += 22;
            }
            stroke(COLOR_CORRECT);
            strokeWeight(1);
            fill('#e8f5e9');
            rect(chipX, chipY, tw, 18, 9);
            noStroke();
            fill(COLOR_CORRECT);
            // checkmark
            text('✓', chipX + 6, chipY + 9);
            fill(COLOR_TEXT);
            text(t.label, chipX + 18, chipY + 9);
            chipX += tw + 4;
        }
    }
}

function drawScenarioDescription() {
    const sc = scenarios[currentScenarioIdx];
    noStroke();
    fill('#ffffff');
    stroke('#bdbdbd');
    strokeWeight(1);
    rect(margin, descTop, containerWidth - margin * 2, descHeight, 8);

    noStroke();
    fill(COLOR_ACCENT);
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    textSize(13);
    text('Scenario ' + (currentScenarioIdx + 1) + ' of ' + scenarios.length + ': ' + sc.title,
         margin + 10, descTop + 8);
    textStyle(NORMAL);
    fill(COLOR_TEXT);
    textSize(12);
    text(sc.description, margin + 10, descTop + 30, containerWidth - margin * 2 - 20, descHeight - 36);
}

function drawTiles() {
    // Draw non-dragged tiles first
    for (const t of tiles) {
        if (t === draggingTile) continue;
        drawTile(t);
    }
    // Draw dragged tile on top
    if (draggingTile) drawTile(draggingTile);
}

function drawTile(t) {
    if (t.placed) return; // placed tiles render as chips inside zones

    // Compute shake offset
    let dx = 0;
    if (t.shake > 0) {
        dx = sin(frameCount * 1.2) * (t.shake * 0.6);
        t.shake -= 1;
        if (t.shake <= 0) {
            // snap back to home
            t.x = t.homeX;
            t.y = t.homeY;
        }
    }

    // Wrong flash background
    let bg = COLOR_TILE;
    let edge = COLOR_TILE_EDGE;
    if (t.flashWrong > 0) {
        const a = map(t.flashWrong, 0, 15, 0, 1);
        bg = lerpColor(color(COLOR_TILE), color(COLOR_WRONG_BG), a);
        edge = COLOR_WRONG_EDGE;
        t.flashWrong -= 1;
    }

    push();
    stroke(edge);
    strokeWeight(2);
    fill(bg);
    rect(t.x + dx, t.y, t.w, t.h, 8);
    noStroke();
    fill(COLOR_TEXT);
    textAlign(CENTER, CENTER);
    // Auto-shrink text if it would overflow the tile width
    let ts = 13;
    textSize(ts);
    while (textWidth(t.label) > t.w - 14 && ts > 9) {
        ts -= 1;
        textSize(ts);
    }
    text(t.label, t.x + dx + t.w / 2, t.y + t.h / 2);
    pop();
}

function drawScore() {
    const total = tiles.length;
    const correct = tiles.filter(t => t.placed).length;
    noStroke();
    fill(COLOR_PRIMARY);
    textAlign(RIGHT, CENTER);
    textStyle(BOLD);
    textSize(13);
    text(correct + ' of ' + total + ' correct', containerWidth - margin, 18);
    textStyle(NORMAL);
}

function mousePressed() {
    if (mouseY > drawHeight) return; // ignore control area
    // Iterate in reverse so top tiles get priority
    for (let i = tiles.length - 1; i >= 0; i--) {
        const t = tiles[i];
        if (t.placed) continue;
        if (mouseX >= t.x && mouseX <= t.x + t.w &&
            mouseY >= t.y && mouseY <= t.y + t.h) {
            draggingTile = t;
            dragOffsetX = mouseX - t.x;
            dragOffsetY = mouseY - t.y;
            // Move to end (top) of array
            tiles.splice(i, 1);
            tiles.push(t);
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
    const t = draggingTile;
    // Check if center of tile is inside any zone
    const cx = t.x + t.w / 2;
    const cy = t.y + t.h / 2;
    let droppedZone = null;
    for (const z of zones) {
        if (cx >= z.x && cx <= z.x + z.w && cy >= z.y && cy <= z.y + z.h) {
            droppedZone = z;
            break;
        }
    }
    if (droppedZone) {
        if (droppedZone.type === t.type) {
            // Correct
            t.placed = true;
            t.placedZone = droppedZone.type;
            droppedZone.flash = 20;
            droppedZone.flashColor = 'green';
            t.flashCorrect = 15;
        } else {
            // Wrong: shake and return
            t.shake = 15;
            t.flashWrong = 15;
            droppedZone.flash = 20;
            droppedZone.flashColor = 'red';
        }
    } else {
        // Dropped outside any zone — snap back gently
        t.x = t.homeX;
        t.y = t.homeY;
    }
    draggingTile = null;
}
