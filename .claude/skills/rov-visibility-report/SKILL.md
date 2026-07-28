---
name: rov-visibility-report
description: >
  Generate ROV "Beltline Visibility Report" outreach reports at scale — one business or 20 at a time.
  For each business it researches SEO / GEO / AEO presence, records what Google and AI actually
  returned, and writes a findings JSON that the rovoutreachdoc site renders as a gated, per-lead
  report. Use whenever the user says "run a visibility report", "make a Beltline report for
  <business/URL>", "audit these businesses for outreach", "generate gap reports", or pastes one or
  more business URLs and wants visibility reports. Batch mode: give it a list of URLs and it
  produces one report per business plus a summary table.
---

# ROV Visibility Report — generator

This skill industrializes the Beltline Visibility Report, the free-value outreach asset. It splits
into a **brain** (research a business, write a findings JSON) and a **surface** (a Next.js site that
renders the JSON as a gated report). The JSON is the only thing that carries meaning. Layout, type,
images and print styling live in the site and never change per lead.

**The two-step UX:** (1) give it URLs, (2) get reports. Everything below is how to fulfill that.

## Where things live

The report is a **site**, not a PDF. It lives in its own repo:

- Findings: `rovoutreachdoc/data/<slug>.json`
- Schema, and the source of truth if docs disagree: `rovoutreachdoc/lib/types.ts`
- Access codes: `rovoutreachdoc/lib/leads.ts`
- The rendered report: `rovoutreachdoc/app/report/[slug]/page.tsx`
- Audit table rows and their fixed reason lines: `rovoutreachdoc/lib/audit.ts`
- Findings contract, field by field: `contract.md` in this skill folder
- Research playbook and scoring rubric: `playbook.md` in this skill folder

Live at `/report/<slug>`, reachable only with that lead's `ROV###` code.

The old `content/sales/reports/_system/` pipeline in rov-website-2 (`build-report.mjs`,
`run-batch.mjs`, the tokenized HTML template, the PDF export) is **retired**. It produced an artifact
nobody ships. Do not build against it.

## What every report includes automatically (do not strip)

- **Cover** built around the lead's photo, with their name and location as the subject.
- **The premise**, as a napkin diagram: two storefronts, one of them a phone.
- **The moment**: what Google and the assistant actually returned, rendered in Google's and
  ChatGPT's own interface rather than ROV's. This is deliberate. An owner reads a white Google
  result as a fact about their business and a cream card as our opinion.
- **The scale**: corridor traffic, the funnel, the gap tiles.
- **Three layers** scored separately, with per-check audit tables.
- **The bottom line**: one line.
- **The gift**: five free fixes, no conditions.
- **The close** and the sources.

## Honesty rules (non-negotiable — these protect the whole play)

The report's value is that a prospect can verify every claim. Never break these:

1. **Never state something you did not observe.** Not "almost certainly claimed", not "likely has".
   If you are inferring, you are guessing, and a guess wearing a confident status is the fastest way
   to lose the meeting. Go look. The four checks that used to get skipped are listed at the top of
   `playbook.md` and each takes under a minute.
2. **`Verify` is not a status.** It fails the build. It used to be allowed, and the site silently
   deleted every row carrying it, so all 26 reports shipped short tables that looked complete. If a
   thing is unconfirmed, confirm it. Genuinely unconfirmable items go in the `verify` array, which is
   internal.
3. **Never put our homework in prospect-facing copy.** A `found` line ending "Verify Google rating
   live" is showing the owner our to-do list. That text goes in `verify`.
4. **Never write the assistant's words for it.** `search.ai.answer` is quoted from a transcript you
   recorded, or it is omitted. Do not compose a plausible-sounding AI reply and attribute it. The
   panel renders less rather than renders a fake.
5. **Never invent competitor numbers.** If you want to show a rating, take it from the local pack you
   actually recorded.
6. **No em dashes, ever.** Commas, colons, periods, or ·. This applies to the JSON and to the site
   template. (ROV house rule.)
7. **Don't overclaim location.** If a photo predates a move, caption the business, not the address.
8. **Market stats are fixed and already cited** in the site. Do not touch them.

## Single business

1. Read `playbook.md` and `contract.md`.
2. Run the research playbook against the URL, including the four mandatory confirmations and the
   nine-query AI test. Record queries, packs and replies as you go; they are contract fields, not
   notes.
3. Write the findings to `rovoutreachdoc/data/<slug>.json` (slug = kebab business name).
4. Register the lead in `rovoutreachdoc/lib/leads.ts` with an unused random 3-digit code. Codes are
   non-sequential so one prospect cannot walk the range and read a competitor's audit.
5. Validate, then look at it:
   ```
   cd rovoutreachdoc && npm run build      # type errors and contract failures surface here
   npm run dev                             # then open /report/<slug>
   ```
6. Report back the scorecard (SEO/GEO/AEO), the one-line verdict, and the `verify` list.

## Batch (20 at a time)

Input: a targets file, one business per line, `url` optionally followed by ` | pointers` (free-text
hints: a known competitor, the neighborhood, "repair-focused"). Blank lines and `#` lines ignored.

1. Parse the targets into `{url, pointers}` rows.
2. **Fan out research in parallel**, one subagent per business, capped at ~8 concurrent. Give each
   subagent the URL plus pointers and instruct it to follow `playbook.md` and `contract.md` and
   return only a valid findings JSON object. **Put the honesty rules in the subagent prompt**, and
   name the four mandatory checks explicitly. A subagent told to "mark it Verify if unsure" will do
   exactly that, and that is the failure this skill was rewritten to remove.
3. Save each JSON to `rovoutreachdoc/data/<slug>.json` and register its code in `lib/leads.ts`.
4. Run `npm run build` once over the whole set. Type errors and contract failures name the file.
5. Print a summary table: each lead, SEO/GEO/AEO, cover present, `verify` count, status. Anything
   that failed is listed with the reason. Fix its JSON and re-run.
6. **Never silently drop a target.** A hollow report is worse than a missing one, because a hollow
   one gets handed to a business owner.

**Fix one lead fast:** edit its JSON and refresh. The site reads the file, so a corrected report is
live in a second. No re-research needed for a wording change.

## Self-check before you hand anything over

Run these against what you produced. Each one is a real defect that shipped at least once.

- Any `"status": "Verify"` anywhere? Confirm it or drop the check.
- Any `found` or `fix` containing "verify", "confirm" or "check" as an instruction to us?
- Any hedge ("almost certainly", "likely", "presumably", "appears to") sitting under a confident
  status?
- Any em dash, in the JSON or the template?
- Is `cover` present on every lead?
- Is `search.query` the string you actually typed, and `search.ai.answer` quoted rather than
  composed?
- Is `verdict` one line, and is it a pain point rather than a plan?
- Does every cell read as one thought in `found` and one in `fix`, rather than a paragraph welded
  together with a semicolon?
- Does the arithmetic in the copy match the arithmetic in the code? A stated rate and a printed
  number that disagree is the one error a prospect can catch with a phone calculator.

## Adding a new niche later

The site's market stats and sources are Beltline-specific and live in the report page. A new niche
means a new set of anchor stats and sources plus a niche field in the contract. The research
playbook and the findings contract stay the same.
