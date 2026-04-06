import type { Metadata } from "next";
import CtrlAContent from "./CtrlAContent";

export const metadata: Metadata = {
    title: "CTRL A - Coming Soon",
    description:
        "CTRL A by Range of View Studios — a creative toolkit for music, web development, and design. Coming soon.",
    alternates: { canonical: "https://www.rovstudios.com/ctrla" },
    openGraph: {
        title: "CTRL A - Coming Soon | Range of View Studios",
        description: "A creative toolkit for music, web development, and design. Coming soon.",
        url: "https://www.rovstudios.com/ctrla",
        images: [{ url: "/og/og-ctrla.webp", width: 1200, height: 630, alt: "CTRL A by Range of View Studios" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "CTRL A - Coming Soon | Range of View Studios",
        description: "A creative toolkit for music, web development, and design. Coming soon.",
        images: ["/og/og-ctrla.webp"],
    },
};

export default function CtrlAPage() {
    return <CtrlAContent />;
}
