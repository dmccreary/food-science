---
title: Saturated vs. Unsaturated Fat Molecule Explorer
description: Students will *differentiate* saturated, monounsaturated, and polyunsaturated fatty acids by molecular structure (Bloom L4 — Analyze) and *explain* how chain structure determines physical state at room temperature (Bloom L2 — Understand).
status: scaffold
library: p5.js
bloom_level: TBD
---

# Saturated vs. Unsaturated Fat Molecule Explorer



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 2: "Chapter 2: The Molecules of Food"](../../chapters/02-molecules-of-food/index.md).

```text
Type: MicroSim
**sim-id:** fat-molecule-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning Objective:** Students will *differentiate* saturated, monounsaturated, and polyunsaturated fatty acids by molecular structure (Bloom L4 — Analyze) and *explain* how chain structure determines physical state at room temperature (Bloom L2 — Understand).

**Canvas size:** 760 × 500 px, responsive to window resize.

**Layout:**
Three side-by-side panels, each showing a stylized fatty acid chain as a zigzag line (carbon backbone):
- Left panel: Saturated — a perfectly straight zigzag with H atoms drawn above and below every carbon; labeled "Saturated Fat." A temperature display at the bottom defaults to 20°C and shows the fat as "Solid."
- Center panel: Monounsaturated — same zigzag but one carbon–carbon pair shows a double bond (drawn as a double line) creating a visible kink; labeled "Monounsaturated Fat." Temperature display shows "Liquid" at 20°C.
- Right panel: Polyunsaturated — two kinks in the chain; labeled "Polyunsaturated Fat." Temperature display shows "Liquid" at 20°C.

Below each panel: a small food-icon row showing two or three food sources.

**Interaction:**
- A temperature slider at the bottom (range 0°C to 80°C) applies to all three panels simultaneously. As the slider moves up, the saturated fat panel transitions from a solid crystal lattice visualization to a flowing liquid visualization (with molecules shown drifting apart) at around 45–50°C; the unsaturated panels show liquid behavior across the entire range.
- Clicking any carbon in any chain highlights that carbon and shows a tooltip: "Single bond — can rotate freely" or "Double bond — rigid, creates a kink."
- A "Pack Together" button triggers an animation showing the straight saturated chains stacking tightly in neat rows, then showing the kinked unsaturated chains unable to stack — with a text overlay: "Tight packing = solid. Loose packing = liquid. The kink makes all the difference!"
- Each food icon is clickable for a brief tooltip identifying the fat type and percentage of saturated fat.

**Responsive design:** Panels scale to fill width; on very narrow screens, panels stack vertically.
```

## Related Resources

- [Chapter 2: "Chapter 2: The Molecules of Food"](../../chapters/02-molecules-of-food/index.md)
