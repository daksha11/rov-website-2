import dynamic from "next/dynamic";
import Link from "next/link";
import { NavigationDock } from "@/components/sections/NavDoc";
import Footer from "@/components/sections/Footer";
import ServiceLeadSection from "@/components/sections/ServiceLeadSection";
import ProjectStrip from "@/components/sections/ProjectStrip";
import BriefCTASection from "@/components/common/BriefCTASection";
import CrossSellNudges from "@/components/common/CrossSellNudges";
import BrandHero from "@/components/brand/BrandHero";
import GradientButton from "@/components/brand/GradientButton";
import { brandFaqItems } from "@/data/faq";
import { brandSteps } from "@/data/approach-steps";

// Below-fold and interactive pieces, split out of the initial bundle.
const BrandStats = dynamic(() => import("@/components/brand/BrandStats"), {
    loading: () => <div className="bg-black min-h-[40vh]" />,
});

const TouchpointToggle = dynamic(() => import("@/components/brand/TouchpointToggle"), {
    loading: () => <div className="bg-black min-h-[60vh]" />,
});

const BrandPricingTiers = dynamic(() => import("@/components/brand/BrandPricingTiers"), {
    loading: () => <div className="bg-black min-h-[40vh]" />,
});

const BrandWorkGallery = dynamic(() => import("@/components/brand/BrandWorkGallery"), {
    loading: () => <div className="bg-black min-h-[50vh]" />,
});

const OurApproachSection = dynamic(() => import("@/components/common/OurApproachSection"), {
    loading: () => <div className="bg-black min-h-[40vh]" />,
});

const FAQSection = dynamic(() => import("@/components/common/FAQSection"), {
    loading: () => <div className="bg-black min-h-[40vh]" />,
});

// The five moments of the Full View. One line each: the page already argues the
// point twice over in the demo, so this section is a map rather than an essay.
const MOMENTS: { name: string; line: string }[] = [
    { name: "Found", line: "They can actually find you." },
    { name: "Captured", line: "The visit turns into a contact." },
    { name: "Answered", line: "Someone replies before they move on." },
    { name: "Nurtured", line: "You stay in the room without nagging." },
    { name: "Kept", line: "They come back, and they tell someone." },
];

// What actually gets delivered, split by the two halves most studios treat as
// separate jobs.
const DELIVERABLES: { group: string; items: string[] }[] = [
    {
        group: "The identity",
        items: [
            "Naming, if you need it",
            "Primary mark and its variations",
            "Type system with real hierarchy",
            "Color palette with accessible contrast pairs",
            "Spacing and layout rules",
            "Guidelines written to be applied, not filed",
        ],
    },
    {
        group: "The surfaces it lives on",
        items: [
            "Website and landing pages",
            "Email and lifecycle sequences, built and shipped",
            "Confirmation and receipt templates",
            "Thank-you and post-purchase pages",
            "Booking, intake, and contact forms",
            "Review requests and follow-up",
        ],
    },
];

// Cluster links. The /web hub shipped without these and the cluster only
// pointed one direction, so this page gets them on day one.
const GUIDES: { href: string; title: string; blurb: string }[] = [
    {
        href: "/blog/thebando-brand-transformation",
        title: "A brand rebuild that moved numbers",
        blurb: "Identity, site, and ordering rebuilt. 689x more online orders in 139 days.",
    },
    {
        href: "/blog/creative-studios-atlanta",
        title: "Creative studios in Atlanta",
        blurb: "What a studio does, how to judge one, what it costs.",
    },
    {
        href: "/blog/creative-studio-vs-agency-vs-freelancer",
        title: "Studio vs. agency vs. freelancer",
        blurb: "Cost, speed, range, accountability. Which one you need.",
    },
    {
        href: "/blog/dkm-corp-brand-identity",
        title: "A global identity: DKM Corp",
        blurb: "Full rebuild across four countries, every decision documented.",
    },
    {
        href: "/web/how-much-does-a-website-cost-in-atlanta",
        title: "What a website costs in Atlanta",
        blurb: "Real 2026 prices and what moves them.",
    },
];

export default function BrandContent() {
    return (
        <main className="min-h-screen bg-black text-white relative overflow-x-hidden">
            <BrandHero />

            <ProjectStrip />

            {/* The demo carries the argument, so it runs before the prose does. */}
            <TouchpointToggle />

            <BrandWorkGallery />

            <BrandStats />

            {/* ── THE GAP ──
                The demo already made this argument visually, so this is one
                sentence and a pull quote, not the essay it used to be. */}
            <section id="the-gap" className="relative px-6 py-20 md:px-12 md:py-28 lg:px-16">
                <div className="mx-auto max-w-4xl text-center">
                    <p
                        className="mb-6 text-xs uppercase tracking-[0.3em]"
                        style={{ color: "rgba(255,244,227,0.3)", fontFamily: "Norwige, sans-serif" }}
                    >
                        The gap
                    </p>
                    <h2
                        className="text-[clamp(1.9rem,4.6vw,3.5rem)] leading-[1.14] text-white"
                        style={{ fontFamily: "NorwigeHeroItalic, sans-serif" }}
                    >
                        Design studios make beautiful things that sit still.
                        <br className="hidden md:block" /> Automation shops make working things that look
                        cheap.
                    </h2>
                    <p className="mx-auto mt-8 max-w-xl text-[1.05rem] leading-relaxed text-white/60">
                        The 11pm automated email should look like it came from the same company as the
                        website. That only happens when the same people build both.
                    </p>
                </div>
            </section>

            {/* ── THE FULL VIEW: five moments, one line each ── */}
            <section className="relative px-6 pb-20 md:px-12 md:pb-28 lg:px-16">
                <div className="mx-auto max-w-6xl">
                    <p
                        className="mb-6 text-xs uppercase tracking-[0.3em]"
                        style={{ color: "rgba(255,244,227,0.3)", fontFamily: "Norwige, sans-serif" }}
                    >
                        The Full View · five moments
                    </p>

                    <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                        {MOMENTS.map((moment, i) => (
                            <li
                                key={moment.name}
                                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all hover:-translate-y-1 hover:border-[#EA9A61]/40"
                            >
                                <span
                                    className="mb-3 block text-[2rem] font-semibold italic leading-none"
                                    style={{
                                        fontFamily: "Norwige, sans-serif",
                                        background: "linear-gradient(90deg, #FF8904 0%, #F54900 100%)",
                                        backgroundClip: "text",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                    }}
                                >
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                <h3
                                    className="mb-2 text-base text-white"
                                    style={{ fontFamily: "Norwige, sans-serif" }}
                                >
                                    {moment.name}
                                </h3>
                                <p className="text-sm leading-snug text-white/50">{moment.line}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            {/* ── WHAT YOU GET ── */}
            <section className="relative px-6 py-24 md:px-12 md:py-32 lg:px-16">
                <div className="mx-auto max-w-6xl">
                    <p
                        className="mb-6 text-xs uppercase tracking-[0.3em]"
                        style={{ color: "rgba(255,244,227,0.3)", fontFamily: "Norwige, sans-serif" }}
                    >
                        What you get
                    </p>
                    <h2
                        className="mb-14 max-w-3xl text-[clamp(1.9rem,4.4vw,3.4rem)] leading-[1.14] text-white"
                        style={{ fontFamily: "NorwigeHeroItalic, sans-serif" }}
                    >
                        Both halves, from the same studio
                    </h2>

                    <div className="grid gap-5 md:grid-cols-2">
                        {DELIVERABLES.map((block) => (
                            <div
                                key={block.group}
                                className="rounded-2xl border border-white/10 bg-white/[0.03] p-8"
                            >
                                <h3
                                    className="mb-6 text-xl text-white"
                                    style={{ fontFamily: "Norwige, sans-serif" }}
                                >
                                    {block.group}
                                </h3>
                                <ul className="space-y-3">
                                    {block.items.map((item) => (
                                        <li key={item} className="flex gap-3 text-[0.9375rem] leading-relaxed text-white/60">
                                            <span aria-hidden="true" className="mt-[2px] text-[#EA9A61]">
                                                →
                                            </span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Mid-page CTA, where they've just seen the scope. Form
                        first, booking as the real alternative: both buttons
                        used to land in the same place. */}
                    <div className="mt-12 flex flex-wrap items-center gap-4">
                        <GradientButton href="#start">Get a brand read</GradientButton>
                        <GradientButton
                            href="https://cal.com/rov-studios-imhphw/15min"
                            variant="ghost"
                        >
                            Talk it through
                        </GradientButton>
                    </div>
                </div>
            </section>

            {/* ── PRICING ── */}
            <BrandPricingTiers />

            {/* Brief entry point, right after the numbers. */}
            <BriefCTASection service="brand" />

            {/* ── APPROACH ── */}
            <OurApproachSection steps={brandSteps} />

            {/* ── CLUSTER LINKS ── */}
            <section className="relative px-6 py-20 md:px-12 md:py-28 lg:px-16">
                <div className="mx-auto max-w-6xl">
                    <p
                        className="mb-10 text-center text-xs uppercase tracking-[0.3em] md:mb-14"
                        style={{ color: "rgba(255,244,227,0.3)", fontFamily: "Norwige, sans-serif" }}
                    >
                        Read before you hire anyone
                    </p>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {GUIDES.map((guide) => (
                            <Link
                                key={guide.href}
                                href={guide.href}
                                className="group block rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all hover:-translate-y-1 hover:border-[#EA9A61]/40 hover:bg-white/[0.06]"
                            >
                                <h3
                                    className="mb-2 text-base text-white md:text-lg"
                                    style={{ fontFamily: "Norwige, sans-serif" }}
                                >
                                    {guide.title}
                                </h3>
                                <p className="text-sm leading-relaxed text-white/55 md:text-[0.9375rem]">
                                    {guide.blurb}
                                </p>
                                <span className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#EA9A61]/70 transition-colors group-hover:text-[#EA9A61]">
                                    Read the guide
                                    <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                                        &rarr;
                                    </span>
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <CrossSellNudges currentService="brand" />

            <FAQSection items={brandFaqItems} />

            <div id="start">
                <ServiceLeadSection
                    source="services:brand"
                    heading="Where does your brand stop?"
                    subheading="Tell us what you have and what your customers actually see after they buy. We'll tell you honestly which gaps are worth fixing and roughly what it would take. No pitch deck, just a conversation."
                    messagePlaceholder="Your current identity (if any), the tools your emails go out from, and what feels off..."
                />
            </div>

            <NavigationDock />

            <Footer />
        </main>
    );
}
