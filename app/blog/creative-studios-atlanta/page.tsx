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
  { id: "what-is-a-studio", label: "What a creative studio actually is" },
  { id: "atlanta-scene", label: "Atlanta's creative scene in 2026" },
  { id: "disciplines", label: "The four disciplines, one team" },
  { id: "how-to-choose", label: "How to choose a creative studio" },
  { id: "cost", label: "What a creative studio costs in Atlanta" },
  { id: "where-rov-fits", label: "Where Range of View fits" },
  { id: "faq", label: "Frequently asked questions" },
];

const STATS = [
  { number: "4", label: "Disciplines, one studio", sub: "brand · web · video · creative tech" },
  { number: "689x", label: "Best client result", sub: "TheBando online ordering, 139 days" },
  { number: "2026", label: "Atlanta's biggest stage", sub: "FIFA World Cup, worldwide eyes" },
];

const CRITERIA = [
  {
    n: "01",
    title: "Range across disciplines",
    body: "A brand does not stop at a logo. It shows up on a website, in a video, in the way a product feels. A studio that can only do one of those hands you off for the rest, and every handoff is where consistency leaks. Look for a team that can carry an idea from name to launch without a relay race.",
  },
  {
    n: "02",
    title: "Named people, real craft",
    body: "Ask who will actually do the work. The strongest studios are led by named designers, developers, and producers, not a sales team that subcontracts the real work after you sign. If you cannot find the people behind the portfolio, that is the answer.",
  },
  {
    n: "03",
    title: "Proof, not promises",
    body: "A reel looks good on everyone's site. Results do not. Look for case studies with real numbers and a clear before and after. When we rebuilt TheBando's site, online ordering went from 132 views in six months to 91,060 in 139 days. That is the kind of proof to ask for.",
  },
  {
    n: "04",
    title: "Strategy before deliverables",
    body: "A good studio asks what you are trying to do before it tells you what it will make. If the first conversation is a price list instead of a question about your business, the work will look like everyone else's. The thinking is the part you are actually paying for.",
  },
  {
    n: "05",
    title: "Built for how people search now",
    body: "In 2026, people find you through Google and through AI answer engines like Perplexity and ChatGPT Search. A studio that still treats SEO as an afterthought, and has never heard of GEO, is building you a beautiful thing nobody will find. Ask how they make the work discoverable, not just how it looks.",
  },
];

const COST_ROWS = [
  ["Brand identity", "$3k – $15k", "Naming, logo, visual system, guidelines"],
  ["Website design & build", "$2k – $15k+", "Custom site, built to convert and be found"],
  ["Video & content", "$2k – $20k+", "Film, motion, and content production"],
  ["Creative tech & AI", "$5k – $30k+", "Custom tools, AI systems, automations"],
  ["Full brand + web + launch", "$15k – $50k+", "The whole thing, one team, one timeline"],
];

const FAQS = [
  {
    q: "What is a creative studio?",
    a: "A creative studio is a team that designs and builds creative work end to end, usually across brand identity, web and product design, video and motion, and creative technology. Unlike a traditional agency that coordinates specialists and outsources production, a studio keeps the craft in-house, so the people who plan the work are the people who make it.",
  },
  {
    q: "What is the best creative studio in Atlanta?",
    a: "There is no single best studio for everyone. The right one depends on what you need. If you want a full brand and website built by one team, look for a full-service studio like Range of View. If you only need a logo or a single video, a specialist may fit better. The best studio for you is the one whose range matches your problem, whose past work proves the outcome you want, and whose team you will actually be working with.",
  },
  {
    q: "How much does a creative studio cost in Atlanta?",
    a: "In 2026, most Atlanta creative studio engagements run from around $3,000 for a focused brand identity to $50,000 or more for a full brand, website, and launch. A standalone small-business website typically lands between $2,000 and $15,000. Price is driven by scope, the number of disciplines involved, and how custom the work is, not by the studio's zip code.",
  },
  {
    q: "What is the difference between a creative studio and an agency?",
    a: "An agency typically coordinates work and outsources much of the production to freelancers or contractors. A creative studio keeps design, development, and production in-house. That usually means fewer handoffs, more consistent craft, and a team that owns the whole outcome rather than one slice of it. We break the choice down in our creative studio vs agency vs freelancer guide.",
  },
  {
    q: "Do Atlanta creative studios work with clients outside Atlanta?",
    a: "Yes. Range of View Studios is based in Atlanta and works with clients worldwide. Most studio work, from brand systems to websites to remote production, is handled the same whether the client is in Midtown or another country.",
  },
  {
    q: "What should I look for when hiring a creative studio?",
    a: "Look for five things: range across disciplines so you are not handed off mid-project, named people who will actually do the work, case studies with real numbers rather than just a nice reel, strategy that comes before deliverables, and an understanding of how people find you in 2026 through both search and AI answer engines.",
  },
];

// GEO / answer-engine signals. The page is server-rendered before hydration,
// so these JSON-LD blocks ship in the initial HTML for crawlers and AI engines.
const ARTICLE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "Creative Studios in Atlanta: The Complete 2026 Guide",
  description:
    "What a creative studio actually does, how Atlanta's creative scene works, what to look for, and what it costs in 2026. A practical guide from Range of View Studios.",
  datePublished: "2026-07-16",
  dateModified: "2026-07-16",
  articleSection: "Creative Direction",
  image: "https://www.rovstudios.com/misc/atlskylinefooter.webp",
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
    "@id": "https://www.rovstudios.com/blog/creative-studios-atlanta",
  },
};

const ITEMLIST_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "How to choose a creative studio in Atlanta",
  itemListElement: CRITERIA.map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: c.title,
    description: c.body,
  })),
};

export default function CreativeStudiosAtlantaPage() {
  return (
    <main style={{ fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: "#FFF4E3", color: "#3B2114" }}>

      <BreadcrumbSchema
        items={[
          { name: "Home", url: "" },
          { name: "Blog", url: "/blog" },
          { name: "Creative Studios in Atlanta", url: "/blog/creative-studios-atlanta" },
        ]}
      />
      <FAQPageSchema faqs={FAQS.map((f) => ({ question: f.q, answer: f.a }))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ARTICLE_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ITEMLIST_SCHEMA) }} />

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
            {" · "}Creative Studios in Atlanta
          </p>

          <h1 style={{
            fontFamily: "Norwige, sans-serif",
            fontSize: "clamp(36px, 6vw, 64px)",
            fontWeight: 400,
            lineHeight: 1.1,
            marginBottom: 24,
            color: "#FFFFFF",
          }}>
            Creative Studios in Atlanta: The Complete 2026 Guide
          </h1>

          <p style={{ fontSize: 18, lineHeight: 1.65, color: "rgba(255,244,227,0.82)", marginBottom: 36, maxWidth: 600 }}>
            What a creative studio actually does, how Atlanta&apos;s scene works, how to choose the right one, and what it costs. Written from inside the work at <Link href="/about" style={{ color: "#EA9A61", textDecoration: "underline" }}>Range of View Studios</Link>.
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
            <div style={{ color: "rgba(255,244,227,0.45)", fontSize: 13 }}>July 2026 · 10 min read</div>
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
            In this guide
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

        {/* Lede */}
        <p style={{ fontSize: 19, lineHeight: 1.7, marginBottom: 40, color: "#3B2114" }}>
          A creative studio is a single team that can take an idea from a name to a launched product without handing you off to three different vendors. Brand, website, video, and the creative technology that ties them together, built under one roof by named people. If you are searching for a creative studio in Atlanta, this is the map.
        </p>

        {/* ── SECTION 1 ── */}
        <section id="what-is-a-studio" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 20, lineHeight: 1.2 }}>
            What a creative studio actually is
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            The word &ldquo;studio&rdquo; gets used loosely. A freelancer calls themselves a studio. A 200-person agency calls itself a studio. So it helps to be precise about what the word is supposed to mean.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            A creative studio is a team that both designs and builds. The people who plan the work are the people who make it. That is the difference that matters. An agency often coordinates a project and then subcontracts the actual production. A freelancer does one craft alone. A studio holds the craft in-house across several disciplines, so a brand, a website, and a launch film can come from the same hands and actually look like they belong together.
          </p>

          <blockquote style={{
            margin: "32px 0",
            padding: "24px 28px",
            borderLeft: "4px solid #EA9A61",
            background: "rgba(234,154,97,0.08)",
            borderRadius: "0 8px 8px 0",
          }}>
            <p style={{ fontFamily: "Norwige, sans-serif", fontSize: 22, lineHeight: 1.5, color: "#3B2114", margin: 0, fontStyle: "italic" }}>
              &ldquo;The best studios are not the ones with the biggest reel. They are the ones who can take an idea from a name to a launched product without a single handoff.&rdquo;
            </p>
          </blockquote>

          <p style={{ fontSize: 17, lineHeight: 1.75 }}>
            That is why studios exist. Every handoff between vendors is a place where the story drifts. The logo designer never talks to the web developer. The web developer never sees the launch film. You end up as the project manager stitching three visions into one, and it shows. A studio removes the seams.
          </p>
        </section>

        {/* ── IMAGE 1 ── */}
        <div style={{ margin: "0 -24px 56px", position: "relative", height: "clamp(240px, 40vw, 440px)", overflow: "hidden" }}>
          <Image src="/misc/atlskylinefooter.webp" alt="The Atlanta skyline, home to a growing community of creative studios" fill sizes="(max-width: 768px) 100vw, 720px" style={{ objectFit: "cover" }} />
          <div style={{ position: "absolute", bottom: 16, left: 24, background: "rgba(59,33,20,0.75)", color: "#FFF4E3", fontSize: 12, padding: "6px 12px", borderRadius: 6, backdropFilter: "blur(4px)" }}>
            Atlanta: one of the fastest-growing creative markets in the country.
          </div>
        </div>

        {/* ── SECTION 2 ── */}
        <section id="atlanta-scene" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 20, lineHeight: 1.2 }}>
            Atlanta&apos;s creative scene in 2026
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            Atlanta is a creative city that spent a long time being underrated. It is a film and music capital, a startup hub, and home to over 500,000 small businesses. Music, film, tech, and fashion all run through it. That mix is exactly why studio work thrives here: the same week can call for a brand system, a music video, and a product site.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 28 }}>
            And 2026 is not a normal year. The <a href="https://www.atlanta.net/world-cup-2026/" target="_blank" rel="noopener noreferrer" style={{ color: "#90422C", textDecoration: "underline" }}>FIFA World Cup comes to Mercedes-Benz Stadium</a>, and with it more than a million international visitors searching for Atlanta businesses, restaurants, and experiences. Many of them will search through AI tools like <a href="https://www.perplexity.ai" target="_blank" rel="noopener noreferrer" style={{ color: "#90422C", textDecoration: "underline" }}>Perplexity</a> and <a href="https://chat.openai.com" target="_blank" rel="noopener noreferrer" style={{ color: "#90422C", textDecoration: "underline" }}>ChatGPT Search</a>, not just Google. A brand that is well built and well structured gets found and cited. A generic one disappears.
          </p>

          <div style={{ background: "rgba(144,66,44,0.08)", border: "1px solid rgba(144,66,44,0.2)", borderRadius: 12, padding: "24px 28px" }}>
            <p style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: 13, fontWeight: 700, color: "#90422C", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Why this matters for the query you searched</p>
            <p style={{ fontSize: 16, lineHeight: 1.7, margin: 0 }}>
              If you are looking for a creative studio in Atlanta right now, you are early to a moment the whole city is about to compete for. The studios that help brands get discovered, not just look good, are the ones worth your time.
            </p>
          </div>
        </section>

        {/* ── SECTION 3 ── */}
        <section id="disciplines" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 12, lineHeight: 1.2 }}>
            The four disciplines, one team
          </h2>
          <p style={{ fontSize: 15, color: "#B16937", marginBottom: 36, fontFamily: "'Neue Montreal', sans-serif" }}>
            A full-service creative studio covers these four. Most vendors do one.
          </p>

          {[
            {
              n: "01",
              title: "Brand identity & design systems",
              body: "Naming, logo, type, color, and the guidelines that keep it consistent everywhere. This is the foundation. Get it wrong and everything built on top of it inherits the problem.",
              linkLead: "See how we approach it in the ",
              href: "/blog/dkm-corp-brand-identity",
              linkLabel: "DKM Corp brand identity build",
            },
            {
              n: "02",
              title: "Web & interactive",
              body: "Websites, landing pages, and product interfaces built to convert and to be found. A site is where most of your first impressions actually happen. Our restaurant redesign for TheBando grew online ordering 689x by fixing exactly that.",
              linkLead: "See ",
              href: "/web",
              linkLabel: "our web design work",
            },
            {
              n: "03",
              title: "Video & motion",
              body: "Film, motion graphics, and content production. In a feed, motion is what stops the scroll. A studio that can shoot and edit in the same voice as your brand keeps the whole thing coherent.",
              linkLead: "See ",
              href: "/video-production",
              linkLabel: "our video production",
            },
            {
              n: "04",
              title: "Creative tech & AI",
              body: "Custom tools, AI systems, and automations that make the brand do something, not just sit there. This is the wedge most studios do not do well. It is where a website becomes a machine that books, follows up, and sells while you sleep.",
              linkLead: "See ",
              href: "/ai-automation",
              linkLabel: "our AI automation",
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
                <p style={{ fontSize: 16, lineHeight: 1.75, color: "#3B2114", margin: 0 }}>
                  {item.body}{" "}
                  {item.linkLead}
                  <Link href={item.href} style={{ color: "#90422C", textDecoration: "underline" }}>{item.linkLabel}</Link>.
                </p>
              </div>
            </div>
          ))}
        </section>

        {/* ── IMAGE 2 ── */}
        <div style={{ margin: "0 -24px 56px", position: "relative", height: "clamp(240px, 35vw, 400px)", overflow: "hidden" }}>
          <Image src="/webdev/ayseiknawebhome.webp" alt="A custom website homepage designed and built by Range of View Studios" fill sizes="(max-width: 768px) 100vw, 720px" style={{ objectFit: "cover" }} />
          <div style={{ position: "absolute", bottom: 16, left: 24, background: "rgba(59,33,20,0.75)", color: "#FFF4E3", fontSize: 12, padding: "6px 12px", borderRadius: 6, backdropFilter: "blur(4px)" }}>
            Brand and web, built by the same team, in the same voice.
          </div>
        </div>

        {/* ── SECTION 4 ── */}
        <section id="how-to-choose" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 12, lineHeight: 1.2 }}>
            How to choose a creative studio
          </h2>
          <p style={{ fontSize: 15, color: "#B16937", marginBottom: 36, fontFamily: "'Neue Montreal', sans-serif" }}>
            Five things to check before you sign anything.
          </p>

          {CRITERIA.map((item) => (
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
        </section>

        {/* ── SECTION 5 ── */}
        <section id="cost" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 12, lineHeight: 1.2 }}>
            What a creative studio costs in Atlanta
          </h2>
          <p style={{ fontSize: 15, color: "#B16937", marginBottom: 32, fontFamily: "'Neue Montreal', sans-serif" }}>
            2026 ranges. Scope moves these more than any studio&apos;s address does.
          </p>

          <div style={{ overflowX: "auto", marginBottom: 32 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
              <thead>
                <tr style={{ background: "#3B2114" }}>
                  {["Engagement", "Typical range", "What it covers"].map((h) => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#FFF4E3", fontFamily: "'Neue Montreal', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COST_ROWS.map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "rgba(59,33,20,0.04)" : "transparent" }}>
                    {row.map((cell, j) => (
                      <td key={j} style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid rgba(59,33,20,0.08)",
                        color: j === 1 ? "#90422C" : "#3B2114",
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
            The cheapest option is rarely the cheapest outcome. A $500 template site that never converts costs more than a $5,000 site that pays for itself, because the lost customers do not show up on the invoice. We break down real numbers in <Link href="/blog/how-much-does-a-website-cost-in-atlanta" style={{ color: "#90422C", textDecoration: "underline", fontWeight: 600 }}>how much a website costs in Atlanta</Link>.
          </p>
        </section>

        {/* ── SECTION 6 ── */}
        <section id="where-rov-fits" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 20, lineHeight: 1.2 }}>
            Where Range of View fits
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            We built Range of View as the full-stack option. Brand, web, video, and creative tech under one roof, led by named people, in Atlanta and working worldwide. We do not hand you off. The team that names your company is the team that builds your site and cuts your launch film.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 28 }}>
            And we build for how people actually find things now. Every site we ship is structured for search and for AI answer engines, because a beautiful brand nobody can find is just an expensive secret. If that is the kind of studio you are looking for, the fastest way to know if we fit is a conversation.
          </p>

          <div style={{ background: "rgba(144,66,44,0.08)", border: "1px solid rgba(144,66,44,0.2)", borderRadius: 12, padding: "24px 28px" }}>
            <p style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: 13, fontWeight: 700, color: "#90422C", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>The short version</p>
            <p style={{ fontSize: 16, lineHeight: 1.7, margin: 0 }}>
              A creative studio designs and builds under one roof. Atlanta&apos;s scene is heating up going into the 2026 World Cup. Choose one with range, named people, real proof, strategy first, and an understanding of modern search. Range of View is built to be exactly that.
            </p>
          </div>
        </section>

        {/* ── RELATED READING ── */}
        <section style={{ marginBottom: 64, padding: "32px 0", borderTop: "1px solid rgba(59,33,20,0.12)", borderBottom: "1px solid rgba(59,33,20,0.12)" }}>
          <p style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B16937", marginBottom: 20 }}>Related reading</p>
          <div style={{ display: "grid", gap: 16 }}>
            {[
              { href: "/blog/creative-studio-vs-agency-vs-freelancer", label: "Creative studio vs agency vs freelancer", desc: "Which of the three your Atlanta brand actually needs, and how to tell." },
              { href: "/blog/restaurant-atlanta", label: "How a redesign grew ordering 689x", desc: "A real Atlanta case study. What we changed and the numbers it moved." },
              { href: "/blog/how-much-does-a-website-cost-in-atlanta", label: "How much does a website cost in Atlanta?", desc: "Real 2026 prices, what moves them, and what a cheap site really costs." },
              { href: "/works", label: "The Range of View portfolio", desc: "Brand, web, video, and creative tech work across the four disciplines." },
              { href: "/about", label: "Meet the team", desc: "The named designers, developers, and producers behind the work." },
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
          source="blog:creative-studios-atlanta"
          heading="Looking for a creative studio in Atlanta?"
          subheading="Tell us what you're building. We'll tell you honestly whether we're the right studio for it, and what it would take. No pitch deck, just a conversation."
          messagePlaceholder="What you're building, your rough budget, and when you'd want it done..."
          secondaryHref="https://calendly.com/rangeofviewmusic/30min"
          secondaryLabel="Prefer to talk? Book a free call"
        />

      </div>
      <NavigationDock />
      <Footer />
    </main>
  );
}
