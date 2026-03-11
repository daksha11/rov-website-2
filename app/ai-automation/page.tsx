import type { Metadata } from "next";
import AIAutomationContent from "./AIAutomationContent";

export const metadata: Metadata = {
    title: "Custom AI Automation Solutions",
    description:
        "Custom AI automation systems by Range of View Studios. AI that works the way your brand thinks — save time, increase conversions, and scale operations.",
    alternates: { canonical: "https://rovstudios.com/ai-automation" },
    openGraph: {
        title: "Custom AI Automation Solutions | Range of View Studios",
        description: "Custom AI systems that save time and make money. 80% reduction in content production time.",
        url: "https://rovstudios.com/ai-automation",
        images: [{ url: "/og/og-ai.jpg", width: 1200, height: 630, alt: "ROV Studios AI automation dashboard" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Custom AI Automation Solutions | Range of View Studios",
        description: "Custom AI systems that save time and make money.",
        images: ["/og/og-ai.jpg"],
    },
};

export default function AIAutomationPage() {
    return <AIAutomationContent />;
}
