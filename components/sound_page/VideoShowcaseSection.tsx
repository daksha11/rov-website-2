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
    credit: "Basu & Sam Suen",
  },
  {
    src: "/video/starboymv.mp4",
    title: "Starboy",
    poster: "/thumbnails/starboythumb.webp",
    credit: "StrangeLoots",
  },
  {
    src: "/ctrla/ykwiwvidweb.mp4",
    title: "YKWIW",
    poster: "/thumbnails/ykwiw1.webp",
    credit: "Basu",
  },
];

function VideoCard({
  video,
  index,
  isActive,
  onHover,
  onClick,
}: {
  video: (typeof videos)[number];
  index: number;
  isActive: boolean;
  onHover: () => void;
  onClick: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (isActive || hovering) {
      vid.play().catch(() => {});
    } else {
      vid.pause();
      vid.currentTime = 0;
    }
  }, [isActive, hovering]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ ...spring, delay: index * 0.1 }}
      className="cursor-pointer h-full"
      onMouseEnter={() => { onHover(); setHovering(true); }}
      onMouseLeave={() => setHovering(false)}
      onClick={onClick}
    >
      <div
        className="relative overflow-hidden rounded-2xl h-full transition-all duration-500"
        style={{
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

        {/* Play indicator for inactive */}
        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-300">
            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 flex items-end justify-between">
          <div>
            <span
              className="text-white/40 text-[clamp(0.7rem,1.5vw,0.75rem)] uppercase tracking-[0.25em] block mb-1"
              style={{ fontFamily: BODY_FONT }}
            >
              {video.credit}
            </span>
            <h3
              className="text-white text-lg md:text-xl font-bold italic"
              style={{ fontFamily: HEADING_FONT }}
            >
              {video.title}
            </h3>
          </div>
          <span
            className="text-white/15 text-2xl md:text-3xl font-bold italic"
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

  // Get the two inactive indices
  const sideIndices = videos
    .map((_, i) => i)
    .filter((i) => i !== activeIndex);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-black"
      style={{ padding: "clamp(60px, 10vw, 120px) clamp(16px, 5vw, 60px)" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 md:mb-16">
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

        {/* Layout: Featured left + stacked right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5">
          {/* Featured — large */}
          <div className="lg:col-span-8 aspect-video lg:aspect-auto lg:min-h-[500px]">
            <VideoCard
              key={videos[activeIndex].src}
              video={videos[activeIndex]}
              index={activeIndex}
              isActive={true}
              onHover={() => {}}
              onClick={() => {}}
            />
          </div>

          {/* Side stack */}
          <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-4 md:gap-5">
            {sideIndices.map((i) => (
              <div key={videos[i].src} className="aspect-video lg:aspect-auto lg:min-h-0">
                <VideoCard
                  video={videos[i]}
                  index={i}
                  isActive={false}
                  onHover={() => {}}
                  onClick={() => setActiveIndex(i)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
