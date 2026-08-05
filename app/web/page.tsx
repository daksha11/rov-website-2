import type { Metadata } from "next";
import WebContent from "./WebContent";
import { ServiceSchema } from "@/components/schema/ServiceSchema";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { FAQPageSchema } from "@/components/schema/FAQPageSchema";
import { HowToSchema } from "@/components/schema/HowToSchema";
import { webFaqItems } from "@/data/faq";

export const metadata: Metadata = {
    title: "Custom Web Development & Design Services",
    description:
        "Custom web development and design services by Range of View Studios. Websites designed with intention, built for impact.",
    alternates: { canonical: "https://www.rovstudios.com/web" },
    openGraph: {
        title: "Custom Web Development & Design Services | Range of View Studios",
        description: "Websites designed with intention, built for impact. Uncover the true potential of your website.",
        url: "https://www.rovstudios.com/web",
        images: [{ url: "/og/og-web.webp", width: 1200, height: 630, alt: "ROV Studios web development showcase" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Custom Web Development & Design Services | Range of View Studios",
        description: "Websites designed with intention, built for impact.",
        images: ["/og/og-web.webp"],
    },
};

export default function WebDevPage() {
    return (
        <>
            <ServiceSchema
                name="Web Development & Design"
                description="Custom web development and design services. Websites designed with intention, built for impact."
                serviceType="Web Development"
                url="/web"
                image="/og/og-web.webp"
            />
            <BreadcrumbSchema items={[
                { name: "Home", url: "" },
                { name: "Web Development", url: "/web" },
            ]} />
            {/* Reads the same array the on-page accordion renders. This used to
                be a hand-copied duplicate, which is exactly how the schema ended
                up advertising a $2,000 floor months after the floor moved to
                $2,500. One source, no drift. */}
            <FAQPageSchema faqs={webFaqItems} />
            <HowToSchema
                name="How Range of View Studios builds a website"
                description="Our six-phase web development process, from discovery to launch and growth."
                totalTime="P6W"
                url="/web"
                steps={[
                    { name: "Discover", text: "We start with strategy: goals, audience, competitors, and the outcomes the site needs to drive before any design begins." },
                    { name: "Design", text: "We design mockups of every key page, establishing the visual system, layout, and content hierarchy for sign-off." },
                    { name: "Build", text: "We develop the site with Next.js and modern web technologies for speed, flexibility, and full control." },
                    { name: "Refine", text: "We integrate content and review the build together, refining interactions, copy, and detail across breakpoints." },
                    { name: "Optimize", text: "We test across devices and optimize performance, accessibility, and on-page SEO before launch." },
                    { name: "Launch & Grow", text: "We launch with support and provide training, documentation, and optional ongoing maintenance to keep the site growing." },
                ]}
            />
            <WebContent />
        </>
    );
}
