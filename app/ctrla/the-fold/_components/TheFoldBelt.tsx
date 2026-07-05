"use client";

// ═══════════════════════════════════════════════════════
// VANTAGE (route: the-fold) — a scroll voyage between worlds
// A full-bleed canvas is a slow journey through space. Five workspaces
// are five distinct WORLDS (lit orbs, styled after the CTRL-A mix
// globe), each a chakra flown as a spaceflight state: Launchpad (Root),
// The Drift (Sacral), Full Burn (Solar Plexus), Slow Orbit (Heart),
// Deep Field (Third Eye). Energy rises then settles as you travel.
// Scrolling advances the camera down the track; it eases and LANDS
// centered on each world in turn, and landing sets it active. The old
// asteroid belt lives on as dim parallax dust behind the worlds.
// NOTE: brainwave frequencies per world are a planned follow-up;
// this pass covers the planets, names, and copy only.
//
// PERFORMANCE: the whole engine lives outside React (refs/module
// scope). The RAF loop never calls setState except through a single
// onRoom callback that only fires when the landed room changes. Rock
// silhouettes and planet wireframes are precomputed once. Pauses on
// document.hidden, caps DPR at 2, honors reduced-motion.
// ═══════════════════════════════════════════════════════

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ed } from "../../_components/editorial";
import { currentVolume } from "../../_volumes";
import FoldSession from "./FoldSession";
import { useFoldAudio } from "../_audio/useFoldAudio";
import type { LayerId, LayerLevels } from "../_state/types";

// The Fold is the place (URL, wordmark, CSS all keep the equity). "Vantage"
// is this issue's volume THEME, shown as a secondary masthead label. The
// volume number is pulled live from the current CTRL-A volume, never hardcoded.
const VOLUME_LABEL = currentVolume.issueMeta.volume; // e.g. "Vol. 01"
const VOLUME_THEME = "Vantage";

// Golden Hour is a sixth, earned world: it opens only after this many
// finished focus sessions (persisted in localStorage as fold.sessions).
const GOLDEN_ID = "golden";
const GOLDEN_UNLOCK = 3;

type Planet = {
  light: string; // lit cap (upper-left)
  mid: string; // body
  dark: string; // shaded underside / terminator
  halo: string; // "r,g,b" for the atmosphere glow
  ring?: boolean; // a thin planetary ring
  sun?: boolean; // a warm corona (Golden Hour only) — its differentiating touch
  warm: number; // 0 cool .. 1 gold, drives the background wash
};
type Room = { id: string; name: string; floor: string; state: string; line: string; sound: string; planet: Planet };

// Five worlds, a spaceflight arc through the chakra colors. `floor` is the
// quiet chakra signature; `name` is the world you fly to. `warm` peaks at
// Full Burn and cools toward Deep Field. Colors/frequency stay locked.
const ROOMS: Room[] = [
  { id: "root", name: "Launchpad", floor: "Root", state: "start",
    line: "Pre-flight. You don't need to feel ready, only to start the count. Hands on the desk. Go.",
    sound: "hum",
    planet: { light: "#c8564a", mid: "#7e2a22", dark: "#280b08", halo: "210,84,66", warm: 0.55 } },
  { id: "sacral", name: "The Drift", floor: "Sacral", state: "go wide",
    line: "Weightless. No up, no wrong turn. Let the strange idea pull you and follow it out.",
    sound: "music",
    planet: { light: "#e0894a", mid: "#9a4e1e", dark: "#301608", halo: "233,150,80", ring: true, warm: 0.8 } },
  { id: "solar", name: "Full Burn", floor: "Solar Plexus", state: "ship it",
    line: "Full thrust. Energy up, a target locked. Point at the one thing and burn it down.",
    sound: "music",
    planet: { light: "#e6c24a", mid: "#9a7a1e", dark: "#2e2405", halo: "233,200,90", ring: true, warm: 1.0 } },
  { id: "heart", name: "Slow Orbit", floor: "Heart", state: "wind down",
    line: "Coasting now. The hard push is behind you. Let it circle, tidy the loose ends, no rush.",
    sound: "rain",
    planet: { light: "#5fae86", mid: "#2f6a4c", dark: "#0c2018", halo: "120,200,150", warm: 0.4 } },
  { id: "deep", name: "Deep Field", floor: "Third Eye", state: "heads down",
    line: "Doors sealed, the world muted. One hard thing, seen whole. Go all the way in.",
    sound: "hum",
    planet: { light: "#7a6ad0", mid: "#3a2f7a", dark: "#120a2a", halo: "130,110,210", warm: 0.22 } },
  // Golden Hour — the earned sixth world. Warmest light of the set, a sun
  // corona all its own. Locked (unreachable, shown ahead as a promise) until
  // three focus sessions are finished. See GOLDEN_UNLOCK.
  { id: GOLDEN_ID, name: "Golden Hour", floor: "Crown", state: "earned",
    line: "The back patio. Rare and electric. The light you get to after the work.",
    sound: "music",
    planet: { light: "#ffdf9a", mid: "#d98a2b", dark: "#3a1e05", halo: "255,201,110", ring: true, sun: true, warm: 1.0 } },
];

// ── Canvas palette for the asteroid dust behind the planets ──
const mix = (a: number[], b: number[], t: number) =>
  `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)},${Math.round(a[1] + (b[1] - a[1]) * t)},${Math.round(a[2] + (b[2] - a[2]) * t)})`;
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

const PALETTE = {
  rockFar: "#241436",
  rockMid: "#5B4880",
  rockNear: "#BC7E6A",
  accent: ed.gold,
  bgTop: ed.void,
  bgMid: (w: number) => mix([26, 16, 40], [90, 46, 58], clamp01(w)),
  bgBot: (w: number) => mix([42, 22, 53], [138, 90, 42], clamp01(w)),
};

// Asteroid backdrop config (kept from the belt, now dimmer parallax dust).
// Count trimmed: it sits behind the planets as soft parallax, so a lighter
// field is indistinguishable while cutting per-frame draw + sort cost.
const DUST = {
  count: 90, farZ: 1000, nearZ: 90, fov: 340, spreadX: 1500, spreadY: 0.34,
  accentChance: 0.045, drift: 0.28, parallax: 0.22,
} as const;

// Voyage config: how the camera rides the zigzag and lands on planets.
const VOY = {
  focal: 1.0, // perspective focal in "planet spacing" units
  spacing: 1.9, // depth between planets — higher = further apart down the track
  ampX: 0.6, // zigzag horizontal swing (world units)
  ampY: 0.15, // gentle vertical sway
  xScale: 0.72, // world-x → screen fraction of width
  yScale: 0.55, // world-y → screen fraction of height
  baseR: 0.27, // centered planet radius as a fraction of min(w,h)
  ease: 0.085, // camera easing toward the target stop
  spin: 0.0016, // planet wireframe spin per frame
  wheelRate: 0.0022, // wheel delta → progress
  touchRate: 0.006, // touch delta → progress
  maxScale: 1.55, // clamp for a planet flying past the camera
} as const;

const SOUNDS = ["mute", "murmur", "music", "rain", "hum"] as const;

// Per-world ambient beds. Each world's dominant layer echoes its `sound`
// field; the others sit low as gentle support. Landing on a world
// crossfades toward its bed (the visitor can still override with the pads).
// Levels stay gentle so nothing ever blasts.
const ROOM_AUDIO: Record<string, LayerLevels> = {
  root: { murmur: 0, music: 0, rain: 0, hum: 0.5 },
  sacral: { murmur: 0.18, music: 0.42, rain: 0, hum: 0.12 },
  solar: { murmur: 0.1, music: 0.5, rain: 0, hum: 0.16 },
  heart: { murmur: 0, music: 0.22, rain: 0.48, hum: 0.1 },
  deep: { murmur: 0, music: 0, rain: 0.14, hum: 0.46 },
  // Golden Hour: the warmest, fullest bed — a distinct wash of music over a
  // soft murmur, so unlocking it is audibly its own place, not a re-skin.
  golden: { murmur: 0.24, music: 0.62, rain: 0, hum: 0.2 },
};

type Rock = { x: number; y: number; z: number; size: number; spin: number; spinRate: number; verts: Float32Array; accent: boolean };
const TAU = 6.2831853;
const rnd = (a: number, b: number) => a + Math.random() * (b - a);

// ── Day math for the visit streak (client-only; never called at module load) ──
// dayKey is the visitor's local calendar day; dayDiff counts whole days between
// two keys (both parse to the same UTC midnight, so the difference is integral).
const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const dayDiff = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / 86_400_000);

// Record today's visit and return the running consecutive-day streak.
// +1 when yesterday was the last visit, hold on a same-day revisit, reset to 1
// on any gap. All reads/writes are guarded; a storage failure just yields 0.
function bumpStreak(): number {
  try {
    const today = dayKey(new Date());
    const last = localStorage.getItem("fold.lastDay");
    let s = Number(localStorage.getItem("fold.streak")) || 0;
    if (last === today) {
      s = Math.max(1, s);
    } else {
      s = last && dayDiff(last, today) === 1 ? s + 1 : 1;
      localStorage.setItem("fold.lastDay", today);
    }
    localStorage.setItem("fold.streak", String(s));
    return s;
  } catch {
    return 0;
  }
}

// The zigzag: planets alternate sides going into depth.
const sideX = (i: number) => (i % 2 === 0 ? -1 : 1) * VOY.ampX;
const sideY = (i: number) => (i % 2 === 0 ? 1 : -1) * VOY.ampY;

function makeVerts(): Float32Array {
  const n = Math.floor(rnd(6, 12)),
    p = new Float32Array(n * 2);
  for (let i = 0; i < n; i++) {
    const ang = (i / n) * TAU,
      rr = 0.58 + Math.random() * 0.42;
    p[i * 2] = Math.cos(ang) * rr;
    p[i * 2 + 1] = Math.sin(ang) * rr;
  }
  return p;
}

// ── Planet wireframe (unit sphere lat/lon), generated once ──
const LATS: number[][][] = [];
const LONS: number[][][] = [];
for (let lat = -60; lat <= 60; lat += 30) {
  const r = Math.cos((lat * Math.PI) / 180);
  const yv = Math.sin((lat * Math.PI) / 180);
  const ring: number[][] = [];
  for (let a = 0; a <= 360; a += 12) {
    const t = (a * Math.PI) / 180;
    ring.push([r * Math.cos(t), yv, r * Math.sin(t)]);
  }
  LATS.push(ring);
}
for (let lon = 0; lon < 180; lon += 30) {
  const t = (lon * Math.PI) / 180;
  const arc: number[][] = [];
  for (let a = -90; a <= 90; a += 12) {
    const p = (a * Math.PI) / 180;
    arc.push([Math.cos(p) * Math.sin(t), Math.sin(p), Math.cos(p) * Math.cos(t)]);
  }
  LONS.push(arc);
}
// Rotate a unit point by yaw (around Y) then a fixed pitch (around X).
function rot(px: number, py: number, pz: number, y: number, p: number) {
  const cy = Math.cos(y), sy = Math.sin(y);
  const x = px * cy + pz * sy;
  const z = -px * sy + pz * cy;
  const cx = Math.cos(p), sx = Math.sin(p);
  return { x, y: py * cx - z * sx, z: py * sx + z * cx };
}

// ── Offscreen planet sprite ──
// Every planet layer except the spinning wireframe is static, so we bake
// halo + body + dome + rim + ring ONCE into an offscreen canvas per
// workspace and blit it each frame. This removes ~3 gradient allocations
// per planet per frame from the hot loop. Rendered at a reference radius;
// the draw loop scales the blit to the planet's on-screen size.
const SPRITE_R = 220; // reference planet radius, in sprite pixels
const SPRITE_MARG = 1.6; // sprite half-extent as a multiple of R (fits halo + ring)

type Sprite = { canvas: HTMLCanvasElement; half: number };

function buildPlanetSprite(pal: Planet): Sprite {
  const half = Math.round(SPRITE_R * SPRITE_MARG);
  const c = document.createElement("canvas");
  c.width = half * 2;
  c.height = half * 2;
  const g2 = c.getContext("2d")!;
  const px = half, py = half, R = SPRITE_R;

  // Golden Hour only: a warm sun corona behind the body, its differentiating
  // touch. Soft light, not rays or particles — the restraint brief holds.
  if (pal.sun) {
    const corona = g2.createRadialGradient(px, py, R * 0.9, px, py, R * SPRITE_MARG);
    corona.addColorStop(0, `rgba(${pal.halo},0.42)`);
    corona.addColorStop(0.5, `rgba(${pal.halo},0.16)`);
    corona.addColorStop(1, `rgba(${pal.halo},0)`);
    g2.fillStyle = corona;
    g2.beginPath();
    g2.arc(px, py, R * SPRITE_MARG, 0, TAU);
    g2.fill();
  }

  // Atmosphere halo just outside the rim.
  const halo = g2.createRadialGradient(px, py, R * 0.92, px, py, R * 1.35);
  halo.addColorStop(0, `rgba(${pal.halo},0)`);
  halo.addColorStop(0.55, `rgba(${pal.halo},0.14)`);
  halo.addColorStop(1, `rgba(${pal.halo},0)`);
  g2.fillStyle = halo;
  g2.beginPath();
  g2.arc(px, py, R * 1.35, 0, TAU);
  g2.fill();

  // Ring behind the body (back half).
  if (pal.ring) {
    g2.save();
    g2.translate(px, py);
    g2.rotate(-0.42);
    g2.scale(1, 0.32);
    g2.beginPath();
    g2.arc(0, 0, R * 1.5, Math.PI, TAU);
    g2.strokeStyle = `rgba(${pal.halo},0.5)`;
    g2.lineWidth = R * 0.1;
    g2.stroke();
    g2.restore();
  }

  // Lit sphere body — light from upper-left into shadow lower-right.
  const g = g2.createRadialGradient(px - R * 0.34, py - R * 0.4, R * 0.06, px - R * 0.05, py - R * 0.05, R * 1.28);
  g.addColorStop(0, pal.light);
  g.addColorStop(0.5, pal.mid);
  g.addColorStop(1, pal.dark);
  g2.fillStyle = g;
  g2.beginPath();
  g2.arc(px, py, R, 0, TAU);
  g2.fill();

  // Glassy dome highlight, clipped to the shell.
  g2.save();
  g2.beginPath();
  g2.arc(px, py, R, 0, TAU);
  g2.clip();
  const dome = g2.createRadialGradient(px - R * 0.5, py - R * 0.58, R * 0.04, px - R * 0.15, py - R * 0.25, R * 1.15);
  dome.addColorStop(0, "rgba(255,255,255,0.2)");
  dome.addColorStop(0.4, "rgba(255,255,255,0.03)");
  dome.addColorStop(1, "rgba(255,255,255,0)");
  g2.fillStyle = dome;
  g2.fillRect(px - R, py - R, R * 2, R * 2);
  g2.restore();

  // Rim hairline.
  g2.beginPath();
  g2.arc(px, py, R, 0, TAU);
  g2.strokeStyle = "rgba(240,230,224,0.22)";
  g2.lineWidth = 1.4;
  g2.stroke();

  // Ring front half over the body.
  if (pal.ring) {
    g2.save();
    g2.translate(px, py);
    g2.rotate(-0.42);
    g2.scale(1, 0.32);
    g2.beginPath();
    g2.arc(0, 0, R * 1.5, 0, Math.PI);
    g2.strokeStyle = `rgba(${pal.halo},0.62)`;
    g2.lineWidth = R * 0.1;
    g2.stroke();
    g2.restore();
  }

  return { canvas: c, half };
}

function createVoyageEngine(canvas: HTMLCanvasElement, onRoom: (i: number) => void) {
  const ctx = canvas.getContext("2d")!;
  let w = 0, h = 0, raf = 0, running = true, reduced = false;

  // Camera position along the track (float planet-index). progress eases to target.
  let progress = 0, target = 0;
  let landed = -1;
  let warm = ROOMS[0].planet.warm; // eased background wash
  let warmTarget = ROOMS[0].planet.warm; // target wash for the landed room
  const spins = ROOMS.map((_, i) => i * 1.3); // per-planet wireframe phase

  // The furthest world the camera may reach. Golden Hour (last index) stays
  // unreachable while locked, yet still renders ahead as a visible promise.
  let maxIndex = ROOMS.length - 1;

  // Landing swell: on arrival a world breathes out once, ~700ms, eased.
  let landIdx = -1, landAt = 0;
  const LAND_MS = 720, LAND_AMP = 0.07;

  // Interaction: hover + drag to turn the planets, click to travel.
  let hoverIndex = -1;
  let yawOffset = 0; // manual rotation added to every planet's spin
  let dragging = false;
  const projected: { i: number; x: number; y: number; R: number }[] = [];

  // Asteroid dust.
  const rocks: Rock[] = [];
  function fillRock(r: Rock, atZ: number | null) {
    r.x = (rnd(-1, 1) * DUST.spreadX) / 2;
    r.y = rnd(-1, 1) * DUST.spreadX * DUST.spreadY;
    r.z = atZ ?? DUST.nearZ + Math.random() * (DUST.farZ - DUST.nearZ);
    r.size = rnd(4, 18);
    r.spin = rnd(0, TAU);
    r.spinRate = rnd(-1, 1) * 0.012;
    r.verts = makeVerts();
    r.accent = Math.random() < DUST.accentChance;
  }
  for (let i = 0; i < DUST.count; i++) {
    const r: Rock = { x: 0, y: 0, z: 0, size: 0, spin: 0, spinRate: 0, verts: makeVerts(), accent: false };
    fillRock(r, null);
    rocks.push(r);
  }

  // Static planet layers, baked once per workspace (see buildPlanetSprite).
  const sprites = ROOMS.map((r) => buildPlanetSprite(r.planet));

  // Cached background gradient: rebuilt only when the eased warmth crosses a
  // quantized step or the canvas height changes, not every frame.
  let bgGrad: CanvasGradient | null = null, bgWarmQ = -1, bgH = -1;
  function bg() {
    const q = Math.round(warm * 100);
    if (bgGrad && q === bgWarmQ && h === bgH) return bgGrad;
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, PALETTE.bgTop);
    g.addColorStop(0.55, PALETTE.bgMid(warm));
    g.addColorStop(1, PALETTE.bgBot(warm));
    bgGrad = g; bgWarmQ = q; bgH = h;
    return g;
  }

  // Reused per-frame buffer for visible planets (avoids a fresh array/frame).
  type Vis = { i: number; x: number; y: number; R: number; a: number; z: number };
  const items: Vis[] = [];
  let tick = 0;

  // Camera x/y interpolated along the zigzag at a fractional progress.
  function camAt(prog: number, axis: (i: number) => number) {
    const i0 = Math.floor(prog);
    const i1 = Math.min(ROOMS.length - 1, i0 + 1);
    const f = prog - i0;
    const a = axis(Math.max(0, Math.min(ROOMS.length - 1, i0)));
    const b = axis(i1);
    return a + (b - a) * f;
  }

  function drawDust(camX: number) {
    ctx.save();
    for (let i = 0; i < rocks.length; i++) {
      const a = rocks[i];
      a.z -= DUST.drift;
      a.spin += a.spinRate;
      if (a.z <= DUST.nearZ) fillRock(a, DUST.farZ);
    }
    // Depth order changes slowly; re-sort every other frame is imperceptible.
    if ((tick & 1) === 0) rocks.sort((p, q) => q.z - p.z);
    const par = camX * DUST.parallax * w;
    for (let i = 0; i < rocks.length; i++) {
      const a = rocks[i];
      const k = DUST.fov / a.z;
      const sx = w * 0.5 + a.x * k - par;
      const sy = h * 0.46 + a.y * k;
      const r = a.size * k;
      if (r < 0.4 || sx < -60 || sx > w + 60 || sy < -60 || sy > h + 60) continue;
      const depth = 1 - a.z / DUST.farZ;
      ctx.globalAlpha = Math.min(1, depth * 1.7) * 0.6; // dimmer than the planets
      let fillC = PALETTE.rockFar;
      if (depth > 0.66) fillC = PALETTE.rockNear;
      else if (depth > 0.33) fillC = PALETTE.rockMid;
      const co = Math.cos(a.spin) * r, si = Math.sin(a.spin) * r, p = a.verts, n = p.length;
      ctx.beginPath();
      ctx.moveTo(sx + p[0] * co - p[1] * si, sy + p[0] * si + p[1] * co);
      for (let j = 2; j < n; j += 2) ctx.lineTo(sx + p[j] * co - p[j + 1] * si, sy + p[j] * si + p[j + 1] * co);
      ctx.closePath();
      if (a.accent) {
        ctx.save();
        ctx.shadowColor = PALETTE.accent;
        ctx.shadowBlur = r * 1.1;
        ctx.fillStyle = PALETTE.accent;
        ctx.fill();
        ctx.restore();
      } else {
        ctx.fillStyle = fillC;
        ctx.fill();
      }
    }
    ctx.restore();
  }

  // The only live-drawn planet layer: the spinning lat/lon wireframe,
  // clipped to the shell, its alpha keyed to facing so the back recedes.
  // The static layers (halo/body/dome/rim/ring) come from the sprite blit.
  // Skipped on small/distant planets, where the detail is invisible anyway.
  const WIRE_P = -0.34;
  function drawWireframe(px: number, py: number, R: number, spin: number, alpha: number) {
    if (R < 34 || alpha <= 0.02) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(px, py, R, 0, TAU);
    ctx.clip();
    ctx.lineWidth = 1;
    const drawLine = (pts: number[][]) => {
      ctx.beginPath();
      let zsum = 0;
      for (let k = 0; k < pts.length; k++) {
        const pt = pts[k];
        const r = rot(pt[0], pt[1], pt[2], spin, WIRE_P);
        zsum += r.z;
        const sx = px + r.x * R, sy = py - r.y * R;
        if (k === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      const za = zsum / pts.length;
      const a = 0.05 + Math.max(0, (za + 1) / 2) * 0.2;
      ctx.strokeStyle = `rgba(224,210,232,${a})`;
      ctx.stroke();
    };
    for (let i = 0; i < LATS.length; i++) drawLine(LATS[i]);
    for (let i = 0; i < LONS.length; i++) drawLine(LONS[i]);
    ctx.restore();
  }

  function frame() {
    if (!running) return;
    if (w <= 0 || h <= 0) { raf = requestAnimationFrame(frame); return; }
    tick++;

    // Ease the camera toward its target stop.
    progress += (target - progress) * (reduced ? 1 : VOY.ease);
    if (Math.abs(target - progress) < 0.0005) progress = target;

    // Landed room = nearest planet; fire the callback only on change.
    const near = Math.round(progress);
    if (near !== landed && Math.abs(progress - near) < 0.5) {
      landed = near;
      warmTarget = ROOMS[near].planet.warm;
      if (!reduced) { landIdx = near; landAt = performance.now(); } // trigger the swell
      onRoom(near);
    }
    warm += (warmTarget - warm) * 0.05;

    // Background wash, blended by the landed room's warmth (cached).
    ctx.fillStyle = bg();
    ctx.fillRect(0, 0, w, h);

    const camX = camAt(progress, sideX);
    const camY = camAt(progress, sideY);

    drawDust(camX);

    // Auto-spin the wireframes, but hold still while a hand is on them.
    if (!reduced && hoverIndex < 0 && !dragging) for (let i = 0; i < spins.length; i++) spins[i] += VOY.spin;

    const cx = w / 2, cy = h * 0.5;
    const R0 = Math.min(w, h) * VOY.baseR;

    // Project every planet; draw far → near. items is reused across frames.
    items.length = 0;
    for (let i = 0; i < ROOMS.length; i++) {
      const relZ = i - progress;
      if (relZ < -0.9 || relZ > 4.6) continue;
      const dz = relZ * VOY.spacing; // wider spacing pushes neighbours further down the track
      const s = Math.min(VOY.maxScale, VOY.focal / (dz + VOY.focal));
      if (s <= 0) continue;
      const sx = cx + (sideX(i) - camX) * s * VOY.xScale * w;
      const sy = cy + (sideY(i) - camY) * s * VOY.yScale * h + h * 0.02;
      let R = R0 * s;
      // A single soft swell on the just-landed world, easing back to rest.
      if (i === landIdx) {
        const t = (performance.now() - landAt) / LAND_MS;
        if (t < 1) R *= 1 + LAND_AMP * Math.sin(Math.PI * (t < 0 ? 0 : t));
        else landIdx = -1;
      }
      // Fade in far ahead, fade out as it slips past the camera.
      let a = 1;
      if (relZ > 3) a = clamp01(1 - (relZ - 3) / 1.4);
      if (relZ < 0) a = clamp01(1 + relZ / 0.9);
      items.push({ i, x: sx, y: sy, R, a, z: relZ });
    }
    items.sort((p, q) => q.z - p.z);

    // Publish screen positions for pointer hit-testing.
    projected.length = 0;
    for (const p of items) projected.push({ i: p.i, x: p.x, y: p.y, R: p.R });

    // Faint zigzag track connecting the visible planet centers.
    if (items.length > 1) {
      ctx.save();
      ctx.beginPath();
      items.forEach((p, idx) => (idx === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
      ctx.setLineDash([2, 9]);
      ctx.strokeStyle = "rgba(240,230,224,0.14)";
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.restore();
    }

    for (const p of items) {
      if (p.a <= 0.01) continue;
      // Blit the baked static planet, scaled to its on-screen radius.
      const spr = sprites[p.i];
      const size = 2 * spr.half * (p.R / SPRITE_R);
      ctx.globalAlpha = p.a;
      ctx.drawImage(spr.canvas, p.x - size / 2, p.y - size / 2, size, size);
      ctx.globalAlpha = 1;
      // Only the spinning wireframe is drawn live.
      drawWireframe(p.x, p.y, p.R, spins[p.i] + yawOffset, p.a);
    }

    // Hover cue — a bright accent ring on the planet under the pointer.
    const hov = items.find((p) => p.i === hoverIndex);
    if (hov) {
      ctx.save();
      ctx.globalAlpha = hov.a;
      ctx.beginPath();
      ctx.arc(hov.x, hov.y, hov.R + 7, 0, TAU);
      ctx.strokeStyle = `rgba(${ROOMS[hov.i].planet.halo},0.9)`;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    }

    raf = requestAnimationFrame(frame);
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    if (w <= 0 || h <= 0) return;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // ── Controls ──
  const clampT = (v: number) => Math.max(0, Math.min(maxIndex, v));
  const scrollBy = (d: number) => { target = clampT(target + d); };
  const endScroll = () => { target = clampT(Math.round(target)); };
  const goTo = (i: number) => { target = clampT(i); };
  const setReducedMotion = (v: boolean) => { reduced = v; };
  // Raise/lower the reachable horizon (Golden Hour lock). Never rewinds the
  // camera; only widens where scroll and goTo may travel.
  const setMaxRoom = (i: number) => { maxIndex = Math.max(0, Math.min(ROOMS.length - 1, i)); target = clampT(target); };

  // Pointer hit-test: nearest drawn planet under (px,py), preferring the one
  // closest to the camera (drawn last / largest). Returns -1 if none.
  const pickAt = (px: number, py: number) => {
    let hit = -1;
    for (const p of projected) {
      const d = Math.hypot(px - p.x, py - p.y);
      if (d < p.R * 1.02) hit = p.i; // projected is far→near, so last match wins
    }
    return hit;
  };
  const setHover = (i: number) => { hoverIndex = i; };
  const setDragging = (v: boolean) => { dragging = v; };
  const rotateBy = (dx: number) => { yawOffset += dx * 0.008; };
  const onVis = () => {
    if (document.hidden) running = false;
    else if (!running) { running = true; raf = requestAnimationFrame(frame); }
  };

  resize();
  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", onVis);
  raf = requestAnimationFrame(frame);

  function destroy() {
    running = false;
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", resize);
    document.removeEventListener("visibilitychange", onVis);
  }
  return { scrollBy, endScroll, goTo, setReducedMotion, setMaxRoom, pickAt, setHover, setDragging, rotateBy, destroy };
}

export default function TheFoldBelt() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<ReturnType<typeof createVoyageEngine> | null>(null);
  const [activeId, setActiveId] = useState("root");
  const [hintGone, setHintGone] = useState(false);
  // The session is the default view now: you land inside your workspace, and
  // flying between worlds (scroll) just re-themes it. `locked` freezes the
  // voyage so an errant scroll can't fly you off the world you're working in.
  const [sessionMode, setSessionMode] = useState(true);
  const [locked, setLocked] = useState(false);
  // Read inside the once-bound wheel/touch handlers without re-subscribing.
  const lockedRef = useRef(false);
  lockedRef.current = locked;

  // Earned-world + memory state. `sessions` mirrors fold.sessions so the lock
  // is computed the same everywhere; greeting/streak are filled after mount.
  const [sessions, setSessions] = useState(0);
  const [greeting, setGreeting] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [showGoldenLock, setShowGoldenLock] = useState(false);
  const goldenUnlocked = sessions >= GOLDEN_UNLOCK;

  // Audio is gesture-gated: the context is only created once `audioStarted`
  // flips true, which happens on the first real user gesture (see below).
  const [audioStarted, setAudioStarted] = useState(false);
  const audio = useFoldAudio(audioStarted);
  const startAudio = useCallback(() => setAudioStarted(true), []);
  const toggleLock = useCallback(() => setLocked((v) => !v), []);

  // Latest room-change handler, so the engine callback never goes stale.
  const onRoomRef = useRef<(i: number) => void>(() => {});
  onRoomRef.current = (i: number) => {
    const room = ROOMS[i];
    setActiveId(room.id);
    // Remember where they were, so the next visit restores this world.
    try { localStorage.setItem("fold.lastRoom", room.id); } catch {}
    // Auto-crossfade to the landed world's bed — but only once the visitor
    // has started audio, so the restored mix is never clobbered on the
    // initial (mount) landing before any gesture.
    if (audioStarted) audio.applyPreset(ROOM_AUDIO[room.id]);
  };

  // Sessions completed inside the focus panel flow back up here so the lock,
  // the greeting, and the reachable horizon all agree on one count.
  const handleSessions = useCallback((n: number) => {
    setSessions(n);
    engineRef.current?.setMaxRoom(n >= GOLDEN_UNLOCK ? ROOMS.length - 1 : ROOMS.length - 2);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const engine = createVoyageEngine(canvas, (i) => onRoomRef.current(i));
    engineRef.current = engine;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    engine.setReducedMotion(mq.matches);
    const onMq = (e: MediaQueryListEvent) => engine.setReducedMotion(e.matches);
    mq.addEventListener("change", onMq);

    // ── Memory: greet the return, restore the last world, keep the streak ──
    try {
      const seen = localStorage.getItem("fold.seen") === "1";
      localStorage.setItem("fold.seen", "1");

      const rawSess = localStorage.getItem("fold.sessions");
      const sess = rawSess == null ? 0 : Number(JSON.parse(rawSess)) || 0;
      setSessions(sess);
      const unlocked = sess >= GOLDEN_UNLOCK;
      // Golden Hour stays unreachable (but visible ahead) until it is earned.
      engine.setMaxRoom(unlocked ? ROOMS.length - 1 : ROOMS.length - 2);

      // Restore the last world without starting audio (no gesture yet).
      const lastRoom = localStorage.getItem("fold.lastRoom");
      const savedIdx = ROOMS.findIndex((r) => r.id === lastRoom);
      const savedReachable = savedIdx > 0 && !(ROOMS[savedIdx].id === GOLDEN_ID && !unlocked);
      if (savedReachable) {
        engine.goTo(savedIdx);
        setActiveId(ROOMS[savedIdx].id);
      }

      // Returning visitors get a quiet line of what they've done here.
      if (seen) {
        const rm = ROOMS.find((r) => r.id === lastRoom);
        const bits: string[] = [];
        if (rm) bits.push(rm.name);
        if (sess > 0) bits.push(`session ${sess}`);
        const tail = bits.join(", ");
        setGreeting(tail ? `Back again. ${tail}.` : "Back again.");
      }

      // Record today's visit and surface the running streak.
      setStreak(bumpStreak());
    } catch {}

    // The greeting is a whisper, not a banner: let it fade on its own.
    const greetTimer = window.setTimeout(() => setGreeting(null), 11_000);

    // Debounced scroll → snap-land on the nearest planet once scrolling stops.
    let idle: ReturnType<typeof setTimeout> | null = null;
    const settle = () => {
      if (idle) clearTimeout(idle);
      idle = setTimeout(() => engine.endScroll(), 150);
    };
    const onWheel = (e: WheelEvent) => {
      if (lockedRef.current) return; // session locked in place — no travel
      engine.scrollBy(e.deltaY * VOY.wheelRate);
      setHintGone(true);
      setAudioStarted(true); // scrolling the voyage is a valid audio gesture
      settle();
    };
    let touchY: number | null = null;
    const onTS = (e: TouchEvent) => { if (lockedRef.current) return; touchY = e.touches[0].clientY; setAudioStarted(true); };
    const onTM = (e: TouchEvent) => {
      if (lockedRef.current || touchY == null) return;
      const y = e.touches[0].clientY;
      engine.scrollBy((touchY - y) * VOY.touchRate);
      touchY = y;
      setHintGone(true);
      settle();
    };
    const onTE = () => { touchY = null; settle(); };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTS, { passive: true });
    window.addEventListener("touchmove", onTM, { passive: true });
    window.addEventListener("touchend", onTE, { passive: true });

    return () => {
      if (idle) clearTimeout(idle);
      window.clearTimeout(greetTimer);
      mq.removeEventListener("change", onMq);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTS);
      window.removeEventListener("touchmove", onTM);
      window.removeEventListener("touchend", onTE);
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  const pickRoom = (id: string) => {
    if (lockedRef.current) return; // frozen in place — ignore travel
    const idx = ROOMS.findIndex((r) => r.id === id);
    if (idx < 0) return;
    // Golden Hour is a locked door until it is earned: show the price, don't travel.
    if (id === GOLDEN_ID && !goldenUnlocked) { setShowGoldenLock(true); return; }
    setShowGoldenLock(false);
    setGreeting(null);
    engineRef.current?.goTo(idx);
    setActiveId(id);
    // Explicitly picking a world is a gesture: start audio and ride its bed.
    startAudio();
    audio.applyPreset(ROOM_AUDIO[id]);
  };

  // ── Pointer on the planets: hover to highlight, drag to turn, click to travel ──
  const drag = useRef({ down: false, moved: 0, lastX: 0, lastY: 0, mouse: false });
  const [hovering, setHovering] = useState(false);
  const [grabbing, setGrabbing] = useState(false);

  const onPtrMove = (e: React.PointerEvent) => {
    const eng = engineRef.current;
    if (!eng) return;
    const d = drag.current;
    if (d.down) {
      const dx = e.clientX - d.lastX;
      d.moved += Math.abs(dx) + Math.abs(e.clientY - d.lastY);
      if (d.mouse) eng.rotateBy(dx); // turn the planets (mouse only; touch scrolls)
      d.lastX = e.clientX;
      d.lastY = e.clientY;
    } else {
      const idx = eng.pickAt(e.clientX, e.clientY);
      eng.setHover(idx);
      setHovering(idx >= 0);
    }
  };
  const onPtrDown = (e: React.PointerEvent) => {
    const eng = engineRef.current;
    if (!eng) return;
    drag.current = { down: true, moved: 0, lastX: e.clientX, lastY: e.clientY, mouse: e.pointerType === "mouse" };
    if (e.pointerType === "mouse") {
      eng.setDragging(true);
      setGrabbing(true);
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    }
  };
  const onPtrUp = (e: React.PointerEvent) => {
    const eng = engineRef.current;
    if (!eng) return;
    const d = drag.current;
    eng.setDragging(false);
    setGrabbing(false);
    if (d.down && d.moved < 6) {
      const idx = eng.pickAt(e.clientX, e.clientY);
      if (idx >= 0) pickRoom(ROOMS[idx].id);
    }
    d.down = false;
  };
  const onPtrLeave = () => {
    const eng = engineRef.current;
    if (!eng) return;
    eng.setHover(-1);
    eng.setDragging(false);
    setHovering(false);
    setGrabbing(false);
    drag.current.down = false;
  };
  const room = ROOMS.find((r) => r.id === activeId)!;

  return (
    <div
      className={`fold${sessionMode ? " fold--session" : ""}`}
      style={{ ["--accent" as string]: room.planet.light }}
    >
      <canvas
        ref={canvasRef}
        className="fold__belt"
        aria-hidden
        onPointerMove={onPtrMove}
        onPointerDown={onPtrDown}
        onPointerUp={onPtrUp}
        onPointerLeave={onPtrLeave}
        style={{ cursor: grabbing ? "grabbing" : hovering ? "pointer" : "grab", touchAction: "none" }}
      />
      <div className="fold__vignette" aria-hidden />

      <div className="fold__stage">
        <header className="fold__top">
          <div className="fold__brand">
            <span className="fold__wordmark">The Fold</span>
            <span className="fold__volume">{VOLUME_LABEL} · {VOLUME_THEME}</span>
          </div>
          <div className="fold__topnav">
            <button className="fold__focusbtn" onClick={() => setSessionMode(true)}>
              Open session
            </button>
            <button className="fold__stepout" onClick={() => router.push("/ctrla")}>Step out →</button>
          </div>
        </header>

        {greeting && <p className="fold__greet">{greeting}</p>}

        <div className="fold__title" key={room.id}>
          <div className="fold__floor">{room.floor}</div>
          <h1 className="fold__name">{room.name}</h1>
          <p className="fold__line">{room.line}</p>
          <p className={`fold__hint${hintGone ? " fold__hint--hide" : ""}`}>Scroll to travel between worlds · or pick one below</p>
        </div>

        {showGoldenLock && !goldenUnlocked && (
          <div className="fold__lock" role="status">
            <div className="fold__lock-name">Golden Hour</div>
            <p className="fold__lock-copy">The back patio. Rare and electric.</p>
            <p className="fold__lock-cond">
              Opens after three finished sessions. <b>{sessions} of {GOLDEN_UNLOCK}</b>
            </p>
            <button className="fold__lock-close" onClick={() => setShowGoldenLock(false)}>Close</button>
          </div>
        )}

        <footer className="fold__footer">
          <div className="fold__rooms">
            <span className="fold__lead fold__lead--cue">Pick a world</span>
            {ROOMS.map((r) => {
              const locked = r.id === GOLDEN_ID && !goldenUnlocked;
              return (
                <button
                  key={r.id}
                  className={`fold__room${r.id === activeId ? " fold__room--active" : ""}${locked ? " fold__room--locked" : ""}`}
                  onClick={() => pickRoom(r.id)}
                  aria-disabled={locked || undefined}
                  title={locked ? `Opens after ${GOLDEN_UNLOCK} finished sessions` : undefined}
                >
                  {locked && <span className="fold__room-lock" aria-hidden>◍</span>}
                  {r.name}
                  {locked ? (
                    <span className="fold__state">{sessions} / {GOLDEN_UNLOCK}</span>
                  ) : (
                    r.state && <span className="fold__state">{r.state}</span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="fold__mixer" data-muted={audio.muted ? "true" : "false"}>
            <span className="fold__lead">Blend the sound</span>
            {SOUNDS.map((s) => {
              if (s === "mute") {
                return (
                  <button
                    key={s}
                    className="fold__pad fold__pad--mute"
                    aria-pressed={audio.muted}
                    onClick={() => { startAudio(); audio.toggleMute(); }}
                  >
                    {s}
                  </button>
                );
              }
              const id = s as LayerId;
              return (
                <button
                  key={s}
                  className="fold__pad"
                  aria-pressed={audio.isAudible(id)}
                  onClick={() => { startAudio(); audio.toggleLayer(id); }}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </footer>
      </div>

      <FoldSession
        open={sessionMode}
        locked={locked}
        roomId={activeId}
        rooms={ROOMS.map((r) => ({ id: r.id, name: r.name, state: r.state }))}
        streak={streak}
        goldenId={GOLDEN_ID}
        goldenUnlock={GOLDEN_UNLOCK}
        chime={audio.chime}
        onSessions={handleSessions}
        onPickRoom={pickRoom}
        onToggleLock={toggleLock}
        onExit={() => { setLocked(false); setSessionMode(false); }}
      />
    </div>
  );
}
