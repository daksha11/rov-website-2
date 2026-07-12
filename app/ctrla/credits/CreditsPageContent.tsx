"use client";

import { useEffect } from "react";
import { NavigationDock } from "@/components/sections/NavDoc";
import EditorialFooter from "../_components/EditorialFooter";
import CreditsPanel from "../_components/CreditsPanel";
import { ed, Bleed, Rule, Label, Kicker } from "../_components/editorial";
import { currentVolume } from "../_volumes";

// The credits economy lives in the void, so it runs the dark editorial theme.
export default function CreditsPageContent() {
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

      <div aria-hidden style={{ height: 3, background: accent }} />

      <div style={{ background: "transparent", position: "relative", zIndex: 5 }}>
        <Bleed style={{ padding: "12px clamp(18px,5vw,64px)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <a href="/ctrla" className="ctrla-back" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
              <span style={{ color: accent }}>←</span>
              <Label color={ed.ink}>CTRL-A · {currentVolume.issueMeta.volume}</Label>
            </a>
            <Label color={accent}>Credits</Label>
          </div>
        </Bleed>
        <Rule color={ed.hair} />
      </div>

      <section style={{ padding: "clamp(44px,7vw,88px) 0 clamp(40px,6vw,72px)" }}>
        <Bleed>
          <Kicker color={accent} style={{ marginBottom: 16 }}>The engagement economy</Kicker>
          <h1 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(42px,8vw,104px)", letterSpacing: "-0.03em", lineHeight: 0.88, color: ed.ink, margin: 0 }}>
            Earn it<span style={{ color: accent }}>.</span> Spend it<span style={{ color: accent }}>.</span>
          </h1>
          <p style={{ fontFamily: ed.body, fontSize: "clamp(16px,2vw,22px)", lineHeight: 1.5, color: ed.inkSoft, margin: "clamp(18px,2.4vw,26px) 0 clamp(32px,4vw,48px)", maxWidth: 620 }}>
            Follow us, share the work, and stack credits. Then spend them on the tools: brand kits, premium downloads, and course chapters. The more you are in it, the more you unlock.
          </p>
          <CreditsPanel />
        </Bleed>
      </section>

      <EditorialFooter />
    </div>
  );
}
