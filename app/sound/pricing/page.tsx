import type { Metadata } from "next";
import { MusicNav } from "@/components/music/MusicNav";
import MusicFooter from "@/components/music/MusicFooter";
import { RoleProvider } from "@/components/music/RoleContext";
import PricingTable from "@/components/sound/PricingTable";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";

// The full rate card. On the music host this lives at rovmusic.com/pricing
// (see middleware.ts); /sound/pricing serves it everywhere else, so all SEO
// points at the music domain.
const MUSIC_URL = "https://www.rovmusic.com";
const PAGE_URL = `${MUSIC_URL}/pricing`;

export const metadata: Metadata = {
    title: { absolute: "Mixing, Recording & Artist Pricing | Range of View Music" },
    description:
        "Every rate on one page. Mix and master from $40 a song, Atlanta studio time from $50/hr with mixing included, cover art systems, and the $500 Foundation artist backend.",
    alternates: { canonical: PAGE_URL },
    openGraph: {
        title: "Pricing | Range of View Music",
        description:
            "Mix and master from $40 a song. Studio time from $50/hr, mix and master included. No quote required to see a number.",
        url: PAGE_URL,
        images: [{ url: `${MUSIC_URL}/og/og-sound.webp`, width: 1200, height: 630, alt: "Range of View Music pricing" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Pricing | Range of View Music",
        description: "Mix and master from $40 a song. Studio time from $50/hr, mix and master included.",
        images: [`${MUSIC_URL}/og/og-sound.webp`],
    },
};

export default function Page() {
    return (
        <RoleProvider>
            <BreadcrumbSchema baseUrl={MUSIC_URL} items={[
                { name: "Range of View Music", url: "" },
                { name: "Pricing", url: "/pricing" },
            ]} />
            <PricingTable />
            <MusicFooter />
            <MusicNav />
        </RoleProvider>
    );
}
