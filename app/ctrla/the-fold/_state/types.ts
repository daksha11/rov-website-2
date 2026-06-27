// ═══════════════════════════════════════════════════════
// THE FOLD — shared types
// Kept dependency-free and tiny so they can be imported from
// anywhere (including the lightweight landing) without pulling
// in audio or presence code.
// ═══════════════════════════════════════════════════════

export type Mode = "design" | "write" | "build" | "just-be";

export type DurationKey = "25" | "45" | "90" | "open";

export type Soundscape =
  | "wide-open"
  | "in-it"
  | "last-light"
  | "static"
  | "golden-hour";

export type TimeBand = "dawn" | "day" | "dusk" | "night";

// The session moves through these phases in-page. No route change.
export type Phase =
  | "landing"   // the editorial intro, pre-commitment
  | "ritual"    // the 15-second intention flow
  | "entering"  // the immersive handoff (magazine fades, the Fold opens)
  | "active"    // you are in the room
  | "ending"    // the timer has landed
  | "done";     // "what did you make?"

export interface Intention {
  mode: Mode;
  durationKey: DurationKey;
  oneThing: string;
}
