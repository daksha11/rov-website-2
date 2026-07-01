import type { Metadata } from "next";
import TeamSection from "@/components/TeamSection";
import Footer from "@/components/Footer";
import { NavigationDock } from "@/components/NavDoc";

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

      <main style={{ background: "#0F0820", color: "#F0E6E0" }}>
        {/* Server-rendered intro — single H1 for the page, plus crawlable copy
            establishing who runs the studio (E-E-A-T / GEO entity signals).
            Set in the CTRL-A house type on the dark cosmic ground. */}
        <section className="max-w-6xl mx-auto px-6 pt-28 pb-10 md:pt-36 md:pb-14">
          <span style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
            <span aria-hidden style={{ width: 18, height: 2, background: "#A56A67", flexShrink: 0 }} />
            <span style={{ fontFamily: "'Neue Montreal', 'Helvetica Neue', Arial, sans-serif", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "#A56A67" }}>
              About · Range of View Studios
            </span>
          </span>
          <h1 style={{ fontFamily: "'Neue Montreal', 'Helvetica Neue', Arial, sans-serif", fontWeight: 800, fontSize: "clamp(40px,7vw,84px)", lineHeight: 0.94, letterSpacing: "-0.03em", color: "#F0E6E0", margin: "18px 0 0", maxWidth: 900 }}>
            The people behind the work<span style={{ color: "#A56A67" }}>.</span>
          </h1>
          <p style={{ fontFamily: "'Instrument Serif', Georgia, 'Times New Roman', serif", fontSize: "clamp(18px,2.1vw,25px)", lineHeight: 1.55, color: "rgba(240,230,224,0.78)", margin: "22px 0 0", maxWidth: 760 }}>
            Range of View Studios is an Atlanta-based creative production agency. We are a team of
            founders, designers, developers, video producers, and strategists who build brands,
            websites, films, and AI systems end to end. Every project is led by named people with
            real craft, from sound engineering and web development to motion, photography, and
            artist development.
          </p>
        </section>

        <TeamSection />
        <Footer />
      </main>
    </>
  );
}
