# variables-identifier — Generation Status

**Date:** 2026-05-28
**Library:** p5.js
**Status:** completed

## Instructional Design Check

- **Bloom Level:** L2 — Understand
- **Verb:** Classify
- **Pattern:** Drag-classify (3 drop zones: IV / DV / CV)
- **Rationale:** Identifying which variable in a scenario is independent, dependent, or controlled requires students to interpret the experimental design and categorize each item — the canonical Bloom L2 "Understand → Classify" pattern. The drag-and-drop interaction makes the categorization decision explicit and provides immediate feedback (green snap + checkmark on correct, red shake + return on incorrect) so misconceptions are surfaced and corrected in real time. Three scenarios from the spec are cycled by a "Try a new scenario" button, providing repeated practice across different food-science contexts (cookies, hot cocoa, basil).

## Implementation Summary

- Replaced placeholder `main.html` with a thin p5.js loader (CDN p5 1.11.10, `<main></main>` no id, links `variables-identifier.js`).
- New `variables-identifier.js` implements the full sim:
  - Three drop zones across the top labeled "Independent Variable", "Dependent Variable", "Controlled Variables" with one-line hints ("What I change" / "What I measure" / "What I keep same").
  - White scenario description box showing scenario title + full text from the spec (used verbatim).
  - 6 draggable variable tiles laid out in a 3-column grid using the exact wording from the spec.
  - Drag with `mousePressed/Dragged/Released`; hit-test by tile center against zone rects.
  - Correct drop: tile becomes a green chip with checkmark inside the zone, zone flashes green, score increments.
  - Wrong drop: tile shakes and snaps back to home, both tile and zone flash red.
  - Score panel ("X of Y correct") in the title bar updates live.
  - "Try a new scenario" p5 built-in button (`createButton`) in the control panel cycles to next scenario.
  - Responsive: `updateCanvasSize()` is first line of `setup()`; `windowResized` rebuilds zones and re-lays-out unplaced tiles.
- Book palette applied: primary green `#2e7d32`, accent orange `#f57c00`, light bg `#f1f8e9`.

## Files Modified

- `/Users/dan/Documents/ws/food-science/docs/sims/variables-identifier/main.html` (rewritten as p5 loader)
- `/Users/dan/Documents/ws/food-science/docs/sims/variables-identifier/variables-identifier.js` (new, implementation)
- `/Users/dan/Documents/ws/food-science/docs/sims/variables-identifier/index.md` (status → completed, iframe height 760, scrolling=no, bloom_level Understand)
- `/Users/dan/Documents/ws/food-science/docs/sims/variables-identifier/metadata.json` (bloom + status updated)

## Layout Review

### Cycle 1 — Initial defects

Captured `variables-identifier.png` at default 800×600.

- **Defect 1 (critical):** Tile labels overflowed and were clipped on the right edge of the wider tiles. Quoted evidence from screenshot OCR: "flour amou…" and "type of ov…" appear cut off at the canvas right boundary; "oven temperature" rendered with the baseline pushed below tile centerline.
- **Defect 2 (cause):** `text(label, x, y, w, h)` was called with `textAlign(CENTER, CENTER)` but the 4-argument form treats `w/h` as a bounding box anchored at `(x, y)` with TOP alignment regardless of `textAlign`'s vertical setting. With a label wider than `w - 10`, p5 wrapped or clipped silently rather than shrinking.

### Cycle 1 — Edits

- `variables-identifier.js:drawTile` — replaced the bounding-box `text()` call with a fixed-point centered call plus an auto-shrink loop that decrements font size from 13 down to 9 until the label fits within `t.w - 14`. Labels now render centered both horizontally and vertically inside every tile, with no clipping.

### Cycle 2 — Final state

Recaptured at 800×760. All six tiles render with fully visible, centered labels at the default 13 px (none needed shrinking at this width). The three drop zones, scenario box, scoring panel (top-right "0 of 6 correct"), and the "Try a new scenario" button below the canvas are all visible without clipping. Title "Experimental Variables Identifier" is in the brand green. Palette matches the spec (`#2e7d32` / `#f57c00` / `#f1f8e9`). The bottom ~200 px of the canvas is empty whitespace acting as a drag landing buffer — kept intentionally so students with longer tile labels (Scenario 3's "nutrient solution concentration") have room to drag without the tile leaving the canvas.

**Remaining issues:** None blocking. Possible future polish: the wide tile-area whitespace could be trimmed by reducing `drawHeight` if scenarios are guaranteed to fit in two rows; left as-is for safety across all three scenarios.

### Review tooling

- Screenshot capture: `bk-capture-screenshot` (Chromium headless via local CLI).
- Layout review: Claude Vision (Opus 4.7).
- Cycles used: 2 of 3 allowed.

