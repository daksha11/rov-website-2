"use client";

import { NavigationDock } from "@/components/NavDoc";
import Footer from "@/components/Footer";
import OurApproachSection from "@/components/Web-Dev/OurApproachSection";
import FAQBottomSection from "@/components/Web-Dev/FAQBottomSection";
import ProjectStrip from "@/components/ProjectStrip";
import { useCallback, useEffect, useRef, useState } from "react";
import VideoPortfolioSection from "@/components/video-production/VideoPortfolioSection";
import PostProductionSection from "@/components/video-production/PostProductionSection";

function LazySection({ children, rootMargin = "200px" }: { children: React.ReactNode; rootMargin?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
            { rootMargin }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [rootMargin]);

    return <div ref={ref}>{visible ? children : <div className="min-h-[50vh]" />}</div>;
}

const videos = [
    "/videoprod/Atlskylineweb.mp4",
    "/videoprod/Gladshotweb.mp4",
    "/videoprod/Laketipweb.mp4",
    "/videoprod/Mountainweb.mp4",
    "/videoprod/Redstairs.mp4",
    "/videoprod/Signiabenzweb.mp4"
];

export default function VideoProductionPage() {
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const videoA = useRef<HTMLVideoElement>(null);
    const videoB = useRef<HTMLVideoElement>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const slotARef = useRef(true);
    const [showSlotA, setShowSlotA] = useState(true);

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
        <main className="relative min-h-screen bg-black text-white">
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
                <div className="absolute inset-0 bg-black/40 z-10" />

                <div className="relative z-20 text-center px-4 md:px-12 flex flex-col items-center max-w-5xl mx-auto pt-20">
                    <h1
                        className="text-5xl md:text-7xl lg:text-8xl font-light mb-6 leading-tight"
                        style={{ fontFamily: 'Norwige, sans-serif', fontStyle: 'italic' }}
                    >
                        Breathtaking <br />
                        <span style={{
                            background: 'linear-gradient(135deg, #8B6F47 0%, #6B5437 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontStyle: 'normal'
                        }}>Visuals</span>
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 max-w-2xl font-light mb-10" style={{ fontFamily: 'Norwige, sans-serif', fontStyle: 'italic' }}>
                        We capture life in motion. Experience cinematic video production that elevates your brand and tells compelling stories.
                    </p>
                </div>

                {/* Carousel Indicators */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                    {videos.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleDotClick(idx)}
                            aria-label={`Go to video ${idx + 1}`}
                            aria-current={idx === currentVideoIndex ? "true" : undefined}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentVideoIndex ? "bg-white scale-125" : "bg-white/40"
                                }`}
                        />
                    ))}
                </div>
            </section>

            {/* Portfolio Showcase — Real Estate & Events */}
            <LazySection>
                <VideoPortfolioSection />
            </LazySection>

            {/* Post Production — Color vs Log Toggle */}
            <LazySection>
                <PostProductionSection />
            </LazySection>

            {/* Project Strip CTA */}
            <ProjectStrip />

            {/* Our Approach Section */}
            <OurApproachSection />

            {/* FAQ Section */}
            <FAQBottomSection />

            <Footer />
        </main>
    );
}

