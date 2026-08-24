import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getPostBySlug, getRelatedPosts, getMusicPosts } from "@/lib/blog";
import { BlogPostHeader } from "@/components/blog/BlogPostHeader";
import { BlogPostBody } from "@/components/blog/BlogPostBody";
import { BlogPostCTA } from "@/components/blog/BlogPostCTA";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { BlogPostingSchema } from "@/components/blog/BlogPostingSchema";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { FAQPageSchema } from "@/components/schema/FAQPageSchema";
import { BlogFAQ } from "@/components/blog/BlogFAQ";
import { MusicMenu } from "@/components/music/MusicMenu";
import MusicFooter from "@/components/music/MusicFooter";
import { IntakeProvider } from "@/components/music/IntakeContext";

// Mirrors app/blog/[slug] but scoped to site: "music" posts and canonicalled at
// rovmusic.com. getPostBySlug returns null for a studios slug, so the two blogs
// cannot render each other's posts even on a direct hit.
const MUSIC_URL = "https://www.rovmusic.com";

export async function generateStaticParams() {
    return getMusicPosts()
        .filter((post) => !post.externalUrl)
        .map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: { slug: string };
}): Promise<Metadata> {
    const post = await getPostBySlug(params.slug, "music");
    if (!post) return { title: "Post Not Found" };

    if (post.externalUrl) {
        return {
            title: post.seoTitle ?? post.title,
            description: post.description,
            alternates: { canonical: `${MUSIC_URL}${post.externalUrl}` },
        };
    }

    return {
        title: post.seoTitle ?? post.title,
        description: post.description,
        alternates: { canonical: `${MUSIC_URL}/blog/${post.slug}` },
        openGraph: {
            title: `${post.title} | Range of View Music`,
            description: post.description,
            url: `${MUSIC_URL}/blog/${post.slug}`,
            type: "article",
            publishedTime: post.date,
            modifiedTime: post.dateModified,
            authors: [post.author],
            images: [
                {
                    url: post.coverImage || "/og/og-sound.webp",
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: `${post.title} | Range of View Music`,
            description: post.description,
            images: [post.coverImage || "/og/og-sound.webp"],
        },
    };
}

export default async function MusicBlogPostPage({
    params,
}: {
    params: { slug: string };
}) {
    const post = await getPostBySlug(params.slug, "music");
    if (!post) notFound();

    if (post.externalUrl) redirect(post.externalUrl);

    const related = getRelatedPosts(post.category, post.slug, 3, "music");

    return (
        <IntakeProvider>
            <BlogPostingSchema post={post} />
            <BreadcrumbSchema
                baseUrl={MUSIC_URL}
                items={[
                    { name: "Home", url: "" },
                    { name: "Blog", url: "/blog" },
                    { name: post.title, url: `/blog/${post.slug}` },
                ]}
            />

            {post.faqs && post.faqs.length > 0 && <FAQPageSchema faqs={post.faqs} />}

            <article className="min-h-screen" style={{ background: "#FFF4E3" }}>
                <BlogPostHeader post={post} />
                <BlogPostBody htmlContent={post.htmlContent ?? ""} />
                {post.faqs && post.faqs.length > 0 && <BlogFAQ faqs={post.faqs} />}
                <BlogPostCTA
                    slug={post.slug}
                    sourcePrefix="music-blog"
                    heading="Got a record that deserves a real mix?"
                    subheading="Mix and master from $40 a song, first one $50. Send us the session and we'll tell you honestly what it needs."
                    messagePlaceholder="The song, where it's at, and what you want it to sound like..."
                    secondaryLabel="Prefer to talk? Book a call"
                />
                <RelatedPosts posts={related} />
            </article>

            <MusicFooter />
            <MusicMenu />
        </IntakeProvider>
    );
}
