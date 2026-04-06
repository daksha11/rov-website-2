import type { Metadata } from "next";
import DkmContent from "./DkmContent";
import { CreativeWorkSchema } from "@/components/CreativeWorkSchema";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
    title: "DKM Corp - Case Study",
    description:
        "How Range of View Studios built a global digital infrastructure for DKM Corp, a private growth partner spanning India, Australia, the US, and Dubai.",
    alternates: { canonical: "https://www.rovstudios.com/casestudy/dkm" },
    openGraph: {
        title: "DKM Corp Case Study | Range of View Studios",
        description: "Scaling global operations — 100% execution across four primary markets.",
        url: "https://www.rovstudios.com/casestudy/dkm",
        images: [{ url: "/og/og-dkm.webp", width: 1200, height: 630, alt: "DKM Corp case study by ROV Studios" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "DKM Corp Case Study | Range of View Studios",
        description: "Scaling global operations — 100% execution across four primary markets.",
        images: ["/og/og-dkm.webp"],
    },
};

export default function DkmCaseStudyPage() {
    return (
        <>
            <CreativeWorkSchema
                name="DKM Corp Global Digital Infrastructure"
                description="Global digital infrastructure built for DKM Corp, a private growth partner spanning India, Australia, the US, and Dubai. 100% execution across four primary markets."
                dateCreated="2025-02-01"
                url="/casestudy/dkm"
                image="/og/og-dkm.webp"
                aboutName="DKM Corp"
            />
            <BreadcrumbSchema items={[
                { name: "Home", url: "" },
                { name: "Case Studies", url: "/casestudy" },
                { name: "DKM Corp", url: "/casestudy/dkm" },
            ]} />
            <DkmContent />
        </>
    );
}
