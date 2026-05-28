---
title: Interactive pH Food Scale
description: Students will *identify* the pH range of common foods (Bloom L1 — Remember) and *explain* the relationship between pH, taste, and food safety (Bloom L2 — Understand).
status: scaffold
library: p5.js
bloom_level: TBD
---

# Interactive pH Food Scale



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 2: "Chapter 2: The Molecules of Food"](../../chapters/02-molecules-of-food/index.md).

```text
Type: Interactive Infographic
**sim-id:** ph-food-scale<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning Objective:** Students will *identify* the pH range of common foods (Bloom L1 — Remember) and *explain* the relationship between pH, taste, and food safety (Bloom L2 — Understand).

**Canvas size:** 750 × 480 px, responsive to window resize.

**Layout:**
- Center: A large vertical pH gradient bar running from 0 (deep red, "Very Acidic") at the top to 14 (deep blue, "Very Basic") at the bottom, with 7 (green, "Neutral") at the midpoint.
- Along the gradient bar: 14 labeled food icons placed at their approximate pH values: Battery acid (0), Lemon juice (2.2), Vinegar (2.4), Cola (2.5), Orange juice (3.5), Tomato (4.2), Coffee (5.0), Rainwater (5.6), Milk (6.5), Pure water (7.0), Egg white (7.8), Baking soda solution (8.3), Antacid tablet (10.5), Bleach (12.5).
- Each food is represented by a small illustrated icon placed on the left or right side of the gradient bar.

**Interaction:**
- Hover or click on any food icon to open an infobox (tooltip card) showing: food name, exact pH value, one-sentence explanation of what makes it acidic/basic, and one real-world food science implication ("Below pH 4.6, most bacteria cannot survive — that is why pickles and vinegar dressings are shelf-stable").
- A draggable test slider on the right side of the bar: user can drag it to any pH position, and the background color of the whole canvas transitions smoothly across the gradient. A text label reads "This pH is found in: [list of food icons within ±0.3 pH units]".
- A "Danger Zone" overlay button: toggles a red shaded band from pH 4.6 to 9.0 labeled "Pathogen Growth Zone" with a skull icon that explains bacterial growth conditions.

**Responsive design:** On resize, the bar scales proportionally; icons redistribute to avoid overlap at small widths.
```

## Related Resources

- [Chapter 2: "Chapter 2: The Molecules of Food"](../../chapters/02-molecules-of-food/index.md)
