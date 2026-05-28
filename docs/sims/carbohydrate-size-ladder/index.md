---
title: Carbohydrate Size Ladder — From Sugar to Starch
description: Students will *classify* carbohydrates by size category (Bloom L1 — Remember) and *explain* how monosaccharides link to form disaccharides and polysaccharides (Bloom L2 — Understand).
status: completed
library: p5.js
bloom_level: Understand
---

# Carbohydrate Size Ladder — From Sugar to Starch



<iframe src="main.html" width="100%" height="642" scrolling="no"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 2: "Chapter 2: The Molecules of Food"](../../chapters/02-molecules-of-food/index.md).

```text
Type: Interactive Infographic
**sim-id:** carbohydrate-size-ladder<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning Objective:** Students will *classify* carbohydrates by size category (Bloom L1 — Remember) and *explain* how monosaccharides link to form disaccharides and polysaccharides (Bloom L2 — Understand).

**Canvas size:** 720 × 500 px, responsive to window resize.

**Layout:**
- Three horizontal "rungs" on a visual ladder, top to bottom: Polysaccharides → Disaccharides → Monosaccharides.
- Each rung displays a stylized molecular diagram: monosaccharides as single colored hexagons (glucose = blue, fructose = orange, galactose = green), disaccharides as two linked hexagons with a small water droplet labeled "–H₂O" to illustrate the condensation reaction, polysaccharides as a chain of 8–10 blue hexagons fading off to the right to suggest a much longer chain.
- Food icons float to the right of each rung: grape and honey icon at the monosaccharide rung; milk carton and sugar bag at the disaccharide rung; bread loaf, broccoli, and oats at the polysaccharide rung.

**Interaction:**
- Clicking any hexagon on the monosaccharide rung shows a tooltip with name, formula, and food source.
- Clicking the "–H₂O" droplet on the disaccharide rung triggers an animation showing the water molecule being "removed" as the two hexagons click together, reinforcing the condensation mechanism.
- Clicking any food icon opens an info card describing which specific carbohydrate that food contains and how the body uses it.
- A toggle button "Show α/β bonds" adds color-coded arrows indicating α-linkages (digestible, green) vs. β-linkages (indigestible, red) on the polysaccharide chain, with a text label: "This tiny difference determines whether you can digest it!"

**Responsive design:** Scales to fill available width; ladder rungs stack cleanly on narrow screens.
```

## Related Resources

- [Chapter 2: "Chapter 2: The Molecules of Food"](../../chapters/02-molecules-of-food/index.md)
