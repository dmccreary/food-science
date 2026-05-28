---
title: Water as Universal Solvent — Interactive Explorer
description: Students will *classify* common food substances as polar, ionic, or nonpolar (Bloom L1 — Remember) and *explain* why each does or does not dissolve in water (Bloom L2 — Understand).
status: completed
library: p5.js
bloom_level: Understand
---

# Water as Universal Solvent — Interactive Explorer



<iframe src="main.html" width="100%" height="562" scrolling="no"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 2: "Chapter 2: The Molecules of Food"](../../chapters/02-molecules-of-food/index.md).

```text
Type: MicroSim
**sim-id:** water-solvent-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning Objective:** Students will *classify* common food substances as polar, ionic, or nonpolar (Bloom L1 — Remember) and *explain* why each does or does not dissolve in water (Bloom L2 — Understand).

**Canvas size:** 700 × 450 px, responsive to window resize.

**Layout:**
- Left panel (300 px): a "water tank" animation showing animated water molecules as blue bent shapes with δ– and δ+ labels on each end, gently drifting around.
- Center panel (100 px): a vertical drag tray with five draggable substance cards: Salt, Sugar, Olive Oil, Vitamin C, Butter.
- Right panel: a results area split into two zones: "Dissolves ✓" (blue background) and "Does Not Dissolve ✗" (orange background).

**Interaction:**
- User drags a substance card from the center tray and drops it into either the "Dissolves" or "Does Not Dissolve" zone.
- Correct drop: an animated sequence shows the substance card breaking apart into labeled ions/molecules that get surrounded by water molecule animations; a green checkmark and brief text explanation appear ("Salt is ionic — water molecules pull Na⁺ and Cl⁻ apart!")
- Incorrect drop: a gentle red shake animation and a one-sentence hint ("Olive oil is nonpolar — its molecules can't interact with polar water.")
- After all five substances are correctly sorted, a summary panel appears showing the "like dissolves like" rule with color-coded examples.

**Controls:** A "Reset" button clears all placements and reshuffles the substance cards.

**Responsive design:** On resize, panels scale proportionally; minimum width 400 px triggers a stacked vertical layout.
```

## Related Resources

- [Chapter 2: "Chapter 2: The Molecules of Food"](../../chapters/02-molecules-of-food/index.md)
