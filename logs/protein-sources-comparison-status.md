# protein-sources-comparison — Generation Status

**Date:** 2026-05-28
**Library:** Chart.js
**Status:** completed

## Instructional Design Check
- **Bloom Level:** L4 Analyze / L5 Evaluate
- **Bloom Verb:** compare, evaluate
- **Pattern:** Multi-overlay radar chart with per-source toggles and a summary table beneath.
- **Rationale:** Radar overlays make multi-dimensional tradeoffs visually explicit; toggling pairs (e.g., beef vs. lentils) forces analysis of where one source dominates and where it loses. The summary table grounds the abstract 0–100 scores in real headline numbers (g protein, kg CO2e/kg), supporting evaluative judgement rather than rote viewing.

## Implementation Summary
- Chart.js v4 radar chart, 6 axes (Protein quality PDCAAS, Low environmental impact, Low water use, Low land use, Low cost/g protein, Consumer acceptance), all 0-100 with higher = better (environmental metrics already inverted in the data).
- 10 protein sources with assigned colors per spec; semi-transparent rgba fills (alpha 0.18) for overlap visibility.
- Native HTML checkboxes drive `dataset.hidden`; "Show all / Hide all / Reset" buttons.
- Default-on: Beef + Lentils only (clearest contrast for entry view).
- Tooltips show source, score/100, axis name, and the source-specific note.
- Summary table lists protein per 100g, GHG (kg CO2e/kg), and a 1-line note per source.
- Palette uses book primary green `#2e7d32` and accent orange `#f57c00`; light-green page background `#f1f8e9`.
- All inline in `main.html`; CDN: `chart.js@4.4.1`.

## Files Modified
- `/Users/dan/Documents/ws/food-science/docs/sims/protein-sources-comparison/main.html` (full inline Chart.js implementation)
- `/Users/dan/Documents/ws/food-science/docs/sims/protein-sources-comparison/index.md` (status: completed, iframe height 982, scrolling=no)

## Layout Review

**Reviewer:** Claude Vision (Opus 4.7)
**Cycles:** 1 (clean pass)
**Screenshot:** `protein-sources-comparison.png` (800 x 982)

### Checklist walk
- Title and subtitle: PASS — centered, readable, primary-green title.
- Button row (Show all / Hide all / Reset): PASS — no overlap, color-coded.
- Toggle row: PASS — 10 source checkboxes in 2 tidy rows; color swatches match dataset borders; "Conventional beef" and "Lentils" checked by default as designed.
- Radar chart: PASS — all 6 axis labels render fully ("Protein quality (PDCAAS)", "Low environmental impact", "Low water use", "Low land use", "Low cost / gram protein", "Consumer acceptance"). Tick marks (20/40/60/80/100) legible against the white tick backdrops. Beef (red) and lentils (green) overlays visually distinct, semi-transparent fills (alpha 0.18) do not obscure one another.
- Summary table: PASS — caption "Headline metrics per protein source" visible; green header row with white text; 10 data rows with color swatches; columns aligned; zebra striping reads cleanly.
- Footnote: PASS — italic, centered, fits inside iframe.
- Iframe fit: PASS — content ends with ~10-15 px of light-green bottom padding; no clipping at any edge.
- Contrast: PASS — sufficient on all text elements.

### Defects
- None.

### Edits applied
- None required after first capture.

### Final state
- Clean. No further patches needed.

