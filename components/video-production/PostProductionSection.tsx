"use client";

import { useState, useRef, useEffect } from "react";

const FONT = "Norwige, sans-serif";
const ACCENT = "#8B6F47";
const ACCENT_GRADIENT = "linear-gradient(135deg, #8B6F47 0%, #6B5437 100%)";
const BROWN_GRADIENT = "linear-gradient(132deg, #EA9A61 4.77%, #B16937 27.26%, #A64D2B 50.09%, #42201C 76.74%)";
const BROWN_GRADIENT_LIGHT = "linear-gradient(132deg, #F2BD8A 0%, #EA9A61 25%, #C97D4A 50%, #A64D2B 80%)";


interface VideoPair {
    id: string;
    title: string;
    colorGraded: string;
    logFootage: string;
    poster?: string;
}

// Pairs array — swap in real before/after files when ready
const pairs: VideoPair[] = [
    {
        id: "pair-1",
        title: "Boxing Edit — Color vs Log",
        colorGraded: "/videoprod/postprod/Boxingeditcolor.mp4",
        logFootage: "/videoprod/postprod/Boxingeditdlog.mp4",
        poster: "/thumbnails/boxing1.webp",
    },
    {
        id: "pair-2",
        title: "Color Grade — Before & After",
        colorGraded: "/videoprod/postprod/colorgradeafter.mp4",
        logFootage: "/videoprod/postprod/colorgradebefore.mp4",
    },
];

type Mode = "color" | "log";

function VideoTogglePair({ pair }: { pair: VideoPair }) {
    const [mode, setMode] = useState<Mode>("color");
    const colorRef = useRef<HTMLVideoElement>(null);
    const logRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const active = mode === "color" ? colorRef.current : logRef.current;
        const inactive = mode === "color" ? logRef.current : colorRef.current;
        const activeSrc = mode === "color" ? pair.colorGraded : pair.logFootage;

        if (active) {
            if (!active.src || !active.src.endsWith(activeSrc)) {
                active.src = activeSrc;
                active.load();
            }
            active.play().catch(() => { });
        }
        if (inactive) {
            inactive.pause();
            inactive.removeAttribute("src");
            inactive.load();
        }
    }, [mode, pair.colorGraded, pair.logFootage]);

    return (
        <div className="flex flex-col gap-6">
            {/* Video Container */}
            <div className="relative rounded-3xl overflow-hidden aspect-video bg-black border border-[#FFF4E3]/10">
                {/* Color Graded */}
                <video
                    ref={colorRef}
                    loop
                    muted
                    playsInline
                    preload="none"
                    poster={pair.poster}
                    aria-label={`${pair.title} - color graded version by ROV Studios`}
                    title={`${pair.title} - Color Graded`}
                    className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-700 ${mode === "color" ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                />
                {/* Log Footage */}
                <video
                    ref={logRef}
                    loop
                    muted
                    playsInline
                    preload="none"
                    poster={pair.poster}
                    aria-label={`${pair.title} - raw log footage by ROV Studios`}
                    title={`${pair.title} - Raw Log`}
                    className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-700 ${mode === "log" ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                />

                {/* Live badge */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                    <span
                        className="px-3 py-1 text-[clamp(0.7rem,1.5vw,0.75rem)] uppercase tracking-widest rounded-full backdrop-blur-sm border border-[#FFF4E3]/20 font-medium"
                        style={{
                            fontFamily: FONT,
                            background: mode === "color" ? ACCENT : "rgba(0,0,0,0.55)",
                            color: "#FFF4E3",
                        }}
                    >
                        {mode === "color" ? "● Color Graded" : "● Raw Log"}
                    </span>
                </div>
            </div>

            {/* Toggle Button + Title Row */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <p
                    className="text-[#FFF4E3]/60 text-sm tracking-wide"
                    style={{ fontFamily: FONT, fontStyle: "italic" }}
                >
                    {pair.title}
                </p>

                <div
                    className="flex rounded-full overflow-hidden border border-[#FFF4E3]/10"
                    style={{ background: "rgba(20,10,5,0.6)" }}
                >
                    <button
                        onClick={() => setMode("color")}
                        className="px-5 py-2 text-xs uppercase tracking-widest transition-all duration-300 font-medium"
                        style={{
                            fontFamily: FONT,
                            background: mode === "color" ? BROWN_GRADIENT : "transparent",
                            color: mode === "color" ? "#FFF4E3" : "rgba(255,244,227,0.45)",
                            borderRadius: "inherit",
                        }}
                    >
                        Color Grade
                    </button>
                    <button
                        onClick={() => setMode("log")}
                        className="px-5 py-2 text-xs uppercase tracking-widest transition-all duration-300 font-medium"
                        style={{
                            fontFamily: FONT,
                            background: mode === "log" ? BROWN_GRADIENT : "transparent",
                            color: mode === "log" ? "#fff" : "rgba(255,255,255,0.45)",
                            borderRadius: "inherit",
                        }}
                    >
                        Log Footage
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function PostProductionSection() {
    return (
        <section className="relative bg-black text-[#FFF4E3] pt-12 pb-12 px-6 md:px-12 lg:px-16 border-t border-[#FFF4E3]/5">
            {/* Label */}
            <p
                className="text-xs uppercase tracking-[0.3em] text-[#FFF4E3]/40 mb-6"
                style={{ fontFamily: FONT }}
            >
                Post Production
            </p>

            {/* Heading */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
                <h2
                    className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight max-w-2xl bg-clip-text"
                    style={{
                        fontFamily: FONT,
                        fontStyle: "italic",
                        background: BROWN_GRADIENT_LIGHT,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        color: "transparent",
                    }}
                >
                    We Don&apos;t Just Shoot — We Perfect.
                </h2>

                <p
                    className="text-[#FFF4E3]/55 text-base md:text-lg leading-relaxed max-w-md lg:text-right"
                    style={{ fontFamily: FONT, fontStyle: "italic" }}
                >
                    Every frame goes through our full post-production pipeline —{" "}
                    <span className="bg-clip-text" style={{ background: BROWN_GRADIENT_LIGHT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", color: "transparent" }}>color grading</span>,{" "}
                    <span className="bg-clip-text" style={{ background: BROWN_GRADIENT_LIGHT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", color: "transparent" }}>correction</span>, and{" "}
                    <span className="bg-clip-text" style={{ background: BROWN_GRADIENT_LIGHT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", color: "transparent" }}>cinematic finishing</span>. Toggle between the final
                    product and the{" "}
                    <span className="bg-clip-text" style={{ background: BROWN_GRADIENT_LIGHT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", color: "transparent" }}>raw log</span> to see the difference we make.
                </p>
            </div>

            {/* Video Pairs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
                {pairs.map((pair) => (
                    <VideoTogglePair key={pair.id} pair={pair} />
                ))}
            </div>

            {/* Bottom accent */}
            <div className="mt-16 flex items-center gap-4">
                <div
                    className="h-[1px] flex-1 rounded-full"
                    style={{ background: "rgba(139,111,71,0.25)" }}
                />
                <p
                    className="text-[#FFF4E3]/30 text-xs uppercase tracking-widest whitespace-nowrap"
                    style={{ fontFamily: FONT }}
                >
                    Color. Grade. Perfect.
                </p>
                <div
                    className="h-[1px] flex-1 rounded-full"
                    style={{ background: "rgba(139,111,71,0.25)" }}
                />
            </div>
        </section>
    );
}
