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

export default function AysegulIknaCaseStudyPage() {
    const sidebarItems = [
        { id: "overview", label: "Overview" },
        { id: "research", label: "Research" },
        { id: "design-system", label: "Design System" },
        { id: "approach", label: "Approach" },
        { id: "result", label: "Result" },
    ];

    // Placeholder data - to be updated
    const competitors = [
        {
            name: "Competitor A",
            logoStyle: { color: 'black', fontWeight: 'bold' }
        },
        {
            name: "Competitor B",
            logoStyle: { color: 'black', fontWeight: 'bold' }
        },
        {
            name: "Aysegul Ikna",
            logoStyle: { color: 'black', fontWeight: 'bold' }
        },
    ];

    const comparisonData = [
        { label: "Metric 1", data: [true, true, true] },
        { label: "Metric 2", data: [true, false, true] },
    ];

    return (
        <main className="relative min-h-screen bg-black">
            <NavigationDock />

            {/* Hero Section - Using placeholder/Bando assets for now until updated */}
            <CaseStudyHero
                title={["Aysegul", "Ikna", "Website"]}
                titleColors={["#ffffff", "#cccccc", "#ffffff"]}
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
                                content="Overview content to be updated."
                            />
                        </div>

                        <div id="research">
                            <ChallengeSection
                                title="The Challenge"
                                content="Challenge content to be updated."
                            />

                            <div className="mt-12">
                                <CompetitorAnalysis
                                    title="Competitor Analysis"
                                    description="Competitor analysis content to be updated."
                                    competitors={competitors}
                                    comparisonData={comparisonData}
                                    insight="Insight to be updated."
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
