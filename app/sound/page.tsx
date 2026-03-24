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
                            background: 'linear-gradient(111deg, #42201C -1.34%, #A64D2B 25.87%, #B16937 59.87%, #EA9A61 93.39%)',
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
                                <h3 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-2" style={{ fontFamily: 'Norwige, sans-serif' }}>
                                    Ready to Record?
                                </h3>
                                <p className="text-white text-base md:text-lg opacity-90" style={{ fontFamily: 'Roboto, sans-serif' }}>
                                    Book a free 30-minute consultation. We&apos;ll talk through your project, timeline, and get you on the calendar.
                                </p>
                            </div>
                        </div>

                        {/* Right side - Buttons */}
                        <div className="flex items-center flex-shrink-0" style={{ gap: 'clamp(0.75rem, 1.5vw, 1rem)' }}>
                            {/* Circle group */}
                            <div className="flex items-center relative gap-0">
                                <div
                                    className="rounded-full border border-white/50 bg-transparent shrink-0"
                                    style={{ width: 'clamp(3rem, 5vw, 3.75rem)', height: 'clamp(3rem, 5vw, 3.75rem)' }}
                                />
                                <a
                                    href="https://calendly.com/rangeofviewmusic/30min"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-full bg-[#F7F2E4] flex items-center justify-center cursor-pointer transition-all duration-300 relative z-[2] shrink-0 -mx-2.5 hover:shadow-lg hover:scale-110"
                                    style={{ width: 'clamp(3rem, 5vw, 3.75rem)', height: 'clamp(3rem, 5vw, 3.75rem)' }}
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" className="w-[35%] h-[35%]">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </a>
                                <div
                                    className="rounded-full border border-white/50 bg-transparent shrink-0"
                                    style={{ width: 'clamp(3rem, 5vw, 3.75rem)', height: 'clamp(3rem, 5vw, 3.75rem)' }}
                                />
                            </div>

                            {/* LET'S CREATE Button */}
                            <a
                                href="https://calendly.com/rangeofviewmusic/30min"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="cta-shine inline-block rounded-full bg-[#0E0A08] text-white font-semibold cursor-pointer transition-all duration-300 whitespace-nowrap hover:shadow-[0_6px_20px_rgba(0,0,0,0.4)] hover:scale-105 uppercase"
                                style={{
                                    padding: 'clamp(0.75rem, 1.2vw, 0.9375rem) clamp(1.5rem, 2.5vw, 2rem)',
                                    fontSize: 'clamp(0.75rem, 1vw, 0.875rem)',
                                    letterSpacing: '0.05em',
                                    fontFamily: 'Norwige, sans-serif',
                                    boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
                                }}
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
