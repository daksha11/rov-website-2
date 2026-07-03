"use client";

import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { BlogFAQ } from "@/components/blog/BlogFAQ";

const NavigationDock = dynamic(
  () => import("@/components/NavDoc").then((mod) => ({ default: mod.NavigationDock })),
  { ssr: false }
);
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });

interface Stat {
  value: string;
  label: string;
}

interface Faq {
  question: string;
  answer: string;
}

export interface ResourceArticleShellProps {
  title: string;
  breadcrumb: string;
  subtitle?: string;
  /** Direct one-to-two sentence answer, shown as a callout in the hero before the reader scrolls — written for AI answer engines to lift verbatim. */
  quickAnswer?: string;
  authorName: string;
  authorRole: string;
  date: string;
  readingTime: string;
  stats?: Stat[];
  children: ReactNode;
  faqs?: Faq[];
  ctaHeading: string;
  ctaSubtitle: string;
  ctaPrimaryHref: string;
  ctaPrimaryLabel: string;
  ctaSecondaryHref?: string;
  ctaSecondaryLabel?: string;
}

export function ResourceArticleShell({
  title,
  breadcrumb,
  subtitle,
  quickAnswer,
  authorName,
  authorRole,
  date,
  readingTime,
  stats,
  children,
  faqs,
  ctaHeading,
  ctaSubtitle,
  ctaPrimaryHref,
  ctaPrimaryLabel,
  ctaSecondaryHref,
  ctaSecondaryLabel,
}: ResourceArticleShellProps) {
  const isExternalPrimary = ctaPrimaryHref.startsWith("http");

  return (
    <main
      style={{
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        background: "#FFF4E3",
        color: "#3B2114",
      }}
    >
      {/* ── HERO ── */}
      <section
        style={{
          background: "linear-gradient(160deg, #3B2114 0%, #603E25 55%, #90422C 100%)",
          padding: "80px 24px 64px",
          color: "#FFF4E3",
        }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          {/* Logo */}
          <div style={{ marginBottom: 32 }}>
            <Link href="/">
              <Image
                src="/brand/rov-logo.webp"
                alt="ROV Studios"
                width={48}
                height={48}
                style={{ objectFit: "contain" }}
              />
            </Link>
          </div>

          {/* Breadcrumb */}
          <p
            style={{
              fontSize: 13,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "rgba(255,244,227,0.55)",
              marginBottom: 28,
              fontFamily: "'Neue Montreal', sans-serif",
            }}
          >
            {breadcrumb}
          </p>

          {/* Headline */}
          <h1
            style={{
              fontFamily: "Norwige, sans-serif",
              fontSize: "clamp(36px, 6vw, 64px)",
              fontWeight: 400,
              lineHeight: 1.1,
              marginBottom: 24,
              color: "#FFFFFF",
            }}
          >
            {title}
          </h1>

          {subtitle && (
            <p
              style={{
                fontSize: 18,
                lineHeight: 1.65,
                color: "rgba(255,244,227,0.82)",
                marginBottom: 36,
                maxWidth: 600,
              }}
            >
              {subtitle}
            </p>
          )}

          {quickAnswer && (
            <div
              style={{
                background: "rgba(255,244,227,0.08)",
                border: "1px solid rgba(255,244,227,0.2)",
                borderRadius: 12,
                padding: "18px 22px",
                marginBottom: 32,
                maxWidth: 620,
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#EA9A61",
                  marginBottom: 8,
                  fontFamily: "'Neue Montreal', sans-serif",
                }}
              >
                Quick answer
              </p>
              <p style={{ fontSize: 16, lineHeight: 1.6, color: "#FFF4E3", margin: 0 }}>
                {quickAnswer}
              </p>
            </div>
          )}

          {/* Author + meta */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div
              style={{
                background: "#FFF4E3",
                border: "1px solid rgba(59,33,20,0.15)",
                borderRadius: 100,
                padding: "5px 14px",
                fontSize: 13,
                color: "#3B2114",
                fontFamily: "'Neue Montreal', sans-serif",
              }}
            >
              {authorName} &middot; {authorRole}
            </div>
            <div style={{ color: "rgba(255,244,227,0.45)", fontSize: 13 }}>
              {date} &middot; {readingTime}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ROW ── */}
      {stats && stats.length > 0 && (
        <section style={{ background: "#3B2114", padding: "0 24px" }}>
          <div
            style={{
              maxWidth: 760,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 1,
              borderTop: "1px solid rgba(255,244,227,0.08)",
            }}
          >
            {stats.map((s) => (
              <div key={s.label} style={{ padding: "28px 20px", textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: "Norwige, sans-serif",
                    fontSize: "clamp(28px, 4.5vw, 44px)",
                    background: "linear-gradient(135deg, #EA9A61 0%, #90422C 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    lineHeight: 1,
                    marginBottom: 8,
                  }}
                >
                  {s.value}
                </div>
                <div style={{ color: "#FFF4E3", fontSize: 14, fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── MAIN CONTENT (slotted) ── */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 80px" }}>{children}</div>

      {/* ── FAQ ── */}
      {faqs && faqs.length > 0 && <BlogFAQ faqs={faqs} />}

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px 80px" }}>
        {/* ── AUTHOR ── */}
        <section
          style={{
            marginBottom: 64,
            padding: "28px 32px",
            background: "#3B2114",
            borderRadius: 16,
            color: "#FFF4E3",
          }}
        >
          <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 2, color: "#FFF4E3" }}>
            {authorName}
          </p>
          <p
            style={{
              color: "#EA9A61",
              fontSize: 13,
              margin: 0,
              fontFamily: "'Neue Montreal', sans-serif",
            }}
          >
            {authorRole}, <Link href="/about" style={{ color: "#EA9A61" }}>ROV Studios</Link>
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginTop: 16,
              paddingTop: 16,
              borderTop: "1px solid rgba(255,244,227,0.1)",
            }}
          >
            <span style={{ display: "inline-block", width: 24, height: 2, background: "#EA9A61", flexShrink: 0 }} />
            <p style={{ fontSize: 12, color: "#FFF4E3", margin: 0, fontFamily: "'Neue Montreal', sans-serif" }}>
              Last updated &nbsp; {date}
            </p>
          </div>
        </section>

        {/* ── CTA ── */}
        <section
          style={{
            background: "#FFF4E3",
            border: "1.5px solid rgba(59,33,20,0.15)",
            borderRadius: 16,
            padding: "48px 36px",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontFamily: "Norwige, sans-serif",
              fontSize: "clamp(24px, 4vw, 36px)",
              fontWeight: 400,
              marginBottom: 16,
              lineHeight: 1.2,
              color: "#3B2114",
            }}
          >
            {ctaHeading}
          </h2>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.65,
              color: "rgba(59,33,20,0.7)",
              marginBottom: 32,
              maxWidth: 480,
              margin: "0 auto 32px",
            }}
          >
            {ctaSubtitle}
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            {isExternalPrimary ? (
              <a
                href={ctaPrimaryHref}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "#90422C",
                  color: "#FFF4E3",
                  padding: "14px 28px",
                  borderRadius: 100,
                  fontFamily: "'Neue Montreal', sans-serif",
                  fontWeight: 700,
                  fontSize: 15,
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                {ctaPrimaryLabel}
              </a>
            ) : (
              <Link
                href={ctaPrimaryHref}
                style={{
                  background: "#90422C",
                  color: "#FFF4E3",
                  padding: "14px 28px",
                  borderRadius: 100,
                  fontFamily: "'Neue Montreal', sans-serif",
                  fontWeight: 700,
                  fontSize: 15,
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                {ctaPrimaryLabel}
              </Link>
            )}
            {ctaSecondaryHref && ctaSecondaryLabel && (
              <Link
                href={ctaSecondaryHref}
                style={{
                  background: "transparent",
                  color: "#3B2114",
                  padding: "14px 28px",
                  borderRadius: 100,
                  fontFamily: "'Neue Montreal', sans-serif",
                  fontWeight: 600,
                  fontSize: 15,
                  textDecoration: "none",
                  display: "inline-block",
                  border: "1.5px solid rgba(59,33,20,0.25)",
                }}
              >
                {ctaSecondaryLabel}
              </Link>
            )}
          </div>
        </section>
      </div>

      <NavigationDock />
      <Footer />
    </main>
  );
}
