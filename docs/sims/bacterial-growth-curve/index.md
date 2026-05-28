---
title: Bacterial Growth Curve Simulation
description: Students will identify (L1 — Remember) the four phases of bacterial growth and apply (L3 — Apply) knowledge by adjusting temperature and nutrients to predict growth rate changes.
status: scaffold
library: p5.js
bloom_level: TBD
---

# Bacterial Growth Curve Simulation



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 4: "Chapter 4: Food Microbiology — Microbes, Fermentation, and Cultured Foods"](../../chapters/04-food-microbiology/index.md).

```text
Type: microsim
**sim-id:** bacterial-growth-curve<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning Objective:** Students will identify (L1 — Remember) the four phases of bacterial growth and apply (L3 — Apply) knowledge by adjusting temperature and nutrients to predict growth rate changes.

**Canvas size:** 760 × 480 px, responsive.

**Controls (left panel, 200 px wide):**
- Temperature slider: 32°F – 120°F
- Nutrient slider: 0%–100%
- "Start Simulation" button
- Species selector: Salmonella (fast grower), Listeria (cold-tolerant), Lactobacillus (slower, beneficial)

**Graph panel (right, 560 px wide):**
- X-axis: Time (0–24 hours)
- Y-axis: log₁₀(population), 1 to 1,000,000,000
- Animated curve plotted in real time
- Four phases labeled with colored background bands: Lag (gray), Log (orange), Stationary (yellow), Death (blue)

**Behavior:**
- Danger zone temperatures (40°F–140°F): log phase steepens dramatically
- Refrigerator temp (38°F): growth is slow but still occurs
- Above 165°F or below 32°F: rapid death phase
- Tooltips on hover show simulated population count and phase description

**Responsive:** Redraws on window resize.
```

## Related Resources

- [Chapter 4: "Chapter 4: Food Microbiology — Microbes, Fermentation, and Cultured Foods"](../../chapters/04-food-microbiology/index.md)
