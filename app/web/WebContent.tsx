import dynamic from "next/dynamic";
import { NavigationDock } from "@/components/sections/NavDoc";
import Footer from "@/components/sections/Footer";
import ServiceLeadSection from "@/components/sections/ServiceLeadSection";
import WebHero from "@/components/web/WebHero";
import TestimonialsSection from "@/components/common/TestimonialsSection";
import { webTestimonials } from "@/data/testimonials";
import CrossSellNudges from "@/components/common/CrossSellNudges";
import FullViewBand from "@/components/common/FullViewBand";
import ReportCTABand from "@/components/common/ReportCTABand";
import WebGuidesSection from "@/components/web/WebGuidesSection";
import { webFaqItems } from "@/data/faq";
import { webDevSteps } from "@/data/approach-steps";

// Dynamic imports for below-fold heavy components
const FeaturedWorksSection = dynamic(() => import("@/components/web/FeaturedWorksSection"), {
    loading: () => (
        <div className="bg-black min-h-[80vh] flex items-center justify-center">
            <div className="text-white/60 text-sm">Loading...</div>
        </div>
    ),
});

const HaveAnIdeaSection = dynamic(() => import("@/components/web/HaveAnIdeaSection"));

const WebPricingTiers = dynamic(() => import("@/components/web/WebPricingTiers"), {
    loading: () => (
        <div className="bg-black min-h-[40vh] flex items-center justify-center">
            <div className="text-white/60 text-sm">Loading...</div>
        </div>
    ),
});

const BriefCTASection = dynamic(() => import("@/components/common/BriefCTASection"));

const OurApproachSection = dynamic(() => import("@/components/common/OurApproachSection"), {
    loading: () => (
        <div className="bg-black min-h-[40vh] flex items-center justify-center">
            <div className="text-white/60 text-sm">Loading...</div>
        </div>
    ),
});

const FAQSection = dynamic(() => import("@/components/common/FAQSection"), {
    loading: () => (
        <div className="bg-black min-h-[40vh] flex items-center justify-center">
            <div className="text-white/60 text-sm">Loading...</div>
        </div>
    ),
});

export default function WebContent() {
    return (
        <main className="min-h-screen bg-black text-white relative overflow-x-hidden">
            {/* Hero Section */}
            <WebHero />

            {/* Featured Works Section */}
            <FeaturedWorksSection />

            {/* Have an Idea Section */}
            <HaveAnIdeaSection />

            {/* Where a website sits in the wider customer journey. Placed after the
                work and before pricing: they have seen we can build, and this is
                what tells them the site is one moment of five. */}
            <FullViewBand
                heading="A website is two of the five moments that decide whether someone becomes a customer"
                intro="Traffic is not usually the problem. The problem is the gap between someone finding you and someone hearing back, and then the longer gap after that. A site closes the first two. We build the rest too, because a beautiful site attached to a silent inbox still loses the sale."
                owns={["found", "captured"]}
                detail={{
                    found:
                        "Built to be found by search and by AI assistants, and to look like the real thing the second it loads.",
                    captured:
                        "Every page has one clear next step, and the form behind it actually routes somewhere.",
                }}
                closing="The moments a site does not reach are where most of the money leaks."
            />

            {/* Client Testimonials */}
            <TestimonialsSection testimonials={webTestimonials} variant="web" />

            {/* Pricing Tiers */}
            <WebPricingTiers />

            {/* Project brief entry point: right after pricing, where they're deciding */}
            <BriefCTASection service="web" />

            {/* Our Approach Section */}
            <OurApproachSection steps={webDevSteps} />

            {/* Cluster links: the hub pointing down at its /web child guides */}
            <WebGuidesSection />

            {/* The lower-commitment path, right after the guides: someone who
                just read four "here's what's wrong" headlines wants to know
                which one applies to them. */}
            <ReportCTABand
                eyebrow="Free visibility report"
                heading="Not sure which of these is your problem?"
                body="Paste your link and we'll read your site on the spot. Then we go deeper by hand and send back what search and AI assistants say about you, what each gap costs, and what we'd fix first."
                cta="Check my site"
            />

            {/* Cross-Sell Nudges */}
            <CrossSellNudges currentService="web" />

            {/* FAQ Section */}
            <FAQSection items={webFaqItems} />

            {/* Closing lead form */}
            <ServiceLeadSection
                source="services:web"
                heading="Ready to build a site that pulls its weight?"
                subheading="Tell us what you're working with and what you want it to do. We'll tell you honestly what it would take and roughly what it costs. No pitch deck, just a conversation."
                messagePlaceholder="Your current site (if any), what you're trying to fix, and your rough timeline..."
            />

            {/* Navigation Dock */}
            <NavigationDock />

            {/* Footer */}
            <Footer />
        </main>
    );
}
