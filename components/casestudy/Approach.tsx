'use client';

import React from 'react';

interface ApproachItem {
    title: string;
    descriptions: string[];
}

interface ApproachProps {
    title?: string;
    items?: ApproachItem[];
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
    ]
}) => {
    return (
        <div>
            {/* Title */}
            <h3
                className="text-5xl md:text-6xl font-black mb-12 uppercase tracking-tight"
                style={{ color: '#C90000' }}
            >
                {title}
            </h3>

            {/* Approach Items */}
            <div className="space-y-6">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="group relative rounded-3xl p-8 md:p-10 transition-all duration-300 border-2"
                        style={{
                            backgroundColor: '#1A0A0A',
                            borderColor: '#8B4513'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#C90000';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#8B4513';
                        }}
                    >
                        <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-start">
                            {/* Left: Title */}
                            <h4 className="text-2xl md:text-3xl font-semibold text-white flex-shrink-0 md:w-1/3">
                                {item.title}
                            </h4>

                            {/* Right: Descriptions */}
                            <div className="flex-1 space-y-2">
                                {item.descriptions.map((desc, descIndex) => (
                                    <p
                                        key={descIndex}
                                        className="text-lg text-gray-300 leading-relaxed"
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
