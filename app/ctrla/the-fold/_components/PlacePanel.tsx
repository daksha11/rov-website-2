"use client";

// ═══════════════════════════════════════════════════════
// THE FOLD — place panel
// The editorial identity of wherever you are standing. In the
// Commons it is an invitation. In a room it carries the optional
// note, an optional sitting, and the creative fuel. Lower-left,
// quiet, never a card stack.
// ═══════════════════════════════════════════════════════

import { ed } from "../../_components/editorial";
import type { PlaceDef } from "../_state/foldConfig";
import SittingTimer from "./SittingTimer";
import CreativeFuel from "./CreativeFuel";

export default function PlacePanel({
  def,
  isRoomPlace,
  note,
  setNote,
  greeting,
}: {
  def: PlaceDef;
  isRoomPlace: boolean;
  note: string;
  setNote: (s: string) => void;
  greeting: string;
}) {
  return (
    <div className="fold-panel fold-fade-up" key={def.id}>
      <span style={{ fontFamily: ed.mono, fontSize: "clamp(9px,1.1vw,11px)", letterSpacing: "0.24em", textTransform: "uppercase", color: ed.gold }}>
        {def.sub}
      </span>
      <h1 style={{ fontFamily: ed.serif, fontStyle: "italic", fontWeight: 400, fontSize: "clamp(34px,5.5vw,68px)", lineHeight: 0.92, letterSpacing: "-0.01em", color: ed.paper, margin: "8px 0 0" }}>
        {def.name}
      </h1>
      <p style={{ fontFamily: ed.body, fontSize: "clamp(14px,1.7vw,19px)", lineHeight: 1.5, color: ed.inkSoft, margin: "clamp(12px,1.6vw,18px) 0 0", maxWidth: 440 }}>
        {isRoomPlace ? def.blurb : greeting}
      </p>

      {isRoomPlace && (
        <div style={{ display: "flex", flexDirection: "column", gap: "clamp(18px,2.4vw,26px)", marginTop: "clamp(22px,3vw,30px)", maxWidth: 440 }}>
          {/* optional note */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, borderBottom: `1px solid ${ed.hair}`, paddingBottom: 8 }}>
            <span style={{ fontFamily: ed.serif, fontStyle: "italic", fontSize: "clamp(15px,1.7vw,19px)", color: ed.inkFaint, whiteSpace: "nowrap" }}>
              I&apos;m on
            </span>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="optional"
              aria-label="What are you on"
              style={{ flex: 1, minWidth: 120, background: "transparent", border: "none", outline: "none", fontFamily: ed.serif, fontStyle: "italic", fontSize: "clamp(15px,1.7vw,19px)", color: ed.paper }}
            />
          </div>

          <SittingTimer />
          <div style={{ height: 1, background: ed.hair }} />
          <CreativeFuel />
        </div>
      )}
    </div>
  );
}
