"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { NavigationDock } from "@/components/NavDoc";
import CtrlALoader from "./_components/CtrlALoader";
import CosmicBackdrop from "./_components/CosmicBackdrop";
import GooeyLogoMorph from "./_components/GooeyLogoMorph";
import EditorialFooter from "./_components/EditorialFooter";
import ShootingStars from "@/components/ui/shooting-stars";
import { ThreeToolkits } from "./_components/Toolkits";
import { DreamAsiaTeaser } from "./_components/DreamAsiaSections";
import { TheFoldTeaser } from "./_components/TheFoldTeaser";
import { VolumeBento, BrandKitFeature, CondensedEvents, VueClose } from "./_components/IssueSections";
import { ed, Bleed, Rule, Label, Kicker } from "./_components/editorial";
import { issueMeta } from "./data";

// ═══════════════════════════════════════════════════════
// SHARED
// ═══════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════
// MASTHEAD
// ═══════════════════════════════════════════════════════

function Masthead() {
  return (
    <div style={{ background: "transparent", position: "relative", zIndex: 5 }}>
      <Bleed style={{ padding: "12px clamp(18px,5vw,64px)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <Label color={ed.ink}>
            {issueMeta.volume} · {issueMeta.edition}
          </Label>
          <Image
            src="/ctrla/ctrla-flat-logo-white.svg"
            alt="CTRL-A"
            width={48}
            height={35}
            priority
            unoptimized
            style={{ height: "clamp(22px, 2.6vw, 32px)", width: "auto" }}
          />
          <Label color={ed.ink} style={{ textAlign: "right" }}>
            {issueMeta.cadence} · CTRL-A
          </Label>
        </div>
      </Bleed>
      <Rule />
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// COVER
// ═══════════════════════════════════════════════════════

function Cover() {
  return (
    <section style={{ background: "transparent", padding: "clamp(24px,4vw,44px) 0 clamp(20px,3vw,36px)" }}>
      <Bleed>
        {/* Cover art block — finalized 3D CTRL-A logo on a framed panel */}
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16 / 6",
            minHeight: 180,
            // Japanese bokashi sky: night zenith → twilight → a narrow luminous
            // gold horizon low (~78%), then back to night. Uneven stops on purpose.
            background: `linear-gradient(180deg, ${ed.ground} 0%, ${ed.panel} 22%, ${ed.plum} 46%, ${ed.dusty} 66%, ${ed.gold} 78%, ${ed.dusty} 85%, ${ed.plum} 93%, ${ed.ground} 100%)`,
            border: `1px solid ${ed.hair}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "clamp(20px,4vw,48px)",
            overflow: "hidden",
          }}
        >
          {/* Gold accent bar — the issue's signature edge */}
          <div aria-hidden style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: ed.gold, zIndex: 3 }} />

          {/* Paper grain over the sky gradient — bokashi richness */}
          <div aria-hidden className="ctrla-grain" style={{ zIndex: 0 }} />

          {/* Real-sky shooting stars, behind the logo */}
          <ShootingStars style={{ zIndex: 0 }} />

          <span
            style={{
              position: "absolute",
              top: 14,
              right: 16,
              fontFamily: ed.mono,
              fontSize: "clamp(8px,0.9vw,10px)",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: ed.gold,
              zIndex: 2,
            }}
          >
            A ROV Creative Platform
          </span>
          <GooeyLogoMorph
            srcs={["/ctrla/ctrla-3d-logo-white.svg", "/ctrla/ctrla-flat-logo-white.svg"]}
            interval={4000}
            style={{ zIndex: 1, width: "100%", height: "100%" }}
          />
        </div>

        {/* Eyebrow — sits above the headline, full width */}
        <div style={{ marginTop: "clamp(20px,3vw,36px)" }}>
          <Kicker color={ed.gold}>{issueMeta.coverEyebrow}</Kicker>
        </div>

        {/* Masthead — title + CTA on the left; issue number and this volume's
            feature stacked on the right, so the whole cover reads in one frame. */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 2.1fr) minmax(0, 1fr)",
            gap: "clamp(16px,3vw,44px)",
            alignItems: "start",
            marginTop: "clamp(12px,1.6vw,20px)",
          }}
        >
          {/* Left — headline, primary CTA, tagline */}
          <div>
            <h1
              style={{
                fontFamily: ed.grotesque,
                fontWeight: 800,
                fontSize: "clamp(40px, 7.4vw, 104px)",
                lineHeight: 0.9,
                letterSpacing: "-0.03em",
                color: ed.ink,
                margin: 0,
              }}
            >
              {issueMeta.coverHeadline}
            </h1>

            {/* Emphasized primary CTA — send a cold visitor straight to the toolkits */}
            <div style={{ display: "flex", alignItems: "center", gap: "clamp(16px,2.6vw,30px)", flexWrap: "wrap", marginTop: "clamp(22px,2.8vw,36px)" }}>
              <a
                href="#toolkits"
                className="ctrla-cover-cta"
                style={{
                  fontFamily: ed.mono,
                  fontSize: "clamp(13px,1.5vw,17px)",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: ed.ground,
                  background: ed.gold,
                  padding: "18px 38px",
                  borderRadius: 4,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 12,
                  boxShadow: "0 14px 38px -10px rgba(227,194,74,0.55)",
                }}
              >
                Explore the toolkits <span aria-hidden>→</span>
              </a>
              <a
                href="/ctrla/brand-kit"
                className="ctrla-seeall"
                style={{
                  fontFamily: ed.mono,
                  fontSize: "clamp(11px,1.2vw,13px)",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: ed.inkSoft,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                Try the Brand Kit Generator <span aria-hidden>→</span>
              </a>
            </div>

            <div style={{ marginTop: "clamp(18px,2.4vw,30px)" }}>
              <Label color={ed.gold}>Always free · New volume monthly</Label>
            </div>
          </div>

          {/* Right — issue number (big, bold, inline) above this volume's feature */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "clamp(18px,2.6vw,36px)" }}>
            <span
              style={{
                fontFamily: ed.grotesque,
                fontWeight: 800,
                fontSize: "clamp(46px,6.2vw,104px)",
                lineHeight: 0.82,
                letterSpacing: "-0.03em",
                color: ed.ink,
                whiteSpace: "nowrap",
                textAlign: "right",
              }}
            >
              Vol. <span style={{ color: ed.gold }}>01</span>
            </span>

            <a
              href="/ctrla/dreamasia"
              className="ctrla-feature-card"
              style={{ textDecoration: "none", display: "block", textAlign: "right", maxWidth: 420 }}
            >
              <Kicker color={ed.gold} style={{ marginBottom: 10 }}>This volume&apos;s feature</Kicker>
              <p
                style={{
                  fontFamily: ed.grotesque,
                  fontWeight: 800,
                  fontSize: "clamp(20px,2.2vw,30px)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.02,
                  color: ed.ink,
                  margin: "0 0 8px",
                }}
              >
                {issueMeta.featureHeadline}
              </p>
              <p style={{ fontFamily: ed.body, fontSize: "clamp(13px,1.4vw,15px)", lineHeight: 1.5, color: ed.inkSoft, margin: "0 0 10px" }}>
                Inside DreamAsia Fest.
              </p>
              <span className="ctrla-feature-cta" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: ed.mono, fontSize: "clamp(10px,1.1vw,12px)", letterSpacing: "0.16em", textTransform: "uppercase", color: ed.gold }}>
                Read the feature <span aria-hidden className="ctrla-feature-arrow" style={{ transition: "transform .25s" }}>→</span>
              </span>
            </a>
          </div>
        </div>
      </Bleed>
    </section>
  );
}

// ═══════════════════════════════════════════════════════
// STICKER BELT (dark spread)
// ═══════════════════════════════════════════════════════

// Per-sticker scale: the source files bake in different amounts of
// transparent padding, so we normalize the *artwork* to read at roughly
// the same size as the two faces (the faces sit near 1.0).
const STICKERS: { src: string; scale: number }[] = [
  { src: "/ctrla/andresticker1.webp", scale: 1.05 },
  { src: "/ctrla/benzsticker.webp", scale: 1.8 },
  { src: "/ctrla/carsticker.webp", scale: 2.3 },
  { src: "/ctrla/grillsticker.webp", scale: 2.15 },
  { src: "/ctrla/gradysticker.webp", scale: 1.85 },
  { src: "/ctrla/atlsticker.webp", scale: 2.0 },
  { src: "/ctrla/martasticker.webp", scale: 2.2 },
  { src: "/ctrla/futuresticker.webp", scale: 1.05 },
];

function StickerBelt() {
  const track = [...STICKERS, ...STICKERS, ...STICKERS];
  return (
    <div style={{ background: ed.panel, overflow: "hidden", padding: "20px 0 30px", position: "relative", borderTop: `1px solid ${ed.hair}`, borderBottom: `1px solid ${ed.hair}` }}>
      {/* Gold hairline along the top edge */}
      <div aria-hidden style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right, transparent, ${ed.gold}, transparent)`, opacity: 0.5 }} />
      <p
        style={{
          textAlign: "center",
          fontFamily: ed.mono,
          fontSize: 10,
          letterSpacing: "0.26em",
          color: "rgba(227,194,74,0.7)",
          textTransform: "uppercase",
          margin: "0 0 18px",
        }}
      >
        Plate I · Custom hand-drawn illustrations
      </p>
      <div className="ctrla-belt-track" style={{ display: "flex", alignItems: "center", gap: 104, width: "max-content", animation: "ctrlaBelt 36s linear infinite" }}>
        {track.map((s, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={s.src}
            alt=""
            draggable={false}
            className="ctrla-sticker"
            style={{ flexShrink: 0, width: "auto", height: 104, objectFit: "contain", filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.6))", userSelect: "none", ["--s" as string]: s.scale }}
          />
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// CONTENTS — the thesis + a map of the volume
// ═══════════════════════════════════════════════════════

const CONTENTS = [
  { n: "01", title: "The Toolkits", meta: "Music · Web Dev · Design", href: "#toolkits", note: "Immersive and level by level. Learn the tool without the overwhelm." },
  { n: "02", title: "Brand Kit Generator", meta: "Standing feature", href: "/ctrla/brand-kit", note: "Your colours, type, and tone, exported to a working system in minutes." },
  { n: "03", title: "The Feature: DreamAsia Fest", meta: "The process, deep", href: "/ctrla/dreamasia", note: "From the bedroom to the stage, with none of the ugly steps skipped." },
  { n: "04", title: "Vantage", meta: "Focus space", href: "/ctrla/the-fold", note: "Five worlds to work in. Fly to the one your head is in, and stay as long as the work takes." },
  { n: "05", title: "The Cookbook", meta: "Fuel for the work", href: "#cookbook", note: "Easy recipes for creatives short on time and money." },
  { n: "06", title: "The City", meta: "World Cup, Atlanta", href: "#events", note: "Our hometown stage, and the summer the whole world arrives." },
];

function ContentsChevron({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden
      style={{ display: "inline-flex", flexShrink: 0, transition: "transform .3s ease", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
    </span>
  );
}

// The mission — a spoken thesis. Lives near the foot of the volume as a
// closing statement. Editorial voice: serif teaser, a quiet underlined text
// link, generous air. Its own collapsible, distinct from the index.
function Mission() {
  const [open, setOpen] = useState(false);

  return (
    <section style={{ background: "transparent", padding: "clamp(32px,5vw,72px) 0" }}>
      <Bleed>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="ctrla-mission-header"
          style={{ display: "block", width: "100%", background: "none", border: "none", borderTop: `1px solid ${ed.hair}`, cursor: "pointer", textAlign: "left", padding: "clamp(22px,3vw,40px) clamp(4px,1vw,14px) clamp(20px,2.6vw,32px)" }}
        >
          <span style={{ display: "block" }}>
            <Kicker color={ed.gold}>What CTRL-A is</Kicker>
          </span>
          {!open && (
            <span style={{ display: "block", fontFamily: ed.serif, fontStyle: "italic", fontWeight: 400, fontSize: "clamp(26px,3.6vw,48px)", lineHeight: 1.18, letterSpacing: "-0.01em", color: ed.ink, margin: "clamp(14px,1.8vw,22px) 0 clamp(18px,2vw,26px)", maxWidth: 820 }}>
              The one idea behind everything we make.
            </span>
          )}
          <span className="ctrla-mission-cta" style={{ display: "inline-flex", alignItems: "center", gap: 10, marginTop: open ? "clamp(14px,1.8vw,20px)" : 0, fontFamily: ed.mono, fontSize: "clamp(11px,1.2vw,13px)", letterSpacing: "0.18em", textTransform: "uppercase", color: ed.gold, paddingBottom: 4, borderBottom: `1px solid rgba(227,194,74,0.45)` }}>
            {open ? "Close the thesis" : "Read the thesis"}
            <span aria-hidden className="ctrla-mission-arrow" style={{ display: "inline-flex", transition: "transform .25s ease", transform: open ? "rotate(90deg)" : "none" }}>→</span>
          </span>
        </button>
        {open && (
          <p
            style={{
              fontFamily: ed.serif,
              fontStyle: "normal",
              fontWeight: 400,
              fontSize: "clamp(24px,3.6vw,50px)",
              lineHeight: 1.26,
              letterSpacing: "-0.01em",
              color: ed.ink,
              margin: "clamp(18px,2.4vw,30px) 0 0",
              maxWidth: 1080,
              paddingLeft: "clamp(4px,1vw,14px)",
            }}
          >
            CTRL-A is how Range Of View plays <em style={{ fontStyle: "italic", color: ed.gold }}>digital muse</em> to creatives
            everywhere, helping you <em style={{ fontStyle: "italic", color: ed.gold }}>see the bigger picture</em>. We go deep on
            the tools worth your time, walk the whole process with{" "}
            <em style={{ fontStyle: "italic", color: ed.gold }}>none of the ugly steps skipped</em>, and feature the art we cannot
            stop thinking about. Because nothing matters more in creative work than taste.{" "}
            <em style={{ fontStyle: "italic", color: ed.gold }}>Taste is the sky you set as your limit.</em>
          </p>
        )}
      </Bleed>
    </section>
  );
}

function Contents() {
  const [indexOpen, setIndexOpen] = useState(false);

  return (
    <section style={{ background: "transparent", padding: "clamp(24px,3.5vw,48px) 0 clamp(48px,7vw,96px)" }}>
      <Bleed>
        {/* ── The index — a functional table of contents. Systematic: a running
            mono index line, a piece count, a squared Expand button. ── */}
        <button
          type="button"
          onClick={() => setIndexOpen((v) => !v)}
          aria-expanded={indexOpen}
          className="ctrla-acc-header"
          style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "clamp(16px,3vw,32px)", width: "100%", background: "none", borderTop: `1px solid ${ed.hair}`, borderBottom: `1px solid ${ed.hair}`, cursor: "pointer", textAlign: "left", padding: "clamp(16px,2vw,24px) clamp(4px,1vw,14px)" }}
        >
          <span style={{ minWidth: 0 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
              <Kicker color={ed.gold}>Table of contents</Kicker>
              <span style={{ fontFamily: ed.mono, fontSize: "clamp(9px,1vw,11px)", letterSpacing: "0.2em", textTransform: "uppercase", color: ed.inkFaint }}>In this volume · {CONTENTS.length} pieces</span>
            </span>
            {!indexOpen && (
              <span className="ctrla-index-list" style={{ display: "block", marginTop: 12, fontFamily: ed.mono, fontSize: "clamp(11px,1.15vw,13px)", letterSpacing: "0.1em", textTransform: "uppercase", color: ed.inkSoft, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%" }}>
                {CONTENTS.map((c, i) => (
                  <span key={c.n}>
                    {i > 0 && <span style={{ color: ed.inkFaint, margin: "0 10px" }}>·</span>}
                    <span style={{ color: ed.gold, fontWeight: 700 }}>{c.n}</span> {c.title}
                  </span>
                ))}
              </span>
            )}
          </span>
          <span style={{ display: "inline-flex", alignItems: "flex-end", gap: "clamp(10px,1.6vw,18px)", flexShrink: 0 }}>
            <Label color={ed.gold}>{issueMeta.volume} · {issueMeta.edition}</Label>
            <span className="ctrla-acc-toggle" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: ed.mono, fontSize: "clamp(10px,1.1vw,12px)", letterSpacing: "0.16em", textTransform: "uppercase", color: ed.gold, border: `1px solid ${ed.gold}`, borderRadius: 6, padding: "9px 16px", whiteSpace: "nowrap" }}>
              {indexOpen ? "Collapse" : "Expand"}
              <ContentsChevron open={indexOpen} />
            </span>
          </span>
        </button>
        {indexOpen && (
          <div>
            {CONTENTS.map((c) => (
              <a
                key={c.n}
                href={c.href}
                className="ctrla-toc-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto minmax(0, 1.1fr) minmax(0, 1.4fr) auto",
                  alignItems: "center",
                  gap: "clamp(12px,2.5vw,32px)",
                  padding: "clamp(18px,2.4vw,26px) clamp(6px,1vw,12px)",
                  borderBottom: `1px solid ${ed.hair}`,
                  textDecoration: "none",
                }}
              >
                <span style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(20px,2.4vw,34px)", letterSpacing: "-0.02em", color: ed.gold }}>{c.n}</span>
                <span>
                  <span style={{ display: "block", fontFamily: ed.grotesque, fontWeight: 700, fontSize: "clamp(18px,2.1vw,28px)", letterSpacing: "-0.01em", color: ed.ink }}>{c.title}</span>
                  <Label color={ed.gold} style={{ display: "block", marginTop: 6 }}>{c.meta}</Label>
                </span>
                <span className="ctrla-toc-note" style={{ fontFamily: ed.body, fontSize: "clamp(13px,1.4vw,15px)", lineHeight: 1.5, color: ed.inkSoft }}>{c.note}</span>
                <span aria-hidden className="ctrla-toc-arrow" style={{ justifySelf: "end", color: ed.gold, fontSize: 18, transition: "transform .25s" }}>→</span>
              </a>
            ))}
          </div>
        )}
      </Bleed>
    </section>
  );
}

// ═══════════════════════════════════════════════════════
// STATS BAND
// ═══════════════════════════════════════════════════════

function StatBand() {
  return (
    <section style={{ background: `linear-gradient(180deg, ${ed.ground} 0%, ${ed.plum} 30%, ${ed.plum} 70%, ${ed.ground} 100%)`, padding: "clamp(48px,7vw,88px) 0", position: "relative", overflow: "hidden" }}>
      {/* Real-sky shooting stars, same as the cover */}
      <ShootingStars style={{ zIndex: 0 }} />

      <Bleed style={{ position: "relative", zIndex: 1 }}>
        <Rule color="rgba(227,194,74,0.4)" />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0,1.4fr) repeat(4, minmax(0,1fr))",
            gap: "clamp(16px,3vw,32px)",
            alignItems: "center",
            padding: "clamp(28px,3.5vw,44px) 0",
          }}
          className="ctrla-statband"
        >
          <p style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(20px,2.6vw,30px)", letterSpacing: "-0.02em", color: ed.paper, margin: 0 }}>
            What a volume holds. <span style={{ color: ed.gold }}>+</span>
          </p>
          {issueMeta.stats.map((s) => (
            <div key={s.label}>
              <div style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(30px,4vw,52px)", letterSpacing: "-0.03em", color: ed.gold, lineHeight: 1 }}>
                {s.value}
              </div>
              <Label color={ed.gold} style={{ display: "block", marginTop: 6 }}>
                {s.label}
              </Label>
            </div>
          ))}
        </div>
        <Rule color="rgba(227,194,74,0.4)" />
      </Bleed>
    </section>
  );
}

// ═══════════════════════════════════════════════════════
// SUBSCRIBE FOOTER (visual email capture, monthly drop)
// ═══════════════════════════════════════════════════════

function SubscribeFooter() {
  return (
    <section
      style={{
        background: ed.void,
        padding: "clamp(48px,7vw,96px) 0",
      }}
    >
      <Bleed>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 28, flexWrap: "wrap" }}>
          <h2 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(34px,6vw,84px)", letterSpacing: "-0.03em", lineHeight: 0.9, color: ed.paper, margin: 0 }}>
            One volume,
            <br />
            every{" "}
            <span style={{ fontFamily: ed.serif, fontStyle: "italic", fontWeight: 400, color: ed.gold }}>month</span>.
          </h2>

          {/* Visual-only capture */}
          <form
            onSubmit={(e) => e.preventDefault()}
            style={{ display: "flex", alignItems: "center", gap: 0, borderBottom: `1px solid rgba(240,230,224,0.4)`, minWidth: "min(100%, 340px)", flex: "0 1 380px" }}
          >
            <input
              type="email"
              placeholder="your@email.com"
              aria-label="Email address"
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: ed.paper,
                fontFamily: ed.mono,
                fontSize: 14,
                padding: "12px 4px",
              }}
            />
            <button
              type="submit"
              style={{
                fontFamily: ed.mono,
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: ed.gold,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "12px 4px",
                whiteSpace: "nowrap",
              }}
            >
              Subscribe →
            </button>
          </form>
        </div>
        <Label color={ed.gold} style={{ display: "block", marginTop: 24 }}>
          No spam. One drop a month. Unsubscribe anytime.
        </Label>
      </Bleed>
    </section>
  );
}

// ═══════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════

export default function CtrlAContent() {
  // Loading screen — shows once per browser session.
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("ctrla-loaded")) {
      setLoading(false);
    }
  }, []);
  const dismissLoader = () => {
    setLoading(false);
    try {
      sessionStorage.setItem("ctrla-loaded", "1");
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
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
    <div style={{ background: "transparent", minHeight: "100vh", width: "100%", overflowX: "hidden" }}>
      <CosmicBackdrop />
      {loading && <CtrlALoader onDone={dismissLoader} />}
      <NavigationDock />

      <Masthead />
      <Cover />

      {/* The thesis + a map of the volume */}
      <Contents />

      <StickerBelt />

      {/* ─────────────────────────────────────────────
          THE REFERENCE HALF — the tools, made deep
          ───────────────────────────────────────────── */}

      {/* The CTRL-A toolkits — Music / Web Dev / Design */}
      <ThreeToolkits />

      {/* Standing feature — recurs every volume */}
      <BrandKitFeature />

      <StatBand />

      {/* ─────────────────────────────────────────────
          THE STORY HALF — process, taste, the city
          ───────────────────────────────────────────── */}

      {/* The deep feature — compact teaser; full story at /ctrla/dreamasia */}
      <DreamAsiaTeaser />

      {/* The Fold — ambient creative room; full experience at /ctrla/the-fold */}
      <TheFoldTeaser />

      {/* Off the clock — music, craft, and fuel condensed into one bento */}
      <VolumeBento />

      {/* The city — World Cup 26, Atlanta */}
      <CondensedEvents />

      {/* The mission — a closing thesis on what CTRL-A is */}
      <Mission />

      <VueClose />

      <SubscribeFooter />
      <EditorialFooter />

      {/* Page-wide film grain — a faint magazine texture over the whole issue */}
      <div aria-hidden className="ctrla-page-grain" />
    </div>
  );
}
