// Single source of truth for Range of View Music checkout + pricing.
//
// To go live with Stripe: paste each Stripe Payment Link into the matching
// `payUrl` below. Until a payUrl is filled in, checkoutHref() falls back to a
// pre-filled email to CONTACT_EMAIL, so nothing breaks in the meantime.
//
// Recording sessions are booked (not pre-paid), so those CTAs use BOOKING_URL.

export const CONTACT_EMAIL = "stems@rovstudios.com";
export const BOOKING_URL = "https://cal.com/rov-studios-imhphw/15min";

// Pricing beyond the flat intro/recording rates is consultative: the quote
// questionnaire ends by letting the visitor book a call or send an inquiry.
// The Cal.com "Quote Call" event (free, 15 min) — opens as an on-site popup.
export const CONSULT_BOOKING_URL = "rov-studios-imhphw/quote-call";

// Cal.com paid recording events. Paste each event as a URL or "username/event"
// slug once created (Cal.com -> Apps -> Stripe must be connected first so the
// event collects payment at booking). Empty = the CTA falls back to
// BOOKING_URL (the Cal.com 15-min booking) so nothing breaks in the meantime.
export const CAL_LINKS = {
  /** "Studio Session" event — 1 hour, $80, stems included. */
  hourlySession: "rov-studios-imhphw/studio-session",
  /**
   * Block session event. Was the $149 "Finished Single", retired when hourly
   * absorbed it. Now the 4-hour block at $300 ($75/hr). Rename this Cal event
   * to "4-Hour Block, $300".
   */
  finishedSingle: "rov-studios-imhphw/finished-single",
};

export type CheckoutKey =
  // Mixing: stems sent to us. Prepaid packs, no spend-based formula.
  | "mix_first"
  | "mix_single"
  | "mix_3"
  | "mix_6"
  | "mix_12"
  // Recording: in the room. You leave with your stems; mixing is priced
  // separately so an efficient session never becomes unpaid mix work.
  | "rec_hour"
  | "rec_2hr"
  | "rec_4hr"
  // Creative
  | "cover_system"
  | "cover_extra"
  | "shorts"
  // The backend build
  | "foundation";

interface CheckoutItem {
  /** Human label used in the fallback email subject. */
  label: string;
  /** Price in USD (for reference / display). */
  amount: number;
  /** Billing unit, drives the "/song", "/hr" suffix in the UI. */
  unit: "song" | "hr" | "mo" | "flat";
  /** How many songs/hours the item covers. Used for per-unit math. */
  qty?: number;
  /** Stripe Payment Link. Empty string = not live yet, falls back to email. */
  payUrl: string;
}

// ─────────────────────────────────────────────────────────────────
// Rate card. Packs replaced the old spend-based discount ("10% cheaper
// every $50 spent"), which had two problems: it was uncomputable for a
// customer, and its 6+ floor made 5 songs cost more than 6 by accident.
//
// Packs are deliberately monotonic per-song ($100 → $83 → $67 → $58). The
// remaining inversions (5 singles cost more than the 6-pack, 11 more than
// the 12-pack) are intentional upsell nudges and are shown as such.
//
// A membership tier is planned but deliberately NOT here yet. Pricing one
// before packs reveal real per-artist volume would be a guess.
// ─────────────────────────────────────────────────────────────────
export const checkout: Record<CheckoutKey, CheckoutItem> = {
  // ── Mixing ──
  mix_first: { label: "First mix & master ($50 intro)", amount: 50, unit: "song", qty: 1, payUrl: "https://buy.stripe.com/14A6oG1Fg6Uv503aawfMA01" },
  mix_single: { label: "Mix & master, single song", amount: 100, unit: "song", qty: 1, payUrl: "" },
  mix_3: { label: "Mix & master, 3-pack", amount: 250, unit: "flat", qty: 3, payUrl: "" },
  mix_6: { label: "Mix & master, 6-pack", amount: 400, unit: "flat", qty: 6, payUrl: "" },
  mix_12: { label: "Mix & master, 12-pack", amount: 700, unit: "flat", qty: 12, payUrl: "" },

  // ── Recording (stems included) ──
  rec_hour: { label: "Studio session, hourly", amount: 80, unit: "hr", qty: 1, payUrl: "" },
  rec_2hr: { label: "Studio session, 2-hour block (minimum)", amount: 160, unit: "flat", qty: 2, payUrl: "" },
  rec_4hr: { label: "Studio session, 4-hour block", amount: 300, unit: "flat", qty: 4, payUrl: "" },

  // ── Creative ──
  // Sold as a system, not a unit: cover one is a design job, covers two
  // through ten are an hour each once the rule exists.
  cover_system: { label: "Cover art system + first cover", amount: 150, unit: "flat", qty: 1, payUrl: "" },
  cover_extra: { label: "Additional cover (system in place)", amount: 40, unit: "song", qty: 1, payUrl: "" },
  shorts: { label: "20 shorts + 5 lyric videos", amount: 750, unit: "flat", payUrl: "" },

  // ── The backend build ──
  // Keep `amount` in sync with FOUNDATION_PRICE in data/artistReadiness.ts.
  foundation: { label: "Foundation (artist backend build)", amount: 500, unit: "flat", payUrl: "" },
};

/** Per-song or per-hour rate for a pack, used for the "$X a song" line. */
export function unitRate(key: CheckoutKey): number | null {
  const item = checkout[key];
  if (!item?.qty) return null;
  return Math.round(item.amount / item.qty);
}

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
