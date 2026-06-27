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
// Canvas follows the house rules: 100% sizing, dimensions read
// from the parent, 0-dimension frames skipped.
// ═══════════════════════════════════════════════════════

import { useEffect, useRef, useState } from "react";
import { edLight as ed } from "./editorial";

type Element = {
  name: string;
  pan: number; // -1 (hard left) .. 1 (hard right)
  freq: number; // -1 (sub) .. 1 (air)
  depth: number; // 0 (bone dry, front) .. 1 (drenched, back)
  color: string;
  role: string;
};

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

export default function MixGlobe({ accent = ed.amber }: { accent?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [active, setActive] = useState<number | null>(0);

  // Mutable state the draw loop reads without restarting.
  const yaw = useRef(0.5);
  const pitch = useRef(-0.32);
  const dragging = useRef(false);
  const moved = useRef(0);
  const last = useRef({ x: 0, y: 0 });
  const activeRef = useRef<number | null>(0);
  const projected = useRef<{ x: number; y: number; z: number; i: number }[]>([]);
  const spin = useRef(true);

  useEffect(() => { activeRef.current = active; }, [active]);

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

      // Sound elements — project, then paint back-to-front.
      const acc = activeRef.current;
      const dots = ELEMENTS.map((el, i) => {
        const r = rotate(el.pan * 0.82, el.freq * 0.82, (0.5 - el.depth) * 1.62, Y, P);
        return { x: cx + r.x * R, y: cy - r.y * R, z: r.z, i };
      });
      projected.current = dots;
      dots.sort((a, b) => a.z - b.z);

      dots.forEach((d) => {
        const el = ELEMENTS[d.i];
        const depthT = (d.z + 1) / 2; // 0 back .. 1 front
        const rad = 4 + depthT * 7;
        const isActive = acc === d.i;
        const alpha = 0.4 + depthT * 0.6;

        // glow
        ctx.beginPath();
        const glow = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, rad * 3.4);
        glow.addColorStop(0, hexA(el.color, 0.4 * alpha));
        glow.addColorStop(1, hexA(el.color, 0));
        ctx.fillStyle = glow;
        ctx.arc(d.x, d.y, rad * 3.4, 0, Math.PI * 2);
        ctx.fill();

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
        let bestD = 26 * 26;
        // front dots win ties (iterate, prefer higher z within range)
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

      {/* Legend panel */}
      <div className="ctrla-mixglobe-legend">
        <span style={{ display: "inline-flex", alignItems: "center", gap: 9, marginBottom: 16 }}>
          <span aria-hidden style={{ width: 18, height: 2, background: accent }} />
          <span style={{ fontFamily: ed.mono, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: accent }}>
            The mix as a globe
          </span>
        </span>

        {sel ? (
          <div>
            <h4 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(24px,3vw,34px)", letterSpacing: "-0.02em", color: ed.ink, margin: "0 0 12px", textTransform: "lowercase" }}>
              <span style={{ display: "inline-block", width: 12, height: 12, borderRadius: "50%", background: sel.color, marginRight: 10, verticalAlign: "middle" }} />
              {sel.name}
            </h4>
            <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.7vw,18px)", lineHeight: 1.6, color: ed.inkSoft, margin: "0 0 22px" }}>
              {sel.role}
            </p>
            <div className="ctrla-mixglobe-axes">
              <AxisReadout label="pan" value={panWord(sel.pan)} accent={accent} />
              <AxisReadout label="depth" value={depthWord(sel.depth)} accent={accent} />
              <AxisReadout label="frequency" value={freqWord(sel.freq)} accent={accent} />
            </div>
          </div>
        ) : (
          <p style={{ fontFamily: ed.body, fontSize: 17, lineHeight: 1.6, color: ed.inkSoft, margin: 0 }}>
            tap any dot to see where it sits.
          </p>
        )}

        <div style={{ marginTop: 26, paddingTop: 20, borderTop: `1px solid ${ed.hair}`, display: "grid", gap: 10 }}>
          <Axis line="front to back" note="dry sounds sit up front. reverb and delay push them to the back." />
          <Axis line="left to right" note="panning slides a sound across the stereo field." />
          <Axis line="low to high" note="frequency stacks the mix from sub to air." />
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
// Convert #rrggbb + alpha to rgba().
function hexA(hex: string, a: number) {
  const n = hex.replace("#", "");
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${Math.max(0, Math.min(1, a)).toFixed(3)})`;
}
