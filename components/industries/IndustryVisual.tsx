"use client";

import { useRef } from "react";
import Image from "next/image";
import type { IndustryVisual as VisualData } from "@/lib/types";
import { HEADING, BODY, CREAM, EMBER_LIGHT, PILL_TEXT, NEAR_BLACK } from "./shared";
import { trackVisualEngage } from "./analytics";
import { Reveal } from "./Reveal";

/**
 * The one interactive centerpiece per page, restyled dark/premium (ember
 * accents on near-black). Discriminated-union switch on visual.type. Pure
 * CSS/SVG + small React, no chart libraries. Fires icp_visual_engage once.
 */
export function IndustryVisual({
  visual,
  icpSlug,
}: {
  visual: VisualData;
  icpSlug: string;
}) {
  const engaged = useRef(false);

  const onEngage = () => {
    if (engaged.current) return;
    engaged.current = true;
    trackVisualEngage(icpSlug, visual.type);
  };

  return (
    <section
      style={{ background: NEAR_BLACK, padding: "clamp(56px, 7vw, 88px) clamp(20px, 6%, 6%)" }}
      onPointerDown={onEngage}
      onMouseEnter={onEngage}
      onFocusCapture={onEngage}
    >
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
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
          <span>02</span>
          <span
            aria-hidden
            style={{ width: 28, height: 1, background: "rgba(234,154,97,0.5)" }}
          />
          <span>How it works</span>
        </p>
        {visual.title && (
          <h2
            style={{
              fontFamily: HEADING,
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: "clamp(1.9rem, 4.5vw, 3rem)",
              lineHeight: 1.15,
              color: "#FFFFFF",
              margin: "0 0 44px",
              maxWidth: 760,
            }}
          >
            {visual.title}
          </h2>
        )}

        {visual.type === "before-after" && <BeforeAfter visual={visual} />}
        {visual.type === "process-flow" && <ProcessFlow visual={visual} />}
        {visual.type === "diagram" && <Diagram visual={visual} />}
        {visual.type === "annotated-mockup" && (
          <AnnotatedMockup visual={visual} onEngage={onEngage} />
        )}
      </div>
    </section>
  );
}

// ─── before-after ────────────────────────────────────────────────────────
function BeforeAfter({
  visual,
}: {
  visual: Extract<VisualData, { type: "before-after" }>;
}) {
  return (
    <div className="icp-ba">
      <div className="icp-ba-before">
        <Panel
          label={visual.before.label}
          points={visual.before.points}
          tone="before"
        />
      </div>
      {/* Bespoke connector: a labeled node instead of two equal grid cells. */}
      <div className="icp-ba-arrow" aria-hidden>
        <span className="icp-ba-node" style={{ color: EMBER_LIGHT }}>
          →
        </span>
        <span className="icp-ba-node-label">The shift</span>
      </div>
      <div className="icp-ba-after">
        <Panel
          label={visual.after.label}
          points={visual.after.points}
          tone="after"
        />
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .icp-ba {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          align-items: stretch;
        }
        .icp-ba-before, .icp-ba-after { min-width: 0; }
        .icp-ba-arrow {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .icp-ba-node {
          font-size: 26px;
          line-height: 1;
          transform: rotate(90deg);
          display: inline-flex;
          width: 46px;
          height: 46px;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          border: 1px solid rgba(234,154,97,0.35);
          background: rgba(234,154,97,0.06);
        }
        .icp-ba-node-label {
          font-family: ${BODY};
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(234,154,97,0.7);
        }
        @media (min-width: 720px) {
          .icp-ba {
            grid-template-columns: 1fr auto 1fr;
            gap: 0;
            align-items: center;
          }
          .icp-ba-node { transform: none; }
          /* The "after" panel overlaps inward over the connector, elevated. */
          .icp-ba-before { padding-right: 34px; }
          .icp-ba-after {
            position: relative;
            z-index: 2;
            margin-left: -22px;
          }
          .icp-ba-after > div {
            box-shadow: 0 26px 60px rgba(0,0,0,0.5);
          }
          .icp-ba-arrow { position: relative; z-index: 3; }
        }
      `,
        }}
      />
    </div>
  );
}

function Panel({
  label,
  points,
  tone,
}: {
  label: string;
  points: string[];
  tone: "before" | "after";
}) {
  const isAfter = tone === "after";
  return (
    <div
      style={{
        borderRadius: 18,
        padding: "28px 26px",
        height: "100%",
        background: isAfter
          ? "var(--gradient-ember)"
          : "rgba(255,255,255,0.02)",
        border: isAfter
          ? "1px solid rgba(234,154,97,0.35)"
          : "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <p
        style={{
          fontFamily: BODY,
          fontWeight: 500,
          fontSize: 11,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: isAfter ? EMBER_LIGHT : "rgba(255,255,255,0.4)",
          margin: "0 0 18px",
        }}
      >
        {label}
      </p>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 13 }}>
        {points.map((pt, i) => (
          <li
            key={i}
            style={{
              display: "flex",
              gap: 10,
              fontFamily: BODY,
              fontWeight: 300,
              fontSize: 15.5,
              lineHeight: 1.5,
              color: isAfter ? "rgba(255,244,227,0.92)" : "rgba(255,255,255,0.65)",
            }}
          >
            <span aria-hidden style={{ color: EMBER_LIGHT, flexShrink: 0 }}>
              {isAfter ? "✓" : "•"}
            </span>
            {pt}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── process-flow ────────────────────────────────────────────────────────
function ProcessFlow({
  visual,
}: {
  visual: Extract<VisualData, { type: "process-flow" }>;
}) {
  return (
    <div className="icp-flow">
      {visual.steps.map((s, i) => (
        <Reveal key={i} className="icp-flow-step" delay={i * 110}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 46,
              height: 46,
              borderRadius: 999,
              background: "var(--gradient-ember)",
              border: "1px solid rgba(234,154,97,0.35)",
              color: CREAM,
              fontFamily: HEADING,
              fontWeight: 700,
              fontSize: 18,
              flexShrink: 0,
            }}
          >
            {s.n}
          </div>
          <div>
            <h3
              style={{
                fontFamily: HEADING,
                fontWeight: 700,
                fontSize: "1.1rem",
                color: "#FFF4E3",
                margin: "0 0 6px",
              }}
            >
              {s.title}
            </h3>
            <p
              style={{
                fontFamily: BODY,
                fontWeight: 300,
                fontSize: 14.5,
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.6)",
                margin: 0,
              }}
            >
              {s.body}
            </p>
          </div>
        </Reveal>
      ))}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .icp-flow {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
          position: relative;
        }
        .icp-flow-step {
          display: grid;
          grid-template-columns: 46px 1fr;
          gap: 16px;
          align-items: start;
          padding: 14px 0;
          border-left: 2px solid rgba(234,154,97,0.25);
          padding-left: 20px;
          margin-left: 22px;
        }
        .icp-flow-step > div:first-child { margin-left: -45px; }
        @media (min-width: 820px) {
          .icp-flow {
            grid-template-columns: repeat(${visual.steps.length}, minmax(0, 1fr));
            gap: 20px;
          }
          .icp-flow-step {
            grid-template-columns: 1fr;
            border-left: none;
            border-top: 2px solid rgba(234,154,97,0.25);
            padding: 20px 0 0;
            margin-left: 0;
            gap: 14px;
          }
          .icp-flow-step > div:first-child { margin-left: 0; }
        }
      `,
        }}
      />
    </div>
  );
}

// ─── diagram (hub-and-spoke) ─────────────────────────────────────────────
function Diagram({
  visual,
}: {
  visual: Extract<VisualData, { type: "diagram" }>;
}) {
  return (
    <div>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "18px 30px",
          borderRadius: 999,
          background: "var(--gradient-ember)",
          color: CREAM,
          fontFamily: HEADING,
          fontWeight: 700,
          fontSize: "1.15rem",
          marginBottom: 24,
          border: "1px solid rgba(234,154,97,0.35)",
        }}
      >
        {visual.centerLabel}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
          gap: 16,
        }}
      >
        {visual.items.map((it, i) => (
          <div
            key={i}
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16,
              padding: "24px 22px",
              borderTop: `3px solid ${EMBER_LIGHT}`,
            }}
          >
            <h3
              style={{
                fontFamily: HEADING,
                fontWeight: 700,
                fontSize: "1.1rem",
                color: "#FFF4E3",
                margin: "0 0 8px",
              }}
            >
              {it.title}
            </h3>
            <p
              style={{
                fontFamily: BODY,
                fontWeight: 300,
                fontSize: 14.5,
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.6)",
                margin: 0,
              }}
            >
              {it.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── annotated-mockup ────────────────────────────────────────────────────
// Side-by-side: a contained image on the left, the callout list on the
// right. No overlay pins on the photo; the list carries the annotations
// with quiet ember rules instead of numbered chips.
function AnnotatedMockup({
  visual,
}: {
  visual: Extract<VisualData, { type: "annotated-mockup" }>;
  onEngage: () => void;
}) {
  const hasImage = !!visual.image;

  return (
    <div className="icp-anno">
      <div
        className="icp-anno-media"
        style={{
          position: "relative",
          aspectRatio: "4 / 3",
          borderRadius: 18,
          overflow: "hidden",
          background: "var(--gradient-ember)",
          border: "1px solid rgba(234,154,97,0.25)",
        }}
      >
        {hasImage ? (
          <Image
            src={visual.image}
            alt={visual.alt}
            fill
            sizes="(max-width: 719px) 100vw, 480px"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: BODY,
                fontSize: 12,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(255,244,227,0.65)",
              }}
            >
              {visual.alt || "Visual pending"}
            </span>
          </div>
        )}
      </div>

      <ul
        className="icp-anno-list"
        style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 0 }}
      >
        {visual.annotations.map((a, i) => (
          <li
            key={i}
            style={{
              display: "flex",
              gap: 16,
              alignItems: "flex-start",
              fontFamily: BODY,
              fontWeight: 300,
              fontSize: 15.5,
              lineHeight: 1.55,
              color: "rgba(255,255,255,0.75)",
              padding: "16px 0",
              borderBottom:
                i < visual.annotations.length - 1
                  ? "1px solid rgba(255,255,255,0.08)"
                  : "none",
            }}
          >
            <span
              aria-hidden
              style={{
                flexShrink: 0,
                width: 22,
                height: 2,
                background: EMBER_LIGHT,
                marginTop: 11,
              }}
            />
            {a.label}
          </li>
        ))}
      </ul>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .icp-anno {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          align-items: center;
        }
        @media (min-width: 720px) {
          .icp-anno {
            grid-template-columns: minmax(0, 480px) minmax(0, 1fr);
            gap: clamp(32px, 5vw, 56px);
          }
        }
      `,
        }}
      />
    </div>
  );
}
