"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import GradientBlob from "./GradientBlob";

const SERVICES = [
  {
    id: "web",
    title: "Web Optimization",
    tagline: "Turning clicks into connections with seamless, high-impact designs.",
    link: "/web",
    accent: "#4C2D16",
    images: ["/heroassets/webfolder1.png", "/heroassets/webfolder2.png", "/heroassets/webfolder3.webp"],
    transparent: false,
    cta: "See Our Work",
  },
  {
    id: "sound",
    title: "Sound Engineering",
    tagline: "Studio-grade mixing and mastering delivered in 48 hours.",
    link: "/sound",
    accent: "#7A4E28",
    images: ["/heroassets/1.png", "/heroassets/2.png", "/heroassets/3.png"],
    transparent: true,
    cta: "Hear the Difference",
  },
  {
    id: "video",
    title: "Video Production",
    tagline: "Aerial to street level — editorial-grade footage that makes your brand impossible to scroll past.",
    link: "/video-production",
    accent: "#6B2E1A",
    images: ["/heroassets/hydvideoframe.webp", "/heroassets/ponceshowframe.webp", "/heroassets/samxbasuvid.webp"],
    transparent: false,
    cta: "Watch Our Reel",
  },
  {
    id: "ai",
    title: "AI Solutions",
    tagline: "Automations and AI systems that cut manual work by 60%.",
    link: "/ai-automation",
    accent: "#2E1A08",
    images: ["/heroassets/codingframe.webp", "/heroassets/excelframe.webp", "/heroassets/n8nframe.webp"],
    transparent: false,
    cta: "See It in Action",
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
            unoptimized
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
    // Outer: no overflow-hidden so FannedImages can bleed out of bottom-right
    <div
      className="relative w-full h-full"
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

        {/* Pagination dots — top right */}
        <div className="absolute top-8 right-8 flex items-center gap-2 z-10">
          {SERVICES.map((s) => (
            <button
              key={s.id}
              onClick={() => onDotClick(s.id)}
              className="rounded-full"
              style={{
                width: s.id === service.id ? 22 : 10,
                height: 10,
                background:
                  s.id === service.id
                    ? "rgba(255,255,255,0.92)"
                    : "rgba(255,255,255,0.28)",
                transition: "width 0.25s ease, background 0.25s ease",
              }}
            />
          ))}
        </div>

        {/* Text block — top left */}
        <div className="relative z-10 max-w-xs">
          <h3
            className="text-5xl xl:text-6xl text-white font-bold leading-tight mb-3"
            style={{ fontFamily: "Norwige, sans-serif" }}
          >
            {service.title}
          </h3>
          <p
            className="text-white/80 text-sm md:text-base mb-7"
            style={{ fontFamily: "Roboto, sans-serif", fontWeight: 300, lineHeight: 1.6 }}
          >
            {service.tagline}
          </p>
          <Link href={service.link}>
            <button
              className="relative px-6 py-2.5 rounded-full text-sm active:scale-95 overflow-hidden"
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
            </button>
          </Link>
        </div>
      </div>

      {/* FannedImages sits outside the overflow-hidden bg layer — bleeds freely */}
      <FannedImages images={service.images} order={order} transparent={service.transparent} />
    </div>
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
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center gap-3"
      style={{
        background: "#3B2114",
        border: "1px solid rgba(208,190,165,0.10)",
      }}
    >
      <div
        className="w-2 h-2 rounded-full"
        style={{ background: service.accent, opacity: 0.75 }}
      />
      <span
        className="text-white/65 text-xl md:text-2xl text-center px-6 leading-tight"
        style={{ fontFamily: "Norwige, sans-serif" }}
      >
        {service.title}
      </span>
    </div>
  );
}

export default function Services() {
  const [activeId, setActiveId] = useState(SERVICES[0].id);
  // "visible" | "fading" — used to dissolve between configs without competing animations
  const [phase, setPhase] = useState<"visible" | "fading">("visible");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const config = GRID_CONFIGS[activeId];

  const activate = (id: string) => {
    if (id === activeId || phase === "fading") return;

    // Cancel any queued transition
    if (timerRef.current) clearTimeout(timerRef.current);

    setPhase("fading");
    timerRef.current = setTimeout(() => {
      setActiveId(id);
      setPhase("visible");
      timerRef.current = null;
    }, 180);
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
        <div
          className="hidden md:grid gap-3"
          style={{
            gridTemplateAreas: config.areas,
            gridTemplateColumns: config.columns,
            gridTemplateRows: config.rows,
            minHeight: 560,
            // Dissolve: fade grid out → swap config → fade back in
            opacity: phase === "fading" ? 0 : 1,
            transition: "opacity 0.18s ease",
          }}
        >
          {SERVICES.map((service) => {
            const slot = config.slots[service.id];
            const isFeatured = slot === "A";
            const isStrip = slot === "D";

            return (
              <div
                key={service.id}
                className="relative overflow-hidden rounded-2xl cursor-pointer"
                style={{ gridArea: slot }}
                onMouseEnter={() => activate(service.id)}
              >
                {isFeatured ? (
                  <FeaturedCard service={service} onDotClick={activate} />
                ) : isStrip ? (
                  <StripCard service={service} />
                ) : (
                  <SideCard service={service} />
                )}
              </div>
            );
          })}
        </div>

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
                    className="text-white/72 text-sm mb-5"
                    style={{ fontFamily: "Roboto, sans-serif", fontWeight: 300, lineHeight: 1.55 }}
                  >
                    {service.tagline}
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
                        unoptimized
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
