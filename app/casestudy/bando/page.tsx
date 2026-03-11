import type { Metadata } from "next";
import BandoContent from "./BandoContent";

export const metadata: Metadata = {
    title: "The Bando - Case Study",
    description:
        "How Range of View Studios transformed The Bando's digital presence — a Black history museum and fried chicken restaurant in Atlanta. Bounce rate cut by 60%.",
    alternates: { canonical: "https://rovstudios.com/casestudy/bando" },
    openGraph: {
        title: "The Bando Case Study | Range of View Studios",
        description: "Bold, unapologetically Atlanta — we cut bounce rate by 60% with a culturally-driven redesign.",
        url: "https://rovstudios.com/casestudy/bando",
        images: [{ url: "/casestudy/Evertriedcrack.jpeg", width: 1200, height: 630, alt: "The Bando website redesign by ROV Studios" }],
    },
};

export default function BandoCaseStudyPage() {
    return <BandoContent />;
}
