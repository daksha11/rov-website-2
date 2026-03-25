"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Footer from "@/components/Footer";

// Register GSAP plugins
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function LandingPage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [firstFrameLoaded, setFirstFrameLoaded] = useState(false);

    // Configuration
    const frameCount = 652; // 00000 to 00651
    const images = useRef<HTMLImageElement[]>([]);
    const airpods = useRef({ frame: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        // Set canvas dimensions
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Preload images
        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            const frameNumber = String(i).padStart(5, "0");
            img.src = `/videoFrames/SpiralShotHorizontal60fpsV2_${frameNumber}.webp`;
            images.current[i] = img;

            // Show canvas when first frame loads
            if (i === 0) {
                img.onload = () => {
                    setFirstFrameLoaded(true);
                    render();
                };
            }
        }

        // Render function
        const render = () => {
            const frameIndex = Math.min(
                Math.floor(airpods.current.frame),
                frameCount - 1
            );
            const img = images.current[frameIndex];

            if (img && img.complete) {
                context.clearRect(0, 0, canvas.width, canvas.height);

                // Calculate scaling to contain image within canvas while maintaining aspect ratio
                const scale = Math.min(
                    canvas.width / img.width,
                    canvas.height / img.height
                );
                const x = (canvas.width - img.width * scale) / 2;
                const y = (canvas.height - img.height * scale) / 2;

                context.drawImage(img, x, y, img.width * scale, img.height * scale);
            }
        };

        // Handle window resize
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            render();
        };

        window.addEventListener("resize", handleResize);

        // GSAP ScrollTrigger animation
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
                pin: true,
                anticipatePin: 1,
            },
        });

        // Animate through frames (0% to 90%)
        tl.to(
            airpods.current,
            {
                frame: frameCount - 1,
                snap: "frame",
                ease: "none",
                onUpdate: render,
            },
            0
        );

        // Fade out canvas at last 5-10% (90% to 100%)
        tl.to(
            canvas,
            {
                opacity: 0,
                ease: "power2.inOut",
                onComplete: () => {
                    // Dispatch custom event when landing animation completes
                    const event = new CustomEvent("landingComplete");
                    window.dispatchEvent(event);

                },
            },
            0.9 // Start fade at 90% of timeline
        );

        // Cleanup
        return () => {
            window.removeEventListener("resize", handleResize);
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

    return (
        <div className="relative">
            {/* Main scroll container - height determines scroll duration */}
            <div
                ref={containerRef}
                className="relative w-full"
                style={{ height: "1000vh" }}
            >
                {/* Canvas - hidden until first frame loads */}
                <canvas
                    ref={canvasRef}
                    className="fixed top-0 left-0 w-full h-full"
                    style={{
                        opacity: firstFrameLoaded ? 1 : 0,
                        transition: "opacity 0.3s ease-in",
                    }}
                />

                {/* Loading indicator */}
                {!firstFrameLoaded && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black text-white z-50">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
                            <p className="text-xl">Loading experience...</p>
                        </div>
                    </div>
                )}

                {/* Overlay component placeholder - will be supplied later */}
                <div className="fixed inset-0 pointer-events-none z-10">
                    {/* Overlay content will go here */}
                </div>
            </div>

            {/* Content after the animation */}
            <div className="relative bg-white min-h-screen">
                {/* Additional content can be added here */}
                <Footer />
            </div>
        </div>
    );
}
