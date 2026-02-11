'use client';

import React from 'react';

interface ResultProps {
    title?: string;
    statistic?: string;
    description?: string;
    ctaText?: string;
    ctaLink?: string;
    titleColor?: string;
    statisticGradient?: string;
    ctaBorderColor?: string;
    ctaHoverBgColor?: string;
    textColor?: string;
}

export const Result: React.FC<ResultProps> = ({
    title = "RESULT",
    statistic = "60%",
    description = "Within three months of launch, The Bando's website reduced bounce rate by 60%, turning curiosity into orders and repeat visits. The digital experience finally matched the bold, unapologetically Atlanta energy of the restaurant itself.",
    ctaText = "Explore Our Services",
    ctaLink = "/#services",
    titleColor = '#C90000',
    statisticGradient = 'linear-gradient(91deg, #D76C00 0.74%, #953200 100%)',
    ctaBorderColor = '#C90000',
    ctaHoverBgColor = '#C90000',
    textColor = '#d1d5db'
}) => {
    return (
        <div>
            {/* Title */}
            <h3
                className="text-5xl md:text-6xl font-black mb-16 uppercase tracking-tight"
                style={{ color: titleColor, fontFamily: 'Hornset', letterSpacing: '0.1em' }}
            >
                {title}
            </h3>

            {/* Main Content */}
            <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20 mb-16">
                {/* Large Statistic */}
                <div className="flex-shrink-0">
                    <p
                        className="font-black leading-none text-white"
                        style={{
                            fontFamily: 'Hornset',
                            letterSpacing: '0.1em',
                            fontSize: 'clamp(6rem, 15vw, 12rem)',
                        }}
                    >
                        {statistic}
                    </p>
                </div>

                {/* Description */}
                <div className="flex-1">
                    <p className="text-lg md:text-xl leading-relaxed" style={{ fontFamily: 'HellasFun', color: textColor }}>
                        {description}
                    </p>
                </div>
            </div>

            {/* CTA Button */}
            <div className="flex justify-center items-center w-full text-center mx-auto">
                <a
                    href={ctaLink}
                    className="inline-block px-12 py-4 text-lg font-semibold text-white border-2 rounded-xl transition-all duration-300 hover:scale-105 mx-auto"
                    style={{
                        fontFamily: 'HellasFun',
                        borderColor: ctaBorderColor,
                        // Using a data attribute or class approach for hover might be cleaner, 
                        // but inline styles for hover require state or CSS-in-JS.
                        // For simplicity, we'll use a style tag or rely on tailwind classes if we could, 
                        // but these are dynamic colors.
                        // Let's use a ref or style tag trick, OR just set the color variable if using CSS variables.
                        // Actually, for this specific case, standard style prop doesn't support hover.
                        // I will add a dynamic style tag safely.
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = ctaHoverBgColor;
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                >
                    {ctaText}
                </a>
            </div>
        </div>
    );
};
