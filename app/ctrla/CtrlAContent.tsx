"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import CosmicBackdrop from "./_components/CosmicBackdrop";
import GooeyLogoMorph from "./_components/GooeyLogoMorph";
import EditorialFooter from "./_components/EditorialFooter";
import CtrlASignup from "./_components/CtrlASignup";
import TheRoom from "./_components/TheRoom";
import ShootingStars from "@/components/ui/shooting-stars";
import { BrandKitFeature, VueClose } from "./_components/IssueSections";
import { ed, Bleed, Rule, Label, Kicker, SweepText, Typewriter } from "./_components/editorial";
import { VueBust } from "./_components/vue/Vue";
import VueHandoff from "./_components/vue/VueHandoff";
import { toolkitSections } from "./data";
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
            // Japanese bokashi sky: night zenith → twilight → a luminous gold
            // horizon low (~80%), then back to night. The gold peak stays bright,
            // but ramps in over many stops on both sides so it blooms wide across
            // the horizon instead of snapping into a hard bright line.
            background: `linear-gradient(180deg, #0F0820 0%, #1C0E2B 20%, #2E2246 34%, #45364F 45%, #5E4657 54%, #7A5658 61%, #9C6E54 68%, #C29A50 74%, #DBB44D 78%, #E3C24A 81%, #D0A850 84%, #A67C5C 89%, #6A4F66 93%, #2A1740 97%, #0F0820 100%)`,
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
            {/* H1 — lead with the problem the reader actually feels, stated plainly
                so it lands the instant the page loads. */}
            <h1
              style={{
                fontFamily: ed.grotesque,
                fontWeight: 800,
                fontSize: "clamp(30px, 5.4vw, 72px)",
                lineHeight: 0.98,
                letterSpacing: "-0.025em",
                color: ed.ink,
                margin: 0,
                maxWidth: 780,
              }}
            >
              Your work never looks as good as it does in your head.
            </h1>

            {/* Resolution — the brand line, demoted beneath the problem and carrying
                the typewriter cursor. The answer to the H1, not the lead. */}
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
              There&rsquo;s a reason, and a fix. <Typewriter text={issueMeta.coverHeadline} />
            </p>

            {/* The recurring thesis, kept small so it still lands without competing. */}
            <p
              style={{
                fontFamily: ed.mono,
                fontSize: "clamp(11px,1.15vw,13px)",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: ed.inkFaint,
                margin: "clamp(10px,1.2vw,14px) 0 0",
              }}
            >
              Taste is the sky you set as your limit.
            </p>

            {/* Emphasized primary CTA — send a cold visitor straight to the paths */}
            <div style={{ marginTop: "clamp(22px,2.8vw,36px)" }}>
              <a
                href="#paths"
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
                Find your path <span aria-hidden>→</span>
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
                    // Set the resting look inline so the browser's visited-link
                    // purple can never win. Hover fill is handled in globals.css.
                    color: ed.gold,
                    background: "transparent",
                    border: `1.5px solid ${ed.gold}`,
                    padding: "18px 38px",
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

              {/* The permanent door to the intake quiz. Deliberately quiet:
                  the auto-invite does the asking, so this only has to catch
                  the reader who dismissed it and changed their mind. */}
              <div style={{ marginTop: "clamp(14px,1.8vw,20px)" }}>
                <a
                  href="/ctrla/start"
                  className="ctrla-start-text-btn"
                  style={{
                    fontFamily: ed.mono,
                    fontSize: "clamp(11px,1.2vw,13px)",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: ed.inkFaint,
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  Not sure where to start? Four questions{" "}
                  <span aria-hidden style={{ color: ed.gold }}>
                    →
                  </span>
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

// The volume, split by who each part is for. The tools up top are the four
// creative types (Music / Design / Web / Video); "By what you make" goes
// deeper per craft; then the ATL Community section for the young creatives
// coming up in the city. Lock In (the focus space) is a persistent, summonable
// tool, not a scroll row, so it lives outside this list.
const CONTENTS = [
  { n: "01", title: "Choose your path", meta: "Music · Design · Web · Video", href: "#paths", note: "Pick your craft. Each path opens its own landing page with the whole toolkit." },
  { n: "02", title: "Brand Kit Generator", meta: "Standing tool", href: "/ctrla/brand-kit", note: "Your colours, type, and tone, exported to a working system in minutes." },
  { n: "03", title: "ATL Community", meta: "For young Atlanta creatives", href: "/ctrla/atl", note: "Where the city came from, what is on, and how to eat well on nothing." },
];

// On-page anchor targets that each CONTENTS row maps to. Row 02's href points
// at the standalone Brand Kit route, but it has a feature section on the
// landing page, so the Spine jumps to that on-page presence (#brandkit)
// instead of navigating away.
const SPINE_TARGETS = ["paths", "brandkit", "atl"];

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
  // Vue rides the rail. She perks up for a beat each time the reader crosses
  // into a new section, then settles — the rail already knows when that is.
  const [noticed, setNoticed] = useState(false);
  const raf = useRef(0);

  useEffect(() => {
    setNoticed(true);
    const t = setTimeout(() => setNoticed(false), 1400);
    return () => clearTimeout(t);
  }, [active]);

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
        {/* Vue at the head of the fill, descending the rail as you read. The
            track insets 6px top and bottom, so she rides the same span. */}
        <span
          className="ctrla-spine-rider"
          aria-hidden
          style={{ top: `calc(6px + (100% - 12px) * ${progress})` }}
        >
          <VueBust pose="pointing" size={34} mood={noticed ? "alert" : "calm"} />
        </span>
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

// Lock In — the focus space, made a persistent tool instead of a scroll
// section. A dark-glass pill in the same family as the site nav dock (so it
// reads as the platform's own affordance), gold-accented, keycap glyph to
// nod at CTRL-A being a command. Fixed bottom-right, clear of the centered
// dock, summonable from anywhere on the volume. Taps through to the five
// focus worlds at /ctrla/the-fold.
function LockInChip() {
  return (
    <a
      href="/ctrla/the-fold"
      className="ctrla-lockin-chip"
      aria-label="Lock In — enter the focus space"
      style={{
        fontFamily: ed.mono,
        fontSize: "clamp(11px,1.2vw,13px)",
        fontWeight: 700,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: ed.gold,
      }}
    >
      <span className="ctrla-lockin-key" aria-hidden>
        ⌘A
      </span>
      Lock in
    </a>
  );
}

// A zone divider — announces one of the lower-half departments (ATL, The
// Magazine) so the two halves read as distinct zones instead of one long
// scroll. Hairline top, gold kicker, grotesque title, serif deck: the same
// editorial register the rest of the volume speaks in.
// CraftPathways — the home-page "which creative are you?" moment. The four
// crafts are rendered as pathways on a single trail: a colour-graded spine
// links four nodes, each a route a creative walks into their own world
// (the craft landing page). Not a list, a fork in the road.
function CraftPathways() {
  return (
    <section id="paths" style={{ background: "transparent", padding: "clamp(36px,5vw,72px) 0", scrollMarginTop: 0 }}>
      <Bleed>
        {/* The one moment on the page where the reader has to choose a
            direction, so it is the one that gets the guide. Vue stands to the
            left of the question and a gold thread draws from her open hand to
            it — the hand-off, used once. */}
        <VueHandoff pose="showing" height={280}>
          <Kicker color={ed.gold}>Choose your path</Kicker>
          <h2 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(38px,6.6vw,96px)", letterSpacing: "-0.03em", lineHeight: 0.9, color: ed.ink, margin: "clamp(12px,1.6vw,18px) 0 0" }}>
            Which one<br />are you?
          </h2>
          <p style={{ fontFamily: ed.serif, fontStyle: "italic", fontWeight: 400, fontSize: "clamp(18px,2.4vw,32px)", lineHeight: 1.26, color: ed.gold, margin: "clamp(14px,1.8vw,22px) 0 0", maxWidth: 640 }}>
            Four crafts, four ways through CTRL-A. Follow the one you make in.
          </p>
        </VueHandoff>

        <div style={{ position: "relative", marginTop: "clamp(24px,3.2vw,44px)" }}>
          {/* The trail spine — a colour-graded line linking the four routes */}
          <div aria-hidden style={{ position: "absolute", left: "clamp(12px,1.4vw,18px)", top: 30, bottom: 30, width: 2, background: "linear-gradient(180deg,#A56A67,#E3C24A,#4E3D73,#8E76B8)", opacity: 0.55 }} />
          {toolkitSections.map((s) => (
            <a
              key={s.id}
              href={`/ctrla/toolkit/${s.id}`}
              className="ctrla-path-row"
              style={{ ["--acc" as string]: s.accentColor, position: "relative", display: "grid", gridTemplateColumns: "clamp(26px,3vw,40px) 1fr auto", alignItems: "center", gap: "clamp(14px,2.4vw,30px)", padding: "clamp(24px,3.2vw,42px) 0", textDecoration: "none", borderBottom: `1px solid ${ed.hair}` }}
            >
              {/* Node on the spine */}
              <span aria-hidden className="ctrla-path-node" style={{ width: "clamp(14px,1.5vw,18px)", height: "clamp(14px,1.5vw,18px)", borderRadius: 999, border: `2px solid ${s.accentColor}`, background: ed.ground, justifySelf: "start" }} />
              <div style={{ minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
                  <h3 className="ctrla-path-name" style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(30px,5vw,68px)", letterSpacing: "-0.03em", lineHeight: 1, color: ed.ink, margin: 0 }}>{s.title}</h3>
                  {/* Small text on the dark ground is ALWAYS gold (CTRL-A
                      standard; inverted on light backgrounds). The craft
                      accents stay on the nodes and spine only — plum and
                      lavender are illegible as text on this ground. */}
                  <span style={{ fontFamily: ed.mono, fontSize: "clamp(10px,1.1vw,12px)", letterSpacing: "0.14em", textTransform: "uppercase", color: ed.gold }}>{s.pickCount}</span>
                </div>
                <p style={{ fontFamily: ed.mono, fontSize: "clamp(11px,1.2vw,13px)", letterSpacing: "0.06em", color: ed.gold, margin: "12px 0 0" }}>
                  The guide → the toolkit → the history
                </p>
              </div>
              <span className="ctrla-path-cta" style={{ fontFamily: ed.mono, fontSize: "clamp(11px,1.2vw,14px)", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: ed.gold, whiteSpace: "nowrap", justifySelf: "end" }}>
                Enter <span aria-hidden>→</span>
              </span>
            </a>
          ))}
        </div>
      </Bleed>
    </section>
  );
}


// The mission — a spoken thesis. Lives near the foot of the volume as a
// closing statement. Editorial voice: serif teaser, a quiet underlined text
// link, generous air. Its own collapsible, distinct from the index.
function Mission() {
  const [open, setOpen] = useState(false);

  return (
    <section style={{ background: "transparent", padding: "clamp(24px,3.5vw,48px) 0" }}>
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
    <section style={{ background: "transparent", padding: "clamp(20px,3vw,40px) 0 clamp(24px,3.5vw,48px)" }}>
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

      {/* Lock In — persistent focus-space access, summonable from anywhere */}
      <LockInChip />

      {/* Left-rail progress + TOC (desktop) / top hairline (mobile) */}
      <Spine />

      <Masthead />
      <Cover />

      {/* Cover sentinel — the Spine engages once this scrolls out */}
      <div id="ctrla-cover-end" aria-hidden style={{ position: "relative", height: 0 }} />

      {/* The thesis + a map of the volume */}
      <Contents />

      {/* The "which creative are you?" pathways — the crafts entry for the
          whole page. Each route walks into its own landing page
          (/ctrla/toolkit/<craft>), where all that craft's info lives. This
          replaces the old combined "Four Toolkits" section. */}
      <CraftPathways />

      <StickerBelt />

      {/* Standing feature — recurs every volume */}
      <BrandKitFeature />

      {/* THE ROOM — the Discord door. Sits here on purpose: the reader has
          just come through the toolkits and the brand kit, so the work has
          already argued for itself before we ask them to join anything. */}
      <TheRoom />

      {/* ATL COMMUNITY — a door, not a section. The whole local field
          guide (Roots, events, the Map, Cookbook) lives on its own page at
          /ctrla/atl; the home page opens the way in with a postcard: copy
          on the left, a taped-in city shot with the ATL sticker on the right. */}
      <section id="atl" style={{ background: "transparent", padding: "clamp(28px,4vw,56px) 0", scrollMarginTop: 80 }}>
        <Bleed>
          <a
            href="/ctrla/atl"
            className="ctrla-atl-door"
            style={{ display: "block", textDecoration: "none", borderTop: `1px solid ${ed.hair}`, borderBottom: `1px solid ${ed.hair}`, padding: "clamp(28px,4vw,56px) clamp(4px,1vw,14px)" }}
          >
            <div className="ctrla-atl-door-grid">
              {/* Copy column */}
              <div>
                <Kicker color={ed.gold}>CTRL-A · ATL Community</Kicker>
                <h2 className="ctrla-atl-door-name" style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(32px,5vw,72px)", letterSpacing: "-0.03em", lineHeight: 0.92, color: ed.ink, margin: "clamp(14px,1.8vw,20px) 0 0", maxWidth: 640 }}>
                  For the ones coming up in Atlanta.
                </h2>
                <p style={{ fontFamily: ed.serif, fontStyle: "italic", fontWeight: 400, fontSize: "clamp(16px,2vw,26px)", lineHeight: 1.3, color: ed.gold, margin: "clamp(14px,1.8vw,20px) 0 0", maxWidth: 560 }}>
                  Where the city came from, what is on, where to start, and how to eat well on nothing.
                </p>
                <p style={{ fontFamily: ed.mono, fontSize: "clamp(10px,1.1vw,12px)", letterSpacing: "0.08em", textTransform: "uppercase", color: ed.inkFaint, margin: "clamp(14px,1.8vw,20px) 0 0" }}>
                  Roots <span style={{ color: ed.gold }}>→</span> the scene <span style={{ color: ed.gold }}>→</span> the map <span style={{ color: ed.gold }}>→</span> the cookbook
                </p>
                <span className="ctrla-atl-door-cta" style={{ display: "inline-block", fontFamily: ed.mono, fontSize: "clamp(12px,1.3vw,15px)", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: ed.gold, marginTop: "clamp(20px,2.8vw,32px)", borderBottom: `1.5px solid ${ed.gold}`, paddingBottom: 4 }}>
                  Enter ATL <span aria-hidden>→</span>
                </span>
              </div>

              {/* Postcard column — the city shot, taped in, sticker on the corner */}
              <div className="ctrla-atl-postcard" aria-hidden>
                <div style={{ background: ed.paper, padding: "10px 10px 44px", boxShadow: "0 18px 44px rgba(0,0,0,0.45)", position: "relative" }}>
                  <div style={{ position: "relative", width: "100%", aspectRatio: "4 / 3", overflow: "hidden", background: ed.panel }}>
                    <Image src="/ctrla/VOL1/fanfestatl.webp" alt="Fan fest crowd in downtown Atlanta" fill style={{ objectFit: "cover" }} sizes="(max-width: 860px) 100vw, 42vw" />
                  </div>
                  <span style={{ position: "absolute", left: 14, bottom: 13, fontFamily: ed.mono, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(36,18,58,0.75)" }}>
                    Downtown · The city, mid-summer
                  </span>
                  {/* The ATL sticker, slapped on the corner like the belt above */}
                  <div style={{ position: "absolute", right: -22, top: -24, width: "clamp(84px,9vw,124px)", transform: "rotate(9deg)", filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.4))" }}>
                    <Image src="/ctrla/atlsticker.webp" alt="" width={124} height={124} style={{ width: "100%", height: "auto" }} />
                  </div>
                </div>
              </div>
            </div>
          </a>
        </Bleed>
      </section>

      {/* Closing thesis + Vue's note — the sign-off, for everyone */}
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
