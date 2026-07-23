"use client";

import { useEffect } from "react";
import { NavigationDock } from "@/components/sections/NavDoc";
import EditorialFooter from "../_components/EditorialFooter";
import GalleyFridge from "../_components/GalleyFridge";
import GalleyScience from "../_components/GalleyScience";
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
            On a ship the kitchen is the galley. This one has two rooms: the fridge that feeds you tonight, and the counter where you learn why food works.
          </p>
          {cookbook.chef && (
            <p className="ctrla-fridge-credit ctrla-fridge-credit-lg" style={{ margin: "clamp(16px,2vw,22px) 0 0", maxWidth: 640 }}>
              Chef of the volume: {cookbook.chef.name}, {cookbook.chef.city}. {cookbook.chef.bio}
            </p>
          )}
        </Bleed>
      </section>

      {/* Contents — the page's architecture, same pattern as the CTRL-A cover.
          Two chapters, two doors. */}
      <section style={{ background: "transparent", padding: "clamp(12px,2vw,24px) 0 clamp(16px,2.5vw,32px)" }}>
        <Bleed>
          <Label color={accent}>Contents</Label>
          <div style={{ marginTop: 12 }}>
            <Rule color={ed.hair} />
            {[
              { n: "01", title: "The Fridge", desc: "One meal, one snack, one drink. Pick one, eat tonight.", href: "#fridge" },
              { n: "02", title: "Kitchen Science", desc: "Five reactions that explain most of cooking.", href: "#science" },
            ].map((c) => (
              <a key={c.n} href={c.href} className="ctrla-path-row" style={{ ["--acc" as string]: accent, display: "block", textDecoration: "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "clamp(14px,2vw,24px)", padding: "clamp(18px,2.6vw,30px) clamp(6px,1vw,14px)", flexWrap: "wrap" }}>
                  <span aria-hidden className="ctrla-path-node" style={{ width: 10, height: 10, borderRadius: 999, border: `1.5px solid ${accent}`, flexShrink: 0 }} />
                  <span style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(13px,1.4vw,17px)", letterSpacing: "-0.01em", color: accent }}>{c.n}</span>
                  <span className="ctrla-path-name" style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(24px,3.4vw,46px)", letterSpacing: "-0.02em", lineHeight: 1, color: ed.ink }}>{c.title}</span>
                  <span style={{ flex: 1 }} />
                  <span style={{ fontFamily: ed.serif, fontStyle: "italic", fontSize: "clamp(13px,1.5vw,16px)", lineHeight: 1.4, color: ed.inkSoft, maxWidth: 300, textAlign: "right" }}>{c.desc}</span>
                  <span className="ctrla-path-cta" style={{ fontFamily: ed.mono, fontSize: "clamp(10.5px,1.15vw,12.5px)", letterSpacing: "0.2em", textTransform: "uppercase", color: accent, whiteSpace: "nowrap" }}>Jump ↓</span>
                </div>
                <Rule color={ed.hair} />
              </a>
            ))}
          </div>
        </Bleed>
      </section>

      {/* Chapter 01 — the fridge, with its own chapter masthead so both
          chapters carry equal architectural weight */}
      <section id="fridge" style={{ background: "transparent", padding: "clamp(32px,5vw,64px) 0 clamp(40px,6vw,72px)", scrollMarginTop: 80 }}>
        <Bleed>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: "clamp(18px,2.4vw,26px)" }}>
            <Kicker color={accent}>Chapter 01 · The Fridge</Kicker>
            <Label color={accent}>Eat tonight</Label>
          </div>
          <Rule color={ed.hair} style={{ marginBottom: "clamp(24px,3.4vw,40px)" }} />
          <h2 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(30px,4.6vw,64px)", letterSpacing: "-0.03em", lineHeight: 0.94, color: ed.ink, margin: 0 }}>
            Pull the handle<span style={{ color: accent }}>.</span>
          </h2>
          <p style={{ fontFamily: ed.serif, fontStyle: "italic", fontWeight: 400, fontSize: "clamp(17px,2.2vw,26px)", lineHeight: 1.3, color: accent, margin: "clamp(12px,1.6vw,18px) 0 0", maxWidth: 640 }}>
            Always three things inside. Real food, few ingredients, done before your render finishes.
          </p>
          <div style={{ marginTop: "clamp(8px,1.5vw,16px)" }}>
            <GalleyFridge />
          </div>
        </Bleed>
      </section>

      <Rule color={ed.hair} />

      {/* Kitchen science — why the cheap stuff works. The education layer. */}
      <GalleyScience />

      <EditorialFooter />
    </div>
  );
}
