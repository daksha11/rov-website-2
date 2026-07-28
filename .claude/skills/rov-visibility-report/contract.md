# Findings contract

One JSON object per business. This is the entire input to the report. Every string is rendered as
text, so write plain text with normal quotes.

The report is a Next.js site, not a PDF. Findings live at
`rovoutreachdoc/data/<slug>.json` and are wired up in `rovoutreachdoc/lib/leads.ts`. The schema
below is the one in `rovoutreachdoc/lib/types.ts`; that file is the source of truth if the two
ever disagree.

Statuses are short labels shown in the audit tables. Use words, not symbols: `Claimed`, `Weak`,
`Mixed`, `Thin`, `Missing`, `Strong`, `Gap`, `Absent`. Scores are `"N / 10"` strings.

**`Verify` is not a status.** It used to be, and the site silently deleted any row carrying it,
so the four cheapest checks to confirm were the four that never got confirmed and every report
shipped a short table that looked complete. If you have not confirmed a check, go confirm it. See
"The four that are not optional" in `playbook.md`.

```jsonc
{
  "slug": "electrobike-georgia",           // kebab; the report lives at /report/<slug>
  "business": {
    "name": "ElectroBike Georgia",         // full name, appears in ~8 places
    "short": "ElectroBike",                // casual name, used inside example queries
    "location": "Eastside Trail · Old Fourth Ward",  // cover "Location" line (use · not a dash)
    "neighborhood": "Old Fourth Ward",
    "category": "e-bikes",                 // plural noun as a searcher types it ("e-bikes","tacos")
    "date": "July 2026"                    // Month Year
  },

  // ── what the phone actually returned ────────────────────────────────
  // REQUIRED. This drives the two screenshot panels, which are rendered in
  // Google's and ChatGPT's own interface rather than ours, because an owner
  // reads a white Google result as a fact and a cream card as our opinion.
  // Everything here is something you saw and wrote down. Anything you did not
  // record is omitted, and the panel renders less rather than renders a guess.
  "search": {
    "query": "e-bikes near the Beltline",  // the exact string you typed into Google
    "checked": "July 2026",                // Month Year you ran it; AI answers move
    "pack": [                              // the local pack, in the order Google ranked it
      {
        "name": "The Belt Hub",
        "rating": "4.8",                   // as shown. omit if you did not see it
        "reviews": "212",                  // as shown. omit if you did not see it
        "cat": "Bicycle store",            // Google's own category label
        "note": "Old Fourth Ward"          // the second grey line: area or address
      }
      // 3 entries
    ],
    "ai": {
      "engines": ["ChatGPT", "Perplexity", "Gemini"],  // the ones you actually ran
      "prompt": "Where should I go for e-bikes near the Atlanta Beltline?",
      "answer": "the assistant's reply, quoted verbatim from your transcript",
      "named": ["The Belt Hub", "Beltline Biking", "Atlanta Bicycle Barn"]  // in the order named
    }
  },

  "comp": [                                // exactly 3 — who wins "near the Beltline"
    { "name": "The Belt Hub",        "why": "Old Fourth Ward · rides on the trail" },
    { "name": "Beltline Biking",     "why": "\"Beltline\" right in the name" },
    { "name": "Atlanta Bicycle Barn","why": "Steps from the Eastside Trail" }
  ],
  "ai": { "absent": "not named for \"near the Beltline.\" The trail-named shops are." },

  "gap": {
    "tiles": [                             // exactly 3 big-number gap tiles
      { "num": "3", "label": "e-bike shops rank above you for \"near the Beltline\"" },
      { "num": "0", "label": "AI picks for \"near the Beltline\" that include you" },
      { "num": "0", "label": "2026 \"best Atlanta e-bike\" lists you appear on" }
    ]
  },

  // ── the three layers ────────────────────────────────────────────────
  // Every cell is { status, found, fix? }. `found` is what is true today.
  // `fix` is what changes it, and it is optional because plenty of checks are
  // pure diagnosis. They render on separate lines under separate headings, so
  // do NOT weld them into one sentence with a semicolon. One thought each.
  //
  // `found` is prospect-facing. It must never contain an instruction to
  // ourselves. "Verify the live rating" belongs in `verify`, not in a cell an
  // owner reads.
  "seo": {
    "score": "5 / 10",
    "cost": "ONE short line: what this score costs them (shown under the dial).",
    "finding": "1-2 sentences: the SEO leak, then the fix.",
    "gbp":       { "status": "Claimed", "found": "...", "fix": "..." },  // profile completeness
    "reviews":   { "status": "Weak",    "found": "..." },                // rating/count/recency
    "localpack": { "status": "Mixed",   "found": "..." },                // position for money queries
    "speed":     { "status": "Thin",    "found": "...", "fix": "..." },  // stack + measured mobile LCP
    "maps":      { "status": "Missing", "found": "...", "fix": "..." }   // Apple Maps + Bing Places
  },
  "geo": {
    "score": "3 / 10",
    "cost": "ONE short line, shown under the GEO dial.",
    "finding": "1-2 sentences: the GEO leak, then the fix.",
    "aitest": { "status": "Absent",  "found": "who AI named instead, across the engines you ran" },
    "corpus": { "status": "Thin",    "found": "presence on Yelp/Reddit/press/guides AI reads" },
    "lists":  { "status": "Missing", "found": "inclusion in the best-of lists AI cites, + rank" },
    "schema": { "status": "Missing", "found": "LocalBusiness schema + machine-readable geo signal" }
  },
  "aeo": {
    "score": "5 / 10",
    "cost": "ONE short line, shown under the AEO dial.",
    "finding": "1-2 sentences: the AEO leak, then the fix.",
    "qa":       { "status": "Gap",    "found": "Google profile Q&A: how many open, who answered" },
    "qcontent": { "status": "Strong", "found": "FAQ / question-shaped content on site" },
    "answers":  { "status": "Gap",    "found": "who owns the trail/neighborhood answers" }
  },

  // ── the bottom line ─────────────────────────────────────────────────
  // ONE line. A pain point, not a plan. The report gives away five free fixes
  // in the very next section, so the prescription has a home already and does
  // not belong here. Wrap the sharpest few words in **bold**.
  // Good:  "Beltline Biking did not out-build you, **it out-labeled you**, and the label is what
  //         the phone reads."
  // Bad:   a 130-word paragraph that ends in a to-do list.
  "verdict": "One line. The pain, named, in their own situation.",

  // ── the cover photo ─────────────────────────────────────────────────
  // REQUIRED. The cover is built around a photo and looks broken without one.
  // If the business has no usable image anywhere, say so in `verify` and flag
  // the lead rather than shipping a hole.
  "cover": {
    "image": "https://.../storefront.jpeg",  // url or local path
    "alt": "…",
    "caption": "Caption the business, not the photo's address."
  },

  // ── internal, never rendered ────────────────────────────────────────
  // The salesperson's list. Anything you could not confirm goes here, which
  // is also the only place it is allowed to go.
  "verify": [
    "Google rating and review count: confirm live before the meeting"
  ]
}
```

## Fields that no longer exist

Do not emit these. They were researched for 26 reports and rendered on none of them:

- **`gap.hero`** — the big first-scroll number. The story version does not have that slot. Picking
  it was the most judgment-heavy step in the old playbook and every minute of it was wasted.
- **`verdict3`** — a three-bubble verdict, replaced by the single-line `verdict`.
- **`ride`** — the lifestyle photo. There is no second figure in the report.
- **`finding` inside a cell** — split into `found` and `fix`.

## Rules the build enforces

- `comp` and `gap.tiles` must each have exactly 3 entries.
- `search.pack` must have 3 entries, and `search.query` and `search.ai.prompt` are required.
- `cover` is required.
- Any cell with `status: "Verify"` fails the build. Confirm it or drop the check.
- A cell whose `found` or `fix` contains "verify", "confirm" or "check" as an instruction to
  ourselves fails the build. That text belongs in `verify`.
- A confident status (`Claimed`, `Strong`, `Missing`) on hedged language ("almost certainly",
  "likely", "presumably", "appears to") fails the build. If you are guessing, go look.
- No em dashes anywhere, including the template. Use commas, colons, periods, or ·.
- Extra keys are ignored, so notes are safe to include.

**Derived automatically, do NOT put in the JSON:** `scorenum`, `scorepct` and `scoreclass`
(bad ≤4 red / mid 5-6 amber / good ≥7 green) are computed from each layer's `score` string.

**Access code:** each lead needs an unused random 3-digit code in `rovoutreachdoc/lib/leads.ts`.
Codes are non-sequential on purpose so one prospect cannot walk the range and read a competitor's
audit.
