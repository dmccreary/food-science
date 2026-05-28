---
title: Three Modes of Heat Transfer in Cooking
description: Students will identify (L1 — Remember) which mode of heat transfer is operating in a given cooking scenario and explain (L2 — Understand) how each mode works at the molecular level.
status: scaffold
library: p5.js
bloom_level: TBD
---

# Three Modes of Heat Transfer in Cooking



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 3: "Chapter 3: Heat, Cooking Science, and Chemical Reactions"](../../chapters/03-heat-and-cooking-science/index.md).

```text
Type: interactive-infographic
**sim-id:** heat-transfer-cooking-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning Objective:** Students will identify (L1 — Remember) which mode of heat transfer is operating in a given cooking scenario and explain (L2 — Understand) how each mode works at the molecular level.

**Canvas size:** 750 × 420 px, responsive to window resize.

**Layout:** Three side-by-side panels (Conduction | Convection | Radiation), each 230 px wide with a title bar. A cooking scenario selector at the top lets students choose a scenario (pan-frying, boiling soup, broiling chicken, microwave reheating, campfire roasting).

**Conduction panel:** Animated molecules in a metal pan vibrating and transferring energy to food molecules via direct contact. Arrows show direction of heat flow. Clicking a molecule shows a tooltip: "Energy passes from hot molecules to cooler neighbors — like a crowd doing the wave."

**Convection panel:** Animated fluid currents (blue = cool, red = warm) circulating in a pot of boiling water or soup. Arrows show the convection loop. Clicking a current shows: "Warm fluid rises, cool fluid sinks — heat circulates through movement."

**Radiation panel:** Animated red wavy lines (infrared radiation) traveling from a glowing heating element to a piece of chicken. Clicking a wave shows: "Infrared waves carry energy through empty space — no contact needed, just like sunlight warming your face."

**Scenario selector:** When a scenario is selected, the relevant panel(s) highlight in gold and a text box below explains which mode(s) dominate in that scenario (e.g., pan-frying highlights Conduction and briefly Convection from oil; broiling highlights Radiation).

**Color palette:** Consistent with book palette — warm orange for heat energy, cool blue for low-temperature areas, green highlights for active mode.
```

## Related Resources

- [Chapter 3: "Chapter 3: Heat, Cooking Science, and Chemical Reactions"](../../chapters/03-heat-and-cooking-science/index.md)
