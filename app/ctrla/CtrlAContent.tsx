"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { NavigationDock } from "@/components/sections/NavDoc";
import CosmicBackdrop from "./_components/CosmicBackdrop";
import GooeyLogoMorph from "./_components/GooeyLogoMorph";
import EditorialFooter from "./_components/EditorialFooter";
import CtrlASignup from "./_components/CtrlASignup";
import ShootingStars from "@/components/ui/shooting-stars";
import { ThreeToolkits } from "./_components/Toolkits";
import { DreamAsiaTeaser } from "./_components/DreamAsiaSections";
import { TheFoldTeaser } from "./_components/TheFoldTeaser";
import Cookbook from "./_components/Cookbook";
import { VolumeBento, BrandKitFeature, CondensedEvents, VueClose } from "./_components/IssueSections";
import { ed, Bleed, Rule, Label, Kicker, SweepText, Typewriter } from "./_components/editorial";
import { currentVolume } from "./_volumes";

// The live issue. Everything volume-specific reads from here, so
// publishing a new volume is a one-line pointer flip in ./_volumes.
const { issueMeta } = currentVolume;
// Zero-padded numeric volume for the cover's split "Vol. 01" display.
const volumeNo = String(currentVolume.number).padStart(2, "0");

// The first-visit loader pulls in three.js (WebGL aurora shader) via
// AnimatedShaderBackground — the single heaviest dependency on this route,
// and one shown at most once per session. Code-split it out of the initial
// landing bundle with a dynamic, client-only import. The loading fallback is
// a plain dark screen matching the loader's ground so a genuine first visit
// never flashes white before the loader mounts.
const CtrlALoader = dynamic(() => import("./_components/CtrlALoader"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden
      style={{ position: "fixed", inset: 0, zIndex: 9999, background: ed.void }}
    />
  ),
});

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
              <Typewriter text={issueMeta.coverHeadline} />
            </h1>

            {/* Thesis line — a single serif italic register-setter under the H1 */}
            <p
              style={{
                fontFamily: ed.serif,
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "clamp(19px,2.6vw,34px)",
                lineHeight: 1.22,
                letterSpacing: "-0.005em",
                color: ed.gold,
                margin: "clamp(14px,1.8vw,22px) 0 0",
                maxWidth: 620,
              }}
            >
              Taste is the sky you set as your limit.
            </p>

            {/* Emphasized primary CTA — send a cold visitor straight to the toolkits */}
            <div style={{ marginTop: "clamp(22px,2.8vw,36px)" }}>
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

              {/* Secondary — an outlined button, emphasized but subordinate to the solid primary */}
              <div style={{ marginTop: "clamp(14px,1.8vw,20px)" }}>
                <a
                  href="/ctrla/brand-kit"
                  className="ctrla-cover-cta ctrla-cover-cta-ghost"
                  style={{
                    fontFamily: ed.mono,
                    fontSize: "clamp(12px,1.35vw,15px)",
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    padding: "15px 32px",
                    borderRadius: 4,
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  Or try the Brand Kit Generator <span aria-hidden>→</span>
                </a>
              </div>
            </div>

            <div style={{ marginTop: "clamp(18px,2.4vw,30px)" }}>
              <Label color={ed.inkFaint}>
                Always{" "}
                <span style={{ color: ed.gold, fontWeight: 700, fontSize: "1.35em", letterSpacing: "0.14em" }}>
                  free
                </span>{" "}
                · New volume monthly
              </Label>
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
              Vol. <span style={{ color: ed.gold }}>{volumeNo}</span>
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
        <span style={{ color: ed.gold, fontWeight: 700, letterSpacing: "0.3em" }}>hand-drawn</span>{" "}
        illustrations
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
  { n: "01", title: "The Toolkits", meta: "Music · Development · Design", href: "#toolkits", note: "Immersive and level by level. Learn the tool without the overwhelm." },
  { n: "02", title: "Brand Kit Generator", meta: "Standing feature", href: "/ctrla/brand-kit", note: "Your colours, type, and tone, exported to a working system in minutes." },
  { n: "03", title: "The Feature: DreamAsia Fest", meta: "The process, deep", href: "/ctrla/dreamasia", note: "From the bedroom to the stage, with none of the ugly steps skipped." },
  { n: "04", title: "Vantage", meta: "Focus space", href: "/ctrla/the-fold", note: "Five worlds to work in. Fly to the one your head is in, and stay as long as the work takes." },
  { n: "05", title: "The Cookbook", meta: "Fuel for the work", href: "#cookbook", note: "Easy recipes for creatives short on time and money." },
  { n: "06", title: "The City", meta: "World Cup, Atlanta", href: "#events", note: "Our hometown stage, and the summer the whole world arrives." },
];

// On-page anchor targets that each CONTENTS row maps to. Half the TOC
// hrefs point at standalone routes (brand-kit, dreamasia, the-fold), but
// every one of those has a teaser section on the landing page, so the
// Spine jumps to the on-page presence instead of navigating away.
const SPINE_TARGETS = ["toolkits", "brandkit", "ctrla-dreamasia", "ctrla-fold", "cookbook", "events"];

// ═══════════════════════════════════════════════════════
// THE SPINE — fixed left-rail progress + TOC (desktop),
// top progress hairline (mobile). Engages once the Cover has
// scrolled out (cover sentinel) and disengages as the footer
// enters (footer sentinel). All scroll work is rAF-batched and
// passive, matching the house LazyVideo/ShootingStars pattern.
// ═══════════════════════════════════════════════════════

function Spine() {
  const [engaged, setEngaged] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    const measure = () => {
      raf.current = 0;
      const vh = window.innerHeight || 1;
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const cover = document.getElementById("ctrla-cover-end");
      const footer = document.getElementById("ctrla-footer-start");

      const coverTop = cover ? cover.getBoundingClientRect().top : -1;
      const footerTop = footer ? footer.getBoundingClientRect().top : vh * 2;
      setEngaged(coverTop < 120 && footerTop > vh * 0.5);

      const startDoc = cover ? cover.getBoundingClientRect().top + scrollY : 0;
      const endDoc = footer
        ? footer.getBoundingClientRect().top + scrollY
        : document.documentElement.scrollHeight;
      const p = (scrollY + vh * 0.45 - startDoc) / Math.max(1, endDoc - startDoc);
      setProgress(Math.min(1, Math.max(0, p)));

      let idx = 0;
      SPINE_TARGETS.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= vh * 0.4) idx = i;
      });
      setActive(idx);
    };
    const onScroll = () => {
      if (!raf.current) raf.current = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  return (
    <>
      {/* Desktop rail */}
      <nav className="ctrla-spine" data-engaged={engaged} aria-label="Volume contents">
        <div className="ctrla-spine-track" aria-hidden>
          <div className="ctrla-spine-fill" style={{ transform: `scaleY(${progress})` }} />
        </div>
        <ol className="ctrla-spine-list">
          {CONTENTS.map((c, i) => (
            <li key={c.n}>
              <button
                type="button"
                className="ctrla-spine-num"
                data-active={i === active}
                aria-current={i === active ? "true" : undefined}
                onClick={() => jump(SPINE_TARGETS[i])}
              >
                {c.n}
                <span className="ctrla-spine-label">{c.title}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>
      {/* Mobile top progress hairline */}
      <div className="ctrla-spine-top" style={{ transform: `scaleX(${progress})` }} aria-hidden />
    </>
  );
}

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
          style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "clamp(12px,1.6vw,18px)", width: "100%", background: "none", borderTop: `1px solid ${ed.hair}`, borderBottom: `1px solid ${ed.hair}`, cursor: "pointer", textAlign: "left", padding: "clamp(16px,2vw,24px) clamp(4px,1vw,14px)" }}
        >
          <span style={{ minWidth: 0, width: "100%" }}>
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
          <span style={{ display: "inline-flex", alignItems: "center", gap: "clamp(10px,1.6vw,18px)", flexShrink: 0 }}>
            <span className="ctrla-acc-toggle" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: ed.mono, fontSize: "clamp(10px,1.1vw,12px)", letterSpacing: "0.16em", textTransform: "uppercase", borderRadius: 6, padding: "9px 16px", whiteSpace: "nowrap" }}>
              {indexOpen ? "Collapse" : "Expand"}
              <ContentsChevron open={indexOpen} />
            </span>
            <Label color={ed.gold}>{issueMeta.volume} · {issueMeta.edition}</Label>
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
            <SweepText>One volume,</SweepText>
            <br />
            every{" "}
            <span style={{ fontFamily: ed.serif, fontStyle: "italic", fontWeight: 400, color: ed.gold }}>month</span>.
          </h2>

          {/* Live Klaviyo capture */}
          <CtrlASignup
            variant="band"
            theme="dark"
            source="ctrla-monthly-drop"
            cta="Subscribe"
            note="No spam. One drop a month. Unsubscribe anytime."
            successTitle="You are on the list."
            successBody="One volume, every month, straight to your inbox."
          />
        </div>
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

      {/* Left-rail progress + TOC (desktop) / top hairline (mobile) */}
      <Spine />

      <Masthead />
      <Cover />

      {/* Cover sentinel — the Spine engages once this scrolls out */}
      <div id="ctrla-cover-end" aria-hidden style={{ position: "relative", height: 0 }} />

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

      {/* ─────────────────────────────────────────────
          THE STORY HALF — process, taste, the city
          ───────────────────────────────────────────── */}

      {/* Honest peers — the deep feature teaser and the focus-space teaser
          sit side by side at equal half-width. Their own section/Bleed
          padding is neutralized by .ctrla-peers so this shared grid owns
          the layout. */}
      <section style={{ background: "transparent", padding: "clamp(48px,7vw,88px) 0" }}>
        <Bleed>
          <div className="ctrla-peers">
            <div id="ctrla-dreamasia" style={{ scrollMarginTop: 80 }}>
              <DreamAsiaTeaser />
              <Label color={ed.inkFaint} style={{ display: "block", marginTop: 14 }}>
                Plate II · DreamAsia Fest, behind the scenes
              </Label>
            </div>
            <div id="ctrla-fold" style={{ scrollMarginTop: 80 }}>
              <TheFoldTeaser />
            </div>
          </div>
        </Bleed>
      </section>

      {/* The Cookbook — landing anchor (#cookbook), a closed mini-fridge that
          steps into the full galley at /ctrla/cookbook. Mounted before the
          bento so the TOC jump resolves here. */}
      <Cookbook />
      <Bleed style={{ paddingBottom: "clamp(20px,3vw,40px)" }}>
        <Label color={ed.inkFaint}>Plate III · The galley, this volume&apos;s spread</Label>
      </Bleed>

      {/* The soundtrack — two on repeat + the CTRL-A playlist strip */}
      <VolumeBento />

      {/* The city — World Cup 26, Atlanta */}
      <CondensedEvents />

      {/* The mission — a closing thesis on what CTRL-A is */}
      <Mission />

      <VueClose />

      {/* Footer sentinel — the Spine disengages once this enters */}
      <div id="ctrla-footer-start" aria-hidden style={{ position: "relative", height: 0 }} />

      <SubscribeFooter />
      <EditorialFooter />

      {/* Page-wide film grain — a faint magazine texture over the whole issue */}
      <div aria-hidden className="ctrla-page-grain" />
    </div>
  );
}
