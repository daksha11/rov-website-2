import type { Metadata } from "next";

// Client page (design-standard layout uses hooks) can't export metadata, so the
// SEO surface lives here: short title, canonical, and OG/Twitter cards.
export const metadata: Metadata = {
  title: "Creative Studio vs Agency vs Freelancer (2026 Atlanta Guide)",
  description:
    "Creative studio, agency, or freelancer? A clear breakdown of cost, speed, range, and accountability, so Atlanta brands can pick the right one. From Range of View Studios.",
  alternates: {
    canonical: "https://www.rovstudios.com/blog/creative-studio-vs-agency-vs-freelancer",
  },
  openGraph: {
    title: "Creative Studio vs Agency vs Freelancer: What Your Atlanta Brand Needs | Range of View Studios",
    description:
      "Cost, speed, range, and accountability compared across all three, so you can pick the right one for your Atlanta brand.",
    url: "https://www.rovstudios.com/blog/creative-studio-vs-agency-vs-freelancer",
    type: "article",
    images: [
      {
        url: "/heroassets/codingframe.webp",
        width: 1200,
        height: 630,
        alt: "A creative studio team building brand and product work in one place",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Creative Studio vs Agency vs Freelancer (2026 Atlanta Guide) | Range of View Studios",
    description:
      "Cost, speed, range, and accountability compared across all three for Atlanta brands.",
    images: ["/heroassets/codingframe.webp"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
