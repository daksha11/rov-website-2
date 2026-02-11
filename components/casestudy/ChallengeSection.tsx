'use client';

import React from 'react';

interface ChallengeSectionProps {
    title: string;
    content: string;
    gradient?: string;
    backgroundColor?: string;
}

export const ChallengeSection: React.FC<ChallengeSectionProps> = ({
    title,
    content,
    gradient = 'linear-gradient(91deg, #D76C00 0.74%, #953200 100%)',
    backgroundColor = 'rgba(0, 0, 0, 0.60)'
}) => {
    return (
        <div
            className="p-8 md:p-10"
            style={{
                backgroundColor: backgroundColor,
                borderRadius: '30px',
                border: '2px solid',
                borderImageSource: gradient,
                borderImageSlice: 1
            }}
        >
            <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-start">
                <h3
                    className="text-4xl md:text-5xl font-bold whitespace-nowrap flex-shrink-0 text-white"
                    style={{
                        fontFamily: 'Hornset',
                        letterSpacing: '0.1em'
                    }}
                >
                    {title}
                </h3>
                <p
                    className="text-base md:text-lg leading-relaxed text-white"
                    style={{
                        fontFamily: 'HellasFun',
                    }}
                >
                    {content}
                </p>
            </div>
        </div>
    );
};
