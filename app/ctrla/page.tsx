import type { Metadata } from "next";
import CtrlAContent from "./CtrlAContent";

export const metadata: Metadata = {
    title: "CTRL A Vol. 01 — A Digital Muse for Creatives | Range of View",
    description:
        "CTRL A by Range of View Studios is a monthly digital muse for creatives: immersive toolkits for music, web development, and design, the full process with none of the ugly steps skipped, and the art we can't stop thinking about. Plus Atlanta events including the FIFA World Cup 26™ at Mercedes-Benz Stadium.",
    keywords: [
        "CTRL A magazine",
        "creative toolkits",
        "music production tools",
        "web development tools",
        "design tools",
        "Atlanta creative magazine",
        "Atlanta events",
        "FIFA World Cup 2026 Atlanta",
        "FIFA World Cup 26 Mercedes-Benz Stadium",
        "Range of View Studios",
    ],
    alternates: { canonical: "https://www.rovstudios.com/ctrla" },
    openGraph: {
        title: "CTRL A — A Digital Muse for Creatives | Range of View Studios",
        description: "A monthly field guide for creatives: immersive toolkits, the whole process, and the art we can't stop thinking about. Taste is the sky you set as your limit.",
        url: "https://www.rovstudios.com/ctrla",
        images: [{ url: "/og/og-ctrla.png", width: 1200, height: 630, alt: "CTRL A by Range of View Studios" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "CTRL A — A Digital Muse for Creatives | Range of View Studios",
        description: "A monthly field guide for creatives: immersive toolkits, the whole process, and the art we can't stop thinking about.",
        images: ["/og/og-ctrla.png"],
    },
};

export default function CtrlAPage() {
    return <CtrlAContent />;
}
