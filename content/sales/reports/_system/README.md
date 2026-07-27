# Visibility Report system

The engine behind the Beltline Visibility Reports. Driven by the `rov-visibility-report` skill, but
you can run it by hand too.

## Pipeline

```
business URL ──[research: brain]──▶ _data/<slug>.json ──[build-report.mjs: hands]──▶ beltline--<slug>.html + .pdf
```

- **Brain** = judgment (research → findings JSON). Done by the skill / a subagent following
  `../../../.claude/skills/rov-visibility-report/playbook.md` + `contract.md`.
- **Hands** = `build-report.mjs`. Deterministic. Fills the tokenized template, downloads + optimizes
  (ffmpeg) + embeds the images as base64, and renders the PDF via the gstack browse tool. No judgment.

## What the template bakes in (all reports)

Diagnosis band (hero + 3 dials + 3 gap tiles + verdict) · tailored cover + personalized PDF title ·
larger high-contrast type · **dual CTA: "Book your 15 minutes" (Calendly) + "See our Beltline work →"
linking the LIVE landing page `rovstudios.com/industries/beltline-atlanta`, UTM-tagged per lead** ·
internal top-bar + Export-to-PDF button (hidden in the PDF). Change these in `make-template.mjs` and
regenerate the template; do not hand-edit built reports.

## Files

- `beltline-report.template.html` — tokenized template (`{{tokens}}`). Fonts embedded, export button,
  internal bar, print CSS. Regenerate it from the human-readable
  `../beltline-visibility-report.html` with `make-template.mjs` if that ever changes. Do not hand-edit.
- `build-report.mjs` — the assembler. `node build-report.mjs <findings.json> [--no-pdf] [--out path]`
- `_data/<slug>.json` — per-business findings (the source of truth for each report).
- `_examples/electrobike-georgia.json` — worked example.

## Run one

```
node content/sales/reports/_system/build-report.mjs content/sales/reports/_system/_data/<slug>.json
```

Output: `content/sales/reports/beltline--<slug>.html` and `.pdf`. To fix a report, edit its JSON and
re-run — a few seconds, no re-research. Any unfilled token shows up as a red `[[key]]` in the HTML.

## Batch (25 at a time)

Research (the skill / subagents) drops one findings JSON per lead into `_data/`. Then:

```
node content/sales/reports/_system/run-batch.mjs          # validate + build every _data/*.json
node content/sales/reports/_system/run-batch.mjs --fresh  # ignore ledger, rebuild all
```

The runner is the safety net for volume:
- **Validates** every JSON first (`validate.mjs`): required fields, `comp` and `gap.tiles` = 3, no
  empty cells, no em dashes, no unfilled `[...]`. Anything that fails is **not built** — it is listed
  under "need attention" with the reason.
- **Builds** HTML + PDF per lead; the PDF step retries with a browser restart (the daemon occasionally
  white-screens).
- **Resumable**: `_batch/ledger.json` records each lead's status + JSON hash. A re-run skips leads
  already built from unchanged JSON, so a crash mid-batch never redoes finished work.
- **Dedups** slugs, and writes a `_batch/summary.md` table.

`build-report.mjs` also validates on its own and refuses a bad JSON (override with `--force`). PDF needs
the gstack browse tool on PATH (or `BROWSE_BIN`); without it, HTML still builds and the "Export to PDF"
button is the fallback.

## Requirements

- Node 18+ (uses `curl` + `ffmpeg` on PATH for image embedding).
- gstack browse tool for automated PDF (optional).
