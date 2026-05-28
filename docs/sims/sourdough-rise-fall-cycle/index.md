---
title: Sourdough Rise-and-Fall Cycle Simulation
description: Students will identify (L1 — Remember) when a sourdough starter is at peak activity and apply (L3 — Apply) that knowledge to time their baking correctly.
status: completed
library: p5.js
bloom_level: L1 Remember, L3 Apply
---

# Sourdough Rise-and-Fall Cycle Simulation



<iframe src="main.html" width="100%" height="780"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 6: "Chapter 6: Sourdough and Wild Fermentation"](../../chapters/06-sourdough-wild-fermentation/index.md).

```text
Type: microsim
**sim-id:** sourdough-rise-fall-cycle<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning Objective:** Students will identify (L1 — Remember) when a sourdough starter is at peak activity and apply (L3 — Apply) that knowledge to time their baking correctly.

**Canvas size:** 740 × 480 px, responsive.

**Layout:** Three sections stacked vertically.

**Top section (200 px) — Jar Visualizer:**
A cross-section of a glass jar (200 px wide) showing the starter level as a colored liquid. The level rises and falls in real time matching the simulation. A small floating spoonful next to the jar simulates the float test — it floats when starter is at peak activity.

**Middle section — Controls:**
- Temperature slider: 60°F – 90°F (warmer = faster cycle)
- Flour type selector: Whole wheat (faster, more microbial activity) vs. White flour (slower)
- "Feed Starter" button — resets the cycle

**Bottom section (240 px) — Activity Graph:**
- X-axis: Time since last feeding (0–24 hours)
- Y-axis: Starter height (arbitrary units, 0–100%)
- Animated line showing the rise-and-fall curve
- Colored zones: red = too early (fails float test), green = peak window (passes float test), yellow = falling (still usable but declining)
- Yeast population and acid level bars update alongside the graph

**Tooltips:** Clicking any point on the curve shows: simulated starter height, yeast activity level, pH estimate, and float test result.

**Responsive:** Redraws on window resize.
```

## Related Resources

- [Chapter 6: "Chapter 6: Sourdough and Wild Fermentation"](../../chapters/06-sourdough-wild-fermentation/index.md)
