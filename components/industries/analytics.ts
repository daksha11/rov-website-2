// Guarded gtag helpers for ICP landing pages (§9.3). Every call is a no-op
// unless window.gtag is a real function, so SSG and ad-blocked visits are safe.

type GtagParams = Record<string, string | undefined>;

function gtag(event: string, params: GtagParams) {
  if (typeof window === "undefined") return;
  const w = window as unknown as {
    gtag?: (type: "event", name: string, params: GtagParams) => void;
  };
  if (typeof w.gtag === "function") {
    w.gtag("event", event, params);
  }
}

/** Read UTM params from the current URL, client-side only. */
export function readUtm(): {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
} {
  if (typeof window === "undefined") return {};
  const q = new URLSearchParams(window.location.search);
  return {
    utm_source: q.get("utm_source") ?? undefined,
    utm_medium: q.get("utm_medium") ?? undefined,
    utm_campaign: q.get("utm_campaign") ?? undefined,
  };
}

export function trackCallClick(icpSlug: string) {
  gtag("icp_call_click", { icp_slug: icpSlug, ...readUtm() });
}

export function trackLeadSubmit(icpSlug: string) {
  gtag("icp_lead_submit", { icp_slug: icpSlug, ...readUtm() });
}

export function trackLeadSuccess(icpSlug: string) {
  gtag("icp_lead_success", { icp_slug: icpSlug, ...readUtm() });
}

export function trackVisualEngage(icpSlug: string, visualType: string) {
  gtag("icp_visual_engage", { icp_slug: icpSlug, visual_type: visualType });
}

/** Fired once, on the reader's first interaction with the page calculator. */
export function trackCalcEngage(icpSlug: string) {
  gtag("icp_calc_engage", { icp_slug: icpSlug, ...readUtm() });
}
