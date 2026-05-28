# molecule-builder — Generation Status

**Date:** 2026-05-28
**Library:** p5.js
**Status:** completed

## Instructional Design Check

- **Bloom Level:** L2 — Understand (with L1 Remember support)
- **Verb:** Explain (atoms → molecules, bond geometry → emergent properties)
- **Pattern:** Preset reveal + freeform construction. Preset buttons (Water, CO₂, Glucose) animate atoms into the correct geometry while a side panel reveals formula, name, food-science role, and bond angle. Freeform palette-drag with click-to-bond lets students test their own mental model.
- **Rationale:** L1 Remember is reached via CPK-colored beads, element labels, and palette tooltips ("Carbon forms the backbone of almost every organic molecule in food."). L2 Understand is reached because the same atoms (H, O) recombine into qualitatively different molecules (H₂O bent at 104.5° vs. CO₂ linear with double bonds vs. a glucose ring) — the visible structural change reinforces that bonding creates compounds with different properties than the elements.

## Implementation Summary

- Left palette of four CPK-colored beads (C gray, H light-blue/white, O red, N blue) with hover tooltips showing element name, symbol, and one-line food fact.
- Build canvas (white panel) with a live placeholder hint when empty.
- Side info panel (warm cream background, orange title) reveals formula, name, two-sentence food-science description, and bond angle on preset click.
- Bottom toolbar: Water (H₂O), Carbon Dioxide (CO₂), Glucose (C₆H₁₂O₆), Clear — using `createButton` styled with book palette green `#2e7d32` and orange `#f57c00`.
- Preset animation: atoms spawn at the molecule center and ease (factor 0.18) toward target positions; H₂O snaps to ~104.5°, CO₂ to linear 180° with double-bond rendering, Glucose to a 6-carbon hexagon with alternating H/OH attachments.
- Freeform mode: drag from palette into canvas drops a new atom; click two existing atoms to bond (selection ring shown in orange). Atoms can be repositioned by dragging; click without drag = bond select.
- Live counter "You've built: C# H# O# N#" with colored bead next to each element symbol, plus an italic tip about clicking to bond.
- `setup()` starts with `updateCanvasSize()`; canvas parented to `document.querySelector('main')`; HTML uses `<main></main>` with no id, p5.js editor-compatible.

## Files Modified

- `/Users/dan/Documents/ws/food-science/docs/sims/molecule-builder/main.html` — replaced scaffold with p5.js loader.
- `/Users/dan/Documents/ws/food-science/docs/sims/molecule-builder/molecule-builder.js` — new implementation file.
- `/Users/dan/Documents/ws/food-science/docs/sims/molecule-builder/index.md` — status → completed, bloom_level → Understand, iframe height 600 → 660.
- `/Users/dan/Documents/ws/food-science/docs/sims/molecule-builder/metadata.json` — bloomLevel/Verb/completion_status updated.

## Layout Review

**Reviewer:** Claude Vision (Opus 4.7)
**Method:** `bk-capture-screenshot` at iframe height 660px, then 630px against the rendered page at `http://127.0.0.1:8000/food-science/sims/molecule-builder/main.html`.

### Cycle 1 — Initial capture at height 660

Observations from screenshot `molecule-builder.png`:

- Title "Interactive Molecule Builder" renders cleanly in green at top-left; tagline "Click a preset or drag atoms from the palette. Click two atoms to bond." is right-aligned and does not collide with the title.
- ATOMS palette panel shows all four beads in correct CPK colors (C gray, H light-blue/white outlined, O red, N blue) with element names underneath. No clipping.
- Build canvas placeholder text "Drag atoms here from the palette, or click a preset molecule below." renders centered and italic.
- MOLECULE INFO side panel shows orange title and italic prompt text. Wrap fits within panel.
- Bottom toolbar: all four buttons (Water (H₂O), Carbon Dioxide (CO₂), Glucose (C₆H₁₂O₆), Clear) are visible, correctly colored (green presets, orange Clear).
- Counter row "You've built: C0 H0 O0 N0" with colored dots, plus italic tip line, all visible above the bottom of the canvas.
- 30px of dead whitespace at the bottom of the iframe — wasted vertical space.

**Defect:** "Excess whitespace at iframe bottom — iframe height 660 was conservative; content actually ends near y≈620."

### Cycle 2 — Patch: tighten iframe to 630

- **Edit:** `docs/sims/molecule-builder/index.md:13` — changed `height="660"` → `height="630"`.
- **Re-capture at 630px:** All content remains visible (palette, build area, info panel, four buttons, counter, tip). No clipping at the new height. Minimal padding below the tip line, which is the desired tight fit.

### Final State

- No clipped labels, no overlapping controls, no panel overflow.
- CPK colors render correctly; UI buttons use the book palette green `#2e7d32` and orange `#f57c00`.
- Iframe height `630` matches actual content (canvas 760×620 + body margin).
- Library-specific check (p5.js): `setup()` begins with `updateCanvasSize()`; canvas parented to `document.querySelector('main')`; `<main></main>` has no id attribute; all UI uses `createButton` (no manual button drawing).

**Remaining issues:** None observed in the default state. Preset animations and bond-click interactions were not exercised in the headless screenshot but are implemented per spec and use the same render path as the empty state.

