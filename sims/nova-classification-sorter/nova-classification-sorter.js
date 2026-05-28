// NOVA Classification Sorter - Food Science MicroSim
// CANVAS_HEIGHT: 720
// Students drag 20 food cards into the correct NOVA group (1-4) and
// can inspect each food's ingredient list with color-highlighted items.

// ----- Layout constants -----
let canvasWidth = 760;
let drawHeight = 650;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 15;
let defaultTextSize = 13;

// Columns area
let colTop = 60;
let colHeight = 240;
let colGap = 8;
let colWidth;            // computed in setup

// Card pool area
let poolTop;             // y where pool starts
let poolHeight = 320;
let cardW = 132;
let cardH = 44;
let cardGap = 8;
let cardsPerRow = 5;        // single source of truth — used by layoutCards() AND windowResized()

// Score/feedback area
let scoreY;

// ----- NOVA groups -----
// NOVA group ids: 1, 2, 3, 4
let novaGroups = [
  {
    id: 1,
    label: 'NOVA 1',
    title: 'Unprocessed /\nMinimally Processed',
    desc: 'Whole foods straight from nature or with simple steps like washing, cutting, drying.',
    color: [46, 125, 50]       // #2e7d32
  },
  {
    id: 2,
    label: 'NOVA 2',
    title: 'Processed Culinary\nIngredients',
    desc: 'Substances pressed, refined, or ground from NOVA 1 foods. Used to cook with.',
    color: [156, 204, 101]     // #9ccc65
  },
  {
    id: 3,
    label: 'NOVA 3',
    title: 'Processed Foods',
    desc: 'NOVA 1 foods combined with NOVA 2 ingredients, often preserved (salt, smoke, ferment).',
    color: [245, 124, 0]       // #f57c00
  },
  {
    id: 4,
    label: 'NOVA 4',
    title: 'Ultra-Processed\nFoods',
    desc: 'Industrial formulas with additives, sweeteners, dyes, flavors. Rarely homemade.',
    color: [229, 57, 53]       // #e53935
  }
];

// ----- Foods (20 total) -----
// answerGroup is the correct NOVA group id.
// Ingredients are tagged: 'whole' (green), 'preserve' (yellow), 'additive' (red).
let foods = [
  // NOVA 1
  { name: 'Apple',              answerGroup: 1, ingredients: [['Apple', 'whole']] },
  { name: 'Raw Chicken',        answerGroup: 1, ingredients: [['Chicken meat', 'whole']] },
  { name: 'Plain Oats',         answerGroup: 1, ingredients: [['Whole rolled oats', 'whole']] },
  { name: 'Fresh Spinach',      answerGroup: 1, ingredients: [['Spinach leaves', 'whole']] },
  { name: 'Plain Yogurt',       answerGroup: 1, ingredients: [['Milk', 'whole'], ['Live cultures', 'whole']] },
  { name: 'Honey',              answerGroup: 1, ingredients: [['Honey', 'whole']] },

  // NOVA 2
  { name: 'White Sugar',        answerGroup: 2, ingredients: [['Refined cane sugar', 'whole']] },
  { name: 'Butter',             answerGroup: 2, ingredients: [['Cream', 'whole'], ['Salt', 'preserve']] },
  { name: 'Table Salt',         answerGroup: 2, ingredients: [['Salt', 'preserve'], ['Iodine', 'preserve']] },
  { name: 'Olive Oil',          answerGroup: 2, ingredients: [['Pressed olive oil', 'whole']] },

  // NOVA 3
  { name: 'Canned Tomatoes',    answerGroup: 3, ingredients: [['Tomatoes', 'whole'], ['Tomato juice', 'whole'], ['Salt', 'preserve'], ['Citric acid', 'preserve']] },
  { name: 'Smoked Salmon',      answerGroup: 3, ingredients: [['Salmon', 'whole'], ['Salt', 'preserve'], ['Smoke', 'preserve']] },
  { name: 'Artisan Cheese',     answerGroup: 3, ingredients: [['Milk', 'whole'], ['Cultures', 'whole'], ['Salt', 'preserve'], ['Enzymes', 'preserve']] },
  { name: 'Sourdough Bread',    answerGroup: 3, ingredients: [['Flour', 'whole'], ['Water', 'whole'], ['Wild yeast', 'whole'], ['Salt', 'preserve']] },

  // NOVA 4
  { name: 'Soda',               answerGroup: 4, ingredients: [['Carbonated water', 'whole'], ['High-fructose corn syrup', 'additive'], ['Caramel color', 'additive'], ['Phosphoric acid', 'additive'], ['Natural flavors', 'additive'], ['Caffeine', 'additive']] },
  { name: 'Instant Noodles',    answerGroup: 4, ingredients: [['Wheat flour', 'whole'], ['Palm oil', 'additive'], ['Salt', 'preserve'], ['MSG', 'additive'], ['Hydrolyzed protein', 'additive'], ['Artificial flavors', 'additive']] },
  { name: 'Breakfast Cereal',   answerGroup: 4, ingredients: [['Corn flour', 'whole'], ['Sugar', 'additive'], ['Corn syrup', 'additive'], ['Salt', 'preserve'], ['Artificial colors', 'additive'], ['BHT (preservative)', 'additive']] },
  { name: 'Processed Cheese',   answerGroup: 4, ingredients: [['Cheese', 'whole'], ['Whey', 'whole'], ['Sodium phosphates', 'additive'], ['Sorbic acid', 'additive'], ['Artificial color', 'additive']] },
  { name: 'Flavored Chips',     answerGroup: 4, ingredients: [['Potatoes', 'whole'], ['Vegetable oil', 'whole'], ['Salt', 'preserve'], ['MSG', 'additive'], ['Maltodextrin', 'additive'], ['Artificial flavor', 'additive']] },
  { name: 'Frozen Pizza',       answerGroup: 4, ingredients: [['Enriched flour', 'whole'], ['Tomato sauce', 'whole'], ['Cheese', 'whole'], ['Modified starch', 'additive'], ['Sodium nitrite', 'additive'], ['Artificial flavors', 'additive'] ] }
];

// Card state objects (parallel array)
let cards = [];           // {food, x, y, w, h, homeX, homeY, placedGroup, locked}
let draggingCard = null;
let dragOffsetX = 0, dragOffsetY = 0;

// Inspect modal state
let inspectCard = null;   // card whose ingredients are showing

// Feedback flash
let flashCard = null;
let flashColor = null;    // p5 color
let flashUntil = 0;
let feedbackMsg = '';
let feedbackUntil = 0;

// UI
let resetButton;

// ----- Helpers -----
function updateCanvasSize() {
  const container = document.querySelector('main').parentElement;
  const rect = container.getBoundingClientRect();
  canvasWidth = Math.max(400, Math.floor(rect.width)) - 2;
  if (canvasWidth > 900) canvasWidth = 900;
}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Segoe UI, Arial, sans-serif');

  computeLayout();
  layoutCards();

  // Controls
  resetButton = createButton('Reset');
  resetButton.position(15, drawHeight + 18);
  resetButton.size(80, 28);
  resetButton.mousePressed(resetSim);
  resetButton.style('background-color', '#2e7d32');
  resetButton.style('color', 'white');
  resetButton.style('border', 'none');
  resetButton.style('border-radius', '4px');
  resetButton.style('cursor', 'pointer');
  resetButton.style('font-size', '13px');
}

function computeLayout() {
  colWidth = (canvasWidth - 2 * margin - 3 * colGap) / 4;
  poolTop = colTop + colHeight + 20;
}

function layoutCards() {
  cards = [];
  // 4 rows of `cardsPerRow`, centered.
  let perRow = cardsPerRow;
  let totalW = perRow * cardW + (perRow - 1) * cardGap;
  let startX = (canvasWidth - totalW) / 2;
  for (let i = 0; i < foods.length; i++) {
    let row = Math.floor(i / perRow);
    let col = i % perRow;
    let x = startX + col * (cardW + cardGap);
    let y = poolTop + 30 + row * (cardH + cardGap + 18); // +18 for inspect button row
    cards.push({
      food: foods[i],
      x: x,
      y: y,
      w: cardW,
      h: cardH,
      homeX: x,
      homeY: y,
      placedGroup: null,
      locked: false
    });
  }
}

function resetSim() {
  inspectCard = null;
  draggingCard = null;
  flashCard = null;
  feedbackMsg = '';
  layoutCards();
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  computeLayout();
  // Re-home unplaced cards; keep placed cards in their columns (approximate position).
  let perRow = cardsPerRow;
  let totalW = perRow * cardW + (perRow - 1) * cardGap;
  let startX = (canvasWidth - totalW) / 2;
  for (let i = 0; i < cards.length; i++) {
    let c = cards[i];
    let row = Math.floor(i / perRow);
    let col = i % perRow;
    c.homeX = startX + col * (cardW + cardGap);
    c.homeY = poolTop + 30 + row * (cardH + cardGap + 18);
    if (!c.locked) {
      c.x = c.homeX;
      c.y = c.homeY;
    } else {
      // Move locked card to top of its column (stacked).
      placeCardInColumn(c);
    }
  }
}

function placeCardInColumn(card) {
  let groupIdx = card.placedGroup - 1;
  let colX = margin + groupIdx * (colWidth + colGap);
  // Stack placed cards inside the column.
  let placedInCol = cards.filter(c => c.locked && c.placedGroup === card.placedGroup);
  let idx = placedInCol.indexOf(card);
  if (idx < 0) idx = placedInCol.length;
  let stackY = colTop + 110 + idx * 20;
  card.x = colX + (colWidth - card.w) / 2;
  card.y = stackY;
}

function draw() {
  background(241, 248, 233); // #f1f8e9

  drawTitle();
  drawColumns();
  drawPool();
  drawScore();
  drawFeedback();
  drawCards();
  if (inspectCard) drawInspectModal();
}

function drawTitle() {
  push();
  noStroke();
  fill(33);
  textSize(18);
  textStyle(BOLD);
  textAlign(CENTER, TOP);
  text('NOVA Classification Sorter', canvasWidth / 2, 8);
  textStyle(NORMAL);
  textSize(12);
  fill(80);
  text('Drag each food into the correct NOVA group. Click a card to inspect its ingredients.',
    canvasWidth / 2, 32);
  pop();
}

function drawColumns() {
  push();
  textAlign(CENTER, TOP);
  for (let i = 0; i < novaGroups.length; i++) {
    let g = novaGroups[i];
    let x = margin + i * (colWidth + colGap);
    let y = colTop;

    // Drop zone tint
    let c = color(g.color[0], g.color[1], g.color[2]);
    c.setAlpha(40);
    fill(c);
    stroke(g.color[0], g.color[1], g.color[2]);
    strokeWeight(2);
    rect(x, y, colWidth, colHeight, 8);

    // Header bar
    noStroke();
    fill(g.color[0], g.color[1], g.color[2]);
    rect(x, y, colWidth, 60, 8, 8, 0, 0);

    // Group label
    fill(255);
    textSize(14);
    textStyle(BOLD);
    text(g.label, x + colWidth / 2, y + 6);
    textSize(11);
    textStyle(NORMAL);
    let titleLines = g.title.split('\n');
    for (let li = 0; li < titleLines.length; li++) {
      text(titleLines[li], x + colWidth / 2, y + 24 + li * 13);
    }

    // Description
    fill(50);
    textSize(10);
    textAlign(LEFT, TOP);
    textLeading(12);
    text(g.desc, x + 6, y + 64, colWidth - 12, 50);
    textAlign(CENTER, TOP);
  }
  pop();
}

function drawPool() {
  push();
  noStroke();
  fill(255, 255, 255, 180);
  stroke(180);
  strokeWeight(1);
  rect(margin, poolTop, canvasWidth - 2 * margin, poolHeight, 6);
  noStroke();
  fill(80);
  textSize(12);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text('Food Pool', margin + 8, poolTop + 6);
  textStyle(NORMAL);
  pop();
}

function drawScore() {
  let correct = cards.filter(c => c.locked && c.placedGroup === c.food.answerGroup).length;
  let placed = cards.filter(c => c.locked).length;
  push();
  noStroke();
  fill(46, 125, 50);
  textSize(13);
  textStyle(BOLD);
  textAlign(RIGHT, TOP);
  text('Score: ' + correct + ' / ' + foods.length + '   (Placed: ' + placed + ')',
    canvasWidth - margin - 4, poolTop + 6);
  pop();
}

function drawFeedback() {
  if (millis() > feedbackUntil) return;
  push();
  noStroke();
  fill(33, 33, 33, 230);
  let msgW = textWidth(feedbackMsg) + 24;
  let msgX = canvasWidth / 2 - msgW / 2;
  let msgY = poolTop - 30;
  rect(msgX, msgY, msgW, 24, 6);
  fill(255);
  textSize(12);
  textAlign(CENTER, CENTER);
  text(feedbackMsg, canvasWidth / 2, msgY + 12);
  pop();
}

function drawCards() {
  // Draw non-dragging first, then dragging on top.
  for (let c of cards) {
    if (c === draggingCard) continue;
    drawCard(c);
  }
  if (draggingCard) drawCard(draggingCard);
}

function drawCard(card) {
  push();
  let isFlash = (card === flashCard && millis() < flashUntil);
  // Card body
  if (isFlash) {
    fill(flashColor);
  } else if (card.locked) {
    let g = novaGroups[card.placedGroup - 1];
    let bg = color(g.color[0], g.color[1], g.color[2]);
    bg.setAlpha(90);
    fill(bg);
  } else {
    fill(255);
  }
  stroke(card === draggingCard ? 0 : 100);
  strokeWeight(card === draggingCard ? 2 : 1);
  rect(card.x, card.y, card.w, card.h, 6);

  // Tiny color indicator (the group it BELONGS to is hidden — show neutral dot
  // unless it's been placed). When placed, show the placed-group color.
  noStroke();
  if (card.locked) {
    let g = novaGroups[card.placedGroup - 1];
    fill(g.color[0], g.color[1], g.color[2]);
  } else {
    fill(180);
  }
  ellipse(card.x + 10, card.y + 10, 8, 8);

  // Name
  fill(33);
  textSize(11);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text(card.food.name, card.x + 20, card.y + 5, card.w - 24, 20);

  // Inspect button area (lower part of card)
  textStyle(NORMAL);
  fill(46, 125, 50);
  rect(card.x + 4, card.y + card.h - 16, card.w - 8, 13, 3);
  fill(255);
  textSize(9);
  textAlign(CENTER, CENTER);
  text('Inspect Ingredients', card.x + card.w / 2, card.y + card.h - 9);
  pop();
}

function drawInspectModal() {
  push();
  // Dim background.
  let dim = color(0, 0, 0);
  dim.setAlpha(140);
  fill(dim);
  noStroke();
  rect(0, 0, canvasWidth, drawHeight);

  // Modal box
  let mw = min(420, canvasWidth - 40);
  let mh = 280;
  let mx = (canvasWidth - mw) / 2;
  let my = (drawHeight - mh) / 2;
  fill(255);
  stroke(46, 125, 50);
  strokeWeight(2);
  rect(mx, my, mw, mh, 10);

  // Title
  noStroke();
  fill(33);
  textSize(15);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text('Ingredients: ' + inspectCard.food.name, mx + 14, my + 12);

  // Legend
  textStyle(NORMAL);
  textSize(10);
  let lx = mx + 14;
  let ly = my + 38;
  drawLegendDot(lx, ly, 46, 125, 50);
  fill(33); text('Whole food', lx + 12, ly - 4);
  drawLegendDot(lx + 100, ly, 253, 216, 53);
  fill(33); text('Preserving agent', lx + 112, ly - 4);
  drawLegendDot(lx + 240, ly, 229, 57, 53);
  fill(33); text('Additive', lx + 252, ly - 4);

  // List ingredients
  textSize(12);
  let iy = my + 64;
  for (let ing of inspectCard.food.ingredients) {
    let label = ing[0];
    let kind = ing[1];
    let bg;
    if (kind === 'whole') bg = color(46, 125, 50);
    else if (kind === 'preserve') bg = color(253, 216, 53);
    else bg = color(229, 57, 53);
    bg.setAlpha(60);
    fill(bg);
    noStroke();
    rect(mx + 14, iy, mw - 28, 22, 4);
    fill(33);
    textAlign(LEFT, CENTER);
    text('• ' + label, mx + 22, iy + 11);
    iy += 26;
  }

  // Hint text near bottom
  fill(80);
  textSize(11);
  textAlign(CENTER, BOTTOM);
  text('Lots of red = ultra-processed (NOVA 4). Mostly green = whole food (NOVA 1).',
    mx + mw / 2, my + mh - 32);

  // Close button
  fill(46, 125, 50);
  rect(mx + mw / 2 - 40, my + mh - 26, 80, 18, 4);
  fill(255);
  textSize(11);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text('Close', mx + mw / 2, my + mh - 17);
  pop();
}

function drawLegendDot(x, y, r, g, b) {
  push();
  noStroke();
  fill(r, g, b);
  ellipse(x + 4, y + 4, 8, 8);
  pop();
}

function inspectCloseButtonHit(mx, my) {
  if (!inspectCard) return false;
  let mw = min(420, canvasWidth - 40);
  let mh = 280;
  let modX = (canvasWidth - mw) / 2;
  let modY = (drawHeight - mh) / 2;
  let bx = modX + mw / 2 - 40;
  let by = modY + mh - 26;
  return mx >= bx && mx <= bx + 80 && my >= by && my <= by + 18;
}

function inspectButtonHit(card, mx, my) {
  let bx = card.x + 4;
  let by = card.y + card.h - 16;
  return mx >= bx && mx <= bx + (card.w - 8) && my >= by && my <= by + 13;
}

function cardHit(card, mx, my) {
  return mx >= card.x && mx <= card.x + card.w &&
         my >= card.y && my <= card.y + card.h;
}

function columnAt(mx, my) {
  if (my < colTop || my > colTop + colHeight) return null;
  for (let i = 0; i < novaGroups.length; i++) {
    let x = margin + i * (colWidth + colGap);
    if (mx >= x && mx <= x + colWidth) return novaGroups[i];
  }
  return null;
}

function mousePressed() {
  // Modal: close button takes priority.
  if (inspectCard) {
    if (inspectCloseButtonHit(mouseX, mouseY)) {
      inspectCard = null;
    } else {
      // Click outside modal also closes.
      let mw = min(420, canvasWidth - 40);
      let mh = 280;
      let mx = (canvasWidth - mw) / 2;
      let my = (drawHeight - mh) / 2;
      if (mouseX < mx || mouseX > mx + mw || mouseY < my || mouseY > my + mh) {
        inspectCard = null;
      }
    }
    return;
  }

  // Iterate top-down (cards drawn later are on top — last in array).
  for (let i = cards.length - 1; i >= 0; i--) {
    let c = cards[i];
    if (!cardHit(c, mouseX, mouseY)) continue;
    // Check inspect button first.
    if (inspectButtonHit(c, mouseX, mouseY)) {
      inspectCard = c;
      return;
    }
    // Don't allow dragging locked cards (already placed correctly).
    if (c.locked && c.placedGroup === c.food.answerGroup) {
      feedbackMsg = c.food.name + ' is already correctly placed!';
      feedbackUntil = millis() + 1500;
      return;
    }
    // Start drag (lift card to top of array).
    draggingCard = c;
    cards.splice(i, 1);
    cards.push(c);
    dragOffsetX = mouseX - c.x;
    dragOffsetY = mouseY - c.y;
    // If it was previously placed-but-wrong, unlock for re-attempt.
    c.locked = false;
    c.placedGroup = null;
    return;
  }
}

function mouseDragged() {
  if (draggingCard) {
    draggingCard.x = mouseX - dragOffsetX;
    draggingCard.y = mouseY - dragOffsetY;
  }
}

function mouseReleased() {
  if (!draggingCard) return;
  let c = draggingCard;
  // Determine if the card center landed in a column drop zone.
  let cx = c.x + c.w / 2;
  let cy = c.y + c.h / 2;
  let col = columnAt(cx, cy);
  if (col) {
    let correct = col.id === c.food.answerGroup;
    c.placedGroup = col.id;
    c.locked = true;
    if (correct) {
      flashCard = c;
      flashColor = color(46, 125, 50, 180);
      flashUntil = millis() + 600;
      feedbackMsg = 'Correct! ' + c.food.name + ' is ' + groupName(col.id) + '.';
      feedbackUntil = millis() + 2000;
      placeCardInColumn(c);
    } else {
      flashCard = c;
      flashColor = color(229, 57, 53, 180);
      flashUntil = millis() + 600;
      let correctGroup = novaGroups[c.food.answerGroup - 1];
      feedbackMsg = 'Not quite. ' + c.food.name + ' is actually ' + correctGroup.label +
                    ' — ' + shortReason(c.food, correctGroup);
      feedbackUntil = millis() + 3500;
      // Snap back home so student can re-try (and so unlocking on next click works).
      c.locked = false;
      c.placedGroup = null;
      c.x = c.homeX;
      c.y = c.homeY;
    }
  } else {
    // Drop outside any column - return to home position.
    c.x = c.homeX;
    c.y = c.homeY;
    c.locked = false;
    c.placedGroup = null;
  }
  draggingCard = null;
}

function groupName(id) {
  return novaGroups[id - 1].label;
}

function shortReason(food, group) {
  if (group.id === 1) return 'a whole or barely-touched food.';
  if (group.id === 2) return 'a refined cooking ingredient.';
  if (group.id === 3) return 'a whole food preserved with simple methods.';
  return 'an industrial formula with additives.';
}
