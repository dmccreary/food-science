# Learning Graph Generator Session Log

**Skill version:** 0.05  
**Date:** 2026-05-27  
**Project:** Food Science for 9th Grade  
**Repository:** https://github.com/dmccreary/food-science  

---

## Step 0 — Setup

Verified project structure: `mkdocs.yml` and `docs/` present. `docs/learning-graph/`
already existed from `init-textbook` scaffold.

Copied Python tools from skill package to `docs/learning-graph/`:

| Tool | Version used |
|------|-------------|
| `analyze-graph.py` | (from skill v0.05 package) |
| `csv-to-json.py` | v0.04 |
| `add-taxonomy.py` | (from skill v0.05 package) |
| `taxonomy-distribution.py` | (from skill v0.05 package) |
| `index-template.md` | (from skill v0.05 package) |

---

## Step 1 — Course Description Quality Check

Read YAML frontmatter of `docs/course-description.md`:

```yaml
quality_score: 98
```

Score 98 ≥ 85 → skipped full re-assessment to save tokens. Proceeded directly
to concept generation.

---

## Step 2 — Concept List Generation

Generated 235 concepts across 14 topic areas. All labels in Title Case,
all ≤ 32 characters.

**Distribution by topic area:**

| Range | Topic Area | Count |
|-------|-----------|-------|
| 1–10 | Foundational Science Skills | 10 |
| 11–30 | Food Chemistry | 20 |
| 31–48 | Cooking Science and Heat Transfer | 18 |
| 49–75 | Baking Science (inc. sourdough) | 27 |
| 76–95 | Food Microbiology | 20 |
| 96–112 | Food Safety and Sanitation | 17 |
| 113–132 | Nutrition Science | 20 |
| 133–148 | Food Preservation | 16 |
| 149–164 | Sensory Science | 16 |
| 165–180 | Food Technology and Processing | 16 |
| 181–195 | Agricultural Systems and Sustainability | 15 |
| 196–215 | Local Food Systems and Farm-to-Table | 20 |
| 216–225 | Global Food Cultures | 10 |
| 226–235 | Food Engineering and Innovation | 10 |

**Output:** `docs/learning-graph/concept-list.md`

**Bug caught:** During initial CSV generation, concept 215 (Local Sourcing in
Schools) had a self-dependency (215|206|207 instead of 206|207). Fixed before
running the analyzer.

---

## Step 3 — Dependency Graph CSV

Generated `docs/learning-graph/learning-graph.csv` with columns:
`ConceptID, ConceptLabel, Dependencies, TaxonomyID`

Dependencies are pipe-delimited ConceptIDs representing prerequisite concepts.
TaxonomyID was added during initial CSV creation (combined Steps 3 and 6).

**Key dependency design decisions:**

- **25 foundational concepts** with no dependencies: Scientific Method,
  Atoms and Molecules, Water Molecule Structure, pH Scale, Carbohydrates
  Overview, Proteins in Food Chemistry, Lipids Overview, Heat Transfer
  Fundamentals, Bacteria Cell Structure, Yeast Cell Structure, Fermentation
  Overview, Temperature Danger Zone, Foodborne Illness Overview,
  Macronutrients Overview, Micronutrients Overview, Food Preservation
  Principles, Five Basic Tastes, Industrial Food Production, Food Additives
  Overview, Farm-to-Table Concept, Food System Components, Post-Harvest
  Plant Physiology, NOVA Classification System, Food Culture and Climate,
  Food Engineering Principles.

- **Cross-domain dependencies** deliberately created where topics
  interconnect: e.g., Sourdough Starter Ecosystem (BAKE) depends on
  Bacteria Cell Structure and Lactic Acid Fermentation (MICR); Pasteurization
  (PROC) depends on Bacteria Cell Structure and Temperature Danger Zone
  (SAFE); Nutrient Loss During Transit (LOCL) depends on Micronutrients
  Overview (NUTR) and Post-Harvest Plant Physiology (LOCL).

- **Longest learning path (8 steps):** Atoms and Molecules in Food →
  Chemical Bonds → Hydrogen Bonding → Water as Universal Solvent →
  Wild Yeast Capture → Sourdough Starter Ecosystem → Sourdough Feeding
  Ratio → Sourdough Starter Float Test.

---

## Step 4 — Graph Quality Validation

Ran: `python analyze-graph.py learning-graph.csv quality-metrics.md`

**Results:**

| Metric | Value | Status |
|--------|-------|--------|
| Total concepts | 235 | — |
| Valid DAG | Yes | ✅ |
| Cycles detected | 0 | ✅ |
| Self-dependencies | 0 | ✅ |
| Orphaned nodes | 0 | ✅ |
| Connected components | 1 | ✅ |
| Foundational concepts | 25 (10.6%) | ✅ |
| Terminal nodes | 133 (56.6%) | ⚠️ |
| Avg dependencies/concept | 1.87 | — |
| Max chain length | 8 | — |

**Top indegree concepts** (most depended-upon):

| Rank | Concept | Indegree |
|------|---------|---------|
| 1 | Food System Components | 20 |
| 2 | Heat Transfer Fundamentals | 19 |
| 3 | Bacteria Cell Structure | 17 |
| 4 | Micronutrients Overview | 17 |
| 5 | Macronutrients Overview | 14 |

**Note on terminal node percentage (56.6%):** This is above the 5–40%
"healthy range" flagged by the analyzer. The root cause is the breadth of
the course: 14 distinct topic areas, many of which end in specialized
concepts (e.g., Kombucha Science, Freeze-Drying Process, 3D Food Printing)
that don't feed forward into other concepts within this 9th-grade scope.
This is pedagogically defensible for a survey course — the terminal nodes
are valid curriculum endpoints, not quality defects. Future iterations
could add more cross-topic capstone concepts to reduce this percentage.

**Output:** `docs/learning-graph/quality-metrics.md`

---

## Step 5 — Concept Taxonomy

Created 14 taxonomy categories matching the 14 topic areas of the course
description. No category exceeds 30%.

**Output:** `docs/learning-graph/concept-taxonomy.md`

**Color assignments:**

| TaxonomyID | Name | Color |
|-----------|------|-------|
| FOUND | Foundational Science Skills | SteelBlue |
| CHEM | Food Chemistry | DarkSlateBlue |
| COOK | Cooking Science and Heat Transfer | Crimson |
| BAKE | Baking Science | DarkGoldenrod |
| MICR | Food Microbiology | DarkGreen |
| SAFE | Food Safety and Sanitation | DarkRed |
| NUTR | Nutrition Science | Teal |
| PRES | Food Preservation | MediumPurple |
| SENS | Sensory Science | HotPink |
| PROC | Food Technology and Processing | Orange |
| AGRI | Agricultural Systems and Sustainability | OliveDrab |
| LOCL | Local Food Systems and Farm-to-Table | LimeGreen |
| GLOB | Global Food Cultures | Peru |
| INNO | Food Engineering and Innovation | DodgerBlue |

---

## Step 5b — Taxonomy Names JSON

**Output:** `docs/learning-graph/taxonomy-names.json`

All 14 taxonomy IDs mapped to human-readable names. No missing-name warnings
were emitted by `csv-to-json.py`.

---

## Step 6 — Taxonomy Added to CSV

TaxonomyID column was included in the initial CSV generation (Steps 3 and 6
combined). No separate `add-taxonomy.py` run needed.

---

## Step 7 — Metadata JSON

**Output:** `docs/learning-graph/metadata.json`

Fields: title, description, creator (Dan Mccreary), date (2026-05-27),
version (1.0), format (Learning Graph JSON v1.0), schema URL, license
(CC BY-NC-SA 4.0 DEED).

---

## Step 8 — Color Configuration JSON

**Output:** `docs/learning-graph/color-config.json`

14 taxonomy IDs mapped to CSS named colors from the recommended 24-color
distinct palette. Stable across regenerations.

---

## Step 9 — Complete JSON Generation

Ran: `python csv-to-json.py learning-graph.csv learning-graph.json color-config.json metadata.json taxonomy-names.json`

**Results (csv-to-json v0.04):**

- 14 groups/taxonomies (all with human-readable classifierName)
- 235 nodes
- 392 edges
- 25 foundational concepts (box-shaped in vis-network)
- 0 missing taxonomy name warnings

**Output:** `docs/learning-graph/learning-graph.json`

---

## Step 10 — Taxonomy Distribution Report

Ran: `python taxonomy-distribution.py learning-graph.csv taxonomy-distribution.md`

All 14 categories in range 4.3%–11.5%. No category exceeds 30%. Spread of
7.2 percentage points — excellent balance.

**Output:** `docs/learning-graph/taxonomy-distribution.md`

---

## Step 11 — Learning Graph index.md

Created `docs/learning-graph/index.md` from `index-template.md` with
"TEXTBOOK_NAME" replaced by "Food Science for 9th Grade" and updated
statistics (235 concepts, 25 foundational concepts, 14 categories).

Added `**/index-template.md` to `exclude_docs` in `mkdocs.yml` to suppress
the nav-orphan warning.

---

## Step 12 — mkdocs.yml Navigation Update

Added to Learning Graph section:

```yaml
- Learning Graph:
    - Introduction: learning-graph/index.md
    - Course Description Assessment: learning-graph/course-description-assessment.md
    - Concept List: learning-graph/concept-list.md
    - Concept Taxonomy: learning-graph/concept-taxonomy.md
    - Graph Quality Analysis: learning-graph/quality-metrics.md
    - Taxonomy Distribution: learning-graph/taxonomy-distribution.md
```

Final `mkdocs build --strict` result: **0 errors, 0 warnings** (0.36 s).

---

## Files Created This Session

```
docs/learning-graph/concept-list.md
docs/learning-graph/learning-graph.csv
docs/learning-graph/concept-taxonomy.md
docs/learning-graph/taxonomy-names.json
docs/learning-graph/color-config.json
docs/learning-graph/metadata.json
docs/learning-graph/learning-graph.json
docs/learning-graph/quality-metrics.md
docs/learning-graph/taxonomy-distribution.md
docs/learning-graph/index.md             (updated from template)
docs/learning-graph/analyze-graph.py     (copied from skill)
docs/learning-graph/csv-to-json.py       (copied from skill)
docs/learning-graph/add-taxonomy.py      (copied from skill)
docs/learning-graph/taxonomy-distribution.py (copied from skill)
docs/learning-graph/index-template.md    (copied, excluded from nav)
logs/learning-graph-generator-0.05-2026-05-27.md  (this file)
```

---

## Recommended Next Steps

1. **Review** `docs/learning-graph/concept-list.md` — add, remove, or rename
   concepts before generating chapter content. Changes at this stage are cheap;
   changes after chapter generation are expensive.

2. **Install the graph viewer** — run `/book-installer` and select option 23
   (Learning Graph Viewer) to create `docs/sims/graph-viewer/` with an
   interactive vis-network visualization of `learning-graph.json`.

3. **Run `/book-chapter-generator`** — design the chapter structure. Review the
   chapter outlines and concept assignments carefully before running
   `/chapter-content-generator` (chapter content generation consumes many
   tokens).

4. **Priority MicroSims to build** (run `/microsim-generator`):
   - Sourdough starter growth curve (rise/fall, lactic vs. acetic acid)
   - Bacterial growth curve (lag/log/stationary/death phases)
   - Post-harvest vitamin degradation over time and temperature
   - NOVA food classification interactive sorter
   - pH scale with food examples
   - Maillard reaction step-by-step
