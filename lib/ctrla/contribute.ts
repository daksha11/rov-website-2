// lib/ctrla/contribute.ts
// ─────────────────────────────────────────────────────────────
// The contribution loop, as data. CTRL·A is an open school: anyone
// submits, an editor reviews weekly, approved work ships with a byline.
// This module holds the three things every surface needs to make that
// visible: the ranks, the good-first asks per craft, and the house
// changelog (what ROV itself shipped, so community commits sit next to
// ours instead of in a separate room).
// ─────────────────────────────────────────────────────────────

import type { CraftSlug } from "./profile";
import type { SubmissionType } from "./community";

// ── Ranks: mirror the Discord ladder (Visitor → Artist → Resident) ────
export type Rank = "visitor" | "artist" | "resident";

export const RANK_META: Record<Rank, { label: string; blurb: string; next?: string }> = {
  visitor: {
    label: "Visitor",
    blurb: "Reading, looking around. Everyone starts here.",
    next: "Finish a first piece, or get one contribution approved, and you are an Artist.",
  },
  artist: {
    label: "Artist",
    blurb: "Finished a first piece, or improved the school once.",
    next: "Three approved contributions, or a featured piece, and you are a Resident.",
  },
  resident: {
    label: "Resident",
    blurb: "Keeps the school sharp. Bylines on the toolkits, a seat in the inner room.",
  },
};

export function rankFor(input: { approved: number; featured: number; finished: boolean }): Rank {
  if (input.featured > 0 || input.approved >= 3) return "resident";
  if (input.approved >= 1 || input.finished) return "artist";
  return "visitor";
}

// ── Good first contributions ─────────────────────────────────────────
// Concrete, small, and true to the beginner: things a person who just
// walked the path can hand back. Each maps to a real submission type and
// opens the form with the toolkit pre-chosen.
export interface GoodFirst {
  type: SubmissionType;
  title: string;
  why: string;
}

export const GOOD_FIRST: Record<CraftSlug, GoodFirst[]> = {
  music: [
    { type: "tool", title: "The free plugin you actually reach for", why: "One VST or sample pack, and the one thing it is good at. Beginners need three tools, not thirty." },
    { type: "resource", title: "The video that made mixing click", why: "The one tutorial that finally explained gain staging, or EQ, or vocal chains, in plain words." },
    { type: "history", title: "An Atlanta record that changed the sound", why: "A date, a record, one sentence on why it mattered. The history section is built from these." },
    { type: "idea", title: "A step the Finish checklist is missing", why: "You just released a song. What did nobody warn you about? That is the next checklist item." },
  ],
  "web-dev": [
    { type: "tool", title: "The tool that saved your first deploy", why: "A CLI, a host, a checker. One line on what broke before you found it." },
    { type: "resource", title: "The doc page you keep open", why: "A reference that actually reads well. Beginners need the good page, not the whole site." },
    { type: "history", title: "A moment the web changed for builders", why: "A date, a release, a sentence. The build history is a timeline of these." },
    { type: "idea", title: "A step the Finish checklist is missing", why: "You just shipped a site. What did nobody warn you about? That is the next checklist item." },
  ],
  design: [
    { type: "tool", title: "The free font pairing that works every time", why: "Two faces, where you got them, what they are good for." },
    { type: "resource", title: "The read that fixed your typography", why: "One article or video that changed how you set type or pick color." },
    { type: "history", title: "An Atlanta studio or piece worth knowing", why: "A date, a name, one sentence. Local history is thin here; fill it." },
    { type: "idea", title: "A step the Finish checklist is missing", why: "You just built a kit and a page. What did nobody warn you about?" },
  ],
  video: [
    { type: "tool", title: "The free edit or color tool you use", why: "One app or LUT pack, and the job it does." },
    { type: "resource", title: "The tutorial that fixed your audio", why: "Bad sound sinks more short films than bad picture. Share the one that helped." },
    { type: "history", title: "An Atlanta film moment worth a date", why: "A production, a release, a place. One sentence on why." },
    { type: "idea", title: "A step the Finish checklist is missing", why: "You just finished a short. What did nobody warn you about?" },
  ],
};

export const submitHref = (type: SubmissionType, craft?: CraftSlug) =>
  craft ? `/ctrla/submit/${type}?toolkit=${craft}` : `/ctrla/submit/${type}`;

/** "Suggest a tool" → "tool", for tight labels in rows. */
export const shortTypeLabel = (label: string) => label.replace(/^(Suggest|Share|Report|Pitch|Add|Submit) (a |an )?/, "");

// ── House changelog ──────────────────────────────────────────────────
// What ROV shipped to the school itself. Community commits come from the
// database; these are ours, kept short. Newest first. Add a line when
// something a member would notice lands.
export interface HouseEntry {
  date: string; // ISO date
  title: string;
  note: string;
  href?: string;
}

export const HOUSE_CHANGELOG: HouseEntry[] = [
  { date: "2026-09-01", title: "The Path", note: "Five stops per craft, the same on every page. Progress follows you when you sign in.", href: "/ctrla/start" },
  { date: "2026-09-01", title: "Finish pages", note: "One checklist per craft for the first finished piece. Open to suggestions, like everything else.", href: "/ctrla/finish/music" },
  { date: "2026-09-01", title: "Changelog and bylines", note: "Approved contributions now show on the toolkit they improved, with the author's name, and here." },
  { date: "2026-08-30", title: "Space", note: "The map of the school as a place you fly through. Vue rides along.", href: "/ctrla/space" },
  { date: "2026-08-28", title: "Vue narrates", note: "The guide got a face, and a voice on every toolkit.", href: "/ctrla/toolkit/music" },
  { date: "2026-08-27", title: "CTRL·A nav", note: "Its own navigation, and a front door at /ctrla/start.", href: "/ctrla" },
];
