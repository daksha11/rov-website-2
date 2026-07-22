"use client";

import type { IndustryCta } from "@/lib/types";
import {
  HEADING,
  BODY,
  BLACK,
  PILL_TEXT,
  EMBER_SPLASH,
  CTA_GRADIENT,
  CTA_GLOW,
} from "./shared";
import { trackCallClick } from "./analytics";
import { IndustryLeadForm } from "./IndustryLeadForm";

const BOOKING_URL = "https://calendly.com/rangeofviewmusic/30min";

/**
 * Lead-capture finale — dark section with ember splashes, the form held inside
 * a Linen-Light card for premium contrast (per Andi's 2026-07-21 direction: the
 * section is dark, the form card is light). Anchored #lead for the hero CTA.
 * All form logic, honeypot, UTM capture and gtag events live in IndustryLeadForm.
 */
export function IndustryCTA({
  cta,
  icpSlug,
}: {
  cta: IndustryCta;
  icpSlug: string;
}) {
  return (
    <section
      id="lead"
      style={{
        position: "relative",
        overflow: "hidden",
        background: BLACK,
        padding: "clamp(60px, 10vw, 120px) clamp(20px, 6%, 6%)",
        scrollMarginTop: 24,
      }}
    >
      {/* Diagonal divider drawing the eye in from the section above. */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: "-5%",
          right: "-5%",
          height: 1,
          transform: "rotate(-1.4deg)",
          transformOrigin: "left center",
          background:
            "linear-gradient(90deg, transparent, rgba(234,154,97,0.5) 40%, rgba(234,154,97,0.5) 60%, transparent)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: EMBER_SPLASH,
          opacity: 0.7,
          pointerEvents: "none",
        }}
      />
      {/* Brand grain (matches the hero) */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.025,
          pointerEvents: "none",
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <div
        className="icp-cta-grid"
        style={{
          position: "relative",
          maxWidth: 1040,
          margin: "0 auto",
          display: "grid",
          gap: "clamp(32px, 5vw, 56px)",
          gridTemplateColumns: "1fr",
          alignItems: "start",
        }}
      >
        <div>
          <p
            style={{
              fontFamily: BODY,
              fontWeight: 500,
              fontSize: 12,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: PILL_TEXT,
              margin: "0 0 16px",
            }}
          >
            Let&apos;s talk
          </p>
          <h2
            style={{
              fontFamily: HEADING,
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: "clamp(1.9rem, 4.5vw, 2.9rem)",
              lineHeight: 1.12,
              color: "#FFFFFF",
              margin: "0 0 18px",
            }}
          >
            {cta.heading}
          </h2>
          <p
            style={{
              fontFamily: BODY,
              fontWeight: 300,
              fontSize: "clamp(1rem, 2vw, 1.125rem)",
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.68)",
              margin: "0 0 28px",
              maxWidth: 460,
            }}
          >
            {cta.body}
          </p>
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCallClick(icpSlug)}
            className="icp-cta-book"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              minHeight: 48,
              padding: "14px 30px",
              borderRadius: 9999,
              background: CTA_GRADIENT,
              color: "#FFFFFF",
              fontFamily: BODY,
              fontWeight: 700,
              fontSize: "0.8rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textDecoration: "none",
              boxShadow: CTA_GLOW,
            }}
          >
            Book a call <span aria-hidden>→</span>
          </a>
          <p
            style={{
              fontFamily: BODY,
              fontWeight: 300,
              fontSize: 13.5,
              color: "rgba(255,255,255,0.55)",
              margin: "18px 0 0",
            }}
          >
            Prefer to write it out? Fill in the form and we&apos;ll reply within one
            business day.
          </p>
        </div>

        <div
          style={{
            background: "var(--gradient-linen)",
            border: "1px solid rgba(255,244,227,0.25)",
            borderRadius: 20,
            padding: "clamp(24px, 4vw, 34px)",
            boxShadow: "0 24px 70px rgba(0,0,0,0.55)",
          }}
        >
          <IndustryLeadForm icpSlug={icpSlug} />
        </div>
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .icp-cta-book { transition: transform 0.25s ease; }
        @media (hover: hover) { .icp-cta-book:hover { transform: scale(1.04); } }
        .icp-cta-book:focus-visible { outline: 2px solid ${PILL_TEXT}; outline-offset: 3px; }
        @media (prefers-reduced-motion: reduce) {
          .icp-cta-book { transition: none; }
          .icp-cta-book:hover { transform: none; }
        }
        @media (min-width: 860px) {
          .icp-cta-grid { grid-template-columns: 1fr 1.05fr !important; }
        }
      `,
        }}
      />
    </section>
  );
}
