import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { MusicMenu } from "@/components/music/MusicMenu";
import MusicFooter from "@/components/music/MusicFooter";
import { IntakeProvider } from "@/components/music/IntakeContext";
import RoleGate from "@/components/music/RoleGate";
import RoleToast from "@/components/music/RoleToast";
import SoundHero from "@/components/sound/SoundHero";
// Gallery and VideoShowcaseSection now render inside CareerGaps, where they
// serve as the evidence for the full-service claim instead of sitting in the
// back half as decoration.
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
        "Professional sound engineering, mixing, and mastering by Range of View Music. Mix and master from $40 a song, first one $50. Atlanta studio time from $50/hr with mixing included. 48-hour turnaround.",
    alternates: { canonical: MUSIC_URL },
    openGraph: {
        title: "Mixing & Mastering in Atlanta | Range of View Music",
        description: "Professional mixing, mastering, and sound engineering. From $40 a song, first one $50.",
        url: MUSIC_URL,
        images: [{ url: `${MUSIC_URL}/og/og-sound.webp`, width: 1200, height: 630, alt: "Range of View Music studio" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Mixing & Mastering in Atlanta | Range of View Music",
        description: "Professional mixing, mastering, and sound engineering. From $40 a song, first one $50.",
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

// Holds the cover gallery and video showcase, so it carries their weight.
const CareerGaps = dynamic(() => import("@/components/sound/CareerGaps"), {
    loading: () => (
        <div className="bg-black min-h-[40vh] flex items-center justify-center">
            <div className="text-white/60 text-sm">Loading...</div>
        </div>
    ),
});

const ClosingCTA = dynamic(() => import("@/components/sound/ClosingCTA"));

// Renders only for the "behind the scenes" role, which used to be a dead end.
const CollaboratorCard = dynamic(() => import("@/components/sound/CollaboratorCard"));

const StudioSection = dynamic(() => import("@/components/sound/StudioSection"), {
    loading: () => (
        <div className="bg-black min-h-[40vh] flex items-center justify-center">
            <div className="text-white/60 text-sm">Loading...</div>
        </div>
    ),
});

// const StudioSetupSection = dynamic(() => import("@/components/sound/StudioSetup"));

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

// Narrative punctuation between the four acts. Light enough to import directly.
const ActBreak = dynamic(() => import("@/components/sound/ActBreak"));

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
        <IntakeProvider>
            <ServiceSchema
                name="Sound Engineering & Music Production"
                description="Professional sound engineering, mixing, and mastering services. Mix and master from $40 a song with 48-hour turnaround. First mix is $50."
                serviceType="Sound Engineering"
                url=""
                image="/og/og-sound.webp"
                offerDescription="First mix at $50, then $65 a song or as low as $40 in a prepaid pack. Mix and master included."
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

            {/* ════ ACT 1 · PROOF ════════════════════════════════════
                Nothing is asked for here. Establish that the sound is real
                before any price is on screen. */}

            {/* 01 — Hero */}
            <SoundHero />

            {/* 02 — Before/after player: proof of the sound */}
            <div className="bg-black">
                <MusicPlayer />
            </div>

            {/* 03 — DDK: proof of reputation. Paired with the player on
                purpose, they're the strongest thirty seconds on the site. */}
            <DDKFeatureTestimonial />

            {/* ════ ACT 2 · THE SONG ═════════════════════════════════
                $50 to $500. Everything here is self-serve: Stripe for what
                you send, Cal-with-payment for what you book. No forms. */}

            {/* 03.5 — The act break. Closes the proof act, names the price
                before the offers do, and routes to /credits, which was only
                reachable from the menu. */}
            <ActBreak
                act="Act two · the song"
                line="That is what your record could sound like. Here is what it costs."
                sub="Produced, written, mixed, and mastered here. Every rate below is published in full, and mix and master are included in every recording hour."
                link={{ label: "Hear all six records, named and linked", href: "/credits" }}
            />

            {/* 04 — Two-path fork (record vs send stems) */}
            <PathFork />

            {/* 05 — $50 Intro Offer                         [#mixing] */}
            <IntroOffer />

            {/* 06 — Studio rates, the room, value props     [#record]
                The quote estimator used to sit after this. Retired: /pricing
                answers "what does it cost" better than a four-question
                ballpark, and two quizzes on one page was one too many. The
                readiness audit below is now the only quiz. */}
            <StudioSection />

            {/* ════ ACT 3 · THE CAREER ═══════════════════════════════
                Consultative. Breadth first, then their specific gap, then
                the package that closes it, then the proof it works. */}

            {/* 07.5 — The bridge, and the most important break on the page.
                Going straight from a $50 mix to a career conversation is the
                jump where people leave, because nothing explains why the
                subject just changed. This says it in one line. */}
            <ActBreak
                act="Act three · the career"
                line="A mix makes one song better. This is what makes a catalogue worth something."
                sub="Most artists are not short a mix. They are short the artwork, the video, the release page, the splits, and the metadata that stops a song landing on a duplicate profile. Nobody sells that, so nobody buys it, and it is the reason good records disappear."
                link={{ label: "See the whole path we run, capture to release", href: "/toolkit" }}
            />

            {/* 08 — Whatever's missing: the full-service claim, shown as
                work rather than a price menu. Holds the cover gallery and
                the video showcase, which had no job in the old tail. */}
            <CareerGaps />

            {/* 09 — Artist Readiness Audit                  [#audit]  */}
            <ReadinessAudit />

            {/* 09.5 — Collaborators get routes instead of a quiz. Self-hides
                for artists and managers.            [#collaborate] */}
            <CollaboratorCard />

            {/* 10 — Foundation / Release Cycle / Development [#foundation] */}
            <FoundationOffer />

            {/* 11 — Sam Suen: this is Act 3's proof, not general proof.
                Brand, site, sound, and stage for one artist is a Foundation
                and Development case study, so it sits under them. */}
            <SamSuenFeature />

            {/* ════ ACT 4 · CLOSE ════════════════════════════════════ */}

            {/* 11.5 — Names the objection the close has to answer, so the
                testimonials below read as evidence rather than decoration. */}
            <ActBreak
                act="Act four · the honest part"
                line="We will tell you when the answer is not us."
                sub="Sometimes a record needs a re-record rather than a mix, or a room bigger than ours. Saying so costs us the invoice and saves you three of them."
                link={{ label: "How every Atlanta studio compares, including the ones we are not", href: "/atlanta-studios" }}
            />

            {/* 12 — Testimonials (speed and process, i.e. objections) */}
            <TestimonialsSection testimonials={soundTestimonials} variant="sound" />

            {/* 13 — FAQ */}
            <FAQSection items={soundFaqItems} />

            {/* 14 — The ending the page never had */}
            <ClosingCTA />

            {/* Music-branded footer + nav (rovmusic shell) */}
            <MusicFooter />
            <MusicMenu />
            <RoleToast />
            <RoleGate />
        </IntakeProvider>
    );
}
