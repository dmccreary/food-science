---
title: Multisensory Flavor Perception Map
description: Students will analyze (L4 — Analyze) how multiple sensory inputs combine to create the unified experience of flavor, and evaluate (L5 — Evaluate) which senses contribute most to overall flavor perception.
status: completed
library: p5.js
bloom_level: L4-L5
---

# Multisensory Flavor Perception Map



<iframe src="main.html" width="100%" height="642"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 10: "Chapter 10: Sensory Science — Taste, Flavor, and Food Perception"](../../chapters/10-sensory-science/index.md).

```text
Type: microsim
**sim-id:** multisensory-flavor-builder<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning Objective:** Students will analyze (L4 — Analyze) how multiple sensory inputs combine to create the unified experience of flavor, and evaluate (L5 — Evaluate) which senses contribute most to overall flavor perception.

**Canvas size:** 740 × 460 px, responsive.

**Layout:** A brain silhouette in the center. Six sensory input channels radiate from the edges toward the brain — labeled: Taste (tongue), Orthonasal Smell (nose, inhale), Retronasal Smell (nose, from throat), Texture/Touch, Temperature, Vision.

**Food selector:** Eight food cards at the bottom: strawberry, coffee, potato chip, sushi, vanilla ice cream, hot sauce, aged Parmesan, sparkling water.

**Interaction:** Clicking a food card activates the sensory channels with color-coded intensity (green = low, yellow = medium, red = high):
- For vanilla ice cream: Taste = medium (sweet, slight cream), Retronasal Smell = very high (vanilla aroma compounds), Texture = high (creamy, cold), Temperature = high (cold), Vision = medium (white color cues expectations)
- For coffee: Orthonasal = very high (volatile aromatics), Retronasal = very high, Taste = medium (bitter), Temperature = high (hot), Texture = low

**Toggle buttons:** "Block Smell," "Block Taste," "Block Texture" — when clicked, they turn off the relevant channel and display a new "Perceived Flavor Intensity" score to show how much that channel contributes.

**Result text:** "With all senses: 95% flavor richness. Block smell: 25% flavor richness. Block taste: 70% flavor richness."

**Responsive:** Redraws on window resize.
```

## Related Resources

- [Chapter 10: "Chapter 10: Sensory Science — Taste, Flavor, and Food Perception"](../../chapters/10-sensory-science/index.md)
