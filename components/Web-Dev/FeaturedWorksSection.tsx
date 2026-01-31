"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";

export default function FeaturedWorksSection() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const projects = [
        {
            id: 1,
            title: "THE BANDO",
            description: "Website Redesign & Immersive Branding",
            image: "/casestudyheroimg.png",
            link: "/casestudy"
        },
        {
            id: 2,
            title: "Aysegul Ikna",
            description: "Website Design & Development",
            image: "/webdev/ayseiknawebhome.png",
            link: "/casestudy/aysegul-ikna"
        },
        {
            id: 3,
            title: "Project Three",
            description: "Creative Design & Development",
        },
        {
            id: 4,
            title: "Project Four",
            description: "Brand Identity & Web Design",
        },
    ];

    return (
        <section className="relative py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-black overflow-hidden">
            {/* Section Title */}
            <div className="max-w-7xl mx-auto mb-12 md:mb-16">
                <h2
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white"
                    style={{
                        fontFamily: "Norwige, sans-serif",
                        fontStyle: "italic",
                    }}
                >
                    Featured Works
                </h2>
            </div>

            {/* Scrollable Container */}
            <div
                ref={scrollContainerRef}
                className="flex gap-6 md:gap-8 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8 pb-4"
                style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                }}
            >
                {projects.map((project) => {
                    const CardContent = (
                        <div
                            key={project.id}
                            className="flex-shrink-0 group cursor-pointer"
                            style={{
                                width: "clamp(300px, 80vw, 420px)",
                            }}
                        >
                            {/* Project Image */}
                            <div
                                className="w-full aspect-[4/3] bg-white rounded-2xl mb-6 overflow-hidden relative group-hover:scale-[1.02] transition-transform duration-300"
                                style={{
                                    background: project.image ? "transparent" : "linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)",
                                }}
                            >
                                {project.image && (
                                    <Image
                                        src={project.image}
                                        alt={project.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 80vw, 420px"
                                    />
                                )}

                                {/* Arrow Icon in top-right */}
                                <div className="absolute top-4 right-4 w-10 h-10 rounded-full border-2 border-black/20 bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M7 17L17 7M17 7H7M17 7V17"
                                            stroke="#000"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                            </div>

                            {/* Project Info */}
                            <div className="text-left">
                                <h3
                                    className="text-2xl md:text-3xl font-bold text-white mb-2"
                                    style={{
                                        fontFamily: "Roboto, sans-serif",
                                    }}
                                >
                                    {project.title}
                                </h3>
                                <p
                                    className="text-base md:text-lg text-white/70"
                                    style={{
                                        fontFamily: "Norwige, sans-serif",
                                        fontStyle: "italic",
                                    }}
                                >
                                    {project.description}
                                </p>
                            </div>
                        </div>
                    );

                    // Wrap with Link if project has a link
                    return project.link ? (
                        <Link key={project.id} href={project.link}>
                            {CardContent}
                        </Link>
                    ) : (
                        CardContent
                    );
                })}
            </div>

            {/* Scroll Indicator (optional) */}
            <div className="flex justify-center mt-8 gap-2">
                {projects.map((_, index) => (
                    <div
                        key={index}
                        className="w-2 h-2 rounded-full bg-white/30"
                    />
                ))}
            </div>

            {/* Custom CSS for hiding scrollbar */}
            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section>
    );
}
