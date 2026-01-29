'use client';

import React from 'react';

interface ChallengeSectionProps {
    title: string;
    content: string;
}

export const ChallengeSection: React.FC<ChallengeSectionProps> = ({ title, content }) => {
    return (
        <div className="border border-gray-700 rounded-3xl p-8 md:p-10 bg-black/60">
            <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-start">
                <h3
                    className="text-4xl md:text-5xl font-bold whitespace-nowrap flex-shrink-0"
                    style={{
                        background: 'linear-gradient(180deg, rgba(215, 108, 0, 1) 0%, rgba(149, 50, 0, 1) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}
                >
                    {title}
                </h3>
                <p
                    className="text-base md:text-lg leading-relaxed"
                    style={{
                        background: 'linear-gradient(180deg, rgba(215, 108, 0, 1) 0%, rgba(149, 50, 0, 1) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}
                >
                    {content}
                </p>
            </div>
        </div>
    );
};
