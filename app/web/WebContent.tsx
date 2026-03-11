"use client";

import { NavigationDock } from "@/components/NavDoc";
import Footer from "@/components/Footer";
import OurApproachSection from "@/components/Web-Dev/OurApproachSection";
import FAQBottomSection from "@/components/Web-Dev/FAQBottomSection";
import FeaturedWorksSection from "@/components/Web-Dev/FeaturedWorksSection";
import HaveAnIdeaSection from "@/components/Web-Dev/HaveAnIdeaSection";

export default function WebContent() {
    return (
        <main className="min-h-screen bg-black text-white relative overflow-hidden">
            {/* Gradient Blob - Bottom Left */}
            <div
                className="absolute bottom-0 left-0 w-[400px] h-[400px] md:w-[600px] md:h-[600px] lg:w-[800px] lg:h-[800px] rounded-full pointer-events-none z-0"
                style={{
                    background: 'rgba(96, 62, 37, 0.60)',
                    filter: 'blur(200px)',
                    transform: 'translate(-20%, 20%)'
                }}
            />

            {/* Hero Section */}
            <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 pt-32 md:pt-40 lg:pt-56 relative">
                {/* Decorative Frame - Top Left - Hidden on mobile, visible on md+ */}
                <div
                    className="hidden md:block absolute top-20 lg:top-20 left-6 lg:left-12 w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-2xl lg:rounded-3xl"
                    style={{
                        background: "linear-gradient(135deg, #4a3a2a 0%, #3a2a1a 100%)",
                    }}
                />

                {/* Decorative Frame - Right Side - Hidden on mobile, visible on md+ */}
                <div
                    className="hidden md:block absolute top-1/2 right-6 lg:right-12 -translate-y-1/2 w-32 h-24 md:w-40 md:h-28 lg:w-48 lg:h-32 rounded-2xl lg:rounded-3xl"
                    style={{
                        background: "linear-gradient(135deg, #4a3a2a 0%, #3a2a1a 100%)",
                    }}
                />

                {/* Main Content Container */}
                <div className="max-w-7xl w-full text-center relative z-10">
                    {/* Hero Text */}
                    <div className="mb-8 md:mb-12">
                        <h2
                            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white/90 mb-2 font-bold"
                            style={{ fontFamily: "Norwige, sans-serif", fontStyle: "italic" }}
                        >
                            Your Website
                        </h2>
                        <h1
                            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold"
                            style={{
                                fontFamily: "Norwige, sans-serif",
                                fontStyle: "italic",
                                letterSpacing: "-0.02em",
                            }}
                        >
                            Reimagined
                        </h1>
                    </div>

                    {/* CTA Button */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 md:mb-32">
                        <button className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform">
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5 md:w-6 md:h-6"
                            >
                                <path
                                    d="M5 12H19M19 12L12 5M19 12L12 19"
                                    stroke="#000"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                        <button
                            className="px-8 py-3 md:px-10 md:py-4 text-white rounded-full font-medium hover:opacity-90 transition-opacity uppercase tracking-wide text-sm md:text-base"
                            style={{
                                background: "linear-gradient(132deg, #EA9A61 4.77%, #B16937 27.26%, #A64D2B 50.09%, #42201C 76.74%)",
                                borderRadius: "37.809px",
                                fontFamily: "Roboto, sans-serif",
                            }}
                        >
                            LET'S CREATE!
                        </button>
                    </div>

                    {/* Bottom Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start max-w-6xl mx-auto mt-48 sm:mt-64 md:mt-96 lg:mt-[32rem] xl:mt-[40rem] px-4">
                        {/* Left - Potential Text */}
                        <div className="text-left">
                            <h3
                                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight"
                                style={{ fontFamily: "Roboto, sans-serif" }}
                            >
                                Uncover the true{" "}
                                <span className="inline-flex items-center gap-2">
                                    <span
                                        className="inline-flex items-center px-4 py-1 md:px-6 md:py-2 rounded-full text-white font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl"
                                        style={{
                                            background: "#957E5E",
                                            fontStyle: "italic",
                                        }}
                                    >
                                        potential
                                    </span>
                                    {/* Decorative Circles */}
                                    <span className="inline-flex items-center -ml-3">
                                        {/* Filled Circle */}
                                        <span
                                            className="w-8 h-8 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full"
                                            style={{ background: "#957E5E" }}
                                        />
                                        {/* Outlined Circle */}
                                        <span
                                            className="w-8 h-8 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full -ml-4 md:-ml-6"
                                            style={{
                                                border: "3px solid white",
                                                background: "transparent"
                                            }}
                                        />
                                    </span>
                                </span>
                                <br />
                                of your website
                            </h3>
                        </div>

                        {/* Right - Description Text */}
                        <div className="text-left md:text-right">
                            <p
                                className="text-base sm:text-lg md:text-xl leading-relaxed"
                                style={{
                                    fontFamily: "Norwige, sans-serif",
                                    fontStyle: "italic",
                                }}
                            >
                                Designed with intention. Built for impact. We craft websites that clearly communicate your brand and work harder for your business.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Works Section */}
            <FeaturedWorksSection />

            {/* Have an Idea Section */}
            <HaveAnIdeaSection />

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
