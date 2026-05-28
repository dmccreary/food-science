---
title: Maillard Reaction vs. Caramelization Step-by-Step
description: Students will distinguish (L4 — Analyze) the Maillard reaction from caramelization by comparing their reactants, temperature requirements, and flavor products.
status: scaffold
library: p5.js
bloom_level: TBD
---

# Maillard Reaction vs. Caramelization Step-by-Step



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 3: "Chapter 3: Heat, Cooking Science, and Chemical Reactions"](../../chapters/03-heat-and-cooking-science/index.md).

```text
Type: microsim
**sim-id:** browning-reactions-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning Objective:** Students will distinguish (L4 — Analyze) the Maillard reaction from caramelization by comparing their reactants, temperature requirements, and flavor products.

**Canvas size:** 760 × 460 px, responsive.

**Layout:** Two columns, left = Maillard Reaction, right = Caramelization. A temperature slider (shared, range 200°F – 400°F) sits at the bottom. A cooking surface image (pan) appears at the top of each column showing a different food (steak on left, sugar on right).

**Maillard column behavior:**
- Below 280°F: food appears pale, labeled "No browning yet"
- 280–320°F: golden browning starts, molecule animations show amino acid (blue) + sugar (yellow) combining → brown molecule cluster; aroma labels pop up ("nutty," "savory," "bready")
- Above 320°F: deep brown, "Caramelization also begins now" text appears
- Hovering the brown molecules shows a tooltip: "These are called melanoidins — hundreds of different aromatic compounds formed at once."

**Caramelization column behavior:**
- Below 320°F: sugar sits unchanged, labeled "Crystals stable"
- 320°F+: sugar molecules animate breaking apart and recombining; color shifts from clear → golden → amber → dark brown
- Aroma labels: "butterscotch," "nutty," "slightly bitter"
- Hovering shows: "Caramelization produces fewer compounds than Maillard but creates distinctive sweet-bitter notes."

**Summary box** at bottom highlights: Maillard = amino acids + sugars; Caramelization = sugars only.

**Responsive:** Redraws on window resize.
```

## Related Resources

- [Chapter 3: "Chapter 3: Heat, Cooking Science, and Chemical Reactions"](../../chapters/03-heat-and-cooking-science/index.md)
