// app/pricing/page.tsx
// Studio-wide pricing. Publishing real numbers is itself a positioning move:
// most Atlanta studios gate price behind a call, and "how much does a website
// cost in Atlanta" is already one of our best-performing search terms.

import type { Metadata } from "next";
import PricingContent from "./PricingContent";
import { FLOOR, CEILING, TIERS, RETAINER, fmt } from "@/lib/pricing";

const URL = "https://www.rovstudios.com/pricing";

export const metadata: Metadata = {
  title: "Pricing | Range of View Studios",
  description: `What working with us costs, published up front. Projects run ${fmt(
    FLOOR
  )} to ${fmt(CEILING)}, retainers from ${fmt(
    RETAINER.priceFrom
  )} a month, and media by the day. No call required to find out.`,
  alternates: { canonical: URL },
  openGraph: {
    title: "Pricing | Range of View Studios",
    description: `Projects from ${fmt(FLOOR)}. Real numbers, published, no call required.`,
    url: URL,
    siteName: "Range of View Studios",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing | Range of View Studios",
    description: `Projects from ${fmt(FLOOR)}. Real numbers, published, no call required.`,
  },
};

// Offer schema so the published prices are machine-readable. Search and AI
// assistants answering "what does an Atlanta studio charge" can only cite a
// number they can parse, and this page exists largely to be that citation.
function schema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Brand experience design and build",
    provider: {
      "@type": "Organization",
      name: "Range of View Studios",
      url: "https://www.rovstudios.com",
    },
    areaServed: { "@type": "City", name: "Atlanta" },
    offers: [
      ...TIERS.map((t) => ({
        "@type": "Offer",
        name: t.name,
        description: t.tagline,
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "PriceSpecification",
          minPrice: t.priceFrom,
          maxPrice: t.priceTo,
          priceCurrency: "USD",
        },
      })),
      {
        "@type": "Offer",
        name: RETAINER.name,
        description: RETAINER.tagline,
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          minPrice: RETAINER.priceFrom,
          maxPrice: RETAINER.priceTo,
          priceCurrency: "USD",
          unitText: "MONTH",
        },
      },
    ],
  };
}

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema()) }}
      />
      <PricingContent />
    </>
  );
}
