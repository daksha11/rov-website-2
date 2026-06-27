"use client";

// ═══════════════════════════════════════════════════════
// THE FOLD — soundscape rail
// Named by mental state. Selecting crossfades the living stream.
// Golden Hour stays locked until it is earned (3 sessions).
// ═══════════════════════════════════════════════════════

import { ed } from "../../../_components/editorial";
import { SOUNDSCAPES } from "../../_state/foldConfig";
import type { Soundscape } from "../../_state/types";

export default function SoundscapeRail({
  current,
  sessionCount,
  onSelect,
}: {
  current: Soundscape;
  sessionCount: number;
  onSelect: (s: Soundscape) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <span style={{ fontFamily: ed.mono, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: ed.inkFaint }}>
        The stream
      </span>
      <div style={{ display: "flex", gap: "clamp(14px,2vw,26px)", flexWrap: "wrap", alignItems: "baseline" }}>
        {SOUNDSCAPES.map((s) => {
          const locked = sessionCount < s.unlock;
          const isCur = current === s.id;
          return (
            <button
              key={s.id}
              type="button"
              disabled={locked}
              onClick={() => onSelect(s.id)}
              title={locked ? `Earned after ${s.unlock} sessions` : s.blurb}
              className="fold-stream-item"
              data-current={isCur ? "true" : "false"}
              style={{
                background: "transparent",
                border: "none",
                padding: 0,
                cursor: locked ? "not-allowed" : "pointer",
                fontFamily: ed.grotesque,
                fontWeight: isCur ? 700 : 500,
                fontSize: "clamp(13px,1.5vw,17px)",
                letterSpacing: "0.01em",
                color: locked ? ed.inkFaint : isCur ? ed.gold : ed.inkSoft,
                opacity: locked ? 0.5 : 1,
              }}
            >
              {s.label}
              {locked && (
                <span aria-hidden style={{ marginLeft: 6, fontFamily: ed.mono, fontSize: 9, letterSpacing: "0.1em" }}>
                  locked
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
