import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MusicMenu } from "@/components/music/MusicMenu";
import MusicFooter from "@/components/music/MusicFooter";
import { IntakeProvider } from "@/components/music/IntakeContext";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { credits, artistProfiles, stages } from "./credits-data";

// rovmusic.com/credits — the proof layer.
//
// Every track links to a live Spotify release, and each one is emitted as a
// MusicRecording with ROV as a contributor. That turns a list into an entity
// graph: edges from this studio to artists and recordings search engines
// already recognise, which is the signal a freelancer page cannot fake.
const MUSIC_URL = "https://www.rovmusic.com";

const HEADING_FONT = "Norwige, sans-serif";
const BODY_FONT = "'Roboto', sans-serif";
const ACCENT = "#EA9A61";

export const metadata: Metadata = {
    title: { absolute: "Credits & Discography | ROV Music Atlanta" },
    description:
        "Records mixed and mastered at Range of View Music in Atlanta. Every credit named, every release linked, nothing anonymous.",
    alternates: { canonical: `${MUSIC_URL}/credits` },
    openGraph: {
        title: "Credits & Discography | ROV Music Atlanta",
        description:
            "Records mixed and mastered at Range of View Music in Atlanta. Every credit named, every release linked.",
        url: `${MUSIC_URL}/credits`,
        images: [{ url: `${MUSIC_URL}/og/og-sound.webp`, width: 1200, height: 630, alt: "ROV Music credits" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Credits & Discography | ROV Music Atlanta",
        description: "Records mixed and mastered at Range of View Music in Atlanta.",
        images: [`${MUSIC_URL}/og/og-sound.webp`],
    },
};

// One Person node, referenced from every recording, so the graph resolves to a
// single producer entity rather than six unconnected strings.
const PRODUCER = {
    "@type": "Person",
    "@id": `${MUSIC_URL}/authors#ayush-basu`,
    name: "Ayush Basu",
    url: `${MUSIC_URL}/authors#ayush-basu`,
} as const;

function creditsSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Range of View Music credits and discography",
        itemListElement: credits.map((credit, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
                "@type": "MusicRecording",
                name: credit.title,
                url: credit.spotifyUrl,
                sameAs: credit.spotifyUrl,
                byArtist: { "@type": "MusicGroup", name: credit.artist },
                // Production and writing are separate schema roles from being the
                // studio that handled the file. Naming the person as producer and
                // composer is a far stronger entity claim than a contributor org,
                // and it ties every release back to the author page.
                producer: PRODUCER,
                recordingOf: {
                    "@type": "MusicComposition",
                    name: credit.title,
                    composer: PRODUCER,
                    lyricist: PRODUCER,
                },
                contributor: {
                    "@type": "Organization",
                    name: "Range of View Music",
                    url: MUSIC_URL,
                },
            },
        })),
    };
}

export default function CreditsPage() {
    return (
        <IntakeProvider>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(creditsSchema()) }}
            />
            <BreadcrumbSchema
                baseUrl={MUSIC_URL}
                items={[
                    { name: "Home", url: "" },
                    { name: "Credits", url: "/credits" },
                ]}
            />

            <main className="bg-black" style={{ minHeight: "100vh" }}>
                <section className="px-6 pt-28 pb-14 sm:pt-36">
                    <div className="mx-auto max-w-5xl">
                        <span
                            className="text-[11px] uppercase tracking-[0.2em] text-white/40"
                            style={{ fontFamily: BODY_FONT }}
                        >
                            Atlanta · Discography
                        </span>
                        <h1
                            className="mt-5 text-white"
                            style={{
                                fontFamily: HEADING_FONT,
                                fontSize: "clamp(2.5rem, 6.5vw, 5rem)",
                                lineHeight: 1.05,
                            }}
                        >
                            Records, not adjectives.
                        </h1>
                        <p
                            className="mt-6 max-w-2xl text-lg leading-relaxed text-white/60"
                            style={{ fontFamily: BODY_FONT }}
                        >
                            Produced, written, and composed here before any of it was
                            mixed. Every credit named, every release linked, so you can go
                            listen instead of taking our word for it. If a studio will not
                            tell you whose records they worked on, that is worth noticing.
                        </p>
                    </div>
                </section>

                {/* The catalogue */}
                <section className="px-6 pb-16">
                    <div className="mx-auto max-w-5xl">
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {credits.map((credit) => (
                                <a
                                    key={credit.spotifyUrl}
                                    href={credit.spotifyUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group block rounded-xl border border-white/10 p-4 transition-colors hover:border-white/25"
                                >
                                    <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                                        <Image
                                            src={credit.cover}
                                            alt={`${credit.title} by ${credit.artist}`}
                                            fill
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            style={{ objectFit: "cover" }}
                                        />
                                    </div>
                                    <h2
                                        className="mt-4 text-lg text-white"
                                        style={{ fontFamily: HEADING_FONT }}
                                    >
                                        {credit.title}
                                    </h2>
                                    <p
                                        className="mt-1 text-sm text-white/60"
                                        style={{ fontFamily: BODY_FONT }}
                                    >
                                        {credit.artist}
                                    </p>
                                    <p
                                        className="mt-3 text-xs uppercase tracking-[0.14em]"
                                        style={{ fontFamily: BODY_FONT, color: ACCENT }}
                                    >
                                        {credit.role}
                                    </p>
                                    <span
                                        className="mt-4 inline-block text-xs text-white/35 group-hover:text-white/60"
                                        style={{ fontFamily: BODY_FONT }}
                                    >
                                        Listen on Spotify →
                                    </span>
                                </a>
                            ))}
                        </div>

                        <p
                            className="mt-8 text-sm text-white/35"
                            style={{ fontFamily: BODY_FONT }}
                        >
                            Hear the before and after on{" "}
                            <Link href="/" className="underline decoration-white/25 underline-offset-4 hover:text-white/60">
                                the home page player
                            </Link>
                            .
                        </p>
                    </div>
                </section>

                {/* Artists we develop */}
                <section className="border-t border-white/10 px-6 py-20">
                    <div className="mx-auto max-w-5xl">
                        <span
                            className="text-[11px] uppercase tracking-[0.2em] text-white/40"
                            style={{ fontFamily: BODY_FONT }}
                        >
                            In house
                        </span>
                        <h2
                            className="mt-4 text-white"
                            style={{
                                fontFamily: HEADING_FONT,
                                fontSize: "clamp(2rem, 4.5vw, 3rem)",
                                lineHeight: 1.1,
                            }}
                        >
                            We develop our own artists.
                        </h2>
                        <p
                            className="mt-5 max-w-2xl text-base leading-relaxed text-white/60"
                            style={{ fontFamily: BODY_FONT }}
                        >
                            Most studios point at a wall of client logos. We would rather
                            show you a catalogue we are responsible for end to end, because
                            it is the only honest way to prove the full-service claim.
                        </p>

                        <div className="mt-10 space-y-8">
                            {artistProfiles.map((artist) => (
                                <div key={artist.name}>
                                    <h3
                                        className="text-2xl text-white"
                                        style={{ fontFamily: HEADING_FONT }}
                                    >
                                        {artist.name}
                                    </h3>
                                    <p
                                        className="mt-2 max-w-2xl text-base leading-relaxed text-white/60"
                                        style={{ fontFamily: BODY_FONT }}
                                    >
                                        {artist.line}
                                    </p>
                                    <div
                                        className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm"
                                        style={{ fontFamily: BODY_FONT }}
                                    >
                                        {artist.spotify && (
                                            <a href={artist.spotify} target="_blank" rel="noopener noreferrer" style={{ color: ACCENT }}>
                                                Spotify →
                                            </a>
                                        )}
                                        {artist.apple && (
                                            <a href={artist.apple} target="_blank" rel="noopener noreferrer" style={{ color: ACCENT }}>
                                                Apple Music →
                                            </a>
                                        )}
                                        <Link href="/sam-suen" className="text-white/50 hover:text-white/80">
                                            Read the full case study →
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Stages */}
                <section className="border-t border-white/10 px-6 py-20">
                    <div className="mx-auto max-w-5xl">
                        <span
                            className="text-[11px] uppercase tracking-[0.2em] text-white/40"
                            style={{ fontFamily: BODY_FONT }}
                        >
                            Stages
                        </span>
                        <h2
                            className="mt-4 text-white"
                            style={{
                                fontFamily: HEADING_FONT,
                                fontSize: "clamp(2rem, 4.5vw, 3rem)",
                                lineHeight: 1.1,
                            }}
                        >
                            Where the work has played.
                        </h2>
                        <ul className="mt-10 divide-y divide-white/10">
                            {stages.map((stage) => (
                                <li
                                    key={`${stage.year}-${stage.name}`}
                                    className="flex flex-wrap items-baseline gap-x-5 gap-y-1 py-4"
                                    style={{ fontFamily: BODY_FONT }}
                                >
                                    <span className="text-sm tabular-nums" style={{ color: ACCENT }}>
                                        {stage.year}
                                    </span>
                                    <span className="text-white">{stage.name}</span>
                                    <span className="text-sm text-white/40">{stage.venue}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* CTA */}
                <section className="border-t border-white/10 px-6 py-24">
                    <div className="mx-auto max-w-5xl">
                        <h2
                            className="text-white"
                            style={{
                                fontFamily: HEADING_FONT,
                                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                                lineHeight: 1.1,
                            }}
                        >
                            Add yours to it.
                        </h2>
                        <p
                            className="mt-5 max-w-xl text-lg leading-relaxed text-white/60"
                            style={{ fontFamily: BODY_FONT }}
                        >
                            First mix and master is $50. If the record needs something other
                            than a mix, we will tell you that instead of selling you one.
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
            <MusicMenu />
        </IntakeProvider>
    );
}
