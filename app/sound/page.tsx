import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { MusicNav } from "@/components/music/MusicNav";
import MusicFooter from "@/components/music/MusicFooter";
import SoundHero from "@/components/sound/SoundHero";
import Gallery from "@/components/sections/Gallery";
import TestimonialsSection from "@/components/common/TestimonialsSection";
import { soundTestimonials } from "@/data/testimonials";
import { soundFaqItems } from "@/data/faq";
import { VideoSchema } from "@/components/schema/VideoSchema";
import { ServiceSchema } from "@/components/schema/ServiceSchema";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { FAQPageSchema } from "@/components/schema/FAQPageSchema";

// rovmusic.com is served from this same app via a host rewrite (see middleware.ts).
// This page is the rovmusic home, so all of its SEO points at rovmusic, not studios.
const MUSIC_URL = "https://www.rovmusic.com";

export const metadata: Metadata = {
    title: { absolute: "Mixing & Mastering in Atlanta | Range of View Music" },
    description:
        "Professional sound engineering, mixing, and mastering by Range of View Music. Mix and master starting at $50/song. 48-hour turnaround. Atlanta.",
    alternates: { canonical: MUSIC_URL },
    openGraph: {
        title: "Mixing & Mastering in Atlanta | Range of View Music",
        description: "Professional mixing, mastering, and sound engineering. Start at $50/song.",
        url: MUSIC_URL,
        images: [{ url: `${MUSIC_URL}/og/og-sound.webp`, width: 1200, height: 630, alt: "Range of View Music studio" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Mixing & Mastering in Atlanta | Range of View Music",
        description: "Professional mixing, mastering, and sound engineering. Start at $50/song.",
        images: [`${MUSIC_URL}/og/og-sound.webp`],
    },
};

// Dynamic imports for heavy components
const MusicPlayer = dynamic(() => import("@/components/sound/MusicPlayer"), {
    loading: () => (
        <div className="bg-black min-h-[70vh] flex items-center justify-center">
            <div className="text-white/60 text-sm">Loading player...</div>
        </div>
    ),
    ssr: false,
});

const PathFork = dynamic(() => import("@/components/sound/PathFork"));

const IntroOffer = dynamic(() => import("@/components/sound/IntroOffer"));

const StudioSection = dynamic(() => import("@/components/sound/StudioSection"), {
    loading: () => (
        <div className="bg-black min-h-[40vh] flex items-center justify-center">
            <div className="text-white/60 text-sm">Loading...</div>
        </div>
    ),
});

const SavingsCalculator = dynamic(() => import("@/components/sound/SavingsCalculator"), {
    loading: () => (
        <div className="bg-black min-h-[40vh] flex items-center justify-center">
            <div className="text-white/60 text-sm">Loading...</div>
        </div>
    ),
    ssr: false,
});
const PricingTiers = dynamic(() => import("@/components/sound/PricingTiers"));
const CreativeAddOns = dynamic(() => import("@/components/sound/CreativeAddOns"));
// const StudioSetupSection = dynamic(() => import("@/components/sound/StudioSetup"));

const VideoShowcaseSection = dynamic(() => import("@/components/sound/VideoShowcaseSection"), {
    loading: () => (
        <div className="bg-black min-h-[40vh] flex items-center justify-center">
            <div className="text-white/60 text-sm">Loading...</div>
        </div>
    ),
});

const DDKFeatureTestimonial = dynamic(() => import("@/components/sound/DDKFeatureTestimonial"), {
    loading: () => (
        <div className="bg-[#080807] min-h-[40vh] flex items-center justify-center">
            <div className="text-white/30 text-sm">Loading...</div>
        </div>
    ),
    ssr: false,
});

const TagorePartnership = dynamic(() => import("@/components/sound/TagorePartnership"));

const FAQSection = dynamic(() => import("@/components/common/FAQSection"), {
    loading: () => (
        <div className="bg-black min-h-[40vh] flex items-center justify-center">
            <div className="text-white/60 text-sm">Loading...</div>
        </div>
    ),
});

export default function Page() {
    return (
        <>
            <ServiceSchema
                name="Sound Engineering & Music Production"
                description="Professional sound engineering, mixing, and mastering services. Mix and master starting at $50/song with 48-hour turnaround."
                serviceType="Sound Engineering"
                url=""
                image="/og/og-sound.webp"
                offerDescription="First 3 songs at $50/song, mix and master included"
                baseUrl={MUSIC_URL}
                providerName="Range of View Music"
                providerUrl={MUSIC_URL}
            />
            <BreadcrumbSchema baseUrl={MUSIC_URL} items={[
                { name: "Range of View Music", url: "" },
            ]} />
            <FAQPageSchema faqs={[
                { question: "How much does mixing and mastering cost?", answer: "Start at $50/song for your first 3 songs, mix and master included. After that, subscriptions run $145/mo for 5 songs (under $30/song), $300/mo for 12, and $500/mo for 18 with 24-hour priority turnaround. Need just one song? One-off pricing is $120/song. The subscription discount exists because consistency goes both ways. You commit to dropping, we commit to the rate." },
                { question: "How long does it take to get my song mixed and mastered?", answer: "48 hours for all subscription tiers. 24 hours for Pro. 72 hours for one-off work. Clock starts when stems pass the quality check, Monday through Friday." },
                { question: "What do you need from me to mix my track?", answer: "Stems exported from your DAW: dry vocals (no reverb, no compression), beat stems or a stereo beat file, and any reference tracks. Email to stems@rovstudios.com. We run a quality check before mixing. If something is off, we tell you before we start." },
                { question: "What counts as a revision?", answer: "One round of feedback notes (louder vocals, more low end, soften the hi-hats). We rework the track. 2 revisions included per song on all tiers and one-offs. Additional revisions are $65 each. Re-recording or rearranging the song counts as a new submission." },
                { question: "Can I cancel my subscription?", answer: "Yes, anytime. Cancellation is effective at the end of your current billing cycle. No refunds for partial months. If you reactivate within 90 days, your original rate is guaranteed." },
                { question: "Do you do one-off work without a subscription?", answer: "$120 for a single mix and master, 72-hour turnaround, 2 revisions included. Cover art, visualizers, and merch design are also available without a subscription." },
                { question: "Can you help with cover art and visuals?", answer: "Yes. Cover art is $50 for subscribers ($75 one-off). Lyric visualizers are $40 for subscribers ($60 one-off). Merch design is $65 for subscribers ($95 one-off). Or bundle all three in the Creative Pack for $125/mo and save $120." },
            ]} />
            <VideoSchema
                name="Stars Collide Music Video"
                description="Stars Collide official music video, mixed and mastered by Range of View Studios sound engineering team."
                thumbnailUrl="/thumbnails/soundhero.webp"
                uploadDate="2025-01-10"
                contentUrl="/soundpage/starscollidemv.mp4"
                duration="PT3M30S"
                pageUrl=""
                baseUrl={MUSIC_URL}
            />
            <VideoSchema
                name="Starboy Music Video"
                description="Starboy music video produced and engineered by Range of View Studios."
                thumbnailUrl="/thumbnails/starboythumb.webp"
                uploadDate="2025-01-15"
                contentUrl="/soundpage/starbmvv.mp4"
                duration="PT3M"
                pageUrl=""
                baseUrl={MUSIC_URL}
            />

            {/* 01 — Hero */}
            <SoundHero />

            {/* 02 — Music Player */}
            <div className="bg-black">
                <MusicPlayer />
            </div>

            {/* 02.5 — Two-path fork (record vs send stems) */}
            <PathFork />

            {/* 03 — $50 Intro Offer */}
            <IntroOffer />

            {/* 04 — Studio Recording + Calculator */}
            <StudioSection />

            {/* 05 — Subscription Tiers */}
            <PricingTiers />

            {/* 06 — Creative Add-Ons */}
            <CreativeAddOns />

            {/* 07 — Savings Calculator */}
            <SavingsCalculator />

            {/* 08 — Studio Setup (hidden) */}
            {/* <StudioSetupSection /> */}

            {/* 08 — Artwork Gallery */}
            <div className="bg-black">
                <Gallery />
            </div>

            {/* 09 — Video Showcase */}
            <VideoShowcaseSection />

            {/* 10 — DDK Featured Testimonial */}
            <DDKFeatureTestimonial />

            {/* 10.1 — Testimonials */}
            <TestimonialsSection testimonials={soundTestimonials} variant="sound" />

            {/* 10.5 — Tagore Studios Partnership */}
            <TagorePartnership />

            {/* 11 — FAQ */}
            <FAQSection items={soundFaqItems} />

            {/* Music-branded footer + nav (rovmusic shell) */}
            <MusicFooter />
            <MusicNav />
        </>
    );
}
