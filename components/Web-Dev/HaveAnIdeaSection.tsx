"use client";

import Image from "next/image";

export default function HaveAnIdeaSection() {
    const companyLogos = [
        { src: "/webdev/bandologo.png", alt: "The Bando" },
        { src: "/webdev/iknalogo white.png", alt: "Ikna" },
    ];

    return (
        <section className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-black">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                    {/* Left Side - CTA Card - Takes up 2 columns */}
                    <div
                        className="lg:col-span-2 relative p-8 md:p-12 overflow-hidden"
                        style={{
                            borderRadius: "15px",
                            background: "linear-gradient(132deg, #EA9A61 4.77%, #B16937 27.26%, #A64D2B 50.09%, #42201C 76.74%)",
                        }}
                    >
                        {/* Horizontal Layout: Logo on left, Content on right */}
                        <div className="flex items-center gap-6 md:gap-10">
                            {/* Logo Icon - reduced size for sleeker look */}
                            <div className="flex-shrink-0">
                                <div
                                    className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-black flex items-center justify-center p-4 relative overflow-hidden"
                                >
                                    <Image
                                        src="/rov-logo.webp"
                                        alt="ROV Logo"
                                        fill
                                        className="object-contain p-4"
                                    />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 space-y-4">
                                {/* Heading - Smaller, more horizontal feel */}
                                <h2
                                    className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight"
                                    style={{
                                        fontFamily: "Roboto, sans-serif",
                                    }}
                                >
                                    Have an Idea?
                                </h2>

                                {/* Description - More compact */}
                                <p
                                    className="text-base md:text-lg text-white/90 leading-relaxed max-w-2xl"
                                    style={{
                                        fontFamily: "Norwige, sans-serif",
                                        fontStyle: "italic",
                                    }}
                                >
                                    Book a call to discover how we can strengthen your digital platform and bring your vision to life.
                                </p>

                                {/* CTA Button - Smaller, pill shape */}
                                {/* CTA Button - Smaller, pill shape */}
                                <a
                                    href="https://calendly.com/rangeofviewmusic/30min"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-3 bg-white text-black text-base md:text-lg rounded-full font-medium hover:bg-white/90 transition-colors inline-block"
                                    style={{
                                        fontFamily: "Roboto, sans-serif",
                                    }}
                                >
                                    Schedule a Call
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Companies Section */}
                    <div
                        className="h-full rounded-[15px] p-8 md:p-10 flex flex-col justify-center"
                        style={{
                            background: "linear-gradient(145deg, #000000 0%, #2C1810 100%)",
                            border: "1px solid rgba(255, 255, 255, 0.05)"
                        }}
                    >
                        <div className="mb-10 w-full">
                            <div className="flex flex-nowrap items-center gap-x-3 whitespace-nowrap overflow-visible">
                                <h3
                                    className="text-lg md:text-xl font-bold text-white shrink-0"
                                    style={{ fontFamily: "Roboto, sans-serif" }}
                                >
                                    Companies that
                                </h3>
                                <div className="relative flex items-center shrink-0">
                                    {/* Main Pill */}
                                    <div
                                        className="relative z-10 bg-[#968266] text-white text-lg md:text-xl font-bold px-4 py-1.5 rounded-full"
                                        style={{ fontFamily: "Roboto, sans-serif" }}
                                    >
                                        trusted us
                                    </div>
                                    {/* Effect Circles */}
                                    <div className="w-8 h-8 md:w-10 md:h-10 bg-[#968266] opacity-60 rounded-full -ml-3 z-0" />
                                    <div className="w-8 h-8 md:w-10 md:h-10 border-2 border-white rounded-full -ml-6 z-20" />
                                </div>
                            </div>
                        </div>

                        {/* Company Logos */}
                        <div className="flex items-center gap-8 md:gap-14 pl-2">
                            {companyLogos.map((logo, index) => (
                                <div
                                    key={index}
                                    className="relative w-48 h-24 md:w-72 md:h-40 hover:scale-105 transition-transform duration-300"
                                >
                                    <Image
                                        src={logo.src}
                                        alt={logo.alt}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            ))}
                            <div
                                className="relative w-48 h-24 md:w-72 md:h-40 flex items-center justify-center hover:scale-105 transition-transform duration-300"
                            >
                                <span
                                    className="text-white text-2xl md:text-3xl font-bold tracking-[0.15em]"
                                    style={{ fontFamily: "Roboto, sans-serif" }}
                                >
                                    DKM CORP
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
