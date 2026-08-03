import type { Metadata } from "next";
import Link from "next/link";
import { NavigationDock } from "@/components/sections/NavDoc";
import Footer from "@/components/sections/Footer";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import ProjectBriefForm from "@/components/web/ProjectBriefForm";

export const metadata: Metadata = {
    title: "Start a Project Brief | Web Design & Development",
    description:
        "Tell us about your website project. A few minutes of questions and we come back with our read on it, a scope, and what a demo would look like.",
    alternates: { canonical: "https://www.rovstudios.com/web/brief" },
    openGraph: {
        title: "Start a Project Brief | Range of View Studios",
        description:
            "Answer a few questions about your business, your goals, and your taste. We come back with a scope and a demo direction.",
        url: "https://www.rovstudios.com/web/brief",
        images: [{ url: "/og/og-web.webp", width: 1200, height: 630, alt: "ROV Studios web development" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Start a Project Brief | Range of View Studios",
        description: "Tell us what you're building. We'll come back with a scope and a demo direction.",
        images: ["/og/og-web.webp"],
    },
};

const HEADING = "Norwige, sans-serif";
const BODY = "'Roboto', sans-serif";

// Titles only. Each one has to land on its own, so they read as three
// promises rather than three headings waiting for a paragraph.
const PROMISES = [
    "We read your site before we reply",
    "A person answers within a day",
    "You get a scope, not a pitch",
];

export default function WebBriefPage() {
    return (
        <>
            <BreadcrumbSchema
                items={[
                    { name: "Home", url: "" },
                    { name: "Web Development", url: "/web" },
                    { name: "Project Brief", url: "/web/brief" },
                ]}
            />
            <main className="min-h-screen bg-black text-white relative overflow-x-hidden">
                <section style={{ padding: "clamp(90px, 13vw, 150px) clamp(16px, 5vw, 60px) clamp(28px, 5vw, 48px)" }}>
                    <div className="max-w-3xl mx-auto">
                        <Link
                            href="/web"
                            className="inline-flex items-center gap-1.5 text-white/40 hover:text-[#EA9A61] text-xs uppercase tracking-[0.2em] transition-colors mb-8"
                            style={{ fontFamily: BODY }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                            Web development
                        </Link>

                        <span
                            className="block text-xs uppercase tracking-[0.3em] text-[#EA9A61] mb-4"
                            style={{ fontFamily: BODY }}
                        >
                            Project brief
                        </span>
                        <h1
                            className="text-white font-bold italic leading-[1.05] mb-5"
                            style={{ fontFamily: HEADING, fontSize: "clamp(2.25rem, 6vw, 4rem)" }}
                        >
                            Tell us what you&apos;re building
                        </h1>
                        <p
                            className="text-white/55 leading-relaxed max-w-xl"
                            style={{ fontFamily: BODY, fontSize: "clamp(1rem, 1.6vw, 1.125rem)" }}
                        >
                            Most agencies open with a sales call. We&apos;d rather start with your answers.
                            Four short steps: your link, the job the site has to do, the work you actually
                            like, and what you&apos;re working with. Under two minutes, and you get our read
                            on the project at the end.
                        </p>
                    </div>
                </section>

                <section style={{ padding: "0 clamp(16px, 5vw, 60px) clamp(50px, 8vw, 90px)" }}>
                    <div className="max-w-3xl mx-auto">
                        <ProjectBriefForm />
                    </div>
                </section>

                <section
                    className="border-t border-white/[0.07]"
                    style={{ padding: "clamp(50px, 8vw, 90px) clamp(16px, 5vw, 60px)" }}
                >
                    <div className="max-w-3xl mx-auto">
                        <span
                            className="block text-xs uppercase tracking-[0.3em] text-white/35 mb-8"
                            style={{ fontFamily: BODY }}
                        >
                            What happens next
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                            {PROMISES.map((p, i) => (
                                <div key={p} className="border-t border-white/[0.09] pt-5">
                                    <span
                                        className="block text-[#EA9A61] text-xs mb-3 tabular-nums tracking-[0.2em]"
                                        style={{ fontFamily: BODY }}
                                    >
                                        0{i + 1}
                                    </span>
                                    <h2
                                        className="text-white font-bold italic leading-snug"
                                        style={{ fontFamily: HEADING, fontSize: "clamp(1.25rem, 1.9vw, 1.6rem)" }}
                                    >
                                        {p}
                                    </h2>
                                </div>
                            ))}
                        </div>

                        <p className="text-white/35 text-sm mt-10 leading-relaxed" style={{ fontFamily: BODY }}>
                            Would you rather talk it through?{" "}
                            <a
                                href="https://cal.com/rov-studios-imhphw/15min"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#EA9A61] hover:underline"
                            >
                                Book a free 15 minute call
                            </a>{" "}
                            and we&apos;ll fill this out together.
                        </p>
                    </div>
                </section>

                <NavigationDock />
                <Footer />
            </main>
        </>
    );
}
