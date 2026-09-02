"use client";

// ═══════════════════════════════════════════════════════
// SPACE — STATE
//
// Two kinds of state, kept deliberately apart:
//
//   1. Reactive UI state (zustand): what the HUD and dock panel render from.
//      Changes a few times a minute.
//   2. Frame state (plain refs below): ship position, body positions, speed.
//      Changes 60 times a second and must NEVER pass through React, or the
//      whole tree re-renders at 60fps and the feel test fails on the spot.
// ═══════════════════════════════════════════════════════

import { create } from "zustand";
import type { Vector3 } from "three";
import { track } from "./track";

interface SpaceState {
  /** Body the ship is close enough to dock with, or null. */
  nearId: string | null;
  /** Body the ship is docked at (panel open), or null. */
  dockedId: string | null;
  /** Body the autopilot is flying toward, or null for manual flight. */
  autopilotId: string | null;
  /** Stops the pilot has docked at this browser, persisted. */
  visited: string[];
  /** True once the intro card has been dismissed (persisted). */
  introSeen: boolean;
  /** Star-map overlay open (M key). */
  mapOpen: boolean;
  /** Rolling FPS, updated at most once a second, for the HUD meter. */
  fps: number;
  /** Current render scale (device pixel ratio the canvas draws at). */
  quality: number;
  /** Body the camera is diving toward before the page opens, or null. */
  landingId: string | null;
  /** Photo mode: HUD hidden, gold frame on. P key. */
  photo: boolean;
  /** The suggested line through the system, as body ids. */
  route: string[];
  /** Index into `route` of the next waypoint; == route.length when done. */
  step: number;
  /** Vue's bubble hidden for the session. H key. */
  guideHidden: boolean;

  setNear: (id: string | null) => void;
  dock: (id: string) => void;
  undock: () => void;
  setAutopilot: (id: string | null) => void;
  dismissIntro: () => void;
  toggleMap: (open?: boolean) => void;
  setFps: (fps: number) => void;
  setQuality: (quality: number) => void;
  land: (id: string) => void;
  togglePhoto: (on?: boolean) => void;
  setRoute: (ids: string[]) => void;
  toggleGuide: (hidden?: boolean) => void;
}

const CHARTED_KEY = "ctrla-space-charted";
/** Every planet id. Docking at all of them is the one achievement. */
const PLANETS = ["music", "web-dev", "design", "video", "atl"];

const VISITED_KEY = "ctrla-space-visited";
const INTRO_KEY = "ctrla-space-intro";

const readVisited = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(VISITED_KEY) || "[]");
  } catch {
    return [];
  }
};

export const useSpace = create<SpaceState>((set, get) => ({
  nearId: null,
  dockedId: null,
  autopilotId: null,
  visited: typeof window === "undefined" ? [] : readVisited(),
  introSeen: typeof window === "undefined" ? false : localStorage.getItem(INTRO_KEY) === "1",
  mapOpen: false,
  fps: 0,
  quality: 1,
  landingId: null,
  photo: false,
  route: [],
  step: 0,
  guideHidden: false,

  setNear: (id) => {
    if (get().nearId !== id) set({ nearId: id });
  },
  dock: (id) => {
    const visited = get().visited.includes(id) ? get().visited : [...get().visited, id];
    try {
      localStorage.setItem(VISITED_KEY, JSON.stringify(visited));
    } catch {}
    // Docking at the lit waypoint advances the line.
    const { route, step } = get();
    const next = route[step] === id ? step + 1 : step;
    set({ dockedId: id, autopilotId: null, visited, step: next });
    track("space_dock", { body: id, onRoute: route[step] === id });
    // Charted all five planets, once per device.
    try {
      if (PLANETS.every((p) => visited.includes(p)) && localStorage.getItem(CHARTED_KEY) !== "1") {
        localStorage.setItem(CHARTED_KEY, "1");
        track("space_charted_all");
      }
    } catch {}
  },
  undock: () => set({ dockedId: null }),
  setAutopilot: (id) => set({ autopilotId: id, dockedId: null }),
  dismissIntro: () => {
    try {
      localStorage.setItem(INTRO_KEY, "1");
    } catch {}
    set({ introSeen: true });
  },
  toggleMap: (open) => set((s) => ({ mapOpen: open ?? !s.mapOpen })),
  setFps: (fps) => set({ fps }),
  setQuality: (quality) => set({ quality }),
  land: (id) => set({ landingId: id, photo: false }),
  togglePhoto: (on) => set((s) => ({ photo: on ?? !s.photo })),
  setRoute: (ids) => {
    // Keep credit for stops already charted on this device.
    const visited = get().visited;
    let step = 0;
    while (step < ids.length && visited.includes(ids[step])) step++;
    set({ route: ids, step });
  },
  toggleGuide: (hidden) => set((s) => ({ guideHidden: hidden ?? !s.guideHidden })),
}));

// ── Frame state ────────────────────────────────────────
// Written by the scene every frame, read by whoever needs it, never reactive.

export const frame = {
  /** Live world position of every body, keyed by id. Bodies write, ship reads. */
  bodyPositions: new Map<string, Vector3>(),
  /** Ship world position, written by the flight controller. */
  shipPosition: { x: 0, y: 0, z: 0 },
  /** Current ship speed in world units/s, for the HUD and camera FOV. */
  shipSpeed: 0,
  /** Ship yaw in radians; 0 faces -z. The trail reads it to find the engine. */
  shipHeading: 0,
  /** Magnetic dock progress 0..1 while sitting still inside a ring. */
  dockFill: 0,
  /** Body whose approach envelope the ship is inside, or null. */
  approachId: null as string | null,
  /** One-shot beat flags the guide reads and clears. */
  boosted: false,
  edged: false,
  tookOver: false,
  /** Screen-space projection of the lit waypoint, written by the scene. */
  waypoint: { x: 0, y: 0, visible: false, onScreen: false, angle: 0 },
};
