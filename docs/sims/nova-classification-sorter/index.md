---
title: NOVA Classification Interactive Explorer
description: Students will classify (L1 — Remember) foods into NOVA groups and analyze (L4 — Analyze) what characteristics distinguish Group 4 ultra-processed foods from Groups 1–3.
status: completed
library: p5.js
bloom_level: Analyze
---

# NOVA Classification Interactive Explorer



<iframe src="main.html" width="100%" height="740" scrolling="no"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 11: "Chapter 11: Food Technology and Industrial Processing"](../../chapters/11-food-technology-processing/index.md).

```text
Type: interactive-infographic
**sim-id:** nova-classification-sorter<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning Objective:** Students will classify (L1 — Remember) foods into NOVA groups and analyze (L4 — Analyze) what characteristics distinguish Group 4 ultra-processed foods from Groups 1–3.

**Canvas size:** 740 × 500 px, responsive.

**Layout:** Four colored columns (NOVA 1 = green, NOVA 2 = yellow-green, NOVA 3 = orange, NOVA 4 = red) with labels and short descriptions at the top. A pool of 20 food card icons at the bottom.

**Food cards include:** apple, white sugar, canned tomatoes, soda, raw chicken breast, butter, smoked salmon, instant noodles, plain oats, table salt, artisan cheese, breakfast cereal, fresh spinach, olive oil, processed cheese slices, plain yogurt, flavored chips, sourdough bread (homemade), packaged frozen pizza, honey.

**Drag-and-drop interaction:** Students drag each food card into the correct NOVA group column. Color flash feedback: green = correct, red = incorrect with explanation.

**"Inspect Ingredients" button on each card:** Reveals the ingredient list for that food, highlighting additives in red (Group 4 indicator), basic preserving agents in yellow (Group 3 indicator), and whole food components in green.

**Score tracker:** Shows X/20 correct, updating in real time.

**Responsive:** Redraws on window resize.
```

## Related Resources

- [Chapter 11: "Chapter 11: Food Technology and Industrial Processing"](../../chapters/11-food-technology-processing/index.md)
