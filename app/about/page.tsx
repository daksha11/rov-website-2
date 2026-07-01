import type { Metadata } from "next";
import TeamSection from "@/components/TeamSection";
import Footer from "@/components/Footer";
import { NavigationDock } from "@/components/NavDoc";
import GradientBlob from "@/components/GradientBlob";

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
        <section className="relative overflow-hidden">
          <GradientBlob position="top-left" size="clamp(22rem,44vw,42rem)" blur="clamp(6rem,12vw,12rem)" opacity={0.5} />
          <GradientBlob position="bottom-right" size="clamp(20rem,40vw,38rem)" blur="clamp(6rem,12vw,12rem)" opacity={0.4} />
          <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-10 md:pt-36 md:pb-14">
            <span style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
              <span aria-hidden style={{ width: 18, height: 2, background: "linear-gradient(90deg, #EA9A61, #A64D2B)", flexShrink: 0 }} />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "#EA9A61" }}>
                About · Range of View Studios
              </span>
            </span>
            <h1 style={{ fontFamily: "'Norwige', 'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: "clamp(40px,7vw,84px)", lineHeight: 1.02, letterSpacing: "-0.02em", color: "#FFF4E3", margin: "18px 0 0", maxWidth: 900 }}>
              The people behind{" "}
              <span style={{ background: "linear-gradient(100deg, #EA9A61 0%, #C06A38 55%, #A64D2B 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent" }}>the work.</span>
            </h1>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "clamp(17px,2vw,22px)", lineHeight: 1.6, color: "rgba(255,244,227,0.74)", margin: "22px 0 0", maxWidth: 760 }}>
              Range of View Studios is an Atlanta-based creative production agency. We are a team of
              founders, designers, developers, video producers, and strategists who build brands,
              websites, films, and AI systems end to end. Every project is led by named people with
              real craft, from sound engineering and web development to motion, photography, and
              artist development.
            </p>
          </div>
        </section>

        <TeamSection />
        <Footer />
      </main>
    </>
  );
}
