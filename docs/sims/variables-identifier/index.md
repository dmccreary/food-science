---
title: Experimental Variables Identifier
description: Students will be able to identify (Bloom L1 — Remember) and classify (Bloom L2 — Understand) independent, dependent, and controlled variables in a described food science experiment.
status: completed
library: p5.js
bloom_level: Understand
---

# Experimental Variables Identifier



<iframe src="main.html" width="100%" height="760" scrolling="no"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 1: "Chapter 1: Science in the Kitchen"](../../chapters/01-science-in-the-kitchen/index.md).

```text
Type: MicroSim
**sim-id:** variables-identifier<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective:** Students will be able to identify (Bloom L1 — Remember) and classify (Bloom L2 — Understand) independent, dependent, and controlled variables in a described food science experiment.

**Canvas size:** 760 × 480 px, responsive.

**Layout:** Three zones across the top of the canvas, labeled "Independent Variable," "Dependent Variable," and "Controlled Variables." Below the zones, a description box displays a food science experiment scenario. Below the description, a list of labeled tiles (text boxes) shows 5–7 variable names from the scenario.

**Interaction:** The student drags each tile into the correct zone. When a tile is dropped in the correct zone, it turns green and a brief checkmark animation plays. When dropped in the wrong zone, it shakes and returns to its original position with a soft red flash.

**Scenarios (randomly cycle through at least 3):**
1. "A student bakes three batches of cookies, each at a different oven temperature (300°F, 325°F, 350°F). All other recipe ingredients are the same. After baking, the student measures the diameter of ten cookies from each batch and records the average." Variables: oven temperature (IV), cookie diameter (DV), flour amount, butter amount, baking time, type of oven (CVs).
2. "A student makes three cups of hot cocoa with different amounts of sugar (0g, 10g, 20g). All other ingredients are the same. Five classmates taste each cup and rate the sweetness from 1–5." Variables: grams of sugar (IV), sweetness rating (DV), amount of cocoa powder, milk volume, milk temperature, cup size (CVs).
3. "A student grows basil plants under three different light colors (white, blue, red) using identical LED strips. Plants receive the same amount of water and nutrient solution. After 3 weeks, the student measures the height and leaf count of each plant." Variables: light color (IV), plant height + leaf count (DV), water amount, nutrient solution concentration, pot size, room temperature (CVs).

**Scoring panel:** Shows "X of Y correct" after each tile placement attempt. A "Try a new scenario" button randomizes to the next scenario.

**Color scheme:** Consistent with book palette — green for correct, red-tinted for incorrect.
```

## Related Resources

- [Chapter 1: "Chapter 1: Science in the Kitchen"](../../chapters/01-science-in-the-kitchen/index.md)
