---
name: price-drift-check
description: >
  Sweep the whole site for stale prices, rates, timelines, and stats after any numerical change.
  Run it EVERY time a number moves: the floor, the ceiling, a tier band, a retainer rate, a day
  rate, a delivery timeline, or a case-study stat. Numbers live in far more places than the file
  you just edited (FAQ arrays, JSON-LD schema, blog bodies, blog markdown mirrors, meta
  descriptions, pricing components, crawler-only sr-only blocks), and the copies drift silently
  because nothing type-checks a sentence. Triggers: "change the price", "raise the floor", "we're
  capping at X", "update pricing", "new rate", "check the numbers", "is our pricing consistent",
  "did we update the FAQs", or any edit to lib/pricing.ts.
---

# Price Drift Check

## Why this exists

Before `lib/pricing.ts` existed, the ROV floor read **$1,500** on the homepage, **$2,000** on
`/web`, and **$2,500** on `/web/brief`. A visitor going deeper watched the price climb. That was
fixed at the component layer, and the drift immediately reappeared somewhere else: `/ai-automation`
shipped a "From $500" pricing card one screen above an FAQ answering *"how much does AI automation
cost?"* with *"$2,500 to $10,000"*. Same page. Both live.

The pattern is always the same. A number gets fixed where someone remembers it living, and the
five hand-copied duplicates keep the old value. **Prose does not type-check.** This skill is the
type-checker for prose.

## Step 0 — Read the source of truth

`lib/pricing.ts` is the only place prices are decided. Read it first, every run.

Current locked commercials (verify against the file, do not trust this list):

| Thing | Value |
|---|---|
| `FLOOR` | $2,500 hard floor, no discount ladder below it |
| `CEILING` | $10,000, bigger work gets phased into multiple Builds |
| `TIERS[0]` The Fix | $2,500 – $4,500, one leaking moment |
| `TIERS[1]` The Full View Build | $5,000 – $10,000, two to five moments |
| `RETAINER` | $1,000 – $3,000 / month, no long lock-in |
| `MEDIA` | From $500 per day / per property |

Media day rates are the **one deliberate exception** to the floor: a shoot day is a different
product from a project. Nothing else is allowed under $2,500.

## Step 1 — Sweep

Run all four. They are cheap and they each catch a different class of miss.

```bash
# 1. Every dollar figure in app code
grep -rn '\$[0-9][0-9,]*' --include=*.tsx --include=*.ts app components lib data

# 2. Blog markdown, including frontmatter descriptions (these become meta tags)
grep -rn '\$[0-9]' content/blog/

# 3. Metadata + JSON-LD specifically — what search engines and LLMs actually quote
grep -rn '\$[0-9]' --include=page.tsx --include=layout.tsx app | grep -iE 'description|title|answer|faq'

# 4. Non-dollar numerics that also go stale
grep -rniE '[0-9]+ ?(to|-|–) ?[0-9]+ (weeks|days|months)|[0-9]+x |[0-9]+ ?% ' \
  --include=*.tsx --include=*.md app content data | grep -v node_modules
```

Sweep 4 matters more than it looks. Delivery timelines ("6 to 8 weeks"), case-study multipliers
("689x"), and percentages drift exactly like prices do, and they appear in the same FAQ answers.

## Step 2 — Classify every hit

Do not bulk-replace. Each hit is one of five things, and only the first is a bug.

1. **ROV price claim** — "our projects run", "we charge", "through ROV Studios", a tier card, a
   `ROV:` comparison bar, an `Offer` in JSON-LD. **Must match `lib/pricing.ts` exactly.** Fix it.
2. **Market claim** — "most Atlanta studios charge", "the market range is", a `MarketRateTooltip`
   with cited sources. **Legitimately different from ours.** Leave the number, but make sure the
   framing says *market* out loud. On our own domain, an unlabelled table reads as our price list.
   When in doubt, add a "What we charge" block next to it rather than editing the market figure.
3. **Client-side number** — the industry calculator bands in `content/industries/*.md`
   (`Under $2,000`, `$300k-500k`), the demo receipt in `TouchpointToggle`, the n8n demo diagram.
   These are the *client's* ticket sizes, not ours. Leave alone.
4. **Out of scope** — see the exceptions list below.
5. **Dead code** — an unused component still carrying old bands. Delete it, do not update it.
   Dead files poison future sweeps by producing hits nobody can act on.

## Step 3 — Fix, preferring the structural fix

Ranked, best first:

1. **Import from `lib/pricing.ts`.** `fmt(FLOOR)`, `range(FLOOR, CEILING)`, `TIERS[0].priceFrom`.
   A number that is computed cannot drift. Do this wherever a component renders a price.
2. **Import the shared array.** FAQ JSON-LD must read `data/faq.ts`, never a hand-typed copy.
   `app/web/page.tsx` maintained a parallel FAQ array for months; that is how the schema kept
   advertising a $2,000 floor after the floor moved.
3. **Edit the prose**, for blog bodies and markdown where a literal is unavoidable. When you do
   this, write the number *and* its shape ("$2,500 to $10,000, with $2,500 to $4,500 for a focused
   fix") so a future reader can tell instantly whether it is current.

### Mirrored files

Several blog posts exist twice: `app/blog/<slug>/page.tsx` (or `app/web/<slug>/`) renders the page,
and `content/blog/<slug>.md` feeds the listing, the sitemap, and the meta description. **Fixing one
and not the other is the single most common miss in this repo.** Every prose edit under `app/blog/`
needs its `content/blog/` twin checked, and vice versa.

## Step 4 — Verify

```bash
npx tsc --noEmit
npx next build
```

Then re-run sweep 1 and read every remaining hit. "It still returns results" is expected and
correct — the market claims and calculator bands stay. What you are confirming is that every
remaining hit is a deliberate one you can name.

## Known and accepted exceptions

Do not churn on these. If one of them looks wrong, ask Andi before changing it.

- **`app/sound/**`, `data/soundPricing.ts`, `soundFaqItems`, `components/sound/**`,
  `MusicOfferSchema`, `data/artistReadiness.ts`** — this is **rovmusic.com**, a separate property
  served through a host rewrite. It has its own price system ($40–$65 a song, $50–$65/hr studio
  time, $500 Foundation). The $2,500 floor does not apply and never has.
- **`app/ctrla/pitchdeck/**`** — internal strategy deck with historical market research and target
  pricing from an earlier plan. Not a public price list. Leave unless Andi asks for a refresh.
- **`content/industries/*.md` calculator bands** — the client's revenue per job, not our fees.
- **`content/blog/how-much-does-a-website-cost-in-atlanta.md`** — the "$2,000 to $5,000" in the
  title, description, and body is a **market** claim and the article's ranking premise. It stays.
  The ROV number lives in its own "Our actual numbers" block in the `How ROV prices a website`
  section. Keep those two things separate and both correct.
- **`app/web/missed-call-text-back-atlanta-hvac/**`** — a productized offer at a $750 build fee
  plus $1,000/month with a three-month minimum. The build fee sits below the floor by design as a
  loss-leader into the retainer. **Flagged, not resolved.** Confirm with Andi before touching it,
  and confirm again whenever the floor moves.

## Report back

State plainly:

- What moved, and where the source of truth now says it.
- Every surface fixed, grouped by kind (metadata / FAQ / schema / blog / pricing component).
- Every hit deliberately left, with the reason.
- Anything you could not resolve without a decision from Andi.

Never report "all clear" without having run Step 4. A sweep that was not built is a sweep that
found the easy half.
