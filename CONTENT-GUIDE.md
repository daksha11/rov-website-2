# ROV Content Flywheel — Team Guide

How to use the ROV blog system. No dev knowledge needed — just Claude Code.

---

## Quick Start

Open Claude Code in the `rov-website-2` project folder. All commands start with `/`.

| I want to... | Run this |
|--------------|----------|
| Write a case study for a new client | `/rov-brief` |
| Turn a brief into a blog post | `/rov-draft content/intake/my-project.md` |
| Publish an approved post | `/rov-publish --approve my-slug` |
| Write a trending news post | `/rov-news` |
| Check what's waiting for review | `/rov-publish --queue` |
| Generate LinkedIn + Instagram text | `/rov-social my-slug` |
| Analyze search performance | `/rov-analytics content/analytics/my-export.csv` |

---

## The Full Workflow

### Case Study Posts (client projects)

```
Step 1: /rov-brief
        ↓ answers your questions, saves a brief to content/intake/

Step 2: /rov-draft content/intake/my-project.md
        ↓ generates a blog post, saves to content/review-queue/

Step 3: Open content/review-queue/my-slug.md and read it (2 min skim)
        ↓ edit if needed

Step 4: /rov-publish --approve my-slug
        ↓ validates, moves to content/blog/, commits, pushes, deploys
```

### News Posts (trending topics)

```
Run: /rov-news
     ↓ finds a trending topic
     ↓ writes a post with Atlanta angle
     ↓ validates automatically
     ↓ saves to content/blog/, commits, pushes, deploys

That's it. One command.
```

### Social Media Posts

```
Run: /rov-social thebando-brand-transformation
     ↓ reads the blog post
     ↓ generates LinkedIn text (1-3 paragraphs + hashtags)
     ↓ generates Instagram caption (hook + story + 20-30 hashtags)
     ↓ saves to content/social/ for reference

Copy and paste to your platforms.
```

### Analytics Reports

```
Step 1: Go to Google Search Console → Performance
Step 2: Set date range (last 28 days or 3 months)
Step 3: Click EXPORT → Download CSV
Step 4: Save to content/analytics/

Run: /rov-analytics content/analytics/your-file.csv
     ↓ analyzes clicks, impressions, CTR, positions
     ↓ finds quick wins (high impressions, low CTR)
     ↓ identifies content gaps
     ↓ recommends next 5 posts to write
     ↓ saves report to content/analytics/
```

---

## Posting Schedule

| Day | What to Post |
|-----|-------------|
| **Monday** | `/rov-news` (trending topic) |
| **Wednesday** | `/rov-news` (trending topic) |
| **Friday** | `/rov-news` (trending topic) |
| **After a client project** | `/rov-brief` → `/rov-draft` → review → `/rov-publish --approve` |
| **After publishing any post** | `/rov-social slug` → copy to LinkedIn + Instagram |
| **Weekly (Monday)** | `/rov-analytics` with fresh GSC export |

---

## Folder Structure

```
content/
├── blog/              Published posts (live on the website)
├── intake/            Project briefs (input for /rov-draft)
├── review-queue/      Case studies waiting for your approval
├── drafts/            Work-in-progress (not published)
├── analytics/         GSC exports and performance reports
└── social/            Generated social media text
```

- **blog/** — Anything in here is live on rovstudios.com/blog after a git push
- **review-queue/** — Posts here are NOT live. They wait for `/rov-publish --approve`
- **intake/** — Briefs here are NOT posts. They're input data for `/rov-draft`

---

## Skill Reference

### /rov-brief

**What:** Walks you through creating a project brief interactively.

**When to use:** After completing a client project that you want to write a case study about.

**What it asks you:**
1. Project name
2. Client name (must have permission to publish)
3. Client website URL
4. Industry
5. The challenge (what problem did the client have?)
6. The solution (what did ROV build?)
7. Results (numbers required — traffic increase, sales lift, etc.)
8. Timeline
9. Atlanta angle
10. URL slug

**Output:** Saves a brief file to `content/intake/`

**Next step:** Run `/rov-draft content/intake/your-slug.md`

---

### /rov-draft

**What:** Converts a project brief into a full blog post.

**When to use:** After `/rov-brief` creates a brief file.

**How to run:** `/rov-draft content/intake/my-project.md`

**What it generates:**
- SEO-optimized title (under 60 characters)
- Meta description (under 155 characters, includes Atlanta)
- 800-1200 word post with: hook, challenge, solution, results, takeaways
- FAQ section (3-4 questions for AI search optimization)
- All anti-slop rules applied automatically

**Output:** Saves to `content/review-queue/` (case studies need your approval)

**Next step:** Read the post, edit if needed, then `/rov-publish --approve slug`

---

### /rov-publish

**What:** Validates and publishes blog posts.

**Modes:**

| Mode | Command | What It Does |
|------|---------|-------------|
| Approve | `/rov-publish --approve slug` | Validates → moves to blog/ → commits → pushes → deploys |
| Auto | `/rov-publish --auto slug` | Validates → publishes immediately (for news) |
| Validate | `/rov-publish --validate slug` | Checks the post without publishing (dry run) |
| Queue | `/rov-publish --queue` | Lists all posts waiting for review |

**Validation checks (runs automatically):**
1. Scans for banned phrases (corporate slop)
2. Checks for required elements (numbers, Atlanta reference, real examples)
3. Verifies all metadata fields are present
4. Checks for FAQ section

If validation fails, the post is blocked and you're told what to fix.

---

### /rov-news

**What:** Finds a trending web design/AI/dev topic and writes a news post.

**When to use:** Monday, Wednesday, Friday (or whenever you want fresh content).

**How to run:**
- `/rov-news` — finds a topic automatically
- `/rov-news "AI tools for restaurants"` — uses the topic you provide

**What it does:**
1. Searches for trending topics relevant to Atlanta businesses
2. Picks the best one
3. Writes a 600-900 word post with Atlanta angle
4. Validates against anti-slop rules
5. Saves to `content/blog/`, commits, and pushes (auto-publishes)

**If no good topic is found:** It skips and tells you. Never publishes filler.

---

### /rov-social

**What:** Generates ready-to-copy social media text from a blog post.

**When to use:** After publishing any blog post.

**How to run:** `/rov-social thebando-brand-transformation`

**What it generates:**

**LinkedIn:**
- 1-3 paragraphs, professional tone
- Lead with results, not self-congratulation
- 3-5 hashtags
- Link to the blog post

**Instagram:**
- Hook line (shows in preview before "...more")
- Short story (2-3 sentences)
- CTA ("link in bio" or "DM us")
- 20-30 hashtags

**Output:** Displays both versions and saves to `content/social/`

---

### /rov-analytics

**What:** Analyzes Google Search Console data and recommends what to write next.

**When to use:** Weekly on Mondays (or whenever you want to check performance).

**Before running:** Export a CSV from Google Search Console:
1. Go to Search Console → Performance
2. Set date range to last 28 days (or 3 months)
3. Click EXPORT → Download CSV
4. Save to `content/analytics/`

**How to run:** `/rov-analytics content/analytics/your-file.csv`

**What it generates:**
- Performance overview (clicks, impressions, CTR, position)
- Top performing content
- Quick wins (posts where a better title could increase clicks)
- Content gaps (topics you should write about)
- Next 5 recommended posts with titles and target keywords

**Output:** Saves report to `content/analytics/report-YYYY-MM-DD.md`

---

## Anti-Slop Rules

Every post is automatically checked. These are enforced by `/rov-draft`, `/rov-news`, and `/rov-publish`.

### Banned Phrases (never use these)

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

### Every Post Must Have

- At least one specific number, date, or measurable result
- At least one Atlanta or Georgia reference
- A real example (not hypothetical)
- Direct, conversational tone
- Title under 60 characters
- Meta description under 155 characters with city name
- FAQ section with 3+ questions

### Voice

Write like a sharp friend giving advice, not a press release.

- Yes: "We rebuilt their checkout flow. Bounce rate dropped 40% in three weeks."
- No: "Our team leveraged cutting-edge technologies to deliver a seamless digital transformation."

---

## Writing a Blog Post Manually

If you ever want to write a post without using the skills, create a `.md` file in `content/blog/` with this format:

```yaml
---
title: "Your Title Here"
slug: "your-url-slug"
description: "Under 155 chars, includes Atlanta"
author: "ROV Studios"
date: "2026-04-01"
dateModified: "2026-04-01"
category: "case-study"       # or "news"
tags: ["web design", "atlanta"]
featured: false
readingTime: 5
atlantaAngle: "Your Atlanta connection"
published: true
---

Your post content here in markdown.

## Use H2 for Main Sections

### Use H3 for Subsections

**Bold text** and *italic text* work normally.

- Bullet points work
- Like this

## Frequently Asked Questions

### Your question here?

Your answer here.
```

Then commit and push to deploy:
```
git add content/blog/your-slug.md
git commit -m "publish: Your Post Title"
git push
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Post not showing on the website | Check `published: true` in frontmatter. Make sure the file is in `content/blog/`, not `review-queue/` |
| `/rov-news` says "rate limited" | Delete `content/rate-limit.flag` and try again |
| Validation keeps failing | Run `/rov-publish --validate slug` to see exactly what's wrong |
| Build fails after pushing | Run `npm run build` locally to see the error. Usually a frontmatter issue |
| Post looks wrong on the site | Check frontmatter fields — every field must be present and non-empty |
| Can't find a post in the queue | Run `/rov-publish --queue` to list everything waiting |
