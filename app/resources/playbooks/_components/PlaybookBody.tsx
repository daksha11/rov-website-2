"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { BlogFAQ } from "@/components/blog/BlogFAQ";
import type { PlaybookContent } from "../_content/types";
import { MoneyFlowCalculator } from "./MoneyFlowCalculator";
import { EcosystemDiagram } from "./EcosystemDiagram";
import { PainQuotes } from "./PainQuotes";
import { VocabTable } from "./VocabTable";
import { CompetitionAccordion } from "./CompetitionAccordion";

const NavigationDock = dynamic(
  () => import("@/components/sections/NavDoc").then((mod) => ({ default: mod.NavigationDock })),
  { ssr: false }
);
const Footer = dynamic(() => import("@/components/sections/Footer"), { ssr: false });

const CREAM = "#FFF4E3";
const ESPRESSO = "#3B2114";
const RUST = "#90422C";
const ORANGE = "#EA9A61";
const LINE = "rgba(59,33,20,0.14)";

export function PlaybookBody({ content }: { content: PlaybookContent }) {
  const [activeTab, setActiveTab] = useState(content.tabs[0]?.id ?? "overview");

  return (
    <main
      style={{
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        background: CREAM,
        color: ESPRESSO,
      }}
    >
      {/* ── HERO ── */}
      <section
        style={{
          background: "linear-gradient(160deg, #3B2114 0%, #603E25 55%, #90422C 100%)",
          padding: "72px 24px 48px",
          color: CREAM,
        }}
      >
        <div style={{ maxWidth: 1060, margin: "0 auto" }}>
          <div style={{ marginBottom: 28 }}>
            <Link href="/">
              <Image
                src="/brand/rov-logo.webp"
                alt="ROV Studios"
                width={44}
                height={44}
                style={{ objectFit: "contain" }}
              />
            </Link>
          </div>

          <p
            style={{
              fontSize: 12,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(255,244,227,0.55)",
              marginBottom: 16,
              fontFamily: "'Neue Montreal', sans-serif",
            }}
          >
            {content.kicker}
          </p>

          <h1
            style={{
              fontFamily: "Norwige, sans-serif",
              fontSize: "clamp(34px, 5.5vw, 58px)",
              fontWeight: 400,
              lineHeight: 1.1,
              marginBottom: 18,
              color: "#FFFFFF",
              maxWidth: 820,
            }}
          >
            {content.h1}
          </h1>

          <p style={{ fontSize: "clamp(15px, 2vw, 19px)", maxWidth: 680, color: "rgba(255,244,227,0.85)", margin: 0 }}>
            {content.heroSubtitle}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 26, marginTop: 32 }}>
            {content.stats.map((s) => (
              <div key={s.label} style={{ minWidth: 130 }}>
                <div style={{ fontFamily: "Norwige, sans-serif", fontSize: 30, color: "#FFFFFF" }}>{s.value}</div>
                <div
                  style={{
                    fontSize: 12.5,
                    color: "rgba(255,244,227,0.68)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    fontFamily: "'Neue Montreal', sans-serif",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TAB NAV ── */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(255,244,227,0.94)",
          backdropFilter: "blur(8px)",
          borderBottom: `1px solid ${LINE}`,
        }}
      >
        <div
          style={{
            maxWidth: 1060,
            margin: "0 auto",
            padding: "0 16px",
            display: "flex",
            gap: 2,
            overflowX: "auto",
          }}
        >
          {content.tabs.map((tab) => {
            const active = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: "0 0 auto",
                  background: "none",
                  border: "none",
                  padding: "15px 15px 12px",
                  fontSize: 14,
                  color: active ? RUST : "rgba(59,33,20,0.6)",
                  cursor: "pointer",
                  borderBottom: `3px solid ${active ? RUST : "transparent"}`,
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  fontFamily: "'Neue Montreal', sans-serif",
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* ── TAB CONTENT ── */}
      <div style={{ maxWidth: 1060, margin: "0 auto", padding: "38px 24px 90px" }}>
        {activeTab === "overview" && <OverviewTab content={content} />}
        {activeTab === "money" && <MoneyTab content={content} />}
        {activeTab === "players" && <PlayersTab content={content} />}
        {activeTab === "pain" && <PainTab content={content} />}
        {activeTab === "vocab" && <VocabTab content={content} />}
        {activeTab === "comp" && <CompTab content={content} />}
      </div>

      {/* ── FAQ ── */}
      {content.faqs.length > 0 && <BlogFAQ faqs={content.faqs} />}

      {/* ── CTA ── */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px 80px" }}>
        <section
          style={{
            background: CREAM,
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
              color: ESPRESSO,
            }}
          >
            {content.cta.heading}
          </h2>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.65,
              color: "rgba(59,33,20,0.7)",
              maxWidth: 480,
              margin: "0 auto 32px",
            }}
          >
            {content.cta.subtitle}
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href={content.cta.primaryHref}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: RUST,
                color: CREAM,
                padding: "14px 28px",
                borderRadius: 100,
                fontFamily: "'Neue Montreal', sans-serif",
                fontWeight: 700,
                fontSize: 15,
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              {content.cta.primaryLabel}
            </a>
            <Link
              href={content.cta.secondaryHref}
              style={{
                background: "transparent",
                color: ESPRESSO,
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
              {content.cta.secondaryLabel}
            </Link>
          </div>
        </section>
      </div>

      <NavigationDock />
      <Footer />
    </main>
  );
}

function SectionHeader({ label, heading, lead }: { label: string; heading: string; lead: string }) {
  return (
    <>
      <p
        style={{
          fontSize: 13,
          textTransform: "uppercase",
          letterSpacing: "0.16em",
          color: ORANGE,
          margin: "0 0 6px",
          fontWeight: 700,
          fontFamily: "'Neue Montreal', sans-serif",
        }}
      >
        {label}
      </p>
      <h2
        style={{
          fontFamily: "Norwige, sans-serif",
          fontSize: "clamp(24px, 3.6vw, 34px)",
          fontWeight: 400,
          margin: "0 0 8px",
          color: ESPRESSO,
        }}
      >
        {heading}
      </h2>
      <p style={{ fontSize: 17, color: "rgba(59,33,20,0.65)", maxWidth: 720, margin: "0 0 28px", lineHeight: 1.6 }}>{lead}</p>
    </>
  );
}

function Callout({ label, text }: { label: string; text: string }) {
  return (
    <div
      style={{
        background: "rgba(234,154,97,0.12)",
        border: "1px solid rgba(234,154,97,0.35)",
        borderRadius: 12,
        padding: "16px 18px",
        margin: "18px 0",
      }}
    >
      <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: ESPRESSO }}>
        <b style={{ color: RUST }}>{label}:</b> {text}
      </p>
    </div>
  );
}

function Panel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        background: "#fff",
        border: `1px solid ${LINE}`,
        borderRadius: 14,
        padding: 24,
        boxShadow: "0 1px 2px rgba(59,33,20,.05), 0 8px 24px rgba(59,33,20,.06)",
        marginBottom: 20,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function OverviewTab({ content }: { content: PlaybookContent }) {
  const { overview } = content;
  return (
    <section>
      <SectionHeader label={overview.sectionLabel} heading={overview.heading} lead={overview.lead} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
        }}
        className="rov-grid-3"
      >
        {overview.cards.map((card) => (
          <Panel key={card.title} style={{ marginBottom: 0 }}>
            <span
              style={{
                display: "inline-block",
                fontSize: 11.5,
                fontWeight: 700,
                padding: "3px 9px",
                borderRadius: 20,
                letterSpacing: "0.03em",
                textTransform: "uppercase",
                background: "rgba(144,66,44,0.12)",
                color: RUST,
              }}
            >
              {card.tag}
            </span>
            <h3 style={{ margin: "10px 0 6px", fontSize: 17, fontFamily: "Inter, sans-serif", fontWeight: 700, color: ESPRESSO }}>
              {card.title}
            </h3>
            <p style={{ margin: 0, color: "rgba(59,33,20,0.65)", fontSize: 14.5, lineHeight: 1.6 }}>{card.body}</p>
          </Panel>
        ))}
      </div>
      <Callout label={overview.calloutLabel} text={overview.calloutText} />
      <style>{`@media (max-width: 760px) { .rov-grid-3 { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}

function MoneyTab({ content }: { content: PlaybookContent }) {
  const { moneyFlow } = content;
  return (
    <section>
      <SectionHeader label={moneyFlow.sectionLabel} heading={moneyFlow.heading} lead={moneyFlow.lead} />
      <MoneyFlowCalculator />
      <Callout label={moneyFlow.calloutLabel} text={moneyFlow.calloutText} />
      <p style={{ fontSize: 11, color: "rgba(59,33,20,0.5)" }}>{moneyFlow.sourceNote}</p>
    </section>
  );
}

function PlayersTab({ content }: { content: PlaybookContent }) {
  const { players } = content;
  return (
    <section>
      <SectionHeader label={players.sectionLabel} heading={players.heading} lead={players.lead} />
      <EcosystemDiagram modes={players.flowModes} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
        }}
        className="rov-grid-3"
      >
        {players.roles.map((role) => (
          <div
            key={role.title}
            style={{
              background: "#fff",
              border: `1px solid ${LINE}`,
              borderRadius: 12,
              padding: "14px 16px",
              boxShadow: "0 1px 2px rgba(59,33,20,.05), 0 8px 24px rgba(59,33,20,.06)",
            }}
          >
            <h3 style={{ margin: "0 0 4px", fontSize: 16, fontFamily: "Inter, sans-serif", fontWeight: 700, color: ESPRESSO }}>
              {role.title}
            </h3>
            <p style={{ margin: 0, fontSize: 13.5, color: "rgba(59,33,20,0.6)", lineHeight: 1.5 }}>{role.description}</p>
            <span
              style={{
                display: "inline-block",
                marginTop: 8,
                fontSize: 12.5,
                fontWeight: 700,
                color: RUST,
                background: "rgba(144,66,44,0.1)",
                padding: "3px 9px",
                borderRadius: 16,
              }}
            >
              {role.moneyNote}
            </span>
          </div>
        ))}
      </div>
      <Callout label={players.calloutLabel} text={players.calloutText} />
      <style>{`@media (max-width: 760px) { .rov-grid-3 { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}

function PainTab({ content }: { content: PlaybookContent }) {
  const { pain } = content;
  return (
    <section>
      <SectionHeader label={pain.sectionLabel} heading={pain.heading} lead={pain.lead} />
      <PainQuotes filters={pain.filters} quotes={pain.quotes} />
    </section>
  );
}

function VocabTab({ content }: { content: PlaybookContent }) {
  const { vocab } = content;
  return (
    <section>
      <SectionHeader label={vocab.sectionLabel} heading={vocab.heading} lead={vocab.lead} />
      <VocabTable pairs={vocab.pairs} />
      <Callout label={vocab.calloutLabel} text={vocab.calloutText} />
    </section>
  );
}

function CompTab({ content }: { content: PlaybookContent }) {
  const { competition } = content;
  return (
    <section>
      <SectionHeader label={competition.sectionLabel} heading={competition.heading} lead={competition.lead} />
      <CompetitionAccordion entries={competition.entries} patternPanel={competition.patternPanel} />
    </section>
  );
}
