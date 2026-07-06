// ═══════════════════════════════════════════════════════
// CTRL-A — FACE LIGHTING ENGINE
// A tiny software renderer that lights a sculpted head the way a
// real face lights: per-pixel. We build a height field for the
// head (sphere + nose ridge + brow + eye sockets + cheeks + chin),
// derive a surface normal at every pixel, then shade it with each
// light using Lambert + a cheap soft specular. The KEY light also
// casts a real height-field shadow, so the nose throws a genuine
// triangle on the cheek — that is what makes Rembrandt, loop,
// butterfly and split patterns actually appear instead of being
// named over a featureless ball.
//
// Negative fill is modelled honestly: a black flag does not emit,
// it removes the ambient bounce from the surfaces that face it. Put
// one on the shadow side and that side deepens, exactly like set.
//
// Pure Canvas-2D ImageData. No WebGL, no deps. Renders into a small
// offscreen buffer (a couple hundred px) and is meant to be cached
// and only recomputed when the setup changes, then blitted onto the
// animated stage each frame.
// ═══════════════════════════════════════════════════════

export type RGB = [number, number, number];

export type EngineLight = {
  x: number; // 0..1 across the stage
  y: number; // 0..1 down the stage
  intensity: number; // 0..1
  temp: number; // -1 warm .. 1 cool
};

export type EngineFlag = {
  x: number; // 0..1
  y: number; // 0..1
  strength: number; // 0..1 — how much ambient it drinks
};

export type FaceInput = {
  key: EngineLight;
  fill: EngineLight;
  back: EngineLight;
  flags?: EngineFlag[];
  ambient?: number; // room bounce, 0..1 (default 0.16)
  keyShadows?: boolean; // let the key cast a real shadow (default true)
};

// ── Colour temperature → RGB tint (matches the bench palette) ──
const NEUTRAL_RGB: RGB = [255, 246, 235];
const WARM_RGB: RGB = [255, 194, 138];
const COOL_RGB: RGB = [198, 219, 255];
function lerpRgb(a: RGB, b: RGB, t: number): RGB {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}
export function tempColor(temp: number): RGB {
  const t = Math.max(-1, Math.min(1, temp));
  return t < 0 ? lerpRgb(NEUTRAL_RGB, WARM_RGB, Math.min(1, -t)) : lerpRgb(NEUTRAL_RGB, COOL_RGB, Math.min(1, t));
}

// The bust is pale plaster, so its albedo is a warm off-white.
const ALBEDO: RGB = [232, 222, 212];

type Layout = {
  cx: number; cy: number; hrx: number; hry: number;
  baseY: number; neckHalf: number; shHalf: number; shTop: number;
  headDepth: number; bodyDepth: number;
};

// Head sits high in a 4:5 portrait frame with shoulders filling the base.
function layout(bw: number, bh: number): Layout {
  const cx = bw * 0.5;
  const hr = Math.min(bw, bh) * 0.205;
  const cy = bh * 0.335;
  const hrx = hr;
  const hry = hr * 1.16;
  return {
    cx, cy, hrx, hry,
    baseY: bh * 0.985,
    neckHalf: hr * 0.4,
    shHalf: bw * 0.46,
    shTop: cy + hry * 0.95,
    headDepth: hr * 0.95,
    bodyDepth: hr * 0.7,
  };
}

// A soft bump/dent kernel in face-normalised space.
function gauss(dx: number, dy: number, sx: number, sy: number): number {
  return Math.exp(-((dx * dx) / (sx * sx) + (dy * dy) / (sy * sy)));
}

// Height field + coverage at one pixel. nx/ny are face-space (−1..1),
// positive ny points down. Returns raw height (in buffer px) and an
// alpha 0..1 for a soft silhouette edge.
function surface(px: number, py: number, L: Layout): { h: number; a: number } {
  const { cx, cy, hrx, hry, headDepth, bodyDepth, shHalf, shTop, baseY, neckHalf } = L;
  const nx = (px - cx) / hrx;
  const ny = (py - cy) / hry;
  const rr = nx * nx + ny * ny;

  let h = -1e9;
  let a = 0;

  // ── Head sphere + sculpted features ──
  if (rr < 1.15) {
    const zs = Math.sqrt(Math.max(0, 1 - Math.min(rr, 1)));
    let hh = zs * headDepth;

    // brow ridge — a soft horizontal shelf above the eyes
    hh += 0.12 * headDepth * gauss(nx, ny + 0.16, 0.5, 0.1);
    // eye sockets — two dents that let the brow catch and the eyes fall dark
    hh -= 0.14 * headDepth * gauss(nx - 0.3, ny + 0.0, 0.17, 0.12);
    hh -= 0.14 * headDepth * gauss(nx + 0.3, ny + 0.0, 0.17, 0.12);
    // nose bridge + ridge down the centre line
    const noseWin = Math.max(0, Math.min(1, (ny + 0.18) / 0.12)) * Math.max(0, Math.min(1, (0.42 - ny) / 0.16));
    hh += 0.2 * headDepth * Math.exp(-(nx * nx) / (0.085 * 0.085)) * noseWin;
    // nose tip
    hh += 0.1 * headDepth * gauss(nx, ny - 0.34, 0.11, 0.09);
    // cheeks
    hh += 0.06 * headDepth * gauss(nx - 0.44, ny - 0.22, 0.24, 0.22);
    hh += 0.06 * headDepth * gauss(nx + 0.44, ny - 0.22, 0.24, 0.22);
    // upper lip / mouth mound
    hh += 0.05 * headDepth * gauss(nx, ny - 0.54, 0.24, 0.09);
    hh -= 0.03 * headDepth * gauss(nx, ny - 0.47, 0.3, 0.03);
    // chin
    hh += 0.06 * headDepth * gauss(nx, ny - 0.8, 0.26, 0.14);

    h = Math.max(h, hh);
    // soft edge across the ellipse boundary
    a = Math.max(a, Math.max(0, Math.min(1, (1 - rr) / 0.08)));
  }

  // ── Neck + shoulders (a smooth mound, no features) ──
  // Silhouette: a rounded trapezoid from the neck down to the shoulders.
  const shBottom = baseY;
  if (py > cy) {
    // half-width of the body at this y: neck near the head, widening to shoulders
    const tShoulder = Math.max(0, Math.min(1, (py - (shTop - hry * 0.2)) / (shTop + hry * 0.35 - (shTop - hry * 0.2))));
    const halfW = neckHalf + (shHalf - neckHalf) * (tShoulder * tShoulder * (3 - 2 * tShoulder));
    const dxc = (px - cx) / halfW;
    if (py < shBottom && Math.abs(dxc) < 1.02) {
      const bulge = Math.sqrt(Math.max(0, 1 - dxc * dxc));
      // fade the body's front depth near the very bottom so it grounds on the table
      const groundFade = Math.max(0, Math.min(1, (shBottom - py) / (hry * 0.5)));
      const hb = bulge * bodyDepth * (0.5 + 0.5 * groundFade) - headDepth * 0.15;
      h = Math.max(h, hb);
      a = Math.max(a, Math.min(1, (1.02 - Math.abs(dxc)) / 0.06) * Math.min(1, (shBottom - py) / 3));
    }
  }

  return { h: h <= -1e8 ? 0 : h, a };
}

// Render one lit face into `img` (an ImageData of size bw×bh).
export function renderFace(img: ImageData, bw: number, bh: number, input: FaceInput): void {
  const L = layout(bw, bh);
  const ambient = input.ambient ?? 0.16;
  const keyShadows = input.keyShadows ?? true;
  const flags = input.flags ?? [];

  // Pass 1 — bake the height field + coverage.
  const H = new Float32Array(bw * bh);
  const A = new Float32Array(bw * bh);
  for (let y = 0; y < bh; y++) {
    for (let x = 0; x < bw; x++) {
      const s = surface(x + 0.5, y + 0.5, L);
      const i = y * bw + x;
      H[i] = s.h;
      A[i] = s.a;
    }
  }

  // Light rigs in buffer space. Front lights sit toward the camera (+z),
  // the back light sits behind the head (−z) so it rims the edges. The key
  // sits low in z so it rakes across the face and carves a real terminator
  // instead of washing it flat and frontal.
  const zFront = bw * 0.34;
  const zBack = -bw * 0.45;
  const lights = [
    { l: input.key, z: zFront, col: tempColor(input.key.temp), spec: 0.3, shadow: keyShadows, w: 1.1 },
    { l: input.fill, z: zFront * 2.4, col: tempColor(input.fill.temp), spec: 0.0, shadow: false, w: 0.7 },
    { l: input.back, z: zBack, col: tempColor(input.back.temp), spec: 0.2, shadow: false, w: 1.0, rim: true },
  ];

  // Precompute light positions in buffer px.
  const LP = lights.map((rig) => ({
    ...rig,
    px: rig.l.x * bw,
    py: rig.l.y * bh,
  }));
  const flagP = flags.map((f) => ({ px: f.x * bw, py: f.y * bh, strength: f.strength }));

  const data = img.data;
  const bump = 2.1; // normal steepness from the height gradient

  // Keep midtones linear so the lit side actually reads bright, and only
  // roll off the extreme highlights — the exp curve alone crushed everything
  // to a flat grey.
  const tone = (v: number) => (v <= 236 ? v : 236 + 19 * (1 - Math.exp(-(v - 236) / 40)));

  for (let y = 0; y < bh; y++) {
    for (let x = 0; x < bw; x++) {
      const i = y * bw + x;
      const a = A[i];
      const o = i * 4;
      if (a <= 0.001) { data[o + 3] = 0; continue; }

      const h = H[i];
      // central-difference normal from the height field
      const hl = x > 0 ? H[i - 1] : h;
      const hr = x < bw - 1 ? H[i + 1] : h;
      const hu = y > 0 ? H[i - bw] : h;
      const hd = y < bh - 1 ? H[i + bw] : h;
      let nX = (hl - hr) * bump;
      let nY = (hu - hd) * bump;
      let nZ = 1;
      const nlen = Math.hypot(nX, nY, nZ) || 1;
      nX /= nlen; nY /= nlen; nZ /= nlen;

      // ── Ambient, reduced by any negative-fill flags this pixel faces ──
      let amb = ambient;
      for (let f = 0; f < flagP.length; f++) {
        const fx = flagP[f].px - x;
        const fy = flagP[f].py - y;
        const flen = Math.hypot(fx, fy) || 1;
        // horizontal-facing dot: how much this surface turns toward the flag
        const face = Math.max(0, (nX * fx + nY * fy) / flen);
        amb *= 1 - flagP[f].strength * 0.92 * face;
      }

      let r = ALBEDO[0] * amb;
      let g = ALBEDO[1] * amb;
      let b = ALBEDO[2] * amb;

      for (let k = 0; k < LP.length; k++) {
        const rig = LP[k];
        const e = rig.l.intensity * rig.w;
        if (e < 0.004) continue;

        const lx = rig.px - x;
        const ly = rig.py - y;
        const lz = rig.z - h;
        const llen = Math.hypot(lx, ly, lz) || 1;
        const Lx = lx / llen, Ly = ly / llen, Lz = lz / llen;

        let diff = nX * Lx + nY * Ly + nZ * Lz;

        if (rig.rim) {
          // back light: reward edges turning away from camera, not flat front
          const edge = Math.max(0, Math.pow(1 - nZ, 1.5));
          diff = Math.max(0, diff) * 0.25 + edge * 1.15;
        } else {
          diff = Math.max(0, diff);
        }

        // ── Real soft shadow from the key, marched across the height field ──
        if (rig.shadow && diff > 0) {
          const dxy = Math.hypot(lx, ly) || 1;
          const slope = lz / dxy; // light-ray rise per px of horizontal travel
          const dirx = lx / dxy, diry = ly / dxy;
          const step = Math.max(1.1, L.hrx * 0.07);
          let occ = 0;
          for (let s = 1; s <= 16; s++) {
            const sx = Math.round(x + dirx * step * s);
            const sy = Math.round(y + diry * step * s);
            if (sx < 0 || sy < 0 || sx >= bw || sy >= bh) break;
            const sh = H[sy * bw + sx];
            const rayH = h + slope * (step * s);
            const over = sh - rayH;
            if (over > 0) occ = Math.max(occ, Math.min(1, over / (L.headDepth * 0.28)));
          }
          diff *= 1 - occ * 0.92;
        }

        const contrib = e * diff;
        r += rig.col[0] * ALBEDO[0] * contrib / 255;
        g += rig.col[1] * ALBEDO[1] * contrib / 255;
        b += rig.col[2] * ALBEDO[2] * contrib / 255;

        // cheap specular sheen (plaster has a soft one)
        if (rig.spec > 0 && diff > 0) {
          const hx = Lx, hy = Ly, hz = Lz + 1;
          const hlen = Math.hypot(hx, hy, hz) || 1;
          const sdot = Math.max(0, (nX * hx + nY * hy + nZ * hz) / hlen);
          const s = Math.pow(sdot, 22) * rig.spec * e;
          r += rig.col[0] * s;
          g += rig.col[1] * s;
          b += rig.col[2] * s;
        }
      }

      // linear midtones, soft-shoulder highlights
      data[o] = tone(r);
      data[o + 1] = tone(g);
      data[o + 2] = tone(b);
      data[o + 3] = 255 * Math.min(1, a);
    }
  }
}

// Describe the lit-vs-shadow ratio for the neg-fill meter: sample a lit
// cheek and a shadow cheek and return the stop ratio between them.
export function measureRatio(img: ImageData, bw: number, bh: number): number {
  const L = layout(bw, bh);
  const lum = (px: number, py: number) => {
    const x = Math.round(px), y = Math.round(py);
    const o = (y * bw + x) * 4;
    return (img.data[o] * 0.299 + img.data[o + 1] * 0.587 + img.data[o + 2] * 0.114) || 1;
  };
  const left = lum(L.cx - L.hrx * 0.5, L.cy + L.hry * 0.1);
  const right = lum(L.cx + L.hrx * 0.5, L.cy + L.hry * 0.1);
  const hi = Math.max(left, right);
  const lo = Math.max(1, Math.min(left, right));
  return hi / lo;
}
