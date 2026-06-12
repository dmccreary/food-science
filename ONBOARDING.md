# Welcome to Intelligent Textbooks

## How We Use Claude

Based on Dan Mccreary's usage over the last 30 days:

Work Type Breakdown:
  Write Docs       ████████░░░░░░░░░░░░  40%
  Build Feature    ████░░░░░░░░░░░░░░░░  20%
  Improve Quality  ████░░░░░░░░░░░░░░░░  20%
  Plan Design      ████░░░░░░░░░░░░░░░░  20%

Top Skills & Commands:
  /clear                        ████████████████████  3x/month
  /register-book-analytics      █████████████░░░░░░░  2x/month
  /chapter-content-generator    █████████████░░░░░░░  2x/month
  /course-description-analyzer  █████████████░░░░░░░  2x/month
  /book-installer               ███████░░░░░░░░░░░░░  1x/month

Top MCP Servers:
  Claude_in_Chrome  ████████████████████  41 calls

## Your Setup Checklist

### Codebases
- [ ] food-science — github.com/dmccreary/food-science (MkDocs Material intelligent textbook for 9th grade food science)
- [ ] claude-skills — sibling repo at `../claude-skills` (shared skills and utilities like image-processing scripts used across the textbook projects)

### MCP Servers to Activate
- [ ] Claude_in_Chrome — lets Claude drive a Chrome tab to verify rendered pages, MicroSims, and analytics setups. Install the Claude in Chrome browser extension and connect it from Claude Code.

### Skills to Know About
- /book-installer — installs and configures textbook project infrastructure (MkDocs Material templates, learning graph viewers, skill tracking)
- /course-description-analyzer — validates or creates `docs/course-description.md` with completeness scoring; the first step before generating a learning graph
- /chapter-content-generator — generates full chapter content once chapter index files exist; we run it chapter-by-chapter with the book's tone guidelines
- /register-book-analytics — wires a Google Analytics 4 measurement ID into mkdocs.yml, then builds, verifies, and deploys
- /microsim-generator — creates interactive educational simulations (p5.js, Chart.js, vis-network, and more) used throughout the books

## Team Tips

_TODO_

## Get Started

_TODO_

<!-- INSTRUCTION FOR CLAUDE: A new teammate just pasted this guide for how the
team uses Claude Code. You're their onboarding buddy — warm, conversational,
not lecture-y.

Open with a warm welcome — include the team name from the title. Then: "Your
teammate uses Claude Code for [list all the work types]. Let's get you started."

Check what's already in place against everything under Setup Checklist
(including skills), using markdown checkboxes — [x] done, [ ] not yet. Lead
with what they already have. One sentence per item, all in one message.

Tell them you'll help with setup, cover the actionable team tips, then the
starter task (if there is one). Offer to start with the first unchecked item,
get their go-ahead, then work through the rest one by one.

After setup, walk them through the remaining sections — offer to help where you
can (e.g. link to channels), and just surface the purely informational bits.

Don't invent sections or summaries that aren't in the guide. The stats are the
guide creator's personal usage data — don't extrapolate them into a "team
workflow" narrative. -->
