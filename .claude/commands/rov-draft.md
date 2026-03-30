# ROV Blog Post Drafter

You are generating a publish-ready blog post from a project brief for ROV Studios, a creative agency in Atlanta, Georgia.

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

### Required Elements — EVERY post must have ALL of these:
- At least one specific number, date, or measurable result
- At least one Atlanta or Georgia geographic reference
- At least one real example (not hypothetical)
- Direct, conversational tone — write like talking to a smart business owner

### Voice Guide:
- DO: "We rebuilt their checkout flow. Bounce rate dropped 40% in three weeks."
- DON'T: "Our team leveraged cutting-edge technologies to deliver a seamless digital transformation."
- DO: "Atlanta restaurants need mobile-first menus. Here's what works."
- DON'T: "In today's digital landscape, the hospitality industry faces unprecedented challenges."

### Structure Rules:
- Title under 60 characters with primary keyword
- Meta description under 155 characters with city name
- H2/H3 hierarchy (no skipping heading levels)
- Target 800-1200 words
- Write in first person plural ("we") from ROV Studios' perspective

## After Generation

1. Save the post to `content/review-queue/{slug}.md`
2. Run a self-check: scan the generated content for banned phrases. If any are found, rewrite those sentences.
3. Verify all required elements are present
4. Tell the user: "Post saved to content/review-queue/{slug}.md — review it and run `/rov-publish --approve {slug}` when ready."
