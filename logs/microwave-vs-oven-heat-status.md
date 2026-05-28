# microwave-vs-oven-heat — Generation Status

**Date:** 2026-05-28
**Library:** p5.js
**Status:** completed

## Instructional Design Check
- **Bloom Level:** L4 (Analyze)
- **Verb:** Compare
- **Pattern:** Side-by-side comparison with a shared simulation clock and click-to-inspect temperature readouts.
- **Rationale:** The learning objective is to *compare* where and how heat is generated inside food in two cooking methods. Continuous animation is purposeful here because the comparison IS spatial-temporal (heat front advancing inward vs. uniform volumetric heating). Synchronized time + click-anywhere readout lets students contrast the two mechanisms at any instant.

## Implementation Summary
- Two equal panels side by side, each rendering a potato cross-section (~200px diameter) using a 26x26 grid of cells masked to a circle.
- Shared simulation clock 0:00 – 5:00 with a progress bar; 1 real second ~= 12 simulated seconds so a full 5-minute cook takes ~25s of real time.
- Oven model: radial heat-front advances inward from r=1.0 toward r=0.7 by t=300s; outer shell heats from ~90°F up to ~220°F; inner core stays near 70°F.
- Microwave model: uniform temperature ramp (70 → 140 by 30s → 195 by 120s, then slow creep). 6 random "cool spots" subtract up to ~35°F locally to represent low-water pockets.
- Click anywhere on either potato to place a marker; the explanation box below shows the simulated temperature plus a context-aware sentence (surface vs middle vs center for the oven; cool-spot vs main body for the microwave).
- Color legend (40°F blue → 200°F+ red) drawn as a gradient bar with tick labels matching the spec.
- p5.js built-in controls: Start Cooking, Pause, Reset.
- `updateCanvasSize()` is the first line of `setup()`; canvas is parented via `document.querySelector('main')`; `windowResized()` resizes the canvas and reflows controls. Potato radius clamped to panel width for narrow viewports.
- CANVAS_HEIGHT comment set to 620; iframe height set to 622.

## Files Modified
- `/Users/dan/Documents/ws/food-science/docs/sims/microwave-vs-oven-heat/microwave-vs-oven-heat.js` (new)
- `/Users/dan/Documents/ws/food-science/docs/sims/microwave-vs-oven-heat/main.html` (replaced scaffold with p5.js loader)
- `/Users/dan/Documents/ws/food-science/docs/sims/microwave-vs-oven-heat/index.md` (status scaffold → completed, bloom_level → L4, iframe height 600 → 622)

## Layout Review

**Reviewer:** Claude Vision (Opus 4.7)
**Screenshots captured at:** 800×622 via `bk-capture-screenshot`
**Review cycles:** 3 (final pass clean)

### Cycle 1 — defects found

- **FAIL — Oven potato wrongly tinted green at t=0:00.** The Conventional Oven panel rendered the entire potato in green (~90°F equivalent color) at the start of the simulation, but the caption below said "Cold potato. Oven air is hot, the inside is still 70°F." Color contradicted the label. Root cause: `ovenTempAtNorm` interpolated `90 → 70` in the inner-core branch and `90 → edgeTemp` in the outer branch, so the minimum temperature anywhere in the disk at t=0 was 90°F, not 70°F.
- **FAIL — Visible grid seams between heatmap cells.** Thin one-pixel light lines were visible between adjacent cells inside both potatoes, giving a checkerboard / mesh appearance instead of a smooth thermal field. Root cause: `rect(px, py, cellSize, cellSize)` with no inter-cell overlap means sub-pixel rasterization leaves seams.

### Cycle 1 → Cycle 2 edits

- `microwave-vs-oven-heat.js:154` (and surrounding `ovenTempAtNorm` body): added an early return for `tSec <= 0.01` so the potato is uniformly 70°F at t=0; changed the inner-core branch to a flat `T = 70` (no interpolation away from room temp); changed the outer-shell lerp from `90 → edgeTemp` to `70 → edgeTemp` so the gradient is anchored at room temp at the heat front, not 90°F.
- `microwave-vs-oven-heat.js:228`: changed `rect(px, py, cellSize, cellSize)` to `rect(px, py, cellSize + 1, cellSize + 1)` to overlap neighbours by one pixel and eliminate the seams.

### Cycle 2 — re-review

- PASS — Oven panel now uniformly room-temperature color at t=0:00, matching the caption.
- PASS — Cell seams gone; potato reads as a smooth thermal field.
- **FAIL — Microwave panel shows visible blue cool spots at t=0:00.** The Microwave potato at t=0 had clearly darker blue patches where the cool spots were placed. This is physically wrong: a cool spot is a region of *lower water content* that *lags behind* during heating — it isn't *colder than room temperature*. Root cause: `microwaveTempAtNorm` unconditionally subtracted `coolDelta` (up to 35°F) from `base`, so at base=70°F the cool-spot centers landed at 35°F → pure blue from the legend's bottom anchor.

### Cycle 2 → Cycle 3 edits

- `microwave-vs-oven-heat.js:181`: introduced `heatRise = max(0, base - 70)` and `coolScale = min(1, heatRise / 80)`, then multiplied the per-spot `coolDelta` contribution by `coolScale`. Cool spots now fade in as the bulk temperature rises, reaching full strength only once the base passes ~150°F.

### Cycle 3 — re-review

- PASS — Both potatoes uniformly teal at t=0:00, matching "Cold potato" captions. Cool spots invisible until heating starts.
- PASS — All other checklist items still pass; no regressions introduced.

### Final state: clean

All flagged defects resolved in 3 cycles. The screenshot at `/Users/dan/Documents/ws/food-science/docs/sims/microwave-vs-oven-heat/microwave-vs-oven-heat.png` reflects the final state.

### Footgun noted

The cool-spot bug is a small **silent-clamp footgun**: when the heat model returns a temperature below the legend's bottom stop (40°F), `tempToColor` silently clamps to pure blue rather than warning. That made an unphysical 35°F value render as "very cold spot" instead of "model bug". A defensive fix would be to assert `T >= 65` in the microwave model (room temp is the floor) and log when violated, so future model edits surface the same class of bug immediately instead of producing convincing-looking wrong output. Not patched in this turn — flagging for awareness.

