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
    titleColor?: string;
    titleFont?: string;
    textColor?: string;
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
    ],
    titleColor = '#C90000',
    titleFont = 'Hornset',
    textColor = '#d1d5db'
}) => {
    return (
        <div>
            {/* Title */}
            <h3
                className="text-5xl md:text-6xl font-black mb-4 uppercase tracking-tight"
                style={{ color: titleColor, fontFamily: titleFont, letterSpacing: '0.1em' }}
            >
                {title}
            </h3>

            {/* Description */}
            <p className="text-lg mb-12 leading-relaxed" style={{ fontFamily: 'HellasFun', color: textColor }}>
                {description}
            </p>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Color Palette */}
                <div className="flex-shrink-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {colors.map((colorItem, index) => (
                            <div key={index} className="flex flex-col border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                <div
                                    className="h-24 w-full"
                                    style={{ backgroundColor: colorItem.color }}
                                ></div>
                                <div className="px-3 py-3">
                                    <p className="text-xs font-medium text-white mb-1">
                                        {colorItem.name}
                                    </p>
                                    <p className="text-xs text-gray-400 font-mono">
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
                            <p className="text-xs mb-2" style={{ color: textColor === '#d1d5db' ? '#9ca3af' : textColor, opacity: 0.7 }}>
                                {typo.label}
                            </p>
                            <p className="leading-tight" style={{ ...typo.style, color: textColor === '#d1d5db' ? 'white' : textColor }}>
                                {typo.text}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
