"use client";

// ═══════════════════════════════════════════════════════
// CTRL-A — EDITORIAL DESIGN SYSTEM
// Swiss/print magazine primitives. Cream paper, black ink,
// ROV amber as the single accent. Heavy grotesque display
// (inherited Inter @ 800–900), Thistora italic for serif
// accents, DM Mono for labels.
// ═══════════════════════════════════════════════════════

import Image from "next/image";
import { useEffect, useRef, useState, type MutableRefObject } from "react";
import type { CSSProperties, ReactNode } from "react";

// ── useInViewOnce — house IntersectionObserver primitive ────────────
// Matches the ShootingStars / LazyVideo pattern: gate scroll-triggered
// work behind a single-shot IntersectionObserver. Returns a ref to
// attach and a boolean that latches true the first time the element
// enters view (then disconnects). SSR / no-IO environments latch true
// immediately so content never hides. Used for the "selection" heading
// sweep and the "Off the clock" shelf stagger.
export function useInViewOnce<T extends HTMLElement = HTMLElement>(
  rootMargin = "0px 0px -12% 0px"
): [MutableRefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    if (typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin, threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
    // rootMargin is a stable literal at every call site; latch is one-shot.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return [ref, seen];
}

// ── Typewriter — ReactBits-style character typing for headlines ──────
// Types `text` in one character at a time with a blinking caret. The full
// string is always present for SEO / a11y (sr-only + aria-label); the
// animated copy is aria-hidden. Respects prefers-reduced-motion by showing
// the whole headline instantly with no caret.
export function Typewriter({
  text,
  speed = 55,
  startDelay = 250,
  cursorColor = "#E3C24A",
  style,
}: {
  text: string;
  speed?: number;
  startDelay?: number;
  cursorColor?: string;
  style?: CSSProperties;
}) {
  const [count, setCount] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)")
      : null;
    if (mq?.matches) {
      setReduced(true);
      setCount(text.length);
      return;
    }
    let i = 0;
    let tick: ReturnType<typeof setTimeout>;
    const start = setTimeout(function step() {
      i += 1;
      setCount(i);
      if (i < text.length) tick = setTimeout(step, speed);
    }, startDelay);
    return () => {
      clearTimeout(start);
      clearTimeout(tick);
    };
  }, [text, speed, startDelay]);

  const shown = text.slice(0, count);
  const done = count >= text.length;

  return (
    <span style={style} aria-label={text}>
      {/* Full headline for search engines + screen readers */}
      <span
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        {text}
      </span>
      {/* Animated, visual-only copy */}
      <span aria-hidden="true">{shown}</span>
      {!reduced && (
        <span
          aria-hidden="true"
          className="ctrla-type-caret"
          data-done={done ? "true" : "false"}
          style={{ background: cursorColor }}
        />
      )}
    </span>
  );
}

// CTRL-A cosmic brand system — DARK theme (illustrative space vibe).
// Key names kept stable so the whole magazine surface re-themes from
// this one object. Stays within the locked 6-colour palette:
// ground #0F0820 · panel #24123A · text/light #F0E6E0 · rose · gold · plum.
export const ed = {
  paper: "#F0E6E0", // light — primary text + light fills (logo masks etc.)
  paperDeep: "#F0E6E0",
  ground: "#0F0820", // dark page ground (sections)
  panel: "#24123A", // lifted dark surface — cards, cover, image placeholders
  ink: "#F0E6E0", // primary text/foreground — now LIGHT (key kept so it cascades)
  void: "#0F0820", // deepest dark — footer / subscribe band
  inkSoft: "rgba(240,230,224,0.86)", // body — kept bright so nothing reads as dim grey
  inkFaint: "rgba(240,230,224,0.64)", // secondary meta — lifted out of dim-grey territory
  hair: "rgba(240,230,224,0.16)",
  amber: "#A56A67", // rose accent (key kept for cascade)
  gold: "#E3C24A", // gold accent
  plum: "#4E3D73", // muted purple (mid)
  wine: "#4E3D73",
  dusty: "#A56A67",
  // Display/headings: Neue Montreal. Body: Instrument Serif.
  grotesque: "'Neue Montreal', 'Helvetica Neue', Arial, sans-serif",
  body: "'Instrument Serif', Georgia, 'Times New Roman', serif",
  serif: "'Instrument Serif', Georgia, 'Times New Roman', serif",
  mono: "'Neue Montreal', 'Helvetica Neue', Arial, sans-serif",
};

// LIGHT theme — used on the toolkit pages only. Inverts the surfaces and
// text so the toolkits read as the bright, airy reveal from the loader
// (cream ground, near-black plum text), while accents stay the same. The
// key names match `ed` exactly so a component can swap themes by aliasing.
export const edLight: typeof ed = {
  ...ed,
  paper: "#160C28",
  paperDeep: "#160C28",
  ground: "#F0E6E0", // cream page
  panel: "#E7D8CD", // warm sand — lifted surface / device frames on cream
  ink: "#160C28", // primary text — near-black plum
  void: "#0F0820",
  inkSoft: "rgba(22,12,40,0.66)",
  inkFaint: "rgba(22,12,40,0.42)",
  hair: "rgba(22,12,40,0.16)",
};

// On the cream light theme, gold (#E3C24A) is the one palette accent that is
// too light to read. Remap it to a legible palette colour on light-bg surfaces;
// rose and plum already pass on cream and stay as-is.
//   legibleAccent      → plum (#4E3D73), for headline-scale accents
//   legibleAccentDeep  → ink-panel (#24123A), for tiny caps labels so they
//                        stay distinct from the plum used elsewhere
export const legibleAccent = (accent: string): string =>
  accent === ed.gold ? ed.plum : accent;

export const legibleAccentDeep = (accent: string): string =>
  accent === ed.gold ? ed.panel : accent;

// ── SweepText — the "select all" heading highlight ─────────────────
// Wrap heading text in this to fire the one-shot gold selection sweep
// when it scrolls into view. Renders an inline span so the highlight
// paints behind the text run; safe to drop inside any h1/h2/h3.
export function SweepText({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {
  const [ref, seen] = useInViewOnce<HTMLSpanElement>();
  return (
    <span ref={ref} className={`ctrla-sweep${seen ? " is-selected" : ""}`} style={style}>
      {children}
    </span>
  );
}

// ── Page container with print margins ──────────────────

export function Bleed({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={className}
      style={{
        maxWidth: 1280,
        margin: "0 auto",
        padding: "0 clamp(18px, 5vw, 64px)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── Hairline rule ──────────────────────────────────────

export function Rule({
  color = ed.ink,
  weight = 1,
  style,
}: {
  color?: string;
  weight?: number;
  style?: CSSProperties;
}) {
  return <div style={{ width: "100%", height: weight, background: color, ...style }} />;
}

// ── Mono label / kicker ────────────────────────────────

export function Label({
  children,
  color = ed.amber,
  style,
}: {
  children: ReactNode;
  color?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      style={{
        fontFamily: ed.mono,
        fontSize: "clamp(9px, 1vw, 11px)",
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

// ── Kicker — accent tick + mono label (section signature) ──
// A small coloured rule before a label. Gives each section a
// signature accent from the palette instead of flat white kickers.

export function Kicker({
  children,
  color = ed.amber,
  style,
}: {
  children: ReactNode;
  color?: string;
  style?: CSSProperties;
}) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 9, ...style }}>
      <span aria-hidden style={{ width: 18, height: 2, background: color, flexShrink: 0 }} />
      <Label color={color}>{children}</Label>
    </span>
  );
}

// ── Section header — big grotesque title + right meta ──

export function SectionHeader({
  title,
  meta,
  id,
  dark = false,
}: {
  title: ReactNode;
  meta?: ReactNode;
  id?: string;
  dark?: boolean;
}) {
  const ink = dark ? ed.paper : ed.ink;
  const soft = dark ? "rgba(245,237,216,0.55)" : ed.inkSoft;
  return (
    <div
      id={id}
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: 24,
        flexWrap: "wrap",
        scrollMarginTop: 80,
      }}
    >
      <h2
        style={{
          fontFamily: ed.grotesque,
          fontWeight: 800,
          fontSize: "clamp(34px, 5.5vw, 72px)",
          lineHeight: 0.92,
          letterSpacing: "-0.02em",
          color: ink,
          margin: 0,
        }}
      >
        {title}
      </h2>
      {meta && (
        <p
          style={{
            fontFamily: ed.serif,
            fontStyle: "italic",
            fontSize: "clamp(12px, 1.4vw, 15px)",
            lineHeight: 1.4,
            color: soft,
            textAlign: "right",
            maxWidth: 280,
            margin: 0,
          }}
        >
          {meta}
        </p>
      )}
    </div>
  );
}

// ── Caption — serif italic title + mono page ref ───────

export function Caption({
  title,
  page,
  dark = false,
}: {
  title: string;
  page: string;
  dark?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span
        style={{
          fontFamily: ed.grotesque,
          fontWeight: 700,
          fontSize: "clamp(13px, 1.4vw, 15px)",
          letterSpacing: "-0.01em",
          color: dark ? ed.paper : ed.ink,
        }}
      >
        {title}
      </span>
      <Label color={dark ? "rgba(245,237,216,0.45)" : ed.inkFaint}>{page}</Label>
    </div>
  );
}

// ── Image block — black placeholder or real image ──────

export function ImageBlock({
  src,
  alt = "",
  ratio = "4 / 3",
  rounded = false,
  children,
  style,
}: {
  src?: string;
  alt?: string;
  ratio?: string;
  rounded?: boolean;
  children?: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: ratio,
        // Real image sits on a dark panel; an empty slot reads as a light wireframe.
        background: src ? ed.panel : ed.paper,
        backgroundImage: src
          ? undefined
          : "repeating-linear-gradient(45deg, rgba(36,18,58,0.05) 0, rgba(36,18,58,0.05) 1px, transparent 1px, transparent 11px)",
        boxShadow: src ? "none" : "inset 0 0 0 1.5px rgba(36,18,58,0.3)",
        borderRadius: rounded ? 14 : 0,
        overflow: "hidden",
        ...style,
      }}
    >
      {src ? (
        <Image src={src} alt={alt} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 50vw" />
      ) : null}
      {children}
    </div>
  );
}
