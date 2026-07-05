"use client";

import { useEffect } from "react";
import { NavigationDock } from "@/components/NavDoc";
import EditorialFooter from "../_components/EditorialFooter";
import GalleyFridge from "../_components/GalleyFridge";
import { ed, Bleed, Rule, Label, Kicker } from "../_components/editorial";
import { cookbook } from "../data";
import { currentVolume } from "../_volumes";

// The Cookbook lives in the void, so it runs the DARK editorial theme
// (unlike the cream toolkit pages). The galley fridge is the centerpiece.
export default function CookbookPageContent() {
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
            <Label color={accent}>The Cookbook</Label>
          </div>
        </Bleed>
        <Rule color={ed.hair} />
      </div>

      {/* Header */}
      <section style={{ background: "transparent", padding: "clamp(40px,7vw,88px) 0 clamp(24px,4vw,40px)" }}>
        <Bleed>
          <Kicker color={accent} style={{ marginBottom: 16 }}>{cookbook.eyebrow}</Kicker>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
            <h1 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(44px,8vw,112px)", letterSpacing: "-0.03em", lineHeight: 0.86, color: ed.ink, margin: 0 }}>
              The Galley<span style={{ color: accent }}>.</span>
            </h1>
            <p style={{ fontFamily: ed.serif, fontStyle: "italic", fontSize: "clamp(16px,2.1vw,28px)", lineHeight: 1.3, color: accent, textAlign: "right", maxWidth: 420, margin: 0 }}>
              {cookbook.lede}
            </p>
          </div>
          <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.7vw,19px)", lineHeight: 1.6, color: ed.inkSoft, margin: "clamp(18px,2.4vw,28px) 0 0", maxWidth: 640 }}>
            On a ship the kitchen is the galley. This is the fridge that keeps the crew fueled: always three things, one meal, one snack, one drink. Pull the handle and pick one.
          </p>
          {cookbook.chef && (
            <p className="ctrla-fridge-credit ctrla-fridge-credit-lg" style={{ margin: "clamp(16px,2vw,22px) 0 0", maxWidth: 640 }}>
              Chef of the volume: {cookbook.chef.name}, {cookbook.chef.city}. {cookbook.chef.bio}
            </p>
          )}
        </Bleed>
      </section>

      {/* The galley fridge — the interactive heart */}
      <section style={{ background: "transparent", padding: "clamp(8px,2vw,24px) 0 clamp(56px,8vw,104px)" }}>
        <Bleed>
          <GalleyFridge />
        </Bleed>
      </section>

      <EditorialFooter />
    </div>
  );
}
