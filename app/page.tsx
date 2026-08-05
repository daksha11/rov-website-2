import type { Metadata } from "next";
import HomeContent from "./HomeContent";

export const metadata: Metadata = {
  title: "Range of View Studios | Creative Production Agency in Atlanta",
  description:
    "Range of View Studios is an Atlanta-based creative production agency offering custom web development, video production, and AI automation services.",
  alternates: { canonical: "https://www.rovstudios.com" },
  openGraph: {
    title: "Range of View Studios | Creative Production Agency in Atlanta",
    description:
      "Web development, video production, and AI automation under one roof.",
    url: "https://www.rovstudios.com",
    images: [{ url: "/og/og-home.webp", width: 1200, height: 630, alt: "Range of View Studios homepage" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Range of View Studios | Creative Production Agency in Atlanta",
    description:
      "Web development, video production, and AI automation under one roof.",
    images: ["/og/og-home.webp"],
  },
};

export default function Home() {
  return (
    <>
      {/* Server-rendered content for crawlers and AI engines */}
      <section className="sr-only" aria-label="About Range of View Studios">
        <h1>Range of View Studios - Creative Production Agency in Atlanta</h1>
        <p>
          Range of View Studios is a creative production agency in Atlanta, Georgia.
          We specialize in custom web development, cinematic video production, and AI
          automation solutions. Our team has delivered measurable results for clients
          including The Bando (60% bounce rate reduction), DKM Corp (global digital
          infrastructure), and Aysegul Ikna (30% sales increase through digital transformation).
        </p>
        <p>
          Projects range from $2,500 to $10,000 with 6-8 week delivery using Next.js.
          A focused fix for one part of the customer journey starts at $2,500, and a
          full build that wires the whole path together runs $5,000 to $10,000. Anything
          larger is phased into stages. Ongoing work is a retainer from $1,000 a month.
          Video production covers brand videos, real estate walkthroughs,
          drone cinematography, and event coverage. Our AI automation solutions handle
          lead follow-up, appointment scheduling, customer support, and content generation
          with 4-8 week delivery.
        </p>
      </section>
      <HomeContent />
    </>
  );
}
