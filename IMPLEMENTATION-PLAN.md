# ROV Content Flywheel — Implementation Plan

**Branch:** `feat/auto-blog-system`
**Budget:** $0 (Claude Max + Vercel free tier + existing stack)
**Status:** Ready to build
**Date:** 2026-03-30

---

## Table of Contents

1. [Architecture Decision](#1-architecture-decision)
2. [Performance Strategy](#2-performance-strategy)
3. [Prerequisites Checklist](#3-prerequisites-checklist)
4. [Phase 1: Blog Infrastructure](#4-phase-1-blog-infrastructure-weekend-1)
5. [Phase 2: Content Skills & Automation](#5-phase-2-content-skills--automation-weeks-2-3)
6. [Phase 3: Analytics & Social](#6-phase-3-analytics--social-month-2)
7. [Anti-Slop Rules](#7-anti-slop-rules)
8. [SEO & GEO Specifications](#8-seo--geo-specifications)
9. [Implementation Standards](#9-implementation-standards)
10. [File Structure](#10-file-structure)
11. [Reminders & Open Items](#11-reminders--open-items)

---

## 1. Architecture Decision

### Why Markdown Files in the Repo (Not a CMS)

| Factor | Markdown in Repo | Headless CMS |
|--------|-----------------|--------------|
| Cost | $0 | $0-29/mo |
| Performance | SSG at build time (fastest) | API call at build/runtime |
| Complexity | Zero external deps | Auth, API keys, webhooks |
| Control | Full — it's just files | Limited by CMS API |
| Versioning | Git history for free | Separate versioning |
| AI integration | Claude writes files directly | Need CMS API integration |
| Vercel free tier | Works perfectly (static pages) | May hit API limits |

**Decision:** Blog posts are `.md` files in `/content/blog/`. Next.js reads them at build time with `gray-matter` (frontmatter parser) and `remark`/`rehype` (markdown → HTML). Pages are statically generated — zero runtime cost.

### How Markdown Becomes a Beautiful Page

```
.md file (data) → gray-matter (parse frontmatter) → remark/rehype (markdown → HTML)
    → Next.js page component (your Tailwind + Styled Components design)
        → Static HTML at build time (served from Vercel CDN)
```

The user never sees markdown. They see your custom-designed blog page with your fonts, colors, animations, and layout. The `.md` file is just the content source — like a database row, but free and version-controlled.

---

## 2. Performance Strategy

Performance is non-negotiable. The blog must not slow down the existing site.

### Static Generation (SSG)

- Every blog post is pre-rendered at **build time** as static HTML
- Served from Vercel's CDN edge — same speed as the rest of your site
- No server-side rendering, no API calls, no database queries at runtime
- Blog pages will actually be **faster** than your current service pages (simpler components, less JS)

### Bundle Size Protection

| Guard | How |
|-------|-----|
| No heavy markdown libs at runtime | `gray-matter` and `remark` run at build time only — zero client JS |
| Dynamic imports for blog components | Blog page components lazy-loaded, don't bloat other pages |
| No new CSS framework | Reuse existing Tailwind + Styled Components |
| Image optimization | Next.js Image component with webp/avif (already configured) |
| Code splitting | Next.js App Router does this automatically per route |

### Vercel Free Tier Limits

| Resource | Free Tier Limit | Blog Impact |
|----------|----------------|-------------|
| Builds | 6,000 min/mo | ~2 min per build, 100 posts = fine |
| Bandwidth | 100 GB/mo | Static HTML is tiny — no concern |
| Serverless functions | 100 GB-hrs/mo | Blog uses zero (SSG) |
| Build frequency | No limit on deploys | Each new post = 1 deploy via git push |

**Verdict:** Even at 100+ posts, the blog stays well within free tier limits.

### Performance Checklist (enforce on every blog component)

- [ ] No `"use client"` unless interactive elements are present
- [ ] No external API calls at runtime
- [ ] All images use `<Image>` component with `loading="lazy"`
- [ ] Blog listing page uses pagination (max 12 posts per page)
- [ ] No heavy animation libraries on blog post pages (Framer Motion only for subtle scroll effects)
- [ ] Typography-focused design — minimal JS, maximum readability

---

## 3. Prerequisites Checklist

Complete these before writing any code.

### Blocking (must do first)

- [x] **Confirm GSC access** — CONFIRMED. Baseline (3 months, as of 2026-03-30): 61 clicks, 491 impressions, 12.4% CTR, avg position 5.9
- [ ] **Switch to `feat/auto-blog-system` branch** — All blog work happens here
- [ ] **Install markdown dependencies** — `gray-matter`, `remark`, `remark-html`, `rehype-raw` (4 packages, all lightweight, build-time only)

### Non-blocking (resolved)

- [x] Collect case study details — Bando (689x online ordering increase), IKNA (20% sales increase), DKM Corp (collaborative redesign)
- [x] Confirm correct client names — Bando: Terry & Darius, DKM Corp: Dheeraj Kumar Miryala
- [x] Identify Atlanta-specific angles — restaurant scene, small business digital transformation, professional services
- [ ] **REMINDER:** Update existing case study pages on the website with correct client names

---

## 4. Phase 1: Blog Infrastructure (Weekend 1)

**Goal:** A working blog with 3 case study posts, fully styled, SEO-optimized, deployed.

### Step 1.1: Install Dependencies

```bash
npm install gray-matter remark remark-html rehype-raw
```

**Why these 4:**
- `gray-matter` — Parses YAML frontmatter from `.md` files (title, date, slug, etc.)
- `remark` — Converts markdown to HTML
- `remark-html` — Remark plugin for HTML output
- `rehype-raw` — Allows raw HTML in markdown (for embeds, custom elements)

**Bundle impact:** Zero. These run at build time only via `fs.readFileSync` in `getStaticProps`/`generateStaticParams`. They are never shipped to the client.

### Step 1.2: Create Content Directory

```
content/
└── blog/
    ├── thebando-brand-transformation.md
    ├── ikna-ecommerce-growth.md
    └── dkm-corp-brand-identity.md
```

**Frontmatter schema for every post:**

```yaml
---
title: "How We Redesigned Bando's Digital Presence"        # Under 60 chars, includes keyword
slug: "thebando-brand-transformation"                      # URL-friendly, includes geo
description: "ROV Studios rebuilt Bando's website in Atlanta, increasing engagement by X%."  # Under 155 chars, includes city
author: "ROV Studios"
date: "2026-03-30"                                          # ISO format
dateModified: "2026-03-30"                                  # Updated when edited
category: "case-study"                                      # case-study | web-design | news | ai
tags: ["web design", "atlanta", "case study"]
featured: true                                              # Show on homepage/top of listing
readingTime: 5                                              # Minutes (calculated or manual)
atlantaAngle: "Westside Atlanta creative scene"             # Required — every post needs this
published: true                                             # Draft control — false = hidden
---
```

### Step 1.3: Blog Utility Functions

**File:** `lib/blog.ts`

Single file with these functions:
- `getAllPosts()` — Reads all `.md` files from `content/blog/`, parses frontmatter, returns sorted array (newest first). Filters out `published: false`.
- `getPostBySlug(slug)` — Reads a single post, parses frontmatter + converts markdown to HTML.
- `getPostSlugs()` — Returns all slugs for `generateStaticParams`.
- `getRelatedPosts(category, currentSlug, limit)` — Returns posts in same category, excluding current.

**Type:** `BlogPost` interface in `lib/types.ts` (extend your existing types file).

```typescript
export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  author: string;
  date: string;
  dateModified: string;
  category: string;
  tags: string[];
  featured: boolean;
  readingTime: number;
  atlantaAngle: string;
  published: boolean;
  content: string;        // Raw markdown (for listing excerpts)
  htmlContent?: string;   // Rendered HTML (for post page)
}
```

### Step 1.4: Blog Pages

**Blog listing page:** `app/blog/page.tsx`

- Server component (no `"use client"`)
- Calls `getAllPosts()` at build time
- Renders a grid of blog post cards
- Each card: title, date, category badge, reading time, excerpt (first 160 chars)
- Metadata: title "Blog | Range of View Studios", description with Atlanta mention
- BreadcrumbSchema: Home → Blog
- Pagination: show 12 posts per page (Phase 1 won't need this with 3 posts, but build the structure)

**Blog post page:** `app/blog/[slug]/page.tsx`

- Server component
- `generateStaticParams()` returns all slugs (SSG)
- `generateMetadata()` returns per-post title, description, OG tags
- Renders: BlogPostingSchema, BreadcrumbSchema, FAQPageSchema (if post has FAQ)
- Calls `getPostBySlug(slug)` for content
- Renders HTML content inside styled typography container
- Includes: post header (title, date, author, reading time, category), content body, related posts at bottom, CTA section

### Step 1.5: Blog Components

Create only what's needed — no speculative components.

| Component | Purpose | Client/Server |
|-----------|---------|---------------|
| `BlogCard.tsx` | Post card for listing grid | Server |
| `BlogPostHeader.tsx` | Title, date, meta, category | Server |
| `BlogPostBody.tsx` | Styled HTML content container | Server |
| `BlogPostCTA.tsx` | "Need a website?" CTA at post bottom | Server |
| `RelatedPosts.tsx` | 2-3 related post cards | Server |
| `BlogPostingSchema.tsx` | Schema.org BlogPosting LD+JSON | Server |

**All server components.** No `"use client"` needed — blog posts are static content with no interactivity.

### Step 1.6: Visual Design Principles

The blog must feel premium — matching the rest of rovstudios.com.

**Typography (reuse existing fonts):**
- Post title: `Norwige` (serif), `clamp(2rem, 5vw, 3.5rem)`
- Body text: `Roboto` or `Inter`, `1.125rem` (18px), line-height `1.75`
- Headings (H2/H3): `Norwige`, sized down from title
- Code blocks: monospace, dark background with subtle border

**Color palette (match existing site):**
- Background: `#000000` (black, consistent with site)
- Text: `#e5e5e5` (light gray on dark)
- Accent: match your existing brand color
- Category badges: subtle colored pills
- Links: brand accent color with underline on hover

**Layout:**
- Max content width: `720px` (optimal reading width)
- Generous whitespace: `2rem` between paragraphs, `3rem` before headings
- Full-bleed images when added later (break out of 720px to ~1200px)
- Mobile: single column, no sidebar, comfortable reading

**Animations (minimal — readability first):**
- Fade-in on scroll for post cards on listing page (Framer Motion, `once: true`)
- No animation on blog post body — let content shine
- Subtle hover effect on cards (scale 1.02, shadow lift)

### Step 1.7: Navigation Updates

- Add "Blog" link to `Navbar.tsx` services array or as a standalone nav item
- Add "Blog" to `Footer.tsx` links section
- Consider adding to `NavDoc.tsx` bottom navigation

### Step 1.8: Sitemap Updates

Update `app/sitemap.ts` to include:

```typescript
// Blog index
{ url: `${baseUrl}/blog`, lastModified: today, changeFrequency: 'weekly', priority: 0.8 }

// Individual posts (generated from getAllPosts())
...posts.map(post => ({
  url: `${baseUrl}/blog/${post.slug}`,
  lastModified: post.dateModified || post.date,
  changeFrequency: 'monthly' as const,
  priority: 0.7,
}))
```

### Step 1.9: Write 3 Case Study Posts

Each post follows this structure:

1. **Hook** — What the client needed (1-2 sentences, specific)
2. **Challenge** — The problem in detail (with numbers)
3. **Solution** — What ROV built and design decisions made
4. **Results** — Measurable outcomes (required — no post without numbers)
5. **Atlanta angle** — Local context woven naturally throughout
6. **FAQ section** — 3-4 questions for GEO optimization

#### Post 1: TheBando (thebandoatl.com) — Terry & Darius

- **Project:** Full website redesign (launched Nov 7, 2024)
- **Platform:** Wix
- **Key results (verified analytics, 139-day comparison):**
  - Total sessions: +37.6% (220,200 → 303,129)
  - Unique visitors: +32.7% (174,463 → 231,495)
  - Page views: +33.5% (440,754 → 588,458)
  - Online ordering page: **+68,836%** (132 → 91,060 views — a 689x increase)
- **Atlanta angle:** Atlanta restaurant/food scene, local dining culture
- **Story:** The online ordering page went from 132 total visits to 91,000+ — transforming a nearly invisible page into the site's primary conversion driver. New menu pages collectively drove 139,398 page views.

#### Post 2: IKNA — Aysegul Ikna

- **Project:** Brand new website + e-commerce shop + social media marketing + account handling
- **Context:** Physical-only business with zero online presence before ROV
- **Key results:** Sales up 20% after digital presence launch
- **Atlanta angle:** Small business growth in Atlanta, physical-to-digital transformation
- **Story:** Took a business from zero online presence to a full e-commerce operation with social media strategy. 20% sales increase demonstrates the power of going digital.

#### Post 3: DKM Corp — Dheeraj Kumar Miryala

- **Project:** Collaborative website redesign from scratch
- **Context:** Full brand refresh and web presence overhaul
- **Key results:** Use reasonable industry benchmarks (improved load time, modern responsive design, professional brand presence). Note this was a collaborative redesign.
- **Atlanta angle:** Atlanta professional services / entrepreneurship scene
- **Story:** Ground-up redesign collaboration — focus on the design process, decision-making, and how ROV approaches collaborative client relationships.

**Anti-slop verification runs before each post is finalized (see Section 7).**

### Phase 1 Deliverables

- [ ] 4 new dependencies installed (build-time only)
- [ ] `/content/blog/` directory with 3 case study posts
- [ ] `lib/blog.ts` with utility functions
- [ ] `BlogPost` interface in `lib/types.ts`
- [ ] `app/blog/page.tsx` (listing page)
- [ ] `app/blog/[slug]/page.tsx` (post page with SSG)
- [ ] 6 blog components (all server components)
- [ ] `BlogPostingSchema.tsx` for structured data
- [ ] Sitemap updated with blog entries
- [ ] Navigation updated with Blog link
- [ ] All 3 posts pass anti-slop verification
- [ ] Performance verified: no increase in bundle size for non-blog pages
- [ ] Deployed to Vercel via `feat/auto-blog-system` → preview URL

---

## 5. Phase 2: Content Skills & Automation (Weeks 2-3)

**Goal:** Claude Code skills that generate blog content autonomously.

### Step 2.1: `/rov-draft` Skill

**What it does:** Takes a project brief → outputs a publish-ready `.md` blog post.

**Input:** A project brief file (structured YAML/markdown with client, challenge, solution, results).

**Output:** A `.md` file in `/content/blog/` with:
- Complete frontmatter (all fields from the schema)
- SEO-optimized title and description
- Full blog post body following the structure from Step 1.9
- FAQ section for GEO
- Atlanta geo-signals
- Anti-slop rules applied during generation

**Implementation:** Claude Code skill (`.claude/skills/rov-draft/`).

### Step 2.2: `/rov-news` Skill

**What it does:** Searches for trending web design/AI/dev topics → drafts a news-style blog post → saves to `/content/blog/`.

**Input:** None (autonomous) or optional manual topic.

**Output:** A news/opinion `.md` file with Atlanta angle.

**Safeguards:**
- If no quality topic found, skip and log — never publish filler
- Rate limit flag: if Claude Max hits limits, write `/content/rate-limit.flag`, next run skips
- Anti-slop verification before saving

**Implementation:** Claude Code skill (`.claude/skills/rov-news/`).

### Step 2.3: `/rov-publish` Skill

**What it does:** Validates a post, commits to git, pushes to trigger Vercel deploy.

**Two modes:**
- `--auto` — For news content: validate → commit → push → deployed
- `--review` — For case studies: validate → move to `/content/review-queue/` → human reads → runs `/rov-publish --approve <file>` → commit → push

**Validation (runs before any publish):**
1. Banned phrase scan (string match against anti-slop list)
2. Required element check (number/date, Atlanta reference, real example)
3. Frontmatter completeness check (all required fields present)
4. If validation fails on `--auto`, route to review queue instead

**Implementation:** Claude Code skill (`.claude/skills/rov-publish/`).

### Step 2.4: `/rov-brief` Skill

**What it does:** Interactive helper that walks you through filling out a project brief.

**Input:** Interactive Q&A (Claude asks, you answer).

**Output:** A completed brief `.md` file in `/content/intake/`.

**Fields it covers:** project_name, client, industry, challenge, solution, results, timeline, atlanta_angle.

### Step 2.5: Review Queue System

```
content/
├── blog/              ← Published posts (git tracked, deployed)
├── intake/            ← Project briefs (input for /rov-draft)
├── review-queue/      ← Posts awaiting human approval
└── drafts/            ← Work-in-progress (optional)
```

**Flow:**
1. `/rov-draft` or `/rov-news` generates a post
2. Case studies → `/content/review-queue/`
3. News → validated → `/content/blog/` (auto)
4. Human reviews queue: read file, optionally edit, run `/rov-publish --approve <file>`
5. Approved file moves from `review-queue/` to `blog/`, committed and pushed
6. Posts in queue >7 days get flagged as stale

### Step 2.6: Scheduled Automation

Using Claude Code's `/schedule` capability:

| Schedule | Skill | What Happens |
|----------|-------|--------------|
| Daily 8:00 AM EST | `/rov-news` | Scan trending topics → draft → auto-publish if quality meets threshold |
| On-demand | `/rov-brief` → `/rov-draft` → `/rov-publish` | Full case study pipeline |

**Important:** Validate `/schedule` syntax against current Claude Code docs before configuring. Cron format: `"0 8 * * *"`.

### Phase 2 Deliverables

- [ ] `/rov-draft` skill — brief → blog post
- [ ] `/rov-news` skill — trending topic → news post
- [ ] `/rov-publish` skill — validate → commit → deploy (auto/review modes)
- [ ] `/rov-brief` skill — interactive brief builder
- [ ] Review queue directory and flow
- [ ] Rate limit handling (flag file system)
- [ ] Daily scheduled agent for `/rov-news`
- [ ] Anti-slop verification integrated into publish pipeline
- [ ] 5+ additional posts published via the skills

---

## 6. Phase 3: Analytics & Social (Month 2)

**Goal:** Data-driven content strategy + social media repurposing.

### Step 3.1: `/rov-analytics` Skill

**What it does:** Reads GSC data → generates a content performance report → recommends what to write next.

**Input (Phase 3 approach):** Manually exported CSV from Google Search Console. This avoids OAuth/service account complexity. Future: automate via GSC API if warranted.

**Output:**
- Top performing posts (clicks, impressions, CTR, position)
- Keyword opportunities (high impressions, low CTR = improve title/description)
- Content gaps (queries you're appearing for but have no dedicated post)
- Recommended next 5 topics based on data

### Step 3.2: `/rov-social` Skill

**What it does:** Takes a published blog post → generates platform-specific social media text.

**Platforms (confirmed by user):**

| Platform | Format | Tone |
|----------|--------|------|
| **LinkedIn** | 1-3 paragraphs, professional | Business value, results-focused |
| **Instagram** | Caption + 20-30 hashtags | Visual, engaging, community-focused |

**Output:** Ready-to-copy text for each platform. No image generation (text-only for now).

### Step 3.3: Weekly Analytics Schedule

| Schedule | Skill | What Happens |
|----------|-------|--------------|
| Weekly Monday 9:00 AM | `/rov-analytics` | Report + strategy adjustment recommendations |

### Phase 3 Deliverables

- [ ] `/rov-analytics` skill — GSC CSV → performance report
- [ ] `/rov-social` skill — blog post → LinkedIn + Instagram text
- [ ] Weekly scheduled analytics agent
- [ ] Content strategy adjusted based on first 30 days of data
- [ ] 20+ total posts published

---

## 7. Anti-Slop Rules

These rules are **non-negotiable** and enforced at two layers.

### Layer 1: Generation-Time (baked into skill prompts)

Every content-generating skill (`/rov-draft`, `/rov-news`) includes these rules in its system prompt.

### Layer 2: Publish-Time Verification (automated check)

`/rov-publish` runs these checks before any post goes live. Failure = blocked from publishing.

### Banned Phrases (exact string match, case-insensitive)

```
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
```

### Required Elements (every post must have ALL of these)

- [ ] At least one specific number, date, or measurable result
- [ ] At least one Atlanta or Georgia geographic reference
- [ ] At least one real example or case reference (not hypothetical)
- [ ] Direct, conversational tone — write like talking to a smart business owner
- [ ] No hypothetical scenarios presented as case studies

### Structure Requirements

- [ ] Title under 60 characters, includes primary keyword
- [ ] Meta description under 155 characters, includes city name
- [ ] H2/H3 hierarchy (no skipping heading levels)
- [ ] FAQ section at bottom (3-5 questions) for GEO optimization
- [ ] All frontmatter fields populated

### Voice Guide

- **Do:** "We rebuilt their checkout flow. Bounce rate dropped 40% in three weeks."
- **Don't:** "Our team leveraged cutting-edge technologies to deliver a seamless digital transformation that elevated their brand."
- **Do:** "Atlanta restaurants need mobile-first menus. Here's what works."
- **Don't:** "In today's digital landscape, the hospitality industry faces unprecedented challenges."

---

## 8. SEO & GEO Specifications

### On-Page SEO (every post)

| Element | Specification |
|---------|--------------|
| Title tag | `{Post Title} \| Range of View Studios` (under 60 chars before pipe) |
| Meta description | Under 155 chars, includes Atlanta/Georgia, includes primary keyword |
| Canonical URL | `https://rovstudios.com/blog/{slug}` |
| Open Graph | title, description, type: "article", image (when available) |
| Twitter Card | summary_large_image (when images available), summary (text-only) |
| H1 | Post title (one per page) |
| H2/H3 | Logical hierarchy, include secondary keywords naturally |
| Internal links | Link to relevant service pages (`/web`, `/ai-automation`, etc.) and other blog posts |
| URL structure | `/blog/{keyword-rich-slug}` — lowercase, hyphens, no dates in URL |

### Structured Data (Schema.org)

**BlogPosting schema on every post:**

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Post Title",
  "description": "Meta description",
  "datePublished": "2026-03-30",
  "dateModified": "2026-03-30",
  "author": {
    "@type": "Organization",
    "name": "ROV Studios",
    "url": "https://rovstudios.com"
  },
  "publisher": {
    "@type": "Organization",
    "name": "ROV Studios",
    "url": "https://rovstudios.com"
  },
  "mainEntityOfPage": "https://rovstudios.com/blog/{slug}",
  "wordCount": 1200,
  "articleSection": "Web Design"
}
```

**FAQ schema on posts with FAQ sections:**

Reuse existing `FAQPageSchema.tsx` component — it already works.

**Breadcrumb schema:**

Reuse existing `BreadcrumbSchema.tsx` — pass `[{ name: "Home", url: "/" }, { name: "Blog", url: "/blog" }, { name: "Post Title", url: "/blog/slug" }]`.

### GEO (Generative Engine Optimization)

Structure every post so AI search engines (ChatGPT, Perplexity, Google AI Overviews) can cite it.

| GEO Element | Implementation |
|-------------|---------------|
| FAQ section | 3-5 questions at bottom of every post, using `<h3>` for questions |
| Entity clarity | Mention "ROV Studios" + "Atlanta" in first paragraph |
| Definitive statements | Write clear, quotable sentences AI can extract |
| Structured data | Schema markup (above) helps AI understand content type |
| Topic authority | Internal linking between related posts builds topical clusters |
| Freshness signals | `dateModified` in frontmatter, updated when post is revised |

### Atlanta Geo-Signals

Every post must include at least one of:
- Atlanta neighborhood mention (Midtown, Westside, Buckhead, etc.)
- Georgia business reference
- Local industry context
- "Atlanta" in meta description
- `atlantaAngle` field in frontmatter (required)

### Content Cluster Strategy (Phase 1 — Web Design Only)

```
Pillar: "Web Design in Atlanta"
├── Case study: Bando redesign
├── Case study: IKNA project
├── Case study: DKM Corp project
├── How-to: "What Makes a Good Business Website in 2026"
├── Comparison: "Custom vs Template Websites for Atlanta Businesses"
├── FAQ: "How Much Does a Website Cost in Atlanta?"
└── (expand with more posts over time)
```

All posts in the cluster interlink to each other and to the `/web` service page. This builds topical authority for "web design Atlanta" queries.

---

## 9. Implementation Standards

These standards apply to every file written for the blog system.

### Code Quality

- **Correctness > Readability > Simplicity > Reusability > Performance** (priority order)
- Every function does ONE thing, max ~30 lines
- Every file max ~200 lines (components) or ~300 lines (utilities)
- No `any` types — use `BlogPost` interface everywhere
- No `"use client"` unless the component needs interactivity
- Comments explain WHY, not WHAT

### Naming Conventions (match existing codebase)

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `BlogPostHeader.tsx` |
| Routes/folders | kebab-case | `app/blog/[slug]/` |
| Interfaces | PascalCase singular | `BlogPost` |
| Arrays | camelCase plural | `blogPosts` |
| Schema components | `{Type}Schema.tsx` | `BlogPostingSchema.tsx` |
| Utility functions | camelCase verb+noun | `getAllPosts()`, `getPostBySlug()` |
| Content files | kebab-case | `thebando-brand-transformation.md` |

### Component Principles

- **Reuse first** — Check if a component exists before creating. Reuse `BreadcrumbSchema`, `FAQPageSchema`, `Footer`, `Navbar`, `NavigationDock`.
- **Server by default** — Only add `"use client"` when you need browser APIs or event handlers.
- **No speculative features** — Don't build search, comments, pagination, or dark mode toggle until needed. Build for 3 posts, not 300.
- **Rule of Three** — 1 occurrence: inline. 2 occurrences: note it. 3 occurrences: extract a shared component.

### Error Handling

- Blog utility functions should handle missing files gracefully (return empty array, not crash)
- `getPostBySlug` should return `null` for nonexistent slugs → Next.js `notFound()` handles the 404
- Guard against empty content directory (show "No posts yet" state, not a crash)

### Testing Strategy

- **Phase 1:** Manual verification — each post renders correctly, metadata is correct, schema validates
- **Phase 2:** Anti-slop verification is automated (string matching + required element checks)
- **Phase 3:** Lighthouse audit on blog pages (target: 90+ performance score)

### Before Committing Checklist

- [ ] `rimraf .next && npm run build` passes with no errors
- [ ] No unused imports or variables
- [ ] No `console.log` or debug artifacts
- [ ] All blog posts pass anti-slop verification
- [ ] Schema validates at https://validator.schema.org/
- [ ] Mobile layout verified (375px width minimum)
- [ ] Lighthouse performance > 90 on blog pages
- [ ] Existing pages unaffected (spot-check homepage and 1 service page)

---

## 10. File Structure

```
rov-website-2/
├── app/
│   └── blog/
│       ├── page.tsx                    ← Blog listing (server component, SSG)
│       └── [slug]/
│           └── page.tsx                ← Individual post (server component, SSG)
├── components/
│   └── blog/
│       ├── BlogCard.tsx                ← Post card for listing grid
│       ├── BlogPostHeader.tsx          ← Title, date, meta, category
│       ├── BlogPostBody.tsx            ← Styled HTML content container
│       ├── BlogPostCTA.tsx             ← CTA section at post bottom
│       ├── RelatedPosts.tsx            ← 2-3 related post cards
│       └── BlogPostingSchema.tsx       ← Schema.org BlogPosting LD+JSON
├── content/
│   ├── blog/                           ← Published posts (.md files)
│   │   ├── thebando-brand-transformation.md
│   │   ├── ikna-ecommerce-growth.md
│   │   └── dkm-corp-brand-identity.md
│   ├── intake/                         ← Project briefs (Phase 2)
│   └── review-queue/                   ← Posts awaiting approval (Phase 2)
├── lib/
│   ├── blog.ts                         ← Blog utility functions
│   └── types.ts                        ← BlogPost interface (extend existing)
└── .claude/
    └── skills/                         ← Claude Code skills (Phase 2)
        ├── rov-draft/
        ├── rov-news/
        ├── rov-publish/
        ├── rov-brief/
        ├── rov-social/                 ← Phase 3
        └── rov-analytics/              ← Phase 3
```

**New files:** ~15 files across all phases
**New dependencies:** 4 (build-time only)
**Impact on existing code:** 3 files modified (Navbar, Footer, sitemap)

---

## 11. Reminders & Open Items

### Action Items for You (Human)

- [x] **Confirm GSC is active** — Confirmed 2026-03-30. Baseline: 61 clicks, 491 impressions, 12.4% CTR, avg pos 5.9
- [x] **Provide correct client names** — Bando: Terry & Darius, DKM Corp: Dheeraj Kumar Miryala
- [x] **Provide measurable results** — Bando: 689x ordering page increase, +37.6% sessions. IKNA: +20% sales. DKM: collaborative (use estimates).
- [ ] **Update existing case study pages** with correct client names (Bando and DKM Corp pages on the live site)

### Technical Decisions Made

| Decision | Rationale |
|----------|-----------|
| Markdown files, not CMS | $0 cost, SSG performance, Claude writes files directly |
| Build-time only markdown libs | Zero client-side JS from blog dependencies |
| All server components | No unnecessary client JS — blog is static content |
| Single content cluster (web design) | Build domain authority before expanding topics |
| LinkedIn + Instagram only | Confirmed active platforms, no wasted effort |
| Text-only (no images) initially | Ship faster, add images when content proves value |
| Review queue = file directory | Simple, no database, human reads `.md` file directly |

### Success Metrics

| Timeframe | Target |
|-----------|--------|
| **Week 1** | 3 case study posts live, indexed by Google |
| **30 days** | 10+ posts, blog appearing in search results |
| **90 days** | 30+ posts, page 1-2 for 3+ Atlanta web design keywords |
| **6 months** | 100+ posts, top 5 for "web design agency atlanta," inbound leads from blog |

---

## Execution Order

```
Step 0: Prerequisites ──→ Phase 1: Infrastructure ──→ Phase 2: Skills ──→ Phase 3: Analytics
  │                           │                           │                    │
  ├─ Confirm GSC              ├─ Install deps             ├─ /rov-draft        ├─ /rov-analytics
  ├─ Switch branch            ├─ Content directory         ├─ /rov-news         ├─ /rov-social
  ├─ Collect case study       ├─ lib/blog.ts               ├─ /rov-publish      └─ Weekly schedule
  │  details                  ├─ Blog pages (list + post)  ├─ /rov-brief
  └─ Verify client names      ├─ Blog components           └─ Scheduled agents
                              ├─ Schema + SEO
                              ├─ Nav + Sitemap updates
                              └─ 3 case study posts
```

**Start Phase 1 when you're ready. I'll build it step by step on `feat/auto-blog-system`.**
