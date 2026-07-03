"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { FAQS } from "./content";

const NavigationDock = dynamic(
  () => import("@/components/NavDoc").then((mod) => ({ default: mod.NavigationDock })),
  { ssr: false }
);
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });

const TOC = [
  { id: "not-your-leads", label: "The problem is not your leads" },
  { id: "where-deals-leak", label: "Where your deals actually leak" },
  { id: "leak-website", label: "Leak 1: a website that converts nothing" },
  { id: "leak-speed", label: "Leak 2: the first five minutes" },
  { id: "leak-followup", label: "Leak 3: the follow-up you keep meaning to do" },
  { id: "proof", label: "Proof a converting site works" },
  { id: "what-this-means", label: "What this means for Atlanta agents in 2026" },
  { id: "faq", label: "Frequently asked questions" },
];

const STATS = [
  { number: "48%", label: "Of online inquiries", sub: "get no response at all" },
  { number: "21x", label: "More likely to qualify a lead", sub: "answering in 5 minutes, not 30" },
  { number: "15 hrs", label: "Average agent reply time", sub: "to an online inquiry" },
];

const LEAKS = [
  {
    n: "01",
    title: "The website that looks fine and converts nothing",
    body: "Most agent sites are a headshot, a bio, and a search box that sends people back to a portal. No home-valuation tool, no clear next step, no reason to hand over a name. The traffic shows up and leaves. That is not a website. It is a business card that costs you leads.",
  },
  {
    n: "02",
    title: "The first five minutes after they raise their hand",
    body: "A buyer fills out a form at 9 PM. You see it the next morning. By then they have already talked to two other agents. Answering within 5 minutes makes you 21 times more likely to qualify that lead than waiting 30. Most agents answer in hours, if at all.",
  },
  {
    n: "03",
    title: "The follow-up you keep meaning to do",
    body: "The lead that does not close today closes in six to twelve months, but only if someone stays in touch. Sticky notes and a full phone do not do that. Neither does a database you never open. Without a system, your best future deals quietly go cold in your own CRM.",
  },
];

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
            {" · "}Real Estate
          </p>

          {/* Headline */}
          <h1 style={{
            fontFamily: "Norwige, sans-serif",
            fontSize: "clamp(34px, 5.6vw, 60px)",
            fontWeight: 400,
            lineHeight: 1.1,
            marginBottom: 24,
            color: "#FFFFFF",
          }}>
            Atlanta Real Estate Agents Don&apos;t Have a Lead Problem. They Have a Follow-Up Problem.
          </h1>

          <p style={{ fontSize: 18, lineHeight: 1.65, color: "rgba(255,244,227,0.82)", marginBottom: 36, maxWidth: 600 }}>
            You are paying for leads that never turn into closings. The issue is almost never the leads. It is the website they land on and what happens in the five minutes after they raise their hand.
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
                fontSize: "clamp(30px, 4.6vw, 46px)",
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

        {/* ── SECTION 1: Not your leads ── */}
        <section id="not-your-leads" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 20, lineHeight: 1.2 }}>
            The problem is not your leads
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            An agent in East Cobb was spending two thousand dollars a month on portal leads and closing almost none of them. She was sure the leads were junk. So we watched what actually happened to one. It came in at 8:47 PM through her website. She saw it at 9:30 the next morning. By then the buyer had already booked a showing with someone else. The lead was never the problem.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            This is the pattern for most Atlanta agents. You are good at the job. You win when you get in the room. But the path from &ldquo;interested online&rdquo; to &ldquo;in the room&rdquo; leaks the whole way, and you never see the deals you lost because they went to whoever answered first.
          </p>

          {/* Short version box */}
          <div style={{ background: "rgba(144,66,44,0.08)", border: "1px solid rgba(144,66,44,0.2)", borderRadius: 12, padding: "24px 28px", margin: "8px 0 32px" }}>
            <p style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: 13, fontWeight: 700, color: "#90422C", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>The short version</p>
            <p style={{ fontSize: 16, lineHeight: 1.7, margin: 0 }}>
              Most agents do not lose deals because their leads are bad. They lose them in three places: a website that does not convert, a response that comes hours too late, and follow-up that never happens. A <a href="https://www.wavgroup.com/2014/01/13/agent-responsiveness-study-reveals-critical-flaws-in-real-estate-lead-response/" target="_blank" rel="noopener noreferrer" style={{ color: "#90422C", textDecoration: "underline", fontWeight: 600 }}>WAV Group study</a> found 48% of online inquiries get no response at all. Fix the three leaks and the same leads start closing.
            </p>
          </div>

          <p style={{ fontSize: 17, lineHeight: 1.75 }}>
            That gap between the leads you pay for and the deals you close is a revenue leak. For agents it is one of the widest we see, because the front end (your brand, your listings) usually looks great while the back end quietly bleeds.
          </p>
        </section>

        {/* ── IMAGE 1 ── */}
        <div style={{ margin: "0 -24px 56px", position: "relative", height: "clamp(240px, 40vw, 440px)", overflow: "hidden" }}>
          <Image src="/thumbnails/house1.webp" alt="Aerial view of new-construction homes in a metro Atlanta neighborhood" fill style={{ objectFit: "cover" }} />
          <div style={{ position: "absolute", bottom: 16, left: 24, background: "rgba(59,33,20,0.75)", color: "#FFF4E3", fontSize: 12, padding: "6px 12px", borderRadius: 6, backdropFilter: "blur(4px)" }}>
            New construction in metro Atlanta. Every one of these homes sold through an agent, and their next client is searching online right now.
          </div>
        </div>

        {/* ── SECTION 2: Where deals leak ── */}
        <section id="where-deals-leak" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 12, lineHeight: 1.2 }}>
            Where your deals actually leak
          </h2>
          <p style={{ fontSize: 15, color: "#B16937", marginBottom: 36, fontFamily: "'Neue Montreal', sans-serif" }}>
            Three leaks, in the order they cost you the most money.
          </p>

          {LEAKS.map((item) => (
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
              &ldquo;You do not need more leads. You need to stop losing the ones you already paid for.&rdquo;
            </p>
          </blockquote>
        </section>

        {/* ── SECTION 3: Leak 1 website ── */}
        <section id="leak-website" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 20, lineHeight: 1.2 }}>
            Leak 1: a real estate website that converts nothing
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            A real estate agent website in Atlanta should do one job: turn a stranger into a booked appointment. Most do not. They show a bio and a photo, then bounce the visitor to a portal where a dozen other agents are one click away. Nothing captures the visitor, so nothing comes back.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            A site built to convert gives the visitor a reason to raise their hand: a home-valuation tool for sellers, real IDX search for buyers, visible reviews as proof, and one clear next step on every page. That is the difference between a business card and a listing machine, and it is standard in our <Link href="/web" style={{ color: "#90422C", textDecoration: "underline" }}>web design process</Link>.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75 }}>
            This is also the leak that hits everyone, not just new agents. Even top Atlanta producers with huge review counts run sites that under-convert the audience they already have. Wondering what a build like this costs? We broke it down in <Link href="/web/how-much-does-a-website-cost-in-atlanta" style={{ color: "#90422C", textDecoration: "underline" }}>how much a website costs in Atlanta</Link>.
          </p>
        </section>

        {/* ── IMAGE 2 ── */}
        <div style={{ margin: "0 -24px 56px", position: "relative", height: "clamp(240px, 35vw, 400px)", overflow: "hidden" }}>
          <Image src="/webdev/ayseiknawebhome.webp" alt="A converting website ROV built for an Atlanta business, shown as an example of conversion-focused design" fill style={{ objectFit: "cover", objectPosition: "top" }} />
          <div style={{ position: "absolute", bottom: 16, left: 24, background: "rgba(59,33,20,0.75)", color: "#FFF4E3", fontSize: 12, padding: "6px 12px", borderRadius: 6, backdropFilter: "blur(4px)" }}>
            A site ROV built for another Atlanta business. The conversion principles that made it work apply directly to an agent&apos;s site.
          </div>
        </div>

        {/* ── SECTION 4: Leak 2 speed ── */}
        <section id="leak-speed" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 20, lineHeight: 1.2 }}>
            Leak 2: the first five minutes
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            When a lead comes in, the clock is the whole game. Buyers reach out to more than one agent and go with whoever gets back to them first. Miss the window and you are not competing on service or price. You already lost.
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
            }}>21x</div>
            <div>
              <p style={{ color: "#FFF4E3", fontSize: 16, lineHeight: 1.6, margin: 0 }}>
                more likely to qualify a lead when you respond within 5 minutes instead of 30. Yet the average agent takes over 15 hours to reply, and nearly half never reply at all.
              </p>
              <p style={{ color: "rgba(255,244,227,0.8)", fontSize: 12, marginTop: 8, marginBottom: 0 }}>Source: <a href="https://25649.fs1.hubspotusercontent-na2.net/hub/25649/file-13535879-pdf/docs/mit_study.pdf" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,244,227,0.8)" }}>MIT Lead Response Management Study</a></p>
            </div>
          </div>

          <p style={{ fontSize: 17, lineHeight: 1.75 }}>
            No human answers every lead in 5 minutes while showing a house. That is why speed cannot depend on you being free. It has to be automated, which is exactly what leak three is about.
          </p>
        </section>

        {/* ── SECTION 5: Leak 3 follow-up ── */}
        <section id="leak-followup" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 20, lineHeight: 1.2 }}>
            Leak 3: the follow-up you keep meaning to do
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            The fix for slow response and dead follow-up is the same thing: a system that runs without you. A missed-call text-back replies in seconds when you cannot pick up. A speed-to-lead flow answers a web inquiry instantly at any hour. An automatic review request goes out after every closing, so your proof compounds. And a sphere sequence keeps you in front of past clients, the source that sends the most business and gets systematized the least.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75 }}>
            This is what <Link href="/ai-automation" style={{ color: "#90422C", textDecoration: "underline" }}>AI automations for Atlanta businesses</Link> are built to do. You keep selling. The system makes sure no lead waits 15 hours and no past client forgets your name. That is how <Link href="/web" style={{ color: "#90422C", textDecoration: "underline" }}>a website that works</Link> becomes a pipeline that works.
          </p>
        </section>

        {/* ── IMAGE 3 ── */}
        <div style={{ margin: "0 -24px 56px", position: "relative", height: "clamp(240px, 35vw, 400px)", overflow: "hidden" }}>
          <Image src="/heroassets/n8nframe.webp" alt="An automation ROV builds in n8n that sends an instant text back when a call or lead is missed" fill style={{ objectFit: "cover" }} />
          <div style={{ position: "absolute", bottom: 16, left: 24, background: "rgba(59,33,20,0.75)", color: "#FFF4E3", fontSize: 12, padding: "6px 12px", borderRadius: 6, backdropFilter: "blur(4px)" }}>
            An automation ROV builds in n8n. This is how a missed call becomes an instant text back, so a lead never waits 15 hours for a reply.
          </div>
        </div>

        {/* ── SECTION 6: Proof ── */}
        <section id="proof" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 20, lineHeight: 1.2 }}>
            Proof a converting site works
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            The mechanism is the same in every industry: fix the path from interested to converted and the numbers move. <a href="https://www.thebandoatl.com" target="_blank" rel="noopener noreferrer" style={{ color: "#90422C", textDecoration: "underline", fontWeight: 600 }}>TheBando</a> is an Atlanta business whose online conversion page was buried where nobody found it. We did not buy them traffic. We rebuilt that path. Here is what changed in the 139 days after launch, from <Link href="/casestudy/bando" style={{ color: "#90422C", textDecoration: "underline" }}>their analytics</Link>.
          </p>

          <div style={{ overflowX: "auto", marginBottom: 32 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
              <thead>
                <tr style={{ background: "#3B2114" }}>
                  {["Metric", "Before", "After", "Change"].map((h) => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#FFF4E3", fontFamily: "'Neue Montreal', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Conversion page views", "132", "91,060", "+689x"],
                  ["Total page views", "440,754", "588,458", "+33.5%"],
                  ["Bounce rate", "94%", "46%", "-48 pts"],
                ].map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "rgba(59,33,20,0.04)" : "transparent" }}>
                    {row.map((cell, j) => (
                      <td key={j} style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid rgba(59,33,20,0.08)",
                        color: j === 3 ? "#90422C" : "#3B2114",
                        fontWeight: j === 3 ? 700 : 400,
                        fontFamily: j === 3 ? "'Neue Montreal', sans-serif" : "inherit",
                      }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p style={{ fontSize: 17, lineHeight: 1.75 }}>
            A conversion page that nobody reached became the busiest part of the site. Swap &ldquo;ordering page&rdquo; for &ldquo;book a showing&rdquo; or &ldquo;what is my home worth&rdquo; and it is the exact same fix an agent needs. Read the <Link href="/casestudy/bando" style={{ color: "#90422C", textDecoration: "underline", fontWeight: 600 }}>full TheBando case study</Link> for every decision behind it.
          </p>
        </section>

        {/* ── SECTION 7: What this means ── */}
        <section id="what-this-means" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 20, lineHeight: 1.2 }}>
            What this means for Atlanta agents in 2026
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            Atlanta is one of the most crowded agent markets in the country. In a metro this saturated, you are not just competing on who knows the neighborhood. You are competing on who answers first and who is easiest to trust before the call. From Buckhead to Marietta to the Westside, the agent who shows up fast and looks legit online wins the appointment.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 28 }}>
            Search is changing too. Buyers and sellers are asking <a href="https://www.perplexity.ai" target="_blank" rel="noopener noreferrer" style={{ color: "#90422C", textDecoration: "underline" }}>Perplexity</a> and <a href="https://chat.openai.com" target="_blank" rel="noopener noreferrer" style={{ color: "#90422C", textDecoration: "underline" }}>ChatGPT Search</a> things like &ldquo;who is a good listing agent in Decatur.&rdquo; Getting named in those answers is called GEO, and it rewards a real site with real reviews and clear local content. A template on a portal does not show up there at all.
          </p>

          <div style={{ background: "rgba(144,66,44,0.08)", border: "1px solid rgba(144,66,44,0.2)", borderRadius: 12, padding: "24px 28px" }}>
            <p style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: 13, fontWeight: 700, color: "#90422C", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>The short version</p>
            <p style={{ fontSize: 16, lineHeight: 1.7, margin: 0 }}>
              Stop buying more leads until you fix the three leaks. Build a website that converts, respond in minutes instead of hours, and put follow-up on autopilot. The leads you already have start closing, and you own the pipeline instead of renting it. In a market this crowded, that is the whole edge.
            </p>
          </div>
        </section>

        {/* ── RELATED READING ── */}
        <section style={{ marginBottom: 64, padding: "32px 0", borderTop: "1px solid rgba(59,33,20,0.12)", borderBottom: "1px solid rgba(59,33,20,0.12)" }}>
          <p style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B16937", marginBottom: 20 }}>Related reading</p>
          <div style={{ display: "grid", gap: 16 }}>
            {[
              { href: "/web/how-much-does-a-website-cost-in-atlanta", label: "How much does a website cost in Atlanta?", desc: "Real 2026 pricing, what drives the cost, and why the cheapest site is the one you pay for twice." },
              { href: "/casestudy/bando", label: "Full TheBando case study", desc: "How we took a buried conversion page to 91,060 views with no ad spend. Every decision, every number." },
              { href: "/web", label: "ROV Studios web design services", desc: "How we build Atlanta sites that turn visitors into booked appointments. Process, timeline, what you get." },
              { href: "/ai-automation", label: "AI automations for Atlanta businesses", desc: "Missed-call text-back, speed-to-lead response, review requests, and sphere follow-up that runs itself." },
              { href: "/web/why-isnt-my-business-showing-up-on-google", label: "Why isn't my business showing up on Google?", desc: "The six reasons Atlanta businesses stay invisible in local search, and how to fix each one." },
              { href: "/blog/every-business-leaks-money", label: "Every business leaks money", desc: "The revenue leak framework and how ROV finds and fixes it across industries." },
              { href: "/ctrla", label: "CTRL-A by ROV Studios", desc: "Our editorial arm covering creative direction, design systems, and the Atlanta creative scene." },
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
              <a href="https://www.wavgroup.com/2014/01/13/agent-responsiveness-study-reveals-critical-flaws-in-real-estate-lead-response/" target="_blank" rel="noopener noreferrer" style={{ color: "#90422C", textDecoration: "underline" }}>WAV Group Agent Responsiveness Study</a> · 48% of inquiries get no response, 15-hour average reply
            </li>
            <li style={{ fontSize: 14, lineHeight: 1.5, color: "rgba(59,33,20,0.7)" }}>
              <a href="https://25649.fs1.hubspotusercontent-na2.net/hub/25649/file-13535879-pdf/docs/mit_study.pdf" target="_blank" rel="noopener noreferrer" style={{ color: "#90422C", textDecoration: "underline" }}>MIT Lead Response Management Study</a> · answering in 5 minutes vs 30 lifts qualification 21x
            </li>
            <li style={{ fontSize: 14, lineHeight: 1.5, color: "rgba(59,33,20,0.7)" }}>
              <a href="https://www.nar.realtor/research-and-statistics" target="_blank" rel="noopener noreferrer" style={{ color: "#90422C", textDecoration: "underline" }}>National Association of Realtors</a> · buyer and seller behavior, referral and repeat-client trends
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
              Last updated &nbsp; July 2, 2026
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
            Want to see where your deals are leaking?
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: "rgba(59,33,20,0.7)", marginBottom: 32, maxWidth: 480, margin: "0 auto 32px" }}>
            We run free audits for Atlanta agents. We check your site, how fast leads get a reply, and whether your follow-up runs on its own. Then we show you the leaks and what it takes to close them.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="https://calendly.com/rangeofviewmusic/30min"
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
              See our web services
            </Link>
          </div>
        </section>

      </div>
      <NavigationDock />
      <Footer />
    </main>
  );
}
