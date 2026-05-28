# bacteria-cell-anatomy — Generation Status

**Date:** 2026-05-28
**Library:** p5.js
**Status:** completed

## Instructional Design Check

- **Bloom Level:** Remember (L1) + Understand (L2)
- **Bloom Verb:** identify (L1) / explain (L2)
- **Pattern:** Click-to-reveal labeled diagram with persistent info panel
- **Rationale:** A two-tier objective ("identify and name" + "explain the
  function") is best served by a labeled-hotspot diagram where students must
  first locate each structure (Remember) and then read its function
  (Understand). Pulsing rings draw the eye to clickable targets without
  spoiling the names; clicking reveals the structure name plus the EXACT
  function tooltip from the spec. A "Show All Labels" button supports a
  secondary self-test workflow (cover-then-check). No continuous animation
  beyond the gentle pulse — keeps cognitive load on the content, not the
  visuals.

## Implementation Summary

- Replaced scaffold `main.html` with the standard p5.js loader (p5 1.11.10
  from jsdelivr, `<main></main>` no id, `canvas.parent(...)`).
- Created `bacteria-cell-anatomy.js` (~430 lines):
    - Capsule-shaped rod bacterium drawn with `bezierVertex` for clean caps;
      layered wall (darker blue `#0277bd`) → membrane (`#01579b`) →
      cytoplasm (blue-green `#80cbc4`) → contents.
    - DNA "nucleoid" rendered as a `curveVertex` squiggle in brown.
    - ~38 purple ribosome dots scattered inside the cytoplasm using a
      deterministic pseudo-random placement and rejection sampling so they
      don't overlap the nucleoid.
    - Single gold flagellum tail (`#fbc02d`) on the right end drawn as a
      sine-modulated polyline.
    - 22 orange pili (`#f57c00`) projected outward along the capsule
      perimeter (right cap skipped to leave room for the flagellum).
- 7 hotspots, each with the EXACT spec tooltip verbatim:
  wall / membrane / cytoplasm / nucleoid / ribosomes / flagellum / pili.
- Pulsing highlight rings (sin-driven alpha + radius) on every hotspot;
  selected hotspot rendered thicker.
- Hover or selection shows a labeled name pill with a leader line to the
  hotspot.
- Info panel below the cell shows the spec text verbatim plus a small
  color swatch matching the structure being explained.
- Two built-in p5 buttons: "Show All Labels" (green) toggles every name on
  at once; "Reset" (orange) clears selection and label-all state.
- Avoided the `fill(hex, alpha)` footgun by using RGB triples wherever
  alpha was needed (`fill(255, 87, 34, 230)`).
- `// CANVAS_HEIGHT: 620` set on line 2; iframe height = 622 in `index.md`
  (CANVAS_HEIGHT + 2 for border).
- `updateCanvasSize()` is the first call in `setup()` per project convention.

## Files Modified

- `/Users/dan/Documents/ws/food-science/docs/sims/bacteria-cell-anatomy/main.html`
- `/Users/dan/Documents/ws/food-science/docs/sims/bacteria-cell-anatomy/bacteria-cell-anatomy.js` (new)
- `/Users/dan/Documents/ws/food-science/docs/sims/bacteria-cell-anatomy/index.md` (status → completed, iframe height 622, scrolling=no)
- `/Users/dan/Documents/ws/food-science/docs/sims/bacteria-cell-anatomy/metadata.json` (bloom + completion fields)

## Layout Review

**Reviewer:** Claude Vision (Opus 4.7) — 2 review-patch cycles.

### Cycle 1 — Flagellum and its hotspot ring clipped at right edge

- **FAIL 1.1 Clipped text/elements at canvas edges:** "The gold flagellum
  tail extends past the right edge of the drawing area — only the wavy
  segment near the cell tip is visible, with the right ~50px of the
  flagellum cut off; the flagellum hotspot's pulsing orange ring is also
  clipped, showing only the left half of the circle."
- **Diagnosis:** Cell was centered at `canvasWidth/2` (380) with
  `cellWidth=460`. The right cap reached x=695, the flagellum extended
  another 150px to x=845, and the flagellum hotspot center sat at x=730
  with a pulsing ring out to ~770 — all past the 760-wide canvas. The
  hotspot x-formula `cx + halfW + halfH*0.5 + 75` did not account for
  any canvas-edge budget.
- **Edit:**
  - `bacteria-cell-anatomy.js:14-16` shrank `cellWidth` 460 → 380,
    `cellHeight` 180 → 170, and introduced an explicit
    `flagellumLength = 110` (was a hardcoded 150).
  - `bacteria-cell-anatomy.js:66-69` shifted `cellCenterX` from
    `canvasWidth/2` to `canvasWidth/2 - 70` so the right-tail elements
    have room.
  - `bacteria-cell-anatomy.js:179-185` re-parameterized the flagellum
    polyline to use `flagellumLength` and reduced the wave amplitude
    14 → 12 to match the smaller cell.
  - `bacteria-cell-anatomy.js:265-267` recomputed the flagellum hotspot
    x as `cx + halfW + halfH*0.5 + flagellumLength*0.55` so it tracks
    the new geometry instead of using a hardcoded `+75`.

### Cycle 2 — Re-capture clean

All 7 hotspots, the bacterium body, the flagellum tail, and the pili
hairs render fully inside the canvas with comfortable whitespace on all
edges. Buttons centered and fully visible. Info panel content fits.
Title bar clean. Off-center cell composition reads naturally because
the right-side whitespace visually accommodates the flagellum.

### Final state — clean

Stopped at cycle 2 of 3. No residual defects.

