import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Footer from "@/components/Footer";
import { NavigationDock } from "@/components/NavDoc";
import SoundHero from "@/components/sound_page/SoundHero";
import Gallery from "@/components/Gallery";
import { VideoSchema } from "@/components/VideoSchema";
import { ServiceSchema } from "@/components/ServiceSchema";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { FAQPageSchema } from "@/components/FAQPageSchema";

export const metadata: Metadata = {
    title: "Sound Engineering & Music Production",
    description:
        "Professional sound engineering, mixing, and mastering services by Range of View Studios. From demo to master — we bring your sound to life.",
    alternates: { canonical: "https://rovstudios.com/sound" },
    openGraph: {
        title: "Sound Engineering & Music Production | Range of View Studios",
        description: "Professional mixing, mastering, and sound engineering services. Demo snippets are free.",
        url: "https://rovstudios.com/sound",
        images: [{ url: "/og/og-sound.jpg", width: 1200, height: 630, alt: "ROV Studios sound engineering setup" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Sound Engineering & Music Production | Range of View Studios",
        description: "Professional mixing, mastering, and sound engineering services.",
        images: ["/og/og-sound.jpg"],
    },
};

// Dynamic imports for heavy components to improve initial load
const MusicPlayer = dynamic(() => import("@/components/sound_page/MusicPlayer"), {
    loading: () => (
        <div className="bg-black min-h-[70vh] flex items-center justify-center">
            <div className="text-white/60 text-sm">Loading player...</div>
        </div>
    ),
    ssr: false // Client-side only for interactive features
});

const FAQBottomSection = dynamic(() => import("@/components/sound_page/FAQBottomSection"), {
    loading: () => (
        <div className="bg-black min-h-[40vh] flex items-center justify-center">
            <div className="text-white/60 text-sm">Loading...</div>
        </div>
    )
});

const VideoShowcaseSection = dynamic(() => import("@/components/sound_page/VideoShowcaseSection"), {
    loading: () => (
        <div className="bg-black min-h-[40vh] flex items-center justify-center">
            <div className="text-white/60 text-sm">Loading...</div>
        </div>
    ),
    ssr: false
});

const StudioSection = dynamic(() => import("@/components/sound_page/StudioSection"), {
    loading: () => (
        <div className="bg-black min-h-[60vh] flex items-center justify-center">
            <div className="text-white/60 text-sm">Loading...</div>
        </div>
    ),
    ssr: false
});

export default function Page() {
    return (
        <>
            <ServiceSchema
                name="Sound Engineering & Music Production"
                description="Professional sound engineering, mixing, and mastering services. From demo to final master in 48 hours."
                serviceType="Sound Engineering"
                url="/sound"
                image="/og/og-sound.jpg"
                offerDescription="Free demo snippets with no strings attached"
            />
            <BreadcrumbSchema items={[
                { name: "Home", url: "" },
                { name: "Sound Engineering", url: "/sound" },
            ]} />
            <FAQPageSchema faqs={[
                { question: "How much do you charge for mixing and mastering?", answer: "We charge $50 per song for vocal mixing and mastering. That includes balancing your vocals, cleaning up the sound, adding creative effects where needed, and making sure it hits the right loudness for streaming. If you need a full trackout mixed (beat stems, instruments, vocals, everything), pricing is higher depending on the complexity and number of stems. Reach out with your project details and we'll give you a custom quote." },
                { question: "How long does it take to get my song mixed and mastered?", answer: "Turnaround is 2 days from the time we receive your properly labeled stems and any notes. If you're recording with us in-house, your song is also mixed and mastered within 2 days after the session. If you're on a tight schedule for a rollout, let us know and we'll plan the timeline with you." },
                { question: "What do you need from me to mix my track properly?", answer: "We need all your stems exported and labeled clearly before you send them over. That means things like \"Lead Vocals,\" \"Adlibs,\" \"Kick,\" \"808,\" \"Guitar,\" and so on, not \"Audio_01.\" Make sure everything is the same tempo and starts from the same bar so it lines up. You'll email the stems along with a rough mix or reference track and any notes about the vibe you're going for." },
                { question: "Do you offer discounts for multiple songs or full projects?", answer: "Yes. If you're bringing a full project, EP, or a batch of singles, we offer discounted rates on mixing and mastering. The more songs we're working on together, the better we can lock in a package price. Tell us how many tracks you have, your timeline, and what extra services you might need, and we'll build a custom quote." },
                { question: "What makes your mixes stand out on streaming platforms?", answer: "We mix competitively for streaming loudness, so your records hit hard without sounding crushed. Our work has landed on placements like SoundCloud Song of the Day, On The Radar, Apple Radio, and more, so we know what translates well on real playlists and radios. The goal is a mix that feels big in the car, on headphones, and on all major platforms." },
                { question: "Can you help with cover art, rollouts, and visuals for my release?", answer: "Yes, this is where we really go full service. Beyond mixing and mastering, we can create cover art, website pages or microsites, merch designs, tracklists, and full rollout assets. If you need music videos or visual content to support the release, we can handle that too. We're set up to take you from recording to release, so you don't have to piece together a different person for every part of your rollout." },
            ]} />
            <VideoSchema
                name="Stars Collide Music Video"
                description="Stars Collide official music video, mixed and mastered by Range of View Studios sound engineering team."
                thumbnailUrl="/thumbnails/soundhero.webp"
                uploadDate="2025-01-10"
                contentUrl="/soundpage/starscollidemv.mp4"
                duration="PT3M30S"
                pageUrl="/sound"
            />
            <VideoSchema
                name="Starboy Music Video"
                description="Starboy music video produced and engineered by Range of View Studios."
                thumbnailUrl="/thumbnails/starboythumb.webp"
                uploadDate="2025-01-15"
                contentUrl="/video/starboymv.mp4"
                duration="PT3M"
                pageUrl="/sound"
            />
            <SoundHero />

            {/* Music Player Section */}
            <div className="bg-black">
                <MusicPlayer />
            </div>

            {/* Gallery Section */}
            <div className="bg-black">
                <Gallery />
            </div>

            {/* Video Showcase Section */}
            <VideoShowcaseSection />

            {/* Studio Recording Section */}
            <StudioSection />

            {/* Promotional CTA Strip */}
            <section className="relative bg-black px-6 md:px-12 py-8">
                <div className="max-w-7xl mx-auto">
                    <div
                        className="relative rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6"
                        style={{
                            borderRadius: '15px',
                            border: '1px solid #999288',
                            background: 'linear-gradient(111deg, #EA9A61 -1.34%, #B16937 25.87%, #A64D2B 59.87%, #42201C 93.39%)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                        }}
                    >
                        {/* Left side - Logo and Text */}
                        <div className="flex items-center gap-6">
                            {/* Logo Circle */}
                            <div className="w-20 h-20 md:w-24 md:h-24 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                                <img
                                    src="/rov-logo.webp"
                                    alt="ROV Logo"
                                    className="w-12 h-12 md:w-14 md:h-14 object-contain"
                                />
                            </div>

                            {/* Text Content */}
                            <div>
                                <h3 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold mb-2" style={{ fontFamily: 'Norwige, sans-serif' }}>
                                    First Time Working With Us?
                                </h3>
                                <p className="text-white text-sm md:text-base opacity-90" style={{ fontFamily: 'Norwige, sans-serif' }}>
                                    Demo snippets are free. No Strings. No Proof.
                                </p>
                            </div>
                        </div>

                        {/* Right side - Buttons */}
                        <div className="flex items-center gap-4 flex-shrink-0">
                            {/* Arrow Button */}
                            <a
                                href="https://calendly.com/rangeofviewmusic/30min"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </a>

                            {/* LET'S CREATE Button */}
                            <a
                                href="https://calendly.com/rangeofviewmusic/30min"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-900 transition-colors uppercase tracking-wide text-sm md:text-base font-bold flex items-center justify-center"
                                style={{ fontFamily: 'Norwige, sans-serif' }}
                            >
                                LET&apos;S CREATE!
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <FAQBottomSection />

            {/* Footer */}
            <Footer />

            {/* Navigation Dock */}
            <NavigationDock />
        </>
    );
}
