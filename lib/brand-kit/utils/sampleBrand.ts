import type { BrandKitData } from "@/lib/brand-kit/types";

export const SAMPLE_BRAND: Pick<
  BrandKitData,
  "brandInfo" | "colors" | "gradients" | "voice"
> = {
  brandInfo: {
    name: "Range of View Studios",
    tagline: "Crafting visual stories with intent",
    website: "https://www.rovstudios.com",
    version: "v1.0",
    year: new Date().getFullYear().toString(),
    confidentialityNote: "Internal Use Only — Not for external distribution",
  },
  colors: {
    swatches: [
      {
        id: "sample-primary",
        name: "Primary",
        hex: "#B16937",
        role: "Primary",
        cssVariable: "--color-primary",
      },
      {
        id: "sample-secondary",
        name: "Secondary",
        hex: "#D0BEA5",
        role: "Secondary",
        cssVariable: "--color-secondary",
      },
      {
        id: "sample-tertiary",
        name: "Tertiary",
        hex: "#C9A961",
        role: "Tertiary",
        cssVariable: "--color-tertiary",
      },
      {
        id: "sample-accent",
        name: "Accent",
        hex: "#42201C",
        role: "Accent",
        cssVariable: "--color-accent",
      },
      {
        id: "sample-neutral",
        name: "Neutral",
        hex: "#FFF4E3",
        role: "Neutral",
        cssVariable: "--color-neutral",
      },
    ],
  },
  gradients: [
    {
      id: "sample-warm",
      name: "Warm Editorial",
      css: "linear-gradient(132deg, #EA9A61 4.77%, #B16937 27.26%, #A64D2B 50.09%, #42201C 76.74%)",
      isPrimary: true,
    },
  ],
  voice: {
    pillars: [
      {
        id: "sample-pillar-1",
        label: "Tone",
        word: "Intentional",
        description:
          "Every word earns its place. We write with purpose, not filler.",
      },
      {
        id: "sample-pillar-2",
        label: "Texture",
        word: "Warm",
        description:
          "Grounded, human, never corporate. Write like you'd speak to a trusted collaborator.",
      },
    ],
    doExamples: [
      "Lead with the outcome.",
      "Use specifics: names, numbers, places.",
    ],
    dontExamples: [
      "Don't pad with adjectives.",
      "Don't open with 'In today's world…'",
    ],
    weAre: ["Thoughtful", "Direct", "Curious"],
    weAreNot: ["Loud", "Generic", "Transactional"],
  },
};
