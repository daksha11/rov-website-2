import type { Metadata } from "next";
import AIContent from "./AIContent";
import { ServiceSchema } from "@/components/ServiceSchema";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { FAQPageSchema } from "@/components/FAQPageSchema";

export const metadata: Metadata = {
    title: "AI Services & Intelligent Business Automation",
    description:
        "Transform your business with intelligent automation by Range of View Studios. Custom AI solutions for content, customer interactions, and operations.",
    alternates: { canonical: "https://rovstudios.com/ai" },
    openGraph: {
        title: "AI Services & Intelligent Business Automation | Range of View Studios",
        description: "Transform your business with intelligent automation. Custom AI solutions for content, customer interactions, and operations.",
        url: "https://rovstudios.com/ai",
        images: [{ url: "/og/og-ai.jpg", width: 1200, height: 630, alt: "ROV Studios AI services" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "AI Services & Intelligent Business Automation | Range of View Studios",
        description: "Transform your business with intelligent automation. Custom AI solutions for content, customer interactions, and operations.",
        images: ["/og/og-ai.jpg"],
    },
};

export default function AIPage() {
    return (
        <>
            <ServiceSchema
                name="AI Services"
                description="Transform your business with intelligent automation. Custom AI solutions for content, customer interactions, and operations."
                serviceType="AI Services"
                url="/ai"
                image="/og/og-ai.jpg"
            />
            <BreadcrumbSchema items={[
                { name: "Home", url: "" },
                { name: "AI Services", url: "/ai" },
            ]} />
            <FAQPageSchema faqs={[
                { question: "How long does it take to build and launch an AI automation?", answer: "Most projects go from discovery to launch within 4 to 8 weeks. Simpler automations can be live even sooner. We move fast because we've done this enough times to know exactly what needs to happen and in what order." },
                { question: "Do I need technical knowledge to work with you?", answer: "Not at all. You just need to understand your business and we'll take care of everything else. We handle the tech, the integrations, and the logic so you never have to." },
                { question: "Will this work with the tools and software I already use?", answer: "In most cases, yes. We design your automation around your existing stack so you're not forced to replace anything that's already working. If a tool connects to an API, there's a very good chance we can work with it." },
                { question: "What kinds of tasks and processes can actually be automated?", answer: "More than most people expect. Common starting points include lead follow-up, appointment scheduling, customer support, data entry, reporting, invoice processing, and internal notifications. A good rule of thumb: if your team does it repeatedly, there's a good chance we can automate it." },
                { question: "How do you measure the ROI of an automation?", answer: "We help you define clear KPIs before we build anything. After launch, we track time saved, cost reductions, response rates, and error rates so the impact is visible and measurable, not just a feeling." },
                { question: "Is my data safe?", answer: "Yes. We follow secure development and deployment practices across every project, including encrypted APIs, access controls, and secure cloud infrastructure. Your data stays yours." },
            ]} />
            <AIContent />
        </>
    );
}
