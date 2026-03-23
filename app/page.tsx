import type { Metadata } from "next";
import HomeContent from "./HomeContent";

export const metadata: Metadata = {
  title: "Range of View Studios | Creative Production Agency in Atlanta",
  description:
    "Range of View Studios is an Atlanta-based creative production agency offering sound engineering, web development, video production, and custom AI automation services.",
  alternates: { canonical: "https://rovstudios.com" },
  openGraph: {
    title: "Range of View Studios | Creative Production Agency in Atlanta",
    description:
      "Sound engineering, web development, video production, and AI automation under one roof.",
    url: "https://rovstudios.com",
    images: [{ url: "/og/og-home.jpg", width: 1200, height: 630, alt: "Range of View Studios homepage" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Range of View Studios | Creative Production Agency in Atlanta",
    description:
      "Sound engineering, web development, video production, and AI automation under one roof.",
    images: ["/og/og-home.jpg"],
  },
};

export default function Home() {
  return (
    <>
      {/* Server-rendered content for crawlers and AI engines */}
      <section className="sr-only" aria-label="About Range of View Studios">
        <h1>Range of View Studios - Creative Production Agency in Atlanta</h1>
        <p>
          Range of View Studios is a full-service creative production agency in Atlanta, Georgia.
          We specialize in professional sound engineering and music production, custom web development,
          cinematic video production, and AI automation solutions. Our team has delivered measurable
          results for clients including The Bando (60% bounce rate reduction), DKM Corp (global
          digital infrastructure), and Aysegul Ikna (30% sales increase through digital transformation).
        </p>
        <p>
          Our sound engineering services include mixing and mastering at $50 per song with a 48-hour
          turnaround. We offer in-house recording with premium equipment from UAD, Waves, FabFilter,
          Neumann, and Focusrite. Student rates are available. Web development projects range from
          $2,000 to $10,000+ with 6-8 week delivery using Next.js. Video production covers brand
          videos, real estate walkthroughs, drone cinematography, and music videos. Our AI automation
          solutions handle lead follow-up, appointment scheduling, customer support, and content
          generation with 4-8 week delivery.
        </p>
      </section>
      <HomeContent />
    </>
  );
}
