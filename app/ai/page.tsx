import type { Metadata } from "next";
import AIContent from "./AIContent";

export const metadata: Metadata = {
    title: "AI Services",
    description:
        "Transform your business with intelligent automation by Range of View Studios. Custom AI solutions for content, customer interactions, and operations.",
    alternates: { canonical: "https://rovstudios.com/ai" },
    openGraph: {
        title: "AI Services | Range of View Studios",
        description: "Transform your business with intelligent automation.",
        url: "https://rovstudios.com/ai",
        images: [{ url: "/og/og-ai.jpg", width: 1200, height: 630, alt: "ROV Studios AI services" }],
    },
};

export default function AIPage() {
    return <AIContent />;
}
