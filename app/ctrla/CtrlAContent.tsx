"use client";

import { useEffect } from "react";
import Image from "next/image";
import { NavigationDock } from "@/components/NavDoc";
import EditorialFooter from "./_components/EditorialFooter";
import { GlobalTeamGlobe } from "@/components/ctrla/GlobalTeamGlobe";
import { BrandKitSection } from "@/components/ctrla/BrandKitSection";
import { EventsHubSection } from "@/components/ctrla/EventsHubSection";
import { ThreeToolkits } from "./_components/Toolkits";
import { ed, Bleed, Rule, Label } from "./_components/editorial";
import { issueMeta } from "./data";

// ═══════════════════════════════════════════════════════
// SHARED
// ═══════════════════════════════════════════════════════

const ChakraRibbon = () => (
  <div
    style={{
      height: 4,
      width: "100%",
      background:
        "linear-gradient(135deg,#231235 0%,#422A4C 22%,#693A4C 44%,#B05C56 66%,#D89A00 86%,#B9928F 100%)",
    }}
  />
);

// ═══════════════════════════════════════════════════════
// MASTHEAD
// ═══════════════════════════════════════════════════════

function Masthead() {
  return (
    <div style={{ background: ed.paper, position: "relative", zIndex: 5 }}>
      <Bleed style={{ padding: "12px clamp(18px,5vw,64px)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <Label color={ed.ink}>
            {issueMeta.volume} — {issueMeta.issue}
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
              zIndex: 1,
            }}
          >
            A ROV Creative Platform
          </span>
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <Image
              src="/ctrla/ctrla-3d-logo-color.svg"
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
          <h1
            style={{
              fontFamily: ed.grotesque,
              fontWeight: 800,
              fontSize: "clamp(44px, 9vw, 132px)",
              lineHeight: 0.86,
              letterSpacing: "-0.03em",
              color: ed.ink,
              margin: 0,
            }}
          >
            The Creative
            <br />
            Command.
          </h1>
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
              {issueMeta.tagline}
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
          color: "rgba(216,154,0,0.7)",
          textTransform: "uppercase",
          margin: "0 0 18px",
        }}
      >
        Plate I — Custom hand-drawn illustrations
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
// PICKS + REVIEWS (editorial featured grid)
// ═══════════════════════════════════════════════════════

type Pick = { area: string; kicker: string; title: string; page: string; href: string; external?: boolean };

const PICKS: Pick[] = [
  { area: "a", kicker: "ROV Tool", title: "Brand Kit Generator", page: "P.012", href: "/ctrla/brand-kit" },
  { area: "b", kicker: "Gatherings", title: "Events Hub", page: "P.007", href: "/ctrla/events" },
  { area: "c", kicker: "Mixtape", title: "The ROV Tape 3", page: "P.023", href: "/ctrla/tape3" },
  { area: "d", kicker: "Toolkit 01", title: "Music", page: "P.001", href: "/ctrla/toolkit/music" },
  { area: "e", kicker: "Toolkit 02", title: "Web Dev", page: "P.002", href: "/ctrla/toolkit/web-dev" },
  { area: "f", kicker: "Toolkit 03", title: "Design", page: "P.003", href: "/ctrla/toolkit/design" },
];

function PickCell({ pick }: { pick: Pick }) {
  const tall = pick.area === "a";
  return (
    <a
      href={pick.href}
      {...(pick.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="ctrla-pick"
      style={{ gridArea: pick.area, display: "flex", flexDirection: "column", textDecoration: "none" }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: tall ? "4 / 5" : "4 / 3",
          background: ed.ink,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 18,
        }}
      >
        <span style={{ fontFamily: ed.mono, fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(185,146,143,0.9)" }}>
          {pick.kicker}
        </span>
        <span aria-hidden className="ctrla-pick-arrow" style={{ alignSelf: "flex-end", color: "rgba(245,237,216,0.3)", fontSize: 22, lineHeight: 1, transition: "color .25s, transform .25s" }}>
          ↗
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10, paddingTop: 10 }}>
        <span style={{ fontFamily: ed.grotesque, fontWeight: 700, fontSize: "clamp(14px,1.6vw,18px)", letterSpacing: "-0.01em", color: ed.ink }}>
          {pick.title}
        </span>
        <Label color={ed.inkFaint}>{pick.page}</Label>
      </div>
    </a>
  );
}

function PicksReviews() {
  return (
    <section style={{ background: ed.paper, padding: "clamp(48px,7vw,88px) 0" }}>
      <Bleed>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <h2 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(28px,4vw,52px)", letterSpacing: "-0.02em", color: ed.ink, margin: 0 }}>
            Picks + Reviews
          </h2>
          <Label color={ed.inkFaint}>What we tested this issue</Label>
        </div>
        <Rule style={{ margin: "clamp(24px,3vw,40px) 0" }} />

        <div className="ctrla-picks-grid">
          {PICKS.map((p) => (
            <PickCell key={p.area} pick={p} />
          ))}
        </div>
      </Bleed>
    </section>
  );
}

// ═══════════════════════════════════════════════════════
// STATS BAND + THIS WEEK
// ═══════════════════════════════════════════════════════

function StatBand() {
  return (
    <section style={{ background: ed.paper, padding: "clamp(40px,6vw,72px) 0" }}>
      <Bleed>
        <Rule />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0,1.4fr) repeat(4, minmax(0,1fr))",
            gap: "clamp(16px,3vw,32px)",
            alignItems: "center",
            padding: "clamp(24px,3vw,36px) 0",
          }}
          className="ctrla-statband"
        >
          <p style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(20px,2.6vw,30px)", letterSpacing: "-0.02em", color: ed.ink, margin: 0 }}>
            The first twelve weeks. <span style={{ color: ed.amber }}>+</span>
          </p>
          {issueMeta.stats.map((s) => (
            <div key={s.label}>
              <div style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(30px,4vw,52px)", letterSpacing: "-0.03em", color: ed.ink, lineHeight: 1 }}>
                {s.value}
              </div>
              <Label color={ed.inkFaint} style={{ display: "block", marginTop: 6 }}>
                {s.label}
              </Label>
            </div>
          ))}
        </div>
        <Rule />

        {/* This week callout */}
        <div style={{ border: `1px solid ${ed.ink}`, padding: "clamp(20px,3vw,32px)", marginTop: "clamp(28px,4vw,44px)" }}>
          <p style={{ fontFamily: ed.grotesque, fontWeight: 700, fontSize: "clamp(15px,1.8vw,20px)", lineHeight: 1.5, color: ed.ink, margin: 0 }}>
            {issueMeta.thisWeek}
          </p>
        </div>
      </Bleed>
    </section>
  );
}

// ═══════════════════════════════════════════════════════
// STAY IN TOUCH (socials)
// ═══════════════════════════════════════════════════════

const SOCIALS = [
  { label: "Discord", href: "https://discord.gg/GfzXdmu" },
  { label: "Instagram", href: "#" },
  { label: "Reddit", href: "#" },
];

function StayInTouch() {
  return (
    <section style={{ background: ed.paper, padding: "clamp(48px,7vw,88px) 0" }}>
      <Bleed>
        <Rule />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap", padding: "clamp(28px,4vw,44px) 0" }}>
          <h2 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(28px,4vw,52px)", letterSpacing: "-0.02em", color: ed.ink, margin: 0 }}>
            Stay in touch.
          </h2>
          <div style={{ display: "flex", gap: "clamp(16px,3vw,40px)", flexWrap: "wrap" }}>
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                {...(s.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="ctrla-social"
                style={{ fontFamily: ed.grotesque, fontWeight: 700, fontSize: "clamp(16px,2vw,24px)", letterSpacing: "-0.01em", color: ed.ink, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}
              >
                {s.label}
                <span aria-hidden style={{ color: ed.amber }}>↗</span>
              </a>
            ))}
          </div>
        </div>
        <Rule />
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
        background: ed.ink,
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
            style={{ display: "flex", alignItems: "center", gap: 0, borderBottom: `1px solid rgba(245,237,216,0.4)`, minWidth: "min(100%, 340px)", flex: "0 1 380px" }}
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
        <Label color="rgba(245,237,216,0.4)" style={{ display: "block", marginTop: 24 }}>
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
      <NavigationDock />

      <Masthead />
      <Cover />
      <StickerBelt />

      <PicksReviews />
      <ChakraRibbon />

      <ThreeToolkits />

      {/* Brand Kit — feature spread (dark, interactive) */}
      <ChakraRibbon />
      <BrandKitSection />

      {/* Events — feature spread (dark, interactive) */}
      <ChakraRibbon />
      <EventsHubSection />

      <ChakraRibbon />
      <StatBand />

      {/* Global team map */}
      <GlobalTeamGlobe />

      <StayInTouch />
      <FridayFooter />

      <EditorialFooter />
    </div>
  );
}
