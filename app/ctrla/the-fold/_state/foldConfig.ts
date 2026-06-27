// ═══════════════════════════════════════════════════════
// THE FOLD — configuration
// Single source for modes, durations, soundscapes, and the
// timings that govern the room. Pure data, no React.
// ═══════════════════════════════════════════════════════

import type { Mode, DurationKey, Soundscape } from "./types";

// The four ways in. "verb" is what the presence layer counts
// ("11 Designing · 8 Writing · 6 Building").
export const MODES: { id: Mode; label: string; verb: string }[] = [
  { id: "design", label: "Design", verb: "Designing" },
  { id: "write", label: "Write", verb: "Writing" },
  { id: "build", label: "Build", verb: "Building" },
  { id: "just-be", label: "Just Be", verb: "Present" },
];

export const DURATIONS: { key: DurationKey; label: string; ms: number | null }[] = [
  { key: "25", label: "25 min", ms: 25 * 60 * 1000 },
  { key: "45", label: "45 min", ms: 45 * 60 * 1000 },
  { key: "90", label: "90 min", ms: 90 * 60 * 1000 },
  { key: "open", label: "Open", ms: null }, // no ring, no end. just the room.
];

// Soundscapes are named by mental state, not place.
// `unlock` is the session count required before it appears.
export const SOUNDSCAPES: {
  id: Soundscape;
  label: string;
  blurb: string;
  unlock: number;
}[] = [
  { id: "wide-open", label: "Wide Open", blurb: "Early ideation. Sparse, room to think.", unlock: 0 },
  { id: "in-it", label: "In It", blurb: "Deep execution. Dense room tone.", unlock: 0 },
  { id: "last-light", label: "Last Light", blurb: "Finishing well. Evening ambience.", unlock: 0 },
  { id: "static", label: "Static", blurb: "For when you are blocked. Textured noise.", unlock: 0 },
  { id: "golden-hour", label: "Golden Hour", blurb: "Rare and electric. Earned, not chosen.", unlock: 3 },
];

export const GOLDEN_HOUR_UNLOCK = 3;

// Creative fuel rotates a new prompt on this cadence.
export const FUEL_ROTATE_MS = 25 * 60 * 1000;

// The session timer's "you're in it" beat fires at the halfway mark.
export const HALFWAY_FRACTION = 0.5;

export function durationMs(key: DurationKey): number | null {
  return DURATIONS.find((d) => d.key === key)?.ms ?? null;
}

export function modeVerb(id: Mode): string {
  return MODES.find((m) => m.id === id)?.verb ?? "Present";
}

export function modeLabel(id: Mode): string {
  return MODES.find((m) => m.id === id)?.label ?? "Just Be";
}
