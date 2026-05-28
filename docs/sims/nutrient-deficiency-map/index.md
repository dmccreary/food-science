---
title: Nutrient Deficiency Explorer
description: Students will identify (L1 — Remember) the deficiency disease associated with each key micronutrient and recall (L1) the primary food sources that prevent deficiency.
status: completed
library: p5.js
bloom_level: L1
---

# Nutrient Deficiency Explorer



<iframe src="main.html" width="100%" height="760"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 8: "Chapter 8: Nutrition Science — What Food Does for Your Body"](../../chapters/08-nutrition-science/index.md).

```text
Type: interactive-infographic
**sim-id:** nutrient-deficiency-map<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning Objective:** Students will identify (L1 — Remember) the deficiency disease associated with each key micronutrient and recall (L1) the primary food sources that prevent deficiency.

**Canvas size:** 740 × 460 px, responsive.

**Layout:** A human body silhouette on the left (300 px wide). A grid of 8 nutrient cards on the right (each 100 × 80 px): Vitamin A, Vitamin C, Vitamin D, Iron, Iodine, Calcium, Folate, Vitamin B12.

**Interaction:**
- Clicking a nutrient card highlights the body regions most affected by deficiency (e.g., clicking "Iron" highlights blood/bone marrow, brain, and muscles in red)
- A popup appears showing: deficiency disease name, key symptoms, primary food sources (with small food icons), and the population most at risk
- A "Fortified Foods" tab shows how specific nutrients have been added to common foods (e.g., Vitamin D → milk carton; Iodine → salt shaker; Folate → bread loaf)

**Color coding:** Red = critical shortage area in body; yellow = mild risk; green = adequate.

**Responsive:** Redraws on window resize.
```

## Related Resources

- [Chapter 8: "Chapter 8: Nutrition Science — What Food Does for Your Body"](../../chapters/08-nutrition-science/index.md)
