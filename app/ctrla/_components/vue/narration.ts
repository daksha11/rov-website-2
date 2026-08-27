// ═══════════════════════════════════════════════════════
// VUE — TOOLKIT NARRATION
//
// Vue's voice, one set of lines per toolkit. Three beats, matching the three
// places a reader needs a hand on this page:
//
//   open      before the craft guide, where they arrive
//   stations  at Part 02, where the tool list starts
//   close     at the bottom, before the history door
//
// Voice check: first person, plain sentences, warm but a little above it all.
// She is the one who has watched a lot of people start. She is never selling
// the tools. See `vueClose` in _volumes/vol-01.ts for the reference register.
// ═══════════════════════════════════════════════════════

export interface VueNarration {
  open: string;
  stations: string;
  close: string;
}

export const VUE_NARRATION: Record<string, VueNarration> = {
  music: {
    open: "Everyone starts by buying something. Your room, your takes, and your ears will do more than the plugin list ever does. Start there, then come back for the tools.",
    stations:
      "This is what our engineers actually reach for, in the order they reach for it. Nothing is on this list because someone paid for it to be.",
    close: "You will not hear the difference on the first pass. That is normal. Keep going.",
  },
  "web-dev": {
    open: "Every stack argument you read this week was about taste, not capability. Pick the one you will still understand in six months.",
    stations: "Framework down to deploy, in the order you will meet them. We ship with all of it.",
    close: "The stack is the easy part. Shipping is the part nobody writes threads about.",
  },
  design: {
    open: "Taste is not something you can install. The right tools just stop it from getting in its own way.",
    stations: "Interface, brand, 3D, and the bits in between. Every pick here has survived a real client.",
    close: "Make the ugly version first. It is the only reliable way to find the good one.",
  },
  video: {
    open: "The camera matters less than the light, and the light matters less than knowing what you are pointing it at.",
    stations: "Bodies, glass, grip, then the room where it gets finished. In that order, on purpose.",
    close: "Cinematic is a craft, not a purchase. Shoot enough and you stop needing to be told that.",
  },
};

export const vueNarration = (toolkitId: string): VueNarration | null =>
  VUE_NARRATION[toolkitId] ?? null;
