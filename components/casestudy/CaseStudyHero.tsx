'use client';

import React from 'react';
import TextType from '@/components/TextType';

interface CaseStudyHeroProps {
    title: string[];
    titleColors: string[];
    backgroundImage: string;
    titleFont?: string;
    enableBlur?: boolean;
    liveLink?: string;
}

export const CaseStudyHero: React.FC<CaseStudyHeroProps> = ({
    title,
    titleColors,
    backgroundImage,
    titleFont = "Pearl Jean, sans-serif",
    enableBlur = false,
    liveLink = "https://www.thebandoatl.com/"
}) => {
    return (
        <section
            className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden"
        >
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `url('${backgroundImage}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    filter: enableBlur ? "blur(8px)" : "none",
                    transform: enableBlur ? "scale(1.1)" : "none"
                }}
            />

            {/* Dark Overlay */}
            <div
                className="absolute inset-0 z-1"
                style={{
                    background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.80) 0%, rgba(0, 0, 0, 0.20) 100%)'
                }}
            />

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto text-center w-full px-4 overflow-hidden">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-relaxed">
                    {title.map((word, index) => (
                        <span
                            key={index}
                            className="block"
                            style={{
                                fontFamily: titleFont,
                                color: titleColors[index] || "#C90000",
                                textShadow: "4px 4px 8px rgba(0, 0, 0, 0.8)",
                                letterSpacing: '0.2em',
                                lineHeight: '1.1'
                            }}
                        >
                            <TextType
                                text={word}
                                as="span"
                                typingSpeed={100}
                                initialDelay={index * 800}
                                loop={false}
                                showCursor={false}
                                className="inline-block"
                                style={{ letterSpacing: '0.2em' }}
                            />
                        </span>
                    ))}
                </h1>
                {/* CTA Button */}
                <div className="mt-16 pb-8 flex justify-center">
                    <div className="relative group/btn cursor-pointer">
                        {/* Animated Glow Behind Button */}
                        <div className="absolute -inset-1.5 bg-gradient-to-r from-[#C90000] via-[#FFD600] to-[#C90000] rounded-full blur-md opacity-30 group-hover/btn:opacity-75 transition duration-500 group-hover/btn:duration-200" style={{ backgroundSize: '200% 200%', animation: 'gradient-xy 3s ease infinite' }}></div>

                        <a
                            href={liveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative flex items-center justify-center gap-4 px-10 py-5 bg-black/80 backdrop-blur-xl border border-white/10 rounded-full text-white font-bold tracking-[0.25em] uppercase text-xs md:text-sm transition-all duration-300 group-hover/btn:bg-[#C90000]/20 group-hover/btn:shadow-[inset_0_0_20px_rgba(201,0,0,0.5)] group-hover/btn:border-[#C90000]/50 font-sans"
                        >
                            <span>Visit Live Website</span>
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-colors duration-300 group-hover/btn:bg-[#FFD600]">
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="transform transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 group-hover/btn:text-black"
                                >
                                    <path d="M5 12h14" />
                                    <path d="M12 5l7 7-7 7" />
                                </svg>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};
