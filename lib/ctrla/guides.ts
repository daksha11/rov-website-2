// lib/ctrla/guides.ts
// ─────────────────────────────────────────────────────────────
// The CTRL-A guide registry. Toolkit "taste" stays free; the deep guides
// and crash courses gate behind an email (rung 1, the lead-capture engine)
// with the option to flip a single guide to a credit cost later.
//
// One place to declare a guide's gate. A guide page reads its entry here,
// so switching a guide from "email" to "credits" is a one-line change, not
// a rewrite. The completion reward (guide-complete) is granted server-side
// via /api/credits/earn keyed by slug, so finishing pays exactly once.
// ─────────────────────────────────────────────────────────────

export type GuideGate = "email" | "credits";

export interface Guide {
  slug: string;
  title: string;
  toolkit: "music" | "web-dev" | "design" | "video" | "general";
  gate: GuideGate;
  /** Short line for the gate teaser. */
  blurb?: string;
}

export const GUIDES: Record<string, Guide> = {
  "claude-code-crash-course": {
    slug: "claude-code-crash-course",
    title: "The Claude Code Crash Course",
    toolkit: "web-dev",
    gate: "email",
    blurb: "The full crash course, start to finish. Drop your email and it opens right here.",
  },
};

export function getGuide(slug: string): Guide | undefined {
  return GUIDES[slug];
}
