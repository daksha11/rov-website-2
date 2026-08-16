import type { Metadata } from "next";
import Link from "next/link";
import { MusicNav } from "@/components/music/MusicNav";
import MusicFooter from "@/components/music/MusicFooter";
import { IntakeProvider } from "@/components/music/IntakeContext";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { FAQPageSchema } from "@/components/schema/FAQPageSchema";
import { HowToSchema } from "@/components/schema/HowToSchema";
import { chainStages, beforeYouBook, sessionPrep, toolkitFaqs } from "./rig";

// rovmusic.com/toolkit, served here via the host rewrite in middleware.ts.
//
// This is NOT a mirror of the CTRL A music toolkit. That page is a community
// grid of picks plus the history of recorded sound, and it stays self-canonical
// on rovstudios. This one is the commercial expert page: same studio, organised
// by signal chain, aimed at an artist deciding who to hand a record to.
const MUSIC_URL = "https://www.rovmusic.com";

const HEADING_FONT = "Norwige, sans-serif";
const BODY_FONT = "'Roboto', sans-serif";
const ACCENT = "#EA9A61";

export const metadata: Metadata = {
    title: { absolute: "The Mixing Chain We Run in Every Session | ROV Music Atlanta" },
    description:
        "The exact signal chain an Atlanta mixing studio runs on your vocal, stage by stage: capture, tuning, cleanup, dynamics, color, space, master, release. What we reach for and why.",
    alternates: { canonical: `${MUSIC_URL}/toolkit` },
    openGraph: {
        title: "The Mixing Chain We Run in Every Session | ROV Music Atlanta",
        description:
            "Capture to release, stage by stage. What an Atlanta mixing studio actually reaches for, and the trap at each step.",
        url: `${MUSIC_URL}/toolkit`,
        images: [
            {
                url: `${MUSIC_URL}/og/og-sound.webp`,
                width: 1200,
                height: 630,
                alt: "ROV Music mixing chain",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "The Mixing Chain We Run in Every Session | ROV Music Atlanta",
        description:
            "Capture to release, stage by stage. What an Atlanta mixing studio actually reaches for.",
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

export default function MusicToolkitPage() {
    return (
        <IntakeProvider>
            <BreadcrumbSchema
                baseUrl={MUSIC_URL}
                items={[
                    { name: "Home", url: "" },
                    { name: "The Chain", url: "/toolkit" },
                ]}
            />
            <FAQPageSchema faqs={toolkitFaqs} />
            <HowToSchema
                baseUrl={MUSIC_URL}
                url="/toolkit"
                name={sessionPrep.title}
                description="How to prepare stems and a session so an engineer can start mixing immediately."
                steps={sessionPrep.steps.map((s) => ({ name: s.title, text: s.body }))}
            />

            <main className="bg-black" style={{ minHeight: "100vh" }}>
                {/* Hero */}
                <section className="px-6 pt-28 pb-16 sm:pt-36">
                    <div className="mx-auto max-w-4xl">
                        <Label>Atlanta · Mixing &amp; Mastering</Label>
                        <h1
                            className="mt-5 text-white"
                            style={{
                                fontFamily: HEADING_FONT,
                                fontSize: "clamp(2.5rem, 6.5vw, 5rem)",
                                lineHeight: 1.05,
                            }}
                        >
                            The chain we run on your record.
                        </h1>
                        <p
                            className="mt-6 max-w-2xl text-lg leading-relaxed text-white/60"
                            style={{ fontFamily: BODY_FONT }}
                        >
                            Most studios will show you a gear list. A gear list tells you
                            nothing, because the order and the settings are the whole job.
                            This is the actual path a vocal takes through one of our
                            sessions, stage by stage, including the mistake we see most
                            often at each one.
                        </p>

                        <div
                            className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/40"
                            style={{ fontFamily: BODY_FONT }}
                        >
                            <span>
                                Written by{" "}
                                <span className="text-white/70">Ayush Basu</span>, founder
                                and audio engineer
                            </span>
                            <span className="text-white/20">·</span>
                            <span>
                                with <span className="text-white/70">Sam Suen</span>, artist
                                and engineer
                            </span>
                        </div>
                    </div>
                </section>

                {/* The chain */}
                <section className="px-6 pb-8">
                    <div className="mx-auto max-w-4xl">
                        {chainStages.map((stage) => (
                            <article
                                key={stage.step}
                                className="border-t border-white/10 py-12"
                            >
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-6">
                                    <span
                                        className="text-sm tabular-nums"
                                        style={{ fontFamily: BODY_FONT, color: ACCENT }}
                                    >
                                        {stage.step}
                                    </span>
                                    <div className="flex-1">
                                        <h2
                                            className="text-white"
                                            style={{
                                                fontFamily: HEADING_FONT,
                                                fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                                                lineHeight: 1.15,
                                            }}
                                        >
                                            {stage.title}
                                        </h2>
                                        <p
                                            className="mt-2 text-base italic"
                                            style={{ fontFamily: BODY_FONT, color: ACCENT }}
                                        >
                                            {stage.purpose}
                                        </p>

                                        <p
                                            className="mt-5 max-w-2xl text-base leading-relaxed text-white/65"
                                            style={{ fontFamily: BODY_FONT }}
                                        >
                                            {stage.body}
                                        </p>

                                        <ul className="mt-7 space-y-4">
                                            {stage.tools.map((tool) => (
                                                <li
                                                    key={tool.name}
                                                    className="border-l-2 pl-4"
                                                    style={{ borderColor: "rgba(234,154,97,0.35)" }}
                                                >
                                                    <p
                                                        className="text-sm text-white"
                                                        style={{ fontFamily: BODY_FONT }}
                                                    >
                                                        {tool.name}
                                                    </p>
                                                    <p
                                                        className="mt-1 max-w-xl text-sm leading-relaxed text-white/45"
                                                        style={{ fontFamily: BODY_FONT }}
                                                    >
                                                        {tool.note}
                                                    </p>
                                                </li>
                                            ))}
                                        </ul>

                                        <div
                                            className="mt-7 rounded-lg p-4"
                                            style={{ background: "rgba(166,77,43,0.12)" }}
                                        >
                                            <Label>The trap</Label>
                                            <p
                                                className="mt-2 max-w-xl text-sm leading-relaxed text-white/60"
                                                style={{ fontFamily: BODY_FONT }}
                                            >
                                                {stage.trap}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                {/* Before you book */}
                <section className="border-t border-white/10 px-6 py-20">
                    <div className="mx-auto max-w-4xl">
                        <Label>Before you book</Label>
                        <h2
                            className="mt-4 text-white"
                            style={{
                                fontFamily: HEADING_FONT,
                                fontSize: "clamp(2rem, 4.5vw, 3rem)",
                                lineHeight: 1.1,
                            }}
                        >
                            Four things we say in almost every first session.
                        </h2>

                        <div className="mt-12 grid gap-10 sm:grid-cols-2">
                            {beforeYouBook.map((item) => (
                                <div key={item.claim}>
                                    <p
                                        className="text-base text-white/35 line-through decoration-white/20"
                                        style={{ fontFamily: BODY_FONT }}
                                    >
                                        {item.claim}
                                    </p>
                                    <p
                                        className="mt-3 text-base leading-relaxed text-white/70"
                                        style={{ fontFamily: BODY_FONT }}
                                    >
                                        {item.truth}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Session prep */}
                <section className="border-t border-white/10 px-6 py-20">
                    <div className="mx-auto max-w-4xl">
                        <Label>Session prep</Label>
                        <h2
                            className="mt-4 text-white"
                            style={{
                                fontFamily: HEADING_FONT,
                                fontSize: "clamp(2rem, 4.5vw, 3rem)",
                                lineHeight: 1.1,
                            }}
                        >
                            {sessionPrep.title}
                        </h2>

                        <ol className="mt-12 space-y-8">
                            {sessionPrep.steps.map((step, i) => (
                                <li
                                    key={step.title}
                                    id={`step-${i + 1}`}
                                    className="flex gap-5"
                                >
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
                                            {step.title}
                                        </h3>
                                        <p
                                            className="mt-2 max-w-2xl text-base leading-relaxed text-white/60"
                                            style={{ fontFamily: BODY_FONT }}
                                        >
                                            {step.body}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>

                {/* FAQ. <details> keeps this a server component with no JS cost. */}
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
                            What artists ask us first.
                        </h2>

                        <div className="mt-10">
                            {toolkitFaqs.map((faq) => (
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
                            Send us the record.
                        </h2>
                        <p
                            className="mt-5 max-w-xl text-lg leading-relaxed text-white/60"
                            style={{ fontFamily: BODY_FONT }}
                        >
                            We will tell you honestly what it needs before you pay for
                            anything. If the answer is a re-record rather than a mix, that is
                            what we will say.
                        </p>

                        <div className="mt-9 flex flex-wrap gap-4">
                            <Link
                                href="/pricing"
                                className="rounded-full px-7 py-3 text-sm uppercase tracking-wide text-black transition-opacity hover:opacity-90"
                                style={{ fontFamily: BODY_FONT, background: ACCENT }}
                            >
                                See pricing
                            </Link>
                            <Link
                                href="/credits"
                                className="rounded-full border border-white/20 px-7 py-3 text-sm uppercase tracking-wide text-white/80 transition-colors hover:text-white"
                                style={{ fontFamily: BODY_FONT }}
                            >
                                Hear the records
                            </Link>
                            <Link
                                href="/atlanta-studios"
                                className="rounded-full border border-white/20 px-7 py-3 text-sm uppercase tracking-wide text-white/80 transition-colors hover:text-white"
                                style={{ fontFamily: BODY_FONT }}
                            >
                                Compare Atlanta studios
                            </Link>
                        </div>

                        <p
                            className="mt-14 max-w-xl text-sm leading-relaxed text-white/35"
                            style={{ fontFamily: BODY_FONT }}
                        >
                            Want the wider version, including the history of how recorded
                            sound got made and the picks our design and video teams run?
                            That lives in{" "}
                            <a
                                href="https://www.rovstudios.com/ctrla/toolkit/music"
                                className="underline decoration-white/25 underline-offset-4 hover:text-white/60"
                            >
                                the CTRL·A toolkit
                            </a>
                            , our open creative library.
                        </p>
                    </div>
                </section>
            </main>

            <MusicFooter />
            <MusicNav />
        </IntakeProvider>
    );
}
