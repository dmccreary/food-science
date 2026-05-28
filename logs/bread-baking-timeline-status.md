# bread-baking-timeline — Generation Status

**Date:** 2026-05-28
**Library:** p5.js
**Status:** completed

## Instructional Design Check
- **Bloom Level:** L1 (Remember) + L2 (Understand)
- **Verb:** Sequence + Explain
- **Pattern:** Time-scrub / play-pause animation. Learners scrub a single
  timeline that simultaneously drives (a) a temperature-coded loaf
  cross-section and (b) a dual-axis chart of surface temp, center temp, and
  loaf volume vs. time, with 6 annotated events.
- **Rationale:** Sequencing the bake (L1) requires learners to see the order
  of events. Explaining the chemistry (L2) requires linking each event to a
  temperature threshold. A synchronized scrub binds the two views so the
  abstract graph and the concrete loaf reinforce each other.

## Implementation Summary
- Replaced scaffold `main.html` with p5.js loader (`<main></main>`, no id).
- Created `bread-baking-timeline.js` (~470 lines).
- Left 220px panel: concentric-ring temperature gradient of loaf
  cross-section, computed per-ring from `localTempAt(t, r)`.
- Right ~580px panel: dual-axis line chart (left °F / right %), 6 annotated
  event dots + dashed verticals, ghost (faded) future curves, and a green
  vertical cursor with markers on each line at the current minute.
- Temperature model: surface uses exponential approach to oven temp
  (75 → 250 °F by 7 min → 350 °F by 15 min → ~425 °F by 25 min). Center uses
  logistic curve (75 → 160 °F by 10 min → 205 °F by 25 min). Volume is
  flat-rise-settle (100 → 120 by 7 min, 118 plateau after 10 min).
- Color palette respects book: green title (#2e7d32), orange accent
  (#f57c00), purple volume line (#7e57c2), light bg (#f1f8e9). Temp gradient
  uses blue → yellow → orange → red lerp.
- Play/Pause button (auto-advance 2 min/sec ≈ 12.5 s total) + Reset +
  time slider (0.1-min resolution).
- Hover loaf → tooltip with local °F + chemistry message tied to temp band.
- Active-event detail card under chart updates as time advances, showing
  exact spec text for the most recent event.
- Responsive `updateCanvasSize()` (first line of `setup()`); slider width
  re-flows on resize.

## Files Modified
- `/Users/dan/Documents/ws/food-science/docs/sims/bread-baking-timeline/main.html`
- `/Users/dan/Documents/ws/food-science/docs/sims/bread-baking-timeline/bread-baking-timeline.js` (new)
- `/Users/dan/Documents/ws/food-science/docs/sims/bread-baking-timeline/index.md` (status + iframe height)
- `/Users/dan/Documents/ws/food-science/docs/sims/bread-baking-timeline/metadata.json` (status + bloom)

## Layout Review

**Reviewer:** Claude Vision (Opus 4.7)
**Cycles:** 2

### Cycle 1 — defects found
- Event labels ("0 min", "3 min", "7 min", "10 min", "15 min", "25 min")
  drawn at `chartY - 3` collided with the legend row directly above. Quoted
  visual evidence: "Surface temp 0 min" and "Center temp 3 min" overlapped
  horizontally near the top of the chart, making both rows hard to read.
- "25 min" label sat close to right-axis "135%" volume label but did not
  technically overlap.

### Edits
- `bread-baking-timeline.js:170` — chart `padT` raised from `40` to `70`,
  pushing chart top down to give event labels breathing room.
- `bread-baking-timeline.js:~415` — event labels now stagger across two
  rows (`labelY = chartY - 4 - ((idx % 2) * 12)`), so adjacent labels never
  collide horizontally.
- `bread-baking-timeline.js:~456` — legend Y nudged from `panelTopY + 26`
  to `panelTopY + 28` for visual balance with new chart top.

### Cycle 2 — final state
- Legend row, event-label rows, and chart top are visually separated.
- All controls (Play, Reset, time slider) visible inside the green control
  band; no clipping.
- Left panel: loaf cross-section + temperature legend + numeric readout +
  event detail card all visible.
- Right panel: dual-axis chart, all gridlines, all axis labels, all 6
  annotated events, current-time green cursor, and the small per-line
  markers all render correctly.
- Loaf gradient at t=0 is uniform cool blue (correct — 75°F throughout).

### Remaining issues
- None blocking. Cosmetic: at the far right the "25 min" event label sits
  ~10 px from the "135%" volume-axis label; both remain readable. Would
  require either truncating right-axis range or trimming the event label
  to "25" to improve further.

