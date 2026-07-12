"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { BlogFAQ } from "@/components/blog/BlogFAQ";

const NavigationDock = dynamic(
  () => import("@/components/sections/NavDoc").then((mod) => ({ default: mod.NavigationDock })),
  { ssr: false }
);
const Footer = dynamic(() => import("@/components/sections/Footer"), { ssr: false });


const TOC = [
  { id: "the-challenge", label: "A website that undermined credibility" },
  { id: "the-solution", label: "The solution: a ground-up rebuild" },
  { id: "what-we-rebuilt", label: "What we rebuilt" },
  { id: "the-results", label: "A digital HQ that matches the work" },
  { id: "what-this-means", label: "What this means for services companies" },
  { id: "faq", label: "Frequently asked questions" },
];

const STATS = [
  { number: "4", label: "Global markets served", sub: "India, Australia, US, Dubai" },
  { number: "10.5hr", label: "Atlanta↔India gap", sub: "Turned into a feature, not a bug" },
  { number: "100%", label: "Rebuilt from scratch", sub: "Brand identity and website" },
];

const FAQS = [
  {
    q: "What does a website redesign process look like?",
    a: "Our website redesign process starts with discovery, understanding your business, audience, and goals. From there, we move into brand identity work, wireframing, visual design, development, and launch. For DKM Corp, the entire process was collaborative, with Dheeraj involved at every decision point. We do not disappear for 6 weeks and come back with a finished product. You see the work as it develops and shape it with us.",
  },
  {
    q: "How long does a website redesign take?",
    a: "Most of our website redesign projects run 6 to 12 weeks from kickoff to launch. The DKM Corp project included brand identity work alongside the website build, which added scope. Timeline depends on how many pages you need, whether brand identity design is included, and how quickly feedback cycles move. Cross-time-zone projects like this one require a bit more buffer for asynchronous reviews.",
  },
  {
    q: "What should I look for in a web design agency?",
    a: "Look at their actual work, not their sales pitch. Ask how they handle collaboration and feedback. Find out if they build sites you can manage yourself or if you will need them for every small update. At ROV Studios, an Atlanta web design agency, we prioritize giving clients ownership of their site after launch. A good agency builds something that works for you long after the project ends.",
  },
  {
    q: "What is a collaborative design approach?",
    a: "A collaborative design approach means the client is a partner in the process, not a spectator. For DKM Corp, that meant Dheeraj reviewed wireframes, gave feedback on visual directions, and shaped the messaging at every stage. ROV Studios brings the web design and development expertise. You bring the knowledge of your business and customers. The best results come from combining both. DKM Corp's project proved this model works even across a 10.5-hour time difference between Atlanta and India, with asynchronous feedback, annotated mockups, and recorded design walkthroughs keeping the project moving without sacrificing quality.",
  },
];

export default function DkmCorpBrandIdentityPage() {
  return (
    <main style={{ fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: "#FFF4E3", color: "#3B2114" }}>

      {/* ── HERO ── */}
      <section style={{
        background: "linear-gradient(160deg, #3B2114 0%, #603E25 55%, #90422C 100%)",
        padding: "80px 24px 64px",
        color: "#FFF4E3",
      }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>

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
            {" · "}Global Brand Identity
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
            Building a Global Brand Identity: DKM Corp Website Redesign Case Study
          </h1>

          <p style={{ fontSize: 18, lineHeight: 1.65, color: "rgba(255,244,227,0.82)", marginBottom: 36, maxWidth: 600 }}>
            Dheeraj Kumar Miryala was doing serious work across four countries, but his website did not show it. We rebuilt <a href="https://dkmcorp.in" target="_blank" rel="noopener noreferrer" style={{ color: "#EA9A61", textDecoration: "underline" }}>dkmcorp.in</a> from scratch, brand identity and all, as a cross-continental collaboration between our Atlanta studio and Dheeraj in India. This is how it came together across a 10.5-hour gap.
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
                <Image src="/teammembers/basutm2.webp" alt="Ayush Basu" fill sizes="32px" style={{ objectFit: "cover" }} />
              </div>
              Ayush Basu · Founder &amp; Creative Director, <Link href="/about" style={{ color: "#90422C", textDecoration: "underline" }}>ROV Studios</Link>
            </div>
            <div style={{ color: "rgba(255,244,227,0.45)", fontSize: 13 }}>March 2026 · 5 min read</div>
          </div>
        </div>
      </section>

      {/* ── STATS ROW ── */}
      <section style={{ background: "#3B2114", padding: "0 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 1, borderTop: "1px solid rgba(255,244,227,0.08)" }}>
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
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* Table of Contents */}
        <nav style={{
          background: "rgba(144,66,44,0.07)",
          border: "1.5px solid rgba(144,66,44,0.25)",
          borderRadius: 12,
          padding: "24px 28px",
          marginBottom: 56,
        }}>
          <p style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "#90422C", fontWeight: 700, marginBottom: 16 }}>
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

        {/* ── INTRO ── */}
        <section style={{ marginBottom: 56 }}>
          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            Dheeraj Kumar Miryala founded DKM Corp with a clear vision, but the website in front of it did not match. We rebuilt <a href="https://dkmcorp.in" target="_blank" rel="noopener noreferrer" style={{ color: "#90422C", textDecoration: "underline", fontWeight: 600 }}>dkmcorp.in</a> from scratch, a collaborative website redesign and brand identity project between our Atlanta studio and Dheeraj in India.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75 }}>
            <Link href="/web" style={{ color: "#90422C", textDecoration: "underline", fontWeight: 600 }}>ROV Studios</Link>, an Atlanta web design agency, partnered with DKM Corp to deliver a full digital transformation for a professional services company operating across India, Australia, the US, and Dubai. The ground-up rebuild covered brand identity development, responsive website design, clear messaging architecture, and professional credibility signals. DKM Corp now has a digital headquarters that represents the quality and global reach of their services.
          </p>
        </section>

        {/* ── IMAGE 1 (only image) ── */}
        <div style={{ margin: "0 -24px 56px", position: "relative", height: "clamp(240px, 40vw, 440px)", overflow: "hidden" }}>
          <Image src="/casestudy/dubaiskyline.webp" alt="DKM Corp operates across global markets including Dubai, India, Australia, and the United States" fill sizes="(max-width: 768px) 100vw, 720px" style={{ objectFit: "cover" }} />
          <div style={{ position: "absolute", bottom: 16, left: 24, background: "rgba(59,33,20,0.75)", color: "#FFF4E3", fontSize: 12, padding: "6px 12px", borderRadius: 6, backdropFilter: "blur(4px)" }}>
            DKM Corp operates across four global markets: India, Australia, the US, and Dubai.
          </div>
        </div>

        {/* ── SECTION 1: The Challenge ── */}
        <section id="the-challenge" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 20, lineHeight: 1.2 }}>
            A professional services website that undermined credibility
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            Dheeraj built DKM Corp with a clear sense of what the business stood for, but the web presence did not reflect it. The site looked dated, lacked a cohesive brand identity, and did not communicate what DKM Corp actually did or why someone should work with them.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            This is a common problem for professional services companies. The founder is busy doing the actual work, and the website becomes an afterthought. It gets built once, maybe updated a few times, and then sits there slowly becoming less relevant. Meanwhile, potential clients visit, form an impression in about three seconds, and bounce if that impression does not hold up.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75 }}>
            DKM Corp also had a logistical challenge. Dheeraj is based in India, and we operate out of Atlanta. The project needed a process that worked across a 10.5-hour time difference without sacrificing the collaborative back-and-forth that good design requires.
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
              &ldquo;Great work does not require everyone to be in the same room.&rdquo;
            </p>
          </blockquote>
        </section>

        {/* ── SECTION 2: The Solution ── */}
        <section id="the-solution" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 12, lineHeight: 1.2 }}>
            The solution: a ground-up rebuild
          </h2>
          <p style={{ fontSize: 15, color: "#B16937", marginBottom: 36, fontFamily: "'Neue Montreal', sans-serif" }}>
            Five moves. One brand identity system. No facelift. Built across two continents.
          </p>

          {[
            {
              n: "01",
              title: "Discovery across time zones",
              body: "We started with deep discovery sessions to understand DKM Corp's business, audience, and competitive landscape. Working across Atlanta and India meant we had to be disciplined about communication. We used asynchronous design reviews, detailed annotated mockups, recorded walkthroughs, and structured feedback documents so progress never stalled waiting for a time zone to wake up.",
            },
            {
              n: "02",
              title: "Brand identity from first principles",
              body: "We did not just pick colors and fonts. We worked with Dheeraj to articulate what DKM Corp stands for, who their ideal client is, and what feeling the brand should evoke. From there we built a visual system: logo refinement, color palette, typography, and graphic language that extends beyond the website to presentations, documents, and social media. A brand is not a logo. It is a system, and we built the system.",
            },
            {
              n: "03",
              title: "Modern responsive website design",
              body: "The rebuilt dkmcorp.in is fully responsive and designed for how people actually browse in 2026. Over 60% of global web traffic now comes from mobile devices. We designed mobile-first, then expanded for larger screens. Every page, every section, every call to action works on a phone screen without compromise.",
            },
            {
              n: "04",
              title: "Clear messaging architecture",
              body: "Professional services sites often fall into the trap of saying everything and communicating nothing. We worked with Dheeraj to strip the messaging down to what matters: what DKM Corp does, who they do it for, and what makes working with them different. Each page has a purpose. Each section moves the visitor toward contact or inquiry.",
            },
            {
              n: "05",
              title: "Professional credibility signals",
              body: "For a services company, the website is often the first real interaction a potential client has with the brand. We built in the trust signals that matter: clear service descriptions, professional photography direction, consistent visual quality, and a web design standard that communicates competence before anyone reads a word.",
            },
          ].map((item) => (
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

          {/* Dark stat callout 1 */}
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
              fontSize: "clamp(40px, 10vw, 56px)",
              background: "linear-gradient(135deg, #EA9A61, #90422C)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              lineHeight: 1,
            }}>50ms</div>
            <div>
              <p style={{ color: "#FFF4E3", fontSize: 16, lineHeight: 1.6, margin: 0 }}>
                First impressions on a website happen in under 50 milliseconds. For a services company, the design has to earn trust immediately, before anyone reads a single word.
              </p>
              <p style={{ color: "rgba(255,244,227,0.8)", fontSize: 12, marginTop: 8, marginBottom: 0 }}>Source: research on first-impression formation</p>
            </div>
          </div>

          {/* Dark stat callout 2 */}
          <div style={{
            background: "#3B2114",
            borderRadius: 12,
            padding: "28px 32px",
            margin: "32px 0 0",
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: "24px",
            alignItems: "center",
          }}>
            <div style={{
              fontFamily: "Norwige, sans-serif",
              fontSize: "clamp(40px, 10vw, 56px)",
              background: "linear-gradient(135deg, #EA9A61, #90422C)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              lineHeight: 1,
            }}>60%</div>
            <div>
              <p style={{ color: "#FFF4E3", fontSize: 16, lineHeight: 1.6, margin: 0 }}>
                Over 60% of global web traffic now comes from mobile devices. That is why we designed dkmcorp.in mobile-first, then expanded for larger screens, not the other way around.
              </p>
              <p style={{ color: "rgba(255,244,227,0.8)", fontSize: 12, marginTop: 8, marginBottom: 0 }}>Source: global web traffic data</p>
            </div>
          </div>
        </section>

        {/* ── SECTION 3: What We Rebuilt (table) ── */}
        <section id="what-we-rebuilt" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 12, lineHeight: 1.2 }}>
            What we rebuilt
          </h2>
          <p style={{ fontSize: 15, color: "#B16937", marginBottom: 32, fontFamily: "'Neue Montreal', sans-serif" }}>
            Four pillars, built to work together from the first line of the brief.
          </p>

          <div style={{ overflowX: "auto", marginBottom: 32 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
              <thead>
                <tr style={{ background: "#3B2114" }}>
                  {["Deliverable", "What it does"].map((h) => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#FFF4E3", fontFamily: "'Neue Montreal', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Brand identity system", "Logo, color palette, typography, and graphic language that extend from the site to presentations, documents, and social."],
                  ["Responsive website", "A mobile-first build where every page and CTA works on a phone screen, then expands cleanly for larger displays."],
                  ["Messaging architecture", "Copy stripped down to what DKM Corp does, who they do it for, and what makes working with them different."],
                  ["Credibility signals", "Clear service descriptions, photography direction, and consistent visual quality that communicate competence on sight."],
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
            A brand identity system outlasts any single design. Trends in web design shift every two to three years, but a strong system adapts without a full overhaul. That is the difference between a website that gets you through the year and one that carries the brand for the long run.
          </p>
        </section>

        {/* ── SECTION 4: The Results ── */}
        <section id="the-results" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 20, lineHeight: 1.2 }}>
            A digital headquarters that matches the work
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            This project was about building a professional foundation, not chasing a single metric. DKM Corp went from an outdated site that undermined credibility to a modern, cohesive web presence that accurately represents the quality of their work.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            The redesigned <a href="https://dkmcorp.in" target="_blank" rel="noopener noreferrer" style={{ color: "#90422C", textDecoration: "underline", fontWeight: 600 }}>dkmcorp.in</a> gives Dheeraj a digital headquarters he can point clients to with confidence. The brand identity system we built extends to every touchpoint. When DKM Corp sends a proposal, shares a presentation, or posts on social media, the visual identity is consistent and polished.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75 }}>
            The cross-continental collaboration proved something we believe strongly at <Link href="/web" style={{ color: "#90422C", textDecoration: "underline" }}>ROV Studios</Link>. With the right process, a team in Atlanta and a founder in India can build something together that neither could have built alone. Read the full <Link href="/casestudy/dkm" style={{ color: "#90422C", textDecoration: "underline", fontWeight: 600 }}>DKM Corp website redesign and brand identity case study</Link> for every decision behind it.
          </p>
        </section>

        {/* ── SECTION 5: What This Means ── */}
        <section id="what-this-means" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 20, lineHeight: 1.2 }}>
            What this means for professional services companies
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            Your website is your first handshake. For professional services companies, it sets the tone for every client relationship that follows. When the site looks like it was built in 2018, potential clients assume the work product is similarly outdated. A redesign that matches the quality of the actual services closes that gap.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 28 }}>
            Time zones can be a feature instead of a bug. The Atlanta-India collaboration worked because we built the process around asynchronous communication. Structured feedback, annotated mockups, and recorded walkthroughs kept the project moving 24 hours a day instead of waiting for scheduled calls.
          </p>

          <div style={{ background: "rgba(144,66,44,0.08)", border: "1px solid rgba(144,66,44,0.2)", borderRadius: 12, padding: "24px 28px" }}>
            <p style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: 13, fontWeight: 700, color: "#90422C", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>The short version</p>
            <p style={{ fontSize: 16, lineHeight: 1.7, margin: 0 }}>
              DKM Corp had a business worth taking seriously and a website that got in the way. We rebuilt both the brand identity and the site from scratch, across a 10.5-hour gap between Atlanta and India, for a company serving four global markets. The result is not a headline metric. It is a digital headquarters that finally matches the work, and a brand system that keeps working long after launch.
            </p>
          </div>
        </section>

        {/* ── RELATED READING ── */}
        <section style={{ marginBottom: 64, padding: "32px 0", borderTop: "1px solid rgba(59,33,20,0.12)", borderBottom: "1px solid rgba(59,33,20,0.12)" }}>
          <p style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B16937", marginBottom: 20 }}>Related reading</p>
          <div style={{ display: "grid", gap: 16 }}>
            {[
              { href: "/casestudy/dkm", label: "Full DKM Corp case study", desc: "The complete website redesign and brand identity build, every decision and every change." },
              { href: "/web", label: "ROV Studios web design services", desc: "How we build brand identity systems and responsive websites. Pricing, timeline, and process." },
              { href: "/about", label: "About ROV Studios", desc: "The Atlanta studio behind the work, and how we collaborate across time zones." },
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
      <BlogFAQ faqs={FAQS.map((f) => ({ question: f.q, answer: f.a }))} />

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px 80px" }}>

        {/* ── AUTHOR ── */}
        <section style={{ marginBottom: 64, padding: "28px 32px", background: "#3B2114", borderRadius: 16, color: "#FFF4E3" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div style={{ position: "relative", width: 64, height: 64, borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "2px solid rgba(234,154,97,0.4)" }}>
              <Image src="/teammembers/basutm2.webp" alt="Ayush Basu, Founder and Creative Director ROV Studios" fill sizes="64px" style={{ objectFit: "cover" }} />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 2, color: "#FFF4E3" }}>Ayush Basu</p>
              <p style={{ color: "#EA9A61", fontSize: 13, margin: 0, fontFamily: "'Neue Montreal', sans-serif" }}>
                Founder &amp; Creative Director, <Link href="/about" style={{ color: "#EA9A61" }}>ROV Studios</Link>
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,244,227,0.1)" }}>
            <span style={{ display: "inline-block", width: 24, height: 2, background: "#EA9A61", flexShrink: 0 }} />
            <p style={{ fontSize: 12, color: "#FFF4E3", margin: 0, fontFamily: "'Neue Montreal', sans-serif" }}>
              Last updated &nbsp; March 30, 2026
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
            Does your website match the caliber of your work?
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: "rgba(59,33,20,0.7)", marginBottom: 32, maxWidth: 480, margin: "0 auto 32px" }}>
            We run free audits for professional services companies. We look at your brand, your messaging, and your site, then show you exactly what is holding your first impression back.
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
