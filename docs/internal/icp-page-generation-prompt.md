# ICP Landing Page Generation Prompt

Reusable prompt for producing a new `/industries/[slug]` page (ICP #7 and
beyond). Feed it one pitch line, run the four steps, output one `.md` file.

---

## Instruction header (read first)

Before writing a single word:

1. Read `c:\Users\ayush\Desktop\R.O.V\company.md` and
   `c:\Users\ayush\Desktop\R.O.V\brand-kit.md`. These define who ROV is and how
   it sounds.
2. Voice = **Grounded, Warm, Refined.** Land at least two of the three in every
   section. Write like a trusted collaborator, not a corporate deck.
3. **No em dashes anywhere in any copy.** Use commas, colons, periods, or the
   middot ( · ) instead. This is non-negotiable.
4. No hype words ("revolutionary," "cutting-edge," "game-changing," "unlock,"
   "synergy"). No fake urgency ("limited spots," "don't miss out").
5. First person "we" when speaking as ROV. Plain, specific language. "We built a
   site" beats "We architected a digital experience."

---

## Step 1 · Normalize

Expand the pitch line into the full field set:

- `industry` — a person could self-identify with it ("real estate agents and
  brokerages," not "real estate").
- `audience` — role + situation of the exact person reading the page.
- `geo` — the place the reader would name (all six locked pages use Atlanta;
  Beltline uses "Atlanta Beltline").
- `painPoint` — one sentence, felt not abstract.
- `supportingPains` — 2 to 4 secondary pains, each concrete enough to become a
  card.
- `valueProp` — what ROV changes, stated as an outcome.
- `serviceLean` — 1 to 3 of: brand, web, video, creative-tech.
- `proofPoints` — **real only.** Case studies, client names, numbers Andi can
  stand behind. **If `proofPoints` is empty, STOP and ask Andi.** Do not invent
  stats, testimonials, or client names. You may borrow an adjacent proof
  honestly ("we did this for a restaurant; here is why it transfers").
- `toneNotes`, `keywords` — optional but useful.

**Quality gate:** if `painPoint`, `audience`, or `proofPoints` read generic
(could apply to any agency's page), the normalization failed. Redo before
drafting.

---

## Step 2 · Draft

Fill `content/industries/_TEMPLATE.md` completely:

- Body ≥ 800 words of unique, ICP-specific prose. No paragraph reused from
  another ICP page.
- `answerLine` is mandatory: one plain declarative sentence stating who / what /
  where, liftable by an AI search engine.
- Hero headline (live service-page pattern): write the punchline, then split it
  across two fields where it reads naturally. `headline` is the solid-white bold
  setup line(s); `headlineAccent` is the turn/payoff, rendered as a
  NorwigeHeroItalic gradient line beneath it. If the headline is a single
  indivisible clause, leave `headlineAccent` empty (hero degrades to
  headline-only).
- `eyebrow` is the uppercase pill badge above the headline, e.g.
  "FOR ATLANTA RESTAURANTS". Keep it short and geo-specific; it falls back to
  `industry · geo` if omitted.
- FAQ answers front-loaded: verdict in the first sentence, nuance after.
  Questions phrased the way the reader would type them.
- H2s in the body track the `keywords`.
- Headline, subhead, and answerLine written fresh. No madlib patterns like "We
  help {X} in Atlanta stand out."
- **Showcase media (optional `showcase` array + `showcaseHeading`):** a dark
  media band between Services and Body. Reference ONLY files that already exist
  in `public/` (verify each path with `ls` before writing it). Each item is
  `{ src, kind: "video" | "image", label, ratio?, alt? }`. Videos are
  lazy-mounted and autoplay muted+looping once scrolled into view (gradient
  placeholder until then, and it stays put under reduced motion); images go
  through next/image. Keep video ≤2MB and images ≤300KB. Labels are short and
  on-voice (no em dashes); the UI uppercases them. Optional `proof.image` /
  `proof.imageAlt` puts one existing image inside the proof panel. Skip both
  fields entirely if no fitting real asset exists · never invent or download
  media.
- **Hero media (optional `heroMedia`):** a full-bleed video layer behind the
  hero text, in the SoundHero language. The CSS ember splash still paints first
  (LCP stays text-on-gradient); the video fades in client-side only, after mount
  and in-view, and is absent under `prefers-reduced-motion` / Save-Data and from
  the SSR HTML. Set `heroMedia.src` to the page's strongest assigned b-roll clip
  (an existing muted-friendly mp4 in `public/`, verified with `ls`; reuse a
  showcase clip where it fits). `poster` is optional. OMIT the block entirely for
  a page with no footage · it stays a pure CSS splash hero (e.g. home-services).
- **Showcase result captions + Before/After:** each `showcase` item takes an
  optional `result`, a one-line outcome caption shown under the card title in the
  featured-work band (cards hover-to-play, press on touch, and lazy-mount their
  video). Two adjacent VIDEO items labelled exactly "Before" and "After" are
  auto-rendered as ONE connected card with a toggle · use that for a genuine
  rebuild pair (e.g. the tech page).
- **Interactive questionnaire estimator (optional `calculator`):** ONE compact
  dark widget placed right after the pains (the "feel the cost" moment). It is
  a short QUESTIONNAIRE, one question at a time: each input is a step with a
  conversational `question` ("How many calls do you miss in a week?") and 3-5
  large answer chips (`options`, each `{ label, value }` · ranges, not
  sliders). Picking a chip auto-advances; a quiet Back button appears from
  step 2; after the last answer the result panel reveals the annual number
  plus an "Adjust my answers" restart that remembers previous selections.
  Every result MUST be labeled as an estimate from the reader's own answers,
  never a Range of View performance claim (put the caveat in `note`).
  `formula` is a safe declarative expression over the input `key`s using only
  `+ - * / ( )` (a tiny parser evaluates it · there is NO eval of arbitrary
  strings, so no other functions or operators are available); each chosen
  option's `value` feeds its key, so pick values at a reasonable midpoint of
  each range. If `options` is omitted, 4 range choices are auto-generated from
  min/max/step, but hand-written on-voice options are strongly preferred.
  `frame` is `loss` or `opportunity` and only tints the result copy. The first
  answer fires `icp_calc_engage` (`icp_slug`) automatically and the result CTA
  fires `icp_call_click`. Fill `heading`, `inputs` (each with
  `key,label,question,min,max,step,default,prefix?,suffix?,options`),
  `formula`, `resultLabel`, and `note`; keep every string on-voice with no em
  dashes.
- **Composition fields (optional `marquee` + `pullQuote` + `bodyAsides`):**
  presentation-only, they never reorder GEO/AEO copy. `marquee` is 5-9 short ICP
  phrases for the thin scrolling ticker (the UI adds the `·` separator, so no `·`
  inside a phrase; the UI also uppercases them). `pullQuote` is ONE editorial
  band: `text` is a single sentence lifted from the body prose, and `accent` is a
  verbatim 2-4 word substring of `text` rendered in the ember gradient.
  `bodyAsides` power the editorial body layout: the Main Content renders on an
  asymmetric ~66ch grid, and each entry is promoted into the freed column beside
  the H2 chapter it names as a VISUAL COMPANION, so no chapter is a bare wall of
  text. Give EVERY chapter one and vary `type` so no two adjacent chapters share
  a treatment (they alternate left/right automatically). Every entry keys on
  `afterH2` (matches the H2 text, punctuation-insensitive) and takes an optional
  `kicker` (2-3 word ember label). `type` is one of:
  - `pull` (default) → `text`: a strong line lifted VERBATIM / near-verbatim from
    that chapter's prose. It is aria-hidden, so the canonical sentence still reads
    once in the flow.
  - `media` → `src` (an EXISTING `public/` asset, verify with `ls`), `mediaKind`
    (`video` for `.mp4`, else `image`), and `label` (a short caption, reuse a
    showcase/proof result line). Videos are lazy-mounted and reduced-motion safe.
  - `number` → `value` (an oversized numeral/stat that ACTUALLY appears in that
    chapter's prose, never invented) and `caption` (a short line of context).
  - `keywords` → `items` (3-4 short phrases lifted from that chapter's prose).
  All companions are presentation-only and aria-hidden; they never add a claim or
  reorder GEO/AEO copy. Fill them on-voice with no em dashes.

---

## Step 3 · Hard-rules checklist (verify before output)

- [ ] No fabricated stats, testimonials, or client names.
- [ ] No em dashes anywhere.
- [ ] Hero H1 setup line is solid white; the `headlineAccent` line is the
      gradient italic accent (live service-page pattern, per Andi 2026-07-21).
- [ ] CTA finale is a dark section with the lead form inside a Linen-Light card
      (per Andi 2026-07-21; supersedes the earlier "CTA section is light" rule).
- [ ] Only the four approved gradients (ember, emberDark, earth map to brand,
      ember-dark, earth).
- [ ] `visual.type` differs from adjacent pages where feasible (six pages, four
      types).
- [ ] Stats: at most one generic/shared ROV fact; the rest unique to this ICP.
- [ ] FAQ overlap with any other ICP page ≤ 1 question.
- [ ] If a `calculator` is included: results labeled as estimates from the
      reader's answers (never a ROV performance claim), `formula` uses only
      the input keys with `+ - * / ( )`, every input has a conversational
      `question` phrased to the reader, and 3-5 `options` chips whose values
      sit at reasonable midpoints of each range.

---

## Step 4 · Output

A single complete `.md` file with `published: true, indexed: false`. It goes
live at its URL for outreach immediately, and stays invisible to crawlers
(noindex + excluded from the sitemap) until Andi personally promotes it.

Promotion to `indexed: true` is a separate, manual, Andi-gated step. Never flip
it automatically.
