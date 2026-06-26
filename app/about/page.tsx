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
  { name: "Ayush", jobTitle: "Founder & Creative Director" },
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

      <main className="bg-black text-white">
        {/* Server-rendered intro — single H1 for the page, plus crawlable copy
            establishing who runs the studio (E-E-A-T / GEO entity signals). */}
        <section className="max-w-5xl mx-auto px-6 pt-28 pb-12 md:pt-36">
          <p className="uppercase tracking-[0.2em] text-xs text-white/60 mb-4">
            About · Range of View Studios
          </p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            The people behind the work.
          </h1>
          <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-3xl">
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
