// ═══════════════════════════════════════════════════════
// SPACE — ROUTES
//
// The quiz profile becomes a five-stop line through the system. The line is
// a suggestion: everything stays open, one waypoint is lit at a time, and
// docking anywhere else still counts. Every route crosses into a second
// craft on purpose; the wildcard is where the magazine earns its keep.
//
// Pure data in, ids out. Keep it that way so the star map, the HUD, and
// Vue all read the same line.
// ═══════════════════════════════════════════════════════

import type { CtrlAProfile } from "@/lib/ctrla/profile";
import { bodyById } from "./map";

/** Before the quiz: the core and the four craft planets. */
export const GRAND_TOUR = ["core", "music", "design", "web-dev", "video"];

export function routeFor(p: CtrlAProfile | null): string[] {
  if (!p) return GRAND_TOUR;
  const craft = p.crafts[0];
  const second = p.crafts[1];
  const expert = p.level === "expert";
  const look = p.hasBrand ? "daily" : "brand-kit";

  let r: string[];
  if (p.intent === "atlanta") {
    r = ["atl", "cookbook", "dreamasia", craft, "submit"];
  } else if (p.intent === "brand") {
    // A designer building their look would see Design twice; give them
    // the history lesson instead.
    r = craft === "design" ? ["brand-kit", "design", "design-history", "daily", "submit"] : ["brand-kit", craft, "design", "daily", "submit"];
  } else if (p.intent === "release") {
    r = [craft, "submit", "dreamasia", "daily", "atl"];
  } else {
    switch (craft) {
      case "music":
        r = expert ? ["music", "submit", "dreamasia", "atl", "credits"] : ["music", look, "dreamasia", "atl", "submit"];
        break;
      case "design":
        r = expert
          ? ["design", "web-dev", "submit", "dreamasia", "credits"]
          : p.hasBrand
          ? ["design", "design-history", "web-dev", "daily", "submit"]
          : ["brand-kit", "design", "design-history", "daily", "submit"];
        break;
      case "web-dev":
        r = expert ? ["web-dev", "claude-code", "submit", "design", "credits"] : ["web-dev", "claude-code", "design", look, "submit"];
        break;
      case "video":
      default:
        r = expert ? ["video", "submit", "dreamasia", "music", "credits"] : ["video", "video-history", "music", "atl", "submit"];
        break;
    }
  }

  // A second craft takes the wildcard slot, so a designer who also makes
  // music sees both of their rooms on the line.
  if (second && !r.includes(second)) r[3] = second;

  // Never trust a hand-typed id past the registry.
  const seen = new Set<string>();
  return r.filter((id) => bodyById(id) && !seen.has(id) && seen.add(id));
}
