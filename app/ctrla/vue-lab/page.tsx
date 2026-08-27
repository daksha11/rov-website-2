"use client";

// Scratch bench for tuning Vue. Not linked from anywhere; delete when the
// mascot is settled. Route: /ctrla/vue-lab
//
// It exists to answer three questions that only a browser can answer: does the
// erased visor read as blank, does the drawn eye land on the footprint, and
// does the clay colorway survive a cream ground.

import { useState } from "react";
import Vue, { VueBust } from "../_components/vue/Vue";
import { type VueMood } from "../_components/vue/VueEye";
import { VUE_POSES, type VueColorway, type VuePose } from "../_components/vue/poses";
import { ed } from "../_components/editorial";

const POSES = Object.keys(VUE_POSES) as VuePose[];
const MOODS: VueMood[] = ["calm", "focused", "alert"];

export default function VueLab() {
  const [mood, setMood] = useState<VueMood>("calm");
  const [grid, setGrid] = useState(true);

  return (
    <main style={{ background: ed.ground, color: ed.ink, fontFamily: ed.body, minHeight: "100vh", padding: 40 }}>
      <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 32, flexWrap: "wrap" }}>
        <strong style={{ fontFamily: ed.grotesque, letterSpacing: "0.1em", textTransform: "uppercase", fontSize: 12 }}>
          Vue lab
        </strong>
        {MOODS.map((m) => (
          <button
            key={m}
            onClick={() => setMood(m)}
            style={{
              background: m === mood ? ed.gold : "transparent",
              color: m === mood ? ed.void : ed.ink,
              border: `1px solid ${ed.hair}`,
              padding: "6px 14px",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            {m}
          </button>
        ))}
        <button
          onClick={() => setGrid((g) => !g)}
          style={{ background: "transparent", color: ed.ink, border: `1px solid ${ed.hair}`, padding: "6px 14px", fontSize: 12, cursor: "pointer" }}
        >
          {grid ? "hide" : "show"} eye rect
        </button>
      </div>

      {/* Purple on the dark magazine ground */}
      <Row label="purple · on ed.ground" bg={ed.ground} fg={ed.ink} colorway="purple" mood={mood} grid={grid} />
      {/* Clay on the cream toolkit ground — the open question from the plan */}
      <Row label="clay · on edLight.ground (cream)" bg="#F0E6E0" fg="#160C28" colorway="clay" mood={mood} grid={grid} />
      {/* Clay on dark, as a control */}
      <Row label="clay · on ed.ground (control)" bg={ed.ground} fg={ed.ink} colorway="clay" mood={mood} grid={grid} />

      <div style={{ marginTop: 48, display: "flex", gap: 20, alignItems: "center" }}>
        <span style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.7 }}>Bust</span>
        {POSES.map((p) => (
          <VueBust key={p} pose={p} mood={mood} size={52} />
        ))}
        {POSES.map((p) => (
          <VueBust key={`${p}-clay`} pose={p} colorway="clay" mood={mood} size={52} />
        ))}
      </div>
    </main>
  );
}

function Row({
  label,
  bg,
  fg,
  colorway,
  mood,
  grid,
}: {
  label: string;
  bg: string;
  fg: string;
  colorway: VueColorway;
  mood: VueMood;
  grid: boolean;
}) {
  return (
    <section style={{ background: bg, color: fg, padding: 28, marginBottom: 20, border: `1px solid ${ed.hair}`, overflow: "hidden" }}>
      <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.7, marginBottom: 18 }}>
        {label}
      </div>
      <div style={{ display: "flex", gap: 48, alignItems: "flex-end", flexWrap: "wrap", marginRight: -28 }}>
        {POSES.map((pose) => {
          // `leaning` is drawn with no arm on its right side, on the assumption
          // that side is behind a page edge. Rendering it free-standing here
          // would show the exact defect the bleed exists to hide.
          const edge = VUE_POSES[pose].edge;
          return (
            <figure key={pose} style={{ margin: 0, position: "relative" }}>
              <Vue pose={pose} colorway={colorway} height={340} mood={mood} wakeOnScroll={false} bleed={!!edge} />
              {grid && !edge && <EyeRect pose={pose} />}
              <figcaption style={{ fontSize: 11, marginTop: 10, opacity: 0.7 }}>
                {pose}
                {edge ? ` · bleed ${edge.side} ${Math.round(edge.amount * 100)}%` : ""}
              </figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}

// Outlines the rect VueEye is placed into, so a misregistration is obvious.
function EyeRect({ pose }: { pose: VuePose }) {
  const e = VUE_POSES[pose].eye;
  return (
    <span
      style={{
        position: "absolute",
        left: `${e.x * 100}%`,
        top: `${e.y * 100}%`,
        width: `${e.w * 100}%`,
        height: `${e.h * 100}%`,
        outline: "1px solid rgba(0,255,255,0.9)",
        pointerEvents: "none",
      }}
    />
  );
}
