"use client";

import dynamic from "next/dynamic";
import { NavigationDock } from "@/components/NavDoc";
import Footer from "@/components/Footer";
import ProjectStrip from "@/components/ProjectStrip";
import CrossSellNudges from "@/components/common/CrossSellNudges";
import { useState } from "react";
import { aiAutomationFaqItems } from "@/data/faq";
import { aiAutomationSteps } from "@/data/approach-steps";

const FaultyTerminal = dynamic(() => import("@/components/FaultyTerminal"), { ssr: false });
const OurApproachSection = dynamic(() => import("@/components/common/OurApproachSection"), {
    loading: () => <div className="bg-black min-h-[40vh]" />,
});
const FAQSection = dynamic(() => import("@/components/common/FAQSection"), {
    loading: () => <div className="bg-black min-h-[40vh]" />,
});

export default function AIContent() {
    const [activeCategory, setActiveCategory] = useState<string>("automation");

    return (
        <main className="relative min-h-screen bg-black text-white">
            <NavigationDock />

            {/* Hero Section */}
            <section className="relative min-h-screen flex flex-col justify-between px-6 md:px-12 lg:px-16 py-20 pt-32">
                {/* FaultyTerminal Background */}
                <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
                    <FaultyTerminal
                        scale={1.9}
                        gridMul={[2, 1]}
                        digitSize={1.2}
                        timeScale={0.3}
                        pause={false}
                        scanlineIntensity={0.5}
                        glitchAmount={1}
                        flickerAmount={1}
                        noiseAmp={1}
                        chromaticAberration={0}
                        dither={0}
                        curvature={0.28}
                        tint="#90422c"
                        mouseReact
                        mouseStrength={0.4}
                        pageLoadAnimation
                        brightness={0.3}
                        style={{ width: '100%', height: '100%' }}
                    />
                </div>
                {/* Top Section - Headline and Tagline */}
                <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-start gap-8 mb-20" style={{ zIndex: 1 }}>
                    {/* Left - Main Headline */}
                    <div className="flex-1">
                        <h1
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-tight"
                            style={{ fontFamily: 'Norwige, sans-serif', fontStyle: 'italic' }}
                        >
                            Transform your business with{" "}
                            <span className="relative inline-flex items-center gap-3">
                                <span
                                    className="px-5 py-1 rounded-full font-medium"
                                    style={{
                                        background: 'linear-gradient(135deg, #8B6F47 0%, #6B5437 100%)',
                                        fontFamily: 'Norwige, sans-serif',
                                        fontStyle: 'normal'
                                    }}
                                >
                                    intelligent
                                </span>
                                {/* Decorative Circle */}
                                <span
                                    className="w-10 h-10 md:w-12 md:h-12 rounded-full border-[3px] border-white/80 inline-flex"
                                    style={{ background: 'transparent' }}
                                />
                            </span>
                            <br />
                            automation
                        </h1>
                    </div>

                    {/* Right - Tagline */}
                    <div className="lg:max-w-md">
                        <p
                            className="text-sm md:text-base leading-relaxed"
                            style={{ fontFamily: 'Norwige, sans-serif', fontStyle: 'italic' }}
                        >
                            We build AI-powered solutions that streamline workflows, enhance decision-making, and unlock new possibilities for your business.
                        </p>
                    </div>
                </div>

                {/* Bottom Section - What We Build */}
                <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start" style={{ zIndex: 1 }}>
                    {/* Left - Categories */}
                    <div>
                        <h2
                            className="text-5xl md:text-6xl lg:text-7xl font-light mb-12 leading-tight"
                            style={{ fontFamily: 'Norwige, sans-serif', fontStyle: 'italic' }}
                        >
                            What We
                            <br />
                            Build
                        </h2>

                        {/* Category Pills - Custom Layout */}
                        <div className="flex flex-col gap-4 max-w-lg">
                            {/* First Row - AUTOMATION and ANALYTICS */}
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setActiveCategory("automation")}
                                    className={`
                                        px-6 py-4 font-medium text-sm md:text-base
                                        transition-all duration-300 ease-out
                                        ${activeCategory === "automation"
                                            ? 'bg-[#8B6F47] text-white opacity-100'
                                            : 'text-gray-400'
                                        }
                                    `}
                                    style={{
                                        fontFamily: 'Norwige, sans-serif',
                                        borderRadius: '40px',
                                        opacity: activeCategory === "automation" ? 1 : 0.6,
                                        background: activeCategory === "automation" ? '#8B6F47' : 'rgba(59, 33, 20, 0.30)'
                                    }}
                                >
                                    AUTOMATION
                                </button>
                                <button
                                    onClick={() => setActiveCategory("analytics")}
                                    className={`
                                        px-6 py-4 font-medium text-sm md:text-base
                                        transition-all duration-300 ease-out
                                        ${activeCategory === "analytics"
                                            ? 'bg-[#8B6F47] text-white opacity-100'
                                            : 'text-gray-400'
                                        }
                                    `}
                                    style={{
                                        fontFamily: 'Norwige, sans-serif',
                                        borderRadius: '40px',
                                        opacity: activeCategory === "analytics" ? 1 : 0.6,
                                        background: activeCategory === "analytics" ? '#8B6F47' : 'rgba(59, 33, 20, 0.30)'
                                    }}
                                >
                                    ANALYTICS
                                </button>
                            </div>

                            {/* Second Row - CHATBOTS & ASSISTANTS */}
                            <button
                                onClick={() => setActiveCategory("chatbots")}
                                className={`
                                    px-6 py-4 font-medium text-sm md:text-base text-left
                                    transition-all duration-300 ease-out
                                    ${activeCategory === "chatbots"
                                        ? 'bg-[#8B6F47] text-white opacity-100'
                                        : 'text-gray-400'
                                    }
                                `}
                                style={{
                                    fontFamily: 'Norwige, sans-serif',
                                    borderRadius: '40px',
                                    opacity: activeCategory === "chatbots" ? 1 : 0.6,
                                    background: activeCategory === "chatbots" ? '#8B6F47' : 'rgba(59, 33, 20, 0.30)'
                                }}
                            >
                                CHATBOTS & ASSISTANTS
                            </button>

                            {/* Third Row - CUSTOM SOLUTIONS with loading icon */}
                            <button
                                onClick={() => setActiveCategory("custom")}
                                className={`
                                    px-6 py-4 font-medium text-sm md:text-base text-left
                                    transition-all duration-300 ease-out
                                    ${activeCategory === "custom"
                                        ? 'bg-[#8B6F47] text-white opacity-100'
                                        : 'text-gray-400'
                                    }
                                `}
                                style={{
                                    fontFamily: 'Norwige, sans-serif',
                                    borderRadius: '40px',
                                    opacity: activeCategory === "custom" ? 1 : 0.6,
                                    background: activeCategory === "custom" ? '#8B6F47' : 'rgba(59, 33, 20, 0.30)'
                                }}
                            >
                                <span className="flex items-center gap-3">
                                    <span className="relative flex h-4 w-4">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full border-2 border-white opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-4 w-4 border-2 border-white"></span>
                                    </span>
                                    CUSTOM SOLUTIONS
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Right - Demo Showcase */}
                    <div className="relative">
                        <div
                            className="relative w-full aspect-video rounded-3xl overflow-hidden group cursor-pointer"
                            style={{
                                background: 'linear-gradient(135deg, #4A4A4A 0%, #3A3A3A 100%)',
                            }}
                        >
                            {/* Placeholder - Empty for now */}
                            <div className="absolute inset-0" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Project Strip CTA */}
            <ProjectStrip />

            {/* Cross-Sell Nudges */}
            <CrossSellNudges currentService="ai" />

            {/* Our Approach Section */}
            <OurApproachSection steps={aiAutomationSteps} />

            {/* FAQ Section */}
            <FAQSection items={aiAutomationFaqItems} />

            <Footer />
        </main>
    );
}
