"use client";

import { motion, useInView } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { NavigationDock } from "@/components/NavDoc";
import CtrlAFooter from "@/components/CtrlAFooter";
import { toolkitSections, type ToolkitSection, type Tool, type Misconception, type GuideStep } from "./data";

const HEADING = "Norwige, sans-serif";
const BODY = "'Roboto', sans-serif";
const DISPLAY = "Pagaki, sans-serif";
const spring = { type: "spring" as const, stiffness: 100, damping: 20 };

// ═══════════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════════

function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? "");
  useEffect(() => {
    const handler = () => {
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom > 200) {
            setActive(id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, [ids]);
  return active;
}

// ═══════════════════════════════════════════════════════
// COVER
// ═══════════════════════════════════════════════════════

function Cover() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ padding: "clamp(80px, 15vw, 200px) clamp(16px, 5vw, 60px)" }}
    >
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(234,154,97,0.05) 0%, transparent 60%)" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ ...spring, delay: 0.1 }}
        className="relative z-10 text-center max-w-4xl"
      >
        <span
          className="block text-[10px] uppercase tracking-[0.5em] text-white/30 mb-6"
          style={{ fontFamily: BODY }}
        >
          CTRL A Presents
        </span>

        <h1
          className="text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] font-bold italic leading-[0.85] mb-6"
          style={{ fontFamily: HEADING }}
        >
          <span className="text-white">The</span>
          <br />
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(112deg, #EA9A61 6.46%, #B16937 34.96%, #A64D2B 63.88%, #42201C 97.63%)" }}
          >
            Toolkit
          </span>
        </h1>

        <div className="flex items-center justify-center gap-4 text-white/20 text-xs uppercase tracking-[0.3em] mb-10" style={{ fontFamily: BODY }}>
          <span>Issue 01</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span>2024</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span>Community Curated</span>
        </div>

        <p
          className="text-white/40 text-base md:text-lg leading-relaxed max-w-xl mx-auto"
          style={{ fontFamily: BODY }}
        >
          The internet has too much noise. This is the signal. Handpicked tools, real use cases,
          and honest opinions from creatives who ship — not influencers who promote.
        </p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-white/20 text-[10px] uppercase tracking-[0.3em]" style={{ fontFamily: BODY }}>
          Scroll
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
      </motion.div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════
// TABLE OF CONTENTS
// ═══════════════════════════════════════════════════════

function TableOfContents() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={ref}
      id="toc"
      className="relative"
      style={{ padding: "clamp(60px, 10vw, 120px) clamp(16px, 5vw, 60px)" }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={spring}
          className="block text-xs uppercase tracking-[0.3em] text-[#EA9A61] mb-12"
          style={{ fontFamily: BODY }}
        >
          Contents
        </motion.span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {toolkitSections.map((section, i) => (
            <motion.button
              key={section.id}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ ...spring, delay: i * 0.12 }}
              onClick={() => scrollTo(section.id)}
              className="group text-left p-6 md:p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] transition-all duration-500 cursor-pointer"
            >
              {/* Large page number */}
              <span
                className="block text-6xl md:text-7xl lg:text-8xl font-bold italic leading-none mb-4 transition-colors duration-500"
                style={{ fontFamily: DISPLAY, color: `${section.accentColor}20` }}
              >
                {section.pageNumber}
              </span>

              <h2
                className="text-white text-2xl md:text-3xl font-bold italic mb-3 group-hover:text-[#EA9A61] transition-colors duration-300"
                style={{ fontFamily: HEADING }}
              >
                {section.title}
              </h2>

              <p className="text-white/40 text-sm leading-relaxed line-clamp-3" style={{ fontFamily: BODY }}>
                {section.intro}
              </p>

              {/* Tool count */}
              <div className="mt-6 flex items-center gap-2 text-white/20 text-xs uppercase tracking-[0.15em]" style={{ fontFamily: BODY }}>
                <span>{section.tools.length} tools</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span>{section.misconceptions.length} myths busted</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════
// CHAPTER DIVIDER
// ═══════════════════════════════════════════════════════

function ChapterDivider({ section }: { section: ToolkitSection }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div
      ref={ref}
      id={section.id}
      className="relative"
      style={{ padding: "clamp(80px, 12vw, 160px) clamp(16px, 5vw, 60px)" }}
    >
      <div className="max-w-6xl mx-auto flex items-end gap-6 md:gap-10">
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={spring}
          className="text-[8rem] sm:text-[10rem] md:text-[14rem] lg:text-[18rem] font-bold italic leading-none"
          style={{ fontFamily: DISPLAY, color: `${section.accentColor}15` }}
        >
          {section.pageNumber}
        </motion.span>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.15 }}
          className="pb-4 md:pb-8"
        >
          <h2
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold italic leading-[0.9] mb-4"
            style={{ fontFamily: HEADING, color: section.accentColor }}
          >
            {section.title}
          </h2>
          <p className="text-white/40 text-sm md:text-base max-w-lg leading-relaxed" style={{ fontFamily: BODY }}>
            {section.intro}
          </p>
        </motion.div>
      </div>

      {/* Accent line */}
      <div className="max-w-6xl mx-auto mt-8">
        <div className="h-px w-full" style={{ background: `linear-gradient(to right, ${section.accentColor}40, transparent)` }} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// TOOL CARD
// ═══════════════════════════════════════════════════════

function ToolCard({ tool, accent, index }: { tool: Tool; accent: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ ...spring, delay: index * 0.06 }}
    >
      <a
        href={tool.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block p-5 md:p-6 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] transition-all duration-400 h-full"
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <span
              className="text-[10px] uppercase tracking-[0.2em] block mb-1"
              style={{ color: accent, fontFamily: BODY }}
            >
              {tool.category}
            </span>
            <h3
              className="text-white text-lg font-bold italic group-hover:text-[#EA9A61] transition-colors duration-300"
              style={{ fontFamily: HEADING }}
            >
              {tool.name}
            </h3>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/15 group-hover:text-white/40 transition-colors shrink-0 mt-1">
            <path d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </div>

        <p className="text-white/45 text-sm leading-relaxed mb-4" style={{ fontFamily: BODY }}>
          {tool.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tool.tags.map((tag) => (
            <span
              key={tag}
              className="text-[9px] uppercase tracking-[0.15em] px-2 py-0.5 rounded-full border border-white/[0.08] text-white/30"
              style={{ fontFamily: BODY }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* ROV Favorite */}
        {tool.favoriteBy && (
          <div className="pt-3 border-t border-white/[0.06]">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/25 block mb-1" style={{ fontFamily: BODY }}>
              ROV Pick — {tool.favoriteBy}
            </span>
            <p className="text-white/50 text-xs italic leading-relaxed" style={{ fontFamily: BODY }}>
              &ldquo;{tool.favoriteQuote}&rdquo;
            </p>
          </div>
        )}
      </a>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════
// TOOLS GRID
// ═══════════════════════════════════════════════════════

function ToolsGrid({ tools, accent }: { tools: Tool[]; accent: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div ref={ref} className="max-w-6xl mx-auto" style={{ padding: "0 clamp(16px, 5vw, 60px)" }}>
      <motion.span
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={spring}
        className="block text-xs uppercase tracking-[0.3em] mb-8"
        style={{ color: accent, fontFamily: BODY }}
      >
        The Tools
      </motion.span>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool, i) => (
          <ToolCard key={tool.name} tool={tool} accent={accent} index={i} />
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// MISCONCEPTIONS
// ═══════════════════════════════════════════════════════

function MisconceptionsSection({ misconceptions, accent }: { misconceptions: Misconception[]; accent: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div
      ref={ref}
      className="max-w-6xl mx-auto"
      style={{ padding: "clamp(60px, 10vw, 100px) clamp(16px, 5vw, 60px)" }}
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={spring}
        className="block text-xs uppercase tracking-[0.3em] mb-10"
        style={{ color: accent, fontFamily: BODY }}
      >
        Myths Busted
      </motion.span>

      <div className="space-y-0">
        {misconceptions.map((m, i) => (
          <motion.div
            key={m.myth}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ ...spring, delay: i * 0.1 }}
            className="border-t border-white/[0.06] py-8 md:py-10 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8"
          >
            <div className="md:col-span-5">
              <span
                className="text-white/20 text-xs uppercase tracking-[0.15em] block mb-2"
                style={{ fontFamily: BODY }}
              >
                Myth
              </span>
              <h3
                className="text-white text-xl md:text-2xl font-bold italic leading-tight line-through decoration-white/20"
                style={{ fontFamily: HEADING }}
              >
                {m.myth}
              </h3>
            </div>
            <div className="md:col-span-7">
              <span
                className="text-xs uppercase tracking-[0.15em] block mb-2"
                style={{ color: accent, fontFamily: BODY }}
              >
                Reality
              </span>
              <p className="text-white/60 text-sm md:text-base leading-relaxed" style={{ fontFamily: BODY }}>
                {m.reality}
              </p>
            </div>
          </motion.div>
        ))}
        <div className="border-t border-white/[0.06]" />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// MINI GUIDE
// ═══════════════════════════════════════════════════════

function MiniGuide({ guide, accent }: { guide: { title: string; steps: GuideStep[] }; accent: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div
      ref={ref}
      className="max-w-6xl mx-auto"
      style={{ padding: "clamp(40px, 8vw, 80px) clamp(16px, 5vw, 60px)" }}
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={spring}
        className="block text-xs uppercase tracking-[0.3em] mb-4"
        style={{ color: accent, fontFamily: BODY }}
      >
        Quick Start Guide
      </motion.span>

      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ ...spring, delay: 0.1 }}
        className="text-white text-3xl md:text-4xl font-bold italic mb-12"
        style={{ fontFamily: HEADING }}
      >
        {guide.title}
      </motion.h3>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 md:left-6 top-0 bottom-0 w-px" style={{ background: `${accent}20` }} />

        <div className="space-y-10 md:space-y-12">
          {guide.steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ ...spring, delay: 0.15 + i * 0.08 }}
              className="relative pl-12 md:pl-16"
            >
              {/* Step number dot */}
              <div
                className="absolute left-0 top-0 w-8 h-8 md:w-12 md:h-12 rounded-full border flex items-center justify-center"
                style={{ borderColor: `${accent}30`, background: `${accent}08` }}
              >
                <span className="text-xs md:text-sm font-bold" style={{ color: accent, fontFamily: BODY }}>
                  {step.number}
                </span>
              </div>

              <h4
                className="text-white text-lg md:text-xl font-bold italic mb-2"
                style={{ fontFamily: HEADING }}
              >
                {step.title}
              </h4>
              <p className="text-white/50 text-sm leading-relaxed mb-2" style={{ fontFamily: BODY }}>
                {step.body}
              </p>
              {step.tip && (
                <p className="text-xs italic leading-relaxed" style={{ color: accent, fontFamily: BODY }}>
                  Tip: {step.tip}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// TOOLKIT SECTION (combines all sub-sections)
// ═══════════════════════════════════════════════════════

function ToolkitBlock({ section }: { section: ToolkitSection }) {
  return (
    <div className="relative">
      <ChapterDivider section={section} />
      <ToolsGrid tools={section.tools} accent={section.accentColor} />
      <MisconceptionsSection misconceptions={section.misconceptions} accent={section.accentColor} />
      <MiniGuide guide={section.guide} accent={section.accentColor} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// SIDEBAR
// ═══════════════════════════════════════════════════════

function Sidebar() {
  const ids = toolkitSections.map((s) => s.id);
  const active = useScrollSpy(ids);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <>
      {/* Desktop: vertical sidebar */}
      <nav className="fixed left-0 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-6 pl-4 md:pl-6">
        {toolkitSections.map((s) => {
          const isActive = active === s.id;
          return (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className="group flex flex-col items-center gap-1 cursor-pointer transition-all duration-300"
            >
              <span
                className="text-2xl font-bold italic transition-all duration-300"
                style={{
                  fontFamily: DISPLAY,
                  color: isActive ? s.accentColor : "rgba(255,255,255,0.12)",
                  transform: isActive ? "scale(1.2)" : "scale(1)",
                }}
              >
                {s.pageNumber}
              </span>
              <span
                className="text-[8px] uppercase tracking-[0.2em] transition-opacity duration-300"
                style={{
                  fontFamily: BODY,
                  color: isActive ? s.accentColor : "transparent",
                  opacity: isActive ? 1 : 0,
                }}
              >
                {s.title}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Mobile: horizontal sticky bar */}
      <nav className="sticky top-0 z-40 lg:hidden bg-black/80 backdrop-blur-md border-b border-white/[0.06]">
        <div className="flex items-center justify-center gap-6 py-3 px-4">
          {toolkitSections.map((s) => {
            const isActive = active === s.id;
            return (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className="text-xs uppercase tracking-[0.15em] transition-all duration-300 cursor-pointer"
                style={{
                  fontFamily: BODY,
                  color: isActive ? s.accentColor : "rgba(255,255,255,0.3)",
                  borderBottom: isActive ? `2px solid ${s.accentColor}` : "2px solid transparent",
                  paddingBottom: "4px",
                }}
              >
                {s.title}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}

// ═══════════════════════════════════════════════════════
// COMMUNITY CTA
// ═══════════════════════════════════════════════════════

function CommunityCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div
      ref={ref}
      className="max-w-6xl mx-auto text-center"
      style={{ padding: "clamp(80px, 12vw, 160px) clamp(16px, 5vw, 60px)" }}
    >
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={spring}
        className="text-4xl md:text-5xl lg:text-6xl font-bold italic mb-4"
        style={{ fontFamily: HEADING }}
      >
        <span className="text-white">Built by the </span>
        <span
          className="bg-clip-text text-transparent"
          style={{ backgroundImage: "linear-gradient(112deg, #EA9A61 6.46%, #B16937 34.96%, #A64D2B 63.88%, #42201C 97.63%)" }}
        >
          community.
        </span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ ...spring, delay: 0.1 }}
        className="text-white/40 text-sm md:text-base max-w-md mx-auto mb-10 leading-relaxed"
        style={{ fontFamily: BODY }}
      >
        Have a tool we missed? A misconception we should bust? Join the conversation and help us make the next issue even better.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ ...spring, delay: 0.2 }}
        className="flex flex-wrap items-center justify-center gap-4"
      >
        <a
          href="https://discord.gg/GfzXdmu"
          target="_blank"
          rel="noopener noreferrer"
          className="cta-shine inline-flex items-center gap-3 text-white font-semibold cursor-pointer transition-all duration-300 hover:scale-105"
          style={{
            fontFamily: HEADING,
            borderRadius: "41.444px",
            background: "linear-gradient(112deg, #42201C 6.46%, #A64D2B 34.96%, #B16937 63.88%, #EA9A61 97.63%)",
            boxShadow: "3px 4px 4px 0 rgba(255, 244, 227, 0.15) inset, 0 4.385px 4.385px 0 rgba(0, 0, 0, 0.25)",
            padding: "clamp(0.75rem, 1.2vw, 1rem) clamp(1.5rem, 2.5vw, 2rem)",
            fontSize: "clamp(0.8rem, 1vw, 0.9rem)",
            letterSpacing: "0.05em",
          }}
        >
          Join the Discord
        </a>

        <Link
          href="/ctrla"
          className="inline-flex items-center gap-2 text-white/40 text-sm hover:text-[#EA9A61] transition-colors duration-300"
          style={{ fontFamily: BODY }}
        >
          Back to CTRL A
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════

export default function MagazineContent() {
  return (
    <div className="bg-black min-h-screen text-white overflow-x-hidden">
      <Cover />
      <TableOfContents />
      <Sidebar />

      {toolkitSections.map((section) => (
        <ToolkitBlock key={section.id} section={section} />
      ))}

      <CommunityCTA />
      <CtrlAFooter />
      <NavigationDock />
    </div>
  );
}
