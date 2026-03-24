"use client";

import Image from "next/image";

export default function HaveAnIdeaSection() {
    const companyLogos = [
        { src: "/webdev/bandologo.webp", alt: "The Bando" },
        { src: "/webdev/iknalogo white.webp", alt: "Ikna" },
    ];

    return (
        <section className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-black">
            <div className="max-w-7xl mx-auto">
                <div
                    className="relative p-8 md:p-12 lg:p-16 overflow-hidden"
                    style={{
                        borderRadius: "15px",
                        background: "linear-gradient(132deg, #42201C 4.77%, #A64D2B 27.26%, #B16937 50.09%, #EA9A61 76.74%)",
                    }}
                >
                    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-black flex items-center justify-center p-4 relative overflow-hidden">
                                <Image
                                    src="/rov-logo.webp"
                                    alt="ROV Logo"
                                    fill
                                    className="object-contain p-4"
                                />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 space-y-4 text-center md:text-left">
                            <h2
                                className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight"
                                style={{ fontFamily: "Norwige, sans-serif" }}
                            >
                                Have an Idea?
                            </h2>
                            <p
                                className="text-base md:text-lg text-white/90 leading-relaxed max-w-2xl"
                                style={{ fontFamily: "Roboto, sans-serif" }}
                            >
                                Book a call to discover how we can strengthen your digital platform and bring your vision to life.
                            </p>
                        </div>

                        {/* CTA Button */}
                        <div className="flex-shrink-0">
                            <a
                                href="https://calendly.com/rangeofviewmusic/30min"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="cta-shine px-8 py-4 bg-white text-black text-base md:text-lg rounded-full font-medium hover:bg-white/90 transition-colors inline-block whitespace-nowrap"
                                style={{ fontFamily: "Roboto, sans-serif" }}
                            >
                                Schedule a Call
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
