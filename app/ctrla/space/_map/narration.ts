// ═══════════════════════════════════════════════════════
// SPACE — VUE'S FLIGHT SCRIPT
//
// What Vue says at each dock, plus the ambient lines she drops while you fly.
// Voice check, same register as the magazine close: first person, plain
// sentences, warm, a little above it all. Never selling. Two beats per stop:
// `arrive` when the panel opens, `nudge` under the Enter button.
// ═══════════════════════════════════════════════════════

export interface DockScript {
  arrive: string;
  nudge: string;
}

export const NARRATION: Record<string, DockScript> = {
  core: {
    arrive: "This is the whole thing from above. Every volume we publish adds something to this sky.",
    nudge: "The magazine reads fine from a couch too.",
  },
  music: {
    arrive: "The Music planet. Rooms, takes, and ears first. The plugin list matters less than anyone admits.",
    nudge: "Go hear what our engineers actually reach for.",
  },
  "web-dev": {
    arrive: "Development. Every stack argument you have ever read was about taste, not capability.",
    nudge: "Framework down to deploy, in order.",
  },
  design: {
    arrive: "Design. Taste is not something you can install, but the right tools stop it from getting in its own way.",
    nudge: "Every pick down there survived a real client.",
  },
  video: {
    arrive: "Film. The camera matters less than the light, and the light matters less than knowing what you are pointing it at.",
    nudge: "Bodies, glass, grip, then the finish room.",
  },
  atl: {
    arrive: "Atlanta. The city most of this magazine grew out of. It feeds people who show up.",
    nudge: "Roots, the scene, the map, the cookbook.",
  },
  "claude-code": {
    arrive: "A small moon with a lot of gravity. The AI pair we build with every day.",
    nudge: "Learn to direct it like a senior.",
  },
  "brand-kit": {
    arrive: "The Brand Kit moon. Colors, type, and logo rules in one sitting, before taste arguments eat your week.",
    nudge: "Make the kit. Argue later.",
  },
  "design-history": {
    arrive: "Where the craft came from. Knowing the lineage is half of taste.",
    nudge: "A short scroll through a long story.",
  },
  "video-history": {
    arrive: "How moving pictures learned their tricks. Most of them are older than you think.",
    nudge: "The cut you love was invented twice.",
  },
  cookbook: {
    arrive: "The Cookbook moon. Eating well on nothing is a creative skill like any other.",
    nudge: "Cheap does not mean sad.",
  },
  daily: {
    arrive: "A small rock with a daily habit on it. One taste call a day, measured over time.",
    nudge: "Thirty seconds. Come back tomorrow.",
  },
  start: {
    arrive: "If you just got here, this rock is for you. Four taps and I point you at your part of all this.",
    nudge: "Twenty seconds. No email.",
  },
  submit: {
    arrive: "The magazine runs on what people like you make. This is where you hand it to us.",
    nudge: "Show us the thing you keep almost posting.",
  },
  credits: {
    arrive: "Everyone whose hands are on this volume. Small rock, heavy names.",
    nudge: "Read who built the sky you are flying in.",
  },
  dreamasia: {
    arrive: "That comet is this volume's feature. From the bedroom to the stage, inside DreamAsia Fest.",
    nudge: "Catch it while it is still passing.",
  },
};

/** Ambient one-liners while flying. Throttled hard by the HUD so they stay charming. */
/**
 * The intro when the quiz already told us what they make. Keyed by planet
 * id (which is the craft slug). Vue skips the tour and points at their room.
 */
export const HOME_LINE: Record<string, string> = {
  music: "You told me you make music. That planet is yours. Let me fly you there first, then it is all open.",
  design: "You said design. Your planet is the plum one, with the brand kit turning around it. Start there.",
  "web-dev": "You build. Development is the gold planet, with Claude Code in orbit. I will take you in.",
  video: "You shoot. Film is out past Design. Sit back, this first hop is on me.",
};

export const AMBIENT: string[] = [
  "The gold rings mean you can dock.",
  "Press M if you lose the map in your head.",
  "No rush. The orbits are slow on purpose.",
  "Everything out here links to something real.",
  "The comet is on a schedule. Comets always are.",
];
