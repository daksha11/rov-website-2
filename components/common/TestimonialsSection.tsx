"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Testimonial, ServiceVariant } from "@/data/testimonials";

const HEADING = "Norwige, sans-serif";
const BODY = "'Roboto', sans-serif";

function VariantDecoration({ variant }: { variant: ServiceVariant }) {
  switch (variant) {
    case "web":
      return (
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(234,154,97,0.5) 60px), repeating-linear-gradient(90deg, transparent, transparent 59px, rgba(234,154,97,0.5) 60px)",
          }}
        />
      );
    case "sound":
      return (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          preserveAspectRatio="none"
          viewBox="0 0 1200 600"
        >
          <path
            d="M0,300 Q100,260 200,300 T400,300 T600,300 T800,300 T1000,300 T1200,300"
            fill="none"
            stroke="#EA9A61"
            strokeWidth="1.5"
            opacity="0.06"
          />
          <path
            d="M0,320 Q150,280 300,320 T600,320 T900,320 T1200,320"
            fill="none"
            stroke="#EA9A61"
            strokeWidth="1"
            opacity="0.04"
          />
          <path
            d="M0,280 Q120,310 240,280 T480,280 T720,280 T960,280 T1200,280"
            fill="none"
            stroke="#EA9A61"
            strokeWidth="1"
            opacity="0.04"
          />
        </svg>
      );
    case "video":
      return (
        <>
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-white/5 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/5 pointer-events-none" />
        </>
      );
    case "ai":
      return (
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(234,154,97,0.4) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      );
  }
}

interface Props {
  testimonials: Testimonial[];
  variant: ServiceVariant;
}

export default function TestimonialsSection({ testimonials, variant }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!isPaused) {
        setDirection(1);
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
      }
    }, 5000);
  }, [isPaused, testimonials.length]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  const goTo = (index: number) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
    startTimer();
  };

  const slideVariants = {
    enter: (dir: number) => ({ y: dir > 0 ? 40 : -40, opacity: 0 }),
    center: { y: 0, opacity: 1 },
    exit: (dir: number) => ({ y: dir > 0 ? -40 : 40, opacity: 0 }),
  };

  const current = testimonials[activeIndex];

  return (
    <section
      className="relative py-24 md:py-32 lg:py-40 px-4 sm:px-6 lg:px-8 bg-black overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(234, 154, 97, 0.04) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* Decorative quote shape — behind the quote text area */}
      <div className="absolute top-1/2 right-0 md:right-8 lg:right-16 -translate-y-1/2 pointer-events-none">
        <svg width="380" height="412" viewBox="0 0 520 563" fill="none" xmlns="http://www.w3.org/2000/svg" className="hidden lg:block" style={{ opacity: 0.07 }}>
          <path d="M21.5106 179.427L0.0831748 383.782C-0.890767 393.071 6.76914 400.982 16.0843 400.308L90.4756 394.923C98.9508 394.31 106.243 400.852 106.549 409.344L111.553 548.259C111.866 556.936 119.459 563.537 128.096 562.638L505.767 523.352C513.409 522.557 519.215 516.116 519.215 508.432V336.94C519.215 327.829 511.159 320.822 502.136 322.085L414.868 334.299C405.192 335.654 396.825 327.544 397.875 317.831L412.994 178.067C413.954 169.196 407.004 161.454 398.081 161.454H314.2C305.916 161.454 299.2 154.739 299.2 146.454V27.592C299.2 24.4225 298.196 21.3344 296.332 18.7709L287.177 6.18012C282.377 -0.421502 273.18 -1.9735 266.479 2.68755L27.863 168.677C24.284 171.167 21.9653 175.09 21.5106 179.427Z" fill="#EA9A61"/>
        </svg>
        <svg width="260" height="282" viewBox="0 0 520 563" fill="none" xmlns="http://www.w3.org/2000/svg" className="hidden md:block lg:hidden" style={{ opacity: 0.06 }}>
          <path d="M21.5106 179.427L0.0831748 383.782C-0.890767 393.071 6.76914 400.982 16.0843 400.308L90.4756 394.923C98.9508 394.31 106.243 400.852 106.549 409.344L111.553 548.259C111.866 556.936 119.459 563.537 128.096 562.638L505.767 523.352C513.409 522.557 519.215 516.116 519.215 508.432V336.94C519.215 327.829 511.159 320.822 502.136 322.085L414.868 334.299C405.192 335.654 396.825 327.544 397.875 317.831L412.994 178.067C413.954 169.196 407.004 161.454 398.081 161.454H314.2C305.916 161.454 299.2 154.739 299.2 146.454V27.592C299.2 24.4225 298.196 21.3344 296.332 18.7709L287.177 6.18012C282.377 -0.421502 273.18 -1.9735 266.479 2.68755L27.863 168.677C24.284 171.167 21.9653 175.09 21.5106 179.427Z" fill="#EA9A61"/>
        </svg>
        <svg width="180" height="195" viewBox="0 0 520 563" fill="none" xmlns="http://www.w3.org/2000/svg" className="md:hidden" style={{ opacity: 0.05 }}>
          <path d="M21.5106 179.427L0.0831748 383.782C-0.890767 393.071 6.76914 400.982 16.0843 400.308L90.4756 394.923C98.9508 394.31 106.243 400.852 106.549 409.344L111.553 548.259C111.866 556.936 119.459 563.537 128.096 562.638L505.767 523.352C513.409 522.557 519.215 516.116 519.215 508.432V336.94C519.215 327.829 511.159 320.822 502.136 322.085L414.868 334.299C405.192 335.654 396.825 327.544 397.875 317.831L412.994 178.067C413.954 169.196 407.004 161.454 398.081 161.454H314.2C305.916 161.454 299.2 154.739 299.2 146.454V27.592C299.2 24.4225 298.196 21.3344 296.332 18.7709L287.177 6.18012C282.377 -0.421502 273.18 -1.9735 266.479 2.68755L27.863 168.677C24.284 171.167 21.9653 175.09 21.5106 179.427Z" fill="#EA9A61"/>
        </svg>
      </div>

      {/* Variant-specific decoration */}
      <VariantDecoration variant={variant} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Label */}
        <div className="flex items-center gap-4 mb-16 md:mb-24">
          <p
            className="text-xs uppercase tracking-[0.25em] text-white/30"
            style={{ fontFamily: BODY }}
          >
            Client Testimonials
          </p>
          <div className="h-px flex-1 bg-white/10" />
          <p className="text-xs uppercase tracking-[0.25em] text-white/30 font-mono">
            0{activeIndex + 1} / 0{testimonials.length}
          </p>
        </div>

        {/* Main testimonial area */}
        <div className="relative">
          {/* Large decorative index number */}
          <div className="hidden md:block absolute left-0 top-0 w-[14rem] lg:w-[18rem] xl:w-[22rem] h-[12rem] lg:h-[16rem] xl:h-[18rem] overflow-hidden pointer-events-none">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.span
                key={activeIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute inset-0 flex items-center justify-center text-[8rem] lg:text-[10rem] xl:text-[12rem] leading-none font-bold select-none"
                style={{
                  fontFamily: HEADING,
                  fontStyle: "italic",
                  color: "transparent",
                  WebkitTextStroke: "1.5px rgba(234, 154, 97, 0.5)",
                }}
              >
                0{activeIndex + 1}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Quote content */}
          <div className="md:pl-[16rem] lg:pl-[20rem] xl:pl-[24rem] flex flex-col justify-center min-h-[280px] md:min-h-[320px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {/* Mobile index */}
                <span
                  className="md:hidden block text-5xl leading-none font-bold select-none mb-6"
                  style={{
                    fontFamily: HEADING,
                    fontStyle: "italic",
                    color: "transparent",
                    WebkitTextStroke: "1px rgba(234, 154, 97, 0.45)",
                  }}
                >
                  0{activeIndex + 1}
                </span>

                {/* Quote */}
                <p
                  className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-[2.75rem] text-white/90 leading-snug lg:leading-snug mb-10 md:mb-14"
                  style={{ fontFamily: HEADING, fontStyle: "italic" }}
                >
                  &ldquo;{current.quote}&rdquo;
                </p>

                {/* Author + stat + social */}
                <div className="flex items-center gap-5">
                  {/* Avatar or accent line */}
                  {current.image ? (
                    <div
                      className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-[#EA9A61]/30"
                    >
                      <img
                        src={current.image}
                        alt={current.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      className="w-10 h-px flex-shrink-0"
                      style={{ backgroundColor: "#EA9A61" }}
                    />
                  )}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-3">
                      <p
                        className="text-sm md:text-base font-medium text-white tracking-wide"
                        style={{ fontFamily: BODY }}
                      >
                        {current.name}
                      </p>

                      {/* Social link */}
                      {current.socialUrl && (
                        <a
                          href={current.socialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white/30 hover:text-[#EA9A61] transition-colors duration-300"
                          aria-label={`${current.name} social`}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                          </svg>
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <p
                        className="text-xs md:text-sm text-white/40"
                        style={{ fontFamily: BODY }}
                      >
                        {current.role}
                      </p>

                      {/* Impact stat badge */}
                      <span
                        className="text-[clamp(0.7rem,1.5vw,0.75rem)] md:text-xs uppercase tracking-[0.15em] px-2.5 py-0.5 rounded-full border border-[#EA9A61]/30 text-[#EA9A61] bg-[#EA9A61]/5"
                        style={{ fontFamily: BODY }}
                      >
                        {current.impactStat}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center gap-6 mt-14 md:mt-20">
              {/* Dot lines */}
              <div className="flex items-center gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className="group relative h-8 flex items-center"
                    aria-label={`Go to testimonial ${i + 1}`}
                  >
                    <span
                      className="block h-[2px] rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: i === activeIndex ? "2.5rem" : "1rem",
                        backgroundColor:
                          i === activeIndex
                            ? "#EA9A61"
                            : "rgba(255, 255, 255, 0.15)",
                      }}
                    />
                  </button>
                ))}
              </div>

              {/* Arrow buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setDirection(-1);
                    setActiveIndex(
                      (prev) =>
                        (prev - 1 + testimonials.length) % testimonials.length
                    );
                    startTimer();
                  }}
                  className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all duration-300"
                  aria-label="Previous testimonial"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M10 12L6 8L10 4" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    setDirection(1);
                    setActiveIndex(
                      (prev) => (prev + 1) % testimonials.length
                    );
                    startTimer();
                  }}
                  className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all duration-300"
                  aria-label="Next testimonial"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 4L10 8L6 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
