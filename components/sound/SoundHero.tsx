"use client";

import React from 'react';

const SoundHero: React.FC = () => {
    // Only mount/autoplay the heavy hero video on >=768px. On mobile we render
    // the poster image only, so phones never download the 10 MB mp4.
    const [isDesktop, setIsDesktop] = React.useState(false);

    React.useEffect(() => {
        if (typeof window === "undefined" || !window.matchMedia) return;
        const mq = window.matchMedia("(min-width: 768px)");
        const update = () => setIsDesktop(mq.matches);
        update();
        mq.addEventListener("change", update);
        return () => mq.removeEventListener("change", update);
    }, []);

    return (
        <section className="flex flex-col items-center justify-center relative px-6 md:px-12 py-8 bg-black min-h-[90vh]">
            <div className="w-full max-w-[95%] md:max-w-7xl relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl h-[80vh] flex flex-col justify-start pt-10 md:pt-16">
                {/* Background Image */}
                {/* Background Video (desktop) / poster image (mobile) */}
                {isDesktop ? (
                    <video
                        className="absolute inset-0 w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        poster="/thumbnails/soundhero.webp"
                        aria-label="Stars Collide music video by ROV Studios"
                        title="Stars Collide - ROV Studios Sound Engineering"
                    >
                        <source src="/soundpage/starscollidemv.mp4" type="video/mp4" />
                    </video>
                ) : (
                    <img
                        src="/thumbnails/soundhero.webp"
                        alt="Stars Collide music video by ROV Studios"
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="eager"
                    />
                )}

                {/* Dark & Blurred Overlay */}
                <div className="absolute inset-0 bg-black/40" />

                {/* Content */}
                <div className="relative z-20 px-8 md:px-16 w-full">
                    <span className="block text-white/40 mb-6 uppercase" style={{ fontFamily: 'Roboto, sans-serif', fontSize: '12px', letterSpacing: '0.2em' }}>
                        Sound Engineering
                    </span>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-start gap-12 md:gap-6 pb-12 pt-2 md:pt-4">
                        {/* Left side - Tagline */}
                        <h1 className="flex flex-col">
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                                <span className="text-[#FFF4E3] text-3xl md:text-5xl lg:text-6xl tracking-wide leading-none" style={{ fontFamily: 'NorwigeHeroItalic, sans-serif', fontWeight: 'normal' }}>
                                    RAW.
                                </span>

                                <div className="relative flex items-center scale-90 md:scale-100 origin-left">
                                    {/* Refined Pill */}
                                    <span
                                        className="bg-[#8B7355] text-[#FFF4E3] text-3xl md:text-5xl lg:text-6xl px-4 md:px-6 py-1 md:py-2 rounded-2xl tracking-wide relative z-20"
                                        style={{ fontFamily: 'NorwigeHeroItalic, sans-serif', fontWeight: 'normal' }}
                                    >
                                        REFINED.
                                    </span>
                                    {/* Filled Brown Circle - Adjusted margin for separation */}
                                    <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-[#8B7355] -ml-1 md:-ml-2 relative z-10" />

                                    {/* Outlined White Circle */}
                                    <div className="w-10 h-10 md:w-16 md:h-16 rounded-full border-2 border-[#FFF4E3] -ml-4 md:-ml-6 relative z-30" />
                                </div>
                            </div>

                            <span className="text-[#FFF4E3] text-3xl md:text-5xl lg:text-6xl tracking-wide mt-2" style={{ fontFamily: 'NorwigeHeroItalic, sans-serif', fontWeight: 'normal' }}>
                                RELEASED.
                            </span>
                        </h1>

                        {/* Right side - Description */}
                        <div className="max-w-sm pt-2">
                            <p className="text-[#FFF4E3] text-lg md:text-xl italic leading-tight text-right md:text-left drop-shadow-md" style={{ fontFamily: 'Norwige, sans-serif' }}>
                                From bedroom demos to radio-<br />ready hits, your sound unleashed<br />in just 48 hours.
                            </p>
                        </div>
                    </div>

                    {/* Bottom CTA Text - Removed from here */}
                </div>
            </div>

        </section>
    );
};

export default SoundHero;
