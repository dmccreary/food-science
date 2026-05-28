---
title: Freezing Rate and Ice Crystal Size MicroSim
description: Students will explain (L2 — Understand) why faster freezing produces smaller ice crystals and evaluate (L5 — Evaluate) the tradeoff between freezing speed and food texture quality.
status: completed
library: p5.js
bloom_level: L2/L5
---

# Freezing Rate and Ice Crystal Size MicroSim



<iframe src="main.html" width="100%" height="680"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## How to Use

1. Click **Freeze Both** to start freezing both strawberry cells at the same time.
2. Watch the left panel (slow home freezer) grow a few large, jagged ice crystals that pierce the cell wall.
3. Watch the right panel (commercial blast freezer) grow many tiny crystals that leave the cell wall intact.
4. After freezing finishes, the cells thaw and a **drip-loss puddle** appears beneath each one.
5. Compare the **texture quality scores** at the bottom of each panel.
6. **Click any ice crystal** to see its simulated diameter in microns and an explanation.
7. Click **Reset** to return to the liquid state.

## Specification

The full specification below is extracted from
[Chapter 9: "Chapter 9: Food Preservation — Extending Shelf Life Through Science"](../../chapters/09-food-preservation/index.md).

```text
Type: microsim
**sim-id:** ice-crystal-freezing-sim<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning Objective:** Students will explain (L2 — Understand) why faster freezing produces smaller ice crystals and evaluate (L5 — Evaluate) the tradeoff between freezing speed and food texture quality.

**Canvas size:** 740 × 460 px, responsive.

**Layout:** Two side-by-side panels, each showing a cross-section of a strawberry cell (200 × 300 px).

**Freezing rate controls (top):**
- Left panel: Slider set to "Slow freeze (home freezer, 0°F)"
- Right panel: Slider set to "Fast freeze (commercial blast, −40°F)"
- Both panels animate simultaneously when "Freeze" button is clicked

**Animation:**
- Ice crystals nucleate and grow as temperature drops; slow freeze produces ~10 large crystals (200–300 px diameter) that pierce the cell wall in multiple places; fast freeze produces ~50 small crystals (20–40 px) that cause minimal cell wall damage
- Cell wall damage shown as red highlighted rupture points
- Water loss on thaw: slow freeze panel shows large "drip loss" puddle; fast freeze shows minimal drip

**Texture quality score bar:** Updates after freezing completes — slow freeze scores 45/100, fast freeze scores 88/100.

**Tooltip:** Clicking any ice crystal shows its simulated diameter in microns and explains why larger crystals cause more mechanical damage.

**Responsive:** Redraws on window resize.
```

## Related Resources

- [Chapter 9: "Chapter 9: Food Preservation — Extending Shelf Life Through Science"](../../chapters/09-food-preservation/index.md)
