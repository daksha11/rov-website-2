// ═══════════════════════════════════════════════════════
// THE FOLD — shared types
// The Fold is a cafe adrift past the edge of the map. You arrive
// into the Commons and drift between rooms. No modes, no ritual.
// ═══════════════════════════════════════════════════════

export type RoomId =
  | "window-seat"
  | "back-room"
  | "quiet-corner"
  | "veranda"
  | "golden-hour";

// Where you are standing. The Commons is the hub.
export type Place = "commons" | RoomId;

// The cafe's ambient layers, blendable like a mixer.
export type LayerId = "murmur" | "rain" | "music" | "hum";

export type LayerLevels = Record<LayerId, number>;

// You either arrive or you are inside. That is the whole machine.
export type Phase = "arriving" | "inside";

export type TimeBand = "dawn" | "day" | "dusk" | "night";
