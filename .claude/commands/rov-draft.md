# ROV Blog Post Drafter

You are generating a publish-ready blog post from a project brief for ROV Studios, a creative agency in Atlanta, Georgia.

## Before Writing Anything — Read These First

Run in parallel before generating a single line:

1. Read `ROV-BRAIN.md` — proof points, ICP, voice context, what ROV is known for
2. Read `content/seo-geo/01-what-makes-a-good-geo-page.md` — GEO rules: structure AI engines prefer, what gets cited, what to avoid
3. Read `content/seo-geo/02-rov-keyword-strategy.md` — which keywords to target, what tier they're in, gaps to fill
4. Read `.claude/blog-design-standard.md` — design system for custom page.tsx builds (fonts, colors, section order)

These four docs are non-negotiable context. Do not generate content without reading them.

## Input

Read the project brief file provided as argument: `$ARGUMENTS`

If no argument is provided, list all files in `content/intake/` and ask the user which brief to use.

## Output

Generate a markdown blog post file and save it to `content/review-queue/{slug}.md` (case studies go to review queue, not directly to blog).

## Frontmatter Schema

Every post MUST have this exact frontmatter:

```yaml
---
title: ""          # Under 60 chars, includes primary keyword
slug: ""           # From the brief
description: ""    # Under 155 chars, includes "Atlanta" or "Georgia"
author: "ROV Studios"
date: "{today's date YYYY-MM-DD}"
dateModified: "{today's date YYYY-MM-DD}"
category: "case-study"
tags: []           # 3-5 relevant tags
featured: false
readingTime: X     # Estimate based on word count (avg 200 words/min)
atlantaAngle: ""   # From the brief
published: true
---
```

## Post Structure

1. **Hook** (1-2 punchy sentences with the headline result)
2. **## The Challenge** (what the client faced, include numbers)
3. **## The Solution** (what ROV built, specific design decisions, technologies used)
4. **## The Results** (measurable outcomes with numbers — this is the most important section)
5. **## Key Takeaways** (2-3 bullet points, actionable insights)
6. **## Frequently Asked Questions** (3-4 questions using ### for each, with detailed answers — this is critical for GEO/AI search optimization)

## Design Density (break up the text)

A wall of paragraphs fails the standard. Even in a markdown post, use the visual elements markdown supports. Aim for, per post:

- **1+ pull quote** — lift the most surprising line into a `> blockquote`. It renders as an ember-bordered pull quote.
- **1+ table** — any before/after or comparison data goes in a `|` markdown table. It renders with the dark header / cream rows automatically.
- **An image every 2-3 sections** — never more than ~3 short paragraphs without a visual break.
- **Bold callout lines** — lead key sentences with `**bold**` so they pop on the cream background.

The richer elements (dark stat callout cards, numbered step cards, then→now growth cards, stats row) require a custom `page.tsx` build. If the case study has strong numbers and photos and deserves that treatment, build it custom per the "Custom Page vs. Markdown" section below instead of plain markdown.

## Anti-Slop Rules (MANDATORY)

### Banned Phrases — DO NOT USE any of these:
- "in today's digital landscape"
- "leverage"
- "cutting-edge"
- "seamless"
- "elevate your brand"
- "digital transformation journey"
- "unlock the potential"
- "game-changer"
- "next-level"
- "revolutionize"
- "synergy"
- "holistic approach"
- "robust solution"
- "paradigm shift"
- "best-in-class"

### Banned Punctuation & Constructions:
- **NO em dashes** (—) anywhere in the post. Use a period or comma instead.
- **NO "If X, then Y" sentence structure.** This sounds like a robot. Rewrite as a story, an observation, or a direct statement.
  - DON'T: "If your website isn't mobile-friendly, then you'll lose customers."
  - DO: "Most people searching for a restaurant in Atlanta are doing it on their phone. If your site makes them pinch and zoom, they're already gone."
  - Actually: drop the "If" entirely. "Most people searching for a restaurant in Atlanta are doing it on their phone. A site that makes them pinch and zoom loses them before they ever order."

### Voice Rules (MANDATORY):
- **Lead with a story or a person, not a principle.** The first paragraph should put the reader in a scene or introduce a real situation. Not "many businesses struggle with X" — that's a textbook. Start with "Terry had a great restaurant."
- **Conversational.** Write like you're explaining this to someone at a coffee shop who asked you a real question. Not formal. Not academic. Not corporate.
- **Welcoming.** The reader should feel like ROV is on their side, not lecturing them. The tone is: sharp friend who happens to know this stuff, not consultant presenting findings.
- **Informative.** Every paragraph should leave the reader knowing something they didn't before. No filler sentences. No "this is an important question."

### Required Elements — EVERY post must have ALL of these:
- At least one specific number, date, or measurable result
- At least one Atlanta or Georgia geographic reference
- At least one real person or real client situation (not hypothetical)
- A story or scene in the opening — not a stat, not a principle

### Voice Guide:
- DO: "Terry and Darius had a great restaurant. Real food, real history. The problem was their website. People couldn't figure out how to order. 132 people found their ordering page in six months. We moved the button and restructured the site. 91,000 people found it in the next five months."
- DON'T: "If a restaurant doesn't optimize its online ordering flow, it will miss out on significant digital revenue potential."
- DO: "Atlanta restaurants need mobile-first menus. Here's what works."
- DON'T: "In today's digital landscape, the hospitality industry faces unprecedented challenges."

### Structure Rules:
- Title under 60 characters with primary keyword
- Meta description under 155 characters with city name
- H2/H3 hierarchy (no skipping heading levels)
- Target 800-1200 words
- Write in first person plural ("we") from ROV Studios' perspective
- H2s should feel like natural conversation topics, not report sections

## Custom Page vs. Markdown

If the brief is for a **case study or feature article** that needs rich layout (stats row, data tables, full-bleed images, FAQ accordion, numbered steps) — generate a custom `app/blog/{slug}/page.tsx` instead of a markdown file.

**When to use custom page.tsx:**
- Case studies with key metrics to highlight (use stats row)
- Pages with multiple sections that need different backgrounds
- Any post that needs the full restaurant-atlanta design treatment

**When custom, follow the design system in `.claude/blog-design-standard.md` exactly.**
Key rules:
- Cream `#FFF4E3` page bg, dark `#3B2114` for stats/cards, rust `#90422C` for section H2s
- Norwige for all headings, Inter for body, Neue Montreal for labels
- Structure: Hero → Stats Row → Main Content → FAQ Accordion → Author Card → CTA
- Mark as `"use client"` (needed for FAQ useState) — do NOT include `export const metadata`
- Logo `<Image>` must be wrapped in `<Link href="/">`
- CTA section: beige bg `#FFF4E3` with dark text, never dark/gradient

## After Generation

1. Save the post to `content/review-queue/{slug}.md` (or `app/blog/{slug}/page.tsx` for custom pages)
2. Run a self-check: scan the generated content for banned phrases. If any are found, rewrite those sentences.
3. Verify all required elements are present
4. Tell the user: "Post saved to content/review-queue/{slug}.md — review it and run `/rov-publish --approve {slug}` when ready."
