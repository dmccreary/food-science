---
title: Interactive Molecule Builder
description: Students will be able to identify (Bloom L1 — Remember) the atoms that make up key food molecules and explain (Bloom L2 — Understand) how bonding creates compounds with different properties than the individual elements.
status: completed
library: p5.js
bloom_level: Understand
---

# Interactive Molecule Builder



<iframe src="main.html" width="100%" height="630" scrolling="no"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 1: "Chapter 1: Science in the Kitchen"](../../chapters/01-science-in-the-kitchen/index.md).

```text
Type: MicroSim
**sim-id:** molecule-builder<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective:** Students will be able to identify (Bloom L1 — Remember) the atoms that make up key food molecules and explain (Bloom L2 — Understand) how bonding creates compounds with different properties than the individual elements.

**Canvas size:** 760 × 500 px, responsive.

**Layout:** Left sidebar shows a palette of colored atom "beads": Carbon (gray, C), Hydrogen (white/light blue, H), Oxygen (red, O), Nitrogen (blue, N). Right main area is the build canvas. A bottom toolbar shows: "Water (H₂O)," "Carbon Dioxide (CO₂)," "Glucose (C₆H₁₂O₆, simplified)," and "Clear" buttons.

**Interaction — Load preset molecules:**
Clicking "Water (H₂O)" animates two Hydrogen beads and one Oxygen bead onto the canvas, snaps them together at the correct bond angle (~104.5°), and displays a side panel with:
- The molecular formula
- The full name
- A 2-sentence description of its role in food ("Water is the universal solvent. It dissolves sugars, salts, and acids, making most chemical reactions in cooking possible.")
- The approximate bond angle

Clicking "Carbon Dioxide (CO₂)" shows one carbon flanked by two oxygens with double bonds, and explains: "Yeast and baking powder both produce CO₂ gas. This gas gets trapped in dough, making it rise."

Clicking "Glucose (simplified)" shows a ring of 6 carbons with hydrogens and oxygens attached, and explains: "Glucose is a simple sugar. It is the main food source for yeast and the source of energy for your body cells."

**Freeform drag mode:** Students can also drag individual atom beads onto the canvas and click two adjacent beads to draw a bond between them. A counter shows "You've built: C0 H0 O0 N0."

**Hover interaction:** Hovering over any atom bead in the palette shows a tooltip with the element name, symbol, and a one-line fact ("Carbon forms the backbone of almost every organic molecule in food.").

**Color scheme:** Atom colors follow the standard CPK color convention (gray C, white H, red O, blue N), with book-palette green/orange used for UI buttons.
```

## Related Resources

- [Chapter 1: "Chapter 1: Science in the Kitchen"](../../chapters/01-science-in-the-kitchen/index.md)
