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
    bodyFont?: string;
    labelColor?: string;
    secondaryColor?: string;
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
    textColor = '#d1d5db',
    bodyFont = 'HellasFun',
    labelColor = 'white',
    secondaryColor = '#9ca3af'
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
            <p className="text-lg mb-12 leading-relaxed" style={{ fontFamily: bodyFont, color: textColor }}>
                {description}
            </p>

            <div className="flex flex-col gap-12">
                {/* Color Palette */}
                <div className="w-full">
                    <div className="flex flex-wrap gap-4">
                        {colors.map((colorItem, index) => (
                            <div
                                key={index}
                                className="flex-shrink-0 flex flex-col border border-gray-200 rounded-xl overflow-hidden shadow-sm"
                                style={{ width: '140px' }}
                            >
                                <div
                                    className="h-24 w-full"
                                    style={{ backgroundColor: colorItem.color }}
                                ></div>
                                <div className="px-3 py-3">
                                    <p className="text-xs font-medium mb-1" style={{ color: labelColor }}>
                                        {colorItem.name}
                                    </p>
                                    <p className="text-xs font-mono" style={{ color: secondaryColor, opacity: 0.7 }}>
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
                            <p className="text-xs mb-2" style={{ color: secondaryColor, opacity: 0.7 }}>
                                {typo.label}
                            </p>
                            <p className="leading-tight" style={{ ...typo.style, color: labelColor }}>
                                {typo.text}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
