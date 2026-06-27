"use client";

// ═══════════════════════════════════════════════════════
// THE FOLD — room chrome
// The minimal edges: your intention on the left, sound + leave on
// the right. Quiet. Nothing competes with the room itself.
// ═══════════════════════════════════════════════════════

import { ed } from "../../../_components/editorial";
import { modeLabel } from "../../_state/foldConfig";
import type { Intention } from "../../_state/types";

export default function RoomChrome({
  intention,
  muted,
  soundReady,
  onToggleMute,
  onLeave,
}: {
  intention: Intention;
  muted: boolean;
  soundReady: boolean;
  onToggleMute: () => void;
  onLeave: () => void;
}) {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 3,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 16,
        padding: "clamp(18px,3vw,30px) clamp(20px,5vw,48px)",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
        <span style={{ fontFamily: ed.mono, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: ed.gold }}>
          {modeLabel(intention.mode)}
        </span>
        {intention.oneThing && (
          <span
            style={{
              fontFamily: ed.serif,
              fontStyle: "italic",
              fontSize: "clamp(15px,1.8vw,21px)",
              color: ed.inkSoft,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "min(52vw, 520px)",
            }}
          >
            {intention.oneThing}
          </span>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "clamp(16px,2.5vw,28px)", flexShrink: 0 }}>
        <button
          type="button"
          onClick={onToggleMute}
          className="fold-leave"
          style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}
          title={muted ? "Sound off" : "Sound on"}
        >
          <span aria-hidden style={{ display: "inline-flex", alignItems: "flex-end", gap: 2, height: 12 }}>
            {[5, 9, 6].map((h, i) => (
              <span
                key={i}
                style={{
                  width: 2,
                  height: muted || !soundReady ? 2 : h,
                  background: muted ? ed.inkFaint : ed.gold,
                  transition: "height .3s ease, background .3s ease",
                }}
              />
            ))}
          </span>
          <span style={{ fontFamily: ed.mono, fontSize: "clamp(9px,1vw,11px)", letterSpacing: "0.2em", textTransform: "uppercase", color: ed.inkFaint }}>
            {muted ? "Sound off" : "Sound on"}
          </span>
        </button>

        <button
          type="button"
          onClick={onLeave}
          className="fold-leave"
          style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}
        >
          <span style={{ fontFamily: ed.mono, fontSize: "clamp(9px,1vw,11px)", letterSpacing: "0.2em", textTransform: "uppercase", color: ed.inkFaint }}>
            Leave
          </span>
          <span style={{ color: ed.inkFaint }}>→</span>
        </button>
      </div>
    </div>
  );
}
