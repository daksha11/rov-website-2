import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { MusicNav } from "@/components/music/MusicNav";
import MusicFooter from "@/components/music/MusicFooter";
import { RoleProvider } from "@/components/music/RoleContext";
import RoleGate from "@/components/music/RoleGate";
import RoleChip from "@/components/music/RoleChip";
import RoleOnly from "@/components/music/RoleOnly";
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

const ReadinessAudit = dynamic(() => import("@/components/sound/ReadinessAudit"));

const IntroOffer = dynamic(() => import("@/components/sound/IntroOffer"));

const FoundationOffer = dynamic(() => import("@/components/sound/FoundationOffer"));

const StudioSection = dynamic(() => import("@/components/sound/StudioSection"), {
    loading: () => (
        <div className="bg-black min-h-[40vh] flex items-center justify-center">
            <div className="text-white/60 text-sm">Loading...</div>
        </div>
    ),
});

const QuoteEstimator = dynamic(() => import("@/components/sound/QuoteEstimator"));
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

const SamSuenFeature = dynamic(() => import("@/components/sound/SamSuenFeature"), {
    loading: () => (
        <div className="bg-[#080807] min-h-[40vh] flex items-center justify-center">
            <div className="text-white/30 text-sm">Loading...</div>
        </div>
    ),
    ssr: false,
});

const FAQSection = dynamic(() => import("@/components/common/FAQSection"), {
    loading: () => (
        <div className="bg-black min-h-[40vh] flex items-center justify-center">
            <div className="text-white/60 text-sm">Loading...</div>
        </div>
    ),
});

export default function Page() {
    return (
        // Role state wraps the whole page: the gate sets it, and sections read
        // it to swap copy and reorder proof.
        <RoleProvider>
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
            {/* Fed from the same data as the visible FAQ below, so the two can
                never drift apart. Google wants schema to match what renders. */}
            <FAQPageSchema faqs={soundFaqItems} />
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

            {/* 02.6 — Artist Readiness Audit. Sits before pricing on purpose:
                someone who just scored 3/10 reads the $50 offer differently
                than someone who arrived cold. */}
            <ReadinessAudit />

            {/* 02.7 — Managers get the artist-development proof early. It's the
                only asset that shows we can run a career, not just a song. */}
            <RoleOnly roles={["manager"]} fallbackVisible={false}>
                <SamSuenFeature />
            </RoleOnly>

            {/* 03 — $50 Intro Offer */}
            <IntroOffer />

            {/* 04 — Studio Recording + Calculator */}
            <StudioSection />

            {/* 05 — Quote questionnaire + personalized savings (replaces tiers, add-ons, and the standalone calculator) */}
            <QuoteEstimator />

            {/* 05.5 — Foundation / Release Cycle / Development. The rung between
                a $149 finished single and full artist development, and where
                the readiness audit sends people. */}
            <FoundationOffer />

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

            {/* 10.3 — Sam Suen: shown here for everyone except managers, who
                already saw it above. */}
            <RoleOnly roles={["artist", "other"]}>
                <SamSuenFeature />
            </RoleOnly>

            {/* 11 — FAQ */}
            <FAQSection items={soundFaqItems} />

            {/* Music-branded footer + nav (rovmusic shell) */}
            <MusicFooter />
            <MusicNav />
            <RoleChip />
            <RoleGate />
        </RoleProvider>
    );
}
