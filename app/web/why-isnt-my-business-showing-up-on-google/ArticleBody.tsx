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
  { id: "the-short-answer", label: "The short answer" },
  { id: "the-reasons", label: "The six reasons you are invisible" },
  { id: "google-business-profile", label: "The #1 culprit: your Google Business Profile" },
  { id: "the-proof", label: "What showing up actually does" },
  { id: "how-to-fix", label: "How to fix it" },
  { id: "ai-search", label: "Google is not the only search anymore" },
  { id: "what-this-means", label: "What this means for Atlanta businesses" },
  { id: "faq", label: "Frequently asked questions" },
];

const STATS = [
  { number: "88%", label: "Local searches that convert", sub: "into a call or visit within 24 hours" },
  { number: "46%", label: "Of all Google searches", sub: "are looking for something local" },
  { number: "689x", label: "More page visibility", sub: "when we fixed one Atlanta site" },
];

const REASONS = [
  {
    n: "01",
    title: "Your Google Business Profile is not verified",
    body: "This is the single most common reason a business is invisible. You can create a profile in five minutes, but if you never complete the verification step, Google does not show it publicly. No verification, no listing. Most owners do not know they skipped it.",
  },
  {
    n: "02",
    title: "Your name, address, and phone do not match everywhere",
    body: "Google checks your details across the whole internet to confirm you are real. If your phone number is different on your website, your Facebook page, and your Yelp listing, Google gets confused and shows you less. Consistency is a ranking signal, not a nice-to-have.",
  },
  {
    n: "03",
    title: "You picked the wrong categories",
    body: "If an HVAC company lists itself under a vague category, Google does not know to show it when someone searches for AC repair. The wrong category quietly filters you out of the exact searches you want to win.",
  },
  {
    n: "04",
    title: "You have no recent reviews or activity",
    body: "Google favors businesses that look alive. Recent reviews, fresh photos, and posts all tell Google you are open and active. A profile that has not been touched in a year looks abandoned, and abandoned profiles rank lower than active competitors.",
  },
  {
    n: "05",
    title: "Google does not trust your website",
    body: "A slow site, a site that breaks on a phone, or a site with almost no content gives Google no reason to rank you. 46% of searches are local, and most of them happen on a phone. A site that fails on mobile fails in local search.",
  },
  {
    n: "06",
    title: "You are simply too new",
    body: "A brand new profile or website can take up to a month to appear in local results. That is normal. But most businesses that are stuck are not new. They have been invisible for months or years and assumed it was normal.",
  },
];

const FIXES = [
  {
    n: "01",
    title: "Verify and complete your Google Business Profile",
    body: "Start here because it is free and it is the biggest lever. Claim the profile, complete Google's verification, then fill in every field: exact name, address, phone, hours, service areas, categories, and real photos. This alone pulls many businesses out of the void.",
  },
  {
    n: "02",
    title: "Make your details identical everywhere",
    body: "Pick one exact version of your business name, address, and phone number. Then make it match on your website, Google, Facebook, Yelp, and every directory. Same spelling, same formatting, everywhere. This is the trust signal Google leans on most.",
  },
  {
    n: "03",
    title: "Turn reviews back on",
    body: "Ask every happy customer for a Google review, and reply to the ones you get. Fresh reviews tell Google you are active and tell searchers you are trusted. This is exactly the kind of thing an ROV automation can run for you after every job, without you remembering to ask.",
  },
  {
    n: "04",
    title: "Fix the website Google is judging",
    body: "If your site is slow, thin, or broken on a phone, it drags down everything else. A fast, mobile-first site that clearly says who you are, where you work, and what you do gives Google a reason to rank you. That is the core of our web design process at ROV.",
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
            {" · "}Local Search Visibility
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
            Why Isn&apos;t My Business Showing Up on Google?
          </h1>

          <p style={{ fontSize: 18, lineHeight: 1.65, color: "rgba(255,244,227,0.82)", marginBottom: 36, maxWidth: 600 }}>
            Nine times out of ten it is not the competition. It is a Google Business Profile you never finished, contact info that does not match, and a website Google has no reason to trust. Here is how to find your leak and fix it.
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
            <div style={{ color: "rgba(255,244,227,0.45)", fontSize: 13 }}>July 2026 · 8 min read</div>
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
            The short answer
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            It is a Tuesday night in Grant Park. A homeowner&apos;s AC just died in July heat. She grabs her phone and types &ldquo;AC repair near me.&rdquo; Three companies show up. She calls the first one. She never scrolls past them, and she never sees you.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            You are a great business. You do the work right. But if you do not come up when someone in your own city is searching for exactly what you do, you never got a shot at the job.
          </p>

          {/* The short answer info box */}
          <div style={{ background: "rgba(144,66,44,0.08)", border: "1px solid rgba(144,66,44,0.2)", borderRadius: 12, padding: "24px 28px", margin: "8px 0 32px" }}>
            <p style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: 13, fontWeight: 700, color: "#90422C", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>The short version</p>
            <p style={{ fontSize: 16, lineHeight: 1.7, margin: 0 }}>
              Most businesses do not show up on Google for one of six reasons, and the biggest by far is an unverified or incomplete <a href="https://support.google.com/business/answer/145585" target="_blank" rel="noopener noreferrer" style={{ color: "#90422C", textDecoration: "underline", fontWeight: 600 }}>Google Business Profile</a>. Fix the profile, make your contact info match everywhere, get reviews flowing, and give Google a website it can trust. Some fixes are free. All of them are findable in a 15-minute audit.
            </p>
          </div>

          <p style={{ fontSize: 17, lineHeight: 1.75 }}>
            That gap between the money coming in and the money that should be is a revenue leak. Most Atlanta businesses have one. The good news is that being invisible on Google is almost always a fixable problem, not a permanent one.
          </p>
        </section>

        {/* ── SECTION 2: The reasons ── */}
        <section id="the-reasons" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 12, lineHeight: 1.2 }}>
            The six reasons you are invisible
          </h2>
          <p style={{ fontSize: 15, color: "#B16937", marginBottom: 36, fontFamily: "'Neue Montreal', sans-serif" }}>
            In order of how often we find them when we audit an Atlanta business.
          </p>

          {REASONS.map((item) => (
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
              &ldquo;The number one reason a business stays invisible on Google is not competition. It is a Google Business Profile that was never verified.&rdquo;
            </p>
          </blockquote>
        </section>

        {/* ── SECTION 3: Google Business Profile ── */}
        <section id="google-business-profile" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 20, lineHeight: 1.2 }}>
            The #1 culprit: your Google Business Profile
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            Your Google Business Profile is the free listing that shows your name, hours, reviews, and map pin when someone searches for you. For a local service business it is the single most important digital asset you own, and most owners have one that is incomplete, unverified, or full of outdated photos.
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
            }}>88%</div>
            <div>
              <p style={{ color: "#FFF4E3", fontSize: 16, lineHeight: 1.6, margin: 0 }}>
                of local searches lead to a call or a visit within 24 hours. When you do not show up in that moment, the job does not wait for you. It goes to whoever did show up.
              </p>
              <p style={{ color: "rgba(255,244,227,0.8)", fontSize: 12, marginTop: 8, marginBottom: 0 }}>Source: <a href="https://www.servicetitan.com/blog/how-to-get-hvac-leads" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,244,227,0.8)" }}>ServiceTitan</a></p>
            </div>
          </div>

          <p style={{ fontSize: 17, lineHeight: 1.75 }}>
            Google will not put a profile it cannot trust in front of a customer. Verification proves your address is real. Consistent contact info proves you are who you say you are. Reviews and photos prove you are active. Miss those and Google quietly shows a competitor instead, even one who is worse at the actual work.
          </p>
        </section>

        {/* ── IMAGE 1 ── */}
        <div style={{ margin: "0 -24px 56px", position: "relative", height: "clamp(240px, 40vw, 440px)", overflow: "hidden" }}>
          <Image src="/casestudy/bando/bando2.webp" alt="TheBando, an Atlanta Westside restaurant ROV made findable online" fill style={{ objectFit: "cover" }} />
          <div style={{ position: "absolute", bottom: 16, left: 24, background: "rgba(59,33,20,0.75)", color: "#FFF4E3", fontSize: 12, padding: "6px 12px", borderRadius: 6, backdropFilter: "blur(4px)" }}>
            TheBando, Atlanta&apos;s Westside. Great business, nearly invisible online until we fixed the path to it.
          </div>
        </div>

        {/* ── SECTION 4: The proof ── */}
        <section id="the-proof" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 20, lineHeight: 1.2 }}>
            What showing up actually does
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            <a href="https://www.thebandoatl.com" target="_blank" rel="noopener noreferrer" style={{ color: "#90422C", textDecoration: "underline", fontWeight: 600 }}>TheBando</a> is a Black history museum and fried chicken restaurant on Atlanta&apos;s Westside. The food was real. The story was real. But their online ordering page was buried where nobody could find it. In six months, 132 people found it. Not 132 a day. 132 total.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 28 }}>
            We did not run a single ad. We fixed the path from &ldquo;I want this&rdquo; to &ldquo;I found it.&rdquo; Here is what changed in the 139 days after launch, straight from <Link href="/casestudy/bando" style={{ color: "#90422C", textDecoration: "underline" }}>their analytics</Link>.
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
                  ["Ordering page views", "132", "91,060", "+689x"],
                  ["Unique visitors", "174,463", "231,495", "+32.7%"],
                  ["Page views", "440,754", "588,458", "+33.5%"],
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
            The ordering page went from invisible to the site&apos;s main driver. That is the whole point. Being findable is not a vanity metric. It is the difference between a business that exists and a business that gets the call. Read the <Link href="/casestudy/bando" style={{ color: "#90422C", textDecoration: "underline", fontWeight: 600 }}>full TheBando case study</Link> for every decision behind it.
          </p>
        </section>

        {/* ── SECTION 5: How to fix it ── */}
        <section id="how-to-fix" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 12, lineHeight: 1.2 }}>
            How to fix it
          </h2>
          <p style={{ fontSize: 15, color: "#B16937", marginBottom: 36, fontFamily: "'Neue Montreal', sans-serif" }}>
            Four steps, in the order that gets you found fastest.
          </p>

          {FIXES.map((item) => (
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
            If the website is your weak link, that is what <Link href="/web" style={{ color: "#90422C", textDecoration: "underline" }}>ROV web design</Link> is built to fix. We also set up <Link href="/ai-automation" style={{ color: "#90422C", textDecoration: "underline" }}>AI automations for Atlanta businesses</Link> that request reviews after every job, so step three keeps running without you.
          </p>
        </section>

        {/* ── IMAGE 2 ── */}
        <div style={{ margin: "0 -24px 56px", position: "relative", height: "clamp(240px, 35vw, 400px)", overflow: "hidden" }}>
          <Image src="/heroassets/n8nframe.webp" alt="An ROV automation built in n8n that handles customer replies and review requests after every job" fill style={{ objectFit: "cover" }} />
          <div style={{ position: "absolute", bottom: 16, left: 24, background: "rgba(59,33,20,0.75)", color: "#FFF4E3", fontSize: 12, padding: "6px 12px", borderRadius: 6, backdropFilter: "blur(4px)" }}>
            An automation ROV builds in n8n. This is how review requests keep running after every job, without you remembering to send them.
          </div>
        </div>

        {/* ── SECTION 6: AI search ── */}
        <section id="ai-search" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 20, lineHeight: 1.2 }}>
            Google is not the only search anymore
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            Here is the part most Atlanta businesses are not ready for. People are not only typing into Google. They are asking full questions to <a href="https://www.perplexity.ai" target="_blank" rel="noopener noreferrer" style={{ color: "#90422C", textDecoration: "underline" }}>Perplexity</a> and <a href="https://chat.openai.com" target="_blank" rel="noopener noreferrer" style={{ color: "#90422C", textDecoration: "underline" }}>ChatGPT Search</a>. &ldquo;Who is a good HVAC company near Grant Park?&rdquo; The AI answers with a short list and citations. If you are not one of them, you do not exist in that answer.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75 }}>
            Getting cited by AI search is called GEO, and it rewards the same things Google does: clear facts, specific numbers, real reviews, and a site that actually says what you do and where. A business that fixes its Google visibility today is also building the foundation to get picked by AI search tomorrow. Doing both is standard in our <Link href="/web" style={{ color: "#90422C", textDecoration: "underline" }}>web design process</Link>.
          </p>
        </section>

        {/* ── IMAGE 3 ── */}
        <div style={{ margin: "0 -24px 56px", position: "relative", height: "clamp(240px, 35vw, 400px)", overflow: "hidden" }}>
          <Image src="/webdev/ayseiknawebhome.webp" alt="Homepage of Aysegul Ikna, an Atlanta brand website ROV built to be found and shopped online" fill style={{ objectFit: "cover" }} />
          <div style={{ position: "absolute", bottom: 16, left: 24, background: "rgba(59,33,20,0.75)", color: "#FFF4E3", fontSize: 12, padding: "6px 12px", borderRadius: 6, backdropFilter: "blur(4px)" }}>
            A site ROV built for an Atlanta brand. Fast, clear, and built to show up when someone searches.
          </div>
        </div>

        {/* ── SECTION 7: What this means ── */}
        <section id="what-this-means" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 20, lineHeight: 1.2 }}>
            What this means for Atlanta businesses
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            Atlanta has over 500,000 small businesses. Buckhead, the Westside, Grant Park, Old Fourth Ward, Marietta, Sandy Springs. In every one of those neighborhoods, homeowners are searching for an HVAC tech, a roofer, a plumber, or a restaurant right now, on a phone, ready to call the first name they trust.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 28 }}>
            The summer heat and Atlanta&apos;s storm season only turn the volume up. This is peak demand for home services, which means the cost of being invisible is higher this month than almost any other. The businesses that win the search are not always the best at the trade. They are the easiest to find and the easiest to trust in the three seconds before someone taps call.
          </p>

          <div style={{ background: "rgba(144,66,44,0.08)", border: "1px solid rgba(144,66,44,0.2)", borderRadius: 12, padding: "24px 28px" }}>
            <p style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: 13, fontWeight: 700, color: "#90422C", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>The short version</p>
            <p style={{ fontSize: 16, lineHeight: 1.7, margin: 0 }}>
              If you are not showing up on Google, start with your Google Business Profile. Verify it, complete it, and make your contact info match everywhere. Then fix the website Google is judging. Every day it stays broken is a day of calls going to someone else. That is a revenue leak, and it compounds.
            </p>
          </div>
        </section>

        {/* ── RELATED READING ── */}
        <section style={{ marginBottom: 64, padding: "32px 0", borderTop: "1px solid rgba(59,33,20,0.12)", borderBottom: "1px solid rgba(59,33,20,0.12)" }}>
          <p style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B16937", marginBottom: 20 }}>Related reading</p>
          <div style={{ display: "grid", gap: 16 }}>
            {[
              { href: "/casestudy/bando", label: "Full TheBando case study", desc: "How we took a buried ordering page to 91,060 views with no ad spend. Every decision, every number." },
              { href: "/web", label: "ROV Studios web design services", desc: "How we build Atlanta websites Google trusts and customers convert on. Pricing, timeline, process." },
              { href: "/web/how-much-does-a-website-cost-in-atlanta", label: "How much does a website cost in Atlanta?", desc: "Real 2026 pricing, what drives the cost, and why the cheapest site is the one you pay for twice." },
              { href: "/web/real-estate-agent-website-atlanta", label: "Real estate agent websites in Atlanta", desc: "Why agents lose deals after the lead comes in, and the website and follow-up system that fixes it." },
              { href: "/ai-automation", label: "AI automations for Atlanta businesses", desc: "Missed call text-back, automatic review requests, follow-up sequences. Visibility that runs itself." },
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
              <a href="https://support.google.com/business/answer/145585" target="_blank" rel="noopener noreferrer" style={{ color: "#90422C", textDecoration: "underline" }}>Google Business Profile Help</a> · verification and why listings do not appear
            </li>
            <li style={{ fontSize: 14, lineHeight: 1.5, color: "rgba(59,33,20,0.7)" }}>
              <a href="https://www.servicetitan.com/blog/how-to-get-hvac-leads" target="_blank" rel="noopener noreferrer" style={{ color: "#90422C", textDecoration: "underline" }}>ServiceTitan</a> · 88% of local searches convert within 24 hours
            </li>
            <li style={{ fontSize: 14, lineHeight: 1.5, color: "rgba(59,33,20,0.7)" }}>
              <a href="https://www.thinkwithgoogle.com" target="_blank" rel="noopener noreferrer" style={{ color: "#90422C", textDecoration: "underline" }}>Think with Google</a> · local search behavior on mobile
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
              Last updated &nbsp; July 1, 2026
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
            Want to know why your business is not showing up?
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: "rgba(59,33,20,0.7)", marginBottom: 32, maxWidth: 480, margin: "0 auto 32px" }}>
            We run free audits for Atlanta businesses. We check your Google Business Profile, your search visibility, and your site. We find the leak. We show you exactly what to fix, whether it is a free change or a rebuild.
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
