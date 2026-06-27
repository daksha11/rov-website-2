"use client";

// ═══════════════════════════════════════════════════════
// THE FOLD — wayfinding
// The doors. Drift between the Commons and the rooms. Each is a
// place with a quiet mental-state subtitle. Golden Hour stays
// locked until it is earned. Editorial rows, no app chrome.
// ═══════════════════════════════════════════════════════

import { ed } from "../../_components/editorial";
import { COMMONS, ROOMS } from "../_state/foldConfig";
import type { Place } from "../_state/types";

export default function Wayfinding({
  current,
  visited,
  onGo,
}: {
  current: Place;
  visited: number;
  onGo: (p: Place) => void;
}) {
  const places = [COMMONS, ...ROOMS];
  return (
    <nav className="fold-wayfinding" aria-label="Rooms">
      <span style={{ fontFamily: ed.mono, fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: ed.gold, display: "block", marginBottom: 10 }}>
        The rooms
      </span>
      {places.map((p) => {
        const locked = visited < p.unlock;
        const isCur = current === p.id;
        return (
          <button
            key={p.id}
            type="button"
            disabled={locked || isCur}
            onClick={() => onGo(p.id)}
            className="fold-door"
            data-current={isCur ? "true" : "false"}
            title={locked ? `Earned after ${p.unlock} visits` : p.blurb}
            style={{
              width: "100%",
              background: "transparent",
              border: "none",
              borderTop: `1px solid ${ed.hair}`,
              padding: "11px 0",
              cursor: locked || isCur ? "default" : "pointer",
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: 14,
              textAlign: "left",
              opacity: locked ? 0.45 : 1,
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "baseline", gap: 12 }}>
              <span aria-hidden className="fold-door-tick" style={{ width: isCur ? 22 : 0, height: 2, alignSelf: "center", background: ed.gold, flexShrink: 0, transition: "width .3s ease" }} />
              <span style={{ fontFamily: ed.grotesque, fontWeight: isCur ? 700 : 500, fontSize: "clamp(15px,1.7vw,20px)", letterSpacing: "-0.01em", color: isCur ? ed.gold : ed.paper }}>
                {p.name}
              </span>
            </span>
            <span style={{ fontFamily: ed.mono, fontSize: "clamp(8px,0.95vw,10px)", letterSpacing: "0.16em", textTransform: "uppercase", color: ed.inkFaint, whiteSpace: "nowrap" }}>
              {locked ? "locked" : p.sub}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
