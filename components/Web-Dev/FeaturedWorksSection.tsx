"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const HEADING = "Norwige, sans-serif";
const BODY = "'Roboto', sans-serif";

interface Project {
  id: number;
  title: string;
  category: string;
  tags: string[];
  description: string;
  media: string;
  link?: string;
  bgTint: string;
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
    bgTint: "#3a2218",
  },
  {
    id: 2,
    title: "Aysegul Ikna",
    category: "E-Commerce & Branding",
    tags: ["Shopify", "Brand Identity", "Photography"],
    description: "Built a sustainable fashion brand's entire digital presence from scratch. E-commerce, brand identity, and social media drove a 20% sales increase.",
    media: "/webdev/ikna.mp4",
    link: "/casestudy/ikna",
    bgTint: "#2a2520",
  },
  {
    id: 3,
    title: "DKM Corp",
    category: "Brand Identity & Website",
    tags: ["Next.js", "Brand System", "Responsive"],
    description: "Ground-up website rebuild and brand identity system for a professional services company operating across India, Australia, the US, and Dubai.",
    media: "/webdev/dkm.mp4",
    link: "/casestudy/dkm",
    bgTint: "#1e2a2a",
  },
  {
    id: 4,
    title: "Pursue Networking",
    category: "Platform Design",
    tags: ["Next.js", "Supabase", "Full-Stack"],
    description: "Community networking platform built from the ground up. The site launched and the community started growing right away.",
    media: "/webdev/pursueafter.mp4",
    bgTint: "#1a1e2a",
    beforeAfter: { before: "/webdev/pursuebefore.mp4", after: "/webdev/pursueafter.mp4" },
  },
  {
    id: 5,
    title: "Sam Suen",
    category: "Portfolio Website",
    tags: ["Next.js", "Framer Motion", "GSAP"],
    description: "A personal portfolio for artist and creative Sam Suen, designed to showcase music, visuals, and creative work in one cohesive experience.",
    media: "/webdev/sam.mp4",
    bgTint: "#2a1e28",
  },
];

function ProjectSlide({
  project,
  index,
  total,
}: {
  project: Project;
  index: number;
  total: number;
}) {
  const [showBefore, setShowBefore] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);

  const currentMedia = project.beforeAfter && showBefore
    ? project.beforeAfter.before
    : project.media;

  // Reset before state when project changes
  useEffect(() => {
    setShowBefore(false);
  }, [project.id]);

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
    bgVideoRef.current?.play().catch(() => {});
  }, [currentMedia]);

  return (
    <div className="relative w-full min-h-[80vh] md:min-h-[88vh] flex flex-col overflow-hidden">
      {/* Blurred video background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={bgVideoRef}
          key={`bg-${currentMedia}`}
          src={currentMedia}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover scale-110"
          style={{ filter: "blur(40px) brightness(0.3) saturate(0.6)" }}
        />
        <div className="absolute inset-0" style={{ background: `${project.bgTint}cc`, mixBlendMode: "multiply" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-between p-6 pb-16 md:p-10 md:pb-20 lg:p-14 lg:pb-24 max-w-[1400px] mx-auto w-full">
        {/* Top row */}
        <div className="flex items-start justify-between">
          {/* Project counter */}
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border border-white/25 flex flex-col items-center justify-center shrink-0">
            <span className="text-[9px] uppercase tracking-[0.2em] text-white/40" style={{ fontFamily: BODY }}>
              Project
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-white text-lg md:text-xl font-bold" style={{ fontFamily: HEADING }}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-white/30 text-sm">|</span>
              <span className="text-white/30 text-sm" style={{ fontFamily: BODY }}>
                {String(total).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* Category + tags (desktop) */}
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
        <div className="flex flex-col lg:flex-row items-end gap-8 lg:gap-12 mt-auto">
          {/* Left: title + description */}
          <div className="flex-1 lg:max-w-[50%]">
            <span className="md:hidden block text-[10px] uppercase tracking-[0.2em] text-white/50 mb-3" style={{ fontFamily: BODY }}>
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
                  className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-white/60 hover:text-[#EA9A61] transition-colors duration-300 border border-white/15 hover:border-[#EA9A61]/30 rounded-full px-5 py-2.5"
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
                  className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] rounded-full px-5 py-2.5 transition-all duration-300 cursor-pointer border"
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
          </div>

          {/* Right: video mockup (centered, square, glass border) */}
          <div className="w-full lg:w-[45%] flex justify-center">
            <div
              className="relative w-[280px] h-[280px] md:w-[340px] md:h-[340px] lg:w-[380px] lg:h-[380px] rounded-2xl overflow-hidden"
              style={{
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 30px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
              }}
            >
              <video
                ref={videoRef}
                key={currentMedia}
                src={currentMedia}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedWorksSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % projects.length);
    }, 8000);
  }, []);

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startTimer]);

  const goTo = (index: number) => {
    setActiveIndex(index);
    startTimer();
  };

  return (
    <section id="featured-works" className="relative bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <ProjectSlide
            project={projects[activeIndex]}
            index={activeIndex}
            total={projects.length}
          />
        </motion.div>
      </AnimatePresence>

      {/* Bottom navigation — line indicators */}
      <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {projects.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="group relative h-8 flex items-center cursor-pointer"
            aria-label={`Go to project ${i + 1}`}
          >
            <span
              className="block h-[2px] rounded-full transition-all duration-500 ease-out"
              style={{
                width: i === activeIndex ? "2.5rem" : "1rem",
                backgroundColor: i === activeIndex ? "#EA9A61" : "rgba(255,255,255,0.2)",
              }}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
