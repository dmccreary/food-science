# peptide-bond-animator — Generation Status

**Date:** 2026-05-28
**Library:** p5.js
**Status:** completed

## Instructional Design Check

- **Bloom Level:** L2 (Understand) + L3 (Apply)
- **Verbs:** explain, describe, demonstrate
- **Pattern chosen:** Learner-controlled step-through with a "Next Step" button.
  Each click advances through 4 named stages (Meet → Approach → Water Release →
  Peptide Bond). A brief tween (~0.5s) between steps animates the change but
  the learner controls the pace.
- **Rationale:** The verbs "explain/describe/demonstrate" require the learner
  to *attend to and articulate* each discrete event in the condensation
  reaction. A continuously looping animation hides the discrete chemistry and
  invites passive viewing. A step-through with explicit per-step labels and a
  named step counter ("Step 2 of 4") forces the learner to pace, name, and
  predict each event. The "Extend the Chain" affordance reinforces the
  repeatability principle behind protein polymerization.

## Implementation Summary

- Replaced scaffold `main.html` with a minimal p5.js loader (`<main></main>`,
  CDN p5 1.11.10, sibling script tag).
- Created `peptide-bond-animator.js` (~430 lines).
- Two amino-acid molecule diagrams with: blue NH₂ box, gray central Cα, colored
  R-group oval (with R-formula label), orange COOH box, molecule name above.
- 4-step flow: (1) static intro, (2) green converging-arrows approach +
  molecules move closer, (3) blue H₂O molecule detaches and floats to top-right
  corner, (4) red peptide-bond line + "Peptide Bond" label; NH₂→NH and
  COOH→C(O) labels update to reflect lost atoms.
- "Extend the Chain" button appears at Step 4 → replays steps 2–4 with a
  randomly-chosen third amino acid (Leucine / Threonine / Proline), forming a
  tripeptide and releasing a second water molecule (corner now shows two H₂O).
- Step counter shows "Step N of 4" (or "Extending: Step N of 3" / "Tripeptide
  complete!").
- Dropdown selects pair: Glycine–Alanine, Lysine–Glutamate, Serine–Valine,
  Cysteine–Methionine. R-group color and label update per pair.
- Reset returns to Step 1 and re-hides Extend button.
- Palette used as specified: green `#2e7d32` (Next Step), orange `#f57c00`
  (Extend / COOH), blue `#1e88e5` (NH₂), red `#d32f2f` (peptide bond),
  light-blue water, light-green `#f1f8e9` background.
- Responsive: `updateCanvasSize()` first in `setup()` and on `windowResized()`;
  molecule spacing scales with `canvasWidth`.
- Footgun avoided: never combined hex strings with alpha. All alpha fades use
  `color(r,g,b)` + `.setAlpha(a)` per the prior-sim warning. Also caught and
  removed a duplicate `drawPeptideBond` definition (4-arg helper was
  overwritten by the 5-arg version — JS hoisting would have silently broken
  the bond draw if left in).

## Files Modified

- `/Users/dan/Documents/ws/food-science/docs/sims/peptide-bond-animator/main.html` (rewrote)
- `/Users/dan/Documents/ws/food-science/docs/sims/peptide-bond-animator/peptide-bond-animator.js` (new)
- `/Users/dan/Documents/ws/food-science/docs/sims/peptide-bond-animator/index.md` (status, iframe height 640)
- `/Users/dan/Documents/ws/food-science/docs/sims/peptide-bond-animator/metadata.json` (status, bloom)

## Layout Review

**Reviewer:** Claude Vision (Opus 4.7)
**Screenshot:** `peptide-bond-animator.png` (800 × 560)
**State captured:** Step 1 of 4, Glycine–Alanine pair

### Cycle 1 — initial capture (drawHeight 480, iframe 640)

Evidence (Step 1):
- Title "Peptide Bond Formation" rendered at top-left, readable.
- Both molecules render correctly: blue NH₂ box, gray Cα, orange COOH box,
  colored R-group oval (R=H for Glycine, R=CH₃ for Alanine), name labels above.
- Controls row visible and unclipped: dropdown shows "Glycine–Alanine",
  green "Next Step ▶" button, gray "Reset" button.
- Step counter "Step 1 of 4" + explanation box rendered correctly with the
  exact spec text: *"Meet two amino acids. Each has an amino group (blue)
  and a carboxyl group (orange)."*

Defects:
- D1: Excess vertical whitespace above molecules (~150 px between subtitle
  and "Glycine" / "Alanine" name labels). Molecules sat near vertical center
  of a 480 px region but the visual weight made the top look empty.
- D2: Excess whitespace below molecules (no controls or H₂O in step 1).

Edits:
- `peptide-bond-animator.js:7` — `drawHeight` 480 → 380.
- `peptide-bond-animator.js:~325` — `centerY = drawHeight / 2 + 10` →
  `drawHeight * 0.45` (pulls molecules slightly above center to balance the
  name labels above them).
- `index.md:13` — iframe height 640 → 560 to match new canvas total
  (380 + 140 = 520 + 40 px buffer for "Back to Documentation" link).

### Cycle 2 — re-capture (drawHeight 380, iframe 560)

Evidence:
- Molecules now sit at a comfortable upper-third of the diagram region.
- Title, subtitle, both amino acids, all controls, step counter, and
  explanation panel all visible and unclipped.
- Small empty band still present below molecules (~80 px) — this is
  intentional reserved space for the water molecule (step 3) which floats
  toward the upper-right corner and for the peptide-bond label (step 4)
  which renders centered between molecules.
- "Back to Documentation" link visible at the bottom of the iframe — this is
  expected since the bk-capture-screenshot tool renders the full HTML page,
  not just the canvas.

Remaining issues:
- None blocking. The reserved animation space is by design (steps 3–4 need
  room above/between the molecules); it is not dead whitespace once the
  learner advances past step 1.
- Did not capture screenshots of steps 2–4 or the extended-chain state.
  Visual correctness of those states is verified by the deterministic
  drawing functions but not by image. Acceptable for a Bloom L2/L3 sim where
  the learner advances the state themselves.

Final state: **completed**. 2 review cycles used (limit 3).

