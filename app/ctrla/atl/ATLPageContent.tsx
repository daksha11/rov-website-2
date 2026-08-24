"use client";

import { useEffect, useState } from "react";
import EditorialFooter from "../_components/EditorialFooter";
import Cookbook from "../_components/Cookbook";
import { ATLRoots, ATLMap, ATLBroll, ATLCustoms, type AtlStamp } from "../_components/ATLSections";
import { CondensedEvents } from "../_components/IssueSections";
import { ed, Bleed, Rule, Label, Kicker, ImageBlock } from "../_components/editorial";
import { currentVolume } from "../_volumes";

// CTRL-A · ATL — the local field guide as its own page. A home base for
// young Atlanta creatives and students: Roots (why the city is a creative
// capital), the scene (events), and the Cookbook (cheap fuel). Runs the
// DARK editorial theme, same shell as the Cookbook page.
// The four chapter doors. Stamps reorder them into a recommended reading
// order; the numbers stay fixed because the sections themselves never move.
const DOORS = {
  roots: { n: "01", title: "Roots", desc: "Why this city is a creative capital.", href: "#atl-roots" },
  scene: { n: "02", title: "The Scene", desc: "What is on: creative events and the big-city calendar.", href: "#events" },
  map: { n: "03", title: "The Map", desc: "Where to start: six doors, most of them free.", href: "#atl-map" },
  reel: { n: "04", title: "The Reel", desc: "Free Atlanta b-roll, licensed to sell. On us.", href: "#atl-reel" },
  fuel: { n: "05", title: "Fuel", desc: "The cookbook. Eat well on nothing.", href: "#cookbook" },
} as const;

const STAMP_KEY = "ctrla-atl-stamp";

export default function ATLPageContent() {
  const accent = ed.gold;

  // Customs stamp — read after mount so SSR markup stays universal.
  const [stamp, setStampState] = useState<AtlStamp | null>(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STAMP_KEY);
      if (raw) setStampState(JSON.parse(raw));
    } catch {}
  }, []);
  const setStamp = (s: AtlStamp | null) => {
    setStampState(s);
    try {
      if (s) localStorage.setItem(STAMP_KEY, JSON.stringify(s));
      else localStorage.removeItem(STAMP_KEY);
    } catch {}
  };

  // Recommended reading order per stamp. Students head straight to the Map
  // (and its .edu layer); locals get the Scene; new arrivals get Roots.
  const doorOrder: (keyof typeof DOORS)[] = !stamp
    ? ["roots", "scene", "map", "reel", "fuel"]
    : stamp.student
    ? ["map", "scene", "roots", "reel", "fuel"]
    : stamp.origin === "local"
    ? ["scene", "map", "roots", "reel", "fuel"]
    : ["roots", "map", "scene", "reel", "fuel"];

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

      {/* Customs — declare yourself, get stamped, the guide re-inks */}
      <ATLCustoms stamp={stamp} onStamp={setStamp} />

      {/* Contents — the field guide's architecture. Four chapters, four doors,
          same pattern as the CTRL-A cover and the Cookbook landing page.
          Stamps reorder the doors into a recommended reading order. */}
      <section style={{ background: "transparent", padding: "clamp(24px,3.5vw,48px) 0 clamp(16px,2.5vw,32px)" }}>
        <Bleed>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
            <Label color={accent}>Contents</Label>
            {stamp && <Label color={accent}>Inked in your order</Label>}
          </div>
          <div style={{ marginTop: 12 }}>
            <Rule color={ed.hair} />
            {doorOrder.map((k) => DOORS[k]).map((c) => (
              <a key={c.n} href={c.href} className="ctrla-path-row" style={{ ["--acc" as string]: accent, display: "block", textDecoration: "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "clamp(14px,2vw,24px)", padding: "clamp(16px,2.4vw,28px) clamp(6px,1vw,14px)", flexWrap: "wrap" }}>
                  <span aria-hidden className="ctrla-path-node" style={{ width: 10, height: 10, borderRadius: 999, border: `1.5px solid ${accent}`, flexShrink: 0 }} />
                  <span style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(13px,1.4vw,17px)", letterSpacing: "-0.01em", color: accent }}>{c.n}</span>
                  <span className="ctrla-path-name" style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(24px,3.4vw,46px)", letterSpacing: "-0.02em", lineHeight: 1, color: ed.ink }}>{c.title}</span>
                  <span style={{ flex: 1 }} />
                  <span style={{ fontFamily: ed.serif, fontStyle: "italic", fontSize: "clamp(13px,1.5vw,16px)", lineHeight: 1.4, color: ed.inkSoft, maxWidth: 320, textAlign: "right" }}>{c.desc}</span>
                  <span className="ctrla-path-cta" style={{ fontFamily: ed.mono, fontSize: "clamp(10.5px,1.15vw,12.5px)", letterSpacing: "0.2em", textTransform: "uppercase", color: accent, whiteSpace: "nowrap" }}>Jump ↓</span>
                </div>
                <Rule color={ed.hair} />
              </a>
            ))}
          </div>
        </Bleed>
      </section>

      {/* 01 Roots — why Atlanta is a creative capital (sourced, JSON-LD citations) */}
      <ATLRoots arrival={stamp?.origin === "arrival"} />

      {/* 02 The scene — creative events + the big-city calendar (World Cup 26) */}
      <CondensedEvents />

      {/* 03 The map — where to start; the Student stamp lights the .edu layer */}
      <ATLMap student={stamp?.student === true} />

      {/* 04 The Reel — free, commercially-licensed Atlanta b-roll for an email (lead magnet) */}
      <ATLBroll />

      {/* 05 Fuel — the Cookbook teaser; steps into the full galley at /ctrla/cookbook */}
      <Cookbook />
      <Bleed style={{ paddingBottom: "clamp(28px,4vw,56px)" }}>
        <Label color={ed.inkFaint}>Plate III · The galley, this volume&apos;s spread</Label>
      </Bleed>

      <EditorialFooter />
    </div>
  );
}
