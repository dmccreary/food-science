---
title: What Happens Inside a Loaf as It Bakes
description: Students will sequence (L1 — Remember) baking events and explain (L2 — Understand) the temperature-driven chemical and physical changes at each stage.
status: completed
library: p5.js
bloom_level: L1-L2
---

# What Happens Inside a Loaf as It Bakes



<iframe src="main.html" width="100%" height="640"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 5: "Chapter 5: Baking Science — Gluten, Leavening, and Bread"](../../chapters/05-baking-science/index.md).

```text
Type: microsim
**sim-id:** bread-baking-timeline<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning Objective:** Students will sequence (L1 — Remember) baking events and explain (L2 — Understand) the temperature-driven chemical and physical changes at each stage.

**Canvas size:** 760 × 460 px, responsive.

**Layout:** Left panel (200 px): cross-section of a bread loaf, color-coded by temperature gradient (blue center → orange/red outside). Right panel (560 px): dual animated graph — internal temperature vs. time AND loaf volume vs. time.

**Timeline events (annotated points on graph):**
- 0 min: "Dough enters oven. Surface: 75°F. Center: 75°F."
- 3 min: "Oven spring begins. Yeast activated. CO₂ expands. Volume rises 20%."
- 7 min: "Yeast die at 140°F. Surface reaches 250°F. Maillard begins."
- 10 min: "Gluten sets at 160°F. Starches gelatinize. Structure permanent. Volume stabilizes."
- 15 min: "Crust reaches 350°F. Deep Maillard browning and caramelization."
- 25 min: "Center reaches 205°F. Fully baked. Remove from oven."

**Tooltip:** Hovering any region of the loaf shows local temperature and what is happening chemically at that temperature.

**Responsive:** Redraws on window resize.
```

## Related Resources

- [Chapter 5: "Chapter 5: Baking Science — Gluten, Leavening, and Bread"](../../chapters/05-baking-science/index.md)
