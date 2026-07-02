# /rov-geo-review — GEO Page Final Review

Runs after `/rov-geo` builds a page. Audits it for keyword coverage, link density,
GEO/AEO signals, writing violations, and real-time relevance. Outputs a punch list
of specific things to fix before the page goes live.

## Arguments

Pass the route to review:
`/rov-geo-review web/restaurant-atlanta`

If no argument, ask which page to review.

---

## Step 0: Read the page

Read `app/[route]/page.tsx` in full. Also read:
- `ROV-BRAIN.md` — to check voice and proof points
- `content/seo-geo/02-rov-keyword-strategy.md` — to check keyword targeting

---

## Step 1: Writing Rules Audit

Check every line. Flag anything that violates ROV voice rules.

```bash
# Em dashes (should return nothing)
grep -n "—" app/[route]/page.tsx

# Sentence patterns to check manually
# "if X then Y" constructions
# Dollar amounts from client revenue data
# "no ads" or "no promotions" without confirmation
```

For each violation found: show the exact line, show the fix.

---

## Step 2: Keyword Audit

Answer these questions about the page:

| Check | Passing? | Notes |
|---|---|---|
| Primary keyword in `<title>` | yes/no | |
| Primary keyword in H1 | yes/no | |
| Primary keyword in first 100 words | yes/no | |
| Primary keyword in meta description | yes/no | |
| Secondary keywords (Tier 2/3) present in H2s | yes/no | which ones |
| Location modifier (Atlanta) used naturally | yes/no | how many times |
| Keyword density feels natural, not stuffed | yes/no | |

If any are missing, write the exact fix: updated title tag, updated first paragraph, etc.

Also: suggest 2-3 keywords from `content/seo-geo/02-rov-keyword-strategy.md` that are
missing from the page and could be woven in naturally without rewriting full sections.

---

## Step 3: Link Audit

Count every link in the file. Build this table:

| Link target | Anchor text | Location on page | Status |
|---|---|---|---|
| /web | "ROV web design" | Section 7 | good |
| /casestudy/bando | "the full case study" | Section 9 | good |

Then check:

**Missing required links** — any of these not present?
- `/web` (minimum 2x in body, not counting CTA)
- `/casestudy/[client]` (minimum 2x)
- `/ai-automation`
- `/ctrla`
- `/about`
- `/blog/every-business-leaks-money`
- External authority source (Think with Google, industry stat, Atlanta local source)
- Client's own website (at least once, in the opening section)

**Anchor text quality** — flag any:
- "click here" or "read more" (too generic — bad for SEO)
- Keyword-exact match used too many times in a row (over-optimization risk)
- Good anchors that are missing (e.g., linking /web with just "here" instead of "our web design process")

For each issue: show the exact line and the improved version.

---

## Step 4: GEO Signal Audit

GEO = getting cited by Perplexity, ChatGPT Search, Google AI Overviews.
These engines reward factual density, clear claims, and authority signals.

Check:

**E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)**
- Named author with credentials present? (Suchet Konda, Co-Founder)
- Author section exists with specific bio?
- Client proof is real and specific (not vague claims)?
- External source cited at least once?

**Content for AI synthesis**
- Does every H2 section contain at least one specific fact or number?
- Is the page's core argument stated clearly in the first 200 words?
- Is there a "short version" or summary callout a reader could quote?
- Are there any vague claims ("many businesses", "most companies") that could be made specific?

**Schema signals**
- Is FAQ content present? (Required for FAQ schema)
- Are H2/H3 headings phrased as questions where appropriate?
- Is there a BreadcrumbList opportunity? (Already in the breadcrumb nav)
- Is the author named in a structured way AI could parse?

Flag what is missing and suggest the specific addition.

---

## Step 4.5: Auto-apply the metadata + schema fix (DO NOT ASK, JUST DO IT)

GEO pages built by `/rov-geo` are client components (`"use client"` for the FAQ accordion), which means they ship with an EMPTY `<title>`, no meta description, and no structured data. That is the single biggest citation killer. Every review must fix this automatically before finishing. Do not add it to the punch list as a suggestion. Apply it.

Check first:
```bash
# All three should be non-empty / non-zero. If any fails, apply the fix.
curl -s http://localhost:3001/web/[slug] | grep -o "<title>[^<]*</title>"
curl -s http://localhost:3001/web/[slug] | grep -o 'name="description"'
curl -s http://localhost:3001/web/[slug] | grep -c 'application/ld+json'
```

The fix (server page wrapping the client body):

1. **Extract the FAQ data** into `content.ts` (plain module, no `"use client"`): `export const FAQS = [...]`. Import it into the body. This makes the FAQ the single source of truth for both the visible accordion and the schema.
2. **Rename** the current `page.tsx` to `ArticleBody.tsx`, keep its `"use client"` and its `dynamic(..., { ssr: false })` imports, and change its default export to `ArticleBody`. Import `FAQS` from `./content`.
3. **Create a new server `page.tsx`** (no `"use client"`) that:
   - imports `type { Metadata }`, `ArticleBody`, and `FAQS`
   - `export const metadata` with `title` (the H1 question + " | ROV Studios"), a 150-160 char `description` that leads with the direct answer, `alternates.canonical` = `https://www.rovstudios.com/web/[slug]`, and `openGraph` (title, description, url, type: "article", images: ["/og/og-web.webp"])
   - builds a JSON-LD `@graph` with **FAQPage** (mapped from `FAQS`), **Article** (headline, author Suchet Konda with jobTitle + /about url, publisher ROV Studios with logo, datePublished, dateModified = today), and **BreadcrumbList** (ROV Studios → Web Design → this page)
   - renders `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />` then `<ArticleBody />`

Site domain is `https://www.rovstudios.com` (matches `app/layout.tsx` metadataBase). After applying, re-run the three checks above and confirm the title, description, and 2+ JSON-LD blocks are present. Report it under a "Applied automatically" heading, not the punch list.

---

## Step 5: AEO Signal Audit

AEO = featured snippets, People Also Ask boxes, voice search answers.

Check:

**FAQ section quality**
- Does the page have an FAQ section? (Required)
- Do the questions match what someone would actually type into Google?
- Does every answer open with a direct response in the first sentence?
- Is each answer 40-80 words? (Optimal for featured snippet capture)
- Does each answer contain at least one specific number or named fact?

**Featured snippet eligibility**
- Are any H2 sections followed immediately by a tight 2-3 sentence answer?
- Are there numbered lists or before/after tables? (Good for list/table snippets)
- Does the page define its core topic plainly ("Restaurant website design in Atlanta is...")?

**Question-phrased headings**
- Does the page use natural question language in any headings?
- Suggest 2-3 question headings that could replace current H2s without losing meaning

---

## Step 6: Real-Time Correlation Check

Search for: "[page industry] Atlanta 2026" and "Atlanta business [month] 2026"

Ask: Is there a current event in the "What This Means" section?
- If yes: is it still current? Is there something more timely now?
- If no: suggest the most relevant thing happening right now that belongs in that section

This is what makes the page feel alive. A page tied to a live event gets cited more.
A page with no current hook feels evergreen but anonymous.

---

## Step 7: Image Check

- At least one real client photo above the fold of main content? (Required)
- Are all images .webp format from `public/casestudy/[client]/`?
- Do image alts describe the actual photo (not just keyword-stuffed)?
- Do captions add information not in the surrounding copy?
- Any images with em dashes in alt text or captions? (Flag and fix)

---

## Step 8: Output — Punch List

After all checks, output one clean list organized by priority:

### Fix before publishing (blocking)
- [Exact line] — [exact fix]

### Fix this week (high value, not blocking)
- [Specific improvement]

### Consider adding (nice to have)
- [Suggestion]

### What is working well
- [2-3 genuine strengths — be specific, not generic]

---

## Final question

The metadata + schema fix from Step 4.5 is ALREADY applied by the time you get here (it is never optional). Lead with what you auto-applied, then ask about the rest:

> "I already applied the title, meta description, and JSON-LD schema (those are non-negotiable for GEO). Want me to apply the remaining punch-list fixes? Say which ones or say 'all'."

If "all" — apply every blocking fix, then every high-value fix, then ask about the rest.
If specific numbers — apply those only.
After applying, re-run the em dash grep, the link count, and the three Step 4.5 checks to confirm clean.
