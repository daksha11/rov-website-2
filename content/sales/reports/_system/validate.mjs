#!/usr/bin/env node
/**
 * validate.mjs — the safety net. Checks a findings JSON against the contract and the ROV honesty
 * rules BEFORE it can become a report. Used by build-report.mjs (per lead) and run-batch.mjs (batch).
 *
 * CLI:   node validate.mjs <findings.json>          -> prints problems, exit 1 if any hard errors
 * Import: import { validateFindings } from './validate.mjs'  -> { errors:[], warnings:[] }
 */
import fs from 'node:fs';

const NONEMPTY = (v) => typeof v === 'string' && v.trim().length > 0;
const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// walk every string value with its dot-path (for content lints)
function walkStrings(obj, prefix, cb) {
  for (const [k, v] of Object.entries(obj || {})) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object') walkStrings(v, key, cb);
    else if (typeof v === 'string') cb(key, v);
  }
}

export function validateFindings(data) {
  const errors = [];
  const warnings = [];
  const need = (cond, msg) => { if (!cond) errors.push(msg); };

  // identity
  need(NONEMPTY(data.slug) && KEBAB.test(data.slug || ''), 'slug missing or not kebab-case');
  for (const f of ['name', 'short', 'location', 'neighborhood', 'category', 'date'])
    need(NONEMPTY(data.business?.[f]), `business.${f} missing`);

  // competitors + mockup
  need(Array.isArray(data.comp) && data.comp.length === 3, 'comp must have exactly 3 entries');
  (data.comp || []).forEach((c, i) => {
    need(NONEMPTY(c?.name), `comp.${i}.name missing`);
    need(NONEMPTY(c?.why), `comp.${i}.why missing`);
  });
  need(NONEMPTY(data.ai?.absent), 'ai.absent missing');

  // diagnosis band
  need(NONEMPTY(data.gap?.hero?.number), 'gap.hero.number missing');
  need(NONEMPTY(data.gap?.hero?.label), 'gap.hero.label missing');
  need(NONEMPTY(data.gap?.hero?.sub), 'gap.hero.sub missing');
  need(Array.isArray(data.gap?.tiles) && data.gap.tiles.length === 3, 'gap.tiles must have exactly 3 entries');
  (data.gap?.tiles || []).forEach((t, i) => {
    need(NONEMPTY(t?.num), `gap.tiles.${i}.num missing`);
    need(NONEMPTY(t?.label), `gap.tiles.${i}.label missing`);
  });

  // three layers
  const layerCells = {
    seo: ['gbp', 'reviews', 'localpack', 'speed', 'maps'],
    geo: ['aitest', 'corpus', 'lists', 'schema'],
    aeo: ['qa', 'qcontent', 'answers'],
  };
  for (const [L, cells] of Object.entries(layerCells)) {
    const layer = data[L];
    need(NONEMPTY(layer?.score) && /\d/.test(layer?.score || ''), `${L}.score missing or has no number`);
    need(NONEMPTY(layer?.cost), `${L}.cost missing (shown under the dial)`);
    need(NONEMPTY(layer?.finding), `${L}.finding missing`);
    for (const c of cells) {
      need(NONEMPTY(layer?.[c]?.status), `${L}.${c}.status missing`);
      need(NONEMPTY(layer?.[c]?.finding), `${L}.${c}.finding missing`);
    }
  }
  need(NONEMPTY(data.verdict), 'verdict missing');

  // honesty + hygiene lints across all string values
  walkStrings(data, '', (key, val) => {
    if (val.includes('—')) errors.push(`em dash in ${key} (house rule: use , : . or ·)`);
    if (/\[[^\]]{2,60}\]/.test(val) && !val.includes('data:'))
      warnings.push(`possible unfilled placeholder in ${key}: ${val.match(/\[[^\]]{2,60}\]/)[0]}`);
    if (/\bTODO\b|\bTKTK\b|\bXXX\b|lorem ipsum/i.test(val)) warnings.push(`placeholder text in ${key}`);
  });

  // images (optional, but warn — a report is stronger with them)
  if (!data.cover?.image && typeof data.cover !== 'string') warnings.push('no cover image (report builds without it)');
  if (!data.ride?.image && typeof data.ride !== 'string') warnings.push('no ride image (report builds without it)');
  if (!Array.isArray(data.verify) || data.verify.length === 0)
    warnings.push('verify[] empty — confirm nothing needs a live check before sending');

  return { errors, warnings };
}

// CLI
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('validate.mjs')) {
  const p = process.argv[2];
  if (!p) { console.error('usage: node validate.mjs <findings.json>'); process.exit(2); }
  let data;
  try { data = JSON.parse(fs.readFileSync(p, 'utf8')); }
  catch (e) { console.error(`INVALID JSON: ${e.message}`); process.exit(1); }
  const { errors, warnings } = validateFindings(data);
  if (warnings.length) { console.log('WARNINGS:'); warnings.forEach(w => console.log('  ~ ' + w)); }
  if (errors.length) { console.log('ERRORS:'); errors.forEach(e => console.log('  ✗ ' + e)); console.log(`\nFAIL (${errors.length} errors)`); process.exit(1); }
  console.log(`PASS${warnings.length ? ` (${warnings.length} warnings)` : ''} · ${data.slug}`);
}
