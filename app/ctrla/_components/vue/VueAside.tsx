"use client";

// ═══════════════════════════════════════════════════════
// VUE — THE ASIDE
//
// A line of narration with Vue's face on it. The small sibling of VueHandoff:
// no thread, no full figure, just the bust and the sentence. Use it at the
// beats between sections where a full hand-off would be too much ceremony.
//
// Themed rather than hard-coded to the magazine's dark ground: the toolkit
// pages run the cream `edLight` theme, where gold is illegible as text.
// ═══════════════════════════════════════════════════════

import { type CSSProperties, type ReactNode } from "react";
import { VueBust } from "./Vue";
import { type VueMood } from "./VueEye";
import { type VueColorway, type VuePose } from "./poses";
import { ed as edDark, edLight } from "../editorial";

export interface VueAsideProps {
  children: ReactNode;
  /** The active theme. Defaults to the magazine's dark ground. */
  theme?: typeof edDark;
  /** Overrides the colorway the theme would pick. */
  colorway?: VueColorway;
  pose?: VuePose;
  mood?: VueMood;
  size?: number;
  /** Optional label above the line, e.g. "Vue · on the kit". */
  eyebrow?: string;
  className?: string;
  style?: CSSProperties;
}

export default function VueAside({
  children,
  theme,
  colorway,
  pose = "pointing",
  mood = "focused",
  size = 46,
  eyebrow,
  className,
  style,
}: VueAsideProps) {
  const ed = theme ?? edDark;
  const isLight = ed.ground === edLight.ground;
  // Purple on the magazine's dark ground, clay on the toolkits' cream.
  const cw = colorway ?? (isLight ? "clay" : "purple");
  // Gold is illegible on cream; plum is the sanctioned stand-in for accents at
  // this scale. Vue's eye is unaffected either way, because it is painted on a
  // visor that stays dark in both colorways.
  const accent = isLight ? ed.plum : ed.gold;

  return (
    <div
      className={className}
      style={{
        display: "flex",
        gap: "clamp(14px,2vw,20px)",
        alignItems: "flex-start",
        maxWidth: 640,
        ...style,
      }}
    >
      <VueBust
        pose={pose}
        colorway={cw}
        size={size}
        mood={mood}
        style={{ border: `1px solid ${isLight ? ed.hair : ed.amber}`, marginTop: 2 }}
      />
      <div style={{ minWidth: 0 }}>
        {eyebrow && (
          <span
            style={{
              display: "block",
              fontFamily: ed.mono,
              fontSize: "clamp(9px,1vw,11px)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: accent,
              marginBottom: 8,
            }}
          >
            {eyebrow}
          </span>
        )}
        <p
          style={{
            fontFamily: ed.serif,
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "clamp(16px,1.9vw,22px)",
            lineHeight: 1.45,
            color: ed.ink,
            margin: 0,
          }}
        >
          {children}
        </p>
      </div>
    </div>
  );
}
