"use client";

import { NavigationDock } from "@/components/NavDoc";
import Footer from "@/components/Footer";
import { CaseStudyHero } from "@/components/casestudy/CaseStudyHero";
import { CaseStudySidebar } from "@/components/casestudy/CaseStudySidebar";
import { OverviewSection } from "@/components/casestudy/OverviewSection";
import { ChallengeSection } from "@/components/casestudy/ChallengeSection";
import { CompetitorAnalysis } from "@/components/casestudy/CompetitorAnalysis";
import { DesignSystem } from "@/components/casestudy/DesignSystem";
import { Approach } from "@/components/casestudy/Approach";
import { Result } from "@/components/casestudy/Result";

export default function IknaCaseStudyPage() {
    const sidebarItems = [
        { id: "overview", label: "Overview" },
        { id: "research", label: "Research" },
        { id: "design-system", label: "Design System" },
        { id: "approach", label: "Approach" },
        { id: "result", label: "Result" },
    ];

    const competitors = [
        {
            name: "Maelu Designs",
            logoStyle: { color: 'black', fontWeight: 'bold' }
        },
        {
            name: "Beya Made",
            logoStyle: { color: 'black', fontWeight: 'bold' }
        },
        {
            name: "Aysegul Ikna",
            logoStyle: { color: '#C90000', fontWeight: 'bold' } // Highlight
        },
    ];

    const comparisonData = [
        { label: "Luxury Aesthetic", data: [true, false, true] },
        { label: "Sustainability Message", data: [true, true, true] },
        { label: "Premium Justification", data: [false, false, true] },
        { label: "Brand Cohesion", data: [true, true, true] },
        { label: "Digital Shopping Experience", data: [false, false, true] },
        { label: "Social Integration", data: [false, false, true] },
    ];

    const designSystemColors = [
        { name: "White Base", hex: "#FFFFFF", color: "#FFFFFF" },
        { name: "Charcoal Grey", hex: "#262626", color: "#262626" },
        { name: "Dark Green Accents", hex: "#1A4D2E", color: "#1A4D2E" },
    ];

    const designSystemTypography = [
        {
            label: "Main Typography - Hornset",
            font: "Hornset",
            text: "Refined elegance for headlines and product names",
            style: { fontFamily: 'Hornset', fontSize: '2.5rem' }
        },
        {
            label: "Body Typography - HellasFun",
            font: "HellasFun",
            text: "Approachable readability for descriptions and information",
            style: { fontFamily: 'HellasFun', fontSize: '1.5rem', fontWeight: 'normal' }
        },
        {
            label: "Accent Typography - LostInSouth",
            font: "LostInSouth",
            text: "Distinctive personality for callouts and details",
            style: { fontFamily: 'LostInSouth', fontSize: '2rem' }
        },
    ];

    const approachItems = [
        {
            title: "Visual Language",
            descriptions: [
                "Gallery-quality photography standards with generous white space and minimal, intentional green accents that whisper sustainability rather than shout it."
            ]
        },
        {
            title: "Custom Development",
            descriptions: [
                "Hand-coded website architecture with Square integration for frictionless high-value transactions, Meta Pixel for retargeting, and automated email sequences with custom-designed templates."
            ]
        },
        {
            title: "Omnichannel Brand Refinement",
            descriptions: [
                "Complete Instagram overhaul including feed curation, bio optimization, highlight organization, and logo refinement to create visual consistency from discovery to purchase."
            ]
        },
        {
            title: "Experience Philosophy",
            descriptions: [
                "Every digital touchpoint designed to reflect the craftsmanship and attention to detail present in the physical garments—justifying premium pricing through premium experience."
            ]
        }
    ];

    return (
        <main className="relative min-h-screen bg-black">
            <NavigationDock />

            {/* Hero Section */}
            <CaseStudyHero
                title={["ELEVATING", "IKNA'S", "DIGITAL PRESENCE"]}
                titleColors={["#ffffff", "#1A4D2E", "#ffffff"]}
                backgroundImage="/webdev/ayseiknawebhome.png"
                titleFont="Hornset"
                enableBlur={true}
            />

            {/* Case Study Section */}
            <section className="relative bg-black text-white py-16 px-6 md:px-12 lg:px-16">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
                    <CaseStudySidebar items={sidebarItems} />

                    {/* Main Content */}
                    <div className="flex-1 space-y-12">
                        <div id="overview">
                            <OverviewSection
                                title="Overview"
                                content="A luxury digital transformation for Aysegul Ikna, a high-fashion sustainable brand at Citizen Supply in Ponce City Market. We created an elevated online presence that justifies premium pricing through sophisticated design and seamless e-commerce integration."
                                titleColor="#1A4D2E"
                            />
                        </div>

                        <div id="research">
                            <ChallengeSection
                                title="The Challenge"
                                content="Aysegul Ikna's handcrafted, sustainable pieces commanded luxury prices, but her digital presence didn't reflect that value. Without a cohesive online brand experience, potential customers couldn't understand or justify the investment in her high-end garments."
                                gradient="linear-gradient(91deg, #1A4D2E 0.74%, #2E5C42 100%)"
                            />

                            <div className="mt-12">
                                <CompetitorAnalysis
                                    title="Competitor Analysis"
                                    description="To position Aysegul Ikna in the digital luxury sustainable fashion space, we analyzed two Atlanta-based sustainable brands with established online presences."
                                    competitors={competitors}
                                    comparisonData={comparisonData}
                                    insight="Sustainability credentials alone don't justify premium pricing. Luxury perception requires visual sophistication, seamless experience, and brand cohesion across every touchpoint."
                                    titleColor="#1A4D2E"
                                    highlightBorderColor="#1A4D2E"
                                    highlightRowBgColor="rgba(26, 77, 46, 0.10)"
                                    insightBadgeColor="#1A4D2E"
                                    insightBorderColor="#1A4D2E"
                                    checkColor="#1A4D2E"
                                />
                            </div>
                        </div>

                        <div id="design-system">
                            <DesignSystem
                                title="Design System"
                                description="Visual identity refined to communicate luxury and intentionality at every interaction."
                                colors={designSystemColors}
                                typography={designSystemTypography}
                                titleColor="#1A4D2E"
                            />
                        </div>

                        <div id="approach">
                            <Approach
                                title="Approach"
                                items={approachItems}
                                titleColor="#1A4D2E"
                                borderColor="#262626"
                                hoverBorderColor="#1A4D2E"
                                hoverBgColor="rgba(26, 77, 46, 0.10)"
                                bgColor="#0E0A08"
                            />
                        </div>

                        <div id="result">
                            <Result
                                title="Result"
                                statistic="30%"
                                description="Within months of launch, Aysegul Ikna saw a 30% increase in monthly sales with significantly improved digital brand recognition. The online experience now commands the same respect and price point as her physical boutique presence at Ponce City Market."
                                titleColor="#1A4D2E"
                                statisticGradient="linear-gradient(91deg, #1A4D2E 0.74%, #2E5C42 100%)"
                                ctaBorderColor="#1A4D2E"
                                ctaHoverBgColor="#1A4D2E"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
