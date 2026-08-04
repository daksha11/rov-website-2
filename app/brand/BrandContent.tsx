import dynamic from "next/dynamic";
import Link from "next/link";
import { NavigationDock } from "@/components/sections/NavDoc";
import Footer from "@/components/sections/Footer";
import ServiceLeadSection from "@/components/sections/ServiceLeadSection";
import ProjectStrip from "@/components/sections/ProjectStrip";
import CrossSellNudges from "@/components/common/CrossSellNudges";
import BrandHero from "@/components/brand/BrandHero";
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

const OurApproachSection = dynamic(() => import("@/components/common/OurApproachSection"), {
    loading: () => <div className="bg-black min-h-[40vh]" />,
});

const FAQSection = dynamic(() => import("@/components/common/FAQSection"), {
    loading: () => <div className="bg-black min-h-[40vh]" />,
});

// The five moments of the Full View. Practice areas answer "how"; these answer
// "what changes for me", so they lead.
const MOMENTS: { name: string; line: string; detail: string }[] = [
    {
        name: "Found",
        line: "They can actually find you.",
        detail: "Search, maps, and the profile you never finished filling out. If you are invisible here, nothing downstream matters.",
    },
    {
        name: "Captured",
        line: "The visit turns into a contact.",
        detail: "A site that asks for the right thing at the right moment, on a form that works on a phone in one hand.",
    },
    {
        name: "Answered",
        line: "Someone replies before they move on.",
        detail: "Speed is the experience. A reply in thirty seconds and a reply in three hours are different businesses to the person waiting.",
    },
    {
        name: "Nurtured",
        line: "You stay in the room without nagging.",
        detail: "Sequences that sound like you wrote them, sent because something happened, not because a calendar said Tuesday.",
    },
    {
        name: "Kept",
        line: "They come back, and they tell someone.",
        detail: "Receipts, thank-you pages, and review requests that look like the same company they chose in the first place.",
    },
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
        href: "/blog/creative-studios-atlanta",
        title: "Creative studios in Atlanta: the complete guide",
        blurb: "What a studio actually does, how to judge one, and what the work costs in 2026.",
    },
    {
        href: "/blog/creative-studio-vs-agency-vs-freelancer",
        title: "Studio vs. agency vs. freelancer",
        blurb: "Cost, speed, range, and accountability compared, so you can pick the right one for the job.",
    },
    {
        href: "/blog/dkm-corp-brand-identity",
        title: "Building a global brand identity: DKM Corp",
        blurb: "A full identity and website rebuild, run across Atlanta and India. Every decision documented.",
    },
    {
        href: "/web/how-much-does-a-website-cost-in-atlanta",
        title: "How much does a website cost in Atlanta?",
        blurb: "Real 2026 prices, what moves them, and what a cheap site really costs you later.",
    },
    {
        href: "/report",
        title: "Get a free visibility report",
        blurb: "We audit your surfaces by hand and send back the gaps, what each costs you, and what to fix first.",
    },
];

export default function BrandContent() {
    return (
        <main className="min-h-screen bg-black text-white relative overflow-x-hidden">
            <BrandHero />

            <ProjectStrip />

            {/* The demo carries the argument, so it runs before the prose does. */}
            <TouchpointToggle />

            <BrandStats />

            {/* ── THE GAP: the wedge argument ── */}
            <section id="the-gap" className="relative px-6 py-24 md:px-12 md:py-32 lg:px-16">
                <div className="mx-auto max-w-5xl">
                    <p
                        className="mb-6 text-xs uppercase tracking-[0.3em]"
                        style={{ color: "rgba(255,244,227,0.3)", fontFamily: "Norwige, sans-serif" }}
                    >
                        The gap
                    </p>
                    <h2
                        className="max-w-3xl text-[clamp(1.9rem,4.4vw,3.4rem)] leading-[1.14] text-white"
                        style={{ fontFamily: "NorwigeHeroItalic, sans-serif" }}
                    >
                        Design studios make beautiful things that sit still. Automation shops make
                        working things that look cheap.
                    </h2>

                    <div className="mt-12 grid gap-6 md:grid-cols-2">
                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
                            <h3 className="mb-3 text-lg text-white" style={{ fontFamily: "Norwige, sans-serif" }}>
                                What you were sold
                            </h3>
                            <p className="text-[0.9375rem] leading-relaxed text-white/55">
                                A logo, a palette, a guidelines document, and a website. All of it good.
                                All of it stopping at the moment a customer actually becomes a customer.
                            </p>
                        </div>
                        <div className="rounded-2xl border border-[#EA9A61]/25 bg-[#EA9A61]/[0.06] p-7">
                            <h3 className="mb-3 text-lg text-white" style={{ fontFamily: "Norwige, sans-serif" }}>
                                What they actually see
                            </h3>
                            <p className="text-[0.9375rem] leading-relaxed text-white/70">
                                A plain-text confirmation from a tool you set up once. A receipt with a
                                stretched logo. A thank-you page that says &ldquo;Success!&rdquo; and nothing
                                else. A review request three weeks late.
                            </p>
                        </div>
                    </div>

                    <p className="mt-12 max-w-2xl text-[1.05rem] leading-relaxed text-white/70">
                        Agencies do identity. Software does email. Almost nobody does both, so the seam
                        between them is where the money leaks. Not in the traffic.{" "}
                        <span className="text-white">
                            The automated email that goes out at 11pm should look like it came from the
                            same company as the website.
                        </span>{" "}
                        That only happens when the same people build both.
                    </p>
                </div>
            </section>

            {/* ── THE FULL VIEW: five moments ── */}
            <section className="relative px-6 py-24 md:px-12 md:py-32 lg:px-16">
                <div className="mx-auto max-w-6xl">
                    <p
                        className="mb-6 text-xs uppercase tracking-[0.3em]"
                        style={{ color: "rgba(255,244,227,0.3)", fontFamily: "Norwige, sans-serif" }}
                    >
                        The Full View
                    </p>
                    <h2
                        className="mb-5 max-w-3xl text-[clamp(1.9rem,4.4vw,3.4rem)] leading-[1.14] text-white"
                        style={{ fontFamily: "NorwigeHeroItalic, sans-serif" }}
                    >
                        Five moments, and the gaps between them
                    </h2>
                    <p className="mb-14 max-w-2xl text-[0.9375rem] leading-relaxed text-white/50">
                        Most shops see one slice. These are the five points where someone meets your
                        business, and every one of them either sounds like you or doesn&apos;t.
                    </p>

                    <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {MOMENTS.map((moment, i) => (
                            <li
                                key={moment.name}
                                className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition-colors hover:border-[#EA9A61]/30"
                            >
                                <span
                                    className="mb-4 block text-xs uppercase tracking-[0.24em] text-[#EA9A61]/70"
                                    style={{ fontFamily: "Norwige, sans-serif" }}
                                >
                                    {String(i + 1).padStart(2, "0")} · {moment.name}
                                </span>
                                <h3 className="mb-3 text-lg leading-snug text-white" style={{ fontFamily: "Norwige, sans-serif" }}>
                                    {moment.line}
                                </h3>
                                <p className="text-sm leading-relaxed text-white/55">{moment.detail}</p>
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

                </div>
            </section>

            {/* ── PRICING ── */}
            <BrandPricingTiers />

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
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
                        {GUIDES.map((guide) => (
                            <Link
                                key={guide.href}
                                href={guide.href}
                                className="group block rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-[#EA9A61]/40 hover:bg-white/[0.06] md:p-7"
                            >
                                <h3
                                    className="mb-2 text-lg text-white md:text-xl"
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
