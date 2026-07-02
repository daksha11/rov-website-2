import type { Metadata } from "next";
import ArticleBody from "./ArticleBody";
import { FAQS } from "./content";

const URL = "https://www.rovstudios.com/web/how-much-does-a-website-cost-in-atlanta";

export const metadata: Metadata = {
  title: "How Much Does a Website Cost in Atlanta? (Real 2026 Prices) | ROV Studios",
  description:
    "A small business website in Atlanta typically costs $2,000 to $5,000 in 2026. Here is what moves the price, what a cheap website really costs you, and how to know what to pay.",
  alternates: { canonical: URL },
  openGraph: {
    title: "How Much Does a Website Cost in Atlanta? (Real 2026 Prices)",
    description:
      "Real Atlanta website pricing for 2026, what drives the cost, and why the cheapest site is often the one you pay for twice. From the agency that took one Atlanta site from 132 to 91,060 page views.",
    url: URL,
    type: "article",
    images: ["/og/og-web.webp"],
  },
};

// Structured data for GEO/AEO: FAQPage powers featured-snippet and AI-citation
// pulls, Article carries author/date E-E-A-T, BreadcrumbList mirrors the nav.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@type": "Article",
      headline: "How Much Does a Website Cost in Atlanta?",
      description:
        "Real Atlanta website pricing for 2026, what drives the cost, and how to know what to pay.",
      author: {
        "@type": "Person",
        name: "Suchet Konda",
        jobTitle: "Co-Founder and Systems Architect",
        url: "https://www.rovstudios.com/about",
      },
      publisher: {
        "@type": "Organization",
        name: "ROV Studios",
        logo: {
          "@type": "ImageObject",
          url: "https://www.rovstudios.com/rov-logo.webp",
        },
      },
      datePublished: "2026-07-02",
      dateModified: "2026-07-02",
      mainEntityOfPage: URL,
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "ROV Studios", item: "https://www.rovstudios.com" },
        { "@type": "ListItem", position: 2, name: "Web Design", item: "https://www.rovstudios.com/web" },
        { "@type": "ListItem", position: 3, name: "How Much Does a Website Cost in Atlanta?", item: URL },
      ],
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleBody />
    </>
  );
}
