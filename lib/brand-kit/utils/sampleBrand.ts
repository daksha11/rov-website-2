import type { BrandKitData } from "@/lib/brand-kit/types";
import {
  CTRLA_LOGO_WHITE,
  CTRLA_LOGO_COLOR,
  CTRLA_LOGO_BLACK,
} from "@/lib/brand-kit/utils/ctrlaLogos";

const LOGO_BG_PRESETS = [
  { label: "Cream", color: "#F0E6E0" },
  { label: "Night", color: "#0F0820" },
  { label: "Black", color: "#000000" },
];

export const SAMPLE_BRAND: Pick<
  BrandKitData,
  "brandInfo" | "logos" | "colors" | "gradients" | "voice"
> = {
  brandInfo: {
    name: "CTRL-A",
    tagline: "A creative platform by Range of View Studios",
    website: "https://www.rovstudios.com/ctrla",
    version: "Vol. 01",
    year: new Date().getFullYear().toString(),
    confidentialityNote: "Range of View Studios. All rights reserved.",
  },
  logos: {
    variants: [
      {
        id: "sample-logo-white",
        label: "Flat White",
        file: CTRLA_LOGO_WHITE,
        format: "svg",
        backgroundPresets: LOGO_BG_PRESETS,
        defaultBackground: "#0F0820",
        blendMode: "normal",
      },
      {
        id: "sample-logo-color",
        label: "Flat Color",
        file: CTRLA_LOGO_COLOR,
        format: "svg",
        backgroundPresets: LOGO_BG_PRESETS,
        defaultBackground: "#0F0820",
        blendMode: "normal",
      },
      {
        id: "sample-logo-black",
        label: "Flat Black",
        file: CTRLA_LOGO_BLACK,
        format: "svg",
        backgroundPresets: LOGO_BG_PRESETS,
        defaultBackground: "#F0E6E0",
        blendMode: "normal",
      },
    ],
  },
  colors: {
    // Order matters: the generator maps swatch[0] to the dark ground ("ink")
    // and the last swatch to the light text ("paper"). Night first, Cream last.
    swatches: [
      {
        id: "sample-night",
        name: "Night",
        hex: "#0F0820",
        role: "Ground",
        cssVariable: "--color-night",
      },
      {
        id: "sample-gold",
        name: "Gold",
        hex: "#E3C24A",
        role: "Primary",
        cssVariable: "--color-gold",
      },
      {
        id: "sample-rose",
        name: "Rose",
        hex: "#A56A67",
        role: "Accent",
        cssVariable: "--color-rose",
      },
      {
        id: "sample-plum",
        name: "Plum",
        hex: "#4E3D73",
        role: "Secondary",
        cssVariable: "--color-plum",
      },
      {
        id: "sample-panel",
        name: "Panel",
        hex: "#24123A",
        role: "Surface",
        cssVariable: "--color-panel",
      },
      {
        id: "sample-cream",
        name: "Cream",
        hex: "#F0E6E0",
        role: "Neutral",
        cssVariable: "--color-cream",
      },
    ],
  },
  gradients: [
    {
      id: "sample-sunset",
      name: "Sunset Horizon",
      css: "linear-gradient(180deg, #0F0820 0%, #24123A 24%, #4E3D73 47%, #A56A67 66%, #E3C24A 78%, #A56A67 85%, #4E3D73 93%, #0F0820 100%)",
      isPrimary: true,
    },
    {
      id: "sample-twilight",
      name: "Twilight",
      css: "linear-gradient(135deg, #0F0820 0%, #24123A 55%, #4E3D73 100%)",
      isPrimary: false,
    },
  ],
  voice: {
    pillars: [
      {
        id: "sample-pillar-1",
        label: "Tone",
        word: "Grounded",
        description:
          "Substance over noise. We say the true thing plainly, backed by evidence, not adjectives.",
      },
      {
        id: "sample-pillar-2",
        label: "Texture",
        word: "Warm",
        description:
          "Expert without being cold. We write like a trusted collaborator, not a corporate deck.",
      },
      {
        id: "sample-pillar-3",
        label: "Posture",
        word: "Refined",
        description:
          "Quiet confidence over hype. Restraint reads as mastery.",
      },
    ],
    doExamples: [
      "Lead with the outcome, then the craft.",
      "Use specifics: names, numbers, places.",
      "Read it aloud. If it sounds like a deck, rewrite.",
    ],
    dontExamples: [
      "Don't reach for hype or superlatives.",
      "Don't pad with adjectives or filler.",
      "Don't open with 'In today's world'.",
    ],
    weAre: ["Grounded", "Warm", "Refined", "Intentional"],
    weAreNot: ["Loud", "Generic", "Cold"],
  },
};
