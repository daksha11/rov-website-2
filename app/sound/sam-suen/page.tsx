import type { Metadata } from "next";
import { MusicNav } from "@/components/music/MusicNav";
import MusicFooter from "@/components/music/MusicFooter";
import { IntakeProvider } from "@/components/music/IntakeContext";
import SamSuenCaseStudy from "@/components/sound/SamSuenCaseStudy";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";

// In-house artist development case study. On the music host this lives at
// rovmusic.com/sam-suen (see middleware.ts); /sound/sam-suen serves it
// everywhere else, so all SEO points at the music domain.
const MUSIC_URL = "https://www.rovmusic.com";
const PAGE_URL = `${MUSIC_URL}/sam-suen`;

export const metadata: Metadata = {
    title: { absolute: "Sam Suen: In-House Artist Development | Range of View Music" },
    description:
        "How Range of View Music develops Sam Suen end to end: 20k+ new followers in one summer, 100k+ streams, a brand and website built in-house, and a DreamAsia Fest headline across two states.",
    alternates: { canonical: PAGE_URL },
    openGraph: {
        title: "Sam Suen: In-House Artist Development | Range of View Music",
        description:
            "20k+ followers gained, 100k+ streams, a festival headline. One artist, every lane, run by one team.",
        url: PAGE_URL,
        images: [{ url: `${MUSIC_URL}/ctrla/VOL1/dreamasiacover.webp`, width: 1200, height: 630, alt: "Sam Suen headlining DreamAsia Fest" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Sam Suen: In-House Artist Development | Range of View Music",
        description:
            "20k+ followers gained, 100k+ streams, a festival headline. One artist, every lane, run by one team.",
        images: [`${MUSIC_URL}/ctrla/VOL1/dreamasiacover.webp`],
    },
};

export default function Page() {
    return (
        <IntakeProvider>
            <BreadcrumbSchema baseUrl={MUSIC_URL} items={[
                { name: "Range of View Music", url: "" },
                { name: "Sam Suen", url: "/sam-suen" },
            ]} />
            <SamSuenCaseStudy />
            <MusicFooter />
            <MusicNav />
        </IntakeProvider>
    );
}
