import type { Metadata } from "next";
import Link from "next/link";
import { MusicNav } from "@/components/music/MusicNav";
import MusicFooter from "@/components/music/MusicFooter";
import { IntakeProvider } from "@/components/music/IntakeContext";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { FAQPageSchema } from "@/components/schema/FAQPageSchema";
import {
    tiers,
    ourRates,
    chooseSteps,
    studiosFaqs,
    VERIFIED_ON,
} from "./studios-data";

// rovmusic.com/atlanta-studios — the comparison resource.
//
// This page deliberately sends some readers to competitors. That is the cost of
// ranking in a SERP made of listicles: the useful page wins, and the useful page
// is honest about which room is right for which job. See studios-data.ts for the
// accuracy rules, which are not optional; these are real businesses.
const MUSIC_URL = "https://www.rovmusic.com";

const HEADING_FONT = "Norwige, sans-serif";
const BODY_FONT = "'Roboto', sans-serif";
const ACCENT = "#EA9A61";

export const metadata: Metadata = {
    title: { absolute: "Atlanta Recording Studios Compared: What Each One Is Actually For" },
    description:
        "An honest guide to Atlanta recording studios by price and purpose. What each room is for, who it suits, and what a record really costs, from a studio that publishes its rates.",
    alternates: { canonical: `${MUSIC_URL}/atlanta-studios` },
    openGraph: {
        title: "Atlanta Recording Studios Compared: What Each One Is Actually For",
        description:
            "Which Atlanta studio suits which job, and what a record really costs. From a studio that publishes its rates.",
        url: `${MUSIC_URL}/atlanta-studios`,
        images: [{ url: `${MUSIC_URL}/og/og-sound.webp`, width: 1200, height: 630, alt: "Atlanta recording studios compared" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Atlanta Recording Studios Compared",
        description: "Which Atlanta studio suits which job, and what a record really costs.",
        images: [`${MUSIC_URL}/og/og-sound.webp`],
    },
};

function Label({ children }: { children: React.ReactNode }) {
    return (
        <span
            className="text-[11px] uppercase tracking-[0.2em] text-white/40"
            style={{ fontFamily: BODY_FONT }}
        >
            {children}
        </span>
    );
}

export default function AtlantaStudiosPage() {
    return (
        <IntakeProvider>
            <BreadcrumbSchema
                baseUrl={MUSIC_URL}
                items={[
                    { name: "Home", url: "" },
                    { name: "Atlanta Studios", url: "/atlanta-studios" },
                ]}
            />
            <FAQPageSchema faqs={studiosFaqs} />

            <main className="bg-black" style={{ minHeight: "100vh" }}>
                {/* Hero */}
                <section className="px-6 pt-28 pb-14 sm:pt-36">
                    <div className="mx-auto max-w-4xl">
                        <Label>Atlanta · Guide</Label>
                        <h1
                            className="mt-5 text-white"
                            style={{
                                fontFamily: HEADING_FONT,
                                fontSize: "clamp(2.4rem, 6vw, 4.5rem)",
                                lineHeight: 1.05,
                            }}
                        >
                            Nobody in Atlanta tells you what a record costs.
                        </h1>
                        <p
                            className="mt-6 max-w-2xl text-lg leading-relaxed text-white/60"
                            style={{ fontFamily: BODY_FONT }}
                        >
                            We checked every studio on this page in {VERIFIED_ON}. Not one of
                            them publishes a rate. That is normal in this industry and it is
                            not dishonest, but it makes planning a first record almost
                            impossible.
                        </p>
                        <p
                            className="mt-4 max-w-2xl text-lg leading-relaxed text-white/60"
                            style={{ fontFamily: BODY_FONT }}
                        >
                            So here is the honest map: which room is for which job, what we
                            could actually verify, and our own numbers in full. Some of these
                            studios are a better fit than we are, and we have said so.
                        </p>
                    </div>
                </section>

                {/* Tiers */}
                <section className="px-6 pb-8">
                    <div className="mx-auto max-w-4xl">
                        {tiers.map((tier) => (
                            <div key={tier.id} className="border-t border-white/10 py-12">
                                <h2
                                    className="text-white"
                                    style={{
                                        fontFamily: HEADING_FONT,
                                        fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                                        lineHeight: 1.15,
                                    }}
                                >
                                    {tier.title}
                                </h2>
                                <p
                                    className="mt-3 max-w-2xl text-base leading-relaxed text-white/50"
                                    style={{ fontFamily: BODY_FONT }}
                                >
                                    {tier.who}
                                </p>

                                <div className="mt-9 space-y-5">
                                    {tier.studios.map((studio) => (
                                        <div
                                            key={studio.name}
                                            className="rounded-xl border p-6"
                                            style={{
                                                borderColor: studio.isUs
                                                    ? "rgba(234,154,97,0.4)"
                                                    : "rgba(255,255,255,0.1)",
                                                background: studio.isUs
                                                    ? "rgba(234,154,97,0.06)"
                                                    : "transparent",
                                            }}
                                        >
                                            <div className="flex flex-wrap items-baseline justify-between gap-3">
                                                <h3
                                                    className="text-xl text-white"
                                                    style={{ fontFamily: HEADING_FONT }}
                                                >
                                                    {studio.name}
                                                </h3>
                                                {studio.isUs && (
                                                    <span
                                                        className="rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-black"
                                                        style={{ fontFamily: BODY_FONT, background: ACCENT }}
                                                    >
                                                        This is us
                                                    </span>
                                                )}
                                            </div>
                                            <p
                                                className="mt-1 text-sm text-white/40"
                                                style={{ fontFamily: BODY_FONT }}
                                            >
                                                {studio.location}
                                            </p>
                                            <p
                                                className="mt-4 text-base leading-relaxed"
                                                style={{ fontFamily: BODY_FONT, color: ACCENT }}
                                            >
                                                {studio.bestFor}
                                            </p>
                                            <p
                                                className="mt-3 text-base leading-relaxed text-white/60"
                                                style={{ fontFamily: BODY_FONT }}
                                            >
                                                {studio.detail}
                                            </p>
                                            {studio.trackRecord && (
                                                <p
                                                    className="mt-3 text-sm leading-relaxed text-white/45"
                                                    style={{ fontFamily: BODY_FONT }}
                                                >
                                                    {studio.trackRecord}
                                                </p>
                                            )}
                                            <div
                                                className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm"
                                                style={{ fontFamily: BODY_FONT }}
                                            >
                                                <span className="text-white/70">
                                                    Rates: <span className="text-white/45">{studio.rates}</span>
                                                </span>
                                                <a
                                                    href={studio.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="underline decoration-white/25 underline-offset-4 text-white/60 hover:text-white"
                                                >
                                                    Visit site →
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Our rates */}
                <section className="border-t border-white/10 px-6 py-20">
                    <div className="mx-auto max-w-4xl">
                        <Label>Published in full</Label>
                        <h2
                            className="mt-4 text-white"
                            style={{
                                fontFamily: HEADING_FONT,
                                fontSize: "clamp(2rem, 4.5vw, 3rem)",
                                lineHeight: 1.1,
                            }}
                        >
                            What we charge.
                        </h2>
                        <p
                            className="mt-4 max-w-2xl text-base leading-relaxed text-white/55"
                            style={{ fontFamily: BODY_FONT }}
                        >
                            Every recording rate includes mix and master. No upsells, no
                            hidden fees, no quote call required to find out the number.
                        </p>

                        <ul className="mt-10 divide-y divide-white/10">
                            {ourRates.map((rate) => (
                                <li
                                    key={rate.label}
                                    className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4"
                                    style={{ fontFamily: BODY_FONT }}
                                >
                                    <span className="text-white/80">{rate.label}</span>
                                    <span className="flex items-baseline gap-3">
                                        {rate.note && (
                                            <span className="text-sm text-white/35">{rate.note}</span>
                                        )}
                                        <span className="text-lg text-white">{rate.price}</span>
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <Link
                            href="/pricing"
                            className="mt-8 inline-block text-sm underline decoration-white/25 underline-offset-4 text-white/60 hover:text-white"
                            style={{ fontFamily: BODY_FONT }}
                        >
                            Full pricing, including artwork and video →
                        </Link>
                    </div>
                </section>

                {/* How to choose */}
                <section className="border-t border-white/10 px-6 py-20">
                    <div className="mx-auto max-w-4xl">
                        <Label>Before you book anywhere</Label>
                        <h2
                            className="mt-4 text-white"
                            style={{
                                fontFamily: HEADING_FONT,
                                fontSize: "clamp(2rem, 4.5vw, 3rem)",
                                lineHeight: 1.1,
                            }}
                        >
                            Five questions that decide where you should go.
                        </h2>

                        <ol className="mt-12 space-y-9">
                            {chooseSteps.map((step, i) => (
                                <li key={step.question} className="flex gap-5">
                                    <span
                                        className="pt-1 text-sm tabular-nums"
                                        style={{ fontFamily: BODY_FONT, color: ACCENT }}
                                    >
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                    <div>
                                        <h3
                                            className="text-lg text-white"
                                            style={{ fontFamily: HEADING_FONT }}
                                        >
                                            {step.question}
                                        </h3>
                                        <p
                                            className="mt-2 max-w-2xl text-base leading-relaxed text-white/60"
                                            style={{ fontFamily: BODY_FONT }}
                                        >
                                            {step.answer}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>

                {/* FAQ */}
                <section className="border-t border-white/10 px-6 py-20">
                    <div className="mx-auto max-w-4xl">
                        <Label>Questions</Label>
                        <h2
                            className="mt-4 text-white"
                            style={{
                                fontFamily: HEADING_FONT,
                                fontSize: "clamp(2rem, 4.5vw, 3rem)",
                                lineHeight: 1.1,
                            }}
                        >
                            What a record costs in Atlanta.
                        </h2>
                        <div className="mt-10">
                            {studiosFaqs.map((faq) => (
                                <details
                                    key={faq.question}
                                    className="group border-b border-white/10 py-5"
                                >
                                    <summary
                                        className="cursor-pointer list-none text-lg text-white marker:content-none"
                                        style={{ fontFamily: HEADING_FONT }}
                                    >
                                        {faq.question}
                                    </summary>
                                    <p
                                        className="mt-4 max-w-2xl text-base leading-relaxed text-white/60"
                                        style={{ fontFamily: BODY_FONT }}
                                    >
                                        {faq.answer}
                                    </p>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="border-t border-white/10 px-6 py-24">
                    <div className="mx-auto max-w-4xl">
                        <h2
                            className="text-white"
                            style={{
                                fontFamily: HEADING_FONT,
                                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                                lineHeight: 1.1,
                            }}
                        >
                            If the first-record tier is you.
                        </h2>
                        <p
                            className="mt-5 max-w-xl text-lg leading-relaxed text-white/60"
                            style={{ fontFamily: BODY_FONT }}
                        >
                            Send the song. We will tell you honestly what it needs, including
                            when the honest answer is a different studio on this page.
                        </p>
                        <div className="mt-9 flex flex-wrap gap-4">
                            <Link
                                href="/credits"
                                className="rounded-full px-7 py-3 text-sm uppercase tracking-wide text-black transition-opacity hover:opacity-90"
                                style={{ fontFamily: BODY_FONT, background: ACCENT }}
                            >
                                Hear our work
                            </Link>
                            <Link
                                href="/toolkit"
                                className="rounded-full border border-white/20 px-7 py-3 text-sm uppercase tracking-wide text-white/80 transition-colors hover:text-white"
                                style={{ fontFamily: BODY_FONT }}
                            >
                                How we mix
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <MusicFooter />
            <MusicNav />
        </IntakeProvider>
    );
}
