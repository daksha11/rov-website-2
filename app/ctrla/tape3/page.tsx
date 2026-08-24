import type { Metadata } from "next";
import Tape3Content from "./Tape3Content";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
    title: "The ROV Tape 3 - Creative Brief",
    description:
        "The ROV Tape 3: A curated multi-artist tape blending Afrobeats, RnB, soul, and Atlanta energy. Coming soon from Range of View Studios.",
    alternates: { canonical: "https://www.rovstudios.com/ctrla/tape3" },
    openGraph: {
        title: "The ROV Tape 3 | Range of View Studios",
        description: "A curated multi-artist tape. Afrobeats, RnB, soul, Atlanta energy, and a thread of British influence.",
        url: "https://www.rovstudios.com/ctrla/tape3",
        images: [{ url: "/og/og-home.webp", width: 1200, height: 630, alt: "ROV Tape 3" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "The ROV Tape 3 | Range of View Studios",
        description: "A curated multi-artist tape. Afrobeats, RnB, soul, Atlanta energy, and a thread of British influence.",
        images: ["/og/og-home.webp"],
    },
};

export default function Tape3Page() {
    return (
        <>
            <Tape3Content />
            <Footer />
        </>
    );
}
