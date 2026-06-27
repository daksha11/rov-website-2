"use client";

// ═══════════════════════════════════════════════════════
// THE FOLD — creative fuel
// Small drops of taste while you sit: a rotating design prompt, a
// track from the volume, the notebook, and a featured taste card.
// Production rotates the prompt every 25 min; the demo is faster
// so the behavior shows during an audit.
// ═══════════════════════════════════════════════════════

import { useEffect, useState } from "react";
import { ed } from "../../_components/editorial";
import QuickCapture from "./QuickCapture";
import { DESIGN_PROMPTS, VOLUME_TRACK, TASTE_CARDS } from "../_content/fuel";

const DEMO_ROTATE_MS = 75_000;

export default function CreativeFuel() {
  const [i, setI] = useState(() => Math.floor(Math.random() * DESIGN_PROMPTS.length));
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = window.setInterval(() => {
      setShow(false);
      window.setTimeout(() => {
        setI((p) => (p + 1) % DESIGN_PROMPTS.length);
        setShow(true);
      }, 600);
    }, DEMO_ROTATE_MS);
    return () => clearInterval(t);
  }, []);

  const taste = TASTE_CARDS[i % TASTE_CARDS.length];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span style={{ fontFamily: ed.mono, fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: ed.gold }}>
          A prompt
        </span>
        <p style={{ fontFamily: ed.serif, fontStyle: "italic", fontSize: "clamp(15px,1.8vw,20px)", lineHeight: 1.4, color: ed.paper, margin: 0, opacity: show ? 1 : 0, transition: "opacity .6s ease" }}>
          {DESIGN_PROMPTS[i]}
        </p>
      </div>

      <div style={{ height: 1, background: ed.hair }} />

      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 24px", alignItems: "baseline" }}>
        <span style={{ fontFamily: ed.mono, fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: ed.inkFaint }}>On the volume</span>
        <span style={{ fontFamily: ed.grotesque, fontWeight: 600, fontSize: "clamp(14px,1.6vw,17px)", color: ed.paper }}>{VOLUME_TRACK.title}</span>
        <span style={{ fontFamily: ed.body, fontSize: "clamp(12px,1.4vw,14px)", color: ed.inkSoft }}>{VOLUME_TRACK.artist}</span>
      </div>

      <div style={{ height: 1, background: ed.hair }} />

      <QuickCapture />

      <div style={{ height: 1, background: ed.hair }} />

      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 18px", alignItems: "baseline" }}>
        <span style={{ fontFamily: ed.mono, fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: ed.inkFaint }}>Taste</span>
        <span style={{ fontFamily: ed.serif, fontStyle: "italic", fontSize: "clamp(14px,1.6vw,18px)", color: ed.paper }}>{taste.title}</span>
        <span style={{ fontFamily: ed.body, fontSize: "clamp(11px,1.3vw,13px)", color: ed.inkSoft }}>{taste.medium}</span>
      </div>
    </div>
  );
}
