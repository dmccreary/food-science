# data-graphing-lab — Generation Status

**Date:** 2026-05-28
**Library:** Chart.js v4.4.1 (UMD via jsDelivr CDN)
**Status:** completed

## Instructional Design Check

- **Bloom Level:** 3 (Apply)
- **Verb:** Construct, interpret
- **Pattern:** Data-driven exploration — student edits a table, chart updates in real time, student toggles between bar/line representations to compare which form best matches the data
- **Rationale:** Bloom L3 Apply is satisfied because the student is not just identifying parts of a graph (L1/L2). They actively construct a graph from raw values, choose the appropriate chart type for the data shape (bar = categorical recipes, line = time series), and customize axis labels — mirroring authentic lab-notebook work. The two preloaded datasets give a worked-example scaffold; the editable cells, add/remove-row buttons, and free-text axis labels let the student transfer the pattern to a new experiment of their own design.

## Implementation Summary

- Two-panel responsive grid: editable HTML `<table>` on the left, Chart.js canvas on the right; stacks vertically below 720 px.
- Live chart rebuild on any cell, header, title, axis-label, or unit edit (uses `input` event, destroys & recreates chart for clean type-switching).
- Bar/line toggle implemented as styled button pair (active-state highlight); type switch reconfigures `pointRadius`, `fill`, and `tension`.
- Two preloaded datasets — Dataset 1 = bread-dough rise (categorical → bar), Dataset 2 = sourdough starter 24 h (time series → line). Loading a dataset also restores its preferred chart type, title, axis labels, and unit.
- Tooltip callback emits `<value> <unit>` so hover always shows the cm unit.
- Add Row / Remove Row buttons let the student expand or shrink the table (lower bound: 1 row).
- Palette: primary `#2e7d32`, accent `#f57c00` on hover, light bg `#f1f8e9`.
- Skipped optional 30-second question overlay per task instructions.

## Files Modified

- `/Users/dan/Documents/ws/food-science/docs/sims/data-graphing-lab/main.html` (full rewrite)
- `/Users/dan/Documents/ws/food-science/docs/sims/data-graphing-lab/index.md` (status, iframe height 600→720, bloom_level)
- `/Users/dan/Documents/ws/food-science/docs/sims/data-graphing-lab/metadata.json` (status, bloom fields)

## Layout Review

**Reviewer:** Claude Vision (Opus 4.7)
**Method:** `bk-capture-screenshot` at 800 × 720 px (matches `index.md` iframe height of 720). Two screenshots taken — initial dataset 1 (bar) and dataset 2 (line) by temporarily swapping the bootstrap `loadDataset()` call.

### Cycle 1

**Bar view evidence:** Title "Data Graphing Lab" in green, subtitle, both dataset buttons fully visible with active-state on Dataset 1. Two-panel grid: left "DATA TABLE" with green header band, 4 editable rows (No yeast control 1.2 → 3 tsp yeast 11.8), Add Row / Remove Row buttons, and helper note all visible. Right "CHART" panel with Bar (active green) / Line toggle, four labeled text inputs (Chart Title, X-axis Label, Y-axis Label, Unit), and the rendered bar chart with title "Bread Dough Rise vs. Yeast Amount", green bars, Y-axis 0–12, X-axis labels "No yeast (control), 1 tsp yeast, 2 tsp yeast, 3 tsp yeast" rotated, axis labels rendered. Approximately 50 px of clean bottom padding inside the iframe.

**Line view evidence:** After loading Dataset 2, table grows to 7 rows (Hour 0–24, Height 3.0–10.4–3.8), Line button highlights green, title updates to "Sourdough Starter Rise Over 24 Hours", smooth line with 7 green points renders correctly, X axis shows hours 0–24, Y axis 0–12. No clipping.

**Defects found:** none.

### Final State

- No edits required during review.
- Iframe height 720 px in `index.md` confirmed adequate for both bar (4-row table) and line (7-row table) views.
- Hover tooltip behavior (`<value> <unit>`) wired via Chart.js `callbacks.label` but not screenshot-verified (hover state not capturable headless).

### Remaining Issues

- None.

