# Research playbook — Beltline Visibility Report

Goal: from a business URL, produce an honest, specific findings object (see `contract.md`). Spend the
effort on what you can verify. Mark the rest `Verify`. A real gap the prospect can confirm is worth
more than a confident guess.

## 1. Identity (WebFetch the homepage + About page)

Capture: exact business name, `short` name (what a person would call it), full address, neighborhood,
whether it is on/near the Beltline (which trail/segment), category, phone, hours. Note whether the
homepage `<title>` and H1s claim the Beltline / neighborhood or only "Atlanta". Note if there is a
`og:image` (use it as the cover candidate) and any product/lifestyle image (ride candidate). Grab the
raw HTML too and check for `LocalBusiness` schema and an FAQ / question-shaped content.

## 2. Reviews & listings (WebSearch)

Find Yelp, Google, Facebook, Apple/Bing, TripAdvisor presence. Record real ratings + counts you can
see. Note the recurring theme of negative reviews (this often becomes a `reviews.finding`). If you
cannot see the exact Google rating remotely, status = `Verify` and add it to `verify`.

## 3. The local pack (WebSearch)

Search the money queries: `<category> Atlanta`, `<category> near the Beltline`, `<category>
<neighborhood>`. Note where they appear vs. where trail-named competitors win. This drives
`seo.localpack`.

## 4. The AI answer test (WebSearch as a proxy; full test is a live verify)

Search `best <category> near the Atlanta Beltline` and similar. Record which businesses the AI-style
summaries name. If the target is absent and competitors appear, that is the GEO story. You are running
a proxy remotely; the real 9-query test (ChatGPT + Perplexity + Gemini × 3 phrasings) is a live verify
item — always add it to `verify` unless you actually ran all nine.

## 5. Listicle inclusion (WebFetch the "best of" articles)

Open the current "best <category> in Atlanta" lists (they are what AI cites). Is the target in them?
At what rank, behind whom? Absence here is a strong `geo.lists` finding.

## 6. Schema & AEO

From the raw HTML: is there LocalBusiness schema (usually missing)? Is there an FAQ / Q&A content? Does
anything own "near the Beltline" / the trail? These drive `geo.schema`, `aeo.qcontent`, `aeo.answers`.
Google-profile Q&A ownership is usually a `Verify`.

## 7. Site speed

Note the stack (WordPress/WooCommerce, Shopify, custom) and obvious weight. Exact mobile LCP is a
`Verify` (run PageSpeed on the final pass).

## Competitors (pick 3 for the mockup)

Choose the 3 businesses that actually win the "near the Beltline" query for this category. Each gets a
`why` line explaining *why they win the trail* — name, neighborhood, positioning ("Beltline" in the
name, "rides on the trail", "steps from the Eastside Trail"). Never fake their review numbers.

## Images

- `cover`: the storefront / og:image. Real, identifiable, theirs. Caption the business, not the exact
  address. Include the image URL in the contract; the build script downloads + optimizes + embeds it.
- `ride`: a lifestyle/product shot (people riding, the product). Neutral caption, no false location.
- If you cannot find a decent image, omit that figure (leave `cover`/`ride` out of the JSON). The
  report is still complete without images.

## The diagnosis band (first scroll — the "three-second" gut-punch)

This is what the prospect sees before any analysis. Three parts, all fed from the JSON:

**The hero number (`gap.hero`)** — ONE big number. Choose the flavor that is strongest AND most
honest *for this business* (it depends on the study). In order of preference:
1. **A market-anchored count they are invisible to** — bulletproof, built only from cited stats.
   e.g. Beltline 2.5M annual visits; "45% now ask AI first"; "1.2% of businesses AI ever names".
   Pick the one that best fits their category and frame their absence from it.
2. **An illustrative $/mo** — only if you also fill `sub` with the exact assumptions and put
   "(illustrative)" in the `label`. Never a bare dollar figure.
3. **A real $/mo** — only when the pointers give you their avg ticket / rough monthly volume. Put the
   inputs in `sub`.
Never invent a number with no cited basis. The `sub` line always shows the source or the math.

**The three dials** — SEO / GEO / AEO scores. Colour (red/amber/green) is derived from the score, so
pick scores honestly per the rubric. Each dial's `cost` is ONE short line naming what that score costs
them in plain language (not a repeat of the `finding`).

**The three gap tiles (`gap.tiles`)** — the specific leaks, as big numbers. Lead with these three
angles (in this order) whenever the data supports them: (1) competitors ranking above them for "near
the Beltline", (2) AI answers / picks that do not include them, (3) best-of lists they are absent from.
Keep each label to one short clause. If one angle genuinely does not apply, substitute the next
hardest-hitting honest gap. Never fake a count.

## Scoring rubric (0-10 per layer — keep it defensible)

- **SEO (found on Google):** 8-10 claimed GBP + strong recent reviews (4.5+, responded) + wins local
  pack + fast site + Apple/Bing claimed. 5-7 present but generic (ranks for city not trail, mediocre or
  stale reviews). 0-4 unclaimed/invisible/broken.
- **GEO (recommended by AI):** 8-10 named across engines + in the best-of lists + schema + strong
  third-party corpus. 5-7 some presence, thin corpus. 0-4 absent from AI answers and the lists it
  cites (the common case, especially for trail-adjacent shops that never claimed the trail).
- **AEO (being the answer):** 8-10 owns Google Q&A + rich question content + owns "near the Beltline".
  5-7 has an FAQ but does not claim the trail/neighborhood. 0-4 no question content, strangers answer
  the Q&A.

Write scores as `"5 / 10"` strings. The `finding` under each score is 1-2 honest sentences: the leak,
then the fix. The `verdict` is the single biggest leak + the single fastest fix, in the business's own
situation (the sharper and more specific, the better).

## Style

Grounded, warm, refined. No hype, no em dashes. Speak to the owner. Every finding should feel like it
came from actually looking at their stuff, because it did.
