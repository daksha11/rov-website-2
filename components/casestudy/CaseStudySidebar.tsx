'use client';

import React, { useState } from 'react';

interface SidebarItem {
    id: string;
    label: string;
}

interface CaseStudySidebarProps {
    items: SidebarItem[];
    activeSection?: string;
    onSectionClick?: (id: string) => void;
}

export const CaseStudySidebar: React.FC<CaseStudySidebarProps> = ({
    items,
    activeSection = items[0]?.id || '',
    onSectionClick
}) => {
    const [active, setActive] = useState(activeSection);

    const handleClick = (id: string) => {
        setActive(id);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <aside className="lg:sticky lg:top-24 lg:self-start w-full lg:w-48 flex-shrink-0">
            <nav className="bg-[#2A2A2A] rounded-2xl p-4 space-y-2">
                {items.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => handleClick(item.id)}
                        className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-300 ${active === item.id
                            ? 'bg-[#C90000] text-white'
                            : 'hover:bg-[#3A3A3A] text-gray-300'
                            }`}
                    >
                        {item.label}
                    </button>
                ))}
            </nav>
        </aside>
    );
};
