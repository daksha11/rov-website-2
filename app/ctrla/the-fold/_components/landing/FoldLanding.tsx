"use client";

// ═══════════════════════════════════════════════════════
// THE FOLD — landing
// The editorial intro, before any commitment. Left-aligned and
// quiet, not a centered hero grid. The only action is a text
// CTA that begins the ritual. No audio, no presence here.
// ═══════════════════════════════════════════════════════

import { ed, Bleed, Rule, Kicker } from "../../../_components/editorial";
import { FOLD_COPY } from "../../_content/copy";

export default function FoldLanding({ onEnter }: { onEnter: () => void }) {
  return (
    <section
      style={{ position: "relative", zIndex: 2, padding: "clamp(40px,8vw,104px) 0 clamp(64px,9vw,128px)" }}
    >
      <Bleed>
        <div className="fold-fade-up" style={{ maxWidth: 920 }}>
          <Kicker color={ed.gold} style={{ marginBottom: "clamp(20px,3vw,32px)" }}>
            A room, not a tool
          </Kicker>

          {/* Wordmark */}
          <h1
            style={{
              fontFamily: ed.serif,
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(56px,13vw,168px)",
              lineHeight: 0.86,
              letterSpacing: "-0.01em",
              color: ed.paper,
              margin: "0 0 clamp(20px,3vw,30px)",
            }}
          >
            {FOLD_COPY.wordmark}
          </h1>

          <p
            style={{
              fontFamily: ed.grotesque,
              fontWeight: 500,
              fontSize: "clamp(17px,2.4vw,28px)",
              lineHeight: 1.32,
              letterSpacing: "-0.01em",
              color: ed.paper,
              margin: "0 0 clamp(28px,4vw,44px)",
              maxWidth: 720,
            }}
          >
            {FOLD_COPY.tagline}
          </p>

          {/* Manifesto */}
          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(14px,2vw,20px)", maxWidth: 600 }}>
            {FOLD_COPY.manifesto.map((para, i) => (
              <p
                key={i}
                style={{
                  fontFamily: ed.body,
                  fontSize: "clamp(15px,1.8vw,19px)",
                  lineHeight: 1.6,
                  color: ed.inkSoft,
                  margin: 0,
                }}
              >
                {para}
              </p>
            ))}
          </div>

          {/* CTA — text + hairline, no gradient fill */}
          <button
            type="button"
            onClick={onEnter}
            className="fold-enter-cta"
            style={{
              marginTop: "clamp(36px,5vw,56px)",
              background: "transparent",
              border: "none",
              padding: 0,
              cursor: "pointer",
              display: "inline-flex",
              flexDirection: "column",
              gap: 10,
              textAlign: "left",
            }}
          >
            <span
              style={{
                fontFamily: ed.grotesque,
                fontWeight: 700,
                fontSize: "clamp(20px,2.6vw,30px)",
                letterSpacing: "-0.01em",
                color: ed.paper,
                display: "inline-flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              {FOLD_COPY.enterCta}
              <span aria-hidden className="fold-enter-arrow" style={{ color: ed.gold, transition: "transform .3s ease" }}>
                →
              </span>
            </span>
            <span className="fold-enter-line" style={{ height: 1, background: ed.gold, width: "100%", maxWidth: 280 }} />
          </button>
        </div>

        {/* Pillars */}
        <div style={{ marginTop: "clamp(56px,8vw,96px)", maxWidth: 920 }}>
          <Rule color={ed.hair} style={{ marginBottom: "clamp(24px,3vw,32px)" }} />
          <div className="fold-pillars">
            {FOLD_COPY.pillars.map((p) => (
              <div key={p.label} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <span
                  style={{
                    fontFamily: ed.mono,
                    fontSize: "clamp(10px,1.1vw,12px)",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: ed.gold,
                  }}
                >
                  {p.label}
                </span>
                <span
                  style={{
                    fontFamily: ed.body,
                    fontSize: "clamp(14px,1.6vw,17px)",
                    lineHeight: 1.5,
                    color: ed.inkSoft,
                  }}
                >
                  {p.body}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Bleed>
    </section>
  );
}
