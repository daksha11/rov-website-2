"use client";

import { NavigationDock } from "@/components/NavDoc";
import Footer from "@/components/Footer";
import OurApproachSection from "@/components/Web-Dev/OurApproachSection";
import FAQBottomSection from "@/components/Web-Dev/FAQBottomSection";
import FeaturedWorksSection from "@/components/Web-Dev/FeaturedWorksSection";
import HaveAnIdeaSection from "@/components/Web-Dev/HaveAnIdeaSection";
import WebHero from "@/components/Web-Dev/WebHero";
import TestimonialsSection from "@/components/common/TestimonialsSection";
import { webTestimonials } from "@/data/testimonials";

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

            {/* Our Approach Section */}
            <OurApproachSection />

            {/* FAQ Section */}
            <FAQBottomSection />

            {/* Navigation Dock */}
            <NavigationDock />

            {/* Footer */}
            <Footer />
        </main>
    );
}
