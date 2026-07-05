import type { BrandKitData, FontDefinition } from "@/lib/brand-kit/types";

// ═══════════════════════════════════════════════════════
// THE KIT LINK — shareable, remixable brand kit URL
// Serializes the lightweight parts of a kit into a URL token,
// the same idea as MixGlobe's encode/decode scaled up to the
// brand-data object. Opening a shared link drops that kit into
// the builder, ready to remix.
//
// EXCLUDED from the token (would blow past URL length limits,
// and are personal binary blobs, not shareable design tokens):
//   · uploaded logo data URLs (logos.variants[].file)
//   · embedded custom font data (typography.*.customFontData)
// Everything else — palette, type config, gradients, voice,
// structure, brand info — travels in the link.
// ═══════════════════════════════════════════════════════

/** URL query parameter that carries a shared kit token. */
export const KIT_SHARE_PARAM = "kit";

/** Bumped if the shared shape ever changes incompatibly. */
const SHARE_VERSION = 1;

/** The subset of a kit that is safe and small enough to put in a URL. */
type SharedKit = Pick<
  BrandKitData,
  "brandInfo" | "colors" | "typography" | "gradients" | "voice" | "sections" | "template"
>;

interface SharePayload {
  v: number;
  /** CTRL-A volume label the kit was shared from, e.g. "Vol. 01". Display only. */
  vol?: string;
  kit: SharedKit;
}

/** Drop the heavy embedded-font blob but keep the font's identity + weights. */
function stripFont(font: FontDefinition): FontDefinition {
  const { customFontData: _data, customFontFormat: _fmt, ...rest } = font;
  return rest;
}

function toSharedKit(data: BrandKitData): SharedKit {
  return {
    brandInfo: data.brandInfo,
    colors: data.colors,
    typography: {
      displayFont: stripFont(data.typography.displayFont),
      bodyFont: stripFont(data.typography.bodyFont),
      scale: data.typography.scale,
    },
    gradients: data.gradients,
    voice: data.voice,
    sections: data.sections,
    template: data.template,
  };
}

// URL-safe base64 of a UTF-8 string. btoa/atob are byte-oriented, so we route
// through TextEncoder/TextDecoder to survive accented characters in copy.
function utf8ToBase64Url(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToUtf8(token: string): string {
  const b64 = token.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(b64);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/** Encode a kit (minus logos + embedded fonts) into a URL token. */
export function encodeKit(data: BrandKitData, volumeLabel?: string): string {
  const payload: SharePayload = {
    v: SHARE_VERSION,
    ...(volumeLabel ? { vol: volumeLabel } : {}),
    kit: toSharedKit(data),
  };
  return utf8ToBase64Url(JSON.stringify(payload));
}

/**
 * Decode a share token back into the kit fields it carried, or null if the
 * token is missing, malformed, or from an incompatible version.
 */
export function decodeKit(token: string): SharedKit | null {
  if (!token) return null;
  try {
    const payload = JSON.parse(base64UrlToUtf8(token)) as SharePayload;
    if (payload?.v !== SHARE_VERSION || !payload.kit?.colors) return null;
    return payload.kit;
  } catch {
    return null;
  }
}

/** Build the full share URL for the current builder page. */
export function buildShareUrl(data: BrandKitData, volumeLabel?: string): string {
  const token = encodeKit(data, volumeLabel);
  const { origin, pathname } = window.location;
  return `${origin}${pathname}?${KIT_SHARE_PARAM}=${token}`;
}
