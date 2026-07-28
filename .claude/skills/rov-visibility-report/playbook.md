# Research playbook — Beltline Visibility Report

Goal: from a business URL, produce an honest, specific findings object (see `contract.md`).

The report's entire value is that a prospect can check every line of it themselves. That means
the standard is not "sounds right", it is "I saw this and here is where". A real gap they can
confirm in ten seconds beats a confident guess every time.

## The four that are not optional

The old version of this playbook told you to mark these `Verify` and move on. The site then
deleted every `Verify` row before rendering, so all four vanished from all 26 reports and each
one shipped an SEO table with 2 or 3 rows out of 5 while looking complete. Worse, because
honesty got your work erased, the incentive was to write a confident status over a guess, and
that is exactly what happened: reports went out saying a profile was `Claimed` on the reasoning
that a business with that much press "almost certainly" had claimed it. Nobody had looked.

So: **confirm these four for real, every time.** None takes more than a minute.

1. **Website speed.** Run PageSpeed Insights on the homepage, mobile. Record the actual LCP
   number and whether it passes Core Web Vitals. `https://pagespeed.web.dev/analysis?url=<url>`
2. **Apple Maps and Bing Places.** Search the business in Apple Maps and on Bing. Record whether
   each listing exists, and whether it looks claimed (hours, category, photos present and current)
   or auto-generated.
3. **Google profile Q&A.** Open the Google Business Profile and read the Q&A tab. Record how many
   questions are open, how many the owner answered, and who answered the rest.
4. **Google Business Profile itself.** Open it. Record the exact star rating, the review count, the
   categories, whether hours and photos are current. Never infer this from press coverage.

If a check genuinely cannot be completed (the business has no profile at all, the site is down),
that is a finding in itself. Write what is true: "No Apple Maps listing exists." That is a real,
useful, checkable result. What is not allowed is claiming a status you did not observe.

## 1. Identity (fetch the homepage + About page)

Capture: exact business name, `short` name, full address, neighborhood, whether it sits on or near
the Beltline (which trail and segment), category, phone, hours. Note whether the homepage `<title>`
and H1s claim the Beltline or the neighborhood, or only "Atlanta". Grab the raw HTML and check for
`LocalBusiness` schema and any FAQ or question-shaped content. Note the `og:image` as the cover
candidate.

## 2. Reviews and listings

Find Yelp, Google, Facebook, Apple, Bing, TripAdvisor. Record the real ratings and counts you can
see, with the platform named. Note the recurring theme in the negative reviews; that often becomes
the `reviews.found` line and it is the kind of detail that proves you actually looked.

## 3. The local pack, recorded

Search the money queries: `<category> Atlanta`, `<category> near the Beltline`,
`<category> <neighborhood>`.

**Write down the pack exactly as it comes back**: the three businesses in rank order, each with the
rating, review count, and category label Google shows next to them. This is `search.pack`, and it
is what the Google panel in the report renders. Without the ratings the panel renders a Google
result with no stars, which is the one part of that interface every person alive can spot as wrong.

Also record the exact query string in `search.query`. The report prints it.

## 4. The AI answer test, actually run

Ask ChatGPT, Perplexity and Gemini, three phrasings each. Nine queries. This is the single most
load-bearing claim in the report, so it does not get proxied by a web search.

Record: the exact prompt (`search.ai.prompt`), the reply verbatim (`search.ai.answer`), and the
businesses it named in the order it named them (`search.ai.named`). Note which engines you ran in
`search.ai.engines`.

If the target is absent and competitors appear, that is the GEO story and you now have the receipt.
Date it: `search.checked`. AI answers move week to week, and a prospect who re-runs it in a month
and gets something different needs to see that you dated the claim.

## 5. Listicle inclusion

Open the current "best <category> in Atlanta" lists, the beltline.org directory, Discover Atlanta,
Atlanta Magazine, Eater. These are what AI cites. Is the target in them, at what rank, behind whom?
Absence is a strong `geo.lists` finding.

## 6. Schema and AEO

From the raw HTML: is there LocalBusiness schema? Is there FAQ or Q&A content? Does anything on the
site own "near the Beltline" or the trail name? These drive `geo.schema`, `aeo.qcontent` and
`aeo.answers`. Pair with the Q&A check from the mandatory four.

## Competitors (exactly 3)

The 3 businesses that actually win "near the Beltline" for this category. Each gets a `why` line
explaining why they win the trail: name, neighborhood, positioning ("Beltline" in the name, "rides
on the trail", "steps from the Eastside Trail"). Never invent their numbers. If you want to cite
their rating, take it from the pack you recorded in step 3.

## The cover photo

Required. The cover is built around it. Use the storefront or the `og:image`: real, identifiable,
theirs. Caption the business, not the photo's address, and never claim a location a photo does not
support. If there is genuinely no usable image anywhere, flag the lead rather than shipping a cover
with a hole in it.

## Writing the cells

Every check is `{ status, found, fix? }`.

- **`found`** is what is true today, in one thought. It is read by the owner.
- **`fix`** is what changes it, in one thought. Optional. Plenty of checks are pure diagnosis.
- Do not weld them together with a semicolon. They render under separate headings on separate
  lines, and a single run-on string is what made every row a small paragraph.
- Never put an instruction to ourselves in either one. "Verify the live rating" is homework, and
  homework goes in the `verify` array, which the owner never sees.

Lead with the specific. "Yelp 3.1 stars across 18 reviews, recurring theme is repair turnaround"
is worth more than "reviews are mixed".

## The three gap tiles

Three specific leaks as big numbers, in this order when the data supports it: (1) competitors
ranking above them for "near the Beltline", (2) AI answers that do not include them, (3) best-of
lists they are absent from. One short clause each. If an angle genuinely does not apply, substitute
the next hardest-hitting honest gap. Never fake a count.

## Scoring rubric (0-10 per layer, keep it defensible)

- **SEO (found on Google):** 8-10 claimed GBP + strong recent reviews (4.5+, responded) + wins the
  local pack + fast site + Apple and Bing claimed. 5-7 present but generic: ranks for the city and
  not the trail, mediocre or stale reviews. 0-4 unclaimed, invisible, or broken.
- **GEO (recommended by AI):** 8-10 named across engines + in the best-of lists + schema + strong
  third-party corpus. 5-7 some presence, thin corpus. 0-4 absent from AI answers and from the lists
  it cites. This is the common case for trail-adjacent shops that never claimed the trail.
- **AEO (being the answer):** 8-10 owns Google Q&A + rich question content + owns "near the
  Beltline". 5-7 has an FAQ but does not claim the trail or neighborhood. 0-4 no question content,
  strangers answer the Q&A.

Write scores as `"5 / 10"`. The `finding` under each score is 1-2 honest sentences: the leak, then
the fix. The `cost` is one short line naming what that score costs them in plain language, not a
repeat of the finding.

## The verdict

One line. A pain point, named, in their own situation. Not a plan, because the next section of the
report gives away five fixes for free.

The test: could they read this line out loud to a business partner and have it land? If it needs a
run-up, it is too long.

Good: "Beltline Biking did not out-build you, **it out-labeled you**, and the label is what the
phone reads."

Bad: 130 words that open with what they have going for them and close with a to-do list.

Wrap the sharpest few words in `**bold**`.

## Style

Grounded, warm, direct. Speak to the owner. No hype. **No em dashes, ever**: commas, colons,
periods, or ·. Every finding should feel like it came from actually looking at their stuff, because
it did.
