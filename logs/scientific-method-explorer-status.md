# scientific-method-explorer — Generation Status

**Date:** 2026-05-28
**Library:** p5.js
**Status:** completed

## Instructional Design Check
- **Bloom Level:** L1 — Remember
- **Bloom Verb:** Recall / Recognize
- **Pattern:** Click-to-reveal flashcard-style flowchart. All 7 steps are visible at once in a vertical column with downward arrows and an orange "repeat" loop on the right. Clicking any step highlights it green and shows the step name, a short explanation, and a food-science example in a right-hand info panel.
- **Rationale:** L1 Remember is best served by static, scannable visuals plus on-demand detail. Avoiding continuous animation keeps the cognitive load low and lets students study the seven names in any order. The persistent loop arrow reinforces that science is cyclical without requiring playback.

## Implementation Summary
- Vertical flowchart of 7 step boxes with numbered circles, name, and subtitle.
- Down arrows between consecutive steps.
- Orange "Science is a cycle — repeat!" loop arrow from step 7 back up to step 1.
- Right-side info panel: green header bar, "What happens here" + "Food-Science Example" sections, and a footer hint pointing to the next step.
- Click-toggle behavior: clicking a step opens it; clicking it again collapses; clicking another switches.
- Default state shows an intro message and "Try this" hint in the panel.
- p5.js built-in Reset button in the control strip below the canvas.
- All seven food-science example strings used verbatim from the spec.

## Files Modified
- `/Users/dan/Documents/ws/food-science/docs/sims/scientific-method-explorer/main.html` (replaced scaffold with p5.js loader)
- `/Users/dan/Documents/ws/food-science/docs/sims/scientific-method-explorer/scientific-method-explorer.js` (new — full implementation)
- `/Users/dan/Documents/ws/food-science/docs/sims/scientific-method-explorer/index.md` (status → completed, iframe height → 660)
- `/Users/dan/Documents/ws/food-science/docs/sims/scientific-method-explorer/metadata.json` (bloom + status updated)

## Layout Review

**Cycle 1 — initial render (default state)**

Defects identified from screenshot at 800x660:

1. **Repeat-loop arrow hidden behind the info panel.** The loop was routed on the right side of the step boxes at `loopRight = flowX + flowW + 36 = 356`, but the info panel started at `panelX = 330`, so the vertical loop track and the "Repeat" label were overlapped by the panel and invisible. Only a tiny orange tick near step 1 and a stub near step 7 were visible.

**Edits applied:**

- `scientific-method-explorer.js:108-122` — reworked `computeLayout()` to introduce a 44px `loopGutter` on the FAR LEFT of the canvas; `flowX` now starts at 44 instead of at the left margin; left region width increased to 360px.
- `scientific-method-explorer.js:211-249` — rewrote the repeat-loop drawing routine to route the arrow through the new left gutter: track exits the left edge of step 7, runs vertically up the left gutter at `loopLeft = 18`, and arrows back into the left edge of step 1. Rotated "Science is a cycle — repeat!" label moved to the left gutter and now uses `rotate(-HALF_PI)` so the text reads bottom-to-top correctly.

**Cycle 2 — verification (default state)**

- All 7 step boxes render in a clean vertical column with downward arrows between them.
- Orange repeat-loop is fully visible on the left, with the rotated label "Science is a cycle — repeat!" running vertically alongside it.
- Right-side info panel renders the intro message and "Try this" hint with no clipping.
- Reset button visible in the control strip below the canvas.

**Cycle 3 — selected-state verification (selectedStep=3 / "Design an Experiment")**

- Clicked step highlights green (#2e7d32) with the number circle flipping to orange (#f57c00); text color inverts to white for legibility.
- Panel header shows "Step 4: Design an Experiment".
- "What happens here" + explanation and "Food-Science Example" + verbatim example string both fit with comfortable whitespace remaining.
- Footer hint "Next: Step 5 — Collect Data" renders inside the panel.
- No overflow; no overlap between flowchart and panel.

**Final state:** No outstanding defects. All seven food-science example strings from the spec render verbatim. Iframe height 660px matches canvas (drawHeight 580 + controlHeight 60 = 640) with 20px breathing room.

Claude Vision (Opus 4.7)
