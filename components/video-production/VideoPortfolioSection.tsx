"use client";

import { useState, useRef, useCallback, useEffect } from "react";

const FONT = "Norwige, sans-serif";
const ACCENT = "#8B6F47";
const ACCENT_GRADIENT = "linear-gradient(135deg, #8B6F47 0%, #6B5437 100%)";
const BROWN_GRADIENT = "linear-gradient(132deg, #EA9A61 4.77%, #B16937 27.26%, #A64D2B 50.09%, #42201C 76.74%)";
const INACTIVE_BG = "rgba(59, 33, 20, 0.30)";

interface SubCategory {
    id: string;
    label: string;
    heading: string;
    copy: string;
    videos: string[];
}

interface Category {
    id: string;
    label: string;
    subcategories: SubCategory[];
}

const categories: Category[] = [
    {
        id: "real-estate",
        label: "Real Estate",
        subcategories: [
            {
                id: "single-family",
                label: "Single Family Homes",
                heading: "Stories Begin at Home.",
                copy:
                    "Every detail, captured with intention. From curb to living room, we tell the full story of a home — the warmth, the scale, the lifestyle that comes with it.",
                videos: [
                    "/videoprod/singlefamhomes/Housepanout.mp4",
                    "/videoprod/singlefamhomes/Housereveal.mp4",
                    "/videoprod/singlefamhomes/Housetop2.mp4",
                ],
            },
            {
                id: "commercial",
                label: "Commercial Properties",
                heading: "Scale Deserves Premium Visuals.",
                copy:
                    "Premium spaces demand premium storytelling. We showcase your property's architecture, flow, and full potential — giving buyers and investors the vision before they step inside.",
                videos: [
                    "/videoprod/commercialbuildings/Floridamariott1.mp4",
                    "/videoprod/commercialbuildings/Floridamariott2.mp4",
                    "/videoprod/commercialbuildings/Poolroof1.mp4",
                    "/videoprod/commercialbuildings/Poolroof2.mp4",
                ],
            },
            {
                id: "neighborhood",
                label: "Neighborhood & Amenities",
                heading: "Location is the Whole Story.",
                copy:
                    "Great real estate isn't just a building — it's a community. We document the lifestyle your clients are buying into: skylines, parks, streets, and everything in between.",
                videos: [
                    "/videoprod/amentity_neighborhood/Neighborhoodcar.mp4",
                    "/videoprod/amentity_neighborhood/Neighborhoodup.mp4",
                    "/videoprod/amentity_neighborhood/Picleball.mp4",
                    "/videoprod/amentity_neighborhood/Tenniscourt.mp4",
                ],
            },
        ],
    },
    {
        id: "events",
        label: "Events",
        subcategories: [
            {
                id: "fashion",
                label: "Fashion Shows",
                heading: "The Pulse of the Runway.",
                copy:
                    "Movement. Light. Energy. We capture the electricity of a fashion show in cinematic frames — each look, each moment, each second of the spectacle, preserved exactly as it felt.",
                videos: [
                    "/videoprod/eventsweb/Goatturnikna.mp4",
                    "/videoprod/eventsweb/Iknacrazyshot.mp4",
                ],
            },
            {
                id: "sports",
                label: "Boxing & Sports",
                heading: "Raw Intensity, Frame by Frame.",
                copy:
                    "Every fight, every match, every bout tells a story of grit and will. We put you ringside — making sure the intensity of the moment translates perfectly to screen.",
                videos: [
                    "/videoprod/eventsweb/Boxing1.mp4",
                    "/videoprod/eventsweb/Boxing2.mp4",
                    "/videoprod/eventsweb/Boxing3.mp4",
                ],
            },
            {
                id: "outdoor",
                label: "Outdoor & Rooftop",
                heading: "Open Air. Cinematic Memories.",
                copy:
                    "From rooftop gatherings to sprawling outdoor venues, we turn ambient moments into cinematic experiences. Sky, skyline, and everything happening beneath it — all captured in full.",
                videos: [
                    "/videoprod/eventsweb/Parkevent.mp4",
                    "/videoprod/eventsweb/Poncerooftop.mp4",
                ],
            },
        ],
    },
];

export default function VideoPortfolioSection() {
    const [activeCat, setActiveCat] = useState("real-estate");
    const [activeSubCat, setActiveSubCat] = useState("single-family");
    const [videoIndex, setVideoIndex] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);

    const currentCat = categories.find((c) => c.id === activeCat)!;
    const currentSub =
        currentCat.subcategories.find((s) => s.id === activeSubCat) ||
        currentCat.subcategories[0];

    const currentVideo = currentSub.videos[videoIndex % currentSub.videos.length];

    const activeCatRef = useRef(activeCat);
    activeCatRef.current = activeCat;
    const activeSubCatRef = useRef(activeSubCat);
    activeSubCatRef.current = activeSubCat;

    const handleCatChange = useCallback((catId: string) => {
        if (catId === activeCatRef.current) return;
        const cat = categories.find((c) => c.id === catId)!;
        setActiveCat(catId);
        setActiveSubCat(cat.subcategories[0].id);
        setVideoIndex(0);
    }, []);

    const handleSubCatChange = useCallback((subId: string) => {
        if (subId === activeSubCatRef.current) return;
        setActiveSubCat(subId);
        setVideoIndex(0);
    }, []);

    // Stable ref so callbacks never close over stale array length
    const videosLengthRef = useRef(currentSub.videos.length);
    videosLengthRef.current = currentSub.videos.length;

    // Auto-advance when clip finishes — useCallback keeps it stable, ref prevents stale closure
    const handleVideoEnded = useCallback(() => {
        setVideoIndex((prev) => (prev + 1) % videosLengthRef.current);
    }, []);

    const handleNextVideo = useCallback(() => {
        setVideoIndex((prev) => (prev + 1) % videosLengthRef.current);
    }, []);

    const handlePrevVideo = useCallback(() => {
        setVideoIndex((prev) => (prev - 1 + videosLengthRef.current) % videosLengthRef.current);
    }, []);

    const [videoReady, setVideoReady] = useState(true);

    useEffect(() => {
        const vid = videoRef.current;
        if (!vid) return;
        setVideoReady(false);
        vid.src = currentVideo;
        vid.load();
        const onCanPlay = () => {
            vid.play().catch(() => { });
            setVideoReady(true);
        };
        vid.addEventListener("canplay", onCanPlay, { once: true });
        return () => vid.removeEventListener("canplay", onCanPlay);
    }, [currentVideo]);

    return (
        <section className="relative bg-black text-[#FFF4E3] py-24 px-6 md:px-12 lg:px-16">
            {/* Section Label */}
            <p
                className="text-xs uppercase tracking-[0.3em] text-[#FFF4E3]/40 mb-6"
                style={{ fontFamily: FONT }}
            >
                Our Portfolio
            </p>

            {/* Huge Top-Level Category Selectors */}
            <div className="flex flex-col md:flex-row gap-6 mb-20">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onMouseEnter={() => handleCatChange(cat.id)}
                        onClick={() => handleCatChange(cat.id)}
                        className={`flex-1 relative overflow-hidden rounded-[2.5rem] p-6 md:p-10 lg:p-14 text-left transition-all duration-700 isolate group ${activeCat === cat.id
                            ? "ring-1 ring-[#8B6F47]/50 shadow-[0_0_50px_rgba(139,111,71,0.15)] bg-black"
                            : "bg-[#FFF4E3]/[0.02] hover:bg-[#FFF4E3]/[0.04]"
                            }`}
                    >
                        {/* Active background glow */}
                        {activeCat === cat.id && (
                            <div className="absolute inset-0 bg-gradient-to-br from-[#8B6F47]/20 via-transparent to-transparent opacity-50 z-[-1]" />
                        )}

                        <div className="relative z-10 flex flex-col h-full justify-between gap-6 md:gap-12">
                            <h3
                                className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-light tracking-tight"
                                style={{
                                    fontFamily: FONT,
                                    fontStyle: 'italic',
                                    color: activeCat === cat.id ? "#FFF4E3" : "rgba(255,244,227,0.4)"
                                }}
                            >
                                {cat.label}
                            </h3>

                            <div className="flex items-end justify-between">
                                <p
                                    className={`text-sm md:text-lg max-w-[280px] leading-relaxed transition-all duration-500 ${activeCat === cat.id ? "text-[#FFF4E3]/70 opacity-100 translate-y-0" : "text-[#FFF4E3]/0 opacity-0 translate-y-4"
                                        }`}
                                    style={{ fontFamily: FONT }}
                                >
                                    {cat.id === "real-estate"
                                        ? "Premium visuals for properties, neighborhoods, and commercial spaces."
                                        : "Capturing the raw energy of sports, fashion, and live events."}
                                </p>

                                {/* Arrow icon indicator */}
                                <div className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-500 ${activeCat === cat.id
                                    ? "border-[#EA9A61] text-[#FFF4E3] rotate-0"
                                    : "border-[#FFF4E3]/10 text-[#FFF4E3]/30 -rotate-45 group-hover:border-[#FFF4E3]/30"
                                    }`}
                                    style={{
                                        background: activeCat === cat.id ? BROWN_GRADIENT : "transparent",
                                    }}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 12h14"></path>
                                        <path d="m12 5 7 7-7 7"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 lg:gap-16 items-start">
                {/* Left — Video Player */}
                <div className="relative rounded-3xl overflow-hidden bg-black/40 border border-[#FFF4E3]/10 aspect-video group">
                    <video
                        ref={videoRef}
                        muted
                        playsInline
                        preload="auto"
                        onEnded={handleVideoEnded}
                        className={`w-full h-full object-contain transition-opacity duration-300 ${videoReady ? "opacity-100" : "opacity-0"}`}
                    />

                    {/* Prev/Next Overlay Controls */}
                    {currentSub.videos.length > 1 && (
                        <div className="absolute inset-0 flex items-center justify-between p-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                            <button
                                onClick={handlePrevVideo}
                                className="w-10 h-10 rounded-full flex items-center justify-center text-[#FFF4E3] transition-all duration-300"
                                style={{ background: BROWN_GRADIENT }}
                                aria-label="Previous video"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m15 18-6-6 6-6" />
                                </svg>
                            </button>
                            <button
                                onClick={handleNextVideo}
                                className="w-10 h-10 rounded-full flex items-center justify-center text-[#FFF4E3] transition-all duration-300"
                                style={{ background: BROWN_GRADIENT }}
                                aria-label="Next video"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m9 18 6-6-6-6" />
                                </svg>
                            </button>
                        </div>
                    )}

                    {/* Category badge */}
                    <div
                        className="absolute top-4 left-4 px-3 py-1 text-[11px] uppercase tracking-widest rounded-full border border-[#FFF4E3]/20 backdrop-blur-sm bg-black/40 text-[#FFF4E3]/70"
                        style={{ fontFamily: FONT }}
                    >
                        {activeCat === "real-estate" ? "Real Estate" : "Events"}
                    </div>
                    {/* Clip counter dots */}
                    {currentSub.videos.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {currentSub.videos.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setVideoIndex(i)}
                                    aria-label={`Go to clip ${i + 1}`}
                                    aria-current={i === videoIndex % currentSub.videos.length ? "true" : undefined}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${i === videoIndex % currentSub.videos.length
                                        ? "bg-[#FFF4E3] scale-125"
                                        : "bg-[#FFF4E3]/30"
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Right — Copy + Sub-tabs */}
                <div className="flex flex-col justify-start pt-2">
                    {/* Subcategory Pills */}
                    <div className="flex flex-wrap gap-3 mb-10">
                        {currentCat.subcategories.map((sub) => (
                            <button
                                key={sub.id}
                                onClick={() => handleSubCatChange(sub.id)}
                                className="px-5 py-2.5 text-xs md:text-sm font-medium transition-all duration-300"
                                style={{
                                    fontFamily: FONT,
                                    borderRadius: "40px",
                                    background:
                                        activeSubCat === sub.id ? BROWN_GRADIENT : INACTIVE_BG,
                                    color:
                                        activeSubCat === sub.id
                                            ? "#FFF4E3"
                                            : "rgba(255,244,227,0.55)",
                                }}
                            >
                                {sub.label}
                            </button>
                        ))}
                    </div>

                    {/* Heading */}
                    <h2
                        className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight mb-6 transition-all duration-300"
                        style={{ fontFamily: FONT, fontStyle: "italic" }}
                    >
                        {currentSub.heading}
                    </h2>

                    {/* Copy */}
                    <p
                        className="text-[#FFF4E3]/60 text-base md:text-lg leading-relaxed max-w-lg"
                        style={{ fontFamily: FONT, fontStyle: "italic" }}
                    >
                        {currentSub.copy}
                    </p>

                    {/* Decorative accent line */}
                    <div
                        className="mt-10 w-16 h-[2px] rounded-full"
                        style={{ background: ACCENT_GRADIENT }}
                    />
                </div>
            </div>
        </section>
    );
}
