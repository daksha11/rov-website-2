"use client";

import { useEffect } from "react";
import { NavigationDock } from "@/components/NavDoc";
import EditorialFooter from "../../_components/EditorialFooter";
import ToolkitAtmosphere from "../../_components/ToolkitAtmosphere";
import { ToolkitDetail } from "../../_components/Toolkits";
import ToolkitStations from "../../_components/ToolkitStations";
import MusicGuide from "../../_components/MusicGuide";
import DesignGuide from "../../_components/DesignGuide";
import DevGuide from "../../_components/DevGuide";
import VideoGuide from "../../_components/VideoGuide";
import { Component as MusicReactiveHero } from "@/components/ui/music-reactive-hero-section";
// Toolkit pages run the LIGHT theme — the airy, cream reveal from the loader.
import { edLight as ed, Bleed, Rule, Label, legibleAccent } from "../../_components/editorial";
import { toolkitSections } from "../../data";
import { currentVolume } from "../../_volumes";

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

  // Gold is illegible on the cream light theme — remap the sector accent.
  const pageAccent = legibleAccent(section.accentColor);

  return (
    <div className="ctrla-light" style={{ background: "transparent", minHeight: "100vh", width: "100%", overflowX: "hidden" }}>
      <ToolkitAtmosphere />
      <NavigationDock />

      {/* Signature accent bar — this sector's colour, full bleed */}
      <div aria-hidden style={{ height: 3, background: pageAccent }} />

      {/* Back-nav masthead */}
      <div style={{ background: "transparent", position: "relative", zIndex: 5 }}>
        <Bleed style={{ padding: "12px clamp(18px,5vw,64px)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <a href="/ctrla" className="ctrla-back" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
              <span style={{ color: pageAccent }}>←</span>
              <Label color={ed.ink}>CTRL-A · {currentVolume.issueMeta.volume}</Label>
            </a>
            <Label color={pageAccent}>Toolkit {section.pageNumber}</Label>
          </div>
        </Bleed>
        <Rule color={ed.hair} />
      </div>

      {/* Music sector: slim inline audio strip — the Fold loop, reactive */}
      {id === "music" && (
        <div style={{ position: "relative", zIndex: 5, padding: "clamp(10px,1.6vw,18px) 0" }}>
          <MusicReactiveHero accent={pageAccent} />
        </div>
      )}

      {/* Music, Design, and Web Dev sectors open with the founder's craft
          guide, above the tools. Each is Part 01; the stations are Part 02. */}
      {id === "music" && <MusicGuide accent={pageAccent} />}
      {id === "design" && <DesignGuide accent={pageAccent} />}
      {id === "web-dev" && <DevGuide accent={pageAccent} />}
      {id === "video" && <VideoGuide accent={pageAccent} />}

      {/* Flagship sectors with curated Signals get the immersive Stations
          experience; the rest fall back to the editorial detail for now. */}
      {section.signals ? <ToolkitStations section={section} theme={ed} hideKicker={id === "music" || id === "design" || id === "web-dev" || id === "video"} /> : <ToolkitDetail section={section} />}

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
