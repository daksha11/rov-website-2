import type { Metadata } from "next";
import BandoContent from "./BandoContent";
import { CreativeWorkSchema } from "@/components/CreativeWorkSchema";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
    title: "The Bando - Case Study",
    description:
        "How Range of View Studios transformed The Bando's digital presence, a Black history museum and fried chicken restaurant in Atlanta. Bounce rate cut by 60%.",
    alternates: { canonical: "https://www.rovstudios.com/casestudy/bando" },
    openGraph: {
        title: "The Bando Case Study | Range of View Studios",
        description: "Bold, unapologetically Atlanta. We cut bounce rate by 60% with a culturally-driven redesign.",
        url: "https://www.rovstudios.com/casestudy/bando",
        images: [{ url: "/og/og-bando.webp", width: 1200, height: 630, alt: "The Bando website redesign by ROV Studios" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "The Bando Case Study | Range of View Studios",
        description: "Bold, unapologetically Atlanta. We cut bounce rate by 60% with a culturally-driven redesign.",
        images: ["/og/og-bando.webp"],
    },
};

export default function BandoCaseStudyPage() {
    return (
        <>
            <CreativeWorkSchema
                name="The Bando Website Redesign"
                description="Website redesign for The Bando, a Black history museum and fried chicken restaurant in Atlanta. Achieved 60% bounce rate reduction."
                dateCreated="2025-01-01"
                url="/casestudy/bando"
                image="/og/og-bando.webp"
                aboutName="The Bando"
            />
            <BreadcrumbSchema items={[
                { name: "Home", url: "" },
                { name: "Case Studies", url: "/casestudy" },
                { name: "The Bando", url: "/casestudy/bando" },
            ]} />
            <BandoContent />
        </>
    );
}
