import type { Metadata } from "next";
import BrandContent from "./BrandContent";
import { ServiceSchema } from "@/components/schema/ServiceSchema";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { FAQPageSchema } from "@/components/schema/FAQPageSchema";
import { HowToSchema } from "@/components/schema/HowToSchema";
import { brandFaqItems } from "@/data/faq";

const URL = "https://www.rovstudios.com/brand";

export const metadata: Metadata = {
    title: "Brand Identity & Customer Experience Design in Atlanta",
    description:
        "Most businesses buy a logo, then send confirmation emails that look like a 2009 receipt. Range of View Studios builds brand identity and the customer touchpoints it has to survive on, from the website to the thank-you page.",
    alternates: { canonical: URL },
    openGraph: {
        title: "Brand Identity & Customer Experience Design | Range of View Studios",
        description:
            "Your brand stops at the logo. Your customers don't. Identity plus the emails, receipts, and thank-you pages it has to live on.",
        url: URL,
        images: [{ url: "/og/og-web.webp", width: 1200, height: 630, alt: "ROV Studios brand identity and experience design" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Brand Identity & Customer Experience Design | Range of View Studios",
        description: "Your brand stops at the logo. Your customers don't.",
        images: ["/og/og-web.webp"],
    },
};

export default function BrandPage() {
    return (
        <>
            <ServiceSchema
                name="Brand Identity & Customer Experience Design"
                description="Brand identity, design systems, and the customer-facing touchpoints they have to survive on: website, email sequences, receipts, and thank-you pages."
                serviceType="Brand Identity Design"
                url="/brand"
                image="/og/og-web.webp"
            />
            <BreadcrumbSchema items={[
                { name: "Home", url: "" },
                { name: "Brand & Experience", url: "/brand" },
            ]} />
            <FAQPageSchema faqs={brandFaqItems.map((f) => ({ question: f.question, answer: f.answer }))} />
            <HowToSchema
                name="How Range of View Studios builds a brand and its touchpoints"
                description="Our five-phase process, from auditing every surface a customer already sees through to handing the system off."
                totalTime="P8W"
                url="/brand"
                steps={[
                    { name: "Audit", text: "We inventory every place a customer already meets your business and grade which surfaces carry the brand, which contradict it, and which are missing." },
                    { name: "Define", text: "We settle positioning and voice in plain written language, short enough that your team will actually read it." },
                    { name: "Design", text: "We build the identity system: mark, type, color, spacing, and guidelines written for the people who will apply them." },
                    { name: "Apply", text: "We carry the identity onto every surface from the audit and build the email and lifecycle sequences in your platform, tested end to end." },
                    { name: "Hand off", text: "We train your team, document what we built, and are explicit about what needs maintaining." },
                ]}
            />
            <BrandContent />
        </>
    );
}
