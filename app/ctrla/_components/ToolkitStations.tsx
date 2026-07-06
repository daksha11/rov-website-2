"use client";

// ═══════════════════════════════════════════════════════
// CTRL-A — TOOLKIT STATIONS (immersive edutainment, Phase 1)
// Each tool is a calm, bite-size "station": one-liner, when
// to reach for it, what it pairs with, a demo slot, and
// optional depth on demand. A level filter keeps it from
// overwhelming; a constellation rail tracks where you are;
// a Signals feed keeps the sector current. Flagship: Web Dev.
// ═══════════════════════════════════════════════════════

import { Fragment, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ed as edBase, edLight, Bleed, Label, Kicker, legibleAccent, legibleAccentDeep } from "./editorial";
import ToolPreview from "./ToolPreview";
import { toolkitSections } from "../data";
import type { ToolkitSection, ToolLevel, SignalKind } from "../data";

// Level/kind colours are accents (theme-independent), so they stay on the base.
const levelColor = (l?: ToolLevel) =>
  l === "Beginner" ? edBase.gold : l === "Intermediate" ? edBase.amber : l === "Pro" ? edBase.plum : edBase.inkFaint;

const kindColor = (k: SignalKind) =>
  k === "Release" ? edBase.gold : k === "Shift" ? edBase.amber : k === "Trend" ? edBase.plum : edBase.inkFaint;

export default function ToolkitStations({ section, theme, hideKicker = false }: { section: ToolkitSection; theme?: typeof edBase; hideKicker?: boolean }) {
  // Shadow `ed` with the active theme so every token below re-themes for free.
  const ed = theme ?? edBase;
  // On the cream light theme, gold accents are illegible — remap them.
  const isLight = ed.ground === edLight.ground;
  const accent = isLight ? legibleAccent(section.accentColor) : section.accentColor;
  // Theme-aware level/kind colours (gold → deep ink-panel on cream).
  const lvlColor = (l?: ToolLevel) => (isLight ? legibleAccentDeep(levelColor(l)) : levelColor(l));
  const kndColor = (k: SignalKind) => (isLight ? legibleAccentDeep(kindColor(k)) : kindColor(k));
  const [open, setOpen] = useState<string | null>(null);
  const [active, setActive] = useState(0);
  // List = full detailed stations; Flow = compressed signal chain on one view.
  const [view, setView] = useState<"list" | "flow">("list");

  // Workflow split: a DAW-led toolkit (music) opens with a compact "pick your
  // DAW" chooser, then the plugin stack in order. The DAW-category tools are
  // dropped from the station list so they are not duplicated as full stations.
  const daws = section.daws;
  const tools = daws ? section.tools.filter((t) => t.category !== "DAW") : section.tools;
  const stationRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Scroll-spy: highlight the station nearest the centre of the viewport.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const i = Number((e.target as HTMLElement).dataset.idx);
            if (!Number.isNaN(i)) setActive(i);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    stationRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [tools.length]);

  const scrollTo = (i: number) => {
    stationRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  // List / Flow view switch
  const viewToggle = (
    <div style={{ display: "inline-flex", flexShrink: 0, border: `1px solid ${ed.hair}`, borderRadius: 999, overflow: "hidden" }}>
      {(["list", "flow"] as const).map((v) => {
        const on = view === v;
        return (
          <button
            key={v}
            onClick={() => setView(v)}
            aria-pressed={on}
            style={{
              fontFamily: ed.mono,
              fontSize: "clamp(9px,1vw,11px)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: on ? ed.ground : ed.inkFaint,
              background: on ? accent : "transparent",
              border: "none",
              padding: "7px 15px",
              cursor: "pointer",
            }}
          >
            {v === "list" ? "List" : "Flow"}
          </button>
        );
      })}
    </div>
  );

  return (
    <section style={{ background: "transparent", padding: "clamp(40px,6vw,72px) 0 clamp(64px,9vw,120px)" }}>
      <Bleed>
        {/* ── Sector header ── */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
          <div style={{ maxWidth: 720 }}>
            {!hideKicker && <Kicker color={accent}>Sector {section.pageNumber} · Tool Stations</Kicker>}
            <h2
              style={{
                fontFamily: ed.grotesque,
                fontWeight: 800,
                fontSize: "clamp(40px,7vw,92px)",
                letterSpacing: "-0.03em",
                lineHeight: 0.9,
                color: ed.ink,
                margin: "14px 0 16px",
              }}
            >
              {section.title}<span style={{ color: accent }}>.</span>
            </h2>
            <p style={{ fontFamily: ed.body, fontSize: "clamp(15px,1.7vw,19px)", lineHeight: 1.6, color: ed.inkSoft, margin: 0, maxWidth: 560 }}>
              {section.intro}
            </p>
          </div>
          <span style={{ fontFamily: ed.mono, fontSize: "clamp(10px,1.1vw,12px)", letterSpacing: "0.18em", textTransform: "uppercase", color: ed.inkFaint }}>
            {section.pickCount} · {section.cadence}
          </span>
        </div>

        {/* ── Signals feed (stay current) ── */}
        {section.signals && section.signals.length > 0 && (
          <div style={{ marginTop: "clamp(36px,5vw,56px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: accent, boxShadow: `0 0 10px ${accent}` }} />
              <Label color={ed.ink}>Industry Signals · what shifted lately</Label>
            </div>
            <div className="ctrla-signals">
              {section.signals.map((s) => (
                <a
                  key={s.title}
                  href={s.url || "#"}
                  {...(s.url ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="ctrla-signal"
                  style={{ borderTop: `2px solid ${kndColor(s.kind)}` }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
                    <span style={{ fontFamily: ed.mono, fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: kndColor(s.kind) }}>{s.kind}</span>
                    <span style={{ fontFamily: ed.mono, fontSize: 9, letterSpacing: "0.1em", color: ed.inkFaint }}>{s.date}</span>
                  </div>
                  <h4 style={{ fontFamily: ed.grotesque, fontWeight: 700, fontSize: "clamp(15px,1.6vw,18px)", letterSpacing: "-0.01em", color: ed.ink, margin: "0 0 8px" }}>{s.title}</h4>
                  <p style={{ fontFamily: ed.body, fontSize: "clamp(13px,1.4vw,14px)", lineHeight: 1.55, color: ed.inkSoft, margin: 0 }}>{s.note}</p>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ── Constellation rail + stations ── */}
        <div className="ctrla-stations" style={{ marginTop: "clamp(40px,5vw,64px)" }} data-view={view}>
          {/* Rail — list view only */}
          {view === "list" && (
          <aside className="ctrla-station-rail" aria-hidden>
            <div className="ctrla-rail-line" />
            {tools.map((t, i) => (
              <button
                key={t.name}
                onClick={() => scrollTo(i)}
                className="ctrla-rail-dot"
                title={t.name}
                style={{
                  background: i === active ? accent : "transparent",
                  borderColor: i === active ? accent : ed.hair,
                  boxShadow: i === active ? `0 0 12px ${accent}` : "none",
                }}
              />
            ))}
          </aside>
          )}

          {/* Stations */}
          <div>
            {/* DAW chooser — pick one, then the plugin stack */}
            {daws && daws.length > 0 && (
              <div style={{ marginBottom: "clamp(36px,5vw,64px)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "0 0 clamp(18px,2.2vw,26px)" }}>
                  <span style={{ fontFamily: ed.mono, fontSize: "clamp(11px,1.25vw,14px)", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: accent, whiteSpace: "nowrap" }}>Pick your DAW</span>
                  <span style={{ flex: 1, height: 1, background: ed.hair }} />
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(8px,1vw,12px)" }}>
                  {daws.map((d) => (
                    <a
                      key={d.name}
                      href={d.url || "#"}
                      {...(d.url ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        fontFamily: ed.grotesque,
                        fontWeight: 700,
                        fontSize: "clamp(15px,1.7vw,20px)",
                        letterSpacing: "-0.01em",
                        color: d.ours ? ed.ground : ed.ink,
                        background: d.ours ? accent : "transparent",
                        border: `1.5px solid ${d.ours ? accent : ed.hair}`,
                        borderRadius: 999,
                        padding: "clamp(9px,1.1vw,13px) clamp(16px,1.8vw,22px)",
                        textDecoration: "none",
                      }}
                    >
                      {d.name}
                      {d.ours && <span style={{ fontFamily: ed.mono, fontWeight: 400, fontSize: "clamp(8px,0.9vw,10px)", letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.85 }}>our pick</span>}
                    </a>
                  ))}
                </div>
                {section.dawNote && (
                  <p style={{ fontFamily: ed.body, fontStyle: "normal", fontSize: "clamp(15px,1.7vw,20px)", lineHeight: 1.5, color: ed.inkSoft, margin: "clamp(16px,2vw,22px) 0 0", maxWidth: 620 }}>
                    {section.dawNote}
                  </p>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "clamp(36px,5vw,60px) 0 0" }}>
                  <span style={{ fontFamily: ed.mono, fontSize: "clamp(11px,1.25vw,14px)", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: accent, whiteSpace: "nowrap" }}>The plugin stack · in order of use</span>
                  <span style={{ flex: 1, height: 1, background: ed.hair }} />
                  {viewToggle}
                </div>
              </div>
            )}

            {/* View switch for toolkits with no DAW chooser */}
            {!daws && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", marginBottom: "clamp(20px,3vw,32px)" }}>
                {viewToggle}
              </div>
            )}

            {/* ── Compressed flow view: the whole chain on one screen ── */}
            {view === "flow" && (
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "stretch", gap: "10px 8px" }}>
                <span style={{ alignSelf: "center", fontFamily: ed.mono, fontSize: "clamp(9px,1vw,11px)", letterSpacing: "0.14em", textTransform: "uppercase", color: ed.inkFaint }}>Signal in</span>
                {tools.map((t, i) => (
                  <Fragment key={t.name}>
                    <span aria-hidden style={{ alignSelf: "center", color: accent, fontSize: 18, lineHeight: 1 }}>→</span>
                    <a
                      href={t.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={t.oneLiner || t.description}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                        minWidth: 128,
                        padding: "10px 14px",
                        borderRadius: 10,
                        border: `1px solid ${ed.hair}`,
                        borderTop: `2px solid ${accent}`,
                        background: ed.panel,
                        textDecoration: "none",
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                        <span style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: 12, color: accent }}>{String(i + 1).padStart(2, "0")}</span>
                        <span style={{ fontFamily: ed.grotesque, fontWeight: 700, fontSize: "clamp(14px,1.5vw,17px)", letterSpacing: "-0.01em", color: ed.ink }}>{t.name}</span>
                      </span>
                      <span style={{ fontFamily: ed.mono, fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: ed.inkFaint }}>{t.category}</span>
                    </a>
                  </Fragment>
                ))}
                <span aria-hidden style={{ alignSelf: "center", color: accent, fontSize: 18, lineHeight: 1 }}>→</span>
                <span style={{ alignSelf: "center", fontFamily: ed.mono, fontSize: "clamp(9px,1vw,11px)", letterSpacing: "0.14em", textTransform: "uppercase", color: ed.inkFaint }}>Release</span>
              </div>
            )}

            {view === "list" && tools.map((t, i) => {
              const isOpen = open === t.name;
              return (
                <Fragment key={t.name}>
                <motion.div
                  data-idx={i}
                  ref={(el) => { stationRefs.current[i] = el; }}
                  className="ctrla-station"
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    // Active station lights its left edge in the sector accent.
                    borderLeft: `2px solid ${i === active ? accent : "transparent"}`,
                    paddingLeft: "clamp(18px,2.5vw,32px)",
                    transition: "border-color 0.4s ease",
                  }}
                >
                  {/* Head: index + category + level */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 14 }}>
                    <span style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(34px,5vw,64px)", lineHeight: 0.8, letterSpacing: "-0.04em", color: `${accent}${isLight ? "AA" : "55"}` }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Label color={ed.inkFaint}>{t.category}</Label>
                      {t.level && (
                        <span style={{ fontFamily: ed.mono, fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: lvlColor(t.level), border: `1px solid ${lvlColor(t.level)}`, padding: "4px 10px", borderRadius: 2 }}>
                          {t.level}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Name + one-liner */}
                  <h3 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(30px,4.4vw,56px)", letterSpacing: "-0.02em", lineHeight: 0.96, color: ed.ink, margin: "0 0 14px" }}>
                    {t.name}
                  </h3>
                  <p style={{ fontFamily: ed.serif, fontStyle: "normal", fontSize: "clamp(17px,2vw,26px)", lineHeight: 1.4, color: ed.ink, margin: "0 0 22px", maxWidth: 640 }}>
                    {t.oneLiner || t.description}
                  </p>

                  {/* Body: when-to-use / pairs / depth  +  demo slot */}
                  <div className="ctrla-station-body">
                    <div>
                      {t.whenToUse && (
                        <>
                          <Label color={accent} style={{ display: "block", marginBottom: 8 }}>When to reach for it</Label>
                          <p style={{ fontFamily: ed.body, fontSize: "clamp(14px,1.5vw,16px)", lineHeight: 1.6, color: ed.inkSoft, margin: "0 0 20px", maxWidth: 460 }}>{t.whenToUse}</p>
                        </>
                      )}

                      {t.pairsWith && t.pairsWith.length > 0 && (
                        <div style={{ marginBottom: 22 }}>
                          <Label color={ed.inkFaint} style={{ display: "block", marginBottom: 8 }}>Pairs with</Label>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                            {t.pairsWith.map((p) => (
                              <span key={p} style={{ fontFamily: ed.mono, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: ed.inkSoft, border: `1px solid ${ed.hair}`, padding: "5px 11px" }}>{p}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                        <button
                          onClick={() => setOpen(isOpen ? null : t.name)}
                          className="ctrla-station-more"
                          style={{ fontFamily: ed.mono, fontSize: "clamp(10px,1.1vw,12px)", letterSpacing: "0.14em", textTransform: "uppercase", color: accent, background: "transparent", border: "none", cursor: "pointer", padding: 0, display: "inline-flex", alignItems: "center", gap: 8 }}
                        >
                          {isOpen ? "Less" : "Go deeper"} <span aria-hidden style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .2s" }}>↓</span>
                        </button>
                        <a href={t.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: ed.mono, fontSize: "clamp(10px,1.1vw,12px)", letterSpacing: "0.14em", textTransform: "uppercase", color: ed.ink, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
                          Open {t.name} <span aria-hidden>↗</span>
                        </a>
                      </div>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: "easeInOut" }}
                            style={{ overflow: "hidden" }}
                          >
                            <div style={{ paddingTop: 22, marginTop: 22, borderTop: `1px solid ${ed.hair}` }}>
                              <p style={{ fontFamily: ed.body, fontSize: "clamp(14px,1.5vw,16px)", lineHeight: 1.65, color: ed.inkSoft, margin: 0, maxWidth: 540 }}>{t.description}</p>
                              {t.favoriteBy && (
                                <div style={{ marginTop: 18, paddingLeft: 16, borderLeft: `2px solid ${accent}` }}>
                                  <Label color={accent} style={{ display: "block", marginBottom: 6 }}>ROV Pick · {t.favoriteBy}</Label>
                                  <p style={{ fontFamily: ed.serif, fontStyle: "normal", fontSize: "clamp(14px,1.5vw,17px)", lineHeight: 1.5, color: ed.ink, margin: 0, maxWidth: 520 }}>&ldquo;{t.favoriteQuote}&rdquo;</p>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Live look at the tool's own site, in a CTRL-A frame */}
                    <div
                      className="ctrla-station-demo"
                      style={{ position: "relative", background: ed.panel, border: `1px solid ${ed.hair}` }}
                    >
                      <ToolPreview url={t.url} name={t.name} accent={accent} embeddable={t.embeddable} preview={t.preview} theme={ed} />
                    </div>
                  </div>
                </motion.div>
                </Fragment>
              );
            })}

            {tools.length === 0 && (
              <p style={{ fontFamily: ed.body, fontStyle: "normal", fontSize: 18, color: ed.inkSoft }}>
                No tools at this level yet. Try another.
              </p>
            )}
          </div>
        </div>

        {/* ── Also in the kit: quiet editorial cross-refs to the sibling toolkits ── */}
        {section.crossRefs && section.crossRefs.length > 0 && (
          <div style={{ marginTop: "clamp(48px,7vw,88px)", maxWidth: 720 }}>
            <Label color={ed.inkFaint} style={{ display: "block", marginBottom: "clamp(16px,2vw,24px)" }}>
              Also in the kit
            </Label>
            <div style={{ display: "flex", flexDirection: "column", gap: "clamp(14px,1.8vw,20px)" }}>
              {section.crossRefs.slice(0, 3).map((ref) => {
                const dest = toolkitSections.find((s) => s.id === ref.toolkit);
                const destTitle = dest ? dest.title : ref.toolkit;
                return (
                  <a
                    key={`${ref.toolkit}-${ref.toolName}`}
                    href={`/ctrla/toolkit/${ref.toolkit}`}
                    className="ctrla-crossref"
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: 12,
                      textDecoration: "none",
                    }}
                  >
                    <span aria-hidden style={{ color: accent, fontFamily: ed.mono, fontSize: "clamp(15px,1.7vw,20px)", lineHeight: 1.4, flexShrink: 0 }}>
                      →
                    </span>
                    <span style={{ fontFamily: ed.serif, fontStyle: "normal", fontSize: "clamp(16px,1.9vw,22px)", lineHeight: 1.45, color: ed.inkSoft }}>
                      {ref.line}
                      <span style={{ fontFamily: ed.mono, fontStyle: "normal", fontSize: "clamp(9px,1vw,11px)", letterSpacing: "0.12em", textTransform: "uppercase", color: accent, marginLeft: 10, whiteSpace: "nowrap" }}>
                        {destTitle} kit
                      </span>
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </Bleed>
    </section>
  );
}
