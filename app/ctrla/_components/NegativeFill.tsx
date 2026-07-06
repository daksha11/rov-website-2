"use client";

// ═══════════════════════════════════════════════════════
// CTRL-A — NEGATIVE FILL, BEFORE / AFTER
// One face, one key light, split down the middle. The left half is
// lit with a bounce fill (the flat, home-video read). The right half
// has a black flag drinking the bounce instead (the shaped, filmic
// read). Drag the divider to wipe between them and the same face
// turns from flat to sculpted in front of you. A ratio meter on each
// side names the lit-to-shadow gap that separates the two.
//
// Reuses the face-lighting engine so the lesson visual and the Light
// Bench sandbox are the same physics. Static per state, so both sides
// are rendered once and only re-blitted while you drag.
// ═══════════════════════════════════════════════════════

import { useEffect, useRef, useState } from "react";
import { edLight as ed } from "./editorial";
import { renderFace, measureRatio, tempColor, type FaceInput } from "./faceLighting";

// A shared key: camera-left, raised, warm — a clean Rembrandt-ish setup
// so the shadow side is the thing the flag gets to act on.
const KEY = { x: 0.28, y: 0.3, intensity: 0.96, temp: -0.16 };
const BACK = { x: 0.62, y: 0.16, intensity: 0.55, temp: -0.04 };

// BOUNCE FILL — a soft light opposite the key + generous room bounce.
const BOUNCE: FaceInput = {
  key: KEY,
  fill: { x: 0.74, y: 0.46, intensity: 0.72, temp: 0.05 },
  back: BACK,
  ambient: 0.24,
  flags: [],
};
// NEGATIVE FILL — no fill light, a black flag on the shadow side, low ambient.
const NEG: FaceInput = {
  key: KEY,
  fill: { x: 0.74, y: 0.46, intensity: 0.08, temp: 0.05 },
  back: BACK,
  ambient: 0.1,
  flags: [{ x: 0.86, y: 0.5, strength: 0.85 }],
};

function rgba(c: [number, number, number], a: number) {
  return `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
}

export default function NegativeFill({ accent = ed.plum }: { accent?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bufA = useRef<HTMLCanvasElement | null>(null); // bounce
  const bufB = useRef<HTMLCanvasElement | null>(null); // negative
  const dims = useRef({ bw: 0, bh: 0 });
  const [divider, setDivider] = useState(0.5);
  const [ratios, setRatios] = useState({ a: 1, b: 1 });
  const dividerRef = useRef(0.5);
  const dragging = useRef(false);

  useEffect(() => { dividerRef.current = divider; }, [divider]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;

    const ensureBuffers = (bw: number, bh: number) => {
      if (dims.current.bw === bw && dims.current.bh === bh && bufA.current) return;
      dims.current = { bw, bh };
      const mk = (input: FaceInput) => {
        const c = document.createElement("canvas");
        c.width = bw; c.height = bh;
        const cc = c.getContext("2d");
        if (cc) {
          const img = cc.createImageData(bw, bh);
          renderFace(img, bw, bh, input);
          cc.putImageData(img, 0, 0);
          return { c, ratio: measureRatio(img, bw, bh) };
        }
        return { c, ratio: 1 };
      };
      const a = mk(BOUNCE);
      const b = mk(NEG);
      bufA.current = a.c;
      bufB.current = b.c;
      setRatios({ a: a.ratio, b: b.ratio });
    };

    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w === 0 || h === 0) { raf = requestAnimationFrame(draw); return; }
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const bw = Math.max(150, Math.min(240, Math.round(w * 0.55)));
      const bh = Math.round(bw * (h / w));
      ensureBuffers(bw, bh);

      // backdrop (shared by both halves so the join is seamless)
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, "#141020");
      bg.addColorStop(0.7, "#0c0817");
      bg.addColorStop(1, "#080510");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // key pool spilling on the backdrop
      ctx.globalCompositeOperation = "lighter";
      const kp = { x: KEY.x * w, y: KEY.y * h };
      const col = tempColor(KEY.temp);
      const gr = ctx.createRadialGradient(kp.x, kp.y, 0, kp.x, kp.y, Math.min(w, h) * 0.95);
      gr.addColorStop(0, rgba(col, KEY.intensity * 0.09));
      gr.addColorStop(1, rgba(col, 0));
      ctx.fillStyle = gr;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";

      const dx = dividerRef.current * w;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // right of divider: negative fill
      if (bufB.current) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(dx, 0, w - dx, h);
        ctx.clip();
        ctx.drawImage(bufB.current, 0, 0, w, h);
        // the flag, a black panel on the shadow side (only in the neg-fill half)
        const fx = 0.86 * w, fy = 0.5 * h, fw = 15, fh = h * 0.34;
        ctx.fillStyle = "rgba(6,4,12,0.95)";
        ctx.strokeStyle = "rgba(245,238,230,0.35)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.rect(fx - fw / 2, fy - fh / 2, fw, fh);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }

      // left of divider: bounce fill
      if (bufA.current) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, dx, h);
        ctx.clip();
        ctx.drawImage(bufA.current, 0, 0, w, h);
        ctx.restore();
      }

      // divider line + handle
      ctx.strokeStyle = "rgba(245,238,230,0.85)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(dx, 0);
      ctx.lineTo(dx, h);
      ctx.stroke();
      ctx.fillStyle = "rgba(245,238,230,0.95)";
      ctx.beginPath();
      ctx.arc(dx, h * 0.5, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#160c28";
      ctx.font = "700 13px 'Neue Montreal', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("⟷", dx, h * 0.5 + 1);

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  const onPointer = (e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const nx = Math.max(0.06, Math.min(0.94, (e.clientX - rect.left) / rect.width));
    setDivider(nx);
  };
  const onDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    onPointer(e);
  };
  const onMove = (e: React.PointerEvent) => { if (dragging.current) onPointer(e); };
  const onUp = () => { dragging.current = false; };

  const fmt = (r: number) => `${Math.round(r * 10) / 10}:1`;

  return (
    <div className="ctrla-negfill">
      <div className="ctrla-negfill-stage">
        <canvas
          ref={canvasRef}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          className="ctrla-negfill-canvas"
          style={{ width: "100%", height: "100%", display: "block", touchAction: "none" }}
        />
        {/* corner labels */}
        <span className="ctrla-negfill-tag is-left">bounce fill</span>
        <span className="ctrla-negfill-tag is-right">negative fill</span>
        <span className="ctrla-negfill-hint" style={{ fontFamily: ed.mono }}>drag to wipe</span>
      </div>

      {/* ratio meter */}
      <div className="ctrla-negfill-meter">
        <div className="ctrla-negfill-side">
          <span className="ctrla-negfill-side-k">bounce fill</span>
          <span className="ctrla-negfill-ratio">{fmt(ratios.a)}</span>
          <span className="ctrla-negfill-verdict">flat · reads like home video</span>
        </div>
        <div className="ctrla-negfill-bar" aria-hidden>
          <span className="ctrla-negfill-bar-fill" style={{ width: `${Math.min(100, (ratios.b / 6) * 100)}%`, background: accent }} />
        </div>
        <div className="ctrla-negfill-side is-right">
          <span className="ctrla-negfill-side-k">negative fill</span>
          <span className="ctrla-negfill-ratio" style={{ color: accent }}>{fmt(ratios.b)}</span>
          <span className="ctrla-negfill-verdict">shaped · reads like film</span>
        </div>
      </div>
    </div>
  );
}
