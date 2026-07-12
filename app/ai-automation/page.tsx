import type { Metadata } from "next";
import AIAutomationContent from "./AIAutomationContent";
import { ServiceSchema } from "@/components/schema/ServiceSchema";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { FAQPageSchema } from "@/components/schema/FAQPageSchema";

export const metadata: Metadata = {
    title: "Custom AI Automation Solutions",
    description:
        "Custom AI automation systems by Range of View Studios. AI that works the way your brand thinks — save time, increase conversions, and scale operations.",
    alternates: { canonical: "https://www.rovstudios.com/ai-automation" },
    openGraph: {
        title: "Custom AI Automation Solutions | Range of View Studios",
        description: "Custom AI systems that save time and make money. 80% reduction in content production time.",
        url: "https://www.rovstudios.com/ai-automation",
        images: [{ url: "/og/og-ai.webp", width: 1200, height: 630, alt: "ROV Studios AI automation dashboard" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Custom AI Automation Solutions | Range of View Studios",
        description: "Custom AI systems that save time and make money.",
        images: ["/og/og-ai.webp"],
    },
};

export default function AIAutomationPage() {
    return (
        <>
            <ServiceSchema
                name="Custom AI Automation Solutions"
                description="Custom AI automation systems that save time, increase conversions, and scale operations. AI that works the way your brand thinks."
                serviceType="AI Automation"
                url="/ai-automation"
                image="/og/og-ai.webp"
            />
            <BreadcrumbSchema items={[
                { name: "Home", url: "" },
                { name: "AI Automation", url: "/ai-automation" },
            ]} />
            <FAQPageSchema faqs={[
                { question: "How long does it take to build and launch an AI automation?", answer: "Most projects go from discovery to launch within 4 to 8 weeks. Simpler automations can be live even sooner." },
                { question: "Do I need technical knowledge to work with you?", answer: "Not at all. You just need to understand your business and we'll take care of everything else. We handle the tech, the integrations, and the logic." },
                { question: "Will this work with the tools and software I already use?", answer: "In most cases, yes. We design your automation around your existing stack so you're not forced to replace anything that's already working." },
                { question: "What kinds of tasks and processes can actually be automated?", answer: "More than most people expect. Common starting points include lead follow-up, appointment scheduling, customer support, data entry, reporting, invoice processing, and internal notifications." },
                { question: "How do you measure the ROI of an automation?", answer: "We help you define clear KPIs before we build anything. After launch, we track time saved, cost reductions, response rates, and error rates so the impact is visible and measurable." },
                { question: "Is my data safe?", answer: "Yes. We follow secure development and deployment practices across every project, including encrypted APIs, access controls, and secure cloud infrastructure." },
                { question: "What if I only have one or two processes I want to automate?", answer: "That's a great place to start. Many of our clients begin small and scale up once they see results." },
                { question: "What happens after the automation goes live?", answer: "We don't just hand it off and disappear. We monitor performance, make improvements, and help you expand the system as your business grows." },
                { question: "Can you integrate AI into the automations, not just basic workflows?", answer: "Absolutely. We build AI-powered workflows using models like GPT and Claude to handle content generation, decision-making, lead qualification, document processing, and more." },
                { question: "What if my needs change after we launch?", answer: "That's expected and completely fine. We build systems that are designed to evolve. As your business grows or your priorities shift, we adapt the automation alongside you." },
                { question: "Do you work with small businesses or only large companies?", answer: "Both. Small and mid-sized businesses often see the highest impact because automation helps them punch above their weight without growing their headcount." },
                { question: "How do I know if AI automation is the right move for my business?", answer: "That's exactly what our discovery process is for. We take an honest look at your workflows and tell you where automation will genuinely move the needle and where it won't." },
            ]} />
            <AIAutomationContent />
        </>
    );
}
