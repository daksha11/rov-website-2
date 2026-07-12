export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  };
}

export function rgbString(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgb(${r}, ${g}, ${b})`;
}

export function hslString(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn: h = (gn - bn) / d + (gn < bn ? 6 : 0); break;
      case gn: h = (bn - rn) / d + 2; break;
      default: h = (rn - gn) / d + 4;
    }
    h /= 6;
  }

  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

export function luminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function contrastRatio(hex1: string, hex2: string): number {
  const l1 = luminance(hex1);
  const l2 = luminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function isLightColor(hex: string): boolean {
  return luminance(hex) > 0.179;
}

// ── OKLCH color space + WCAG grading ──
// Merged from colorUtils.ts (2026-07-12 restructure · one file per concept)

export type OklchColor = { l: number; c: number; h: number };
export type RgbColor = { r: number; g: number; b: number };
export type HexColor = string;

const M_RGB_TO_XYZ: number[][] = [
  [0.4124564, 0.3575761, 0.1804375],
  [0.2126729, 0.7151522, 0.072175],
  [0.0193339, 0.119192, 0.9503041],
];
const M_XYZ_TO_LMS: number[][] = [
  [0.8189330101, 0.3618667424, -0.1288597137],
  [0.0329845436, 0.9293118715, 0.0361456387],
  [0.0482003018, 0.2643662691, 0.633851707],
];
const M_LMS_TO_OKLAB: number[][] = [
  [0.2104542553, 0.793617785, -0.0040720468],
  [1.9779984951, -2.428592205, 0.4505937099],
  [0.0259040371, 0.7827717662, -0.808675766],
];
const M_OKLAB_TO_LMS: number[][] = [
  [1.0, 0.3963377774, 0.2158037573],
  [1.0, -0.1055613458, -0.0638541728],
  [1.0, -0.0894841775, -1.291485548],
];
const M_LMS_TO_XYZ: number[][] = [
  [1.2270138511035211, -0.5577999806518222, 0.2812561489664678],
  [-0.040580178423280595, 1.1122568696168302, -0.07167667866560119],
  [-0.07638128450570689, -0.4214819784180127, 1.586163220440795],
];
const M_XYZ_TO_RGB: number[][] = [
  [3.2404542, -1.5371385, -0.4985314],
  [-0.969266, 1.8760108, 0.041556],
  [0.0556434, -0.2040259, 1.0572252],
];

function mul3(M: number[][], v: [number, number, number]): [number, number, number] {
  return [
    M[0][0] * v[0] + M[0][1] * v[1] + M[0][2] * v[2],
    M[1][0] * v[0] + M[1][1] * v[1] + M[1][2] * v[2],
    M[2][0] * v[0] + M[2][1] * v[1] + M[2][2] * v[2],
  ];
}

function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
function linearToSrgb(c: number): number {
  return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

function parseHex(hex: HexColor): RgbColor {
  let h = hex.trim().replace(/^#/, "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (h.length !== 6 || !/^[0-9a-fA-F]{6}$/.test(h)) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function toHex(n: number): string {
  const v = Math.round(n).toString(16).padStart(2, "0");
  return v.length > 2 ? "ff" : v;
}

export function hexToOklch(hex: HexColor): OklchColor {
  const { r, g, b } = parseHex(hex);
  const rl = srgbToLinear(r / 255);
  const gl = srgbToLinear(g / 255);
  const bl = srgbToLinear(b / 255);

  const xyz = mul3(M_RGB_TO_XYZ, [rl, gl, bl]);
  const lms = mul3(M_XYZ_TO_LMS, [xyz[0], xyz[1], xyz[2]]);
  const lmsRoot: [number, number, number] = [
    Math.cbrt(lms[0]),
    Math.cbrt(lms[1]),
    Math.cbrt(lms[2]),
  ];
  const [L, a, b2] = mul3(M_LMS_TO_OKLAB, lmsRoot);
  const C = Math.sqrt(a * a + b2 * b2);
  let H = (Math.atan2(b2, a) * 180) / Math.PI;
  if (H < 0) H += 360;
  return { l: L, c: C, h: H };
}

export function oklchToHex(oklch: OklchColor): {
  hex: HexColor;
  gamutClipped: boolean;
} {
  const { l: L, c: C, h: H } = oklch;
  const hRad = (H * Math.PI) / 180;
  const a = Math.cos(hRad) * C;
  const b = Math.sin(hRad) * C;

  const lmsRoot = mul3(M_OKLAB_TO_LMS, [L, a, b]);
  const lms: [number, number, number] = [
    lmsRoot[0] ** 3,
    lmsRoot[1] ** 3,
    lmsRoot[2] ** 3,
  ];
  const xyz = mul3(M_LMS_TO_XYZ, lms);
  const [rl, gl, bl] = mul3(M_XYZ_TO_RGB, [xyz[0], xyz[1], xyz[2]]);

  const rsRaw = linearToSrgb(rl) * 255;
  const gsRaw = linearToSrgb(gl) * 255;
  const bsRaw = linearToSrgb(bl) * 255;

  const rs = Math.max(0, Math.min(255, rsRaw));
  const gs = Math.max(0, Math.min(255, gsRaw));
  const bs = Math.max(0, Math.min(255, bsRaw));

  const gamutClipped =
    Math.abs(rsRaw - rs) > 5 ||
    Math.abs(gsRaw - gs) > 5 ||
    Math.abs(bsRaw - bs) > 5;

  const hex = `#${toHex(rs)}${toHex(gs)}${toHex(bs)}`.toUpperCase();
  return { hex, gamutClipped };
}

export function getRelativeLuminance(hex: HexColor): number {
  const { r, g, b } = parseHex(hex);
  const rl = srgbToLinear(r / 255);
  const gl = srgbToLinear(g / 255);
  const bl = srgbToLinear(b / 255);
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
}

export function getContrastRatio(hex1: HexColor, hex2: HexColor): number {
  const L1 = getRelativeLuminance(hex1);
  const L2 = getRelativeLuminance(hex2);
  const [hi, lo] = L1 >= L2 ? [L1, L2] : [L2, L1];
  const ratio = (hi + 0.05) / (lo + 0.05);
  return Math.round(ratio * 100) / 100;
}

export function wcagGrade(
  ratio: number,
  isLargeText = false
): "AAA" | "AA" | "FAIL" {
  if (isLargeText) {
    if (ratio >= 4.5) return "AAA";
    if (ratio >= 3) return "AA";
    return "FAIL";
  }
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  return "FAIL";
}
