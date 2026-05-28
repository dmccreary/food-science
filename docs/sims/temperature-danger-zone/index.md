---
title: Temperature Danger Zone Interactive Visualizer
description: Students will identify (L1 — Remember) the temperature danger zone boundaries and apply (L3 — Apply) this knowledge to evaluate food storage scenarios.
status: scaffold
library: p5.js
bloom_level: TBD
---

# Temperature Danger Zone Interactive Visualizer



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 7: "Chapter 7: Food Safety and Sanitation"](../../chapters/07-food-safety-sanitation/index.md).

```text
Type: microsim
**sim-id:** temperature-danger-zone<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning Objective:** Students will identify (L1 — Remember) the temperature danger zone boundaries and apply (L3 — Apply) this knowledge to evaluate food storage scenarios.

**Canvas size:** 720 × 500 px, responsive.

**Layout:** A vertical thermometer (400 px tall) in the center, spanning −20°F to 250°F. Color-coded temperature zones:
- Dark blue (−20°F to 32°F): Frozen — bacteria dormant, no growth
- Medium blue (32°F to 40°F): Refrigerator safe — growth very slow
- Red (40°F to 140°F): DANGER ZONE — bacterial growth zone; pulsing red glow
- Orange (140°F to 165°F): Hot holding safe zone
- Dark orange (165°F to 212°F): Cooking temperatures; colored bands show safe minimums
- Red (212°F+): Boiling and high-heat cooking

**Food scenario selector (right panel):**
Six clickable food cards: Chicken breast, sliced deli meat, potato salad, leftover rice, fresh berries, cream soup. Clicking a card shows:
- The food's current simulated temperature on the thermometer (drag a slider to change it)
- Whether it is in a danger zone (red warning) or safe zone (green check)
- How long it can safely remain at that temperature
- The correct storage and serving temperature for that food

**Two-hour rule timer:** A clock animation shows how bacterial population grows over 2 hours in the danger zone, doubling every 20 minutes.

**Responsive:** Redraws on window resize.
```

## Related Resources

- [Chapter 7: "Chapter 7: Food Safety and Sanitation"](../../chapters/07-food-safety-sanitation/index.md)
