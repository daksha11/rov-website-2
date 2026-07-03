"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ResourceArticleShell } from "@/app/resources/_components/ResourceArticleShell";
import type { ToolkitArticleContent, ToolkitImage } from "../_content/types";

function ArticleImage({ image }: { image: ToolkitImage }) {
  return (
    <figure style={{ margin: "40px 0" }}>
      <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", borderRadius: 12, overflow: "hidden" }}>
        <Image src={image.src} alt={image.alt} fill style={{ objectFit: "cover" }} sizes="(max-width: 760px) 100vw, 760px" />
      </div>
      {image.caption && (
        <figcaption style={{ fontSize: 13, color: "rgba(59,33,20,0.55)", marginTop: 10, fontFamily: "'Neue Montreal', sans-serif" }}>
          {image.caption}
        </figcaption>
      )}
    </figure>
  );
}

interface ToolkitArticleBodyProps {
  content: ToolkitArticleContent;
}

const calloutBoxStyle: CSSProperties = {
  background: "rgba(144,66,44,0.08)",
  border: "1px solid rgba(144,66,44,0.2)",
  borderRadius: 12,
  padding: "24px 28px",
  margin: "8px 0 0",
};

const calloutLabelStyle: CSSProperties = {
  fontFamily: "'Neue Montreal', sans-serif",
  fontSize: 13,
  fontWeight: 700,
  color: "#90422C",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  marginBottom: 12,
};

const h2Style: CSSProperties = {
  fontFamily: "Norwige, sans-serif",
  fontSize: "clamp(26px, 4vw, 38px)",
  fontWeight: 400,
  color: "#90422C",
  marginBottom: 20,
  lineHeight: 1.2,
};

const bodyPStyle: CSSProperties = {
  fontSize: 17,
  lineHeight: 1.75,
  marginBottom: 20,
};

export function ToolkitArticleBody({ content }: ToolkitArticleBodyProps) {
  const {
    breadcrumb,
    h1,
    heroSubtitle,
    quickAnswer,
    authorName,
    authorRole,
    dateDisplay,
    readingTime,
    stats,
    toc,
    intro,
    toolsSection,
    myths,
    quickStart,
    whatThisMeans,
    faqs,
    cta,
  } = content;

  return (
    <ResourceArticleShell
      title={h1}
      breadcrumb={breadcrumb}
      subtitle={heroSubtitle}
      quickAnswer={quickAnswer}
      authorName={authorName}
      authorRole={authorRole}
      date={dateDisplay}
      readingTime={readingTime}
      stats={stats}
      faqs={faqs}
      ctaHeading={cta.heading}
      ctaSubtitle={cta.subtitle}
      ctaPrimaryHref={cta.primaryHref}
      ctaPrimaryLabel={cta.primaryLabel}
      ctaSecondaryHref={cta.secondaryHref}
      ctaSecondaryLabel={cta.secondaryLabel}
    >
      {/* Table of contents */}
      <nav
        style={{
          background: "rgba(144,66,44,0.07)",
          border: "1.5px solid rgba(144,66,44,0.25)",
          borderRadius: 12,
          padding: "24px 28px",
          marginBottom: 56,
        }}
      >
        <p
          style={{
            fontFamily: "'Neue Montreal', sans-serif",
            fontSize: 11,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#90422C",
            fontWeight: 700,
            marginBottom: 16,
          }}
        >
          In this article
        </p>
        <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
          {toc.map((item, i) => (
            <li key={item.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span
                style={{
                  color: "#EA9A61",
                  fontFamily: "'Neue Montreal', sans-serif",
                  fontSize: 12,
                  fontWeight: 700,
                  minWidth: 20,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <a
                href={`#${item.id}`}
                style={{
                  color: "#3B2114",
                  textDecoration: "none",
                  fontSize: 15,
                  borderBottom: "1px solid rgba(59,33,20,0.15)",
                  lineHeight: 1.4,
                }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* ── INTRO / PROBLEM FRAMING ── */}
      <section id={toc[0]?.id ?? "intro"} style={{ marginBottom: 64 }}>
        <h2 style={h2Style}>{intro.heading}</h2>
        {intro.paragraphs.map((p, i) => (
          <p key={i} style={bodyPStyle}>
            {p}
          </p>
        ))}
        {intro.calloutText && (
          <div style={calloutBoxStyle}>
            {intro.calloutLabel && <p style={calloutLabelStyle}>{intro.calloutLabel}</p>}
            <p style={{ fontSize: 16, lineHeight: 1.7, margin: 0 }}>{intro.calloutText}</p>
          </div>
        )}
      </section>

      {/* ── TOOL TABLE ── */}
      <section id={toc[1]?.id ?? "tools"} style={{ marginBottom: 64 }}>
        <h2 style={h2Style}>{toolsSection.heading}</h2>
        <p style={{ ...bodyPStyle, marginBottom: 28 }}>{toolsSection.intro}</p>

        <div style={{ display: "grid", gap: 20 }}>
          {toolsSection.tools.map((tool) => (
            <div
              key={tool.name}
              style={{
                border: "1px solid rgba(59,33,20,0.12)",
                borderRadius: 12,
                padding: "24px 28px",
                background: "rgba(59,33,20,0.02)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  gap: 16,
                  flexWrap: "wrap",
                  marginBottom: 10,
                }}
              >
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "Norwige, sans-serif",
                    fontSize: 22,
                    color: "#3B2114",
                    textDecoration: "none",
                    borderBottom: "1px solid rgba(59,33,20,0.25)",
                  }}
                >
                  {tool.name}
                </a>
                <span
                  style={{
                    fontFamily: "'Neue Montreal', sans-serif",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "#B16937",
                    background: "rgba(234,154,97,0.15)",
                    padding: "4px 10px",
                    borderRadius: 100,
                  }}
                >
                  {tool.category}
                </span>
              </div>

              {tool.oneLiner && (
                <p style={{ fontSize: 16, lineHeight: 1.6, color: "#3B2114", marginBottom: 10 }}>{tool.oneLiner}</p>
              )}

              {tool.whenToUse && (
                <p style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(59,33,20,0.65)", margin: 0 }}>
                  <span style={{ fontWeight: 700, color: "#90422C" }}>When to use it: </span>
                  {tool.whenToUse}
                </p>
              )}

              {tool.pairsWith && tool.pairsWith.length > 0 && (
                <p style={{ fontSize: 13, color: "rgba(59,33,20,0.5)", marginTop: 10, marginBottom: 0 }}>
                  Pairs with: {tool.pairsWith.join(", ")}
                </p>
              )}
            </div>
          ))}
        </div>
        {toolsSection.image && <ArticleImage image={toolsSection.image} />}
      </section>

      {/* ── MYTHS, CORRECTED ── */}
      <section id={toc[2]?.id ?? "myths"} style={{ marginBottom: 64 }}>
        <h2 style={h2Style}>{myths.heading}</h2>
        <p style={{ fontSize: 15, color: "#B16937", marginBottom: 36, fontFamily: "'Neue Montreal', sans-serif" }}>
          {myths.intro}
        </p>

        {myths.items.map((item, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "48px 1fr",
              gap: 20,
              marginBottom: 36,
              paddingBottom: 36,
              borderBottom: i === myths.items.length - 1 ? "none" : "1px solid rgba(59,33,20,0.1)",
            }}
          >
            <div
              style={{
                fontFamily: "'Neue Montreal', sans-serif",
                fontSize: 13,
                fontWeight: 700,
                color: "#EA9A61",
                paddingTop: 4,
                letterSpacing: "0.05em",
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </div>
            <div>
              <h3
                style={{
                  fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#B16937",
                  marginBottom: 12,
                  textDecoration: "line-through",
                  textDecorationColor: "rgba(177,105,55,0.4)",
                }}
              >
                {item.myth}
              </h3>
              <p style={{ fontSize: 16, lineHeight: 1.75, color: "#3B2114", margin: 0 }}>{item.reality}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ── QUICK START ── */}
      <section id={toc[3]?.id ?? "quick-start"} style={{ marginBottom: 64 }}>
        <h2 style={h2Style}>{quickStart.heading}</h2>
        <p style={{ ...bodyPStyle, marginBottom: 32 }}>{quickStart.intro}</p>

        <div style={{ display: "grid", gap: 24 }}>
          {quickStart.steps.map((step) => (
            <div
              key={step.number}
              style={{
                display: "grid",
                gridTemplateColumns: "48px 1fr",
                gap: 20,
              }}
            >
              <div
                style={{
                  fontFamily: "Norwige, sans-serif",
                  fontSize: 28,
                  color: "#EA9A61",
                  lineHeight: 1,
                }}
              >
                {String(step.number).padStart(2, "0")}
              </div>
              <div>
                <h3
                  style={{
                    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#3B2114",
                    marginBottom: 8,
                  }}
                >
                  {step.title}
                </h3>
                <p style={{ fontSize: 16, lineHeight: 1.75, color: "#3B2114", margin: 0, marginBottom: step.tip ? 12 : 0 }}>
                  {step.body}
                </p>
                {step.tip && (
                  <p
                    style={{
                      fontSize: 14,
                      lineHeight: 1.6,
                      color: "#90422C",
                      background: "rgba(234,154,97,0.1)",
                      borderRadius: 8,
                      padding: "10px 14px",
                      margin: 0,
                    }}
                  >
                    <span style={{ fontWeight: 700 }}>Tip: </span>
                    {step.tip}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        {quickStart.image && <ArticleImage image={quickStart.image} />}
      </section>

      {/* ── WHAT THIS MEANS ── */}
      <section id={toc[4]?.id ?? "what-this-means"} style={{ marginBottom: 32 }}>
        <h2 style={h2Style}>{whatThisMeans.heading}</h2>
        {whatThisMeans.paragraphs.map((p, i) => (
          <p key={i} style={bodyPStyle}>
            {p}
          </p>
        ))}
        {whatThisMeans.calloutText && (
          <div style={calloutBoxStyle}>
            {whatThisMeans.calloutLabel && <p style={calloutLabelStyle}>{whatThisMeans.calloutLabel}</p>}
            <p style={{ fontSize: 16, lineHeight: 1.7, margin: 0 }}>{whatThisMeans.calloutText}</p>
          </div>
        )}
      </section>

      {/* ── RELATED READING ── */}
      <section
        style={{
          marginBottom: 8,
          padding: "32px 0 0",
          borderTop: "1px solid rgba(59,33,20,0.12)",
        }}
      >
        <p
          style={{
            fontFamily: "'Neue Montreal', sans-serif",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#B16937",
            marginBottom: 20,
          }}
        >
          Related reading
        </p>
        <div style={{ display: "grid", gap: 16 }}>
          {[
            {
              href: "/web/how-much-does-a-website-cost-in-atlanta",
              label: "How much does a website cost in Atlanta?",
              desc: "Real 2026 pricing, what drives it, and what a cheap site really costs you.",
            },
            { href: "/web", label: "ROV Studios web design services", desc: "Our process, timeline, and what you get when we build your site." },
            { href: "/ctrla", label: "CTRL-A by ROV Studios", desc: "Our editorial arm covering design systems, tools, and the Atlanta creative scene." },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gap: 16,
                alignItems: "start",
                textDecoration: "none",
                padding: "16px 0",
                borderBottom: "1px solid rgba(59,33,20,0.07)",
              }}
            >
              <span style={{ color: "#EA9A61", fontSize: 16, marginTop: 2 }}>&rarr;</span>
              <span>
                <span style={{ display: "block", color: "#90422C", fontWeight: 600, fontSize: 15, marginBottom: 4 }}>
                  {link.label}
                </span>
                <span style={{ color: "rgba(59,33,20,0.6)", fontSize: 14, lineHeight: 1.5 }}>{link.desc}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </ResourceArticleShell>
  );
}
