// ═══════════════════════════════════════════════════════
// THE FOLD — temporal rhythm
// The space reads time-of-day and adjusts. Computed CLIENT-SIDE
// ONLY (after mount) to avoid hydration mismatch: the server has
// no clock that agrees with the visitor's.
// ═══════════════════════════════════════════════════════

import type { TimeBand, Soundscape } from "./types";

export function getTimeBand(date: Date): TimeBand {
  const h = date.getHours();
  if (h >= 5 && h < 9) return "dawn";
  if (h >= 9 && h < 17) return "day";
  if (h >= 17 && h < 21) return "dusk";
  return "night";
}

// A gentle default: the room suggests a soundscape that fits the hour.
// The visitor can always override.
export function defaultSoundscapeFor(band: TimeBand): Soundscape {
  switch (band) {
    case "dawn":
      return "wide-open";
    case "day":
      return "in-it";
    case "dusk":
      return "last-light";
    case "night":
      return "in-it";
  }
}

// Atmosphere weighting per band (0..1 warmth). The room backdrop reads this.
// Kept as plain numbers so CSS custom properties can consume it.
export function bandWarmth(band: TimeBand): number {
  switch (band) {
    case "dawn":
      return 0.45;
    case "day":
      return 0.25;
    case "dusk":
      return 0.7;
    case "night":
      return 0.15;
  }
}
