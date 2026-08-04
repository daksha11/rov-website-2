"use client";

// Shared CTA button. Three things make it read as expensive rather than as a
// coloured rectangle: an oversized gradient that drifts on hover (so the colour
// moves instead of just brightening), the existing cta-shine sweep, and an arrow
// that slides. The glow lifts on hover too, which is what sells the press.
//
// variant="solid" is the primary gradient. variant="ghost" is the outlined
// sibling, same geometry so the two sit together without fighting.

import Link from "next/link";

const BODY = "'Roboto', sans-serif";

type Props = {
    href: string;
    children: React.ReactNode;
    variant?: "solid" | "ghost";
    external?: boolean;
    className?: string;
};

export default function GradientButton({
    href,
    children,
    variant = "solid",
    external = false,
    className = "",
}: Props) {
    const solid = variant === "solid";

    const inner = (
        <span className="relative z-10 inline-flex items-center gap-2">
            {children}
            <span
                aria-hidden="true"
                className="inline-block transition-transform duration-300 group-hover:translate-x-1"
            >
                &rarr;
            </span>
        </span>
    );

    const base =
        "group relative inline-flex items-center justify-center overflow-hidden rounded-full px-8 py-4 text-[0.78rem] font-bold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:-translate-y-0.5";

    if (!solid) {
        return (
            <Link
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={`${base} border-[1.5px] border-white/40 hover:border-[#EA9A61]/70 hover:bg-white/[0.06] ${className}`}
                style={{ fontFamily: BODY }}
            >
                {inner}
            </Link>
        );
    }

    return (
        <Link
            href={href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className={`${base} cta-shine brand-cta ${className}`}
            style={{ fontFamily: BODY }}
        >
            {inner}
        </Link>
    );
}
