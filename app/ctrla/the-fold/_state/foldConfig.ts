// ═══════════════════════════════════════════════════════
// THE FOLD — the cafe map
// The Commons plus the rooms. Each place has a mood (its own
// Japanese-gradient temperature, set in CSS by data-place), an
// ambient mix preset, and a rough sense of how busy it tends to be.
// ═══════════════════════════════════════════════════════

import type { Place, RoomId, LayerId, LayerLevels } from "./types";

export interface PlaceDef {
  id: Place;
  name: string;
  sub: string; // the quiet mental-state subtitle
  blurb: string;
  preset: LayerLevels; // default ambient blend, 0..1 per layer
  unlock: number; // visits required before the door opens
  popularity: number; // ~how many patrons tend to be here
}

export const LAYERS: { id: LayerId; label: string }[] = [
  { id: "murmur", label: "Murmur" },
  { id: "music", label: "Music" },
  { id: "rain", label: "Rain" },
  { id: "hum", label: "Hum" },
];

export const COMMONS: PlaceDef = {
  id: "commons",
  name: "The Commons",
  sub: "the floor",
  blurb: "Warm light, others around, and a window the size of a wall.",
  preset: { murmur: 0.7, music: 0.45, rain: 0, hum: 0.18 },
  unlock: 0,
  popularity: 22,
};

export const ROOMS: PlaceDef[] = [
  {
    id: "window-seat",
    name: "The Window Seat",
    sub: "wide open",
    blurb: "Early ideation. Room to think, and the biggest view.",
    preset: { murmur: 0.3, music: 0.3, rain: 0.12, hum: 0 },
    unlock: 0,
    popularity: 9,
  },
  {
    id: "back-room",
    name: "The Back Room",
    sub: "in it",
    blurb: "Deep focus. Low and dense, the machine hum.",
    preset: { murmur: 0.4, music: 0.22, rain: 0, hum: 0.6 },
    unlock: 0,
    popularity: 12,
  },
  {
    id: "quiet-corner",
    name: "The Quiet Corner",
    sub: "stuck",
    blurb: "For when you are blocked. Dim, rain on the dome.",
    preset: { murmur: 0.18, music: 0, rain: 0.72, hum: 0.2 },
    unlock: 0,
    popularity: 5,
  },
  {
    id: "veranda",
    name: "The Veranda",
    sub: "last light",
    blurb: "Finishing well. The gold horizon through the glass.",
    preset: { murmur: 0.38, music: 0.55, rain: 0, hum: 0.12 },
    unlock: 0,
    popularity: 8,
  },
  {
    id: "golden-hour",
    name: "Golden Hour",
    sub: "earned",
    blurb: "The back patio. Rare and electric.",
    preset: { murmur: 0.4, music: 0.7, rain: 0, hum: 0.3 },
    unlock: 3,
    popularity: 6,
  },
];

export const ALL_PLACES: PlaceDef[] = [COMMONS, ...ROOMS];

export const GOLDEN_HOUR_UNLOCK = 3;

// Optional "sittings" you can set inside a room. Never required.
export const SITTINGS: { label: string; ms: number | null }[] = [
  { label: "25", ms: 25 * 60 * 1000 },
  { label: "45", ms: 45 * 60 * 1000 },
  { label: "90", ms: 90 * 60 * 1000 },
];

export function placeDef(id: Place): PlaceDef {
  return ALL_PLACES.find((p) => p.id === id) ?? COMMONS;
}

export function isRoom(id: Place): id is RoomId {
  return id !== "commons";
}
