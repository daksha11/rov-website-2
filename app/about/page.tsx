import type { Metadata } from "next";
import Image from "next/image";
import TeamSection from "@/components/sections/TeamSection";
import Footer from "@/components/sections/Footer";
import { NavigationDock } from "@/components/sections/NavDoc";
import GradientBlob from "@/components/effects/GradientBlob";

export const metadata: Metadata = {
  title: "About & Team",
  description:
    "Meet the team behind Range of View Studios — an Atlanta-based creative production agency. Founders, designers, developers, and producers behind our sound, web, video, and AI work.",
  alternates: { canonical: "https://www.rovstudios.com/about" },
  openGraph: {
    title: "About & Team | Range of View Studios",
    description:
      "Meet the people behind Range of View Studios — an Atlanta-based creative production agency.",
    url: "https://www.rovstudios.com/about",
    images: [{ url: "/og/og-default.webp", width: 1200, height: 630, alt: "Range of View Studios team" }],
  },
};

// Named leadership — emitted as Person entities so search engines and AI answer
// engines can attribute the studio's work to real, credentialed people (E-E-A-T).
const LEADERSHIP = [
  { name: "Ayush Basu", jobTitle: "Founder & Creative Director" },
  { name: "Suchet", jobTitle: "Co-Founder & Systems Architect" },
  { name: "Kavya", jobTitle: "Director of Design" },
  { name: "Daksha", jobTitle: "Head of Development" },
];

function PeopleSchema() {
  const graph = LEADERSHIP.map((p) => ({
    "@context": "https://schema.org",
    "@type": "Person",
    name: p.name,
    jobTitle: p.jobTitle,
    url: "https://www.rovstudios.com/about",
    worksFor: {
      "@type": "Organization",
      name: "Range of View Studios",
      url: "https://www.rovstudios.com",
    },
  }));
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

export default function AboutPage() {
  return (
    <>
      <PeopleSchema />
      <NavigationDock />

      <main style={{ background: "#0A0604", color: "#FFF4E3" }}>
        {/* Server-rendered intro — single H1 for the page, plus crawlable copy
            establishing who runs the studio (E-E-A-T / GEO entity signals).
            Set in the ROV house type on the warm-earth ground: Norwige display,
            Inter body, and the ember gradient as the single accent. */}
        <section className="relative overflow-hidden" style={{ borderBottom: "1px solid rgba(255,244,227,0.1)" }}>
          <GradientBlob position="top-left" size="clamp(22rem,44vw,42rem)" blur="clamp(6rem,12vw,12rem)" opacity={0.5} />
          <GradientBlob position="bottom-right" size="clamp(20rem,40vw,38rem)" blur="clamp(6rem,12vw,12rem)" opacity={0.4} />
          {/* faint studio logo watermark — sits behind the headline for depth */}
          <Image
            src="/brand/rov-logo.webp"
            alt=""
            aria-hidden
            width={520}
            height={520}
            priority
            style={{ position: "absolute", top: "clamp(20px,4vw,60px)", right: "clamp(-40px,-2vw,20px)", width: "clamp(260px,34vw,520px)", height: "auto", opacity: 0.05, objectFit: "contain", pointerEvents: "none", userSelect: "none", zIndex: 0 }}
          />

          <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-12 md:pt-36 md:pb-16">
            {/* eyebrow row — label left, place-and-scope meta right */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
                <span aria-hidden style={{ width: 22, height: 2, background: "linear-gradient(90deg, #EA9A61, #A64D2B)", flexShrink: 0 }} />
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: "0.24em", textTransform: "uppercase", color: "#EA9A61" }}>
                  About · Range of View Studios
                </span>
              </span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,244,227,0.42)" }}>
                Atlanta, Georgia · Working worldwide
              </span>
            </div>

            <h1 style={{ fontFamily: "'Norwige', 'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: "clamp(46px,8vw,98px)", lineHeight: 0.98, letterSpacing: "-0.03em", color: "#FFF4E3", margin: "clamp(28px,4vw,44px) 0 0", maxWidth: 980 }}>
              The people behind{" "}
              <span style={{ background: "linear-gradient(100deg, #EA9A61 0%, #C06A38 55%, #A64D2B 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent" }}>the work.</span>
            </h1>

            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "clamp(17px,2vw,22px)", lineHeight: 1.62, color: "rgba(255,244,227,0.72)", margin: "clamp(22px,3vw,30px) 0 0", maxWidth: 720 }}>
              Range of View Studios is an Atlanta-based creative production agency. Founders, designers,
              developers, producers, and strategists who build brands, websites, films, and AI systems
              end to end. Every project is led by named people with real craft.
            </p>

            {/* practice-area strip — the four disciplines, hairline-framed */}
            <div className="hero-practice">
              {[
                "Brand & Identity",
                "Web & Interactive",
                "Video & Motion",
                "Creative Tech & AI",
              ].map((area, i) => (
                <div key={area} className="hero-practice__item">
                  <span className="hero-practice__idx">{String(i + 1).padStart(2, "0")}</span>
                  <span className="hero-practice__label">{area}</span>
                </div>
              ))}
            </div>
          </div>

          <style>{`
            .hero-practice {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 1px;
              margin-top: clamp(36px, 5vw, 56px);
              background: rgba(255, 244, 227, 0.12);
              border: 1px solid rgba(255, 244, 227, 0.12);
              border-radius: 16px;
              overflow: hidden;
            }
            @media (min-width: 768px) {
              .hero-practice { grid-template-columns: repeat(4, 1fr); }
            }
            .hero-practice__item {
              position: relative;
              background: #0A0604;
              padding: clamp(18px, 2.4vw, 28px) clamp(16px, 2vw, 24px);
              display: flex;
              flex-direction: column;
              gap: 12px;
              transition: background 0.45s ease;
            }
            .hero-practice__item::after {
              content: "";
              position: absolute;
              left: clamp(16px, 2vw, 24px);
              bottom: 0;
              height: 2px;
              width: 0;
              background: linear-gradient(90deg, #EA9A61, #A64D2B);
              transition: width 0.5s ease;
            }
            .hero-practice__item:hover { background: #140C06; }
            .hero-practice__item:hover::after { width: 34px; }
            .hero-practice__idx {
              font-family: 'Inter', sans-serif;
              font-size: 11px;
              letter-spacing: 0.18em;
              color: #EA9A61;
            }
            .hero-practice__label {
              font-family: 'Norwige', 'Playfair Display', Georgia, serif;
              font-weight: 700;
              font-size: clamp(15px, 1.5vw, 19px);
              letter-spacing: -0.01em;
              line-height: 1.12;
              color: #FFF4E3;
            }
          `}</style>
        </section>

        <TeamSection />
        <Footer />
      </main>
    </>
  );
}
