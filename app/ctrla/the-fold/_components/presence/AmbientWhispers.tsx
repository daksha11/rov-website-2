"use client";

// Occasional opt-in whispers that drift through. Not a chat, not a
// feed. Texture. One at a time, faint, then gone.

import { ed } from "../../../_components/editorial";
import type { Whisper } from "../../_presence/usePresence";

export default function AmbientWhispers({ whisper }: { whisper: Whisper | null }) {
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
        zIndex: 1,
        whiteSpace: "nowrap",
        fontFamily: ed.serif,
        fontStyle: "italic",
        fontSize: "clamp(13px,1.6vw,18px)",
        color: "rgba(240,230,224,0.34)",
        pointerEvents: "none",
      }}
    >
      {whisper.text}
    </span>
  );
}
