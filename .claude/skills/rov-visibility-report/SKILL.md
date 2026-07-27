---
name: rov-visibility-report
description: >
  Generate ROV "Beltline Visibility Report" outreach PDFs at scale — one business or 20 at a time.
  For each business it researches SEO / GEO / AEO presence, writes a findings JSON, and builds a
  self-contained internal HTML + client-ready PDF from the ROV template. Use whenever the user says
  "run a visibility report", "make a Beltline report for <business/URL>", "audit these businesses for
  outreach", "generate gap reports", or pastes one or more business URLs and wants visibility reports.
  Batch mode: give it a list of URLs (a targets file) and it produces one report per business plus a
  summary table.
---

# ROV Visibility Report — generator

This skill industrializes the Beltline Visibility Report (the free-value outreach asset). It splits
into a **brain** (research a business → a findings JSON) and **hands** (a deterministic script that
turns the JSON into HTML + PDF). The JSON is the only thing that carries meaning; the layout, fonts,
images, export button, and print CSS are all handled by the build script and never change.

**The two-step UX:** (1) give it URLs, (2) get reports. Everything below is how to fulfill that.

## Files

- Template (tokenized, do not hand-edit output): `content/sales/reports/_system/beltline-report.template.html`
- Build script: `content/sales/reports/_system/build-report.mjs`
- Findings contract (field-by-field): read `contract.md` in this skill folder
- Research playbook + scoring rubric: read `playbook.md` in this skill folder
- Worked example JSON: `content/sales/reports/_system/_examples/electrobike-georgia.json`
- Findings JSONs are saved to: `content/sales/reports/_system/_data/<slug>.json`
- Outputs land at: `content/sales/reports/beltline--<slug>.html` and `.pdf`

## What every report includes automatically (do not strip)

The template bakes these in for all reports; never remove them:

- **First-scroll diagnosis band** — flexible hero number (`gap.hero`), three color-coded SEO/GEO/AEO
  dials, three gap tiles, bottom-line verdict.
- **Tailored cover** — "for {{business.name}}" + location as the subject; PDF document title is
  personalized.
- **Dual CTA (both clickable in the PDF):**
  1. **Book your 15 minutes** → Calendly.
  2. **See our Beltline work →** → the LIVE custom Beltline landing page
     `rovstudios.com/industries/beltline-atlanta`, auto **UTM-tagged per lead**
     (`utm_source=visibility_report&utm_medium=pdf&utm_content=<slug>`) so clicks are attributable.
     The build derives this; override only via `"landing": { "url": "..." }` in the JSON.
- **Internal working copy** treatment on screen (top bar + "Export to PDF" button), hidden in the PDF.

## Honesty rules (non-negotiable — these protect the whole play)

The report's value is that a prospect can verify every claim. Never break these:

1. **Never fabricate a number.** Only state stats you actually pulled. If you could not confirm a
   value remotely (exact Google star rating, PageSpeed LCP, the full 9-query AI test, Apple/Bing
   claim status), set that cell's status to `Verify`, describe what to check, and add the item to the
   `verify` array. Do not invent competitor review counts — competitor "why" lines describe *why they
   win the trail* (name, neighborhood, positioning), not fake ratings.
2. **No em dashes, ever.** Use commas, colons, periods, or ·. (ROV house rule.)
3. **Cite market stats.** The fixed market statistics and sources are baked into the template and are
   already correct for the Beltline niche. Do not touch them.
4. **Don't overclaim location.** If a photo predates a move, caption the *business*, not the photo's
   address.

## Single business

1. Read `playbook.md` and `contract.md`.
2. Run the research playbook against the URL. Produce a findings object matching the contract.
3. Write it to `content/sales/reports/_system/_data/<slug>.json` (slug = kebab business name).
4. Build: `node content/sales/reports/_system/build-report.mjs content/sales/reports/_system/_data/<slug>.json`
   (add `--no-pdf` to skip PDF; the HTML's "Export to PDF" button is the manual fallback).
5. Report back the scorecard (SEO/GEO/AEO), the one-line verdict, and the `verify` list.

## Batch (20 at a time) — full auto

Input: a targets file, one business per line. Format: `url` optionally followed by ` | pointers`
(free-text hints like a known competitor, the neighborhood, or "repair-focused"). Blank lines and
lines starting with `#` are ignored.

1. Parse the targets file into `{url, pointers}` rows.
2. **Fan out research in parallel** with the Agent tool — one subagent per business, capped at ~8
   concurrent. Give each subagent: the URL + pointers, and instructions to follow `playbook.md` and
   `contract.md` and return ONLY a valid findings JSON object (no prose). Enforce the honesty rules in
   the subagent prompt. (For very large batches, prefer a Workflow pipeline: stage 1 = research agent
   emitting the contract as a schema, stage 2 = a step that writes the JSON.)
3. Save each returned JSON to `content/sales/reports/_system/_data/<slug>.json`.
4. **Run the batch runner** — it validates, builds, and books everything:
   `node content/sales/reports/_system/run-batch.mjs`
   It processes every `_data/*.json`, and for each: validates against the contract + honesty rules
   (rejects anything incomplete or with an em dash **before** it builds), builds HTML + PDF (PDF
   retries with a browser restart), dedups slugs, and records status in `_system/_batch/ledger.json`.
   It is **resumable** — a re-run skips leads already built from unchanged JSON, so a crash at #18
   never redoes 1-17. Add `--fresh` to force a full rebuild.
5. Read the printed **summary table** (also written to `_system/_batch/summary.md`): each lead ·
   SEO/GEO/AEO · verify count · status. Anything under "need attention" (failed validation, dead site,
   thin research) is listed with the reason — fix its JSON and re-run, or re-queue the research.
6. Never silently drop a target. The runner surfaces every failure; a hollow or dishonest report is
   rejected by the validator, not shipped.

**Fix one lead fast:** edit `_system/_data/<slug>.json` and re-run the batch (or
`node build-report.mjs <that.json>`). The validator gates it; the ledger rebuilds only what changed.

**Validate without building** (e.g. to check a subagent's output):
`node content/sales/reports/_system/validate.mjs <findings.json>`

## Re-running

The JSON is the source of truth. To fix one field, edit `_system/_data/<slug>.json` and re-run the
build script on just that file — a corrected report is out in ~2 seconds. No re-research needed.

## Adding a new niche later

This template is Beltline-specific (market stats + sources hard-coded). A new niche = a new tokenized
template built the same way (`_system/<niche>-report.template.html`) with that niche's anchor stats and
sources, plus a niche field in the contract. The build script and research playbook stay the same.
