"use client";

// ═══════════════════════════════════════════════════════
// THE FOLD — creative fuel
// Periodic drops of taste mid-session: a rotating design prompt,
// a track from the volume, a quick capture, and a taste card.
// Production rotates the prompt every 25 min; the demo rotates
// faster so the behavior is visible during an audit.
// ═══════════════════════════════════════════════════════

import { useEffect, useState } from "react";
import { ed } from "../../../_components/editorial";
import QuickCapture from "./QuickCapture";
import { DESIGN_PROMPTS, VOLUME_TRACK, TASTE_CARDS } from "../../_content/fuel";

const DEMO_ROTATE_MS = 75_000; // production: FUEL_ROTATE_MS (25 min)

export default function CreativeFuelRail({
  onCapture,
}: {
  onCapture: (line: string) => void;
}) {
  const [i, setI] = useState(() => Math.floor(Math.random() * DESIGN_PROMPTS.length));
  const [showPrompt, setShowPrompt] = useState(true);

  useEffect(() => {
    const t = window.setInterval(() => {
      // fade the prompt out, swap, fade back in
      setShowPrompt(false);
      window.setTimeout(() => {
        setI((p) => (p + 1) % DESIGN_PROMPTS.length);
        setShowPrompt(true);
      }, 600);
    }, DEMO_ROTATE_MS);
    return () => clearInterval(t);
  }, []);

  const taste = TASTE_CARDS[i % TASTE_CARDS.length];

  return (
    <aside className="fold-fuel">
      {/* Prompt */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <span style={{ fontFamily: ed.mono, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: ed.gold }}>
          A prompt
        </span>
        <p
          style={{
            fontFamily: ed.serif,
            fontStyle: "italic",
            fontSize: "clamp(16px,1.9vw,22px)",
            lineHeight: 1.4,
            color: ed.paper,
            margin: 0,
            opacity: showPrompt ? 1 : 0,
            transition: "opacity .6s ease",
          }}
        >
          {DESIGN_PROMPTS[i]}
        </p>
      </div>

      <div style={{ height: 1, background: ed.hair }} />

      {/* Track */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontFamily: ed.mono, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: ed.inkFaint }}>
          On the volume
        </span>
        <span style={{ fontFamily: ed.grotesque, fontWeight: 600, fontSize: "clamp(15px,1.7vw,19px)", color: ed.paper }}>
          {VOLUME_TRACK.title}
        </span>
        <span style={{ fontFamily: ed.body, fontSize: "clamp(13px,1.5vw,15px)", color: ed.inkSoft }}>
          {VOLUME_TRACK.artist}
        </span>
      </div>

      <div style={{ height: 1, background: ed.hair }} />

      {/* Quick capture */}
      <QuickCapture onSave={onCapture} />

      <div style={{ height: 1, background: ed.hair }} />

      {/* Taste card */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontFamily: ed.mono, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: ed.inkFaint }}>
          Taste
        </span>
        <span style={{ fontFamily: ed.serif, fontStyle: "italic", fontSize: "clamp(15px,1.7vw,19px)", color: ed.paper }}>
          {taste.title}
        </span>
        <span style={{ fontFamily: ed.body, fontSize: "clamp(12px,1.4vw,14px)", color: ed.inkSoft }}>
          {taste.medium} · {taste.artist}
        </span>
      </div>
    </aside>
  );
}
