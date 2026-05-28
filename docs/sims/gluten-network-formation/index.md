---
title: Gluten Network Development
description: Students will explain (L2 — Understand) how mixing and kneading develop the gluten network, and analyze (L4 — Analyze) how protein content affects gluten strength.
status: completed
library: p5.js
bloom_level: L2-L4
---

# Gluten Network Development



<iframe src="main.html" width="100%" height="780"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 5: "Chapter 5: Baking Science — Gluten, Leavening, and Bread"](../../chapters/05-baking-science/index.md).

```text
Type: microsim
**sim-id:** gluten-network-formation<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning Objective:** Students will explain (L2 — Understand) how mixing and kneading develop the gluten network, and analyze (L4 — Analyze) how protein content affects gluten strength.

**Canvas size:** 740 × 440 px, responsive.

**Layout:** Two panels side by side.

**Left panel — Flour Protein Selector:**
- Three flour cards: Cake Flour (8%), All-Purpose (11%), Bread Flour (13%)
- Clicking a card sets the protein content for the simulation

**Right panel — Gluten Network Visualizer:**
- Shows a circular dough ball cross-section (400 px diameter)
- A "Knead" button — each click adds one minute of kneading
- Protein molecules shown as small worm-like objects (blue = glutenin, yellow = gliadin)
- Dry: scattered randomly; After water: molecules hydrate; After kneading: progressively stronger aligned network
- After kneading 5×: organized sheet-like network with trapped gas bubbles
- Windowpane test button: simulates stretching; low protein = tears quickly, high protein = stretches to translucency

**Bars:** "Elasticity" and "Extensibility" bars update in real time as kneading progresses.

**Responsive:** Redraws on window resize.
```

## Related Resources

- [Chapter 5: "Chapter 5: Baking Science — Gluten, Leavening, and Bread"](../../chapters/05-baking-science/index.md)
