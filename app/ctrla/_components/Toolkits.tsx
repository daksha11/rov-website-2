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
  SectionHeader,
} from "./editorial";
import {
  toolkitSections,
  type ToolkitSection,
  type Tool,
} from "../data";

const spring = { type: "spring" as const, stiffness: 90, damping: 20 };

// ── Three Toolkits overview ────────────────────────────

export function ThreeToolkits() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{ background: ed.paper, padding: "clamp(56px, 8vw, 104px) 0" }}>
      <Bleed>
        <SectionHeader
          title="Three Toolkits."
          meta="Living libraries. Growing with each week's pick."
        />
        <Rule style={{ margin: "clamp(28px, 4vw, 48px) 0" }} />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "clamp(20px, 3vw, 40px)",
          }}
        >
          {toolkitSections.map((s, i) => (
            <motion.a
              key={s.id}
              href={`#${s.id}`}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ ...spring, delay: i * 0.1 }}
              style={{ display: "flex", flexDirection: "column", textDecoration: "none" }}
            >
              {/* Cover block with oversized page number */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "3 / 4",
                  background: ed.ink,
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "flex-end",
                  padding: 18,
                }}
              >
                <span
                  style={{
                    fontFamily: ed.grotesque,
                    fontWeight: 800,
                    fontSize: "clamp(72px, 12vw, 132px)",
                    lineHeight: 0.8,
                    color: `${s.accentColor}26`,
                    letterSpacing: "-0.04em",
                  }}
                >
                  {s.pageNumber}
                </span>
              </div>

              {/* Title */}
              <h3
                style={{
                  fontFamily: ed.grotesque,
                  fontWeight: 800,
                  fontSize: "clamp(28px, 3.5vw, 40px)",
                  letterSpacing: "-0.02em",
                  color: ed.ink,
                  margin: "18px 0 8px",
                }}
              >
                {s.title}.
              </h3>

              {/* Blurb */}
              <p
                style={{
                  fontFamily: ed.serif,
                  fontStyle: "italic",
                  fontSize: "clamp(13px, 1.4vw, 15px)",
                  lineHeight: 1.5,
                  color: ed.inkSoft,
                  margin: "0 0 18px",
                  flex: 1,
                }}
              >
                {s.blurb}
              </p>

              <Rule color={ed.hair} />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: 12,
                }}
              >
                <Label color={ed.inkFaint}>
                  {s.pickCount} · {s.cadence}
                </Label>
                <span style={{ color: ed.amber, fontSize: 16, lineHeight: 1 }}>→</span>
              </div>
            </motion.a>
          ))}
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
        background: "rgba(255,255,255,0.18)",
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
          fontFamily: ed.grotesque,
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
            ROV Pick — {tool.favoriteBy}
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
      style={{ background: ed.paper, padding: "clamp(56px, 8vw, 104px) 0", scrollMarginTop: 0 }}
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
              color: `${section.accentColor}26`,
            }}
          >
            {section.pageNumber}
          </span>
          <div style={{ paddingBottom: "clamp(8px, 2vw, 24px)" }}>
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
              {section.title}.
            </h2>
            <p
              style={{
                fontFamily: ed.grotesque,
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

        <Rule style={{ margin: "clamp(32px, 5vw, 56px) 0 clamp(24px, 3vw, 36px)" }} />

        {/* Tools */}
        <Label style={{ display: "block", marginBottom: 20 }}>The Tools</Label>
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
        <Label style={{ display: "block", margin: "clamp(48px, 7vw, 80px) 0 8px" }}>Myths Busted</Label>
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
                    fontFamily: ed.grotesque,
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
        <Label style={{ display: "block", margin: "clamp(48px, 7vw, 80px) 0 8px" }}>
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
                borderTop: `1px solid ${ed.ink}`,
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
                  fontFamily: ed.grotesque,
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
