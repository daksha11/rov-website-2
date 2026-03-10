"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

type FaqItem = {
    question: string;
    answer: string;
};

const faqItems: FaqItem[] = [
    {
        question: "How much do you charge for mixing and mastering?",
        answer: "We charge $50 per song for vocal mixing and mastering. That includes balancing your vocals, cleaning up the sound, adding creative effects where needed, and making sure it hits the right loudness for streaming. If you need a full trackout mixed (beat stems, instruments, vocals, everything), pricing is higher depending on the complexity and number of stems. Reach out with your project details and we'll give you a custom quote."
    },
    {
        question: "How long does it take to get my song mixed and mastered?",
        answer: "Turnaround is 2 days from the time we receive your properly labeled stems and any notes. If you're recording with us in-house, your song is also mixed and mastered within 2 days after the session. If you're on a tight schedule for a rollout, let us know and we'll plan the timeline with you."
    },
    {
        question: "What do you need from me to mix my track properly?",
        answer: "We need all your stems exported and labeled clearly before you send them over. That means things like \"Lead Vocals,\" \"Adlibs,\" \"Kick,\" \"808,\" \"Guitar,\" and so on, not \"Audio_01.\" Make sure everything is the same tempo and starts from the same bar so it lines up. You'll email the stems along with a rough mix or reference track and any notes about the vibe you're going for."
    },
    {
        question: "Do you offer discounts for multiple songs or full projects?",
        answer: "Yes. If you're bringing a full project, EP, or a batch of singles, we offer discounted rates on mixing and mastering. The more songs we're working on together, the better we can lock in a package price. Tell us how many tracks you have, your timeline, and what extra services you might need, and we'll build a custom quote."
    },
    {
        question: "What makes your mixes stand out on streaming platforms?",
        answer: "We mix competitively for streaming loudness, so your records hit hard without sounding crushed. Our work has landed on placements like SoundCloud Song of the Day, On The Radar, Apple Radio, and more, so we know what translates well on real playlists and radios. The goal is a mix that feels big in the car, on headphones, and on all major platforms."
    },
    {
        question: "Can you help with cover art, rollouts, and visuals for my release?",
        answer: "Yes, this is where we really go full service. Beyond mixing and mastering, we can create cover art, website pages or microsites, merch designs, tracklists, and full rollout assets. If you need music videos or visual content to support the release, we can handle that too. We're set up to take you from recording to release, so you don't have to piece together a different person for every part of your rollout."
    }
];

export default function FAQBottomSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="relative w-full bg-black py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
            {/* Gradient Blob - Top Right */}
            <div
                className="absolute top-0 right-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] lg:w-[700px] lg:h-[700px] rounded-full pointer-events-none"
                style={{
                    background: 'rgba(96, 62, 37, 0.60)',
                    filter: 'blur(200px)',
                    transform: 'translate(20%, -20%)'
                }}
            />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    {/* Left Side - FAQ Title and CTA Card */}
                    <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-8">
                        {/* FAQ Title */}
                        <h2
                            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold"
                            style={{
                                fontFamily: "Norwige, sans-serif",
                                fontStyle: "italic",
                                letterSpacing: "-0.02em",
                                color: "#FFF4E3"
                            }}
                        >
                            FAQ
                        </h2>

                        {/* Still Have Questions Card */}
                        <div
                            className="rounded-3xl p-6 md:p-8 space-y-6"
                            style={{
                                background: "#7F5230",
                            }}
                        >
                            <div>
                                <h3
                                    className="text-xl md:text-2xl font-bold mb-3"
                                    style={{ fontFamily: "Roboto, sans-serif", color: "#FFF4E3" }}
                                >
                                    Still have questions?
                                </h3>
                                <p
                                    className="text-sm md:text-base leading-relaxed"
                                    style={{ fontFamily: "Roboto, sans-serif", color: "#FFF4E3", opacity: 0.9 }}
                                >
                                    Let&apos;s discuss your project and bring your vision to life.
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                {/* Three Overlapping Circles with Arrow */}
                                <div className="flex items-center flex-shrink-0 -space-x-4">
                                    {/* Left Outlined Circle */}
                                    <div
                                        className="w-12 h-12 md:w-14 md:h-14 rounded-full"
                                        style={{
                                            border: "2px solid rgba(255, 244, 227, 0.4)",
                                            background: "transparent"
                                        }}
                                    />

                                    {/* Center Filled Circle with Arrow */}
                                    <a
                                        href="https://calendly.com/rangeofviewmusic/30min"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-12 h-12 md:w-14 md:h-14 flex-shrink-0 rounded-full bg-[#FFF4E3] flex items-center justify-center hover:scale-110 transition-transform relative z-10"
                                        aria-label="Get started"
                                    >
                                        <svg
                                            width="24"
                                            height="24"
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
                                    </a>

                                    {/* Right Outlined Circle */}
                                    <div
                                        className="w-12 h-12 md:w-14 md:h-14 rounded-full"
                                        style={{
                                            border: "2px solid rgba(255, 244, 227, 0.4)",
                                            background: "transparent"
                                        }}
                                    />
                                </div>

                                {/* Let's Create Button */}
                                <a
                                    href="https://calendly.com/rangeofviewmusic/30min"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 px-6 py-3 md:px-8 md:py-4 rounded-full font-medium hover:opacity-90 transition-opacity uppercase tracking-wide text-sm md:text-base flex items-center justify-center"
                                    style={{
                                        background: "linear-gradient(132deg, #EA9A61 4.77%, #B16937 27.26%, #A64D2B 50.09%, #42201C 76.74%)",
                                        fontFamily: "Roboto, sans-serif",
                                        color: "#FFF4E3"
                                    }}
                                >
                                    LET&apos;S CREATE!
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - FAQ Items */}
                    <div className="lg:col-span-7 space-y-4">
                        {faqItems.map((item, index) => {
                            const isOpen = openIndex === index;

                            return (
                                <div
                                    key={index}
                                    className="border overflow-hidden transition-all duration-300"
                                    style={{
                                        borderRadius: "20px",
                                        borderColor: "rgba(255, 255, 255, 0.15)",
                                        background: "rgba(59, 33, 20, 0.35)",
                                    }}
                                >
                                    {/* Question Button */}
                                    <button
                                        onClick={() => toggleFaq(index)}
                                        className="w-full flex justify-between items-center text-left px-6 md:px-8 py-5 md:py-6 cursor-pointer group"
                                    >
                                        <span
                                            className="text-base md:text-lg lg:text-xl font-medium pr-4"
                                            style={{ fontFamily: "Roboto, sans-serif", color: "#FFF4E3" }}
                                        >
                                            {item.question}
                                        </span>
                                        <motion.div
                                            animate={{ rotate: isOpen ? 180 : 0 }}
                                            transition={{ duration: 0.2, ease: "easeOut" }}
                                            className="flex-shrink-0"
                                        >
                                            <ChevronDown
                                                className="w-6 h-6 md:w-7 md:h-7"
                                                style={{ color: isOpen ? "#957E5E" : "#FFF4E3" }}
                                            />
                                        </motion.div>
                                    </button>

                                    {/* Answer - Optimized for performance */}
                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{
                                                    duration: 0.2,
                                                    ease: "easeOut"
                                                }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-6 md:px-8 pb-5 md:pb-6 pt-2">
                                                    <p
                                                        className="text-base md:text-lg lg:text-xl leading-relaxed"
                                                        style={{ fontFamily: "Roboto, sans-serif", color: "#FFF4E3", opacity: 0.85 }}
                                                    >
                                                        {item.answer}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
