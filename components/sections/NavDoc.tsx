"use client";

import { Instagram, Linkedin, Mail, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import GoogleLoginButton from "@/components/providers/GoogleLoginButton";

interface NavigationDockProps {
  className?: string;
}

// Services carry the weight of the menu, so they get the biggest type and the
// only accent color. Everything else is deliberately quieter.
const SERVICES = [
  { title: "Brand & Experience", to: "/brand", note: "Identity, and the touchpoints that carry it" },
  { title: "Web Development", to: "/web", note: "Sites built to be found and to convert" },
  { title: "Media Production", to: "/video-production", note: "Video, motion, and content that travels" },
  { title: "AI Solutions", to: "/ai-automation", note: "Automation that removes the busywork" },
];

// CTRL·A gets its own doorway at the bottom, so it stays out of this row.
const SECONDARY = [
  { title: "Home", to: "/" },
  { title: "Work", to: "/works" },
  { title: "Resources", to: "/resources" },
  { title: "Pricing", to: "/pricing" },
  { title: "Studio", to: "/about" },
  { title: "Contact", to: "/contact" },
];

const RESOURCES = [
  { kind: "Toolkit", title: "The Web Dev Toolkit", to: "/resources/toolkits/web-dev" },
  { kind: "Playbook", title: "What Real Estate Agents Take Home", to: "/resources/playbooks/real-estate-agents" },
  { kind: "Guide", title: "What a Website Costs in Atlanta", to: "/web/how-much-does-a-website-cost-in-atlanta" },
];

const FEATURED = [
  {
    title: "The Bando",
    blurb: "Bounce rate cut 60%",
    to: "/casestudy/bando",
    img: "/casestudy/bando/bando1.webp",
  },
  {
    title: "Aysegul Ikna",
    blurb: "30% sales growth",
    to: "/casestudy/ikna",
    img: "/casestudy/ikna/fashion1ikna.webp",
  },
];

// The hero's display face: light, wide, uppercase. The menu speaks in it too.
const DISPLAY = { fontFamily: "'Norwige Light', sans-serif" } as const;

export function NavigationDock({ className }: NavigationDockProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  // Hover opens the panel on pointer devices; a click pins it so the panel
  // survives the cursor leaving. Touch only ever uses the click path.
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

  // Close on route change so the panel never trails the page it opened from.
  useEffect(() => {
    close();
  }, [pathname, close]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    // No scroll lock and no scroll container inside the panel: the wheel falls
    // through to the document, so the page keeps scrolling behind the menu.
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, close]);

  useEffect(() => clearTimers, []);

  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname?.startsWith(to));

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
            <span
              className={`block h-[1.5px] w-full bg-current transition-transform duration-300 ${open ? "translate-y-[5px] rotate-45" : ""}`}
            />
            <span
              className={`block h-[1.5px] w-full bg-current transition-all duration-300 ${open ? "opacity-0" : "group-hover:w-2/3"}`}
            />
            <span
              className={`block h-[1.5px] w-full bg-current transition-transform duration-300 ${open ? "-translate-y-[5px] -rotate-45" : ""}`}
            />
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
        {/* Blurred scrim — click anywhere off the content to close. The page
            underneath varies from near-black to bright hero art, so the scrim
            carries the type contrast, not the page. */}
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

        <div
          className={`relative h-full w-full overflow-hidden transition-transform duration-500 ease-out ${open ? "translate-y-0" : "-translate-y-2"}`}
        >
          {/* Wordmark sits on the grid's left edge and is optically centered
              against the trigger pill opposite it */}
          <div className="pointer-events-none absolute inset-x-0 top-4 md:top-6 z-10">
            <div className="mx-auto w-full max-w-6xl px-5 md:px-10">
              <Link
                href="/"
                onClick={close}
                style={DISPLAY}
                className="pointer-events-auto inline-flex h-11 md:h-12 items-center text-white text-[16px] md:text-[18px] font-bold uppercase tracking-[0.34em] hover:text-[#EA9A61] focus-visible:outline-none focus-visible:text-[#EA9A61] transition-colors"
              >
                R.O.V
              </Link>
            </div>
          </div>

          <div className="mx-auto flex min-h-full w-full max-w-6xl [align-items:safe_center] px-5 md:px-10 pt-24 md:pt-20 pb-8">
            <div className="w-full grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-x-20 lg:gap-y-8">
              {/* ── Left: services first, everything else after. Every element
                  shares one left edge; only the active dot lives in the gutter. ── */}
              <div className="-ml-4 md:-ml-7 pl-4 md:pl-7">
                <p style={DISPLAY} className="text-[#EA9A61] text-[11px] md:text-[12px] font-bold uppercase tracking-[0.34em] mb-6 md:mb-7">
                  What we do
                </p>

                <ul className="space-y-1.5 md:space-y-2">
                  {SERVICES.map((s) => (
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
                </ul>

                {/* CTRL·A: its own mark, so it reads as a separate place */}
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Link
                    href="/ctrla"
                    onClick={close}
                    aria-label="CTRL A, our creative community"
                    className="group inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/[0.04] pl-4 pr-5 py-2.5 hover:border-[#EA9A61]/60 hover:bg-[#EA9A61]/[0.08] focus-visible:outline-none focus-visible:border-[#EA9A61] transition-all duration-300"
                  >
                    <Image
                      src="/ctrla/ctrla-flat-logo-white.svg"
                      alt="CTRL A"
                      width={30}
                      height={22}
                      className="h-[22px] w-auto opacity-90 group-hover:opacity-100 transition-opacity"
                    />
                    <span className="h-4 w-px bg-white/20" />
                    <span style={DISPLAY} className="text-[12px] font-bold uppercase tracking-[0.24em] text-white/75 group-hover:text-white transition-colors">
                      The community
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#EA9A61] transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>

                  {/* Mobile keeps one CTA; the right column carries it on desktop */}
                  <Link
                    href="/contact"
                    onClick={close}
                    style={DISPLAY}
                    className="lg:hidden inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#EA9A61] via-[#C56A3C] to-[#90422C] px-5 py-2.5 text-[#FFF4E3] text-[12px] font-bold uppercase tracking-[0.22em]"
                  >
                    Start a project
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Socials + account, quiet at the bottom */}
                <div className="mt-7 flex items-center gap-6">
                  <a
                    href="https://www.instagram.com/rangeofviewstudios/?hl=en"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="text-white/65 hover:text-white transition-colors"
                  >
                    <Instagram className="w-[18px] h-[18px]" />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/range-of-view-studios/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="text-white/65 hover:text-white transition-colors"
                  >
                    <Linkedin className="w-[18px] h-[18px]" />
                  </a>
                  <a
                    href="mailto:rangeofview@rovstudios.com"
                    aria-label="Email"
                    className="text-white/65 hover:text-white transition-colors"
                  >
                    <Mail className="w-[18px] h-[18px]" />
                  </a>
                  <span className="h-4 w-px bg-white/15" />
                  <span style={DISPLAY} className="[&_button]:text-white/65 [&_button:hover]:text-white [&_button]:text-[12px] [&_button]:font-bold [&_button]:uppercase [&_button]:tracking-[0.22em]">
                    <GoogleLoginButton />
                  </span>
                </div>
              </div>

              {/* ── Right: proof, then the one CTA. Desktop only —
                  on phones the left column carries the whole menu. ── */}
              <div className="hidden lg:block">
                <p style={DISPLAY} className="text-white/60 text-[11px] md:text-[12px] font-bold uppercase tracking-[0.34em] mb-6 md:mb-7">
                  Recent work
                </p>

                <div className="grid grid-cols-2 gap-3.5">
                  {FEATURED.map((f) => (
                    <Link
                      key={f.to}
                      href={f.to}
                      onClick={close}
                      className="group relative block overflow-hidden rounded-xl border border-white/10 h-[94px] md:h-[96px]"
                    >
                      <Image
                        src={f.img}
                        alt={f.title}
                        fill
                        sizes="(max-width: 1024px) 50vw, 210px"
                        className="object-cover opacity-[0.72] group-hover:opacity-95 group-hover:scale-[1.03] transition-all duration-500"
                      />
                      <span className="absolute inset-0 bg-gradient-to-t from-[#0B0603] via-[#0B0603]/45 to-transparent" />
                      <span className="absolute left-3.5 right-3.5 bottom-3">
                        <span style={DISPLAY} className="block text-white text-[14px] font-bold uppercase tracking-[0.12em]">{f.title}</span>
                        <span className="block mt-1 font-sans text-white/75 text-[11.5px] font-medium leading-snug">{f.blurb}</span>
                      </span>
                    </Link>
                  ))}
                </div>

                <Link
                  href="/works"
                  onClick={close}
                  className="group mt-3 flex items-center justify-between border-b border-white/[0.14] pb-3 text-white/85 hover:text-white transition-colors focus-visible:outline-none focus-visible:text-[#EA9A61]"
                >
                  <span style={DISPLAY} className="text-[13px] font-bold uppercase tracking-[0.22em]">All work</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                {/* Resources: the reason to come back before there is a project */}
                <p style={DISPLAY} className="mt-6 text-white/60 text-[11px] md:text-[12px] font-bold uppercase tracking-[0.34em] mb-3">
                  Resources
                </p>
                <ul className="space-y-0">
                  {RESOURCES.map((r) => (
                    <li key={r.to}>
                      <Link
                        href={r.to}
                        onClick={close}
                        className="group flex items-baseline gap-4 border-b border-white/[0.10] py-2 focus-visible:outline-none focus-visible:text-white"
                      >
                        <span style={DISPLAY} className="shrink-0 w-[92px] text-[10.5px] font-bold uppercase tracking-[0.2em] text-[#EA9A61]">
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
                  href="/resources"
                  onClick={close}
                  className="group mt-3 flex items-center justify-between text-white/85 hover:text-white transition-colors focus-visible:outline-none focus-visible:text-[#EA9A61]"
                >
                  <span style={DISPLAY} className="text-[13px] font-bold uppercase tracking-[0.22em]">The resource hub</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <div className="mt-6 rounded-xl border border-[#EA9A61]/25 bg-[#EA9A61]/[0.07] p-4 md:p-5">
                  <p style={DISPLAY} className="text-white text-[16px] md:text-[18px] font-bold uppercase tracking-[0.08em] leading-snug">
                    Have a project in mind?
                  </p>
                  <p className="mt-3 font-sans text-white/75 text-[13.5px] font-medium leading-[1.65]">
                    Tell us what you are building. We will come back with a plan, a price, and a timeline.
                  </p>
                  <Link
                    href="/contact"
                    onClick={close}
                    style={DISPLAY}
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#EA9A61] via-[#C56A3C] to-[#90422C] px-6 py-3 text-[#FFF4E3] text-[13px] font-bold uppercase tracking-[0.22em] hover:-translate-y-[1px] transition-transform"
                  >
                    Start a project
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
