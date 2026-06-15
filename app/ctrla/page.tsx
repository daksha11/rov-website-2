import type { Metadata } from "next";
import CtrlAContent from "./CtrlAContent";

export const metadata: Metadata = {
    title: "CTRL A — Issue 01 | The Creative Command",
    description:
        "CTRL A by Range of View Studios — a creative magazine for music, web development, and design. Tested tools, honest reviews, and a new pick every Friday.",
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
