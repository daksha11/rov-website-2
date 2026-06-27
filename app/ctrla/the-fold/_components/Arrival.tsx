"use client";

// ═══════════════════════════════════════════════════════
// THE FOLD — arrival
// The door. You step through, the room warms up under you, and the
// overlay lifts onto the Commons. Pure CSS so it adds no library
// weight to the entry path. Honors reduced motion.
// ═══════════════════════════════════════════════════════

import { useEffect, useState } from "react";
import { ed } from "../../_components/editorial";
import { FOLD_COPY } from "../_content/copy";

export default function Arrival({ onArrived }: { onArrived: () => void }) {
  const [lifting, setLifting] = useState(false);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const HOLD = reduce ? 200 : 900;
    const LIFT = reduce ? 300 : 1300;
    const hold = window.setTimeout(() => setLifting(true), HOLD);
    const done = window.setTimeout(onArrived, HOLD + LIFT);
    return () => {
      clearTimeout(hold);
      clearTimeout(done);
    };
  }, [onArrived]);

  return (
    <div aria-hidden className={`fold-arrival${lifting ? " is-lifting" : ""}`} style={{ background: ed.void }}>
      <div className="fold-arrival-inner">
        <span style={{ fontFamily: ed.mono, fontSize: "clamp(9px,1.1vw,11px)", letterSpacing: "0.3em", textTransform: "uppercase", color: ed.gold }}>
          {FOLD_COPY.kicker}
        </span>
        <span className="fold-arrival-word" style={{ fontFamily: ed.serif, fontStyle: "italic", fontSize: "clamp(40px,8vw,96px)", color: ed.paper, letterSpacing: "-0.01em" }}>
          {FOLD_COPY.wordmark}
        </span>
      </div>
    </div>
  );
}
