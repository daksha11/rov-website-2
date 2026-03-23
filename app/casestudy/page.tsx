import type { Metadata } from "next";
import CaseStudyContent from "./CaseStudyContent";

export const metadata: Metadata = {
    title: "Client Case Studies & Project Results",
    description:
        "Explore how Range of View Studios helps brands build powerful digital experiences. Real projects, real results.",
    alternates: { canonical: "https://rovstudios.com/casestudy" },
    openGraph: {
        title: "Client Case Studies & Project Results | Range of View Studios",
        description: "Real projects, real results. See how we help brands build powerful digital experiences.",
        url: "https://rovstudios.com/casestudy",
        images: [{ url: "/og/og-casestudy.jpg", width: 1200, height: 630, alt: "ROV Studios case studies" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Client Case Studies & Project Results | Range of View Studios",
        description: "Real projects, real results. See how we help brands build powerful digital experiences.",
        images: ["/og/og-casestudy.jpg"],
    },
};

export default function CaseStudySelectionPage() {
    return <CaseStudyContent />;
}
