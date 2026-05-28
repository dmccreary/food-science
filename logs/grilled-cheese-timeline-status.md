# grilled-cheese-timeline — Generation Status

**Date:** 2026-05-28
**Library:** vis-timeline
**Status:** completed

## Instructional Design Check

- **Bloom Level:** Understand (L2) with light Remember (L1)
- **Bloom Verb:** sequence / explain
- **Pattern:** Click-to-reveal detail panel on a horizontal time axis (0–8 min)
- **Rationale:** A Remember+Understand objective ("sequence the events and explain
  the heat/chemistry at each step") is best served by a sequenced, clickable
  timeline. Each event is anchored to its real cooking time, color-coded by
  category, and reveals a concrete explanation in a detail panel below the axis
  rather than in a flaky native tooltip. Students can both *see* the order and
  *read* the mechanism — supporting recognition and explanation without
  unnecessary animation.

## Implementation Summary

- Replaced the scaffold `main.html` with a self-contained vis-timeline page
  (HTML, CSS, JS all inline; vis-timeline loaded from CDN).
- 7 events placed at their exact cooking minutes: 0:00 butter, 0:30 conduction,
  1:00 Maillard, 2:30 cheese melt, 3:30 flip, 5:00 internal peak, 7:00 remove.
- Color coding via CSS classes: physical=`#2e7d32` (green), heat=`#1e88e5` (blue),
  chemical=`#f57c00` (orange). Matches Food-Science palette.
- Time axis labels overridden via `format.minorLabels` to show elapsed `m:ss`
  cooking time instead of the underlying epoch-based clock time.
- Detail panel below the timeline shows the EXACT tooltip text from the spec
  on click; first event is preselected on load so the panel is never empty.
- Vertical mousewheel passes through to the page (capture-phase listener with
  `stopImmediatePropagation`) — does not hijack page scroll when embedded.
- Legend (physical / heat / chemical) rendered above the timeline.
- iframe height set to `562` (CANVAS_HEIGHT 560 + 2px border) in `index.md`.

## Files Modified

- `/Users/dan/Documents/ws/food-science/docs/sims/grilled-cheese-timeline/main.html` (rewrote scaffold)
- `/Users/dan/Documents/ws/food-science/docs/sims/grilled-cheese-timeline/index.md` (status → completed, iframe height 562, scrolling=no)

## Layout Review

**Reviewer:** Claude Vision (Opus 4.7) — 3 review-patch cycles.

### Cycle 1 — Timeline area completely blank

- **FAIL 6.1 Sim renders at all:** "The timeline rectangle is rendered (white box
  with green border) but contains zero items, zero axis ticks, zero content."
- **Diagnosis:** Headless Chrome console showed
  `Uncaught TypeError: date.getTime is not a function` at the `format.minorLabels`
  callback. vis-timeline passes a moment.js wrapper to the format functions, not
  a native `Date`, so `date.getTime()` blew up and aborted axis rendering. Also
  found a stale CDN URL — switched from `unpkg.com/vis-timeline/...` to
  `unpkg.com/vis-timeline@latest/...` to match the working `moss-evolution-timeline`
  pattern.
- **Edit:** `main.html:9-10` swapped CDN URLs to pinned `@latest`;
  `main.html:259-271` rewrote `minorLabels` to use `date.valueOf()` (works for
  both moment objects and native Dates) and snap to nearest 30 s;
  `main.html:309-312` removed a no-op `dataset.update({id:1})` call.

### Cycle 2 — Timeline renders but item labels clipped at left and right edges

- **FAIL 1.1 Clipped text at canvas edges:** "Leftmost three items show
  `ter melts in pan`, `luction heats bread surface`, `rface reaches 280°F`
  — leading characters cut off where the box extends past the panel's
  left boundary."
- **FAIL 1.1 Right edge:** "`7:00 Remove from heat. Reaction` clipped to
  `Remove from heat. Reaction` and axis label `8:0` missing final `0`."
- **Diagnosis:** vis-timeline `box` items are centered on their date marker;
  items at minute 0 have half their box width hanging into negative space, and
  the long human-readable titles ("Surface reaches 280°F: Maillard begins") plus
  long titles cause overflow on a 0–8 axis at 800 px width.
- **Edit:** `main.html:225-245` shortened the labels rendered inside boxes via
  a `SHORT_LABELS` map (e.g., "Maillard begins (280°F)", "Flip!", "Cheese temp
  peaks") — the full sentence is still shown in the detail panel below;
  `main.html:251-254` widened the visible window to `tAt(-0.5)…tAt(8.8)` and
  the pan limits to `tAt(-1.0)…tAt(9.5)`.

### Cycle 3 — Right side clean, left edge still clipping `0:00` / `0:30` / `1:00`

- **FAIL 1.1 Clipped text at left edge:** "Leftmost three items still missing
  their leading time prefix — read as `— Butter melts`, `— Conduction → bread`,
  `:00 — Maillard begins`. The boxes extend past the timeline panel's left
  border into the clipped area."
- **Diagnosis:** Even with shorter labels, box items centered on date markers
  near `min` still hang off the left edge. The fix used elsewhere in this
  project's timelines is CSS `overflow: visible` on `.vis-timeline` and
  `.vis-panel.vis-center` combined with left padding on the host `#timeline`
  div so the overflowing box renders into the padded gutter rather than the
  clipped panel.
- **Edit:** `main.html:42-55` added 80 px left padding to `#timeline` and
  `overflow: visible !important` overrides on `.vis-timeline`,
  `.vis-panel.vis-center`, and `.vis-item .vis-item-overflow`.

### Final state — clean

All 7 events render fully with their `m:ss — Label` prefix; selected item ("0:00
— Butter melts") shows the yellow `.vis-selected` highlight; detail panel below
shows the full spec tooltip text and category badge; legend (Heat transfer / Chemical
reaction / Physical change) is visible above the timeline; axis labels 0:00 through
8:00 readable. No clipping, no overlaps, no overflow into the detail panel below.

Residual minor item — none significant. The `7:00` event sits very close to the
right wall of the panel ("Remove from heat" — last character almost touches the
right border but is fully readable). Acceptable given the 0–8 minute horizon
constraint; not worth a 4th cycle.

