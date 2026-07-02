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
3. Read `content/seo-geo/01-what-makes-a-good-geo-page.md` — GEO rules: what Perplexity/ChatGPT look for, structure rules, what gets cited
4. Read `.claude/blog-design-standard.md` — design system (fonts, colors, component patterns, page structure)
5. Run `git log --oneline -8` — what has been built or updated recently
6. Search the web for: `"Atlanta small business" OR "Atlanta HVAC OR restaurant OR roofing" 2026 news`
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
| Images | inventory ALL of `public/` (see Image sourcing below), pick 2-3 that MATCH the sections — must have at least 1 |
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
Real asset from `public/` (see Image sourcing below). Full-bleed.
Container: `height: clamp(240px, 40vw, 440px)`, `position: relative`, `overflow: hidden`.
Caption overlay: dark bg, paper text, bottom-left.
No stock. No placeholders. If no matching asset exists, stop and ask Suchet.

**06 — Psychology hook**
One surprising human behavior stat (3-second rule, mobile search, first impressions).
Dark ink callout box. Big number + source link.

**07 — What We Changed**
Three numbered changes (01/02/03). Each with a specific reason it worked.
Link to `/web` here: "this is standard in our web design process at ROV."

**08 — Image 2**
A DIFFERENT asset from Image 1 (different source folder or client). Do not reuse the same client's photos for the whole page. Match it to this section (e.g. an automation screenshot near the automation copy, a client site near the "a website that works" copy).

**09 — Results table**
Before / After / Change columns. Change column in ember (#90422C).
Percentages and counts only. No revenue dollars.
Link to full case study after the table.

**10 — Long-term proof**
"Six months later" or "One year later" if data exists.
3 growth cards. Close with a compound growth point.
Natural link to `/web` here.

**11 — Image 3**
A third distinct asset if it earns its place. Caption only if it adds something.

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
Cream bg `#FFF4E3`, border `1.5px solid rgba(59,33,20,0.15)`, borderRadius 16. "Want to know where your [type] is leaking revenue?"
Primary button: `#90422C` bg, cream text. Secondary button: transparent, dark border.
Do NOT use a dark or gradient background on the CTA.

---

### Image sourcing (do this, do not default to bando)

The page needs 2-3 real images and they should NOT all be from the same client. Restaurant photos on a plumbing page reads as a stock-photo lie. Pull the right asset for each section.

1. **Inventory everything first.** List every image folder, not just casestudy:
   ```bash
   for d in public/*/; do n=$(find "$d" -maxdepth 2 \( -name '*.webp' -o -name '*.png' -o -name '*.jpg' \) | wc -l); echo "$d: $n"; done
   ```
   Known-useful folders: `casestudy/{bando,ikna,atm,Pursue}` (client photos), `heroassets/` (coding, analytics, n8n automation, event frames), `webdev/` (real client site homepages), `aipage/` (AI workflow visuals), `clients/` (client headshots), `og/` (share cards).

2. **LOOK at the candidates before you use them.** Read the actual image files with the Read tool. Caption what is really in the frame. Never caption from the filename alone.

3. **Match asset to section.** Automation copy gets an automation screenshot (`heroassets/n8nframe.webp`). "A website that works" copy gets a real client site (`webdev/ayseiknawebhome.webp`). The client-proof section gets that client's photo. Pick on meaning, not convenience.

4. **Vary the source across the page.** Use at most one image from any single client unless the whole page is that client's case study. One bando photo in TheBando's proof section is honest; three bando photos on a Google-visibility page is not.

5. **Never publish private data.** Skip anything showing prospect lists, emails, phone numbers, or credentials (e.g. `heroassets/excelframe.webp` is a live lead list — do not use it).

6. **Full-bleed pattern** (all images): `margin: "0 -24px 56px"`, `position: relative`, `height: clamp(240px, 40vw, 440px)` for the hero image / `clamp(240px, 35vw, 400px)` for later ones, `overflow: hidden`, `<Image ... fill style={{ objectFit: "cover" }} />`, dark caption overlay bottom-left.

### Design quick reference

**Full spec:** `.claude/blog-design-standard.md` — read it at the start of every build.
Canonical implementation: `app/blog/restaurant-atlanta/page.tsx`

| Element | Value |
|---|---|
| H1 (hero) | Norwige, solid white `#FFFFFF`, NOT gradient |
| H2 (sections) | Norwige, `#90422C` |
| H3 / card titles | Inter 700, `#B16937` |
| Labels / eyebrows | Neue Montreal 700, `#B16937`, 11px uppercase |
| Body | Inter, `#3B2114` |
| Page bg | `#FFF4E3` (cream) |
| Hero bg | `linear-gradient(160deg, #3B2114 0%, #603E25 55%, #90422C 100%)` |
| Stats bar / dark cards | `#3B2114` |
| Pull quote border | `4px solid #EA9A61` |
| CTA bg | `#FFF4E3` (cream), NOT gradient — dark button `#90422C` |
| Author pill (hero) | `#FFF4E3` bg, `#3B2114` text — NOT dark/transparent |

All colors are inline styles — Tailwind does not have brand colors mapped.

### Design density (required — do not ship a wall of text)

Read the "Design Element Library" and "Density Rule" in `.claude/blog-design-standard.md` and use them liberally. Minimum per page:
- 1+ pull quote (lift out the most surprising line)
- 1+ dark stat callout card or stats row
- 1+ data table when there is before/after or comparison data
- 1+ info/summary box ("The short version")
- Numbered step cards for any process section
- An image with caption every 2-3 sections

Test: someone scrolling fast with the sound off should get the whole story from the bubbles, quotes, numbers, tables, and images. Two H2 sections in a row with no visual element between them = add one.

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
