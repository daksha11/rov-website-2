/* eslint-disable @next/next/no-img-element */
"use client";
import { useRef, useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";

const projects = [
  {
    id: 1,
    title: "THE BANDO",
    category: "Website Redesign & Immersive Branding",
    year: "2025",
    tags: ["Design", "Development, Branding, UI/UX"],
    img: "/video/bando video website.mp4",
    type: "video",
  },
  {
    id: 2,
    title: "Aysegul Ikna",
    category: "Website Design & Development",
    year: "2025",
    tags: ["Design", "UX"],
    img: "/video/Aysegul Ikna website.mp4",
    type: "video",
  },
];

const ShowcaseSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCount, setActiveCount] = useState(1);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const idx = Math.floor(p * projects.length) + 1;
    const clamped = Math.max(1, Math.min(projects.length, idx));
    setActiveCount(clamped);
  });

  return (
    <div
      ref={containerRef}
      className="relative grid h-auto grid-cols-12 px-10 bg-black text-white rounded-t-[50px] -mt-[27px]"
      style={{
        minHeight: `${projects.length * 70}vh`,
        backgroundImage: "url('/assets/background/12.jpg')",
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Top Left Heading */}
      <div className="absolute top-8 left-8 z-20">
        <h2 style={{ fontFamily: "futura" }} className="text-3xl">OUR WORK / WHERE PIXELS MEET PURPOSE</h2>
      </div>

      {/* Left sticky counter (byhuy-style) */}
      <div className="sticky top-0 col-span-5 hidden md:flex h-screen items-center z-10">
        <div style={{ fontFamily: "Big Shoulders Display" }} className="flex font-bold items-end gap-4">
          <span className="text-[18vw] leading-none ">
            {String(activeCount).padStart(2, "0")}
          </span>
          <div className="mb-[2vw] flex items-center gap-4">
            <span className="block h-[2px] w-16 bg-white/60" />
            <span style={{ fontFamily: "Big Shoulders Display" }} className="text-3xl text-white/70">
              {String(projects.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>

      {/* Right list of projects */}
      <div className="col-span-12 md:col-span-7 flex flex-col gap-[10vh] py-[10vh] m-3 z-10 md:mt-0 mt-10">
        {projects.map((p) => (
          <div
            key={p.id}
            className="relative lg:h-[500px] h-[400px] rounded-3xl overflow-hidden"
          >
            {/* Background image or video */}
            {p.type === "video" ? (
              <video
                src={p.img}
                autoPlay
                muted
                loop
                playsInline
                aria-label={`${p.title} - ${p.category} showcase video`}
                title={`${p.title} - ROV Studios`}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <img
                src={p.img}
                alt={`${p.title} - ${p.category}`}
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
            {/* Content overlay */}
            <div className="relative z-10 h-full w-full bg-black/45 p-4 flex flex-col justify-end">
              <h3 className="text-white text-2xl font-bold">{p.title}</h3>
              <p className="text-white/80">{p.category}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-white">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-1 border border-white/50 rounded-full"
                  >
                    {t}
                  </span>
                ))}
                <span className="px-2 py-1 bg-white text-black rounded-full">
                  {p.year}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default ShowcaseSection