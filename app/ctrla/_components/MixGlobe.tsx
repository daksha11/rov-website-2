"use client";

// ═══════════════════════════════════════════════════════
// CTRL-A — MIX GLOBE
// The mixing lesson ROV teaches: your song is a 3D globe.
// Dry sounds sit up front in your face. Wet effects (reverb,
// delay) push things to the back. Panning moves them left and
// right. Frequency stacks them low to high. Every element
// gets its own pocket of space.
//   x = pan (left ↔ right)
//   y = frequency (low ↔ high)
//   z = dry ↔ wet (front ↔ back)
//
// Interactive: pick an element, then ride its effects (pan,
// reverb, delay, EQ, fader) and watch the dot move. The physics
// follow how those tools actually place a source in a real mix,
// audited below at each effect.
//
// Canvas follows the house rules: 100% sizing, dimensions read
// from the parent, 0-dimension frames skipped.
// ═══════════════════════════════════════════════════════

import { useEffect, useMemo, useRef, useState } from "react";
import { edLight as ed } from "./editorial";

type Element = {
  name: string;
  pan: number; // -1 (hard left) .. 1 (hard right)
  freq: number; // -1 (sub) .. 1 (air)
  depth: number; // 0 (bone dry, front) .. 1 (drenched, back)
  color: string;
  role: string;
};

// The pro default position for each element: where a senior engineer
// would seat it with no extra moves. The sliders are deltas on top.
const ELEMENTS: Element[] = [
  { name: "lead vocal", pan: 0, freq: 0.34, depth: 0.04, color: "#A56A67", role: "the star. bone dry and right in your face. it sits dead center up front so nothing fights it." },
  { name: "ad-libs", pan: 0.5, freq: 0.52, depth: 0.72, color: "#C98C7E", role: "wet and pushed back with reverb. they answer the lead from a step behind, off to the side." },
  { name: "backing vox", pan: -0.62, freq: 0.46, depth: 0.55, color: "#C98C7E", role: "spread wide and a little wet. they widen the chorus without crowding the lead." },
  { name: "kick", pan: 0, freq: -0.78, depth: 0.08, color: "#4E3D73", role: "dead center, dry, low. the floor the whole mix stands on." },
  { name: "bass", pan: 0, freq: -0.54, depth: 0.2, color: "#6A5694", role: "center and low, glued to the kick. felt more than heard." },
  { name: "snare", pan: 0, freq: 0.02, depth: 0.34, color: "#8A6F8F", role: "center with a touch of room on it. gives the backbeat its own pocket." },
  { name: "hi-hats", pan: 0.36, freq: 0.82, depth: 0.22, color: "#B89A4E", role: "nudged off center, high and bright, mostly dry. they sparkle on the edges." },
  { name: "keys", pan: -0.42, freq: 0.18, depth: 0.46, color: "#E3C24A", role: "set to one side with some depth. fills the room around the vocal." },
  { name: "delay throw", pan: 0.74, freq: 0.4, depth: 0.96, color: "#7FA0C4", role: "the deepest thing in the mix. it catches one word and floats it to the back wall." },
];

// ── Effects model ──
// Each value is a slider position. pan/eq/level run -1..1 (centered),
// reverb/delay run 0..1 (a send, off at zero). All default to neutral
// so a freshly picked element sits exactly at its pro position.
type Fx = { pan: number; reverb: number; delay: number; eq: number; level: number };
const NEUTRAL: Fx = { pan: 0, reverb: 0, delay: 0, eq: 0, level: 0 };

// Listener marker colour — the amber accent, distinct from every element.
const LISTENER = ed.amber;

// Depth-lighting palette. Receding elements blend toward HAZE (the dark orb
// interior) so distance reads as fading into the volume; lit edges fall to SHADE.
const HAZE: [number, number, number] = [42, 27, 70];
const SHADE: [number, number, number] = [12, 7, 24];
const ELEM_RGB: [number, number, number][] = ELEMENTS.map((e) => hexRgb(e.color));
function hexRgb(hex: string): [number, number, number] {
  const n = hex.replace("#", "");
  return [parseInt(n.slice(0, 2), 16), parseInt(n.slice(2, 4), 16), parseInt(n.slice(4, 6), 16)];
}
function mixRgb(a: [number, number, number], b: [number, number, number], t: number): [number, number, number] {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}
function rgbStr(c: [number, number, number], a = 1) {
  return `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
}

// Where the dot lands once the effects are applied. This is the audited
// part: every coefficient mirrors a real engineering relationship.
//   pan   → moves left/right on the pan axis. nothing else.
//   reverb→ wet send. the canonical distance cue: pushes back, and
//           decorrelates the signal so it reads wider.
//   delay → echo throw. also adds depth, and ping-pong style spreads
//           it across the stereo field (width).
//   eq    → tone. brightening lifts it up the frequency axis and a hair
//           forward (high frequency = proximity). darkening drops it
//           down and back (distance rolls off the top end).
//   level → the fader, the other primary depth cue. louder = closer and
//           a touch bigger, quieter = further back.
function place(base: Element, fx: Fx) {
  const pan = clamp(base.pan + fx.pan, -1, 1);
  const freq = clamp(base.freq + fx.eq * 0.5, -1, 1);
  const depth = clamp(
    base.depth + fx.reverb * 0.6 + fx.delay * 0.5 - fx.eq * 0.12 - fx.level * 0.4,
    0,
    1,
  );
  const width = clamp(fx.reverb + fx.delay * 0.85, 0, 2); // stereo spread of the glow
  const size = clamp(1 + fx.level * 0.35, 0.7, 1.5); // louder reads bigger / closer
  return { pan, freq, depth, width, size };
}

// ── Classroom: share / challenge encoding ──
// A mix is serialized as a short URL token: per moved element,
// "index.pan,level,reverb,delay,eq" (integers -100..100), joined by "~".
function isNeutralFx(fx: Fx) {
  return fx.pan === 0 && fx.reverb === 0 && fx.delay === 0 && fx.eq === 0 && fx.level === 0;
}
function encodeMix(map: Record<number, Fx>): string {
  const parts: string[] = [];
  Object.keys(map).forEach((k) => {
    const fx = map[Number(k)];
    if (!fx || isNeutralFx(fx)) return;
    const v = [fx.pan, fx.level, fx.reverb, fx.delay, fx.eq].map((n) => Math.round(n * 100));
    parts.push(`${k}.${v.join(",")}`);
  });
  return parts.join("~");
}
function decodeMix(s: string): Record<number, Fx> {
  const map: Record<number, Fx> = {};
  if (!s) return map;
  s.split("~").forEach((part) => {
    const [k, vals] = part.split(".");
    if (!vals) return;
    const idx = Number(k);
    if (Number.isNaN(idx) || idx < 0 || idx >= ELEMENTS.length) return;
    const n = vals.split(",").map((x) => (Number(x) || 0) / 100);
    map[idx] = { pan: n[0] || 0, level: n[1] || 0, reverb: n[2] || 0, delay: n[3] || 0, eq: n[4] || 0 };
  });
  return map;
}
// Score a student mix against a target: 100 = exact placement on every
// element the teacher moved (compared as final pan/freq/depth, not raw fx).
function scoreMatch(student: Record<number, Fx>, target: Record<number, Fx>) {
  const ids = Object.keys(target).map(Number);
  if (!ids.length) return null;
  const per: Record<number, number> = {};
  let sum = 0;
  ids.forEach((i) => {
    const sp = place(ELEMENTS[i], student[i] ?? NEUTRAL);
    const tp = place(ELEMENTS[i], target[i] ?? NEUTRAL);
    const dist = (Math.abs(sp.pan - tp.pan) / 2 + Math.abs(sp.freq - tp.freq) / 2 + Math.abs(sp.depth - tp.depth)) / 3;
    const sc = Math.max(0, 1 - dist * 1.7);
    per[i] = Math.round(sc * 100);
    sum += sc;
  });
  return { overall: Math.round((sum / ids.length) * 100), per };
}

export default function MixGlobe({ accent = ed.amber }: { accent?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState<number | null>(0);
  const [fxMap, setFxMap] = useState<Record<number, Fx>>({});

  // Classroom state.
  const [mode, setMode] = useState<"free" | "challenge">("free");
  const [targetMap, setTargetMap] = useState<Record<number, Fx>>({});
  const [score, setScore] = useState<{ overall: number; per: Record<number, number> } | null>(null);
  const [contrast, setContrast] = useState(false);
  const [isFull, setIsFull] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Mutable state the draw loop reads without restarting.
  const yaw = useRef(0.5);
  const pitch = useRef(-0.32);
  const dragging = useRef(false);
  const hovering = useRef(false);
  const moved = useRef(0);
  const last = useRef({ x: 0, y: 0 });
  const activeRef = useRef<number | null>(0);
  const fxRef = useRef<Record<number, Fx>>({});
  const targetRef = useRef<Record<number, Fx>>({});
  const modeRef = useRef<"free" | "challenge">("free");
  const contrastRef = useRef(false);
  const projected = useRef<{ x: number; y: number; z: number; i: number }[]>([]);
  const spin = useRef(true);

  useEffect(() => { activeRef.current = active; }, [active]);
  useEffect(() => { fxRef.current = fxMap; }, [fxMap]);
  useEffect(() => { targetRef.current = targetMap; }, [targetMap]);
  useEffect(() => { modeRef.current = mode; }, [mode]);
  useEffect(() => { contrastRef.current = contrast; }, [contrast]);

  // Restore a shared mix or a challenge target from the URL on first load.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("mixtarget");
    const m = params.get("mix");
    if (t) {
      const decoded = decodeMix(t);
      if (Object.keys(decoded).length) { setTargetMap(decoded); setMode("challenge"); setFxMap({}); }
    } else if (m) {
      const decoded = decodeMix(m);
      if (Object.keys(decoded).length) setFxMap(decoded);
    }
  }, []);

  // Fade any toast after a moment.
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(id);
  }, [toast]);

  // Track fullscreen so the button label stays honest.
  useEffect(() => {
    const onFs = () => setIsFull(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const copyLink = (param: "mix" | "mixtarget", label: string) => {
    const token = encodeMix(fxMap);
    if (!token) { setToast("move an effect first"); return; }
    const url = `${window.location.origin}${window.location.pathname}?${param}=${token}`;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(() => setToast(label)).catch(() => window.prompt("Copy this link:", url));
    } else {
      window.prompt("Copy this link:", url);
    }
  };
  const checkMatch = () => setScore(scoreMatch(fxMap, targetMap));
  const exitChallenge = () => { setMode("free"); setTargetMap({}); setScore(null); };
  const resetAll = () => { setFxMap({}); setScore(null); spin.current = false; };
  const toggleFullscreen = () => {
    const el = rootRef.current;
    if (!el) return;
    if (!document.fullscreenElement) el.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  const fx = active !== null ? fxMap[active] ?? NEUTRAL : NEUTRAL;
  const setField = (field: keyof Fx, value: number) => {
    if (active === null) return;
    setFxMap((m) => ({ ...m, [active]: { ...(m[active] ?? NEUTRAL), [field]: value } }));
    // a hand on the effects means the user is studying one sound: hold the spin
    spin.current = false;
  };
  const resetFx = () => {
    if (active === null) return;
    setFxMap((m) => ({ ...m, [active]: NEUTRAL }));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) spin.current = false;

    let raf = 0;

    // Rotate a unit-space point by yaw (around Y) then pitch (around X).
    const rotate = (px: number, py: number, pz: number, y: number, p: number) => {
      const cy = Math.cos(y), sy = Math.sin(y);
      const x = px * cy + pz * sy;
      const z = -px * sy + pz * cy;
      const cx = Math.cos(p), sx = Math.sin(p);
      const yy = py * cx - z * sx;
      const zz = py * sx + z * cx;
      return { x, y: yy, z: zz };
    };

    // Wireframe sphere lines (unit sphere), generated once.
    const lats: number[][][] = [];
    const lons: number[][][] = [];
    for (let lat = -60; lat <= 60; lat += 30) {
      const r = Math.cos((lat * Math.PI) / 180);
      const yv = Math.sin((lat * Math.PI) / 180);
      const ring: number[][] = [];
      for (let a = 0; a <= 360; a += 12) {
        const t = (a * Math.PI) / 180;
        ring.push([r * Math.cos(t), yv, r * Math.sin(t)]);
      }
      lats.push(ring);
    }
    for (let lon = 0; lon < 180; lon += 30) {
      const t = (lon * Math.PI) / 180;
      const arc: number[][] = [];
      for (let a = -90; a <= 90; a += 12) {
        const p = (a * Math.PI) / 180;
        arc.push([Math.cos(p) * Math.sin(t), Math.sin(p), Math.cos(p) * Math.cos(t)]);
      }
      lons.push(arc);
    }

    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      // 0-dimension guard: skip the frame, try again next tick.
      if (w === 0 || h === 0) {
        raf = requestAnimationFrame(draw);
        return;
      }
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const R = Math.min(w, h) * 0.4;

      // Ambient spin, but hold still while the pointer is over the globe or
      // dragging, so a learner can study and position it freely.
      if (spin.current && !dragging.current && !hovering.current) yaw.current += 0.0024;
      const Y = yaw.current;
      const P = pitch.current;
      const HC = contrastRef.current; // high-contrast / large mode for projectors

      // Atmosphere — a soft halo just outside the rim so the orb separates
      // from the dark stage behind it.
      const halo = ctx.createRadialGradient(cx, cy, R * 0.95, cx, cy, R * 1.12);
      halo.addColorStop(0, "rgba(132,104,178,0)");
      halo.addColorStop(0.6, "rgba(132,104,178,0.05)");
      halo.addColorStop(1, "rgba(132,104,178,0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.12, 0, Math.PI * 2);
      ctx.fill();

      // Sphere body — an opaque lit ball, light from the upper-left fading to
      // shadow lower-right, so it reads as a solid 3D orb against the stage.
      const g = ctx.createRadialGradient(cx - R * 0.34, cy - R * 0.4, R * 0.06, cx - R * 0.05, cy - R * 0.05, R * 1.28);
      g.addColorStop(0, "#3e2e64");
      g.addColorStop(0.5, "#241642");
      g.addColorStop(1, "#0e0820");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fill();

      // Glassy dome highlight (light from upper-left), clipped to the shell.
      // This separates the translucent container from the lit beads inside.
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.clip();
      const dome = ctx.createRadialGradient(cx - R * 0.5, cy - R * 0.58, R * 0.04, cx - R * 0.15, cy - R * 0.25, R * 1.15);
      dome.addColorStop(0, "rgba(255,255,255,0.22)");
      dome.addColorStop(0.4, "rgba(255,255,255,0.04)");
      dome.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = dome;
      ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
      ctx.restore();

      // Rim — a bright hairline encloses the volume against the dark stage.
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(240,230,224,0.2)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Wireframe — alpha keyed to depth so the back of the globe recedes.
      const drawLine = (pts: number[][]) => {
        ctx.beginPath();
        let started = false;
        let zsum = 0;
        const proj = pts.map(([a, b, c]) => {
          const r = rotate(a, b, c, Y, P);
          zsum += r.z;
          return r;
        });
        proj.forEach((r) => {
          const sx = cx + r.x * R;
          const sy = cy - r.y * R;
          if (!started) { ctx.moveTo(sx, sy); started = true; }
          else ctx.lineTo(sx, sy);
        });
        const za = zsum / proj.length;
        const alpha = (HC ? 0.16 : 0.06) + Math.max(0, (za + 1) / 2) * (HC ? 0.34 : 0.2);
        ctx.strokeStyle = `rgba(216,200,224,${alpha.toFixed(3)})`;
        ctx.lineWidth = HC ? 1.3 : 1;
        ctx.stroke();
      };
      lats.forEach(drawLine);
      lons.forEach(drawLine);

      // ── Axis references — name the three dimensions on the globe itself so
      // the mapping reads without a key: pan (L/R), frequency (low/high),
      // depth (front/back, the listener sits up front).
      const projW = (wx: number, wy: number, wz: number) => {
        const r = rotate(wx, wy, wz, Y, P);
        return { x: cx + r.x * R, y: cy - r.y * R, z: r.z };
      };
      const LR = 1.12; // just outside the sphere surface
      const refs: { w: [number, number, number]; t: string }[] = [
        { w: [-LR, 0, 0], t: "L" },
        { w: [LR, 0, 0], t: "R" },
        { w: [0, LR, 0], t: "HIGH" },
        { w: [0, -LR, 0], t: "LOW" },
        { w: [0, 0, -LR], t: "BACK" },
      ];
      ctx.font = `600 ${HC ? 14 : 10}px 'Neue Montreal', sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      refs.forEach((rf) => {
        const p = projW(rf.w[0], rf.w[1], rf.w[2]);
        const facing = (p.z / LR + 1) / 2; // 0 behind .. 1 toward viewer
        const a = (HC ? 0.5 : 0.28) + Math.max(0, facing) * (HC ? 0.45 : 0.6);
        ctx.fillStyle = `rgba(238,228,222,${a.toFixed(3)})`;
        ctx.fillText(rf.t, p.x, p.y);
      });

      // Listener at the front of the depth axis: an ear taking in the mix.
      // It rotates with the globe so "up front = near you" stays literal.
      const lp = projW(0, 0, LR);
      const facingL = Math.max(0, (lp.z / LR + 1) / 2);
      if (facingL > 0.06) {
        const ang = Math.atan2(cy - lp.y, cx - lp.x); // face the mix
        ctx.save();
        ctx.globalAlpha = 0.3 + facingL * 0.65;
        ctx.fillStyle = LISTENER;
        ctx.beginPath();
        ctx.arc(lp.x, lp.y, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = LISTENER;
        ctx.lineWidth = 1.4;
        for (let k = 1; k <= 2; k++) {
          ctx.beginPath();
          ctx.arc(lp.x, lp.y, 4.5 + k * 4, ang - 0.55, ang + 0.55);
          ctx.stroke();
        }
        ctx.globalAlpha = 0.55 + facingL * 0.45;
        ctx.fillStyle = "rgba(238,228,222,0.92)";
        ctx.font = `600 9px 'Neue Montreal', sans-serif`;
        ctx.fillText("LISTENER", lp.x, lp.y + 16);
        ctx.restore();
      }

      // Sound elements — apply live effects, project, then paint back-to-front.
      const acc = activeRef.current;
      const dots = ELEMENTS.map((el, i) => {
        const p = place(el, fxRef.current[i] ?? NEUTRAL);
        const r = rotate(p.pan * 0.82, p.freq * 0.82, (0.5 - p.depth) * 1.62, Y, P);
        return { x: cx + r.x * R, y: cy - r.y * R, z: r.z, i, width: p.width, size: p.size };
      });
      projected.current = dots.map((d) => ({ x: d.x, y: d.y, z: d.z, i: d.i }));
      dots.sort((a, b) => a.z - b.z);

      dots.forEach((d) => {
        const el = ELEMENTS[d.i];
        const base = ELEM_RGB[d.i];
        const depthT = (d.z + 1) / 2; // 0 back .. 1 front
        // Stronger size range so front/back separates at a glance.
        const rad = (3 + depthT * 9) * d.size;
        const isActive = acc === d.i;

        // Atmospheric perspective: the further back, the more it fades into
        // the dark orb (less contrast), so depth reads as it recedes. Capped
        // so back beads keep enough hue to stay colourful.
        const recede = (1 - depthT) * 0.5;
        const body = mixRgb(base, HAZE, recede);
        const hi = mixRgb(body, [255, 255, 255], 0.3 + depthT * 0.5); // lit cap
        const sh = mixRgb(body, SHADE, 0.35 + depthT * 0.4); // shaded underside

        // Glow — a colored halo that lifts the bead off the dark orb. Front
        // pops, back is subtler. Stretched when wet (width).
        const spread = 1 + d.width * 0.7;
        const gr = rad * (2.0 + depthT * 1.8);
        ctx.save();
        ctx.translate(d.x, d.y);
        ctx.scale(spread, 1);
        const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, gr);
        glow.addColorStop(0, rgbStr(base, 0.22 + depthT * 0.4));
        glow.addColorStop(1, rgbStr(base, 0));
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(0, 0, gr, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Lit sphere body — highlight upper-left, shaded lower-right, matching
        // the dome light. This is what makes a bead read as a 3D object.
        const bg = ctx.createRadialGradient(d.x - rad * 0.36, d.y - rad * 0.42, rad * 0.06, d.x, d.y, rad);
        bg.addColorStop(0, rgbStr(hi));
        bg.addColorStop(0.55, rgbStr(body));
        bg.addColorStop(1, rgbStr(sh));
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.arc(d.x, d.y, rad, 0, Math.PI * 2);
        ctx.fill();

        // Rim — a faint light edge detaches the bead from the dark orb.
        ctx.beginPath();
        ctx.strokeStyle = `rgba(240,230,224,${(0.14 + depthT * 0.26).toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.arc(d.x, d.y, rad, 0, Math.PI * 2);
        ctx.stroke();

        // Specular dot — a tight catchlight, brighter on closer beads.
        if (depthT > 0.18) {
          ctx.beginPath();
          ctx.fillStyle = `rgba(255,255,255,${(0.55 * depthT).toFixed(3)})`;
          ctx.arc(d.x - rad * 0.34, d.y - rad * 0.4, rad * 0.2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Active ring — full-strength element colour, ignores haze.
        if (isActive) {
          ctx.beginPath();
          ctx.strokeStyle = rgbStr(base, 0.95);
          ctx.lineWidth = 2;
          ctx.arc(d.x, d.y, rad + 6, 0, Math.PI * 2);
          ctx.stroke();
        }

        // label — only the front hemisphere and the active dot get named,
        // so clustered dots on the far side never pile their labels up.
        if (isActive || depthT > 0.58) {
          const lf = HC ? 14 : 11;
          ctx.font = `600 ${lf}px 'Neue Montreal', sans-serif`;
          // A dark plate behind the label keeps it legible over bright beads.
          const tw = ctx.measureText(el.name).width;
          const lx = d.x + rad + 7;
          ctx.fillStyle = `rgba(15,8,28,${((HC ? 0.5 : 0.34) * (isActive ? 1 : depthT)).toFixed(3)})`;
          ctx.fillRect(lx - 3, d.y - lf * 0.72, tw + 6, lf * 1.45);
          ctx.fillStyle = isActive
            ? "rgba(245,238,230,0.98)"
            : `rgba(240,230,224,${(0.45 + depthT * 0.5).toFixed(3)})`;
          ctx.textAlign = "left";
          ctx.textBaseline = "middle";
          ctx.fillText(el.name, lx, d.y);
        }
      });

      // Challenge ghosts — dashed rings marking where each targeted element
      // should land, in its own colour. The learner drags their bead onto it.
      if (modeRef.current === "challenge") {
        const tmap = targetRef.current;
        ctx.save();
        ctx.setLineDash([3, 3]);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `600 ${HC ? 12 : 9}px 'Neue Montreal', sans-serif`;
        Object.keys(tmap).forEach((k) => {
          const i = Number(k);
          const tp = place(ELEMENTS[i], tmap[i]);
          const r = rotate(tp.pan * 0.82, tp.freq * 0.82, (0.5 - tp.depth) * 1.62, Y, P);
          const gx = cx + r.x * R;
          const gy = cy - r.y * R;
          const depthT = (r.z + 1) / 2;
          const grad = (3 + depthT * 9) * tp.size + 5;
          ctx.strokeStyle = rgbStr(ELEM_RGB[i], 0.85);
          ctx.lineWidth = HC ? 2.2 : 1.6;
          ctx.beginPath();
          ctx.arc(gx, gy, grad, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = rgbStr(ELEM_RGB[i], 0.9);
          ctx.fillText(ELEMENTS[i].name, gx, gy - grad - 8);
        });
        ctx.restore();
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  // ── Pointer: drag to rotate, tap to select ──
  const onDown = (e: React.PointerEvent) => {
    dragging.current = true;
    moved.current = 0;
    last.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    moved.current += Math.abs(dx) + Math.abs(dy);
    yaw.current += dx * 0.008;
    pitch.current = clamp(pitch.current + dy * 0.006, -1.4, 1.4);
    last.current = { x: e.clientX, y: e.clientY };
  };
  const onEnter = () => { hovering.current = true; };
  const onLeave = () => { hovering.current = false; dragging.current = false; };
  const onUp = (e: React.PointerEvent) => {
    dragging.current = false;
    if (moved.current < 6) {
      // treat as a click — hit-test the nearest projected dot
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const px = e.clientX - rect.left;
        const py = e.clientY - rect.top;
        let best: number | null = null;
        const bestD = 26 * 26;
        let bestZ = -Infinity;
        projected.current.forEach((d) => {
          const dist = (d.x - px) ** 2 + (d.y - py) ** 2;
          if (dist < bestD && d.z > bestZ) { best = d.i; bestZ = d.z; }
        });
        if (best !== null) setActive(best);
      }
    }
  };

  const sel = active !== null ? ELEMENTS[active] : null;
  const pos = sel ? place(sel, fx) : null;
  const dirty = fx.pan !== 0 || fx.reverb !== 0 || fx.delay !== 0 || fx.eq !== 0 || fx.level !== 0;

  const fxRows: { field: keyof Fx; name: string; note: string; min: number; max: number; value: string }[] = useMemo(
    () => [
      { field: "pan", name: "pan", note: "slides it across the stereo field.", min: -100, max: 100, value: panWord(pos?.pan ?? 0) },
      { field: "level", name: "fader", note: "louder pulls it up front, quieter sends it back.", min: -100, max: 100, value: levelWord(fx.level) },
      { field: "reverb", name: "reverb", note: "wet send. pushes it back and widens it.", min: 0, max: 100, value: sendWord(fx.reverb) },
      { field: "delay", name: "delay", note: "echo throws. add depth and stereo spread.", min: 0, max: 100, value: sendWord(fx.delay) },
      { field: "eq", name: "eq tone", note: "bright lifts it up and forward, dark drops it back.", min: -100, max: 100, value: toneWord(fx.eq) },
    ],
    [pos?.pan, fx.level, fx.reverb, fx.delay, fx.eq],
  );

  return (
    <div ref={rootRef} className={`ctrla-mixglobe-wrap${contrast ? " is-hc" : ""}${isFull ? " is-full" : ""}`}>
      {/* Classroom toolbar */}
      <div className="ctrla-mixglobe-toolbar">
        <div className="ctrla-mixglobe-toolgroup">
          {mode === "free" ? (
            <>
              <button type="button" className="ctrla-mixglobe-tool" onClick={() => copyLink("mix", "share link copied")}>Share mix</button>
              <button type="button" className="ctrla-mixglobe-tool" onClick={() => copyLink("mixtarget", "challenge link copied")}>Set challenge</button>
            </>
          ) : (
            <span className="ctrla-mixglobe-tag">Challenge mode</span>
          )}
          <button type="button" className="ctrla-mixglobe-tool" onClick={resetAll}>Reset all</button>
        </div>
        <div className="ctrla-mixglobe-toolgroup">
          <button type="button" className="ctrla-mixglobe-tool" data-on={contrast} onClick={() => setContrast((c) => !c)}>
            {contrast ? "Standard view" : "High contrast"}
          </button>
          <button type="button" className="ctrla-mixglobe-tool" onClick={toggleFullscreen}>{isFull ? "Exit present" : "Present"}</button>
        </div>
      </div>

      {/* Challenge banner */}
      {mode === "challenge" && (
        <div className="ctrla-mixglobe-challenge">
          <div className="ctrla-mixglobe-challenge-row">
            <p className="ctrla-mixglobe-challenge-copy">
              <strong>Recreate the mix.</strong> Move each sound onto its dashed target ring, then check your match.
            </p>
            <div className="ctrla-mixglobe-challenge-actions">
              {score && (
                <span className="ctrla-mixglobe-score" data-tier={score.overall >= 90 ? "a" : score.overall >= 70 ? "b" : "c"}>
                  {score.overall}% match
                </span>
              )}
              <button type="button" className="ctrla-mixglobe-tool is-primary" onClick={checkMatch}>Check match</button>
              <button type="button" className="ctrla-mixglobe-tool" onClick={exitChallenge}>Exit</button>
            </div>
          </div>
          {score && (
            <div className="ctrla-mixglobe-scorelist">
              {Object.keys(score.per).map((k) => {
                const i = Number(k);
                return (
                  <span key={k} className="ctrla-mixglobe-scoreitem" style={{ ["--c" as string]: ELEMENTS[i].color }}>
                    <span aria-hidden className="ctrla-mixglobe-chip-dot" />
                    {ELEMENTS[i].name} · {score.per[i]}%
                  </span>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className="ctrla-mixglobe">
      <div
        className="ctrla-mixglobe-stage"
        style={{
          border: "1px solid rgba(240,230,224,0.16)",
          background: "radial-gradient(130% 130% at 50% 42%, #120b22 0%, #0a0616 70%, #07040f 100%)",
        }}
      >
        <canvas
          ref={canvasRef}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerEnter={onEnter}
          onPointerLeave={onLeave}
          className="ctrla-mixglobe-canvas"
          style={{ width: "100%", height: "100%", display: "block", touchAction: "none" }}
        />
        <span className="ctrla-mixglobe-hint" style={{ fontFamily: ed.mono, color: "rgba(240,230,224,0.5)" }}>
          hover to hold · drag to rotate · tap a sound
        </span>
      </div>

      {/* Legend + effects panel */}
      <div className="ctrla-mixglobe-legend">
        <span style={{ display: "inline-flex", alignItems: "center", gap: 9, marginBottom: 16 }}>
          <span aria-hidden style={{ width: 18, height: 2, background: accent }} />
          <span style={{ fontFamily: ed.mono, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: accent }}>
            Pick a sound, ride the effects
          </span>
        </span>

        {/* Element picker */}
        <div className="ctrla-mixglobe-chips">
          {ELEMENTS.map((el, i) => (
            <button
              key={el.name}
              type="button"
              className="ctrla-mixglobe-chip"
              data-on={active === i}
              style={{ ["--c" as string]: el.color }}
              onClick={() => setActive(i)}
            >
              <span aria-hidden className="ctrla-mixglobe-chip-dot" />
              {el.name}
            </button>
          ))}
        </div>

        {sel && pos ? (
          <div>
            <h4 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(24px,3vw,34px)", letterSpacing: "-0.02em", color: ed.ink, margin: "0 0 12px", textTransform: "lowercase" }}>
              <span style={{ display: "inline-block", width: 12, height: 12, borderRadius: "50%", background: sel.color, marginRight: 10, verticalAlign: "middle" }} />
              {sel.name}
            </h4>
            <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.7vw,18px)", lineHeight: 1.6, color: ed.inkSoft, margin: "0 0 18px" }}>
              {sel.role}
            </p>

            {/* live position readout (updates as effects move it) */}
            <div className="ctrla-mixglobe-axes">
              <AxisReadout label="pan" value={panWord(pos.pan)} accent={accent} />
              <AxisReadout label="depth" value={depthWord(pos.depth)} accent={accent} />
              <AxisReadout label="frequency" value={freqWord(pos.freq)} accent={accent} />
            </div>

            {/* the effects rack */}
            <div className="ctrla-fx" style={{ ["--accent" as string]: sel.color }}>
              <div className="ctrla-fx-head">
                <span className="ctrla-fx-title">Effects · {sel.name}</span>
                {dirty && (
                  <button type="button" className="ctrla-fx-reset" onClick={resetFx}>
                    reset to mix
                  </button>
                )}
              </div>
              {fxRows.map((row) => (
                <div key={row.field} className="ctrla-fx-row">
                  <div className="ctrla-fx-rowhead">
                    <span className="ctrla-fx-name">{row.name}</span>
                    <span className="ctrla-fx-val">{row.value}</span>
                  </div>
                  <input
                    type="range"
                    className="ctrla-fx-range"
                    min={row.min}
                    max={row.max}
                    step={1}
                    value={Math.round(fx[row.field] * 100)}
                    onChange={(e) => setField(row.field, Number(e.target.value) / 100)}
                    aria-label={`${row.name} for ${sel.name}`}
                  />
                  <p className="ctrla-fx-note">{row.note}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p style={{ fontFamily: ed.body, fontSize: 17, lineHeight: 1.6, color: ed.inkSoft, margin: 0 }}>
            pick a sound above, or tap a dot, then ride its effects.
          </p>
        )}

        <div style={{ marginTop: 26, paddingTop: 20, borderTop: `1px solid ${ed.hair}`, display: "grid", gap: 10 }}>
          <Axis line="front to back" note="dry sounds sit up front. reverb, delay, and a lower fader push them to the back." />
          <Axis line="left to right" note="panning slides a sound across the stereo field." />
          <Axis line="low to high" note="eq stacks the mix from sub to air." />
        </div>
      </div>
      </div>

      {toast && <div className="ctrla-mixglobe-toast">{toast}</div>}
    </div>
  );
}

function AxisReadout({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div>
      <span style={{ display: "block", fontFamily: ed.mono, fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: ed.inkFaint, marginBottom: 5 }}>{label}</span>
      <span style={{ fontFamily: ed.grotesque, fontWeight: 700, fontSize: "clamp(13px,1.5vw,16px)", color: accent, textTransform: "lowercase" }}>{value}</span>
    </div>
  );
}

function Axis({ line, note }: { line: string; note: string }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "baseline" }}>
      <span style={{ flexShrink: 0, fontFamily: ed.mono, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: ed.ink, minWidth: 92 }}>{line}</span>
      <span style={{ fontFamily: ed.body, fontSize: 14, lineHeight: 1.5, color: ed.inkFaint }}>{note}</span>
    </div>
  );
}

// ── helpers ──
function clamp(n: number, lo: number, hi: number) { return Math.min(hi, Math.max(lo, n)); }
function panWord(p: number) {
  if (Math.abs(p) < 0.08) return "dead center";
  const side = p < 0 ? "left" : "right";
  const amt = Math.abs(p) > 0.6 ? "hard " : Math.abs(p) > 0.25 ? "" : "soft ";
  return `${amt}${side}`;
}
function depthWord(d: number) {
  if (d < 0.15) return "bone dry, up front";
  if (d < 0.4) return "mostly dry";
  if (d < 0.7) return "some room";
  return "wet, pushed back";
}
function freqWord(f: number) {
  if (f < -0.5) return "sub / low";
  if (f < 0) return "low mid";
  if (f < 0.5) return "mid";
  return "high / air";
}
function sendWord(v: number) {
  if (v < 0.04) return "off";
  if (v < 0.34) return "a touch";
  if (v < 0.7) return "halfway";
  return "drenched";
}
function levelWord(v: number) {
  if (Math.abs(v) < 0.06) return "unity";
  const amt = Math.abs(v) > 0.6 ? "way " : Math.abs(v) > 0.25 ? "" : "a bit ";
  return v > 0 ? `${amt}up` : `${amt}down`;
}
function toneWord(v: number) {
  if (Math.abs(v) < 0.06) return "flat";
  const amt = Math.abs(v) > 0.6 ? "very " : Math.abs(v) > 0.25 ? "" : "slightly ";
  return v > 0 ? `${amt}bright` : `${amt}dark`;
}
