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




export default function CaseStudyPage() {
    const sidebarItems = [
        { id: "overview", label: "Overview" },
        { id: "research", label: "Research" },
        { id: "design-system", label: "Design System" },
        { id: "approach", label: "Approach" },
        { id: "result", label: "Result" },
    ];

    const competitors = [
        {
            name: "Slutty Vegan",
            logoStyle: { color: 'black', fontWeight: 'bold', fontStyle: 'italic', fontSize: '1.25rem', fontFamily: 'Brush Script MT, cursive' }
        },
        {
            name: "URBAN WINGS",
            logoStyle: { color: 'black', fontWeight: 'bold', fontSize: '0.875rem', letterSpacing: '0.1em' }
        },
        {
            name: "THE BANDO",
            logoStyle: { color: '#dc2626', fontWeight: 'bold', fontSize: '1.25rem', fontFamily: 'Impact, sans-serif' }
        },
    ];

    const comparisonData = [
        { label: "Speed & Conversion", data: [true, true, true] },
        { label: "Visual Boldness", data: [true, false, true] },
        { label: "Brand Voice", data: [false, false, true] },
        { label: "Cultural Identity", data: [false, false, true] },
        { label: "Community Feel", data: [false, false, true] },
        { label: "Memorability", data: [false, false, true] },
    ];

    return (
        <main className="relative min-h-screen bg-black">
            <NavigationDock />

            <CaseStudyHero
                title={["Crafting The", "Bando's Online", "Experience"]}
                titleColors={["#C90000", "#FFD600", "#C90000"]}
                backgroundImage="/casestudyheroimg.png"
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
                                content="A digital redesign project for The Bando, a bold Black history museum and fried chicken restaurant in West Atlanta, bringing their unapologetic brand energy into an online experience."
                            />
                        </div>

                        <div id="research">
                            <ChallengeSection
                                title="The Challenge"
                                content="The Bando's identity was powerful in person, but muted online. The site processed orders, but failed to capture the culture or keep people coming back."
                            />

                            <div className="mt-12">
                                <CompetitorAnalysis
                                    title="Competitor Analysis"
                                    description="To define The Bando's digital direction, we studied two Atlanta brands known for loud, fast-selling experiences. But was that enough?"
                                    competitors={competitors}
                                    comparisonData={comparisonData}
                                    insight="Speed and usability are table stakes. Culture and personality are what make brands memorable."
                                />
                            </div>
                        </div>

                        {/* Placeholder sections for future content */}
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
