"use client";

// ═══════════════════════════════════════════════════════
// CTRL-A — VOLUME ARCHIVE (back issue digest)
// /ctrla always renders the CURRENT volume; back issues live
// here at /ctrla/vol/[n]. This is a CONDENSED digest of a
// volume — masthead, feature link, picks, events — read
// entirely from the volume registry. The full landing
// experience is reserved for the live issue.
// ═══════════════════════════════════════════════════════

import { useEffect } from "react";
import { NavigationDock } from "@/components/NavDoc";
import CosmicBackdrop from "../../_components/CosmicBackdrop";
import EditorialFooter from "../../_components/EditorialFooter";
import { ed, Bleed, Rule, Label, Kicker } from "../../_components/editorial";
import { getVolume } from "../../_volumes";

export default function VolArchiveContent({ n }: { n: number }) {
  const volume = getVolume(n);

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

  // The route guards unknown numbers with notFound(); this is a belt-and-braces
  // fallback so the client component never renders against an undefined volume.
  if (!volume) return null;

  const { issueMeta, taste, artForm, onRepeat, cookbook, events, feature } = volume;
  const dish = cookbook.recipes.find((r) => r.featured) ?? cookbook.recipes[0];

  return (
    <div style={{ background: "transparent", minHeight: "100vh", width: "100%", overflowX: "hidden" }}>
      <CosmicBackdrop />
      <NavigationDock />

      {/* Signature gold accent bar */}
      <div aria-hidden style={{ height: 3, background: ed.gold, position: "relative", zIndex: 5 }} />

      {/* Back-nav masthead */}
      <div style={{ background: "transparent", position: "relative", zIndex: 5 }}>
        <Bleed style={{ padding: "12px clamp(18px,5vw,64px)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <a href="/ctrla" className="ctrla-back" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
              <span style={{ color: ed.gold }}>←</span>
              <Label color={ed.ink}>Back to the current issue</Label>
            </a>
            <Label color={ed.inkFaint}>Archive · {issueMeta.volume}</Label>
          </div>
        </Bleed>
        <Rule />
      </div>

      {/* Header — the volume masthead */}
      <section style={{ background: "transparent", padding: "clamp(40px,7vw,88px) 0 clamp(24px,4vw,40px)", position: "relative", zIndex: 1 }}>
        <Bleed>
          <Kicker color={ed.gold} style={{ marginBottom: 16 }}>Back issue · {issueMeta.edition}</Kicker>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
            <h1 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(48px,9vw,120px)", letterSpacing: "-0.03em", lineHeight: 0.84, color: ed.ink, margin: 0 }}>
              {issueMeta.volume}
            </h1>
            <p style={{ fontFamily: ed.serif, fontStyle: "italic", fontSize: "clamp(16px,2.1vw,28px)", lineHeight: 1.3, color: ed.gold, textAlign: "right", maxWidth: 460, margin: 0 }}>
              {issueMeta.coverHeadline}
            </p>
          </div>
          <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.7vw,19px)", lineHeight: 1.6, color: ed.inkSoft, margin: "clamp(18px,2.4vw,28px) 0 0", maxWidth: 680 }}>
            {issueMeta.coverDeck}
          </p>

          {/* Stats row */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(24px,4vw,56px)", marginTop: "clamp(28px,3.5vw,44px)" }}>
            {issueMeta.stats.map((s) => (
              <div key={s.label}>
                <div style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(28px,3.6vw,46px)", letterSpacing: "-0.03em", color: ed.gold, lineHeight: 1 }}>{s.value}</div>
                <Label color={ed.gold} style={{ display: "block", marginTop: 6 }}>{s.label}</Label>
              </div>
            ))}
          </div>
        </Bleed>
      </section>

      {/* The feature */}
      <section style={{ background: "transparent", padding: "clamp(32px,5vw,64px) 0", position: "relative", zIndex: 1 }}>
        <Bleed>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: "clamp(18px,2.4vw,28px)" }}>
            <Kicker color={ed.gold}>The feature</Kicker>
            <Label color={ed.gold}>The process, deep</Label>
          </div>
          <Rule style={{ marginBottom: "clamp(24px,3vw,36px)" }} />
          <a href={feature.href} className="ctrla-feature-card" style={{ position: "relative", display: "block", width: "100%", aspectRatio: "16 / 7", minHeight: 240, background: ed.panel, overflow: "hidden", textDecoration: "none" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={feature.coverShot.src} alt={feature.coverShot.alt} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,8,32,0.82) 0%, rgba(15,8,32,0.28) 46%, transparent 72%)" }} />
            <div style={{ position: "absolute", left: 20, right: 20, bottom: 18, display: "flex", flexDirection: "column", gap: 12 }}>
              <h2 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(28px,5vw,64px)", letterSpacing: "-0.03em", lineHeight: 0.92, color: ed.paper, margin: 0, maxWidth: 760 }}>
                {issueMeta.featureHeadline}
              </h2>
              <p style={{ fontFamily: ed.body, fontSize: "clamp(14px,1.6vw,18px)", lineHeight: 1.5, color: "rgba(240,230,224,0.86)", margin: 0, maxWidth: 620 }}>
                {issueMeta.featureDeck}
              </p>
              <span className="ctrla-feature-cta" style={{ display: "inline-flex", alignItems: "center", gap: 9, fontFamily: ed.mono, fontSize: "clamp(11px,1.2vw,13px)", letterSpacing: "0.16em", textTransform: "uppercase", color: ed.paper, marginTop: 4 }}>
                Read the feature <span aria-hidden className="ctrla-feature-arrow" style={{ transition: "transform .25s" }}>→</span>
              </span>
            </div>
          </a>
        </Bleed>
      </section>

      {/* Off the clock — taste, craft, sound, fuel */}
      <section style={{ background: "transparent", padding: "clamp(32px,5vw,64px) 0", position: "relative", zIndex: 1 }}>
        <Bleed>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: "clamp(18px,2.4vw,28px)" }}>
            <Kicker color={ed.gold}>Off the clock · {issueMeta.volume}</Kicker>
            <Label color={ed.gold}>Taste · Craft · Sound · Fuel</Label>
          </div>
          <Rule style={{ marginBottom: "clamp(24px,3vw,36px)" }} />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "clamp(20px,3vw,40px)" }}>
            {/* Featured art */}
            <div style={{ borderTop: `2px solid ${ed.gold}`, paddingTop: 16 }}>
              <Label color={ed.gold} style={{ display: "block", marginBottom: 10 }}>{taste.eyebrow}</Label>
              <h3 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(24px,2.8vw,38px)", letterSpacing: "-0.02em", color: ed.ink, margin: "0 0 10px" }}>{taste.headline}</h3>
              <p style={{ fontFamily: ed.serif, fontStyle: "italic", fontSize: "clamp(14px,1.6vw,18px)", lineHeight: 1.4, color: ed.gold, margin: 0 }}>{taste.lede}</p>
            </div>

            {/* Craft */}
            <div style={{ borderTop: `2px solid ${ed.gold}`, paddingTop: 16 }}>
              <Label color={ed.gold} style={{ display: "block", marginBottom: 10 }}>{artForm.eyebrow}</Label>
              <h3 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(24px,2.8vw,38px)", letterSpacing: "-0.02em", color: ed.ink, margin: "0 0 10px" }}>{artForm.form}</h3>
              <p style={{ fontFamily: ed.serif, fontStyle: "italic", fontSize: "clamp(14px,1.6vw,18px)", lineHeight: 1.4, color: ed.gold, margin: "0 0 8px" }}>{artForm.headline}</p>
              <Label color={ed.inkFaint}>{artForm.origin}</Label>
            </div>

            {/* Sound — on repeat */}
            <div style={{ borderTop: `2px solid ${ed.gold}`, paddingTop: 16 }}>
              <Label color={ed.gold} style={{ display: "block", marginBottom: 10 }}>{onRepeat.eyebrow}</Label>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {onRepeat.tracks.map((t) => (
                  <li key={t.url}>
                    <a href={t.url} target="_blank" rel="noopener noreferrer" className="ctrla-seeall" style={{ textDecoration: "none", display: "block" }}>
                      <span style={{ display: "block", fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(16px,1.8vw,22px)", letterSpacing: "-0.01em", color: ed.ink }}>{t.title}</span>
                      <Label color={ed.gold}>{t.artist}</Label>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Fuel — cookbook pick */}
            <div style={{ borderTop: `2px solid ${ed.gold}`, paddingTop: 16 }}>
              <Label color={ed.gold} style={{ display: "block", marginBottom: 10 }}>The Cookbook · Fuel</Label>
              <a href="/ctrla/cookbook" className="ctrla-seeall" style={{ textDecoration: "none", display: "block" }}>
                <h3 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(24px,2.8vw,38px)", letterSpacing: "-0.02em", color: ed.ink, margin: "0 0 8px" }}>{dish.name}</h3>
                <Label color={ed.inkFaint} style={{ display: "block", marginBottom: 8 }}>{dish.cuisine}{dish.by ? ` · ${dish.by}` : ""}</Label>
                <span style={{ fontFamily: ed.mono, fontSize: "clamp(10px,1.1vw,12px)", letterSpacing: "0.1em", textTransform: "uppercase", color: ed.gold }}>
                  {dish.timeMins} min · ${dish.costUsd} · serves {dish.serves}
                </span>
              </a>
            </div>
          </div>
        </Bleed>
      </section>

      {/* Events */}
      <section style={{ background: "transparent", padding: "clamp(32px,5vw,64px) 0 clamp(48px,7vw,96px)", position: "relative", zIndex: 1 }}>
        <Bleed>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: "clamp(18px,2.4vw,28px)" }}>
            <Kicker color={ed.gold}>The city</Kicker>
            <Label color={ed.gold}>What was on</Label>
          </div>
          <Rule style={{ marginBottom: "clamp(8px,1.5vw,16px)" }} />
          <div>
            {events.map((e) => {
              const isFree = e.badge === "Free";
              return (
                <a
                  key={e.name}
                  href={e.url}
                  target="_blank"
                  rel="noopener"
                  className="ctrla-event-row"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(72px, 0.6fr) minmax(0, 2.4fr) minmax(0, 1.6fr) auto",
                    alignItems: "center",
                    gap: "clamp(12px,2vw,28px)",
                    padding: "clamp(16px,2.2vw,24px) clamp(6px,1vw,12px)",
                    borderBottom: `1px solid ${ed.hair}`,
                    textDecoration: "none",
                  }}
                >
                  <span style={{ fontFamily: ed.mono, fontSize: "clamp(11px,1.2vw,13px)", letterSpacing: "0.08em", textTransform: "uppercase", color: ed.gold }}>{e.date}</span>
                  <span className="ctrla-event-name" style={{ fontFamily: ed.grotesque, fontWeight: isFree ? 800 : 700, fontSize: "clamp(16px,2vw,26px)", letterSpacing: "-0.01em", color: ed.ink }}>{e.name}</span>
                  <span style={{ fontFamily: ed.body, fontSize: "clamp(12px,1.3vw,14px)", color: ed.inkSoft }}>{e.location}</span>
                  <span style={{ justifySelf: "end", fontFamily: ed.mono, fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: isFree ? ed.paper : ed.inkFaint, background: isFree ? ed.amber : "transparent", border: `1px solid ${isFree ? ed.amber : ed.hair}`, padding: "4px 10px", whiteSpace: "nowrap" }}>
                    {isFree ? "Free Entry" : "Ticketed"}
                  </span>
                </a>
              );
            })}
          </div>
        </Bleed>
      </section>

      <EditorialFooter />

      <div aria-hidden className="ctrla-page-grain" />
    </div>
  );
}
