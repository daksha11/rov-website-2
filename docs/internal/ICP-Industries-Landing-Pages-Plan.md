# ICP Industry Landing Pages — Implementation Plan

**Status:** Ready for execution (Opus)
**Author:** Fable (planning pass), 2026-07-21
**Scope:** A content-driven system at `/industries/[slug]` producing premium, Atlanta-targeted ICP landing pages. Six locked ICPs. One shared template, many content files. Modeled on the blog system's architecture, styled past the blog standard's baseline.

---

## 0. Execution order

Build in this sequence so each step is testable before the next:

1. `lib/types.ts` — add `Industry` types (§2)
2. `lib/industries.ts` — content loader (§3.1)
3. `app/api/industries/lead/route.ts` — lead endpoint (§9)
4. `components/industries/*` — section components (§3.3)
5. `app/industries/[slug]/page.tsx` — route (§3.2)
6. `content/industries/_TEMPLATE.md` + `docs/internal/icp-page-generation-prompt.md` (§5)
7. The six content files, in the locked order (§10)
8. `sitemap.xml` integration + blog stub cross-links (§7)

Every page ships Phase 1 (`indexed: false`, noindex, outreach-only). Promotion to indexed is a separate, later, Andi-gated step (§6).

---

## 1. ICP input model

### 1.1 Free-text seed

One pitch-line sentence, e.g. `"we help real estate agents in ATL brand and tell stories"`. This is the creative spark and is preserved verbatim in frontmatter as `pitchLine` — it anchors the page's voice and is useful later when auditing whether the page drifted from its intent.

### 1.2 Normalized field set

The pitch line is expanded (by Andi filling the template, or by an LLM extraction step using the generation prompt in §5) into:

| Field | Req | What "good" looks like |
|---|---|---|
| `industry` | ✅ | A person could self-identify: "real estate agents and brokerages," not "real estate" |
| `audience` | ✅ | Who exactly reads this page (role + situation): "an agent tired of looking like every other headshot site, or a broker whose firm blends in" |
| `geo` | ✅ | `"Atlanta"` for all six; Beltline page uses `"Atlanta Beltline"` — a place the reader would name themselves |
| `painPoint` | ✅ | One sentence, felt not abstract. "Buyers can't tell your development from the one across the street" — not "differentiation challenges" |
| `supportingPains` | ✅ | 2–4 secondary pains, each concrete enough to become a section or card |
| `valueProp` | ✅ | What ROV changes, stated as outcome: "a brand and story people remember after they close the tab" |
| `serviceLean` | ✅ | 1–3 of: `brand`, `web`, `video`, `creative-tech` — drives which services get page real estate |
| `proofPoints` | ✅ | **Real only.** Case studies, client names, numbers Andi can stand behind. If none exist for this ICP, borrow an adjacent one honestly ("we did this for a restaurant; here's why it transfers") — never invent |
| `ctaGoal` | ✅ | Constant across all six: call + lead form |
| `toneNotes` | ⬜ | ICP-specific register, e.g. home services = plainer, fewer design words; tech = can handle "design system" |
| `keywords` | ⬜ | 3–6 search phrases the page should plausibly answer, informing H2s and FAQ questions |

**Quality gate:** if `painPoint`, `audience`, or `proofPoints` read generic (could apply to any agency's page), the normalization failed — redo before drafting copy.

---

## 2. Content schema — `content/industries/*.md`

One markdown file per ICP. Frontmatter drives every structured section; the markdown body is the long-form "Main Content" section. Differs from blog frontmatter deliberately: no author/readingTime/category (not an article), adds hero/stats/visual/proof/CTA blocks (it's a sales page).

```yaml
---
# Identity
slug: real-estate-agents-atlanta
industry: Real estate agents & brokerages
geo: Atlanta
pitchLine: "we help real estate agents in ATL brand and tell stories"

# SEO
title: Branding & Storytelling for Atlanta Real Estate Agents   # on-page H1 support / og
seoTitle: Real Estate Branding Atlanta | Range of View Studios  # short <title>, no SERP truncation
description: ""            # 150–160 chars, answer-shaped (GEO: states who/what/where plainly)
coverImage: /og/og-industries-real-estate.webp   # 1200×630

# Lifecycle (two flags — see §6)
published: true            # false = not built at all
indexed: false             # false = built + reachable, but noindex + excluded from sitemap
date: 2026-07-21
dateModified: 2026-07-21

# Hero
headline: ""               # solid white H1, Norwige. Speaks to the reader, not about ROV
subhead: ""                # 1–2 sentences, cream/85
heroGradient: ember        # ember | emberDark | earth  (§3.4 — maps to brand-kit gradients)
answerLine: ""             # GEO/AEO: one plain declarative sentence rendered right under the hero —
                           # "Range of View Studios is an Atlanta creative studio that builds brand
                           #  identities and websites for real estate agents and brokerages."

# Stats Row (3–4; real numbers or honest process facts — never fabricated)
stats:
  - { value: "2×", label: "online revenue for The Bando after relaunch" }
  - { value: "4", label: "practice areas under one roof" }

# Pain section (cards)
pains:
  - { title: "", body: "" }     # 3–4, from supportingPains

# Services for this ICP (subset, ordered by serviceLean)
services:
  - { name: "", blurb: "" }     # 3–5, blurbs rewritten for this reader, not generic service copy

# Visual explanation (§3.3 — exactly one, typed)
visual:
  type: before-after            # before-after | process-flow | diagram | annotated-mockup
  title: ""
  # type-specific payload, see §3.3.4

# Trust/proof slot (replaces blog Author Card)
proof:
  type: case-study              # case-study | logos | credentials
  heading: ""
  body: ""
  stat: { value: "", label: "" }   # optional
  link: ""                         # optional, e.g. related blog post

# FAQ (4–6; questions phrased as the reader would type/ask them — AEO)
faqs:
  - { q: "", a: "" }

# CTA
cta:
  heading: ""
  body: ""
  phone: "+1-XXX-XXX-XXXX"      # OPEN DECISION (§12) — Andi supplies number or booking link
---

Markdown body — the Main Content section. Minimum ~800 words of substantive,
ICP-specific prose (§8). H2s track the reader's questions (keywords field).
```

Rendered body reuses the blog's markdown pipeline (`lib/blog.ts` uses gray-matter + the existing HTML conversion; mirror whatever `htmlContent` mechanism `BlogPostBody` consumes).

---

## 3. Architecture

### 3.1 `lib/industries.ts` — mirror of `lib/blog.ts`

Same shape, byte-for-byte conventions: `fs.readdirSync` + `gray-matter` over `content/industries/`, `ensureDir` guard, `Industry` type added to `lib/types.ts` (typed sub-shapes: `IndustryStat`, `IndustryPain`, `IndustryVisual` discriminated union on `type`, `IndustryProof`, `IndustryFaq`, `IndustryCta`). Exports:

- `getAllIndustries(): Industry[]` — filters `published`, sorted by `date`
- `getIndustryBySlug(slug): Industry | null`
- `getIndexedIndustries(): Industry[]` — filters `published && indexed` (sitemap + future index page)

### 3.2 Route — `app/industries/[slug]/page.tsx`

Thin composition, exactly like `app/blog/[slug]/page.tsx`:

- `generateStaticParams()` from `getAllIndustries()` (drafts included — they're statically built for outreach links, just not indexed)
- `generateMetadata()`: `seoTitle`/`description`, canonical `https://www.rovstudios.com/industries/[slug]`, OpenGraph (`type: "website"`, coverImage), twitter card, **and `robots: { index: false, follow: false }` whenever `indexed: false`** — this is the entire Phase 1/Phase 2 switch
- Renders schema components (§4), then sections in order (§3.3), then dynamically-imported `NavigationDock` + `Footer` (`ssr: false`), same as blog/web pages

No separate `layout.tsx` needed — `page.tsx` is a server component and owns metadata (the memory note about needing a `layout.tsx` applies to `"use client"` pages; this route stays server-side with client leaves).

### 3.3 Components — `components/industries/*.tsx`

> **Amendment (2026-07-21, Andi's direction):** the presentation layer now follows the live service-page DNA (see `app/ai-automation`, `components/sound/*`), not the article-on-cream blog styling described in the tables below. Pages are dark and cinematic: a full-viewport black hero with radial ember light-splashes (CSS only, no WebGL/canvas), a solid-white bold headline **plus** a `NorwigeHeroItalic` gradient accent line (`headlineAccent`), a pill-badge `eyebrow`, dark stat/pain/service/visual/body/proof sections, the shared `components/common/FAQSection`, and a dark lead-capture finale whose form sits inside a Linen-Light card. This supersedes the "solid white H1, never gradient text" note and the "CTA section is light" rule for these pages. Two new optional frontmatter fields drive the hero: `headlineAccent` and `eyebrow` (see §2 schema and `_TEMPLATE.md`). The section/data model, loader, route, analytics, and noindex/draft mechanics are unchanged.

Each takes parsed `Industry` data as props. Fonts follow the live sound-page mechanism in every file:

```tsx
const HEADING = "Norwige, sans-serif";
const BODY = "'Roboto', sans-serif";
```

applied via inline `style={{ fontFamily: HEADING }}` — no Tailwind font classes, no Inter/Neue Montreal. (Flagged as open decision §11.1.)

| Component | Client? | Notes |
|---|---|---|
| `IndustryHero.tsx` | server | Gradient bg per `heroGradient` (§3.4), label (Roboto 500, 10px, 0.18em tracking, uppercase, Ember → on dark use `#EA9A61`), H1 solid white Norwige, subhead cream/85, `answerLine` in a quiet cream/70 line below. Primary CTA button (Ember bg) + secondary "call us" ghost link, both firing gtag events (§9.3). Grain overlay optional per brand kit |
| `IndustryStats.tsx` | server | 3–4 stat tiles on cream. Norwige numerals, Roboto labels. Mobile: 2×2 grid, or horizontal snap-scroll if 3 uneven |
| `IndustryPains.tsx` | server | Pain cards on Sand-tinted surfaces (`#D0BEA5` @ ~30% on cream). Hover: translateY(-2px), 200ms ease. Mobile: stacked |
| `IndustryBody.tsx` | server | Rendered markdown, same typographic treatment as `BlogPostBody` (espresso text on cream, Norwige H2s) |
| `IndustryVisual.tsx` | client | Discriminated-union switch on `visual.type` (§3.3.4). The one interactive centerpiece per page |
| `IndustryServices.tsx` | server | Service cards for this ICP's `services` list; Ember label + Norwige name + Roboto blurb |
| `IndustryProof.tsx` | server | Trust slot: case-study panel (Ember Dark gradient card with cream text is permitted here — it's not the CTA section), logos row, or credentials block per `proof.type` |
| `IndustryFAQ.tsx` | client | Cream bg, Norwige-bold questions, chevron accordion — reuse `BlogFAQ`'s interaction pattern (or extract/generalize it if trivially shareable; don't fork a third accordion). Keyboard operable, visible focus ring |
| `IndustryCTA.tsx` | client | Cream bg, dark text (hard rule). Premium via a Linen Light gradient wash (`90deg, #D0BEA5 → #FFF4E3`) + Ember accents, not darkness. Contains phone/booking link + `IndustryLeadForm` |
| `IndustryLeadForm.tsx` | client | §9 |

**3.3.4 `visual` payload variants** (all pure CSS/SVG + small React — no chart/animation libraries):

- `before-after`: `{ before: {label, points[]}, after: {label, points[]} }` — two-panel comparison; desktop side-by-side, mobile stacked with "before → after" flow
- `process-flow`: `{ steps: [{n, title, body}] }` — numbered horizontal flow desktop, vertical timeline mobile
- `diagram`: `{ items: [{title, body}], centerLabel }` — hub-and-spoke; mobile: center card then stacked spokes
- `annotated-mockup`: `{ image, alt, annotations: [{x, y, label}] }` — `next/image` with positioned callouts; mobile: numbered markers + legend list below (no floating labels)

Scroll-reveal on section entry: opacity 0→1, translateY(24px)→0, ~650ms ease-out (brand kit pattern). Respect `prefers-reduced-motion`.

### 3.4 Gradient tokens

Add the four brand-kit gradients to `app/globals.css` as CSS vars (paste from brand-kit tokens block): `--gradient-brand` (Ember, `132deg #EA9A61→#B16937→#A64D2B→#42201C`), `--gradient-earth`, `--gradient-ember` (Ember Dark), `--gradient-linen`. `heroGradient` frontmatter maps: `ember` → brand, `emberDark` → ember-dark, `earth` → earth. **Only these four — no invented gradients.** Hero text must pass 4.5:1 against the darkest and lightest hero regions it sits on; if the Ember Gradient's light end (`#EA9A61`) sits behind text, add a Deep Brown scrim at 25–40%.

### 3.5 Reused as-is (no new versions)

`NavigationDock`, `Footer`, `BreadcrumbSchema`, `FAQPageSchema`, `ServiceSchema` (already parameterized — see sound page usage), `next/image`. `TestimonialsSection` optional per page if relevant quotes exist. **Net-new:** everything in `components/industries/`, `lib/industries.ts`, the lead API route.

---

## 4. SEO / schema / GEO / AEO

**JSON-LD (per page):** `Service` (via existing `ServiceSchema` — `serviceType` from serviceLean, `areaServed: "Atlanta, GA"`, provider Range of View Studios) + `FAQPage` (via `FAQPageSchema` from `faqs`) + `BreadcrumbList` (Home → Industries → page). **Not `Article`** — these are commercial service pages; `Service` is the honest and correct type. If `ServiceSchema` lacks `areaServed`, extend it with an optional prop rather than forking.

**GEO:** `answerLine` renders as real DOM text immediately after the H1 — one liftable sentence stating who/what/where. Stats carry their claim in plain text ("doubled The Bando's online revenue"), not just a bare numeral. First body paragraph restates the page's core answer declaratively.

**AEO:** FAQ questions phrased as typed queries ("How much does branding cost for a real estate agent in Atlanta?"), answers front-loaded (verdict first sentence, nuance after). H2s in the body track `keywords`. Short paragraphs, lists, scannable.

**UTM handling:** canonical URL never includes query params (already true — `alternates.canonical` is hardcoded per slug). Pages are statically generated; UTM params are read client-side only, inside `IndustryLeadForm`/CTA click handlers (§9), so `?utm_source=...` links work with zero SSG impact.

---

## 5. Generation workflow (ICP #7 and beyond)

Two repo artifacts, both created in this build:

1. **`content/industries/_TEMPLATE.md`** — the full frontmatter skeleton from §2 with inline comments. Underscore prefix; loader must skip files starting with `_`.
2. **`docs/internal/icp-page-generation-prompt.md`** — the reusable generation prompt. Contents, in order:
   - Instruction header: read `c:\Users\ayush\Desktop\R.O.V\company.md` and `brand-kit.md` first; voice = Grounded/Warm/Refined; **no em dashes anywhere in copy** (commas, colons, periods, or · instead); no hype words; first-person "we"
   - Step 1 — Normalize: expand the pitch line into the §1.2 field set; stop and ask Andi if `proofPoints` is empty rather than inventing
   - Step 2 — Draft: fill `_TEMPLATE.md` completely; body ≥800 words; FAQ answers front-loaded; `answerLine` mandatory
   - Step 3 — Hard rules checklist embedded in the prompt: no fabricated stats/testimonials/client names; hero H1 white; CTA section light; only the four approved gradients; every page a distinct `visual.type` from its neighbors where possible
   - Step 4 — Output: a single complete `.md` file with `published: true, indexed: false`

Workflow: pitch line → run prompt → review draft against §6 checklist → commit → page is live at its URL for outreach, invisible to crawlers.

---

## 6. Phasing & promotion

**Phase 1 — Draft (default):** `indexed: false`. Statically built, reachable by direct link, `robots noindex`, excluded from `sitemap.xml`, no internal links pointing at it. Used in DMs, cold email, ads.

**Phase 2 — Promoted:** flip `indexed: true`, add internal links (§7), update `dateModified`. Gate — **all** must pass, and **Andi personally signs off; this is a manual approval, never automated**:

- [ ] Used in real outreach at least once, or Andi decides it's strong enough regardless
- [ ] Copy passes voice pillars + zero em dashes + zero hype words
- [ ] All stats/proof verified real by Andi
- [ ] Design bar spot-check: gradient rules, H1 white, CTA light, visual element works at 375px width, no layout shift on load
- [ ] Lighthouse (mobile): Performance ≥ 90, no CLS regression
- [ ] FAQ schema validates (Rich Results test)
- [ ] Uniqueness check vs. already-promoted pages (§8)

---

## 7. IA / navigation / internal linking

- **URL:** `/industries/[slug]`. Not in main nav for now.
- **Sitemap:** wherever the sitemap is generated, include `getIndexedIndustries()` only.
- **Index page:** defer `/industries` until ≥4 pages are promoted; when built, it lists promoted pages only.
- **`/web/*` pages: recommendation — leave as legacy, do not migrate.** They're hand-built, presumably indexed/ranking; migration risks churn for zero reader benefit. Cross-link where topical instead (`missed-call-text-back-atlanta-hvac` ↔ home-services ICP page; `real-estate-agent-website-atlanta` ↔ real-estate ICP page). Revisit migration only if maintaining them becomes a real cost.
- **Internal links on promotion:** add a blog stub (`externalUrl` frontmatter pattern, exactly like the existing `/web/*` stubs) so the blog listing surfaces the page; link the restaurant ICP page to/from Bando case-study content; link relevant existing blog posts (e.g. `creative-studios-atlanta`) to promoted ICP pages where topical.

---

## 8. Thin/duplicate-content guardrails

Per page, enforced at the §6 review:

- ≥800 words of unique body prose; no paragraph reused across ICP pages
- ≥3 stats not shared with any other ICP page (generic ROV facts like "4 practice areas" count as shared — max 1 shared stat per page)
- Unique `visual` content always; unique `visual.type` vs. adjacent pages where feasible (six pages, four types — plan in §10 assigns them)
- FAQ overlap ≤1 question with any other ICP page
- Headline/subhead/answerLine written fresh per page — no madlib patterns ("We help {X} in Atlanta stand out")
- If a new ICP can't clear these bars, it doesn't get a page — it gets folded into an existing one

---

## 9. CTA & lead capture

### 9.1 `IndustryLeadForm.tsx`

Fields: name (req), business name (req), email (req), phone (opt), "what do you need?" free-text (opt, 500 max). Hidden: `icpSlug`, `utmSource`/`utmMedium`/`utmCampaign` (read from `window.location.search` on mount), honeypot `company` (visually hidden, `autocomplete="off"`, `tabIndex={-1}`). States: idle → submitting → success ("We'll get back to you within one business day") / error (honest message from API). Labels always visible (no placeholder-only), Ember focus rings, ≥44px touch targets.

### 9.2 `app/api/industries/lead/route.ts`

Clone the `klaviyo/subscribe` route's skeleton:

- zod `bodySchema`: the fields above; honeypot `company: z.string().max(0).optional()`
- Honeypot tripped → return `{ ok: true }`, do nothing (no bot signal)
- Delivery: if `LEAD_WEBHOOK_URL` **or** `RESEND_API_KEY` env is set, send (email to `LEAD_TO_EMAIL`, default placeholder `admin@pursuenetworking.com`); **else return `503 { ok: false, code: "not_configured", error: "..." }`** — same graceful-degradation pattern, form testable before wiring
- Consistent `{ ok, error }` JSON, timeouts on outbound fetch, `runtime = "nodejs"`

Actual provider choice (Resend vs. n8n webhook vs. SMTP) is Andi's later call — the route's env-driven design makes it a config change, not a code change.

### 9.3 Analytics (gtag already global via `app/layout.tsx`)

| Event | When | Params |
|---|---|---|
| `icp_call_click` | phone/booking link click | `icp_slug`, `utm_source/medium/campaign` |
| `icp_lead_submit` | form submit attempt | same |
| `icp_lead_success` | API `ok: true` | same |
| `icp_visual_engage` | first interaction with `IndustryVisual` | `icp_slug`, `visual_type` |

All calls guarded (`typeof window.gtag === "function"`). This is what makes the six pages comparable ICP-by-ICP.

---

## 10. Per-ICP build notes (locked order)

| # | Slug | Hero gradient | Visual (type) | Proof slot | Headline direction |
|---|---|---|---|---|---|
| 1 | `real-estate-agents-atlanta` | `ember` | `before-after`: generic listing-agent presence vs. branded agent/brokerage presence | `credentials` + link to `/web/real-estate-agent-website-atlanta` | Every listing looks the same. You don't have to. Speaks to agent *or* brokerage — "your name" / "your firm's name" phrasing, never picks one |
| 2 | `restaurants-atlanta` | `ember` | `diagram`: hub "your restaurant" → spokes: site/ordering, illustration & menus, flyers, lead capture, AI phone receptionist | `case-study`: The Bando, 2× online revenue (the anchor page — richest proof) | The dining room is full. The internet is where you're leaving money |
| 3 | `real-estate-developers-atlanta` | `earth` | `process-flow`: name & identity → renderings & story → marketing site → launch | `credentials` (brand+web launches; borrow adjacent proof honestly) | Buyers see ten new developments a week. Make yours the one they remember |
| 4 | `beltline-atlanta` | `emberDark` | `annotated-mockup`: Beltline storefront/walk-by moment, annotated with what sharp branding wins | `logos` or Atlanta work montage | On the Beltline, whoever looks sharpest wins the walk-by. Geo-defined, industry-agnostic copy |
| 5 | `tech-companies-atlanta` | `emberDark` | `before-after`: capable-product-bland-face vs. product with a story | `credentials`: creative-tech practice — "we build with the same tools you do" | Your product is good. Your story should look like it |
| 6 | `home-services-atlanta` | `ember` | `process-flow`: missed call → AI receptionist answers → lead captured → job booked (the hook), credibility close in body | `case-study`-style stat if HVAC page has one; else credentials + link to `/web/missed-call-text-back-atlanta-hvac` | Lead with missed-calls pain, then pivot: a $15k roof doesn't get booked off a site that looks like a flyer |

Copy for all six is generated via the §5 prompt and reviewed by Andi before commit — the table above is direction, not final copy.

> **Amendment (2026-07-21):** the per-page `heroGradient` still drives the ember/earth accent tones used in the Visual and Proof cards, but every hero now renders on the same dark cinematic stage (black + radial ember splashes) per the §3.3 amendment, rather than a full-bleed gradient background. Each page's `headline` is split into a solid-white setup line plus a gradient italic `headlineAccent` line, with a geo-specific `eyebrow` pill.

---

## 11. Media plan

### 11.1 Existing assets to use (per ICP)

| Page | Assets |
|---|---|
| real-estate-agents | `videoprod/singlefamhomes/*` b-roll (re-encode, §12.3), `videoprod/Atlskylineweb.mp4`; before/after mechanism demo: `webdev/pursuebefore.mp4` + `pursueafter.mp4` if no agent example is supplied |
| restaurants | `casestudy/bando/*.webp` (recompress ≤200KB each), `webdev/bando.mp4` (poster + lazy), `og/og-bando.webp` for OG |
| real-estate-developers | `videoprod/commercialbuildings/*`, `videoprod/amentity_neighborhood/*`, `Signiabenzweb.mp4` |
| beltline | `videoprod/eventsweb/Poncerooftop.mp4`, `Parkevent.mp4`, `heroassets/ponceshowframe.webp`, `misc/atlskylinefooter.webp` |
| tech-companies | `heroassets/codingframe.webp`, `n8nframe.webp`, `aipage/aiwf1-3.webp`, `logos/*.svg`, `casestudy/Pursue/*`, Pursue before/after videos |
| home-services | `aipage/` SVG icons + workflow assets for the AI-receptionist process flow. **No trade imagery exists — this page ships illustration-first by design until Andi supplies real footage** |

> **Update (2026-07-21):** showcase media is now wired. A new `IndustryShowcase.tsx` dark band (between Services and Body) renders the optional `showcase` frontmatter array (lazy-mounted autoplay videos + next/image images from existing `public/` assets), and `proof.image` shows an existing image inside the proof panel. Real-estate-agents, restaurants, developers, beltline, and tech each carry existing-asset video/image cards; home-services stays illustration-first with a single automation image. No new binaries, no re-encodes.

### 11.2 Placeholder policy

Every image/video slot renders inside a fixed-aspect-ratio container with an Ember Dark gradient fallback block (plus a small Roboto label) when the frontmatter `image`/`video` field is empty. No layout shift, no broken-image look, no stock photos ever. Swapping in real media later = filling one frontmatter path.

### 11.3 Optimization rules (hard requirements)

- Images on these pages: WebP only, ≤200KB, correct `sizes` attr, `next/image` everywhere. Never ship the existing large PNGs (`casestudy/casestudyheroimg.png`, `heroassets/1.png`, `2.png`, `webfolder1.png`) unconverted.
- Recompress `casestudy/bando/bando1/2/5.webp` (currently 552–740KB) to ≤200KB copies for these pages (write new files, e.g. `public/industries/`, do not overwrite the originals used elsewhere).
- Inline video: `preload="none"`, poster frame (WebP), muted loop, lazy-mounted below the fold; target ≤2MB per clip — cut 5–8s loops from the long `singlefamhomes` clips (3–7.7MB) rather than shipping them whole. `ffmpeg` re-encode at 1080p CRF ~28.
- New OG images: `og-industries-[slug].webp`, 1200×630, ≤100KB — branded gradient + Norwige headline card style (no photography required); restaurants may reuse `og-bando.webp`.
- LCP element on every page is the hero (gradient + text) — never a photo/video, so media loading can't hurt LCP.

### 11.3a Media-processing follow-ups (deferred from the initial build)

The initial `/industries` build shipped with the placeholder/fallback mechanism
and only referenced existing files ≤200KB. No ffmpeg re-encodes or image
recompression were run in that pass. Pending media work, to run as a follow-up:

- [ ] Recompress `casestudy/bando/bando1.webp` (756KB), `bando2.webp` (565KB),
      `bando5.webp` (636KB), `bando4.webp` (284KB) to ≤200KB copies under
      `public/industries/` (do not overwrite originals). Then wire them into the
      restaurants page proof/body if desired. Suggested:
      `cwebp -q 72 -resize 1200 0 public/casestudy/bando/bando1.webp -o public/industries/bando1.webp` (repeat per file, tune quality to hit ≤200KB).
- [ ] Cut 5–8s muted loops from the long `videoprod/singlefamhomes/*` and
      `videoprod/commercialbuildings/*` clips (3–7.7MB) for real-estate and
      developers pages, target ≤2MB: `ffmpeg -i in.mp4 -t 6 -vf scale=1920:-2 -c:v libx264 -crf 28 -an -movflags +faststart public/industries/<name>.mp4`, plus a WebP poster frame.
- [ ] Generate the five missing OG cards (gradient + Norwige headline style,
      1200×630, ≤100KB): `og-industries-real-estate.webp`,
      `og-industries-developers.webp`, `og-industries-beltline.webp`,
      `og-industries-tech.webp`, `og-industries-home-services.webp`. Restaurants
      already reuses the existing `og/og-bando.webp`.
- [ ] Larger existing assets referenced in §11.1 (`heroassets/codingframe.webp`
      268KB, `misc/atlskylinefooter.webp` 1.4MB, `webfolder3.webp` 278KB, etc.)
      must be converted to ≤200KB copies before any page references them. Until
      then those slots use the gradient placeholder block.

### 11.4 Media requested from Andi (pages don't block on these)

1. Home services: any real trade footage/photos (roof, pool, HVAC, remodel) — even phone footage
2. Beltline: corridor walk/bike clip or storefront stills
3. Real estate: one agent/brokerage branding before/after, if one exists
4. Approval to generate the five missing OG cards in the gradient+headline style

## 12. Open decisions for Andi (Opus: do not guess these)

1. **Font discrepancy:** live components + brand-kit say Norwige/Roboto; the written blog-design-standard says Norwige/Inter/Neue Montreal. This plan follows Norwige/Roboto (live pattern). Confirm, and consider updating the blog-standard doc — or tell us the blog standard was deliberate and these pages should match it instead.
2. **Phone/CTA number:** actual phone number or booking link (Calendly?) for the call CTA.
3. **Lead delivery:** Resend, n8n webhook, or something else — and the real destination inbox (placeholder is `admin@pursuenetworking.com`).
4. **Proof inventory:** for ICPs 3, 4, 5 — which real projects/clients can be named or shown? The pages hold honest adjacent proof until supplied.
5. **Beltline slug/title:** `beltline-atlanta` vs. something more searchable like `beltline-business-branding` — depends whether this page is outreach-first (keep it punchy) or intended to rank later.
