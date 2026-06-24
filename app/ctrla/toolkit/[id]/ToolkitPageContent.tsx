"use client";

import { useEffect } from "react";
import { NavigationDock } from "@/components/NavDoc";
import EditorialFooter from "../../_components/EditorialFooter";
import ToolkitAtmosphere from "../../_components/ToolkitAtmosphere";
import { ToolkitDetail } from "../../_components/Toolkits";
import ToolkitStations from "../../_components/ToolkitStations";
// Toolkit pages run the LIGHT theme — the airy, cream reveal from the loader.
import { edLight as ed, Bleed, Rule, Label } from "../../_components/editorial";
import { toolkitSections } from "../../data";

export default function ToolkitPageContent({ id }: { id: string }) {
  const index = toolkitSections.findIndex((s) => s.id === id);
  const section = toolkitSections[index];
  const prev = toolkitSections[(index - 1 + toolkitSections.length) % toolkitSections.length];
  const next = toolkitSections[(index + 1) % toolkitSections.length];

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

  if (!section) return null;

  return (
    <div className="ctrla-light" style={{ background: "transparent", minHeight: "100vh", width: "100%", overflowX: "hidden" }}>
      <ToolkitAtmosphere />
      <NavigationDock />

      {/* Signature accent bar — this sector's colour, full bleed */}
      <div aria-hidden style={{ height: 3, background: section.accentColor }} />

      {/* Back-nav masthead */}
      <div style={{ background: "transparent", position: "relative", zIndex: 5 }}>
        <Bleed style={{ padding: "12px clamp(18px,5vw,64px)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <a href="/ctrla" className="ctrla-back" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
              <span style={{ color: section.accentColor }}>←</span>
              <Label color={ed.ink}>CTRL-A · Vol. 01</Label>
            </a>
            <Label color={section.accentColor}>Toolkit {section.pageNumber}</Label>
          </div>
        </Bleed>
        <Rule color={ed.hair} />
      </div>

      {/* Flagship sectors with curated Signals get the immersive Stations
          experience; the rest fall back to the editorial detail for now. */}
      {section.signals ? <ToolkitStations section={section} theme={ed} /> : <ToolkitDetail section={section} />}

      {/* Prev / next toolkit */}
      <section style={{ background: "transparent", padding: "0 0 clamp(56px,8vw,104px)" }}>
        <Bleed>
          <Rule color={ed.hair} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, paddingTop: "clamp(24px,3vw,36px)", flexWrap: "wrap" }}>
            <a href={`/ctrla/toolkit/${prev.id}`} className="ctrla-pn" style={{ textDecoration: "none" }}>
              <Label color={ed.inkFaint} style={{ display: "block", marginBottom: 6 }}>← Previous</Label>
              <span style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(20px,2.6vw,32px)", letterSpacing: "-0.02em", color: ed.ink }}>{prev.title}</span>
            </a>
            <a href={`/ctrla/toolkit/${next.id}`} className="ctrla-pn" style={{ textDecoration: "none", textAlign: "right" }}>
              <Label color={ed.inkFaint} style={{ display: "block", marginBottom: 6 }}>Next →</Label>
              <span style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(20px,2.6vw,32px)", letterSpacing: "-0.02em", color: ed.ink }}>{next.title}</span>
            </a>
          </div>
        </Bleed>
      </section>

      <EditorialFooter />
    </div>
  );
}
