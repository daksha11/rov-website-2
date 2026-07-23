"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { BlogFAQ } from "@/components/blog/BlogFAQ";
import BlogLeadForm from "@/components/blog/BlogLeadForm";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { FAQPageSchema } from "@/components/schema/FAQPageSchema";

const NavigationDock = dynamic(
  () => import("@/components/sections/NavDoc").then((mod) => ({ default: mod.NavigationDock })),
  { ssr: false }
);
const Footer = dynamic(() => import("@/components/sections/Footer"), { ssr: false });

const TOC = [
  { id: "the-real-question", label: "The real question" },
  { id: "freelancer", label: "When a freelancer is right" },
  { id: "agency", label: "When an agency makes sense" },
  { id: "studio", label: "When a creative studio wins" },
  { id: "comparison", label: "Side by side" },
  { id: "how-to-decide", label: "How to decide" },
  { id: "faq", label: "Frequently asked questions" },
];

const STATS = [
  { number: "3", label: "Ways to get it made", sub: "freelancer · agency · studio" },
  { number: "0", label: "Handoffs in a studio", sub: "one team, start to finish" },
  { number: "689x", label: "What one team delivered", sub: "TheBando online ordering" },
];

const COMPARE_ROWS = [
  ["Cost", "$", "$$$", "$$"],
  ["Speed", "Fast, if available", "Slower, more layers", "Fast, coordinated"],
  ["Range", "One craft", "Broad, outsourced", "Broad, in-house"],
  ["Consistency", "Single voice", "Varies by vendor", "One voice, end to end"],
  ["Accountability", "One person", "Account manager", "The makers themselves"],
  ["Best for", "One clear deliverable", "Large ongoing campaigns", "Brand + web + content as one"],
];

const DECISION = [
  {
    n: "01",
    title: "Start with the shape of the work",
    body: "Is this one contained thing, or several things that have to match? A single logo is a freelancer job. A brand, a website, and a launch film that all need to feel like one company is a studio job. The number of disciplines involved is the clearest signal of which way to go.",
  },
  {
    n: "02",
    title: "Count the handoffs you are willing to manage",
    body: "Every vendor you add is a relationship you have to run. Three freelancers means you are the creative director, the project manager, and the person making sure the logo matches the site. A studio absorbs that coordination. If you do not want a second job, that is worth real money.",
  },
  {
    n: "03",
    title: "Be honest about budget and stakes",
    body: "If the work is low-stakes and the budget is tight, a good freelancer is the smart call. If it is the face of your business and it has to convert, under-investing costs more than it saves. A cheap brand that nobody trusts is the most expensive thing you can buy.",
  },
  {
    n: "04",
    title: "Ask who actually does the work",
    body: "With a freelancer, you know. With an agency, ask, because the person in the pitch is often not the person who executes. With a studio, the people you meet are usually the people who build. Match the answer to how much the outcome matters.",
  },
];

const FAQS = [
  {
    q: "What is the difference between a creative studio and an agency?",
    a: "An agency usually coordinates a project and outsources much of the production to freelancers and contractors. A creative studio keeps design, development, and production in-house. With a studio you get fewer handoffs and one team that owns the whole outcome. With an agency you often get more scale but more layers between you and the people doing the work.",
  },
  {
    q: "Is a creative studio cheaper than an agency?",
    a: "Usually, yes. Studios carry less overhead than large agencies, so more of your budget goes into the actual work rather than account managers and office space. A studio is typically more expensive than a single freelancer, but you are paying for range and coordination that one freelancer cannot provide.",
  },
  {
    q: "When should I hire a freelancer instead of a studio?",
    a: "Hire a freelancer when you have one clear, contained deliverable, such as a single logo, one landing page, or one video, and a limited budget. When the project spans multiple disciplines or needs to stay consistent across brand, web, and content, a studio will save you the cost of managing several freelancers yourself.",
  },
  {
    q: "What is best for a small business in Atlanta?",
    a: "For most Atlanta small businesses that need a brand and a website that work together, a creative studio is the best fit. You get senior craft across disciplines without agency-level overhead, and one team accountable for the result. If you truly only need one small thing, a trusted freelancer can work.",
  },
  {
    q: "Does Range of View work with clients outside Atlanta?",
    a: "Yes. Range of View Studios is based in Atlanta and works with clients worldwide across brand, web, video, and creative technology.",
  },
];

const ARTICLE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline:
    "Creative Studio vs. Agency vs. Freelancer: Which Does Your Atlanta Brand Actually Need?",
  description:
    "A clear breakdown of cost, speed, range, and accountability across freelancers, agencies, and creative studios, so Atlanta brands can pick the right one.",
  datePublished: "2026-07-16",
  dateModified: "2026-07-16",
  articleSection: "Creative Direction",
  image: "https://www.rovstudios.com/heroassets/codingframe.webp",
  author: {
    "@type": "Person",
    name: "Ayush Basu",
    jobTitle: "Founder & Creative Director",
    url: "https://www.rovstudios.com/about",
    worksFor: {
      "@type": "Organization",
      name: "Range of View Studios",
      url: "https://www.rovstudios.com",
    },
  },
  publisher: {
    "@type": "Organization",
    name: "Range of View Studios",
    url: "https://www.rovstudios.com",
    logo: {
      "@type": "ImageObject",
      url: "https://www.rovstudios.com/brand/rov-logo.webp",
    },
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://www.rovstudios.com/blog/creative-studio-vs-agency-vs-freelancer",
  },
};

export default function StudioVsAgencyVsFreelancerPage() {
  return (
    <main style={{ fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: "#FFF4E3", color: "#3B2114" }}>

      <BreadcrumbSchema
        items={[
          { name: "Home", url: "" },
          { name: "Blog", url: "/blog" },
          { name: "Creative Studio vs Agency vs Freelancer", url: "/blog/creative-studio-vs-agency-vs-freelancer" },
        ]}
      />
      <FAQPageSchema faqs={FAQS.map((f) => ({ question: f.q, answer: f.a }))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ARTICLE_SCHEMA) }} />

      {/* ── HERO ── */}
      <section style={{
        background: "linear-gradient(160deg, #3B2114 0%, #603E25 55%, #90422C 100%)",
        padding: "80px 24px 64px",
        color: "#FFF4E3",
      }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>

          <div style={{ marginBottom: 32 }}>
            <Link href="/">
              <Image src="/brand/rov-logo.webp" alt="Range of View Studios" width={48} height={48} style={{ objectFit: "contain" }} />
            </Link>
          </div>

          <p style={{ fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,244,227,0.55)", marginBottom: 28, fontFamily: "'Neue Montreal', sans-serif" }}>
            <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>ROV Studios</Link>
            {" · "}
            <Link href="/blog" style={{ color: "inherit", textDecoration: "none" }}>Blog</Link>
            {" · "}Studio vs Agency vs Freelancer
          </p>

          <h1 style={{
            fontFamily: "Norwige, sans-serif",
            fontSize: "clamp(36px, 6vw, 64px)",
            fontWeight: 400,
            lineHeight: 1.1,
            marginBottom: 24,
            color: "#FFFFFF",
          }}>
            Creative Studio vs. Agency vs. Freelancer: Which Does Your Atlanta Brand Actually Need?
          </h1>

          <p style={{ fontSize: 18, lineHeight: 1.65, color: "rgba(255,244,227,0.82)", marginBottom: 36, maxWidth: 600 }}>
            Three ways to get creative work made, and picking wrong is where budgets and timelines go to die. Here is the honest breakdown, from a <Link href="/blog/creative-studios-atlanta" style={{ color: "#EA9A61", textDecoration: "underline" }}>creative studio in Atlanta</Link>.
          </p>

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
              Ayush Basu · Founder, <Link href="/about" style={{ color: "#90422C", textDecoration: "underline" }}>ROV Studios</Link>
            </div>
            <div style={{ color: "rgba(255,244,227,0.45)", fontSize: 13 }}>July 2026 · 8 min read</div>
          </div>
        </div>
      </section>

      {/* ── STATS ROW ── */}
      <section style={{ background: "#3B2114", padding: "0 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 1, borderTop: "1px solid rgba(255,244,227,0.08)" }}>
          {STATS.map((s) => (
            <div key={s.label} style={{ padding: "28px 20px", textAlign: "center" }}>
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

        {/* ── SECTION 1 ── */}
        <section id="the-real-question" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 20, lineHeight: 1.2 }}>
            The real question
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            &ldquo;Freelancer, agency, or studio&rdquo; sounds like a budget question. It is really a coordination question. The moment your project touches more than one discipline, someone has to make sure the pieces fit. The only real decision is who that someone is: you, an account manager, or the team that actually makes the work.
          </p>

          <blockquote style={{
            margin: "32px 0",
            padding: "24px 28px",
            borderLeft: "4px solid #EA9A61",
            background: "rgba(234,154,97,0.08)",
            borderRadius: "0 8px 8px 0",
          }}>
            <p style={{ fontFamily: "Norwige, sans-serif", fontSize: 22, lineHeight: 1.5, color: "#3B2114", margin: 0, fontStyle: "italic" }}>
              &ldquo;The cheapest option on paper is often the most expensive one in practice, because you become the project manager you did not budget for.&rdquo;
            </p>
          </blockquote>

          <p style={{ fontSize: 17, lineHeight: 1.75 }}>
            Each of the three is genuinely the right answer sometimes. Here is when.
          </p>
        </section>

        {/* ── SECTION 2 ── */}
        <section id="freelancer" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 20, lineHeight: 1.2 }}>
            When a freelancer is right
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            A freelancer is one person doing one craft well. Hire one when the job is contained and clear: a single logo, one landing page, a set of photos, one edit. You get direct access to the maker, a low price, and speed, as long as they are free when you need them.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75 }}>
            The limits show up the moment the work spreads. A freelancer logo designer does not build your site. A freelance developer does not name your company or cut your video. String enough freelancers together and you have quietly become an agency of one, with all the coordination and none of the tools.
          </p>
        </section>

        {/* ── SECTION 3 ── */}
        <section id="agency" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 20, lineHeight: 1.2 }}>
            When an agency makes sense
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            An agency brings scale and process. For a large, ongoing campaign with media buying, multiple markets, and a budget to match, the layers earn their keep. Account managers, strategists, and a bench of specialists exist to run a lot of moving parts at once.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75 }}>
            The trade-off is distance and cost. Much of the production is often outsourced, so the people in the pitch are not always the people doing the work, and a good chunk of the budget goes to overhead rather than craft. For a founder or a small business, that scale is usually more machine than the job needs.
          </p>
        </section>

        {/* ── IMAGE ── */}
        <div style={{ margin: "0 -24px 56px", position: "relative", height: "clamp(240px, 35vw, 400px)", overflow: "hidden" }}>
          <Image src="/heroassets/codingframe.webp" alt="A creative studio team designing and building in one place" fill sizes="(max-width: 768px) 100vw, 720px" style={{ objectFit: "cover" }} />
          <div style={{ position: "absolute", bottom: 16, left: 24, background: "rgba(59,33,20,0.75)", color: "#FFF4E3", fontSize: 12, padding: "6px 12px", borderRadius: 6, backdropFilter: "blur(4px)" }}>
            In a studio, the people who plan the work are the people who make it.
          </div>
        </div>

        {/* ── SECTION 4 ── */}
        <section id="studio" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 20, lineHeight: 1.2 }}>
            When a creative studio wins
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            A creative studio is the middle path that removes the seams. It keeps several disciplines in-house, so brand, web, video, and creative tech come from one team in one voice. You get senior craft across the board without agency overhead, and the people you meet are the people who build.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 28 }}>
            This is the right call when the work has to hang together. When we rebuilt <Link href="/blog/restaurant-atlanta" style={{ color: "#90422C", textDecoration: "underline", fontWeight: 600 }}>TheBando&apos;s website</Link>, the same team handled the strategy, the design, and the build. Online ordering went from 132 views in six months to 91,060 in 139 days. No handoffs, no drift, one accountable team.
          </p>

          <div style={{
            background: "#3B2114",
            borderRadius: 12,
            padding: "28px 32px",
            margin: "0 0 8px",
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
            }}>689x</div>
            <div>
              <p style={{ color: "#FFF4E3", fontSize: 16, lineHeight: 1.6, margin: 0 }}>
                more online ordering views after one team owned the whole redesign end to end. Range across disciplines is not a nicety. It is what moves the number.
              </p>
              <p style={{ color: "rgba(255,244,227,0.8)", fontSize: 12, marginTop: 8, marginBottom: 0 }}>Source: <Link href="/casestudy/bando" style={{ color: "rgba(255,244,227,0.8)" }}>TheBando case study</Link></p>
            </div>
          </div>
        </section>

        {/* ── SECTION 5: COMPARISON ── */}
        <section id="comparison" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 12, lineHeight: 1.2 }}>
            Side by side
          </h2>
          <p style={{ fontSize: 15, color: "#B16937", marginBottom: 32, fontFamily: "'Neue Montreal', sans-serif" }}>
            The same six questions, answered three ways.
          </p>

          <div style={{ overflowX: "auto", marginBottom: 32 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
              <thead>
                <tr style={{ background: "#3B2114" }}>
                  {["", "Freelancer", "Agency", "Creative studio"].map((h) => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#FFF4E3", fontFamily: "'Neue Montreal', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "rgba(59,33,20,0.04)" : "transparent" }}>
                    {row.map((cell, j) => (
                      <td key={j} style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid rgba(59,33,20,0.08)",
                        color: j === 0 ? "#3B2114" : j === 3 ? "#90422C" : "#3B2114",
                        fontWeight: j === 0 || j === 3 ? 700 : 400,
                        fontFamily: j === 0 ? "'Neue Montreal', sans-serif" : "inherit",
                      }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p style={{ fontSize: 14, color: "rgba(59,33,20,0.6)", lineHeight: 1.6, fontFamily: "'Neue Montreal', sans-serif" }}>
            $ = lowest relative cost, $$$ = highest. Real ranges depend on scope, not on the label. See <Link href="/blog/creative-studios-atlanta" style={{ color: "#90422C", textDecoration: "underline" }}>what a creative studio costs in Atlanta</Link>.
          </p>
        </section>

        {/* ── SECTION 6: HOW TO DECIDE ── */}
        <section id="how-to-decide" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 12, lineHeight: 1.2 }}>
            How to decide
          </h2>
          <p style={{ fontSize: 15, color: "#B16937", marginBottom: 36, fontFamily: "'Neue Montreal', sans-serif" }}>
            Four questions that point you to the right answer.
          </p>

          {DECISION.map((item) => (
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

          <div style={{ background: "rgba(144,66,44,0.08)", border: "1px solid rgba(144,66,44,0.2)", borderRadius: 12, padding: "24px 28px" }}>
            <p style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: 13, fontWeight: 700, color: "#90422C", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>The short version</p>
            <p style={{ fontSize: 16, lineHeight: 1.7, margin: 0 }}>
              One contained deliverable and a tight budget: freelancer. A large, ongoing, multi-market campaign: agency. Brand, web, and content that need to feel like one company, built by one accountable team: creative studio. For most Atlanta founders and small businesses, that last one is the fit.
            </p>
          </div>
        </section>

        {/* ── RELATED READING ── */}
        <section style={{ marginBottom: 64, padding: "32px 0", borderTop: "1px solid rgba(59,33,20,0.12)", borderBottom: "1px solid rgba(59,33,20,0.12)" }}>
          <p style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B16937", marginBottom: 20 }}>Related reading</p>
          <div style={{ display: "grid", gap: 16 }}>
            {[
              { href: "/blog/creative-studios-atlanta", label: "Creative studios in Atlanta: the complete guide", desc: "What a studio does, how to choose one, and what it costs in 2026." },
              { href: "/blog/restaurant-atlanta", label: "How one team grew ordering 689x", desc: "A real Atlanta case study in what no-handoff, full-stack work delivers." },
              { href: "/blog/how-much-does-a-website-cost-in-atlanta", label: "How much does a website cost in Atlanta?", desc: "Real 2026 prices and what actually moves them." },
              { href: "/works", label: "The Range of View portfolio", desc: "Brand, web, video, and creative tech across the four disciplines." },
              { href: "/about", label: "Meet the team", desc: "The named people who do the work, not just pitch it." },
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
              <Image src="/teammembers/basutm2.webp" alt="Ayush Basu, Founder and Creative Director of Range of View Studios" fill sizes="64px" style={{ objectFit: "cover" }} />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 2, color: "#FFF4E3" }}>Ayush Basu</p>
              <p style={{ color: "#EA9A61", fontSize: 13, margin: 0, fontFamily: "'Neue Montreal', sans-serif" }}>
                Founder and Creative Director, <Link href="/about" style={{ color: "#EA9A61" }}>ROV Studios</Link>
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,244,227,0.1)" }}>
            <span style={{ display: "inline-block", width: 24, height: 2, background: "#EA9A61", flexShrink: 0 }} />
            <p style={{ fontSize: 12, color: "#FFF4E3", margin: 0, fontFamily: "'Neue Montreal', sans-serif" }}>
              Last updated &nbsp; July 16, 2026
            </p>
          </div>
        </section>

        {/* ── LEAD FORM CTA ── */}
        <BlogLeadForm
          source="blog:creative-studio-vs-agency-vs-freelancer"
          heading="Not sure which one you need?"
          subheading="Tell us what you're trying to build. We'll tell you honestly whether a studio is overkill, a perfect fit, or the wrong tool, before you spend a dollar."
          messagePlaceholder="What you're trying to build, your rough budget, and your timeline..."
          secondaryHref="https://calendly.com/rangeofviewmusic/30min"
          secondaryLabel="Prefer to talk? Book a free call"
        />

      </div>
      <NavigationDock />
      <Footer />
    </main>
  );
}
