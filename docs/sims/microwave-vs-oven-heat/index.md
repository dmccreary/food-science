---
title: Microwave Heating vs. Conventional Oven Heating
description: Students will compare (L4 — Analyze) how microwave and conventional oven heating differ in where and how heat is generated inside food.
status: scaffold
library: p5.js
bloom_level: TBD
---

# Microwave Heating vs. Conventional Oven Heating



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 3: "Chapter 3: Heat, Cooking Science, and Chemical Reactions"](../../chapters/03-heat-and-cooking-science/index.md).

```text
Type: microsim
**sim-id:** microwave-vs-oven-heat<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning Objective:** Students will compare (L4 — Analyze) how microwave and conventional oven heating differ in where and how heat is generated inside food.

**Canvas size:** 740 × 380 px, responsive.

**Layout:** Two equal panels side by side. Each shows a cross-section view of a round food item (potato, 200 px diameter). A "Start Cooking" button below each panel triggers an animated heat simulation. A time display (0:00 to 5:00) advances simultaneously for both.

**Conventional oven panel:**
- Heat starts at the outer edge of the potato (red ring appears)
- Over time, the red zone moves inward, with a thermal gradient from red (hot outside) to blue (cool center)
- At 5 minutes, only the outer 30% has turned red; center is still cool blue

**Microwave panel:**
- Heat appears distributed throughout the potato simultaneously (whole potato turns orange-yellow uniformly)
- At 30 seconds, the entire cross-section is warm; at 2 minutes it is fully heated
- Small "cool spots" appear randomly where water content is lower

**Color scale legend:** blue = 40°F, green = 100°F, yellow = 150°F, orange = 180°F, red = 200°F+

**Clicking any spot** on either panel shows the simulated temperature at that point and a brief explanation.

**Responsive:** Recalculates grid on window resize.
```

## Related Resources

- [Chapter 3: "Chapter 3: Heat, Cooking Science, and Chemical Reactions"](../../chapters/03-heat-and-cooking-science/index.md)
