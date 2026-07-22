"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import type { IndustryShowcaseItem } from "@/lib/types";
import { HEADING, BODY, PILL_TEXT, BLACK } from "./shared";
import { Reveal } from "./Reveal";
import { GhostType } from "./GhostType";

/**
 * Featured-work band, rebuilt in the language of the /web FeaturedWorksSection:
 * larger cards, hover-to-play (press on touch) video, a title and a one-line
 * result caption, and a quiet ember index label. Videos stay lazy-mounted
 * (IntersectionObserver + preload="none"), never autoplay under
 * prefers-reduced-motion, and a gradient placeholder holds the frame until a
 * card is interacted with.
 *
 * A Before/After pair (two adjacent items labelled "before" and "after") keeps
 * its bespoke connected treatment: one card with a toggle that swaps the clip,
 * rather than two separate tiles.
 */

type Group =
  | { kind: "single"; item: IndustryShowcaseItem; index: number }
  | {
      kind: "beforeAfter";
      before: IndustryShowcaseItem;
      after: IndustryShowcaseItem;
      index: number;
    };

function groupItems(items: IndustryShowcaseItem[]): Group[] {
  const groups: Group[] = [];
  let i = 0;
  while (i < items.length) {
    const a = items[i];
    const b = items[i + 1];
    if (
      a &&
      b &&
      a.kind === "video" &&
      b.kind === "video" &&
      a.label.trim().toLowerCase() === "before" &&
      b.label.trim().toLowerCase() === "after"
    ) {
      groups.push({ kind: "beforeAfter", before: a, after: b, index: i });
      i += 2;
    } else {
      groups.push({ kind: "single", item: a, index: i });
      i += 1;
    }
  }
  return groups;
}

export function IndustryShowcase({
  items,
  heading = "See it in the wild",
  ghostWord,
  eyebrowNo = "04",
}: {
  items?: IndustryShowcaseItem[];
  heading?: string;
  ghostWord?: string;
  eyebrowNo?: string;
}) {
  const groups = useMemo(() => groupItems(items ?? []), [items]);
  if (!items || items.length === 0) return null;

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        background: BLACK,
        padding: "clamp(56px, 7vw, 92px) clamp(20px, 6%, 6%)",
      }}
    >
      {/* Ambient ember glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          right: "-8%",
          top: "8%",
          width: "48%",
          height: "70%",
          background:
            "radial-gradient(ellipse, rgba(234,154,97,0.10) 0%, transparent 68%)",
          filter: "blur(72px)",
          pointerEvents: "none",
        }}
      />
      {ghostWord && (
        <GhostType text={ghostWord} position="left" variant="fill" top="4%" />
      )}
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1180, margin: "0 auto" }}>
        <Reveal>
          <p
            style={{
              fontFamily: BODY,
              fontWeight: 500,
              fontSize: 12,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: PILL_TEXT,
              margin: "0 0 16px",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span>{eyebrowNo}</span>
            <span
              aria-hidden
              style={{ width: 28, height: 1, background: "rgba(234,154,97,0.5)" }}
            />
            <span>Our work</span>
          </p>
          <h2
            style={{
              fontFamily: HEADING,
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: "clamp(1.9rem, 4.5vw, 3rem)",
              lineHeight: 1.15,
              color: "#FFFFFF",
              margin: "0 0 44px",
              maxWidth: 720,
            }}
          >
            {heading}
          </h2>
        </Reveal>

        <div
          className="icp-work-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 420px), 1fr))",
            gap: 24,
          }}
        >
          {groups.map((g, gi) =>
            g.kind === "beforeAfter" ? (
              <Reveal key={`ba-${g.index}`} delay={gi * 80} style={{ gridColumn: "1 / -1" }}>
                <BeforeAfterCard before={g.before} after={g.after} index={g.index} />
              </Reveal>
            ) : (
              <Reveal key={g.item.src} delay={gi * 80}>
                <WorkCard item={g.item} index={g.index} />
              </Reveal>
            )
          )}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .icp-work-card {
          transition: transform 350ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 350ms ease, border-color 350ms ease;
        }
        @media (hover: hover) {
          .icp-work-card:hover {
            transform: translateY(-4px);
            border-color: rgba(234,154,97,0.34);
            box-shadow: 0 28px 64px rgba(0,0,0,0.55);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .icp-work-card { transition: none !important; transform: none !important; }
        }
      `,
        }}
      />
    </section>
  );
}

/** Shared media surface: lazy-mounted, hover-to-play (autoplay-in-view on
 *  touch), reduced-motion safe. Exposes the current <video> via a ref callback
 *  so wrappers (e.g. Before/After) can swap sources. */
function HoverVideo({
  src,
  label,
  active = true,
}: {
  src: string;
  label: string;
  /** When false (e.g. hidden side of a toggle) the clip is paused. */
  active?: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [mount, setMount] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [hoverCapable, setHoverCapable] = useState(false);
  const reducedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    reducedRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    setHoverCapable(window.matchMedia("(hover: hover)").matches);

    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setMount(true);
            // Touch / no-hover: autoplay in view (unless reduced motion).
            if (
              !window.matchMedia("(hover: hover)").matches &&
              !reducedRef.current
            ) {
              setPlaying(true);
            }
          }
        });
      },
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (playing && active && !reducedRef.current) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [playing, active, mount]);

  const startHover = () => {
    if (hoverCapable && !reducedRef.current) setPlaying(true);
  };
  const endHover = () => {
    if (hoverCapable) setPlaying(false);
  };

  return (
    <div
      ref={wrapRef}
      onPointerEnter={startHover}
      onPointerLeave={endHover}
      onFocus={startHover}
      onBlur={endHover}
      style={{ position: "absolute", inset: 0 }}
    >
      {mount && (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          // preload metadata so the first frame paints as a poster the moment
          // the card mounts (in view), instead of a flat ember block.
          preload="metadata"
          aria-label={label}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        >
          <source src={src} type="video/mp4" />
        </video>
      )}
      {/* Idle hint: only on hover-capable devices, hidden once playing. */}
      {hoverCapable && !playing && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              width: 48,
              height: 48,
              borderRadius: 999,
              background: "rgba(0,0,0,0.42)",
              border: "1px solid rgba(255,244,227,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(2px)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#FFF4E3">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </div>
      )}
    </div>
  );
}

function CardChrome({
  index,
  label,
  result,
  children,
  topRight,
  ratio = "16 / 9",
}: {
  index: number;
  label: string;
  result?: string;
  children: React.ReactNode;
  topRight?: React.ReactNode;
  ratio?: string;
}) {
  return (
    <div
      className="icp-work-card"
      style={
        {
          position: "relative",
          width: "100%",
          borderRadius: 18,
          overflow: "hidden",
          border: "1px solid rgba(234,154,97,0.16)",
          background: "var(--gradient-ember)",
          height: "100%",
        } as CSSProperties
      }
    >
      <div style={{ position: "relative", width: "100%", aspectRatio: ratio }}>
        {children}

        {/* Ember index label */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            top: 14,
            left: 16,
            fontFamily: BODY,
            fontWeight: 600,
            fontSize: 11,
            letterSpacing: "0.22em",
            color: "rgba(255,244,227,0.82)",
            textShadow: "0 1px 8px rgba(0,0,0,0.6)",
            zIndex: 3,
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        {topRight && (
          <div style={{ position: "absolute", top: 12, right: 12, zIndex: 4 }}>
            {topRight}
          </div>
        )}

        {/* Bottom scrim */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.1) 48%, transparent 72%)",
            pointerEvents: "none",
            zIndex: 2,
          }}
        />
      </div>

      {/* Caption block */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          padding: "18px 20px 20px",
          zIndex: 3,
        }}
      >
        <h3
          style={{
            fontFamily: HEADING,
            fontStyle: "italic",
            fontWeight: 700,
            fontSize: "clamp(1.15rem, 2.2vw, 1.5rem)",
            lineHeight: 1.1,
            color: "#FFF4E3",
            margin: 0,
          }}
        >
          {label}
        </h3>
        {result && (
          <p
            style={{
              fontFamily: BODY,
              fontWeight: 300,
              fontSize: 13.5,
              lineHeight: 1.5,
              color: "rgba(255,255,255,0.62)",
              margin: "7px 0 0",
              maxWidth: "42ch",
            }}
          >
            {result}
          </p>
        )}
      </div>
    </div>
  );
}

function WorkCard({ item, index }: { item: IndustryShowcaseItem; index: number }) {
  const ratio = item.ratio ?? "16 / 9";
  return (
    <CardChrome index={index} label={item.label} result={item.result} ratio={ratio}>
      {item.kind === "video" ? (
        <HoverVideo src={item.src} label={item.label} />
      ) : (
        <Image
          src={item.src}
          alt={item.alt || item.label}
          fill
          sizes="(max-width: 760px) 100vw, 560px"
          style={{ objectFit: "cover" }}
        />
      )}
    </CardChrome>
  );
}

/** Bespoke connected Before/After card: one surface, a toggle swaps the clip. */
function BeforeAfterCard({
  before,
  after,
  index,
}: {
  before: IndustryShowcaseItem;
  after: IndustryShowcaseItem;
  index: number;
}) {
  const [showBefore, setShowBefore] = useState(false);
  const ratio = after.ratio ?? "16 / 9";
  const current = showBefore ? before : after;

  const toggle = (
    <div
      style={{
        display: "inline-flex",
        padding: 3,
        borderRadius: 9999,
        background: "rgba(0,0,0,0.5)",
        border: "1px solid rgba(255,255,255,0.14)",
        backdropFilter: "blur(6px)",
      }}
    >
      {[
        { key: "before", label: "Before", on: showBefore },
        { key: "after", label: "After", on: !showBefore },
      ].map((t) => (
        <button
          key={t.key}
          onClick={() => setShowBefore(t.key === "before")}
          style={{
            fontFamily: BODY,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            padding: "6px 14px",
            borderRadius: 9999,
            border: "none",
            cursor: "pointer",
            color: t.on ? "#160b06" : "rgba(255,255,255,0.7)",
            background: t.on ? PILL_TEXT : "transparent",
            transition: "background 200ms ease, color 200ms ease",
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );

  return (
    <CardChrome
      index={index}
      label={showBefore ? "Before the rebuild" : "After the rebuild"}
      result={current.result}
      topRight={toggle}
      ratio={ratio}
    >
      {/* Both clips are mounted; only the active one plays, so the swap is instant. */}
      <div style={{ position: "absolute", inset: 0, opacity: showBefore ? 1 : 0, transition: "opacity 250ms ease" }}>
        <HoverVideo src={before.src} label={before.label} active={showBefore} />
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: showBefore ? 0 : 1, transition: "opacity 250ms ease" }}>
        <HoverVideo src={after.src} label={after.label} active={!showBefore} />
      </div>
    </CardChrome>
  );
}
