"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const projects = [
    {
        id: 1,
        title: "THE BANDO",
        category: "Website Redesign & Immersive Branding",
        tags: ["Design", "Development", "Branding", "UI/UX"],
        year: "2025",
        media: "/video/bando video website.mp4",
        mediaType: "video" as const,
        poster: "/casestudyheroimg.webp",
        link: "/casestudy",
    },
    {
        id: 2,
        title: "AYSEGUL IKNA",
        category: "Website Design & Development",
        tags: ["Design", "UX", "Development"],
        year: "2025",
        media: "/video/Aysegul Ikna website.mp4",
        mediaType: "video" as const,
        poster: "/webdev/ayseiknawebhome.webp",
        link: "/casestudy/aysegul-ikna",
    },
    {
        id: 3,
        title: "DKM CORP",
        category: "Global Digital Infrastructure & Brand Identity",
        tags: ["Design", "Development", "Branding"],
        year: "2025",
        media: "/casestudy/dubaiskyline.jpg",
        mediaType: "image" as const,
        link: "/casestudy/dkm",
    },
];

export default function FeaturedWorksSection() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const autoplayPlugin = useRef(
        Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })
    );

    const [emblaRef, emblaApi] = useEmblaCarousel(
        {
            loop: true,
            duration: 40,
            align: "start",
        },
        [autoplayPlugin.current]
    );

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setActiveIndex(emblaApi.selectedScrollSnap());
        setCanScrollPrev(emblaApi.canScrollPrev());
        setCanScrollNext(emblaApi.canScrollNext());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on("select", onSelect);
        emblaApi.on("reInit", onSelect);
        return () => {
            emblaApi.off("select", onSelect);
            emblaApi.off("reInit", onSelect);
        };
    }, [emblaApi, onSelect]);

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

    // Mobile: vertical stack fallback
    if (isMobile) {
        return (
            <section id="featured-works" className="relative bg-black py-16 px-4">
                <div className="mb-10">
                    <p
                        className="text-sm uppercase tracking-[0.2em] text-white/40 mb-3"
                        style={{ fontFamily: "Roboto, sans-serif" }}
                    >
                        Selected Works
                    </p>
                    <h2
                        className="text-4xl font-bold text-white"
                        style={{ fontFamily: "Norwige, sans-serif", fontStyle: "italic" }}
                    >
                        Our Recent Projects
                    </h2>
                </div>
                <div className="flex flex-col gap-6">
                    {projects.map((project, index) => (
                        <Link key={project.id} href={project.link}>
                            <div className="group relative w-full h-[50vh] rounded-2xl overflow-hidden">
                                {project.mediaType === "video" ? (
                                    <video
                                        src={project.media}
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        poster={project.poster}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                ) : (
                                    <Image
                                        src={project.media}
                                        alt={`${project.title} - ${project.category}`}
                                        fill
                                        className="object-cover"
                                        sizes="100vw"
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {project.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-2.5 py-1 text-xs text-white/80 border border-white/20 rounded-full"
                                                style={{ fontFamily: "Roboto, sans-serif" }}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex items-end justify-between gap-3">
                                        <div>
                                            <span className="text-white/20 text-sm font-mono mb-1 block">
                                                {String(index + 1).padStart(2, "0")}
                                            </span>
                                            <h3
                                                className="text-3xl font-bold text-white mb-1"
                                                style={{ fontFamily: "Roboto, sans-serif" }}
                                            >
                                                {project.title}
                                            </h3>
                                            <p
                                                className="text-sm text-white/50"
                                                style={{ fontFamily: "Norwige, sans-serif", fontStyle: "italic" }}
                                            >
                                                {project.category}
                                            </p>
                                        </div>
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full border border-white/30 flex items-center justify-center">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="stroke-white">
                                                <path d="M7 17L17 7M17 7H7M17 7V17" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section id="featured-works" className="relative bg-black">
            <div className="relative h-screen">
                {/* Header */}
                <div className="absolute top-0 left-0 right-0 z-20 px-8 lg:px-12 pt-8 pb-8 flex items-end justify-between">
                    <div>
                        <p
                            className="text-sm uppercase tracking-[0.2em] text-white/40 mb-2"
                            style={{ fontFamily: "Roboto, sans-serif" }}
                        >
                            Selected Works
                        </p>
                        <h2
                            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white"
                            style={{ fontFamily: "Norwige, sans-serif", fontStyle: "italic" }}
                        >
                            Our Recent Projects
                        </h2>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Navigation Arrows */}
                        <button
                            onClick={scrollPrev}
                            disabled={!canScrollPrev}
                            className="w-11 h-11 md:w-12 md:h-12 rounded-full border-2 border-white bg-white/10 flex items-center justify-center transition-all duration-300 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed"
                            aria-label="Previous project"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="stroke-white">
                                <path d="M19 12H5M5 12L12 19M5 12L12 5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <button
                            onClick={scrollNext}
                            disabled={!canScrollNext}
                            className="w-11 h-11 md:w-12 md:h-12 rounded-full border-2 border-white bg-white/10 flex items-center justify-center transition-all duration-300 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed"
                            aria-label="Next project"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="stroke-white">
                                <path d="M5 12H19M19 12L12 5M19 12L12 19" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        {/* Counter */}
                        <span
                            className="text-4xl md:text-5xl font-bold text-white transition-all duration-300"
                            style={{ fontFamily: "Roboto, sans-serif" }}
                        >
                            {String(activeIndex + 1).padStart(2, "0")}
                        </span>
                        <span className="block h-[2px] w-8 bg-white/40" />
                        <span
                            className="text-lg text-white/40"
                            style={{ fontFamily: "Roboto, sans-serif" }}
                        >
                            {String(projects.length).padStart(2, "0")}
                        </span>
                    </div>
                </div>

                {/* Embla Carousel */}
                <div
                    className="absolute inset-0 top-32 lg:top-36 bottom-6 left-6 right-6 lg:left-10 lg:right-10 overflow-hidden"
                    ref={emblaRef}
                >
                    <div className="flex h-full gap-6">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className="relative flex-[0_0_100%] min-w-0 h-full"
                            >
                                <Link href={project.link} className="group block h-full">
                                    <div className="relative h-full w-full rounded-2xl md:rounded-3xl overflow-hidden">
                                        {/* Background Media */}
                                        {project.mediaType === "video" ? (
                                            <video
                                                src={project.media}
                                                autoPlay
                                                muted
                                                loop
                                                playsInline
                                                preload="metadata"
                                                poster={project.poster}
                                                aria-label={`${project.title} - ${project.category} showcase`}
                                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <Image
                                                src={project.media}
                                                alt={`${project.title} - ${project.category}`}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                sizes="100vw"
                                            />
                                        )}

                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />

                                        {/* Card Content */}
                                        <div className="absolute inset-x-0 bottom-0 p-8 md:p-10 lg:p-12">
                                            {/* Tags */}
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {project.tags.map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="px-3 py-1 text-xs md:text-sm text-white/80 border border-white/20 rounded-full backdrop-blur-sm"
                                                        style={{ fontFamily: "Roboto, sans-serif" }}
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                                <span
                                                    className="px-3 py-1 text-xs md:text-sm text-black bg-white rounded-full"
                                                    style={{ fontFamily: "Roboto, sans-serif" }}
                                                >
                                                    {project.year}
                                                </span>
                                            </div>

                                            {/* Title & Arrow Row */}
                                            <div className="flex items-end justify-between gap-4">
                                                <div>
                                                    <h3
                                                        className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2"
                                                        style={{ fontFamily: "Roboto, sans-serif" }}
                                                    >
                                                        {project.title}
                                                    </h3>
                                                    <p
                                                        className="text-base md:text-lg lg:text-xl text-white/60"
                                                        style={{ fontFamily: "Norwige, sans-serif", fontStyle: "italic" }}
                                                    >
                                                        {project.category}
                                                    </p>
                                                </div>

                                                {/* Arrow CTA */}
                                                <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/30 flex items-center justify-center transition-all duration-300 group-hover:bg-white group-hover:border-white">
                                                    <svg
                                                        width="20"
                                                        height="20"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        className="transition-colors duration-300 group-hover:stroke-black stroke-white"
                                                    >
                                                        <path
                                                            d="M7 17L17 7M17 7H7M17 7V17"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
