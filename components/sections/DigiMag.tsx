"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type MouseEvent as ReactMouseEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TiltedCard from "@/components/effects/TiltedCard";

const mono = "var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)";

// Amber keyword + soft-marker highlight for the catalogue copy.
const Hi = ({ children }: { children: ReactNode }) => (
  <span style={{ color: "#E9C892" }}>{children}</span>
);
const Mark = ({ children }: { children: ReactNode }) => (
  <span
    className="rounded px-1"
    style={{ background: "rgba(196,154,108,0.16)", color: "#EDE8E0" }}
  >
    {children}
  </span>
);
const catalogTags = ["Monthly", "Free", "Prompt Vaults", "Brand Kits", "Made in ATL"];

// Warm light-brown cast shadows glow against the black field so every
// object lifts off the table instead of vanishing into the dark.
const shadowDeep =
  "drop-shadow(0 36px 62px rgba(214,178,128,0.22)) drop-shadow(0 14px 26px rgba(168,120,72,0.32))";
const shadowMid =
  "drop-shadow(0 26px 46px rgba(214,178,128,0.18)) drop-shadow(0 10px 18px rgba(168,120,72,0.27))";
const shadowSoft =
  "drop-shadow(0 18px 32px rgba(214,178,128,0.15)) drop-shadow(0 6px 11px rgba(168,120,72,0.22))";

type Piece = {
  src: string;
  poster?: string;
  alt: string;
  left: string;
  top: string;
  width: string;
  aspect: string;
  rotate: number;
  z: number;
  shadow: string;
  framed?: boolean;
};

// Scattered archive assemblage. Percentages keep the collage locked to the
// stage's aspect ratio, so it scales as one piece instead of reflowing.
const pieces: Piece[] = [
  {
    src: "/misc/woman2.webp",
    alt: "Vices",
    left: "3%",
    top: "6%",
    width: "20%",
    aspect: "3 / 4",
    rotate: -7,
    z: 10,
    shadow: shadowMid,
  },
  {
    src: "/heroassets/deepimagechild.jpg",
    alt: "Open Verse",
    left: "57%",
    top: "50%",
    width: "37%",
    aspect: "16 / 9",
    rotate: 5,
    z: 12,
    shadow: shadowMid,
  },
  {
    src: "/misc/chain.webp",
    alt: "ROV Chain",
    left: "12%",
    top: "42%",
    width: "16%",
    aspect: "1 / 1",
    rotate: -4,
    z: 20,
    shadow: shadowSoft,
  },
  {
    src: "/misc/ddk_1.webp",
    alt: "DDK Album",
    left: "75%",
    top: "28%",
    width: "15%",
    aspect: "1 / 1",
    rotate: 7,
    z: 22,
    shadow: shadowSoft,
  },
  {
    src: "/soundpage/starscollidemv.mp4",
    poster: "/soundpage/pedromvimg.webp",
    alt: "Stars Collide MV",
    left: "26%",
    top: "4%",
    width: "46%",
    aspect: "16 / 10",
    rotate: 1.5,
    z: 40,
    shadow: shadowDeep,
    framed: true,
  },
];

const DigiMag = () => {
  const router = useRouter();
  // Cursor-following "click to enter" hint. Appears on hover, follows the
  // cursor (positioned imperatively so the heavy card grid never re-renders on
  // move), and fades itself out after 6s even if the pointer stays inside.
  const [show, setShow] = useState(false);
  const tipRef = useRef<HTMLDivElement>(null);
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (fadeTimer.current) clearTimeout(fadeTimer.current);
    },
    []
  );

  const shownRef = useRef(false);
  const place = (x: number, y: number) => {
    const el = tipRef.current;
    if (el) {
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
    }
  };
  const armFade = () => {
    if (fadeTimer.current) clearTimeout(fadeTimer.current);
    fadeTimer.current = setTimeout(() => {
      shownRef.current = false;
      setShow(false);
    }, 6000);
  };
  // Follows the cursor and stays visible while moving; fades only after ~6s of
  // stillness, and re-appears on the next movement.
  const reveal = (e: ReactMouseEvent<HTMLDivElement>) => {
    place(e.clientX, e.clientY);
    if (!shownRef.current) {
      shownRef.current = true;
      setShow(true);
    }
    armFade();
  };
  const onLeave = () => {
    if (fadeTimer.current) clearTimeout(fadeTimer.current);
    shownRef.current = false;
    setShow(false);
  };
  const go = () => router.push("/ctrla");
  const onKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      go();
    }
  };

  return (
    <div
      id="digi-mag"
      role="link"
      tabIndex={0}
      aria-label="Open the CTRL·A magazine"
      onClick={go}
      onKeyDown={onKey}
      onMouseEnter={reveal}
      onMouseMove={reveal}
      onMouseLeave={onLeave}
      className="w-full px-6 sm:px-12 md:px-16 mt-16 mb-28 relative cursor-pointer"
      style={{ color: "#EDE8E0" }}
    >
      {/* Cursor-following enter hint (fades after 6s) */}
      <div
        ref={tipRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[1000] transition-opacity duration-500"
        style={{ opacity: show ? 1 : 0 }}
      >
        <span
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-medium tracking-[0.14em] uppercase"
          style={{
            transform: "translate(18px, 18px)",
            background: "#E4B93C",
            color: "#231A08",
            fontFamily: mono,
            boxShadow: "0 10px 26px -6px rgba(0,0,0,0.6)",
          }}
        >
          Enter CTRL·A
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 80% at 50% -10%, rgba(255,255,255,0.04), transparent 60%)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[1180px]">
        {/* ── Top bar: breadcrumb + registry actions ── */}
        <div className="flex items-center justify-between gap-4">
          <nav
            aria-label="Archive path"
            className="text-[11px] sm:text-[12px] tracking-[0.18em] uppercase"
            style={{ fontFamily: mono, color: "#8A837A" }}
          >
            CTRL·A <span className="opacity-40">/</span> Magazine{" "}
            <span className="opacity-40">/</span> Vol. 01{" "}
            <span className="opacity-40">/</span>{" "}
            <span style={{ color: "#EDE8E0" }}>Live</span>
          </nav>

          <div className="hidden sm:flex items-center gap-2">
            <Link
              href="/ctrla"
              aria-label="Read the current issue"
              className="group grid place-items-center h-8 w-8 rounded-md border transition-colors duration-300 hover:bg-white/[0.06]"
              style={{ borderColor: "rgba(255,255,255,0.10)" }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8A837A" strokeWidth="2" className="transition-colors duration-300 group-hover:stroke-[#EDE8E0]">
                <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              href="/ctrla"
              aria-label="Browse the CTRL·A archive"
              className="group grid place-items-center h-8 w-8 rounded-md border transition-colors duration-300 hover:bg-white/[0.06]"
              style={{ borderColor: "rgba(255,255,255,0.10)" }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8A837A" strokeWidth="2" className="transition-colors duration-300 group-hover:stroke-[#EDE8E0]">
                <rect x="4" y="4" width="6" height="6" rx="1" />
                <rect x="14" y="4" width="6" height="6" rx="1" />
                <rect x="4" y="14" width="6" height="6" rx="1" />
                <rect x="14" y="14" width="6" height="6" rx="1" />
              </svg>
            </Link>
          </div>
        </div>

        {/* ── Headline + metadata ── */}
        <div className="mt-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <h2
            className="leading-[0.92] uppercase"
            style={{
              fontFamily: "Norwige, sans-serif",
              fontWeight: 700,
              fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
              letterSpacing: "0.02em",
            }}
          >
            A digital muse<br className="hidden sm:block" /> for creatives
          </h2>

          <div
            className="shrink-0 text-[11px] sm:text-[12px] tracking-[0.16em] uppercase md:text-right"
            style={{ fontFamily: mono, color: "#8A837A" }}
          >
            <div style={{ color: "#EDE8E0" }}>CTRL·A · Digital Magazine</div>
            <div className="mt-1">Monthly · Vol. 01 · ATL</div>
          </div>
        </div>

        {/* ── Catalogue note: structured, highlighted preamble ── */}
        <div className="mt-9 max-w-3xl" style={{ fontFamily: mono }}>
          {/* caption rule */}
          <div className="flex items-center gap-3 mb-6">
            <span
              className="text-[11px] uppercase tracking-[0.22em] whitespace-nowrap"
              style={{ color: "#C1936A" }}
            >
              Catalogue Note
            </span>
            <span className="h-px flex-1" style={{ background: "rgba(255,255,255,0.12)" }} />
            <span
              className="text-[11px] uppercase tracking-[0.22em] whitespace-nowrap"
              style={{ color: "#8A837A" }}
            >
              Rec. 001–002
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-7 text-[14px] sm:text-[15px] leading-[1.75]" style={{ color: "#A79F94" }}>
            <div>
              <div className="mb-2 text-[11px] uppercase tracking-[0.2em]" style={{ color: "#8A837A" }}>
                001 — The Idea
              </div>
              <p>
                CTRL·A is where Range of View goes to play. Part magazine, part{" "}
                <Mark>creative community</Mark>, all the fun stuff we can&apos;t
                fit in a client deck, dropped fresh every month. Music, motion,
                brand, mischief: <Hi>select all</Hi>, keep what sparks.
              </p>
            </div>
            <div className="sm:border-l sm:pl-10" style={{ borderColor: "rgba(255,255,255,0.10)" }}>
              <div className="mb-2 text-[11px] uppercase tracking-[0.2em]" style={{ color: "#8A837A" }}>
                002 — What&apos;s Inside
              </div>
              <p>
                <Hi>Free</Hi> brand kits. Prompt vaults worth stealing. Toolkits
                that make you look good. New volume every month,{" "}
                <Mark>no gatekeeping</Mark>. Pop the current issue open and come
                make <Hi>something weird</Hi> with us.
              </p>
            </div>
          </div>

          {/* tag chips */}
          <div className="mt-7 flex flex-wrap gap-2">
            {catalogTags.map((t) => (
              <span
                key={t}
                className="rounded-full border px-3.5 py-1.5 text-[11px] uppercase tracking-[0.16em]"
                style={{ borderColor: "rgba(193,147,106,0.35)", color: "#C1936A" }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* ─────────────────────────────────────────────
            THE ASSEMBLAGE
           ───────────────────────────────────────────── */}

        {/* Desktop / tablet: scattered 3D collage */}
        <div
          className="relative mt-12 hidden md:block"
          style={{ perspective: "1600px" }}
        >
          <div className="relative w-full aspect-[1180/600]">
            {pieces.map((p) => (
              <div
                key={p.src}
                className="absolute transition-transform duration-500 will-change-transform hover:z-50"
                style={{
                  left: p.left,
                  top: p.top,
                  width: p.width,
                  aspectRatio: p.aspect,
                  zIndex: p.z,
                  transform: `rotate(${p.rotate}deg)`,
                  filter: p.shadow,
                }}
              >
                {p.framed ? (
                  <div
                    className="h-full w-full rounded-[10px] p-[3.5%] pb-[9%]"
                    style={{ background: "#EDE7DA" }}
                  >
                    <div className="h-full w-full overflow-hidden rounded-[6px]">
                      <TiltedCard
                        imageSrc={p.src}
                        posterSrc={p.poster}
                        altText={p.alt}
                        containerHeight="100%"
                        containerWidth="100%"
                        imageHeight="100%"
                        imageWidth="100%"
                        rotateAmplitude={12}
                        showTooltip={false}
                        showMobileWarning={false}
                      />
                    </div>
                  </div>
                ) : (
                  <TiltedCard
                    imageSrc={p.src}
                    altText={p.alt}
                    containerHeight="100%"
                    containerWidth="100%"
                    imageHeight="100%"
                    imageWidth="100%"
                    rotateAmplitude={14}
                    showTooltip={false}
                    showMobileWarning={false}
                  />
                )}
              </div>
            ))}

            {/* Floating blue annotation card (reference "Reading Area") */}
            <div
              className="absolute z-[60] rounded-2xl p-5"
              style={{
                right: "0%",
                top: "6%",
                width: "18%",
                minWidth: "180px",
                background: "#2F5FE6",
                color: "#EAF0FF",
                transform: "rotate(2deg)",
                filter: shadowMid,
              }}
            >
              <div
                className="text-[15px] font-semibold tracking-tight"
                style={{ fontFamily: "'Neue Montreal', sans-serif" }}
              >
                This Issue
              </div>
              <p
                className="mt-2 text-[13px] leading-relaxed"
                style={{ fontFamily: mono, color: "rgba(234,240,255,0.82)" }}
              >
                Vol. 01 — featured drops, brand kits, prompt vaults and the
                tools we build with.
              </p>
              <div
                className="mt-4 text-[12px] tracking-[0.14em]"
                style={{ fontFamily: mono, color: "rgba(234,240,255,0.6)" }}
              >
                JUNE 2026
              </div>
            </div>

            {/* Mustard archival CTA → /ctrla */}
            <div
              className="absolute z-[60]"
              style={{ right: "5%", top: "48%", transform: "rotate(2deg)", filter: shadowSoft }}
            >
              <Link href="/ctrla" aria-label="Enter the CTRL·A archive">
                <button
                  className="group flex items-center gap-2.5 rounded-full pl-6 pr-5 py-3 text-[12px] md:text-[13px] font-medium tracking-[0.16em] uppercase transition-transform duration-300 hover:-translate-y-0.5"
                  style={{ background: "#E4B93C", color: "#231A08", fontFamily: mono }}
                >
                  Read Vol. 01
                  <svg width="13" height="13" viewBox="0 0 12 12" fill="none" className="transition-transform duration-300 group-hover:translate-x-0.5">
                    <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile: stacked, still tilted + shadowed */}
        <div className="mt-10 grid grid-cols-2 gap-3 md:hidden">
          {pieces.map((p, i) => (
            <div
              key={p.src}
              className={i === 4 ? "col-span-2 aspect-[16/10]" : "aspect-square"}
              style={{ transform: `rotate(${p.rotate * 0.5}deg)`, filter: shadowSoft }}
            >
              <TiltedCard
                imageSrc={p.src}
                posterSrc={p.poster}
                altText={p.alt}
                containerHeight="100%"
                containerWidth="100%"
                imageHeight="100%"
                imageWidth="100%"
                rotateAmplitude={12}
                showTooltip={false}
                showMobileWarning={false}
              />
            </div>
          ))}

          <div className="col-span-2 mt-4 flex justify-center">
            <Link href="/ctrla" aria-label="Enter the CTRL·A archive">
              <button
                className="group flex items-center gap-2.5 rounded-full pl-6 pr-5 py-3 text-[12px] font-medium tracking-[0.16em] uppercase"
                style={{ background: "#E4B93C", color: "#231A08", fontFamily: mono, filter: shadowSoft }}
              >
                Enter the Archive
                <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigiMag;
