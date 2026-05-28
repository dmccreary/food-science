# carbohydrate-size-ladder — Generation Status

**Date:** 2026-05-28
**Library:** p5.js
**Status:** completed

## Instructional Design Check

- **Bloom Level:** L2 Understand (with L1 Remember scaffolding)
- **Bloom Verb:** classify, explain
- **Pattern:** Click-to-reveal hexagons (tooltips with concrete name + formula + food source), staged condensation animation triggered by clicking the –H₂O droplet, and a toggle to overlay α/β bond markers with explanatory caption.
- **Rationale:** Animation here is purposeful, not decorative — it makes the condensation mechanism (water-removal) visible, which a static diagram cannot. Tooltips and the info card give the concrete, persistent data (formulas, food sources) that "Understand" requires. The α/β toggle directly supports classification by linkage type.

## Implementation Summary

- Three rung cards (Polysaccharides on top, Disaccharides in the middle, Monosaccharides on the bottom) with rounded panels and per-rung subtitles.
- Monosaccharide rung: three colored hexagons (Glucose blue, Fructose orange, Galactose green) with letter glyphs and name labels; each is clickable for a tooltip showing name, formula, and food source.
- Disaccharide rung: Glucose + Fructose hexagons with a clickable water droplet "–H₂O". Clicking the droplet runs a four-phase condensation animation: showWater → removing (droplet floats up + fades) → merging (hexagons slide together with a bond line) → bonded (Sucrose label appears + info card with reaction summary).
- Polysaccharide rung: chain of 9 smaller blue glucose hexagons with the last 3 fading out + trailing ellipsis to imply "much longer." Toggle "Show α/β bonds" overlays α (green) markers on the first half of the bonds and β (red) on the second half, plus the captioned explanation "α = digestible, β = indigestible / fiber" and "This tiny difference determines whether you can digest it!"
- Food-icon pills on the right of each rung (emoji + label) are clickable and open a centered info card describing which carbohydrate the food contains and how the body uses it.
- Buttons "Show α/β bonds" (toggle) and "Reset" (orange) use the project palette; built-in p5 `createButton`. Cursor switches to `HAND` on clickable targets.
- `// CANVAS_HEIGHT: 640` set at the top of the .js; iframe height in index.md set to 642 (CANVAS_HEIGHT + 2).

## Files Modified

- /Users/dan/Documents/ws/food-science/docs/sims/carbohydrate-size-ladder/main.html (replaced scaffold with p5 loader, schema meta, `<main></main>`)
- /Users/dan/Documents/ws/food-science/docs/sims/carbohydrate-size-ladder/carbohydrate-size-ladder.js (new — full implementation)
- /Users/dan/Documents/ws/food-science/docs/sims/carbohydrate-size-ladder/index.md (status: scaffold → completed; bloom_level: TBD → Understand; iframe height 600 → 642 + `scrolling="no"`)

## Layout Review

**Reviewer:** Claude Vision (Opus 4.7)
**Screenshots captured at:** iframe height 642 px via `bk-capture-screenshot`
**Cycles used:** 2 of 3

### Cycle 1 — defects (with quoted evidence)

- **FAIL — Monosaccharide rung not rendered.** Screenshot shows only the Polysaccharides and Disaccharides cards; the bottom ~180 px of the drawing region is empty BG. Expected `drawRung('Monosaccharides', ...)` content at y≈350–480.
- **FAIL — Disaccharide food pills (Milk, Sugar) not rendered.** Only the Polysaccharide pills (Bread / Broccoli / Oats) appear on the right.
- **FAIL — "−H₂O" droplet label missing.** Droplet glyph visible but no caption next to it; hint text "click droplet to remove H₂O" also absent.

### Diagnosis

Injected a `window.onerror` handler in `main.html` and re-captured at viewport 800 to expose any thrown error below the canvas. Caught:

> `Uncaught Error: [object Arguments] is not a valid color representation` at `p5.js:57463`

Root cause: three call sites passed a hex string + alpha number to `fill()` / `stroke()`. p5.js accepts `fill(r,g,b,a)` or `fill(hex)` but NOT `fill(hex, a)`. The throw on every `draw()` happened inside `drawDiRung` (during the droplet caption draw), aborting the rest of the frame — which silently dropped the Disaccharide food icons AND the entire Monosaccharide rung that would have been drawn after.

**Footgun note:** this is a classic silent-damage footgun — p5's `fill()` happily accepts most argument shapes, but this one specific overload throws, and the symptom (missing content far below the cause) gives no hint of the actual line.

### Edits applied

- `carbohydrate-size-ladder.js:349-352` — `fill(TEXT_DARK, dropletAlpha)` → build a `color()` object then `setAlpha()` before `fill()`.
- `carbohydrate-size-ladder.js:451-462` — `stroke(col, alpha)` and `fill(col, alpha)` (α/β bond markers) → same color-object pattern.

Also removed the temporary `<script>` error catcher from `main.html`.

### Cycle 2 — re-capture verdict

All three rungs now render correctly. Walk of the checklist:

- PASS — title, tip line, three rung cards stacked with consistent margins
- PASS — Polysaccharides: chain of 9 blue hexagons with the last 3 fading out + trailing ellipsis + label "starch / cellulose / glycogen"
- PASS — Disaccharides: G (blue) + F (orange) hexagons; droplet visible with "−H₂O" caption; "click droplet to remove H₂O" hint shown
- PASS — Monosaccharides: Glucose (blue) / Fructose (orange) / Galactose (green) hexagons with names below
- PASS — food pills present on all three rungs (Bread/Broccoli/Oats; Milk/Sugar; Grapes/Honey) with emoji + label inside rounded yellow chips
- PASS — controls: "Show α/β bonds" (green) + "Reset" (orange) buttons in the control band; tip text below
- PASS — no clipping at iframe boundary; no overlap between rungs and food pills; no residual stroke artifacts on text
- N/A — Mermaid / vis-network / Chart.js specific items (p5.js sim)

### Final state

**Clean.** All FAILs resolved; no residual defects.

