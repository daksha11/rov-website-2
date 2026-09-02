// lib/ctrla/path.ts
// ─────────────────────────────────────────────────────────────
// The CTRL-A path: five stops, every craft.
//
//   Learn   the craft toolkit
//   Look    a brand kit (and the one-page portfolio it exports to)
//   Work    the habit: a Lock In session, a Daily answer
//   Finish  the first finished piece, the whole point
//   Show    submit it, get featured, walk into the room
//
// This is the spine every surface reads: the nav's "next", the home page's
// lead, the toolkit's mode and its "done", the account, the credits, and
// Space (where the five stops are the five planets). Pure data, no React,
// no three, safe on the server. Progress lives in ./progress.ts.
// ─────────────────────────────────────────────────────────────

import type { CraftSlug } from "./profile";

export type StopId = "learn" | "look" | "work" | "finish" | "show";
export const STOPS: StopId[] = ["learn", "look", "work", "finish", "show"];

/** Stops that are not craft-specific are stored under the `all` craft. */
export const SHARED_STOPS: StopId[] = ["look", "work"];
export const progressCraft = (craft: CraftSlug, stop: StopId): CraftSlug | "all" => (SHARED_STOPS.includes(stop) ? "all" : craft);

export interface PathStop {
  id: StopId;
  /** Small caps label. */
  verb: string;
  /** The stop's name for this craft. */
  title: string;
  /** One line, first person plural, what happens here. */
  blurb: string;
  href: string;
  /** What the site counts as done. Shown under the stop so nobody guesses. */
  counts: string;
  /** Stops that take a link as proof. */
  evidence?: "url";
}

export const CRAFT_LABEL: Record<CraftSlug, string> = {
  music: "Music",
  design: "Design",
  "web-dev": "Development",
  video: "Video",
};

/** The first finished piece, per craft. The finish line the school exists for. */
export const FIRST_PIECE: Record<CraftSlug, { title: string; short: string }> = {
  music: { title: "Release a song", short: "a released song" },
  design: { title: "Ship a kit and a portfolio page", short: "a kit and a page" },
  "web-dev": { title: "Launch a site", short: "a live site" },
  video: { title: "Cut a short film", short: "a short film" },
};

export function pathFor(craft: CraftSlug): PathStop[] {
  const piece = FIRST_PIECE[craft];
  return [
    {
      id: "learn",
      verb: "Learn",
      title: `The ${CRAFT_LABEL[craft]} Toolkit`,
      blurb: "What we actually use, in the order you will meet it.",
      href: `/ctrla/toolkit/${craft}`,
      counts: "Read to the end of the toolkit.",
    },
    {
      id: "look",
      verb: "Look",
      title: "Your brand kit",
      blurb: "Colours, type, and a logo rule, exported in one sitting.",
      href: "/ctrla/brand-kit",
      counts: "Export a kit.",
    },
    {
      id: "work",
      verb: "Work",
      title: "Lock In",
      blurb: "A room to work in, and one small call a day to keep your taste sharp.",
      href: "/ctrla/the-fold",
      counts: "Finish a Lock In session, or answer the Daily.",
    },
    {
      id: "finish",
      verb: "Finish",
      title: piece.title,
      blurb: `The whole point. The checklist, then ${piece.short} with your name on it.`,
      href: `/ctrla/finish/${craft}`,
      counts: "Paste the link to the finished piece.",
      evidence: "url",
    },
    {
      id: "show",
      verb: "Show",
      title: "Show it",
      blurb: "Submit it to the magazine. Approved work lands on your page, with your name on it.",
      href: "/ctrla/submit",
      counts: "A submission gets approved.",
    },
  ];
}

export const stopFor = (craft: CraftSlug, id: StopId) => pathFor(craft).find((s) => s.id === id)!;
