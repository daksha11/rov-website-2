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

// A small glyph per signal kind so the feed reads visually, not just as text.
const kindGlyph = (k: SignalKind) => (k === "Release" ? "▲" : k === "Shift" ? "⇄" : k === "Trend" ? "↗" : "●");

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
  // Featured-first: the list view opens with the top three stations as a
  // single row of compact cards and a library CTA, instead of every tool
  // stacked (which ran many screens deep). Opening the library reveals the
  // full detailed stations. The flow view still shows the whole chain.
  const FEATURED = 3;
  const [expanded, setExpanded] = useState(false);
  const listTools = expanded ? tools : [];
  const featured = tools.slice(0, FEATURED);
  const hiddenTools = tools.slice(FEATURED);
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
  }, [listTools.length, view]);

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
                  style={{ borderTop: `2px solid ${kndColor(s.kind)}`, background: `linear-gradient(180deg, ${kndColor(s.kind)}14 0%, transparent 42%)` }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 12 }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                      <span
                        aria-hidden
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 24,
                          height: 24,
                          borderRadius: 6,
                          border: `1px solid ${kndColor(s.kind)}`,
                          color: kndColor(s.kind),
                          fontSize: 11,
                          lineHeight: 1,
                          flexShrink: 0,
                        }}
                      >
                        {kindGlyph(s.kind)}
                      </span>
                      <span style={{ fontFamily: ed.mono, fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: kndColor(s.kind) }}>{s.kind}</span>
                    </span>
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
        <div
          className="ctrla-stations"
          style={{
            marginTop: "clamp(40px,5vw,64px)",
            // Collapsed featured row has no rail — let the cards take the full width.
            ...(view === "list" && !expanded ? { gridTemplateColumns: "1fr" } : {}),
          }}
          data-view={view}
        >
          {/* Rail — expanded list view only (the featured row needs no rail) */}
          {view === "list" && expanded && (
          <aside className="ctrla-station-rail" aria-hidden>
            <div className="ctrla-rail-line" />
            {listTools.map((t, i) => (
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
            {/* DAW note — one editorial line, names as quiet inline links.
                (Was a pill-grid "chooser" that chose nothing; the advice IS
                "it does not matter", so it reads as one line now.) */}
            {daws && daws.length > 0 && (
              <div style={{ marginBottom: "clamp(32px,4.5vw,56px)" }}>
                {section.dawNote && (
                  <p style={{ fontFamily: ed.serif, fontStyle: "normal", fontSize: "clamp(16px,1.9vw,22px)", lineHeight: 1.5, color: ed.ink, margin: 0, maxWidth: 680 }}>
                    {section.dawNote}
                  </p>
                )}
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "8px 18px", marginTop: 14 }}>
                  <Label color={ed.inkFaint}>The DAWs</Label>
                  {daws.map((d) => (
                    <a
                      key={d.name}
                      href={d.url || "#"}
                      {...(d.url ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      style={{
                        fontFamily: ed.mono,
                        fontSize: 11,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: d.ours ? accent : ed.inkSoft,
                        textDecoration: "none",
                        borderBottom: `1px solid ${d.ours ? accent : ed.hair}`,
                        paddingBottom: 2,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {d.name}{d.ours ? " · ours" : ""}
                    </a>
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "clamp(28px,3.6vw,44px) 0 0" }}>
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

            {/* ── Featured row: top three stations, side by side ── */}
            {view === "list" && !expanded && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "0 0 clamp(16px,2vw,24px)" }}>
                  <span style={{ fontFamily: ed.mono, fontSize: "clamp(11px,1.25vw,14px)", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: accent, whiteSpace: "nowrap" }}>Featured · start here</span>
                  <span style={{ flex: 1, height: 1, background: ed.hair }} />
                </div>
                <div className="ctrla-feat-grid">
                  {featured.map((t, i) => (
                    <div
                      key={t.name}
                      role="link"
                      tabIndex={0}
                      onClick={(e) => {
                        // The preview's fallback renders its own link; don't double-fire.
                        if (!(e.target as Element).closest("a")) window.open(t.url, "_blank", "noopener,noreferrer");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") window.open(t.url, "_blank", "noopener,noreferrer");
                      }}
                      className="ctrla-feat-card"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        background: ed.panel,
                        border: `1px solid ${ed.hair}`,
                        borderTop: `3px solid ${accent}`,
                        borderRadius: 14,
                        padding: "clamp(16px,2vw,22px)",
                        textDecoration: "none",
                        minWidth: 0,
                        cursor: "pointer",
                      }}
                    >
                      {/* Live look at the tool — the card leads with a visual */}
                      <div style={{ position: "relative", aspectRatio: "16 / 10", borderRadius: 10, overflow: "hidden", border: `1px solid ${ed.hair}`, marginBottom: 16 }}>
                        <ToolPreview url={t.url} name={t.name} accent={accent} embeddable={t.embeddable} preview={t.preview} theme={ed} />
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
                        <span style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(26px,3vw,40px)", lineHeight: 0.8, letterSpacing: "-0.04em", color: `${accent}${isLight ? "AA" : "55"}` }}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {t.level && (
                          <span style={{ fontFamily: ed.mono, fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: lvlColor(t.level), border: `1px solid ${lvlColor(t.level)}`, padding: "4px 10px", borderRadius: 2, flexShrink: 0 }}>
                            {t.level}
                          </span>
                        )}
                      </div>
                      <h3 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(22px,2.4vw,30px)", letterSpacing: "-0.02em", lineHeight: 1, color: ed.ink, margin: "0 0 10px" }}>
                        {t.name}
                      </h3>
                      <p
                        style={{
                          fontFamily: ed.serif,
                          fontSize: "clamp(14px,1.5vw,17px)",
                          lineHeight: 1.45,
                          color: ed.inkSoft,
                          margin: "0 0 18px",
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {t.oneLiner || t.description}
                      </p>
                      <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                        <Label color={ed.inkFaint}>{t.category}</Label>
                        <a
                          href={t.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontFamily: ed.mono, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: accent, whiteSpace: "nowrap", textDecoration: "none" }}
                        >
                          Open <span aria-hidden>↗</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {view === "list" && listTools.map((t, i) => {
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

            {/* ── Full library CTA: the rest of the rack, one click away ── */}
            {view === "list" && !expanded && hiddenTools.length > 0 && (
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="ctrla-course-strip"
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  cursor: "pointer",
                  border: "none",
                  borderTop: `3px solid ${accent}`,
                  background: `${accent}0D`,
                  marginTop: "clamp(28px,4vw,44px)",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
                  <div style={{ maxWidth: 720 }}>
                    <Kicker color={accent}>The full tool library</Kicker>
                    <h3 style={{ fontFamily: ed.grotesque, fontWeight: 800, fontSize: "clamp(24px,3.6vw,44px)", letterSpacing: "-0.03em", lineHeight: 0.96, color: ed.ink, margin: "12px 0 14px" }}>
                      {hiddenTools.length} more stations, in order of use
                    </h3>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {hiddenTools.map((t) => (
                        <span key={t.name} style={{ fontFamily: ed.mono, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: ed.inkSoft, border: `1px solid ${ed.hair}`, borderRadius: 999, padding: "5px 12px" }}>
                          {t.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span style={{ fontFamily: ed.grotesque, fontWeight: 700, fontSize: "clamp(14px,1.6vw,18px)", letterSpacing: "-0.01em", color: accent, display: "inline-flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}>
                    Open the library <span className="ctrla-course-arrow" aria-hidden>→</span>
                  </span>
                </div>
              </button>
            )}

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
