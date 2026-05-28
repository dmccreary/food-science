# water-solvent-explorer — Generation Status

**Date:** 2026-05-28
**Library:** p5.js
**Status:** completed

## Instructional Design Check
- **Bloom Level:** Understand (L2) with embedded Remember (L1)
- **Verb:** classify + explain
- **Pattern:** Drag-to-classify with immediate per-card explanation feedback; reveal-on-completion summary of the "like dissolves like" rule
- **Rationale:** Students must commit to a binary classification (predict before observe), then receive a molecular-level explanation tying the outcome to substance type (ionic / polar / nonpolar). Wrong attempts produce a shake + targeted hint without consuming the slot — supports retry without penalty. Animation is confined to (a) subtle background water-molecule drift in the tank (sets context of "polar solvent") and (b) brief breaking-apart fragments on correct drops (concrete visualization of dissolution at the molecular scale). No gratuitous motion.

## Implementation Summary
- 700×560 canvas split into three panels: left water tank with 14 animated bent H2O molecules (red O, white H, bond angle ~104.5°), center substance tray with 5 draggable cards (Salt / Sugar / Olive Oil / Vitamin C / Butter, color-coded type pills: ionic=purple, polar=blue, nonpolar=orange), right two-zone drop area (Dissolves ✓ blue / Does Not Dissolve ✗ orange) with hover-highlight while dragging.
- Correct drop: card snaps into 2-column grid inside chosen zone, gets green border + ✓ badge, breaking-apart fragment animation (Na+/Cl- for ionic, water-blue dots for polar), and a wrapped one-line molecular explanation under the card.
- Wrong drop: 30-frame shake + 3-second red hint bubble above the home slot; card returns home so the student can retry without losing progress.
- Reset button (styled green) clears all placements.
- Summary overlay appears when all 5 are correctly sorted: lists the rule "like dissolves like" and groups the substances by category.
- Responsive: `updateCanvasSize()` first line of `setup()` and `windowResized()`; preserves placed-card state across resize.
- Palette: project green `#2e7d32` for correct/primary, orange `#f57c00` for nonpolar/does-not zone, water blue `#1e88e5`, light bg `#f1f8e9`.

## Files Modified
- /Users/dan/Documents/ws/food-science/docs/sims/water-solvent-explorer/main.html (replaced scaffold with p5.js loader)
- /Users/dan/Documents/ws/food-science/docs/sims/water-solvent-explorer/water-solvent-explorer.js (new, ~520 lines)
- /Users/dan/Documents/ws/food-science/docs/sims/water-solvent-explorer/index.md (status → completed, bloom_level → Understand, iframe height → 562, scrolling="no")
- /Users/dan/Documents/ws/food-science/docs/sims/water-solvent-explorer/metadata.json (completion_status, bloomLevel, bloomVerb)

## Layout Review

**Reviewer:** Claude Vision (Opus 4.7)
**Screenshot:** docs/sims/water-solvent-explorer/water-solvent-explorer.png (800×562)
**Iframe height:** 562

### Cycle 1
Walked visual-checklist.md sections 1–6.

**FAILs:**
- None of the structural checklist items failed (1.1–1.5 PASS, 2.x PASS, 3.1–3.3 PASS, 4.x PASS, 6.x PASS).
- **Spec fidelity gap (not a strict layout FAIL but worth fixing):** Spec calls for "blue bent shapes with δ– and δ+ labels on each end." The 14 drifting water molecules render the bent shape and partial-charge geometry correctly but do not show the δ–/δ+ text labels — at 14–18px ambient size, labels would be illegible and visually noisy if drawn on every molecule.

**Edits:**
- `water-solvent-explorer.js:drawLeftPanel()` — added a hero water molecule (size 30) in the bottom-left corner of the tank with `showLabels=true` so δ– appears above the O atom and δ+ below each H atom; added an italic caption "Bent shape = polar molecule" next to it. This satisfies the spec's labeling requirement without polluting the ambient animation.

### Cycle 2
Re-captured at 562px. Walked checklist again.

**Result:** All FAILs from cycle 1 resolved.
- Hero molecule and δ–/δ+ labels render legibly in the lower-left of the tank.
- No new FAILs introduced (caption text fits within panel, no overlap with drifting molecules, contrast adequate).

### Final State
**Clean.** All checklist items PASS or N/A. The sim accurately represents:
- Water tank with bent H2O molecules drifting + a labeled legend molecule (δ–/δ+ partial charges)
- 5 substance cards color-coded by type (ionic / polar / nonpolar pills)
- Two-zone drop area with hover affordance and check/cross icons
- Project palette: green primary, orange accent for nonpolar zone

Stopped after 2 cycles (budget allowed 3). No residue.

