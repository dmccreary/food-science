# ph-scale-explorer — Generation Status

**Date:** 2026-05-28
**Library:** p5.js
**Status:** completed

## Instructional Design Check
- Bloom Level: Understand (L2) / Remember (L1)
- Bloom Verb: identify, explain
- Recommended Pattern: Drag-to-classify with snap-on-correct + click-to-learn pop-ups
- Rationale: A drag-and-place activity gives concrete corrective feedback for the "Remember" objective (where each food sits on the pH scale). Click-to-learn pop-ups on placed tiles surface the "Understand" layer (why the food is acidic or basic), reinforcing the chemistry-to-flavor link. The H+ concentration toggle reinforces the logarithmic nature of the scale without forcing it on novices.

## Implementation Summary
- Full pH gradient bar (0-14) with smooth red->orange->yellow->green->blue->purple spectrum and integer tick marks
- 10 food tiles (lemon, vinegar, cola, OJ, tomato, coffee, milk, water, egg white, baking soda) with curated pH values, explanations, and food-science facts
- Drag-and-drop: tiles snap into place when dropped within 0.5 pH units of correct value, turn green, show actual pH
- Wrong drops trigger a shake animation, a brief "Try again!" label, and return to staging
- Click any placed tile to open a pop-up with explanation + food science fact (close via X or click outside)
- "Show H+ Concentration" checkbox replaces integer tick labels with 10^-n M notation
- Hovering the pH bar shows a tooltip with pH value and H+ concentration in scientific notation
- Progress tracker ("X of 10 placed correctly") in orange (accent palette)
- Reset button restores all tiles to staging
- Project palette applied: title in green #2e7d32, progress + dragging-tile highlight in orange #f57c00
- Width-responsive: tiles re-layout and placed-tile positions recompute on window resize

## Files Modified
- docs/sims/ph-scale-explorer/main.html (replaced scaffold with p5.js shell)
- docs/sims/ph-scale-explorer/ph-scale-explorer.js (new — full implementation)
- docs/sims/ph-scale-explorer/index.md (status: scaffold -> completed; iframe height 600 -> 622)
- docs/sims/ph-scale-explorer/ph-scale-explorer.png (screenshot)

## Layout Review

**Reviewer model:** Claude Vision (Opus 4.7)
**Iframe height:** 622 px
**Cycles used:** 2 of 3

### Initial defects (Cycle 1)
- **3.1 Title position / overlap** — Subtitle "Drag each food onto the scale at its correct pH" rendered centered on row 2, where it collided with the "NEUTRAL" region label sitting just above the pH bar. Evidence: in the first screenshot, "NEUTRAL" overlaps "scale at its correct pH" text directly.
- **3.2 / wasted space** — Large empty band of ~200 px between the pH bar tick labels and the Food Staging Area, leaving the drop-zone for placed tiles undefined and the page feeling unbalanced.
- **3.6 Highlight visibility (drop target)** — No visual cue indicating where correctly-placed tiles would land, so the "Drop foods onto the bar above" affordance was implicit.

### Edits applied
- `ph-scale-explorer.js` (layout constants block) — added `titleY`, `subtitleY`, `regionLabelY`, `barTopY`, `barHeight`, `dropZoneTop`, `dropZoneHeight` to anchor the vertical layout in one place.
- `ph-scale-explorer.js` (`setup`) — computed `dropZoneTop` and pushed `stagingY` below it so the staging area no longer floats halfway down the canvas.
- `ph-scale-explorer.js` (`draw` title block) — split title (left, bold, green) and subtitle (right, small, gray) onto the same row, eliminating the subtitle/region-label collision.
- `ph-scale-explorer.js` (`draw` region labels) — reduced size 12 → 11 and tightened y-offset to keep them above the bar without crowding the subtitle.
- `ph-scale-explorer.js` (`draw`) — added a dashed-outline drop-zone rectangle with an italic "Drop foods onto the bar above" hint that fades out once any tile is placed.
- `ph-scale-explorer.js` (`mouseReleased`, `windowResized`) — clamped snap-x to canvas bounds and recomputed drop-zone positions on resize so placed tiles never extend past the canvas edge.
- `ph-scale-explorer.js` (popup positioning) — repositioned popup to sit over the drop zone (vs hard-coded `py=150`) so it remains visually anchored regardless of layout shifts.

### Final state (Cycle 2 screenshot)
- **CLEAN.** Title and subtitle share a single row with no overlap. ACIDIC / NEUTRAL / BASIC labels sit cleanly above the bar. The drop zone is visible and labeled. Staging area tiles are evenly distributed across two rows. Progress tracker is right-aligned in the staging header. Controls (Show H+ Concentration, Reset) are fully visible in the control region with no clipping at the bottom of the iframe.
- No residual stroke halos on text, all backgrounds (aliceblue draw region, white control region) are present, region labels use distinct red/green/blue for color-coded hierarchy.
- Stopped after 2 cycles — no remaining FAILs to address.
