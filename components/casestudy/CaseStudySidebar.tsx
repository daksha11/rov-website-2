'use client';

import React, { useState, useEffect } from 'react';

interface SidebarItem {
    id: string;
    label: string;
}

interface CaseStudySidebarProps {
    items: SidebarItem[];
    activeSection?: string;
    activeColor?: string;
    onSectionClick?: (id: string) => void;
}

export const CaseStudySidebar: React.FC<CaseStudySidebarProps> = ({
    items,
    activeSection = items[0]?.id || '',
    activeColor = '#920000',
    onSectionClick
}) => {
    const [active, setActive] = useState(activeSection);

    // Stable reference for item IDs to avoid re-creating the observer on every render
    const itemIds = items.map(i => i.id).join(',');

    // Scroll spy effect
    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActive(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        // Observe all sections
        const ids = itemIds.split(',');
        ids.forEach((id) => {
            const element = document.getElementById(id);
            if (element) {
                observer.observe(element);
            }
        });

        return () => {
            observer.disconnect();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [itemIds]);

    const handleClick = (id: string) => {
        setActive(id);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <aside className="lg:sticky lg:top-24 lg:self-start w-full lg:w-48 flex-shrink-0">
            <nav
                className="p-4 space-y-2"
                style={{
                    borderRadius: '36px',
                    background: '#D2D2D2'
                }}
            >
                {items.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => handleClick(item.id)}
                        className="w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-300"
                        style={{
                            color: active === item.id ? activeColor : '#000000',
                            backgroundColor: 'transparent'
                        }}
                    >
                        {item.label}
                    </button>
                ))}
            </nav>
        </aside>
    );
};
