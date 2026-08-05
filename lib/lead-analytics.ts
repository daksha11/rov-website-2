// Site-wide form analytics + attribution.
//
// Two jobs:
//
// 1. GA4 events. Every lead form on rovstudios.com fires the same three events
//    (form_start, form_submit, generate_lead) with a `form_id` so one report
//    answers "which page produces leads" instead of one report per form.
//    generate_lead is GA4's recommended conversion event name, so it can be
//    marked as a key event in the GA UI without custom config.
//
// 2. First-touch attribution. Reading UTMs off window.location only works when
//    the form sits on the landing page. Someone who arrives on a blog post from
//    an ad and converts on /contact loses the attribution entirely. So the
//    first UTM-bearing pageview of the session is stashed in sessionStorage and
//    every later form reads from there.
//
// Every call is a guarded no-op when gtag is missing (SSG, ad blockers) or
// storage is unavailable (Safari private mode), so this can never break a
// submission.

const STORAGE_KEY = "rov_attribution";

export type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  /** Referring hostname on the session's first page, e.g. "instagram.com". */
  referrer?: string;
  /** Path they first landed on, which is often more useful than the referrer. */
  landing_page?: string;
};

type GtagParams = Record<string, string | number | undefined>;

function gtag(event: string, params: GtagParams) {
  if (typeof window === "undefined") return;
  const w = window as unknown as {
    gtag?: (type: "event", name: string, params: GtagParams) => void;
  };
  if (typeof w.gtag === "function") w.gtag("event", event, params);
}

function readStored(): Attribution | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Attribution) : null;
  } catch {
    return null;
  }
}

/**
 * Capture attribution once per session. Safe to call on every page: the first
 * call wins, so the ad click that started the session is what gets credited,
 * not the last internal navigation before the form.
 */
export function captureAttribution(): Attribution {
  if (typeof window === "undefined") return {};

  const existing = readStored();
  if (existing) return existing;

  const q = new URLSearchParams(window.location.search);
  const pick = (k: string) => q.get(k) || undefined;

  let referrer: string | undefined;
  try {
    // Only external referrers are worth recording; same-origin means they were
    // already here and the session's first page is further back than this one.
    if (document.referrer && new URL(document.referrer).hostname !== window.location.hostname) {
      referrer = new URL(document.referrer).hostname;
    }
  } catch {
    /* malformed referrer, skip it */
  }

  const attribution: Attribution = {
    utm_source: pick("utm_source"),
    utm_medium: pick("utm_medium"),
    utm_campaign: pick("utm_campaign"),
    utm_term: pick("utm_term"),
    utm_content: pick("utm_content"),
    referrer,
    landing_page: window.location.pathname,
  };

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
  } catch {
    /* private mode: attribution is per-page instead of per-session */
  }
  return attribution;
}

/** First-touch attribution for this session, falling back to the current URL. */
export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  return readStored() || captureAttribution();
}

/** Flattened to strings so it can ride along in a JSON lead payload. */
export function attributionPayload(): Record<string, string> {
  const a = getAttribution();
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(a)) if (v) out[k] = v;
  return out;
}

/**
 * First real interaction with a form. Fire once per mount: the ratio of
 * form_start to generate_lead is the abandonment rate, which is the number
 * worth watching on the multi-step forms.
 */
export function trackFormStart(formId: string) {
  gtag("form_start", { form_id: formId, ...getAttribution() });
}

/** A step completed on a multi-step form, so drop-off is visible per screen. */
export function trackFormStep(formId: string, step: number, label?: string) {
  gtag("form_step", { form_id: formId, step, step_label: label, ...getAttribution() });
}

/** Submit pressed. Pairs with generate_lead to expose server-side failures. */
export function trackFormSubmit(formId: string) {
  gtag("form_submit", { form_id: formId, ...getAttribution() });
}

/** The conversion. GA4 recommended event name, mark it as a key event. */
export function trackLead(formId: string, extra?: GtagParams) {
  gtag("generate_lead", { form_id: formId, ...getAttribution(), ...extra });
}

/** Submission rejected by the server or the network. */
export function trackFormError(formId: string, reason: string) {
  gtag("form_error", { form_id: formId, reason: reason.slice(0, 100) });
}

/** Outbound click on a cal.com booking link, the other conversion path. */
export function trackBookingClick(location: string) {
  gtag("booking_click", { form_id: location, ...getAttribution() });
}
