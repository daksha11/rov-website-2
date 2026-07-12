import type { Metadata } from 'next';
import { CreativeWorkSchema } from "@/components/schema/CreativeWorkSchema";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { NavigationDock } from "@/components/sections/NavDoc";
import Footer from "@/components/sections/Footer";
import { CaseStudyHero } from "@/components/casestudy/CaseStudyHero";
import { CaseStudySidebar } from "@/components/casestudy/CaseStudySidebar";
import { OverviewSection } from "@/components/casestudy/OverviewSection";
import { ChallengeSection } from "@/components/casestudy/ChallengeSection";
import { CompetitorAnalysis } from "@/components/casestudy/CompetitorAnalysis";
import { DesignSystem } from "@/components/casestudy/DesignSystem";
import { Approach } from "@/components/casestudy/Approach";
import { Result } from "@/components/casestudy/Result";
import IknaInstagramFeature from "@/components/casestudy/IknaInstagramFeature";
import { Testimonial } from "@/components/casestudy/Testimonial";
import { CaseStudyFAQ } from "@/components/casestudy/CaseStudyFAQ";

export const metadata: Metadata = {
    title: 'Aysegul Ikna - Case Study',
    description: 'How Range of View Studios built a sophisticated digital home for Aysegul Ikna, a sustainable fashion brand at Ponce City Market. 30% sales growth achieved.',
    alternates: {
        canonical: 'https://www.rovstudios.com/casestudy/ikna',
    },
    openGraph: {
        title: 'Aysegul Ikna Case Study | Range of View Studios',
        description: 'Luxury sustainable fashion meets digital. 30% increase in monthly sales.',
        images: [{ url: '/og/og-ikna.webp', width: 1200, height: 630, alt: 'Aysegul Ikna website by ROV Studios' }],
        type: 'article',
        url: 'https://www.rovstudios.com/casestudy/ikna',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Aysegul Ikna Case Study | Range of View Studios',
        description: 'Luxury sustainable fashion meets digital. 30% increase in monthly sales.',
        images: ['/og/og-ikna.webp'],
    },
};

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
                "Every digital touchpoint designed to reflect the craftsmanship and attention to detail present in the physical garments, justifying premium pricing through premium experience."
            ]
        }
    ];

    return (
        <>
        <CreativeWorkSchema
            name="Aysegul Ikna Website Design"
            description="Luxury digital transformation for Aysegul Ikna, a sustainable fashion brand at Ponce City Market. 30% increase in monthly sales achieved."
            dateCreated="2025-01-15"
            url="/casestudy/ikna"
            image="/og/og-ikna.webp"
            aboutName="Aysegul Ikna"
            lead={{ name: "Ayush Basu", role: "Founder & Creative Director" }}
            clientUrl="https://www.aysegulikna.com/"
        />
        <BreadcrumbSchema items={[
            { name: "Home", url: "" },
            { name: "Case Studies", url: "/casestudy" },
            { name: "Aysegul Ikna", url: "/casestudy/ikna" },
        ]} />
        <main className="relative min-h-screen bg-black">
            <NavigationDock />

            {/* Hero Section */}
            <CaseStudyHero
                title={["ELEVATING", "IKNA'S", "DIGITAL PRESENCE"]}
                titleColors={["#ffffff", "#4CAF7D", "#ffffff"]}
                backgroundImage="/casestudy/iknacasestudy.webp"
                titleFont="Norwige, sans-serif"
                enableBlur={true}
                liveLink="https://www.aysegulikna.com/"
                buttonAccentColor="#4CAF7D"
            />

            {/* Case Study Section */}
            <section className="relative bg-black text-white py-16 px-6 md:px-12 lg:px-16">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
                    <CaseStudySidebar items={sidebarItems} activeColor="#4CAF7D" />

                    {/* Main Content */}
                    <div className="flex-1 space-y-12">
                        <div id="overview">
                            <OverviewSection
                                title="Overview"
                                content="A luxury digital transformation for Aysegul Ikna, a high-fashion sustainable brand at Citizen Supply in Ponce City Market. We created an elevated online presence that justifies premium pricing through sophisticated design and seamless e-commerce integration."
                                titleColor="#4CAF7D"
                            />
                        </div>

                        <div id="research">
                            <ChallengeSection
                                title="The Challenge"
                                content="Aysegul Ikna's handcrafted, sustainable pieces commanded luxury prices, but her digital presence didn't reflect that value. Without a cohesive online brand experience, potential customers couldn't understand or justify the investment in her high-end garments."
                                gradient="linear-gradient(91deg, #4CAF7D 0.74%, #6BC49A 100%)"
                                titleItalic={true}
                            />

                            <div className="mt-12">
                                <CompetitorAnalysis
                                    title="Competitor Analysis"
                                    description="To position Aysegul Ikna in the digital luxury sustainable fashion space, we analyzed two Atlanta-based sustainable brands with established online presences."
                                    competitors={competitors}
                                    comparisonData={comparisonData}
                                    insight="Sustainability credentials alone don't justify premium pricing. Luxury perception requires visual sophistication, seamless experience, and brand cohesion across every touchpoint."
                                    titleColor="#4CAF7D"
                                    highlightBorderColor="#4CAF7D"
                                    highlightRowBgColor="rgba(26, 77, 46, 0.10)"
                                    insightBadgeColor="#4CAF7D"
                                    insightBorderColor="#4CAF7D"
                                    checkColor="#4CAF7D"
                                />
                            </div>
                        </div>

                        <div id="design-system">
                            <DesignSystem
                                title="Design System"
                                description="Visual identity refined to communicate luxury and intentionality at every interaction."
                                colors={designSystemColors}
                                typography={designSystemTypography}
                                titleColor="#4CAF7D"
                            />
                        </div>

                        <div id="approach">
                            <Approach
                                title="Approach"
                                items={approachItems}
                                titleColor="#4CAF7D"
                                borderColor="#262626"
                                hoverBorderColor="#4CAF7D"
                                hoverBgColor="rgba(26, 77, 46, 0.10)"
                                bgColor="#0E0A08"
                            />
                        </div>

                        <IknaInstagramFeature />

                        <div id="result">
                            <Result
                                title="Result"
                                titleItalic={true}
                                statistic="30%"
                                description="Within months of launch, Aysegul Ikna saw a 30% increase in monthly sales with significantly improved digital brand recognition. The online experience now commands the same respect and price point as her physical boutique presence at Ponce City Market."
                                titleColor="#4CAF7D"
                                statisticGradient="linear-gradient(91deg, #4CAF7D 0.74%, #6BC49A 100%)"
                                ctaBorderColor="#4CAF7D"
                                ctaHoverBgColor="#4CAF7D"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <Testimonial
                quote="Everything finally looks like it came from one brain. It all tells the same story now."
                authorName="Aysegul Ikna"
                authorTitle="Owner, Designer & Founder, Aysegul Ikna"
                itemName="Aysegul Ikna Website Design"
                itemUrl="/casestudy/ikna"
                accentColor="#4CAF7D"
            />

            <CaseStudyFAQ
                accentColor="#4CAF7D"
                leadName="Ayush Basu"
                leadRole="Founder & Creative Director"
                faqs={[
                    { question: "What did Range of View Studios deliver for Aysegul Ikna?", answer: "A custom-coded luxury e-commerce website, full brand identity refinement, Square payment integration, Meta Pixel retargeting, automated email sequences, and a complete Instagram overhaul, end to end." },
                    { question: "What results did the new Aysegul Ikna website drive?", answer: "Within months of launch, Aysegul Ikna saw a 30% increase in monthly sales, with an online experience that finally matched the premium price point of her boutique at Ponce City Market." },
                    { question: "What was the Aysegul Ikna website built with?", answer: "A hand-coded architecture with Square integration for high-value transactions, rather than a templated store, so every detail reflects the craftsmanship of the garments." },
                    { question: "Who is Aysegul Ikna?", answer: "A sustainable, high-fashion brand based at Citizen Supply in Ponce City Market, Atlanta, known for handcrafted, premium pieces." },
                ]}
            />

            <Footer />
        </main>
        </>
    );
}
