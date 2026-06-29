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

export default function MixGlobe({ accent = ed.amber }: { accent?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [active, setActive] = useState<number | null>(0);
  const [fxMap, setFxMap] = useState<Record<number, Fx>>({});

  // Mutable state the draw loop reads without restarting.
  const yaw = useRef(0.5);
  const pitch = useRef(-0.32);
  const dragging = useRef(false);
  const moved = useRef(0);
  const last = useRef({ x: 0, y: 0 });
  const activeRef = useRef<number | null>(0);
  const fxRef = useRef<Record<number, Fx>>({});
  const projected = useRef<{ x: number; y: number; z: number; i: number }[]>([]);
  const spin = useRef(true);

  useEffect(() => { activeRef.current = active; }, [active]);
  useEffect(() => { fxRef.current = fxMap; }, [fxMap]);

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

      if (spin.current && !dragging.current) yaw.current += 0.0024;
      const Y = yaw.current;
      const P = pitch.current;

      // Sphere body — a soft cosmic fill so dots read against depth.
      const g = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, R * 0.2, cx, cy, R);
      g.addColorStop(0, "rgba(78,61,115,0.10)");
      g.addColorStop(1, "rgba(22,12,40,0.04)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fill();

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
        const alpha = 0.05 + Math.max(0, (za + 1) / 2) * 0.16;
        ctx.strokeStyle = `rgba(22,12,40,${alpha.toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      };
      lats.forEach(drawLine);
      lons.forEach(drawLine);

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
        const depthT = (d.z + 1) / 2; // 0 back .. 1 front
        const rad = (4 + depthT * 7) * d.size;
        const isActive = acc === d.i;
        const alpha = 0.4 + depthT * 0.6;

        // glow — stretched horizontally when reverb/delay widen the source
        const spread = 1 + d.width * 0.7;
        ctx.save();
        ctx.translate(d.x, d.y);
        ctx.scale(spread, 1);
        const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, rad * 3.4);
        glow.addColorStop(0, hexA(el.color, 0.4 * alpha));
        glow.addColorStop(1, hexA(el.color, 0));
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(0, 0, rad * 3.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // body
        ctx.beginPath();
        ctx.fillStyle = hexA(el.color, alpha);
        ctx.arc(d.x, d.y, rad, 0, Math.PI * 2);
        ctx.fill();

        // active ring
        if (isActive) {
          ctx.beginPath();
          ctx.strokeStyle = hexA(el.color, 0.95);
          ctx.lineWidth = 2;
          ctx.arc(d.x, d.y, rad + 6, 0, Math.PI * 2);
          ctx.stroke();
        }

        // label — only the front hemisphere and the active dot get named,
        // so clustered dots on the far side never pile their labels up.
        if (isActive || depthT > 0.58) {
          ctx.font = `600 11px 'Neue Montreal', sans-serif`;
          ctx.fillStyle = isActive
            ? "rgba(22,12,40,0.95)"
            : `rgba(22,12,40,${(depthT * 0.72).toFixed(3)})`;
          ctx.textAlign = "left";
          ctx.textBaseline = "middle";
          ctx.fillText(el.name, d.x + rad + 7, d.y);
        }
      });

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
    pitch.current = clamp(pitch.current + dy * 0.006, -1.1, 1.1);
    last.current = { x: e.clientX, y: e.clientY };
  };
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
    <div className="ctrla-mixglobe">
      <div className="ctrla-mixglobe-stage" style={{ border: `1px solid ${ed.hair}`, background: ed.panel }}>
        <canvas
          ref={canvasRef}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          style={{ width: "100%", height: "100%", display: "block", touchAction: "none", cursor: dragging.current ? "grabbing" : "grab" }}
        />
        <span className="ctrla-mixglobe-hint" style={{ fontFamily: ed.mono, color: ed.inkFaint }}>
          drag to spin · tap a sound
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
// Convert #rrggbb + alpha to rgba().
function hexA(hex: string, a: number) {
  const n = hex.replace("#", "");
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${Math.max(0, Math.min(1, a)).toFixed(3)})`;
}
