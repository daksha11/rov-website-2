import type { Metadata } from "next";
import ArticleBody from "./ArticleBody";
import { FAQS } from "./content";

const URL = "https://www.rovstudios.com/web/missed-call-text-back-atlanta-hvac";

export const metadata: Metadata = {
  title: "Missed-Call Text-Back for Atlanta HVAC (+ Website) | ROV Studios",
  description:
    "When your crew is on a job, the call you miss goes to the next truck in the homeowner's phone. Missed-call text-back replies in under 30 seconds and keeps the job yours, on a website built to get you found. Here is how it works and what it costs in Atlanta.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Missed-Call Text-Back for Atlanta HVAC Companies",
    description:
      "The call you miss on a job goes to the next truck. A text back in under 30 seconds keeps it yours. How missed-call text-back and a website work together for Atlanta HVAC.",
    url: URL,
    type: "article",
    images: ["/og/og-ai.webp"],
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
      headline: "Missed-Call Text-Back for Atlanta HVAC Companies",
      description:
        "How missed-call text-back and a website built to get you found keep the calls you cannot answer from going to the next truck.",
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
      datePublished: "2026-07-05",
      dateModified: "2026-07-05",
      mainEntityOfPage: URL,
    },
    {
      "@type": "Service",
      serviceType: "Missed-call text-back automation and website for HVAC companies",
      provider: { "@type": "Organization", name: "ROV Studios" },
      areaServed: {
        "@type": "City",
        name: "Atlanta",
        containedInPlace: { "@type": "State", name: "Georgia" },
      },
      offers: {
        "@type": "Offer",
        price: "750",
        priceCurrency: "USD",
        description:
          "$750 build fee for the website and missed-call text-back system, 30 days free, then $1,000/month with a three-month minimum.",
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "ROV Studios", item: "https://www.rovstudios.com" },
        { "@type": "ListItem", position: 2, name: "Web Design", item: "https://www.rovstudios.com/web" },
        { "@type": "ListItem", position: 3, name: "Missed-Call Text-Back for Atlanta HVAC", item: URL },
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
