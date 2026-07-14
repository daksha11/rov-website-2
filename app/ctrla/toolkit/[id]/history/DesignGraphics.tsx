"use client";

// ═══════════════════════════════════════════════════════
// DESIGN — motifs, hero, and playable
// A drifting Bauhaus-shapes hero, and a live type specimen switcher
// (type a word, flip the typeface, feel the voice change).
// ═══════════════════════════════════════════════════════

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";

const SERIF = "'Instrument Serif', Georgia, serif";
const GROT = "'Neue Montreal', 'Helvetica Neue', Arial, sans-serif";

// ── Motifs (drawn inside the shared 240x180 viewBox) ────
export function renderDesignMotif(kind: string, accent: string): ReactNode | null {
  const s = { fill: "none", stroke: accent, strokeWidth: 3, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const faint = { ...s, opacity: 0.4 };
  const fill = { fill: accent, stroke: "none" };
  switch (kind) {
    case "des-punch":
      return (
        <>
          <rect {...s} x={96} y={70} width={48} height={80} rx={3} />
          <rect {...faint} x={96} y={70} width={48} height={14} rx={3} />
          <text x={120} y={58} textAnchor="middle" style={{ fontFamily: SERIF, fontSize: 52, fill: accent }} transform="scale(-1,1) translate(-240,0)">
            R
          </text>
        </>
      );
    case "des-serif":
      return (
        <text x={120} y={124} textAnchor="middle" style={{ fontFamily: SERIF, fontSize: 108, fill: accent }}>
          Aa
        </text>
      );
    case "des-goblet":
      return (
        <>
          <path {...s} d="M96 40 C 96 78, 144 78, 144 40" />
          <path {...s} d="M120 78 L120 128" />
          <path {...s} d="M98 150 L142 150" />
          <path {...faint} d="M96 40 L144 40" />
        </>
      );
    case "des-helvetica":
      return (
        <>
          <line {...faint} x1={40} y1={54} x2={200} y2={54} />
          <line {...faint} x1={40} y1={132} x2={200} y2={132} />
          <text x={120} y={124} textAnchor="middle" style={{ fontFamily: GROT, fontWeight: 800, fontSize: 96, fill: accent }}>
            R
          </text>
        </>
      );
    case "des-logo":
      return (
        <>
          <rect {...fill} x={70} y={62} width={100} height={12} rx={2} />
          <rect {...fill} x={70} y={84} width={100} height={12} rx={2} />
          <rect {...fill} x={70} y={106} width={100} height={12} rx={2} />
          <rect {...s} x={54} y={46} width={132} height={88} rx={6} opacity={0.5} />
        </>
      );
    case "des-title":
      return (
        <>
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} {...(i % 2 ? faint : s)} x={50 + i * 8} y={54 + i * 18} width={120 - i * 6} height={12} rx={2} />
          ))}
          <rect {...fill} x={150} y={120} width={40} height={12} rx={2} />
        </>
      );
    case "des-subway":
      return (
        <>
          <line {...s} x1={46} y1={90} x2={150} y2={90} />
          <path {...s} d="M150 90 L190 130" />
          <circle {...s} cx={64} cy={90} r={8} />
          <circle {...s} cx={110} cy={90} r={8} />
          <circle {...fill} cx={190} cy={130} r={16} />
          <circle {...fill} cx={64} cy={90} r={4} />
        </>
      );
    case "des-heart":
      return (
        <path
          {...s}
          d="M120 148 C 60 108, 64 58, 96 58 C 112 58, 120 74, 120 74 C 120 74, 128 58, 144 58 C 176 58, 180 108, 120 148 Z"
        />
      );
    case "des-pixel":
      return (
        <>
          {[
            [1, 0], [3, 0],
            [0, 2], [4, 2],
            [1, 3], [2, 3], [3, 3],
          ].map(([c, r], i) => (
            <rect key={i} {...fill} x={84 + c * 16} y={54 + r * 16} width={13} height={13} rx={1} />
          ))}
          <rect {...faint} x={80} y={50} width={88} height={88} rx={3} />
        </>
      );
    case "des-gen":
      return (
        <>
          <circle cx={104} cy={84} r={40} fill={accent} opacity={0.28} />
          <circle cx={140} cy={100} r={44} fill={accent} opacity={0.22} />
          <circle cx={122} cy={70} r={30} fill={accent} opacity={0.3} />
          <circle {...s} cx={120} cy={90} r={58} opacity={0.35} />
        </>
      );
    default:
      return null;
  }
}

// ── DesignHero — drifting Bauhaus primaries ─────────────
export function DesignHero({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 1200 120" preserveAspectRatio="xMidYMid slice" aria-hidden style={{ width: "100%", height: "clamp(70px,12vw,130px)", display: "block", overflow: "hidden" }}>
      <circle className="ctrla-des-float" cx={140} cy={60} r={38} fill={accent} opacity={0.85} style={{ transformOrigin: "140px 60px" }} />
      <rect className="ctrla-des-rot" x={330} y={26} width={68} height={68} fill="none" stroke={accent} strokeWidth={3} style={{ transformOrigin: "364px 60px" }} />
      <path className="ctrla-des-rot-slow" d="M560 92 L600 24 L640 92 Z" fill={accent} opacity={0.7} style={{ transformOrigin: "600px 62px" }} />
      <line x1={720} y1={60} x2={860} y2={60} stroke={accent} strokeWidth={3} opacity={0.4} />
      <circle className="ctrla-des-rot" cx={940} cy={60} r={30} fill="none" stroke={accent} strokeWidth={3} style={{ transformOrigin: "940px 60px" }} />
      <rect className="ctrla-des-float" x={1040} y={34} width={52} height={52} fill={accent} opacity={0.8} style={{ transformOrigin: "1066px 60px" }} />
    </svg>
  );
}

// ── TypeSpecimen — one word, every voice ────────────────
const FACES = [
  { label: "Serif", sub: "Garamond lineage", css: SERIF, weight: 400 },
  { label: "Grotesque", sub: "Helvetica / Swiss", css: GROT, weight: 800 },
  { label: "Display", sub: "Editorial", css: "'Norwige', 'Neue Montreal', sans-serif", weight: 400 },
  { label: "Mono", sub: "Machine", css: "'DM Mono', ui-monospace, monospace", weight: 400 },
];
export function TypeSpecimen({ accent }: { accent: string }) {
  const [word, setWord] = useState("Typography");
  const [face, setFace] = useState(0);
  const [tracking, setTracking] = useState(0);
  const f = FACES[face];
  return (
    <div className="ctrla-spec" style={{ ["--acc" as string]: accent } as CSSProperties}>
      <div className="ctrla-spec-controls">
        <input className="ctrla-spec-input" value={word} maxLength={18} onChange={(e) => setWord(e.target.value)} aria-label="Type a word" />
        <div className="ctrla-spec-faces">
          {FACES.map((ff, i) => (
            <button key={ff.label} type="button" className="ctrla-spec-face" data-on={face === i ? "true" : "false"} onClick={() => setFace(i)}>
              {ff.label}
            </button>
          ))}
        </div>
        <label className="ctrla-spec-slider">
          <span>Tracking</span>
          <input type="range" min={-4} max={16} step={1} value={tracking} onChange={(e) => setTracking(Number(e.target.value))} />
        </label>
      </div>
      <div className="ctrla-spec-stage">
        <span style={{ fontFamily: f.css, fontWeight: f.weight, letterSpacing: `${tracking * 0.01}em`, color: "#160C28", fontSize: "clamp(40px,9vw,110px)", lineHeight: 1, wordBreak: "break-word" }}>
          {word || "Type"}
        </span>
      </div>
      <div className="ctrla-spec-meta">
        <span className="ctrla-play-hint" style={{ color: accent }}>{f.label}</span>
        <span className="ctrla-spec-sub">{f.sub}</span>
      </div>
    </div>
  );
}
