import type { Metadata } from "next";
import ArticleBody from "./ArticleBody";
import { FAQS } from "./content";

const URL = "https://www.rovstudios.com/web/skills-that-matter-in-the-ai-era";

export const metadata: Metadata = {
  title: "What Skills Actually Matter in the AI Era?",
  description:
    "AI made building the easy part. The skills that matter now are planning, systems thinking, judgment, and human skills like sales and speaking. Here is what to learn.",
  alternates: { canonical: URL },
  openGraph: {
    title: "What Skills Actually Matter in the AI Era? | Range Of View Studios",
    description:
      "Execution stopped being the bottleneck. The leverage moved to direction and human skills. A builder's honest take on what to learn in the age of AI.",
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
      headline: "What Skills Actually Matter in the AI Era?",
      description:
        "AI made building the easy part. The skills that matter now are planning, systems thinking, judgment, and human skills like sales and speaking.",
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
      datePublished: "2026-07-20",
      dateModified: "2026-07-20",
      mainEntityOfPage: URL,
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "ROV Studios", item: "https://www.rovstudios.com" },
        { "@type": "ListItem", position: 2, name: "Web Design", item: "https://www.rovstudios.com/web" },
        { "@type": "ListItem", position: 3, name: "What Skills Matter in the AI Era?", item: URL },
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
