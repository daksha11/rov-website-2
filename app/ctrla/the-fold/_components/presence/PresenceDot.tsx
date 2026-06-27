"use client";

// One soft, asynchronously pulsing dot. No name, no avatar.
// CSS-driven so the field breathes without a JS animation loop.

import { ed } from "../../../_components/editorial";
import type { Dot } from "../../_presence/usePresence";

export default function PresenceDot({ dot }: { dot: Dot }) {
  const size = dot.isSelf ? 9 : 6;
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
        background: dot.isSelf ? ed.gold : ed.amber,
        boxShadow: dot.isSelf
          ? `0 0 14px ${ed.gold}`
          : "0 0 10px rgba(165,106,103,0.6)",
        animationDelay: `${dot.delay}s`,
        animationDuration: `${dot.dur}s`,
      }}
    />
  );
}
