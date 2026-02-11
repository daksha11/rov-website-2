'use client';

import React from 'react';
import TextType from '@/components/TextType';

interface CaseStudyHeroProps {
    title: string[];
    titleColors: string[];
    backgroundImage: string;
    titleFont?: string;
    enableBlur?: boolean;
}

export const CaseStudyHero: React.FC<CaseStudyHeroProps> = ({
    title,
    titleColors,
    backgroundImage,
    titleFont = "Pearl Jean, sans-serif",
    enableBlur = false
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
            <div className="relative z-10 max-w-7xl mx-auto text-center">
                <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-bold leading-relaxed">
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
                {/* Arrow */}
                <div className="mt-12">
                    <svg
                        width="60"
                        height="80"
                        viewBox="0 0 60 80"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="mx-auto animate-bounce"
                    >
                        <path
                            d="M30 0 L30 60 M10 40 L30 60 L50 40"
                            stroke="#1A4D2E"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
            </div>
        </section>
    );
};
