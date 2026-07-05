"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Link from "next/link";

const HEADING = "Norwige, sans-serif";
const BODY = "'Roboto', sans-serif";

interface Project {
  id: number;
  title: string;
  category: string;
  tags: string[];
  description: string;
  media: string;
  poster?: string;
  link?: string;
  liveUrl?: string;
  bgTint: string;
  glowColor: string;
  beforeAfter?: { before: string; after: string };
}

const projects: Project[] = [
  {
    id: 1,
    title: "The Bando",
    category: "Restaurant Website",
    tags: ["Next.js", "Wix", "UX Design"],
    description: "A full website redesign for Atlanta's Black history museum and fried chicken restaurant. Online ordering page views jumped 689x after launch.",
    media: "/webdev/bando.mp4",
    link: "/casestudy/bando",
    liveUrl: "https://www.thebandoatl.com/",
    bgTint: "#3a2218",
    glowColor: "180, 80, 40",
  },
  {
    id: 2,
    title: "Aysegul Ikna",
    category: "E-Commerce & Branding",
    tags: ["Shopify", "Brand Identity", "Photography"],
    description: "Built a sustainable fashion brand's entire digital presence from scratch. E-commerce, brand identity, and social media drove a 20% sales increase.",
    media: "/webdev/ikna.mp4",
    poster: "/webdev/ayseiknawebhome.webp",
    link: "/casestudy/ikna",
    liveUrl: "https://www.aysegulikna.com/",
    bgTint: "#2a2520",
    glowColor: "120, 140, 80",
  },
  {
    id: 4,
    title: "DKM Corp",
    category: "Brand Identity & Website",
    tags: ["Next.js", "Brand System", "Responsive"],
    description: "Ground-up website rebuild and brand identity system for a professional services company operating across India, Australia, the US, and Dubai.",
    media: "/webdev/dkm.mp4",
    link: "/casestudy/dkm",
    liveUrl: "https://www.dkmcorp.in/",
    bgTint: "#1e2a2a",
    glowColor: "100, 160, 160",
  },
  {
    id: 5,
    title: "Pursue Networking",
    category: "Platform Design",
    tags: ["Next.js", "Supabase", "Full-Stack"],
    description: "Community networking platform built from the ground up. The site launched and the community started growing right away.",
    media: "/webdev/pursueafter.mp4",
    link: "/casestudy/pursue-networking",
    liveUrl: "https://pursuenetworking.com/",
    bgTint: "#1a1e2a",
    glowColor: "80, 100, 180",
    beforeAfter: { before: "/webdev/pursuebefore.mp4", after: "/webdev/pursueafter.mp4" },
  },
  {
    id: 6,
    title: "Sam Suen",
    category: "Portfolio Website",
    tags: ["Next.js", "Framer Motion", "GSAP"],
    description: "A personal portfolio for artist and creative Sam Suen, designed to showcase music, visuals, and creative work in one cohesive experience.",
    media: "/webdev/sam.mp4",
    liveUrl: "https://www.samsuenofficial.com/",
    bgTint: "#2a1e28",
    glowColor: "160, 90, 150",
  },
];

function ProjectSlide({
  project,
  index,
  total,
  onPrev,
  onNext,
  onGoTo,
}: {
  project: Project;
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onGoTo: (i: number) => void;
}) {
  const [showBefore, setShowBefore] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentMedia = project.beforeAfter && showBefore
    ? project.beforeAfter.before
    : project.media;

  useEffect(() => {
    setShowBefore(false);
    setVideoLoaded(false);
  }, [project.id]);

  useEffect(() => {
    setVideoLoaded(false);
    videoRef.current?.play().catch(() => {});
  }, [currentMedia]);

  return (
    <div className="relative w-full min-h-[80vh] md:min-h-[88vh] flex flex-col overflow-hidden">
      {/* Background — static tint + gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 transition-colors duration-300" style={{ background: project.bgTint }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50" />
      </div>

      {/* Bottom fade — eases the slide into the CTA strip */}
      <div className="absolute bottom-0 left-0 right-0 h-32 z-[1] pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 100%)" }} />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-between p-6 pb-16 md:p-10 md:pb-20 lg:p-14 lg:pb-24 max-w-[1400px] mx-auto w-full">
        {/* Top row */}
        <div className="flex items-start justify-between">
          {/* Top-left: section label + nav */}
          <div className="flex flex-col gap-3">
            <span
              className="text-[clamp(0.7rem,1.8vw,0.85rem)] uppercase tracking-[0.28em] text-white/60 font-medium"
              style={{ fontFamily: BODY }}
            >
              Featured Projects
            </span>
            <div className="flex items-center gap-3">
              {/* Prev arrow */}
              <button
                onClick={onPrev}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center transition-all duration-200 cursor-pointer group/arrow"
                aria-label="Previous project"
              >
                <span className="w-9 h-9 rounded-full border border-white/20 group-hover/arrow:border-white/40 flex items-center justify-center transition-all duration-200 group-hover/arrow:bg-white/[0.06]">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/50">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </span>
              </button>

              {/* Progress bar segments */}
              <div className="flex items-center gap-1.5">
                {Array.from({ length: total }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => onGoTo(i)}
                    aria-label={`Go to project ${i + 1}`}
                    className="group relative flex items-center justify-center min-h-[44px] px-1 cursor-pointer"
                  >
                    <span
                      className="relative block h-[3px] rounded-full overflow-hidden transition-all duration-300"
                      style={{ width: i === index ? 36 : 16, background: "rgba(255,255,255,0.12)" }}
                    >
                      {i === index && (
                        <motion.div
                          className="absolute inset-0 rounded-full"
                          style={{ background: "#EA9A61" }}
                          layoutId="progress-fill"
                          transition={{ duration: 0.25 }}
                        />
                      )}
                      {i !== index && (
                        <div className="absolute inset-0 rounded-full bg-white/0 group-hover:bg-white/30 transition-colors duration-200" />
                      )}
                    </span>
                  </button>
                ))}
              </div>

              {/* Counter */}
              <span className="text-[11px] text-white/30 tabular-nums" style={{ fontFamily: BODY }}>
                {String(index + 1).padStart(2, "0")}<span className="text-white/15">/{String(total).padStart(2, "0")}</span>
              </span>

              {/* Next arrow */}
              <button
                onClick={onNext}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center transition-all duration-200 cursor-pointer group/arrow"
                aria-label="Next project"
              >
                <span className="w-9 h-9 rounded-full border border-white/20 group-hover/arrow:border-white/40 flex items-center justify-center transition-all duration-200 group-hover/arrow:bg-white/[0.06]">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/50">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </span>
              </button>
            </div>
          </div>

          {/* Category + tags (desktop) — right-aligned */}
          <div className="text-right hidden md:block">
            <span className="block text-xs uppercase tracking-[0.2em] text-white/60 mb-3" style={{ fontFamily: BODY }}>
              {project.category}
            </span>
            <div className="h-px w-full bg-white/10 mb-3" />
            <div className="flex items-center justify-end gap-3">
              {project.tags.map((tag, i) => (
                <span key={tag} className="flex items-center gap-3">
                  <span className="text-xs uppercase tracking-[0.15em] text-white/50" style={{ fontFamily: BODY }}>
                    {tag}
                  </span>
                  {i < project.tags.length - 1 && (
                    <span className="w-1 h-1 rounded-full bg-white/25" />
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom area */}
        <div className="flex flex-col lg:flex-row items-end gap-8 mt-auto">
          {/* Left: title + description — fast crossfade on project change */}
          <AnimatePresence mode="wait">
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="flex-1 min-w-0"
            >
            <span className="md:hidden block text-[clamp(0.7rem,1.5vw,0.75rem)] uppercase tracking-[0.2em] text-white/50 mb-3" style={{ fontFamily: BODY }}>
              {project.category}
            </span>

            <h3
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold italic leading-[0.9] text-white mb-4 md:mb-6"
              style={{ fontFamily: HEADING }}
            >
              {project.title}
            </h3>

            <p className="text-white/50 text-sm md:text-base leading-relaxed max-w-md mb-6" style={{ fontFamily: BODY }}>
              {project.description}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              {project.link && (
                <a
                  href={project.link}
                  className="inline-flex items-center gap-2 text-[clamp(0.7rem,1.5vw,0.75rem)] uppercase tracking-[0.2em] text-white/60 hover:text-[#EA9A61] transition-colors duration-300 border border-white/15 hover:border-[#EA9A61]/30 rounded-full px-5 py-2.5"
                  style={{ fontFamily: BODY }}
                >
                  View Case Study
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </a>
              )}

              {project.beforeAfter && (
                <button
                  onClick={() => setShowBefore((p) => !p)}
                  className="inline-flex items-center gap-2 text-[clamp(0.7rem,1.5vw,0.75rem)] uppercase tracking-[0.2em] rounded-full px-5 py-2.5 transition-all duration-300 cursor-pointer border"
                  style={{
                    fontFamily: BODY,
                    color: showBefore ? "#EA9A61" : "rgba(255,255,255,0.6)",
                    borderColor: showBefore ? "rgba(234,154,97,0.4)" : "rgba(255,255,255,0.15)",
                    background: showBefore ? "rgba(234,154,97,0.1)" : "transparent",
                  }}
                >
                  {showBefore ? "Showing Before" : "Show Before"}
                </button>
              )}
            </div>
            </motion.div>
          </AnimatePresence>

          {/* Right: video mockup — right-aligned under tags */}
          <div className="w-full lg:w-[420px] flex justify-center lg:justify-end shrink-0">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative w-[280px] h-[280px] md:w-[340px] md:h-[340px] lg:w-[380px] lg:h-[380px] rounded-2xl overflow-hidden block"
              style={{
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(12px)",
                boxShadow: `0 0 60px rgba(${project.glowColor},0.25), 0 0 120px rgba(${project.glowColor},0.1), 0 30px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)`,
              }}
            >
              {/* Loading placeholder */}
              {!videoLoaded && (
                <div
                  className="absolute inset-0 z-[1] flex items-center justify-center"
                  style={{ background: project.bgTint }}
                >
                  <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-[#EA9A61]/60 animate-spin" />
                </div>
              )}
              <video
                ref={videoRef}
                key={currentMedia}
                src={currentMedia}
                poster={project.poster}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                onCanPlay={() => setVideoLoaded(true)}
                className={`w-full h-full object-cover transition-opacity duration-500 ${videoLoaded ? "opacity-100" : "opacity-0"}`}
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                <span
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[clamp(0.7rem,1.5vw,0.75rem)] uppercase tracking-[0.2em] text-white/80 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10"
                  style={{ fontFamily: BODY }}
                >
                  Visit Live Site &rarr;
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

const MARQUEE_ITEMS = Array.from({ length: 8 }, (_, i) => i);

function AllWorkCTA({ total, activeBgTint }: { total: number; activeBgTint: string }) {
  return (
    <div
      className="relative overflow-hidden"
      style={{ background: "#050505" }}
    >
      {/* color bridge — tall gradient so the slide bleeds smoothly into the strip */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeBgTint}
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          className="pointer-events-none absolute top-0 left-0 right-0 h-48"
          style={{ background: `linear-gradient(to bottom, ${activeBgTint}cc 0%, ${activeBgTint}44 40%, transparent 100%)` }}
        />
      </AnimatePresence>

      {/* Main content — headline + CTA */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-14 pt-10 pb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <p
            className="text-[10px] uppercase tracking-[0.3em] text-[#EA9A61]/60 mb-2"
            style={{ fontFamily: BODY }}
          >
            Full Portfolio
          </p>
          <h3
            className="text-2xl md:text-3xl lg:text-4xl font-bold italic text-white leading-tight"
            style={{ fontFamily: HEADING }}
          >
            These are the highlights.
          </h3>
          <p
            className="text-white/40 text-sm mt-2 max-w-sm"
            style={{ fontFamily: BODY }}
          >
            We&apos;ve built {total}+ client websites across web, brand, AI &amp; motion — browse every project in our archive.
          </p>
        </div>

        <Link
          href="/works"
          className="group inline-flex items-center gap-3 shrink-0 self-start md:self-auto"
          aria-label="Browse all projects"
        >
          <span
            className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full text-[#0d0500] text-[11px] uppercase tracking-[0.22em] font-bold transition-all duration-300 group-hover:scale-[1.03]"
            style={{
              fontFamily: BODY,
              background: "linear-gradient(132deg, #EA9A61 4.77%, #B16937 50%, #A64D2B 100%)",
              boxShadow: "0 8px 32px -6px rgba(177,105,55,0.45)",
            }}
          >
            Browse All {total} Projects
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </span>
        </Link>
      </div>

      {/* Scrolling discipline strip */}
      <div className="relative overflow-hidden border-t border-white/[0.05]">
        <motion.div
          className="flex items-center gap-10 whitespace-nowrap will-change-transform py-3"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((_, i) => (
            <span key={i} className="flex items-center gap-10 shrink-0">
              {(["Web Design", "Brand Identity", "AI Workflows", "Motion", "Full-Stack"] as const).map((label, j) => (
                <span key={j} className="flex items-center gap-10">
                  <span
                    className="text-[9px] uppercase tracking-[0.3em] text-white/15"
                    style={{ fontFamily: BODY }}
                  >
                    {label}
                  </span>
                  <span className="text-white/10 text-[10px]">·</span>
                </span>
              ))}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default function FeaturedWorksSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { margin: "-100px", once: false });
  const wasInViewRef = useRef(false);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % projects.length);
    }, 8000);
  }, []);

  // Start auto-scroll only when section enters viewport, reset to first slide
  useEffect(() => {
    if (isInView && !wasInViewRef.current) {
      // Just entered viewport — reset to first slide and start timer
      wasInViewRef.current = true;
      setActiveIndex(0);
      startTimer();
    } else if (!isInView && wasInViewRef.current) {
      // Left viewport — stop timer
      wasInViewRef.current = false;
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isInView, startTimer]);

  const goTo = (index: number) => {
    setActiveIndex(index);
    startTimer();
  };

  const goPrev = () => goTo((activeIndex - 1 + projects.length) % projects.length);
  const goNext = () => goTo((activeIndex + 1) % projects.length);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    // Only trigger if horizontal swipe > 50px and more horizontal than vertical
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) goNext();
      else goPrev();
    }
    touchStartRef.current = null;
  };

  return (
    <section
      ref={sectionRef}
      id="featured-works"
      className="relative bg-black"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <ProjectSlide
        project={projects[activeIndex]}
        index={activeIndex}
        total={projects.length}
        onPrev={goPrev}
        onNext={goNext}
        onGoTo={goTo}
      />

      {/* View All Work — magnetic CTA strip */}
      <AllWorkCTA total={projects.length} activeBgTint={projects[activeIndex].bgTint} />
    </section>
  );
}
