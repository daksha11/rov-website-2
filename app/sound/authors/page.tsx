import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MusicMenu } from "@/components/music/MusicMenu";
import MusicFooter from "@/components/music/MusicFooter";
import { IntakeProvider } from "@/components/music/IntakeContext";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";

// rovmusic.com/authors — the people behind the writing.
//
// Google and answer engines weigh who wrote something and whether that person
// is a real, verifiable practitioner. Person schema with sameAs links to a
// working artist profile is the strongest version of that signal available in
// music, and it is the fallback target for BlogPostHeader on the music host.
const MUSIC_URL = "https://www.rovmusic.com";

const HEADING_FONT = "Norwige, sans-serif";
const BODY_FONT = "'Roboto', sans-serif";
const ACCENT = "#EA9A61";

export const metadata: Metadata = {
    title: { absolute: "Who Writes This | ROV Music Atlanta" },
    description:
        "The engineers behind Range of View Music in Atlanta. Who mixes your record, who writes these guides, and what they have actually released.",
    alternates: { canonical: `${MUSIC_URL}/authors` },
    openGraph: {
        title: "Who Writes This | ROV Music Atlanta",
        description: "The engineers behind Range of View Music in Atlanta.",
        url: `${MUSIC_URL}/authors`,
        images: [{ url: `${MUSIC_URL}/og/og-sound.webp`, width: 1200, height: 630, alt: "ROV Music engineers" }],
    },
};

interface Author {
    id: string;
    name: string;
    role: string;
    avatar: string;
    bio: string[];
    /** Verifiable profiles only. These become schema sameAs. */
    sameAs: { label: string; url: string }[];
    writesAbout: string;
}

const authors: Author[] = [
    {
        id: "ayush-basu",
        name: "Ayush Basu",
        role: "Founder & audio engineer",
        avatar: "/teammembers/basutm2.webp",
        bio: [
            "Runs Range of View, the studio behind both the music work and the brand, web, and video side. Mixes and masters out of Atlanta, and built the pricing model this studio publishes openly because he got tired of watching first-time artists guess at a budget.",
            "Reaches for stock plugins before third-party ones, and will tell you a record needs re-recording rather than sell you a mix that cannot fix it.",
        ],
        sameAs: [
            { label: "Range of View Studios", url: "https://www.rovstudios.com/about" },
            { label: "Instagram", url: "https://www.instagram.com/rangeofviewstudios/" },
        ],
        writesAbout: "Pricing, the Atlanta scene, and how the business of a first record actually works",
    },
    {
        id: "sam-suen",
        name: "Sam Suen",
        role: "Artist & engineer",
        avatar: "/teammembers/samsuentm.webp",
        bio: [
            "In-house artist at Range of View and a working engineer. His catalogue is the proof case for the full-service claim: the same team handles his records, his brand, his site, his socials, and his shows.",
            "Has played Believe Music Hall, District Atlanta, and Rendezvous, and writes here about the craft side, what actually happens to a vocal between the take and the release.",
        ],
        sameAs: [
            { label: "Spotify", url: "https://open.spotify.com/artist/0xXkuHzIgsvT7a00POWMIK" },
            { label: "Apple Music", url: "https://music.apple.com/us/artist/sam-suen/1561994926" },
            { label: "Case study", url: `${MUSIC_URL}/sam-suen` },
        ],
        writesAbout: "Mixing, mastering, gear, and the artist side of getting a record finished",
    },
];

function personSchema() {
    return {
        "@context": "https://schema.org",
        "@graph": authors.map((a) => ({
            "@type": "Person",
            "@id": `${MUSIC_URL}/authors#${a.id}`,
            name: a.name,
            jobTitle: a.role,
            url: `${MUSIC_URL}/authors#${a.id}`,
            image: `${MUSIC_URL}${a.avatar}`,
            description: a.bio[0],
            sameAs: a.sameAs.map((s) => s.url),
            worksFor: {
                "@type": "Organization",
                name: "Range of View Music",
                url: MUSIC_URL,
            },
        })),
    };
}

export default function AuthorsPage() {
    return (
        <IntakeProvider>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema()) }}
            />
            <BreadcrumbSchema
                baseUrl={MUSIC_URL}
                items={[
                    { name: "Home", url: "" },
                    { name: "Authors", url: "/authors" },
                ]}
            />

            <main className="bg-black" style={{ minHeight: "100vh" }}>
                <section className="px-6 pt-28 pb-14 sm:pt-36">
                    <div className="mx-auto max-w-4xl">
                        <span className="text-[11px] uppercase tracking-[0.2em] text-white/40" style={{ fontFamily: BODY_FONT }}>
                            Atlanta · The people
                        </span>
                        <h1
                            className="mt-5 text-white"
                            style={{ fontFamily: HEADING_FONT, fontSize: "clamp(2.5rem, 6.5vw, 5rem)", lineHeight: 1.05 }}
                        >
                            Who actually writes this.
                        </h1>
                        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/60" style={{ fontFamily: BODY_FONT }}>
                            Two people, both of whom mix records for a living. Everything on
                            this site is written by one of them, and you can go check the
                            work rather than take our word for it.
                        </p>
                    </div>
                </section>

                <section className="px-6 pb-8">
                    <div className="mx-auto max-w-4xl">
                        {authors.map((a) => (
                            <article key={a.id} id={a.id} className="border-t border-white/10 py-12 scroll-mt-24">
                                <div className="flex flex-col gap-7 sm:flex-row sm:gap-9">
                                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full sm:h-32 sm:w-32">
                                        <Image src={a.avatar} alt={a.name} fill sizes="128px" style={{ objectFit: "cover" }} />
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-white" style={{ fontFamily: HEADING_FONT, fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", lineHeight: 1.15 }}>
                                            {a.name}
                                        </h2>
                                        <p className="mt-1 text-base" style={{ fontFamily: BODY_FONT, color: ACCENT }}>
                                            {a.role}
                                        </p>

                                        {a.bio.map((para) => (
                                            <p key={para.slice(0, 32)} className="mt-4 max-w-2xl text-base leading-relaxed text-white/65" style={{ fontFamily: BODY_FONT }}>
                                                {para}
                                            </p>
                                        ))}

                                        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/40" style={{ fontFamily: BODY_FONT }}>
                                            Writes about: {a.writesAbout}
                                        </p>

                                        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm" style={{ fontFamily: BODY_FONT }}>
                                            {a.sameAs.map((s) => (
                                                <a
                                                    key={s.url}
                                                    href={s.url}
                                                    target={s.url.startsWith(MUSIC_URL) ? undefined : "_blank"}
                                                    rel="noopener noreferrer"
                                                    style={{ color: ACCENT }}
                                                >
                                                    {s.label} →
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="border-t border-white/10 px-6 py-24">
                    <div className="mx-auto max-w-4xl">
                        <h2 className="text-white" style={{ fontFamily: HEADING_FONT, fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.1 }}>
                            Read the work.
                        </h2>
                        <div className="mt-9 flex flex-wrap gap-4">
                            <Link
                                href="/blog"
                                className="rounded-full px-7 py-3 text-sm uppercase tracking-wide text-black transition-opacity hover:opacity-90"
                                style={{ fontFamily: BODY_FONT, background: ACCENT }}
                            >
                                The journal
                            </Link>
                            <Link
                                href="/credits"
                                className="rounded-full border border-white/20 px-7 py-3 text-sm uppercase tracking-wide text-white/80 transition-colors hover:text-white"
                                style={{ fontFamily: BODY_FONT }}
                            >
                                Credits
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
