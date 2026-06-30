import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";

const NavigationDock = dynamic(
  () => import("@/components/NavDoc").then((mod) => ({ default: mod.NavigationDock })),
  { ssr: false }
);
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });

export const metadata: Metadata = {
  title: "Every Restaurant Is Bleeding Revenue Online | ROV Studios Atlanta",
  description: "Most Atlanta restaurants lose customers before they ever place an order. ROV Studios fixed one restaurant's website and grew online ordering 689x in 139 days. Here's what we changed.",
  alternates: { canonical: "https://www.rovstudios.com/blog/restaurant-atlanta" },
  openGraph: {
    title: "Every Restaurant Is Bleeding Revenue Online | ROV Studios Atlanta",
    description: "Most Atlanta restaurants lose customers before they ever place an order. ROV Studios fixed one restaurant's website and grew online ordering 689x in 139 days.",
    images: [{ url: "/casestudy/bando/bandocrackpic.webp", width: 1200, height: 630 }],
  },
};

const TOC = [
  { id: "the-problem", label: "The problem nobody talks about" },
  { id: "three-seconds", label: "The 3-second rule" },
  { id: "what-we-changed", label: "What we actually changed" },
  { id: "the-results", label: "The numbers" },
  { id: "ongoing-growth", label: "Six months later" },
  { id: "what-this-means", label: "What this means for Atlanta restaurants" },
  { id: "faq", label: "Frequently asked questions" },
];

const STATS = [
  { number: "689x", label: "More online ordering views", sub: "132 to 91,000 in 139 days" },
  { number: "+87%", label: "Revenue growth", sub: "5 months after launch" },
  { number: "+158%", label: "More unique visitors", sub: "month over month" },
];

const FAQS = [
  {
    q: "How much does a restaurant website redesign cost in Atlanta?",
    a: "Most restaurant website redesigns through ROV Studios range from $3,000 to $15,000 depending on scope. TheBando's project included a full UX overhaul, new menu architecture, and mobile ordering rebuild. The result was a 689x increase in ordering traffic that paid for itself many times over within the first few months. We offer a free audit to identify what specifically needs to change before quoting anything.",
  },
  {
    q: "How long does a restaurant website redesign take?",
    a: "Most restaurant projects run 4 to 8 weeks from kickoff to launch. TheBando launched on November 7, 2024, and the results were visible within weeks. Timeline depends on how many pages you need, whether online ordering integrations are involved, and how quickly you can review and approve designs.",
  },
  {
    q: "Will a new website actually increase my restaurant's online orders?",
    a: "It depends on what's broken. For TheBando, the ordering page was buried. Only 132 people found it in six months. We restructured the site so ordering was the front door. 91,000 people found it in the next 139 days. A website redesign only increases orders if the redesign solves a real problem in the path from 'I'm hungry' to 'I just ordered.' That's what we audit for first.",
  },
  {
    q: "Does my Atlanta restaurant need SEO or just a better website?",
    a: "Both work together. A better website converts the people who already find you. SEO and GEO bring more people to find you in the first place. TheBando's redesign focused on conversion first, making the existing traffic count. Once that was working, traffic grew on its own because Google started surfacing a site that people were actually engaging with. Bounce rate dropped to 46% and session time hit 4 minutes 38 seconds.",
  },
  {
    q: "What is GEO and why does it matter for my restaurant?",
    a: "GEO stands for Generative Engine Optimization. It is about getting cited by AI search tools like Perplexity and ChatGPT Search when someone asks 'where should I eat in Atlanta?' or 'best soul food near Mercedes-Benz Stadium.' These searches are growing fast, especially with the FIFA World Cup coming to Atlanta in 2026 and international visitors relying heavily on AI search. A well-structured restaurant website with strong content gets cited. A generic one doesn't.",
  },
];

export default function RestaurantAtlantaPage() {
  return (
    <main style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: "#FFF4E3", color: "#3B2114" }}>

      {/* ── HERO ── */}
      <section style={{
        background: "linear-gradient(160deg, #3B2114 0%, #603E25 55%, #90422C 100%)",
        padding: "80px 24px 64px",
        color: "#FFF4E3",
      }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>

          {/* Breadcrumb */}
          <p style={{ fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,244,227,0.55)", marginBottom: 28, fontFamily: "'Neue Montreal', sans-serif" }}>
            <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>ROV Studios</Link>
            {" · "}
            <Link href="/web" style={{ color: "inherit", textDecoration: "none" }}>Web Design</Link>
            {" · "}Atlanta Restaurants
          </p>

          {/* Headline */}
          <h1 style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: "clamp(36px, 6vw, 64px)",
            fontWeight: 400,
            lineHeight: 1.1,
            marginBottom: 24,
            background: "linear-gradient(135deg, #FFF4E3 0%, #EA9A61 60%, #B16937 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Every Restaurant Is Bleeding Revenue Online. Here Is What Fixing It Looks Like.
          </h1>

          <p style={{ fontSize: 18, lineHeight: 1.65, color: "rgba(255,244,227,0.82)", marginBottom: 36, maxWidth: 600 }}>
            Better branding. Smarter SEO. A site that actually converts. This is the story of <a href="https://www.thebandoatl.com" target="_blank" rel="noopener noreferrer" style={{ color: "#EA9A61", textDecoration: "underline" }}>TheBando</a> and what it means for every Atlanta restaurant sitting on untapped revenue right now.
          </p>

          {/* Author + meta */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div style={{
              background: "rgba(255,244,227,0.12)",
              border: "1px solid rgba(255,244,227,0.2)",
              borderRadius: 100,
              padding: "6px 14px",
              fontSize: 13,
              color: "rgba(255,244,227,0.75)",
              fontFamily: "'Neue Montreal', sans-serif",
            }}>
              Suchet Konda · Co-Founder, <Link href="/about" style={{ color: "rgba(255,244,227,0.75)", textDecoration: "underline" }}>ROV Studios</Link>
            </div>
            <div style={{ color: "rgba(255,244,227,0.45)", fontSize: 13 }}>June 2026 · 7 min read</div>
          </div>
        </div>
      </section>

      {/* ── STATS ROW ── */}
      <section style={{ background: "#3B2114", padding: "0 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 1, borderTop: "1px solid rgba(255,244,227,0.08)" }}>
          {STATS.map((s) => (
            <div key={s.number} style={{ padding: "28px 20px", textAlign: "center" }}>
              <div style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontSize: "clamp(32px, 5vw, 48px)",
                background: "linear-gradient(135deg, #EA9A61 0%, #90422C 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                lineHeight: 1,
                marginBottom: 8,
              }}>{s.number}</div>
              <div style={{ color: "#FFF4E3", fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{s.label}</div>
              <div style={{ color: "rgba(255,244,227,0.5)", fontSize: 12 }}>{s.sub}</div>
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

        {/* ── SECTION 1: The Problem ── */}
        <section id="the-problem" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 20, lineHeight: 1.2 }}>
            The problem nobody talks about
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            Terry and Darius had a restaurant that Atlanta should have known about. A Black history museum and a fried chicken spot on the Westside, all in one building. The food was real. The history was real. People who walked through the door left talking about it.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            But 132 people found their online ordering page in six months.
          </p>

          {/* Pull quote */}
          <blockquote style={{
            margin: "32px 0",
            padding: "24px 28px",
            borderLeft: "4px solid #EA9A61",
            background: "rgba(234,154,97,0.08)",
            borderRadius: "0 8px 8px 0",
          }}>
            <p style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 22, lineHeight: 1.5, color: "#3B2114", margin: 0, fontStyle: "italic" }}>
              "Not 132 a day. 132 total. For a restaurant in one of the most competitive food cities in the country."
            </p>
          </blockquote>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            The website existed. The ordering page existed. Hungry people in Atlanta existed. The money was right there with no path to reach them.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75 }}>
            That is a revenue leak. Most Atlanta restaurants have one. They just do not know where to look. When ROV did the <Link href="/casestudy/bando" style={{ color: "#90422C", textDecoration: "underline", fontWeight: 600 }}>TheBando website audit</Link>, this was the first thing we found.
          </p>
        </section>

        {/* ── IMAGE 1 ── */}
        <div style={{ margin: "0 -24px 56px", position: "relative", height: "clamp(240px, 40vw, 440px)", overflow: "hidden" }}>
          <Image src="/casestudy/bando/bando2.webp" alt="TheBando interior, Atlanta Black history museum and restaurant on the Westside" fill style={{ objectFit: "cover" }} />
          <div style={{ position: "absolute", bottom: 16, left: 24, background: "rgba(59,33,20,0.75)", color: "#FFF4E3", fontSize: 12, padding: "6px 12px", borderRadius: 6, backdropFilter: "blur(4px)" }}>
            TheBando, Atlanta&apos;s Westside. Black history museum and fried chicken restaurant.
          </div>
        </div>

        {/* ── SECTION 2: The 3-Second Rule ── */}
        <section id="three-seconds" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 20, lineHeight: 1.2 }}>
            The 3-second rule
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            The human brain forms its first impression in three seconds. Three. Not a paragraph worth of time. Not enough time to read a menu description. Just enough time to feel whether something is worth trusting.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            For a restaurant, that three-second window plays out on your website every single time someone searches your name on a phone. Someone hungry, on a lunch break, sitting in their car on 285. They tap your site link. What they see in the next three seconds decides whether they order or hit the back button.
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
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontSize: 56,
              background: "linear-gradient(135deg, #EA9A61, #90422C)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              lineHeight: 1,
            }}>76%</div>
            <div>
              <p style={{ color: "#FFF4E3", fontSize: 16, lineHeight: 1.6, margin: 0 }}>
                of people who search for a local business on their phone visit that business within 24 hours. Lose them in three seconds and you lost the visit, the order, and the return customer.
              </p>
              <p style={{ color: "rgba(255,244,227,0.45)", fontSize: 12, marginTop: 8, marginBottom: 0 }}>Source: <a href="https://www.thinkwithgoogle.com" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,244,227,0.45)" }}>Think with Google</a></p>
            </div>
          </div>

          <p style={{ fontSize: 17, lineHeight: 1.75 }}>
            TheBando was not losing customers because the food was bad. They were losing them before the food ever came up. The site buried the most important button: order now. It made people dig for it. Most people do not dig. They leave.
          </p>
        </section>

        {/* ── SECTION 3: What We Changed ── */}
        <section id="what-we-changed" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 12, lineHeight: 1.2 }}>
            What we actually changed
          </h2>
          <p style={{ fontSize: 15, color: "#B16937", marginBottom: 36, fontFamily: "'Neue Montreal', sans-serif" }}>
            Three changes. No ad spend. 689x result. See the full design breakdown on the <Link href="/casestudy/bando" style={{ color: "#B16937" }}>TheBando case study page</Link>.
          </p>

          {[
            {
              n: "01",
              title: "Online ordering became the front door",
              body: "The previous site treated ordering like an afterthought. It was a link buried inside an interior page. We moved it to the most visible position on the homepage with clear, direct calls to action. When someone lands on the site hungry, the path from 'I want food' to 'I'm ordering food' now takes seconds, not minutes. This is standard practice in our web design process at ROV.",
            },
            {
              n: "02",
              title: "New menu pages built for browsing",
              body: "We created dedicated menu pages that let visitors explore before they commit to ordering. These pages collectively drove 139,398 page views after launch. People want to look at a menu before they order, especially for a restaurant they have not visited before. Giving them well-designed, fast-loading menu pages kept them on site longer and moved them toward a purchase.",
            },
            {
              n: "03",
              title: "A mobile-first ordering experience",
              body: "Most people searching for a restaurant in Atlanta are doing it on a phone. In their car, on the Beltline, waiting for the train at Five Points. The old site made mobile users pinch and zoom to find anything. We rebuilt the entire mobile flow to be fast, intuitive, and frustration-free. Tap, browse, order. Done.",
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
                <h3 style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: 18, fontWeight: 700, color: "#B16937", marginBottom: 12 }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: 16, lineHeight: 1.75, color: "#3B2114", margin: 0 }}>{item.body}</p>
              </div>
            </div>
          ))}
        </section>

        {/* ── IMAGE 2 ── */}
        <div style={{ margin: "0 -24px 56px", position: "relative", height: "clamp(240px, 35vw, 400px)", overflow: "hidden" }}>
          <Image src="/casestudy/bando/bando1.webp" alt="TheBando signature wall, bold white lettering against patterned Atlanta restaurant wallpaper" fill style={{ objectFit: "cover" }} />
        </div>

        {/* ── SECTION 4: The Numbers ── */}
        <section id="the-results" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 12, lineHeight: 1.2 }}>
            The numbers
          </h2>
          <p style={{ fontSize: 15, color: "#B16937", marginBottom: 32, fontFamily: "'Neue Montreal', sans-serif" }}>
            139 days before and after the November 7, 2024 launch. All from Wix Analytics.
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
                  ["Total sessions", "220,200", "303,129", "+37.6%"],
                  ["Unique visitors", "174,463", "231,495", "+32.7%"],
                  ["Page views", "440,754", "588,458", "+33.5%"],
                  ["Ordering page views", "132", "91,060", "+689x"],
                  ["New menu page views", "none", "139,398", "New pages"],
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
            The ordering page went from essentially invisible to the site&apos;s primary conversion driver. That is the difference between a website that exists and a website that works. <Link href="/casestudy/bando" style={{ color: "#90422C", textDecoration: "underline", fontWeight: 600 }}>Read the full TheBando case study</Link> for every decision we made and why.
          </p>
        </section>

        {/* ── SECTION 5: Six Months Later ── */}
        <section id="ongoing-growth" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 20, lineHeight: 1.2 }}>
            Six months later
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 28 }}>
            The launch result was not a spike. It held. The updated sales data from TheBando&apos;s Wix Analytics dashboard tells the rest of the story:
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
            {[
              { stat: "Jan", then: "Revenue baseline", arrow: "→", now: "+87%", nowLabel: "By May 2026" },
              { stat: "231", then: "Orders in January", arrow: "→", now: "427", nowLabel: "Orders by April (+85%)" },
              { stat: "10,807", then: "Sessions in January", arrow: "→", now: "25,856", nowLabel: "Sessions by April (+139%)" },
            ].map((item, i) => (
              <div key={i} style={{
                background: "#3B2114",
                borderRadius: 12,
                padding: "24px 20px",
                color: "#FFF4E3",
              }}>
                <div style={{ fontSize: 13, color: "rgba(255,244,227,0.5)", marginBottom: 8, fontFamily: "'Neue Montreal', sans-serif" }}>{item.then}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 20, fontWeight: 700, textDecoration: "line-through", color: "rgba(255,244,227,0.35)" }}>{item.stat}</span>
                  <span style={{ color: "#EA9A61", fontSize: 12, fontFamily: "'Neue Montreal', sans-serif" }}>{item.arrow}</span>
                  <span style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 26, color: "#EA9A61" }}>{item.now}</span>
                </div>
                <div style={{ fontSize: 13, color: "rgba(255,244,227,0.65)", fontWeight: 600 }}>{item.nowLabel}</div>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            Revenue grew 87% in five months. Orders nearly doubled. Visitors are staying longer too. Bounce rate dropped to 46% and average session time sits at 4 minutes 38 seconds.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75 }}>
            A <Link href="/web" style={{ color: "#90422C", textDecoration: "underline" }}>website that works</Link> keeps working. The redesign did not just create a launch spike. It built a foundation that compounds.
          </p>
        </section>

        {/* ── IMAGE 3 ── */}
        <div style={{ margin: "0 -24px 56px", position: "relative", height: "clamp(240px, 35vw, 400px)", overflow: "hidden" }}>
          <Image src="/casestudy/bando/bandocrackpic.webp" alt="TheBando signature crack chicken dish, the No Cap bestseller" fill style={{ objectFit: "cover" }} />
          <div style={{ position: "absolute", bottom: 16, left: 24, background: "rgba(59,33,20,0.75)", color: "#FFF4E3", fontSize: 12, padding: "6px 12px", borderRadius: 6, backdropFilter: "blur(4px)" }}>
            The &ldquo;No Cap&rdquo;, TheBando&apos;s best-selling item.
          </div>
        </div>

        {/* ── SECTION 6: What This Means ── */}
        <section id="what-this-means" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 20, lineHeight: 1.2 }}>
            What this means for Atlanta restaurants
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            Atlanta has over 500,000 small businesses. The food scene alone is one of the most competitive in the South. Buckhead, the Westside, Old Fourth Ward, Summerhill. Every neighborhood has restaurants fighting for the same hungry customers scrolling their phones.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            The restaurants that win are not always the ones with the best food. They are the ones that are easiest to find and easiest to order from when someone makes the decision. That is where <Link href="/web" style={{ color: "#90422C", textDecoration: "underline" }}>ROV Studios web design</Link> comes in.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 28 }}>
            And with the <a href="https://www.atlanta.net/world-cup-2026/" target="_blank" rel="noopener noreferrer" style={{ color: "#90422C", textDecoration: "underline" }}>FIFA World Cup coming to Mercedes-Benz Stadium in 2026</a>, the window to get your digital presence in order is now. Over a million international visitors will be searching for Atlanta restaurants on AI tools like <a href="https://www.perplexity.ai" target="_blank" rel="noopener noreferrer" style={{ color: "#90422C", textDecoration: "underline" }}>Perplexity</a> and <a href="https://chat.openai.com" target="_blank" rel="noopener noreferrer" style={{ color: "#90422C", textDecoration: "underline" }}>ChatGPT Search</a>, not just Google. A site that shows up and converts in that context is worth more than any billboard on I-285.
          </p>

          <div style={{ background: "rgba(144,66,44,0.08)", border: "1px solid rgba(144,66,44,0.2)", borderRadius: 12, padding: "24px 28px" }}>
            <p style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: 13, fontWeight: 700, color: "#90422C", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>The short version</p>
            <p style={{ fontSize: 16, lineHeight: 1.7, margin: 0 }}>
              If your restaurant website exists but is not actively converting visitors into orders, that is not a small problem. That is a revenue leak and it compounds every single day it stays unfixed. TheBando had 132 ordering views in six months. The site existed. The ordering page existed. The leak was the path between the two.
            </p>
          </div>
        </section>

        {/* ── RELATED READING ── */}
        <section style={{ marginBottom: 64, padding: "32px 0", borderTop: "1px solid rgba(59,33,20,0.12)", borderBottom: "1px solid rgba(59,33,20,0.12)" }}>
          <p style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B16937", marginBottom: 20 }}>Related reading</p>
          <div style={{ display: "grid", gap: 16 }}>
            {[
              { href: "/casestudy/bando", label: "Full TheBando case study", desc: "Complete breakdown of the redesign. Every decision, every change, the full data." },
              { href: "/web", label: "ROV Studios web design services", desc: "How we build Atlanta websites. Pricing, timeline, and what to expect from the process." },
              { href: "/ai-automation", label: "AI automations for restaurants", desc: "Missed call text-back, review request automation, follow-up sequences. All running without you." },
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

        {/* ── FAQ ── */}
        <section id="faq" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 32, lineHeight: 1.2 }}>
            Frequently asked questions
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{ paddingBottom: 28, marginBottom: 28, borderBottom: "1px solid rgba(59,33,20,0.1)" }}>
                <h3 style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: 17, fontWeight: 700, color: "#B16937", marginBottom: 12, lineHeight: 1.4 }}>
                  {faq.q}
                </h3>
                <p style={{ fontSize: 16, lineHeight: 1.75, color: "#3B2114", margin: 0 }}>{faq.a}</p>
              </div>
            ))}
          </div>
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
            <p style={{ fontSize: 12, color: "rgba(255,244,227,0.45)", margin: 0, fontFamily: "'Neue Montreal', sans-serif" }}>
              Last updated &nbsp; June 30, 2026
            </p>
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{
          background: "linear-gradient(135deg, #EA9A61 0%, #90422C 100%)",
          borderRadius: 16,
          padding: "48px 36px",
          textAlign: "center",
          color: "#FFF4E3",
        }}>
          <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 400, marginBottom: 16, lineHeight: 1.2 }}>
            Want to know where your restaurant is leaking revenue?
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: "rgba(255,244,227,0.85)", marginBottom: 32, maxWidth: 480, margin: "0 auto 32px" }}>
            We run free audits for Atlanta restaurants. We look at your site, your ordering flow, your search visibility. We find the gap. We show you exactly what to fix.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="https://calendly.com/rangeofviewmusic/30min"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "#FFF4E3",
                color: "#3B2114",
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
                background: "rgba(255,244,227,0.15)",
                color: "#FFF4E3",
                padding: "14px 28px",
                borderRadius: 100,
                fontFamily: "'Neue Montreal', sans-serif",
                fontWeight: 600,
                fontSize: 15,
                textDecoration: "none",
                display: "inline-block",
                border: "1px solid rgba(255,244,227,0.3)",
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
