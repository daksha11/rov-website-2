"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Phone, Check, RotateCcw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { FAQS } from "./content";

const NavigationDock = dynamic(
  () => import("@/components/sections/NavDoc").then((mod) => ({ default: mod.NavigationDock })),
  { ssr: false }
);
const Footer = dynamic(() => import("@/components/sections/Footer"), { ssr: false });

const TOC = [
  { id: "the-short-answer", label: "The short answer" },
  { id: "the-leak", label: "Where a missed call actually goes" },
  { id: "demo", label: "See it work" },
  { id: "what-is-it", label: "What is missed-call text-back?" },
  { id: "does-it-work", label: "Does it actually book more jobs?" },
  { id: "website", label: "Why the site and the text-back belong together" },
  { id: "the-dream", label: "What it looks like when the trucks stay full" },
  { id: "cost", label: "What it costs and how to start" },
  { id: "whats-next", label: "Where this goes next" },
  { id: "faq", label: "Frequently asked questions" },
];

const STATS = [
  { number: "30 sec", label: "Text back to every missed call", sub: "before the homeowner dials the next truck" },
  { number: "24/7", label: "Answers when your office can't", sub: "mid-job, after-hours, nights and weekends" },
  { number: "30 days", label: "Free to run it live", sub: "keep every job it books, then decide" },
];

const HOW = [
  {
    n: "01",
    title: "A homeowner calls and you can't pick up",
    body: "Your crew is in an attic in Marietta, the office line is already busy, or it is 9pm on a Saturday. The AC is dead and the homeowner is dialing HVAC companies one after another. The call rings out.",
  },
  {
    n: "02",
    title: "A text goes out in under 30 seconds",
    body: "The moment the call is missed, the system texts the homeowner in your shop's voice: sorry we missed you, we're on a job, want us to get you on the schedule today? It lands while your name is still on their screen.",
  },
  {
    n: "03",
    title: "The homeowner replies and the job is yours",
    body: "They text back instead of calling the next number. The system can hand off to you, drop a booking link, or push the details straight to your phone. The call you physically could not answer becomes a job on the board.",
  },
];

// green "shop is typing" bubble, reused before each outgoing message
function TypingBubble() {
  return (
    <div className="bubble-in" style={{ alignSelf: "flex-end", background: "#34C759", borderRadius: 18, padding: "12px 16px", display: "flex", gap: 4 }}>
      {[0, 1, 2].map((i) => (
        <span key={i} className="dot-pulse" style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.85)", animationDelay: `${i * 0.18}s` }} />
      ))}
    </div>
  );
}

// ── Interactive missed-call demo ──────────────────────────────────────────
function DemoPhone() {
  const [step, setStep] = useState(0); // 0 idle · 1 ringing · 2 missed · 3 typing · 4 auto-text · 5 reply · 6 booked
  const [runKey, setRunKey] = useState(0);
  const msgRef = useRef<HTMLDivElement>(null);

  // autoplay once shortly after mount
  useEffect(() => {
    const t = setTimeout(() => setRunKey(1), 700);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (runKey === 0) return;
    const seq: [number, number][] = [
      [0, 1],      // ringing
      [1900, 2],   // missed call
      [2900, 3],   // shop typing
      [4200, 4],   // auto-text sent
      [6000, 5],   // homeowner: yes please
      [7200, 6],   // shop typing
      [8500, 7],   // available times
      [10300, 8],  // homeowner: thursday works
      [11500, 9],  // shop typing
      [12700, 10], // excited confirmation
      [14200, 11], // booked badge
    ];
    const timers = seq.map(([delay, s]) => setTimeout(() => setStep(s), delay));
    return () => timers.forEach(clearTimeout);
  }, [runKey]);

  // keep the thread pinned to the newest message as it grows
  useEffect(() => {
    const el = msgRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [step]);

  const replay = () => {
    setStep(0);
    setRunKey((k) => k + 1);
  };

  const ringing = step === 1;
  const showThread = step >= 2;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      {/* Phone */}
      <div
        style={{
          width: 300,
          maxWidth: "88vw",
          height: 600,
          background: "#0B0B0F",
          borderRadius: 44,
          padding: 12,
          boxShadow: "0 30px 60px -20px rgba(59,33,20,0.55), inset 0 0 0 2px rgba(255,255,255,0.06)",
          position: "relative",
        }}
      >
        {/* notch */}
        <div style={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", width: 120, height: 26, background: "#0B0B0F", borderRadius: "0 0 16px 16px", zIndex: 3 }} />
        {/* screen */}
        <div style={{ width: "100%", height: "100%", borderRadius: 34, overflow: "hidden", background: ringing ? "#12121a" : "#F2F2F7", position: "relative", display: "flex", flexDirection: "column" }}>

          {/* ── RINGING / CALL SCREEN ── */}
          {ringing && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "76px 24px 44px", color: "#fff", textAlign: "center" }}>
              <div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", margin: "0 0 6px", fontFamily: "Inter, sans-serif" }}>mobile · Grant Park, ATL</p>
                <p style={{ fontSize: 26, fontWeight: 600, margin: "0 0 4px", fontFamily: "Inter, sans-serif" }}>(404) 555-0182</p>
                <p style={{ fontSize: 15, color: "#5AC46B", margin: 0, fontFamily: "Inter, sans-serif", display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                  <span className="dot-pulse" style={{ width: 8, height: 8, borderRadius: "50%", background: "#5AC46B", display: "inline-block" }} />
                  incoming call
                </p>
              </div>
              <div style={{ width: 96, height: 96, borderRadius: "50%", background: "rgba(90,196,107,0.14)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#2b2b36", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Phone size={26} color="#fff" />
                </div>
              </div>
              <div style={{ display: "flex", gap: 48 }}>
                <div style={{ width: 58, height: 58, borderRadius: "50%", background: "#FF3B30", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Phone size={22} color="#fff" style={{ transform: "rotate(135deg)" }} />
                </div>
                <div style={{ width: 58, height: 58, borderRadius: "50%", background: "#34C759", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Phone size={22} color="#fff" />
                </div>
              </div>
            </div>
          )}

          {/* ── MESSAGES THREAD ── */}
          {showThread && (
            <>
              {/* thread header */}
              <div style={{ background: "rgba(242,242,247,0.9)", backdropFilter: "blur(8px)", borderBottom: "1px solid rgba(0,0,0,0.08)", padding: "44px 16px 12px", textAlign: "center", flexShrink: 0 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,#EA9A61,#90422C)", margin: "0 auto 6px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "'Neue Montreal', sans-serif", fontWeight: 700, fontSize: 15 }}>PC</div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#111", margin: 0, fontFamily: "Inter, sans-serif" }}>Precision Comfort HVAC</p>
              </div>

              {/* messages */}
              <div ref={msgRef} className="msg-scroll" style={{ flex: 1, padding: "16px 14px", display: "flex", flexDirection: "column", gap: 10, overflowY: "auto", fontFamily: "Inter, sans-serif" }}>
                {/* missed call system line */}
                <div style={{ textAlign: "center", margin: "4px 0" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "#FF3B30", fontWeight: 600 }}>
                    <Phone size={12} color="#FF3B30" style={{ transform: "rotate(135deg)" }} />
                    Missed call · just now
                  </span>
                </div>

                {/* shop typing #1 */}
                {step === 3 && <TypingBubble />}

                {/* auto-text (outgoing, green) */}
                {step >= 4 && (
                  <div className="bubble-in" style={{ alignSelf: "flex-end", maxWidth: "82%" }}>
                    <div style={{ background: "#34C759", color: "#fff", borderRadius: "18px 18px 4px 18px", padding: "10px 14px", fontSize: 13.5, lineHeight: 1.45 }}>
                      Hi, this is Precision Comfort HVAC. Sorry we missed you! We&apos;re on a job right now. Want us to get you on the schedule today? Reply YES and we&apos;ll send times.
                    </div>
                    <p style={{ fontSize: 10, color: "#8e8e93", textAlign: "right", margin: "3px 4px 0" }}>Auto-sent · 22 sec after missed call</p>
                  </div>
                )}

                {/* homeowner reply #1 (incoming, gray) */}
                {step >= 5 && (
                  <div className="bubble-in" style={{ alignSelf: "flex-start", maxWidth: "82%" }}>
                    <div style={{ background: "#E9E9EB", color: "#111", borderRadius: "18px 18px 18px 4px", padding: "10px 14px", fontSize: 13.5, lineHeight: 1.45 }}>
                      Yes please, AC is out and it&apos;s brutal. What&apos;s the soonest?
                    </div>
                  </div>
                )}

                {/* shop typing #2 */}
                {step === 6 && <TypingBubble />}

                {/* available times (outgoing, green) */}
                {step >= 7 && (
                  <div className="bubble-in" style={{ alignSelf: "flex-end", maxWidth: "82%" }}>
                    <div style={{ background: "#34C759", color: "#fff", borderRadius: "18px 18px 4px 18px", padding: "10px 14px", fontSize: 13.5, lineHeight: 1.45 }}>
                      We&apos;ve got a tech near Grant Park today. We can do today at 4:00pm, or Thursday at 11:00am. Which works better for you?
                    </div>
                  </div>
                )}

                {/* homeowner reply #2 (incoming, gray) */}
                {step >= 8 && (
                  <div className="bubble-in" style={{ alignSelf: "flex-start", maxWidth: "82%" }}>
                    <div style={{ background: "#E9E9EB", color: "#111", borderRadius: "18px 18px 18px 4px", padding: "10px 14px", fontSize: 13.5, lineHeight: 1.45 }}>
                      Thursday at 11 works great.
                    </div>
                  </div>
                )}

                {/* shop typing #3 */}
                {step === 9 && <TypingBubble />}

                {/* excited confirmation (outgoing, green) */}
                {step >= 10 && (
                  <div className="bubble-in" style={{ alignSelf: "flex-end", maxWidth: "82%" }}>
                    <div style={{ background: "#34C759", color: "#fff", borderRadius: "18px 18px 4px 18px", padding: "10px 14px", fontSize: 13.5, lineHeight: 1.45 }}>
                      You&apos;re all set for Thursday at 11:00am! 🙌 We&apos;ll text you when the tech is on the way and be there asap. Thanks for choosing Precision Comfort!
                    </div>
                  </div>
                )}

                {/* booked badge */}
                {step >= 11 && (
                  <div className="bubble-in" style={{ alignSelf: "center", marginTop: 6, marginBottom: 4 }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#3B2114", color: "#FFF4E3", borderRadius: 100, padding: "8px 16px", fontSize: 12.5, fontWeight: 600, fontFamily: "'Neue Montreal', sans-serif" }}>
                      <Check size={14} color="#5AC46B" /> Job booked · Thursday, 11:00 AM
                    </span>
                  </div>
                )}
              </div>
            </>
          )}

          {/* idle placeholder before autoplay kicks in */}
          {step === 0 && (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#8e8e93", fontSize: 13, fontFamily: "Inter, sans-serif" }}>
              Starting…
            </div>
          )}
        </div>
      </div>

      {/* replay */}
      <button
        type="button"
        onClick={replay}
        style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", border: "1.5px solid rgba(59,33,20,0.25)", color: "#3B2114", borderRadius: 100, padding: "9px 18px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Neue Montreal', sans-serif" }}
      >
        <RotateCcw size={15} /> Replay the missed call
      </button>

      <style>{`
        @keyframes dotPulse { 0%,100%{opacity:0.35;transform:translateY(0)} 50%{opacity:1;transform:translateY(-2px)} }
        .dot-pulse { animation: dotPulse 1s ease-in-out infinite; }
        @keyframes bubbleIn { from{opacity:0;transform:translateY(8px) scale(0.98)} to{opacity:1;transform:translateY(0) scale(1)} }
        .bubble-in { animation: bubbleIn 0.32s cubic-bezier(0.2,0.7,0.2,1) both; }
        .msg-scroll { scrollbar-width: none; -ms-overflow-style: none; scroll-behavior: smooth; }
        .msg-scroll::-webkit-scrollbar { width: 0; height: 0; display: none; }
      `}</style>
    </div>
  );
}

function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <section id="faq" style={{ background: "#FFF4E3", padding: "0 24px 64px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div style={{ paddingTop: 48, borderTop: "1px solid rgba(59,33,20,0.12)" }}>
          <p style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "#B16937", marginBottom: 32, fontFamily: "'Neue Montreal', sans-serif", fontWeight: 700 }}>
            Frequently asked
          </p>
          <dl style={{ margin: 0 }}>
            {FAQS.map((f, i) => {
              const isOpen = openIndex === i;
              return (
                <div key={f.q} style={{ borderBottom: "1px solid rgba(59,33,20,0.1)" }}>
                  <dt>
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "space-between", gap: 24, padding: "20px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
                    >
                      <span style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(17px, 2.5vw, 22px)", lineHeight: 1.3, color: isOpen ? "#90422C" : "#3B2114", transition: "color 0.15s", fontWeight: 700 }}>
                        {f.q}
                      </span>
                      <ChevronDown
                        style={{ width: 20, height: 20, flexShrink: 0, color: "#EA9A61", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
                      />
                    </button>
                  </dt>
                  <dd style={{ margin: 0, display: "grid", gridTemplateRows: isOpen ? "1fr" : "0fr", transition: "grid-template-rows 0.3s ease-out" }}>
                    <div style={{ overflow: "hidden" }}>
                      <p style={{ paddingBottom: 20, paddingRight: 32, fontSize: 16, lineHeight: 1.75, color: "rgba(59,33,20,0.7)", fontFamily: "Inter, -apple-system, sans-serif", margin: 0 }}>
                        {f.a}
                      </p>
                    </div>
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </section>
  );
}

export default function ArticleBody() {
  return (
    <main style={{ fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: "#FFF4E3", color: "#3B2114" }}>

      {/* ── HERO ── */}
      <section style={{
        background: "linear-gradient(160deg, #3B2114 0%, #603E25 55%, #90422C 100%)",
        padding: "80px 24px 64px",
        color: "#FFF4E3",
      }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>

          {/* Logo */}
          <div style={{ marginBottom: 32 }}>
            <Link href="/">
              <Image src="/brand/rov-logo.webp" alt="ROV Studios" width={48} height={48} style={{ objectFit: "contain" }} />
            </Link>
          </div>

          {/* Breadcrumb */}
          <p style={{ fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,244,227,0.55)", marginBottom: 28, fontFamily: "'Neue Montreal', sans-serif" }}>
            <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>ROV Studios</Link>
            {" · "}
            <Link href="/web" style={{ color: "inherit", textDecoration: "none" }}>Web Design</Link>
            {" · "}Missed-Call Text-Back for HVAC
          </p>

          {/* Headline */}
          <h1 style={{
            fontFamily: "Norwige, sans-serif",
            fontSize: "clamp(34px, 6vw, 62px)",
            fontWeight: 400,
            lineHeight: 1.1,
            marginBottom: 24,
            color: "#FFFFFF",
          }}>
            The Call You Miss on a Job Goes to the Next Truck. Unless It Texts Back.
          </h1>

          <p style={{ fontSize: 18, lineHeight: 1.65, color: "rgba(255,244,227,0.82)", marginBottom: 36, maxWidth: 600 }}>
            When a homeowner&apos;s AC dies in July and your crew is elbow-deep in another job, the call rings out and they dial the next HVAC company on the list. Missed-call text-back replies in under 30 seconds and keeps the job yours, on a website built to get you found in the first place.
          </p>

          {/* Author + meta */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div style={{
              background: "#FFF4E3",
              border: "1px solid rgba(59,33,20,0.15)",
              borderRadius: 100,
              padding: "5px 14px 5px 5px",
              fontSize: 13,
              color: "#3B2114",
              fontFamily: "'Neue Montreal', sans-serif",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}>
              <div style={{ position: "relative", width: 32, height: 32, borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
                <Image src="/teammembers/suchettm.webp" alt="Suchet Konda" fill style={{ objectFit: "cover" }} />
              </div>
              Suchet Konda · Co-Founder, <Link href="/about" style={{ color: "#90422C", textDecoration: "underline" }}>ROV Studios</Link>
            </div>
            <div style={{ color: "rgba(255,244,227,0.45)", fontSize: 13 }}>July 2026 · 7 min read</div>
          </div>
        </div>
      </section>

      {/* ── STATS ROW ── */}
      <section style={{ background: "#3B2114", padding: "0 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 1, borderTop: "1px solid rgba(255,244,227,0.08)" }}>
          {STATS.map((s) => (
            <div key={s.number} style={{ padding: "28px 20px", textAlign: "center" }}>
              <div style={{
                fontFamily: "Norwige, sans-serif",
                fontSize: "clamp(30px, 5vw, 46px)",
                background: "linear-gradient(135deg, #EA9A61 0%, #90422C 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                lineHeight: 1,
                marginBottom: 8,
              }}>{s.number}</div>
              <div style={{ color: "#FFF4E3", fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{s.label}</div>
              <div style={{ color: "rgba(255,244,227,0.85)", fontSize: 12 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* Table of Contents */}
        <nav style={{
          background: "rgba(144,66,44,0.07)",
          border: "1.5px solid rgba(144,66,44,0.25)",
          borderRadius: 12,
          padding: "24px 28px",
          marginBottom: 56,
        }}>
          <p style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#90422C", fontWeight: 700, marginBottom: 16 }}>
            In this article
          </p>
          <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
            {TOC.map((item, i) => (
              <li key={item.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ color: "#EA9A61", fontFamily: "'Neue Montreal', sans-serif", fontSize: 12, fontWeight: 700, minWidth: 20 }}>{String(i + 1).padStart(2, "0")}</span>
                <a href={`#${item.id}`} style={{ color: "#3B2114", textDecoration: "none", fontSize: 15, borderBottom: "1px solid rgba(59,33,20,0.15)", lineHeight: 1.4 }}>
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* ── SECTION 1: The short answer ── */}
        <section id="the-short-answer" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 20, lineHeight: 1.2 }}>
            The short answer
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            Missed-call text-back is an automation that texts a homeowner within seconds of a call you could not answer, so they book with you instead of dialing the next HVAC company on the list. It is the single sharpest automation an Atlanta shop can turn on, because it plugs the leak that costs you the most during the season you can least afford it.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            It is a Tuesday afternoon in Grant Park and it is 96 degrees. A homeowner&apos;s AC just quit. She grabs her phone and calls the first shop she finds. Your crew is under a house in Marietta and nobody is at the desk. The phone rings out. She does not leave a voicemail. She just hangs up and calls the next number.
          </p>

          {/* The short answer info box */}
          <div style={{ background: "rgba(144,66,44,0.08)", border: "1px solid rgba(144,66,44,0.2)", borderRadius: 12, padding: "24px 28px", margin: "8px 0 32px" }}>
            <p style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: 13, fontWeight: 700, color: "#90422C", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>The short version</p>
            <p style={{ fontSize: 16, lineHeight: 1.7, margin: 0 }}>
              Every call your crew misses on a job is a homeowner ready to book right now. Missed-call text-back replies in under 30 seconds and keeps that homeowner in a conversation with you. Paired with a fast website that shows your reviews and a way to book, it turns the calls you cannot answer into jobs on the board. ROV builds both for a $750 build fee, runs it free for 30 days, then $1,000 a month.
            </p>
          </div>

          <p style={{ fontSize: 17, lineHeight: 1.75 }}>
            That gap between the calls you get and the calls you actually book is a revenue leak. In peak summer it is the most expensive leak you have, because the phone is ringing more than any other time of year and your crew is too busy to answer it.
          </p>
        </section>

        {/* ── SECTION 2: Where a missed call goes ── */}
        <section id="the-leak" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 20, lineHeight: 1.2 }}>
            Where a missed call actually goes
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            A missed call in July does not wait for you to call it back. It goes to the next shop in the homeowner&apos;s phone. When a system is down and the house is hot, nobody sits and waits for a callback. They work down the list until someone picks up, and the shop that answers first is usually the shop that gets the job.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 28 }}>
            That is why showing up fast beats everything else you could compete on. You do not have the ad budget the big names have. What you have is speed, and speed is the one lever a two-truck shop can pull to beat a company ten times its size. Missed-call text-back is how you pull it without being chained to the phone.
          </p>

          {/* Stat callout */}
          <div style={{
            background: "#3B2114",
            borderRadius: 12,
            padding: "28px 32px",
            margin: "32px 0",
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: "24px",
            alignItems: "center",
          }}>
            <div style={{
              fontFamily: "Norwige, sans-serif",
              fontSize: 56,
              background: "linear-gradient(135deg, #EA9A61, #90422C)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              lineHeight: 1,
            }}>7x</div>
            <div>
              <p style={{ color: "#FFF4E3", fontSize: 16, lineHeight: 1.6, margin: 0 }}>
                Businesses that respond to a new lead within an hour are about seven times more likely to have a real conversation with them than those that wait longer. Under 30 seconds beats an hour every time.
              </p>
              <p style={{ color: "rgba(255,244,227,0.8)", fontSize: 12, marginTop: 8, marginBottom: 0 }}>Source: <a href="https://hbr.org/2011/03/the-short-life-of-online-sales-leads" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,244,227,0.8)" }}>Harvard Business Review</a></p>
            </div>
          </div>

          <p style={{ fontSize: 17, lineHeight: 1.75 }}>
            The same math works on the estimates that go quiet. A homeowner who got a quote and never called back is a warm job sitting in your phone. The system that texts a missed caller can also re-touch a dead estimate a few days later, and that alone pulls a chunk of ghosted quotes back onto the schedule.
          </p>
        </section>

        {/* ── SECTION 3: DEMO ── */}
        <section id="demo" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 12, lineHeight: 1.2 }}>
            See it work
          </h2>
          <p style={{ fontSize: 15, color: "#B16937", marginBottom: 36, fontFamily: "'Neue Montreal', sans-serif" }}>
            A real missed call, turned into a booked job on the calendar, start to finish. Tap replay to watch it again.
          </p>

          <div style={{
            background: "linear-gradient(160deg,#FBEAD3,#F5DCC0)",
            border: "1.5px solid rgba(144,66,44,0.2)",
            borderRadius: 20,
            padding: "40px 24px 32px",
          }}>
            <DemoPhone />
          </div>

          <p style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(59,33,20,0.7)", marginTop: 20, textAlign: "center" }}>
            No app for the homeowner to download. It is a normal text, from your shop, sent the instant the call is missed.
          </p>
        </section>

        {/* ── SECTION 4: What is it ── */}
        <section id="what-is-it" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 20, lineHeight: 1.2 }}>
            What is missed-call text-back?
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 28 }}>
            Missed-call text-back is an automation that watches your business line and, the moment a call goes unanswered, sends the caller a text in your shop&apos;s voice. There is no new phone to carry and no app for the homeowner. It runs quietly in the background and only speaks up when a call would have otherwise been lost. Here is the whole thing, start to finish.
          </p>

          {HOW.map((item) => (
            <div key={item.n} style={{
              display: "grid",
              gridTemplateColumns: "48px 1fr",
              gap: 20,
              marginBottom: 36,
              paddingBottom: 36,
              borderBottom: "1px solid rgba(59,33,20,0.1)",
            }}>
              <div style={{
                fontFamily: "'Neue Montreal', sans-serif",
                fontSize: 13,
                fontWeight: 700,
                color: "#EA9A61",
                paddingTop: 4,
                letterSpacing: "0.05em",
              }}>{item.n}</div>
              <div>
                <h3 style={{ fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontSize: 18, fontWeight: 700, color: "#B16937", marginBottom: 12 }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: 16, lineHeight: 1.75, color: "#3B2114", margin: 0 }}>{item.body}</p>
              </div>
            </div>
          ))}

          <blockquote style={{
            margin: "32px 0 0",
            padding: "24px 28px",
            borderLeft: "4px solid #EA9A61",
            background: "rgba(234,154,97,0.08)",
            borderRadius: "0 8px 8px 0",
          }}>
            <p style={{ fontFamily: "Norwige, sans-serif", fontSize: 22, lineHeight: 1.5, color: "#3B2114", margin: 0, fontStyle: "italic" }}>
              &ldquo;You cannot answer every call when your crew is on a job. You can make sure every caller still hears back before they dial someone else.&rdquo;
            </p>
          </blockquote>
        </section>

        {/* ── SECTION 5: Does it work ── */}
        <section id="does-it-work" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 20, lineHeight: 1.2 }}>
            Does it actually book more jobs?
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            Yes, because in home services the fastest response usually wins the job, not the lowest price. A homeowner with a dead AC calls two or three shops and books whoever gets back to them first while the house is still hot. When you are the one that answers in seconds, you are the one that gets on the schedule, even against a bigger name with a louder brand.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            It also works because it never forgets. A person at the desk misses calls during the lunch rush, forgets to call back the estimate from Tuesday, and clocks out at 5pm. The automation catches the after-hours call, the weekend call, and the mid-job call every single time, without you thinking about it. During the busy months, that is the difference between a full board and calls quietly leaking to the shop down the road.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75 }}>
            One recovered job in peak season usually covers the whole month it costs to run. Everything the system books after that is margin you were leaving on the table.
          </p>
        </section>

        {/* ── IMAGE: automation ── */}
        <div style={{ margin: "0 -24px 56px", position: "relative", height: "clamp(240px, 35vw, 400px)", overflow: "hidden" }}>
          <Image src="/heroassets/n8nframe.webp" alt="An ROV automation built in n8n that texts back missed callers and re-touches dead estimates for an HVAC company" fill style={{ objectFit: "cover" }} />
          <div style={{ position: "absolute", bottom: 16, left: 24, background: "rgba(59,33,20,0.75)", color: "#FFF4E3", fontSize: 12, padding: "6px 12px", borderRadius: 6, backdropFilter: "blur(4px)" }}>
            The missed-call text-back automation ROV builds in n8n. It runs in the background and only speaks up when a call would have been lost.
          </div>
        </div>

        {/* ── SECTION 6: Website + text-back ── */}
        <section id="website" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 20, lineHeight: 1.2 }}>
            Why the site and the text-back belong together
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            The text you send has to land somewhere, and that somewhere is your website. When the homeowner taps the link, they either see a fast, clear site with your reviews, your service area, and a simple way to book, or they see a stock-photo page from 2016 that loads slowly and tells them nothing. One closes the job. The other loses the homeowner you just worked to keep.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            The same website is also what puts you in front of that homeowner in the first place. A site that clearly says who you are, which counties you cover, and that shows real reviews is what earns you the <Link href="/web/why-isnt-my-business-showing-up-on-google" style={{ color: "#90422C", textDecoration: "underline" }}>Map Pack spot</Link> when someone searches &ldquo;AC repair near me&rdquo; at midnight. The site gets you found, the text-back keeps you from losing the call, and the two only work at full strength together.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75 }}>
            That is why ROV builds them as one system, not two purchases. You get a website built to get you found and a missed-call text-back that catches what the site brings in. If you want the whole picture on the site side first, start with <Link href="/web" style={{ color: "#90422C", textDecoration: "underline" }}>ROV web design</Link> and the rest of our <Link href="/ai-automation" style={{ color: "#90422C", textDecoration: "underline" }}>AI automations for Atlanta businesses</Link>.
          </p>
        </section>

        {/* ── SECTION 7: The dream ── */}
        <section id="the-dream" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 20, lineHeight: 1.2 }}>
            What it looks like when the trucks stay full
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            Picture a week in July where not a single call leaks. Your crew works the job in front of them without the guilt of a phone buzzing in a pocket nobody can reach. Every missed call gets a text before the homeowner moves on, and by the time you check your phone at lunch there are three new jobs already texting back with the times that work for them.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 28 }}>
            The shoulder season stings less too, because the estimates that used to go quiet get a nudge and some of them come back. You stay the shop that answers, the one on a first-name basis, the one that shows up, without having to be the one holding the phone at 9pm on a Saturday. That is what the automation buys you: your name stays the first one homeowners reach, and your time stays yours.
          </p>

          <div style={{ background: "rgba(144,66,44,0.08)", border: "1px solid rgba(144,66,44,0.2)", borderRadius: 12, padding: "24px 28px" }}>
            <p style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: 13, fontWeight: 700, color: "#90422C", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>The short version</p>
            <p style={{ fontSize: 16, lineHeight: 1.7, margin: 0 }}>
              A website that gets you found plus a text-back that catches every missed call means the calls stop leaking to the shop down the road. You keep more of the jobs the summer sends you, and you stop trading your evenings for the fear of a missed call. The trucks stay full, and you are not the one glued to the phone to keep them that way.
            </p>
          </div>
        </section>

        {/* ── SECTION 8: Cost ── */}
        <section id="cost" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 20, lineHeight: 1.2 }}>
            What it costs and how to start
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 28 }}>
            ROV builds the website and the missed-call text-back system together for a $750 build fee, then runs it free for 30 days so you see the booked jobs before you commit to anything. After the free month it is $1,000 a month with a three-month minimum. Here is exactly what is in it.
          </p>

          <div style={{ overflowX: "auto", marginBottom: 32 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
              <thead>
                <tr style={{ background: "#3B2114" }}>
                  {["What you get", "Details"].map((h) => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#FFF4E3", fontFamily: "'Neue Montreal', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["$750 build fee", "The website and the missed-call text-back system, built and launched"],
                  ["30 days free", "Run it live and count the booked jobs before you pay a retainer"],
                  ["$1,000 / month", "Ongoing after the free month, three-month minimum"],
                  ["Under 30 sec", "Response time on every missed call, 24/7, mid-job and after-hours"],
                ].map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "rgba(59,33,20,0.04)" : "transparent" }}>
                    {row.map((cell, j) => (
                      <td key={j} style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid rgba(59,33,20,0.08)",
                        color: "#3B2114",
                        fontWeight: j === 0 ? 700 : 400,
                        fontFamily: j === 0 ? "'Neue Montreal', sans-serif" : "inherit",
                      }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p style={{ fontSize: 17, lineHeight: 1.75 }}>
            The first month is free for a reason. One recovered job in peak season usually covers what the whole month costs, so you get to watch it pay for itself before there is a bill. If it does not book you work, you have not lost anything but a build fee for a website you keep either way.
          </p>
        </section>

        {/* ── SECTION 9: Where this goes next ── */}
        <section id="whats-next" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 20, lineHeight: 1.2 }}>
            Where this goes next
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            Missed-call text-back is the front door, not the whole house. The moment it starts running, every homeowner who texts you back becomes something you did not have before: a name, a number, and a record of what they needed and when they needed it. Catching the call is step one. What you do with that growing list is where the real compounding starts.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 28 }}>
            Over a summer you are not just saving calls, you are quietly building a list of every homeowner who ever reached out, sorted by what they need and when. That list is the fuel for everything else, and each piece runs on the same system already sitting on your line.
          </p>

          <div style={{ background: "rgba(144,66,44,0.08)", border: "1px solid rgba(144,66,44,0.2)", borderRadius: 12, padding: "24px 28px", marginBottom: 32 }}>
            <p style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: 13, fontWeight: 700, color: "#90422C", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>What the data turns into</p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 14 }}>
              {[
                ["Seasonal tune-up texts", "The homeowner who booked an AC repair in July is the one you text in October for a furnace tune-up. Predictable work in the shoulder season, from a list you already own."],
                ["Dead-estimate re-touch", "Every quote that went quiet gets a nudge a few days later, automatically. A chunk of ghosted estimates come back on the schedule without a single cold call."],
                ["Review and referral loops", "The job that closes with a happy homeowner triggers a text asking for a Google review, then a referral. Your Map Pack spot and your reputation build themselves."],
                ["A funnel that starts warm", "Instead of starting from zero every spring, you start from a base of homeowners who already know your name. That is the difference between chasing work and having it waiting."],
              ].map(([title, body]) => (
                <li key={title} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 12, alignItems: "start" }}>
                  <span style={{ color: "#EA9A61", fontSize: 16, marginTop: 1 }}>→</span>
                  <span>
                    <span style={{ display: "block", color: "#B16937", fontWeight: 700, fontSize: 15, marginBottom: 3 }}>{title}</span>
                    <span style={{ color: "rgba(59,33,20,0.75)", fontSize: 15, lineHeight: 1.6 }}>{body}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <p style={{ fontSize: 17, lineHeight: 1.75 }}>
            That is why the single automation is only the start. It pays for itself catching calls, and while it does, it quietly builds the list that keeps the trucks full year-round. When you are ready to turn that list into the full system, that is exactly what the rest of our <Link href="/ai-automation" style={{ color: "#90422C", textDecoration: "underline" }}>AI automations for Atlanta businesses</Link> are built to do.
          </p>
        </section>

        {/* ── RELATED READING ── */}
        <section style={{ marginBottom: 64, padding: "32px 0", borderTop: "1px solid rgba(59,33,20,0.12)", borderBottom: "1px solid rgba(59,33,20,0.12)" }}>
          <p style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B16937", marginBottom: 20 }}>Related reading</p>
          <div style={{ display: "grid", gap: 16 }}>
            {[
              { href: "/web/why-isnt-my-business-showing-up-on-google", label: "Why isn't my business showing up on Google?", desc: "The six reasons Atlanta businesses stay invisible in local search, and how to fix each one." },
              { href: "/web/how-much-does-a-website-cost-in-atlanta", label: "How much does a website cost in Atlanta?", desc: "Real 2026 pricing, what drives the cost, and why the cheapest site is the one you pay for twice." },
              { href: "/industries/home-services-atlanta", label: "What we do for Atlanta home-services companies", desc: "The whole picture for trades: getting found, answering fast, and keeping the job. Plus what it costs." },
              { href: "/ai-automation", label: "AI automations for Atlanta businesses", desc: "Missed call text-back, automatic review requests, dead-estimate follow-up. The full automation lineup." },
              { href: "/web", label: "ROV Studios web design services", desc: "How we build Atlanta websites Google trusts and homeowners book on. Pricing, timeline, process." },
              { href: "/casestudy/bando", label: "TheBando case study", desc: "How we took a buried ordering page to 91,060 views with no ad spend. Every decision, every number." },
            ].map((link) => (
              <Link key={link.href} href={link.href} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 16, alignItems: "start", textDecoration: "none", padding: "16px 0", borderBottom: "1px solid rgba(59,33,20,0.07)" }}>
                <span style={{ color: "#EA9A61", fontSize: 16, marginTop: 2 }}>→</span>
                <span>
                  <span style={{ display: "block", color: "#90422C", fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{link.label}</span>
                  <span style={{ color: "rgba(59,33,20,0.6)", fontSize: 14, lineHeight: 1.5 }}>{link.desc}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

      </div>

      {/* ── FAQ ── */}
      <FaqAccordion />

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px 80px" }}>

        {/* ── SOURCES ── */}
        <section style={{ marginBottom: 48 }}>
          <p style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B16937", marginBottom: 16 }}>Sources</p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}>
            <li style={{ fontSize: 14, lineHeight: 1.5, color: "rgba(59,33,20,0.7)" }}>
              <a href="https://hbr.org/2011/03/the-short-life-of-online-sales-leads" target="_blank" rel="noopener noreferrer" style={{ color: "#90422C", textDecoration: "underline" }}>Harvard Business Review</a> · responding within an hour makes a real conversation about 7x more likely
            </li>
            <li style={{ fontSize: 14, lineHeight: 1.5, color: "rgba(59,33,20,0.7)" }}>
              <a href="https://www.servicetitan.com/blog/how-to-get-hvac-leads" target="_blank" rel="noopener noreferrer" style={{ color: "#90422C", textDecoration: "underline" }}>ServiceTitan</a> · speed-to-lead and how HVAC companies win the call
            </li>
          </ul>
        </section>

        {/* ── AUTHOR ── */}
        <section style={{ marginBottom: 64, padding: "28px 32px", background: "#3B2114", borderRadius: 16, color: "#FFF4E3" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div style={{ position: "relative", width: 64, height: 64, borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "2px solid rgba(234,154,97,0.4)" }}>
              <Image src="/teammembers/suchettm.webp" alt="Suchet Konda, Co-Founder ROV Studios" fill style={{ objectFit: "cover" }} />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 2, color: "#FFF4E3" }}>Suchet Konda</p>
              <p style={{ color: "#EA9A61", fontSize: 13, margin: 0, fontFamily: "'Neue Montreal', sans-serif" }}>
                Co-Founder and Systems Architect, <Link href="/about" style={{ color: "#EA9A61" }}>ROV Studios</Link>
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,244,227,0.1)" }}>
            <span style={{ display: "inline-block", width: 24, height: 2, background: "#EA9A61", flexShrink: 0 }} />
            <p style={{ fontSize: 12, color: "#FFF4E3", margin: 0, fontFamily: "'Neue Montreal', sans-serif" }}>
              Last updated &nbsp; July 5, 2026
            </p>
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{
          background: "#FFF4E3",
          border: "1.5px solid rgba(59,33,20,0.15)",
          borderRadius: 16,
          padding: "48px 36px",
          textAlign: "center",
        }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 400, marginBottom: 16, lineHeight: 1.2, color: "#3B2114" }}>
            See how many calls your shop is missing
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: "rgba(59,33,20,0.7)", marginBottom: 32, maxWidth: 480, margin: "0 auto 32px" }}>
            We run a free audit for Atlanta HVAC shops. We look at your site, your Map Pack spot, and where calls are leaking, then show you what missed-call text-back would catch. First month is free, so you count the jobs before you pay.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="https://cal.com/rov-studios-imhphw/15min"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "#90422C",
                color: "#FFF4E3",
                padding: "14px 28px",
                borderRadius: 100,
                fontFamily: "'Neue Montreal', sans-serif",
                fontWeight: 700,
                fontSize: 15,
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Book a free audit
            </a>
            <Link
              href="/ai-automation"
              style={{
                background: "transparent",
                color: "#3B2114",
                padding: "14px 28px",
                borderRadius: 100,
                fontFamily: "'Neue Montreal', sans-serif",
                fontWeight: 600,
                fontSize: 15,
                textDecoration: "none",
                display: "inline-block",
                border: "1.5px solid rgba(59,33,20,0.25)",
              }}
            >
              See all our automations
            </Link>
          </div>
        </section>

      </div>
      <NavigationDock />
      <Footer />
    </main>
  );
}
