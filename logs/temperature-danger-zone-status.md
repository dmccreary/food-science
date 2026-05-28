# temperature-danger-zone — Generation Status

**Date:** 2026-05-28
**Library:** p5.js
**Status:** completed

## Instructional Design Check
- **Bloom Level:** L1 (Remember) + L3 (Apply)
- **Verb:** Identify / Apply
- **Pattern:** Vertical thermometer with color-coded zones + scenario selector + slider + animated 2-hour rule timer
- **Rationale:** Students first identify the zone boundaries (40 deg F and 140 deg F) by reading the thermometer (L1). They then apply this knowledge by choosing a food, moving its temperature with the slider, and predicting whether it is in the danger zone, watching bacterial population double every 20 min for 2 hours (L3).

## Implementation Summary
- Vertical thermometer spans -20 to 250 F with 6 color-coded zones (frozen / fridge / DANGER / hot-hold / cooking / boiling).
- Pulsing red glow over the 40-140 F danger band (sin-driven alpha) reinforces salience.
- 6 food cards (chicken breast, deli meat, potato salad, leftover rice, fresh berries, cream soup) selectable by click. Each has a default sim temperature, store/hold targets, and a short safety note.
- Slider (-20 to 250, step 1) drives a colored indicator arrow + temperature badge on the thermometer. Arrow turns red in danger zone, green otherwise.
- Status panel shows the food name, current temp, SAFE/DANGER badge, safe-time message, store/hold targets, and a wrapped tip.
- 2-Hour Rule panel: Start/Pause/Resume button maps 120 seconds of real time to 120 simulated minutes. Population doubles every 20 sim min (1, 2, 4, 8, 16, 32, 64) shown as a numeric count and a row of red dots.
- Built-in p5 controls only: `createSlider`, `createButton` (Reset + Start Timer). No manual drawing of controls.
- `updateCanvasSize()` first line of `setup()`; `<main></main>` no id; `canvas.parent(document.querySelector('main'))`.
- Footgun avoided: alpha pulse uses `color()` + `setAlpha()`, never `fill(hexString, alpha)`. `drawTempBadge()` wrapped in `push()/pop()` to restore fill state.

## Files Modified
- `/Users/dan/Documents/ws/food-science/docs/sims/temperature-danger-zone/main.html` (replaced scaffold with p5.js loader)
- `/Users/dan/Documents/ws/food-science/docs/sims/temperature-danger-zone/temperature-danger-zone.js` (new)
- `/Users/dan/Documents/ws/food-science/docs/sims/temperature-danger-zone/index.md` (status -> completed, iframe height 820, bloom L1/L3)
- `/Users/dan/Documents/ws/food-science/docs/sims/temperature-danger-zone/metadata.json` (status + bloom updated)

## Layout Review

**Reviewer:** Claude Vision (Opus 4.7)
**Screenshot:** `docs/sims/temperature-danger-zone/temperature-danger-zone.png` (760 x 820)
**Cycles:** 1 (no patches needed)

### Cycle 1 - Initial capture
**Walkthrough of checklist:**
- *Clipped labels:* none. All zone boundary labels ("212 F Boiling", "165 F Safe cook", "140 F Hot-hold min", "40 F Fridge limit") fully visible to right of the thermometer.
- *Tick labels:* "-20 F" through "240 F" visible at left of thermometer in 20 F increments, no clipping.
- *Indicator badge:* "72 F" badge in red sits flush to the left of the thermometer column at the selected food's default temp, fully on canvas.
- *Right panel cards:* 6 food cards in 3x2 grid, selected card (Potato salad) clearly highlighted in primary green with white text. No truncation of names or "default X F" subtitles.
- *Status panel:* "Potato salad at 72 F" header, "! DANGER ZONE" red badge, "Safe for: up to 2 hours" message, store/hold targets, and wrapped tip text "Mayonnaise-based salads are a classic picnic risk. Keep on ice below 40 F." all readable inside the 130 px panel with margin to spare.
- *Two-hour timer:* progress bar with 0m-120m ticks spans full width, "Elapsed: 0 min" / "Bacterial cells: 1" labels visible, and one starter dot (red) visible to right of labels. When timer runs, dots fill row.
- *Bottom control bar:* "Temperature:" label, slider, "Start 2-Hour Timer" + "Reset" p5 buttons. No overlap, no clipping.
- *Pulsing danger glow:* visible as semi-transparent red halo around 40-140 F band on thermometer.
- *Z-order:* arrow indicator drawn after zones (visible). Bulb stroke drawn after fill (clean ellipse).
- *Library footguns:* alpha used via `color()+setAlpha()`, not `fill(hex,alpha)`. `drawTempBadge()` wrapped in `push()/pop()`.

**Defects found:** none requiring patches.

**Minor observations (no edit):**
- Iframe height 820 leaves a few px of bg below the "Back to Documentation" link; acceptable buffer that prevents bottom clipping on small viewports.
- Headless Chrome surfaces the p5 `describe()` text below the canvas; this is screen-reader text and hidden in normal browsers.

**Final state:** completed. Layout passes review on first cycle.

