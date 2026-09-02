"use client";

// The rank line: Visitor → Artist → Resident, mirroring Discord. Takes the
// contribution counts the caller already has and reads the path itself for
// the Finish stop. One line of small gold text plus the next rung.

import { useCtrlAPath } from "@/lib/ctrla/progress";
import { RANK_META, rankFor } from "@/lib/ctrla/contribute";

export default function Rank({
  approved,
  featured,
  color = "#E3C24A",
  muted = "rgba(240,230,224,0.55)",
}: {
  approved: number;
  featured: number;
  color?: string;
  muted?: string;
}) {
  const path = useCtrlAPath();
  const finished = !!path.stops.find((s) => s.id === "finish")?.done;
  const rank = rankFor({ approved, featured, finished });
  const meta = RANK_META[rank];
  return (
    <p style={{ margin: 0, fontFamily: "'Neue Montreal', 'Roboto', sans-serif", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", lineHeight: 1.8, color: muted }}>
      <span style={{ color, fontWeight: 700 }}>{meta.label}</span> · {meta.blurb}
      {meta.next && <span style={{ display: "block" }}>{meta.next}</span>}
    </p>
  );
}
