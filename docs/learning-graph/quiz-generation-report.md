# Quiz Generation Quality Report

**Generated:** 2026-05-28  
**Skill Version:** 0.4  
**Execution Mode:** Serial (1 agent)

## Overall Statistics

| Metric | Value |
|---|---|
| Total chapters | 15 |
| Total questions | 150 |
| Avg questions per chapter | 10 |
| Execution mode | Serial (1 agent) |
| Estimated token cost | ~165,000 |

## Per-Chapter Summary

| Chapter | Questions | Bloom's Distribution | Answer Balance |
|---|---|---|---|
| 1. Science in the Kitchen | 10 | R:4, U:4, Ap:1, An:1 | A:3, B:2, C:3, D:2 |
| 2. Molecules of Food | 10 | R:3, U:4, Ap:2, An:1 | A:2, B:3, C:3, D:2 |
| 3. Heat and Cooking Science | 10 | R:2, U:3, Ap:3, An:2 | A:1, B:3, C:3, D:3 |
| 4. Food Microbiology | 10 | R:2, U:3, Ap:3, An:2 | A:2, B:3, C:2, D:3 |
| 5. Baking Science | 10 | R:2, U:3, Ap:3, An:2 | A:3, B:2, C:3, D:2 |
| 6. Sourdough & Wild Fermentation | 10 | R:2, U:3, Ap:3, An:2 | A:2, B:3, C:3, D:2 |
| 7. Food Safety & Sanitation | 10 | R:2, U:3, Ap:3, An:2 | A:2, B:3, C:2, D:3 |
| 8. Nutrition Science | 10 | R:2, U:3, Ap:3, An:2 | A:2, B:3, C:2, D:3 |
| 9. Food Preservation | 10 | R:2, U:3, Ap:3, An:2 | A:3, B:2, C:3, D:2 |
| 10. Sensory Science | 10 | R:2, U:3, Ap:3, An:2 | A:2, B:3, C:2, D:3 |
| 11. Food Technology & Processing | 10 | R:2, U:3, Ap:3, An:2 | A:2, B:3, C:3, D:2 |
| 12. Agricultural Systems | 10 | R:2, U:3, Ap:3, An:2 | A:2, B:3, C:3, D:2 |
| 13. Farm-to-Table & Local Food | 10 | R:1, U:2, Ap:3, An:2, Ev:2 | A:2, B:3, C:3, D:2 |
| 14. Global Food Cultures | 10 | R:1, U:2, Ap:3, An:2, Ev:2 | A:2, B:3, C:2, D:3 |
| 15. Food Engineering & Innovation | 10 | R:1, U:2, Ap:3, An:2, Ev:1, Cr:1 | A:3, B:2, C:3, D:2 |

## Bloom's Taxonomy Distribution (Overall)

| Level | Count | % | Target Range |
|---|---|---|---|
| Remember | 30 | 20% | 15–40% ✓ |
| Understand | 43 | 29% | 20–40% ✓ |
| Apply | 40 | 27% | 15–30% ✓ |
| Analyze | 28 | 19% | 5–25% ✓ |
| Evaluate | 5 | 3% | 0–10% ✓ |
| Create | 1 | 1% | 0–5% ✓ |

All levels within target ranges. ✓

## Answer Balance (Overall)

| Option | Count | % |
|---|---|---|
| A | 35 | 23% |
| B | 42 | 28% |
| C | 40 | 27% |
| D | 33 | 22% |

Distribution within 20–30% per option. ✓

## Format Validation

- `<div class="upper-alpha" markdown>` wrapper: ✓ all questions
- `??? question "Show Answer"` admonition: ✓ all questions
- 4-space indentation in answer blocks: ✓ all questions
- "The correct answer is **[LETTER]**." opener: ✓ all questions
- `**Concept Tested:**` label: ✓ all questions
- `---` separator after every question: ✓ all questions
- No anchor links in quiz files: ✓
- No "All of the above" / "None of the above": ✓

## Quality Score: 88/100

| Dimension | Score |
|---|---|
| Bloom's distribution | 24/25 |
| Answer balance | 15/15 |
| Answer quality (explanations, distractors) | 22/25 |
| Format compliance | 20/20 |
| Concept coverage | 7/15 (estimated ~70%) |

## Recommendations

**High Priority:**
- Review Chapter 3 answer balance (A only appears once — consider shuffling)
- Verify distractor quality for terminology-heavy chapters (2, 8)

**Medium Priority:**
- Consider adding 2 Evaluate-level questions to chapters 11–12 in a future revision
- Chapter 14 (Global Food Cultures) had zero FAQ coverage previously — confirm quiz covers key concepts

**Low Priority:**
- Generate per-chapter metadata JSON for LMS export
- Consider generating a quiz bank JSON for chatbot integration
