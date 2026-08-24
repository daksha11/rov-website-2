import type { Metadata } from "next";
import { getMusicPosts } from "@/lib/blog";
import { BlogCard } from "@/components/blog/BlogCard";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { MusicMenu } from "@/components/music/MusicMenu";
import MusicFooter from "@/components/music/MusicFooter";
import { IntakeProvider } from "@/components/music/IntakeContext";

// rovmusic.com/blog is served from here via the host rewrite in middleware.ts.
// Every URL in this tree canonicals to the music host, never to studios.
const MUSIC_URL = "https://www.rovmusic.com";

export const metadata: Metadata = {
    title: { absolute: "Mixing, Mastering & Music Production Notes | ROV Music" },
    description:
        "How we actually mix, master, and release records in Atlanta. Session notes, plugin breakdowns, and release strategy from working engineers, not sponsored gear reviews.",
    alternates: { canonical: `${MUSIC_URL}/blog` },
    openGraph: {
        title: "Mixing, Mastering & Music Production Notes | ROV Music",
        description:
            "Session notes, plugin breakdowns, and release strategy from working Atlanta engineers.",
        url: `${MUSIC_URL}/blog`,
        images: [
            {
                url: `${MUSIC_URL}/og/og-sound.webp`,
                width: 1200,
                height: 630,
                alt: "ROV Music blog",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Mixing, Mastering & Music Production Notes | ROV Music",
        description:
            "Session notes, plugin breakdowns, and release strategy from working Atlanta engineers.",
        images: [`${MUSIC_URL}/og/og-sound.webp`],
    },
};

export default function MusicBlogPage() {
    const posts = getMusicPosts();

    return (
        <IntakeProvider>
            <BreadcrumbSchema
                baseUrl={MUSIC_URL}
                items={[
                    { name: "Home", url: "" },
                    { name: "Blog", url: "/blog" },
                ]}
            />

            <section className="bg-black px-6 pb-16 pt-28 sm:pt-36">
                <div className="mx-auto max-w-6xl">
                    <h1
                        className="text-white"
                        style={{
                            fontFamily: "Norwige, sans-serif",
                            fontSize: "clamp(2.5rem, 6vw, 5rem)",
                            lineHeight: 1.1,
                        }}
                    >
                        How the sound gets made.
                    </h1>
                    <p
                        className="mt-4 max-w-lg text-base text-gray-400 sm:text-lg"
                        style={{ fontFamily: "'Roboto', sans-serif" }}
                    >
                        Session notes, plugin breakdowns, and release strategy from the
                        records we actually finish. Nothing sponsored, nothing theoretical.
                    </p>
                </div>
            </section>

            <section className="bg-black px-6 pb-24">
                <div className="mx-auto max-w-6xl">
                    {posts.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {posts.map((post) => (
                                <BlogCard key={post.slug} post={post} />
                            ))}
                        </div>
                    ) : (
                        <p className="py-20 text-center text-gray-500">No posts yet.</p>
                    )}
                </div>
            </section>

            <MusicFooter />
            <MusicMenu />
        </IntakeProvider>
    );
}
