"use client";

// ═══════════════════════════════════════════════════════
// CTRL-A — EDITORIAL DESIGN SYSTEM
// Swiss/print magazine primitives. Cream paper, black ink,
// ROV amber as the single accent. Heavy grotesque display
// (inherited Inter @ 800–900), Thistora italic for serif
// accents, DM Mono for labels.
// ═══════════════════════════════════════════════════════

import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

// CTRL-A cosmic brand system. Key names kept stable so the whole
// magazine surface re-themes from this one object.
export const ed = {
  paper: "#F0E6E0", // magazine ground (light)
  paperDeep: "#F0E6E0", // single light tone in the system
  ink: "#24123A", // primary dark — text + dark panels
  void: "#0F0820", // deepest dark — footer / subscribe band
  inkSoft: "rgba(36,18,58,0.64)",
  inkFaint: "rgba(36,18,58,0.42)",
  hair: "rgba(36,18,58,0.20)",
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
        background: ed.ink,
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
