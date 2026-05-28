# gluten-network-formation — Generation Status

**Date:** 2026-05-28
**Library:** p5.js
**Status:** completed

## Instructional Design Check
- **Bloom Level:** L2 (Understand) + L4 (Analyze)
- **Verb:** Explain / Analyze
- **Pattern:** Parameter (flour protein %) x Action (kneading minutes) -> visual network density + quantitative bar feedback (Elasticity / Extensibility) + structural test (Windowpane).
- **Rationale:** The three flour cards give students a discrete parameter sweep (8%, 11%, 13% protein). The Knead button steps through hydration -> 5 kneading minutes, with each step changing both (a) the worm-alignment visualization (L2 Explain: "I can see the strands aligning") and (b) the bars (L4 Analyze: "Bread flour reaches higher elasticity faster"). The Windowpane Test provides a verification moment that closes the loop on the prediction.

## Implementation Summary
- Two-panel layout: left flour selector with three clickable cards; right circular dough cross-section (radius 140 px) with worm-style protein molecules.
- Stage progression: dry -> hydrated -> kneaded 1..5x. Each knead step rotates glutenin worms toward horizontal alignment, packs them into a layered y-grid, and increases bond reach/thickness.
- Glutenin rendered as blue wavy worms; gliadin as small yellow ovals; bonds rendered as semi-transparent blue lines beneath worms.
- At knead 4-5 with adequate protein, white gas bubbles appear and grow more opaque with protein content.
- Elasticity bar scales with `(protein/13) * knead_fraction`; Extensibility bar combines gliadin baseline + protein-modulated knead contribution.
- Windowpane Test renders a modal overlay with a stretching dough strip. Tears if `stretch > strength * 0.85 + 0.1` where `strength = (protein/13) * (0.3 + 0.7 * knead_fraction)`. Bread flour at 5 knead stretches to translucency; cake flour tears quickly.
- Responsive: `updateCanvasSize()` runs first in `setup()`; canvas re-sizes and buttons re-position on `windowResized`.
- Footgun avoided: alpha applied via `color()`+`setAlpha()`, never `fill(hexString, alpha)`. All drawing helpers wrapped in `push()/pop()`.

## Files Modified
- /Users/dan/Documents/ws/food-science/docs/sims/gluten-network-formation/main.html (replaced scaffold with p5.js loader)
- /Users/dan/Documents/ws/food-science/docs/sims/gluten-network-formation/gluten-network-formation.js (new)
- /Users/dan/Documents/ws/food-science/docs/sims/gluten-network-formation/index.md (status -> completed, iframe height 780)
- /Users/dan/Documents/ws/food-science/docs/sims/gluten-network-formation/metadata.json (bloomLevel L2-L4, completion_status completed)

## Layout Review

**Reviewer:** Claude Vision (Opus 4.7)
**Screenshot:** /Users/dan/Documents/ws/food-science/docs/sims/gluten-network-formation/gluten-network-formation.png
**Iframe height:** 780 px

### Cycle 1 - Defects (from first screenshot)
1. **Bars showed non-zero values in dry state.** Evidence: "Elasticity 21% / Extensibility 43%" with kneadCount=0 and stage=0 (dry flour). Misleading because dry flour has no active gluten network. Fix: `gluten-network-formation.js:drawBars()` now gates bars to 0 unless `stage >= 1` (water added).
2. **"Current Stage" badge pinned to panel bottom with large vertical gap.** Evidence: ~110 px of blank space between the third flour card and the badge in left panel. Fix: `gluten-network-formation.js:drawLeftPanel()` changed `badgeY = panelTopY + panelHeight - 110` to `badgeY = y + 8` so the badge sits flush under the cards.

### Cycle 2 - Verification screenshot
- All four buttons (Add Water, Knead 1 min, Windowpane Test, Reset) fully visible, no clipping at iframe height 780.
- Flour cards show selected state (gold border around All-Purpose).
- Dough cross-section centered with scattered blue glutenin worms + yellow gliadin ovals.
- Bars now show 0% / 0% in dry state, correctly communicating that no network exists yet.
- Stage description ("Dry flour: proteins scattered, inactive.") sits directly under the cards.
- Header, panels, dough, controls, and bars all within canvas; bottom margin clean.

### Final state
- No clipped controls, no overlapping elements, no draw-order bugs.
- Color palette adheres to book primary green / accent orange; glutenin blue and gliadin yellow per spec.
- Windowpane modal tested by code review: overlays full canvas, closes on click, animates stretch, tears or passes based on `(protein/13) * (0.3 + 0.7 * kneadFraction)`.
- Remaining limitation: Windowpane modal not screenshotted in static review (requires user click to trigger). Logic verified by reading code path.

