'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface CaseStudyHeroProps {
    title: string[];
    titleColors: string[];
    backgroundImage: string;
    titleFont?: string;
    enableBlur?: boolean;
    liveLink?: string;
    buttonAccentColor?: string;
    buttonFont?: string;
    objectPosition?: string;
}

const spring = { type: "spring" as const, stiffness: 80, damping: 20 };

export const CaseStudyHero: React.FC<CaseStudyHeroProps> = ({
    title,
    titleColors,
    backgroundImage,
    titleFont = "Norwige, sans-serif",
    enableBlur = false,
    liveLink = "https://www.thebandoatl.com/",
    buttonAccentColor = "#C90000",
    objectPosition = "center center",
}) => {
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    filter: enableBlur ? "blur(10px)" : "none",
                    transform: enableBlur ? "scale(1.15)" : "none",
                }}
            >
                <Image
                    src={backgroundImage}
                    alt={title.join(' ')}
                    fill
                    priority
                    sizes="100vw"
                    style={{ objectFit: 'cover', objectPosition }}
                />
            </div>

            {/* Overlay — heavier at top and bottom for readability */}
            <div
                className="absolute inset-0 z-[1]"
                style={{
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.85) 100%)',
                }}
            />

            {/* Content */}
            <div className="relative z-10 max-w-6xl mx-auto text-center w-full px-6">
                <h1 className="mb-8">
                    {title.map((word, index) => (
                        <motion.span
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ ...spring, delay: index * 0.15 }}
                            className="block font-bold"
                            style={{
                                fontFamily: titleFont,
                                color: titleColors[index] || buttonAccentColor,
                                letterSpacing: '0.12em',
                                lineHeight: '1.05',
                                fontSize: 'clamp(2.5rem, 8vw, 6rem)',
                                ...(titleColors[index] !== '#ffffff' && titleColors[index] !== '#FFFFFF'
                                    ? { textShadow: `0 0 40px ${titleColors[index]}40` }
                                    : { textShadow: '0 2px 20px rgba(0,0,0,0.5)' }
                                ),
                            }}
                        >
                            {word}
                        </motion.span>
                    ))}
                </h1>

                {/* Divider line */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ ...spring, delay: 0.5 }}
                    className="mx-auto mb-10"
                    style={{
                        width: 80,
                        height: 2,
                        background: buttonAccentColor,
                        opacity: 0.6,
                    }}
                />

                {/* CTA Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...spring, delay: 0.6 }}
                >
                    <a
                        href={liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-4 px-8 py-4 rounded-full border transition-all duration-500"
                        style={{
                            borderColor: `${buttonAccentColor}50`,
                            background: 'rgba(0,0,0,0.5)',
                            backdropFilter: 'blur(12px)',
                            fontFamily: "'Roboto', sans-serif",
                        }}
                    >
                        <span
                            className="text-white text-xs md:text-sm font-medium uppercase tracking-[0.2em]"
                        >
                            Visit Live Website
                        </span>
                        <span
                            className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110"
                            style={{ background: buttonAccentColor }}
                        >
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="white"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="transform transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            >
                                <path d="M7 17L17 7M17 7H7M17 7v10" />
                            </svg>
                        </span>
                    </a>
                </motion.div>
            </div>

            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-[2]" />
        </section>
    );
};
