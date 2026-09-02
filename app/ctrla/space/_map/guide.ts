// ═══════════════════════════════════════════════════════
// SPACE — VUE'S GUIDE SCRIPT
//
// Everything Vue says from the bubble, keyed by beat. Same voice as the
// magazine close: first person, plain, warm, a little above it all. Short,
// because the bubble is small and the pilot is flying. `{label}` and
// `{route}` are filled in by the guide.
//
// The quiz is the /ctrla/start quiz, word for word, so a profile answered
// in the cockpit means exactly what one answered on the page means.
// ═══════════════════════════════════════════════════════

import type { CraftSlug, Intent, Level } from "@/lib/ctrla/profile";

/** First words after the intro, by primary craft. */
export const GREET: Record<CraftSlug, string> = {
  music: "Music first. I drew you a line: {route}. W to go, and I will tell you when to brake.",
  design: "Design. Your line: {route}. I fly the parking, you fly the rest.",
  "web-dev": "Builder. Your line: {route}. Development is the gold one; Claude Code is the moon on it.",
  video: "Film. Your line: {route}. Sound and a city are on it on purpose.",
};

export const LINES = {
  greetNoProfile: "Before we fly. Four taps and I will draw you a line through this.",
  next: "Next on your line: {label}.",
  takeOver: "Yours. I will keep the line lit.",
  approach: "Easing us in. Sit inside the ring and I will dock us.",
  approachOff: "Not on the line. Slowing anyway.",
  offRoute: "Not on the plan. Good.",
  idle: "Press M for the map, or hold W and pick a direction.",
  edge: "Nothing past here yet. Next volume.",
  firstBoost: "There she goes.",
  complete: "That is your line charted. The rest of the sky is yours.",
  quizDone: "Got it. Drawing your line.",
  hidden: "Press H if you want me back.",
} as const;

/** Why this stop, for the "Why this stop?" reply. One line each. */
export const WHY: Record<string, string> = {
  core: "Every stop out here came from this. Worth seeing from above once.",
  music: "The chain our engineers actually run. Rooms and ears before plugins.",
  "web-dev": "Framework to deploy, in the order you will meet them.",
  design: "Taste cannot be installed, but the wrong tools get in its way.",
  video: "Bodies, glass, light, and the finish room. Light matters most.",
  atl: "The city most of this grew out of. It feeds people who show up.",
  "claude-code": "The AI pair we build with, and how to direct it like a senior.",
  "brand-kit": "Colours, type, and logo rules in one sitting. You need a look before a launch.",
  "design-history": "Where the craft came from. It makes your own choices feel less random.",
  "video-history": "How moving pictures learned their tricks. Every cut you like is in here.",
  cookbook: "Eating well on a creative's budget. Most careers stall on this, not talent.",
  daily: "One small call a day. Taste is a muscle; this is the gym.",
  start: "Four questions, and the magazine opens where you need it.",
  submit: "The magazine runs on what the community makes. This is the door in.",
  credits: "Everyone whose hands are on this volume. You could be on the next one.",
  dreamasia: "From the bedroom to the stage. This volume's deep feature.",
};

// ── The quiz, in the bubble ────────────────────────────

export type QuizKey = "craft" | "level" | "intent" | "hasBrand";
export interface QuizStep {
  key: QuizKey;
  question: string;
  options: { label: string; value: CraftSlug | Level | Intent | boolean }[];
}

export const QUIZ: QuizStep[] = [
  {
    key: "craft",
    question: "What do you make?",
    options: [
      { label: "Music", value: "music" },
      { label: "Design", value: "design" },
      { label: "Websites", value: "web-dev" },
      { label: "Video", value: "video" },
    ],
  },
  {
    key: "level",
    question: "How far in are you?",
    options: [
      { label: "Just starting", value: "beginner" },
      { label: "Made a few things", value: "beginner" },
      { label: "I do this seriously", value: "expert" },
    ],
  },
  {
    key: "intent",
    question: "What did you come for?",
    options: [
      { label: "Get better", value: "craft" },
      { label: "Build my look", value: "brand" },
      { label: "Finish something", value: "release" },
      { label: "Meet ATL creatives", value: "atlanta" },
    ],
  },
  {
    key: "hasBrand",
    question: "Got a look yet? Name, logo, colours.",
    options: [
      { label: "Yes", value: true },
      { label: "Not yet", value: false },
    ],
  },
];
