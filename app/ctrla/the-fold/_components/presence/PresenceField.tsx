"use client";

// The anonymous dot map. Renders the live population as soft
// pulsing dots. Caps the rendered count so a large room stays
// cheap; ModeCounts still reports the true totals.

import PresenceDot from "./PresenceDot";
import type { Dot } from "../../_presence/usePresence";

const RENDER_CAP = 60;

export default function PresenceField({ dots }: { dots: Dot[] }) {
  const shown = dots.length > RENDER_CAP ? dots.slice(0, RENDER_CAP) : dots;
  return (
    <div
      aria-hidden
      style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none" }}
    >
      {shown.map((d) => (
        <PresenceDot key={d.id} dot={d} />
      ))}
    </div>
  );
}
