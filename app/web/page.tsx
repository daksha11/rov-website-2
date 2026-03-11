import type { Metadata } from "next";
import WebContent from "./WebContent";

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
    return <WebContent />;
}
