import type { Metadata } from "next";
import VideoProductionContent from "./VideoProductionContent";

export const metadata: Metadata = {
    title: "Video Production & Cinematography",
    description:
        "Cinematic video production services by Range of View Studios. Breathtaking visuals that elevate your brand and tell compelling stories.",
    alternates: { canonical: "https://rovstudios.com/video-production" },
    openGraph: {
        title: "Video Production & Cinematography | Range of View Studios",
        description: "Cinematic video production that elevates your brand and tells compelling stories.",
        url: "https://rovstudios.com/video-production",
        images: [{ url: "/og/og-video.jpg", width: 1200, height: 630, alt: "ROV Studios video production reel" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Video Production & Cinematography | Range of View Studios",
        description: "Cinematic video production that elevates your brand.",
        images: ["/og/og-video.jpg"],
    },
};

export default function VideoProductionPage() {
    return <VideoProductionContent />;
}
