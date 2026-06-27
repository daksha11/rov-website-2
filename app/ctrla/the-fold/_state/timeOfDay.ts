// ═══════════════════════════════════════════════════════
// THE FOLD — temporal rhythm
// The cafe reads the hour. Computed CLIENT-SIDE ONLY (after
// mount) to avoid hydration mismatch.
// ═══════════════════════════════════════════════════════

import type { TimeBand } from "./types";

export function getTimeBand(date: Date): TimeBand {
  const h = date.getHours();
  if (h >= 5 && h < 9) return "dawn";
  if (h >= 9 && h < 17) return "day";
  if (h >= 17 && h < 21) return "dusk";
  return "night";
}

// 0..1 warmth weighting the cafe's interior glow takes on by hour.
export function bandWarmth(band: TimeBand): number {
  switch (band) {
    case "dawn":
      return 0.5;
    case "day":
      return 0.3;
    case "dusk":
      return 0.75;
    case "night":
      return 0.2;
  }
}

export function greetingFor(band: TimeBand): string {
  switch (band) {
    case "dawn":
      return "Early. The light is just coming up.";
    case "day":
      return "The light is full. Find your seat.";
    case "dusk":
      return "Last light through the glass.";
    case "night":
      return "Late, and the room is yours.";
  }
}
