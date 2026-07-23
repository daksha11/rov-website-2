"use client";

import { useEffect } from "react";
import { NavigationDock } from "@/components/sections/NavDoc";
import EditorialFooter from "../_components/EditorialFooter";
import Cookbook from "../_components/Cookbook";
import { ATLRoots } from "../_components/ATLSections";
import { CondensedEvents } from "../_components/IssueSections";
import { ed, Bleed, Rule, Label, Kicker, ImageBlock } from "../_components/editorial";
import { currentVolume } from "../_volumes";

// CTRL-A · ATL — the local field guide as its own page. A home base for
// young Atlanta creatives and students: Roots (why the city is a creative
// capital), the scene (events), and the Cookbook (cheap fuel). Runs the
// DARK editorial theme, same shell as the Cookbook page.
export default function ATLPageContent() {
  const accent = ed.gold;

  useEffect(() => {
    window.scrollTo(0, 0);
    const prevBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = ed.ground;
    document.body.style.overflowX = "hidden";
    document.body.style.height = "auto";
    return () => {
      document.body.style.backgroundColor = prevBg;
      document.body.style.overflowX = "";
      document.body.style.height = "";
    };
  }, []);

  return (
    <div style={{ background: ed.ground, minHeight: "100vh", width: "100%", overflowX: "hidden", color: ed.ink }}>
      <NavigationDock />

      {/* Signature accent bar — gold, full bleed */}
      <div aria-hidden style={{ height: 3, background: accent }} />

      {/* Back-nav masthead */}
      <div style={{ background: "transparent", position: "relative", zIndex: 5 }}>
        <Bleed style={{ padding: "12px clamp(18px,5vw,64px)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <a href="/ctrla" className="ctrla-back" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
              <span style={{ color: accent }}>←</span>
              <Label color={ed.ink}>CTRL-A · {currentVolume.issueMeta.volume}</Label>
            </a>
            <Label color={accent}>ATL Community</Label>
          </div>
        </Bleed>
        <Rule color={ed.hair} />
      </div>

      {/* Header */}
      <section style={{ background: "transparent", padding: "clamp(40px,7vw,88px) 0 clamp(8px,2vw,24px)" }}>
        <Bleed>
          <Kicker color={accent} style={{ marginBottom: 16 }}>CTRL-A · ATL Community</Kicker>
          <h1 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(40px,7.4vw,104px)", letterSpacing: "-0.03em", lineHeight: 0.88, color: ed.ink, margin: 0, maxWidth: 1000 }}>
            For the ones coming up in Atlanta<span style={{ color: accent }}>.</span>
          </h1>
          <p style={{ fontFamily: ed.serif, fontStyle: "italic", fontWeight: 400, fontSize: "clamp(18px,2.4vw,32px)", lineHeight: 1.26, color: accent, margin: "clamp(16px,2vw,24px) 0 0", maxWidth: 720 }}>
            A home base for young Atlanta creatives and students: where the city came from, what is on, and how to eat well on nothing.
          </p>
        </Bleed>
      </section>

      {/* Hero visual — the city itself leads the page. Wireframe placeholder
          until the real shot lands at /public/ctrla/atl/hero-skyline.webp */}
      <section style={{ background: "transparent", padding: "clamp(20px,3vw,40px) 0 0" }}>
        <Bleed>
          <ImageBlock ratio="21 / 9" alt="Atlanta skyline from the Jackson Street Bridge at dusk">
            <span style={{ position: "absolute", left: 14, bottom: 12, fontFamily: ed.mono, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(36,18,58,0.75)" }}>
              Hero shot · Atlanta skyline, Jackson Street Bridge at dusk
            </span>
          </ImageBlock>
        </Bleed>
      </section>

      {/* Roots — why Atlanta is a creative capital (sourced, JSON-LD citations) */}
      <ATLRoots />

      {/* The scene — creative events + the big-city calendar (World Cup 26) */}
      <CondensedEvents />

      {/* Fuel — the Cookbook teaser; steps into the full galley at /ctrla/cookbook */}
      <Cookbook />
      <Bleed style={{ paddingBottom: "clamp(28px,4vw,56px)" }}>
        <Label color={ed.inkFaint}>Plate III · The galley, this volume&apos;s spread</Label>
      </Bleed>

      <EditorialFooter />
    </div>
  );
}
