"use client";

import { Fragment, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// Extra scroll distance each pinned panel holds — fully settled and static —
// before the next panel starts sliding up over it. Bigger = longer hold.
const DWELL_VH = 65;

type Service = {
  id: string;
  label: string;
  headline: string;
  body: [string, string];
  items: string[];
  link: string;
  cta: string;
  accent: string;
  images: [string, string];
  iconPaths: string[];
};

const SERVICES: Service[] = [
  {
    id: "web",
    label: "Web Optimization",
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

export default function Services() {
  // Pure CSS `sticky` stacking: each full-screen panel pins at the top and the
  // next slides up over the whole viewport. Native and buttery — no per-frame
  // JS, so nothing to jitter. The seam shadow on each panel sells the depth.

  // Drive a per-panel `--glow` (0→1) from how far the NEXT panel has risen from
  // the bottom, so a warm glow grows up as the next one loads in. Only sets a
  // CSS variable (opacity/scale) — compositor-cheap, no layout, no jank.
  useEffect(() => {
    const panels = Array.from(document.querySelectorAll<HTMLElement>(".svc-panel"));
    if (!panels.length) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      panels.forEach((p, i) => {
        const next = panels[i + 1];
        if (!next) {
          p.style.setProperty("--glow", "0");
          return;
        }
        const nt = next.getBoundingClientRect().top;
        const g = Math.min(1, Math.max(0, (vh - nt) / (vh * 0.6)));
        p.style.setProperty("--glow", g.toFixed(3));
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="relative bg-black w-full">
      {SERVICES.map((s, i) => (
        <Fragment key={s.id}>
        <div
          className="svc-panel md:sticky md:top-0"
          style={{ zIndex: i + 1 }}
        >
          <div
            className="relative w-full min-h-screen md:h-screen overflow-hidden"
            style={{
              background: `radial-gradient(120% 90% at 12% -5%, ${s.accent}66, transparent 55%), radial-gradient(90% 80% at 100% 105%, ${s.accent}4d, transparent 55%), #08070a`,
              boxShadow: "0 -24px 70px -12px rgba(0,0,0,0.9)",
            }}
          >
            <div className="max-w-[1400px] mx-auto h-full flex flex-col px-6 sm:px-10 md:px-16 pt-24 md:pt-[clamp(5rem,9vh,7rem)] pb-28 md:pb-[clamp(7rem,13vh,10rem)]">
              {/* Top bar — ties every panel to the section identity */}
              <div className="flex items-center justify-between mb-7 md:mb-9">
                <span
                  className="text-sm md:text-base uppercase tracking-[0.25em] text-white/70"
                  style={{ fontFamily: "Norwige, sans-serif" }}
                >
                  Services
                </span>
                <div className="flex items-center gap-3">
                  <span
                    className="text-xs tabular-nums text-white/45"
                    style={{ fontFamily: "'Neue Montreal', sans-serif", letterSpacing: "0.1em" }}
                  >
                    {String(i + 1).padStart(2, "0")} / {String(SERVICES.length).padStart(2, "0")}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {SERVICES.map((_, k) => (
                      <span
                        key={k}
                        className="h-[2px] rounded-full transition-all"
                        style={{
                          width: k === i ? 26 : 12,
                          background: k === i ? "#EA9A61" : "rgba(255,255,255,0.2)",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Main body */}
              <div className="flex-1 min-h-0 flex flex-col md:flex-row gap-8 md:gap-16 border-t border-white/10 pt-7 md:pt-9">
                {/* Left rail */}
                <div className="md:w-[300px] lg:w-[340px] shrink-0 flex flex-col">
                  <svg
                    viewBox="0 0 48 48"
                    className="w-11 h-11 md:w-12 md:h-12"
                    fill="none"
                    stroke="#EA9A61"
                    strokeWidth={1.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ overflow: "visible" }}
                    aria-hidden
                  >
                    {s.iconPaths.map((d, k) => (
                      <path key={k} d={d} />
                    ))}
                  </svg>
                  <h3
                    className="text-white text-2xl md:text-3xl lg:text-4xl uppercase leading-[1.02] mt-5"
                    style={{ fontFamily: "Norwige, sans-serif" }}
                  >
                    {s.label}
                  </h3>
                  <ul className="mt-6 md:mt-7 space-y-2.5 flex-1">
                    {s.items.map((it) => (
                      <li
                        key={it}
                        className="flex items-center gap-3 text-white/70 text-sm md:text-base"
                        style={{ fontFamily: "Roboto, sans-serif" }}
                      >
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#EA9A61" }} />
                        {it}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={s.link}
                    className="cta-shine group mt-7 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white self-start transition-transform duration-300 hover:scale-[1.03]"
                    style={{
                      fontFamily: "Norwige, sans-serif",
                      background:
                        "linear-gradient(112deg, #42201C 6.46%, #A64D2B 34.96%, #B16937 63.88%, #EA9A61 97.63%)",
                      boxShadow:
                        "3px 4px 4px 0 rgba(255,244,227,0.15) inset, 0 4px 10px rgba(0,0,0,0.35)",
                    }}
                  >
                    {s.cta}
                    <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
                  </Link>
                </div>

                {/* Right — headline, body, imagery */}
                <div className="flex-1 min-h-0 flex flex-col">
                  <h4
                    className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] leading-[1.03]"
                    style={{ fontFamily: "Norwige, sans-serif" }}
                  >
                    {s.headline}
                  </h4>
                  <div
                    className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3 max-w-3xl text-white/55 text-sm md:text-[0.95rem] leading-relaxed"
                    style={{ fontFamily: "Roboto, sans-serif" }}
                  >
                    <p>{s.body[0]}</p>
                    <p>{s.body[1]}</p>
                  </div>
                  <div className="mt-7 md:mt-8 flex-1 min-h-[160px] max-h-[46vh] grid grid-cols-2 gap-3 md:gap-4">
                    {s.images.map((src, k) => (
                      <div
                        key={k}
                        className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]"
                      >
                        <Image
                          src={src}
                          alt={`${s.label} work by Range of View Studios`}
                          fill
                          sizes="(max-width: 768px) 50vw, 460px"
                          className="object-cover object-center"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Growing glow rising from the bottom as the next panel loads up */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-[45vh]"
              style={{
                opacity: "var(--glow, 0)",
                transform: "scaleY(calc(0.55 + var(--glow, 0) * 0.45))",
                transformOrigin: "bottom",
                background:
                  "radial-gradient(75% 100% at 50% 100%, rgba(234,154,97,0.4), rgba(234,154,97,0.12) 42%, transparent 72%)",
                willChange: "opacity, transform",
              }}
            />
          </div>
        </div>

        {/* Dwell spacer: holds the pinned panel fully in view before the next
            one starts sliding up. Desktop only; mobile panels stack naturally. */}
        <div aria-hidden className="hidden md:block" style={{ height: `${DWELL_VH}vh` }} />
        </Fragment>
      ))}
    </section>
  );
}
