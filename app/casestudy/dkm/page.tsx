import type { Metadata } from "next";
import DkmContent from "./DkmContent";

export const metadata: Metadata = {
    title: "DKM Corp - Case Study",
    description:
        "How Range of View Studios built a global digital infrastructure for DKM Corp, a private growth partner spanning India, Australia, the US, and Dubai.",
    alternates: { canonical: "https://rovstudios.com/casestudy/dkm" },
    openGraph: {
        title: "DKM Corp Case Study | Range of View Studios",
        description: "Scaling global operations — 100% execution across four primary markets.",
        url: "https://rovstudios.com/casestudy/dkm",
        images: [{ url: "/casestudy/dubaiskyline.jpg", width: 1200, height: 630, alt: "DKM Corp case study by ROV Studios" }],
    },
};

export default function DkmCaseStudyPage() {
    return <DkmContent />;
}
