# food-carbon-footprint-chart — Generation Status

**Date:** 2026-05-28
**Library:** Chart.js
**Status:** completed

## Instructional Design Check
- **Bloom Level:** L4 Analyze / L5 Evaluate
- **Bloom Verb:** analyze, evaluate
- **Pattern:** Horizontal grouped bar chart (sorted descending by CO2e) with two color-coded data series and a view-mode dropdown that re-normalizes the same data by mass, by protein, or by Calories. Clicking a bar reveals a 100% stacked horizontal bar of the five life-cycle emission stages.
- **Rationale:** The descending sort puts beef and lamb at the top so the order-of-magnitude gap between ruminants and plant foods is immediately legible. The view toggle is the analytical core — switching to "per 100 g protein" or "per 100 Calories" lets students discover that some foods (rice, vegetables) look efficient per kg but rise sharply per nutrient, while lentils stay efficient across all three views. The click-for-breakdown moves from "how much" to "why" by exposing the life-cycle stage (land-use change vs. farm vs. transport) responsible for each food's footprint.

## Implementation Summary
- Chart.js v4.4.1 horizontal bar chart, two datasets per food: CO2e (orange `#f57c00`) and Water (blue `#1e88e5`, scaled by /100 so both fit on one x-axis).
- 11 foods with CO2e and water values from the spec; protein and kcal lookups added for the per-protein and per-Calorie reweighting math.
- Native HTML `<select>` toggles three views; chart updates in-place via `chart.update()`.
- Tooltip callbacks show the true unit and original (un-scaled) water liters per the active view.
- `onClick` handler opens a yellow breakdown panel below the main chart with a 100% stacked horizontal bar of five emission stages (Land-use change, Farm practices, Processing, Transport, Retail), each stage with its own color and percentage in the legend. Close button dismisses it.
- Per-food breakdown shares chosen to be plausible: ruminants dominated by land-use + farm, plant foods dominated by farm + processing/transport.
- Palette uses book primary green `#2e7d32` for headings and accent orange `#f57c00` for the CO2e bars; light-green page background `#f1f8e9`.
- Sources footnote cites Poore & Nemecek (2018) and Mekonnen & Hoekstra (2012).
- All inline in `main.html`; CDN: `chart.js@4.4.1`.

## Files Modified
- `/Users/dan/Documents/ws/food-science/docs/sims/food-carbon-footprint-chart/main.html` (full inline Chart.js implementation)
- `/Users/dan/Documents/ws/food-science/docs/sims/food-carbon-footprint-chart/index.md` (status: completed, iframe height 880, scrolling=no)

## Layout Review

**Reviewer:** Claude Vision (Opus 4.7)
**Cycles:** 1 (clean pass)
**Screenshot:** `food-carbon-footprint-chart.png` (800 x 880)

### Checklist walk
- Title and subtitle: PASS — centered, primary-green title ("Carbon Footprint of Common Foods"), readable subtitle naming both units.
- Control row: PASS — "Compare by:" label, native dropdown defaulting to "per kg of food", and italic hint "Click any bar to see the emissions breakdown" all fit on one line inside the light-green band.
- Chart title: PASS — "Environmental cost per kg of food" in primary green above the chart.
- Bar chart: PASS — all 11 foods render with both bars visible (orange CO2e + blue water/100). Sort order descending by CO2e: Beef grass-fed → Beef feedlot → Lamb → Cheese → Chicken → Farmed salmon → Eggs → Rice → Tofu → Lentils → Vegetables. Beef-grass-fed bars (60 CO2e + 150 water) dominate visually, as intended. Vegetables bars (0.4 + 3) are tiny but still discernible.
- Y-axis labels: PASS — all 11 food names render fully, no clipping ("Vegetables (avg)" fits).
- X-axis: PASS — ticks 0–160 with axis label "CO₂e (kg) and water (×100 L)".
- Legend (HTML, below canvas): PASS — orange swatch labeled "CO₂e (kg per unit)" and blue swatch labeled "Water (×100 L per unit)" sit in a centered row above the source footnote.
- Source footnote: PASS — Poore & Nemecek and Mekonnen & Hoekstra cited, italic, fits inside card.
- Breakdown panel: PASS — hidden by default (correct initial state); click handler wired to chart.onClick.
- Iframe fit: PASS — content sits inside the 880-px iframe with light-green padding around the white card. Breakdown panel (~140 px when open) has room to expand without scroll.
- Contrast: PASS — all text contrast adequate on light-green and white backgrounds.

### Defects
- None.

### Edits applied
- None required after first capture.

### Final state
- Clean. No further patches needed. Sim ready for use in Chapter 12: Agricultural Systems and Sustainability.

