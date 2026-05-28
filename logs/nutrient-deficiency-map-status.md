# nutrient-deficiency-map — Generation Status

**Date:** 2026-05-28
**Library:** p5.js
**Status:** completed

## Instructional Design Check
- **Bloom Level:** L1 (Remember)
- **Verb:** Identify / Recall
- **Pattern:** Click-to-reveal interactive infographic — each of 8 nutrient
  cards reveals (a) the deficiency disease, (b) symptoms, (c) primary food
  sources with icons, (d) at-risk population, and (e) highlighted body
  regions colored by severity (red=critical, yellow=mild).
- **Rationale:** Pure recall task — students associate a nutrient with its
  disease, sources, and affected body sites. The body-region highlight gives
  a visuospatial anchor that strengthens memory beyond text-only flashcards.
  A "Show Fortified Foods" toggle adds a public-health connection without
  raising cognitive load above L1.

## Implementation Summary
- Single canvas 760×720 px; left half = stylized humanoid silhouette (head,
  neck, torso, arms, legs); right half = 4×2 grid of nutrient cards (100×80).
- 9 body regions modeled: eyes, mouth/gums, thyroid, brain, bones, spinal
  cord, blood/heart, nerves, muscles. Each region is drawn dormant
  (faint outline) when no nutrient is selected, then re-rendered in the
  severity color from `nutrients[i].regions`.
- 8 nutrient cards (Vitamins A, C, D; Iron, Iodine, Calcium, Folate, B12)
  with color chip + short symbol (A, C, D, Fe, I, Ca, B9, B12).
- Two p5 built-in controls: `Show Fortified Foods` (toggle) and `Reset`.
- Info panel below body shows symptoms + at-risk group + food sources with
  emoji icons; in Fortified mode the panel shows fortification context
  (e.g., "Almost all U.S. milk is fortified with vitamin D since the 1930s").
- Color palette honors project rules: primary green `#2e7d32` (UI + adequate),
  accent orange `#f57c00` (selection highlight + Reset), light bg `#f1f8e9`,
  red `#e53935` (critical), yellow `#fdd835` (mild risk).
- Footgun-safe: never calls `fill(hexString, alpha)` — uses `color(r,g,b,a)`
  for translucency. All drawing helpers wrapped in `push()/pop()`.
- `updateCanvasSize()` is the first line of `setup()`; `<main></main>` has
  no id; canvas is parented via `document.querySelector('main')`.

## Files Modified
- `/Users/dan/Documents/ws/food-science/docs/sims/nutrient-deficiency-map/main.html` (replaced scaffold with p5 loader)
- `/Users/dan/Documents/ws/food-science/docs/sims/nutrient-deficiency-map/nutrient-deficiency-map.js` (new — full sim)
- `/Users/dan/Documents/ws/food-science/docs/sims/nutrient-deficiency-map/index.md` (status → completed, iframe height → 760, bloom_level → L1)
- `/Users/dan/Documents/ws/food-science/docs/sims/nutrient-deficiency-map/metadata.json` (completion_status → completed, bloomLevel → L1, bloomVerb → Identify)

## Layout Review

**Reviewer:** Claude Vision (Opus 4.7)
**Iframe height:** 760 px (canvas 720 + back-link)
**Screenshots taken:** 3 (idle, Iron selected, Iron + Fortified mode)

### Defects found

None. All checklist items pass on first capture:

- **Title bar:** Green header at top; title and subtitle stack cleanly inside
  the 44 px bar with no overlap. ("Nutrient Deficiency Explorer" / "Click a
  nutrient to see which body parts are affected when you don't get enough.")
- **Body silhouette:** Stylized humanoid renders correctly — head, neck,
  trapezoidal torso, arms, legs. Dormant region outlines (faint eye & mouth
  ovals) are subtle but visible inside the head.
- **Cards grid:** 4×2 grid of 100×80 cards renders inside the right half,
  no clipping. Color chips at top of each card carry the short label
  (A, C, D, Fe, I, Ca, B9, B12).
- **Selected state (Iron):** Card border switches to accent orange `#f57c00`
  with stroke weight 3, "Selected" hint replaces "Click to explore". Brain
  arc shows yellow (mild), heart silhouette + torso wash shows red
  (critical blood), arm/thigh ellipses show yellow (mild muscles). White-
  background region labels ("Brain", "Blood / heart", "Muscles") render
  legibly without overlap.
- **Info panel:** Brown header strip carries "Iron — Deficiency: Iron-
  deficiency anemia"; two columns show SYMPTOMS + AT-RISK GROUP on left,
  PRIMARY FOOD SOURCES (with emoji icons) on right. All text fits in the
  140 px panel.
- **Fortified Foods mode:** Header strip preserved, orange "FORTIFIED FOODS"
  label, body region overlay preserved, single explanatory sentence
  rendered without overflow.
- **Legend:** Critical/Mild risk/Adequate swatches stay inside the white
  body panel, bottom-left corner, no overlap with body.
- **Buttons:** Two p5 built-in controls (`Show Fortified Foods` green,
  `Reset` orange) sit centered at the bottom of the canvas above the
  "Back to Documentation" link — both visible inside the iframe.
- **No stroke leakage** onto text; all drawing helpers wrapped in
  `push()/pop()`.

### Edits applied

None. The initial implementation passed the visual checklist.

### Final state

**Clean** — sim renders correctly in all three tested states (idle,
selected with body highlights, fortified mode). No re-patch cycles needed.

