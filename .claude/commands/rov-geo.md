# /rov-geo — ROV GEO Page Builder

Generates ideas, picks one, and builds a full GEO landing page.
After building, run `/rov-geo-review` to polish and check signals.

## Arguments

Pass a topic to skip ideas and go straight to build:
`/rov-geo restaurant website design Atlanta`

Pass nothing to get ideas first:
`/rov-geo`

---

## PHASE 1: Ideas (skip if topic was passed as argument)

### Read current context

Run these in parallel before generating anything:

1. Read `ROV-BRAIN.md` — proof points, ICP, what ROV is currently working on
2. Read `content/seo-geo/02-rov-keyword-strategy.md` — Tier 1/2/3 keyword targets
3. Run `git log --oneline -8` — what has been built or updated recently
4. Search the web for: `"Atlanta small business" OR "Atlanta HVAC OR restaurant OR roofing" 2026 news`
   Look for: local events, industry shifts, regulation changes, anything the ICP cares about right now

### Generate 5 ideas

Mix across these three sources:

- **2 ideas from ROV's proof** — pages we can build around existing case studies (TheBando, Ikna, DKM Corp)
- **2 ideas from keyword gaps** — Tier 2 or Tier 3 keywords from the strategy doc we do not have a page for yet
- **1 idea from current events** — something happening in Atlanta right now that connects to what ROV sells

For each idea:

```
Idea [N]: [Proposed H1 — hooky, not keyword-stuffed]
Keyword: [exact phrase]
Proof: [which client result anchors this]
Current event hook: [what makes this timely right now]
Images available: [check public/casestudy/[client]/ — yes/no]
Route: app/web/[slug]/page.tsx
```

Then ask:
> "Which one do you want to build? Say the number or describe what you want."

---

## PHASE 2: Build the Page

### Before writing a single line, confirm:

| Question | Answer needed |
|---|---|
| Keyword | exact phrase someone types into Google or Perplexity |
| Client proof | which result, which client |
| Stats | percentages + traffic counts only — no client revenue dollars ever |
| Images | list .webp files in `public/casestudy/[client]/` — must have at least 1 |
| Real-time hook | one current event or trend to weave into "What This Means" section |
| Route | `app/web/[keyword-slug]/page.tsx` |

---

### Title formula

Read it out loud. If it sounds like an SEO tag, rewrite it.

- "Every [Business Type] Is Bleeding Revenue Online. Here Is What Fixing It Looks Like."
- "Your [Business Type] Website Is Costing You Customers. Here Is the Proof."
- "[Industry] in Atlanta Is Leaving Money on the Table. We Fixed One."
- "What Happens When You Actually Fix an Atlanta [Business Type] Website."

### Hero subtitle formula

Three honest sentences about what ROV did. Never say "no ads" unless confirmed.
`"[Service 1]. [Service 2]. [Outcome]."`
Example: `"Better branding. Smarter SEO. A site that actually converts."`

---

### Page sections (in order, no skipping)

**01 — Hero**
Dark ink gradient bg. Breadcrumb. Gradient H1. 3-sentence subtitle. Author pill + date + read time.

**02 — Stats bar**
3 numbers. Dark ink bg. Percentages + traffic only. No dollar amounts.

**03 — Table of contents**
Ember border. Numbered anchors for each H2.

**04 — The Problem**
Open with a specific person in a specific moment. Name and place.
Pull quote with the most shocking stat or fact.
End: "That is a revenue leak. Most [type] have one."
First link to case study page goes here.

**05 — Image (required)**
Real photo from `public/casestudy/[client]/`. Full-bleed.
Container: `height: clamp(240px, 40vw, 440px)`, `position: relative`, `overflow: hidden`.
Caption overlay: dark bg, paper text, bottom-left.
No stock. No placeholders. If no photos exist, stop and ask Suchet.

**06 — Psychology hook**
One surprising human behavior stat (3-second rule, mobile search, first impressions).
Dark ink callout box. Big number + source link.

**07 — What We Changed**
Three numbered changes (01/02/03). Each with a specific reason it worked.
Link to `/web` here: "this is standard in our web design process at ROV."

**08 — Image 2**
Second client photo. Different angle or moment.

**09 — Results table**
Before / After / Change columns. Change column in ember (#90422C).
Percentages and counts only. No revenue dollars.
Link to full case study after the table.

**10 — Long-term proof**
"Six months later" or "One year later" if data exists.
3 growth cards. Close with a compound growth point.
Natural link to `/web` here.

**11 — Image 3**
Third client photo if available. Caption only if it adds something.

**12 — What This Means for [Atlanta / Industry]**
Local angle. Specific neighborhoods, events, stats.
This is where the real-time hook from Phase 1 goes.
Mention AI search tools (Perplexity, ChatGPT Search) for GEO citation signal.
Link to `/web` + one external authority source.
Close with a callout box: "The short version."

**13 — Related reading**
Arrow links (→) in a vertical list. Every page must have:
- `/casestudy/[client]` — full case study
- `/web` — ROV web design services
- `/ai-automation` — AI automations for [industry]
- `/blog/every-business-leaks-money` — revenue leak framework
- `/ctrla` — CTRL-A editorial arm

**14 — FAQ**
5 questions. Every answer contains at least one specific number or fact.
Question types: cost, timeline, "will it work", "X or Y", "what is [concept]"
These are written to be cited by Perplexity and ChatGPT Search.

**15 — Author**
Dark ink card. Gradient avatar. Suchet Konda, Co-Founder and Systems Architect.
Link `/about` in the title. 2 specific sentences about the work.

**16 — CTA**
Gradient bg (`#EA9A61` to `#90422C`). "Want to know where your [type] is leaking revenue?"
Two buttons: "Book a free audit" (Calendly) + "See our web services" (/web)

---

### Design quick reference

| Element | Value |
|---|---|
| H1 | Instrument Serif, gradient `#FFF4E3 → #EA9A61 → #B16937` |
| H2 | Instrument Serif, `#90422C` |
| H3 / labels | Neue Montreal 700, `#B16937` |
| Accent | `#EA9A61` |
| Body | DM Sans, `#3B2114` |
| Page bg | `#FFF4E3` |
| Hero bg | `linear-gradient(160deg, #3B2114 0%, #603E25 55%, #90422C 100%)` |
| Dark sections | `#3B2114` |
| Pull quote border | `4px solid #EA9A61` |
| CTA bg | `linear-gradient(135deg, #EA9A61 0%, #90422C 100%)` |

All colors are inline styles — Tailwind does not have brand colors mapped.

---

### Internal linking targets

| Page | Where | Anchor text |
|---|---|---|
| `/web` | 2-3x in body | "ROV web design", "our web design process", "a website that works" |
| `/casestudy/[client]` | 2-3x in body | "the full case study", "[client] audit", "full breakdown" |
| `/ai-automation` | related reading | "AI automations for [industry]" |
| `/ctrla` | related reading | "CTRL-A by ROV Studios" |
| `/about` | author + hero pill | natural |
| `/blog/every-business-leaks-money` | related reading | "every business leaks money" |
| client website | intro section | client name, natural link |

---

### Writing rules (violations block publishing)

- NO em dashes (—). Period, comma, or rewrite.
- NO "if X then Y." Split into two sentences.
- NO client revenue dollar amounts. Percentages and counts only.
- NO "no ads / no promotions" without confirming with Suchet.
- ALWAYS open with a person. Name. Place. Situation.
- Short sentences. One idea per sentence.

---

### Done? Run this before calling it finished

```bash
npx tsc --noEmit
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/web/[slug]
grep -n "—" app/web/[slug]/page.tsx
grep -c "href=\"/" app/web/[slug]/page.tsx
```

Then hand off to `/rov-geo-review` for final polish.
