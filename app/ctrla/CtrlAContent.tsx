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
import Cookbook from "./_components/Cookbook";
import { DreamAsiaTeaser } from "./_components/DreamAsiaSections";
import { FloatingAsset, COSMIC } from "./_components/CosmicAccents";
import { ArtistShowcase, OnRepeat, ArtForm, BrandKitFeature, CondensedEvents, VueClose } from "./_components/IssueSections";
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
    <section style={{ background: "transparent", padding: "clamp(24px,4vw,44px) 0 clamp(40px,6vw,72px)" }}>
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

        {/* Headline row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 2.4fr) minmax(0, 1fr)",
            gap: "clamp(16px,3vw,40px)",
            alignItems: "start",
            marginTop: "clamp(24px,4vw,44px)",
          }}
        >
          <div>
            <Kicker color={ed.gold} style={{ marginBottom: 18 }}>{issueMeta.coverEyebrow}</Kicker>
            <h1
              style={{
                fontFamily: ed.grotesque,
                fontWeight: 800,
                fontSize: "clamp(40px, 8vw, 116px)",
                lineHeight: 0.9,
                letterSpacing: "-0.03em",
                color: ed.ink,
                margin: 0,
              }}
            >
              {issueMeta.coverHeadline}
            </h1>
            <p
              style={{
                fontFamily: ed.body,
                fontSize: "clamp(15px, 1.9vw, 22px)",
                lineHeight: 1.5,
                color: ed.inkSoft,
                margin: "clamp(16px,2vw,24px) 0 0",
                maxWidth: 640,
              }}
            >
              {issueMeta.coverDeck}
            </p>

            {/* Concrete value — what you actually get, and that it's free */}
            <p
              style={{
                fontFamily: ed.grotesque,
                fontWeight: 500,
                fontSize: "clamp(14px,1.5vw,17px)",
                lineHeight: 1.55,
                color: ed.ink,
                margin: "clamp(16px,2vw,22px) 0 0",
                maxWidth: 600,
              }}
            >
              <span style={{ color: ed.gold, fontWeight: 800 }}>Every volume, free:</span> a deep-dive toolkit for
              music, web, and design, the real process behind the work, and a brand-kit generator you can use today.
            </p>

            {/* Utility-first CTAs — point a cold visitor at the value */}
            <div style={{ display: "flex", alignItems: "center", gap: "clamp(12px,2vw,22px)", flexWrap: "wrap", marginTop: "clamp(20px,2.6vw,30px)" }}>
              <a
                href="#toolkits"
                className="ctrla-cover-cta"
                style={{
                  fontFamily: ed.mono,
                  fontSize: "clamp(11px,1.2vw,13px)",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: ed.ground,
                  background: ed.gold,
                  padding: "14px 26px",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
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
                  color: ed.ink,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                Try the Brand Kit Generator <span aria-hidden>→</span>
              </a>
            </div>
          </div>
          {/* This volume's feature, teased on the cover */}
          <a
            href="/ctrla/dreamasia"
            className="ctrla-feature-card"
            style={{ paddingTop: 8, textDecoration: "none", display: "block" }}
          >
            <Kicker color={ed.gold} style={{ marginBottom: 12 }}>This volume&apos;s feature</Kicker>
            <p
              style={{
                fontFamily: ed.grotesque,
                fontWeight: 800,
                fontSize: "clamp(20px,2.4vw,30px)",
                letterSpacing: "-0.02em",
                lineHeight: 1.02,
                color: ed.ink,
                margin: "0 0 10px",
              }}
            >
              {issueMeta.featureHeadline}
            </p>
            <p style={{ fontFamily: ed.body, fontSize: "clamp(13px,1.4vw,15px)", lineHeight: 1.5, color: ed.inkSoft, margin: "0 0 12px" }}>
              Inside DreamAsia Fest.
            </p>
            <span className="ctrla-feature-cta" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: ed.mono, fontSize: "clamp(10px,1.1vw,12px)", letterSpacing: "0.16em", textTransform: "uppercase", color: ed.gold }}>
              Read the feature <span aria-hidden className="ctrla-feature-arrow" style={{ transition: "transform .25s" }}>→</span>
            </span>
          </a>
        </div>

        {/* Issue line */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 16,
            marginTop: "clamp(20px,3vw,36px)",
            flexWrap: "wrap",
          }}
        >
          <Label color={ed.gold}>Always free · New volume monthly</Label>
          <span
            style={{
              fontFamily: ed.grotesque,
              fontWeight: 800,
              fontSize: "clamp(48px, 10vw, 150px)",
              lineHeight: 0.8,
              letterSpacing: "-0.04em",
              color: ed.ink,
            }}
          >
            Vol. <span style={{ color: ed.gold }}>01</span>
          </span>
        </div>
      </Bleed>
    </section>
  );
}

// ═══════════════════════════════════════════════════════
// STICKER BELT (dark spread)
// ═══════════════════════════════════════════════════════

const STICKERS = [
  "/ctrla/andresticker.webp",
  "/ctrla/benzsticker.webp",
  "/ctrla/carsticker.webp",
  "/ctrla/grillsticker.webp",
  "/ctrla/gradysticker.webp",
  "/ctrla/atlsticker.webp",
  "/ctrla/martasticker.webp",
  "/ctrla/futuresticker.webp",
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
      <div className="ctrla-belt-track" style={{ display: "flex", alignItems: "center", gap: 64, width: "max-content", animation: "ctrlaBelt 36s linear infinite" }}>
        {track.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={src}
            alt=""
            draggable={false}
            style={{ flexShrink: 0, width: 104, height: 104, objectFit: "contain", filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.6))", userSelect: "none" }}
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
  { n: "04", title: "Taste", meta: "Featured art", href: "#taste", note: "The work we cannot stop thinking about, one artist a volume." },
  { n: "05", title: "The Cookbook", meta: "Fuel for the work", href: "#cookbook", note: "Easy recipes for creatives short on time and money." },
  { n: "06", title: "The City", meta: "World Cup, Atlanta", href: "#events", note: "Our hometown stage, and the summer the whole world arrives." },
];

function Contents() {
  return (
    <section style={{ background: "transparent", padding: "clamp(48px,7vw,96px) 0" }}>
      <Bleed>
        {/* The thesis — what CTRL-A is, stated plainly */}
        <Kicker color={ed.gold}>What CTRL-A is</Kicker>
        <p
          style={{
            fontFamily: ed.serif,
            fontStyle: "normal",
            fontWeight: 400,
            fontSize: "clamp(22px,3.4vw,46px)",
            lineHeight: 1.28,
            letterSpacing: "-0.01em",
            color: ed.ink,
            margin: "clamp(18px,2.4vw,28px) 0 clamp(40px,5vw,64px)",
            maxWidth: 1080,
          }}
        >
          CTRL-A is how Range Of View plays <em style={{ fontStyle: "italic" }}>digital muse</em> to creatives
          everywhere, helping you <em style={{ fontStyle: "italic" }}>see the bigger picture</em>. We go deep on
          the tools worth your time, walk the whole process with{" "}
          <em style={{ fontStyle: "italic" }}>none of the ugly steps skipped</em>, and feature the art we cannot
          stop thinking about. Because nothing matters more in creative work than taste.{" "}
          <em style={{ fontStyle: "italic", color: ed.gold }}>Taste is the sky you set as your limit.</em>
        </p>

        {/* The map */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginBottom: "clamp(16px,2vw,24px)" }}>
          <Kicker color={ed.gold}>In this volume</Kicker>
          <Label color={ed.gold}>{issueMeta.volume} · {issueMeta.edition}</Label>
        </div>
        <Rule color={ed.hair} />
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
      <div className="ctrla-cosmic-wrap">
        <ThreeToolkits />
        <FloatingAsset src={COSMIC.planets} motion="bob" bottom="9%" left="-30px" size="clamp(80px,10vw,158px)" driftFrom={-28} driftTo={34} opacity={0.5} />
      </div>

      {/* Standing feature — recurs every volume */}
      <div className="ctrla-cosmic-wrap">
        <BrandKitFeature />
        <FloatingAsset src={COSMIC.galaxy} motion="spin" top="-3%" right="-44px" size="clamp(130px,17vw,280px)" driftFrom={22} driftTo={-22} opacity={0.34} />
      </div>

      <StatBand />

      {/* ─────────────────────────────────────────────
          THE STORY HALF — process, taste, the city
          ───────────────────────────────────────────── */}

      {/* The deep feature — compact teaser; full story at /ctrla/dreamasia */}
      <div className="ctrla-cosmic-wrap">
        <DreamAsiaTeaser />
        <FloatingAsset src={COSMIC.saturn} motion="spin" top="7%" right="-34px" size="clamp(96px,13vw,200px)" driftFrom={42} driftTo={-34} opacity={0.62} />
      </div>

      {/* Taste — the art we can't stop thinking about */}
      <ArtistShowcase />

      {/* On Repeat — what's soundtracking the studio this volume */}
      <div className="ctrla-cosmic-wrap">
        <OnRepeat />
        <FloatingAsset src={COSMIC.comet} motion="sway" top="8%" left="-26px" size="clamp(60px,8vw,120px)" driftFrom={-34} driftTo={28} opacity={0.42} />
      </div>

      {/* Form of the Volume — a rotating craft (Vol.01: kintsugi) */}
      <ArtForm />

      {/* The Cookbook — feeding the maker, on no time or budget */}
      <div className="ctrla-cosmic-wrap">
        <Cookbook />
        <FloatingAsset src={COSMIC.comet} motion="sway" top="9%" right="-26px" size="clamp(70px,9vw,140px)" driftFrom={40} driftTo={-30} opacity={0.5} />
      </div>

      {/* The city — World Cup 26, Atlanta */}
      <div className="ctrla-cosmic-wrap">
        <CondensedEvents />
        <FloatingAsset src={COSMIC.spaceship} motion="bob" top="11%" right="-6px" size="clamp(58px,8vw,112px)" driftFrom={56} driftTo={-56} opacity={0.72} />
        <FloatingAsset src={COSMIC.sideLines2} motion="sway" bottom="7%" left="-22px" size="clamp(96px,12vw,188px)" driftFrom={-22} driftTo={26} opacity={0.42} />
      </div>

      <VueClose />

      <SubscribeFooter />
      <EditorialFooter />
    </div>
  );
}
