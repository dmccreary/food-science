# nova-classification-sorter — Generation Status

**Date:** 2026-05-28
**Library:** p5.js
**Status:** completed

## Instructional Design Check
- **Bloom Level:** L4 (Analyze), also exercises L1 (Remember)
- **Verb:** classify / analyze
- **Pattern:** Drag-and-drop classification + inspection drill-down
- **Rationale:** The drag-to-column action tests L1 recall of NOVA group membership for 20 common foods. The "Inspect Ingredients" modal raises the task to L4 by exposing the ingredient signatures (whole/preserving/additive color tags) that distinguish NOVA 4 ultra-processed formulations from NOVA 1–3, supporting the analyze-the-difference learning objective.

## Implementation Summary
- 4 colored NOVA columns (#2e7d32, #9ccc65, #f57c00, #e53935) with label, title, and short description.
- 20 food cards arranged in a 2x10 pool grid below the columns.
- Drag any card into a column to classify; correct = green flash + lock, incorrect = red flash + explanation + snap back for retry.
- "Inspect Ingredients" button on every card opens a modal listing 1–6 ingredients with color-coded chips (green=whole, yellow=preserving, red=additive) plus a legend and an interpretation hint.
- Real-time score tracker `Score: X / 20  (Placed: N)` in the pool header.
- Reset button restores all cards. Responsive `windowResized` re-lays out the pool.
- p5 footgun-safe: uses `color()` + `.setAlpha()` for all transparent fills, every drawing helper is wrapped in `push()/pop()`.

## Files Modified
- `/Users/dan/Documents/ws/food-science/docs/sims/nova-classification-sorter/main.html` (scaffold replaced with p5 loader)
- `/Users/dan/Documents/ws/food-science/docs/sims/nova-classification-sorter/nova-classification-sorter.js` (new)
- `/Users/dan/Documents/ws/food-science/docs/sims/nova-classification-sorter/index.md` (status → completed, iframe height 740, bloom_level → Analyze)
- `/Users/dan/Documents/ws/food-science/docs/sims/nova-classification-sorter/metadata.json` (completion_status → completed, bloomLevel/Verb)

## Layout Review

**Reviewer:** Claude Vision (Opus 4.7)
**Cycles used:** 2 of 3

### Cycle 1 — Defects found
- "Cards laid out at 6 per row...clipped on left and right." Screenshot showed only 2 of 4 expected pool rows; outer cards bled past pool box and ran off canvas at both edges.
- Pool box was ~150 px taller than the populated rows, leaving a large dead zone above the Reset button.
- **Root cause:** the `perRow` constant was duplicated as a local variable in both `layoutCards()` (set to `5`) and `windowResized()` (still `10` from a stub I had written earlier). Headless Chrome fired `windowResized` after `setup`, so the stale `perRow=10` won and laid 10 cards across a 760 px canvas with `cardW=132` — total row width ≈ 1352 px → 596 px of overflow split across both edges.

### Cycle 1 — Edits
- `nova-classification-sorter.js:18` — added `let cardsPerRow = 5;` as a single module-level constant.
- `nova-classification-sorter.js:152, 187` — both `layoutCards()` and `windowResized()` now read `cardsPerRow` instead of redeclaring a local. Eliminates the desync.
- `nova-classification-sorter.js:3,16` — shrank `drawHeight` 680 → 650 and `poolHeight` 350 → 320 to remove the dead band under the cards.
- `index.md:13` — iframe height 770 → 740 to match new canvas total.

### Cycle 2 — Verification
- Screenshot now shows all 4 NOVA columns with their full descriptions, the complete 4-row x 5-column pool of 20 named cards (Apple … Frozen Pizza), color indicator dot and "Inspect Ingredients" button on every card, score tracker "Score: 0 / 20  (Placed: 0)" top-right of the pool header, and the Reset button below the canvas. No clipping at any edge; pool box hugs the card grid; iframe content fits at 740 px.

### Footgun called out (per global CLAUDE.md)
- **Pattern:** duplicated layout constants as function-local `let`s in two functions that must agree.
- **Silent:** no error — code runs and renders, just with the wrong layout.
- **Easy to trigger:** the natural way to "tweak the layout" is to grep + edit the constant where you see it; you miss the second copy.
- **Delayed/invisible damage:** the bug only manifests after `windowResized` fires, which is *after* the first paint, so a quick visual test of `setup()` alone wouldn't catch it.
- **Structural fix applied:** hoist the value to a single module-level constant (`cardsPerRow`) so both functions can only read one source of truth.

### Final state
- 0 outstanding layout defects.
- Iframe height in `index.md` matches actual canvas height (740 px ≈ 650 draw + 50 control + ~40 body padding/back-link).

