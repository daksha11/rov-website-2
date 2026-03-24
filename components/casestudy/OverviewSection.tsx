'use client';

import React from 'react';

interface OverviewSectionProps {
    title: string;
    content: string;
    titleColor?: string;
    titleGradient?: string;
    titleFont?: string;
    textColor?: string;
    bodyFont?: string;
    titleItalic?: boolean;
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({
    title,
    content,
    titleColor = '#C90000',
    titleGradient,
    titleFont = 'Norwige, sans-serif',
    textColor = 'white',
    bodyFont = "'Roboto', sans-serif",
    titleItalic = false
}) => {
    return (
        <div>
            <h2
                className="text-4xl md:text-5xl font-bold mb-6"
                style={{
                    fontFamily: titleFont,
                    letterSpacing: '0.1em',
                    fontStyle: titleItalic ? 'italic' : undefined,
                    ...(titleGradient
                        ? { backgroundImage: titleGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }
                        : { color: titleColor }
                    ),
                }}
            >
                {title}
            </h2>
            <p className="text-lg leading-relaxed" style={{ fontFamily: bodyFont, color: textColor }}>
                {content}
            </p>
        </div>
    );
};
