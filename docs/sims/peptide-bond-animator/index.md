---
title: Peptide Bond Formation — Step-by-Step Animator
description: Students will *explain* how amino acids link via peptide bonds and *describe* the condensation reaction that forms them (Bloom L2 — Understand); students will *demonstrate* the step-by-step sequence (Bloom L3 — Apply).
status: completed
library: p5.js
bloom_level: L2-L3
---

# Peptide Bond Formation — Step-by-Step Animator



<iframe src="main.html" width="100%" height="560"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 2: "Chapter 2: The Molecules of Food"](../../chapters/02-molecules-of-food/index.md).

```text
Type: MicroSim
**sim-id:** peptide-bond-animator<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning Objective:** Students will *explain* how amino acids link via peptide bonds and *describe* the condensation reaction that forms them (Bloom L2 — Understand); students will *demonstrate* the step-by-step sequence (Bloom L3 — Apply).

**Canvas size:** 700 × 420 px, responsive to window resize.

**Layout:**
Two amino acid molecule diagrams sit side-by-side in the center. Each shows:
- Amino group (–NH₂, blue rectangle on left)
- Central carbon (gray circle) with attached side chain (R, small colored oval, color varies by amino acid type)
- Carboxyl group (–COOH, orange rectangle on right)

A "Step" button and a step counter ("Step 1 of 4") sit below the molecules. A text explanation box below the step counter updates with each step.

**Interaction (4 steps):**
- Step 1: Static starting display; text: "Meet two amino acids. Each has an amino group (blue) and a carboxyl group (orange)."
- Step 2: Animated arrows show the –NH₂ of the right amino acid approaching the –COOH of the left amino acid. Text: "The amino group of one amino acid approaches the carboxyl group of the other."
- Step 3: A water molecule (H₂O, shown in light blue) detaches and moves to the corner. Text: "One water molecule is released — this is called a condensation reaction."
- Step 4: A red bond line forms between the two amino acids, labeled "Peptide Bond". Text: "The peptide bond (–CO–NH–) links the two amino acids into a dipeptide."

After Step 4: A "Extend the Chain" button appears. Clicking it adds a third amino acid and replays Steps 2–4 to form a tripeptide, demonstrating the repeating nature of the process.

**Controls:** "Reset" returns to Step 1; a dropdown lets students choose different amino acid pairs (Glycine–Alanine, Lysine–Glutamate, etc.) to see how different R-groups affect the visualization.

**Responsive design:** On resize, molecule spacing adjusts proportionally to keep both molecules and the bond animation visible.
```

## Related Resources

- [Chapter 2: "Chapter 2: The Molecules of Food"](../../chapters/02-molecules-of-food/index.md)
