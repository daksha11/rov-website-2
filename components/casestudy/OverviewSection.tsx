'use client';

import React from 'react';

interface OverviewSectionProps {
    title: string;
    content: string;
    titleColor?: string;
    titleFont?: string;
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({
    title,
    content,
    titleColor = '#C90000',
    titleFont = 'Pearl Jean, cursive'
}) => {
    return (
        <div>
            <h2
                className="text-4xl md:text-5xl font-bold mb-6"
                style={{
                    fontFamily: titleFont,
                    color: titleColor
                }}
            >
                {title}
            </h2>
            <p className="text-lg text-white leading-relaxed" style={{ fontFamily: 'Roboto, sans-serif' }}>
                {content}
            </p>
        </div>
    );
};
