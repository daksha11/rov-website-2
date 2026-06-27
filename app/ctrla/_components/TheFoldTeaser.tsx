"use client";

// ═══════════════════════════════════════════════════════
// CTRL-A — THE FOLD TEASER
// Front-page card linking to /ctrla/the-fold. Deliberately
// featherweight: a CSS gradient (no image), editorial tokens
// only, and a plain <a> (no route prefetch) so the magazine
// bundle never pulls in any of The Fold's code.
// ═══════════════════════════════════════════════════════

import { ed, Bleed, Rule, Label, Kicker } from "./editorial";

export function TheFoldTeaser() {
  return (
    <section style={{ background: "transparent", padding: "clamp(48px,7vw,88px) 0" }}>
      <Bleed>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: "clamp(18px,2.4vw,28px)",
          }}
        >
          <Kicker color={ed.gold}>New · Ambient room</Kicker>
          <Label color={ed.gold}>The Fold</Label>
        </div>
        <Rule style={{ marginBottom: "clamp(24px,3vw,36px)" }} />

        <a
          href="/ctrla/the-fold"
          className="ctrla-feature-card"
          style={{
            position: "relative",
            display: "block",
            width: "100%",
            aspectRatio: "16 / 7",
            minHeight: 260,
            overflow: "hidden",
            textDecoration: "none",
            // The Fold's living light, drawn as a gradient (no image weight)
            backgroundColor: ed.void,
            backgroundImage:
              "radial-gradient(150% 56% at 50% 88%, rgba(227,194,74,0.20) 0%, rgba(165,106,103,0.26) 26%, rgba(78,61,115,0.18) 52%, transparent 80%), radial-gradient(130% 50% at 50% -12%, rgba(36,18,58,0.7) 0%, transparent 60%), linear-gradient(180deg, #0F0820 0%, #1B0E2E 60%, #0F0820 100%)",
          }}
        >
          {/* paper grain for bokashi softness */}
          <div className="ctrla-grain" aria-hidden style={{ zIndex: 1 }} />
          {/* bottom scrim for text legibility */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 1,
              background:
                "linear-gradient(to top, rgba(15,8,32,0.86) 0%, rgba(15,8,32,0.34) 46%, transparent 74%)",
            }}
          />

          <span
            style={{
              position: "absolute",
              top: 18,
              left: 20,
              zIndex: 2,
              fontFamily: ed.mono,
              fontSize: "clamp(9px,1vw,11px)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: ed.gold,
            }}
          >
            You belong somewhere
          </span>

          <div
            style={{
              position: "absolute",
              left: 20,
              right: 20,
              bottom: 18,
              zIndex: 2,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <h2
              style={{
                fontFamily: ed.serif,
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "clamp(36px,7vw,92px)",
                letterSpacing: "-0.01em",
                lineHeight: 0.9,
                color: ed.paper,
                margin: 0,
              }}
            >
              The Fold
            </h2>
            <p
              style={{
                fontFamily: ed.body,
                fontSize: "clamp(14px,1.6vw,18px)",
                lineHeight: 1.5,
                color: "rgba(240,230,224,0.86)",
                margin: 0,
                maxWidth: 560,
              }}
            >
              An ambient room for creatives. Soft presence, a living stream of sound, and a rhythm
              that reads the hour. Not a focus tool, a place to not work alone.
            </p>
            <span
              className="ctrla-feature-cta"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 9,
                fontFamily: ed.mono,
                fontSize: "clamp(11px,1.2vw,13px)",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: ed.paper,
                marginTop: 4,
              }}
            >
              Step inside{" "}
              <span aria-hidden className="ctrla-feature-arrow" style={{ transition: "transform .25s" }}>
                →
              </span>
            </span>
          </div>
        </a>
      </Bleed>
    </section>
  );
}
