"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
// This page sells artist development, which is consultative, so its CTA is the
// quote call rather than the generic 15-minute booking.
import { CONSULT_BOOKING_URL } from "@/data/soundPricing";
import CalBookButton from "@/components/sound/CalBookButton";

const HEADING = "Norwige, sans-serif";
const MONO = "'DM Mono', monospace";
const BODY = "'Roboto', sans-serif";

const spring = { type: "spring" as const, stiffness: 72, damping: 18 };

// Premium brown gradient for primary buttons: caramel → rust → espresso,
// with a cream inset highlight and a warm drop shadow for depth.
const BROWN_GRADIENT =
  "linear-gradient(135deg, #EA9A61 0%, #A9522F 55%, #5C2E1A 100%)";
const BROWN_SHADOW =
  "0 12px 34px rgba(92,46,26,0.45), inset 0 1px 0 rgba(255,244,227,0.22)";

// The proof pathway for Sam Suen: every lane ROV runs for one in-house artist.
// Numbers are Summer 2026 actuals; update here as they grow.
const STATS = [
  { value: "20k+", label: "New followers gained · Summer 2026" },
  { value: "100k+", label: "Total streams across platforms" },
  { value: "20k", label: "Streams on one song · Stars Collide" },
  { value: "2", label: "States headlined · DreamAsia Fest" },
];

const LANES = [
  {
    num: "01",
    title: "Socials, grown",
    body: "Content strategy, shot lists, edits, and posting cadence run by the studio. Twenty to thirty thousand new followers across platforms in one summer, all organic.",
    proof: "20k+ new followers · Summer 2026",
  },
  {
    num: "02",
    title: "Brand, built",
    body: "Identity from zero: name treatment, visual language, cover art direction, and a look that holds together from a Spotify canvas to a festival screen.",
    proof: "One visual language, every surface",
  },
  {
    num: "03",
    title: "Website, shipped",
    body: "A portfolio site designed and built in-house, so promoters, press, and playlists have one place to land.",
    proof: "samsuenofficial.com",
    href: "https://www.samsuenofficial.com/",
  },
  {
    num: "04",
    title: "Streams, boosted",
    body: "Records written, mixed, and mastered in the studio, then rolled out with visuals and push behind every drop. Stars Collide alone cleared twenty thousand streams.",
    proof: "100k+ total · 20k on Stars Collide",
  },
  {
    num: "05",
    title: "Shows, produced",
    body: "From set design to stage visuals to the live mix, ROV produced Sam's festival run end to end, including headlining DreamAsia Fest across two states.",
    proof: "DreamAsia Fest · Headliner",
  },
];

// Real catalog + links pulled from samsuenofficial.com.
const SPOTIFY_ARTIST =
  "https://open.spotify.com/artist/0xXkuHzIgsvT7a00POWMIK";
const APPLE_ARTIST = "https://music.apple.com/us/artist/sam-suen/1561994926";
const INSTAGRAM = "https://www.instagram.com/samsuenofficial/";

const RELEASES = [
  "Twilight",
  "Stars Collide",
  "Love is War",
  "Lost in Yesterday",
  "Call Me Baby",
  "Gone Girl",
  "Joke",
  "Laugh Today",
];

// Real live history from samsuenofficial.com.
const SHOWS = [
  { year: "2023", name: "Ted Park × Parlay Pass", venue: "Glam 104" },
  { year: "2024", name: "Hanyang Society", venue: "Believe Music Hall" },
  { year: "2025", name: "Invasian Labubu Rave", venue: "District Atlanta" },
  { year: "2026", name: "Justin Park × Junoflo & Friends", venue: "Rendezvous" },
  {
    year: "2026",
    name: "DreamAsia Fest",
    venue: "North Carolina + Georgia",
    highlight: true,
  },
];

// The in-house pipeline that runs the whole thing (from CTRL-A Vol. 01).
const TOOLKIT = [
  "FL Studio",
  "DaVinci Resolve",
  "Premiere Pro",
  "BMPCC 6K",
  "Canon",
  "Claude",
];

function PlayGlyph() {
  return (
    <svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden>
      <path d="M1 1L11 7L1 13V1Z" fill="#EA9A61" />
    </svg>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-5 h-px"
        style={{ backgroundColor: "rgba(234,154,97,0.4)" }}
      />
      <span
        className="text-[12px] uppercase tracking-[0.3em]"
        style={{ fontFamily: MONO, color: "rgba(234,154,97,0.55)" }}
      >
        {children}
      </span>
    </div>
  );
}

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ ...spring, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function SamSuenCaseStudy() {
  return (
    <main className="bg-[#080807] text-white overflow-hidden">
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative">
        <div className="relative w-full" style={{ height: "min(78vh, 720px)" }}>
          <Image
            src="/ctrla/VOL1/dreamasiacover.webp"
            alt="Sam Suen mid-set at DreamAsia Fest, stage visuals and crowd behind him"
            fill
            priority
            className="object-cover"
            draggable={false}
          />
          {/* Bottom fade into page bg */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(8,8,7,0.35) 0%, rgba(8,8,7,0.1) 40%, rgba(8,8,7,0.92) 88%, #080807 100%)",
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 z-10"
            style={{ padding: "0 clamp(16px, 5vw, 80px) clamp(40px, 6vw, 72px)" }}
          >
            <div className="max-w-7xl mx-auto flex flex-col gap-5">
              <Eyebrow>In-House Case Study · Artist Development</Eyebrow>
              <h1
                className="text-[clamp(2.6rem,7vw,5.5rem)] leading-[0.95] text-white"
                style={{ fontFamily: HEADING }}
              >
                Sam Suen
              </h1>
              <p
                className="max-w-xl text-base md:text-lg leading-relaxed"
                style={{ fontFamily: BODY, color: "rgba(255,255,255,0.65)" }}
              >
                One artist, every lane. We grow the socials, built the brand,
                shipped the website, boosted the streams, and produced the
                shows. This page is the receipts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ROW ────────────────────────────────────── */}
      <section
        style={{ padding: "clamp(48px, 7vw, 88px) clamp(16px, 5vw, 80px)" }}
      >
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div
              className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 py-10"
              style={{
                borderTop: "1px solid rgba(255,255,255,0.07)",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {STATS.map((s) => (
                <div key={s.label} className="flex flex-col gap-2">
                  <span
                    className="text-[clamp(2.2rem,4.5vw,3.4rem)] leading-none"
                    style={{ fontFamily: HEADING, color: "#EA9A61" }}
                  >
                    {s.value}
                  </span>
                  <span
                    className="text-[11px] uppercase tracking-[0.16em] leading-snug"
                    style={{ fontFamily: MONO, color: "rgba(255,255,255,0.35)" }}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── THE SETUP ────────────────────────────────────── */}
      <section
        style={{ padding: "clamp(40px, 6vw, 80px) clamp(16px, 5vw, 80px)" }}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-20 items-center">
          <Reveal className="flex flex-col gap-6">
            <Eyebrow>The Setup</Eyebrow>
            <h2
              className="text-[clamp(1.8rem,3.4vw,2.8rem)] leading-tight"
              style={{ fontFamily: HEADING }}
            >
              From bedroom sessions to a festival headline.
            </h2>
            <div
              className="flex flex-col gap-4 text-sm md:text-base leading-relaxed"
              style={{ fontFamily: BODY, color: "rgba(255,255,255,0.55)" }}
            >
              <p>
                Sam Suen and the ROV team have made music together since high
                school: bedroom sessions, borrowed gear, songs nobody had asked
                for yet. Today Sam is our Head of Artist Development and the
                clearest proof of what the studio does.
              </p>
              <p>
                Instead of pointing at client logos, we develop our own artist
                with the exact pipeline we sell: records mixed in-house, brand
                and website built in-house, content shot and cut in-house, shows
                produced in-house. Nothing about the setup got bigger overnight.
                What changed was the reps.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                border: "1px solid rgba(234,154,97,0.13)",
                boxShadow:
                  "0 40px 90px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,244,227,0.04)",
              }}
            >
              <Image
                src="/ctrla/VOL1/dreamasiafestpic2.webp"
                alt="DreamAsia Fest stage during load-in"
                width={1000}
                height={1250}
                className="w-full h-auto object-cover"
                draggable={false}
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── THE FIVE LANES ───────────────────────────────── */}
      <section
        style={{ padding: "clamp(64px, 9vw, 120px) clamp(16px, 5vw, 80px)" }}
      >
        <div className="max-w-7xl mx-auto flex flex-col gap-14">
          <Reveal className="flex flex-col gap-5">
            <Eyebrow>The Work · Five Lanes</Eyebrow>
            <h2
              className="text-[clamp(1.8rem,3.4vw,2.8rem)] leading-tight max-w-2xl"
              style={{ fontFamily: HEADING }}
            >
              Everything an artist needs,{" "}
              <span style={{ color: "#EA9A61" }}>run by one team.</span>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {LANES.map((lane, i) => (
              <Reveal key={lane.num} delay={i * 0.05}>
                <div
                  className="flex flex-col gap-4 rounded-2xl h-full"
                  style={{
                    border: "1px solid rgba(255,255,255,0.07)",
                    background: "rgba(255,244,227,0.02)",
                    padding: "clamp(20px, 2.5vw, 32px)",
                  }}
                >
                  <span
                    className="text-[12px] tracking-[0.3em]"
                    style={{ fontFamily: MONO, color: "rgba(234,154,97,0.5)" }}
                  >
                    {lane.num}
                  </span>
                  <h3
                    className="text-xl md:text-2xl"
                    style={{ fontFamily: HEADING }}
                  >
                    {lane.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed flex-1"
                    style={{ fontFamily: BODY, color: "rgba(255,255,255,0.5)" }}
                  >
                    {lane.body}
                  </p>
                  {lane.href ? (
                    <a
                      href={lane.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[12px] uppercase tracking-[0.16em] font-medium px-3.5 py-2 rounded-full self-start transition-opacity hover:opacity-90"
                      style={{
                        fontFamily: MONO,
                        background: BROWN_GRADIENT,
                        boxShadow: BROWN_SHADOW,
                        color: "#FFF4E3",
                      }}
                    >
                      {lane.proof} ↗
                    </a>
                  ) : (
                    <span
                      className="text-[12px] uppercase tracking-[0.16em] font-medium px-3.5 py-2 rounded-full self-start"
                      style={{
                        fontFamily: MONO,
                        background: BROWN_GRADIENT,
                        boxShadow: BROWN_SHADOW,
                        color: "#FFF4E3",
                      }}
                    >
                      {lane.proof}
                    </span>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── BEHIND THE SCENES ────────────────────────────── */}
      <section
        style={{ padding: "clamp(40px, 6vw, 80px) clamp(16px, 5vw, 80px)" }}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20 items-center">
          <Reveal className="flex flex-col gap-6">
            <Eyebrow>Behind the Scenes · In-House</Eyebrow>
            <h2
              className="text-[clamp(1.8rem,3.4vw,2.8rem)] leading-tight"
              style={{ fontFamily: HEADING }}
            >
              None of the ugly steps skipped.
            </h2>
            <p
              className="text-sm md:text-base leading-relaxed"
              style={{ fontFamily: BODY, color: "rgba(255,255,255,0.55)" }}
            >
              Every record is built and mixed in the studio. Every visual is
              shot and cut in-house. The same small crew runs it from the first
              demo to the last light cue, no outsourcing, no hand-offs. The
              tools that do the work:
            </p>
            <div className="flex flex-wrap gap-2">
              {TOOLKIT.map((tool) => (
                <span
                  key={tool}
                  className="text-[12px] uppercase tracking-[0.16em] px-3 py-1.5 rounded-full"
                  style={{
                    fontFamily: MONO,
                    border: "1px solid rgba(234,154,97,0.3)",
                    color: "#EA9A61",
                    background: "rgba(234,154,97,0.08)",
                  }}
                >
                  {tool}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                border: "1px solid rgba(234,154,97,0.13)",
                boxShadow:
                  "0 40px 90px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,244,227,0.04)",
              }}
            >
              <Image
                src="/ctrla/VOL1/dreamasiateam.jpg"
                alt="The ROV crew behind Sam Suen's DreamAsia Fest run"
                width={1200}
                height={800}
                className="w-full h-auto object-cover"
                draggable={false}
              />
              <div
                className="absolute bottom-3.5 left-3.5 flex items-center gap-2 px-3 py-1.5 rounded-full"
                style={{
                  background: "rgba(8,8,7,0.75)",
                  border: "1px solid rgba(234,154,97,0.22)",
                  backdropFilter: "blur(14px)",
                  WebkitBackdropFilter: "blur(14px)",
                }}
              >
                <span
                  className="text-[12px] uppercase tracking-[0.22em]"
                  style={{ fontFamily: MONO, color: "#EA9A61" }}
                >
                  The crew · Same small team
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── STARS COLLIDE ────────────────────────────────── */}
      <section
        style={{ padding: "clamp(40px, 6vw, 80px) clamp(16px, 5vw, 80px)" }}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-20 items-center">
          <Reveal>
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                border: "1px solid rgba(234,154,97,0.13)",
                boxShadow:
                  "0 40px 90px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,244,227,0.04)",
              }}
            >
              <div
                className="absolute top-3.5 left-3.5 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full"
                style={{
                  background: "rgba(8,8,7,0.75)",
                  border: "1px solid rgba(234,154,97,0.22)",
                  backdropFilter: "blur(14px)",
                  WebkitBackdropFilter: "blur(14px)",
                }}
              >
                <span
                  className="text-[12px] uppercase tracking-[0.22em]"
                  style={{ fontFamily: MONO, color: "#EA9A61" }}
                >
                  Stars Collide · Official Video
                </span>
              </div>
              <video
                className="w-full aspect-video object-cover"
                src="/soundpage/starscollidemv.mp4"
                poster="/thumbnails/soundhero.webp"
                controls
                playsInline
                preload="metadata"
              />
            </div>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-col gap-6">
            <Eyebrow>The Record</Eyebrow>
            <h2
              className="text-[clamp(1.8rem,3.4vw,2.8rem)] leading-tight"
              style={{ fontFamily: HEADING }}
            >
              Stars Collide: 20k streams and counting.
            </h2>
            <p
              className="text-sm md:text-base leading-relaxed"
              style={{ fontFamily: BODY, color: "rgba(255,255,255,0.55)" }}
            >
              Written with Basu, mixed and mastered in the studio, rolled out
              with an in-house music video. One song, one team, twenty thousand
              streams. The catalog behind it has cleared a hundred thousand.
            </p>
            <a
              href="https://open.spotify.com/track/2jAoNrw7bhzNTDoMNJSQz9"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full self-start transition-opacity hover:opacity-90"
              style={{ background: BROWN_GRADIENT, boxShadow: BROWN_SHADOW }}
            >
              <span
                className="text-[13px] uppercase tracking-[0.22em] font-medium"
                style={{ fontFamily: MONO, color: "#FFF4E3" }}
              >
                Listen on Spotify
              </span>
              <span aria-hidden style={{ color: "#FFF4E3" }}>
                ↗
              </span>
            </a>
          </Reveal>
        </div>
      </section>

      {/* ── DISCOGRAPHY ──────────────────────────────────── */}
      <section
        style={{ padding: "clamp(64px, 9vw, 120px) clamp(16px, 5vw, 80px)" }}
      >
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          <Reveal className="flex flex-col gap-6">
            <Eyebrow>The Catalog · Released In-House</Eyebrow>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <h2
                className="text-[clamp(1.8rem,3.4vw,2.8rem)] leading-tight max-w-xl"
                style={{ fontFamily: HEADING }}
              >
                Eight songs,{" "}
                <span style={{ color: "#EA9A61" }}>
                  a hundred thousand streams.
                </span>
              </h2>
              <a
                href={SPOTIFY_ARTIST}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full self-start transition-opacity hover:opacity-90 whitespace-nowrap"
                style={{ background: BROWN_GRADIENT, boxShadow: BROWN_SHADOW }}
              >
                <span
                  className="text-[13px] uppercase tracking-[0.22em] font-medium"
                  style={{ fontFamily: MONO, color: "#FFF4E3" }}
                >
                  Full catalog on Spotify
                </span>
                <span aria-hidden style={{ color: "#FFF4E3" }}>
                  ↗
                </span>
              </a>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {RELEASES.map((title, i) => (
              <Reveal key={title} delay={(i % 4) * 0.05}>
                <a
                  href={SPOTIFY_ARTIST}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col gap-5 rounded-2xl h-full transition-colors hover:bg-[rgba(234,154,97,0.06)]"
                  style={{
                    border: "1px solid rgba(255,255,255,0.07)",
                    background: "rgba(255,244,227,0.02)",
                    padding: "clamp(18px, 2vw, 26px)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[12px] tracking-[0.3em]"
                      style={{
                        fontFamily: MONO,
                        color: "rgba(234,154,97,0.5)",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="opacity-40 transition-opacity group-hover:opacity-100">
                      <PlayGlyph />
                    </span>
                  </div>
                  <span
                    className="text-lg md:text-xl leading-tight"
                    style={{ fontFamily: HEADING }}
                  >
                    {title}
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SHOWS TIMELINE ───────────────────────────────── */}
      <section
        style={{ padding: "clamp(40px, 6vw, 80px) clamp(16px, 5vw, 80px)" }}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-20 items-center">
          <Reveal className="flex flex-col gap-8">
            <div className="flex flex-col gap-5">
              <Eyebrow>Live · Shows Produced</Eyebrow>
              <h2
                className="text-[clamp(1.8rem,3.4vw,2.8rem)] leading-tight"
                style={{ fontFamily: HEADING }}
              >
                From club stages to a two-state festival.
              </h2>
            </div>
            <div className="flex flex-col">
              {SHOWS.map((show, i) => (
                <div
                  key={`${show.year}-${show.name}`}
                  className="flex items-baseline gap-5 py-4"
                  style={{
                    borderTop:
                      i === 0 ? "none" : "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <span
                    className="text-[13px] tracking-[0.16em] w-12 flex-shrink-0"
                    style={{
                      fontFamily: MONO,
                      color: show.highlight
                        ? "#EA9A61"
                        : "rgba(255,255,255,0.3)",
                    }}
                  >
                    {show.year}
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <span
                      className="text-base md:text-lg"
                      style={{
                        fontFamily: HEADING,
                        color: show.highlight
                          ? "#EA9A61"
                          : "rgba(255,255,255,0.9)",
                      }}
                    >
                      {show.name}
                      {show.highlight && (
                        <span
                          className="ml-3 text-[11px] uppercase tracking-[0.16em] px-2 py-0.5 rounded-full align-middle"
                          style={{
                            fontFamily: MONO,
                            border: "1px solid rgba(234,154,97,0.3)",
                            color: "#EA9A61",
                          }}
                        >
                          Headliner
                        </span>
                      )}
                    </span>
                    <span
                      className="text-sm"
                      style={{
                        fontFamily: BODY,
                        color: "rgba(255,255,255,0.4)",
                      }}
                    >
                      {show.venue}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                border: "1px solid rgba(234,154,97,0.13)",
                boxShadow:
                  "0 40px 90px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,244,227,0.04)",
              }}
            >
              <video
                className="w-full aspect-[4/5] object-cover"
                src="/ctrla/VOL1/concert1.mp4"
                poster="/ctrla/VOL1/dreamasiacover.webp"
                controls
                playsInline
                preload="metadata"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── LISTEN EVERYWHERE ────────────────────────────── */}
      <section
        style={{ padding: "clamp(40px, 6vw, 72px) clamp(16px, 5vw, 80px)" }}
      >
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div
              className="flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-2xl"
              style={{
                border: "1px solid rgba(255,255,255,0.07)",
                background: "rgba(255,244,227,0.02)",
                padding: "clamp(24px, 3vw, 40px)",
              }}
            >
              <div className="flex flex-col gap-2">
                <span
                  className="text-[12px] uppercase tracking-[0.3em]"
                  style={{ fontFamily: MONO, color: "rgba(234,154,97,0.55)" }}
                >
                  Find Sam Everywhere
                </span>
                <p className="text-xl md:text-2xl" style={{ fontFamily: HEADING }}>
                  Follow the rollout as it happens.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {[
                  { label: "Spotify", href: SPOTIFY_ARTIST },
                  { label: "Apple Music", href: APPLE_ARTIST },
                  { label: "Instagram", href: INSTAGRAM },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full transition-colors hover:bg-[rgba(234,154,97,0.12)]"
                    style={{ border: "1px solid rgba(234,154,97,0.35)" }}
                  >
                    <span
                      className="text-[12px] uppercase tracking-[0.18em]"
                      style={{ fontFamily: MONO, color: "#EA9A61" }}
                    >
                      {link.label}
                    </span>
                    <span aria-hidden style={{ color: "#EA9A61" }}>
                      ↗
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── QUOTE BAND ───────────────────────────────────── */}
      <section
        style={{ padding: "clamp(72px, 10vw, 130px) clamp(16px, 5vw, 80px)" }}
      >
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-8">
          <Reveal className="flex flex-col items-center gap-8">
            <span
              className="text-7xl leading-none select-none"
              style={{
                fontFamily: HEADING,
                fontStyle: "italic",
                color: "rgba(234,154,97,0.18)",
              }}
              aria-hidden
            >
              &ldquo;
            </span>
            <blockquote
              className="text-[clamp(1.5rem,3.2vw,2.4rem)] leading-snug -mt-10"
              style={{
                fontFamily: HEADING,
                fontStyle: "italic",
                color: "rgba(255,255,255,0.88)",
              }}
            >
              The stage at DreamAsia wasn&apos;t a destination.{" "}
              <span style={{ color: "#EA9A61" }}>
                It was just the next logical step.
              </span>
            </blockquote>
            <div className="flex items-center gap-4">
              <div
                className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0"
                style={{ border: "2px solid rgba(234,154,97,0.22)" }}
              >
                <Image
                  src="/teammembers/samsuentm.webp"
                  alt="Sam Suen"
                  width={44}
                  height={44}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </div>
              <div className="text-left">
                <p
                  className="text-white text-sm font-medium"
                  style={{ fontFamily: BODY }}
                >
                  Sam Suen
                </p>
                <p
                  className="text-[11px] uppercase tracking-[0.2em] mt-0.5"
                  style={{ fontFamily: MONO, color: "rgba(255,255,255,0.35)" }}
                >
                  DreamAsia Fest Headliner
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── DEEPER READ ──────────────────────────────────── */}
      <section
        style={{ padding: "0 clamp(16px, 5vw, 80px) clamp(48px, 7vw, 88px)" }}
      >
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <Link
              href="/ctrla/dreamasia"
              className="group flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-2xl transition-colors hover:bg-[rgba(255,244,227,0.04)]"
              style={{
                border: "1px solid rgba(255,255,255,0.07)",
                background: "rgba(255,244,227,0.02)",
                padding: "clamp(24px, 3vw, 40px)",
              }}
            >
              <div className="flex flex-col gap-2">
                <span
                  className="text-[12px] uppercase tracking-[0.3em]"
                  style={{ fontFamily: MONO, color: "rgba(234,154,97,0.55)" }}
                >
                  Go Deeper · CTRL-A Magazine
                </span>
                <p
                  className="text-xl md:text-2xl"
                  style={{ fontFamily: HEADING }}
                >
                  Producing DreamAsia Fest, end to end.
                </p>
                <p
                  className="text-sm"
                  style={{ fontFamily: BODY, color: "rgba(255,255,255,0.45)" }}
                >
                  The full editorial: how a small team pulled off a multi-city
                  festival, none of the ugly steps skipped.
                </p>
              </div>
              <span
                className="text-[13px] uppercase tracking-[0.22em] whitespace-nowrap transition-transform group-hover:translate-x-1"
                style={{ fontFamily: MONO, color: "#EA9A61" }}
              >
                Read the feature →
              </span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section
        className="relative"
        style={{ padding: "clamp(72px, 10vw, 130px) clamp(16px, 5vw, 80px)" }}
      >
        <div
          className="absolute pointer-events-none"
          style={{
            left: "25%",
            top: "10%",
            width: "50%",
            height: "80%",
            background:
              "radial-gradient(ellipse, rgba(234,154,97,0.06) 0%, transparent 68%)",
            filter: "blur(72px)",
          }}
        />
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-7 relative z-10">
          <Reveal className="flex flex-col items-center gap-7">
            <h2
              className="text-[clamp(2rem,4.5vw,3.4rem)] leading-tight"
              style={{ fontFamily: HEADING }}
            >
              Start your journey.
            </h2>
            <p
              className="text-sm md:text-base leading-relaxed max-w-xl"
              style={{ fontFamily: BODY, color: "rgba(255,255,255,0.5)" }}
            >
              The same in-house pipeline behind Sam, mixing, branding, content,
              and shows, is open to artists ready to take the work seriously.
              Every catalog starts with one song.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <CalBookButton
                calLink={CONSULT_BOOKING_URL}
                className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full transition-opacity hover:opacity-90"
                style={{ background: BROWN_GRADIENT, boxShadow: BROWN_SHADOW }}
              >
                <span
                  className="text-[13px] uppercase tracking-[0.22em] font-medium"
                  style={{ fontFamily: MONO, color: "#FFF4E3" }}
                >
                  Start your journey
                </span>
                <span aria-hidden style={{ color: "#FFF4E3" }}>
                  →
                </span>
              </CalBookButton>
              <Link
                href="/sound"
                className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full transition-colors hover:bg-[rgba(234,154,97,0.12)]"
                style={{ border: "1px solid rgba(234,154,97,0.35)" }}
              >
                <span
                  className="text-[13px] uppercase tracking-[0.22em]"
                  style={{ fontFamily: MONO, color: "#EA9A61" }}
                >
                  Back to the studio
                </span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
