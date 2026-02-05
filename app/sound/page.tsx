import dynamic from "next/dynamic";
import Footer from "@/components/Footer";
import { NavigationDock } from "@/components/NavDoc";
import SoundHero from "@/components/sound_page/SoundHero";
import Gallery from "@/components/Gallery";

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

export default function Page() {
    return (
        <>
            <SoundHero />

            {/* Music Player Section */}
            {/* Music Player Section */}
            <div className="bg-black">
                <MusicPlayer />
            </div>

            {/* Gallery Section */}
            <div className="bg-black">
                <Gallery />
            </div>

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
                                LET'S CREATE!
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
