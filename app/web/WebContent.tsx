import dynamic from "next/dynamic";
import { NavigationDock } from "@/components/NavDoc";
import Footer from "@/components/Footer";
import WebHero from "@/components/Web-Dev/WebHero";
import TestimonialsSection from "@/components/common/TestimonialsSection";
import { webTestimonials } from "@/data/testimonials";
import CrossSellNudges from "@/components/common/CrossSellNudges";
import { webFaqItems } from "@/data/faq";
import { webDevSteps } from "@/data/approach-steps";

// Dynamic imports for below-fold heavy components
const FeaturedWorksSection = dynamic(() => import("@/components/Web-Dev/FeaturedWorksSection"), {
    loading: () => (
        <div className="bg-black min-h-[80vh] flex items-center justify-center">
            <div className="text-white/60 text-sm">Loading...</div>
        </div>
    ),
});

const HaveAnIdeaSection = dynamic(() => import("@/components/Web-Dev/HaveAnIdeaSection"));

const WebPricingTiers = dynamic(() => import("@/components/Web-Dev/WebPricingTiers"), {
    loading: () => (
        <div className="bg-black min-h-[40vh] flex items-center justify-center">
            <div className="text-white/60 text-sm">Loading...</div>
        </div>
    ),
});

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

            {/* Client Testimonials */}
            <TestimonialsSection testimonials={webTestimonials} variant="web" />

            {/* Pricing Tiers */}
            <WebPricingTiers />

            {/* Our Approach Section */}
            <OurApproachSection steps={webDevSteps} />

            {/* Cross-Sell Nudges */}
            <CrossSellNudges currentService="web" />

            {/* FAQ Section */}
            <FAQSection items={webFaqItems} />

            {/* Navigation Dock */}
            <NavigationDock />

            {/* Footer */}
            <Footer />
        </main>
    );
}
