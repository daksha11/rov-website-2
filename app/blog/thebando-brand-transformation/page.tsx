"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { BlogFAQ } from "@/components/blog/BlogFAQ";
import BlogLeadForm from "@/components/blog/BlogLeadForm";

const NavigationDock = dynamic(
  () => import("@/components/sections/NavDoc").then((mod) => ({ default: mod.NavigationDock })),
  { ssr: false }
);
const Footer = dynamic(() => import("@/components/sections/Footer"), { ssr: false });


const TOC = [
  { id: "two-in-one", label: "A museum and a restaurant, in one building" },
  { id: "flattened", label: "How the old site flattened the brand" },
  { id: "the-rebrand", label: "The rebrand, step by step" },
  { id: "first-impression", label: "The brand does its work in seconds" },
  { id: "how-it-held", label: "How the brand held up" },
  { id: "what-this-means", label: "What this means for Atlanta restaurants" },
  { id: "faq", label: "Frequently asked questions" },
];

const STATS = [
  { number: "4:38", label: "Average session time", sub: "People stayed and explored" },
  { number: "46%", label: "Bounce rate", sub: "Down from 94%, fewer instant exits" },
  { number: "+33.5%", label: "Page views", sub: "More of the story seen" },
];

const FAQS = [
  {
    q: "What does a restaurant brand identity actually include?",
    a: "A restaurant brand identity is more than a logo. It is the full visual and verbal system that tells people who you are before they read a word: color, typography, photography, tone, and how all of it is arranged on the page. For TheBando, the identity had to carry two truths at once, a Black history museum and a fried chicken restaurant on Atlanta's Westside, without either one drowning out the other. Good brand work makes both feel intentional instead of accidental.",
  },
  {
    q: "How do you rebrand a restaurant that is also something else?",
    a: "You start by refusing to pick one identity over the other. TheBando is genuinely both a museum and a restaurant, so the rebrand gave the history and the food equal space and let each reinforce the other. The design honored the culture first, then made ordering effortless, so a visitor could learn about the history and order the No Cap without the brand feeling confused or cluttered.",
  },
  {
    q: "How much does a restaurant rebrand cost in Atlanta?",
    a: "Most restaurant brand and website projects through ROV Studios range from $3,000 to $15,000 depending on scope. TheBando's project included brand work, new page architecture, and a mobile-first rebuild. We run a free audit first to see what the brand is already doing well and where it is getting flattened before we quote anything.",
  },
  {
    q: "Does brand identity affect how a restaurant website performs?",
    a: "Yes, directly. A brand that reads clearly in the first few seconds keeps people on the page. After TheBando's rebrand, bounce rate dropped from 94 percent to 46 percent and average session time reached 4 minutes 38 seconds, which means visitors were staying to explore both the museum and the menu. Brand is not decoration. It is the reason someone decides to keep reading.",
  },
  {
    q: "What is the difference between a rebrand and a website redesign?",
    a: "A redesign changes how the site works. A rebrand changes what the site says about who you are. TheBando got both. The brand work honored the dual identity and gave it structure, and the redesign made ordering the easy next step. If you want the revenue-and-ordering side of this story, read the full revenue-and-ordering breakdown on our restaurant redesign case study.",
  },
];

export default function TheBandoBrandTransformationPage() {
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
            <Link href="/web" style={{ color: "inherit", textDecoration: "none" }}>Brand Identity</Link>
            {" · "}Atlanta Restaurants
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
            TheBando: Designing a Brand for a Museum and a Restaurant at Once
          </h1>

          <p style={{ fontSize: 18, lineHeight: 1.65, color: "rgba(255,244,227,0.82)", marginBottom: 36, maxWidth: 600 }}>
            <a href="https://www.thebandoatl.com" target="_blank" rel="noopener noreferrer" style={{ color: "#EA9A61", textDecoration: "underline" }}>TheBando</a> is two things at once, a Black history museum and a fried chicken restaurant on Atlanta&apos;s Westside. Both are real. Both matter. This is the story of how ROV honored that dual identity through design, so the culture and the food could finally share the same page without either one getting lost.
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
              Ayush Basu · Founder & Creative Director, <Link href="/about" style={{ color: "#90422C", textDecoration: "underline" }}>ROV Studios</Link>
            </div>
            <div style={{ color: "rgba(255,244,227,0.45)", fontSize: 13 }}>March 2026 · 6 min read</div>
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

        {/* ── SECTION 1: Two-in-one identity ── */}
        <section id="two-in-one" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 20, lineHeight: 1.2 }}>
            A museum and a restaurant, in one building
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            Terry and Darius built something Atlanta had never quite seen before. Walk into <a href="https://www.thebandoatl.com" target="_blank" rel="noopener noreferrer" style={{ color: "#90422C", textDecoration: "underline", fontWeight: 600 }}>TheBando</a> on the Westside and you are standing inside a Black history museum. Photographs on the walls, murals, culture you can feel. You are also standing inside a fried chicken restaurant, and the smell of the food tells you that just as fast.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            That is the whole idea. Two things Atlanta does better than anywhere else, food and history, living under one roof. Neither one is a gimmick bolted onto the other. The history is real. The chicken is real. People who walk through the door leave talking about both.
          </p>

          {/* Pull quote */}
          <blockquote style={{
            margin: "32px 0",
            padding: "24px 28px",
            borderLeft: "4px solid #EA9A61",
            background: "rgba(234,154,97,0.08)",
            borderRadius: "0 8px 8px 0",
          }}>
            <p style={{ fontFamily: "Norwige, sans-serif", fontSize: 22, lineHeight: 1.5, color: "#3B2114", margin: 0, fontStyle: "italic" }}>
              &ldquo;The food is real. The history is real. A brand that honors one and hides the other is only telling half the truth.&rdquo;
            </p>
          </blockquote>

          <p style={{ fontSize: 17, lineHeight: 1.75 }}>
            A dual identity like this is a gift and a design problem at the same time. Say too little about the museum and you flatten it into just another wings spot. Say too little about the food and you lose the people who came hungry. The brand had to hold both, at full volume, without either one shouting over the other.
          </p>
        </section>

        {/* ── IMAGE 1 ── */}
        <div style={{ margin: "0 -24px 56px", position: "relative", height: "clamp(240px, 40vw, 440px)", overflow: "hidden" }}>
          <Image src="/casestudy/bando/bando2.webp" alt="TheBando interior, an Atlanta Black history museum wall with graffiti art and historical photographs inside the Westside restaurant" fill sizes="(max-width: 768px) 100vw, 720px" style={{ objectFit: "cover" }} />
          <div style={{ position: "absolute", bottom: 16, left: 24, background: "rgba(59,33,20,0.75)", color: "#FFF4E3", fontSize: 12, padding: "6px 12px", borderRadius: 6, backdropFilter: "blur(4px)" }}>
            TheBando&apos;s museum wall. Black history and graffiti art, inside a working restaurant.
          </div>
        </div>

        {/* ── SECTION 2: How the old site flattened the brand ── */}
        <section id="flattened" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 20, lineHeight: 1.2 }}>
            How the old site flattened the brand
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            The building said one thing. The old website said something smaller. All the culture that hit you in the room, the murals, the photographs, the sense that you had walked into a story, did not survive the trip to the screen. Online, TheBando read like a generic restaurant page. The museum was barely there. The food was hard to reach.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            That is what a weak brand does. It takes something specific and makes it look like everything else. A visitor who had never been inside had no way to feel the two-in-one identity, so they had no reason to treat TheBando as anything special.
          </p>

          <div style={{ overflowX: "auto", margin: "32px 0" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
              <thead>
                <tr style={{ background: "#3B2114" }}>
                  {["Brand element", "Old site", "New brand"].map((h) => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#FFF4E3", fontFamily: "'Neue Montreal', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Identity", "Reads as a generic restaurant", "Museum and restaurant, both up front"],
                  ["The history", "Buried, easy to miss", "Given its own space and presence"],
                  ["The food", "Hard to find and order", "Effortless, front-door ordering"],
                  ["First impression", "Flat and forgettable", "Specific to TheBando in seconds"],
                  ["Mobile experience", "Pinch, zoom, hunt", "Fast, clear, culture-first"],
                ].map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "rgba(59,33,20,0.04)" : "transparent" }}>
                    {row.map((cell, j) => (
                      <td key={j} style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid rgba(59,33,20,0.08)",
                        color: j === 2 ? "#90422C" : "#3B2114",
                        fontWeight: j === 2 ? 700 : 400,
                        fontFamily: j === 2 ? "'Neue Montreal', sans-serif" : "inherit",
                      }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p style={{ fontSize: 17, lineHeight: 1.75 }}>
            When ROV started the <Link href="/casestudy/bando" style={{ color: "#90422C", textDecoration: "underline", fontWeight: 600 }}>TheBando brand and website work</Link>, this was the core question. Not how do we make the site prettier, but how do we make the screen finally tell the truth the building already tells.
          </p>
        </section>

        {/* ── IMAGE 2 ── */}
        <div style={{ margin: "0 -24px 56px", position: "relative", height: "clamp(240px, 35vw, 400px)", overflow: "hidden" }}>
          <Image src="/casestudy/bando/bando1.webp" alt="TheBando signature wall, the restaurant name in bold white lettering against vibrant patterned Atlanta wallpaper" fill sizes="(max-width: 768px) 100vw, 720px" style={{ objectFit: "cover" }} />
          <div style={{ position: "absolute", bottom: 16, left: 24, background: "rgba(59,33,20,0.75)", color: "#FFF4E3", fontSize: 12, padding: "6px 12px", borderRadius: 6, backdropFilter: "blur(4px)" }}>
            The signature wall. Bold lettering that anchors the whole visual identity.
          </div>
        </div>

        {/* ── SECTION 3: The rebrand, step by step ── */}
        <section id="the-rebrand" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 12, lineHeight: 1.2 }}>
            The rebrand, step by step
          </h2>
          <p style={{ fontSize: 15, color: "#B16937", marginBottom: 36, fontFamily: "'Neue Montreal', sans-serif" }}>
            Four moves. Culture first, then the food. See the full design breakdown on the <Link href="/casestudy/bando" style={{ color: "#B16937" }}>TheBando case study page</Link>.
          </p>

          {[
            {
              n: "01",
              title: "Honor the dual identity",
              body: "We started from the premise that TheBando is genuinely both a museum and a restaurant, and refused to rank one above the other. The brand system was built to carry both truths at full strength, so a first-time visitor online feels the same two-in-one identity a walk-in feels in the room.",
            },
            {
              n: "02",
              title: "Give the museum and the menu equal space",
              body: "The history got real presence instead of a buried footnote. The food got a clear path instead of a maze. We designed the layout so the cultural experience and the ordering experience each had proper room to breathe, and so exploring one naturally led into the other rather than competing with it.",
            },
            {
              n: "03",
              title: "A mobile-first brand experience",
              body: "Most people meet an Atlanta restaurant on a phone first. In the car, on the Beltline, waiting at Five Points. The old site made mobile users pinch and zoom past the culture to find anything. We rebuilt the mobile experience so the brand lands instantly and the menu is one tap away, no hunting required.",
            },
            {
              n: "04",
              title: "Keep the culture central",
              body: "We never pushed the Black history museum aside to make room for ordering. The redesign gave both sides of the business proper presentation, so visitors can learn the history, feel the culture, and order the No Cap without the brand ever feeling cluttered or confused about what it is.",
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
        </section>

        {/* ── IMAGE 3 ── */}
        <div style={{ margin: "0 -24px 56px", position: "relative", height: "clamp(240px, 35vw, 400px)", overflow: "hidden" }}>
          <Image src="/casestudy/bando/bando4.webp" alt="TheBando colorful mural and seating area, bold artwork that carries the restaurant's Westside Atlanta cultural identity" fill sizes="(max-width: 768px) 100vw, 720px" style={{ objectFit: "cover" }} />
          <div style={{ position: "absolute", bottom: 16, left: 24, background: "rgba(59,33,20,0.75)", color: "#FFF4E3", fontSize: 12, padding: "6px 12px", borderRadius: 6, backdropFilter: "blur(4px)" }}>
            The mural and seating area. Culture you can feel before you order.
          </div>
        </div>

        {/* ── SECTION 4: First impression / brand does its work ── */}
        <section id="first-impression" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 20, lineHeight: 1.2 }}>
            The brand does its work in seconds
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            People decide how they feel about a brand almost instantly. Before they read a menu item, before they scroll, they get a gut read on whether a place feels real and worth their time. For a dual-identity spot like TheBando, that first read has to land both the culture and the food at once, or the whole idea collapses into just another chicken place.
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
              fontSize: "clamp(40px, 10vw, 56px)",
              background: "linear-gradient(135deg, #EA9A61, #90422C)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              lineHeight: 1,
            }}>50ms</div>
            <div>
              <p style={{ color: "#FFF4E3", fontSize: 16, lineHeight: 1.6, margin: 0 }}>
                is how long it takes a visitor to form a first impression of a website, according to research on visual appeal. That is faster than a blink. A brand that reads clearly in that window earns the next scroll. A flat one loses the visit before the food is even mentioned.
              </p>
              <p style={{ color: "rgba(255,244,227,0.8)", fontSize: 12, marginTop: 8, marginBottom: 0 }}>Source: <a href="https://www.google.com/search?q=50+milliseconds+website+first+impression+study" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,244,227,0.8)" }}>Web usability research</a></p>
            </div>
          </div>

          <p style={{ fontSize: 17, lineHeight: 1.75 }}>
            The rebrand was built for that window. The moment someone lands, the identity is unmistakable: this is a museum, this is a restaurant, this is TheBando and nowhere else. The culture is not a slow reveal you have to earn. It is the first thing you feel, and the food is right there behind it.
          </p>
        </section>

        {/* ── IMAGE 4 ── */}
        <div style={{ margin: "0 -24px 56px", position: "relative", height: "clamp(240px, 35vw, 400px)", overflow: "hidden" }}>
          <Image src="/casestudy/bando/bando5.webp" alt="TheBando gallery wall of Black history photographs and graffiti art on exposed brick inside the Atlanta Westside restaurant" fill sizes="(max-width: 768px) 100vw, 720px" style={{ objectFit: "cover" }} />
          <div style={{ position: "absolute", bottom: 16, left: 24, background: "rgba(59,33,20,0.75)", color: "#FFF4E3", fontSize: 12, padding: "6px 12px", borderRadius: 6, backdropFilter: "blur(4px)" }}>
            The gallery wall. Black history photographs and art on exposed brick.
          </div>
        </div>

        {/* ── SECTION 5: How the brand held up ── */}
        <section id="how-it-held" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 12, lineHeight: 1.2 }}>
            How the brand held up
          </h2>
          <p style={{ fontSize: 15, color: "#B16937", marginBottom: 32, fontFamily: "'Neue Montreal', sans-serif" }}>
            The clearest sign a brand is working is that people stay to explore it. TheBando&apos;s did.
          </p>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 28 }}>
            You cannot measure culture directly, but you can measure whether people stick around for it. After the rebrand, the engagement numbers pointed the same direction: visitors were staying longer, bouncing less, and seeing more of the story.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
            {[
              { then: "Average session time", from: "Short", now: "4:38", label: "People stayed to explore both sides" },
              { then: "Bounce rate", from: "94%", now: "46%", label: "Fewer instant back-button exits" },
              { then: "Page views", from: "Baseline", now: "+33.5%", label: "More of the brand actually seen" },
            ].map((item, i) => (
              <div key={i} style={{
                background: "#3B2114",
                borderRadius: 12,
                padding: "24px 20px",
                color: "#FFF4E3",
              }}>
                <div style={{ fontSize: 13, color: "rgba(255,244,227,0.85)", marginBottom: 8, fontFamily: "'Neue Montreal', sans-serif" }}>{item.then}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 20, fontWeight: 700, textDecoration: "line-through", color: "rgba(255,244,227,0.35)" }}>{item.from}</span>
                  <span style={{ color: "#EA9A61", fontSize: 12, fontFamily: "'Neue Montreal', sans-serif" }}>→</span>
                  <span style={{ fontFamily: "Norwige, sans-serif", fontSize: 26, color: "#EA9A61" }}>{item.now}</span>
                </div>
                <div style={{ fontSize: 13, color: "#FFF4E3", fontWeight: 600 }}>{item.label}</div>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            Average session time landed at 4 minutes 38 seconds. Bounce rate dropped from 94 percent to 46 percent. Page views rose 33.5 percent. Those are not vanity numbers. They mean the brand invited people in and gave them a reason to keep looking, at the museum and at the menu both.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75 }}>
            The ordering side of the story is even bigger, but that is a different lever. If you want the revenue-and-ordering breakdown, read <Link href="/blog/restaurant-atlanta" style={{ color: "#90422C", textDecoration: "underline", fontWeight: 600 }}>the full revenue-and-ordering story here</Link>. This page is about the part that came first: getting the brand right.
          </p>
        </section>

        {/* ── IMAGE 5 ── */}
        <div style={{ margin: "0 -24px 56px", position: "relative", height: "clamp(240px, 35vw, 400px)", overflow: "hidden" }}>
          <Image src="/casestudy/bando/bandocrackpic.webp" alt="TheBando signature crack chicken dish on a vintage scale, the fried chicken that shares the brand with the Black history museum" fill sizes="(max-width: 768px) 100vw, 720px" style={{ objectFit: "cover" }} />
          <div style={{ position: "absolute", bottom: 16, left: 24, background: "rgba(59,33,20,0.75)", color: "#FFF4E3", fontSize: 12, padding: "6px 12px", borderRadius: 6, backdropFilter: "blur(4px)" }}>
            The signature dish. The food that shares the brand with the history.
          </div>
        </div>

        {/* ── SECTION 6: What this means ── */}
        <section id="what-this-means" style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Norwige, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#90422C", marginBottom: 20, lineHeight: 1.2 }}>
            What this means for Atlanta restaurants
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            Most Atlanta restaurants have more identity than their website shows. There is a story in the room, in the neighborhood, in the reason the place exists. Buckhead, the Westside, Old Fourth Ward, Summerhill. The character is there. It just gets flattened the moment it hits a generic template.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 20 }}>
            A real brand identity fixes that. It carries what makes you specific onto the screen so a stranger feels it in the first few seconds, the same way a regular feels it walking in. That is the work <Link href="/web" style={{ color: "#90422C", textDecoration: "underline" }}>ROV Studios does on Atlanta restaurant brands</Link>: find the truth of the place and make the design tell it.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 28 }}>
            TheBando had the hardest version of this problem, two full identities to honor at once, and the brand held. A single-identity restaurant is a simpler job, and the payoff is the same: people who feel who you are before they ever taste the food.
          </p>

          <div style={{ background: "rgba(144,66,44,0.08)", border: "1px solid rgba(144,66,44,0.2)", borderRadius: 12, padding: "24px 28px" }}>
            <p style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: 13, fontWeight: 700, color: "#90422C", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>The short version</p>
            <p style={{ fontSize: 16, lineHeight: 1.7, margin: 0 }}>
              TheBando is a Black history museum and a fried chicken restaurant in one building on Atlanta&apos;s Westside. The old site flattened that into a generic restaurant page. The rebrand honored both identities at once, gave the museum and the menu equal space, and kept the culture central. People stayed to explore it: 4 minutes 38 seconds average session, bounce rate down from 94 percent to 46 percent, page views up 33.5 percent. Get the brand right and people feel who you are before they read a word.
            </p>
          </div>
        </section>

        {/* ── RELATED READING ── */}
        <section style={{ marginBottom: 64, padding: "32px 0", borderTop: "1px solid rgba(59,33,20,0.12)", borderBottom: "1px solid rgba(59,33,20,0.12)" }}>
          <p style={{ fontFamily: "'Neue Montreal', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B16937", marginBottom: 20 }}>Related reading</p>
          <div style={{ display: "grid", gap: 16 }}>
            {[
              { href: "/blog/restaurant-atlanta", label: "The revenue-and-ordering breakdown", desc: "The other half of TheBando story. How the redesign drove a 689x jump in online ordering views." },
              { href: "/casestudy/bando", label: "Full TheBando case study", desc: "Complete breakdown of the brand and website work. Every decision, every change, the full data." },
              { href: "/web", label: "ROV Studios web design services", desc: "How we build Atlanta brands and websites. Pricing, timeline, and what to expect from the process." },
              { href: "/ai-automation", label: "AI automations for restaurants", desc: "Missed call text-back, review request automation, follow-up sequences. All running without you." },
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
      <BlogFAQ faqs={FAQS.map((f) => ({ question: f.q, answer: f.a }))} />

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px 80px" }}>

        {/* ── AUTHOR ── */}
        <section style={{ marginBottom: 64, padding: "28px 32px", background: "#3B2114", borderRadius: 16, color: "#FFF4E3" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div style={{ position: "relative", width: 64, height: 64, borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "2px solid rgba(234,154,97,0.4)" }}>
              <Image src="/teammembers/basutm2.webp" alt="Ayush Basu, Founder & Creative Director at ROV Studios" fill sizes="64px" style={{ objectFit: "cover" }} />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 2, color: "#FFF4E3" }}>Ayush Basu</p>
              <p style={{ color: "#EA9A61", fontSize: 13, margin: 0, fontFamily: "'Neue Montreal', sans-serif" }}>
                Founder & Creative Director, <Link href="/about" style={{ color: "#EA9A61" }}>ROV Studios</Link>
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

        {/* ── LEAD FORM CTA ── */}
        <BlogLeadForm
          source="blog:thebando-brand-transformation"
          heading="Does your website tell the truth about your restaurant?"
          subheading="We run free audits for Atlanta restaurants. Tell us where to look and we'll show you where your identity is getting flattened."
          messagePlaceholder="Your restaurant's name, website, and what feels off about how it comes across..."
          secondaryHref="https://calendly.com/rangeofviewmusic/30min"
          secondaryLabel="Prefer to talk? Book a free audit call"
        />

      </div>
      <NavigationDock />
      <Footer />
    </main>
  );
}
