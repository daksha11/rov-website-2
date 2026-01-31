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
        question: "How much does a website cost?",
        answer: "Our website projects typically range from $2,000 to $10,000+ depending on the scope and features you need. A simple 5-page business website with custom design starts around $2,000, while more complex sites with e-commerce, custom functionality, or extensive content can go higher. Every project is different, so we provide a detailed proposal after understanding your specific goals, timeline, and requirements. We're transparent about pricing from the start and work with you to find the right balance between your vision and budget."
    },
    {
        question: "How long does it take to build a website?",
        answer: "Most websites take 6 to 8 weeks from kickoff to launch. This includes discovery and strategy, design mockups, development, content integration, testing, and launch support. Simpler sites can be completed in 4 to 5 weeks, while more complex projects with e-commerce or custom features may take 10 to 12 weeks. The timeline also depends on how quickly you can provide feedback and content during the process. We'll give you a clear timeline during our initial consultation so you know exactly what to expect."
    },
    {
        question: "Will my website be mobile-friendly?",
        answer: "Absolutely. Every website we build is fully responsive, meaning it automatically adapts to look great and function perfectly on phones, tablets, and desktops. With over 60% of web traffic coming from mobile devices, we actually design for mobile first and then scale up to larger screens. Your site will load quickly, be easy to navigate, and provide a seamless experience no matter what device your visitors are using."
    },
    {
        question: "What platforms do you build websites on?",
        answer: "We primarily build custom websites using Next.js and modern web technologies, which gives you maximum flexibility, fast performance, and complete control over your site's design and functionality. For clients who need robust e-commerce capabilities, we can integrate platforms like Shopify or set up custom shopping solutions depending on your product catalog size and business needs. We choose the right technology based on your specific goals, whether that's a portfolio site, business site, or full online store. The advantage of our approach is that you're not locked into a template or limited by platform constraints."
    },
    {
        question: "Will I be able to update my website myself?",
        answer: "Yes, we build sites with user-friendly content management systems that let you make basic updates like changing text, adding images, or posting blog content without needing technical skills. During the handoff process, we provide training and documentation so you feel confident making these changes. For more complex updates like design changes, new features, or technical modifications, we're always available to help. The goal is to give you control over day-to-day content while having expert support when you need it."
    },
    {
        question: "Do you handle ongoing website updates and maintenance?",
        answer: "Yes, we offer flexible maintenance packages for clients who want ongoing support after launch. This can include regular content updates, security monitoring, performance optimization, plugin updates, and technical troubleshooting. Some clients prefer to handle simple updates themselves and call us for bigger changes, while others want us to manage everything. We'll work with you to create a maintenance plan that fits your needs and budget, whether that's a monthly retainer or on-demand support as issues come up."
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
