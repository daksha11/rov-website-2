"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
    {
        quote: "ROV Studios completely transformed our online presence. The attention to detail and creative direction exceeded all our expectations.",
        name: "Jordan Mitchell",
        role: "Founder, The Bando",
    },
    {
        quote: "Working with the ROV team felt like a true partnership. They understood our vision from day one and delivered a website that truly represents our brand.",
        name: "Aysegul Ikna",
        role: "CEO, Aysegul Ikna",
    },
    {
        quote: "From concept to launch, the process was seamless. Our new site has driven a significant increase in client engagement and inquiries.",
        name: "David Kim",
        role: "Director, DKM Corp",
    },
];

export default function TestimonialsSection() {
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
    }, [isPaused]);

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
        enter: (dir: number) => ({
            y: dir > 0 ? 40 : -40,
            opacity: 0,
        }),
        center: {
            y: 0,
            opacity: 1,
        },
        exit: (dir: number) => ({
            y: dir > 0 ? -40 : 40,
            opacity: 0,
        }),
    };

    const current = testimonials[activeIndex];

    return (
        <section
            className="relative py-24 md:py-32 lg:py-40 px-4 sm:px-6 lg:px-8 bg-black overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Subtle ambient glow */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
                style={{
                    background: "radial-gradient(circle, rgba(234, 154, 97, 0.04) 0%, transparent 70%)",
                    filter: "blur(80px)",
                }}
            />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Section Label */}
                <div className="flex items-center gap-4 mb-16 md:mb-24">
                    <p
                        className="text-xs uppercase tracking-[0.25em] text-white/30"
                        style={{ fontFamily: "Roboto, sans-serif" }}
                    >
                        Client Testimonials
                    </p>
                    <div className="h-px flex-1 bg-white/10" />
                    <p
                        className="text-xs uppercase tracking-[0.25em] text-white/30 font-mono"
                    >
                        0{activeIndex + 1} / 0{testimonials.length}
                    </p>
                </div>

                {/* Main testimonial area */}
                <div className="relative">
                    {/* Large decorative index number — absolutely positioned, fixed size */}
                    <div
                        className="hidden md:block absolute left-0 top-0 w-[14rem] lg:w-[18rem] xl:w-[22rem] h-[12rem] lg:h-[16rem] xl:h-[18rem] overflow-hidden pointer-events-none"
                    >
                        <AnimatePresence mode="wait" custom={direction}>
                            <motion.span
                                key={activeIndex}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                className="absolute inset-0 flex items-center justify-center text-[8rem] lg:text-[10rem] xl:text-[12rem] leading-none font-bold select-none"
                                style={{
                                    fontFamily: "Norwige, sans-serif",
                                    fontStyle: "italic",
                                    color: "transparent",
                                    WebkitTextStroke: "1.5px rgba(234, 154, 97, 0.5)",
                                }}
                            >
                                0{activeIndex + 1}
                            </motion.span>
                        </AnimatePresence>
                    </div>

                    {/* Quote content — offset to the right on desktop */}
                    <div className="md:pl-[16rem] lg:pl-[20rem] xl:pl-[24rem] flex flex-col justify-center min-h-[280px] md:min-h-[320px]">
                        <AnimatePresence mode="wait" custom={direction}>
                            <motion.div
                                key={activeIndex}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            >
                                {/* Mobile index number */}
                                <span
                                    className="md:hidden block text-5xl leading-none font-bold select-none mb-6"
                                    style={{
                                        fontFamily: "Norwige, sans-serif",
                                        fontStyle: "italic",
                                        color: "transparent",
                                        WebkitTextStroke: "1px rgba(234, 154, 97, 0.45)",
                                    }}
                                >
                                    0{activeIndex + 1}
                                </span>

                                {/* Quote text */}
                                <p
                                    className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-[2.75rem] text-white/90 leading-snug lg:leading-snug mb-10 md:mb-14"
                                    style={{
                                        fontFamily: "Norwige, sans-serif",
                                        fontStyle: "italic",
                                    }}
                                >
                                    &ldquo;{current.quote}&rdquo;
                                </p>

                                {/* Accent line + author */}
                                <div className="flex items-center gap-5">
                                    <div
                                        className="w-10 h-px flex-shrink-0"
                                        style={{ backgroundColor: "#EA9A61" }}
                                    />
                                    <div>
                                        <p
                                            className="text-sm md:text-base font-medium text-white tracking-wide"
                                            style={{ fontFamily: "Roboto, sans-serif" }}
                                        >
                                            {current.name}
                                        </p>
                                        <p
                                            className="text-xs md:text-sm text-white/40 mt-0.5"
                                            style={{ fontFamily: "Roboto, sans-serif" }}
                                        >
                                            {current.role}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation dots + arrows */}
                        <div className="flex items-center gap-6 mt-14 md:mt-20">
                            {/* Dots as lines */}
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
                                                (prev - 1 + testimonials.length) %
                                                testimonials.length
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
