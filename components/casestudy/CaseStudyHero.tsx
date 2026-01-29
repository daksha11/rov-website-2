'use client';

import React from 'react';
import TextType from '@/components/TextType';

interface CaseStudyHeroProps {
    title: string[];
    titleColors: string[];
    backgroundImage: string;
}

export const CaseStudyHero: React.FC<CaseStudyHeroProps> = ({ title, titleColors, backgroundImage }) => {
    return (
        <section
            className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8"
            style={{
                backgroundImage: `url('${backgroundImage}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat"
            }}
        >
            {/* Dark Overlay */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.80) 0%, rgba(0, 0, 0, 0.20) 100%)'
                }}
            />

            {/* Content */}
            <div className="relative z-10 max-w-5xl mx-auto text-center">
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-8xl font-bold leading-relaxed">
                    {title.map((word, index) => (
                        <span
                            key={index}
                            className="block"
                            style={{
                                fontFamily: "Pearl Jean, sans-serif",
                                color: titleColors[index] || "#C90000",
                                textShadow: "4px 4px 8px rgba(0, 0, 0, 0.8)"
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
                            />
                        </span>
                    ))}
                </h1>
                {/* Arrow */}
                <div className="mt-8">
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
                            stroke="#FF4444"
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
