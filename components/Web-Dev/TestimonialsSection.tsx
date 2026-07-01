"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

type Testimonial = {
    quote: string;
    name: string;
    title: string;
    company: string;
    result: string;
    resultLabel: string;
};

const testimonials: Testimonial[] = [
    {
        quote: "Everything finally looks like it came from one brain. The website, the branding, the content — it all tells the same story now.",
        name: "Aysegul Ikna",
        title: "Fashion Designer",
        company: "Aysegul Ikna Studio",
        result: "+30%",
        resultLabel: "Sales Increase",
    },
    {
        quote: "ROV didn't just redesign our site — they rebuilt the whole experience. People actually stay now instead of bouncing immediately.",
        name: "The Bando",
        title: "Atlanta Venue",
        company: "The Bando ATL",
        result: "-60%",
        resultLabel: "Bounce Rate",
    },
    {
        quote: "We needed infrastructure that could scale globally. ROV delivered exactly that — clean, fast, and built to grow.",
        name: "DKM Corp",
        title: "Enterprise Client",
        company: "DKM Corporation",
        result: "Global",
        resultLabel: "Digital Infrastructure",
    },
    {
        quote: "The site launched and our community started growing immediately. The design makes ANDI feel like the product it actually is.",
        name: "Kolin",
        title: "Founder",
        company: "Pursue Networking",
        result: "Live",
        resultLabel: "Platform Launch",
    },
];

export default function TestimonialsSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <section
            ref={sectionRef}
            className="relative py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-black overflow-hidden"
        >
            {/* Background glow */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
                style={{
                    background: "radial-gradient(circle, rgba(177, 105, 55, 0.08) 0%, transparent 70%)",
                    filter: "blur(80px)",
                }}
            />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="mb-16 md:mb-24"
                >
                    <p
                        className="text-[#EA9A61] font-mono text-xs tracking-[0.3em] uppercase mb-4"
                    >
                        CLIENT RESULTS
                    </p>
                    <h2
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white"
                        style={{
                            fontFamily: "Norwige, sans-serif",
                            fontStyle: "italic",
                        }}
                    >
                        What They Say
                    </h2>
                </motion.div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {testimonials.map((t, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: index * 0.12, ease: "easeOut" }}
                            onClick={() => setActiveIndex(index)}
                            className="relative p-8 md:p-10 rounded-2xl cursor-pointer group transition-all duration-300"
                            style={{
                                background: activeIndex === index
                                    ? "linear-gradient(145deg, #1E1510 0%, #2A1A10 100%)"
                                    : "linear-gradient(145deg, #111111 0%, #181310 100%)",
                                border: activeIndex === index
                                    ? "1px solid rgba(234, 154, 97, 0.35)"
                                    : "1px solid rgba(255, 255, 255, 0.06)",
                                boxShadow: activeIndex === index
                                    ? "0 20px 60px rgba(0,0,0,0.6), 0 0 30px rgba(234, 154, 97, 0.08)"
                                    : "none",
                            }}
                        >
                            {/* Result Chip */}
                            <div className="flex items-center gap-3 mb-6">
                                <span
                                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold font-mono"
                                    style={{
                                        background: "linear-gradient(132deg, #EA9A61 0%, #A64D2B 100%)",
                                        color: "#fff",
                                    }}
                                >
                                    <span className="text-base">{t.result}</span>
                                    <span className="text-xs opacity-80 font-normal">{t.resultLabel}</span>
                                </span>
                            </div>

                            {/* Quote */}
                            <blockquote
                                className="text-base md:text-lg leading-relaxed mb-8"
                                style={{
                                    fontFamily: "Norwige, sans-serif",
                                    fontStyle: "italic",
                                    color: activeIndex === index ? "#FFF4E3" : "rgba(255,244,227,0.65)",
                                    transition: "color 0.3s ease",
                                }}
                            >
                                &ldquo;{t.quote}&rdquo;
                            </blockquote>

                            {/* Attribution */}
                            <div className="flex items-center gap-4">
                                {/* Avatar placeholder */}
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                                    style={{
                                        background: "linear-gradient(135deg, #4a3a2a 0%, #2a1a0a 100%)",
                                        color: "#EA9A61",
                                        fontFamily: "Roboto, sans-serif",
                                    }}
                                >
                                    {t.name.charAt(0)}
                                </div>
                                <div>
                                    <p
                                        className="text-sm font-bold text-white"
                                        style={{ fontFamily: "Roboto, sans-serif" }}
                                    >
                                        {t.name}
                                    </p>
                                    <p
                                        className="text-xs text-white/40"
                                        style={{ fontFamily: "Roboto, sans-serif" }}
                                    >
                                        {t.title} · {t.company}
                                    </p>
                                </div>
                            </div>

                            {/* Hover accent line */}
                            <div
                                className="absolute bottom-0 left-8 right-8 h-px transition-opacity duration-300"
                                style={{
                                    background: "linear-gradient(90deg, transparent, rgba(234,154,97,0.4), transparent)",
                                    opacity: activeIndex === index ? 1 : 0,
                                }}
                            />
                        </motion.div>
                    ))}
                </div>

                {/* Dot navigation */}
                <div className="flex justify-center gap-2 mt-10">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveIndex(index)}
                            className="transition-all duration-300"
                            style={{
                                width: activeIndex === index ? "24px" : "8px",
                                height: "8px",
                                borderRadius: "4px",
                                background: activeIndex === index
                                    ? "linear-gradient(90deg, #EA9A61, #A64D2B)"
                                    : "rgba(255,255,255,0.2)",
                            }}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
