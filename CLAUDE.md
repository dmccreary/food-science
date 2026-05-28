# CLAUDE.md — Food Science for 9th Grade

Project instructions and conventions for AI-assisted content generation.

## Project Overview

- **Book title:** Food Science for 9th Grade
- **Audience:** 14–15 year old high school students (9th grade)
- **Site URL:** https://dmccreary.github.io/food-science/
- **Color palette:** Primary green (`#2e7d32`), accent orange (`#f57c00`)
- **Tone:** Engaging, fun, playful, curious, scientifically rigorous, hands-on lab-forward, positive, optimistic

---

## Learning Mascot: Zyme the Yeast Cell

### Mascot File Index

The canonical files for this mascot. When editing any of these, update the
others in the same turn so they stay in sync.

| File | Purpose |
|------|---------|
| [`docs/img/mascot/character-sheet.md`](docs/img/mascot/character-sheet.md) | Canonical identity document (name, species, colors, voice). Source of truth. |
| [`docs/img/mascot/image-prompts.md`](docs/img/mascot/image-prompts.md) | Self-contained AI prompts for regenerating each pose. |
| [`docs/img/mascot/neutral.png`](docs/img/mascot/neutral.png) | Default / general-purpose pose. |
| [`docs/img/mascot/welcome.png`](docs/img/mascot/welcome.png) | Chapter-opening pose. |
| [`docs/img/mascot/thinking.png`](docs/img/mascot/thinking.png) | Key-concept pose. |
| [`docs/img/mascot/tip.png`](docs/img/mascot/tip.png) | Hint / helpful-guidance pose. |
| [`docs/img/mascot/warning.png`](docs/img/mascot/warning.png) | Common-mistake / pitfall pose. |
| [`docs/img/mascot/encouraging.png`](docs/img/mascot/encouraging.png) | Difficult-content / struggle pose. |
| [`docs/img/mascot/celebration.png`](docs/img/mascot/celebration.png) | End-of-chapter / achievement pose. |
| [`docs/css/mascot.css`](docs/css/mascot.css) | Custom admonition styles for the seven pose contexts. |
| [`docs/learning-graph/mascot-test.md`](docs/learning-graph/mascot-test.md) | Rendering test page that exercises every admonition style. |

### Character Overview

- **Name:** Zyme
- **Species:** Friendly yeast cell (Saccharomyces cerevisiae, anthropomorphized)
- **Personality:** Curious, enthusiastic, approachable, science-proud
- **Catchphrase:** "Science is delicious!"
- **Visual:** Small round golden-yellow (#f9a825) cell body; tiny circular lab safety goggles; large bright expressive eyes; small CO2 bubbles floating nearby; flat cartoon vector style

### Voice Characteristics

- Uses simple, energetic language with occasional food/fermentation science puns
- Speaks directly to students as fellow scientists and explorers
- Loves exclamation points — Zyme is never bored
- Always refer to Zyme by name or "they" — never use gendered pronouns
- Signature phrases: "Science is delicious!", "Let's bubble up some answers!", "Time to rise to the occasion!"

### Mascot Admonition Format

Always place mascot images in the admonition body, never in the title bar.
The `src` path is relative to the **rendered page URL** (directory URL), not
the markdown file. Count `../` hops from the rendered page to `docs/img/mascot/`.

For a chapter at `chapters/01-science-in-the-kitchen/index.md` → use `../../img/mascot/`:

```markdown
!!! mascot-welcome "Welcome to Chapter 1!"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Zyme waving welcome">
    Science is delicious! Let's dive into the chemistry hiding in your kitchen.
```

For a page at `learning-graph/mascot-test.md` → also `../../img/mascot/`:

```markdown
!!! mascot-tip "Zyme's Tip"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Zyme giving a tip">
    Tip text here.
```

### Placement Rules

| Context | Admonition Type | Frequency |
|---------|----------------|-----------|
| General note / sidebar | mascot-neutral | As needed |
| Chapter opening | mascot-welcome | Every chapter |
| Key concept | mascot-thinking | 2–3 per chapter |
| Helpful tip | mascot-tip | As needed |
| Common mistake | mascot-warning | As needed |
| Difficult content | mascot-encourage | Where students may struggle |
| Chapter completion | mascot-celebration | End of every chapter |

### Do's and Don'ts

**Do:**

- Use Zyme to introduce new topics warmly at the start of each chapter
- Include the catchphrase "Science is delicious!" in welcome admonitions
- Keep Zyme's dialogue brief (1–3 sentences)
- Match the pose image to the content type (warning pose for warnings, etc.)
- Use food science and fermentation analogies in Zyme's voice

**Don't:**

- Use Zyme more than 5–6 times per chapter
- Place mascot admonitions back-to-back
- Use Zyme for purely decorative purposes with no content value
- Change Zyme's enthusiastic, curious personality
- Use gendered pronouns for Zyme
