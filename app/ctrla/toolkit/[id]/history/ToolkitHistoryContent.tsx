"use client";

// ═══════════════════════════════════════════════════════
// CTRL-A — TOOLKIT HISTORY
// A visual, scroll-driven "history lesson" for a toolkit topic. Not a
// wall of copy: each moment leads with a giant era numeral and a signature
// motif, with one punchy hook line. The deeper story sits behind a "full
// story" expand. One moment can be interactive (the 1980 TR-808 sequencer).
// Loose, alternating rhythm so it reads like a spread, not a table.
// ═══════════════════════════════════════════════════════

import { useEffect, useRef, useState } from "react";
import type { ReactNode, CSSProperties } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { NavigationDock } from "@/components/sections/NavDoc";
import EditorialFooter from "../../../_components/EditorialFooter";
import ToolkitAtmosphere from "../../../_components/ToolkitAtmosphere";
import {
  edLight as ed,
  Bleed,
  Rule,
  Label,
  Kicker,
  SweepText,
  legibleAccent,
} from "../../../_components/editorial";
import { toolkitSections, type HistoryMoment } from "../../../data";
import { currentVolume } from "../../../_volumes";
import { Motif, Interactive, Hero } from "./HistoryMotifs";

// House scroll-reveal, matching the guide components (DevGuide etc.).
function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

// A single moment. Surface stays light: giant era numeral + title + hook +
// motif. Depth (body, quote, why-it-mattered) hides behind an expand.
function MomentPlate({ m, i, accent }: { m: HistoryMoment; i: number; accent: string }) {
  const [open, setOpen] = useState(false);
  const flip = i % 2 === 1;
  const artRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: artRef, offset: ["start end", "end start"] });
  const motifY = useTransform(scrollYProgress, [0, 1], [28, -28]);

  const eraNumeral = m.era && (
    <span
      className="ctrla-hist-era"
      style={{
        fontFamily: ed.grotesque,
        fontWeight: 800,
        fontSize: "clamp(52px, 12vw, 168px)",
        lineHeight: 0.82,
        letterSpacing: "-0.05em",
        color: "transparent",
        WebkitTextStroke: `2px ${accent}`,
        display: "block",
      }}
    >
      {m.era}
    </span>
  );

  const text = (
    <div style={{ maxWidth: 620 }}>
      {eraNumeral}
      <h2
        style={{
          fontFamily: ed.grotesque,
          fontWeight: 800,
          fontSize: "clamp(26px, 3.6vw, 46px)",
          lineHeight: 1.0,
          letterSpacing: "-0.03em",
          color: ed.ink,
          margin: "clamp(10px,1.4vw,18px) 0 0",
        }}
      >
        {m.title}
      </h2>
      {m.hook && (
        <p
          style={{
            fontFamily: ed.body,
            fontSize: "clamp(18px, 2.1vw, 24px)",
            lineHeight: 1.42,
            color: ed.inkSoft,
            margin: "clamp(14px,1.8vw,20px) 0 0",
          }}
        >
          {m.hook}
        </p>
      )}

      {(m.body || m.quote || m.whyItMattered) && (
        <>
          <button
            type="button"
            className="ctrla-hist-more"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            style={{ ["--acc" as string]: accent, marginTop: "clamp(16px,2vw,22px)" } as CSSProperties}
          >
            <Label color={accent}>{open ? "Close" : "The full story"}</Label>
            <span aria-hidden className="ctrla-hist-more-plus" data-open={open ? "true" : "false"} style={{ color: accent }}>
              +
            </span>
          </button>
          <div style={{ display: "grid", gridTemplateRows: open ? "1fr" : "0fr", transition: "grid-template-rows 0.4s cubic-bezier(0.22,1,0.36,1)" }}>
            <div style={{ overflow: "hidden" }}>
              <div style={{ paddingTop: "clamp(14px,2vw,20px)", maxWidth: 600 }}>
                <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.7vw,18px)", lineHeight: 1.62, color: ed.inkSoft, margin: 0 }}>
                  {m.body}
                </p>
                {m.quote && (
                  <figure style={{ margin: "clamp(16px,2vw,22px) 0 0", paddingLeft: 18, borderLeft: `2px solid ${accent}` }}>
                    <blockquote style={{ fontFamily: ed.serif, fontStyle: "italic", fontSize: "clamp(18px,2.2vw,24px)", lineHeight: 1.3, color: ed.ink, margin: 0 }}>
                      “{m.quote.text}”
                    </blockquote>
                    {m.quote.attribution && (
                      <figcaption style={{ marginTop: 10 }}>
                        <Label color={ed.inkFaint}>{m.quote.attribution}</Label>
                      </figcaption>
                    )}
                  </figure>
                )}
                {m.whyItMattered && (
                  <div style={{ margin: "clamp(16px,2vw,22px) 0 0", paddingTop: 14, borderTop: `2px solid ${accent}` }}>
                    <Label color={accent} style={{ display: "block", marginBottom: 8 }}>
                      Why it mattered
                    </Label>
                    <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.7vw,18px)", lineHeight: 1.6, color: ed.inkSoft, margin: 0 }}>
                      {m.whyItMattered}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  // Interactive moment: text, then the full-width playable widget beneath it.
  if (m.interactive) {
    return (
      <article ref={artRef} id={`m-${i}`} style={{ scrollMarginTop: 90 }}>
        <Reveal>{text}</Reveal>
        <Reveal delay={0.08}>
          <div style={{ marginTop: "clamp(28px,4vw,44px)" }}>
            <Interactive kind={m.interactive} accent={accent} />
          </div>
        </Reveal>
      </article>
    );
  }

  const motifCell = m.motif && (
    <motion.div style={{ y: motifY, display: "flex", justifyContent: "center", alignItems: "center", padding: "clamp(8px,2vw,24px)" }}>
      <Motif kind={m.motif} accent={accent} />
    </motion.div>
  );

  return (
    <article
      ref={artRef}
      id={`m-${i}`}
      style={{
        scrollMarginTop: 90,
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.05fr)",
        gap: "clamp(20px,4vw,56px)",
        alignItems: "center",
      }}
      className="ctrla-hist-plate"
    >
      <Reveal delay={flip ? 0.08 : 0}>
        <div style={{ order: flip ? 2 : 1 }}>{motifCell}</div>
      </Reveal>
      <Reveal delay={flip ? 0 : 0.08}>
        <div style={{ order: flip ? 1 : 2 }}>{text}</div>
      </Reveal>
    </article>
  );
}

export default function ToolkitHistoryContent({ id }: { id: string }) {
  const section = toolkitSections.find((s) => s.id === id);
  const [active, setActive] = useState(0);
  const railRef = useRef<HTMLDivElement | null>(null);
  const momentCount = section?.history?.moments.length ?? 0;

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

  // Track which moment is centered in the viewport, to light the era rail.
  useEffect(() => {
    if (!momentCount) return;
    const els = Array.from({ length: momentCount }, (_, i) => document.getElementById(`m-${i}`)).filter(
      (e): e is HTMLElement => !!e
    );
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = Number((e.target as HTMLElement).id.split("-")[1]);
            if (!Number.isNaN(idx)) setActive(idx);
          }
        });
      },
      { rootMargin: "-48% 0px -48% 0px", threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [momentCount]);

  // Keep the active era centered in the horizontal rail.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const item = rail.querySelector<HTMLElement>(`[data-idx="${active}"]`);
    if (item) rail.scrollTo({ left: item.offsetLeft - rail.clientWidth / 2 + item.clientWidth / 2, behavior: "smooth" });
  }, [active]);

  if (!section?.history) return null;
  const history = section.history;
  const pageAccent = legibleAccent(section.accentColor);

  return (
    <div className="ctrla-light" style={{ background: "transparent", minHeight: "100vh", width: "100%", overflowX: "hidden" }}>
      <ToolkitAtmosphere />
      <NavigationDock />

      {/* Signature accent bar */}
      <div aria-hidden style={{ height: 3, background: pageAccent }} />

      {/* Back-nav masthead */}
      <div style={{ background: "transparent", position: "relative", zIndex: 5 }}>
        <Bleed style={{ padding: "12px clamp(18px,5vw,64px)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <a href={`/ctrla/toolkit/${id}`} className="ctrla-back" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
              <span style={{ color: pageAccent }}>←</span>
              <Label color={ed.ink}>{section.title} Toolkit</Label>
            </a>
            <Label color={pageAccent}>A history lesson</Label>
          </div>
        </Bleed>
        <Rule color={ed.hair} />
      </div>

      {/* Hero */}
      <section style={{ background: "transparent", position: "relative", zIndex: 5, padding: "clamp(44px,8vw,104px) 0 clamp(24px,4vw,44px)" }}>
        <Bleed>
          <Reveal>
            <Kicker color={pageAccent}>CTRL-A · {currentVolume.issueMeta.volume} · {history.entryLabel}</Kicker>
          </Reveal>
          <Reveal delay={0.06}>
            <h1
              style={{
                fontFamily: ed.grotesque,
                fontWeight: 800,
                fontSize: "clamp(44px, 9vw, 128px)",
                lineHeight: 0.9,
                letterSpacing: "-0.04em",
                color: ed.ink,
                margin: "clamp(16px,2vw,26px) 0 0",
                maxWidth: 1100,
              }}
            >
              <SweepText>{history.title}</SweepText>
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p
              style={{
                fontFamily: ed.body,
                fontSize: "clamp(18px, 2.3vw, 26px)",
                lineHeight: 1.5,
                color: ed.inkSoft,
                margin: "clamp(20px,3vw,30px) 0 0",
                maxWidth: 720,
              }}
            >
              {history.lede}
            </p>
          </Reveal>
        </Bleed>
        {/* Signature animated opening, bespoke per toolkit */}
        <div style={{ marginTop: "clamp(24px,4vw,48px)" }}>
          <Hero topic={id} accent={pageAccent} />
        </div>
      </section>

      {/* Era rail — a visual timeline overview + jump nav */}
      <section style={{ background: "transparent", position: "relative", zIndex: 5, padding: "clamp(8px,1.5vw,16px) 0 clamp(28px,4vw,52px)" }}>
        <Bleed>
          <Reveal>
            <div ref={railRef} className="ctrla-hist-rail" style={{ ["--acc" as string]: pageAccent } as CSSProperties}>
              {history.moments.map((m, i) => (
                <a key={m.title} href={`#m-${i}`} data-idx={i} data-active={active === i ? "true" : "false"} className="ctrla-hist-rail-item">
                  <span className="ctrla-hist-rail-dot" />
                  <span className="ctrla-hist-rail-era">{m.era}</span>
                </a>
              ))}
            </div>
          </Reveal>
        </Bleed>
      </section>

      {/* Moments */}
      <section style={{ background: "transparent", position: "relative", zIndex: 5, paddingBottom: "clamp(40px,6vw,80px)" }}>
        <Bleed>
          {history.moments.map((m, i) => (
            <div key={m.title}>
              {i > 0 && <Rule color={ed.hair} style={{ margin: "clamp(44px,6vw,88px) 0" }} />}
              <MomentPlate m={m} i={i} accent={pageAccent} />
            </div>
          ))}
        </Bleed>
      </section>

      {/* Closer */}
      {history.closer && (
        <section style={{ background: "transparent", position: "relative", zIndex: 5, padding: "clamp(24px,4vw,48px) 0 clamp(64px,10vw,128px)" }}>
          <Bleed>
            <Rule color={ed.hair} style={{ marginBottom: "clamp(36px,5vw,64px)" }} />
            <Reveal>
              <Kicker color={pageAccent} style={{ marginBottom: 22 }}>The takeaway</Kicker>
              <p
                style={{
                  fontFamily: ed.grotesque,
                  fontWeight: 800,
                  fontSize: "clamp(26px, 4.2vw, 56px)",
                  lineHeight: 1.04,
                  letterSpacing: "-0.03em",
                  color: ed.ink,
                  margin: 0,
                  maxWidth: 1000,
                }}
              >
                {history.closer}
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <a
                href={`/ctrla/toolkit/${id}`}
                className="ctrla-back"
                style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none", marginTop: "clamp(28px,4vw,44px)" }}
              >
                <span style={{ color: pageAccent }}>←</span>
                <span style={{ fontFamily: ed.grotesque, fontWeight: 700, fontSize: "clamp(15px,1.7vw,19px)", letterSpacing: "-0.01em", color: ed.ink }}>
                  Back to the {section.title} toolkit
                </span>
              </a>
            </Reveal>
          </Bleed>
        </section>
      )}

      <EditorialFooter />
    </div>
  );
}
