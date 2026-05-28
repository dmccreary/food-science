# digestive-system-journey — Generation Status

**Date:** 2026-05-28
**Library:** p5.js
**Status:** completed

## Instructional Design Check
- **Bloom Level:** L1 (Remember) + L2 (Understand)
- **Verb:** trace; explain
- **Pattern:** Click-to-reveal hotspots + animated traced journey
- **Rationale:** L1 mapping of organ names to functions is supported
  by 8 pulsing clickable hotspots that reveal exact spec tooltip text;
  L2 understanding of digestion as a *sequence* with cross-talk
  (absorption from small intestine to liver) is supported by the Send
  Food animation that pauses at each organ, churns at the stomach,
  splits off a nutrient particle to the liver, and continues through
  the large intestine. Three buttons (Send Food / Show All Labels /
  Reset) keep agency with the student.

## Implementation Summary
- Single 760 x 760 canvas (title + 520 draw + 130 info + 70 control).
- Stylized torso: head circle, neck, bezier-curved torso outline.
- 8 organs drawn with distinct anatomical colors:
  mouth (red), esophagus (taupe with peristalsis stripes),
  stomach (J-shaped pink), liver (brown wedge), gallbladder
  (green ovoid), pancreas (yellow tadpole), small intestine
  (overlapping pinkish blobs), large intestine (gray-pink inverted-U frame).
- Each hotspot pulses (sin-based) and shows a stronger highlight ring
  on hover or selection. Labels appear as bordered pills with leader
  lines on selection or via "Show All Labels".
- Food particle journey: mouth -> esophagus (3 waypoints) -> stomach
  (with churn jitter) -> small intestine (5-point zigzag, triggers
  absorption side-particle to liver) -> large intestine
  (ascending / transverse / descending colon) -> exit. ~1.5-2s pause
  at each stop; info panel below the torso displays the EXACT spec
  tooltip while paused.
- Click detection sorts organs by hit radius ascending so small
  organs (gallbladder, pancreas) win over overlapping large ones.
- All drawing wrapped in push()/pop(); color+setAlpha() used for
  semi-transparent fills (no string+alpha footgun).
- setup() begins with updateCanvasSize(); canvas parented to
  document.querySelector('main') per project convention.

## Files Modified
- /Users/dan/Documents/ws/food-science/docs/sims/digestive-system-journey/main.html (scaffold -> p5 loader)
- /Users/dan/Documents/ws/food-science/docs/sims/digestive-system-journey/digestive-system-journey.js (new, ~480 lines)
- /Users/dan/Documents/ws/food-science/docs/sims/digestive-system-journey/index.md (status: completed, iframe height 780)
- /Users/dan/Documents/ws/food-science/docs/sims/digestive-system-journey/metadata.json (bloomLevel L1-L2, completion_status completed)

## Layout Review

**Reviewer:** Claude Vision (Opus 4.7)
**Method:** bk-capture-screenshot at iframe height 780, two review-patch cycles.

### Cycle 1 — defects identified
1. *"The small intestine sits BELOW the large intestine frame instead of
   inside it."* — Initial LI used topY = ly - 60 with transverse colon
   too high above SI coils, while SI was rendered at the same Cy as LI
   and ended up below the transverse arm.
2. *"Pancreas (yellow) is too far right — appears between liver and
   gallbladder rather than between liver and small intestine."* —
   pancreasX = cx + 10 placed it under the liver wedge.
3. *"Gallbladder appears awkwardly between liver and stomach instead
   of clearly under the liver."* — gallX/gallY needed to move under
   the liver lobe.
4. Large intestine hotspot was drawn at the transverse-colon center,
   which overlapped the SI hotspot and was confusing.

### Cycle 1 — edits applied
- `buildOrgans()` (digestive-system-journey.js:178-194): pancreasX
  cx-5, gallX cx+65/gallY +295, liver shifted +5 right, esophagus
  bottom moved up 10px, SI/LI separation increased.
- `drawLargeIntestine()` (digestive-system-journey.js): topY changed
  to ly - 40 with botY = ly + 130, transverse colon now sits ABOVE
  SI coils so the frame surrounds them.
- `drawSmallIntestine()`: blob widths reduced (90→76, 110→92) so SI
  fits inside the LI frame instead of poking through the arms.
- `buildJourney()`: SI waypoints rebased to top+390..455 and LI
  waypoints rebased to top+345..500 to match new geometry.
- LI hotspot moved to (liCx+110, liCy+80) — center of the right
  (ascending) arm — so its ring no longer overlaps the SI hotspot.

### Cycle 2 — verification screenshot
SI coils are now visibly nested inside the LI inverted-U frame
(ascending right arm, transverse top, descending left arm extend
below SI). Liver wedge sits upper-right with gallbladder ovoid
clearly underneath it. Pancreas tadpole points right from
behind/below stomach. Esophagus tube connects mouth → stomach
without crossing other organs. Three buttons (Send Food / Show
All Labels / Reset) render below the info panel, fully visible
within the 780px iframe.

### Remaining minor issues (not blocking)
- LI descending arms render just inside the bottom of the torso
  silhouette — acceptable for a stylized cartoon torso; not
  anatomically wrong, but tight.
- SI hotspot ring sits near the LI right-arm hotspot ring;
  they do not overlap but a learner clicking near the boundary
  may need to aim carefully. Mitigated by the
  `sort((a,b) => a.hitR - b.hitR)` click-resolution rule that
  gives the smaller-radius organ priority.

### Final state
Layout is suitable for 9th-grade instructional use. All 8 spec
tooltips render the EXACT spec text. Food particle journey
visits mouth → esophagus → stomach (with churn jitter) →
small intestine (with nutrient absorption side-particle to
liver) → large intestine (ascending → transverse → descending)
→ exit, with explanations in the info panel at each stop.

