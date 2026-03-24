'use client';

import React from 'react';

interface ChallengeSectionProps {
    title: string;
    content: string;
    gradient?: string;
    backgroundColor?: string;
    titleFont?: string;
    titleColor?: string;
    textColor?: string;
    bodyFont?: string;
    titleItalic?: boolean;
}

export const ChallengeSection: React.FC<ChallengeSectionProps> = ({
    title,
    content,
    gradient = 'linear-gradient(91deg, #D76C00 0.74%, #953200 100%)',
    backgroundColor = 'rgba(0, 0, 0, 0.60)',
    titleFont = 'Norwige, sans-serif',
    titleColor = 'white',
    textColor = 'white',
    bodyFont = "'Roboto', sans-serif",
    titleItalic = false
}) => {
    return (
        <div
            className="relative p-8 md:p-10 overflow-hidden"
            style={{
                backgroundColor: backgroundColor,
                borderRadius: '30px',
            }}
        >
            {/* Gradient border via pseudo-element to preserve border-radius */}
            <div
                className="absolute inset-0 rounded-[30px] pointer-events-none"
                style={{
                    padding: '2px',
                    background: gradient,
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                }}
            />

            <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-start">
                <h3
                    className="text-4xl md:text-5xl font-bold flex-shrink-0"
                    style={{
                        fontFamily: titleFont,
                        letterSpacing: '0.1em',
                        color: titleColor,
                        fontStyle: titleItalic ? 'italic' : undefined
                    }}
                >
                    {title}
                </h3>
                <p
                    className="text-base md:text-lg leading-relaxed"
                    style={{
                        fontFamily: bodyFont,
                        color: textColor
                    }}
                >
                    {content}
                </p>
            </div>
        </div>
    );
};
