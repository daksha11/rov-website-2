"use client";

// An opt-in whisper, drifting through as texture. Not chat. One at
// a time, faint, then gone.

import { ed } from "../../_components/editorial";
import type { Whisper as W } from "../_presence/usePresence";

export default function Whisper({ whisper }: { whisper: W | null }) {
  if (!whisper) return null;
  return (
    <span
      key={whisper.id}
      className="fold-whisper"
      aria-hidden
      style={{
        position: "absolute",
        top: `${whisper.lane * 100}%`,
        left: 0,
        zIndex: 2,
        whiteSpace: "nowrap",
        fontFamily: ed.serif,
        fontStyle: "italic",
        fontSize: "clamp(13px,1.6vw,18px)",
        color: "rgba(240,230,224,0.32)",
        pointerEvents: "none",
      }}
    >
      {whisper.text}
    </span>
  );
}
