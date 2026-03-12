"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const videos = [
    { src: "/soundpage/starscollidemv.mp4", title: "STARS COLLIDE", poster: "/thumbnails/soundhero.webp" },
    { src: "/video/starboymv.mp4", title: "STARBOY", poster: "/thumbnails/starboythumb.webp" },
    { src: "/ctrla/ykwiwvidweb.mp4", title: "YOU KNOW WHAT I WANT", poster: "/thumbnails/ykwiw1.webp" },
];

export default function VideoShowcaseSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
    const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);

    // Play only the active video, pause and clear src on others
    const manageVideos = useCallback((newActiveIndex: number | null) => {
        videoRefs.current.forEach((vid, i) => {
            if (!vid) return;
            if (i === newActiveIndex) {
                if (!vid.src || !vid.src.endsWith(videos[i].src)) {
                    vid.src = videos[i].src;
                    vid.load();
                }
                vid.play().catch(() => { });
            } else {
                vid.pause();
                vid.removeAttribute("src");
                vid.load();
            }
        });
    }, []);

    useEffect(() => {
        manageVideos(activeCardIndex);
    }, [activeCardIndex, manageVideos]);

    // Start first video on mount since ScrollTrigger may not fire for already-visible cards
    useEffect(() => {
        if (activeCardIndex === null) {
            const firstVid = videoRefs.current[0];
            if (firstVid) {
                firstVid.src = videos[0].src;
                firstVid.load();
                firstVid.play().catch(() => { });
            }
        }
    }, []);

    useGSAP(() => {
        if (!containerRef.current) return;

        ScrollTrigger.normalizeScroll(true);
        ScrollTrigger.config({ limitCallbacks: true });

        const panels = gsap.utils.toArray<HTMLElement>(".video-card-panel");

        panels.forEach((panel, index) => {
            const isLast = index === panels.length - 1;
            if (isLast) return;

            gsap.timeline({
                scrollTrigger: {
                    trigger: panel,
                    start: "bottom bottom",
                    end: "bottom top",
                    pin: true,
                    pinSpacing: false,
                    scrub: 1,
                    anticipatePin: 1,
                    fastScrollEnd: true,
                    preventOverlaps: true,
                    invalidateOnRefresh: true,
                    onToggle: (self) => {
                        if (self.isActive) {
                            setActiveCardIndex(index);
                        }
                    }
                },
            }).fromTo(
                panel,
                { scale: 1, opacity: 1 },
                {
                    scale: 0.8,
                    opacity: 0,
                    duration: 0.5,
                    ease: "power2.inOut"
                }
            );
        });

        // Last card activation
        const lastPanel = panels[panels.length - 1];
        ScrollTrigger.create({
            trigger: lastPanel,
            start: "top 80%",
            end: "bottom center",
            onToggle: (self) => {
                if (self.isActive) {
                    setActiveCardIndex(panels.length - 1);
                }
            }
        });

        return () => {
            ScrollTrigger.normalizeScroll(false);
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    }, { scope: containerRef });

    return (
        <section
            className="relative w-full bg-black py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8"
            style={{
                background: 'radial-gradient(ellipse at top left, rgba(96,62,37,0.35) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(96,62,37,0.35) 0%, transparent 50%), #000'
            }}
        >
            <div className="max-w-7xl mx-auto relative z-10" ref={containerRef}>
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24">
                    <h2
                        className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold"
                        style={{
                            fontFamily: "Norwige, sans-serif",
                            fontStyle: "italic",
                            color: "#FFF4E3",
                        }}
                    >
                        Music Videos
                    </h2>
                    <p className="text-[#FFF4E3]/40 font-mono text-sm tracking-widest mt-4 md:mt-0 md:mb-4">
                        VISUAL [01-03]
                    </p>
                </div>

                {/* Stacked Video Cards */}
                <div className="relative flex flex-col items-center w-full">
                    {videos.map((video, index) => (
                        <div
                            key={index}
                            className="video-card-panel relative w-full rounded-[2.5rem] overflow-hidden mb-12"
                            style={{
                                backgroundColor: activeCardIndex === index ? "#1E1A17" : "#111111",
                                border: activeCardIndex === index
                                    ? "1px solid rgba(234, 154, 97, 0.3)"
                                    : "1px solid rgba(255, 255, 255, 0.08)",
                                minHeight: "calc(100vh - 120px)",
                                display: "flex",
                                flexDirection: "column",
                                transition: "background-color 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease",
                                zIndex: activeCardIndex === index ? 40 : 10 + index,
                                boxShadow: activeCardIndex === index
                                    ? "0 40px 100px -20px rgba(0, 0, 0, 0.8), 0 0 40px rgba(234, 154, 97, 0.1)"
                                    : "none",
                            }}
                        >
                            <div className="card-inner w-full flex flex-col items-center justify-center min-h-[calc(100vh-120px)] pt-16 pb-6 px-6 md:pt-24 md:pb-10 md:px-10 relative z-10">
                                {/* Video Container - Natural Ratio */}
                                <div className="relative w-full flex justify-center items-center mb-8 group-hover:scale-[1.02] transition-transform duration-700">
                                    <video
                                        ref={el => { videoRefs.current[index] = el; }}
                                        loop
                                        muted
                                        playsInline
                                        poster={video.poster}
                                        aria-label={`${video.title} music video by ROV Studios`}
                                        title={`${video.title} - ROV Studios`}
                                        className="max-w-full max-h-[70vh] rounded-3xl shadow-2xl"
                                        style={{ width: 'auto', height: 'auto' }}
                                    />
                                </div>

                                {/* Text Container - Smaller and Below */}
                                <div className="flex items-center gap-6 z-20">
                                    <span className="text-[#EA9A61] font-mono text-lg opacity-80 tracking-widest">
                                        0{index + 1}
                                    </span>
                                    <div className="h-[1px] w-12 bg-[#EA9A61]/50" />
                                    <h3
                                        className="text-4xl md:text-5xl font-bold tracking-wide uppercase"
                                        style={{
                                            fontFamily: "Norwige, sans-serif",
                                            fontStyle: "italic",
                                            color: activeCardIndex === index ? "#EA9A61" : "#FFF4E3",
                                            transition: "color 0.6s ease",
                                        }}
                                    >
                                        {video.title}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
