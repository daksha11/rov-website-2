# Findings contract

One JSON object per business. This is the entire input to the build. Every string is rendered as text
(the build HTML-escapes it, so write plain text with normal quotes). See a full worked example at
`content/sales/reports/_system/_examples/electrobike-georgia.json`.

Statuses are short labels shown in the scorecard tables — use words, not symbols: `Claimed`, `Weak`,
`Mixed`, `Thin`, `Missing`, `Strong`, `Gap`, `Absent`, `Verify`. Scores are `"N / 10"` strings.

```jsonc
{
  "slug": "electrobike-georgia",           // kebab; sets output filename beltline--<slug>.{html,pdf}
  "business": {
    "name": "ElectroBike Georgia",         // full name, appears ~8 places
    "short": "ElectroBike",                // casual name, used in example-query captions
    "location": "Eastside Trail · Old Fourth Ward",  // cover "Location" line (use · not a dash)
    "neighborhood": "Old Fourth Ward",
    "category": "e-bikes",                  // plural noun as a searcher types it ("e-bikes","tacos")
    "date": "July 2026"                     // Month Year
  },
  "comp": [                                  // exactly 3 — the shops that win "near the Beltline"
    { "name": "The Belt Hub",        "why": "Old Fourth Ward · rides on the trail" },
    { "name": "Beltline Biking",     "why": "\"Beltline\" right in the name" },
    { "name": "Atlanta Bicycle Barn","why": "Steps from the Eastside Trail" }
  ],
  "ai": { "absent": "not named for \"near the Beltline.\" The trail-named shops are." }, // ghost line

  "gap": {                                   // the first-scroll "three-second diagnosis" band
    "hero": {                                // ONE big honest number — pick per business (see playbook)
      "number": "2.5M",                      // the headline figure, rendered huge
      "label": "one honest sentence on what that number means for them",
      "sub": "the source / the assumptions behind it (keeps it defensible)"
    },
    "tiles": [                               // exactly 3 big-number gap tiles
      { "num": "3", "label": "e-bike shops rank above you for \"near the Beltline\"" },
      { "num": "0", "label": "AI picks for \"near the Beltline\" that include you" },
      { "num": "0", "label": "2026 \"best Atlanta e-bike\" lists you appear on" }
    ]
  },

  "seo": {
    "score": "5 / 10",
    "cost": "ONE short line: what this score costs them (shown under the dial).",
    "finding": "1-2 sentences: the SEO leak, then the fix.",
    "gbp":       { "status": "Claimed", "finding": "..." },  // Google Business Profile completeness
    "reviews":   { "status": "Weak",    "finding": "..." },  // rating / count / recency / responses
    "localpack": { "status": "Mixed",   "finding": "..." },  // position for money queries
    "speed":     { "status": "Verify",  "finding": "..." },  // stack + mobile (LCP is a verify)
    "maps":      { "status": "Verify",  "finding": "..." }   // Apple Maps + Bing Places
  },
  "geo": {
    "score": "3 / 10",
    "cost": "ONE short line, shown under the GEO dial.",
    "finding": "1-2 sentences: the GEO leak, then the fix.",
    "aitest": { "status": "Absent",  "finding": "who AI names instead; note the 9-query live test" },
    "corpus": { "status": "Thin",    "finding": "presence on Yelp/Reddit/press/guides AI reads" },
    "lists":  { "status": "Missing", "finding": "inclusion in the best-of lists AI cites, + rank" },
    "schema": { "status": "Missing", "finding": "LocalBusiness schema + machine-readable geo signal" }
  },
  "aeo": {
    "score": "5 / 10",
    "cost": "ONE short line, shown under the AEO dial.",
    "finding": "1-2 sentences: the AEO leak, then the fix.",
    "qa":       { "status": "Verify", "finding": "Google profile Q&A ownership" },
    "qcontent": { "status": "Strong", "finding": "FAQ / question-shaped content on site" },
    "answers":  { "status": "Gap",    "finding": "who owns the trail/neighborhood answers" }
  },
  "verdict": "The single biggest leak + the single fastest fix, specific to this business.",

  "cover": {                                 // optional — omit the whole object if no good image
    "image": "https://.../storefront.jpeg",  // url OR local path; build downloads+optimizes+embeds
    "alt": "…",
    "caption": "Caption the business, not the photo's address."
  },
  "ride": {                                  // optional — a lifestyle/product shot
    "image": "https://.../riding.jpg",
    "alt": "…",
    "caption": "Neutral caption, no false location claim."
  },

  "verify": [                                // shown to the salesperson; anything you could not confirm
    "Exact Google star rating + review count",
    "Full 9-query AI test logged per engine",
    "PageSpeed mobile LCP",
    "Apple Maps + Bing Places claim status"
  ]
}
```

Rules the build enforces: any `{{token}}` with no value renders as a loud red `[[key]]` marker in the
HTML — so if you see one, a required field is missing from the JSON. Fields not referenced by the
template (extra keys) are ignored, so it is safe to include notes. `comp` and `gap.tiles` must each
have exactly 3 entries.

**Derived automatically (do NOT put in the JSON):** the build computes `scorenum`, `scorepct`, and
`scoreclass` (bad ≤4 red / mid 5-6 amber / good ≥7 green) for each layer from its `score` string. You
only supply `score` (e.g. `"3 / 10"`) and `cost`.

**Landing link (auto):** every report links the custom Beltline landing page in the CTA
(`rovstudios.com/industries/beltline-atlanta`), UTM-tagged with the lead's slug so clicks are
attributable. The build derives it; override only by setting `"landing": { "url": "..." }` in the JSON.
