"use client";

// ═══════════════════════════════════════════════════════
// THE FOLD — the cafe scene
// The immersive shell every place shares. The mood (gradient
// temperature, light) shifts by data-place. Composes the window,
// the warm interior, a couple of hanging lights, and a soft
// scatter of patrons. Kept minimal: no steam, no clutter.
// The UI overlay is passed as children.
// ═══════════════════════════════════════════════════════

import type { ReactNode } from "react";
import type { Place } from "../_state/types";
import type { Dot, Whisper as W } from "../_presence/usePresence";
import CafeWindow from "./CafeWindow";
import Patrons from "./Patrons";
import Whisper from "./Whisper";

export default function CafeScene({
  place,
  dots,
  whisper,
  children,
}: {
  place: Place;
  dots: Dot[];
  whisper: W | null;
  children: ReactNode;
}) {
  return (
    <div className="fold-scene" data-place={place}>
      <div aria-hidden className="fold-scene-atmos" />
      <CafeWindow />
      <div aria-hidden className="fold-interior" />
      <div aria-hidden className="fold-lights">
        <span className="fold-lamp" style={{ left: "28%" }} />
        <span className="fold-lamp" style={{ left: "72%" }} />
      </div>
      <Patrons dots={dots} />
      <Whisper whisper={whisper} />
      {children}
    </div>
  );
}
