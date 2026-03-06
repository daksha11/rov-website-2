'use client';

import React from 'react';

interface Competitor {
    name: string;
    logoStyle?: React.CSSProperties;
}

interface ComparisonRow {
    label: string;
    data: boolean[]; // true = checked, false = X mark
}

interface CompetitorAnalysisProps {
    title: string;
    description: string;
    competitors: Competitor[];
    comparisonData: ComparisonRow[];
    insight: string;
    titleColor?: string;
    titleFont?: string;
    highlightBorderColor?: string;
    highlightRowBgColor?: string;
    insightBadgeColor?: string;
    insightBorderColor?: string;
    checkColor?: string;
    textColor?: string;
}

export const CompetitorAnalysis: React.FC<CompetitorAnalysisProps> = ({
    title,
    description,
    competitors,
    comparisonData,
    insight,
    titleColor = '#C90000',
    titleFont = 'Hornset',
    highlightBorderColor = '#C90000',
    highlightRowBgColor = '#2A0A0A',
    insightBadgeColor = '#953200',
    insightBorderColor = '#953200',
    checkColor = '#C90000',
    textColor = '#d1d5db' // text-gray-300
}) => {
    return (
        <div>
            {/* Title */}
            <h3
                className="text-5xl md:text-6xl font-black mb-6 uppercase tracking-tight"
                style={{ color: titleColor, fontFamily: titleFont, letterSpacing: '0.1em' }}
            >
                {title}
            </h3>

            {/* Description */}
            <p className="text-lg mb-12 leading-relaxed" style={{ fontFamily: 'HellasFun', color: textColor }}>
                {description}
            </p>

            {/* Comparison Table with Logos as Headers */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            {/* Empty cell for row labels */}
                            <th className="py-6 px-6 border-r border-gray-700"></th>

                            {/* Competitor Logo Headers */}
                            {competitors.map((competitor, index) => {
                                const isHighlightColumn = index === competitors.length - 1;
                                return (
                                    <th
                                        key={index}
                                        className={`py-6 px-6 align-middle border-r border-gray-700`}
                                        style={isHighlightColumn ? {
                                            borderLeft: `2px solid ${highlightBorderColor}`,
                                            borderRight: `2px solid ${highlightBorderColor}`,
                                            borderTop: `2px solid ${highlightBorderColor}`,
                                            borderBottom: 'none',
                                            borderTopLeftRadius: '1rem',
                                            borderTopRightRadius: '1rem'
                                        } : {}}
                                    >
                                        <div className="flex items-center justify-center">
                                            <div className="rounded-lg px-6 py-4 bg-white flex items-center justify-center min-w-[160px]">

                                                <span style={competitor.logoStyle}>
                                                    {competitor.name}
                                                </span>
                                            </div>
                                        </div>
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody style={{ color: textColor }}>
                        {comparisonData.map((row, rowIndex) => {
                            const isLastRow = rowIndex === comparisonData.length - 1;
                            return (
                                <tr key={rowIndex}>
                                    <td className="py-6 px-6 text-lg border-r border-gray-800">
                                        {row.label}
                                    </td>
                                    {row.data.map((hasFeature, colIndex) => {
                                        const isHighlightColumn = colIndex === competitors.length - 1;
                                        return (
                                            <td
                                                key={colIndex}
                                                className={`text-center py-6 px-6 border-t border-gray-800 border-r border-gray-800`}
                                                style={isHighlightColumn ? {
                                                    backgroundColor: highlightRowBgColor,
                                                    borderLeft: `2px solid ${highlightBorderColor}`,
                                                    borderRight: `2px solid ${highlightBorderColor}`,
                                                    borderBottom: isLastRow ? `2px solid ${highlightBorderColor}` : undefined,
                                                    borderBottomLeftRadius: isLastRow ? '1rem' : undefined,
                                                    borderBottomRightRadius: isLastRow ? '1rem' : undefined,
                                                } : {}}
                                            >
                                                {hasFeature ? (
                                                    <div
                                                        className={`w-4 h-4 rounded-full mx-auto`}
                                                        style={{ backgroundColor: isHighlightColumn ? checkColor : 'white' }}
                                                    ></div>
                                                ) : (
                                                    <span className="text-3xl font-light">×</span>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Arrow Indicator */}
            <div className="flex justify-center my-10">
                <svg
                    width="40"
                    height="60"
                    viewBox="0 0 40 60"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M20 0 L20 45 M5 30 L20 45 L35 30"
                        stroke={insightBadgeColor}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>

            {/* Insight Box */}
            <div
                className="p-6 bg-black/40"
                style={{
                    borderRadius: '20px',
                    border: `2px solid ${insightBorderColor}`
                }}
            >
                <div className="flex items-start gap-4">
                    <span
                        className="px-4 py-2 text-sm font-bold text-white whitespace-nowrap"
                        style={{
                            borderRadius: '26.5px',
                            background: insightBadgeColor,
                            fontFamily: 'LostInSouth',
                            letterSpacing: '0.05em'
                        }}
                    >
                        INSIGHT
                    </span>
                    <p
                        className="leading-relaxed text-lg"
                        style={{ fontFamily: 'HellasFun', color: 'white' }} // Keep this white as the box has bg-black/40
                    >
                        {insight}
                    </p>
                </div>
            </div>
        </div>
    );
};
