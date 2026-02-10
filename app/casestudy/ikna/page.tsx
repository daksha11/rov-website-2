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
            name: "Competitor A",
            logoStyle: { color: 'white', fontWeight: 'bold', fontSize: '1.25rem' }
        },
        {
            name: "Competitor B",
            logoStyle: { color: 'white', fontWeight: 'bold', fontSize: '1.25rem' }
        },
        {
            name: "IKNA",
            logoStyle: { color: '#00f2ff', fontWeight: 'bold', fontSize: '1.5rem', letterSpacing: '0.2em' }
        },
    ];

    const comparisonData = [
        { label: "Modern Interface", data: [true, false, true] },
        { label: "User Engagement", data: [false, true, true] },
        { label: "Performance", data: [true, true, true] },
        { label: "Scalability", data: [false, false, true] },
    ];

    return (
        <main className="relative min-h-screen bg-black">
            <NavigationDock />

            <CaseStudyHero
                title={["Elevating", "IKNA's", "Digital Presence"]}
                titleColors={["#ffffff", "#00f2ff", "#ffffff"]}
                backgroundImage="/webdev/ayseiknawebhome.png"
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
                                content="IKNA is a cutting-edge technology consultant firm looking to redefine their market presence. Our mission was to build a platform that reflects their innovative spirit and technical prowess."
                            />
                        </div>

                        <div id="research">
                            <ChallengeSection
                                title="The Challenge"
                                content="IKNA's previous platform was outdated and didn't communicate the sophisticated solutions they provide. They needed a site that was as futuristic as their business model."
                            />

                            <div className="mt-12">
                                <CompetitorAnalysis
                                    title="Market Analysis"
                                    description="We analyzed the tech consulting landscape to identify gaps in visual storytelling and user interface design that IKNA could dominate."
                                    competitors={competitors}
                                    comparisonData={comparisonData}
                                    insight="B2B technology platforms can be both functional and visually stunning. IKNA's new design bridges that gap."
                                />
                            </div>
                        </div>

                        <div id="design-system">
                            <DesignSystem />
                        </div>

                        <div id="approach">
                            <Approach />
                        </div>

                        <div id="result">
                            <Result />
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
