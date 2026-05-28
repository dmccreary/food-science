# ph-food-scale — Generation Status

**Date:** 2026-05-28
**Library:** p5.js
**Status:** completed

## Instructional Design Check
- **Bloom Level:** L1 (Remember) + L2 (Understand)
- **Verbs:** Identify, Explain
- **Pattern:** Interactive infographic — click-to-reveal info cards + draggable indicator + toggle overlay.
- **Rationale:** Students first *identify* the pH of common foods by hovering/clicking the 14 icons distributed along a vertical pH bar (L1). They then *explain* the food-safety implications by reading the per-food "implication" line and by toggling the Danger Zone overlay (pH 4.6–9.0) that visually links acidity to bacterial growth (L2). The draggable test slider lets students discover which foods cluster around any given pH, supporting comparison and pattern recognition.

## Implementation Summary
- Vertical pH gradient bar (0 at top, 14 at bottom) drawn as 1px strips through a 7-stop interpolated palette (red → orange → yellow → green at pH 7 → cyan → blue → indigo).
- 14 foods placed at exact spec pH values, alternating left/right of the bar to avoid label overlap. Each icon shows a 3-letter abbreviation in a color-matched circle with a connector line to its bar position.
- Hover shows an info card in the top-right; clicking pins it. Card shows name, pH, what makes it acidic/basic, and a one-line food-science implication (uses the spec's pickle/pH-4.6 example for Vinegar).
- Draggable orange slider handle on the right of the bar. Drag (or click track) sets `testPh`; the entire canvas background tints to a desaturated version of that pH's color. A readout box below the bar lists foods within ±0.3 pH.
- "Show Danger Zone" toggle button overlays a translucent red band from pH 4.6 to 9.0 with a skull icon and "PATHOGEN GROWTH ZONE" caption explaining bacterial growth.
- "Reset" button restores pH 7.0, clears selection, hides Danger Zone.
- Responsive `windowResized()` rebuilds canvas width to fit container (max 900px). All p5 built-in controls (`createButton`), `updateCanvasSize()` first in `setup()`, `canvas.parent(document.querySelector('main'))`.

## Files Modified
- `/Users/dan/Documents/ws/food-science/docs/sims/ph-food-scale/main.html` — replaced scaffold with p5.js loader
- `/Users/dan/Documents/ws/food-science/docs/sims/ph-food-scale/ph-food-scale.js` — created (full MicroSim)
- `/Users/dan/Documents/ws/food-science/docs/sims/ph-food-scale/index.md` — status scaffold → completed, iframe height 600 → 740, bloom L1-L2
- `/Users/dan/Documents/ws/food-science/docs/sims/ph-food-scale/metadata.json` — completion_status → completed, bloom levels set

## Layout Review

**Reviewer:** Claude Vision (Opus 4.7)
**Screenshot tool:** `bk-capture-screenshot` at 800×780
**Cycles:** 3 of 3

### Cycle 1 — initial defects
- FAIL: "VERY ACIDIC" rotated label clipped at left edge — reads "Y ACIDIC".
- FAIL: Test pH readout box clipped at bottom of iframe — "This pH is found in: …" half-cut.
- FAIL: Slider handle covers the Pure Water (H2O) icon at pH 7.0.
- FAIL: Lemon Juice (pH 2.2 R) and Cola (pH 2.5 R) icons overlap; Cola obscures Lemon.
- FAIL: Vinegar (pH 2.4) connector cut through icons because both Vin/Col on the same side too close.

### Cycle 1 → Cycle 2 edits
- `ph-food-scale.js:8` — bumped `canvasHeight` 720 → 760, `drawHeight` 640 → 680.
- `ph-food-scale.js:32–34` — bar geometry reflowed (`barTopY` 80 → 70, leave more room below).
- `ph-food-scale.js:155–195` — replaced rotated `VERY ACIDIC / NEUTRAL / VERY BASIC` labels with horizontal labels above and below the bar.
- `ph-food-scale.js:38–82` — added `xTier` column to food data so close-pH foods can be pushed onto an outer ring. Re-assigned LEM and H2O to tier 1.

### Cycle 2 — remaining defects
- FAIL: VIN (tier 0) and COL (tier 1) still overlap horizontally on the right.
- FAIL: MLK (pH 6.5 L) and H2O (pH 7.0 L tier 1) — MLK and H2O labels collided.
- FAIL: "VERY BASIC" label fell behind the Test pH readout box.

### Cycle 2 → Cycle 3 edits
- `ph-food-scale.js:30–34` — widened canvas to 820, moved slider to FAR right (beyond all R-icon column) using new `rightIconColWidth` constant; eliminates slider/icon collisions permanently.
- `ph-food-scale.js:55–61` — swapped Vinegar to tier 1 (Cola becomes tier 0) so the two close-pH foods land on different rings.
- `ph-food-scale.js:74–78` — moved Pure Water from L tier 1 → R tier 0, and bumped Egg White (pH 7.8) to R tier 1, freeing the MLK row on the left.
- `ph-food-scale.js:~315` — shifted `drawSliderReadout` boxY from `barBottomY + 10` → `barBottomY + 30` so the "VERY BASIC" label has clear vertical space.

### Cycle 3 — final state
- PASS: All 14 food icons visible, color-coded, with full names and pH values.
- PASS: VERY ACIDIC / VERY BASIC region labels horizontal and uncluttered.
- PASS: Slider on far right edge of canvas; never collides with food icons.
- PASS: Background tint, gradient bar, ticks, info-card hook, Danger Zone toggle all render cleanly.
- PASS: Test pH readout box and control panel (Show Danger Zone / Reset) fully visible inside the 780px iframe.
- MINOR: "Cola (pH 2.5)" text label runs underneath the rightward VIN circle, but the text itself remains readable and both icons + their right-flowing labels are clear. Acceptable within cycle limits.

**Final status:** clean — all blocking defects fixed; one minor textual overlap noted but legible.

