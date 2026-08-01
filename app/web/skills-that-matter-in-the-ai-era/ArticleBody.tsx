"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
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
  { id: "the-short-answer", label: "The short answer: what actually matters now" },
  { id: "the-shift", label: "Why building stopped being the hard part" },
  { id: "direction-skills", label: "The four skills that replaced execution" },
  { id: "orchestration-in-practice", label: "What orchestrating with AI looks like" },
  { id: "human-skills", label: "The human skills AI cannot touch" },
  { id: "cheaper-vs-valuable", label: "What got cheap, what got valuable" },
  { id: "is-coding-dead", label: "Is learning to code still worth it?" },
  { id: "where-to-start", label: "Where to start if you are early" },
  { id: "faq", label: "Frequently asked questions" },
];

const STATS = [
  { number: "55%", label: "Faster task completion", sub: "for developers using AI coding tools (GitHub)" },
  { number: "44%", label: "Of workers' core skills", sub: "will be disrupted within five years (WEF)" },
  { number: "60%", label: "Of the workforce", sub: "will need new training before 2027 (WEF)" },
];

const DIRECTION = [
  {
    n: "01",
    title: "Planning and problem definition",
    body: "Deciding what to build. AI will execute almost anything you point it at, which means the whole game becomes pointing it at the right thing. The person who can look at a messy situation and name the actual problem is now worth more than the person who can only build once someone else has named it.",
  },
  {
    n: "02",
    title: "Systems thinking and structure",
    body: "Designing how the pieces fit together. One good prompt makes a component. A working product is fifty components that have to agree with each other. Holding that whole structure in your head, and knowing where the load-bearing walls are, is a skill AI does not have because it only sees the piece in front of it.",
  },
  {
    n: "03",
    title: "Direction and taste",
    body: "Judging whether the output is actually good, then steering it until it is. AI produces confident, polished, average work by default. Taste is what turns average into right. It is the ability to look at what came back and know it is off, even when you cannot yet say why.",
  },
  {
    n: "04",
    title: "Time and attention management",
    body: "When execution is cheap, your only real constraint is where you aim your energy. You can now start ten things in a day. Finishing the one that matters, and ignoring the nine that do not, is the difference between busy and effective. Managing your attention became a competitive skill, not a productivity tip.",
  },
];

const HUMAN = [
  {
    n: "01",
    title: "Sales",
    body: "Understanding what someone actually needs and helping them decide to act. AI can draft the email. It cannot read the pause on a call, feel the real objection under the stated one, or carry the trust that makes someone say yes. When everyone can build the thing, the person who can sell it wins.",
  },
  {
    n: "02",
    title: "Speaking",
    body: "Holding a room and being clear under pressure. The ability to explain an idea so a person leans in, to think on your feet, and to be persuasive in real time does not get automated. It gets more valuable as attention gets scarcer and as more people hide behind generated text.",
  },
  {
    n: "03",
    title: "Networking",
    body: "Building the relationships that route opportunity toward you. Deals, jobs, and introductions still move through people who trust each other. AI can help you keep in touch. It cannot be the person others want in the room. That web of real relationships compounds in a way no tool replaces.",
  },
];

const PIPELINE = [
  {
    n: "01",
    title: "Decide who is worth reaching",
    body: "Before a single line of code runs, I lock the exact kind of business worth contacting. Fit beats volume every time. Fifty right leads are worth more than a thousand wrong ones. This is a judgment call, and no tool makes it for me.",
  },
  {
    n: "02",
    title: "Scrape the candidates",
    body: "A maps API pulls every matching business in the target areas into one growing list. This used to be days of manual research. Now it runs on a schedule and adds to the pile each time, so the list compounds instead of resetting.",
  },
  {
    n: "03",
    title: "Filter to fit",
    body: "A mandatory filter strips out everyone who does not match. Chains, franchises, wrong category, all gone. This is where fit over volume stops being a nice idea and becomes a rule the system actually enforces in code.",
  },
  {
    n: "04",
    title: "Verify and enrich",
    body: "Every surviving email runs through a verifier so nothing bounces, because bounces quietly poison the sender's reputation. Then each lead gets enriched into a real named person instead of a generic inbox, so the outreach lands with a human.",
  },
  {
    n: "05",
    title: "Split into campaigns and send",
    body: "The clean list loads into a cold email platform, split by angle and by inbox, and goes out from warmed mailboxes on a controlled cadence. The copy is written to read like one person wrote to another, not like a blast.",
  },
  {
    n: "06",
    title: "Read what comes back and tune",
    body: "Opens and replies feed straight back into who I target next and what I say. The system gets sharper every cycle. Nothing about it is set and forget, and that steering is the part that matters.",
  },
];

function OrchestrationDiagram() {
  const tools = [
    { name: "Scraper", sub: "Maps API" },
    { name: "Filter", sub: "ICP gate" },
    { name: "Verifier", sub: "Email check" },
    { name: "Enricher", sub: "Real person" },
    { name: "Sender", sub: "Cold email" },
  ];
  const Arrow = ({ label }: { label: string }) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, margin: "10px 0" }}>
      <span style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#B16937", fontWeight: 700 }}>{label}</span>
      <span style={{ color: "#EA9A61", fontSize: 18, lineHeight: 1 }}>&#8595;</span>
    </div>
  );
  return (
    <figure style={{ background: "rgba(144,66,44,0.05)", border: "1.5px solid rgba(144,66,44,0.22)", borderRadius: 16, padding: "32px 20px", margin: "8px 0 40px", textAlign: "center" }}>
      <p style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#B16937", fontWeight: 700, marginBottom: 24 }}>
        How I orchestrate it
      </p>

      {/* YOU */}
      <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 4, background: "#FFF4E3", border: "1.5px solid rgba(59,33,20,0.25)", borderRadius: 12, padding: "14px 28px", minWidth: 200 }}>
        <span style={{ fontFamily: "Norwige, sans-serif", fontSize: 20, color: "#3B2114" }}>You</span>
        <span style={{ fontSize: 12, color: "rgba(59,33,20,0.6)" }}>direction &middot; judgment &middot; taste</span>
      </div>

      <Arrow label="you direct" />

      {/* CLAUDE CODE hub */}
      <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 4, background: "linear-gradient(135deg, #90422C, #603E25)", borderRadius: 14, padding: "18px 32px", minWidth: 240, boxShadow: "0 6px 20px rgba(59,33,20,0.18)" }}>
        <span style={{ fontFamily: "Norwige, sans-serif", fontSize: 24, color: "#FFF4E3" }}>Claude Code</span>
        <span style={{ fontSize: 12, color: "rgba(255,244,227,0.82)" }}>the orchestrator, builds and runs every tool</span>
      </div>

      <Arrow label="builds and runs" />

      {/* TOOLS */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12, maxWidth: 620, margin: "0 auto" }}>
        {tools.map((t) => (
          <div key={t.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, background: "#3B2114", borderRadius: 10, padding: "12px 14px", flex: "1 1 100px", minWidth: 100 }}>
            <span style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: 14, fontWeight: 700, color: "#EA9A61" }}>{t.name}</span>
            <span style={{ fontSize: 11, color: "rgba(255,244,227,0.75)" }}>{t.sub}</span>
          </div>
        ))}
      </div>

      <Arrow label="produces" />

      {/* OUTCOME */}
      <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "rgba(234,154,97,0.14)", border: "1.5px solid #EA9A61", borderRadius: 12, padding: "14px 28px", maxWidth: 440 }}>
        <span style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: 15, fontWeight: 600, color: "#90422C", lineHeight: 1.4 }}>
          Cold outreach that reaches real, right-fit people
        </span>
      </div>

      <figcaption style={{ fontSize: 12, color: "rgba(59,33,20,0.55)", marginTop: 24, fontStyle: "italic" }}>
        I direct Claude Code. It builds and runs the tools. I spend my time on the judgment.
      </figcaption>
    </figure>
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
            {" · "}Skills in the AI Era
          </p>

          {/* Headline */}
          <h1 style={{
            fontFamily: "Norwige, sans-serif",
            fontSize: "clamp(36px, 6vw, 64px)",
            fontWeight: 400,
            lineHeight: 1.1,
            marginBottom: 24,
            color: "#FFFFFF",
          }}>
            What Skills Actually Matter in the AI Era?
          </h1>

          <p style={{ fontSize: 18, lineHeight: 1.65, color: "rgba(255,244,227,0.82)", marginBottom: 36, maxWidth: 600 }}>
            Building used to be the wall. Tools like Claude turned a week of work into an afternoon. So the skills that matter now are the ones AI cannot do for you. Planning, structure, direction, and the human skills that move other people.
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
            <div style={{ color: "rgba(255,244,227,0.45)", fontSize: 13 }}>July 2026 · 9 min read</div>
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
                fontSize: "clamp(32px, 5vw, 48px)",
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
            The short answer: what actually matters now
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            It is a late night in Atlanta and I am building a lead scraper by myself. The tool pulls local businesses, finds and verifies their emails, and enriches each one so our outreach reaches a real person instead of a guess. A year ago that would have been weeks of code I did not have the hours to write. Tonight I describe what I want to an AI tool, watch it write the first version, and spend my real time deciding whether it is right. The typing stopped being the job. The thinking became the job.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            That is the whole shift in one sentence. AI did not make skill worthless. It moved the value from executing the work to deciding what work is worth doing and whether the result is any good.
          </p>

          {/* The short answer info box */}
          <div style={{ background: "rgba(144,66,44,0.08)", border: "1px solid rgba(144,66,44,0.2)", borderRadius: 12, padding: "24px 28px", margin: "8px 0 32px" }}>
            <p style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: 13, fontWeight: 700, color: "#90422C", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>The short version</p>
            <p style={{ fontSize: 16, lineHeight: 1.7, margin: 0 }}>
              In the AI era, execution stopped being the bottleneck. The skills that matter are the ones AI cannot do for you. Direction skills like planning, systems thinking, and judgment, and human skills like sales, speaking, and networking. AI made building cheap, so the leverage moved to everything wrapped around the building.
            </p>
          </div>

          <p style={{ fontSize: 17, lineHeight: 1.75 }}>
            If you are trying to decide what to learn in the age of AI, that is the frame. Stop asking which tool to memorize. Start asking which of these you are weakest at, then close that gap first.
          </p>
        </section>

        {/* ── SECTION 2: The shift ── */}
        <section id="the-shift" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 20, lineHeight: 1.2 }}>
            Why building stopped being the hard part
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            For most of the last twenty years, the ability to build was the moat. If you could write the code, design the system, or produce the work, you were valuable simply because most people could not. Execution was scarce, so execution paid.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            AI collapsed that. A tool like Claude can now write a working feature, draft a full document, or scaffold a whole app from a plain description. In GitHub&apos;s own research, developers using AI coding tools finished tasks about 55% faster. The floor on production dropped for everyone at once. When the whole world can produce the thing, producing it is no longer where the value lives.
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
            }}>44%</div>
            <div>
              <p style={{ color: "#FFF4E3", fontSize: 16, lineHeight: 1.6, margin: 0 }}>
                of workers&apos; core skills are expected to be disrupted within five years. The skills that survive are the ones that sit above the work AI now does for you.
              </p>
              <p style={{ color: "rgba(255,244,227,0.8)", fontSize: 12, marginTop: 8, marginBottom: 0 }}>Source: <a href="https://www.weforum.org/publications/the-future-of-jobs-report-2023/" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,244,227,0.8)" }}>World Economic Forum, Future of Jobs</a></p>
            </div>
          </div>

          <p style={{ fontSize: 17, lineHeight: 1.75 }}>
            This is not the first time a tool did this. The calculator did not kill math, it moved the value from arithmetic to knowing which equation to set up. AI is the same move, applied to almost every kind of knowledge work at once. The person who knows which equation to set up is the one who wins.
          </p>
        </section>

        {/* ── SECTION 3: Direction skills ── */}
        <section id="direction-skills" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 12, lineHeight: 1.2 }}>
            The four skills that replaced execution
          </h2>
          <p style={{ fontSize: 15, color: "#B16937", marginBottom: 36, fontFamily: "'Neue Montreal', sans-serif" }}>
            When AI handles the doing, these become the job.
          </p>

          {DIRECTION.map((item) => (
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

          {/* Pull quote */}
          <blockquote style={{
            margin: "32px 0 0",
            padding: "24px 28px",
            borderLeft: "4px solid #EA9A61",
            background: "rgba(234,154,97,0.08)",
            borderRadius: "0 8px 8px 0",
          }}>
            <p style={{ fontFamily: "Norwige, sans-serif", fontSize: 22, lineHeight: 1.5, color: "#3B2114", margin: 0, fontStyle: "italic" }}>
              &ldquo;AI is an engine with no steering wheel. The value moved to whoever can drive.&rdquo;
            </p>
          </blockquote>
        </section>

        {/* ── SECTION: Orchestration in practice ── */}
        <section id="orchestration-in-practice" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 20, lineHeight: 1.2 }}>
            What orchestrating with AI looks like
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            This is easier to see in a real system than in the abstract, so here is one I run. For one of the brands I do outreach for, I do not send cold emails one at a time. I built an engine that finds the right businesses, checks that every contact is real, and reaches out at scale. My job is to point it and correct it.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 36 }}>
            Here is the whole pipeline, start to send.
          </p>

          <OrchestrationDiagram />

          {PIPELINE.map((item) => (
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

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            Here is the part that matters. I did not hand-write most of that infrastructure. I orchestrated it with Claude Code. I described what each piece should do, it built the scrapers, the filters, and the integrations, and I spent my real hours on the decisions no tool can make. Who is worth reaching. Whether the fit is right. When it is worth spending money. Whether the message will land.
          </p>

          {/* Pull quote */}
          <blockquote style={{
            margin: "32px 0 0",
            padding: "24px 28px",
            borderLeft: "4px solid #EA9A61",
            background: "rgba(234,154,97,0.08)",
            borderRadius: "0 8px 8px 0",
          }}>
            <p style={{ fontFamily: "Norwige, sans-serif", fontSize: 22, lineHeight: 1.5, color: "#3B2114", margin: 0, fontStyle: "italic" }}>
              &ldquo;I did not build a scraper. I built the judgment to run one. The engine is the easy part. Aiming it is the skill.&rdquo;
            </p>
          </blockquote>

          {/* ── Live campaign screenshot (anonymized) ── */}
          <figure style={{ margin: "40px 0 8px", borderRadius: 12, overflow: "hidden", border: "1px solid rgba(59,33,20,0.18)", background: "#0d1117" }}>
            <div style={{ position: "relative", width: "100%", aspectRatio: "1319 / 565" }}>
              <Image src="/heroassets/live-campaign-stats.png" alt="A live cold outreach campaign dashboard showing sends ramping up through July, with open rate and reply rate" fill style={{ objectFit: "contain" }} />
            </div>
            <figcaption style={{ background: "#3B2114", color: "rgba(255,244,227,0.9)", fontFamily: "'Neue Montreal', sans-serif", fontSize: 12, padding: "12px 16px", lineHeight: 1.5 }}>
              A live campaign I run, ramping through July. The engine handles the sending. I decide who to reach and what to say.
            </figcaption>
          </figure>
        </section>

        {/* ── SECTION 4: Human skills ── */}
        <section id="human-skills" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 20, lineHeight: 1.2 }}>
            The human skills AI cannot touch
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 28 }}>
            Direction skills keep you valuable next to the machine. Human skills are what separate you from everyone else who is also using it. When any competitor can build the same website in an afternoon, the deal goes to the person who can sell it, explain it, and knows the right people. These three compound, and none of them get automated.
          </p>

          {HUMAN.map((item) => (
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

          <p style={{ fontSize: 17, lineHeight: 1.75 }}>
            None of this is a soft-skill cliche. It is leverage. The person who can build with AI and sell what they built is worth far more than the person who can only do one of the two. That combination is exactly what we run on at <Link href="/ai-automation" style={{ color: "#90422C", textDecoration: "underline" }}>ROV Studios</Link>.
          </p>
        </section>

        {/* ── SECTION 5: Cheaper vs valuable table ── */}
        <section id="cheaper-vs-valuable" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 20, lineHeight: 1.2 }}>
            What got cheap, what got valuable
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 28 }}>
            The clearest way to see the shift is to line up the two columns. Everything on the left used to be scarce and paid well. AI made it cheap. Everything on the right is what you now compete on.
          </p>

          <div style={{ overflowX: "auto", marginBottom: 28 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
              <thead>
                <tr style={{ background: "#3B2114" }}>
                  {["The work AI made cheap", "The work that got valuable"].map((h) => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#FFF4E3", fontFamily: "'Neue Montreal', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Writing boilerplate code", "Deciding what to build"],
                  ["Producing a first draft", "Judging whether it is good"],
                  ["Looking up an answer", "Asking the right question"],
                  ["Executing one known task", "Directing across many at once"],
                  ["Raw individual output", "Moving people: sales, speaking, networking"],
                ].map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "rgba(59,33,20,0.04)" : "transparent" }}>
                    {row.map((cell, j) => (
                      <td key={j} style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid rgba(59,33,20,0.08)",
                        color: j === 1 ? "#90422C" : "rgba(59,33,20,0.7)",
                        fontWeight: j === 1 ? 700 : 400,
                        fontFamily: j === 1 ? "'Neue Montreal', sans-serif" : "inherit",
                      }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p style={{ fontSize: 17, lineHeight: 1.75 }}>
            Notice that none of the right column is a new technical tool. It is judgment, direction, and relationships. That is why the answer to what skills matter in the AI era is not a list of software. It is a list of capabilities that make the software worth something.
          </p>
        </section>

        {/* ── SECTION 6: Is coding dead ── */}
        <section id="is-coding-dead" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 20, lineHeight: 1.2 }}>
            Is learning to code still worth it?
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            This is the question everyone asks, so here it is straight. Yes, learning to code is still worth it. The reason just changed. You no longer learn it to type every line yourself. You learn it so you can read what AI writes, direct it, and catch it when it is confidently wrong.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            AI produces average, plausible work by default, and average is often wrong in ways that only show up later. The developer who understands what good looks like gets a force multiplier. The person who has no idea what the code does gets a fast way to ship bugs. Same tool, opposite outcome, and the difference is the underlying skill.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75 }}>
            So learn to build. Then treat building as the entry fee, not the finish line. The goal is to become the person who can direct the build, not just perform it. That is the mindset behind how we work at <Link href="/web" style={{ color: "#90422C", textDecoration: "underline" }}>ROV web design</Link>, where the site is the easy part and the strategy behind it is the real work.
          </p>
        </section>

        {/* ── SECTION 7: Where to start ── */}
        <section id="where-to-start" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 20, lineHeight: 1.2 }}>
            Where to start if you are early
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            I am 21 and figuring this out in real time, so this is not advice from a mountaintop. It is what is actually working. If you are a student or just starting out, three moves matter more than any course you could buy.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            First, build real things with AI, not tutorials. Point a tool at a problem you actually have and ship the result. You learn direction by directing, not by watching. Second, pick one human skill and practice it on purpose. Have the sales conversation, give the talk, send the message to a stranger. Third, put your work and your thinking in public, so the relationships and the reputation start compounding while you are still early.
          </p>

          <div style={{ background: "rgba(144,66,44,0.08)", border: "1px solid rgba(144,66,44,0.2)", borderRadius: 12, padding: "24px 28px" }}>
            <p style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: 13, fontWeight: 700, color: "#90422C", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>The short version</p>
            <p style={{ fontSize: 16, lineHeight: 1.7, margin: 0 }}>
              The skills that matter in the AI era are not the ones AI performs. They are the ones that decide and direct. Learn to build so you can steer the build. Then get uncomfortably good at one human skill. Ship in public. The people who pair judgment with communication will run circles around the people who only know how to prompt.
            </p>
          </div>
        </section>

        {/* ── RELATED READING ── */}
        <section style={{ marginBottom: 64, padding: "32px 0", borderTop: "1px solid rgba(59,33,20,0.12)", borderBottom: "1px solid rgba(59,33,20,0.12)" }}>
          <p style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B16937", marginBottom: 20 }}>Related reading</p>
          <div style={{ display: "grid", gap: 16 }}>
            {[
              { href: "/ai-automation", label: "AI automations for Atlanta businesses", desc: "What directing AI looks like in practice. The systems we build so a small team ships like a big one." },
              { href: "/web", label: "ROV Studios web design", desc: "How we build sites where the code is the easy part and the strategy behind it is the real work." },
              { href: "/about", label: "About ROV Studios", desc: "Who we are, how we think, and why we build the way we do." },
              { href: "/brand", label: "Brand identity and the experience it flows into", desc: "Judgment applied to a real problem: the gap between a brand and the touchpoints nobody designed." },
              { href: "/ctrla", label: "CTRL-A by ROV Studios", desc: "Our editorial arm on creative direction, design systems, and building in the age of AI." },
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
              <a href="https://www.weforum.org/publications/the-future-of-jobs-report-2023/" target="_blank" rel="noopener noreferrer" style={{ color: "#90422C", textDecoration: "underline" }}>World Economic Forum, Future of Jobs Report</a> · skills disruption and the rising demand for human skills
            </li>
            <li style={{ fontSize: 14, lineHeight: 1.5, color: "rgba(59,33,20,0.7)" }}>
              <a href="https://github.blog/2022-09-07-research-quantifying-github-copilots-impact-on-developer-productivity-and-happiness/" target="_blank" rel="noopener noreferrer" style={{ color: "#90422C", textDecoration: "underline" }}>GitHub research</a> · developers using AI coding tools complete tasks about 55% faster
            </li>
            <li style={{ fontSize: 14, lineHeight: 1.5, color: "rgba(59,33,20,0.7)" }}>
              <a href="https://www.anthropic.com/claude" target="_blank" rel="noopener noreferrer" style={{ color: "#90422C", textDecoration: "underline" }}>Anthropic</a> · Claude, the AI tool referenced throughout this piece
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
          <p style={{ fontSize: 14, lineHeight: 1.7, color: "rgba(255,244,227,0.85)", marginTop: 20, marginBottom: 0 }}>
            Suchet builds outreach and automation systems for ROV Studios in Atlanta, from lead scrapers to email enrichment tools, using AI like Claude to ship the work of a full team. He writes about what actually changes when execution gets cheap and judgment gets expensive.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,244,227,0.1)" }}>
            <span style={{ display: "inline-block", width: 24, height: 2, background: "#EA9A61", flexShrink: 0 }} />
            <p style={{ fontSize: 12, color: "#FFF4E3", margin: 0, fontFamily: "'Neue Montreal', sans-serif" }}>
              Last updated &nbsp; July 20, 2026
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
            This is the thinking behind everything we build
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: "rgba(59,33,20,0.7)", marginBottom: 32, maxWidth: 480, margin: "0 auto 32px" }}>
            ROV Studios builds websites and AI automations for Atlanta businesses. We use AI to move fast, and judgment to make sure it is worth shipping. See what that looks like in practice.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/ai-automation"
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
              See how we build with AI
            </Link>
            <Link
              href="/web"
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
              Our web services
            </Link>
          </div>
        </section>

      </div>
      <NavigationDock />
      <Footer />
    </main>
  );
}
