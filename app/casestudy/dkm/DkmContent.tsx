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

export default function DkmContent() {
    const mainColor = "rgb(245, 240, 235)";
    const mainColorHex = "#F5F0EB";
    const accentColor = "rgb(201, 169, 110)";
    const accentColorHex = "#C9A96E";
    const headingFont = "Norwige, sans-serif";
    const bodyFontStack = "'Roboto', sans-serif";

    const sidebarItems = [
        { id: "overview", label: "Overview" },
        { id: "research", label: "Research" },
        { id: "design-system", label: "Design System" },
        { id: "approach", label: "Approach" },
        { id: "result", label: "Result" },
    ];

    const competitors = [
        {
            name: "Big Four Tech",
            logoStyle: { color: 'black', fontWeight: 'bold', fontSize: '1.25rem', fontFamily: bodyFontStack }
        },
        {
            name: "Boutique Agencies",
            logoStyle: { color: 'black', fontWeight: 'bold', fontSize: '1rem', fontStyle: 'italic', letterSpacing: '0.05em' }
        },
        {
            name: "DKM CORP",
            logoStyle: { color: accentColor, fontWeight: 'bold', fontSize: '1.25rem', fontFamily: headingFont, letterSpacing: '0.1em' }
        },
    ];

    const comparisonData = [
        { label: "Operational Depth", data: [true, false, true] },
        { label: "Global Agility", data: [false, true, true] },
        { label: "Automation Focus", data: [false, false, true] },
        { label: "Execution-First", data: [false, false, true] },
        { label: "Performance Alignment", data: [false, false, true] },
    ];

    return (
        <main className="relative min-h-screen bg-black">
            <style jsx global>{`
                #dkm-content h1,
                #dkm-content h2,
                #dkm-content h3,
                #dkm-content h4,
                #dkm-content .font-heading {
                    font-family: ${headingFont} !important;
                }
                #dkm-content p,
                #dkm-content li {
                    font-family: ${bodyFontStack};
                }
            `}</style>
            <NavigationDock />

            <div id="dkm-content">
                <CaseStudyHero
                    title={["Scaling", "Global", "Operations"]}
                    titleColors={[mainColor, accentColor, mainColor]}
                    backgroundImage="/casestudy/dubaiskyline.webp"
                    titleFont={headingFont}
                    buttonAccentColor={accentColorHex}
                    buttonFont={bodyFontStack}
                    liveLink="https://www.dkmcorp.in/"
                />

                {/* Case Study Section */}
                <section className="relative bg-black py-16 px-6 md:px-12 lg:px-16" style={{ backgroundColor: '#000000', color: mainColor }}>
                    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
                        <CaseStudySidebar items={sidebarItems} activeColor="#8B6914" />

                        {/* Main Content */}
                        <div className="flex-1 space-y-12">
                            <div id="overview">
                                <OverviewSection
                                    title="Overview"
                                    content="A comprehensive brand identity and digital infrastructure project for DKM Corp, a private growth and operations partner spanning India, Australia, the US, and Dubai. We translated their high-level execution strategy into a professional, global-facing digital hub."
                                    titleColor={accentColor}
                                    titleFont={headingFont}
                                    bodyFont={bodyFontStack}
                                    textColor={mainColor}
                                />
                            </div>

                            <div id="research">
                                <ChallengeSection
                                    title="The Challenge"
                                    titleItalic={true}
                                    content="DKM Corp operates at the intersection of high-stakes strategy and boots-on-the-ground execution. Their previous presence didn't fully communicate the scale of their international reach or the 'execution-first' nature of their four-pillar model."
                                />

                                <div className="mt-12">
                                    <CompetitorAnalysis
                                        title="Competitor Analysis"
                                        description="We analyzed traditional consultancy firms and modern venture studios to find the gap. Most were either too corporate and stagnant or too 'agency-style' without operational depth."
                                        competitors={competitors}
                                        comparisonData={comparisonData}
                                        insight="Strategy is cheap; execution is the differentiator. The brand needed to feel like a high-performance engine—structured, efficient, and ready to scale."
                                        titleColor={accentColor}
                                        titleFont={headingFont}
                                        highlightBorderColor={accentColor}
                                        highlightRowBgColor={`rgba(${accentColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)?.slice(1).join(', ')}, 0.10)`}
                                        insightBadgeColor={accentColor}
                                        insightBorderColor={accentColor}
                                        checkColor={accentColor}
                                        textColor={mainColor}
                                        bodyFont={bodyFontStack}
                                    />
                                </div>
                            </div>

                            {/* Design System Section */}
                            <div id="design-system">
                                <DesignSystem
                                    title="DESIGN SYSTEM"
                                    titleItalic={true}
                                    description="A palette and type scale built for authority, clarity, and international appeal."
                                    colors={[
                                        { name: "True Black", hex: "#000000", color: "#000000" },
                                        { name: "Steel Grey", hex: "#1C1D21", color: "#1C1D21" },
                                        { name: "Off White", hex: mainColorHex, color: mainColor },
                                        { name: "Action Gold", hex: accentColorHex, color: accentColor }
                                    ]}
                                    typography={[
                                        {
                                            label: "Main Typography - Cormorant Garamond",
                                            font: "Cormorant Garamond",
                                            text: "CLEAN, MODERN, AND BUILT FOR PROFESSIONAL CLARITY.",
                                            style: { fontFamily: headingFont, fontWeight: 'bold', fontSize: '2rem' }
                                        },
                                        {
                                            label: "Body Typography - Inter",
                                            font: "Inter",
                                            text: "Versatile and highly legible for global business contexts.",
                                            style: { fontFamily: bodyFontStack, fontWeight: 'normal', fontSize: '1.5rem' }
                                        },
                                        {
                                            label: "Accent Typography - JetBrains Mono",
                                            font: "JetBrains Mono",
                                            text: "A NOD TO THE AUTOMATION AND SYSTEMS AT THE CORE OF THE OPERATIONS.",
                                            style: { fontFamily: 'JetBrains Mono, monospace', fontWeight: 'normal', fontSize: '1.25rem' }
                                        }
                                    ]}
                                    titleColor={accentColor}
                                    titleFont={headingFont}
                                    textColor={mainColor}
                                    bodyFont={bodyFontStack}
                                    labelColor={mainColor}
                                    secondaryColor={mainColor}
                                />
                            </div>

                            {/* Approach Section */}
                            <div id="approach">
                                <Approach
                                    title="APPROACH"
                                    titleColor={accentColor}
                                    titleFont={headingFont}
                                    borderColor="#1C1D21"
                                    hoverBorderColor={accentColor}
                                    hoverBgColor={`rgba(${accentColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)?.slice(1).join(', ')}, 0.10)`}
                                    bgColor="#000000"
                                    textColor={mainColor}
                                    bodyFont={bodyFontStack}
                                    labelColor={mainColor}
                                    items={[
                                        {
                                            title: "Design Language",
                                            descriptions: [
                                                "Clean grids and minimalist layouts that prioritize data and outcomes.",
                                                "A 'Command Center' aesthetic that feels both tech-forward and operationally grounded."
                                            ]
                                        },
                                        {
                                            title: "UX & Functionality",
                                            descriptions: [
                                                "Structured service pillars (Design, Market, Operate) with clear navigation.",
                                                "Direct-to-expert inquiry flow to mirror their 'no-fluff' engagement model."
                                            ]
                                        },
                                        {
                                            title: "Experience Front to Back",
                                            descriptions: [
                                                "Case studies highlighting diverse markets (India, Australia, US, Dubai).",
                                                "A seamless transition from high-level strategy to specific service execution."
                                            ]
                                        },
                                        {
                                            title: "Backend & Automation",
                                            descriptions: [
                                                "Custom lead capture integrated with CRM for immediate operational response.",
                                                "Scalable architecture to support the firm's growing portfolio of verticals."
                                            ]
                                        }
                                    ]}
                                />
                            </div>

                            {/* Result Section */}
                            <div id="result">
                                <Result
                                    title="RESULT"
                                    statistic="100%"
                                    description="Since the rollout of the new digital infrastructure, DKM Corp has achieved 100% execution across its four primary markets. The refined positioning has successfully attracted high-value partners in healthcare, real estate, and asset management, solidifying their status as a premier global growth partner."
                                    ctaText="Explore Our Services"
                                    ctaLink="/#services"
                                    titleColor={accentColor}
                                    titleFont={headingFont}
                                    statisticGradient={`linear-gradient(91deg, ${accentColorHex} 0.74%, #8B7340 100%)`}
                                    ctaBorderColor={accentColor}
                                    ctaHoverBgColor={accentColor}
                                    textColor={mainColor}
                                    bodyFont={bodyFontStack}
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <Footer />
        </main>
    );
}
