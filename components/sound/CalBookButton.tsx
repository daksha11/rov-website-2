"use client";

import { useEffect } from "react";

// Booking CTA that opens Cal.com in a popup over the page (the "stay on
// rovmusic" flow). Behavior by config state:
//   - calLink is a Cal.com event (URL or "username/event") -> popup embed.
//   - calLink is some other URL (e.g. Calendly)            -> plain link.
//   - calLink empty                                        -> fallbackHref as
//     a plain link, or renders nothing if neither is set.
// The Cal embed script only loads once a popup button actually mounts, so
// pages with unconfigured CAL_LINKS pay zero script cost.

declare global {
  interface Window {
    Cal?: ((...args: unknown[]) => void) & { loaded?: boolean; ns?: Record<string, unknown>; q?: unknown[] };
  }
}

const CAL_ORIGIN = "https://app.cal.com";

function isCalLink(link: string): boolean {
  if (!/^https?:\/\//i.test(link)) return true; // bare "username/event" slug
  return /(^https?:\/\/)(app\.)?cal\.com\//i.test(link);
}

function toCalSlug(link: string): string {
  return link.replace(/^https?:\/\/(app\.)?cal\.com\//i, "").replace(/\/+$/, "");
}

// Official Cal.com embed loader snippet, run once.
function ensureCalScript() {
  if (typeof window === "undefined" || window.Cal) return;
  /* eslint-disable */
  (function (C: any, A: string, L: string) {
    let p = function (a: any, ar: any) { a.q.push(ar); };
    let d = C.document;
    C.Cal = C.Cal || function () {
      let cal = C.Cal; let ar = arguments;
      if (!cal.loaded) {
        cal.ns = {}; cal.q = cal.q || [];
        d.head.appendChild(d.createElement("script")).src = A;
        cal.loaded = true;
      }
      if (ar[0] === L) {
        const api: any = function () { p(api, arguments); };
        const namespace = ar[1];
        api.q = api.q || [];
        typeof namespace === "string" ? (cal.ns[namespace] = api) && p(api, ar) : p(cal, ar);
        return;
      }
      p(cal, ar);
    };
  })(window, `${CAL_ORIGIN}/embed/embed.js`, "init");
  /* eslint-enable */
  window.Cal!("init", { origin: CAL_ORIGIN });
  // Skin the embed with the rovmusic palette: warm near-black surfaces, the
  // brand orange for selected dates/slots/CTAs, soft borders. Keeps the popup
  // feeling like part of the page instead of stock Cal.
  window.Cal!("ui", {
    theme: "dark",
    styles: { branding: { brandColor: "#EA9A61" } },
    cssVarsPerTheme: {
      dark: {
        "cal-brand": "#EA9A61",
        "cal-brand-emphasis": "#B16937",
        "cal-brand-text": "#120D0A",
        "cal-bg": "#0E0C0A",
        "cal-bg-emphasis": "#1C1714",
        "cal-bg-subtle": "#161210",
        "cal-bg-muted": "#0E0C0A",
        "cal-border": "rgba(255,255,255,0.10)",
        "cal-border-emphasis": "rgba(234,154,97,0.45)",
        "cal-border-subtle": "rgba(255,255,255,0.06)",
        "cal-border-booker": "rgba(255,255,255,0.10)",
        "cal-text": "#FFFFFF",
        "cal-text-emphasis": "#FFFFFF",
        "cal-text-subtle": "rgba(255,255,255,0.55)",
        "cal-text-muted": "rgba(255,255,255,0.38)",
      },
    },
    hideEventTypeDetails: false,
  });
}

export default function CalBookButton({
  calLink,
  fallbackHref,
  className = "",
  style,
  children,
  ariaLabel,
}: {
  calLink?: string;
  fallbackHref?: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  ariaLabel?: string;
}) {
  const link = (calLink || "").trim();
  const usePopup = !!link && isCalLink(link);

  useEffect(() => {
    if (usePopup) ensureCalScript();
  }, [usePopup]);

  if (usePopup) {
    return (
      <button
        type="button"
        data-cal-link={toCalSlug(link)}
        data-cal-config='{"theme":"dark"}'
        className={`${className} cursor-pointer`}
        style={style}
        aria-label={ariaLabel}
      >
        {children}
      </button>
    );
  }

  const href = link || fallbackHref;
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={style}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}
