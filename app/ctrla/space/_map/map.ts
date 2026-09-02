// ═══════════════════════════════════════════════════════
// SPACE — THE MAP
//
// The single registry that runs the whole universe. Every body in the scene,
// every chip in the HUD, every pin on the 2D star map, and every dock panel
// renders from this array. Growing the universe is editing this list.
//
// Rules:
//   - Every stop links to a REAL page. Nothing lives only in the game.
//   - Positions are computed from orbit params at runtime, so the system is
//     always gently moving and never overlaps at rest. Orbit speeds are kept
//     slow enough that the static star map stays honest for a session.
//   - `look.palette` drives the procedural material: [deep, mid, glow].
// ═══════════════════════════════════════════════════════

export type BodyKind = "sun" | "planet" | "moon" | "asteroid" | "comet";

export interface CelestialBody {
  id: string;
  kind: BodyKind;
  /** Moons orbit the planet with this id; everything else orbits the sun. */
  parent?: string;
  /** Gold small-caps label floating over the body. */
  label: string;
  orbit: { radius: number; speed: number; phase: number };
  /** Visual radius in world units. Dock range derives from it. */
  size: number;
  look: { palette: [string, string, string]; seed: number };
  stop: {
    headline: string;
    blurb: string;
    href: string;
    /** Key into narration.ts for Vue's docked lines. */
    narrationKey: string;
  };
}

// Accents from the CTRL·A brand: each sector keeps its landing-page colour so
// the system reads as the same magazine, scattered into orbit.
const GOLD = "#E3C24A";
const NIGHT = "#0F0820";

export const BODIES: CelestialBody[] = [
  // ── The sun: the magazine itself ─────────────────────
  {
    id: "core",
    kind: "sun",
    label: "CTRL·A",
    orbit: { radius: 0, speed: 0, phase: 0 },
    size: 11,
    look: { palette: [NIGHT, "#C29A50", GOLD], seed: 1 },
    stop: {
      headline: "The Magazine",
      blurb: "The monthly volume. Everything orbiting you came from here.",
      href: "/ctrla",
      narrationKey: "core",
    },
  },

  // ── Planets: the big stops ───────────────────────────
  {
    id: "music",
    kind: "planet",
    label: "Music",
    orbit: { radius: 62, speed: 0.007, phase: 0.6 },
    size: 6.4,
    look: { palette: [NIGHT, "#A56A67", "#E0968F"], seed: 11 },
    stop: {
      headline: "The Music Toolkit",
      blurb: "DAWs to distribution. What our engineers actually run, tested in real sessions.",
      href: "/ctrla/toolkit/music",
      narrationKey: "music",
    },
  },
  {
    id: "web-dev",
    kind: "planet",
    label: "Development",
    orbit: { radius: 92, speed: 0.0055, phase: 2.4 },
    size: 7.2,
    look: { palette: [NIGHT, "#8a7429", GOLD], seed: 22 },
    stop: {
      headline: "The Dev Toolkit",
      blurb: "Framework to deploy, in the order you will meet them. We ship with all of it.",
      href: "/ctrla/toolkit/web-dev",
      narrationKey: "web-dev",
    },
  },
  {
    id: "design",
    kind: "planet",
    label: "Design",
    orbit: { radius: 124, speed: 0.00425, phase: 4.1 },
    size: 6.8,
    look: { palette: [NIGHT, "#4E3D73", "#8E76B8"], seed: 33 },
    stop: {
      headline: "The Design Toolkit",
      blurb: "Interface, brand, 3D, and the bits in between. Picks that survived real clients.",
      href: "/ctrla/toolkit/design",
      narrationKey: "design",
    },
  },
  {
    id: "video",
    kind: "planet",
    label: "Video / Film",
    orbit: { radius: 156, speed: 0.0035, phase: 5.5 },
    size: 6.6,
    look: { palette: [NIGHT, "#574191", "#8E76B8"], seed: 44 },
    stop: {
      headline: "The Film Toolkit",
      blurb: "Bodies, glass, lights, grip, and the room where the cut gets finished.",
      href: "/ctrla/toolkit/video",
      narrationKey: "video",
    },
  },
  {
    id: "atl",
    kind: "planet",
    label: "ATL",
    orbit: { radius: 192, speed: 0.00275, phase: 1.4 },
    size: 7.6,
    look: { palette: [NIGHT, "#90422C", "#EA9A61"], seed: 55 },
    stop: {
      headline: "The ATL Field Guide",
      blurb: "Where the city came from, what is on, where to start, and how to eat well on nothing.",
      href: "/ctrla/atl",
      narrationKey: "atl",
    },
  },

  // ── Moons: little stops orbiting their planet ────────
  {
    id: "claude-code",
    kind: "moon",
    parent: "web-dev",
    label: "Claude Code",
    orbit: { radius: 13, speed: 0.045, phase: 0.8 },
    size: 2.2,
    look: { palette: [NIGHT, "#8a7429", "#F0E6E0"], seed: 66 },
    stop: {
      headline: "Claude Code",
      blurb: "The AI pair we build with, and how to direct it like a senior.",
      href: "/ctrla/claude-code",
      narrationKey: "claude-code",
    },
  },
  {
    id: "brand-kit",
    kind: "moon",
    parent: "design",
    label: "Brand Kit",
    orbit: { radius: 12.5, speed: 0.05, phase: 2.2 },
    size: 2.4,
    look: { palette: [NIGHT, "#4E3D73", "#F0E6E0"], seed: 77 },
    stop: {
      headline: "The Brand Kit Builder",
      blurb: "Colors, type, and logo rules in one sitting. The standing feature, every volume.",
      href: "/ctrla/brand-kit",
      narrationKey: "brand-kit",
    },
  },
  {
    id: "design-history",
    kind: "moon",
    parent: "design",
    label: "History",
    orbit: { radius: 17, speed: 0.0325, phase: 4.9 },
    size: 1.8,
    look: { palette: [NIGHT, "#34265C", "#8E76B8"], seed: 88 },
    stop: {
      headline: "The Design History Lesson",
      blurb: "A scroll-driven story of where the craft came from.",
      href: "/ctrla/toolkit/design/history",
      narrationKey: "design-history",
    },
  },
  {
    id: "video-history",
    kind: "moon",
    parent: "video",
    label: "History",
    orbit: { radius: 12, speed: 0.04, phase: 3.3 },
    size: 1.8,
    look: { palette: [NIGHT, "#34265C", "#8E76B8"], seed: 99 },
    stop: {
      headline: "The Film History Lesson",
      blurb: "How moving pictures learned their tricks.",
      href: "/ctrla/toolkit/video/history",
      narrationKey: "video-history",
    },
  },
  {
    id: "cookbook",
    kind: "moon",
    parent: "atl",
    label: "Cookbook",
    orbit: { radius: 14, speed: 0.0375, phase: 1.1 },
    size: 2.3,
    look: { palette: [NIGHT, "#90422C", "#EA9A61"], seed: 110 },
    stop: {
      headline: "The Cookbook",
      blurb: "Eating well in Atlanta on a creative's budget.",
      href: "/ctrla/cookbook",
      narrationKey: "cookbook",
    },
  },

  // ── Asteroids: one-offs in the belt ──────────────────
  {
    id: "daily",
    kind: "asteroid",
    label: "Daily Taste Test",
    orbit: { radius: 44, speed: 0.01, phase: 3.9 },
    size: 1.6,
    look: { palette: [NIGHT, "#6a5320", GOLD], seed: 121 },
    stop: {
      headline: "The Daily Taste Test",
      blurb: "One small call a day. Your taste, measured over time.",
      href: "/ctrla/daily",
      narrationKey: "daily",
    },
  },
  {
    id: "start",
    kind: "asteroid",
    label: "Start Here",
    orbit: { radius: 36, speed: 0.012, phase: 0.2 },
    size: 1.8,
    look: { palette: [NIGHT, "#6a5320", GOLD], seed: 132 },
    stop: {
      headline: "Start Here",
      blurb: "Four taps and CTRL·A points you at your part of it.",
      href: "/ctrla/start",
      narrationKey: "start",
    },
  },
  {
    id: "submit",
    kind: "asteroid",
    label: "Submit",
    orbit: { radius: 210, speed: 0.0025, phase: 2.9 },
    size: 1.6,
    look: { palette: [NIGHT, "#5E4657", "#A56A67"], seed: 143 },
    stop: {
      headline: "Submit Your Work",
      blurb: "The magazine runs on what the community makes. Show us.",
      href: "/ctrla/submit",
      narrationKey: "submit",
    },
  },
  {
    id: "credits",
    kind: "asteroid",
    label: "Credits",
    orbit: { radius: 224, speed: 0.00225, phase: 5.1 },
    size: 1.4,
    look: { palette: [NIGHT, "#45364F", "#F0E6E0"], seed: 154 },
    stop: {
      headline: "The Credits",
      blurb: "Everyone whose hands are on this volume.",
      href: "/ctrla/credits",
      narrationKey: "credits",
    },
  },

  // ── Comet: the current volume's feature ──────────────
  {
    id: "dreamasia",
    kind: "comet",
    label: "DreamAsia Fest",
    orbit: { radius: 138, speed: 0.0095, phase: 0 },
    size: 2.6,
    look: { palette: [NIGHT, "#C29A50", "#F0E6E0"], seed: 165 },
    stop: {
      headline: "From the Bedroom to the Stage",
      blurb: "Inside DreamAsia Fest, this volume's deep feature.",
      href: "/ctrla/dreamasia",
      narrationKey: "dreamasia",
    },
  },
];

export const bodyById = (id: string) => BODIES.find((b) => b.id === id);

/**
 * Where a body sits at t=0 (moons: relative to their parent's rest spot).
 * Used to spawn the ship next to a `?at=` stop before the scene has ticked.
 */
export function restPosition(id: string): { x: number; z: number } {
  const b = bodyById(id);
  if (!b) return { x: 0, z: 0 };
  const base = b.parent ? restPosition(b.parent) : { x: 0, z: 0 };
  return { x: base.x + Math.cos(b.orbit.phase) * b.orbit.radius, z: base.z + Math.sin(b.orbit.phase) * b.orbit.radius };
}

/** Stops shown as HUD chips: the sun and planets, in orbit order. */
export const MAJOR_STOPS = BODIES.filter((b) => b.kind === "sun" || b.kind === "planet");
