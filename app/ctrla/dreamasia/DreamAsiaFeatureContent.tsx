"use client";

// ═══════════════════════════════════════════════════════
// CTRL-A — DREAMASIA FEST — FULL FEATURE PAGE
// The complete behind-the-scenes story, lifted off the
// magazine front page into its own route. Reuses the same
// editorial sections so the two stay in sync.
// ═══════════════════════════════════════════════════════

import { useEffect } from "react";
import { NavigationDock } from "@/components/NavDoc";
import EditorialFooter from "../_components/EditorialFooter";
import { IssueOpen, BehindTheScenes, TwoCities, ProductionToolkit } from "../_components/DreamAsiaSections";
import { ed, Bleed, Rule, Label } from "../_components/editorial";

export default function DreamAsiaFeatureContent() {
  useEffect(() => {
    window.scrollTo(0, 0);
    const prevBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = ed.paper;
    document.body.style.overflowX = "hidden";
    document.body.style.height = "auto";
    return () => {
      document.body.style.backgroundColor = prevBg;
      document.body.style.overflowX = "";
      document.body.style.height = "";
    };
  }, []);

  return (
    <div style={{ background: ed.paper, minHeight: "100vh", width: "100%", overflowX: "hidden" }}>
      <NavigationDock />

      {/* Back-nav masthead */}
      <div style={{ background: ed.paper, position: "relative", zIndex: 5 }}>
        <Bleed style={{ padding: "12px clamp(18px,5vw,64px)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <a href="/ctrla" className="ctrla-back" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
              <span style={{ color: ed.amber }}>←</span>
              <Label color={ed.ink}>CTRL-A · Issue 01</Label>
            </a>
            <Label color={ed.inkFaint}>Issue Feature</Label>
          </div>
        </Bleed>
        <Rule />
      </div>

      <IssueOpen />
      <BehindTheScenes />
      <TwoCities />
      <ProductionToolkit />

      <EditorialFooter />
    </div>
  );
}
