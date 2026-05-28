---
title: pH Scale Explorer
description: Students will be able to identify (Bloom L1 — Remember) where common foods fall on the pH scale and explain (Bloom L2 — Understand) the relationship between pH and flavor (sour = acidic, bitter = often basic).
status: completed
library: p5.js
bloom_level: Understand
---

# pH Scale Explorer



<iframe src="main.html" width="100%" height="622" scrolling="no"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 1: "Chapter 1: Science in the Kitchen"](../../chapters/01-science-in-the-kitchen/index.md).

```text
Type: MicroSim
**sim-id:** ph-scale-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective:** Students will be able to identify (Bloom L1 — Remember) where common foods fall on the pH scale and explain (Bloom L2 — Understand) the relationship between pH and flavor (sour = acidic, bitter = often basic).

**Canvas size:** 760 × 560 px, responsive.

**Layout:** A large horizontal pH gradient bar runs across the top third of the canvas, labeled 0–14. Color transitions from deep red on the left (acidic) through white/yellow in the middle (neutral, pH 7) to deep blue on the right (basic). Tick marks at each integer. Below the gradient bar, a row of food icons or labeled tiles represents 8–10 common foods (lemon, vinegar, milk, water, baking soda, egg white, orange juice, cola, black coffee, tomato).

**Interaction — drag food to scale:**
Students drag each food tile upward onto the scale. When released:
- If placed within 0.5 pH units of the correct value, the tile snaps to the correct position, turns green, and displays the actual pH in a tooltip.
- If placed more than 0.5 units away, the tile shakes and returns to the staging area with a brief "Try again" label.

**Click-to-learn on placed tiles:** After a food is correctly placed, clicking on it opens a pop-up showing:
- The food's name and pH
- A one-sentence explanation of what makes it acidic or basic
- A food science fact (e.g., "Lemon juice's citric acid is what makes baked goods 'wake up' when paired with baking soda.")

**Chemistry connection toggle:** A button labeled "Show H⁺ Concentration" switches the scale label from pH numbers to an approximate concentration in molar units (e.g., "10⁻² M" at pH 2). Clicking any point on the scale shows both the pH and H⁺ concentration, reinforcing the logarithmic relationship.

**Progress tracker:** Shows "X of 10 placed correctly."

**Color scheme:** Classic pH color spectrum (red → orange → yellow → green → blue → purple) with book-palette green/orange UI elements.
```

## Related Resources

- [Chapter 1: "Chapter 1: Science in the Kitchen"](../../chapters/01-science-in-the-kitchen/index.md)
