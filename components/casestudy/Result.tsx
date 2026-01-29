'use client';

import React from 'react';

interface ResultProps {
    title?: string;
    statistic?: string;
    description?: string;
    ctaText?: string;
    ctaLink?: string;
}

export const Result: React.FC<ResultProps> = ({
    title = "RESULT",
    statistic = "60%",
    description = "Within three months of launch, The Bando's website reduced bounce rate by 60%, turning curiosity into orders and repeat visits. The digital experience finally matched the bold, unapologetically Atlanta energy of the restaurant itself.",
    ctaText = "Explore Our Services",
    ctaLink = "/#services"
}) => {
    return (
        <div>
            {/* Title */}
            <h3
                className="text-5xl md:text-6xl font-black mb-16 uppercase tracking-tight"
                style={{ color: '#C90000', fontFamily: 'Pearl Jean, cursive' }}
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
                            fontSize: 'clamp(6rem, 15vw, 12rem)',
                            background: 'linear-gradient(91deg, #D76C00 0.74%, #953200 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}
                    >
                        {statistic}
                    </p>
                </div>

                {/* Description */}
                <div className="flex-1">
                    <p className="text-lg md:text-xl text-gray-300 leading-relaxed" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        {description}
                    </p>
                </div>
            </div>

            {/* CTA Button */}
            <div className="flex justify-center items-center w-full text-center mx-auto">
                <a
                    href={ctaLink}
                    className="inline-block px-12 py-4 text-lg font-semibold text-white border-2 border-[#C90000] rounded-xl transition-all duration-300 hover:bg-[#C90000] hover:scale-105 mx-auto"
                >
                    {ctaText}
                </a>
            </div>
        </div>
    );
};
