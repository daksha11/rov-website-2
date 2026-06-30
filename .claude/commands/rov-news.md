# ROV News Post Generator

You autonomously find trending web design, AI, or development topics and write a news/opinion blog post with an Atlanta angle for ROV Studios.

## Arguments: `$ARGUMENTS`

If a topic is provided as an argument, use that topic. Otherwise, search for trending topics.

## Step 1: Check Rate Limit

Check if `content/rate-limit.flag` exists. If it does:
- Output: "Rate limit flag is set. Skipping news generation. Remove content/rate-limit.flag to resume."
- Stop execution.

## Step 2: Find a Topic

If no topic provided as argument:
1. Use WebSearch to search for trending topics in these areas:
   - "web design trends 2026"
   - "AI tools for small business"
   - "website development news"
   - "digital marketing Atlanta"
2. Pick the ONE most relevant topic for Atlanta businesses — something a business owner searching for a web design agency would find valuable
3. If no quality topic is found, output "No quality topic found today. Skipping." and stop

If a topic IS provided as argument, use it directly.

## Step 3: Write the Post

Generate a markdown blog post and save it to `content/blog/{slug}.md` (news posts auto-publish, no review queue).

### Frontmatter:

```yaml
---
title: ""          # Under 60 chars, attention-grabbing, includes keyword
slug: ""           # URL-friendly, descriptive, no dates
description: ""    # Under 155 chars, includes "Atlanta"
author: "ROV Studios"
date: "{today YYYY-MM-DD}"
dateModified: "{today YYYY-MM-DD}"
category: "news"   # Always "news" for this skill
tags: []           # 3-5 relevant tags
featured: false
readingTime: X     # Estimate (target 600-900 words, so usually 3-5 min)
atlantaAngle: ""   # How this topic matters to Atlanta businesses
published: true
---
```

### Post Structure:

1. **Hook** — Why this matters RIGHT NOW (1-2 sentences, punchy)
2. **## What's Happening** — The news/trend explained clearly
3. **## Why Atlanta Businesses Should Care** — Local angle, specific to Atlanta's market
4. **## What You Can Do About It** — 2-3 actionable steps for business owners
5. **## The Bottom Line** — 1-2 sentence takeaway
6. **## Frequently Asked Questions** — 3 questions with ### headings and answers

### Anti-Slop Rules (MANDATORY):

**Banned phrases — DO NOT USE:**
"in today's digital landscape", "leverage", "cutting-edge", "seamless", "elevate your brand", "digital transformation journey", "unlock the potential", "game-changer", "next-level", "revolutionize", "synergy", "holistic approach", "robust solution", "paradigm shift", "best-in-class"

**Banned punctuation & constructions:**
- NO em dashes (—) anywhere. Use a period or comma instead.
- NO "If X, then Y" sentence structures. Rewrite as a direct observation or story.
  - DON'T: "If you don't adapt to this trend, your business will fall behind."
  - DO: "Most Atlanta businesses haven't heard of this yet. The ones that move first will own the search results."

**Required elements:**
- At least one specific number, date, or statistic
- At least one Atlanta/Georgia reference
- A real person, real situation, or real example — not hypothetical
- Open with a scene or a situation, not a principle

**Voice:** Write like a sharp, knowledgeable friend giving advice. Welcoming and conversational — not a press release, not a lecture. The reader should feel informed and capable after reading, not overwhelmed.

### Word Count: 600-900 words (shorter than case studies — news should be quick reads)

## Step 4: Self-Validation

After writing, scan your generated content:
1. Check for banned phrases — rewrite any sentences that contain them
2. Verify Atlanta reference is present
3. Verify at least one number/date/statistic
4. Verify FAQ section has 3+ questions

## Step 5: Publish

1. Save to `content/blog/{slug}.md`
2. Run `git add content/blog/{slug}.md`
3. Run `git commit -m "publish: {title}"`
4. Run `git push`
5. Output: "Published: {title} → /blog/{slug}"

## Error Handling

- If WebSearch is unavailable: output "WebSearch unavailable. Provide a topic manually: /rov-news <topic>" and stop
- If git push fails: output the error, do NOT retry
- If rate limited by Claude: create `content/rate-limit.flag` with today's date, output "Rate limited. Flag set. Will skip next run."
