import type { Metadata } from 'next';
import Image from 'next/image';
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
import { Testimonial } from "@/components/casestudy/Testimonial";
import { CaseStudyFAQ } from "@/components/casestudy/CaseStudyFAQ";

export const metadata: Metadata = {
    title: 'Atlanta Tech Meetup - Case Study',
    description: "How Range of View Studios hand-built the Atlanta Tech Meetup community platform. 500+ members, 50+ events, 100% hand-coded and 0% AI-generated.",
    alternates: {
        canonical: 'https://www.rovstudios.com/casestudy/atlanta-tech-meetup',
    },
    openGraph: {
        title: 'Atlanta Tech Meetup Case Study | Range of View Studios',
        description: 'The vibe is the product. A hand-built community site for Atlanta\u2019s monthly tech meetup. 500+ builders, 50+ events.',
        images: [{ url: '/casestudy/atm/atm1.webp', width: 1200, height: 630, alt: 'Atlanta Tech Meetup community platform by ROV Studios' }],
        type: 'article',
        url: 'https://www.rovstudios.com/casestudy/atlanta-tech-meetup',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Atlanta Tech Meetup Case Study | Range of View Studios',
        description: 'The vibe is the product. A hand-built community site for Atlanta\u2019s monthly tech meetup. 500+ builders, 50+ events.',
        images: ['/casestudy/atm/atm1.webp'],
    },
};

export default function AtlantaTechMeetupCaseStudyPage() {
    const sidebarItems = [
        { id: "overview", label: "Overview" },
        { id: "research", label: "Research" },
        { id: "design-system", label: "Design System" },
        { id: "screenshots", label: "Screenshots" },
        { id: "approach", label: "Approach" },
        { id: "result", label: "Result" },
    ];

    const competitors = [
        { name: "Eventbrite", logoStyle: { color: 'black', fontWeight: 'bold' } },
        { name: "Meetup.com", logoStyle: { color: 'black', fontWeight: 'bold' } },
        { name: "Atlanta Tech Meetup", logoStyle: { color: '#EA9A61', fontWeight: 'bold' } },
    ];

    const comparisonData = [
        { label: "Full Brand Control", data: [false, false, true] },
        { label: "Community Storytelling", data: [false, false, true] },
        { label: "Founder Voice Forward", data: [false, false, true] },
        { label: "Hand-Built Experience", data: [false, false, true] },
        { label: "Integrated RSVP Flow", data: [true, true, true] },
        { label: "Photo Gallery & Archive", data: [true, false, true] },
    ];

    const designSystemColors = [
        { name: "Deep Night", hex: "#0A0A0A", color: "#0A0A0A" },
        { name: "ROV Orange", hex: "#EA9A61", color: "#EA9A61" },
        { name: "Warm Cream", hex: "#FFF4E3", color: "#FFF4E3" },
    ];

    const designSystemTypography = [
        {
            label: "Display Typography - Norwige",
            font: "Norwige",
            text: "Editorial-grade display type for founder voice and manifesto moments",
            style: { fontFamily: 'Norwige, sans-serif', fontSize: '2.5rem' }
        },
        {
            label: "Body Typography - Inter",
            font: "Inter",
            text: "Grounded, readable body copy for event details and community stories",
            style: { fontFamily: 'Inter, sans-serif', fontSize: '1.25rem', fontWeight: 'normal' }
        },
        {
            label: "Accent Typography - Monospace",
            font: "JetBrains Mono",
            text: "Monospace details for dates, counts, and the '100% hand-built' stamp",
            style: { fontFamily: 'JetBrains Mono, monospace', fontSize: '1.5rem' }
        },
    ];

    const approachItems = [
        {
            title: "The Human Layer Philosophy",
            descriptions: [
                "Every design decision was filtered through one rule: does this feel like a human made it? The site opens with founder voices, leads with real community photography, and treats the event page as a story, not a form."
            ]
        },
        {
            title: "100% Hand-Built, 0% Generated",
            descriptions: [
                "No templates, no AI-generated layouts, no stock imagery. Every section was designed and coded from scratch, and the site wears that commitment on its sleeve with a prominent 'Hand-built' stamp in the footer."
            ]
        },
        {
            title: "Community Showcase",
            descriptions: [
                "Built a rotating photo gallery from past meetups, founder profiles for Andrew Schillinger and A.D. Slaton, and a partnership section that anchors the community's relationships, including ROV Studios as a featured partner."
            ]
        },
        {
            title: "Event & RSVP Flow",
            descriptions: [
                "Integrated with Meetup.com for the RSVP pipeline while keeping the brand experience on the custom site. The next event is always the hero, and the 'first Tuesday' cadence is baked into the navigation."
            ]
        }
    ];

    return (
        <>
        <CreativeWorkSchema
            name="Atlanta Tech Meetup Community Platform"
            description="Hand-built community platform for Atlanta's monthly tech meetup. 500+ members and 50+ events, with a 100% hand-coded, 0% AI-generated design philosophy."
            dateCreated="2025-09-01"
            url="/casestudy/atlanta-tech-meetup"
            image="/casestudy/atm/atm1.webp"
            aboutName="Atlanta Tech Meetup"
            lead={{ name: "Ayush Basu", role: "Founder & Creative Director" }}
            clientUrl="https://www.atltechmeetup.com/"
        />
        <BreadcrumbSchema items={[
            { name: "Home", url: "" },
            { name: "Case Studies", url: "/casestudy" },
            { name: "Atlanta Tech Meetup", url: "/casestudy/atlanta-tech-meetup" },
        ]} />
        <main className="relative min-h-screen bg-black">
            <NavigationDock />

            <CaseStudyHero
                title={["HAND-BUILT", "COMMUNITY", "PLATFORM"]}
                titleColors={["#ffffff", "#EA9A61", "#ffffff"]}
                backgroundImage="/casestudy/atm/atm1.webp"
                titleFont="Norwige, sans-serif"
                enableBlur={true}
                liveLink="https://www.atltechmeetup.com/"
                buttonAccentColor="#EA9A61"
            />

            <section className="relative bg-black text-white py-16 px-6 md:px-12 lg:px-16">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
                    <CaseStudySidebar items={sidebarItems} activeColor="#EA9A61" />

                    <div className="flex-1 space-y-12">
                        <div id="overview">
                            <OverviewSection
                                title="Overview"
                                content="Atlanta Tech Meetup is a free, monthly gathering for engineers, founders, and builders in the AI, software, and cloud space. We built the community's home on the web from scratch with no templates, no AI-generated layouts, and no shortcuts. The brand philosophy is simple: the vibe is the product."
                                titleColor="#EA9A61"
                            />
                        </div>

                        <div id="research">
                            <ChallengeSection
                                title="The Challenge"
                                content="Generic event platforms flatten every community into the same template. Atlanta's builder scene needed a digital home that felt as hand-crafted as the meetups themselves. A place where founder voices carry, community photos lead, and the next event is always the hero. Off-the-shelf tools couldn't do that."
                                gradient="linear-gradient(91deg, #EA9A61 0.74%, #B16937 100%)"
                                titleItalic={true}
                            />

                            <div className="mt-12">
                                <CompetitorAnalysis
                                    title="Competitor Analysis"
                                    description="We compared the hand-built ATM site against the two dominant event platforms Atlanta communities default to, and mapped where brand control, storytelling, and founder voice broke down."
                                    competitors={competitors}
                                    comparisonData={comparisonData}
                                    insight="Off-the-shelf event platforms optimize for logistics, not character. A community's site has to communicate what the community actually feels like, and that requires hand-built design with founder voice at the center."
                                    titleColor="#EA9A61"
                                    highlightBorderColor="#EA9A61"
                                    highlightRowBgColor="rgba(234, 154, 97, 0.10)"
                                    insightBadgeColor="#EA9A61"
                                    insightBorderColor="#EA9A61"
                                    checkColor="#EA9A61"
                                />
                            </div>
                        </div>

                        <div id="design-system">
                            <DesignSystem
                                title="Design System"
                                description="Editorial, warm, and intentionally hand-built. Deep night background, ROV orange accents, and monospace details that mark every 'handmade' moment."
                                colors={designSystemColors}
                                typography={designSystemTypography}
                                titleColor="#EA9A61"
                            />
                        </div>

                        <div id="screenshots">
                            <h2 className="text-2xl font-bold italic mb-6" style={{ fontFamily: 'Norwige, sans-serif', color: '#EA9A61' }}>
                                Screenshots
                            </h2>
                            <div className="grid grid-cols-1 gap-4">
                                {[
                                    "/casestudy/atm/atm1.webp",
                                    "/casestudy/atm/atm2.webp",
                                    "/casestudy/atm/atm3.webp",
                                ].map((src, i) => (
                                    <div key={i} className="relative w-full overflow-hidden rounded-xl border border-white/[0.06]">
                                        <Image
                                            src={src}
                                            alt={`Atlanta Tech Meetup screenshot ${i + 1}`}
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
                                titleColor="#EA9A61"
                                borderColor="#262626"
                                hoverBorderColor="#EA9A61"
                                hoverBgColor="rgba(234, 154, 97, 0.10)"
                                bgColor="#0A0A0A"
                            />
                        </div>

                        <div id="result">
                            <Result
                                title="Result"
                                titleItalic={true}
                                statistic="500+"
                                description="The site now serves a 500+ member community across 50+ events and counting, with every first Tuesday of the month anchored by the next ATM gathering. Range of View Studios is featured as a partner on the live site, a reciprocal mark of the work we shipped together."
                                titleColor="#EA9A61"
                                statisticGradient="linear-gradient(91deg, #EA9A61 0.74%, #B16937 100%)"
                                ctaBorderColor="#EA9A61"
                                ctaHoverBgColor="#EA9A61"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <Testimonial
                quote="Off-the-shelf tools flattened our community into a template. ROV hand-built a platform with our voice baked in, and it's carried us past 500 members and 50 events without ever feeling generic."
                authorName="Andrew Schillinger & A.D. Slaton"
                authorTitle="Co-Founders, Atlanta Tech Meetup"
                itemName="Atlanta Tech Meetup Community Platform"
                itemUrl="/casestudy/atlanta-tech-meetup"
                accentColor="#EA9A61"
            />

            <CaseStudyFAQ
                accentColor="#EA9A61"
                leadName="Ayush Basu"
                leadRole="Founder & Creative Director"
                faqs={[
                    { question: "What did Range of View Studios build for Atlanta Tech Meetup?", answer: "A 100% hand-coded community platform with founder voices, community photography, and an integrated RSVP flow, with no off-the-shelf event template." },
                    { question: "How big is the Atlanta Tech Meetup community?", answer: "More than 500 members across 50-plus events, and growing." },
                    { question: "Why build a custom platform instead of using an existing tool?", answer: "Generic event tools flatten every community into the same template. A hand-built platform preserves the meetup's distinct voice and brand." },
                ]}
            />

            <Footer />
        </main>
        </>
    );
}
