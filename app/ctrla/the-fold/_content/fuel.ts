// ═══════════════════════════════════════════════════════
// THE FOLD — creative fuel content
// Design prompts, a curated track, and taste cards pulled from
// the current CTRL-A volume. Static for the demo; later these
// come from the volume's editorial data.
// ═══════════════════════════════════════════════════════

import { currentVolume } from "../../_volumes";

// The live volume's display label (e.g. "Vol. 01"), so nothing here
// hardcodes the issue number: publishing a new volume updates it.
const VOL = currentVolume.issueMeta.volume;

export const DESIGN_PROMPTS: string[] = [
  "Cut the most impressive thing you made today. What is left without it?",
  "Designers earn trust in the first 50 milliseconds. What does yours promise?",
  "Find the one element doing two jobs. Give it one.",
  "If this had to work in only black and one color, which color, and why?",
  "Remove every gradient. Does the hierarchy still hold?",
  "What would the calm version of this screen look like?",
  "Name the feeling before the feature. Then build toward the feeling.",
  "Where are you decorating instead of deciding?",
  "Read your copy aloud. Cut anything that sounds like a deck.",
  "What is the smallest change that would make this feel inevitable?",
];

export interface FuelTrack {
  title: string;
  artist: string;
  note: string;
}

export const VOLUME_TRACK: FuelTrack = {
  title: "Kintsugi (Slowed)",
  artist: `On the ${VOL} playlist`,
  note: "The volume's closing track. Repair as a finish, not a flaw.",
};

export interface TasteCard {
  title: string;
  artist: string;
  medium: string;
}

export const TASTE_CARDS: TasteCard[] = [
  { title: "Mended Bowl, No. 4", artist: `Featured · ${VOL}`, medium: "Kintsugi, gold lacquer" },
  { title: "Westside, 6am", artist: `Featured · ${VOL}`, medium: "35mm, Atlanta" },
  { title: "Study in Light", artist: `Featured · ${VOL}`, medium: "Risograph, two passes" },
];
