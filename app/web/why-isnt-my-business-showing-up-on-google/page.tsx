import type { Metadata } from "next";
import ArticleBody from "./ArticleBody";
import { FAQS } from "./content";

const URL = "https://www.rovstudios.com/web/why-isnt-my-business-showing-up-on-google";

export const metadata: Metadata = {
  title: "Why Isn't My Business Showing Up on Google? (Atlanta Fix) | ROV Studios",
  description:
    "Most Atlanta businesses stay invisible on Google because of an unverified Google Business Profile. Here are the six reasons your business is not showing up and how to fix each one.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Why Isn't My Business Showing Up on Google?",
    description:
      "The six reasons Atlanta businesses stay invisible on Google, and how to fix each one. From an agency that took one Atlanta site from 132 to 91,060 page views.",
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
      headline: "Why Isn't My Business Showing Up on Google?",
      description:
        "The six reasons Atlanta businesses stay invisible on Google, and how to fix each one.",
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
      datePublished: "2026-07-01",
      dateModified: "2026-07-02",
      mainEntityOfPage: URL,
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "ROV Studios", item: "https://www.rovstudios.com" },
        { "@type": "ListItem", position: 2, name: "Web Design", item: "https://www.rovstudios.com/web" },
        { "@type": "ListItem", position: 3, name: "Why Isn't My Business Showing Up on Google?", item: URL },
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
