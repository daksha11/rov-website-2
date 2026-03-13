import type { Metadata } from "next";
import WebContent from "./WebContent";
import { ServiceSchema } from "@/components/ServiceSchema";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { FAQPageSchema } from "@/components/FAQPageSchema";

export const metadata: Metadata = {
    title: "Web Development & Design",
    description:
        "Custom web development and design services by Range of View Studios. Websites designed with intention, built for impact.",
    alternates: { canonical: "https://rovstudios.com/web" },
    openGraph: {
        title: "Web Development & Design | Range of View Studios",
        description: "Websites designed with intention, built for impact. Uncover the true potential of your website.",
        url: "https://rovstudios.com/web",
        images: [{ url: "/og/og-web.jpg", width: 1200, height: 630, alt: "ROV Studios web development showcase" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Web Development & Design | Range of View Studios",
        description: "Websites designed with intention, built for impact.",
        images: ["/og/og-web.jpg"],
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
                image="/og/og-web.jpg"
            />
            <BreadcrumbSchema items={[
                { name: "Home", url: "" },
                { name: "Web Development", url: "/web" },
            ]} />
            <FAQPageSchema faqs={[
                { question: "How much does a website cost?", answer: "Our website projects typically range from $2,000 to $10,000+ depending on the scope and features you need. A simple 5-page business website with custom design starts around $2,000, while more complex sites with e-commerce, custom functionality, or extensive content can go higher. Every project is different, so we provide a detailed proposal after understanding your specific goals, timeline, and requirements." },
                { question: "How long does it take to build a website?", answer: "Most websites take 6 to 8 weeks from kickoff to launch. This includes discovery and strategy, design mockups, development, content integration, testing, and launch support. Simpler sites can be completed in 4 to 5 weeks, while more complex projects with e-commerce or custom features may take 10 to 12 weeks." },
                { question: "Will my website be mobile-friendly?", answer: "Absolutely. Every website we build is fully responsive, meaning it automatically adapts to look great and function perfectly on phones, tablets, and desktops. With over 60% of web traffic coming from mobile devices, we actually design for mobile first and then scale up to larger screens." },
                { question: "What platforms do you build websites on?", answer: "We primarily build custom websites using Next.js and modern web technologies, which gives you maximum flexibility, fast performance, and complete control over your site's design and functionality. For clients who need robust e-commerce capabilities, we can integrate platforms like Shopify or set up custom shopping solutions." },
                { question: "Will I be able to update my website myself?", answer: "Yes, we build sites with user-friendly content management systems that let you make basic updates like changing text, adding images, or posting blog content without needing technical skills. During the handoff process, we provide training and documentation so you feel confident making these changes." },
                { question: "Do you handle ongoing website updates and maintenance?", answer: "Yes, we offer flexible maintenance packages for clients who want ongoing support after launch. This can include regular content updates, security monitoring, performance optimization, plugin updates, and technical troubleshooting." },
            ]} />
            <WebContent />
        </>
    );
}
