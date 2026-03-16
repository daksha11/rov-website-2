"use client";

import { useState, useEffect, useRef } from "react";
import type { NavSection } from "./types";

/** Fires once when the element enters the viewport */
export function useInView(threshold = 0.2) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
            { threshold },
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [threshold]);
    return { ref, visible };
}

/** Returns the currently-visible section id based on scroll position */
export function useScrollSpy(sections: NavSection[]) {
    const [active, setActive] = useState(sections[0]?.id ?? "");
    useEffect(() => {
        if (!sections.length) return;
        setActive(sections[0].id);
        const handler = () => {
            for (const s of sections) {
                const el = document.getElementById(s.id);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top <= 140 && rect.bottom > 140) { setActive(s.id); break; }
                }
            }
        };
        window.addEventListener("scroll", handler, { passive: true });
        return () => window.removeEventListener("scroll", handler);
    }, [sections]);
    return active;
}
