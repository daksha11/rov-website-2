"use client";

import React from 'react';

const SoundHero: React.FC = () => {
    return (
        <section className="flex flex-col items-center justify-center relative px-6 md:px-12 py-8 bg-black min-h-[90vh]">
            <div className="w-full max-w-[95%] md:max-w-7xl relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl h-[80vh] flex flex-col justify-start pt-16 md:pt-24">
                {/* Background Image */}
                {/* Background Video */}
                <video
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster="/heroassets/samxbasuvid.png"
                >
                    <source src="/soundpage/starscollidemv.mp4" type="video/mp4" />
                </video>

                {/* Dark & Blurred Overlay */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

                {/* Content */}
                <div className="relative z-20 px-8 md:px-16 w-full">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 md:gap-6 pb-12">
                        {/* Left side - Tagline */}
                        <div className="flex flex-col">
                            <div className="flex items-center gap-3">
                                <span className="text-[#FFF4E3] text-4xl md:text-5xl lg:text-6xl font-bold italic tracking-wide" style={{ fontFamily: 'Norwige, sans-serif' }}>
                                    RAW.
                                </span>

                                <div className="relative flex items-center">
                                    {/* Refined Pill */}
                                    <span
                                        className="bg-[#8B7355] text-[#FFF4E3] text-4xl md:text-5xl lg:text-6xl font-bold italic px-6 py-2 rounded-2xl tracking-wide relative z-20"
                                        style={{ fontFamily: 'Norwige, sans-serif' }}
                                    >
                                        REFINED.
                                    </span>
                                    {/* Filled Brown Circle - Adjusted margin for separation */}
                                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#8B7355] -ml-4 relative z-10" />

                                    {/* Outlined White Circle */}
                                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-[#FFF4E3] -ml-8 relative z-30" />
                                </div>
                            </div>

                            <span className="text-[#FFF4E3] text-4xl md:text-5xl lg:text-6xl font-bold italic tracking-wide mt-2" style={{ fontFamily: 'Norwige, sans-serif' }}>
                                RELEASED.
                            </span>
                        </div>

                        {/* Right side - Description */}
                        <div className="max-w-sm mb-2">
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
