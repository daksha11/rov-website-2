"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, LayoutGroup } from "framer-motion";
import { Globe, Headphones, Clapperboard, Bot, ArrowUpRight, type LucideIcon } from "lucide-react";
import GradientBlob from "./GradientBlob";

const SERVICES = [
  {
    id: "web",
    title: "Web Optimization",
    tagline: "Turning clicks into connections with seamless, high-impact designs.",
    subtitle: "Built to perform, designed to feel right.",
    link: "/web",
    accent: "#4C2D16",
    images: ["/heroassets/webfolder1.png", "/heroassets/samwebfolder2.webp", "/heroassets/webfolder3.webp"],
    transparent: false,
    cta: "See Our Work",
    icon: Globe,
  },
  {
    id: "sound",
    title: "Sound Engineering",
    tagline: "Studio-grade mixing and mastering delivered in 48 hours.",
    subtitle: "Because great music deserves to sound like it.",
    link: "/sound",
    accent: "#7A4E28",
    images: ["/heroassets/1.png", "/heroassets/2.png", "/heroassets/3.png"],
    transparent: true,
    cta: "Hear the Difference",
    icon: Headphones,
  },
  {
    id: "video",
    title: "Video Production",
    tagline: "Aerial to street level, editorial-grade footage that makes your brand impossible to scroll past.",
    subtitle: "We find the frame that says everything.",
    link: "/video-production",
    accent: "#6B2E1A",
    images: ["/heroassets/hydvideoframe.webp", "/heroassets/ponceshowframe.webp", "/heroassets/samxbasuvid.webp"],
    transparent: false,
    cta: "See Our Work",
    icon: Clapperboard,
  },
  {
    id: "ai",
    title: "AI Solutions",
    tagline: "Automations and AI systems that cut manual work by 60%.",
    subtitle: "Built smart, so your team can think bigger.",
    link: "/ai-automation",
    accent: "#2E1A08",
    images: ["/heroassets/codingframe.webp", "/heroassets/excelframe.webp", "/heroassets/n8nframe.webp"],
    transparent: false,
    cta: "See It in Action",
    icon: Bot,
  },
];

// slot 0 = back (most rotated CCW), slot 2 = front (nearly flat)
// All pivot from bottom-right anchor — creates the reference-style fan
const FAN_ANGLES = [-20, -9, 3];

//
// Per-active grid layout configs.
// Each service card expands in its own quadrant:
//   web   → top-left large,    sides right,   strip bottom
//   sound → top-right large,   sides left,    strip bottom
//   video → bottom-left large, sides right,   strip top
//   ai    → bottom-right large,sides left,    strip top
//
// Using fixed px for the strip row so CSS can transition row sizes cleanly.
//
const GRID_CONFIGS: Record<string, {
  areas: string;
  columns: string;
  rows: string;
  slots: Record<string, "A" | "B" | "C" | "D">;
}> = {
  web: {
    areas: `"A B" "A C" "D D"`,
    columns: "3fr 2fr",
    rows: "1fr 1fr 80px",
    slots: { web: "A", sound: "B", video: "C", ai: "D" },
  },
  sound: {
    areas: `"B A" "C A" "D D"`,
    columns: "2fr 3fr",
    rows: "1fr 1fr 80px",
    slots: { sound: "A", web: "B", video: "C", ai: "D" },
  },
  video: {
    areas: `"D D" "A B" "A C"`,
    columns: "3fr 2fr",
    rows: "80px 1fr 1fr",
    slots: { video: "A", sound: "B", ai: "C", web: "D" },
  },
  ai: {
    areas: `"D D" "B A" "C A"`,
    columns: "2fr 3fr",
    rows: "80px 1fr 1fr",
    slots: { ai: "A", web: "B", video: "C", sound: "D" },
  },
};

// order[slot] = index into images array; stable key lets CSS transition fire on each shuffle
function FannedImages({ images, order, transparent }: { images: string[]; order: number[]; transparent?: boolean }) {
  return (
    // Fill the featured card so each image card can anchor to bottom-right of the card itself
    <div className="absolute inset-0 pointer-events-none">
      {order.map((imgIdx, slot) => (
        <div
          key={imgIdx}
          className={`absolute ${transparent ? "" : "rounded-2xl overflow-hidden"}`}
          style={{
            width: transparent ? 560 : 300,
            height: transparent ? 392 : 210,
            right: transparent ? -190 : -10,
            bottom: transparent ? -60 : -20,
            zIndex: slot,
            transformOrigin: "bottom right",
            transform: `rotate(${FAN_ANGLES[slot]}deg)`,
            transition: "transform 0.42s cubic-bezier(0.16,1,0.3,1)",
            boxShadow: transparent ? "none" : "0 6px 22px rgba(0,0,0,0.5)",
          }}
        >
          <Image
            src={images[imgIdx]}
            alt=""
            fill
            sizes={transparent ? "560px" : "300px"}
            className={transparent ? "object-contain" : "object-cover"}
          />
        </div>
      ))}
    </div>
  );
}

// Card content components — plain divs, no Framer Motion, no competing animations
function FeaturedCard({
  service,
  onDotClick,
}: {
  service: (typeof SERVICES)[number];
  onDotClick: (id: string) => void;
}) {
  const [order, setOrder] = useState([0, 1, 2]);

  // Reset order when the active service changes
  React.useEffect(() => { setOrder([0, 1, 2]); }, [service.id]);

  // Each mouse-enter cycles the back card to the front
  const cycleImages = () => {
    setOrder(prev => {
      const next = [...prev];
      next.push(next.shift()!);
      return next;
    });
  };

  return (
    // Outer: no overflow-hidden so FannedImages can bleed out of bottom-right.
    // The whole card is the link — click anywhere to open the service page.
    <Link
      href={service.link}
      aria-label={`${service.title} — ${service.cta}`}
      className="relative block w-full h-full"
      style={{ minHeight: 380 }}
      onMouseEnter={cycleImages}
    >
      {/* Background layer — clips independently so rounded corners stay clean */}
      <div
        className="absolute inset-0 overflow-hidden rounded-2xl p-8"
        style={{ background: service.accent }}
      >
        {/* Subtle noise overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")`,
            backgroundSize: "160px 160px",
            mixBlendMode: "overlay",
            opacity: 0.4,
          }}
        />


        {/* Text block — top left */}
        <div className="relative z-10 max-w-xs">
          <h3
            className="text-5xl xl:text-6xl text-white font-bold leading-tight mb-3"
            style={{ fontFamily: "Norwige, sans-serif" }}
          >
            {service.title}
          </h3>
          <p
            className="text-white/80 text-sm md:text-base mb-2"
            style={{ fontFamily: "Roboto, sans-serif", fontWeight: 300, lineHeight: 1.6 }}
          >
            {service.tagline}
          </p>
          <p
            className="text-white/55 text-sm md:text-base mb-7"
            style={{ fontFamily: "Roboto, sans-serif", fontWeight: 300, lineHeight: 1.6 }}
          >
            {service.subtitle}
          </p>
          {/* Visual button only — the whole card is the link, so this is a
              styled span (no nested anchor) that still carries the shine hover. */}
          <span
            className="relative inline-block px-6 py-2.5 rounded-full text-sm active:scale-95 overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.14)",
              border: "1px solid rgba(255,255,255,0.45)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18)",
              color: "#fff",
              fontFamily: "Roboto, sans-serif",
              fontWeight: 400,
              backdropFilter: "blur(10px)",
              letterSpacing: "0.02em",
              transition: "transform 0.1s ease",
            }}
            onMouseEnter={e => {
              const shine = e.currentTarget.querySelector(".btn-shine") as HTMLElement;
              if (shine) {
                shine.style.transform = "translateX(200%)";
                shine.style.opacity = "1";
              }
            }}
            onMouseLeave={e => {
              const shine = e.currentTarget.querySelector(".btn-shine") as HTMLElement;
              if (shine) {
                shine.style.transform = "translateX(-100%)";
                shine.style.opacity = "0";
              }
            }}
          >
            <span
              className="btn-shine pointer-events-none absolute inset-0"
              style={{
                background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)",
                transform: "translateX(-100%)",
                opacity: 0,
                transition: "transform 1.7s ease, opacity 0.1s ease",
              }}
            />
            {service.cta}
          </span>
        </div>
      </div>

      {/* FannedImages sits outside the overflow-hidden bg layer — bleeds freely */}
      <FannedImages images={service.images} order={order} transparent={service.transparent} />
    </Link>
  );
}

function StripCard({ service }: { service: typeof SERVICES[number] }) {
  return (
    <div
      className="w-full h-full flex items-center justify-between px-8"
      style={{
        background: "#3B2114",
        border: "1px solid rgba(208,190,165,0.10)",
      }}
    >
      <span
        className="text-white/70 text-2xl md:text-[1.7rem] leading-none"
        style={{ fontFamily: "Norwige, sans-serif" }}
      >
        {service.title}
      </span>
      <Link href={service.link}>
        <button
          className="px-5 py-2 rounded-full text-xs md:text-sm"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "rgba(255,255,255,0.55)",
            fontFamily: "Roboto, sans-serif",
            letterSpacing: "0.03em",
            transition: "border-color 0.2s ease, color 0.2s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.3)";
            (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.9)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.12)";
            (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.55)";
          }}
        >
          Learn More
        </button>
      </Link>
    </div>
  );
}

function SideCard({ service }: { service: typeof SERVICES[number] }) {
  const Icon = service.icon as LucideIcon;
  return (
    <div
      className="group w-full h-full relative overflow-hidden"
      style={{
        background: "#3B2114",
        border: "1px solid rgba(208,190,165,0.10)",
      }}
    >
      {/* Subtle radial glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 40%, ${service.accent}60 0%, transparent 70%)`,
        }}
      />

      {/* Large ghost icon — upper center */}
      <div className="absolute inset-0 flex items-center justify-center pb-10 pointer-events-none">
        <Icon
          size={72}
          strokeWidth={0.75}
          className="transition-all duration-700 group-hover:scale-110"
          style={{ color: "rgba(255,255,255,0.12)", filter: "drop-shadow(0 0 18px rgba(255,255,255,0.06))" }}
        />
      </div>

      {/* Bottom-left: title + arrow */}
      <div className="absolute bottom-0 left-0 right-0 px-5 pb-5 flex items-end justify-between">
        <span
          className="text-white/60 group-hover:text-white/90 transition-colors duration-500 text-lg md:text-xl leading-tight"
          style={{ fontFamily: "Norwige, sans-serif" }}
        >
          {service.title}
        </span>
        <ArrowUpRight
          size={16}
          strokeWidth={1.5}
          className="text-white/20 group-hover:text-white/60 transition-colors duration-500 shrink-0 mb-0.5"
        />
      </div>
    </div>
  );
}

export default function Services() {
  const [activeId, setActiveId] = useState(SERVICES[0].id);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const config = GRID_CONFIGS[activeId];

  const activate = (id: string) => {
    if (id === activeId) return;
    setActiveId(id);
  };

  const handleCardEnter = (id: string) => {
    hoverTimer.current = setTimeout(() => activate(id), 180);
  };

  const handleCardLeave = () => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
  };

  return (
    <section className="min-h-screen bg-black py-20 w-full px-6 sm:px-12 md:px-16 relative flex flex-col justify-center overflow-hidden">
      <GradientBlob position="top-left" />
      <GradientBlob position="bottom-right" />

      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />

      <div className="w-full relative z-10">
        {/* Heading */}
        <div className="mb-10 md:mb-14">
          <h2
            className="text-4xl md:text-6xl lg:text-[10rem] text-white/90 uppercase tracking-wider text-left leading-none"
            style={{ fontFamily: "Norwige, sans-serif" }}
          >
            SERVICES
          </h2>
        </div>

        {/* ── Desktop interactive grid ── */}
        <LayoutGroup>
          <div
            className="hidden md:grid gap-3"
            style={{
              gridTemplateAreas: config.areas,
              gridTemplateColumns: config.columns,
              gridTemplateRows: config.rows,
              minHeight: 560,
            }}
          >
            {SERVICES.map((service) => {
              const slot = config.slots[service.id];
              const isFeatured = slot === "A";
              const isStrip = slot === "D";

              return (
                <motion.div
                  key={service.id}
                  layout
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="relative overflow-hidden rounded-2xl cursor-pointer"
                  style={{ gridArea: slot }}
                  onMouseEnter={() => handleCardEnter(service.id)}
                  onMouseLeave={handleCardLeave}
                  onClick={() => activate(service.id)}
                >
                  {isFeatured ? (
                    <FeaturedCard service={service} onDotClick={activate} />
                  ) : isStrip ? (
                    <StripCard service={service} />
                  ) : (
                    <SideCard service={service} />
                  )}
                </motion.div>
              );
            })}
          </div>
        </LayoutGroup>

        {/* ── Mobile: stacked full-width cards ── */}
        <div className="flex flex-col gap-4 md:hidden">
          {SERVICES.map((service) => (
            <Link key={service.id} href={service.link}>
              <div
                className="relative w-full overflow-hidden rounded-2xl p-6 flex flex-col justify-between"
                style={{ background: service.accent, minHeight: 220 }}
              >
                <div className="flex items-center gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full"
                      style={{ background: "rgba(255,255,255,0.45)" }}
                    />
                  ))}
                </div>
                <div className="relative z-10">
                  <h3
                    className="text-4xl text-white font-bold mb-2 leading-tight"
                    style={{ fontFamily: "Norwige, sans-serif" }}
                  >
                    {service.title}
                  </h3>
                  <p
                    className="text-white/72 text-sm mb-1"
                    style={{ fontFamily: "Roboto, sans-serif", fontWeight: 300, lineHeight: 1.55 }}
                  >
                    {service.tagline}
                  </p>
                  <p
                    className="text-white/45 text-sm mb-5"
                    style={{ fontFamily: "Roboto, sans-serif", fontWeight: 300, lineHeight: 1.55 }}
                  >
                    {service.subtitle}
                  </p>
                  <span
                    className="inline-block px-5 py-2 rounded-full text-sm text-white"
                    style={{
                      background: "rgba(255,255,255,0.14)",
                      border: "1px solid rgba(255,255,255,0.38)",
                      fontFamily: "Roboto, sans-serif",
                    }}
                  >
                    Learn More
                  </span>
                </div>

                {/* 2-card mini fan */}
                <div
                  className="absolute bottom-4 right-4 pointer-events-none"
                  style={{ width: 150, height: 108 }}
                >
                  {service.images.slice(0, 2).map((src, i) => (
                    <div
                      key={i}
                      className="absolute rounded-lg overflow-hidden"
                      style={{
                        width: 120,
                        height: 86,
                        right: 0,
                        bottom: 0,
                        zIndex: i,
                        transform: `rotate(${i === 0 ? -9 : 7}deg) translate(${i === 0 ? -22 : 0}px, ${i === 0 ? 8 : 0}px)`,
                        boxShadow: "0 4px 14px rgba(0,0,0,0.5)",
                      }}
                    >
                      <Image
                        src={src}
                        alt=""
                        fill
                        sizes="120px"
                        className={service.transparent ? "object-contain" : "object-cover"}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
