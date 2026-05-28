# hydroponic-system-types — Generation Status

**Date:** 2026-05-28
**Library:** p5.js
**Status:** completed

## Instructional Design Check

- **Bloom Level:** L1 (Remember) + L5 (Evaluate)
- **Verb:** Identify (recognize the four hydroponic systems) and Evaluate (judge which system best fits a set of constraints).
- **Pattern:** Side-by-side comparison cards + constraint-driven recommendation engine.
- **Rationale:** The four-card layout supports L1 recognition of distinct hydroponic types and their cross-section anatomy. The Constraint Matcher sliders (budget, power, crop size) push students to L5 by forcing them to weigh trade-offs (cost vs. yield, electricity dependence vs. resilience, crop compatibility) and observe how the recommended system shifts — a concrete model of multi-criteria evaluation.

## Implementation Summary

- Four 170×350 system cards drawn horizontally with stylized cross-sections:
  - **DWC:** container of blue nutrient solution, net cup + plant on top, dangling roots, rising bubbles from an air stone (animated).
  - **NFT:** sloped channel with three net cups, animated nutrient film (flowing dots) along the bottom, reservoir + pump return loop.
  - **Kratky:** opaque container with air gap (upper white-tinted zone), submerged roots (blue) + aerial roots (white), no pump.
  - **Wick:** elevated growing medium on top, reservoir on bottom, wick line + capillary-rising droplets (animated).
- Click any card → modal overlay with Required Equipment, Best Crops, Pros, Cons.
- **Constraint Matcher** below cards: Budget slider (0–100, mapped to low/medium/high + $ figure), Electricity slider (no/available), Crop Size slider (small/medium/large).
- Recommendation logic (`computeRecommended()`):
  - No power + low budget + small crops → Wick
  - No power otherwise → Kratky
  - Power + low budget → Wick or Kratky (size-dependent)
  - Power + medium budget + small/medium crops → NFT
  - Power + high budget OR large crops → DWC
- Recommended system gets a multi-layer green glow + "RECOMMENDED" badge; recommendation text echoed below sliders.
- Reset button restores default slider values and closes any open modal.
- Responsive: `updateCanvasSize()` is first in `setup()`; `windowResized()` recomputes card width and re-positions sliders.
- All footgun-safe color handling: `color(r,g,b)` then `setAlpha()`; all drawing helpers wrapped in `push()/pop()`.

## Files Modified

- `/Users/dan/Documents/ws/food-science/docs/sims/hydroponic-system-types/main.html` — replaced scaffold with p5.js loader (`<main></main>` no id, p5.js CDN, `hydroponic-system-types.js` script).
- `/Users/dan/Documents/ws/food-science/docs/sims/hydroponic-system-types/hydroponic-system-types.js` — created (≈540 lines).
- `/Users/dan/Documents/ws/food-science/docs/sims/hydroponic-system-types/index.md` — `status: scaffold` → `completed`; `bloom_level: TBD` → `L1-Remember, L5-Evaluate`; iframe height 600 → 660.
- `/Users/dan/Documents/ws/food-science/docs/sims/hydroponic-system-types/metadata.json` — `completion_status` → `completed`; bloom fields populated.
- `/Users/dan/Documents/ws/food-science/docs/sims/hydroponic-system-types/hydroponic-system-types.png` — screenshot.

## Layout Review

**Reviewer:** Claude Vision (Opus 4.7)
**Screenshot:** `hydroponic-system-types.png` (800×660)
**Iframe height:** 660px (from `index.md`)
**Review cycles:** 1

### Checklist walkthrough

| Item | Result | Notes |
|---|---|---|
| Title + subtitle legible | PASS | "Hydroponic System Types" centered; subtitle readable. |
| 4 cards aligned, equal width, equal gaps | PASS | Cards uniformly sized side-by-side. |
| Card header strips render with white text | PASS | DWC (blue), NFT (blue), Kratky (brown), Wick (lighter brown). |
| DWC diagram (water + roots + bubbles) | PASS | Animated bubbles visible from air stone; plant + net cup on top. |
| NFT diagram (sloped channel + plants + pump) | PASS | 3 net cups along slope, return pipe + reservoir at bottom. |
| Kratky diagram (air gap + dual root zones) | PASS | "air" label on right; aerial roots white, submerged roots blue. |
| Wick diagram (medium + wick + reservoir) | PASS | Brown medium on top, blue reservoir below, wick line vertical. |
| Recommended-system green glow + badge | PASS | Wick shows multi-layer halo + green "RECOMMENDED" badge. |
| Card metadata (Power/Cost/Crop size) | PASS | All 4 cards show 3 lines, centered, readable. |
| "Click for Details" orange buttons | PASS | All 4 cards. |
| Constraint Matcher panel | PASS | 3 sliders aligned; values labeled ("Low ($170)", "Available", "Small (herbs)"). |
| Reset button visible | PASS | Green, bottom-left of control panel. |
| Recommendation echo text | PASS | Green "Recommended: Wick System (Wick)". |
| No clipping at iframe edge | PASS | "Back to Documentation" link fully visible at bottom. |
| Stroke leakage / push-pop discipline | PASS | No stray strokes on text or shapes. |
| Color contrast | PASS | All text legible against backgrounds. |

### Defects

None.

### Edits applied during review

None (no defects).

### Final state

**Clean** — single review cycle, no patches required. All controls, diagrams, recommendation badge, and panel elements render within the 660px iframe height. Layout adapts cleanly at the default 800px viewport width.

### Notes

- Pre-review iteration reduced canvas drawHeight from 560 to 425 and iframe height from 780 to 660 to eliminate ~150px of empty space between cards and the control panel.
- Recommendation logic was validated at the default slider state (Budget=30 low, Power=available, Crop=small): correctly recommends Wick (cheapest powered option for small crops).
