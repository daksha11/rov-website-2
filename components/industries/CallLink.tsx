"use client";

import { trackCallClick } from "./analytics";

/**
 * Phone / booking link that fires the icp_call_click gtag event. Renders a
 * tel: link for phone numbers, or a plain href for a booking URL. If the phone
 * is still the open-decision placeholder, it renders as a non-linked span so we
 * never ship a broken tel:+1-XXX link.
 */
export function CallLink({
  phone,
  icpSlug,
  variant = "ghost",
  children,
}: {
  phone: string;
  icpSlug: string;
  variant?: "ghost" | "solid";
  children: React.ReactNode;
}) {
  const isPlaceholder = /X{3}/i.test(phone);
  const isUrl = /^https?:\/\//i.test(phone);
  const href = isUrl ? phone : `tel:${phone.replace(/[^\d+]/g, "")}`;

  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 44,
    padding: "12px 24px",
    borderRadius: 999,
    fontFamily: "'Roboto', sans-serif",
    fontWeight: 500,
    fontSize: 15,
    letterSpacing: "0.01em",
    cursor: isPlaceholder ? "default" : "pointer",
    transition: "background 200ms ease, color 200ms ease, border-color 200ms ease",
    textDecoration: "none",
  };

  const solid: React.CSSProperties = {
    ...base,
    background: "#90422C",
    color: "#FFF4E3",
    border: "1px solid #90422C",
  };

  const ghost: React.CSSProperties = {
    ...base,
    background: "transparent",
    // The ghost pill always sits on a dark section, so its text is always the
    // light cream (never espresso, which would vanish on black).
    color: "#FFF4E3",
    border: "1px solid rgba(255,244,227,0.4)",
  };

  const style = variant === "solid" ? solid : ghost;

  if (isPlaceholder) {
    // Phone/booking is an open decision (§12). Show the label, not a dead link.
    return <span style={{ ...style, opacity: 0.85 }}>{children}</span>;
  }

  return (
    <a
      href={href}
      style={style}
      onClick={() => trackCallClick(icpSlug)}
    >
      {children}
    </a>
  );
}
