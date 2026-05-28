# heat-transfer-cooking-explorer — Generation Status

**Date:** 2026-05-28
**Library:** p5.js
**Status:** completed

## Instructional Design Check
- **Bloom Level:** L1 (Remember) + L2 (Understand)
- **Verb:** Identify, Explain
- **Pattern:** Interactive infographic with three labeled panels + scenario selector + click-to-learn tooltips
- **Rationale:** Continuous gentle animation IS the explanation — vibrating molecules show conduction, circulating particles show convection loop, wavy lines show infrared radiation. The scenario dropdown drives L1 identification (which panel highlights gold?) while the explanation box + tooltips drive L2 understanding (why does this scenario use these modes?).

## Implementation Summary
- Three 240px-wide panels: Conduction (vibrating molecules on a pan over a burner), Convection (rectangular fluid loop with orange/blue particles in a pot), Radiation (red glowing coil emitting wavy IR lines down onto food).
- Top dropdown lists five cooking scenarios + a default "Select..." option. Choosing one highlights matching panels with a 5px gold outline, paints the title bar green, adds an "ACTIVE" badge, and updates the bottom explanation box with mode chips.
- Three tooltip zones (molecule hit-test in conduction, panel-body hit-test in convection and radiation) reveal the spec's tooltip strings.
- p5.js builtins: `createSelect`, `createButton` (Reset). `updateCanvasSize()` runs first in `setup()`. `<main></main>` with no id; canvas parented via `document.querySelector('main')`.
- Color palette uses primary green `#2e7d32` for active title bars, gold `#fbc02d` for selection outline, accent orange `#f57c00` for heat, cool blue `#1e88e5` for cool currents, red `#e53935` for IR waves, light bg `#f1f8e9`.
- Footgun avoided: any alpha use goes through `color()` + `setAlpha()` (no `fill(hexString, alpha)`).

## Files Modified
- `/Users/dan/Documents/ws/food-science/docs/sims/heat-transfer-cooking-explorer/main.html` (rewrote scaffold to p5.js loader)
- `/Users/dan/Documents/ws/food-science/docs/sims/heat-transfer-cooking-explorer/heat-transfer-cooking-explorer.js` (new)
- `/Users/dan/Documents/ws/food-science/docs/sims/heat-transfer-cooking-explorer/index.md` (status scaffold→completed; iframe height 600→640)
- `/Users/dan/Documents/ws/food-science/docs/sims/heat-transfer-cooking-explorer/metadata.json` (bloomLevel/Verb, completion_status)

## Layout Review

**Reviewer:** Claude Vision (Opus 4.7)
**Screenshot:** `heat-transfer-cooking-explorer.png` (800x640, default "Select a scenario..." state)
**Cycles:** 3 (max)

### Cycle 1 — defects
1. **Conduction molecules overflowed pan rect.** Lattice extended below the gray pan into the burner glow region. Evidence: dark dots visible on top of orange burner halo. Cause: `panBottom = py + ph - 50` ≈ y+270, but pan rect bottom was y+225.
2. **Convection water gradient too saturated** — interior of pot showed pink/purple band rather than a cool→warm read.

### Cycle 1 edits
- `heat-transfer-cooking-explorer.js:331-335` — clamped lattice to actual pan rect (panTop=py+155, panBottom=py+218, panLeft/Right inset 25px).
- `heat-transfer-cooking-explorer.js:265-273` — replaced 3-stop pink/blue gradient with clean cool-blue-top → warm-peach-bottom lerp at full alpha.

### Cycle 2 — defects
3. **Heat gradient direction inverted.** Top row of molecules rendered red (hot), bottom row blue (cool). But the burner is BELOW the pan, so bottom should be hottest. Evidence: red dots at top, dark blue dots at bottom in cycle-2 screenshot. Cause: `heat = 1 - (r/(rows-1))*0.55` with r=0 being top row.

### Cycle 2 edits
- `heat-transfer-cooking-explorer.js:343` — flipped formula to `heat = 0.45 + (r/(rows-1))*0.55` so bottom row (r=rows-1) gets heat=1.

### Cycle 3 — final state
- Conduction: bottom-row molecules bright red, top-row cool purple. Physically correct gradient. Upward heat arrows match flow.
- Convection: pot has clean blue-top → warm-bottom water tint, orange particles ascending left, blue descending right, loop arrows visible.
- Radiation: red coil at top with halo, three vertical wavy IR lines with arrowheads pointing at orange chicken/drumstick.
- Explanation box: default placeholder text shown; will update with mode chips on scenario change.
- Controls: dropdown + Reset button cleanly aligned in green control band below canvas.
- Iframe height 640 fits all content; "Back to Documentation" link visible below with no scroll required.

### Remaining issues
- None blocking. Minor: scenario selector lives in the HTML controls band rather than at the top of the canvas as the spec literally says ("scenario selector at the top"). Decision: keeping it in the controls band matches p5.js builtin-controls convention used by other sims in this book (`ph-scale-explorer`, etc.) and the helper text "Choose a cooking scenario below" makes the relationship explicit. Functional behavior matches spec.

