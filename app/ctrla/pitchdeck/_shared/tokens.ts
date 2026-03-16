/* ═══════════════════════════════════════════════════════
   DESIGN TOKENS — matched to ROV site-wide system
   ═══════════════════════════════════════════════════════ */

export const BROWN_GRADIENT = "linear-gradient(132deg, #EA9A61 4.77%, #B16937 27.26%, #A64D2B 50.09%, #42201C 76.74%)";
export const ACCENT = "#EA9A61";
export const ACCENT_MID = "#B16937";
export const ACCENT_DARK = "#A64D2B";
export const ACCENT_DEEPEST = "#42201C";

export const BG = "#000000";
export const BG_SECTION = "#0A0A0A";
export const BG_CARD = "#1E1A17";

export const CARD_BORDER = "rgba(234, 154, 97, 0.12)";
export const CARD_BORDER_HOVER = "rgba(234, 154, 97, 0.35)";

export const TEXT = "#FFF4E3";
export const TEXT_90 = "rgba(255, 244, 227, 0.9)";
export const TEXT_60 = "rgba(255, 244, 227, 0.6)";
export const TEXT_40 = "rgba(255, 244, 227, 0.4)";
export const TEXT_20 = "rgba(255, 244, 227, 0.2)";
export const WHITE = "#FFFFFF";

export const FONT_HEADING = "Norwige, sans-serif";
export const FONT_BODY = "Norwige, sans-serif";

export const SHADOW_CARD = "0 39px 78px -19px rgba(0, 0, 0, 0.25)";
export const SHADOW_CARD_HOVER = "0 40px 100px -20px rgba(0,0,0,0.8), 0 0 40px rgba(234,154,97,0.06)";

/** Returns one of the 4 gradient stops by index (wraps) */
export function tierColor(index: number): string {
    const stops = [ACCENT, ACCENT_MID, ACCENT_DARK, ACCENT_DEEPEST];
    return stops[index % stops.length];
}
