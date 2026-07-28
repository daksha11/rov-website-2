"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Industry } from "@/lib/types";
import {
  HEADING,
  BODY,
  BLACK,
  EMBER_SPLASH,
  PILL_TEXT,
  ACCENT_TEXT_GRADIENT,
  CTA_GRADIENT,
  CTA_GLOW,
} from "./shared";
import { trackCallClick } from "./analytics";

const BOOKING_URL = "https://cal.com/rov-studios-imhphw/15min";

/**
 * Full-bleed hero video layer (SoundHero-style). The CSS ember splash paints
 * first for LCP, so this only ever mounts client-side: after the component has
 * mounted, is in view, and only when motion + data budget allow. Under
 * prefers-reduced-motion or Save-Data the <video> is never rendered, so the
 * hero stays text-on-gradient. Because `on` starts false, no <video> markup is
 * present in the SSR HTML.
 */
function HeroMedia({ src, poster }: { src: string; poster?: string }) {
  const [on, setOn] = useState(false);
  const [ready, setReady] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const conn = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    if (conn?.saveData) return;

    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setOn(true);
            obs.disconnect();
          }
        });
      },
      { rootMargin: "0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0 }}>
      {on && (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video
          muted
          loop
          playsInline
          autoPlay
          preload="none"
          poster={poster}
          onCanPlay={() => setReady(true)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: ready ? 1 : 0,
            transition: "opacity 900ms ease",
          }}
        >
          <source src={src} type="video/mp4" />
        </video>
      )}
      {/* Scrim: at least ~68% darkness so the white headline keeps contrast. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.66) 45%, rgba(0,0,0,0.82) 100%)",
        }}
      />
    </div>
  );
}

/**
 * Hero — full-viewport black stage with radial ember light-splashes (CSS only,
 * no WebGL/canvas so outreach + ad traffic loads instantly). Pill-badge eyebrow,
 * solid-white display headline with a NorwigeHeroItalic gradient accent line
 * (live service-page pattern), two pill CTAs, and the quiet answerLine for GEO.
 * Motion entrances are suppressed under prefers-reduced-motion.
 */
export function IndustryHero({ page }: { page: Industry }) {
  const reduce = useReducedMotion();
  const eyebrow =
    page.eyebrow || `${page.industry} · ${page.geo}`.toUpperCase();

  // Static (no-motion) when the user prefers reduced motion.
  const rise = (delay: number, y = 24) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay },
        };

  return (
    <header
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        background: BLACK,
        overflow: "hidden",
        padding:
          "clamp(100px, 15vh, 128px) clamp(20px, 8%, 8%) clamp(56px, 10vh, 88px)",
      }}
    >
      {/* Full-bleed hero video (client-only fade-in; absent under reduced
          motion / Save-Data and from SSR HTML). Sits at the very back. */}
      {page.heroMedia && (
        <HeroMedia src={page.heroMedia.src} poster={page.heroMedia.poster} />
      )}

      {/* Radial ember light-splashes (warm ambiance over the scrim) */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: EMBER_SPLASH,
          pointerEvents: "none",
          zIndex: 0,
          opacity: page.heroMedia ? 0.7 : 1,
        }}
      />
      {/* Subtle grain (house style) */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.03,
          pointerEvents: "none",
          zIndex: 0,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 940 }}>
        {/* Pill badge — eyebrow */}
        <motion.div
          {...rise(0, -16)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(126, 42, 12, 0.20)",
            border: "1px solid rgba(202, 53, 0, 0.30)",
            borderRadius: 9999,
            padding: "8px 20px",
            marginBottom: 36,
          }}
        >
          <span style={{ color: PILL_TEXT, fontSize: "0.8rem" }} aria-hidden>
            ✦
          </span>
          <span
            style={{
              fontFamily: BODY,
              fontSize: "0.72rem",
              fontWeight: 600,
              color: PILL_TEXT,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            {eyebrow}
          </span>
        </motion.div>

        {/* Display headline — solid white + gradient italic accent line */}
        <motion.h1
          {...rise(0.12, 30)}
          style={{
            fontFamily: HEADING,
            fontWeight: 800,
            color: "#FFFFFF",
            fontSize: "clamp(2.5rem, 6.5vw, 5.5rem)",
            lineHeight: 1.06,
            letterSpacing: "-0.015em",
            margin: 0,
          }}
        >
          {page.headline}
          {page.headlineAccent && (
            <span
              style={{
                display: "block",
                marginTop: "0.12em",
                fontFamily: "NorwigeHeroItalic, sans-serif",
                fontWeight: "normal",
                fontSize: "clamp(2.35rem, 6.2vw, 5rem)",
                lineHeight: 1.12,
                background: ACCENT_TEXT_GRADIENT,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {page.headlineAccent}
            </span>
          )}
        </motion.h1>

        {/* Subhead */}
        {page.subhead && (
          <motion.p
            {...rise(0.26, 20)}
            style={{
              fontFamily: BODY,
              fontWeight: 300,
              fontSize: "clamp(1rem, 1.7vw, 1.2rem)",
              lineHeight: 1.65,
              color: "rgba(255,255,255,0.65)",
              margin: "28px auto 0",
              maxWidth: 620,
            }}
          >
            {page.subhead}
          </motion.p>
        )}

        {/* CTA row */}
        <motion.div
          {...rise(0.4, 20)}
          style={{
            display: "flex",
            gap: 14,
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 40,
          }}
          className="icp-hero-cta"
        >
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCallClick(page.slug)}
            className="icp-hero-btn"
            style={{
              fontFamily: BODY,
              fontSize: "0.8rem",
              fontWeight: 700,
              color: "#FFFFFF",
              background: CTA_GRADIENT,
              border: "none",
              borderRadius: 9999,
              padding: "15px 32px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              boxShadow: CTA_GLOW,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              minHeight: 44,
            }}
          >
            Book a call <span aria-hidden>→</span>
          </a>

          <a
            href="#lead"
            className="icp-hero-btn icp-hero-ghost"
            style={{
              fontFamily: BODY,
              fontSize: "0.8rem",
              fontWeight: 700,
              color: "#FFFFFF",
              background: "transparent",
              border: "1.5px solid rgba(255,255,255,0.5)",
              borderRadius: 9999,
              padding: "15px 32px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              minHeight: 44,
            }}
          >
            Start a project
          </a>
        </motion.div>

        {/* answerLine — quiet GEO sentence, real DOM */}
        {page.answerLine && (
          <motion.p
            {...rise(0.52, 16)}
            style={{
              fontFamily: BODY,
              fontWeight: 300,
              fontSize: 14.5,
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.55)",
              margin: "44px auto 0",
              maxWidth: 620,
              paddingTop: 22,
              borderTop: "1px solid rgba(255,255,255,0.14)",
            }}
          >
            {page.answerLine}
          </motion.p>
        )}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .icp-hero-btn { transition: transform 0.25s ease, background 0.25s ease; }
        @media (hover: hover) {
          .icp-hero-btn:hover { transform: scale(1.04); }
          .icp-hero-ghost:hover { background: rgba(255,255,255,0.08); }
        }
        .icp-hero-btn:focus-visible {
          outline: 2px solid ${PILL_TEXT};
          outline-offset: 3px;
        }
        @media (prefers-reduced-motion: reduce) {
          .icp-hero-btn { transition: none; }
          .icp-hero-btn:hover { transform: none; }
        }
        @media (max-width: 520px) {
          .icp-hero-cta { flex-direction: column; align-items: stretch; }
          .icp-hero-cta .icp-hero-btn { justify-content: center; width: 100%; }
        }
      `,
        }}
      />
    </header>
  );
}
