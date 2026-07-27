#!/usr/bin/env node
/**
 * build-report.mjs — the deterministic "hands" of the visibility-report pipeline.
 * Input:  a findings JSON (the contract). Output: a self-contained internal HTML + PDF.
 * No judgment happens here. Everything the report says comes from the JSON.
 *
 * Usage:
 *   node build-report.mjs <findings.json> [--no-pdf]
 *   node build-report.mjs <findings.json> --out custom.html
 *
 * The JSON's `slug` decides the output filename: content/sales/reports/beltline--<slug>.{html,pdf}
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { validateFindings } from './validate.mjs';

const ROOT = 'content/sales/reports';
const TEMPLATE = path.join(ROOT, '_system', 'beltline-report.template.html');
const BROWSE = process.env.BROWSE_BIN || '/c/Users/ayush/.claude/skills/gstack/browse/dist/browse';

const args = process.argv.slice(2);
const dataPath = args.find(a => !a.startsWith('--'));
const noPdf = args.includes('--no-pdf');
const force = args.includes('--force');
const outFlag = args.indexOf('--out');
if (!dataPath) { console.error('usage: node build-report.mjs <findings.json> [--no-pdf] [--force]'); process.exit(1); }

const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// validate before building — a bad JSON must never become a report (override with --force)
const v = validateFindings(data);
if (v.warnings.length) v.warnings.forEach(w => console.log('  ~ ' + w));
if (v.errors.length) {
  console.error(`VALIDATION FAILED (${v.errors.length}):`);
  v.errors.forEach(e => console.error('  ✗ ' + e));
  if (!force) { console.error('Refusing to build. Fix the JSON or pass --force.'); process.exit(1); }
  console.error('--force set: building anyway.');
}

// derive dial fields from each layer score ("3 / 10" -> num 3, pct 30%, class bad/mid/good)
for (const L of ['seo', 'geo', 'aeo']) {
  const m = String(data[L]?.score ?? '').match(/\d+/);
  if (m) {
    const n = parseInt(m[0], 10);
    data[L].scorenum = String(n);
    data[L].scorepct = Math.max(0, Math.min(100, n * 10)) + '%';
    data[L].scoreclass = n <= 4 ? 'bad' : (n <= 6 ? 'mid' : 'good');
  }
}

// custom Beltline landing page link, tagged per lead so clicks are attributable
{
  const _slug = data.slug || 'untitled';
  const url = data.landing?.url
    || `https://rovstudios.com/industries/beltline-atlanta?utm_source=visibility_report&utm_medium=pdf&utm_content=${_slug}`;
  data.landing = { url };
}

let html = fs.readFileSync(TEMPLATE, 'utf8');
const warn = [];

const esc = (v) => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// flatten nested object -> dot keys (arrays use numeric index): {a:{b:1}} -> "a.b"
function flatten(obj, prefix = '', out = {}) {
  for (const [k, v] of Object.entries(obj || {})) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) flatten(v, key, out);
    else if (Array.isArray(v)) v.forEach((item, i) => {
      if (item && typeof item === 'object') flatten(item, `${key}.${i}`, out);
      else out[`${key}.${i}`] = item;
    });
    else out[key] = v;
  }
  return out;
}

// ---- images: url|path -> optimized base64 data URI ----
function ffmpeg(inPath, outPath, scaleW, q) {
  execFileSync('ffmpeg', ['-y', '-i', inPath, '-vf', `scale=${scaleW}:-2`, '-q:v', String(q), outPath, '-loglevel', 'error']);
}
function imageDataURI(spec, scaleW, q) {
  // spec: string (url or path) or {url}/{path}
  const src = typeof spec === 'string' ? spec : (spec.url || spec.path);
  if (!src) return null;
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'rovimg-'));
  const raw = path.join(tmp, 'raw.img');
  const opt = path.join(tmp, 'opt.jpg');
  try {
    if (/^https?:\/\//i.test(src)) {
      const buf = execFileSync('curl', ['-sL', '-A', 'Mozilla/5.0', src, '--max-time', '45']);
      if (!buf || buf.length < 1000) throw new Error('download too small');
      fs.writeFileSync(raw, buf);
    } else {
      fs.copyFileSync(src, raw);
    }
    ffmpeg(raw, opt, scaleW, q);
    return 'data:image/jpeg;base64,' + fs.readFileSync(opt).toString('base64');
  } catch (e) {
    warn.push(`image failed (${src}): ${e.message}`);
    return null;
  } finally {
    try { fs.rmSync(tmp, { recursive: true, force: true }); } catch {}
  }
}

function figureCover(d) {
  if (!d.cover || !(d.cover.image || d.cover.url || typeof d.cover === 'string')) return '';
  const uri = imageDataURI(d.cover.image || d.cover, 1040, 5);
  if (!uri) return '';
  const cap = d.cover.caption ? `\n      <figcaption class="figcap">${esc(d.cover.caption)}</figcaption>` : '';
  const alt = esc(d.cover.alt || `${d.business?.name || ''} storefront`);
  return `<figure class="coverfig">\n      <img alt="${alt}" src="${uri}">${cap}\n    </figure>`;
}
function figureRide(d) {
  if (!d.ride || !(d.ride.image || d.ride.url || typeof d.ride === 'string')) return '';
  const uri = imageDataURI(d.ride.image || d.ride, 1440, 6);
  if (!uri) return '';
  const cap = d.ride.caption ? `\n      <figcaption class="figcap">${esc(d.ride.caption)}</figcaption>` : '';
  const alt = esc(d.ride.alt || 'People riding electric bikes');
  return `<figure class="ridefig">\n      <img alt="${alt}" src="${uri}">${cap}\n    </figure>`;
}

// inject figures first (they contain no {{tokens}})
html = html.replace('{{FIGURE_COVER}}', figureCover(data));
html = html.replace('{{FIGURE_RIDE}}', figureRide(data));

// replace all remaining {{tokens}} from the flattened data
const map = flatten(data);
html = html.replace(/\{\{([^}]+)\}\}/g, (m, key) => {
  key = key.trim();
  if (key in map && map[key] != null && map[key] !== '') return esc(map[key]);
  warn.push(`missing token: ${key}`);
  return '<span style="color:#B00">[[' + key + ']]</span>';
});

// output paths
const slug = data.slug || 'untitled';
const outHtml = outFlag >= 0 ? args[outFlag + 1] : path.join(ROOT, `beltline--${slug}.html`);
const outPdf = outHtml.replace(/\.html$/, '.pdf');
fs.writeFileSync(outHtml, html, 'utf8');
console.log(`HTML  ${outHtml}  (${Math.round(html.length / 1024)} KB)`);

// PDF via gstack browse, with retry+restart (the daemon occasionally white-screens). The HTML's
// "Export to PDF" button is the manual fallback if all attempts fail.
if (!noPdf) {
  const tmpHtml = path.join(os.tmpdir(), `rovreport-${slug}.html`);
  fs.writeFileSync(tmpHtml, html, 'utf8');
  const run = (a) => execFileSync(BROWSE, a, { stdio: 'pipe' });
  const ATTEMPTS = 3;
  let ok = false, lastErr;
  for (let i = 1; i <= ATTEMPTS && !ok; i++) {
    try {
      try { run(['restart']); } catch {}          // fresh tab each attempt
      run(['load-html', tmpHtml]);
      run(['pdf', outPdf, '--format', 'letter', '--print-background']);
      if (fs.statSync(outPdf).size < 20000) throw new Error('pdf suspiciously small');
      ok = true;
    } catch (e) { lastErr = e; }
  }
  if (ok) console.log(`PDF   ${outPdf}  (${Math.round(fs.statSync(outPdf).size / 1024)} KB)`);
  else warn.push(`pdf failed after ${ATTEMPTS} tries (${lastErr?.message}). Open the HTML and click "Export to PDF".`);
}

if (warn.length) { console.log('\nWARNINGS:'); warn.forEach(w => console.log('  - ' + w)); }
console.log(`\nDONE ${slug} · SEO ${data.seo?.score} · GEO ${data.geo?.score} · AEO ${data.aeo?.score}`);
if (Array.isArray(data.verify) && data.verify.length) {
  console.log('VERIFY BEFORE SENDING:'); data.verify.forEach(v => console.log('  · ' + v));
}
