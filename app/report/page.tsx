import type { Metadata } from "next";
import Link from "next/link";
import { NavigationDock } from "@/components/sections/NavDoc";
import Footer from "@/components/sections/Footer";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { FAQPageSchema } from "@/components/schema/FAQPageSchema";
import VisibilityReportForm from "@/components/report/VisibilityReportForm";

const URL = "https://www.rovstudios.com/report";

export const metadata: Metadata = {
    title: "Free Visibility Report for Atlanta Businesses",
    description:
        "Paste your website and we'll send you a free visibility report: whether you show up in local search, what AI assistants say when someone asks for a business like yours, and what to fix first.",
    alternates: { canonical: URL },
    openGraph: {
        title: "Free Visibility Report | Range of View Studios",
        description:
            "Find out what Google and AI assistants actually say about your business, and what it costs you.",
        url: URL,
        images: [{ url: "/og/og-web.webp", width: 1200, height: 630, alt: "ROV Studios visibility report" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Free Visibility Report | Range of View Studios",
        description: "What Google and AI assistants say about your business, and what to fix first.",
        images: ["/og/og-web.webp"],
    },
};

const FAQS = [
    {
        question: "What's actually in the report?",
        answer:
            "Three things. Whether you show up in local search for what you sell, what AI assistants name when someone asks for a business like yours, and whether your own site answers the questions people ask before they buy. Each gap comes with what it costs you and what we'd fix first, in order, cheapest first.",
    },
    {
        question: "Is it really free, and what's the catch?",
        answer:
            "It's free and there's no obligation. The honest catch is that we build these because they start good conversations: if you decide the gaps are worth paying someone to fix, we'd like it to be us. Plenty of people take the report and fix things themselves, which is a fine outcome.",
    },
    {
        question: "How long does it take?",
        answer:
            "Within three business days. The instant read you see on this page takes seconds, but the real report is assembled by a person, because the parts that matter (what AI says about you, whether you're in the local pack) cannot be checked by a script alone.",
    },
    {
        question: "Do you do this for businesses outside Atlanta?",
        answer:
            "Yes, though Atlanta is where we're strongest, because local visibility depends on knowing the area, the competitors, and the guides that get cited. If you're outside metro Atlanta the report is still accurate, we'll just have less local context to add.",
    },
    {
        question: "What if my site is brand new or I don't have one?",
        answer:
            "Send us whatever you have, even just a Google Business Profile or an Instagram. If there's no website at all, the report becomes a shorter conversation about what to build first, which is often more useful than an audit of something that doesn't exist yet.",
    },
];

export default function ReportPage() {
    return (
        <>
            <BreadcrumbSchema items={[
                { name: "Home", url: "" },
                { name: "Free Visibility Report", url: "/report" },
            ]} />
            <FAQPageSchema faqs={FAQS} />

            <main className="min-h-screen bg-black text-white relative overflow-x-hidden">
                <section className="relative px-6 pb-20 pt-32 md:px-12 md:pb-28 md:pt-40 lg:px-16">
                    {/* CSS-only ember splashes, consistent with the service pages. */}
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0"
                        style={{
                            background: `
                                radial-gradient(ellipse 1000px 800px at 25% 15%, rgba(234,154,97,0.22) 0%, transparent 55%),
                                radial-gradient(ellipse 900px 800px at 80% 45%, rgba(177,105,55,0.18) 0%, transparent 55%)
                            `,
                        }}
                    />

                    <div className="relative z-10 mx-auto max-w-3xl">
                        <span
                            className="mb-8 inline-flex items-center gap-2 rounded-full px-5 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em]"
                            style={{
                                background: "rgba(126,42,12,0.20)",
                                border: "1px solid rgba(202,53,0,0.30)",
                                color: "#E8914A",
                            }}
                        >
                            <span aria-hidden="true">✦</span>
                            Free · No obligation
                        </span>

                        <h1
                            className="text-[clamp(2.3rem,5.5vw,4rem)] font-extrabold leading-[1.08] tracking-[-0.01em] text-white"
                            style={{ fontFamily: "TestSohne-Extrafett, Norwige, sans-serif" }}
                        >
                            Find out what Google and AI
                            <span
                                className="mt-2 block font-normal"
                                style={{
                                    fontFamily: "NorwigeHeroItalic, sans-serif",
                                    background: "linear-gradient(90deg, #FF8904 0%, #F54900 100%)",
                                    backgroundClip: "text",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                }}
                            >
                                actually say about you
                            </span>
                        </h1>

                        <p className="mt-7 max-w-xl text-[1.05rem] leading-relaxed text-white/65">
                            We audited nine businesses on the Atlanta Beltline. Not one of them said anything on
                            its own website about being on the Beltline, while 2.5 million people a year walked
                            past. Most businesses have a gap like that. It is just rarely the one they expect.
                        </p>

                        <div className="mt-11">
                            <VisibilityReportForm />
                        </div>

                        {/* ── What you get ── */}
                        <div className="mt-20">
                            <p
                                className="mb-6 text-xs uppercase tracking-[0.3em]"
                                style={{ color: "rgba(255,244,227,0.3)", fontFamily: "Norwige, sans-serif" }}
                            >
                                What we check
                            </p>
                            <div className="grid gap-4 md:grid-cols-3">
                                {[
                                    {
                                        title: "Search",
                                        body: "Whether you appear when someone searches for what you sell nearby, and where your profile and reviews are letting you down.",
                                    },
                                    {
                                        title: "AI answers",
                                        body: "What ChatGPT, Perplexity, and Google's AI name when asked to recommend a business like yours. Usually not you, and we'll show you why.",
                                    },
                                    {
                                        title: "Your own content",
                                        body: "Whether your site answers the questions people ask before buying, and whether it claims the things about you that are worth claiming.",
                                    },
                                ].map((c) => (
                                    <div
                                        key={c.title}
                                        className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
                                    >
                                        <h2
                                            className="mb-3 text-lg text-white"
                                            style={{ fontFamily: "Norwige, sans-serif" }}
                                        >
                                            {c.title}
                                        </h2>
                                        <p className="text-sm leading-relaxed text-white/55">{c.body}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── Proof ── */}
                        <div className="mt-16 rounded-2xl border border-white/10 bg-white/[0.03] p-7 md:p-8">
                            <p className="text-[0.9375rem] leading-relaxed text-white/65">
                                Want to see the kind of thing we find before you hand over an email? Read{" "}
                                <Link
                                    href="/blog/beltline-atlanta-visibility-audit"
                                    className="text-[#EA9A61] underline decoration-[#EA9A61]/40 underline-offset-2 hover:decoration-[#EA9A61]"
                                >
                                    the nine-business Beltline audit
                                </Link>
                                , which is the same process run on real Atlanta businesses, or{" "}
                                <Link
                                    href="/web/why-isnt-my-business-showing-up-on-google"
                                    className="text-[#EA9A61] underline decoration-[#EA9A61]/40 underline-offset-2 hover:decoration-[#EA9A61]"
                                >
                                    the six reasons businesses stay invisible on Google
                                </Link>
                                .
                            </p>
                        </div>

                        {/* ── FAQ ── */}
                        <div className="mt-20">
                            <p
                                className="mb-8 text-xs uppercase tracking-[0.3em]"
                                style={{ color: "rgba(255,244,227,0.3)", fontFamily: "Norwige, sans-serif" }}
                            >
                                Questions
                            </p>
                            <dl className="space-y-7">
                                {FAQS.map((f) => (
                                    <div key={f.question}>
                                        <dt
                                            className="mb-2 text-lg text-white"
                                            style={{ fontFamily: "Norwige, sans-serif" }}
                                        >
                                            {f.question}
                                        </dt>
                                        <dd className="text-[0.9375rem] leading-relaxed text-white/55">
                                            {f.answer}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </div>
                </section>

                <NavigationDock />
                <Footer />
            </main>
        </>
    );
}
