---
title: Protein Source Comparison — Environmental vs. Nutritional Tradeoffs
description: Students will compare (L4 — Analyze) protein sources across multiple dimensions and evaluate (L5 — Evaluate) which sources offer the best balance of nutrition, environmental impact, and feasibility.
status: completed
library: Chart.js
bloom_level: Analyze/Evaluate
---

# Protein Source Comparison — Environmental vs. Nutritional Tradeoffs



<iframe src="main.html" width="100%" height="982" scrolling="no" frameborder="0"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 14: "Chapter 14: Global Food Cultures and Food Futures"](../../chapters/14-global-food-cultures/index.md).

```text
Type: interactive-infographic
**sim-id:** protein-sources-comparison<br/>
**Library:** Chart.js<br/>
**Status:** Specified

**Learning Objective:** Students will compare (L4 — Analyze) protein sources across multiple dimensions and evaluate (L5 — Evaluate) which sources offer the best balance of nutrition, environmental impact, and feasibility.

**Canvas size:** 740 × 480 px, responsive.

**Layout:** A radar (spider) chart with six axes:
1. Protein quality (PDCAAS score — digestibility-corrected amino acid score; 0–100)
2. Environmental impact (inverted: 100 = lowest impact, 0 = highest)
3. Water use (inverted: 100 = least water, 0 = most water)
4. Land use (inverted)
5. Cost per gram of protein (inverted: 100 = cheapest, 0 = most expensive)
6. Consumer acceptance (survey-based; 0–100)

**Protein sources displayed (each as a separate overlay on the radar):**
- Conventional beef (red)
- Chicken (orange)
- Farmed salmon (blue)
- Eggs (yellow)
- Lentils (green)
- Tofu/soy (light green)
- Pea protein isolate (teal)
- Plant-based burger (purple)
- Cultured meat (gray — projected values)
- Insects/cricket flour (brown)

**Interaction:** Each source has a checkbox; checking/unchecking toggles its overlay on the radar. Hovering a data point shows the actual numerical value and its source citation.

**Summary table below chart:** Lists all sources with their protein score per serving and headline environmental metric.

**Responsive:** Redraws on window resize.
```

## Related Resources

- [Chapter 14: "Chapter 14: Global Food Cultures and Food Futures"](../../chapters/14-global-food-cultures/index.md)
