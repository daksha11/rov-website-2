import type { Metadata } from "next";
import CtrlAContent from "./CtrlAContent";

export const metadata: Metadata = {
    title: "CTRL A — Issue 01 | The Creative Command",
    description:
        "CTRL A by Range of View Studios — a creative magazine for music, web development, and design. Tested tools, honest reviews, a new pick every Friday, plus Atlanta events including the FIFA World Cup 26™ at Mercedes-Benz Stadium.",
    keywords: [
        "CTRL A magazine",
        "Atlanta creative magazine",
        "Atlanta events",
        "FIFA World Cup 2026 Atlanta",
        "FIFA World Cup 26 Mercedes-Benz Stadium",
        "Atlanta World Cup matches",
        "Range of View Studios",
        "creative tools",
    ],
    alternates: { canonical: "https://www.rovstudios.com/ctrla" },
    openGraph: {
        title: "CTRL A — The Creative Command | Range of View Studios",
        description: "A creative platform for music, web development, and design. Tools and resources for builders.",
        url: "https://www.rovstudios.com/ctrla",
        images: [{ url: "/og/og-ctrla.webp", width: 1200, height: 630, alt: "CTRL A by Range of View Studios" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "CTRL A — The Creative Command | Range of View Studios",
        description: "A creative platform for music, web development, and design. Tools and resources for builders.",
        images: ["/og/og-ctrla.webp"],
    },
};

export default function CtrlAPage() {
    return <CtrlAContent />;
}
