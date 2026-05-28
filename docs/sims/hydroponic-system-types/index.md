---
title: Hydroponic System Types Comparison
description: Students will identify (L1 — Remember) the four main hydroponic system types and evaluate (L5 — Evaluate) which system best suits a given set of constraints (budget, space, power availability, crop type).
status: scaffold
library: p5.js
bloom_level: TBD
---

# Hydroponic System Types Comparison



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 15: "Chapter 15: Food Engineering, Hydroponics, and Innovation"](../../chapters/15-food-engineering-innovation/index.md).

```text
Type: interactive-infographic
**sim-id:** hydroponic-system-types<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning Objective:** Students will identify (L1 — Remember) the four main hydroponic system types and evaluate (L5 — Evaluate) which system best suits a given set of constraints (budget, space, power availability, crop type).

**Canvas size:** 740 × 480 px, responsive.

**Layout:** Four system cards displayed horizontally, each 170 × 350 px. Each card shows a cross-section diagram of the system with animated water flow (where applicable), labeled components, and a summary panel.

**DWC card:** Shows a container with plant roots submerged in blue solution, air bubbles rising from a stone at the bottom. Click reveals: required equipment (container, net cups, air pump, air stone, nutrient solution), best crops (lettuce, herbs, basil), pros (high yields, fast growth), cons (needs electricity, pump failure is catastrophic).

**NFT card:** Shows sloped PVC channels with a thin blue film flowing along the bottom of roots. Click reveals: required equipment (pump, channels, reservoir, timer), best crops (lettuce, strawberries, herbs), pros (highly water-efficient), cons (pump-dependent, roots dry out in power failure).

**Kratky card:** Shows container with air gap between solution surface and net cup; submerged roots in blue, aerial roots in white. Click reveals: required equipment (opaque container, net cups, nutrient solution — NO PUMP), best crops (leafy greens, herbs), pros (no electricity, very low cost, minimal maintenance), cons (not suitable for long-season or large crops, water not recirculated).

**Wick card:** Shows container with wick leading from reservoir to growing medium. Click reveals: required equipment (container, wick material, growing medium, nutrient solution), best crops (herbs, small lettuces), pros (zero moving parts, lowest cost), cons (slow delivery, limited to small crops).

**Constraint Matcher (below cards):** Three sliders — Budget (low/high), Power Available (yes/no), Crop Size (small/large). Adjusting sliders highlights the recommended system with a green glow.

**Responsive:** Redraws on window resize.
```

## Related Resources

- [Chapter 15: "Chapter 15: Food Engineering, Hydroponics, and Innovation"](../../chapters/15-food-engineering-innovation/index.md)
