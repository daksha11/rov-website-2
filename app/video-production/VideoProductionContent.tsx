"use client";

import { NavigationDock } from "@/components/NavDoc";
import Footer from "@/components/Footer";
import OurApproachSection from "@/components/video-production/OurApproachSection";
import FAQSection from "@/components/video-production/FAQSection";
import ProjectStrip from "@/components/ProjectStrip";
import { useCallback, useEffect, useRef, useState } from "react";
import VideoPortfolioSection from "@/components/video-production/VideoPortfolioSection";
import PostProductionSection from "@/components/video-production/PostProductionSection";

const videos = [
    "/videoprod/Atlskylineweb.mp4",
    "/videoprod/Gladshotweb.mp4",
    "/videoprod/Laketipweb.mp4",
    "/videoprod/Mountainweb.mp4",
    "/videoprod/Redstairs.mp4",
    "/videoprod/Signiabenzweb.mp4"
];

export default function VideoProductionContent() {
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const videoA = useRef<HTMLVideoElement>(null);
    const videoB = useRef<HTMLVideoElement>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const slotARef = useRef(true);
    const [showSlotA, setShowSlotA] = useState(true);
    const [cinemaMode, setCinemaMode] = useState(false);

    const startTimer = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
        }, 5000);
    }, []);

    useEffect(() => {
        startTimer();
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [startTimer]);

    const handleDotClick = (idx: number) => {
        setCurrentVideoIndex(idx);
        startTimer();
    };

    useEffect(() => {
        const isSlotA = slotARef.current;

        // The incoming video is the currently hidden slot
        const incoming = isSlotA ? videoB.current : videoA.current;
        const outgoing = isSlotA ? videoA.current : videoB.current;

        if (incoming) {
            incoming.src = videos[currentVideoIndex];
            incoming.load();
            incoming.currentTime = 0;
            incoming.play().catch(() => { });
        }

        // Flip visibility — CSS transition handles the crossfade
        slotARef.current = !isSlotA;
        setShowSlotA(!isSlotA);

        // Clean up outgoing after the crossfade completes
        const cleanup = setTimeout(() => {
            if (outgoing) {
                outgoing.pause();
                outgoing.removeAttribute("src");
                outgoing.load();
            }
        }, 1100);
        return () => clearTimeout(cleanup);
    }, [currentVideoIndex]);

    return (
        <main className="relative min-h-screen bg-black text-[#FFF4E3]">
            <NavigationDock />

            {/* New Video Carousel Hero Section */}
            <section className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-black">
                <video
                    ref={videoA}
                    loop
                    muted
                    playsInline
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${showSlotA ? "opacity-100 z-[1]" : "opacity-0 z-0"}`}
                />
                <video
                    ref={videoB}
                    loop
                    muted
                    playsInline
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${!showSlotA ? "opacity-100 z-[1]" : "opacity-0 z-0"}`}
                />

                {/* Overlay to ensure text readability */}
                <div className={`absolute inset-0 z-10 transition-opacity duration-500 ${cinemaMode ? "opacity-0" : "opacity-100 bg-black/40"}`} />

                {/* Subtle blur layer — between overlay and text */}
                <div className={`absolute inset-0 z-[15] backdrop-blur-[2px] pointer-events-none transition-opacity duration-500 ${cinemaMode ? "opacity-0" : "opacity-100"}`} />

                <div className={`relative z-20 text-center px-4 md:px-12 flex flex-col items-center max-w-5xl mx-auto pt-20 transition-opacity duration-500 ${cinemaMode ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
                    <h1
                        className="text-5xl md:text-7xl lg:text-8xl font-light mb-6 leading-tight"
                        style={{ fontFamily: 'Norwige, sans-serif', fontStyle: 'italic' }}
                    >
                        Breathtaking <br />
                        <span style={{ fontStyle: 'italic' }}>Visuals</span>
                    </h1>
                    <p className="text-lg md:text-xl text-[#FFF4E3]/90 max-w-2xl font-light mb-10" style={{ fontFamily: 'Norwige, sans-serif', fontStyle: 'italic' }}>
                        We capture life in motion. Experience cinematic video production that elevates your brand and tells compelling stories.
                    </p>
                </div>

                {/* Carousel Indicators */}
                <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3 transition-opacity duration-500 ${cinemaMode ? "opacity-0" : "opacity-100"}`}>
                    {videos.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleDotClick(idx)}
                            aria-label={`Go to video ${idx + 1}`}
                            aria-current={idx === currentVideoIndex ? "true" : undefined}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentVideoIndex ? "bg-[#FFF4E3] scale-125" : "bg-[#FFF4E3]/40"
                                }`}
                        />
                    ))}
                </div>

                {/* Cinema Mode Toggle */}
                <button
                    onMouseEnter={() => setCinemaMode(true)}
                    onMouseLeave={() => setCinemaMode(false)}
                    className={`absolute bottom-10 left-6 z-20 flex items-center gap-2 px-4 py-2.5 rounded-full backdrop-blur-md border transition-all duration-500 group ${cinemaMode ? "bg-[#FFF4E3]/10 border-[#FFF4E3]/30" : "bg-black/40 border-[#FFF4E3]/15 hover:border-[#FFF4E3]/30"}`}
                    aria-label="Cinema mode - hover to view video"
                >
                    <svg className={`w-4 h-4 transition-colors duration-500 ${cinemaMode ? "text-[#FFF4E3]" : "text-[#FFF4E3]/60"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.574-3.007-9.964-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span
                        className={`text-xs uppercase tracking-widest font-medium transition-colors duration-500 ${cinemaMode ? "text-[#FFF4E3]" : "text-[#FFF4E3]/60"}`}
                        style={{ fontFamily: 'Norwige, sans-serif' }}
                    >
                        Cinema
                    </span>
                </button>
            </section>

            {/* Portfolio Showcase — Real Estate & Events */}
            <VideoPortfolioSection />

            {/* Post Production — Color vs Log Toggle */}
            <PostProductionSection />

            {/* Project Strip CTA */}
            <ProjectStrip />

            {/* Our Approach Section */}
            <OurApproachSection />

            {/* FAQ Section */}
            <FAQSection />

            <Footer />
        </main>
    );
}
