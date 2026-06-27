"use client";

// One patron: a soft warm glow, no name, no face. Pulses on its
// own clock so the room breathes instead of blinking in unison.

import { ed } from "../../_components/editorial";
import type { Dot } from "../_presence/usePresence";

export default function PresenceDot({ dot }: { dot: Dot }) {
  const size = dot.isSelf ? 10 : 7;
  return (
    <span
      className="fold-dot"
      aria-hidden
      style={{
        position: "absolute",
        left: `${dot.x * 100}%`,
        top: `${dot.y * 100}%`,
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        borderRadius: "50%",
        background: dot.isSelf ? ed.gold : "#E8B98A",
        boxShadow: dot.isSelf ? `0 0 16px ${ed.gold}` : "0 0 12px rgba(232,185,138,0.7)",
        animationDelay: `${dot.delay}s`,
        animationDuration: `${dot.dur}s`,
      }}
    />
  );
}
