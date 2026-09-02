// Four events, so we know whether the game earns its keep:
//   space_open         mode: ship | map
//   space_dock         body
//   space_enter        body, via: ship | map
//   space_charted_all  every planet docked at least once on this device
//
// Goes to the site's GA4 tag. No-ops when gtag is missing (SSR, ad blockers,
// headless tests), so nothing here can ever throw in the render path.

type Params = Record<string, string | number | boolean>;

export function track(event: string, params: Params = {}) {
  if (typeof window === "undefined") return;
  const g = (window as unknown as { gtag?: unknown }).gtag;
  if (typeof g !== "function") return;
  try {
    (g as (...args: unknown[]) => void)("event", event, params);
  } catch {
    /* analytics must never break the game */
  }
}
