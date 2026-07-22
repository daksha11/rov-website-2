"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, LayoutGroup, useScroll, useMotionValueEvent } from "framer-motion";
import GradientBlob from "@/components/effects/GradientBlob";

// Shared easing — the same curve the old quadrant grid morphed on,
// so the new single-active viewer keeps the section's motion DNA.
const EASE = [0.16, 1, 0.3, 1] as const;

type Service = {
  id: string;
  label: string; // full uppercase rail label
  short: string; // pill label
  headline: string; // large statement line
  body: [string, string]; // two-column paragraphs
  items: string[]; // sub-service list
  link: string;
  cta: string;
  accent: string;
  images: [string, string]; // two rectangles, side by side
  // Line-draw icon paths (viewBox 0 0 48 48), redrawn on every switch.
  iconPaths: string[];
};

const SERVICES: Service[] = [
  {
    id: "web",
    label: "Web Optimization",
    short: "Web",
    headline: "Websites built to perform, and designed to feel right.",
    body: [
      "We build fast, considered sites in Next.js that turn visitors into clients. Every page is engineered for speed, structured for search, and shaped around the way real people actually move through it.",
      "From the first wireframe to launch, we sweat the details that decide whether someone stays: load time, hierarchy, and the small moments that make a brand feel worth trusting.",
    ],
    items: ["Web Design", "SEO & Performance", "Landing Pages", "Conversion"],
    link: "/web",
    cta: "See Our Work",
    accent: "#4C2D16",
    images: ["/heroassets/samwebfolder2.webp", "/heroassets/webfolder3.webp"],
    iconPaths: [
      "M24 6 A18 18 0 1 0 24.01 6",
      "M6 24 H42",
      "M24 6 C13 13 13 35 24 42",
      "M24 6 C35 13 35 35 24 42",
    ],
  },
  {
    id: "video",
    label: "Video Production",
    short: "Video",
    headline: "Editorial-grade footage that's impossible to scroll past.",
    body: [
      "From aerial to street level, we find the frame that says everything. Brand films, walkthroughs, drone cinematography, and music videos, all shot and cut to hold attention.",
      "We treat every project like a story with a point of view, not just coverage. The result is footage that looks considered, moves with intent, and makes your brand feel like it belongs on a bigger screen.",
    ],
    items: ["Brand Films", "Real Estate", "Drone", "Music Videos"],
    link: "/video-production",
    cta: "See Our Work",
    accent: "#6B2E1A",
    images: ["/heroassets/ponceshowframe.webp", "/heroassets/hydvideoframe.webp"],
    iconPaths: [
      "M6 18 H42 V40 H6 Z",
      "M6 18 L12 10 H18 L12 18",
      "M18 18 L24 10 H30 L24 18",
      "M30 18 L36 10 H42 L36 18",
    ],
  },
  {
    id: "ai",
    label: "AI Solutions",
    short: "AI",
    headline: "Automations and AI systems that cut manual work by 60%.",
    body: [
      "We build practical AI into the parts of your business that quietly eat time: lead follow-up, scheduling, support, and content. Built smart, so your team can think bigger.",
      "Every system is designed around your actual workflow, not a generic template. We integrate with the tools you already use and hand you something that runs reliably in the background.",
    ],
    items: ["Automations", "Lead Follow-up", "Support", "Content Systems"],
    link: "/ai-automation",
    cta: "See It in Action",
    accent: "#2E1A08",
    images: ["/heroassets/n8nframe.webp", "/heroassets/codingframe.webp"],
    iconPaths: [
      "M12 18 H36 V38 H12 Z",
      "M24 18 V11",
      "M24 9 A2 2 0 1 0 24.01 9",
      "M18 26 V29",
      "M30 26 V29",
      "M12 30 H8 V34",
      "M36 30 H40 V34",
    ],
  },
];

// ── Animated line-draw mark ─────────────────────────────
// Redraws (pathLength 0→1, staggered) each time the active service changes.
function ServiceMark({ service }: { service: Service }) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={64}
      height={64}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      style={{ overflow: "visible" }}
    >
      <AnimatePresence mode="wait">
        <motion.g key={service.id}>
          {service.iconPaths.map((d, i) => (
            <motion.path
              key={`${service.id}-${i}`}
              d={d}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.9 }}
              transition={{
                pathLength: { duration: 0.8, ease: EASE, delay: 0.08 + i * 0.09 },
                opacity: { duration: 0.25, delay: 0.08 + i * 0.09 },
              }}
            />
          ))}
        </motion.g>
      </AnimatePresence>
    </svg>
  );
}

export default function Services() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const service = SERVICES[active];

  // Scroll progress across the tall wrapper drives which card is shown while
  // the inner panel stays pinned. Pills can still jump to any service.
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(SERVICES.length - 1, Math.max(0, Math.floor(v * SERVICES.length)));
    setActive((prev) => (prev === idx ? prev : idx));
  });

  // Scroll the window so the given service lands in the middle of its segment.
  const goTo = (i: number) => {
    const el = wrapRef.current;
    if (!el) {
      setActive(i);
      return;
    }
    const range = el.offsetHeight - window.innerHeight;
    const progress = (i + 0.5) / SERVICES.length;
    const top = window.scrollY + el.getBoundingClientRect().top + range * progress;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <div ref={wrapRef} style={{ height: `${SERVICES.length * 100}vh` }} className="relative">
      {/* Pinned viewport — swaps cards as the wrapper scrolls past */}
      <section className="sticky top-0 h-screen bg-transparent w-full px-6 sm:px-12 md:px-16 relative flex flex-col overflow-hidden pt-20 pb-28 md:pt-14 md:pb-24">
        <GradientBlob position="top-left" />
        <GradientBlob position="bottom-right" />

        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />

        <div className="w-full max-w-[1400px] mx-auto relative z-10 flex flex-col flex-1 min-h-0">
        {/* Heading + pills + progress on one compact row */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-4 md:mb-5">
          <h2
            className="text-3xl md:text-4xl lg:text-5xl text-white/90 uppercase tracking-wider leading-none"
            style={{ fontFamily: "Norwige, sans-serif" }}
          >
            SERVICES
          </h2>

          {/* ── Filter pills ── */}
          <div className="flex flex-wrap gap-2.5">
            {SERVICES.map((s, i) => {
              const on = i === active;
              return (
                <button
                  key={s.id}
                  onClick={() => goTo(i)}
                  className="relative px-5 py-2 rounded-full text-xs md:text-sm uppercase overflow-hidden transition-colors"
                  style={{
                    fontFamily: "'Neue Montreal', sans-serif",
                    letterSpacing: "0.14em",
                    color: on ? "#fff" : "rgba(255,255,255,0.55)",
                    border: `1px solid ${on ? "transparent" : "rgba(255,255,255,0.18)"}`,
                  }}
                >
                  {on && (
                    <motion.span
                      layoutId="service-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: s.accent, border: `1px solid ${s.accent}` }}
                      transition={{ duration: 0.5, ease: EASE }}
                    />
                  )}
                  <span className="relative z-10">{s.short}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Segment progress dots */}
        <div className="flex items-center gap-2 mb-4 md:mb-5">
          <span
            className="text-white/40 text-xs tabular-nums mr-1"
            style={{ fontFamily: "'Neue Montreal', sans-serif", letterSpacing: "0.1em" }}
          >
            {String(active + 1).padStart(2, "0")} / {String(SERVICES.length).padStart(2, "0")}
          </span>
          {SERVICES.map((s, i) => (
            <span
              key={s.id}
              className="h-[2px] rounded-full transition-all duration-500"
              style={{
                width: i === active ? 40 : 16,
                background: i === active ? "#EA9A61" : "rgba(255,255,255,0.18)",
              }}
            />
          ))}
        </div>

        {/* ── Active service block (flat, editorial — morphs on swap) ── */}
        <LayoutGroup>
          <div className="flex flex-col md:flex-row flex-1 min-h-0 border-t border-white/10">
            {/* Left rail — bullets, divided from the right by a vertical line */}
            <div className="md:w-[260px] lg:w-[300px] shrink-0 md:border-r md:border-white/12 md:pr-10 lg:pr-12 pt-6 md:pt-7 pb-6 md:pb-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="flex flex-col items-start"
                >
                  <div className="mb-6 text-white/85">
                    <ServiceMark service={service} />
                  </div>
                  <h3
                    className="text-white uppercase text-lg md:text-xl mb-5"
                    style={{ fontFamily: "'Neue Montreal', sans-serif", letterSpacing: "0.12em" }}
                  >
                    {service.label}
                  </h3>
                  <ul className="space-y-2.5 mb-8">
                    {service.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-3 text-white/55 text-sm md:text-[0.95rem]"
                        style={{ fontFamily: "'Neue Montreal', sans-serif", letterSpacing: "0.02em" }}
                      >
                        <span className="inline-block w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#EA9A61" }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={service.link}
                    aria-label={`${service.label} — ${service.cta}`}
                    className="group inline-flex items-center justify-center px-7 py-3 rounded-full text-xs md:text-sm w-fit transition-colors hover:bg-white/5"
                    style={{
                      fontFamily: "'Neue Montreal', sans-serif",
                      letterSpacing: "0.08em",
                      color: "#fff",
                      border: "1px solid rgba(234,154,97,0.55)",
                      textTransform: "uppercase",
                    }}
                  >
                    {service.cta}
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right column — big header, two body blocks under it, image below */}
            <div className="flex-1 min-h-0 flex flex-col md:pl-10 lg:pl-14 pt-6 md:pt-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="shrink-0"
                >
                  <h4
                    className="text-white text-2xl md:text-4xl lg:text-[2.6rem] leading-[1.06] mb-4 md:mb-5"
                    style={{ fontFamily: "Norwige, sans-serif" }}
                  >
                    {service.headline}
                  </h4>
                  <div
                    className="text-white/60 text-sm md:text-[0.9rem] md:[column-count:2] md:[column-gap:3rem]"
                    style={{ fontFamily: "Roboto, sans-serif", fontWeight: 300, lineHeight: 1.7 }}
                  >
                    <p className="mb-4 md:mb-0 md:[break-inside:avoid]">{service.body[0]}</p>
                    <p className="md:[break-inside:avoid]">{service.body[1]}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Two rectangles side by side, filling remaining height */}
              <div className="flex-1 min-h-[130px] grid grid-cols-2 gap-3 md:gap-4 mt-4 md:mt-5">
                {service.images.map((src, i) => (
                  <div
                    key={i}
                    className="relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.02]"
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${service.id}-${i}`}
                        className="absolute inset-0"
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        transition={{ duration: 0.55, ease: EASE, delay: i * 0.06 }}
                      >
                        <Image
                          src={src}
                          alt={`${service.label} work by Range of View Studios`}
                          fill
                          sizes="(max-width: 768px) 50vw, 550px"
                          className="object-cover object-center"
                        />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </LayoutGroup>
        </div>
      </section>
    </div>
  );
}
