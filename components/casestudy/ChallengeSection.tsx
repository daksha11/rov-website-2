'use client';

import React from 'react';

interface ChallengeSectionProps {
    title: string;
    content: string;
}

export const ChallengeSection: React.FC<ChallengeSectionProps> = ({ title, content }) => {
    return (
        <div
            className="p-8 md:p-10 bg-black/60"
            style={{
                borderRadius: '30px',
                border: '2px solid #CC6200'
            }}
        >
            <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-start">
                <h3
                    className="text-4xl md:text-5xl font-bold whitespace-nowrap flex-shrink-0"
                    style={{
                        fontFamily: 'Pearl Jean, cursive',
                        background: 'linear-gradient(91deg, #D76C00 0.74%, #953200 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}
                >
                    {title}
                </h3>
                <p
                    className="text-base md:text-lg leading-relaxed"
                    style={{
                        fontFamily: 'Roboto, sans-serif',
                        background: 'linear-gradient(91deg, #D76C00 0.74%, #953200 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}
                >
                    {content}
                </p>
            </div>
        </div>
    );
};
