"use client";

// "11 Designing · 8 Writing · 6 Building" — understated, truthful,
// the quiet proof that the room is inhabited.

import { ed } from "../../../_components/editorial";

export default function ModeCounts({
  counts,
  total,
}: {
  counts: { verb: string; n: number }[];
  total: number;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span
        style={{
          fontFamily: ed.mono,
          fontSize: "clamp(9px,1vw,11px)",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: ed.inkFaint,
        }}
      >
        {total} in the room
      </span>
      <span
        style={{
          fontFamily: ed.mono,
          fontSize: "clamp(11px,1.3vw,14px)",
          letterSpacing: "0.04em",
          color: ed.inkSoft,
        }}
      >
        {counts.map((c, i) => (
          <span key={c.verb}>
            {c.n} {c.verb}
            {i < counts.length - 1 ? "  ·  " : ""}
          </span>
        ))}
      </span>
    </div>
  );
}
