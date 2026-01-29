'use client';

import React from 'react';

interface ColorItem {
    name: string;
    hex: string;
    color: string;
}

interface TypographyItem {
    label: string;
    font: string;
    text: string;
    style?: React.CSSProperties;
}

interface DesignSystemProps {
    title?: string;
    description?: string;
    colors?: ColorItem[];
    typography?: TypographyItem[];
}

export const DesignSystem: React.FC<DesignSystemProps> = ({
    title = "DESIGN SYSTEM",
    description = "Color and typography are fully defined and ready to scale.",
    colors = [
        { name: "grey - 100", hex: "#F9F9F9", color: "#F9F9F9" },
        { name: "grey - 200", hex: "#2F2F2F", color: "#2F2F2F" },
        { name: "grey - 300", hex: "#000000", color: "#000000" },
        { name: "red", hex: "#C90000", color: "#C90000" },
        { name: "orange", hex: "#A84000", color: "#A84000" },
        { name: "yellow", hex: "#FFD600", color: "#FFD600" },
    ],
    typography = [
        {
            label: "Main Typography - Pearl Jean",
            font: "Pearl Jean",
            text: "BOLD TYPE THAT SPEAKS BEFORE YOU READ.",
            style: { fontFamily: 'Sedgwick Ave Display, cursive', fontWeight: 'bold', fontSize: '2.5rem' }
        },
        {
            label: "Body Typography - Chelsea Market",
            font: "Chelsea Market",
            text: "Bold type that speaks before you read.",
            style: { fontFamily: 'Chelsea Market, cursive', fontWeight: 'bold', fontSize: '2rem' }
        },
        {
            label: "Accent Typography - Marceloup",
            font: "Marceloup",
            text: "BOLD TYPE THAT SPEAKS BEFORE YOU READ.",
            style: { fontFamily: 'Brush Script MT, cursive', fontWeight: 'bold', fontSize: '2rem' }
        },
    ]
}) => {
    return (
        <div>
            {/* Title */}
            <h3
                className="text-5xl md:text-6xl font-black mb-4 uppercase tracking-tight"
                style={{ color: '#C90000', fontFamily: 'Pearl Jean, cursive' }}
            >
                {title}
            </h3>

            {/* Description */}
            <p className="text-lg text-gray-300 mb-12 leading-relaxed" style={{ fontFamily: 'Roboto, sans-serif' }}>
                {description}
            </p>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Color Palette */}
                <div className="flex-shrink-0">
                    <div className="grid grid-cols-3 gap-4">
                        {colors.map((colorItem, index) => (
                            <div key={index} className="flex flex-col">
                                <div
                                    className="w-24 h-24 rounded-t-xl"
                                    style={{ backgroundColor: colorItem.color }}
                                ></div>
                                <div className="bg-white rounded-b-xl px-3 py-3">
                                    <p className="text-xs font-medium text-black mb-1">
                                        {colorItem.name}
                                    </p>
                                    <p className="text-xs text-gray-600 font-mono">
                                        {colorItem.hex}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Typography */}
                <div className="flex-1 space-y-8">
                    {typography.map((typo, index) => (
                        <div key={index}>
                            <p className="text-xs text-gray-400 mb-2">
                                {typo.label}
                            </p>
                            <p className="text-white leading-tight" style={typo.style}>
                                {typo.text}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
