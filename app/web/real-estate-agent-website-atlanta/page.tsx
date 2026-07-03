import type { Metadata } from "next";
import ArticleBody from "./ArticleBody";
import { FAQS } from "./content";

const URL = "https://www.rovstudios.com/web/real-estate-agent-website-atlanta";

export const metadata: Metadata = {
  title: "Real Estate Agent Website Design in Atlanta (Why Leads Don't Convert) | ROV Studios",
  description:
    "Nearly half of online real estate inquiries never get a reply. Here is why Atlanta agents lose deals after the lead comes in, and the website and follow-up system that fixes it.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Real Estate Agent Website Design in Atlanta (Why Leads Don't Convert)",
    description:
      "48% of online real estate inquiries get no response and the average reply takes 15 hours. Here is the website and follow-up system that turns leads you already have into closings.",
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
      headline: "Real Estate Agent Website Design in Atlanta (Why Leads Don't Convert)",
      description:
        "Why Atlanta real estate agents lose deals after the lead comes in, and the website and follow-up system that fixes it.",
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
          url: "https://www.rovstudios.com/brand/rov-logo.webp",
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
        { "@type": "ListItem", position: 3, name: "Real Estate Agent Website Design in Atlanta", item: URL },
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
