"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { IndustryBodyAside } from "@/lib/types";
import { BLACK } from "./shared";
import GradientBlob from "@/components/effects/GradientBlob";
import { BodyMedia } from "./BodyMedia";

/**
 * Editorial body — the rendered markdown, presented as a tight, collapsed
 * accordion (one item per chapter) so the long-form story reads as an
 * intentional premium module rather than a wall of prose. Each chapter H2 is
 * the trigger (left-aligned cream Norwige with a numbered ember eyebrow and a
 * chevron); the chapter prose plus its companion aside is the panel.
 *
 * GEO/AEO: every sentence of prose stays in the server-rendered DOM at all
 * times. Panels are NEVER conditionally rendered or lazy-mounted — they collapse
 * purely via a CSS grid-template-rows transition (0fr → 1fr) with overflow
 * hidden, exactly like the shared FAQ accordion. Pure CSS collapse means no
 * client-measured styles, so there is no hydration mismatch, and a crawler or
 * answer engine still receives 100% of the copy even when a panel is closed.
 * Companions are aria-hidden supplementary emphasis.
 */

/** Punctuation- and entity-insensitive key for matching an H2 to a companion. */
function normKey(s: string): string {
  return s
    .replace(/<[^>]*>/g, "")
    .replace(/&[#a-z0-9]+;/gi, "")
    .replace(/[^a-z0-9]/gi, "")
    .toLowerCase();
}

type Section = { headingHtml: string | null; bodyHtml: string };

/** Split rendered markdown into H2-led sections, preserving reading order. */
function splitSections(html: string): Section[] {
  const chunks = html.split(/(?=<h2>)/g).filter((c) => c.trim() !== "");
  return chunks.map((chunk) => {
    const m = chunk.match(/^<h2>([\s\S]*?)<\/h2>([\s\S]*)$/);
    if (!m) return { headingHtml: null, bodyHtml: chunk };
    return { headingHtml: m[1], bodyHtml: m[2] };
  });
}

/** Render the chapter companion for its declared type. Always aria-hidden. */
function Companion({ aside }: { aside: IndustryBodyAside }) {
  const kicker = aside.kicker ? (
    <span className="icp-cmp-kicker">{aside.kicker}</span>
  ) : null;

  if (aside.type === "media" && aside.src) {
    return (
      <aside className="icp-aside icp-cmp" aria-hidden>
        {kicker}
        <BodyMedia
          src={aside.src}
          mediaKind={aside.mediaKind === "video" ? "video" : "image"}
          label={aside.label}
        />
      </aside>
    );
  }

  if (aside.type === "number" && aside.value) {
    return (
      <aside className="icp-aside icp-cmp icp-cmp-number" aria-hidden>
        {kicker}
        <span className="icp-cmp-value">{aside.value}</span>
        {aside.caption && <span className="icp-cmp-caption">{aside.caption}</span>}
      </aside>
    );
  }

  if (aside.type === "keywords" && aside.items && aside.items.length > 0) {
    return (
      <aside className="icp-aside icp-cmp icp-cmp-keywords" aria-hidden>
        {kicker}
        <ul>
          {aside.items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      </aside>
    );
  }

  // default: pull card
  if (aside.text) {
    return (
      <aside className="icp-aside icp-cmp icp-cmp-pull" aria-hidden>
        {kicker}
        <p className="icp-cmp-pull-text">{aside.text}</p>
      </aside>
    );
  }
  return null;
}

export function IndustryBody({
  htmlContent,
  asides,
}: {
  htmlContent: string;
  asides?: IndustryBodyAside[];
}) {
  const sections = splitSections(htmlContent);
  const asideList = asides ?? [];

  // Leading prose that precedes the first H2 (if any) stays always-visible as an
  // intro lede; every H2-led chapter becomes one accordion item.
  const firstHeadingIndex = sections.findIndex((s) => s.headingHtml !== null);
  const intro =
    firstHeadingIndex > 0
      ? sections.slice(0, firstHeadingIndex)
      : firstHeadingIndex === -1
      ? sections
      : [];
  const chapters = sections.filter((s) => s.headingHtml !== null);

  // First chapter opens by default so the module is never fully closed on load.
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!htmlContent || (intro.length === 0 && chapters.length === 0)) return null;

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        background: BLACK,
        padding: "clamp(52px, 7vw, 88px) clamp(20px, 6%, 6%) clamp(48px, 7vw, 80px)",
      }}
    >
      {/* Faint depth behind the module; the second blob bleeds toward the proof
          section below so the body hands off rather than stopping. */}
      <GradientBlob position="top-right" opacity={0.1} size="560px" blur="200px" />
      <GradientBlob position="bottom-right" opacity={0.16} size="680px" blur="200px" />

      <div
        className="icp-body-wrap"
        style={{ position: "relative", zIndex: 1, maxWidth: 940, margin: "0 auto" }}
      >
        {/* Left-aligned section header — reads as an intentional premium module. */}
        <div className="icp-body-head">
          <p className="icp-body-eyebrow">The full story</p>
          <h2 className="icp-body-title">The full picture, chapter by chapter</h2>
        </div>

        {intro.length > 0 && (
          <div className="icp-body-intro">
            {intro.map((s, i) => (
              <div
                key={`intro-${i}`}
                className="icp-body"
                dangerouslySetInnerHTML={{ __html: s.bodyHtml }}
              />
            ))}
          </div>
        )}

        <div className="icp-acc">
          {chapters.map((section, i) => {
            const num = String(i + 1).padStart(2, "0");
            const isOpen = openIndex === i;
            const aside = asideList.find(
              (a) => normKey(a.afterH2) === normKey(section.headingHtml as string)
            );
            const panelId = `icp-acc-panel-${i}`;
            const btnId = `icp-acc-btn-${i}`;

            return (
              <div className="icp-acc-item" key={i}>
                <h2 className="icp-acc-heading">
                  <button
                    id={btnId}
                    type="button"
                    className="icp-acc-trigger"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                  >
                    <span className="icp-acc-num" aria-hidden>
                      {num}
                    </span>
                    <span
                      className="icp-acc-title"
                      dangerouslySetInnerHTML={{ __html: section.headingHtml as string }}
                    />
                    <ChevronDown
                      className="icp-acc-chev"
                      aria-hidden
                      style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                    />
                  </button>
                </h2>
                {/* Panel prose is ALWAYS in the DOM (GEO/AEO); collapse is purely
                    a CSS grid-template-rows transition, never a conditional mount. */}
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  className="icp-acc-panel"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="icp-acc-panel-clip">
                    <div className="icp-acc-panel-inner">
                      <div
                        className="icp-body"
                        dangerouslySetInnerHTML={{ __html: section.bodyHtml }}
                      />
                      {aside && <Companion aside={aside} />}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        /* ── Section header ─────────────────────────────────────────────── */
        .icp-body-head { text-align: start; margin-bottom: clamp(28px, 4vw, 44px); }
        .icp-body-eyebrow {
          font-family: 'Roboto', sans-serif;
          font-weight: 500;
          font-size: 12px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #E8914A;
          margin: 0 0 14px;
        }
        .icp-body-title {
          font-family: Norwige, sans-serif;
          font-weight: 700;
          font-size: clamp(1.7rem, 3.4vw, 2.4rem);
          line-height: 1.14;
          letter-spacing: -0.01em;
          color: #FFF4E3;
          margin: 0;
        }

        /* Always-visible intro lede (prose before the first H2, if any). */
        .icp-body-intro { margin-bottom: clamp(24px, 4vw, 40px); max-width: 74ch; }

        /* ── Accordion ──────────────────────────────────────────────────── */
        .icp-acc { border-top: 1px solid rgba(234,154,97,0.16); }
        .icp-acc-item { border-bottom: 1px solid rgba(234,154,97,0.16); }
        .icp-acc-heading { margin: 0; }
        .icp-acc-trigger {
          display: flex;
          align-items: center;
          gap: clamp(14px, 2.4vw, 22px);
          width: 100%;
          padding: clamp(20px, 2.6vw, 26px) 2px;
          background: none;
          border: none;
          cursor: pointer;
          text-align: start;
          color: inherit;
        }
        .icp-acc-num {
          flex-shrink: 0;
          font-family: 'Roboto', sans-serif;
          font-weight: 500;
          font-size: 12px;
          letter-spacing: 0.16em;
          color: #EA9A61;
        }
        .icp-acc-title {
          flex: 1;
          min-width: 0;
          font-family: Norwige, sans-serif;
          font-weight: 700;
          font-size: clamp(1.15rem, 2.3vw, 1.55rem);
          line-height: 1.24;
          letter-spacing: -0.01em;
          color: #FFF4E3;
          transition: color 0.15s ease;
        }
        .icp-acc-chev {
          flex-shrink: 0;
          width: 22px;
          height: 22px;
          color: #E8914A;
          transition: transform 0.25s ease;
        }
        @media (hover: hover) {
          .icp-acc-trigger:hover .icp-acc-title { color: #FFC79A; }
        }
        .icp-acc-trigger:focus-visible {
          outline: 2px solid #EA9A61;
          outline-offset: 3px;
          border-radius: 4px;
        }

        /* Collapse purely via grid rows; prose is always mounted. */
        .icp-acc-panel {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.32s ease-out;
        }
        .icp-acc-panel-clip { overflow: hidden; min-height: 0; }
        .icp-acc-panel-inner {
          padding: 2px 0 clamp(28px, 3.4vw, 40px);
          max-width: 74ch;
        }

        /* ── Body prose. A base colour is set so no element type can ever fall
              back to the browser default (black) on the black section. ─────── */
        .icp-body { color: rgba(255,255,255,0.65); }
        .icp-body h3 {
          font-family: Norwige, sans-serif;
          font-weight: 700;
          font-size: clamp(1.15rem, 2.4vw, 1.4rem);
          line-height: 1.3;
          color: #FFF4E3;
          margin: 1.9rem 0 0.7rem;
        }
        .icp-body h4 {
          font-family: Norwige, sans-serif;
          font-weight: 700;
          font-size: 1.05rem;
          color: #FFF4E3;
          margin: 1.5rem 0 0.6rem;
        }
        .icp-body p {
          font-family: 'Roboto', sans-serif;
          font-weight: 300;
          font-size: 1.0625rem;
          line-height: 1.8;
          color: rgba(255,255,255,0.65);
          margin: 0 0 1.3rem;
        }
        /* Lede — first paragraph of each chapter reads a notch larger/brighter */
        .icp-body > p:first-child {
          font-size: 1.15rem;
          line-height: 1.7;
          color: rgba(255,255,255,0.85);
        }
        .icp-body p:last-child { margin-bottom: 0; }
        .icp-body ul,
        .icp-body ol {
          font-family: 'Roboto', sans-serif;
          font-weight: 300;
          color: rgba(255,255,255,0.65);
          font-size: 1.0625rem;
          line-height: 1.8;
          margin: 0 0 1.3rem;
          padding-left: 1.4rem;
        }
        .icp-body ul { list-style-type: disc; }
        .icp-body ol { list-style-type: decimal; }
        .icp-body li { margin-bottom: 0.5rem; }
        .icp-body li::marker { color: #EA9A61; }
        .icp-body strong, .icp-body b { color: #FFF4E3; font-weight: 500; }
        .icp-body em, .icp-body i { color: rgba(255,255,255,0.82); }
        .icp-body code {
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 0.92em;
          color: #FFC79A;
          background: rgba(234,154,97,0.10);
          padding: 0.1em 0.38em;
          border-radius: 5px;
        }
        .icp-body a {
          color: #EA9A61;
          text-decoration: underline;
          text-underline-offset: 3px;
          font-weight: 400;
          transition: color 0.15s;
        }
        .icp-body a:hover { color: #FFC79A; }
        .icp-body blockquote {
          border-left: 3px solid #EA9A61;
          padding: 0.2rem 0 0.2rem 1.25rem;
          margin: 1.75rem 0;
        }
        .icp-body blockquote p {
          font-family: Norwige, sans-serif;
          font-size: 1.25rem;
          line-height: 1.4;
          color: #FFF4E3;
          margin: 0;
        }
        .icp-body hr {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.12);
          margin: 2.25rem 0;
        }

        /* ── Chapter companions (shared) ─────────────────────────────────── */
        .icp-cmp { margin-top: clamp(18px, 2.4vw, 28px); }
        .icp-cmp-kicker {
          display: block;
          font-family: 'Roboto', sans-serif;
          font-weight: 500;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #EA9A61;
          margin-bottom: 14px;
        }

        /* Pull card */
        .icp-cmp-pull {
          padding: 22px 24px;
          border-left: 2px solid #EA9A61;
          background: linear-gradient(180deg, rgba(234,154,97,0.06), rgba(234,154,97,0.015));
          border-radius: 0 10px 10px 0;
        }
        .icp-cmp-pull .icp-cmp-kicker { margin-bottom: 12px; }
        .icp-cmp-pull-text {
          margin: 0;
          font-family: Norwige, sans-serif;
          font-size: clamp(1.15rem, 1.8vw, 1.4rem);
          line-height: 1.34;
          letter-spacing: -0.005em;
          color: #FFF4E3;
        }

        /* Key-number block */
        .icp-cmp-number {
          padding: 24px 26px;
          border: 1px solid rgba(234,154,97,0.2);
          border-radius: 16px;
          background: linear-gradient(160deg, rgba(234,154,97,0.08), rgba(234,154,97,0.02));
        }
        .icp-cmp-value {
          display: block;
          font-family: Norwige, sans-serif;
          font-style: italic;
          font-weight: 700;
          font-size: clamp(3.2rem, 6vw, 4.6rem);
          line-height: 0.95;
          color: #FFF4E3;
          letter-spacing: -0.02em;
          margin-bottom: 14px;
        }
        .icp-cmp-caption {
          display: block;
          font-family: 'Roboto', sans-serif;
          font-weight: 300;
          font-size: 15px;
          line-height: 1.55;
          color: rgba(255,255,255,0.7);
        }

        /* Keyword spec-stack */
        .icp-cmp-keywords ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .icp-cmp-keywords li {
          font-family: Norwige, sans-serif;
          font-weight: 700;
          font-size: clamp(1.05rem, 1.6vw, 1.25rem);
          line-height: 1.2;
          color: #FFF4E3;
          padding: 14px 0;
          border-top: 1px solid rgba(234,154,97,0.22);
        }
        .icp-cmp-keywords li:first-child { border-top: none; padding-top: 0; }
        .icp-cmp-keywords li:last-child { padding-bottom: 0; }

        /* Inline media card */
        .icp-cmp-media { margin: clamp(18px, 2.4vw, 28px) 0 0; max-width: 520px; }
        .icp-cmp-media-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(234,154,97,0.2);
          background: var(--gradient-ember);
          box-shadow: 0 26px 60px rgba(0,0,0,0.5);
        }
        .icp-cmp-media-frame video,
        .icp-cmp-media-frame img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .icp-cmp-media-cap {
          display: block;
          margin-top: 12px;
          font-family: 'Roboto', sans-serif;
          font-weight: 400;
          font-size: 13px;
          line-height: 1.5;
          color: rgba(255,255,255,0.6);
        }

        @media (max-width: 767px) {
          .icp-cmp-media-frame { aspect-ratio: 16 / 10; }
        }

        @media (prefers-reduced-motion: reduce) {
          .icp-acc-panel { transition: none; }
          .icp-acc-chev { transition: none; }
          .icp-cmp-media-frame video { display: block; }
        }
      `,
        }}
      />
    </section>
  );
}
