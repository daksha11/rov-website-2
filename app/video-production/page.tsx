"use client";

import { NavigationDock } from "@/components/NavDoc";
import Footer from "@/components/Footer";
import OurApproachSection from "@/components/Web-Dev/OurApproachSection";
import FAQBottomSection from "@/components/Web-Dev/FAQBottomSection";
import ProjectStrip from "@/components/ProjectStrip";
import { useEffect, useRef, useState } from "react";
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

export default function VideoProductionPage() {
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        videoRefs.current.forEach((video, index) => {
            if (!video) return;
            if (index === currentVideoIndex) {
                // Play the current video from the beginning
                video.currentTime = 0;
                video.play().catch(() => { });
            } else {
                // Pause inactive videos to prevent browser glitching/lag
                video.pause();
            }
        });
    }, [currentVideoIndex]);

    return (
        <main className="relative min-h-screen bg-black text-white">
            <NavigationDock />

            {/* New Video Carousel Hero Section */}
            <section className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-black">
                {videos.map((vid, index) => (
                    <video
                        key={vid}
                        ref={(el) => { videoRefs.current[index] = el; }}
                        src={vid}
                        loop
                        muted
                        playsInline
                        preload={index === currentVideoIndex ? "auto" : "none"}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentVideoIndex ? "opacity-100 z-0" : "opacity-0 -z-10"
                            }`}
                    />
                ))}

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
                            onClick={() => setCurrentVideoIndex(idx)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentVideoIndex ? "bg-white scale-125" : "bg-white/40"
                                }`}
                        />
                    ))}
                </div>
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
            <FAQBottomSection />

            <Footer />
        </main>
    );
}

