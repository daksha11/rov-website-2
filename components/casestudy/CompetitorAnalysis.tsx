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
}

export const CompetitorAnalysis: React.FC<CompetitorAnalysisProps> = ({
    title,
    description,
    competitors,
    comparisonData,
    insight,
}) => {
    return (
        <div>
            {/* Title */}
            <h3
                className="text-5xl md:text-6xl font-black mb-6 uppercase tracking-tight"
                style={{ color: '#C90000' }}
            >
                {title}
            </h3>

            {/* Description */}
            <p className="text-lg text-gray-300 mb-12 leading-relaxed">
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
                                        className={`py-6 px-6 align-middle ${isHighlightColumn
                                            ? 'border-x-2 border-t-2 border-b-0 border-[#C90000] rounded-t-2xl'
                                            : 'border-r border-gray-700'
                                            }`}
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
                    <tbody className="text-gray-300">
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
                                                className={`text-center py-6 px-6 border-t border-gray-800 ${isHighlightColumn
                                                    ? `bg-[#2A0A0A] border-l-2 border-r-2 border-[#C90000] ${isLastRow ? 'border-b-2 rounded-b-2xl' : ''
                                                    }`
                                                    : 'border-r border-gray-800'
                                                    }`}
                                            >
                                                {hasFeature ? (
                                                    <div
                                                        className={`w-4 h-4 rounded-full mx-auto ${isHighlightColumn
                                                            ? 'bg-[#C90000]'
                                                            : 'bg-white'
                                                            }`}
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
                        stroke="#C90000"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>

            {/* Insight Box */}
            <div className="border-2 border-gray-700 rounded-2xl p-6 bg-black/40">
                <div className="flex items-start gap-4">
                    <span
                        className="px-4 py-2 rounded-full text-sm font-bold text-white whitespace-nowrap"
                        style={{ backgroundColor: '#8B4513' }}
                    >
                        INSIGHT
                    </span>
                    <p className="text-gray-300 leading-relaxed">{insight}</p>
                </div>
            </div>
        </div>
    );
};
