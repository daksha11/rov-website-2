'use client';

import React from 'react';

interface OverviewSectionProps {
    title: string;
    content: string;
    titleColor?: string;
    titleFont?: string;
    textColor?: string;
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({
    title,
    content,
    titleColor = '#C90000',
    titleFont = 'Hornset',
    textColor = 'white'
}) => {
    return (
        <div>
            <h2
                className="text-4xl md:text-5xl font-bold mb-6"
                style={{
                    fontFamily: titleFont,
                    color: titleColor,
                    letterSpacing: '0.1em'
                }}
            >
                {title}
            </h2>
            <p className="text-lg leading-relaxed" style={{ fontFamily: 'HellasFun', color: textColor }}>
                {content}
            </p>
        </div>
    );
};
