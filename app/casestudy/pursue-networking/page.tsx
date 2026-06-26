import type { Metadata } from 'next';
import Image from 'next/image';
import { CreativeWorkSchema } from "@/components/CreativeWorkSchema";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
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
import { Testimonial } from "@/components/casestudy/Testimonial";

export const metadata: Metadata = {
    title: 'Pursue Networking - Case Study',
    description: 'How Range of View Studios built Pursue Networking, an AI-powered LinkedIn copilot turning B2B networking into revenue for 500+ sales professionals.',
    alternates: {
        canonical: 'https://www.rovstudios.com/casestudy/pursue-networking',
    },
    openGraph: {
        title: 'Pursue Networking Case Study | Range of View Studios',
        description: 'AI-powered LinkedIn copilot built from the ground up. Platform, brand, and pipeline now serving 500+ active professionals.',
        images: [{ url: '/casestudy/Pursue/pursue1.webp', width: 1200, height: 630, alt: 'Pursue Networking platform by ROV Studios' }],
        type: 'article',
        url: 'https://www.rovstudios.com/casestudy/pursue-networking',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Pursue Networking Case Study | Range of View Studios',
        description: 'AI-powered LinkedIn copilot built from the ground up. Platform, brand, and pipeline now serving 500+ active professionals.',
        images: ['/casestudy/Pursue/pursue1.webp'],
    },
};

export default function PursueNetworkingCaseStudyPage() {
    const sidebarItems = [
        { id: "overview", label: "Overview" },
        { id: "research", label: "Research" },
        { id: "design-system", label: "Design System" },
        { id: "screenshots", label: "Screenshots" },
        { id: "approach", label: "Approach" },
        { id: "result", label: "Result" },
    ];

    const competitors = [
        { name: "Taplio", logoStyle: { color: 'black', fontWeight: 'bold' } },
        { name: "Waalaxy", logoStyle: { color: 'black', fontWeight: 'bold' } },
        { name: "Pursue Networking", logoStyle: { color: '#F5C842', fontWeight: 'bold' } },
    ];

    const comparisonData = [
        { label: "AI-Powered Copilot", data: [true, false, true] },
        { label: "LinkedIn Safety First", data: [false, false, true] },
        { label: "Pipeline Tracking", data: [true, true, true] },
        { label: "Transparent Pricing", data: [false, false, true] },
        { label: "Human Relationship Focus", data: [false, false, true] },
        { label: "Actionable Tactics, No Fluff", data: [false, false, true] },
    ];

    const designSystemColors = [
        { name: "Midnight Base", hex: "#0B0B0F", color: "#0B0B0F" },
        { name: "Signal Gold", hex: "#F5C842", color: "#F5C842" },
        { name: "Action Blue", hex: "#3B82F6", color: "#3B82F6" },
    ];

    const designSystemTypography = [
        {
            label: "Display Typography - Norwige",
            font: "Norwige",
            text: "Confident display type for pitch moments and feature headlines",
            style: { fontFamily: 'Norwige, sans-serif', fontSize: '2.5rem' }
        },
        {
            label: "Body Typography - Inter",
            font: "Inter",
            text: "Clean, dense body copy built for scanning tactics and how-to content",
            style: { fontFamily: 'Inter, sans-serif', fontSize: '1.25rem', fontWeight: 'normal' }
        },
        {
            label: "Accent Typography - JetBrains Mono",
            font: "JetBrains Mono",
            text: "Monospace for data, metrics, and credibility cues",
            style: { fontFamily: 'JetBrains Mono, monospace', fontSize: '1.5rem' }
        },
    ];

    const approachItems = [
        {
            title: "Platform Architecture",
            descriptions: [
                "Built on Next.js and Supabase with a LinkedIn-safe automation layer. Real-time pipeline tracking, newsletter subscription flow, and content delivery system, all running on infrastructure tuned for speed and reliability."
            ]
        },
        {
            title: "AI Copilot Design",
            descriptions: [
                "Designed the AI copilot to augment the human, not replace them. Every suggestion is LinkedIn-policy aware, every outreach template preserves the sender's voice, and every tactic is pulled from patterns that actually convert."
            ]
        },
        {
            title: "Brand & Positioning",
            descriptions: [
                "Developed the full brand system: signal gold against a midnight base, monospaced data callouts, and a voice that is equal parts tactical operator and sales coach. The brand promises 'no fluff, just tactics' and the visual system enforces it."
            ]
        },
        {
            title: "Go-to-Market System",
            descriptions: [
                "Shipped the onboarding flow, newsletter capture, pricing page, and founder-story page as one coherent funnel. The community grew to 500+ professionals within the first launch window."
            ]
        }
    ];

    return (
        <>
        <CreativeWorkSchema
            name="Pursue Networking Platform"
            description="AI-powered LinkedIn copilot built from the ground up. Platform, brand, and pipeline serving 500+ B2B sales professionals."
            dateCreated="2025-06-01"
            url="/casestudy/pursue-networking"
            image="/casestudy/Pursue/pursue1.webp"
            aboutName="Pursue Networking"
        />
        <BreadcrumbSchema items={[
            { name: "Home", url: "" },
            { name: "Case Studies", url: "/casestudy" },
            { name: "Pursue Networking", url: "/casestudy/pursue-networking" },
        ]} />
        <main className="relative min-h-screen bg-black">
            <NavigationDock />

            <CaseStudyHero
                title={["AI-POWERED", "NETWORKING", "THAT CONVERTS"]}
                titleColors={["#ffffff", "#F5C842", "#ffffff"]}
                backgroundImage="/casestudy/Pursue/pursuecover.webp"
                objectPosition="center center"
                titleFont="Norwige, sans-serif"
                enableBlur={true}
                liveLink="https://pursuenetworking.com/"
                buttonAccentColor="#F5C842"
            />

            <section className="relative bg-black text-white py-16 px-6 md:px-12 lg:px-16">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
                    <CaseStudySidebar items={sidebarItems} activeColor="#F5C842" />

                    <div className="flex-1 space-y-12">
                        <div id="overview">
                            <OverviewSection
                                title="Overview"
                                content="Pursue Networking is an AI-powered LinkedIn copilot for B2B sales teams. We built the platform from scratch, including brand, product surface, and go-to-market, turning manual LinkedIn outreach into a repeatable system that preserves authenticity while scaling revenue."
                                titleColor="#F5C842"
                            />
                        </div>

                        <div id="research">
                            <ChallengeSection
                                title="The Challenge"
                                content="Sales teams burn hours every week on manual LinkedIn busywork like prospecting, follow-ups, and connection management. Existing tools either spam contacts (and get accounts flagged) or are too generic to be useful. Pursue needed a platform that felt human, respected LinkedIn policy, and actually converted connections into pipeline."
                                gradient="linear-gradient(91deg, #F5C842 0.74%, #FBD96B 100%)"
                                titleItalic={true}
                            />

                            <div className="mt-12">
                                <CompetitorAnalysis
                                    title="Competitor Analysis"
                                    description="We benchmarked Pursue against the two most visible LinkedIn automation tools to understand where the category fell short on trust, human focus, and transparent tactics."
                                    competitors={competitors}
                                    comparisonData={comparisonData}
                                    insight="The LinkedIn automation category has been burned by spammy tools that get users flagged. Pursue wins by leading with safety, authenticity, and tactics that actually move pipeline, not volume games."
                                    titleColor="#F5C842"
                                    highlightBorderColor="#F5C842"
                                    highlightRowBgColor="rgba(245, 200, 66, 0.10)"
                                    insightBadgeColor="#F5C842"
                                    insightBorderColor="#F5C842"
                                    checkColor="#F5C842"
                                />
                            </div>
                        </div>

                        <div id="design-system">
                            <DesignSystem
                                title="Design System"
                                description="A tactical operator aesthetic. Dense, confident, data-forward. Gold signals value, blue drives action, monospace earns credibility."
                                colors={designSystemColors}
                                typography={designSystemTypography}
                                titleColor="#F5C842"
                            />
                        </div>

                        <div id="screenshots">
                            <h2 className="text-2xl font-bold italic mb-6" style={{ fontFamily: 'Norwige, sans-serif', color: '#F5C842' }}>
                                Screenshots
                            </h2>
                            <div className="grid grid-cols-1 gap-4">
                                {[
                                    "/casestudy/Pursue/pursue1.webp",
                                    "/casestudy/Pursue/pursue2.webp",
                                    "/casestudy/Pursue/pursue3.webp",
                                ].map((src, i) => (
                                    <div key={i} className="relative w-full overflow-hidden rounded-xl border border-white/[0.06]">
                                        <Image
                                            src={src}
                                            alt={`Pursue Networking screenshot ${i + 1}`}
                                            width={1200}
                                            height={750}
                                            className="w-full h-auto object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div id="approach">
                            <Approach
                                title="Approach"
                                items={approachItems}
                                titleColor="#F5C842"
                                borderColor="#262626"
                                hoverBorderColor="#F5C842"
                                hoverBgColor="rgba(245, 200, 66, 0.10)"
                                bgColor="#0B0B0F"
                            />
                        </div>

                        <div id="result">
                            <Result
                                title="Result"
                                titleItalic={true}
                                statistic="500+"
                                description="The platform launched and the community started growing right away. Pursue now serves 500+ active sales professionals, with a content engine, onboarding flow, and AI copilot all running on the platform we built. It finally feels like the product it actually is."
                                titleColor="#F5C842"
                                statisticGradient="linear-gradient(91deg, #F5C842 0.74%, #FBD96B 100%)"
                                ctaBorderColor="#F5C842"
                                ctaHoverBgColor="#F5C842"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <Testimonial
                quote="ROV translated a complicated AI product into something people instantly get. The platform scales with us, and onboarding 500-plus sales professionals stopped being a bottleneck."
                authorName="Kolin Simon"
                authorTitle="Founder, Pursue Networking"
                itemName="Pursue Networking Platform"
                itemUrl="/casestudy/pursue-networking"
                accentColor="#F5C842"
            />

            <Footer />
        </main>
        </>
    );
}
