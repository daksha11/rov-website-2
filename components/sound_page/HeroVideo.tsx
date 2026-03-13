"use client";

import React from 'react';

const HeroVideo: React.FC = () => {
    return (
        <section className="w-full h-[90vh] relative bg-black flex items-center justify-center p-6 md:p-12">
            {/* Background Image Container */}
            <div
                role="img"
                aria-label="ROV Studios sound engineering hero"
                className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl"
                style={{
                    backgroundImage: `url('/heroassets/samxbasuvid.webp')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat"
                }}
            >
                {/* Optional: Add a subtle overlay if needed to make it feel more like a video player container, 
                     but keeping it clean for now as per "Music Video Playing" placeholder idea */}
                <div className="absolute inset-0 bg-black/10" />
            </div>
        </section>
    );
};

export default HeroVideo;
