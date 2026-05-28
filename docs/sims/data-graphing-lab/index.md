---
title: Data Graphing Lab
description: Students will be able to construct and interpret (Bloom L3 — Apply) a bar graph and a line graph from a provided food science data set.
status: completed
library: Chart.js
bloom_level: 3
---

# Data Graphing Lab



<iframe src="main.html" width="100%" height="720"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 1: "Chapter 1: Science in the Kitchen"](../../chapters/01-science-in-the-kitchen/index.md).

```text
Type: MicroSim
**sim-id:** data-graphing-lab<br/>
**Library:** Chart.js<br/>
**Status:** Specified

**Learning objective:** Students will be able to construct and interpret (Bloom L3 — Apply) a bar graph and a line graph from a provided food science data set.

**Canvas size:** 760 × 540 px, responsive.

**Layout:** Left panel: a small editable data table with 4 rows × 2 columns. Column headers can be renamed by the student. Right panel: a rendered chart (Chart.js) that updates in real time as the student edits the data table.

**Controls:**
- A toggle at the top of the chart panel selects "Bar Graph" or "Line Graph."
- A "Chart Title" text field above the chart.
- An "X-axis Label" and "Y-axis Label" text field below/beside the chart axes.

**Preloaded data set 1 (bar graph scenario):** "Rise height of bread dough after 60 minutes"
| Recipe | Rise Height (cm) |
| No yeast (control) | 1.2 |
| 1 tsp yeast | 7.4 |
| 2 tsp yeast | 10.1 |
| 3 tsp yeast | 11.8 |

**Preloaded data set 2 (line graph scenario):** "Sourdough starter rise over 24 hours"
| Hour | Height (cm) |
| 0 | 3.0 |
| 4 | 3.5 |
| 8 | 6.2 |
| 12 | 10.4 |
| 16 | 8.1 |
| 20 | 5.3 |
| 24 | 3.8 |

**A "Load Dataset 1" and "Load Dataset 2" button** pre-fills the table and sets appropriate labels.

**Interaction — hover over bars/points:** Tooltip shows exact value with unit.

**Question overlay (optional, teacher-toggled):** After 30 seconds of activity, a question box appears asking "What trend do you see in this graph?" with a free-text field. This supports classroom discussion, not automatic grading.

**Color scheme:** Book palette; green bars/line, orange hover highlight.
```

## Related Resources

- [Chapter 1: "Chapter 1: Science in the Kitchen"](../../chapters/01-science-in-the-kitchen/index.md)
