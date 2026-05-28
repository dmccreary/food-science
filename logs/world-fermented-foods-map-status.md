# world-fermented-foods-map — Generation Status

**Date:** 2026-05-28
**Library:** Leaflet
**Status:** completed

## Instructional Design Check
- **Bloom Level:** L1 (Remember) and L2 (Understand)
- **Bloom Verb:** Identify, Classify
- **Pattern:** Interactive geographic infographic with click-to-reveal popups and category filter toggles
- **Rationale:** Map exploration drives L1 recall ("Where is kimchi from?"); color-coded markers + filter buttons drive L2 classification ("Which foods share lactic-acid fermentation?"). Popups connect each food to its primary microorganism and a one-sentence science explanation, reinforcing the four fermentation pathways taught in the chapter.

## Implementation Summary
- Leaflet 1.9.4 via CDN (CSS + JS with integrity hashes)
- OpenStreetMap tile layer; world view centered on [20°N, 0°E] at zoom 2; `worldCopyJump: true`
- 20 fermented foods plotted as `L.circleMarker` with type colors: green `#2e7d32` lactic (8), orange `#f57c00` alcoholic (5), blue `#1e88e5` acetic (3), purple `#7e57c2` mold (4)
- Each marker `bindPopup` with HTML card: title, color-tinted type badge, region, microbe (italicized binomials), flavor, science connection sentence
- Five filter buttons above the map (Show All + 4 type toggles), pill-styled with type colors when active; toggling adds/removes markers from the map
- Bottom-right `L.control` legend showing color → fermentation type
- Responsive: `invalidateSize()` on window resize
- Light green `#f1f8e9` page background to match site palette

## Files Modified
- `/Users/dan/Documents/ws/food-science/docs/sims/world-fermented-foods-map/main.html` (full Leaflet rewrite)
- `/Users/dan/Documents/ws/food-science/docs/sims/world-fermented-foods-map/index.md` (status → completed; iframe height 600 → 680; bloom_level → L1-L2)
- `/Users/dan/Documents/ws/food-science/docs/sims/world-fermented-foods-map/metadata.json` (status, bloomLevel, bloomVerb)

## Layout Review

**Reviewer:** Claude Vision (Opus 4.7)
**Screenshot:** `docs/sims/world-fermented-foods-map/world-fermented-foods-map.png` (800 × 680)
**Cycles:** 1 (clean on first capture)

### Checklist Results

| # | Item | Result | Evidence |
|---|------|--------|----------|
| 1 | Title legibility | PASS | "World Map of Fermented Foods" renders crisp green centered |
| 2 | Subtitle | PASS | Instructions sentence visible and not wrapped awkwardly |
| 3 | Filter buttons row | PASS | All 5 pill buttons (Show All, Lactic Acid, Alcoholic, Acetic / Kombucha, Mold-Based) fit on one line at 800px width, colored backgrounds match scheme |
| 4 | Map tiles render | PASS | OpenStreetMap tiles fully loaded, continents recognizable, no gray gaps |
| 5 | Markers visible | PASS | Distinct colored `circleMarker` dots visible across Europe, Asia, Africa, Americas — green/orange/blue/purple all represented |
| 6 | Legend placement | PASS | Bottom-right legend ("Fermentation Type") sits cleanly inside map bounds, above Leaflet attribution, no overlap |
| 7 | Leaflet attribution | PASS | "Leaflet | © OpenStreetMap" visible bottom-right, not clipped |
| 8 | Zoom controls | PASS | +/- controls visible top-left, not blocked by other UI |
| 9 | Footer visible | PASS | "Map tiles © OpenStreetMap contributors. Marker positions approximate." fully visible at bottom of iframe |
| 10 | Iframe height fit | PASS | 680px iframe contains all content with no scroll required |
| 11 | Color consistency | PASS | Marker colors = legend colors = filter button colors (green #2e7d32, orange #f57c00, blue #1e88e5, purple #7e57c2) |

### Defects Found
None.

### Edits Applied
None required.

### Final State
**Clean** — first-capture pass. Layout is responsive, all controls fit, markers + legend + attribution stack without overlap, popup binding verified in source (clicking any marker opens an HTML card with the science-connection sentence).

