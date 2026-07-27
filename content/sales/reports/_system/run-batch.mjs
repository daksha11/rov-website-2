#!/usr/bin/env node
/**
 * run-batch.mjs — the "walk away" orchestrator for a batch of leads. Validates, builds, and tracks
 * every findings JSON in _data/, so a crash at #18 doesn't redo 1-17.
 *
 *   node run-batch.mjs                 # process every _system/_data/*.json (resumable)
 *   node run-batch.mjs --fresh         # ignore the ledger, rebuild everything
 *   node run-batch.mjs --data-dir X    # use a different folder of findings JSONs
 *
 * Research (the brain) is done upstream by the rov-visibility-report skill, which writes the JSONs.
 * This is the deterministic hands + QC + bookkeeping over them.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { validateFindings } from './validate.mjs';

const SYS = 'content/sales/reports/_system';
const REPORTS = 'content/sales/reports';
const BUILD = path.join(SYS, 'build-report.mjs');
const BATCHDIR = path.join(SYS, '_batch');
const LEDGER = path.join(BATCHDIR, 'ledger.json');

const argv = process.argv.slice(2);
const fresh = argv.includes('--fresh');
const dataDir = (() => { const i = argv.indexOf('--data-dir'); return i >= 0 ? argv[i + 1] : path.join(SYS, '_data'); })();

fs.mkdirSync(BATCHDIR, { recursive: true });
const ledger = (!fresh && fs.existsSync(LEDGER)) ? JSON.parse(fs.readFileSync(LEDGER, 'utf8')) : {};
const saveLedger = () => fs.writeFileSync(LEDGER, JSON.stringify(ledger, null, 2));
const sha = (s) => crypto.createHash('sha1').update(s).digest('hex').slice(0, 12);

const files = fs.existsSync(dataDir)
  ? fs.readdirSync(dataDir).filter(f => f.endsWith('.json')).map(f => path.join(dataDir, f)).sort()
  : [];
if (!files.length) { console.error(`No findings JSONs in ${dataDir}`); process.exit(1); }

console.log(`Batch: ${files.length} findings file(s) in ${dataDir}\n`);
const rows = [];
const seenSlugs = new Map();

for (const file of files) {
  const raw = fs.readFileSync(file, 'utf8');
  let data;
  try { data = JSON.parse(raw); }
  catch (e) { rows.push({ file, slug: path.basename(file, '.json'), status: 'BAD JSON', note: e.message }); continue; }

  let slug = data.slug || path.basename(file, '.json');
  // slug dedup across the batch
  if (seenSlugs.has(slug)) { const n = seenSlugs.get(slug) + 1; seenSlugs.set(slug, n); slug = `${slug}-${n}`; }
  else seenSlugs.set(slug, 1);
  const outHtml = path.join(REPORTS, `beltline--${slug}.html`);
  const hash = sha(raw);

  // resume: skip if already built from identical JSON and outputs exist
  const prev = ledger[slug];
  if (prev && prev.status === 'built' && prev.hash === hash && fs.existsSync(outHtml)) {
    rows.push({ slug, scores: prev.scores, verify: prev.verify, status: 'skip (done)', out: outHtml });
    continue;
  }

  // validate
  const { errors, warnings } = validateFindings(data);
  const scores = ['seo', 'geo', 'aeo'].map(L => (String(data[L]?.score || '?').match(/\d+/) || ['?'])[0]).join('/');
  const verify = Array.isArray(data.verify) ? data.verify.length : 0;
  if (errors.length) {
    ledger[slug] = { status: 'failed', hash, errors, scores, verify, ts: Date.now() };
    rows.push({ slug, scores, verify, status: `FAIL (${errors.length} err)`, note: errors[0] });
    saveLedger();
    continue;
  }

  // build (build-report re-validates + does PDF with retry)
  try {
    process.stdout.write(`building ${slug} ... `);
    execFileSync('node', [BUILD, file, '--out', outHtml], { stdio: 'pipe' });
    const pdf = outHtml.replace(/\.html$/, '.pdf');
    const hasPdf = fs.existsSync(pdf);
    ledger[slug] = { status: 'built', hash, scores, verify, html: outHtml, pdf: hasPdf ? pdf : null, warnings, ts: Date.now() };
    rows.push({ slug, scores, verify, status: hasPdf ? 'built' : 'built (html only)', out: outHtml });
    console.log(hasPdf ? 'ok' : 'ok (no pdf)');
  } catch (e) {
    ledger[slug] = { status: 'failed', hash, errors: [e.stderr?.toString() || e.message], scores, verify, ts: Date.now() };
    rows.push({ slug, scores, verify, status: 'BUILD ERROR', note: (e.stderr?.toString() || e.message).split('\n')[0] });
    console.log('ERROR');
  }
  saveLedger();
}
saveLedger();

// summary
const pad = (s, n) => String(s).padEnd(n).slice(0, n);
console.log('\n' + pad('LEAD', 26) + pad('SEO/GEO/AEO', 14) + pad('VERIFY', 8) + 'STATUS');
console.log('-'.repeat(64));
for (const r of rows) console.log(pad(r.slug, 26) + pad(r.scores || '-', 14) + pad(r.verify ?? '-', 8) + r.status);

const failed = rows.filter(r => /FAIL|ERROR|BAD/.test(r.status));
if (failed.length) {
  console.log(`\n${failed.length} need attention:`);
  failed.forEach(r => console.log(`  · ${r.slug}: ${r.note || r.status}`));
}
const built = rows.filter(r => /built/.test(r.status)).length;
const skipped = rows.filter(r => /skip/.test(r.status)).length;
console.log(`\n${built} built · ${skipped} skipped (done) · ${failed.length} failed · outputs in ${REPORTS}/`);

// write a markdown summary too
const md = ['# Batch summary', '', '| Lead | SEO/GEO/AEO | Verify | Status |', '|---|---|---|---|',
  ...rows.map(r => `| ${r.slug} | ${r.scores || '-'} | ${r.verify ?? '-'} | ${r.status} |`)].join('\n');
fs.writeFileSync(path.join(BATCHDIR, 'summary.md'), md + '\n', 'utf8');
