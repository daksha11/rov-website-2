# ICP Outreach: the free-value play

The six `/industries/[slug]` pages are the pitch. This folder is the **value we hand a prospect for free** so the pitch has a reason to land. Two gifts per prospect:

1. **A custom SEO / GEO / AEO gap report** (this folder) — audits their existing website and search presence, points out the gaps, free.
2. **A custom demo** — their brand, rebuilt on our ICP page template, built separately and shown live on the intro call.

The report gets them to the call. The demo closes it. The ICP landing page is where cold traffic lands.

## The report

`beltline-visibility-report.html` is the **template** for the Beltline niche. It is a fill-in-the-blank document: everything in `[square brackets]` with a dashed ember underline is a slot you complete per prospect. Market statistics are pre-loaded and cited; only the prospect-specific findings need filling.

### What's fixed vs. what you fill

- **Fixed (already researched + cited):** every market stat (2.5M Beltline visits, 45% use AI for local, 1.2% ChatGPT visibility, etc.), the three-layer framing, the five free quick wins, the methodology and source list. Do not touch these; they are sourced and vintage-labeled.
- **You fill (per prospect):** business name (appears ~6 times), trail segment/neighborhood, date, the three-layer scorecard (score /10 + headline finding each), the one-line verdict, and every `[...]` cell in the SEO/GEO/AEO tables (what you actually found when you checked their profile, ran the AI queries, tested their site).

### How to fill a report (30-45 min per prospect)

1. Copy `beltline-visibility-report.html` to `beltline--[business-slug].html`.
2. Do the live audit:
   - Google their category + "near the Beltline" / their neighborhood; note local-pack position.
   - Open their Google Business Profile: claimed? complete? review rating/count/recency? owner responses? open Q&A?
   - Ask ChatGPT, Perplexity, and Gemini for their category near the Beltline, 3 phrasings each (9 total). Count how many name them. Note who appears instead.
   - Check Yelp / TripAdvisor / Apple Maps / Bing / beltline.org directory presence.
   - Run their site through PageSpeed (mobile); note LCP and any obvious mobile issues.
   - Check their site for LocalBusiness schema and question-shaped content.
3. Replace every `[...]` slot with the real finding. Keep it honest and specific; a real gap they can verify is what makes this trustworthy.
4. Write the one-line verdict: the single biggest leak + the single fastest fix.
5. Render to PDF (see below). Send the PDF; keep the HTML as the source.

### Rendering to PDF

The gstack browse tool on Windows renders via `load-html` (not `goto file://`, which the space in the repo path breaks):

```
B="/c/Users/ayush/.claude/skills/gstack/browse/dist/browse"
cp "content/sales/reports/beltline--acme.html" "$TMP/r.html"
"$B" load-html "$TMP/r.html"
"$B" pdf "content/sales/reports/beltline--acme.pdf" --format letter --print-background
```

Or just open the HTML in Chrome and Print → Save as PDF (the print CSS is already set: letter, 0.65in margins, page breaks before the scorecard, GEO section, and quick-wins).

## The other five niches

Same structure, different research. Each niche needs its own version because the anchor stats and gap emphasis differ:

- **Restaurants** — lead with delivery-app commission drain + Google/Maps/reviews; GEO angle = showing up when someone asks AI "where to eat near X." Strong anchor: we have The Bando proof.
- **Home services** — lead with missed-call / response-time + "near me" urgency (76% visit within 24h); GEO angle = AI recommending a trade. Ties to the missed-call HVAC page.
- **Real estate agents** — lead with personal-brand invisibility + Google/review presence for the agent's name; GEO angle = being the agent AI names for a neighborhood.
- **Real estate developers** — lead with pre-sale discoverability of a named development; less "near me," more brand/story search + press.
- **Tech companies** — lead with demo-conversion + being cited by AI when someone researches the category; different corpus (less Maps, more content/authority).

**Process to build each:** re-run the research agent scoped to that niche's search behavior and 2026 stats, then clone this template and swap the anchor stats + gap emphasis. Keep the same three-layer (SEO/GEO/AEO) spine, fill-in mechanism, and print CSS so all six feel like one product line.

## The full outreach sequence (per prospect)

1. Pick a target on the corridor / in the niche.
2. Build the custom demo (their brand on the ICP template, separate build).
3. Fill the gap report from a live audit.
4. Reach out with the ICP landing page link (UTM-tagged) + "I made you a free visibility report."
5. On the 15-min call: walk the report, reveal the demo side-by-side with their current site, hand over both either way.

## Status / open items

- Beltline report template: built + cited (this folder).
- Other five niche reports: not yet built (research + clone per above).
- Report is `noindex` and lives in `content/sales/` (not a public route). It is a document we hand over, not a page on the site.
- Lead form on the ICP pages still returns "not configured" until email is wired; "Book a call" (Calendly) is the live path referenced in the report CTA.
