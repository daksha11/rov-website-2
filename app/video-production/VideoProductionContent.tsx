import dynamic from "next/dynamic";
import { NavigationDock } from "@/components/NavDoc";
import Footer from "@/components/Footer";
import ProjectStrip from "@/components/ProjectStrip";
import TestimonialsSection from "@/components/common/TestimonialsSection";
import { videoTestimonials } from "@/data/testimonials";
import CrossSellNudges from "@/components/common/CrossSellNudges";
import { videoFaqItems } from "@/data/faq";
import { videoProductionSteps } from "@/data/approach-steps";
import VideoHero from "./VideoHero";

// Dynamic imports for below-fold heavy components
const VideoPortfolioSection = dynamic(() => import("@/components/video-production/VideoPortfolioSection"), {
    loading: () => (
        <div className="bg-black min-h-[40vh] flex items-center justify-center">
            <div className="text-white/60 text-sm">Loading...</div>
        </div>
    ),
});

const PostProductionSection = dynamic(() => import("@/components/video-production/PostProductionSection"), {
    loading: () => (
        <div className="bg-black min-h-[40vh] flex items-center justify-center">
            <div className="text-white/60 text-sm">Loading...</div>
        </div>
    ),
});

const VideoPricingTiers = dynamic(() => import("@/components/video-production/VideoPricingTiers"), {
    loading: () => (
        <div className="bg-black min-h-[40vh] flex items-center justify-center">
            <div className="text-white/60 text-sm">Loading...</div>
        </div>
    ),
});

const SpecialtyPackages = dynamic(() => import("@/components/video-production/SpecialtyPackages"));

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

export default function VideoProductionContent() {
    return (
        <main className="relative min-h-screen bg-black text-[#FFF4E3]">
            <NavigationDock />

            {/* Video Carousel Hero Section */}
            <VideoHero />

            {/* Portfolio Showcase — Real Estate & Events */}
            <VideoPortfolioSection />

            {/* Post Production — Color vs Log Toggle */}
            <PostProductionSection />

            {/* Client Testimonials */}
            <TestimonialsSection testimonials={videoTestimonials} variant="video" />

            {/* Specialty Packages */}
            <SpecialtyPackages />

            {/* Pricing Tiers */}
            <VideoPricingTiers />

            {/* Project Strip CTA */}
            <ProjectStrip />

            {/* Cross-Sell Nudges */}
            <CrossSellNudges currentService="video-production" />

            {/* Our Approach Section */}
            <OurApproachSection steps={videoProductionSteps} buttonVariant="gradient" />

            {/* FAQ Section */}
            <FAQSection items={videoFaqItems} />

            <Footer />
        </main>
    );
}
