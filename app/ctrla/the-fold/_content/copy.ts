// ═══════════════════════════════════════════════════════
// THE FOLD — copy
// All on-screen strings in one place. House voice: grounded,
// warm, refined. No em dashes.
// ═══════════════════════════════════════════════════════

export const FOLD_COPY = {
  wordmark: "The Fold",
  tagline: "You're not here to be productive. You're here because you belong somewhere.",

  manifesto: [
    "The same reason you put the TV on in the background. Not to watch it. To feel like life is happening around you while you do your thing.",
    "The Fold is a room, not a tool. Soft presence, a living stream of sound, and a quiet rhythm that reads the hour. You come here to not be alone while you work.",
  ],

  pillars: [
    { label: "Ambient Belonging", body: "Presence you feel, never presence that watches you." },
    { label: "The Living Stream", body: "An always-on layer that reads like life, not a loop." },
    { label: "Ritual Entry", body: "A short intention before the room opens." },
    { label: "Creative Fuel", body: "Small drops of taste, mid-session, from the volume." },
    { label: "Temporal Rhythm", body: "The space reads the time of day and shifts with it." },
  ],

  enterCta: "Enter the Fold",

  ritual: {
    eyebrow: "Before you go in",
    steps: {
      mode: { n: "01", prompt: "What are you here to do?" },
      duration: { n: "02", prompt: "How long do you have?" },
      oneThing: {
        n: "03",
        prompt: "Name one thing.",
        placeholder: "I'm working on",
      },
    },
    enter: "Open the Fold",
    back: "Back",
  },

  transition: {
    line: "The Fold opens.",
  },
} as const;
