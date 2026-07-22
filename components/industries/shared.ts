// Shared constants + helpers for the /industries ICP landing components.
import type { HeroGradient } from "@/lib/types";

// Fonts follow the live sound-page mechanism — inline fontFamily, no Tailwind
// font classes, no Inter/Neue Montreal.
export const HEADING = "Norwige, sans-serif";
export const BODY = "'Roboto', sans-serif";

// Brand palette (brand-kit.md).
export const CREAM = "#FFF4E3";
export const DEEP = "#3B2114";
export const DARK = "#603E25";
export const SAND = "#D0BEA5";
export const EMBER = "#90422C";
export const EMBER_LIGHT = "#EA9A61";
export const RUST = "#B16937";

// ── Dark service-page DNA (matches app/ai-automation + components/sound/*) ──
export const BLACK = "#000000";
export const NEAR_BLACK = "#080807";
/** Live pill-badge accent text used on ai-automation. */
export const PILL_TEXT = "#E8914A";

/** Radial ember light-splashes over black — the ai-automation hero treatment. */
export const EMBER_SPLASH = `
  radial-gradient(ellipse 1200px 1200px at 20% 25%, rgba(234, 154, 97, 0.30) 0%, transparent 50%),
  radial-gradient(ellipse 1200px 1200px at 80% 55%, rgba(177, 105, 55, 0.22) 0%, transparent 50%)
`;

/** Gradient for background-clip accent text (ember tones, in-palette). */
export const ACCENT_TEXT_GRADIENT = "linear-gradient(90deg, #EA9A61 0%, #B16937 100%)";

/** Filled CTA pill — the live brand gradient with glow. */
export const CTA_GRADIENT =
  "linear-gradient(132deg, #EA9A61 4.77%, #B16937 27.26%, #A64D2B 50.09%, #42201C 76.74%)";
export const CTA_GLOW = "0 4px 24px rgba(160, 90, 40, 0.45)";

/** heroGradient frontmatter → approved CSS gradient var (§3.4). */
export function heroGradientCss(g: HeroGradient): string {
  switch (g) {
    case "emberDark":
      return "var(--gradient-ember)";
    case "earth":
      return "var(--gradient-earth)";
    case "ember":
    default:
      return "var(--gradient-brand)";
  }
}
