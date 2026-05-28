// Scientific Method Steps Explorer - Food Science MicroSim
// CANVAS_HEIGHT: 640
// Students click step boxes in a vertical flowchart to reveal food-science examples.

// ----- Layout constants -----
let canvasWidth = 760;
let drawHeight = 580;
let controlHeight = 60;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let defaultTextSize = 14;

// Flowchart geometry (left column of step boxes)
let flowX = 30;          // left x of step boxes
let flowW = 280;         // width of step boxes
let stepH = 56;          // height of each box
let stepGap = 18;        // vertical gap between boxes
let firstStepY = 60;     // y of the first step box top

// Panel geometry (right side info panel)
let panelX, panelY, panelW, panelH;

// Steps data
let steps = [
  {
    name: 'Ask a Question',
    subtitle: 'What do I want to know?',
    explanation: 'Scientists start by noticing something curious and turning it into a clear, focused question.',
    example: '"Why does bread rise when it is baked?"'
  },
  {
    name: 'Background Research',
    subtitle: 'What do we already know?',
    explanation: 'Read books, articles, and prior experiments so you don\'t repeat work that has already been done.',
    example: '"Bakers have known for centuries that yeast produces gas. Scientists discovered the gas is carbon dioxide."'
  },
  {
    name: 'Form a Hypothesis',
    subtitle: 'My testable prediction',
    explanation: 'Write a specific "if-then" statement that can be tested with an experiment.',
    example: '"If yeast has more sugar to eat, then the bread will rise higher."'
  },
  {
    name: 'Design an Experiment',
    subtitle: 'How will I test it?',
    explanation: 'Plan a fair test that changes only one variable at a time and keeps everything else the same.',
    example: '"Bake three loaves with 0 g, 5 g, and 10 g of added sugar. Keep everything else the same."'
  },
  {
    name: 'Collect Data',
    subtitle: 'Measure and record',
    explanation: 'Carefully observe and record measurements using the same tools and methods each time.',
    example: '"Measure the rise height of each loaf after 60 minutes of baking."'
  },
  {
    name: 'Analyze Data',
    subtitle: 'What do the numbers say?',
    explanation: 'Organize results in tables or graphs to see patterns and compare groups.',
    example: '"Loaf with 10 g sugar rose 12 cm; 5 g rose 9 cm; 0 g rose 5 cm."'
  },
  {
    name: 'Draw a Conclusion',
    subtitle: 'Was the hypothesis supported?',
    explanation: 'Decide whether the data supports your hypothesis, then share your results so others can repeat the study.',
    example: '"More sugar increased rise height. Hypothesis supported. Publish and share results."'
  }
];

let selectedStep = -1;   // index of clicked step (-1 = none)
let resetButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Segoe UI, Arial, sans-serif');

  computeLayout();

  resetButton = createButton('Reset');
  resetButton.position(canvasWidth - 90, drawHeight + 15);
  resetButton.mousePressed(() => { selectedStep = -1; });
  resetButton.parent(document.querySelector('main'));

  describe('A vertical flowchart of the seven steps of the scientific method. Click any step to read a food-science example.', LABEL);
}

function computeLayout() {
  // Left column reserves space for the repeat-loop arrow on the FAR LEFT.
  // Layout:  [loop-arrow gutter | step boxes | gap | info panel]
  let loopGutter = 44;          // space on the left for the repeat loop
  let leftRegionW = 360;        // total left region including gutter
  if (canvasWidth < 700) {
    leftRegionW = Math.min(360, canvasWidth - 40);
  }
  flowX = loopGutter;
  flowW = leftRegionW - loopGutter - 10;

  panelX = leftRegionW + 10;
  panelY = 50;
  panelW = canvasWidth - panelX - margin;
  panelH = drawHeight - panelY - 20;
}

function draw() {
  updateCanvasSize();
  computeLayout();

  // Background drawing region
  noStroke();
  fill('#f1f8e9');
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
  text('The Scientific Method', margin, 14);
  textStyle(NORMAL);

  // Subtitle (right aligned)
  fill('#555');
  textSize(12);
  textAlign(RIGHT, TOP);
  text('Click any step to see a food-science example', canvasWidth - margin, 20);

  // Draw flowchart
  drawFlowchart();

  // Draw info panel on the right
  drawPanel();
}

function drawFlowchart() {
  // Step boxes vertically, with arrows between them
  for (let i = 0; i < steps.length; i++) {
    let y = firstStepY + i * (stepH + stepGap);
    drawStepBox(i, flowX, y, flowW, stepH);

    // Down arrow between this and next
    if (i < steps.length - 1) {
      let ax = flowX + flowW / 2;
      let ay1 = y + stepH;
      let ay2 = y + stepH + stepGap;
      stroke('#555');
      strokeWeight(2);
      line(ax, ay1, ax, ay2 - 2);
      // arrowhead
      noStroke();
      fill('#555');
      triangle(ax - 5, ay2 - 6, ax + 5, ay2 - 6, ax, ay2 + 1);
    }
  }

  // Repeat loop arrow on the LEFT side: from last step back up to first
  let firstY = firstStepY;
  let lastY = firstStepY + (steps.length - 1) * (stepH + stepGap);
  let loopLeft = 18;                    // far-left x of the loop track
  // start: middle LEFT of last box
  let startX = flowX;
  let startY = lastY + stepH / 2;
  // end: middle LEFT of first box
  let endX = flowX;
  let endY = firstY + stepH / 2;

  noFill();
  stroke('#f57c00');
  strokeWeight(2.5);
  beginShape();
  vertex(startX, startY);
  vertex(loopLeft, startY);
  vertex(loopLeft, endY);
  vertex(endX - 4, endY);
  endShape();
  strokeWeight(1);

  // arrowhead pointing RIGHT into the first box's left edge
  noStroke();
  fill('#f57c00');
  triangle(endX - 4, endY - 5, endX - 4, endY + 5, endX + 4, endY);

  // "Repeat" label rotated along the loop's vertical segment
  push();
  translate(loopLeft - 6, (startY + endY) / 2);
  rotate(-HALF_PI);
  noStroke();
  fill('#f57c00');
  textAlign(CENTER, CENTER);
  textSize(12);
  textStyle(BOLD);
  text('Science is a cycle — repeat!', 0, 0);
  textStyle(NORMAL);
  pop();
}

function drawStepBox(i, x, y, w, h) {
  let isSelected = (i === selectedStep);
  // Shadow
  noStroke();
  fill(0, 0, 0, 25);
  rect(x + 2, y + 3, w, h, 8);

  // Box
  if (isSelected) {
    fill('#2e7d32');
    stroke('#1b5e20');
  } else {
    fill('#ffffff');
    stroke('#9e9e9e');
  }
  strokeWeight(isSelected ? 2 : 1);
  rect(x, y, w, h, 8);
  strokeWeight(1);

  // Step number circle on the left
  noStroke();
  fill(isSelected ? '#f57c00' : '#2e7d32');
  ellipse(x + 22, y + h / 2, 30, 30);
  fill('white');
  textAlign(CENTER, CENTER);
  textSize(15);
  textStyle(BOLD);
  text(i + 1, x + 22, y + h / 2 + 1);
  textStyle(NORMAL);

  // Step name
  textAlign(LEFT, TOP);
  textSize(13);
  textStyle(BOLD);
  fill(isSelected ? 'white' : '#212121');
  text(steps[i].name, x + 46, y + 8);
  textStyle(NORMAL);

  // Subtitle
  textSize(11);
  fill(isSelected ? '#e8f5e9' : '#616161');
  text(steps[i].subtitle, x + 46, y + 28);

  // hover indicator (small chevron)
  if (!isSelected) {
    noStroke();
    fill('#bdbdbd');
    textAlign(RIGHT, CENTER);
    textSize(14);
    text('›', x + w - 10, y + h / 2);
  }
}

function drawPanel() {
  // Panel background
  noStroke();
  fill('#ffffff');
  stroke('#c8e6c9');
  strokeWeight(1.5);
  rect(panelX, panelY, panelW, panelH, 10);
  strokeWeight(1);

  // Header bar
  noStroke();
  fill('#2e7d32');
  rect(panelX, panelY, panelW, 32, 10, 10, 0, 0);

  fill('white');
  textAlign(LEFT, CENTER);
  textSize(13);
  textStyle(BOLD);
  if (selectedStep >= 0) {
    text(`Step ${selectedStep + 1}: ${steps[selectedStep].name}`, panelX + 12, panelY + 16);
  } else {
    text('Click a step on the left', panelX + 12, panelY + 16);
  }
  textStyle(NORMAL);

  // Body
  let bx = panelX + 14;
  let by = panelY + 48;
  let bw = panelW - 28;

  if (selectedStep < 0) {
    fill('#555');
    textAlign(LEFT, TOP);
    textSize(12);
    textStyle(ITALIC);
    drawWrapped(
      'The scientific method is a step-by-step way to investigate questions about the world. Each step builds on the one before, and the orange loop on the left shows that scientists often repeat the cycle with new questions.',
      bx, by, bw, 16
    );
    textStyle(NORMAL);

    by += 110;
    fill('#f57c00');
    textStyle(BOLD);
    textSize(12);
    text('Try this:', bx, by);
    textStyle(NORMAL);
    by += 18;
    fill('#333');
    drawWrapped('Click step 1 to start. Follow each step in order to see how a real food-science investigation about bread and yeast unfolds.',
      bx, by, bw, 16);
    return;
  }

  let s = steps[selectedStep];

  // "What happens here" label
  fill('#2e7d32');
  textAlign(LEFT, TOP);
  textSize(12);
  textStyle(BOLD);
  text('What happens here', bx, by);
  textStyle(NORMAL);
  by += 18;
  fill('#222');
  textSize(12);
  by = drawWrapped(s.explanation, bx, by, bw, 16) + 12;

  // "Food-science example" label
  fill('#f57c00');
  textStyle(BOLD);
  text('Food-Science Example', bx, by);
  textStyle(NORMAL);
  by += 18;
  fill('#222');
  by = drawWrapped(s.example, bx, by, bw, 16) + 10;

  // Footer navigation hint
  fill('#777');
  textSize(11);
  textStyle(ITALIC);
  let hint = selectedStep < steps.length - 1
    ? `Next: Step ${selectedStep + 2} — ${steps[selectedStep + 1].name}`
    : 'You reached the end! The orange arrow loops back to Step 1.';
  drawWrapped(hint, bx, panelY + panelH - 36, bw, 14);
  textStyle(NORMAL);
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

// ----- Mouse interaction -----
function mousePressed() {
  for (let i = 0; i < steps.length; i++) {
    let y = firstStepY + i * (stepH + stepGap);
    if (mouseX >= flowX && mouseX <= flowX + flowW &&
        mouseY >= y && mouseY <= y + stepH) {
      // toggle: clicking same step collapses
      selectedStep = (selectedStep === i) ? -1 : i;
      return;
    }
  }
}

// ----- Responsiveness -----
function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  computeLayout();
  if (resetButton) resetButton.position(canvasWidth - 90, drawHeight + 15);
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = container.offsetWidth;
    if (canvasWidth < 400) canvasWidth = 400;
  }
}
