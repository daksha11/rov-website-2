'use client';

import React from 'react';

interface ResultProps {
    title?: string;
    statistic?: string;
    description?: string;
    ctaText?: string;
    ctaLink?: string;
    titleColor?: string;
    titleFont?: string;
    statisticGradient?: string;
    ctaBorderColor?: string;
    ctaHoverBgColor?: string;
    textColor?: string;
    bodyFont?: string;
}

export const Result: React.FC<ResultProps> = ({
    title = "RESULT",
    statistic = "60%",
    description = "Within three months of launch, The Bando's website reduced bounce rate by 60%, turning curiosity into orders and repeat visits. The digital experience finally matched the bold, unapologetically Atlanta energy of the restaurant itself.",
    ctaText = "Explore Our Services",
    ctaLink = "/#services",
    titleColor = '#C90000',
    titleFont = 'Hornset',
    statisticGradient = 'linear-gradient(91deg, #D76C00 0.74%, #953200 100%)',
    ctaBorderColor = '#C90000',
    ctaHoverBgColor = '#C90000',
    textColor = '#d1d5db',
    bodyFont = 'HellasFun'
}) => {
    return (
        <div>
            <style>{`
                .result-cta-btn:hover {
                    background-color: var(--cta-hover-bg) !important;
                }
            `}</style>
            {/* Title */}
            <h3
                className="text-5xl md:text-6xl font-black mb-16 uppercase tracking-tight"
                style={{ color: titleColor, fontFamily: titleFont, letterSpacing: '0.1em' }}
            >
                {title}
            </h3>

            {/* Main Content */}
            <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20 mb-16">
                {/* Large Statistic */}
                <div className="flex-shrink-0">
                    <p
                        className="font-black leading-none"
                        style={{
                            fontFamily: titleFont,
                            letterSpacing: '0.1em',
                            fontSize: 'clamp(6rem, 15vw, 12rem)',
                            background: statisticGradient,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        {statistic}
                    </p>
                </div>

                {/* Description */}
                <div className="flex-1">
                    <p className="text-lg md:text-xl leading-relaxed" style={{ fontFamily: bodyFont, color: textColor }}>
                        {description}
                    </p>
                </div>
            </div>

            {/* CTA Button */}
            <div className="flex justify-center items-center w-full text-center mx-auto">
                <a
                    href={ctaLink}
                    className="result-cta-btn inline-block px-12 py-4 text-lg font-semibold border-2 rounded-xl transition-all duration-300 hover:scale-105 mx-auto"
                    style={{
                        fontFamily: bodyFont,
                        borderColor: ctaBorderColor,
                        color: textColor,
                        backgroundColor: 'transparent',
                        '--cta-hover-bg': ctaHoverBgColor,
                    } as React.CSSProperties}
                >
                    {ctaText}
                </a>
            </div>
        </div>
    );
};
