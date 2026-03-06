'use client';

import React from 'react';

interface ApproachItem {
    title: string;
    descriptions: string[];
}

interface ApproachProps {
    title?: string;
    items?: ApproachItem[];
    titleColor?: string;
    titleFont?: string;
    borderColor?: string;
    hoverBorderColor?: string;
    hoverBgColor?: string;
    bgColor?: string;
    textColor?: string;
}

export const Approach: React.FC<ApproachProps> = ({
    title = "APPROACH",
    items = [
        {
            title: "Design Language",
            descriptions: [
                "Hand-drawn type with bold, playful visuals",
                "Expressive style balanced with clear readability"
            ]
        },
        {
            title: "UX & Functionality",
            descriptions: [
                "Ordering flow refined to remove friction",
                "Mobile-first design across all touchpoints"
            ]
        },
        {
            title: "Experience Front to Back",
            descriptions: [
                "A digital space that reflects the physical brand",
                "Built to encourage connection and loyalty"
            ]
        },
        {
            title: "Backend & Marketing Integration",
            descriptions: [
                "SMS marketing and smart order controls",
                "Clear flow from cart to confirmation"
            ]
        }
    ],
    titleColor = '#C90000',
    titleFont = 'Hornset',
    borderColor = '#371606',
    hoverBorderColor = '#953200',
    hoverBgColor = 'rgba(149, 50, 0, 0.10)',
    bgColor = '#0E0A08',
    textColor = '#d1d5db'
}) => {
    return (
        <div>
            {/* Title */}
            <h3
                className="text-5xl md:text-6xl font-black mb-12 uppercase tracking-tight"
                style={{ color: titleColor, fontFamily: titleFont, letterSpacing: '0.1em' }}
            >
                {title}
            </h3>

            {/* Approach Items */}
            <div className="space-y-6">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="group relative p-8 md:p-10 transition-all duration-300"
                        style={{
                            borderRadius: '17px',
                            border: `2px solid ${borderColor}`,
                            backgroundColor: bgColor
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = hoverBorderColor;
                            e.currentTarget.style.backgroundColor = hoverBgColor;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = borderColor;
                            e.currentTarget.style.backgroundColor = bgColor;
                        }}
                    >
                        <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-start">
                            {/* Left: Title */}
                            <h4
                                className="text-2xl md:text-3xl font-semibold flex-shrink-0 md:w-1/3"
                                style={{ fontFamily: titleFont, letterSpacing: '0.1em', color: textColor === '#d1d5db' ? 'white' : textColor }}
                            >
                                {item.title}
                            </h4>

                            {/* Right: Descriptions */}
                            <div className="flex-1 space-y-4">
                                {item.descriptions.map((desc, descIndex) => (
                                    <p
                                        key={descIndex}
                                        className="text-lg leading-relaxed"
                                        style={{ fontFamily: 'HellasFun', color: textColor }}
                                    >
                                        {desc}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
