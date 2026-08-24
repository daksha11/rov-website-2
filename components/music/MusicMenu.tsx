"use client";

import { Instagram, Mail, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { CAL_LINKS, CONTACT_EMAIL } from "@/data/soundPricing";
import CalBookButton from "@/components/sound/CalBookButton";
import { credits } from "@/app/sound/credits/credits-data";

// Floating menu for rovmusic.com. Same interaction and visual language as the
// studios NavigationDock (trigger pill top right, blurred full-screen panel,
// big uppercase display type, accent dot on the active route), with music
// content and without the B2B services, account login, or CTRL A door.
//
// Replaced the old bottom dock, which could only ever hold four links and left
// /toolkit, /credits, /atlanta-studios and /blog unreachable from the chrome.

// The pages that carry the weight. Biggest type, only accent color.
const PRIMARY = [
    { title: "The Chain", to: "/toolkit", note: "How a record moves through our room, stage by stage" },
    { title: "Credits", to: "/credits", note: "Every record named and linked. Go listen" },
    { title: "Atlanta Studios", to: "/atlanta-studios", note: "The honest comparison, including the rooms we are not" },
    { title: "Journal", to: "/blog", note: "Session notes, plugin breakdowns, release strategy" },
];

const SECONDARY = [
    { title: "Home", to: "/" },
    { title: "Pricing", to: "/pricing" },
    { title: "Sam Suen", to: "/sam-suen" },
];

// Curated, not a feed: this is a client component so it cannot read the posts
// off disk. Add the newest post here when it is worth promoting.
const READS = [
    { kind: "Guide", title: "What it costs to mix a song in Atlanta", to: "/blog/how-much-does-it-cost-to-mix-a-song-in-atlanta" },
    { kind: "Craft", title: "Can mastering fix a bad mix?", to: "/blog/can-mastering-fix-a-bad-mix" },
];

const FEATURED = credits.filter((c) => c.featured).slice(0, 2);

// The music host's display face, matched to the studios menu.
const DISPLAY = { fontFamily: "'Norwige Light', sans-serif" } as const;

export function MusicMenu({ className }: { className?: string }) {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    const pinned = useRef(false);
    const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const clearTimers = () => {
        if (openTimer.current) clearTimeout(openTimer.current);
        if (closeTimer.current) clearTimeout(closeTimer.current);
        openTimer.current = null;
        closeTimer.current = null;
    };

    const close = useCallback(() => {
        clearTimers();
        pinned.current = false;
        setOpen(false);
    }, []);

    const hoverOpen = () => {
        if (typeof window !== "undefined" && !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
        clearTimers();
        openTimer.current = setTimeout(() => setOpen(true), 90);
    };

    const hoverClose = () => {
        if (pinned.current) return;
        clearTimers();
        closeTimer.current = setTimeout(() => setOpen(false), 220);
    };

    useEffect(() => {
        close();
    }, [pathname, close]);

    useEffect(() => {
        if (!open) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") close();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [open, close]);

    useEffect(() => clearTimers, []);

    // The music host serves /sound/* paths at clean top-level URLs, so match
    // both: on localhost the pathname is still /sound/toolkit.
    const isActive = (to: string) => {
        if (!pathname) return false;
        if (to === "/") return pathname === "/" || pathname === "/sound";
        return pathname.startsWith(to) || pathname.startsWith(`/sound${to}`);
    };

    return (
        <>
            {/* Floating trigger — top right, always available */}
            <div
                className={`fixed top-4 right-4 md:top-6 md:right-6 z-[1001] ${className || ""}`}
                onMouseEnter={hoverOpen}
                onMouseLeave={hoverClose}
            >
                <button
                    type="button"
                    aria-expanded={open}
                    aria-label={open ? "Close menu" : "Open menu"}
                    onClick={() => {
                        clearTimers();
                        if (open && pinned.current) {
                            close();
                        } else {
                            pinned.current = true;
                            setOpen(true);
                        }
                    }}
                    className="group flex items-center gap-2.5 rounded-full border border-white/20 bg-black/80 backdrop-blur-md px-4 md:px-5 h-11 md:h-12 text-white hover:border-[#EA9A61]/60 focus-visible:outline-none focus-visible:border-[#EA9A61] transition-all duration-300"
                >
                    <span style={DISPLAY} className="text-[12px] md:text-[13px] font-bold uppercase tracking-[0.26em]">
                        {open ? "Close" : "Menu"}
                    </span>
                    <span className="relative flex h-3 w-4 flex-col justify-between">
                        <span className={`block h-[1.5px] w-full bg-current transition-transform duration-300 ${open ? "translate-y-[5px] rotate-45" : ""}`} />
                        <span className={`block h-[1.5px] w-full bg-current transition-all duration-300 ${open ? "opacity-0" : "group-hover:w-2/3"}`} />
                        <span className={`block h-[1.5px] w-full bg-current transition-transform duration-300 ${open ? "-translate-y-[5px] -rotate-45" : ""}`} />
                    </span>
                </button>
            </div>

            {/* Panel */}
            <div
                className={`fixed inset-0 z-[1000] transition-all duration-500 ${open ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}
                onMouseEnter={() => clearTimers()}
                onMouseLeave={hoverClose}
                aria-hidden={!open}
            >
                <button
                    type="button"
                    aria-label="Close menu"
                    tabIndex={-1}
                    onClick={close}
                    className="absolute inset-0 w-full h-full cursor-default bg-[#0B0603]/[0.88] backdrop-blur-md"
                />
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(100deg, rgba(11,6,3,0.55) 0%, rgba(11,6,3,0.28) 48%, rgba(11,6,3,0.55) 100%)",
                    }}
                />

                <div className={`relative h-full w-full overflow-hidden transition-transform duration-500 ease-out ${open ? "translate-y-0" : "-translate-y-2"}`}>
                    <div className="pointer-events-none absolute inset-x-0 top-4 md:top-6 z-10">
                        <div className="mx-auto w-full max-w-6xl px-5 md:px-10">
                            <Link
                                href="/"
                                onClick={close}
                                style={DISPLAY}
                                className="pointer-events-auto inline-flex h-11 md:h-12 items-center text-white text-[16px] md:text-[18px] font-bold uppercase tracking-[0.34em] hover:text-[#EA9A61] focus-visible:outline-none focus-visible:text-[#EA9A61] transition-colors"
                            >
                                R.O.V Music
                            </Link>
                        </div>
                    </div>

                    <div className="mx-auto flex min-h-full w-full max-w-6xl [align-items:safe_center] px-5 md:px-10 pt-24 md:pt-20 pb-8">
                        <div className="w-full grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-x-20 lg:gap-y-8">
                            {/* Left */}
                            <div className="-ml-4 md:-ml-7 pl-4 md:pl-7">
                                <p style={DISPLAY} className="text-[#EA9A61] text-[11px] md:text-[12px] font-bold uppercase tracking-[0.34em] mb-6 md:mb-7">
                                    The studio
                                </p>

                                <ul className="space-y-1.5 md:space-y-2">
                                    {PRIMARY.map((s) => (
                                        <li key={s.to}>
                                            <Link
                                                href={s.to}
                                                onClick={close}
                                                className="group relative -ml-4 md:-ml-7 block pl-4 md:pl-7 py-1 rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#EA9A61]/60"
                                            >
                                                <span
                                                    className={`absolute left-0 top-[0.68em] md:top-[0.74em] h-2 w-2 rounded-full bg-[#EA9A61] transition-all duration-300 ${isActive(s.to) ? "opacity-100 scale-100" : "opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100"}`}
                                                />
                                                <span
                                                    style={DISPLAY}
                                                    className={`block text-[24px] leading-[1.25] md:text-[38px] md:leading-[1.2] font-bold uppercase tracking-[0.1em] transition-colors duration-300 ${isActive(s.to) ? "text-white" : "text-white/90 group-hover:text-white"}`}
                                                >
                                                    {s.title}
                                                </span>
                                                <span className="block mt-1.5 font-sans text-[12.5px] md:text-[13px] font-medium tracking-[0.01em] text-white/55 md:opacity-0 md:-translate-y-1 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300">
                                                    {s.note}
                                                </span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-8 md:mt-9 h-px w-full max-w-lg bg-white/[0.14]" />

                                <ul className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3.5 max-w-lg">
                                    {SECONDARY.map((l) => (
                                        <li key={l.to}>
                                            <Link
                                                href={l.to}
                                                onClick={close}
                                                style={DISPLAY}
                                                className={`inline-block text-[14px] md:text-[15px] font-bold uppercase tracking-[0.2em] transition-colors focus-visible:outline-none focus-visible:text-[#EA9A61] ${isActive(l.to) ? "text-[#EA9A61]" : "text-white/75 hover:text-white"}`}
                                            >
                                                {l.title}
                                            </Link>
                                        </li>
                                    ))}
                                    <li>
                                        <Link
                                            href="/#audit"
                                            onClick={close}
                                            style={DISPLAY}
                                            className="inline-block text-[14px] md:text-[15px] font-bold uppercase tracking-[0.2em] text-white/75 hover:text-white transition-colors focus-visible:outline-none focus-visible:text-[#EA9A61]"
                                        >
                                            Free audit
                                        </Link>
                                    </li>
                                </ul>

                                {/* The studios door, mirroring CTRL A's on the other side */}
                                <div className="mt-7 flex flex-wrap items-center gap-3">
                                    <a
                                        href="https://www.rovstudios.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Range of View Studios, the agency side"
                                        className="group inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/[0.04] pl-4 pr-5 py-2.5 hover:border-[#EA9A61]/60 hover:bg-[#EA9A61]/[0.08] focus-visible:outline-none focus-visible:border-[#EA9A61] transition-all duration-300"
                                    >
                                        <Image
                                            src="/brand/rov-logo.webp"
                                            alt="Range of View Studios"
                                            width={26}
                                            height={22}
                                            className="h-[22px] w-auto opacity-90 group-hover:opacity-100 transition-opacity"
                                        />
                                        <span className="h-4 w-px bg-white/20" />
                                        <span style={DISPLAY} className="text-[12px] font-bold uppercase tracking-[0.24em] text-white/75 group-hover:text-white transition-colors">
                                            The studio side
                                        </span>
                                        <ArrowRight className="w-4 h-4 text-[#EA9A61] transition-transform duration-300 group-hover:translate-x-1" />
                                    </a>

                                    <span className="lg:hidden">
                                        <CalBookButton
                                            calLink={CAL_LINKS.hourlySession}
                                            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#EA9A61] via-[#C56A3C] to-[#90422C] px-5 py-2.5 text-[#FFF4E3] text-[12px] font-bold uppercase tracking-[0.22em]"
                                            style={DISPLAY}
                                        >
                                            Book a session
                                        </CalBookButton>
                                    </span>
                                </div>

                                <div className="mt-7 flex items-center gap-6">
                                    <a
                                        href="https://www.instagram.com/rangeofviewstudios/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Instagram"
                                        className="text-white/65 hover:text-white transition-colors"
                                    >
                                        <Instagram className="w-[18px] h-[18px]" />
                                    </a>
                                    <a
                                        href="https://open.spotify.com/user/31uh2vy4lgdzfrp47tudxzn7bhuq"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Spotify"
                                        className="text-white/65 hover:text-white transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 496 512" className="w-[18px] h-[18px]">
                                            <path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm113.7 364.7c-4.1 6.6-12.8 8.6-19.4 4.5-53.1-32.3-119.8-39.6-198.4-21.6-7.5 1.7-15-3.1-16.7-10.6-1.7-7.5 3.1-15 10.6-16.7 84.5-19.2 158.1-10.8 217.8 25.3 6.6 4.1 8.6 12.8 4.5 19.4zm26.6-58.6c-5.1 8.3-16 10.9-24.3 5.8-60.8-37.2-153.8-48-224.7-26.2-9.1 2.7-18.6-2.5-21.3-11.6-2.7-9.1 2.5-18.6 11.6-21.3 79.6-23.8 181.4-11.7 249.7 30.1 8.3 5.1 10.9 16 5.8 24.3z" />
                                        </svg>
                                    </a>
                                    <a
                                        href={`mailto:${CONTACT_EMAIL}`}
                                        aria-label="Email"
                                        className="text-white/65 hover:text-white transition-colors"
                                    >
                                        <Mail className="w-[18px] h-[18px]" />
                                    </a>
                                </div>
                            </div>

                            {/* Right: proof, then the one CTA */}
                            <div className="hidden lg:block">
                                <p style={DISPLAY} className="text-white/60 text-[11px] md:text-[12px] font-bold uppercase tracking-[0.34em] mb-6 md:mb-7">
                                    Recent records
                                </p>

                                <div className="grid grid-cols-2 gap-3.5">
                                    {FEATURED.map((f) => (
                                        <Link
                                            key={f.spotifyUrl}
                                            href="/credits"
                                            onClick={close}
                                            className="group relative block overflow-hidden rounded-xl border border-white/10 h-[94px] md:h-[96px]"
                                        >
                                            <Image
                                                src={f.cover}
                                                alt={`${f.title} by ${f.artist}`}
                                                fill
                                                sizes="(max-width: 1024px) 50vw, 210px"
                                                className="object-cover opacity-[0.72] group-hover:opacity-95 group-hover:scale-[1.03] transition-all duration-500"
                                            />
                                            <span className="absolute inset-0 bg-gradient-to-t from-[#0B0603] via-[#0B0603]/45 to-transparent" />
                                            <span className="absolute left-3.5 right-3.5 bottom-3">
                                                <span style={DISPLAY} className="block text-white text-[14px] font-bold uppercase tracking-[0.12em]">{f.title}</span>
                                                <span className="block mt-1 font-sans text-white/75 text-[11.5px] font-medium leading-snug">{f.artist}</span>
                                            </span>
                                        </Link>
                                    ))}
                                </div>

                                <Link
                                    href="/credits"
                                    onClick={close}
                                    className="group mt-3 flex items-center justify-between border-b border-white/[0.14] pb-3 text-white/85 hover:text-white transition-colors focus-visible:outline-none focus-visible:text-[#EA9A61]"
                                >
                                    <span style={DISPLAY} className="text-[13px] font-bold uppercase tracking-[0.22em]">All credits</span>
                                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                                </Link>

                                <p style={DISPLAY} className="mt-6 text-white/60 text-[11px] md:text-[12px] font-bold uppercase tracking-[0.34em] mb-3">
                                    Worth reading
                                </p>
                                <ul className="space-y-0">
                                    {READS.map((r) => (
                                        <li key={r.to}>
                                            <Link
                                                href={r.to}
                                                onClick={close}
                                                className="group flex items-baseline gap-4 border-b border-white/[0.10] py-2 focus-visible:outline-none focus-visible:text-white"
                                            >
                                                <span style={DISPLAY} className="shrink-0 w-[62px] text-[10.5px] font-bold uppercase tracking-[0.2em] text-[#EA9A61]">
                                                    {r.kind}
                                                </span>
                                                <span className="font-sans text-[13.5px] font-medium tracking-[0.01em] text-white/80 group-hover:text-white transition-colors">
                                                    {r.title}
                                                </span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    href="/blog"
                                    onClick={close}
                                    className="group mt-3 flex items-center justify-between text-white/85 hover:text-white transition-colors focus-visible:outline-none focus-visible:text-[#EA9A61]"
                                >
                                    <span style={DISPLAY} className="text-[13px] font-bold uppercase tracking-[0.22em]">The journal</span>
                                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                                </Link>

                                <div className="mt-6 rounded-xl border border-[#EA9A61]/25 bg-[#EA9A61]/[0.07] p-4 md:p-5">
                                    <p style={DISPLAY} className="text-white text-[16px] md:text-[18px] font-bold uppercase tracking-[0.08em] leading-snug">
                                        Got a record to finish?
                                    </p>
                                    <p className="mt-3 font-sans text-white/75 text-[13.5px] font-medium leading-[1.65]">
                                        First mix and master is $50. Studio time is $65 an hour with both included.
                                    </p>
                                    <CalBookButton
                                        calLink={CAL_LINKS.hourlySession}
                                        className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#EA9A61] via-[#C56A3C] to-[#90422C] px-6 py-3 text-[#FFF4E3] text-[13px] font-bold uppercase tracking-[0.22em] hover:-translate-y-[1px] transition-transform"
                                        style={DISPLAY}
                                    >
                                        Book a session
                                    </CalBookButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MusicMenu;
