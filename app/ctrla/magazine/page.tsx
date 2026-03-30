import type { Metadata } from "next";
import MagazineContent from "./MagazineContent";

export const metadata: Metadata = {
    title: "The CTRL A Toolkit — Digital Magazine",
    description:
        "Community-curated toolkits for music, web development, and design. Handpicked tools, real use cases, and honest opinions from creatives who ship.",
    alternates: { canonical: "https://www.rovstudios.com/ctrla/magazine" },
    openGraph: {
        title: "The CTRL A Toolkit | Range of View Studios",
        description: "Community-curated toolkits for music, web development, and design.",
        url: "https://www.rovstudios.com/ctrla/magazine",
        images: [{ url: "/og/og-home.jpg", width: 1200, height: 630, alt: "CTRL A Digital Magazine" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "The CTRL A Toolkit | Range of View Studios",
        description: "Community-curated toolkits for music, web development, and design.",
        images: ["/og/og-home.jpg"],
    },
};

export default function MagazinePage() {
    return <MagazineContent />;
}
