// Single source of truth for Range of View Music checkout + pricing.
//
// To go live with Stripe: paste each Stripe Payment Link into the matching
// `payUrl` below. Until a payUrl is filled in, checkoutHref() falls back to a
// pre-filled email to CONTACT_EMAIL, so nothing breaks in the meantime.
//
// Recording sessions are booked (not pre-paid), so those CTAs use BOOKING_URL.

export const CONTACT_EMAIL = "stems@rovstudios.com";
export const BOOKING_URL = "https://calendly.com/rangeofviewmusic/30min";

export type CheckoutKey =
  | "intro"
  | "oneoff"
  | "sub_starter"
  | "sub_standard"
  | "sub_pro"
  | "addon_cover"
  | "addon_visualizer"
  | "addon_merch"
  | "creative_pack";

interface CheckoutItem {
  /** Human label used in the fallback email subject. */
  label: string;
  /** Price in USD (for reference / display). */
  amount: number;
  /** "song" | "mo" — billing unit. */
  unit: "song" | "mo";
  /** Stripe Payment Link. Empty string = not live yet, falls back to email. */
  payUrl: string;
}

export const checkout: Record<CheckoutKey, CheckoutItem> = {
  intro: { label: "$50 Intro (first 3 songs)", amount: 50, unit: "song", payUrl: "" },
  oneoff: { label: "One-off mix & master", amount: 120, unit: "song", payUrl: "" },
  sub_starter: { label: "Starter subscription (5 songs/mo)", amount: 145, unit: "mo", payUrl: "" },
  sub_standard: { label: "Standard subscription (12 songs/mo)", amount: 300, unit: "mo", payUrl: "" },
  sub_pro: { label: "Pro subscription (18 songs/mo, 24hr)", amount: 500, unit: "mo", payUrl: "" },
  addon_cover: { label: "Cover Art", amount: 75, unit: "song", payUrl: "" },
  addon_visualizer: { label: "Lyric Visualizer", amount: 60, unit: "song", payUrl: "" },
  addon_merch: { label: "Merch Design", amount: 95, unit: "song", payUrl: "" },
  creative_pack: { label: "Creative Pack (cover + visualizer + merch)", amount: 125, unit: "mo", payUrl: "" },
};

/**
 * Returns the href for a checkout CTA. If a Stripe Payment Link is set for the
 * item, that URL is returned; otherwise a pre-filled mailto: to CONTACT_EMAIL.
 */
export function checkoutHref(key: CheckoutKey): string {
  const item = checkout[key];
  if (item?.payUrl) return item.payUrl;
  const subject = encodeURIComponent(item ? `Song submission: ${item.label}` : "Song submission");
  const body = encodeURIComponent(
    "Attach your labeled stems (dry vocals, beat stems or stereo beat, reference track) and any notes. We run a quality check before mixing and reply with next steps."
  );
  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}
