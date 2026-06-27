"use client";

// The crowd in the room. Soft glows, capped so a busy room stays
// cheap. They sit in the lower interior, never over the window.

import PresenceDot from "./PresenceDot";
import type { Dot } from "../_presence/usePresence";

const CAP = 20;

export default function Patrons({ dots }: { dots: Dot[] }) {
  const shown = dots.length > CAP ? dots.slice(0, CAP) : dots;
  return (
    <div aria-hidden className="fold-patrons">
      {shown.map((d) => (
        <PresenceDot key={d.id} dot={d} />
      ))}
    </div>
  );
}
