"use client";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const spring = { type: "spring" as const, stiffness: 100, damping: 20 };

const HEADING_FONT = "Norwige, sans-serif";
const BODY_FONT = "'Roboto', sans-serif";

const valueProps = [
  {
    label: "Professional Mixing & Mastering in Atlanta",
    detail: "Every recording session at our Atlanta studio includes professional mixing and mastering — no upsells, no hidden fees. Your vocals are balanced, cleaned, and enhanced with creative effects, then mastered to hit streaming-ready loudness for Spotify, Apple Music, and every major platform. You walk out with a release-ready record.",
    tag: "All-in-one",
  },
  {
    label: "Industry-Standard Recording Equipment",
    detail: "Our Atlanta recording studio is equipped with the same tools used on records you already listen to — UAD, Waves, FabFilter, Neumann microphones, and Focusrite preamps. Whether you're tracking vocals, mixing a full trackout, or mastering for distribution, every session is powered by professional-grade plugins and hardware.",
    tag: "Pro gear",
  },
  {
    label: "Atlanta's Most Affordable Recording Studio",
    detail: "High-quality mixing and mastering shouldn't break the bank. Our hourly rates are lower than most recording studios in Atlanta — without cutting corners on sound quality. More studio time, more music, less overhead. From independent artists to full project runs, we deliver radio-ready results at prices that make sense.",
    tag: "Best value",
  },
];

function StudioVisuals() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} className="max-w-7xl mx-auto mb-16 md:mb-24">
      {/* Three equal video cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        {[
          { src: "/soundpage/studio1.mp4", label: "Studio Session", subtitle: "Where records are made" },
          { src: "/soundpage/stu2.mp4", label: "The Booth", subtitle: "Step inside" },
          { src: "/soundpage/stu3.mp4", label: "Behind the Mix", subtitle: "Craft in action" },
        ].map((clip, i) => (
          <motion.div
            key={clip.src}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ ...spring, delay: i * 0.1 }}
            className="relative aspect-[4/5] rounded-2xl overflow-hidden group"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              poster="/thumbnails/studiothumbnail.webp"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            >
              <source src={clip.src} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-5 left-5">
              <span
                className="text-white/40 text-[clamp(0.7rem,1.5vw,0.75rem)] uppercase tracking-[0.25em] block mb-1"
                style={{ fontFamily: BODY_FONT }}
              >
                {clip.label}
              </span>
              <span
                className="text-white text-lg md:text-xl font-bold italic"
                style={{ fontFamily: HEADING_FONT }}
              >
                {clip.subtitle}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ValueAccordion() {
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div ref={ref} className="max-w-7xl mx-auto mb-16 md:mb-24">
      {/* Section label */}
      <motion.span
        initial={{ opacity: 0, x: -20 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={spring}
        className="block text-xs uppercase tracking-[0.3em] text-[#EA9A61] mb-10 md:mb-14"
        style={{ fontFamily: BODY_FONT }}
      >
        What You Get
      </motion.span>

      <div>
        {valueProps.map((prop, i) => {
          const isActive = active === i;
          const idx = String(i + 1).padStart(2, "0");

          return (
            <motion.div
              key={prop.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ ...spring, delay: i * 0.08 }}
              onClick={() => setActive(i)}
              className="cursor-pointer border-t border-white/[0.07] last:border-b"
            >
              <div className="py-6 md:py-8 flex items-start md:items-center gap-4 md:gap-8">
                {/* Index number */}
                <span
                  className="text-3xl md:text-5xl font-bold italic shrink-0 w-12 md:w-16 transition-colors duration-500"
                  style={{
                    fontFamily: HEADING_FONT,
                    color: isActive ? "#EA9A61" : "rgba(255,255,255,0.12)",
                  }}
                >
                  {idx}
                </span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 md:gap-4 flex-wrap">
                    <h3
                      className="text-xl md:text-3xl lg:text-4xl font-bold italic transition-colors duration-500"
                      style={{
                        fontFamily: HEADING_FONT,
                        color: isActive ? "#fff" : "rgba(255,255,255,0.35)",
                      }}
                    >
                      {prop.label}
                    </h3>
                    <motion.span
                      animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.8 }}
                      transition={{ duration: 0.3 }}
                      className="text-[clamp(0.7rem,1.5vw,0.75rem)] md:text-xs uppercase tracking-[0.2em] px-3 py-1 rounded-full border border-[#EA9A61]/30 text-[#EA9A61] shrink-0"
                      style={{ fontFamily: BODY_FONT }}
                    >
                      {prop.tag}
                    </motion.span>
                  </div>

                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                        className="overflow-hidden"
                      >
                        <p
                          className="text-white/60 text-sm md:text-base leading-relaxed max-w-2xl pt-3"
                          style={{ fontFamily: BODY_FONT }}
                        >
                          {prop.detail}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Expand indicator */}
                <motion.div
                  animate={{ rotate: isActive ? 45 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full border flex items-center justify-center transition-colors duration-500"
                  style={{
                    borderColor: isActive ? "rgba(234,154,97,0.4)" : "rgba(255,255,255,0.08)",
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ stroke: isActive ? "#EA9A61" : "rgba(255,255,255,0.25)" }}
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default function StudioSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative bg-black overflow-hidden"
      style={{ padding: "clamp(60px, 10vw, 120px) clamp(16px, 5vw, 60px)" }}
    >
      {/* ── Header ── */}
      <div className="max-w-7xl mx-auto mb-16 md:mb-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-end">
          {/* Left — headline */}
          <div className="md:col-span-7">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={headerInView ? { opacity: 1, x: 0 } : {}}
              transition={spring}
              className="inline-block text-xs uppercase tracking-[0.3em] text-[#EA9A61] mb-4"
              style={{ fontFamily: BODY_FONT }}
            >
              In-House Recording
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ ...spring, delay: 0.1 }}
              className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight"
              style={{ fontFamily: HEADING_FONT }}
            >
              <span className="font-bold">Real</span>{" "}
              <span className="italic">Studio.</span>
              <br />
              <span className="font-bold">Real</span>{" "}
              <span className="italic">Engineers.</span>
              <br />
              <span
                className="font-bold italic bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(112deg, #EA9A61 6.46%, #B16937 34.96%, #A64D2B 63.88%, #42201C 97.63%)" }}
              >Real Sound.</span>
            </motion.h2>
          </div>

          {/* Right — supporting text */}
          <motion.div
            className="md:col-span-5"
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ ...spring, delay: 0.2 }}
          >
            <p
              className="text-white/50 text-base md:text-lg leading-relaxed mb-6"
              style={{ fontFamily: BODY_FONT }}
            >
              We don&apos;t just mix files from a laptop. Artists record in our Atlanta studio, stand behind real mics,
              and walk out with professionally mixed and mastered records — ready for Spotify, Apple Music, and every streaming platform.
            </p>
            <a
              href="https://calendly.com/rangeofviewmusic/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 group"
            >
              <span
                className="text-[#EA9A61] text-sm uppercase tracking-[0.15em] group-hover:tracking-[0.25em] transition-all duration-500"
                style={{ fontFamily: BODY_FONT }}
              >
                Book a Session
              </span>
              <motion.span
                className="inline-block w-8 h-px bg-[#EA9A61]"
                whileHover={{ width: 48 }}
                transition={spring}
              />
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#EA9A61"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="group-hover:translate-x-1 transition-transform duration-300"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </motion.div>
        </div>
      </div>

      {/* ── Studio Visuals ── */}
      <StudioVisuals />

      {/* ── Value Props Accordion ── */}
      <ValueAccordion />

      {/* ── Student Rates Callout ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={spring}
        className="max-w-7xl mx-auto mb-16 md:mb-24"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10 py-8 md:py-10 px-6 md:px-10 rounded-2xl border border-[#EA9A61]/15"
          style={{ background: "linear-gradient(135deg, rgba(234,154,97,0.06) 0%, transparent 60%)" }}
        >
          <div className="shrink-0">
            <span
              className="text-[#EA9A61] text-5xl md:text-6xl font-bold italic"
              style={{ fontFamily: HEADING_FONT }}
            >
              Students
            </span>
          </div>
          <div className="h-px md:h-12 md:w-px w-full bg-white/[0.08] shrink-0" />
          <div className="flex-1">
            <p
              className="text-white/60 text-sm md:text-base leading-relaxed"
              style={{ fontFamily: BODY_FONT }}
            >
              Talent shouldn&apos;t be gated by budget. Show your student ID at our Atlanta recording studio
              and get discounted hourly rates — same professional mixing and mastering, same gear, same quality. No compromises.
            </p>
          </div>
          <a
            href="https://calendly.com/rangeofviewmusic/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-[#EA9A61] text-sm uppercase tracking-[0.15em] hover:tracking-[0.25em] transition-all duration-500"
            style={{ fontFamily: BODY_FONT }}
          >
            Inquire &rarr;
          </a>
        </div>
      </motion.div>
    </section>
  );
}
