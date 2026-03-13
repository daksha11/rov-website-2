"use client";

import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const testimonials = [
    {
        quote: "ROV Studios completely transformed our online presence. The attention to detail and creative direction exceeded all our expectations.",
        name: "Jordan Mitchell",
        role: "Founder, The Bando",
    },
    {
        quote: "Working with the ROV team felt like a true partnership. They understood our vision from day one and delivered a website that truly represents our brand.",
        name: "Aysegul Ikna",
        role: "CEO, Aysegul Ikna",
    },
    {
        quote: "From concept to launch, the process was seamless. Our new site has driven a significant increase in client engagement and inquiries.",
        name: "David Kim",
        role: "Director, DKM Corp",
    },
];

export default function TestimonialsSection() {
    const [activeIndex, setActiveIndex] = useState(0);

    const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop: true, duration: 40 },
        [
            Autoplay({
                delay: 3000,
                stopOnInteraction: false,
                stopOnMouseEnter: true,
                stopOnLastSnap: false,
            }),
        ]
    );

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setActiveIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on("select", onSelect);
        return () => {
            emblaApi.off("select", onSelect);
        };
    }, [emblaApi, onSelect]);

    const scrollTo = useCallback(
        (index: number) => emblaApi?.scrollTo(index),
        [emblaApi]
    );

    return (
        <section className="relative py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-black">
            <div className="max-w-4xl mx-auto text-center">
                {/* Section Label */}
                <p
                    className="text-sm uppercase tracking-[0.2em] text-white/40 mb-3"
                    style={{ fontFamily: "Roboto, sans-serif" }}
                >
                    Testimonials
                </p>
                <h2
                    className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-16"
                    style={{ fontFamily: "Norwige, sans-serif", fontStyle: "italic" }}
                >
                    What Our Clients Say
                </h2>

                {/* Carousel */}
                <div ref={emblaRef} className="overflow-hidden">
                    <div className="flex">
                        {testimonials.map((t, i) => (
                            <div
                                key={i}
                                className="flex-[0_0_100%] min-w-0 px-4"
                            >
                                <div className="max-w-3xl mx-auto">
                                    {/* Quote Icon */}
                                    <svg
                                        className="mx-auto mb-8 text-[#EA9A61]"
                                        width="48"
                                        height="48"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <path d="M11 7.05C7.28 7.56 4.5 10.59 4.5 14.25c0 2.07 1.68 3.75 3.75 3.75S12 16.32 12 14.25 10.32 10.5 8.25 10.5c-.18 0-.36.02-.53.04C8.2 8.63 9.76 7.5 11.6 7.2L11 7.05zm8 0C15.28 7.56 12.5 10.59 12.5 14.25c0 2.07 1.68 3.75 3.75 3.75S20 16.32 20 14.25 18.32 10.5 16.25 10.5c-.18 0-.36.02-.53.04C16.2 8.63 17.76 7.5 19.6 7.2L19 7.05z" />
                                    </svg>

                                    {/* Quote Text */}
                                    <p
                                        className="text-xl md:text-2xl lg:text-3xl text-white/90 leading-relaxed mb-10"
                                        style={{ fontFamily: "Norwige, sans-serif", fontStyle: "italic" }}
                                    >
                                        &ldquo;{t.quote}&rdquo;
                                    </p>

                                    {/* Author */}
                                    <div>
                                        <p
                                            className="text-lg font-bold text-white"
                                            style={{ fontFamily: "Roboto, sans-serif" }}
                                        >
                                            {t.name}
                                        </p>
                                        <p
                                            className="text-sm text-white/50 mt-1"
                                            style={{ fontFamily: "Roboto, sans-serif" }}
                                        >
                                            {t.role}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dots */}
                <div className="flex justify-center gap-2 mt-10">
                    {testimonials.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => scrollTo(i)}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                                i === activeIndex
                                    ? "bg-[#EA9A61] w-8"
                                    : "bg-white/20 hover:bg-white/40"
                            }`}
                            aria-label={`Go to testimonial ${i + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
