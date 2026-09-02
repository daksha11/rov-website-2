"use client";

import { useEffect } from "react";
import EditorialFooter from "../../_components/EditorialFooter";
import ToolkitAtmosphere from "../../_components/ToolkitAtmosphere";
import { ToolkitDetail } from "../../_components/Toolkits";
import ToolkitStations from "../../_components/ToolkitStations";
import MusicGuide from "../../_components/MusicGuide";
import DesignGuide from "../../_components/DesignGuide";
import DevGuide from "../../_components/DevGuide";
import VideoGuide from "../../_components/VideoGuide";
import MedicineCabinet from "../../_components/MedicineCabinet";
import { Component as MusicReactiveHero } from "@/components/ui/music-reactive-hero-section";
// Toolkit pages run the LIGHT theme — the airy, cream reveal from the loader.
import { edLight as ed, Bleed, Rule, Label, Kicker, legibleAccent } from "../../_components/editorial";
import Vue from "../../_components/vue/Vue";
import VueAside from "../../_components/vue/VueAside";
import VueHandoff from "../../_components/vue/VueHandoff";
import { vueNarration } from "../../_components/vue/narration";
import { toolkitSections } from "../../data";
import { markDone } from "@/lib/ctrla/progress";
import type { CraftSlug } from "@/lib/ctrla/profile";
import YourPath from "../../_components/YourPath";
import Contributors from "../../_components/Contributors";
import { currentVolume } from "../../_volumes";

export default function ToolkitPageContent({ id }: { id: string }) {
  const index = toolkitSections.findIndex((s) => s.id === id);
  const section = toolkitSections[index];
  const prev = toolkitSections[(index - 1 + toolkitSections.length) % toolkitSections.length];
  const next = toolkitSections[(index + 1) % toolkitSections.length];

  // The path: reading to the end marks the "Learn" stop for this craft.
  useEffect(() => {
    const onScroll = () => {
      const end = document.documentElement.scrollHeight - window.innerHeight - 320;
      if (window.scrollY >= end) {
        markDone(id as CraftSlug, "learn");
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const prevBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = ed.ground;
    // `clip` (not `hidden`) — hidden turns body into a scroll container and
    // silently breaks every position:sticky descendant (e.g. the guide's
    // chapter jump-nav).
    document.body.style.overflowX = "clip";
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
  // Vue narrates the sector in three beats. A toolkit with no lines written
  // yet simply renders without her rather than with a placeholder.
  const vue = vueNarration(id);

  return (
    <div className="ctrla-light" style={{ background: "transparent", minHeight: "100vh", width: "100%", overflowX: "clip" }}>
      <ToolkitAtmosphere />

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
        <Bleed style={{ padding: "10px clamp(18px,5vw,64px)" }}>
          <YourPath variant="strip" theme="light" craft={id as CraftSlug} />
        </Bleed>
      </div>

      {/* Music sector: slim inline audio strip — the Fold loop, reactive */}
      {id === "music" && (
        <div style={{ position: "relative", zIndex: 5, padding: "clamp(10px,1.6vw,18px) 0" }}>
          <MusicReactiveHero accent={pageAccent} />
        </div>
      )}

      {/* BEAT 1 — Vue opens the sector. She stands before the craft guide, so
          the first voice on the page is the guide's, not the tool list's. The
          thread draws from her palm to the line she is saying. */}
      {vue && (
        <section style={{ background: "transparent", padding: "clamp(20px,3vw,40px) 0 clamp(8px,1.5vw,20px)" }}>
          <Bleed>
            <VueHandoff pose="showing" theme={ed} height={240}>
              <Kicker color={pageAccent}>Vue · {section.title}</Kicker>
              <p
                data-vue-target
                style={{
                  fontFamily: ed.serif,
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: "clamp(19px,2.6vw,34px)",
                  lineHeight: 1.28,
                  color: ed.ink,
                  margin: "clamp(12px,1.6vw,18px) 0 0",
                  maxWidth: 720,
                }}
              >
                {vue.open}
              </p>
            </VueHandoff>
          </Bleed>
        </section>
      )}

      {/* Music, Design, and Web Dev sectors open with the founder's craft
          guide, above the tools. Each is Part 01; the stations are Part 02. */}
      {id === "music" && <MusicGuide accent={pageAccent} />}
      {id === "design" && <DesignGuide accent={pageAccent} />}
      {id === "web-dev" && <DevGuide accent={pageAccent} />}
      {id === "video" && <VideoGuide accent={pageAccent} />}

      {/* Flagship sectors with curated Signals get the immersive Stations
          experience; the rest fall back to the editorial detail for now.
          `tk-stations` is the shared jump-nav anchor for Part 02. */}
      {/* BEAT 2 — Vue hands over to the tool list itself. */}
      {vue && (
        <section style={{ background: "transparent", padding: "clamp(18px,2.6vw,34px) 0 0" }}>
          <Bleed>
            <VueAside theme={ed} eyebrow="Vue · on the kit">{vue.stations}</VueAside>
          </Bleed>
        </section>
      )}

      <div id="tk-stations" style={{ scrollMarginTop: 56 }}>
        {section.signals ? <ToolkitStations section={section} theme={ed} hideKicker={id === "music" || id === "design" || id === "web-dev" || id === "video"} /> : <ToolkitDetail section={section} />}
      </div>

      {/* Web Dev · Part 03 — the medicine cabinet of custom Claude Code skills */}
      {id === "web-dev" && <MedicineCabinet accent={pageAccent} />}

      {/* History lesson — accent-tinted entry strip into the immersive story */}
      {section.history && (
        <section style={{ background: "transparent", padding: "0 0 clamp(40px,6vw,72px)" }}>
          <Bleed>
            <a
              href={`/ctrla/toolkit/${section.id}/history`}
              className="ctrla-course-strip"
              aria-label={`Open the ${section.title} history lesson`}
              style={{ borderTop: `3px solid ${pageAccent}`, background: `${pageAccent}0D` }}
            >
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
                <div style={{ maxWidth: 720 }}>
                  <Kicker color={pageAccent}>{section.history.entryLabel}</Kicker>
                  <h3 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(26px,4vw,48px)", letterSpacing: "-0.03em", lineHeight: 0.96, color: ed.ink, margin: "12px 0 10px" }}>
                    {section.history.title}
                  </h3>
                  <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.7vw,19px)", lineHeight: 1.55, color: ed.inkSoft, margin: 0, maxWidth: 620 }}>
                    {section.history.lede}
                  </p>
                </div>
                <span style={{ fontFamily: ed.grotesque, fontWeight: 700, fontSize: "clamp(14px,1.6vw,18px)", letterSpacing: "-0.01em", color: pageAccent, display: "inline-flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}>
                  Enter <span className="ctrla-course-arrow" aria-hidden>→</span>
                </span>
              </div>
            </a>
          </Bleed>
        </section>
      )}

      {/* The music kit has a commercial counterpart on rovmusic.com. That page is
          the signal chain we run in paid sessions, written for an artist choosing
          an engineer; this one is the open library. Different questions, so both
          stay self-canonical and simply point at each other. */}
      {id === "music" && (
        <section style={{ background: "transparent", padding: "0 0 clamp(40px,6vw,72px)" }}>
          <Bleed>
            <Rule color={ed.hair} />
            <a
              href="https://www.rovmusic.com/toolkit"
              style={{ display: "block", textDecoration: "none", paddingTop: 28 }}
            >
              <Kicker color={pageAccent}>Working with us</Kicker>
              <h3 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(22px,3.2vw,38px)", letterSpacing: "-0.03em", lineHeight: 1, color: ed.ink, margin: "12px 0 10px" }}>
                The chain we run on a paying record →
              </h3>
              <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.7vw,19px)", lineHeight: 1.55, color: ed.inkSoft, margin: 0, maxWidth: 620 }}>
                These are the picks. Over on ROV Music we walk the whole signal
                path in order, capture to release, with the mistake that shows up
                most often at each stage.
              </p>
            </a>
          </Bleed>
        </section>
      )}

      {/* BEAT 3 — Vue signs off the sector, leaning in from the page edge the
          way she closes the magazine. `bleed` is not optional on this pose:
          the art has no arm on the side the edge is meant to cover. */}
      {vue && (
        <section style={{ background: "transparent", padding: "clamp(24px,4vw,56px) 0 0" }}>
          <div className="ctrla-vue-close">
          <Bleed>
            <div className="ctrla-vue-close-copy" style={{ maxWidth: 620 }}>
              <VueAside theme={ed} pose="pointing" mood="calm" eyebrow={`Vue · ${section.title}, signing off`}>
                {vue.close}
              </VueAside>
            </div>
          </Bleed>
          <Vue className="ctrla-vue-close-figure" pose="leaning" colorway="clay" bleed height="clamp(200px, 26vw, 360px)" mood="calm" />
          <Bleed>
            <div aria-hidden style={{ height: 1, background: ed.hair }} />
          </Bleed>
          </div>
        </section>
      )}

      {/* Who improved this kit, and what to hand back first. */}
      <Contributors craft={id as CraftSlug} />

      {/* Prev / next toolkit */}
      <section style={{ background: "transparent", padding: "clamp(40px,6vw,88px) 0 clamp(56px,8vw,104px)" }}>
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
