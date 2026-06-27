"use client";

// ═══════════════════════════════════════════════════════
// THE FOLD — enter transition
// The immersive handoff. Mounts opaque over the freshly mounted
// room, holds on the wordmark for a beat, then reveals the room
// and flips the phase to active. Pure CSS, so it adds no library
// weight to the entry path. Honors reduced motion.
// ═══════════════════════════════════════════════════════

import { useEffect, useState } from "react";
import { ed } from "../../../_components/editorial";
import { FOLD_COPY } from "../../_content/copy";

export default function EnterTransition({ onDone }: { onDone: () => void }) {
  const [revealing, setRevealing] = useState(false);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const HOLD = reduce ? 150 : 420;
    const REVEAL = reduce ? 300 : 1100;

    const hold = window.setTimeout(() => setRevealing(true), HOLD);
    const done = window.setTimeout(onDone, HOLD + REVEAL);

    return () => {
      clearTimeout(hold);
      clearTimeout(done);
    };
  }, [onDone]);

  return (
    <div
      aria-hidden
      className={`fold-enter-overlay${revealing ? " is-revealing" : ""}`}
      style={{ background: ed.void }}
    >
      <span
        className="fold-enter-word"
        style={{
          fontFamily: ed.serif,
          fontStyle: "italic",
          fontSize: "clamp(28px,5vw,56px)",
          color: ed.paper,
          letterSpacing: "-0.01em",
        }}
      >
        {FOLD_COPY.transition.line}
      </span>
    </div>
  );
}
