# bacterial-growth-curve — Generation Status

**Date:** 2026-05-28
**Library:** p5.js
**Status:** completed

## Instructional Design Check

- **Bloom Level:** L1 (Remember) + L3 (Apply)
- **Bloom Verb:** identify (the 4 phases), apply (parameter changes to predict curve)
- **Pattern:** parameter sliders + animated real-time curve + hover tooltips with phase labels
- **Rationale:** L1 is satisfied by the persistently-labeled colored phase bands (Lag/Log/Stationary/Death) that students must visually map onto the growing curve. L3 is satisfied by the three sliders/selector that let students change temperature, nutrients, and species and immediately observe how those choices reshape the curve and the population reached at 24 h. The Start/Pause flow forces a "predict-then-observe" rhythm rather than letting the curve auto-run on page load, which keeps cognitive focus on the parameter→outcome mapping that L3 requires.

## Implementation Summary

- Piecewise growth model: lag → exponential log-phase → stationary plateau → death decay, all in log10 cells/mL space (0 → 9).
- Temperature shapes a bell-style multiplier (peak 70–110°F), with a Listeria-only cold-tolerance bump at 32–50°F, and a hard "lethal heat / frozen" branch above 165°F or below 32°F that bypasses growth and produces a rapid death curve.
- Nutrient slider scales both max population and lag length; species selector adjusts base rate (Salmonella fast, Listeria mid, Lactobacillus slow).
- Phase bands are recomputed every frame from the current parameter set, so the colored regions slide as students change inputs — students see the phase boundaries respond to temperature/nutrient choices even before pressing Start.
- Hover tooltip shows time, current phase, modeled population (formatted as "X thousand / million / billion"), and a one-sentence phase description.
- Temperature badge in the controls panel labels the regime (FROZEN / FRIDGE / DANGER ZONE / HOT / LETHAL HEAT) for immediate L1 reinforcement.
- Footgun avoided: all band fills use `fill(r, g, b, a)` 4-arg form — never `fill('#hex', alpha)` which throws in p5.
- Default state is paused (MicroSim convention); Start button transitions Start → Pause → Resume → Restart as the run progresses.

## Files Modified

- `/Users/dan/Documents/ws/food-science/docs/sims/bacterial-growth-curve/bacterial-growth-curve.js` (created)
- `/Users/dan/Documents/ws/food-science/docs/sims/bacterial-growth-curve/main.html` (scaffold → p5 loader)
- `/Users/dan/Documents/ws/food-science/docs/sims/bacterial-growth-curve/index.md` (status: scaffold → completed; iframe height 600 → 522; bloom_level set; scrolling="no")

## Layout Review

**Reviewer:** Claude Vision (Opus 4.7)
**Screenshot:** `docs/sims/bacterial-growth-curve/bacterial-growth-curve.png` (800 × 522)
**Iframe height:** 522 (matches `index.md`)

### Cycle 1 — initial capture

FAILS:

- **1.1 / 2.4 DANGER ZONE badge clipped on right edge of controls panel.** Evidence: badge reads "DANGER ZON" with the trailing "E" cut off by the panel border. Root cause: badge width hard-coded to 70px and label "DANGER ZONE" (with bold weight) measured wider than 70px at 10pt.
- **1.4 Invisible row labels ("Nutrients: 70%" and "Species") on white panel background.** Evidence: gap between temperature slider and nutrient slider showed no label text; same gap between nutrient slider and the dropdown. Root cause (footgun): `drawTempBadge()` ends with `fill('#ffffff')` to write the white badge text and never restores the dark text fill before returning. The next two label `text()` calls therefore render in white on the white panel — silent, easy to trigger from the documented happy path of "call helper then keep drawing", invisible damage (text was being drawn correctly, just not visible). Classic footgun pattern of mutating shared state inside a callback the caller doesn't expect to mutate.

Edits applied:

- `bacterial-growth-curve.js:225-245` — `drawTempBadge()` now measures `textWidth(label)+12` and positions itself flush right of the panel, so longer labels ("LETHAL HEAT") don't overflow. Also shortened labels: "DANGER ZONE" → "DANGER", "LETHAL HEAT" → "LETHAL" to reduce visual noise.
- `bacterial-growth-curve.js:285-295` — added explicit `fill(COLOR_TEXT_DARK); noStroke();` after the `drawTempBadge()` call to restore the canonical text drawing state. Inline comment added flagging the footgun for future maintenance.
- `bacterial-growth-curve.js:97-105` + `bacterial-growth-curve.js:275-280` — extracted `CTRL_LABEL_GAP`, `CTRL_ROW_GAP`, `CTRL_START_Y_OFFSET` as shared constants so the build-controls and draw-labels code can't drift apart. Bumped `CTRL_ROW_GAP` from 38 → 48 to give labels more breathing room above slider tracks.

### Cycle 2 — after badge + ctrl-row fixes

Re-capture confirmed badge fix; still no visible "Nutrients" / "Species" labels — diagnosed white-on-white footgun above.

### Cycle 3 — after fill-restore fix

All checklist items PASS:

- 1.1–1.5 text legibility — no clipping, no halos, contrast strong.
- 2.1–2.7 controls — sliders, dropdown, and two buttons all sit cleanly inside the panel; labels visible above each control.
- 3.1–3.6 drawing region — title centered in green header, phase bands (Lag / Log / Stationary / Death) labeled and colored per spec, log10 grid and tick labels (10^0 … 10^9) all visible.
- 4.1–4.4 color & hierarchy — green title and Start button anchor the visual identity; orange Reset button and accent species dot complement; phase-band palette matches spec exactly.
- 5.x N/A — no Mermaid / vis-network / Chart.js / Leaflet elements in this p5.js sim.
- 6.1–6.3 sanity — renders cleanly, no error overlay, 522px screenshot matches declared iframe height.

**Final state:** clean. Zero unresolved defects.

### Footgun called out

`fill('#hex', alpha)` is documented as throwing in p5 — but the parallel footgun is the one that bit this sim: **a helper function that leaves the global `fill()` state mutated to white before returning, causing the caller's next `text()` to render invisibly on a white panel.** Silent (no error), easy to trigger (helper called from the documented happy path), invisible damage (text *is* drawn — just not visible). Structural fix used: helper now restores caller's state, and an inline footgun comment marks the rule. A more durable fix would be `push()`/`pop()` around any helper that touches drawing state, which I'd recommend as a project-wide convention if this pattern recurs.

