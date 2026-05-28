---
title: World Map of Fermented Foods
description: Students will identify (L1 — Remember) fermented food traditions from at least six world regions and classify (L2 — Understand) each by its fermentation pathway (lactic acid, alcoholic, acetic acid, or mold-based).
status: scaffold
library: Leaflet
bloom_level: TBD
---

# World Map of Fermented Foods



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 14: "Chapter 14: Global Food Cultures and Food Futures"](../../chapters/14-global-food-cultures/index.md).

```text
Type: interactive-infographic
**sim-id:** world-fermented-foods-map<br/>
**Library:** Leaflet<br/>
**Status:** Specified

**Learning Objective:** Students will identify (L1 — Remember) fermented food traditions from at least six world regions and classify (L2 — Understand) each by its fermentation pathway (lactic acid, alcoholic, acetic acid, or mold-based).

**Canvas size:** 760 × 500 px, responsive.

**Base map:** World map centered on 20°N, 0°E at zoom level 2. Tile layer: OpenStreetMap or equivalent.

**Markers:** 20 location markers, color-coded by fermentation type:
- Green = Lactic acid fermentation (yogurt/Georgia, kimchi/Korea, sauerkraut/Germany, injera/Ethiopia, kefir/Caucasus, lassi/India)
- Orange = Alcoholic fermentation (sake/Japan, beer/Belgium, wine/France, chicha/Peru, tej/Ethiopia)
- Blue = Acetic acid / kombucha / vinegar fermentation (kombucha/China-Russia, coconut vinegar/Philippines)
- Purple = Mold-based fermentation (miso/Japan, tempeh/Indonesia, Roquefort/France, koji-rice wine/China)

**Clicking a marker:**
- Opens a popup with the food name, country, fermentation type, primary microorganism, key flavor characteristics, and one sentence on how the science from this course explains it
- Example popup for Kimchi: "Kimchi — Korea. Fermentation type: Lactic acid. Key microorganisms: *Leuconostoc mesenteroides*, *Lactobacillus plantarum*. Flavor: tangy, spicy, savory. Science connection: salt draws water from cabbage by osmosis, creating brine that LAB ferment to lactic acid — the same process as sauerkraut but with chili and garlic influencing the microbial community."

**Filter buttons:** Toggle markers by fermentation type to see geographic patterns.

**Responsive:** Redraws on window resize.
```

## Related Resources

- [Chapter 14: "Chapter 14: Global Food Cultures and Food Futures"](../../chapters/14-global-food-cultures/index.md)
