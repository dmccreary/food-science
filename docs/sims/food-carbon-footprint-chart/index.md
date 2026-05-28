---
title: Carbon Footprint of Common Foods
description: Students will analyze (L4 — Analyze) the relative carbon footprints of different foods and evaluate (L5 — Evaluate) which food choices have the greatest environmental impact.
status: completed
library: Chart.js
bloom_level: L4/L5 Analyze/Evaluate
---

# Carbon Footprint of Common Foods



<iframe src="main.html" width="100%" height="880" scrolling="no" style="border:none;"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 12: "Chapter 12: Agricultural Systems and Sustainability"](../../chapters/12-agricultural-systems/index.md).

```text
Type: interactive-infographic
**sim-id:** food-carbon-footprint-chart<br/>
**Library:** Chart.js<br/>
**Status:** Specified

**Learning Objective:** Students will analyze (L4 — Analyze) the relative carbon footprints of different foods and evaluate (L5 — Evaluate) which food choices have the greatest environmental impact.

**Canvas size:** 720 × 480 px, responsive.

**Chart type:** Horizontal grouped bar chart with two bars per food: (1) kg CO₂-equivalent per kg of food, (2) liters of water per kg of food.

**Foods listed (approximate values, organized by food type):**
- Beef (grass-fed): 60 kg CO₂e/kg; 15,000 L/kg water
- Beef (feedlot): 27 kg CO₂e/kg; 15,400 L/kg water
- Lamb: 24 kg CO₂e/kg; 10,400 L/kg water
- Cheese: 13 kg CO₂e/kg; 5,000 L/kg water
- Chicken: 6 kg CO₂e/kg; 4,300 L/kg water
- Eggs: 4.5 kg CO₂e/kg; 3,300 L/kg water
- Farmed salmon: 6 kg CO₂e/kg; 2,500 L/kg water
- Rice: 3.5 kg CO₂e/kg; 1,670 L/kg water
- Tofu: 2 kg CO₂e/kg; 2,200 L/kg water
- Lentils: 0.9 kg CO₂e/kg; 1,250 L/kg water
- Vegetables (avg): 0.4 kg CO₂e/kg; 300 L/kg water

**Toggle:** A dropdown allows switching between "per kg of food," "per 100g protein," and "per 100 Calories" views.

**Clicking a bar:** Opens a breakdown popup showing the proportion of emissions from land use change, farm practices, processing, transportation, and retail for that food.

**Responsive:** Redraws on window resize.
```

## Related Resources

- [Chapter 12: "Chapter 12: Agricultural Systems and Sustainability"](../../chapters/12-agricultural-systems/index.md)
