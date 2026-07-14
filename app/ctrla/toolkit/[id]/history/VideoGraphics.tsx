"use client";

// ═══════════════════════════════════════════════════════
// VIDEO / FILM — motifs, hero, and playables
// A scrolling film-strip hero, an aperture / depth-of-field simulator
// (drag the f-stop, watch the background melt and the exposure shift),
// and a Muybridge gallop scrubber for persistence of vision.
// ═══════════════════════════════════════════════════════

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

// ── Motifs (drawn inside the shared 240x180 viewBox) ────
export function renderVideoMotif(kind: string, accent: string): ReactNode | null {
  const s = { fill: "none", stroke: accent, strokeWidth: 3, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const faint = { ...s, opacity: 0.4 };
  const fill = { fill: accent, stroke: "none" };
  switch (kind) {
    case "vid-pinhole":
      return (
        <>
          <rect {...s} x={64} y={44} width={112} height={92} rx={6} />
          <circle {...fill} cx={120} cy={90} r={4} />
          <path {...faint} d="M78 60 L120 90 L78 120" />
          <path {...s} d="M150 74 L150 106 M150 74 l -8 8 M150 74 l 8 8" />
        </>
      );
    case "vid-plate":
      return (
        <>
          <rect {...s} x={62} y={48} width={116} height={84} rx={4} />
          <circle {...faint} cx={92} cy={74} r={12} />
          <path {...faint} d="M74 118 L104 92 L124 108 L150 82 L166 118" />
          <line {...faint} x1={74} y1={118} x2={166} y2={118} />
        </>
      );
    case "vid-roll":
      return (
        <>
          <circle {...s} cx={94} cy={90} r={44} />
          <circle {...s} cx={94} cy={90} r={12} />
          {[0, 60, 120, 180, 240, 300].map((a) => {
            const r = (a * Math.PI) / 180;
            return <line key={a} {...faint} x1={94 + 16 * Math.cos(r)} y1={90 + 16 * Math.sin(r)} x2={94 + 38 * Math.cos(r)} y2={90 + 38 * Math.sin(r)} />;
          })}
          <path {...faint} d="M138 74 L196 74 L196 106 L138 106" />
          {[150, 168, 186].map((x) => <rect key={x} {...faint} x={x} y={82} width={8} height={16} rx={2} />)}
        </>
      );
    case "vid-claw":
      return (
        <>
          <line {...s} x1={92} y1={40} x2={92} y2={150} />
          <line {...s} x1={148} y1={40} x2={148} y2={150} />
          {[50, 76, 102, 128].map((y) => (
            <g key={y}>
              <rect {...faint} x={84} y={y} width={8} height={12} rx={2} />
              <rect {...faint} x={148} y={y} width={8} height={12} rx={2} />
            </g>
          ))}
          <path {...s} d="M118 70 l 14 0 l 0 18 l -14 0" />
        </>
      );
    case "vid-frames":
      return (
        <>
          {[44, 92, 140, 188].map((x, i) => (
            <rect key={x} {...(i === 1 ? s : faint)} x={x} y={64} width={38} height={52} rx={3} />
          ))}
          <line {...faint} x1={30} y1={54} x2={210} y2={54} />
          <line {...faint} x1={30} y1={126} x2={210} y2={126} />
        </>
      );
    case "vid-iris":
      return (
        <>
          <circle {...s} cx={120} cy={90} r={52} />
          {[0, 60, 120, 180, 240, 300].map((a) => {
            const r = (a * Math.PI) / 180;
            const r2 = ((a + 40) * Math.PI) / 180;
            return <line key={a} {...faint} x1={120 + 20 * Math.cos(r)} y1={90 + 20 * Math.sin(r)} x2={120 + 50 * Math.cos(r2)} y2={90 + 50 * Math.sin(r2)} />;
          })}
          <circle {...fill} cx={120} cy={90} r={14} />
        </>
      );
    case "vid-prism":
      return (
        <>
          <path {...s} d="M96 128 L134 56 L172 128 Z" />
          <line {...s} x1={40} y1={100} x2={104} y2={100} />
          <path {...faint} d="M150 96 L206 78" />
          <path {...faint} d="M152 104 L206 104" />
          <path {...faint} d="M150 112 L206 130" />
        </>
      );
    case "vid-gauges":
      return (
        <>
          {[[64, 24], [80, 40], [98, 58]].map(([o, half], i) => (
            <rect key={i} {...(i === 2 ? s : faint)} x={o} y={90 - half} width={240 - o * 2} height={half * 2} rx={4} />
          ))}
          {[70, 170].map((x) => [66, 90, 114].map((y) => <rect key={`${x}-${y}`} {...faint} x={x - 4} y={y - 4} width={8} height={8} rx={1} />))}
        </>
      );
    case "vid-sensor":
      return (
        <>
          <rect {...s} x={68} y={46} width={104} height={98} rx={6} />
          {[0, 1, 2, 3].map((r) =>
            [0, 1, 2, 3].map((c) => (
              <rect key={`${r}-${c}`} x={80 + c * 20} y={58 + r * 20} width={16} height={16} rx={2} fill={accent} stroke="none" opacity={(r + c) % 2 === 0 ? 0.9 : 0.35} />
            ))
          )}
          {[46, 144].map((x) => <line key={x} {...faint} x1={x === 46 ? 68 : 172} y1={90} x2={x === 46 ? 52 : 188} y2={90} />)}
        </>
      );
    case "vid-compute":
      return (
        <>
          {[0, 1, 2].map((i) => (
            <rect key={i} {...faint} x={86 + i * 8} y={40 + i * 6} width={68} height={104} rx={12} />
          ))}
          <rect {...s} x={86} y={40} width={68} height={104} rx={12} />
          <path {...fill} d="M120 74 l 5 12 l 12 5 l -12 5 l -5 12 l -5 -12 l -12 -5 l 12 -5 Z" />
        </>
      );
    default:
      return null;
  }
}

// ── VideoHero — a scrolling film strip ──────────────────
export function VideoHero({ accent }: { accent: string }) {
  const TILE = 120;
  const tiles = Array.from({ length: 14 }, (_, i) => i);
  return (
    <svg viewBox="0 0 1200 120" preserveAspectRatio="xMidYMid slice" aria-hidden style={{ width: "100%", height: "clamp(72px,12vw,124px)", display: "block", overflow: "hidden" }}>
      <rect x={0} y={14} width={1200} height={92} fill="none" stroke={accent} strokeWidth={2} opacity={0.3} />
      <g className="ctrla-vid-strip">
        {tiles.map((i) => {
          const x = i * TILE;
          return (
            <g key={i}>
              <rect x={x + 14} y={30} width={TILE - 28} height={60} rx={3} fill="none" stroke={accent} strokeWidth={2} opacity={0.55} />
              {[0, 1, 2, 3].map((h) => (
                <rect key={`t${h}`} x={x + 12 + h * 26} y={18} width={12} height={7} rx={1.5} fill={accent} opacity={0.4} />
              ))}
              {[0, 1, 2, 3].map((h) => (
                <rect key={`b${h}`} x={x + 12 + h * 26} y={95} width={12} height={7} rx={1.5} fill={accent} opacity={0.4} />
              ))}
            </g>
          );
        })}
      </g>
    </svg>
  );
}

// ── ApertureSim — drag the f-stop ───────────────────────
const STOPS = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16];
export function ApertureSim({ accent }: { accent: string }) {
  const [idx, setIdx] = useState(1);
  const t = idx / (STOPS.length - 1); // 0 wide … 1 narrow
  const blur = (9 * (1 - t)).toFixed(2);
  const expo = (t * 0.5).toFixed(2);
  const bokeh = 0.75 * (1 - t) + 0.12;
  const irisR = 30 - t * 20;
  return (
    <div className="ctrla-ap" style={{ ["--acc" as string]: accent } as CSSProperties}>
      <div className="ctrla-ap-stage">
        <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" style={{ width: "100%", height: "clamp(150px,26vw,240px)", display: "block" }}>
          <defs>
            <filter id="ctrla-ap-blur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation={blur} />
            </filter>
          </defs>
          <rect x={0} y={0} width={320} height={200} fill="#E7D8CD" />
          <g filter="url(#ctrla-ap-blur)">
            {[[40, 60, 22], [110, 40, 16], [250, 70, 26], [280, 130, 18], [70, 150, 20], [180, 150, 14]].map(([cx, cy, r], i) => (
              <circle key={i} cx={cx} cy={cy} r={r} fill={accent} opacity={bokeh * (i % 2 ? 0.7 : 1)} />
            ))}
            <line x1={0} y1={172} x2={320} y2={172} stroke={accent} strokeWidth={3} opacity={0.4} />
          </g>
          {/* sharp subject in front */}
          <g>
            <rect x={150} y={96} width={20} height={72} rx={8} fill="#160C28" />
            <circle cx={160} cy={86} r={16} fill="#160C28" />
          </g>
          <rect x={0} y={0} width={320} height={200} fill="#160C28" opacity={expo} />
        </svg>
      </div>
      <div className="ctrla-ap-controls">
        <svg viewBox="0 0 60 60" width={52} height={52} aria-hidden style={{ flexShrink: 0 }}>
          <circle cx={30} cy={30} r={26} fill="none" stroke={accent} strokeWidth={2} opacity={0.4} />
          <circle cx={30} cy={30} r={irisR} fill={accent} opacity={0.25} />
          <circle cx={30} cy={30} r={irisR} fill="none" stroke={accent} strokeWidth={2} />
        </svg>
        <label className="ctrla-ap-slider">
          <span>Aperture · f/{STOPS[idx]}</span>
          <input type="range" min={0} max={STOPS.length - 1} step={1} value={idx} onChange={(e) => setIdx(Number(e.target.value))} />
        </label>
        <div className="ctrla-ap-readout">
          <span className="ctrla-play-hint" style={{ color: accent }}>{t < 0.5 ? "Shallow focus · brighter" : "Deep focus · darker"}</span>
        </div>
      </div>
    </div>
  );
}

// ── FpsScrub — Muybridge gallop, scrub or play ──────────
const FRAMES = 12;
function Horse({ phase, accent }: { phase: number; accent: string }) {
  const swingF = 18 * Math.sin(phase);
  const swingB = 18 * Math.sin(phase + Math.PI);
  const bob = 3 * Math.sin(phase * 2);
  const s = { stroke: accent, strokeWidth: 5, strokeLinecap: "round" as const, fill: "none" };
  return (
    <g transform={`translate(0, ${bob})`}>
      {/* body */}
      <ellipse cx={130} cy={70} rx={46} ry={20} fill={accent} />
      {/* neck + head */}
      <path d="M168 60 C 184 46, 196 44, 202 34 L 214 42 C 208 54, 196 64, 176 74 Z" fill={accent} />
      {/* tail */}
      <path d="M84 62 C 68 58, 60 68, 58 84" stroke={accent} strokeWidth={5} fill="none" strokeLinecap="round" />
      {/* legs */}
      <line {...s} x1={156} y1={84} x2={156 + swingF} y2={128} />
      <line {...s} x1={168} y1={84} x2={168 + swingF * 0.7} y2={126} opacity={0.6} />
      <line {...s} x1={104} y1={84} x2={104 + swingB} y2={128} />
      <line {...s} x1={116} y1={84} x2={116 + swingB * 0.7} y2={126} opacity={0.6} />
    </g>
  );
}
export function FpsScrub({ accent }: { accent: string }) {
  const [frame, setFrame] = useState(0);
  const [fps, setFps] = useState(0); // 0 = stopped
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (timer.current) clearInterval(timer.current);
    if (fps > 0) {
      timer.current = setInterval(() => setFrame((f) => (f + 1) % FRAMES), 1000 / fps);
    }
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [fps]);

  const phase = (frame / FRAMES) * Math.PI * 2;
  return (
    <div className="ctrla-fps" style={{ ["--acc" as string]: accent } as CSSProperties}>
      <div className="ctrla-fps-stage">
        <svg viewBox="0 0 260 150" style={{ width: "100%", height: "clamp(130px,22vw,200px)", display: "block" }}>
          <line x1={20} y1={132} x2={240} y2={132} stroke={accent} strokeWidth={2} opacity={0.3} />
          <Horse phase={phase} accent={accent} />
        </svg>
      </div>
      <div className="ctrla-fps-controls">
        <div className="ctrla-fps-rates">
          {[6, 12, 24].map((r) => (
            <button key={r} type="button" className="ctrla-spec-face" data-on={fps === r ? "true" : "false"} onClick={() => setFps(fps === r ? 0 : r)}>
              {r}fps
            </button>
          ))}
        </div>
        <label className="ctrla-fps-slider">
          <span>Frame {frame + 1}/{FRAMES}</span>
          <input
            type="range"
            min={0}
            max={FRAMES - 1}
            step={1}
            value={frame}
            onChange={(e) => {
              setFps(0);
              setFrame(Number(e.target.value));
            }}
          />
        </label>
        <span className="ctrla-play-hint" style={{ color: accent }}>{fps === 0 ? "Scrub the stills" : fps < 12 ? "Choppy" : "It moves"}</span>
      </div>
    </div>
  );
}
