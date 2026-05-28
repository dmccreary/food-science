# Book Chapter Design Log

**Skill:** book-chapter-generator  
**Date:** 2026-05-27  
**Project:** Food Science for 9th Grade  
**Total concepts:** 241 (across 14 taxonomy categories)  
**Final chapter count:** 15  

---

## Input Resources

- `docs/course-description.md` — quality score 98, 15 main topics, full Bloom's Taxonomy
- `docs/learning-graph/learning-graph.json` — 241 nodes, 405 edges, valid DAG
- `docs/learning-graph/concept-taxonomy.md` — 14 categories: FOUND, CHEM, COOK, BAKE, MICR, SAFE, NUTR, PRES, SENS, PROC, AGRI, LOCL, GLOB, INNO

---

## Chapter Design Decisions

### Decision 1: Chapter Count — 15 chapters

**Options considered:** 12, 14, 15, 16  
**Chosen:** 15  
**Reasoning:** The 14 taxonomy categories map almost one-to-one to chapters. BAKE was large enough to split into two chapters (baking science fundamentals + sourdough deep-dive), giving 15 natural units. At ~241 concepts, 15 chapters yields an average of ~16 concepts per chapter — comfortably within the 8–25 optimal range. Fewer chapters would have produced overloaded chapters; more would have produced artificially thin ones.

---

### Decision 2: Chapter 1 — Science in the Kitchen (FOUND + 3 CHEM)

**Concepts:** 13 (FOUND 1–10 + CHEM concepts: Atoms and Molecules in Food, pH Scale, Water Molecule Structure)  
**Reasoning:** The FOUND taxonomy has 10 concepts covering scientific method, lab safety, measurement, and experimental design — exactly the right content for the opening chapter of a lab-based course. Three foundational CHEM concepts (atoms/molecules, water structure, pH scale) were pulled forward from Ch2 because they appear in Chapter 1's course description and have zero dependencies of their own. This gives the chapter 13 concepts (slightly below optimal) but the pedagogical fit outweighed the size concern — students need these chemistry anchors before any food science content.

---

### Decision 3: BAKE Split into Chapters 5 and 6

**Options considered:** One large baking chapter (27 concepts), two chapters (18 + 9)  
**Chosen:** Split — Ch5 Baking Science (18 concepts) and Ch6 Sourdough and Wild Fermentation (9 concepts)  
**Reasoning:** The baking taxonomy (BAKE) had 27 concepts total — at the hard upper limit for a single chapter and too cognitively dense for a 9th-grade audience covering gluten, leavening, and microbiology simultaneously. The sourdough concepts (67–75) form a coherent multi-week lab project with their own microbiology prerequisites (LAB, wild yeast) that are better framed as a distinct unit after students have both baking fundamentals and microbiology. The 9-concept Chapter 6 is below the optimal minimum but is justified as a standalone lab-project chapter rather than a survey chapter.

---

### Decision 4: MICR (Chapter 4) Before BAKE (Chapter 5) — Counterintuitive Ordering

**Problem:** In a cooking course, placing food microbiology before baking science feels counterintuitive. Most food science curricula sequence baking before microbiology.  
**Resolution:** Dependency analysis was decisive. Concept 53 (Yeast Biology in Baking) has hard dependencies on concept 76 (Bacteria Cell Structure) and concept 82 (Yeast Cell Structure), both in the MICR taxonomy. Placing baking before microbiology would violate the DAG — students cannot understand yeast fermentation in baking without first understanding yeast cell biology. The microbiology-first order is pedagogically sound: students learn what yeast *is* before they learn what yeast *does* in dough.

---

### Decision 5: Chapter 7 Food Safety After Microbiology (Not Earlier)

**Options considered:** Place food safety in Chapter 2 or 3 (common in culinary programs), or after microbiology.  
**Chosen:** Chapter 7, after MICR (Ch4)  
**Reasoning:** Food safety concepts — particularly pathogen identification, HACCP critical control points, and temperature danger zone science — depend on understanding bacterial growth curves, lag/log/stationary phases, and how pathogens behave. Teaching HACCP without the microbiology foundation reduces it to memorization. Placing food safety at Chapter 7 allows genuine scientific explanations rather than rules-only instruction.

---

### Decision 6: Nutrition Science (Chapter 8) Positioning

**Options considered:** Early (after Ch2 chemistry), middle (Ch7–9), or late.  
**Chosen:** Chapter 8  
**Reasoning:** Nutrition science requires understanding macromolecule chemistry (Ch2), what heat does to proteins and starches (Ch3), and microbial contributions to digestion via the gut microbiome (Ch4). Placing nutrition at Chapter 8 means all three prerequisite areas are covered. Pulling it earlier would require forward references or oversimplified explanations of metabolism and nutrient absorption.

---

### Decision 7: Chapters 11–13 Ordering — Processing → Agriculture → Farm-to-Table

**Options considered:** Agriculture → Processing → Farm-to-Table, or Farm-to-Table → Agriculture → Processing  
**Chosen:** Processing (Ch11) → Agriculture (Ch12) → Farm-to-Table (Ch13)  
**Reasoning:** Chapter 13 (Farm-to-Table) explicitly critiques the industrial food system and long supply chains, which requires students to already understand both how industrial processing works (Ch11) and how agricultural systems and post-harvest handling affect freshness (Ch12). Presenting the critique before the underlying science would be advocacy without evidence. The chosen order lets students form their own informed judgments.

---

### Decision 8: GLOB Taxonomy Reduced to 10 Concepts (Chapter 14)

**Problem:** The GLOB taxonomy (global food cultures) had only 10 concepts — the smallest chapter in the book.  
**Options considered:** Merge with Ch13 Farm-to-Table (creating a 30-concept mega-chapter), merge with Ch15 Innovation, or keep standalone.  
**Chosen:** Standalone Chapter 14  
**Reasoning:** Global food cultures is a distinct thematic unit that does not naturally merge with local food systems (Ch13) or engineering (Ch15). A 10-concept chapter is thin but acceptable for a survey/capstone-adjacent topic at the end of the year when students are also completing their hydroponics project. Merging would dilute both units. The chapter functions as a reflective broadening of perspective before the capstone chapter.

---

### Decision 9: Chapter 15 as Capstone — Hydroponics + Innovation

**Design:** Combined the INNO taxonomy concepts (226–241, including the 6 hydroponics concepts added in a separate session) into a single capstone chapter.  
**Reasoning:** The hydroponics project was explicitly requested as a semester-long class project. Placing hydroponics concepts in the final chapter aligns the written curriculum with the actual class timeline — students learn hydroponics theory in Ch15 while their physical garden has been growing throughout the second semester. The chapter also includes food engineering futures content (3D printing, precision fermentation, personalized nutrition) as intellectual bookends to the year's journey from basic kitchen science to cutting-edge food technology.

---

### Decision 10: Chapter 13 Concept Count (20) — Largest Chapter

**Problem:** The LOCL taxonomy combined with relevant PROC/AGRI spillover concepts produced 20 concepts — above the 12–18 optimal range but within the 8–25 acceptable range.  
**Reasoning:** The farm-to-table and local food systems content was intentionally expanded by the user (via the course description session) to cover supply chain critique, food deserts, food equity, and carbon footprint of diet. These concepts form a tight thematic unit that would lose coherence if split. A 20-concept chapter is manageable at the 9th-grade level when the concepts are all applied/real-world rather than abstract chemistry.

---

## Dependency Validation

Edge direction verified before chapter design: `prereqs[edge['from']].add(edge['to'])` — edges run from dependent concept to prerequisite concept. 

Foundational concepts (0 dependencies) confirmed as simple introductory terms:
- Scientific Method, Lab Measurement Units, Laboratory Safety, Heat Transfer Fundamentals, Bacteria Cell Structure, Fermentation Overview, Food System Components, etc.

Zero dependency violations in final chapter ordering. All prerequisites appear in earlier chapters.

---

## Final Chapter Map

| Ch | Directory | Title | Concepts | Taxonomy |
|----|-----------|-------|----------|----------|
| 1 | 01-science-in-the-kitchen | Science in the Kitchen | 13 | FOUND + 3 CHEM |
| 2 | 02-molecules-of-food | The Molecules of Food | 17 | CHEM |
| 3 | 03-heat-and-cooking-science | Heat, Cooking Science, and Chemical Reactions | 18 | COOK |
| 4 | 04-food-microbiology | Food Microbiology | 20 | MICR |
| 5 | 05-baking-science | Baking Science | 18 | BAKE |
| 6 | 06-sourdough-wild-fermentation | Sourdough and Wild Fermentation | 9 | BAKE (sourdough subset) |
| 7 | 07-food-safety-sanitation | Food Safety and Sanitation | 17 | SAFE |
| 8 | 08-nutrition-science | Nutrition Science | 20 | NUTR |
| 9 | 09-food-preservation | Food Preservation | 16 | PRES |
| 10 | 10-sensory-science | Sensory Science | 16 | SENS |
| 11 | 11-food-technology-processing | Food Technology and Industrial Processing | 16 | PROC |
| 12 | 12-agricultural-systems | Agricultural Systems and Sustainability | 15 | AGRI |
| 13 | 13-farm-to-table-local-food | The Farm-to-Table Movement and Local Food Systems | 20 | LOCL |
| 14 | 14-global-food-cultures | Global Food Cultures and Food Futures | 10 | GLOB |
| 15 | 15-food-engineering-innovation | Food Engineering, Hydroponics, and Innovation | 16 | INNO |

**Total concepts assigned:** 241  
**Build verification:** `mkdocs build --strict` — 0 warnings, 0 errors  
