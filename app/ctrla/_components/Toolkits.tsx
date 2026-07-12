"use client";

// ═══════════════════════════════════════════════════════
// CTRL-A — TOOLKITS
// "Three Toolkits" overview row + per-toolkit editorial
// detail (tools / myths / quick-start), cream-on-ink.
// ═══════════════════════════════════════════════════════

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  ed,
  Bleed,
  Rule,
  Label,
  Kicker,
  SectionHeader,
} from "./editorial";
import {
  toolkitSections,
  type ToolkitSection,
  type Tool,
} from "../data";
import { DrawLine } from "./CosmicAccents";

const spring = { type: "spring" as const, stiffness: 90, damping: 20 };

// ── Three Toolkits overview ────────────────────────────

export function ThreeToolkits() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="toolkits" ref={ref} style={{ background: "transparent", padding: "clamp(56px, 8vw, 104px) 0", scrollMarginTop: 0 }}>
      <Bleed>
        <Kicker color={ed.gold} style={{ marginBottom: 16 }}>The Libraries</Kicker>
        <SectionHeader
          title="Four Toolkits."
          meta="Living libraries. Growing with each week's pick."
        />
        {/* Drawn cosmic divider in place of the plain rule */}
        <DrawLine color={ed.gold} style={{ margin: "clamp(18px, 2.6vw, 32px) 0" }} />

        {/* Stepped lines — each toolkit is a full-width accent line, with a
            compact copy node resting on it, offset further right each step.
            Lots of negative space, small vertical footprint. */}
        <div>
          {toolkitSections.map((s, i) => {
            const n = toolkitSections.length;
            const frac = n > 1 ? i / (n - 1) : 0;         // 0 = hard left, 1 = hard right
            const alignRight = frac > 0.5;                 // right-half nodes hug the right
            // Node's left edge slides from container-left (frac 0) to
            // container-right-minus-node-width (frac 1), evenly spaced.
            // Desktop only — a mobile media query collapses this back to the left.
            const offset = `calc(${frac} * (100% - min(460px, 100%)))`;
            return (
              <motion.a
                key={s.id}
                href={`/ctrla/toolkit/${s.id}`}
                initial={{ opacity: 0, y: 14 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ ...spring, delay: i * 0.08 }}
                className="ctrla-toolkit-step"
                style={{
                  display: "block",
                  position: "relative",
                  textDecoration: "none",
                  padding: "clamp(20px, 3vw, 34px) 0",
                }}
              >
                {/* The line = the toolkit */}
                <div style={{ height: 1.5, background: s.accentColor, width: "100%", opacity: 0.85 }} />

                {/* The copy node = the circle, resting on the line, spread
                    evenly from the left edge (first) to the right edge (last) */}
                <div
                  className={`ctrla-toolkit-node${alignRight ? " is-right" : ""}`}
                  style={{
                    marginLeft: offset,
                    marginTop: "clamp(14px, 1.8vw, 22px)",
                    width: "min(460px, 100%)",
                    textAlign: alignRight ? "right" : "left",
                  }}
                >
                  {/* Number sits above, on the same edge as the name + blurb */}
                  <span
                    style={{
                      display: "block",
                      fontFamily: ed.mono,
                      fontWeight: 400,
                      fontSize: "clamp(11px, 1.1vw, 13px)",
                      letterSpacing: "0.12em",
                      color: ed.gold,
                      marginBottom: 8,
                    }}
                  >
                    {s.pageNumber}
                  </span>
                  <div
                    className="ctrla-toolkit-row"
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "clamp(10px, 1.4vw, 16px)",
                      justifyContent: alignRight ? "flex-end" : "flex-start",
                    }}
                  >
                    {/* Left arrow: shown for right-aligned desktop nodes only.
                        CSS hides it on mobile, where every node points right. */}
                    <span
                      className="ctrla-toolkit-arrow ctrla-toolkit-arrow-left"
                      style={{ color: s.accentColor, fontSize: 15, lineHeight: 1, marginRight: 2 }}
                    >
                      ←
                    </span>
                    <h3
                      style={{
                        fontFamily: ed.grotesque,
                        fontWeight: 800,
                        fontSize: "clamp(22px, 2.8vw, 38px)",
                        letterSpacing: "-0.02em",
                        lineHeight: 1,
                        color: ed.ink,
                        margin: 0,
                      }}
                    >
                      {s.title}
                    </h3>
                    {/* Right arrow: the default for left-aligned nodes, and the
                        only arrow shown on mobile. CSS hides it for right nodes. */}
                    <span
                      className="ctrla-toolkit-arrow ctrla-toolkit-arrow-right"
                      style={{ color: s.accentColor, fontSize: 15, lineHeight: 1, marginLeft: 2 }}
                    >
                      →
                    </span>
                  </div>
                  <p
                    style={{
                      fontFamily: ed.grotesque,
                      fontStyle: "normal",
                      fontWeight: 400,
                      fontSize: "clamp(12px, 1.3vw, 15px)",
                      lineHeight: 1.5,
                      color: ed.gold,
                      margin: "7px 0 0",
                    }}
                  >
                    {s.blurb}
                  </p>
                  <Label color={ed.gold} style={{ display: "block", marginTop: 8 }}>
                    {s.pickCount} · {s.cadence}
                  </Label>
                </div>
              </motion.a>
            );
          })}
        </div>
      </Bleed>
    </section>
  );
}

// ── Tool card ──────────────────────────────────────────

function ToolCard({ tool, accent }: { tool: Tool; accent: string }) {
  return (
    <a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "20px 20px 22px",
        border: `1px solid ${ed.hair}`,
        borderTop: `2px solid ${accent}`,
        background: "rgba(240,230,224,0.05)",
        textDecoration: "none",
        height: "100%",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
        <div>
          <Label color={accent} style={{ display: "block", marginBottom: 6 }}>
            {tool.category}
          </Label>
          <h4
            style={{
              fontFamily: ed.grotesque,
              fontWeight: 700,
              fontSize: 19,
              letterSpacing: "-0.01em",
              color: ed.ink,
              margin: 0,
            }}
          >
            {tool.name}
          </h4>
        </div>
        <span style={{ color: ed.inkFaint, fontSize: 14, lineHeight: 1.4 }}>↗</span>
      </div>

      <p
        style={{
          fontFamily: ed.body,
          fontWeight: 400,
          fontSize: 13.5,
          lineHeight: 1.6,
          color: ed.inkSoft,
          margin: "12px 0 14px",
        }}
      >
        {tool.description}
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: "auto" }}>
        {tool.tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontFamily: ed.mono,
              fontSize: 9,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: ed.inkFaint,
              border: `1px solid ${ed.hair}`,
              padding: "3px 8px",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {tool.favoriteBy && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${ed.hair}` }}>
          <Label color={accent} style={{ display: "block", marginBottom: 5 }}>
            ROV Pick · {tool.favoriteBy}
          </Label>
          <p
            style={{
              fontFamily: ed.serif,
              fontStyle: "italic",
              fontSize: 13,
              lineHeight: 1.5,
              color: ed.inkSoft,
              margin: 0,
            }}
          >
            &ldquo;{tool.favoriteQuote}&rdquo;
          </p>
        </div>
      )}
    </a>
  );
}

// ── Per-toolkit detail block ───────────────────────────

export function ToolkitDetail({ section }: { section: ToolkitSection }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id={section.id}
      ref={ref}
      style={{ background: "transparent", padding: "clamp(56px, 8vw, 104px) 0", scrollMarginTop: 0 }}
    >
      <Bleed>
        {/* Chapter head */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: "clamp(12px, 3vw, 32px)" }}>
          <span
            style={{
              fontFamily: ed.grotesque,
              fontWeight: 800,
              fontSize: "clamp(96px, 18vw, 220px)",
              lineHeight: 0.74,
              letterSpacing: "-0.04em",
              color: `${section.accentColor}4D`,
            }}
          >
            {section.pageNumber}
          </span>
          <div style={{ paddingBottom: "clamp(8px, 2vw, 24px)" }}>
            <Kicker color={section.accentColor} style={{ marginBottom: 14 }}>
              Sector {section.pageNumber} · The Toolkit
            </Kicker>
            <h2
              style={{
                fontFamily: ed.grotesque,
                fontWeight: 800,
                fontSize: "clamp(40px, 7vw, 88px)",
                lineHeight: 0.9,
                letterSpacing: "-0.03em",
                color: ed.ink,
                margin: "0 0 12px",
              }}
            >
              {section.title}<span style={{ color: section.accentColor }}>.</span>
            </h2>
            <p
              style={{
                fontFamily: ed.body,
                fontWeight: 400,
                fontSize: "clamp(13px, 1.5vw, 16px)",
                lineHeight: 1.6,
                color: ed.inkSoft,
                maxWidth: 540,
                margin: 0,
              }}
            >
              {section.intro}
            </p>
          </div>
        </div>

        <Rule color={`${section.accentColor}40`} style={{ margin: "clamp(32px, 5vw, 56px) 0 clamp(24px, 3vw, 36px)" }} />

        {/* Tools */}
        <Label color={section.accentColor} style={{ display: "block", marginBottom: 20 }}>The Tools</Label>
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={spring}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))",
            gap: 14,
          }}
        >
          {section.tools.map((t) => (
            <ToolCard key={t.name} tool={t} accent={section.accentColor} />
          ))}
        </motion.div>

        {/* Myths */}
        <Label color={section.accentColor} style={{ display: "block", margin: "clamp(48px, 7vw, 80px) 0 8px" }}>Myths Busted</Label>
        <div>
          {section.misconceptions.map((m) => (
            <div
              key={m.myth}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 5fr) minmax(0, 7fr)",
                gap: "clamp(12px, 3vw, 36px)",
                padding: "clamp(20px, 3vw, 32px) 0",
                borderTop: `1px solid ${ed.hair}`,
              }}
            >
              <div>
                <Label color={ed.inkFaint} style={{ display: "block", marginBottom: 8 }}>
                  Myth
                </Label>
                <h4
                  style={{
                    fontFamily: ed.serif,
                    fontStyle: "italic",
                    fontSize: "clamp(18px, 2.2vw, 24px)",
                    lineHeight: 1.2,
                    color: ed.ink,
                    textDecoration: "line-through",
                    textDecorationColor: ed.hair,
                    margin: 0,
                  }}
                >
                  {m.myth}
                </h4>
              </div>
              <div>
                <Label color={section.accentColor} style={{ display: "block", marginBottom: 8 }}>
                  Reality
                </Label>
                <p
                  style={{
                    fontFamily: ed.body,
                    fontWeight: 400,
                    fontSize: "clamp(13px, 1.5vw, 15px)",
                    lineHeight: 1.65,
                    color: ed.inkSoft,
                    margin: 0,
                  }}
                >
                  {m.reality}
                </p>
              </div>
            </div>
          ))}
          <Rule color={ed.hair} />
        </div>

        {/* Quick-start guide */}
        <Label color={section.accentColor} style={{ display: "block", margin: "clamp(48px, 7vw, 80px) 0 8px" }}>
          Quick Start Guide
        </Label>
        <h3
          style={{
            fontFamily: ed.grotesque,
            fontWeight: 800,
            fontSize: "clamp(24px, 3.5vw, 40px)",
            letterSpacing: "-0.02em",
            color: ed.ink,
            margin: "0 0 clamp(24px, 4vw, 40px)",
          }}
        >
          {section.guide.title}
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: 0 }}>
          {section.guide.steps.map((step, i) => (
            <div
              key={step.number}
              style={{
                borderTop: `2px solid ${section.accentColor}`,
                padding: "16px 16px 22px 0",
              }}
            >
              <span
                style={{
                  fontFamily: ed.grotesque,
                  fontWeight: 800,
                  fontSize: 34,
                  color: section.accentColor,
                  letterSpacing: "-0.02em",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h4
                style={{
                  fontFamily: ed.grotesque,
                  fontWeight: 700,
                  fontSize: 16,
                  lineHeight: 1.3,
                  color: ed.ink,
                  margin: "10px 0 8px",
                }}
              >
                {step.title}
              </h4>
              <p
                style={{
                  fontFamily: ed.body,
                  fontWeight: 400,
                  fontSize: 13,
                  lineHeight: 1.6,
                  color: ed.inkSoft,
                  margin: 0,
                }}
              >
                {step.body}
              </p>
              {step.tip && (
                <p
                  style={{
                    fontFamily: ed.serif,
                    fontStyle: "italic",
                    fontSize: 12.5,
                    lineHeight: 1.5,
                    color: section.accentColor,
                    margin: "10px 0 0",
                  }}
                >
                  Tip: {step.tip}
                </p>
              )}
            </div>
          ))}
        </div>
      </Bleed>
    </section>
  );
}
