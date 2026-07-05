"use client";

// ═══════════════════════════════════════════════════════
// CTRL-A — LIGHT BENCH
// The lighting lesson ROV teaches: a scene is three lights.
// A bust sits on a table. You place a KEY (the main light and
// the whole mood), a FILL (how deep the shadows fall), and a
// BACK light (how the subject lifts off the backdrop). Each has
// an intensity and a colour temperature, warm to cool.
//
// Drag a light to move it. Ride its intensity and temp on the
// sliders. The scene re-lights live, and a readout puts the
// result into WORDS ("dramatic, warm, crushed shadows") the way
// a gaffer would call it. The full setup serializes to a
// shareable URL token, restored on load.
//
// Canvas-2D, no WebGL. Follows the house rules: 100% sizing,
// dimensions read from the parent, 0-dimension frames skipped,
// DPR capped at 2, ambient motion paused on interaction and
// under prefers-reduced-motion.
// ═══════════════════════════════════════════════════════

import { useEffect, useMemo, useRef, useState } from "react";
import { edLight as ed } from "./editorial";

type LightId = "key" | "fill" | "back";

type Light = {
  x: number; // 0..1 across the stage
  y: number; // 0..1 down the stage
  intensity: number; // 0..1
  temp: number; // -1 (warm ~3200K) .. 1 (cool ~6500K)
};

type Setup = Record<LightId, Light>;

const LIGHT_ORDER: LightId[] = ["key", "fill", "back"];

const LIGHT_META: Record<LightId, { label: string; role: string; color: string }> = {
  key: { label: "key", role: "the main light. it carves the mood and sets every shadow before anything else joins.", color: "#E3C24A" },
  fill: { label: "fill", role: "the answer to the key. it decides how deep the shadow side falls, from crushed to open and flat.", color: "#8E76B8" },
  back: { label: "back", role: "the separation light. it rims the edge and lifts the subject clean off the backdrop.", color: "#A56A67" },
};

// The pro default: honest three-point lighting a gaffer would light on instinct.
const DEFAULT: Setup = {
  key: { x: 0.32, y: 0.30, intensity: 0.9, temp: -0.12 },
  fill: { x: 0.70, y: 0.46, intensity: 0.4, temp: 0.06 },
  back: { x: 0.6, y: 0.16, intensity: 0.7, temp: 0.0 },
};

// Named looks. Each is a full setup, so a preset re-lights the whole scene.
const PRESETS: { name: string; setup: Setup }[] = [
  { name: "Rembrandt", setup: {
    key: { x: 0.26, y: 0.24, intensity: 0.96, temp: -0.22 },
    fill: { x: 0.74, y: 0.52, intensity: 0.14, temp: 0.0 },
    back: { x: 0.66, y: 0.15, intensity: 0.5, temp: -0.05 },
  } },
  { name: "High key", setup: {
    key: { x: 0.4, y: 0.28, intensity: 0.85, temp: 0.05 },
    fill: { x: 0.62, y: 0.4, intensity: 0.78, temp: 0.08 },
    back: { x: 0.55, y: 0.14, intensity: 0.6, temp: 0.1 },
  } },
  { name: "Noir", setup: {
    key: { x: 0.24, y: 0.3, intensity: 1.0, temp: -0.04 },
    fill: { x: 0.78, y: 0.56, intensity: 0.05, temp: 0.0 },
    back: { x: 0.72, y: 0.12, intensity: 0.86, temp: 0.16 },
  } },
];

// ── Colour temperature → RGB tint ──
// Warm end reads amber (tungsten), cool end reads a blue daylight white.
const NEUTRAL_RGB: RGB = [255, 246, 235];
const WARM_RGB: RGB = [255, 194, 138];
const COOL_RGB: RGB = [198, 219, 255];
type RGB = [number, number, number];
function lerpRgb(a: RGB, b: RGB, t: number): RGB {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}
function tempColor(temp: number): RGB {
  const t = clamp(temp, -1, 1);
  return t < 0 ? lerpRgb(NEUTRAL_RGB, WARM_RGB, Math.min(1, -t)) : lerpRgb(NEUTRAL_RGB, COOL_RGB, Math.min(1, t));
}
function rgba(c: RGB, a: number) {
  return `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
}

// ── Share / restore encoding ──
// The setup serializes as three comma groups joined by "~", in key/fill/back
// order: "x,y,intensity,temp" as integers (x/y/intensity 0..100, temp -100..100).
function encodeSetup(s: Setup): string {
  return LIGHT_ORDER.map((id) => {
    const l = s[id];
    return [Math.round(l.x * 100), Math.round(l.y * 100), Math.round(l.intensity * 100), Math.round(l.temp * 100)].join(",");
  }).join("~");
}
function decodeSetup(str: string): Setup | null {
  if (!str) return null;
  const groups = str.split("~");
  if (groups.length !== 3) return null;
  const out = {} as Setup;
  for (let i = 0; i < 3; i++) {
    const n = groups[i].split(",").map(Number);
    if (n.length !== 4 || n.some((v) => Number.isNaN(v))) return null;
    out[LIGHT_ORDER[i]] = {
      x: clamp(n[0] / 100, 0.05, 0.95),
      y: clamp(n[1] / 100, 0.05, 0.95),
      intensity: clamp(n[2] / 100, 0, 1),
      temp: clamp(n[3] / 100, -1, 1),
    };
  }
  return out;
}

// ── The readout: translate a setup into the words a gaffer would use ──
function describe(s: Setup) {
  const kI = s.key.intensity;
  const fI = s.fill.intensity;
  const bI = s.back.intensity;
  const ratio = kI / Math.max(fI, 0.05);
  const contrast: "high" | "mid" | "low" = ratio > 3.2 ? "high" : ratio > 1.7 ? "mid" : "low";
  const brightness = kI * 0.55 + fI * 0.33 + bI * 0.12;

  const totalI = Math.max(kI + fI + bI, 0.001);
  const tw = (s.key.temp * kI + s.fill.temp * fI + s.back.temp * bI) / totalI;
  const tempWord = tw < -0.28 ? "warm" : tw < -0.08 ? "softly warm" : tw < 0.12 ? "neutral" : tw < 0.32 ? "cool" : "clinical";

  const mood =
    brightness > 0.62 && contrast === "low" ? "high key" :
    brightness < 0.34 ? "moody" :
    contrast === "high" ? "dramatic" :
    "natural";

  const shadow =
    contrast === "high" ? "crushed shadows" :
    contrast === "mid" ? "shaped shadows" :
    "flat, open shadows";

  // Key geometry → the classic look name and where the light sits.
  const dx = s.key.x - 0.5;
  const side = dx < -0.09 ? "from camera left" : dx > 0.09 ? "from camera right" : "head on";
  const height = s.key.y < 0.27 ? "from above" : s.key.y > 0.6 ? "from below" : "near eye level";
  const look =
    s.key.y > 0.62 ? "uplit and uneasy" :
    contrast === "low" && brightness > 0.6 ? "flat and editorial" :
    Math.abs(dx) < 0.09 && s.key.y < 0.28 && contrast !== "low" ? "butterfly, glamour" :
    Math.abs(dx) > 0.09 && contrast !== "low" ? "a Rembrandt side light" :
    "an even, gentle wash";

  const sep = bI > 0.45 ? "a clean rim lifts it off the backdrop" : bI > 0.2 ? "a faint edge separates it" : "it sits flat against the backdrop";

  const headline = `${mood} · ${tempWord} · ${shadow}`;
  const sentence = `${cap(look)}, ${side} and ${height}. ${cap(sep)}. The whole frame reads ${tempWord} and ${mood}.`;
  const tier: "a" | "b" | "c" = contrast === "high" ? "c" : contrast === "mid" ? "b" : "a";
  return { headline, sentence, contrast, tempWord, mood, tier };
}

export default function LightBench({ accent = ed.plum }: { accent?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const [setup, setSetup] = useState<Setup>(DEFAULT);
  const [selected, setSelected] = useState<LightId>("key");
  const [contrast, setContrast] = useState(false);
  const [isFull, setIsFull] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Mutable mirrors the draw loop reads without restarting.
  const setupRef = useRef<Setup>(DEFAULT);
  const selectedRef = useRef<LightId>("key");
  const contrastRef = useRef(false);
  const draggingRef = useRef<LightId | null>(null);
  const hoveringRef = useRef(false);
  const handleHits = useRef<{ id: LightId; x: number; y: number }[]>([]);
  const ambient = useRef(true);

  useEffect(() => { setupRef.current = setup; }, [setup]);
  useEffect(() => { selectedRef.current = selected; }, [selected]);
  useEffect(() => { contrastRef.current = contrast; }, [contrast]);

  // Restore a shared setup from the URL on first load.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const decoded = decodeSetup(params.get("light") || "");
    if (decoded) setSetup(decoded);
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

  const shareLink = () => {
    const token = encodeSetup(setup);
    const url = `${window.location.origin}${window.location.pathname}?light=${token}`;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(() => setToast("lighting link copied")).catch(() => window.prompt("Copy this link:", url));
    } else {
      window.prompt("Copy this link:", url);
    }
  };
  const reset = () => { setSetup(DEFAULT); ambient.current = true; };
  const applyPreset = (s: Setup) => { setSetup(s); ambient.current = false; };
  const toggleFullscreen = () => {
    const el = rootRef.current;
    if (!el) return;
    if (!document.fullscreenElement) el.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  const setField = (field: "intensity" | "temp", value: number) => {
    setSetup((s) => ({ ...s, [selected]: { ...s[selected], [field]: value } }));
    ambient.current = false; // a hand on the light means the user is studying it
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) ambient.current = false;

    let raf = 0;
    const start = performance.now();

    // A few dust motes drifting in the key beam, for a faint sense of life.
    const motes = Array.from({ length: 14 }, () => ({
      px: Math.random(),
      py: Math.random(),
      sp: 0.2 + Math.random() * 0.5,
      ph: Math.random() * Math.PI * 2,
    }));

    // Trace the bust silhouette (head + neck + shoulders) as one path so it can
    // be filled and clipped as a single form.
    const traceSubject = (g: ReturnType<typeof geom>) => {
      ctx.beginPath();
      ctx.arc(g.cx, g.headCy, g.headR, 0, Math.PI * 2);
      const neckHalf = g.headR * 0.42;
      const shHalf = g.headR * 2.4;
      const sTop = g.headCy + g.headR * 0.55;
      const shTop = g.headCy + g.headR * 1.15;
      const round = g.headR * 0.6;
      ctx.moveTo(g.cx - neckHalf, sTop);
      ctx.lineTo(g.cx - neckHalf, shTop - g.headR * 0.2);
      ctx.quadraticCurveTo(g.cx - shHalf, shTop, g.cx - shHalf, shTop + round);
      ctx.lineTo(g.cx - shHalf, g.baseY);
      ctx.lineTo(g.cx + shHalf, g.baseY);
      ctx.lineTo(g.cx + shHalf, shTop + round);
      ctx.quadraticCurveTo(g.cx + shHalf, shTop, g.cx + neckHalf, shTop - g.headR * 0.2);
      ctx.lineTo(g.cx + neckHalf, sTop);
      ctx.closePath();
    };

    const geom = (w: number, h: number) => {
      const cx = w * 0.5;
      const headR = Math.min(w, h) * 0.145;
      const headCy = h * 0.4;
      const baseY = h * 0.86;
      return { cx, headR, headCy, baseY };
    };

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

      const g = geom(w, h);
      const s = setupRef.current;
      const HC = contrastRef.current;
      const still = draggingRef.current !== null || !ambient.current;
      const t = (performance.now() - start) / 1000;

      // Per-light effective intensity: a whisper of flicker unless paused.
      const eff = (id: LightId, phase: number) => {
        const base = s[id].intensity;
        if (still || reduce) return base;
        return base * (1 + 0.02 * Math.sin(t * 3 + phase));
      };
      const px = (l: Light) => ({ x: l.x * w, y: l.y * h });

      const kE = eff("key", 0);
      const fE = eff("fill", 2.1);
      const bE = eff("back", 4.2);

      // ── Backdrop base ──
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, "#141020");
      bg.addColorStop(0.7, "#0c0817");
      bg.addColorStop(1, "#080510");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // ── Light pools spilling on the backdrop (additive) ──
      ctx.globalCompositeOperation = "lighter";
      const pool = (l: Light, e: number, radius: number, peak: number) => {
        const p = px(l);
        const col = tempColor(l.temp);
        const gr = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
        gr.addColorStop(0, rgba(col, e * peak));
        gr.addColorStop(1, rgba(col, 0));
        ctx.fillStyle = gr;
        ctx.fillRect(0, 0, w, h);
      };
      pool(s.key, kE, Math.min(w, h) * 0.95, 0.1);
      pool(s.fill, fE, Math.min(w, h) * 0.95, 0.07);
      pool(s.back, bE, Math.min(w, h) * 0.62, 0.22); // hotter, tighter halo → separation
      ctx.globalCompositeOperation = "source-over";

      // ── Table plane ──
      const tableTop = g.baseY - 2;
      const tg = ctx.createLinearGradient(0, tableTop, 0, h);
      tg.addColorStop(0, "rgba(28,22,40,0.9)");
      tg.addColorStop(1, "rgba(10,7,18,0.95)");
      ctx.fillStyle = tg;
      ctx.fillRect(0, tableTop, w, h - tableTop);
      // table catches the key: a soft pool on its surface, opposite side lit
      ctx.globalCompositeOperation = "lighter";
      const kp = px(s.key);
      const tableGlow = ctx.createRadialGradient(kp.x, g.baseY + 8, 0, kp.x, g.baseY + 8, Math.min(w, h) * 0.6);
      tableGlow.addColorStop(0, rgba(tempColor(s.key.temp), kE * 0.12));
      tableGlow.addColorStop(1, rgba(tempColor(s.key.temp), 0));
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, tableTop, w, h - tableTop);
      ctx.clip();
      ctx.fillStyle = tableGlow;
      ctx.fillRect(0, tableTop, w, h - tableTop);
      ctx.restore();
      ctx.globalCompositeOperation = "source-over";

      // ── Contact / cast shadow on the table, thrown opposite the key ──
      const shadowDir = g.cx - kp.x; // push away from key horizontally
      const sxOff = clamp(shadowDir * 0.5, -g.headR * 2, g.headR * 2);
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, tableTop, w, h - tableTop);
      ctx.clip();
      const csh = ctx.createRadialGradient(g.cx + sxOff, g.baseY + 6, 2, g.cx + sxOff, g.baseY + 6, g.headR * 3.2);
      csh.addColorStop(0, `rgba(0,0,0,${(0.5 * (0.4 + kE * 0.6)).toFixed(3)})`);
      csh.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = csh;
      ctx.fillRect(0, tableTop, w, h - tableTop);
      ctx.restore();

      // ── Subject silhouette (dark base) ──
      traceSubject(g);
      ctx.fillStyle = "#0b0912";
      ctx.fill();

      // ── Light the subject: clip to silhouette, add each light additively ──
      ctx.save();
      traceSubject(g);
      ctx.clip();
      ctx.globalCompositeOperation = "lighter";

      const litForm = (l: Light, e: number, peak: number, from: "front" | "back") => {
        const p = px(l);
        const col = tempColor(l.temp);
        // Highlight seats toward the light, offset from the head centre so the
        // head reads as a lit sphere with a natural terminator.
        let hlx = p.x;
        let hly = p.y;
        let radius = Math.min(w, h) * 0.72;
        if (from === "front") {
          const dx = p.x - g.cx;
          const dy = p.y - g.headCy;
          const len = Math.hypot(dx, dy) || 1;
          hlx = g.cx + (dx / len) * g.headR * 0.75;
          hly = g.headCy + (dy / len) * g.headR * 0.75;
        } else {
          radius = g.headR * 1.7; // tight, so the back light reads as a rim/kicker
        }
        const gr = ctx.createRadialGradient(hlx, hly, from === "back" ? g.headR * 0.2 : g.headR * 0.1, hlx, hly, radius);
        gr.addColorStop(0, rgba(col, Math.min(1, e * peak)));
        gr.addColorStop(from === "back" ? 0.55 : 0.7, rgba(col, e * peak * 0.28));
        gr.addColorStop(1, rgba(col, 0));
        ctx.fillStyle = gr;
        ctx.fillRect(0, 0, w, h);
      };
      litForm(s.key, kE, 0.95, "front");
      litForm(s.fill, fE, 0.8, "front");
      litForm(s.back, bE, 1.0, "back");
      ctx.restore();

      // ── Form shading: darken under the chin so the head reads off the chest ──
      ctx.save();
      traceSubject(g);
      ctx.clip();
      const occ = ctx.createRadialGradient(g.cx, g.headCy + g.headR * 1.05, 2, g.cx, g.headCy + g.headR * 1.05, g.headR * 1.4);
      occ.addColorStop(0, "rgba(0,0,0,0.5)");
      occ.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = occ;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();

      // ── Silhouette hairline so the edge always reads ──
      traceSubject(g);
      ctx.strokeStyle = "rgba(240,230,224,0.08)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // ── Dust motes in the key beam (ambient) ──
      if (!still && !reduce) {
        ctx.globalCompositeOperation = "lighter";
        const col = tempColor(s.key.temp);
        motes.forEach((m) => {
          const y = (m.py + t * 0.02 * m.sp) % 1;
          const x = m.px + Math.sin(t * m.sp + m.ph) * 0.02;
          const mx = (kp.x + (g.cx - kp.x) * 0.5) + (x - 0.5) * g.headR * 4;
          const my = y * h * 0.7 + h * 0.12;
          const a = 0.05 + 0.05 * Math.sin(t * m.sp * 2 + m.ph);
          ctx.fillStyle = rgba(col, Math.max(0, a) * kE);
          ctx.beginPath();
          ctx.arc(mx, my, 1.2, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalCompositeOperation = "source-over";
      }

      // ── Light handles ──
      const hits: { id: LightId; x: number; y: number }[] = [];
      LIGHT_ORDER.forEach((id) => {
        const l = s[id];
        const p = px(l);
        hits.push({ id, x: p.x, y: p.y });
        const col = tempColor(l.temp);
        const isSel = selectedRef.current === id;
        const e = id === "key" ? kE : id === "fill" ? fE : bE;

        // glow keyed to intensity
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 26 + e * 22);
        glow.addColorStop(0, rgba(col, 0.5 + e * 0.4));
        glow.addColorStop(1, rgba(col, 0));
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 26 + e * 22, 0, Math.PI * 2);
        ctx.fill();

        // body
        ctx.beginPath();
        ctx.arc(p.x, p.y, isSel ? 8 : 6.5, 0, Math.PI * 2);
        ctx.fillStyle = rgba(col, 0.98);
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgba(12,8,20,0.85)";
        ctx.stroke();

        if (isSel) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 13, 0, Math.PI * 2);
          ctx.strokeStyle = rgba(col, 0.9);
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // label
        const lf = HC ? 13 : 10;
        ctx.font = `600 ${lf}px 'Neue Montreal', sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const label = LIGHT_META[id].label.toUpperCase();
        const tw2 = ctx.measureText(label).width;
        const ly = p.y - (isSel ? 22 : 18);
        ctx.fillStyle = "rgba(10,7,18,0.7)";
        ctx.fillRect(p.x - tw2 / 2 - 5, ly - lf * 0.7, tw2 + 10, lf * 1.5);
        ctx.fillStyle = "rgba(245,238,230,0.96)";
        ctx.fillText(label, p.x, ly);
      });
      handleHits.current = hits;

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  // ── Pointer: drag a light handle, tap to select ──
  const pickHandle = (e: React.PointerEvent): LightId | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    let best: LightId | null = null;
    let bestD = 30 * 30;
    handleHits.current.forEach((hnd) => {
      const d = (hnd.x - x) ** 2 + (hnd.y - y) ** 2;
      if (d < bestD) { bestD = d; best = hnd.id; }
    });
    return best;
  };
  const onDown = (e: React.PointerEvent) => {
    const hit = pickHandle(e);
    if (hit) {
      draggingRef.current = hit;
      setSelected(hit);
      ambient.current = false;
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    }
  };
  const onMove = (e: React.PointerEvent) => {
    const id = draggingRef.current;
    if (!id) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const nx = clamp((e.clientX - rect.left) / rect.width, 0.05, 0.95);
    const ny = clamp((e.clientY - rect.top) / rect.height, 0.05, 0.95);
    setSetup((s) => ({ ...s, [id]: { ...s[id], x: nx, y: ny } }));
  };
  const onUp = () => { draggingRef.current = null; };
  const onEnter = () => { hoveringRef.current = true; };
  const onLeave = () => { hoveringRef.current = false; draggingRef.current = null; };

  const words = useMemo(() => describe(setup), [setup]);
  const sel = setup[selected];
  const meta = LIGHT_META[selected];
  const dirty = JSON.stringify(setup) !== JSON.stringify(DEFAULT);

  return (
    <div ref={rootRef} className={`ctrla-mixglobe-wrap${contrast ? " is-hc" : ""}${isFull ? " is-full" : ""}`}>
      {/* Toolbar */}
      <div className="ctrla-mixglobe-toolbar">
        <div className="ctrla-mixglobe-toolgroup">
          <button type="button" className="ctrla-mixglobe-tool" onClick={shareLink}>Share look</button>
          {PRESETS.map((p) => (
            <button key={p.name} type="button" className="ctrla-mixglobe-tool" onClick={() => applyPreset(p.setup)}>{p.name}</button>
          ))}
          {dirty && <button type="button" className="ctrla-mixglobe-tool" onClick={reset}>Reset</button>}
        </div>
        <div className="ctrla-mixglobe-toolgroup">
          <button type="button" className="ctrla-mixglobe-tool" data-on={contrast} onClick={() => setContrast((c) => !c)}>
            {contrast ? "Standard view" : "High contrast"}
          </button>
          <button type="button" className="ctrla-mixglobe-tool" onClick={toggleFullscreen}>{isFull ? "Exit present" : "Present"}</button>
        </div>
      </div>

      <div className="ctrla-mixglobe">
        <div
          className="ctrla-mixglobe-stage"
          style={{
            border: "1px solid rgba(240,230,224,0.16)",
            background: "#0a0714",
            aspectRatio: "4 / 5",
            maxHeight: 600,
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
            drag a light · pick key, fill, back · ride intensity + temp
          </span>
        </div>

        {/* Controls + words */}
        <div className="ctrla-mixglobe-legend">
          <span style={{ display: "inline-flex", alignItems: "center", gap: 9, marginBottom: 16 }}>
            <span aria-hidden style={{ width: 18, height: 2, background: accent }} />
            <span style={{ fontFamily: ed.mono, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: accent }}>
              Light it, and it speaks
            </span>
          </span>

          {/* The words readout — the whole point of the bench */}
          <div
            style={{
              border: `1px solid ${ed.hair}`,
              borderLeft: `3px solid ${accent}`,
              background: "rgba(22,12,40,0.04)",
              padding: "16px 18px",
              marginBottom: 22,
            }}
          >
            <span style={{ display: "block", fontFamily: ed.mono, fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: ed.inkFaint, marginBottom: 8 }}>
              This setup reads as
            </span>
            <p style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(20px,2.6vw,30px)", letterSpacing: "-0.02em", lineHeight: 1.05, color: ed.ink, margin: "0 0 10px", textTransform: "lowercase" }}>
              {words.headline}
            </p>
            <p style={{ fontFamily: ed.body, fontSize: "clamp(14px,1.6vw,17px)", lineHeight: 1.5, color: "rgba(22,12,40,0.8)", margin: 0 }}>
              {words.sentence}
            </p>
          </div>

          {/* Light picker */}
          <div className="ctrla-mixglobe-chips">
            {LIGHT_ORDER.map((id) => (
              <button
                key={id}
                type="button"
                className="ctrla-mixglobe-chip"
                data-on={selected === id}
                style={{ ["--c" as string]: LIGHT_META[id].color }}
                onClick={() => setSelected(id)}
              >
                <span aria-hidden className="ctrla-mixglobe-chip-dot" />
                {LIGHT_META[id].label}
              </button>
            ))}
          </div>

          <h4 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(24px,3vw,34px)", letterSpacing: "-0.02em", color: ed.ink, margin: "0 0 12px", textTransform: "lowercase" }}>
            <span style={{ display: "inline-block", width: 12, height: 12, borderRadius: "50%", background: meta.color, marginRight: 10, verticalAlign: "middle" }} />
            {meta.label} light
          </h4>
          <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.7vw,18px)", lineHeight: 1.6, color: ed.inkSoft, margin: "0 0 18px" }}>
            {meta.role}
          </p>

          {/* live position readout */}
          <div className="ctrla-mixglobe-axes">
            <AxisReadout label="height" value={heightWord(sel.y)} accent={accent} />
            <AxisReadout label="side" value={sideWord(sel.x)} accent={accent} />
            <AxisReadout label="output" value={intensityWord(sel.intensity)} accent={accent} />
          </div>

          {/* intensity + temp sliders */}
          <div className="ctrla-fx" style={{ ["--accent" as string]: meta.color }}>
            <div className="ctrla-fx-head">
              <span className="ctrla-fx-title">{meta.label} · intensity + temp</span>
            </div>
            <div className="ctrla-fx-row">
              <div className="ctrla-fx-rowhead">
                <span className="ctrla-fx-name">intensity</span>
                <span className="ctrla-fx-val">{intensityWord(sel.intensity)}</span>
              </div>
              <input
                type="range"
                className="ctrla-fx-range"
                min={0}
                max={100}
                step={1}
                value={Math.round(sel.intensity * 100)}
                onChange={(e) => setField("intensity", Number(e.target.value) / 100)}
                aria-label={`intensity for the ${meta.label} light`}
              />
              <p className="ctrla-fx-note">brighter pulls the eye and deepens the shadow it casts.</p>
            </div>
            <div className="ctrla-fx-row">
              <div className="ctrla-fx-rowhead">
                <span className="ctrla-fx-name">temperature</span>
                <span className="ctrla-fx-val">{tempWordLabel(sel.temp)}</span>
              </div>
              <input
                type="range"
                className="ctrla-fx-range"
                min={-100}
                max={100}
                step={1}
                value={Math.round(sel.temp * 100)}
                onChange={(e) => setField("temp", Number(e.target.value) / 100)}
                aria-label={`colour temperature for the ${meta.label} light`}
              />
              <p className="ctrla-fx-note">warm reads like tungsten and evening. cool reads like daylight and clinical.</p>
            </div>
          </div>

          <div style={{ marginTop: 26, paddingTop: 20, borderTop: `1px solid ${ed.hair}`, display: "grid", gap: 10 }}>
            <Axis line="key" note="the main light. its position and height decide the whole mood." />
            <Axis line="fill" note="lifts the shadow side. low fill is dramatic, high fill is flat and even." />
            <Axis line="back" note="rims the edge and separates the subject from the backdrop." />
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
      <span style={{ flexShrink: 0, fontFamily: ed.mono, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: ed.ink, minWidth: 44 }}>{line}</span>
      <span style={{ fontFamily: ed.body, fontSize: 14, lineHeight: 1.5, color: ed.inkFaint }}>{note}</span>
    </div>
  );
}

// ── helpers ──
function clamp(n: number, lo: number, hi: number) { return Math.min(hi, Math.max(lo, n)); }
function cap(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }
function heightWord(y: number) {
  if (y < 0.24) return "high, from above";
  if (y < 0.4) return "raised";
  if (y < 0.6) return "eye level";
  return "low, from below";
}
function sideWord(x: number) {
  const d = x - 0.5;
  if (Math.abs(d) < 0.09) return "head on";
  const amt = Math.abs(d) > 0.28 ? "far " : Math.abs(d) > 0.16 ? "" : "just ";
  return `${amt}${d < 0 ? "left" : "right"}`;
}
function intensityWord(v: number) {
  if (v < 0.06) return "off";
  if (v < 0.28) return "a whisper";
  if (v < 0.55) return "soft";
  if (v < 0.8) return "strong";
  return "full blast";
}
function tempWordLabel(v: number) {
  if (Math.abs(v) < 0.06) return "neutral";
  const amt = Math.abs(v) > 0.55 ? "very " : Math.abs(v) > 0.25 ? "" : "slightly ";
  return v < 0 ? `${amt}warm` : `${amt}cool`;
}
