import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import {
  getAllIndustries,
  getIndustryBySlug,
} from "@/lib/industries";
import { ServiceSchema } from "@/components/schema/ServiceSchema";
import { FAQPageSchema } from "@/components/schema/FAQPageSchema";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
// Above-the-fold: rendered statically for a fast, text-first first paint.
import { IndustryHero } from "@/components/industries/IndustryHero";
import { IndustryStats } from "@/components/industries/IndustryStats";
import {
  webTestimonials,
  videoTestimonials,
  type Testimonial,
  type ServiceVariant,
} from "@/data/testimonials";
import { webDevSteps } from "@/data/approach-steps";

/**
 * Per-page art direction. The six pages share a compositional grammar but each
 * places the marquee, pull-quote, and ghost word in a different spot so a
 * visitor comparing two feels a family resemblance, not a template.
 */
type ArtDirection = {
  ghostWord: string;
  marqueePos: "top" | "afterShowcase" | "beforeCta";
  pullQuotePos: "afterStats" | "afterPains" | "afterVisual" | "afterShowcase";
  pullQuoteAlign: "left" | "right";
  /**
   * The proof story on these pages can sprawl across four separate bands:
   * Showcase, ProjectStrip, Proof, and Testimonials, then a tall generic
   * "how we work" Approach band. A page can opt out of the generic ones so it
   * reads as ONE tight proof sequence (Showcase → Proof) rather than five
   * scattered "trust us" moments. All default to shown; omit to keep them.
   */
  showProjectStrip?: boolean;
  showApproach?: boolean;
};
const ART: Record<string, ArtDirection> = {
  "restaurants-atlanta": { ghostWord: "RESTAURANTS", marqueePos: "beforeCta", pullQuotePos: "afterStats", pullQuoteAlign: "left" },
  "tech-companies-atlanta": { ghostWord: "PRODUCT", marqueePos: "afterShowcase", pullQuotePos: "afterVisual", pullQuoteAlign: "left" },
  "beltline-atlanta": { ghostWord: "BELTLINE", marqueePos: "top", pullQuotePos: "afterShowcase", pullQuoteAlign: "left", showProjectStrip: false, showApproach: false },
  "home-services-atlanta": { ghostWord: "TRADES", marqueePos: "beforeCta", pullQuotePos: "afterPains", pullQuoteAlign: "left" },
  "real-estate-agents-atlanta": { ghostWord: "LISTINGS", marqueePos: "afterShowcase", pullQuotePos: "afterVisual", pullQuoteAlign: "left" },
  "real-estate-developers-atlanta": { ghostWord: "DEVELOPMENTS", marqueePos: "beforeCta", pullQuotePos: "afterShowcase", pullQuoteAlign: "left" },
};
const DEFAULT_ART: ArtDirection = {
  ghostWord: "",
  marqueePos: "beforeCta",
  pullQuotePos: "afterVisual",
  pullQuoteAlign: "left",
};

/**
 * Testimonials that honestly fit each page. web/brand quotes suit
 * restaurants (The Bando is a restaurant), tech, and Beltline storefronts;
 * the real-estate video quote (a home sold off a listing film) suits agents
 * and developers. Home services has no honestly-fitting quote, so it is null
 * and the section is skipped there.
 */
const TESTIMONIALS: Record<
  string,
  { data: Testimonial[]; variant: ServiceVariant } | null
> = {
  "restaurants-atlanta": { data: webTestimonials, variant: "web" },
  "tech-companies-atlanta": { data: webTestimonials, variant: "web" },
  // Consolidated into a single proof sequence (Showcase → Proof); the generic
  // web quote is dropped here so Beltline has one clean "trust us" moment.
  "beltline-atlanta": null,
  "real-estate-agents-atlanta": { data: videoTestimonials, variant: "video" },
  "real-estate-developers-atlanta": { data: videoTestimonials, variant: "video" },
  "home-services-atlanta": null,
};

// ── Below-the-fold: dynamically imported with dark loading placeholders
//    (WebContent parity). Content-bearing sections keep default SSR so the
//    prose + FAQ stay in the server HTML for GEO/AEO; only the interactive
//    calculator and the client-only shell are ssr:false. ──────────────────
// Dark loading placeholder factory (WebContent parity). `next/dynamic` requires
// the options argument to be an object literal, so each call passes an inline
// `{ loading: dl("...") }` where dl() returns the placeholder component.
const dl = (min: string) =>
  function DarkLoading() {
    return (
      <div
        className="bg-black flex items-center justify-center"
        style={{ minHeight: min }}
      >
        <div className="text-white/40 text-sm">Loading...</div>
      </div>
    );
  };

const IndustryPains = dynamic(
  () => import("@/components/industries/IndustryPains").then((m) => ({ default: m.IndustryPains })),
  { loading: dl("50vh") }
);
const IndustryCalculator = dynamic(
  () => import("@/components/industries/IndustryCalculator"),
  { loading: dl("40vh") }
);
const IndustryVisual = dynamic(
  () => import("@/components/industries/IndustryVisual").then((m) => ({ default: m.IndustryVisual })),
  { loading: dl("50vh") }
);
const IndustryServices = dynamic(
  () => import("@/components/industries/IndustryServices").then((m) => ({ default: m.IndustryServices })),
  { loading: dl("40vh") }
);
const IndustryShowcase = dynamic(
  () => import("@/components/industries/IndustryShowcase").then((m) => ({ default: m.IndustryShowcase })),
  { loading: dl("60vh") }
);
const IndustryBody = dynamic(
  () => import("@/components/industries/IndustryBody").then((m) => ({ default: m.IndustryBody })),
  { loading: dl("60vh") }
);
const IndustryProof = dynamic(
  () => import("@/components/industries/IndustryProof").then((m) => ({ default: m.IndustryProof })),
  { loading: dl("40vh") }
);
const IndustryCTA = dynamic(
  () => import("@/components/industries/IndustryCTA").then((m) => ({ default: m.IndustryCTA })),
  { loading: dl("60vh") }
);
const IndustryMarquee = dynamic(
  () => import("@/components/industries/IndustryMarquee").then((m) => ({ default: m.IndustryMarquee }))
);
const IndustryPullQuote = dynamic(
  () => import("@/components/industries/IndustryPullQuote").then((m) => ({ default: m.IndustryPullQuote }))
);
const TestimonialsSection = dynamic(
  () => import("@/components/common/TestimonialsSection"),
  { loading: dl("50vh") }
);
const OurApproachSection = dynamic(
  () => import("@/components/common/OurApproachSection"),
  { loading: dl("50vh") }
);
const ProjectStrip = dynamic(() => import("@/components/sections/ProjectStrip"), { loading: dl("40vh") });
const FAQSection = dynamic(() => import("@/components/common/FAQSection"), { loading: dl("40vh") });

const NavigationDock = dynamic(
  () =>
    import("@/components/sections/NavDoc").then((mod) => ({
      default: mod.NavigationDock,
    })),
  { ssr: false }
);

const Footer = dynamic(() => import("@/components/sections/Footer"), {
  ssr: false,
});

const BASE = "https://www.rovstudios.com";

export function generateStaticParams() {
  // Drafts (indexed:false) are still statically built for outreach links.
  return getAllIndustries().map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const page = await getIndustryBySlug(params.slug);
  if (!page) return { title: "Page Not Found" };

  const canonical = `${BASE}/industries/${page.slug}`;
  const og = page.coverImage || "/og/og-default.webp";

  return {
    title: page.seoTitle ?? page.title,
    description: page.description,
    alternates: { canonical },
    // Phase 1 / Phase 2 switch: noindex whenever indexed is false.
    robots: page.indexed
      ? undefined
      : { index: false, follow: false },
    openGraph: {
      title: `${page.title} | Range of View Studios`,
      description: page.description,
      url: canonical,
      type: "website",
      images: [{ url: og, width: 1200, height: 630, alt: page.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${page.title} | Range of View Studios`,
      description: page.description,
      images: [og],
    },
  };
}

export default async function IndustryPage({
  params,
}: {
  params: { slug: string };
}) {
  const page = await getIndustryBySlug(params.slug);
  if (!page) notFound();

  const serviceType =
    page.industry ? `Creative services for ${page.industry}` : "Creative services";

  const art = ART[page.slug] ?? DEFAULT_ART;
  const marquee =
    page.marquee && page.marquee.length > 0 ? (
      <IndustryMarquee phrases={page.marquee} />
    ) : null;
  const pullQuote = page.pullQuote ? (
    <IndustryPullQuote quote={page.pullQuote} align={art.pullQuoteAlign} />
  ) : null;
  const testimonials = TESTIMONIALS[page.slug] ?? null;

  return (
    <>
      <ServiceSchema
        name={page.title}
        description={page.description}
        serviceType={serviceType}
        url={`/industries/${page.slug}`}
        image={page.coverImage || "/og/og-default.webp"}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "" },
          { name: "Industries", url: "/industries" },
          { name: page.industry, url: `/industries/${page.slug}` },
        ]}
      />
      {page.faqs.length > 0 && (
        <FAQPageSchema
          faqs={page.faqs.map((f) => ({ question: f.q, answer: f.a }))}
        />
      )}

      <main style={{ background: "#000000" }}>
        <IndustryHero page={page} />
        {art.marqueePos === "top" && marquee}
        <IndustryStats stats={page.stats} />
        {art.pullQuotePos === "afterStats" && pullQuote}
        <IndustryPains pains={page.pains} />
        {art.pullQuotePos === "afterPains" && pullQuote}
        {/* "Feel the cost" — interactive estimate right after the pains. */}
        {page.calculator && (
          <IndustryCalculator calculator={page.calculator} icpSlug={page.slug} />
        )}
        <IndustryVisual visual={page.visual} icpSlug={page.slug} />
        {art.pullQuotePos === "afterVisual" && pullQuote}
        <IndustryServices services={page.services} />
        <IndustryShowcase
          items={page.showcase}
          heading={page.showcaseHeading ?? "See it in the wild"}
          ghostWord={art.ghostWord}
        />
        {art.marqueePos === "afterShowcase" && marquee}
        {art.pullQuotePos === "afterShowcase" && pullQuote}
        <IndustryBody htmlContent={page.htmlContent ?? ""} asides={page.bodyAsides} />
        <IndustryProof proof={page.proof} />
        {testimonials && (
          <TestimonialsSection
            testimonials={testimonials.data}
            variant={testimonials.variant}
          />
        )}
        {art.showProjectStrip !== false && <ProjectStrip />}
        {art.showApproach !== false && (
          <OurApproachSection steps={webDevSteps} />
        )}
        {page.faqs.length > 0 && (
          <FAQSection
            items={page.faqs.map((f) => ({ question: f.q, answer: f.a }))}
          />
        )}
        {art.marqueePos === "beforeCta" && marquee}
        <IndustryCTA cta={page.cta} icpSlug={page.slug} />
      </main>

      <NavigationDock />
      <Footer />
    </>
  );
}
