"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

const spring = { type: "spring" as const, stiffness: 100, damping: 20 };
const HEADING_FONT = "Norwige, sans-serif";
const BODY_FONT = "'Roboto', sans-serif";

const videos = [
  {
    src: "/soundpage/starscollidemv.mp4",
    title: "Stars Collide",
    poster: "/thumbnails/soundhero.webp",
    credit: "Mixed & Mastered by ROV",
  },
  {
    src: "/video/starboymv.mp4",
    title: "Starboy",
    poster: "/thumbnails/starboythumb.webp",
    credit: "Produced by ROV",
  },
  {
    src: "/ctrla/ykwiwvidweb.mp4",
    title: "You Know What I Want",
    poster: "/thumbnails/ykwiw1.webp",
    credit: "Full-service production",
  },
];

function VideoItem({
  video,
  index,
  activeIndex,
  onActivate,
  fillHeight,
}: {
  video: (typeof videos)[number];
  index: number;
  activeIndex: number;
  onActivate: (i: number) => void;
  fillHeight?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isActive = activeIndex === index;

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (isActive) {
      vid.play().catch(() => {});
    } else {
      vid.pause();
      vid.currentTime = 0;
    }
  }, [isActive]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ ...spring, delay: index * 0.1 }}
      className={`cursor-pointer ${fillHeight ? "h-full" : ""}`}
      onMouseEnter={() => onActivate(index)}
    >
      {/* Video */}
      <div
        className={`relative overflow-hidden rounded-2xl transition-all duration-500 ${fillHeight ? "h-full" : ""}`}
        style={{
          ...(!fillHeight ? { aspectRatio: isActive ? "16/9" : "16/10" } : {}),
          border: isActive
            ? "1px solid rgba(234,154,97,0.25)"
            : "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <video
          ref={videoRef}
          loop
          muted
          playsInline
          poster={video.poster}
          className="w-full h-full object-cover"
        >
          <source src={video.src} type="video/mp4" />
        </video>

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

        {/* Play state indicator */}
        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-300">
            <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}

        {/* Bottom info inside video */}
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 flex items-end justify-between">
          <div>
            <span
              className="text-white/40 text-[10px] uppercase tracking-[0.25em] block mb-1"
              style={{ fontFamily: BODY_FONT }}
            >
              {video.credit}
            </span>
            <h3
              className="text-white text-xl md:text-2xl font-bold italic"
              style={{ fontFamily: HEADING_FONT }}
            >
              {video.title}
            </h3>
          </div>
          <span
            className="text-white/20 text-3xl md:text-4xl font-bold italic"
            style={{ fontFamily: HEADING_FONT }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function VideoShowcaseSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const headerInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-black"
      style={{ padding: "clamp(60px, 10vw, 120px) clamp(16px, 5vw, 60px)" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={spring}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold italic"
            style={{ fontFamily: HEADING_FONT, color: "#FFF4E3" }}
          >
            Music Videos
          </motion.h2>
        </div>

        {/* Featured + Thumbnails layout — matched heights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5 items-stretch">
          {/* Active video — large */}
          <div className="lg:col-span-8">
            <div className="h-full [&>div]:h-full [&_video]:h-full [&_.aspect-wrapper]:h-full">
              <VideoItem
                video={videos[activeIndex]}
                index={activeIndex}
                activeIndex={activeIndex}
                onActivate={setActiveIndex}
                fillHeight
              />
            </div>
          </div>

          {/* Side stack — remaining videos, split height equally */}
          <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 lg:grid-rows-2 gap-4 md:gap-5">
            {videos.map((video, i) => {
              if (i === activeIndex) return null;
              return (
                <div key={video.src} className="min-h-0">
                  <VideoItem
                    video={video}
                    index={i}
                    activeIndex={activeIndex}
                    onActivate={setActiveIndex}
                    fillHeight
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
