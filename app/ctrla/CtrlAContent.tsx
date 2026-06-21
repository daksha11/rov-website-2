"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { NavigationDock } from "@/components/NavDoc";
import CtrlALoader from "./_components/CtrlALoader";
import EditorialFooter from "./_components/EditorialFooter";
import AnimatedShaderBackground from "@/components/ui/animated-shader-background";
import { DreamAsiaTeaser } from "./_components/DreamAsiaSections";
import { BrandKitFeature, CondensedEvents, VueClose } from "./_components/IssueSections";
import { ed, Bleed, Rule, Label } from "./_components/editorial";
import { issueMeta } from "./data";

// ═══════════════════════════════════════════════════════
// SHARED
// ═══════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════
// MASTHEAD
// ═══════════════════════════════════════════════════════

function Masthead() {
  return (
    <div style={{ background: ed.paper, position: "relative", zIndex: 5 }}>
      <Bleed style={{ padding: "12px clamp(18px,5vw,64px)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <Label color={ed.ink}>
            {issueMeta.volume} · {issueMeta.issue}
          </Label>
          <Image
            src="/ctrla/ctrla-flat-logo-black.png"
            alt="CTRL-A"
            width={48}
            height={35}
            priority
            style={{ height: "clamp(22px, 2.6vw, 32px)", width: "auto" }}
          />
          <Label color={ed.ink} style={{ textAlign: "right" }}>
            {issueMeta.season} · {issueMeta.date}
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
    <section style={{ background: ed.paper, padding: "clamp(24px,4vw,44px) 0 clamp(40px,6vw,72px)" }}>
      <Bleed>
        {/* Cover art block — finalized 3D CTRL-A logo on a framed panel */}
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16 / 6",
            minHeight: 180,
            background: ed.ink,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "clamp(20px,4vw,48px)",
            overflow: "hidden",
          }}
        >
          {/* Animated shader background (palette-tuned), behind the logo */}
          <AnimatedShaderBackground style={{ zIndex: 0 }} intensity={1.15} />

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
          <div style={{ position: "relative", zIndex: 1, width: "100%", height: "100%" }}>
            <Image
              src="/ctrla/ctrla-3d-logo-white.svg"
              alt="CTRL-A"
              fill
              priority
              unoptimized
              sizes="(max-width: 768px) 90vw, 1100px"
              style={{ objectFit: "contain" }}
            />
          </div>
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
          </div>
          <div style={{ paddingTop: 8 }}>
            <Label style={{ display: "block", marginBottom: 8 }}>{issueMeta.season}</Label>
            <p
              style={{
                fontFamily: ed.mono,
                fontSize: "clamp(11px,1.2vw,13px)",
                lineHeight: 1.6,
                color: ed.inkSoft,
                margin: 0,
              }}
            >
              Cover Story · {issueMeta.issue}
            </p>
          </div>
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
          <Label color={ed.inkFaint}>Free Magazine</Label>
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
            Issue 01
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
    <div style={{ background: ed.ink, overflow: "hidden", padding: "20px 0 30px", position: "relative" }}>
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
      <div aria-hidden style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 120, background: `linear-gradient(to right, ${ed.ink} 30%, transparent)`, zIndex: 2 }} />
      <div aria-hidden style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 120, background: `linear-gradient(to left, ${ed.ink} 30%, transparent)`, zIndex: 2 }} />
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
// STATS BAND + THIS WEEK
// ═══════════════════════════════════════════════════════

function StatBand() {
  return (
    <section style={{ background: ed.plum, padding: "clamp(48px,7vw,88px) 0" }}>
      <Bleed>
        <Rule color="rgba(240,230,224,0.25)" />
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
            The first twelve weeks. <span style={{ color: ed.gold }}>+</span>
          </p>
          {issueMeta.stats.map((s) => (
            <div key={s.label}>
              <div style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(30px,4vw,52px)", letterSpacing: "-0.03em", color: ed.gold, lineHeight: 1 }}>
                {s.value}
              </div>
              <Label color="rgba(240,230,224,0.6)" style={{ display: "block", marginTop: 6 }}>
                {s.label}
              </Label>
            </div>
          ))}
        </div>
        <Rule color="rgba(240,230,224,0.25)" />
      </Bleed>
    </section>
  );
}

// ═══════════════════════════════════════════════════════
// FRIDAY-DROP FOOTER (visual email capture)
// ═══════════════════════════════════════════════════════

function FridayFooter() {
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
            One tool,
            <br />
            every{" "}
            <span style={{ fontFamily: ed.serif, fontStyle: "italic", fontWeight: 400, color: ed.amber }}>Friday</span>.
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
                color: ed.amber,
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
        <Label color="rgba(240,230,224,0.4)" style={{ display: "block", marginTop: 24 }}>
          No spam. One signal a week. Unsubscribe anytime.
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
      {loading && <CtrlALoader onDone={dismissLoader} />}
      <NavigationDock />

      <Masthead />
      <Cover />
      <StickerBelt />

      {/* DreamAsia Fest — compact teaser; full story at /ctrla/dreamasia */}
      <DreamAsiaTeaser />

      {/* FIFA World Cup 26 — Atlanta events */}
      <CondensedEvents />

      {/* Standing feature — recurs every volume */}
      <BrandKitFeature />

      <StatBand />
      <VueClose />

      <FridayFooter />
      <EditorialFooter />
    </div>
  );
}
