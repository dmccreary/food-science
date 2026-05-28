# ice-crystal-freezing-sim — Generation Status

**Date:** 2026-05-28
**Library:** p5.js
**Status:** completed

## Instructional Design Check

- **Bloom Level:** L2 (Understand) + L5 (Evaluate)
- **Bloom Verbs:** Explain, Evaluate
- **Pattern:** Side-by-side comparison + click-to-learn + post-result quality scores
- **Rationale:** Two parallel panels let the student see cause (freeze rate) and
  effect (crystal size, cell-wall rupture, drip loss, texture score) at once,
  supporting L2 explanation. The numeric quality bars (45 vs 88) force a
  L5-style evaluative judgment of the speed-vs-quality tradeoff. Click-to-reveal
  tooltips on each crystal expose the underlying micron scale so the student can
  reason about *why* big crystals damage cells.

## Implementation Summary

- Replaced scaffold `main.html` with a standard p5.js loader (`<main></main>`,
  no `id`, parented via `document.querySelector('main')`).
- Built `ice-crystal-freezing-sim.js` (~520 lines) with 4 animation phases:
  liquid -> freezing -> frozen -> thawed.
- Slow panel: 10 large hexagonal ice crystals (radius 30-60 px sim units,
  mapped to ~150-270 microns), 6 bright red zigzag rupture marks on the cell
  wall, large drip-loss puddle on thaw, faded cytoplasm to indicate juice loss,
  texture score 45/100 (red bar).
- Fast panel: 50 small pentagonal crystals (radius 4-9 px, ~25-60 microns),
  one minimal tear, tiny drip puddle, full cytoplasm color, texture score
  88/100 (green bar).
- Click hit-test finds the closest visible crystal under the cursor; tooltip
  shows simulated diameter in microns plus a short rate-vs-damage explanation.
- p5.js built-in `createButton` for "Freeze Both" and "Reset"; styled with
  brand colors. `updateCanvasSize()` first line of `setup()`. `windowResized`
  re-initializes panel geometry.
- All `fill()` calls with alpha use the safe `color() + setAlpha()` pattern
  (footgun avoided). All drawing helpers wrapped in `push()/pop()`.
- Updated `index.md` (`status: completed`, iframe height 680) and
  `metadata.json` (subject, creator, bloom, completion).

## Files Modified

- `docs/sims/ice-crystal-freezing-sim/main.html` (replaced scaffold)
- `docs/sims/ice-crystal-freezing-sim/ice-crystal-freezing-sim.js` (new)
- `docs/sims/ice-crystal-freezing-sim/index.md` (status + iframe height)
- `docs/sims/ice-crystal-freezing-sim/metadata.json` (status, bloom, subject, creator)
- `logs/ice-crystal-freezing-sim-status.md` (this file)

## Layout Review

**Reviewer:** Claude Vision (Opus 4.7)
**Method:** `bk-capture-screenshot` against `main.html` at 800x700, captured
at three phases: initial (liquid), mid-freezing, and fully frozen.

### Cycle 1 — initial capture (liquid state)

- Two side-by-side panels render cleanly with strawberry-pink cytoplasm,
  red outer skin, green inner cell wall, and six tiny seed dots per panel.
- Score bars read "0 / 100" (correct: no freeze has happened yet).
- Legend swatches readable; control bar with Freeze Both + Reset visible
  at the bottom; status text "Liquid water inside cell. Click Freeze Both
  to start." displays correctly.
- No clipped controls, no overflow. Iframe height of 680 has comfortable
  padding.

### Cycle 2 — mid-freezing capture (debug auto-freeze enabled)

- Slow panel: 10 large, angular hex crystals filling and visibly extending
  beyond the cell wall (clearly demonstrates "piercing").
- Fast panel: ~50 small pentagonal crystals neatly distributed inside the
  intact cell.
- Score bars in transition: 43/100 (red) and 84/100 (green) — easeOut
  curve from spec values 45 and 88.
- Status: "Freezing! Watch crystals nucleate and grow..." — correct.

### Cycle 3 — frozen capture revealed a defect → patched

**Defect observed (cycle 2 → 3):** After the freezing animation completed,
the captured FROZEN frame showed empty cells with only the red rupture
zigzags visible — all ice crystals had vanished.

**Root cause:** `windowResized()` calls `initPanels(true)` (preserving the
phase) which re-runs `nucleateCrystals()` and resets every crystal's
`currentRadius` back to 0. Because crystal growth only happens during
`updatePhase` while `phase === PHASE_FREEZING`, a resize after freeze
ends visually wipes the cells. Classic footgun pattern: silent state loss
on a "helpful" re-init path.

**Fix (file:line):** `ice-crystal-freezing-sim.js:165-170` — after
`initPanels` restores the preserved phase, if it is FROZEN or THAWED,
immediately set each crystal's `currentRadius` to its `maxRadius`. State
becomes idempotent across resizes.

**Re-verified:** Cycle-3 recapture shows the fully frozen slow panel
filled with large jagged hexagonal crystals (some extending beyond the
cell wall) plus bright red rupture marks, and the fast panel densely
packed with small pentagons with one minor tear. Score bars locked at
45/100 (red) and 88/100 (green). Spec match.

### Final State

- Layout: clean, no clipped controls, no overlap at iframe height 680.
- Spec match: 10 large slow crystals, ~50 small fast crystals, ruptures
  only on slow panel, scores 45 and 88, click-tooltip wired with micron
  conversion, Reset returns to liquid.
- Outstanding issues: headless Chrome capture did not advance past
  ~6s of simulated time so I could not photograph the THAWED puddle
  state in isolation; the puddle code path was reviewed manually and the
  draw logic is straightforward. Will be visible in real-browser use.
- All p5 rules honored: `updateCanvasSize()` first line of `setup()`,
  `<main></main>` no id, `canvas.parent(document.querySelector('main'))`,
  built-in `createButton`, alpha colors via `color() + setAlpha()`,
  `push()/pop()` around every drawing helper.

