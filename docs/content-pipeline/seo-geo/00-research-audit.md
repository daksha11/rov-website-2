# ROV Studios — SEO & GEO Research Audit

**Date:** 2026-06-29
**Status:** Working document — update as we learn

---

## What We Found (Starting Point)

### Baseline Numbers (March 30, 2026 — GSC snapshot)
- **61 clicks / 491 impressions / 12.4% CTR / avg position 5.9**
- CTR is actually strong (12.4% is above average for this type of site)
- Position 5.9 means we're averaging near the top of page 1 — but for what keywords?
- **We don't know yet.** Analytics folder is empty. First job: export GSC data and run `/rov-analytics`.

### What's Strong (Don't Break This)
- AI crawlers explicitly welcomed in robots.txt (GPTBot, ClaudeBot, PerplexityBot) — smart
- FAQ schema on every service page (web, sound, video, AI automation) — solid AEO foundation
- HowTo schema on /web — good for featured snippets
- Named authors on case studies (Ayush Basu) + People schema on About — E-E-A-T is real
- Case studies have specific numbers (689x, 20%, 60% bounce reduction) — factual density AI engines like
- Next.js SSR — pages are fully crawlable, no JS rendering issues

### The Big Gap
**Zero dedicated location landing pages.**

Service pages right now:
- /web — no "Atlanta" in the title
- /sound — no "Atlanta" in the title
- /video-production — no "Atlanta" in the title
- /ai-automation — no "Atlanta" in the title

Someone searching "web design Atlanta" lands on the homepage or nowhere. There's no page built specifically to rank for that term. That's the biggest single opportunity.

---

## Keyword Thinking

### Tier 1: Core Service + Atlanta (Most Competitive, Highest Value)

These are the obvious ones. We don't rank for these yet (probably) and they're competitive.
Do NOT chase these first — build authority through Tier 2 and 3 first.

| Keyword | Monthly Searches (est.) | Competition | Notes |
|---------|------------------------|-------------|-------|
| web design Atlanta | High | High | Big agencies own this |
| website design Atlanta | High | High | Same |
| branding agency Atlanta | Medium | High | |
| video production Atlanta | Medium | Medium-High | |
| marketing agency Atlanta | Very High | Very High | Too broad |

### Tier 2: Niche + Atlanta (Less Competitive, High Intent)

This is where we should focus RIGHT NOW. Lower competition, very specific buyer intent.

| Keyword | Why It Matters | ROV Page to Target |
|---------|---------------|-------------------|
| HVAC website design Atlanta | Exact ICP, very few agencies targeting this | Create: /web/hvac-atlanta |
| roofing company website design Atlanta | Same — home services ICP | Create: /web/roofing-atlanta |
| small business website design Atlanta | High intent, less competitive than generic | Optimize: /web |
| restaurant website design Atlanta | TheBando proves we can rank + convert | Create: /web/restaurant-atlanta |
| AI automation Atlanta small business | Emerging term, low competition NOW | Optimize: /ai-automation |
| missed call text back Atlanta | Super specific, perfect ICP pain point | Blog post → /ai-automation |
| Google review automation Atlanta | Specific automation service, low competition | Blog post → /ai-automation |
| SEO for HVAC companies Atlanta | Targets ICP, educational intent | Blog post |
| Atlanta branding agency small business | Niche version of "branding Atlanta" | Optimize: homepage/about |

### Tier 3: Revenue Leaks / Problem-Aware Keywords (GEO + AEO)

These are the terms AI search engines (Perplexity, ChatGPT Search) answer. Lower traditional search volume but exploding in AI search. Write for these NOW while competition is low.

| Keyword / Question | Format to Target | Where |
|-------------------|-----------------|-------|
| how to get more leads for HVAC company | Blog post, FAQ | Blog |
| why is my business not showing up on Google Atlanta | Blog post | Blog |
| how much does a website cost for a small business Atlanta | FAQ schema on /web | /web |
| what is GEO vs SEO | Pillar blog post | Blog |
| how to automate missed calls for small business | Blog post | Blog |
| best web design agency for restaurants Atlanta | Case study angle | /casestudy/bando |
| revenue leaks small business | Already drafted — publish this | Review queue |
| how to get more Google reviews automatically | Blog post | Blog |

---

## Page Architecture Plan

### What Exists Now (Service Pages)
```
/web — generic web design
/sound — sound engineering
/video-production — video production
/ai-automation — AI automation
```

### What We Should Build
```
Service Hub Pages (Tier 2 keywords):
/web/atlanta              → "Web Design Atlanta — ROV Studios"
/web/restaurant-atlanta   → "Restaurant Website Design Atlanta"
/web/hvac-atlanta         → "HVAC Company Website Design Atlanta"
/ai-automation/atlanta    → "AI Automation for Atlanta Small Businesses"

OR (simpler approach):
/atlanta-web-design       → Hub page for Atlanta web design
/atlanta-ai-automation    → Hub page for Atlanta AI automation
```

**Decision needed:** Do we use sub-routes under service pages or standalone location pages?
Sub-routes are cleaner architecturally. Standalone pages are simpler to build and maintain.

---

## Content Calendar (Blog Posts to Write)

Priority order based on ICP, keyword opportunity, and what we already have proof for:

### Publish Now (Already Drafted)
1. `revenue-leaks-atlanta-business.md` — in review queue, publish it

### Write Next (Tier 2 + Tier 3 Targets)
2. **"Missed Call = Lost Job: How Atlanta HVAC Companies Lose Revenue After Hours"**
   - Target: missed call text back, AI automation Atlanta home services
   - Angle: specific pain point, tie to ROV automation service
   - CTA: book a call to set up the automation

3. **"Why Your Atlanta Business Isn't Showing Up on Google (And How to Fix It)"**
   - Target: local SEO Atlanta, Google Business Profile, search visibility
   - Angle: educational, build trust with ICP
   - Internal link: /web, /ai-automation

4. **"Restaurant Website Design in Atlanta: What TheBando's 689x Result Actually Means"**
   - Target: restaurant website design Atlanta
   - Angle: deep dive on the case study, specific to restaurant ICP
   - CTA: free website audit

5. **"How to Get More Google Reviews on Autopilot (What We Set Up for Atlanta Home Services)"**
   - Target: Google review automation, reputation management Atlanta
   - Angle: specific automation walkthrough, ROV proof point
   - Internal link: /ai-automation

6. **"What Is GEO and Why Atlanta Businesses Need It in 2026"**
   - Target: GEO optimization, AI search Atlanta, generative engine optimization
   - Angle: educational first-mover content, low competition NOW
   - ROV positions as the Atlanta agency that understands this

---

## GEO (Generative Engine Optimization) Strategy

GEO is about getting cited by AI search engines (Perplexity, ChatGPT Search, Google AI Overviews).
These engines reward: specific facts, named entities, clear answers, trust signals.

### What We're Already Doing Right
- Named people (Ayush Basu, Suchet) tied to specific results
- Specific numbers in content (689x, 20%, 60%)
- FAQ schema on service pages
- AI crawlers explicitly allowed

### What We Need to Add
- **SameAs links** on Organization schema — link to Instagram, LinkedIn, Facebook, Google Business Profile. This strengthens our entity graph (AI engines recognize ROV as a real, verifiable entity).
- **More specific claims with evidence** — instead of "we increase revenue" → "we took TheBando from 132 to 91,000 ordering page views in 139 days"
- **GEO landing page content** written to directly answer questions AI engines get asked:
  - "Who are the best web designers in Atlanta for restaurants?"
  - "What Atlanta agency does AI automation for small businesses?"

---

## Questions We Need to Answer (Data Required)

Before building anything, we need this data:

1. **Export GSC data** — what keywords are we actually getting impressions for? What pages?
2. **Which case study pages rank?** — /casestudy/bando might already rank for "restaurant website design Atlanta"
3. **What does Perplexity/ChatGPT say** when asked "best web design agency Atlanta"? Is ROV mentioned?
4. **What are competitors ranking for?** — pick 2-3 Atlanta web agencies and look at their keyword footprint

---

## Workflow (Once We Have GSC Data)

```
1. Export GSC → drop CSV in content/analytics/
2. Run /rov-analytics → get: top pages, top keywords, quick wins, gaps
3. Update this doc with real data
4. Pick 1 Tier 2 keyword to target per sprint
5. Write 1 blog post targeting that keyword
6. Build 1 location page targeting that keyword
7. Measure in 30 days
8. Repeat
```

---

## Skills We Need to Build (Workflow Goals)

- `/rov-keyword-research` — Given a topic or ICP, suggest Tier 1/2/3 keywords, pick the right one, draft a content brief
- `/rov-geo-page` — Build a location landing page for a given service + city/neighborhood
- `/rov-seo-audit` — Wrapper around seo-geo-aeo skill, auto-pulls ROV's own pages
- `/rov-competitor-check` — What are the top 3 Atlanta agencies ranking for? What are we missing?
