"use client";

import { useEffect } from "react";
import { NavigationDock } from "@/components/NavDoc";
import EditorialFooter from "../../_components/EditorialFooter";
import { ToolkitDetail } from "../../_components/Toolkits";
import { ed, Bleed, Rule, Label } from "../../_components/editorial";
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
    <div style={{ background: ed.ground, minHeight: "100vh", width: "100%", overflowX: "hidden" }}>
      <NavigationDock />

      {/* Back-nav masthead */}
      <div style={{ background: ed.ground, position: "relative", zIndex: 5 }}>
        <Bleed style={{ padding: "12px clamp(18px,5vw,64px)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <a href="/ctrla" className="ctrla-back" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
              <span style={{ color: ed.amber }}>←</span>
              <Label color={ed.ink}>CTRL-A · Issue 01</Label>
            </a>
            <Label color={ed.inkFaint}>Toolkit {section.pageNumber}</Label>
          </div>
        </Bleed>
        <Rule />
      </div>

      <ToolkitDetail section={section} />

      {/* Prev / next toolkit */}
      <section style={{ background: ed.ground, padding: "0 0 clamp(56px,8vw,104px)" }}>
        <Bleed>
          <Rule />
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
