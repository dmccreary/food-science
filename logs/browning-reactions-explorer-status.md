# browning-reactions-explorer — Generation Status

**Date:** 2026-05-28
**Library:** p5.js
**Status:** completed

## Instructional Design Check
- **Bloom Level:** 4 (Analyze)
- **Verb:** Distinguish / compare
- **Pattern:** Side-by-side parameter sweep — one shared independent variable (temperature) drives two parallel reaction columns so students can directly compare onset temperatures, reactants, color products, and aroma outputs.
- **Rationale:** L4 Analyze requires students to break a phenomenon (browning) into component parts and contrast two related-but-distinct mechanisms. Locking both columns to a single slider forces head-to-head comparison instead of toggling between two demos in isolation.

## Implementation Summary
- Two-column responsive layout (Maillard left in primary green, Caramelization right in accent orange).
- Pan + burner header for each column. Burner glow intensifies with temperature.
- Maillard column: pale steak < 280°F, browning sear marks 280–320°F, deep brown > 320°F. Amino-acid (blue "A") and sugar (yellow "S") molecules animate, then converge into a melanoidin cluster whose color deepens from tan to dark brown.
- Caramelization column: white sugar crystals stable < 320°F; at ≥ 320°F crystals "break" and a caramel pool appears that interpolates clear → golden → amber → dark brown across the 320–400°F range.
- Aroma popup bubbles spawn periodically when each reaction is active ("nutty", "savory", "bready" for Maillard; "butterscotch", "nutty", "slightly bitter", "toffee" for caramelization).
- Hover tooltips on melanoidin cluster (Maillard) and caramel pool (Caramelization) deliver the requested teaching strings.
- Shared 200°F–400°F slider with tick labels at 280° (Maillard onset) and 320° (caramelization onset).
- Summary box at the bottom contrasts "amino acids + sugars" vs. "sugars only" and the onset temperatures.
- Reset button restores 200°F and clears aroma popups.
- All color blending uses `lerpColor` and `color()+setAlpha()` (no `fill(hex, alpha)` footgun).
- p5.js DOM controls (`createSlider`, `createButton`) with `updateCanvasSize()` first in `setup()`, `<main></main>` with no id, `canvas.parent(document.querySelector('main'))`.

## Files Modified
- `/Users/dan/Documents/ws/food-science/docs/sims/browning-reactions-explorer/main.html` (replaced scaffold with p5.js loader)
- `/Users/dan/Documents/ws/food-science/docs/sims/browning-reactions-explorer/browning-reactions-explorer.js` (new)
- `/Users/dan/Documents/ws/food-science/docs/sims/browning-reactions-explorer/index.md` (status → completed, bloom → 4/Analyze, iframe height → 720)
- `/Users/dan/Documents/ws/food-science/docs/sims/browning-reactions-explorer/metadata.json` (status + bloom fields)

## Layout Review

**Reviewer:** Claude Vision (Opus 4.7)
**Method:** `bk-capture-screenshot` at 720px height; reviewed cool state (200°F) and hot state (370°F).

### Cycle 1 — defects (cool 200°F)
1. **Steak floating above pan.** Pink ellipse rendered at `topY - 6` so the center landed *above* the pan rim instead of resting on the cooking surface — broke the "food on pan" mental model.
2. **Sugar nearly invisible.** Original render drew tiny 6×6 white squares directly on the gray pan — read as scattered dust, not a sugar pile.
3. **Summary text clipped.** "starts ~280°F · hundreds of compounds" wrapped past the bottom edge of the 80px summary box.

### Cycle 1 — edits
- `browning-reactions-explorer.js:445` (`drawSteak`) — center steak at `topY + 14` (inside pan), added stroke outline and drop shadow for weight.
- `browning-reactions-explorer.js:475` (`drawSugarCrystals`) — drew a cream-colored mound base with darker outline + cube crystals on top of the mound, so the sugar reads as a pile even on the gray pan.
- `browning-reactions-explorer.js:15` — bumped `summaryH` from 80 → 100 and `drawHeight` from 580 → 600.

### Cycle 2 — defects (hot 370°F)
4. **Burner glow overflows pan area.** Halo ellipses (4 layers, growing by 12px each) extended into the molecule region below the pan, washing out the molecule cluster row.

### Cycle 2 — edits
- `browning-reactions-explorer.js:490` — reduced burner glow to 3 layers, narrower base (`panW - 10`) and shorter (`12 + i * 4`). Glow still intensifies with temperature but stays under the pan.

### Final state
All three brown-state milestones render correctly: pale steak / browning steak / deep brown melanoidin cluster on the Maillard side, and stable crystals / golden / amber / dark caramel pool on the Caramelization side. Status pills update at the 280°F and 320°F thresholds. Summary box reads cleanly. Slider tick labels mark the two onset temperatures. Iframe height 720 fits the 680px canvas + back-link with no clipping and minimal whitespace.

### Outstanding
- None blocking. Aroma popups are timing-dependent so they do not always appear in a single static screenshot — verified in motion by sliding the temperature live.

