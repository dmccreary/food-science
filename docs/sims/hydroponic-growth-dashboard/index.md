---
title: Hydroponic Project Data Dashboard
description: Students will apply (L3 — Apply) data collection and graphing skills to track hydroponic plant growth and analyze (L4 — Analyze) the relationship between nutrient solution parameters and plant growth rate.
status: scaffold
library: Chart.js
bloom_level: TBD
---

# Hydroponic Project Data Dashboard



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 15: "Chapter 15: Food Engineering, Hydroponics, and Innovation"](../../chapters/15-food-engineering-innovation/index.md).

```text
Type: microsim
**sim-id:** hydroponic-growth-dashboard<br/>
**Library:** Chart.js<br/>
**Status:** Specified

**Learning Objective:** Students will apply (L3 — Apply) data collection and graphing skills to track hydroponic plant growth and analyze (L4 — Analyze) the relationship between nutrient solution parameters and plant growth rate.

**Canvas size:** 760 × 500 px, responsive.

**Layout:** A data entry form on the left (250 px) and a multi-line graph panel on the right (510 px).

**Data entry fields (updated weekly for each plant):**
- Week number (1–8)
- Plant height (cm)
- Leaf count
- pH reading
- EC reading (mS/cm)
- Qualitative observation (dropdown: healthy / slight yellowing / wilting / excellent)

**"Add Data Point" button:** Adds the entry to all relevant graphs.

**Graph panel — four linked charts (tabbed):**
Tab 1: Plant height over time (line graph, y-axis cm, x-axis week)
Tab 2: pH over time with target range shaded (5.5–6.5 green zone; outside = yellow warning)
Tab 3: EC over time with target range shaded
Tab 4: Growth rate (cm/week) vs. pH reading — scatter plot; students identify whether there is a correlation between pH staying in range and faster growth

**Export button:** Downloads the entered data as a CSV file for further analysis in a spreadsheet.

**Responsive:** Redraws on window resize.
```

## Related Resources

- [Chapter 15: "Chapter 15: Food Engineering, Hydroponics, and Innovation"](../../chapters/15-food-engineering-innovation/index.md)
