// Vue pose optimizer.
//
// Drop new full-res pose art into .asset-originals/vue/ named
// `vue_<pose>_<colorway>.png`, add its ERASE rect below, then run:
//
//   node scripts/optimize-vue-poses.mjs
//
// It does three things:
//   1. trims the transparent margin and normalises every pose to the same
//      figure height, so Vue is the same "size" character in every pose and
//      the two colorways of a pose stay pixel-registered;
//   2. erases the painted sigil from the visor, leaving a blank screen for
//      the animated SVG eye to own (see VueEye) — without this the drawn eye
//      and the painted one fight, and Vue can never blink;
//   3. writes `public/ctrla/vue/vue-<pose>-<colorway>.webp`.
//
// Requires sharp: `npm i -D sharp` (or run with `npx -p sharp node ...`).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, ".asset-originals/vue");
const OUT = path.join(ROOT, "public/ctrla/vue");

// 2x the tallest Vue is ever rendered (~700px in the closing cameo), so the
// masters stay retina-sharp while next/image serves the smaller widths.
const FIGURE_HEIGHT = 1400;
// q80 is visually indistinguishable from the source on this flat, hard-edged
// art — checked against the visor, the finest detail in the set.
const WEBP = { quality: 80, effort: 6, alphaQuality: 100 };

// Where the painted sigil sits on each pose, as a fraction of the trimmed art,
// padded out so the fit has clean visor to sample on every side. These are
// generous working rects; the tight rect the SVG eye draws into lives in
// app/ctrla/_components/vue/poses.ts. Both are measured post-trim, so the two
// colorways of a pose share one rect.
const ERASE = {
  pointing: { x: 0.29, y: 0.07, w: 0.28, h: 0.14 },
  showing: { x: 0.4, y: 0.055, w: 0.34, h: 0.14 },
  leaning: { x: 0.39, y: 0.065, w: 0.26, h: 0.16 },
};

let sharp;
try {
  ({ default: sharp } = await import("sharp"));
} catch {
  console.error("This script needs sharp. Install it with: npm i -D sharp");
  process.exit(1);
}

// ── the visor erase ────────────────────────────────────
// The visor is a smooth gradient carrying a couple of soft specular streaks.
// Fitting a quadratic surface to the surviving visor immediately around the
// sigil rebuilds it convincingly, and — unlike a diffusion inpaint — lands at
// the right brightness by construction instead of converging to a dark blob.

// Dense least-squares solve: normal equations, Gauss-Jordan with partial
// pivoting. Six terms, so the system is tiny.
function solve(A, b) {
  const n = b.length;
  const M = A.map((row, i) => [...row, b[i]]);
  for (let c = 0; c < n; c++) {
    let piv = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[piv][c])) piv = r;
    [M[c], M[piv]] = [M[piv], M[c]];
    if (Math.abs(M[c][c]) < 1e-9) return null;
    for (let r = 0; r < n; r++) {
      if (r === c) continue;
      const f = M[r][c] / M[c][c];
      for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k];
    }
  }
  return M.map((row, i) => row[n] / row[i]);
}

function growMask(m, tw, th, k) {
  for (let d = 0; d < k; d++) {
    const next = Uint8Array.from(m);
    for (let y = 0; y < th; y++) {
      for (let x = 0; x < tw; x++) {
        if (m[y * tw + x]) continue;
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && ny >= 0 && nx < tw && ny < th && m[ny * tw + nx]) {
            next[y * tw + x] = 1;
            break;
          }
        }
      }
    }
    m = next;
  }
  return m;
}

async function eraseSigil(buf, rect, { dilate = 10, ring = 26, feather = 5 } = {}) {
  const { width: W, height: H } = await sharp(buf).metadata();
  const R = {
    left: Math.round(rect.x * W),
    top: Math.round(rect.y * H),
    width: Math.round(rect.w * W),
    height: Math.round(rect.h * H),
  };
  const tile = await sharp(buf).extract(R).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: tw, height: th } = tile.info;
  const orig = Buffer.from(tile.data);
  const N = tw * th;

  // The sigil is everything warmer than the visor: the gold strokes and the
  // soft halo they cast.
  let mask = new Uint8Array(N);
  for (let i = 0; i < N; i++) {
    const p = i * 4;
    if (orig[p + 3] > 100 && orig[p] - orig[p + 2] > 26 && orig[p + 1] - orig[p + 2] > 14) mask[i] = 1;
  }
  mask = growMask(mask, tw, th, dilate);
  const outer = growMask(Uint8Array.from(mask), tw, th, ring);

  // Sample the ring, but only its darker half: the tile can clip the cream
  // helmet rim, and fitting the visor to helmet pixels blows the level.
  const lum = (i) => 0.299 * orig[i * 4] + 0.587 * orig[i * 4 + 1] + 0.114 * orig[i * 4 + 2];
  const cand = [];
  for (let i = 0; i < N; i++) if (!mask[i] && outer[i] && orig[i * 4 + 3] > 200) cand.push(i);
  if (!cand.length) throw new Error("erase rect has no clean visor around the sigil");
  let lo = Infinity;
  let hi = -Infinity;
  for (const i of cand) {
    const l = lum(i);
    if (l < lo) lo = l;
    if (l > hi) hi = l;
  }
  const cut = lo + 0.55 * (hi - lo);

  const terms = (x, y) => [1, x, y, x * x, x * y, y * y];
  const K = 6;
  const A = Array.from({ length: K }, () => new Array(K).fill(0));
  const B = [new Array(K).fill(0), new Array(K).fill(0), new Array(K).fill(0)];
  let samples = 0;
  for (const i of cand) {
    if (lum(i) > cut) continue;
    const x = (i % tw) / tw - 0.5;
    const y = ((i / tw) | 0) / th - 0.5;
    const t = terms(x, y);
    for (let a = 0; a < K; a++) {
      for (let b = 0; b < K; b++) A[a][b] += t[a] * t[b];
      for (let c = 0; c < 3; c++) B[c][a] += t[a] * orig[i * 4 + c];
    }
    samples++;
  }
  const coef = B.map((b) => solve(A.map((r) => [...r]), b));
  if (coef.some((c) => !c)) throw new Error("visor fit is singular");

  // Distance from the mask edge, so the repaint feathers into the gradient
  // and leaves no seam.
  const dist = new Float32Array(N).fill(Infinity);
  let front = [];
  for (let i = 0; i < N; i++) if (!mask[i]) { dist[i] = 0; front.push(i); }
  for (let d = 1; d <= feather && front.length; d++) {
    const next = [];
    for (const i of front) {
      const x = i % tw;
      const y = (i / tw) | 0;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= tw || ny >= th) continue;
        const nk = ny * tw + nx;
        if (dist[nk] === Infinity) { dist[nk] = d; next.push(nk); }
      }
    }
    front = next;
  }

  const out = Buffer.from(orig);
  for (let i = 0; i < N; i++) {
    if (!mask[i]) continue;
    const x = (i % tw) / tw - 0.5;
    const y = ((i / tw) | 0) / th - 0.5;
    const t = terms(x, y);
    const w = Math.min(1, (dist[i] === Infinity ? feather : dist[i]) / feather);
    for (let c = 0; c < 3; c++) {
      let v = 0;
      for (let k = 0; k < K; k++) v += coef[c][k] * t[k];
      v = Math.max(0, Math.min(255, v));
      out[i * 4 + c] = Math.round(orig[i * 4 + c] * (1 - w) + v * w);
    }
  }

  const patch = await sharp(out, { raw: { width: tw, height: th, channels: 4 } }).png().toBuffer();
  const merged = await sharp(buf).composite([{ input: patch, left: R.left, top: R.top }]).png().toBuffer();
  return { buf: merged, samples };
}

// ── run ────────────────────────────────────────────────

if (!fs.existsSync(SRC)) {
  console.error(`No source folder at ${path.relative(ROOT, SRC)}`);
  process.exit(1);
}
fs.mkdirSync(OUT, { recursive: true });

const sources = fs.readdirSync(SRC).filter((f) => /\.png$/i.test(f));
if (!sources.length) {
  console.error(`No .png files in ${path.relative(ROOT, SRC)}`);
  process.exit(1);
}

let before = 0;
let after = 0;

for (const file of sources) {
  const parts = file.replace(/\.png$/i, "").split("_");
  if (parts.length !== 3 || parts[0] !== "vue") {
    console.warn(`skipped ${file} — expected vue_<pose>_<colorway>.png`);
    continue;
  }
  const [, pose, colorway] = parts;
  const name = `vue-${pose}-${colorway}`;
  const rect = ERASE[pose];
  if (!rect) {
    console.warn(`skipped ${file} — no ERASE rect for pose "${pose}"`);
    continue;
  }

  // Trim first, THEN resize by height: trimming normalises away the differing
  // amounts of transparent padding, which is what keeps the two colorways of a
  // pose registered with each other (they cross-fade on theme swap).
  const trimmed = await sharp(path.join(SRC, file))
    .trim({ threshold: 1 })
    .resize({ height: FIGURE_HEIGHT, fit: "inside", kernel: "lanczos3" })
    .toBuffer();

  const { buf: blanked, samples } = await eraseSigil(trimmed, rect);
  const { width, height } = await sharp(blanked).metadata();
  const webp = await sharp(blanked).webp(WEBP).toBuffer();
  fs.writeFileSync(path.join(OUT, `${name}.webp`), webp);

  const srcBytes = fs.statSync(path.join(SRC, file)).size;
  before += srcBytes;
  after += webp.length;

  const kb = (n) => `${Math.round(n / 1024)}KB`;
  console.log(
    `${name.padEnd(24)} ${`${width}x${height}`.padEnd(11)} ${kb(srcBytes).padStart(8)} -> ${kb(
      webp.length
    ).padStart(6)}   visor fit on ${samples} px`
  );
}

const mb = (n) => `${(n / 1024 / 1024).toFixed(2)}MB`;
console.log(
  `\n${sources.length} poses  ${mb(before)} -> ${mb(after)}  (${Math.round((1 - after / before) * 100)}% smaller)`
);
