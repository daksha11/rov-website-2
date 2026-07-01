"use client";

// ═══════════════════════════════════════════════════════
// THE FOLD — a scroll voyage between planets
// A full-bleed canvas is a slow journey through space. Six rooms are
// six distinct PLANETS (lit orbs, styled after the CTRL-A mix globe)
// strung along a zigzag track receding into depth. Scrolling advances
// the camera down the track; it eases and LANDS centered on each planet
// in turn, and landing sets that room active. The old asteroid belt
// lives on as dim parallax dust drifting behind the planets.
//
// PERFORMANCE: the whole engine lives outside React (refs/module
// scope). The RAF loop never calls setState except through a single
// onRoom callback that only fires when the landed room changes. Rock
// silhouettes and planet wireframes are precomputed once. Pauses on
// document.hidden, caps DPR at 2, honors reduced-motion.
// ═══════════════════════════════════════════════════════

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ed } from "../../_components/editorial";
import FoldSession from "./FoldSession";

type Planet = {
  light: string; // lit cap (upper-left)
  mid: string; // body
  dark: string; // shaded underside / terminator
  halo: string; // "r,g,b" for the atmosphere glow
  ring?: boolean; // a thin planetary ring
  warm: number; // 0 cool .. 1 gold, drives the background wash
};
type Room = { id: string; name: string; floor: string; state: string; line: string; sound: string; planet: Planet };

const ROOMS: Room[] = [
  { id: "commons", name: "The Commons", floor: "the floor", state: "",
    line: "Find your seat. An all-night cafe, out past the map.",
    sound: "murmur",
    planet: { light: "#5a4a6e", mid: "#2f2247", dark: "#120a22", halo: "150,120,168", warm: 0.5 } },
  { id: "window", name: "The Window Seat", floor: "wide open", state: "wide open",
    line: "Wide open. Held at arm's length, all air and distance.",
    sound: "music",
    planet: { light: "#3f5a78", mid: "#243a54", dark: "#0c1626", halo: "110,150,190", warm: 0.32 } },
  { id: "back", name: "The Back Room", floor: "in it", state: "in it",
    line: "In it. Close enough to feel, the room dim around you.",
    sound: "hum",
    planet: { light: "#4a2f5e", mid: "#2a1740", dark: "#0c0518", halo: "120,80,160", warm: 0.55 } },
  { id: "quiet", name: "The Quiet Corner", floor: "stuck", state: "stuck",
    line: "Stuck, and that's allowed. Nearly still, the room sparse.",
    sound: "rain",
    planet: { light: "#5c5a6a", mid: "#343542", dark: "#15151c", halo: "150,150,170", warm: 0.4 } },
  { id: "veranda", name: "The Veranda", floor: "last light", state: "last light",
    line: "Last light. Low on the horizon, warm and going gold.",
    sound: "rain",
    planet: { light: "#8a5a44", mid: "#5a3324", dark: "#1e0f0a", halo: "200,130,80", ring: true, warm: 0.85 } },
  { id: "golden", name: "Golden Hour", floor: "locked", state: "locked",
    line: "Locked. The held moment, the color richest.",
    sound: "music",
    planet: { light: "#b08a3a", mid: "#6e5020", dark: "#241705", halo: "227,194,74", ring: true, warm: 1.0 } },
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
const DUST = {
  count: 150, farZ: 1000, nearZ: 90, fov: 340, spreadX: 1500, spreadY: 0.34,
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

type Rock = { x: number; y: number; z: number; size: number; spin: number; spinRate: number; verts: Float32Array; accent: boolean };
const TAU = 6.2831853;
const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

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

function createVoyageEngine(canvas: HTMLCanvasElement, onRoom: (i: number) => void) {
  const ctx = canvas.getContext("2d")!;
  let w = 0, h = 0, raf = 0, running = true, reduced = false;

  // Camera position along the track (float planet-index). progress eases to target.
  let progress = 0, target = 0;
  let landed = -1;
  let warm = ROOMS[0].planet.warm; // eased background wash
  let warmTarget = ROOMS[0].planet.warm; // target wash for the landed room
  const spins = ROOMS.map((_, i) => i * 1.3); // per-planet wireframe phase

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
    rocks.sort((p, q) => q.z - p.z);
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

  // A single lit planet, styled after the mix globe: halo, lit body,
  // rotating wireframe, rim, optional ring.
  function drawPlanet(px: number, py: number, R: number, pal: Planet, spin: number, alpha: number) {
    if (R < 2 || alpha <= 0.01) return;
    ctx.save();
    ctx.globalAlpha = alpha;

    // Atmosphere halo just outside the rim.
    const halo = ctx.createRadialGradient(px, py, R * 0.92, px, py, R * 1.35);
    halo.addColorStop(0, `rgba(${pal.halo},0)`);
    halo.addColorStop(0.55, `rgba(${pal.halo},0.14)`);
    halo.addColorStop(1, `rgba(${pal.halo},0)`);
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(px, py, R * 1.35, 0, TAU);
    ctx.fill();

    // Optional ring behind the body (back half).
    if (pal.ring) {
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(-0.42);
      ctx.scale(1, 0.32);
      ctx.beginPath();
      ctx.arc(0, 0, R * 1.5, Math.PI, TAU);
      ctx.strokeStyle = `rgba(${pal.halo},${0.5 * alpha})`;
      ctx.lineWidth = R * 0.1;
      ctx.stroke();
      ctx.restore();
    }

    // Lit sphere body — light from upper-left into shadow lower-right.
    const g = ctx.createRadialGradient(px - R * 0.34, py - R * 0.4, R * 0.06, px - R * 0.05, py - R * 0.05, R * 1.28);
    g.addColorStop(0, pal.light);
    g.addColorStop(0.5, pal.mid);
    g.addColorStop(1, pal.dark);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(px, py, R, 0, TAU);
    ctx.fill();

    // Glassy dome highlight, clipped to the shell.
    ctx.save();
    ctx.beginPath();
    ctx.arc(px, py, R, 0, TAU);
    ctx.clip();
    const dome = ctx.createRadialGradient(px - R * 0.5, py - R * 0.58, R * 0.04, px - R * 0.15, py - R * 0.25, R * 1.15);
    dome.addColorStop(0, "rgba(255,255,255,0.2)");
    dome.addColorStop(0.4, "rgba(255,255,255,0.03)");
    dome.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = dome;
    ctx.fillRect(px - R, py - R, R * 2, R * 2);

    // Wireframe inside the shell — alpha keyed to facing so the back recedes.
    const P = -0.34;
    const drawLine = (pts: number[][]) => {
      ctx.beginPath();
      let zsum = 0;
      const proj = pts.map(([a, b, c]) => {
        const r = rot(a, b, c, spin, P);
        zsum += r.z;
        return r;
      });
      let started = false;
      proj.forEach((r) => {
        const sx = px + r.x * R, sy = py - r.y * R;
        if (!started) { ctx.moveTo(sx, sy); started = true; }
        else ctx.lineTo(sx, sy);
      });
      const za = zsum / proj.length;
      const a = 0.05 + Math.max(0, (za + 1) / 2) * 0.2;
      ctx.strokeStyle = `rgba(224,210,232,${a.toFixed(3)})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    };
    LATS.forEach(drawLine);
    LONS.forEach(drawLine);
    ctx.restore(); // un-clip

    // Rim hairline.
    ctx.beginPath();
    ctx.arc(px, py, R, 0, TAU);
    ctx.strokeStyle = "rgba(240,230,224,0.22)";
    ctx.lineWidth = 1.4;
    ctx.stroke();

    // Ring front half over the body.
    if (pal.ring) {
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(-0.42);
      ctx.scale(1, 0.32);
      ctx.beginPath();
      ctx.arc(0, 0, R * 1.5, 0, Math.PI);
      ctx.strokeStyle = `rgba(${pal.halo},${0.62 * alpha})`;
      ctx.lineWidth = R * 0.1;
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();
  }

  function frame() {
    if (!running) return;
    if (w <= 0 || h <= 0) { raf = requestAnimationFrame(frame); return; }

    // Ease the camera toward its target stop.
    progress += (target - progress) * (reduced ? 1 : VOY.ease);
    if (Math.abs(target - progress) < 0.0005) progress = target;

    // Landed room = nearest planet; fire the callback only on change.
    const near = Math.round(progress);
    if (near !== landed && Math.abs(progress - near) < 0.5) {
      landed = near;
      warmTarget = ROOMS[near].planet.warm;
      onRoom(near);
    }
    warm += (warmTarget - warm) * 0.05;

    // Background wash, blended by the landed room's warmth.
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, PALETTE.bgTop);
    bg.addColorStop(0.55, PALETTE.bgMid(warm));
    bg.addColorStop(1, PALETTE.bgBot(warm));
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    const camX = camAt(progress, sideX);
    const camY = camAt(progress, sideY);

    drawDust(camX);

    // Auto-spin the wireframes, but hold still while a hand is on them.
    if (!reduced && hoverIndex < 0 && !dragging) for (let i = 0; i < spins.length; i++) spins[i] += VOY.spin;

    const cx = w / 2, cy = h * 0.5;
    const R0 = Math.min(w, h) * VOY.baseR;

    // Project every planet; draw far → near.
    type P = { i: number; x: number; y: number; R: number; a: number; z: number };
    const items: P[] = [];
    for (let i = 0; i < ROOMS.length; i++) {
      const relZ = i - progress;
      if (relZ < -0.9 || relZ > 4.6) continue;
      const dz = relZ * VOY.spacing; // wider spacing pushes neighbours further down the track
      const s = Math.min(VOY.maxScale, VOY.focal / (dz + VOY.focal));
      if (s <= 0) continue;
      const sx = cx + (sideX(i) - camX) * s * VOY.xScale * w;
      const sy = cy + (sideY(i) - camY) * s * VOY.yScale * h + h * 0.02;
      const R = R0 * s;
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

    for (const p of items) drawPlanet(p.x, p.y, p.R, ROOMS[p.i].planet, spins[p.i] + yawOffset, p.a);

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
  const clampT = (v: number) => Math.max(0, Math.min(ROOMS.length - 1, v));
  const scrollBy = (d: number) => { target = clampT(target + d); };
  const endScroll = () => { target = clampT(Math.round(target)); };
  const goTo = (i: number) => { target = clampT(i); };
  const setReducedMotion = (v: boolean) => { reduced = v; };

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
  return { scrollBy, endScroll, goTo, setReducedMotion, pickAt, setHover, setDragging, rotateBy, destroy };
}

export default function TheFoldBelt() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<ReturnType<typeof createVoyageEngine> | null>(null);
  const [activeId, setActiveId] = useState("commons");
  const [sound, setSound] = useState("murmur");
  const [doorOpen, setDoorOpen] = useState(true);
  const [hintGone, setHintGone] = useState(false);
  const [sessionMode, setSessionMode] = useState(false);

  // Latest room-change handler, so the engine callback never goes stale.
  const onRoomRef = useRef<(i: number) => void>(() => {});
  onRoomRef.current = (i: number) => {
    const room = ROOMS[i];
    setActiveId(room.id);
    setSound(room.sound);
  };

  useEffect(() => {
    const canvas = canvasRef.current!;
    const engine = createVoyageEngine(canvas, (i) => onRoomRef.current(i));
    engineRef.current = engine;

    try {
      if (localStorage.getItem("fold.seen") === "1") setDoorOpen(false);
    } catch {}

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    engine.setReducedMotion(mq.matches);
    const onMq = (e: MediaQueryListEvent) => engine.setReducedMotion(e.matches);
    mq.addEventListener("change", onMq);

    // Debounced scroll → snap-land on the nearest planet once scrolling stops.
    let idle: ReturnType<typeof setTimeout> | null = null;
    const settle = () => {
      if (idle) clearTimeout(idle);
      idle = setTimeout(() => engine.endScroll(), 150);
    };
    const onWheel = (e: WheelEvent) => {
      engine.scrollBy(e.deltaY * VOY.wheelRate);
      setHintGone(true);
      settle();
    };
    let touchY: number | null = null;
    const onTS = (e: TouchEvent) => { touchY = e.touches[0].clientY; };
    const onTM = (e: TouchEvent) => {
      if (touchY == null) return;
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
    const idx = ROOMS.findIndex((r) => r.id === id);
    if (idx < 0) return;
    engineRef.current?.goTo(idx);
    setActiveId(id);
    setSound(ROOMS[idx].sound);
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
  // Dismiss the first-visit doorway into the voyage.
  const enterBelt = (toCommons: boolean) => {
    setDoorOpen(false);
    try {
      localStorage.setItem("fold.seen", "1");
    } catch {}
    if (toCommons) pickRoom("commons");
  };
  const room = ROOMS.find((r) => r.id === activeId)!;

  return (
    <div className={`fold${sessionMode ? " fold--session" : ""}`}>
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

      <div className={`fold__door${doorOpen ? "" : " fold__door--gone"}`}>
        <div className="fold__kicker">The Fold</div>
        <h2 className="fold__doorh">A quiet place to work, open all night.</h2>
        <p className="fold__what">An ambient cafe for focus. Pick a room, blend the sound, and stay as long as you like.</p>
        <p className="fold__how">No sign-up, no clock. Out past the map, a seat is always open.</p>
        <button className="fold__enter" onClick={() => enterBelt(true)}>Find a seat →</button>
        <button className="fold__skip" onClick={() => enterBelt(false)}>Just let me drift</button>
      </div>

      <div className="fold__stage">
        <header className="fold__top">
          <div className="fold__brand">The Fold · <b>{room.name}</b></div>
          <div className="fold__topnav">
            <button className="fold__focusbtn" onClick={() => setSessionMode(true)}>
              Open session
            </button>
            <button className="fold__stepout" onClick={() => router.push("/ctrla")}>Step out →</button>
          </div>
        </header>

        <div className="fold__title">
          <div className="fold__floor">{room.floor}</div>
          <h1 className="fold__name">{room.name}</h1>
          <p className="fold__line">{room.line}</p>
          <p className={`fold__hint${hintGone ? " fold__hint--hide" : ""}`}>Scroll to travel · land on each room · or pick one below</p>
        </div>

        <footer className="fold__footer">
          <div className="fold__rooms">
            <span className="fold__lead fold__lead--cue">Pick a room</span>
            {ROOMS.map((r) => (
              <button
                key={r.id}
                className={`fold__room${r.id === activeId ? " fold__room--active" : ""}`}
                onClick={() => pickRoom(r.id)}
              >
                {r.name}
                {r.state && <span className="fold__state">{r.state}</span>}
              </button>
            ))}
          </div>
          <div className="fold__mixer">
            <span className="fold__lead">Blend the sound</span>
            {SOUNDS.map((s) => (
              <button key={s} className="fold__pad" aria-pressed={s === sound} onClick={() => setSound(s)}>
                {s}
              </button>
            ))}
          </div>
        </footer>
      </div>

      <FoldSession
        open={sessionMode}
        roomId={activeId}
        rooms={ROOMS.map((r) => ({ id: r.id, name: r.name, state: r.state }))}
        onPickRoom={pickRoom}
        onExit={() => setSessionMode(false)}
      />
    </div>
  );
}
