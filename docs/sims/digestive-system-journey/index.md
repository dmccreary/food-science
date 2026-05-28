---
title: Digestive System Nutrient Journey
description: Students will trace (L1 — Remember) each major organ's role in digestion and explain (L2 — Understand) how nutrients are absorbed into the body.
status: scaffold
library: p5.js
bloom_level: TBD
---

# Digestive System Nutrient Journey



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 8: "Chapter 8: Nutrition Science — What Food Does for Your Body"](../../chapters/08-nutrition-science/index.md).

```text
Type: interactive-infographic
**sim-id:** digestive-system-journey<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning Objective:** Students will trace (L1 — Remember) each major organ's role in digestion and explain (L2 — Understand) how nutrients are absorbed into the body.

**Canvas size:** 720 × 520 px, responsive.

**Visual:** A simplified but accurate anatomical silhouette of the human torso showing the digestive tract. Each major organ is a clickable hot spot with a pulsing highlight ring.

**Clickable organs and tooltips:**
- Mouth → "Salivary amylase begins starch digestion. Chewing increases surface area for enzymes."
- Esophagus → "No digestion here — just transport via peristalsis. Food takes 2–3 seconds to travel from mouth to stomach."
- Stomach → "pH 1.5–3.5. Pepsin digests protein. Strong churning turns food into chyme. Gastric emptying takes 2–6 hours."
- Small intestine → "The powerhouse of digestion. 20 feet of tubing lined with villi. Fats, proteins, and carbohydrates are all fully digested and absorbed here. Bile from the liver emulsifies fat."
- Liver → "All absorbed nutrients from the small intestine arrive here first. The liver packages fats, converts fructose, detoxifies, and regulates blood glucose."
- Gallbladder → "Stores and concentrates bile produced by the liver. Releases bile into the small intestine when fat is present."
- Pancreas → "Secretes digestive enzymes (amylase, lipase, trypsin) into the small intestine, plus hormones (insulin, glucagon) directly into the blood."
- Large intestine → "Absorbs water and electrolytes. Gut microbiome ferments fiber here. Waste transit takes 24–72 hours."

**Food journey animation:** A "Send Food" button drops a stylized food particle into the mouth and animates it traveling through each organ, with explanatory text appearing at each stop.

**Responsive:** Redraws on window resize.
```

## Related Resources

- [Chapter 8: "Chapter 8: Nutrition Science — What Food Does for Your Body"](../../chapters/08-nutrition-science/index.md)
