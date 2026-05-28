# sourdough-rise-fall-cycle — Generation Status

**Date:** 2026-05-28
**Library:** p5.js
**Status:** completed

## Instructional Design Check

- **Bloom Level:** L1 Remember + L3 Apply
- **Verb:** Identify (the peak window) and Apply (timing knowledge)
- **Pattern:** Parameter sliders + real-time animated curve + interactive tooltip on click
- **Rationale:** Students adjust two real-world variables (temperature, flour type) and watch the rise-and-fall curve shift in time and amplitude. They learn to *recognize* the peak by observing the jar, the float test, and the colored zones on the activity graph — then *apply* that recognition by predicting when to bake. Clicking any point on the curve surfaces the underlying numbers (height, yeast activity, pH, float result), reinforcing the cause-and-effect chain.

## Implementation Summary

- Three vertical sections matching spec: jar visualizer (top), activity graph (middle/bottom), and a stacked control bar.
- Cross-section glass jar with bubbles rising at a rate proportional to current yeast activity; baseline ("start line") dashed marker shows post-feeding fill so students can see the rise relative to the original level.
- Animated float test: a starter blob in a water glass sinks (too early), half-sinks (falling), or floats with bubbles (peak window). Bobs subtly with a sine wave.
- Activity graph plots starter height (0–100%) vs hours since feeding (0–24 h). Background colored zones: red (too early), green (peak window, ±0.75 h around peak), yellow (falling). Current-time marker (vertical dashed line + orange dot) tracks the live simulation.
- Yeast-activity and acid-level vertical bars to the right of the graph update in real time.
- Click anywhere on the graph to drop a tooltip showing height, yeast activity, pH estimate, and float-test pass/fail at that hypothetical time.
- Temperature slider (60–90 °F): linearly maps peak time from 12 h (cold) to 4 h (hot). Whole-wheat flour shortens peak time to 75% of white and slightly raises peak amplitude (rich in microbes and minerals).
- Speed slider (0.25–4 sim-h per real-sec), Play/Pause, and "Feed Starter (Reset)" controls let students pause to inspect or fast-forward through a 24-hour cycle.
- All drawing helpers wrapped in `push()/pop()`. Color alpha uses `color() + setAlpha()` to avoid the `fill(hexString, alpha)` footgun.

## Files Modified

- `/Users/dan/Documents/ws/food-science/docs/sims/sourdough-rise-fall-cycle/main.html` (replaced scaffold with p5.js loader)
- `/Users/dan/Documents/ws/food-science/docs/sims/sourdough-rise-fall-cycle/sourdough-rise-fall-cycle.js` (new — full implementation)
- `/Users/dan/Documents/ws/food-science/docs/sims/sourdough-rise-fall-cycle/index.md` (status → completed, iframe height → 780, bloom level set)
- `/Users/dan/Documents/ws/food-science/docs/sims/sourdough-rise-fall-cycle/metadata.json` (completion_status, bloomLevel, bloomVerb)

## Layout Review

**Reviewer:** Claude Vision (Opus 4.7)
**Iframe height:** 780 px
**Cycles:** 2 of 3 used

### Cycle 1 — Initial capture

Defects found:

- **Jar clipped at top of section.** Quote: jar rim flush with section panel top border; only the upper centimeter of glass is visible above the starter.
- **"Rise: %" badge hidden / cut off.** The jar geometry extended past `topSectionH = 210`, pushing the badge into the next section.
- **Info-panel yeast & acid bars overflow right edge.** Bars extended past the white info panel because `infoW = canvasWidth - infoX - margin - 4` started too far right after a 100-px gap to the water glass.
- **Float-test "FAILS (sinks)" badge clipped** below water glass for the same reason as the jar — total height of jar + 6-px gap + 22-px badge exceeded the section panel.

### Edits applied

- `sourdough-rise-fall-cycle.js:2` — `CANVAS_HEIGHT` comment updated 720 → 760.
- `sourdough-rise-fall-cycle.js:9-10` — `topSectionH` 210 → 250, `graphSectionH` 270 → 290 to give jar + badge breathing room and keep total canvas under iframe.
- `sourdough-rise-fall-cycle.js` (drawJarSection) — jar geometry tightened: `jarY 64 → 72`, `jarW 130 → 110`, `jarH` switched from `topSectionH - 36` (was 174) to fixed `130` so badge and jar both fit inside the section.
- `sourdough-rise-fall-cycle.js` (drawJarSection) — float-test glass narrowed (`glassW 110 → 90`, `glassH jarH-50 → jarH-30`) and info panel `infoY` lifted by 12 px so it spans the full section vertically.
- `sourdough-rise-fall-cycle.js` (drawJarInfo) — replaced derived `topSectionH - 70` panel height with explicit `panelH = 184` so internal content (bars at y+108 and y+132) always lands inside the panel border.

### Cycle 2 — Re-capture

All four FAILs resolved:

- Jar sits cleanly inside the top section with rim, body, bubbles, dashed start-line marker, and the green/red/yellow "Rise: 31%" zone-colored badge all visible.
- Float-test water glass, sinking blob, and "FAILS (sinks)" badge all visible.
- Info panel right side fits yeast (42%) and acid (18%) progress bars within the white panel; no overflow.
- Activity graph zones, curve, current-time marker (dashed orange line + dot), and yeast/acid vertical bars all render cleanly.
- Controls below the canvas (Temperature, Flour Type, Feed Starter, Pause, Speed slider) align with their labels and value readouts.

### Final state

**Clean.** No remaining defects. Iframe height 780 px contains the full 760-px canvas plus the `<br/>` and Back-to-Documentation link with no scroll. Stopped at cycle 2 (under 3-cycle limit).

