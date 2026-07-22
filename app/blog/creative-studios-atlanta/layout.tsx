import type { Metadata } from "next";

// The page itself is a client component (design-standard layout uses hooks),
// so it can't export metadata. This server layout supplies the SEO surface:
// a short, non-truncating title, the canonical URL, and OG/Twitter cards.
export const metadata: Metadata = {
  title: "Creative Studios in Atlanta: The Complete 2026 Guide",
  description:
    "What a creative studio actually does, how Atlanta's creative scene works, what to look for, and what it costs in 2026. A practical guide from Range of View Studios.",
  alternates: { canonical: "https://www.rovstudios.com/blog/creative-studios-atlanta" },
  openGraph: {
    title: "Creative Studios in Atlanta: The Complete 2026 Guide | Range of View Studios",
    description:
      "What a creative studio does, how Atlanta's creative scene works, how to choose one, and what it costs in 2026.",
    url: "https://www.rovstudios.com/blog/creative-studios-atlanta",
    type: "article",
    images: [
      {
        url: "/misc/atlskylinefooter.webp",
        width: 1200,
        height: 630,
        alt: "The Atlanta skyline — home to a growing roster of creative studios",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Creative Studios in Atlanta: The Complete 2026 Guide | Range of View Studios",
    description:
      "What a creative studio does, how Atlanta's scene works, how to choose one, and what it costs in 2026.",
    images: ["/misc/atlskylinefooter.webp"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
