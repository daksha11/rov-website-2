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
  { id: "the-real-answer", label: "The real answer, up front" },
  { id: "price-ranges", label: "What a website actually costs in Atlanta" },
  { id: "what-drives-cost", label: "What drives the price up or down" },
  { id: "cheap-website-cost", label: "What a cheap website really costs you" },
  { id: "how-rov-prices", label: "How ROV prices a website" },
  { id: "what-this-means", label: "What this means for Atlanta businesses in 2026" },
  { id: "faq", label: "Frequently asked questions" },
];

const STATS = [
  { number: "$2K–$5K", label: "Typical Atlanta small business site", sub: "for a custom design and build in 2026" },
  { number: "75%", label: "Judge a business by its site", sub: "credibility decided on design alone" },
  { number: "689x", label: "More page visibility", sub: "when we rebuilt one Atlanta site" },
];

const PRICE_TIERS = [
  ["DIY builder (Wix, Squarespace)", "$0–$500 / year", "A template you build and maintain yourself", "Testing an idea"],
  ["Freelancer", "$1,500–$4,000", "One person, a mostly custom brochure site", "A simple site, low complexity"],
  ["Boutique studio", "$3,000–$8,000", "Strategy, custom design, built to convert", "A business that wants the site to earn"],
  ["Large agency", "$15,000–$50,000+", "Big team, long process, enterprise scope", "Funded companies and enterprise"],
];

const DRIVERS = [
  {
    n: "01",
    title: "How many pages and how complex",
    body: "A five-page brochure site is a small job. A site with dozens of service pages, locations, and a blog is a much bigger one. More pages means more design, more copy, and more to build, and that is the first thing that moves a quote.",
  },
  {
    n: "02",
    title: "Custom design or a template",
    body: "A template is cheap because everyone else uses it too. A custom design is built around your brand, your customers, and the exact path you want someone to take. Custom costs more because it is real design work, not a theme you dropped your logo into.",
  },
  {
    n: "03",
    title: "What the site needs to do",
    body: "A page that just shows your hours is one price. Online booking, e-commerce, payment, forms that route to your phone, and integrations with the tools you already use all add real work. Functionality is usually the biggest single reason two quotes look nothing alike.",
  },
  {
    n: "04",
    title: "Whether it is built to be found",
    body: "This is the one most cheap sites skip. A site with no SEO or GEO foundation is invisible the day it launches. Building it so Google and AI search can actually find you is not a bolt-on. It is baked into how the site is structured, and it is the difference between a site that sits there and one that brings in calls.",
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
            {" · "}Website Pricing
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
            How Much Does a Website Cost in Atlanta?
          </h1>

          <p style={{ fontSize: 18, lineHeight: 1.65, color: "rgba(255,244,227,0.82)", marginBottom: 36, maxWidth: 600 }}>
            Most Atlanta small business websites run $2,000 to $5,000. But the price on the invoice is the wrong thing to worry about. The real question is whether the site pays you back or just sits there looking nice.
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
                fontSize: "clamp(28px, 4.5vw, 44px)",
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

        {/* ── SECTION 1: The real answer ── */}
        <section id="the-real-answer" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 20, lineHeight: 1.2 }}>
            The real answer, up front
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            A roofer in Marietta got three quotes for the same website. Five hundred dollars. Three thousand. Fifteen thousand. Same five pages, roughly the same look. He had no way to tell what the difference was, so he picked the cheapest one. A year later he was paying someone else to rebuild it, which meant he paid for the website twice.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            So here is the straight answer before anything else. In Atlanta in 2026, a professional small business website usually costs between $2,000 and $5,000 for a custom design and build. DIY builders run $0 to $500 a year. Freelancers land around $1,500 to $4,000. Full agencies start near $5,000 and climb past $25,000 for complex work.
          </p>

          {/* The short version info box */}
          <div style={{ background: "rgba(144,66,44,0.08)", border: "1px solid rgba(144,66,44,0.2)", borderRadius: 12, padding: "24px 28px", margin: "8px 0 32px" }}>
            <p style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: 13, fontWeight: 700, color: "#90422C", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>The short version</p>
            <p style={{ fontSize: 16, lineHeight: 1.7, margin: 0 }}>
              A small business website in Atlanta typically costs $2,000 to $5,000. The price moves based on how many pages you need, whether the design is custom, what the site has to do, and whether it is built to actually be found. The real cost is not the invoice. It is what a bad site quietly loses you every month it is live.
            </p>
          </div>

          <p style={{ fontSize: 17, lineHeight: 1.75 }}>
            That gap between what a site costs and what a bad one loses you is a revenue leak. Most Atlanta businesses have one, and it usually starts with buying on price instead of buying on what the site is supposed to do: bring in calls.
          </p>
        </section>

        {/* ── SECTION 2: Price ranges + table ── */}
        <section id="price-ranges" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 20, lineHeight: 1.2 }}>
            What a website actually costs in Atlanta
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 28 }}>
            There is no single price because there is no single kind of website. Here is how the four real options break down for an Atlanta small business, from cheapest to most expensive, and who each one is actually right for.
          </p>

          <div style={{ overflowX: "auto", marginBottom: 32 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "#3B2114" }}>
                  {["Option", "Typical Atlanta cost", "What you get", "Best for"].map((h) => (
                    <th key={h} style={{ padding: "12px 14px", textAlign: "left", color: "#FFF4E3", fontFamily: "'Neue Montreal', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PRICE_TIERS.map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "rgba(59,33,20,0.04)" : "transparent" }}>
                    {row.map((cell, j) => (
                      <td key={j} style={{
                        padding: "12px 14px",
                        borderBottom: "1px solid rgba(59,33,20,0.08)",
                        color: j === 1 ? "#90422C" : "#3B2114",
                        fontWeight: j === 1 ? 700 : 400,
                        fontFamily: j === 1 ? "'Neue Montreal', sans-serif" : "inherit",
                        lineHeight: 1.5,
                      }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pull quote */}
          <blockquote style={{
            margin: "0 0 8px",
            padding: "24px 28px",
            borderLeft: "4px solid #EA9A61",
            background: "rgba(234,154,97,0.08)",
            borderRadius: "0 8px 8px 0",
          }}>
            <p style={{ fontFamily: "Norwige, sans-serif", fontSize: 22, lineHeight: 1.5, color: "#3B2114", margin: 0, fontStyle: "italic" }}>
              &ldquo;The cheapest website is almost never the cheapest website. It is the one you end up paying for twice.&rdquo;
            </p>
          </blockquote>
        </section>

        {/* ── IMAGE 1 ── */}
        <div style={{ margin: "0 -24px 56px", position: "relative", height: "clamp(240px, 40vw, 440px)", overflow: "hidden" }}>
          <Image src="/heroassets/webfolder3.webp" alt="Homepage of TheBando, an Atlanta restaurant website ROV designed and built" fill style={{ objectFit: "cover", objectPosition: "top" }} />
          <div style={{ position: "absolute", bottom: 16, left: 24, background: "rgba(59,33,20,0.75)", color: "#FFF4E3", fontSize: 12, padding: "6px 12px", borderRadius: 6, backdropFilter: "blur(4px)" }}>
            A site ROV built for an Atlanta restaurant. This is what the mid-range build actually buys: custom design and a clear path to order.
          </div>
        </div>

        {/* ── SECTION 3: What drives cost ── */}
        <section id="what-drives-cost" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 12, lineHeight: 1.2 }}>
            What drives the price up or down
          </h2>
          <p style={{ fontSize: 15, color: "#B16937", marginBottom: 36, fontFamily: "'Neue Montreal', sans-serif" }}>
            Four things decide where your quote lands. Knowing them is how you tell a fair price from a bad one.
          </p>

          {DRIVERS.map((item) => (
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
            When you understand these four, you can read a quote instead of guessing. A higher price is fair when it buys custom design, real functionality, and a site built to be found. It is not fair when it buys a template with a markup. All four are standard in our <Link href="/web" style={{ color: "#90422C", textDecoration: "underline" }}>web design process</Link>.
          </p>
        </section>

        {/* ── IMAGE 2 ── */}
        <div style={{ margin: "0 -24px 56px", position: "relative", height: "clamp(240px, 35vw, 400px)", overflow: "hidden" }}>
          <Image src="/heroassets/codingframe.webp" alt="An ROV website being built in a code editor, showing custom development rather than a drag-and-drop template" fill style={{ objectFit: "cover" }} />
          <div style={{ position: "absolute", bottom: 16, left: 24, background: "rgba(59,33,20,0.75)", color: "#FFF4E3", fontSize: 12, padding: "6px 12px", borderRadius: 6, backdropFilter: "blur(4px)" }}>
            A custom build is real engineering, not a theme you drop a logo into. That is most of what separates a $500 site from a $5,000 one.
          </div>
        </div>

        {/* ── SECTION 4: What a cheap website costs you ── */}
        <section id="cheap-website-cost" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 20, lineHeight: 1.2 }}>
            What a cheap website really costs you
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            A cheap website is not free. It just moves the cost somewhere you cannot see on an invoice. It shows up as the customer who found you, felt unsure, and called the competitor instead. First impressions are almost entirely visual, and people decide fast.
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
            }}>75%</div>
            <div>
              <p style={{ color: "#FFF4E3", fontSize: 16, lineHeight: 1.6, margin: 0 }}>
                of people judge a business&apos;s credibility on its website design. A site that looks cheap loses trust before the phone ever rings, no matter how good you are at the actual work.
              </p>
              <p style={{ color: "rgba(255,244,227,0.8)", fontSize: 12, marginTop: 8, marginBottom: 0 }}>Source: <a href="https://credibility.stanford.edu" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,244,227,0.8)" }}>Stanford Web Credibility Research</a></p>
            </div>
          </div>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            The flip side is what a site does when it is built right. <a href="https://www.thebandoatl.com" target="_blank" rel="noopener noreferrer" style={{ color: "#90422C", textDecoration: "underline", fontWeight: 600 }}>TheBando</a> is an Atlanta restaurant whose ordering page was buried where nobody found it. In six months, 132 people found it. Not a day. Total. We did not run a single ad. We rebuilt the path from &ldquo;I want this&rdquo; to &ldquo;I ordered it.&rdquo; Here is what changed in the 139 days after launch, from <Link href="/casestudy/bando" style={{ color: "#90422C", textDecoration: "underline" }}>their analytics</Link>.
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
            That is the whole point of paying for a real build. The site was not more expensive because it looked fancier. It was worth more because it converted. Read the <Link href="/casestudy/bando" style={{ color: "#90422C", textDecoration: "underline", fontWeight: 600 }}>full TheBando case study</Link> for every decision behind the numbers.
          </p>
        </section>

        {/* ── SECTION 5: How ROV prices ── */}
        <section id="how-rov-prices" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 20, lineHeight: 1.2 }}>
            How ROV prices a website
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            We do not quote a website until we know what it is supposed to fix. Every ROV engagement starts with a free 15-minute audit. We look at where you are losing money now: your visibility, your current site, the path a customer takes from finding you to paying you. Then we scope a build to that, not to a template price list.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            Sometimes the honest answer is that you do not need a full rebuild. Sometimes a few fixes and a better path do most of the work. We would rather tell you that than sell you a number. When a full build is the right call, we price it to the project and to the leak it is fixing: built to convert, not built to look expensive.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75 }}>
            A website is also not the only lever. Once the site converts, <Link href="/ai-automation" style={{ color: "#90422C", textDecoration: "underline" }}>AI automations for Atlanta businesses</Link> keep the leads from leaking after the click: missed call text-back, review requests after every job, follow-up that runs without you. That is how <Link href="/web" style={{ color: "#90422C", textDecoration: "underline" }}>a website that works</Link> turns into a system that works.
          </p>
        </section>

        {/* ── IMAGE 3 ── */}
        <div style={{ margin: "0 -24px 56px", position: "relative", height: "clamp(240px, 35vw, 400px)", overflow: "hidden" }}>
          <Image src="/casestudy/atm/atm1.webp" alt="Atlanta small business owners and professionals gathered in a modern coworking space" fill style={{ objectFit: "cover" }} />
          <div style={{ position: "absolute", bottom: 16, left: 24, background: "rgba(59,33,20,0.75)", color: "#FFF4E3", fontSize: 12, padding: "6px 12px", borderRadius: 6, backdropFilter: "blur(4px)" }}>
            Atlanta runs on small businesses. The ones that win the search are not always the best at the trade. They are the easiest to find and trust.
          </div>
        </div>

        {/* ── SECTION 6: What this means ── */}
        <section id="what-this-means" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 20, lineHeight: 1.2 }}>
            What this means for Atlanta businesses in 2026
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            There is a new trap this year. AI tools now promise a free website in an afternoon, and plenty of Atlanta owners are trying it. The problem is not that the site looks bad. It often looks fine. The problem is that a site nobody can find is the most expensive site there is, because it costs you every customer who searched and never saw you.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 28 }}>
            Search itself is changing too. People in Buckhead, Grant Park, the Westside, and Marietta are not only typing into Google. They are asking <a href="https://www.perplexity.ai" target="_blank" rel="noopener noreferrer" style={{ color: "#90422C", textDecoration: "underline" }}>Perplexity</a> and <a href="https://chat.openai.com" target="_blank" rel="noopener noreferrer" style={{ color: "#90422C", textDecoration: "underline" }}>ChatGPT Search</a> full questions like &ldquo;who is a good HVAC company near me.&rdquo; Getting picked by those answers is called GEO, and cheap template sites are invisible to it. Paying for a site built the right way is now paying for a site that both Google and AI search can actually find.
          </p>

          <div style={{ background: "rgba(144,66,44,0.08)", border: "1px solid rgba(144,66,44,0.2)", borderRadius: 12, padding: "24px 28px" }}>
            <p style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: 13, fontWeight: 700, color: "#90422C", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>The short version</p>
            <p style={{ fontSize: 16, lineHeight: 1.7, margin: 0 }}>
              Budget $2,000 to $5,000 for a real small business website in Atlanta. Do not buy on price alone. Buy the site that is built to be found and built to convert, because that is the one that pays for itself. The cheapest option is usually the one that costs you the most in lost calls.
            </p>
          </div>
        </section>

        {/* ── RELATED READING ── */}
        <section style={{ marginBottom: 64, padding: "32px 0", borderTop: "1px solid rgba(59,33,20,0.12)", borderBottom: "1px solid rgba(59,33,20,0.12)" }}>
          <p style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B16937", marginBottom: 20 }}>Related reading</p>
          <div style={{ display: "grid", gap: 16 }}>
            {[
              { href: "/casestudy/bando", label: "Full TheBando case study", desc: "How we took a buried ordering page to 91,060 views with no ad spend. Every decision, every number." },
              { href: "/web", label: "ROV Studios web design services", desc: "How we build Atlanta websites Google trusts and customers convert on. Process, timeline, what you get." },
              { href: "/web/why-isnt-my-business-showing-up-on-google", label: "Why isn't my business showing up on Google?", desc: "The six reasons Atlanta businesses stay invisible, and how to fix each one." },
              { href: "/web/real-estate-agent-website-atlanta", label: "Real estate agent websites in Atlanta", desc: "Why agents lose deals after the lead comes in, and the system that fixes it." },
              { href: "/ai-automation", label: "AI automations for Atlanta businesses", desc: "Missed call text-back, automatic review requests, follow-up that runs itself after the site converts." },
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
              <a href="https://credibility.stanford.edu" target="_blank" rel="noopener noreferrer" style={{ color: "#90422C", textDecoration: "underline" }}>Stanford Web Credibility Research</a> · 75% judge credibility on website design
            </li>
            <li style={{ fontSize: 14, lineHeight: 1.5, color: "rgba(59,33,20,0.7)" }}>
              <a href="https://www.forbes.com/advisor/business/how-much-does-website-cost/" target="_blank" rel="noopener noreferrer" style={{ color: "#90422C", textDecoration: "underline" }}>Forbes Advisor</a> · small business website cost ranges by build type
            </li>
            <li style={{ fontSize: 14, lineHeight: 1.5, color: "rgba(59,33,20,0.7)" }}>
              <a href="https://www.thinkwithgoogle.com" target="_blank" rel="noopener noreferrer" style={{ color: "#90422C", textDecoration: "underline" }}>Think with Google</a> · local and mobile search behavior
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
            Want to know what your website should actually cost?
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: "rgba(59,33,20,0.7)", marginBottom: 32, maxWidth: 480, margin: "0 auto 32px" }}>
            We run free audits for Atlanta businesses. We look at your current site, your visibility, and where you are losing customers. Then we tell you what to fix and what it should cost, whether that is a few changes or a full rebuild.
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
