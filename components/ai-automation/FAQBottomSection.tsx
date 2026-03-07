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
        question: "How long does it take to build and launch an AI automation?",
        answer: "Most projects go from discovery to launch within 4 to 8 weeks. Simpler automations can be live even sooner. We move fast because we've done this enough times to know exactly what needs to happen and in what order."
    },
    {
        question: "Do I need technical knowledge to work with you?",
        answer: "Not at all. You just need to understand your business and we'll take care of everything else. We handle the tech, the integrations, and the logic so you never have to."
    },
    {
        question: "Will this work with the tools and software I already use?",
        answer: "In most cases, yes. We design your automation around your existing stack so you're not forced to replace anything that's already working. If a tool connects to an API, there's a very good chance we can work with it."
    },
    {
        question: "What kinds of tasks and processes can actually be automated?",
        answer: "More than most people expect. Common starting points include lead follow-up, appointment scheduling, customer support, data entry, reporting, invoice processing, and internal notifications. A good rule of thumb: if your team does it repeatedly, there's a good chance we can automate it."
    },
    {
        question: "How do you measure the ROI of an automation?",
        answer: "We help you define clear KPIs before we build anything. After launch, we track time saved, cost reductions, response rates, and error rates so the impact is visible and measurable, not just a feeling."
    },
    {
        question: "Is my data safe?",
        answer: "Yes. We follow secure development and deployment practices across every project, including encrypted APIs, access controls, and secure cloud infrastructure. Your data stays yours."
    },
    {
        question: "What if I only have one or two processes I want to automate?",
        answer: "That's a great place to start. Many of our clients begin small and scale up once they see results. There's no requirement to automate everything at once."
    },
    {
        question: "What happens after the automation goes live?",
        answer: "We don't just hand it off and disappear. We monitor performance, make improvements, and help you expand the system as your business grows."
    },
    {
        question: "Can you integrate AI into the automations, not just basic workflows?",
        answer: "Absolutely. We build AI-powered workflows using models like GPT and Claude to handle content generation, decision-making, lead qualification, document processing, and more. It's not just rule-based logic."
    },
    {
        question: "What if my needs change after we launch?",
        answer: "That's expected and completely fine. We build systems that are designed to evolve. As your business grows or your priorities shift, we adapt the automation alongside you."
    },
    {
        question: "Do you work with small businesses or only large companies?",
        answer: "Both. Small and mid-sized businesses often see the highest impact because automation helps them punch above their weight without growing their headcount."
    },
    {
        question: "How do I know if AI automation is the right move for my business?",
        answer: "That's exactly what our discovery process is for. We take an honest look at your workflows and tell you where automation will genuinely move the needle and where it won't."
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
                                                initial={{ opacity: 0, scaleY: 0 }}
                                                animate={{ opacity: 1, scaleY: 1 }}
                                                exit={{ opacity: 0, scaleY: 0 }}
                                                transition={{
                                                    duration: 0.2,
                                                    ease: "easeOut"
                                                }}
                                                style={{
                                                    transformOrigin: "top",
                                                    willChange: "transform, opacity"
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
