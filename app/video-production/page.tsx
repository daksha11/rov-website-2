import type { Metadata } from "next";
import VideoProductionContent from "./VideoProductionContent";
import { VideoSchema } from "@/components/VideoSchema";
import { ServiceSchema } from "@/components/ServiceSchema";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { FAQPageSchema } from "@/components/FAQPageSchema";

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
    return (
        <>
            <ServiceSchema
                name="Video Production & Cinematography"
                description="Cinematic video production services. Breathtaking visuals that elevate your brand and tell compelling stories."
                serviceType="Video Production"
                url="/video-production"
                image="/og/og-video.jpg"
            />
            <BreadcrumbSchema items={[
                { name: "Home", url: "" },
                { name: "Video Production", url: "/video-production" },
            ]} />
            <FAQPageSchema faqs={[
                { question: "What types of video production services do you offer?", answer: "We handle everything in-house. Pre-production planning, shot lists, actual filming, editing, color grading, final delivery. Brand videos, promo content, social media stuff, real estate walkthroughs, drone footage. Whatever you need, we manage it so the final product actually feels like one cohesive piece." },
                { question: "Do you use drones, and is your aerial footage FAA compliant?", answer: "Yeah, we do. All our drone work is legit FAA compliant. Our drone is under 250 grams, so we're completely covered on the regulatory side. You get the cinematic aerial shots without any legal headaches." },
                { question: "Can I receive the raw footage after the shoot?", answer: "We can do that if you ask upfront. Honestly though, raw files don't really represent what we actually built. The final product is color graded, edited, intentional. That's what you're paying for. But if you need raw files, just let us know and we'll work it into the project from the start." },
                { question: "How long does the video production process take?", answer: "It depends on the project, but here's roughly how it breaks down: planning and prep is about one to two weeks, the shoot is usually one to two days, then post-production (editing, color grading, revisions) takes another one to three weeks. We'll give you a clear timeline before we start so nothing surprises you." },
                { question: "How do you protect the quality of your work?", answer: "We just care about doing it right. Shot lists, intentional lighting, real editing, proper color grading. It's not just about looking good. It's about making sure your video actually holds up in your industry." },
                { question: "What do I actually get at the end?", answer: "A finished, color-graded cut exported in whatever formats you need. Whether that's for social, web, broadcast, wherever. We handle all the technical stuff. Depending on your package, we can also do cut-downs for different platforms and handle any music or motion graphics licensing." },
                { question: "Do you travel for shoots?", answer: "Yep. We'll go on location shoots outside our area. Travel costs and scheduling get factored into your quote upfront. No surprise fees later." },
                { question: "How do I get started?", answer: "Just reach out and tell us what you're working on. We'll talk through your goals, who your audience is, what you actually want to accomplish. Then we'll give you a clear scope and timeline before anything happens." },
            ]} />
            <VideoSchema
                name="Atlanta Skyline Cinematic Aerial Shot"
                description="Cinematic aerial footage of the Atlanta skyline captured by Range of View Studios for real estate and commercial clients."
                thumbnailUrl="/thumbnails/videohero1.webp"
                uploadDate="2025-01-15"
                contentUrl="/videoprod/Atlskylineweb.mp4"
                duration="PT30S"
            />
            <VideoSchema
                name="Gladstone Property Walkthrough"
                description="Premium real estate video walkthrough showcasing dynamic visual storytelling by ROV Studios."
                thumbnailUrl="/thumbnails/videohero2.webp"
                uploadDate="2025-01-15"
                contentUrl="/videoprod/Gladshotweb.mp4"
                duration="PT25S"
            />
            <VideoSchema
                name="Mountain Landscape Aerial Footage"
                description="Breathtaking mountain landscape captured from above by Range of View Studios drone cinematography team."
                thumbnailUrl="/thumbnails/videohero3.webp"
                uploadDate="2025-01-15"
                contentUrl="/videoprod/Mountainweb.mp4"
                duration="PT20S"
            />
            <VideoSchema
                name="Boxing Event Coverage"
                description="High-energy boxing event videography capturing raw intensity frame by frame, produced by ROV Studios."
                thumbnailUrl="/thumbnails/boxing1.webp"
                uploadDate="2025-02-01"
                contentUrl="/videoprod/postprod/Boxingeditcolor.mp4"
                duration="PT35S"
            />
            <VideoProductionContent />
        </>
    );
}
