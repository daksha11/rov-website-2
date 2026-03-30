import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { getPostBySlug, getPostSlugs, getRelatedPosts } from "@/lib/blog";
import { BlogPostHeader } from "@/components/blog/BlogPostHeader";
import { BlogPostBody } from "@/components/blog/BlogPostBody";
import { BlogPostCTA } from "@/components/blog/BlogPostCTA";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { BlogPostingSchema } from "@/components/blog/BlogPostingSchema";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { FAQPageSchema } from "@/components/FAQPageSchema";
import { BlogFAQ } from "@/components/blog/BlogFAQ";

const NavigationDock = dynamic(
  () =>
    import("@/components/NavDoc").then((mod) => ({
      default: mod.NavigationDock,
    })),
  { ssr: false }
);

const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });

export async function generateStaticParams() {
  const slugs = getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `https://rovstudios.com/blog/${post.slug}`,
    },
    openGraph: {
      title: `${post.title} | Range of View Studios`,
      description: post.description,
      url: `https://rovstudios.com/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.dateModified,
      authors: [post.author],
      images: [
        {
          url: "/og/og-default.jpg",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary",
      title: `${post.title} | Range of View Studios`,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  const related = getRelatedPosts(post.category, post.slug, 3);

  return (
    <>
      <BlogPostingSchema post={post} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "" },
          { name: "Blog", url: "/blog" },
          { name: post.title, url: `/blog/${post.slug}` },
        ]}
      />

      {post.faqs && post.faqs.length > 0 && (
        <FAQPageSchema faqs={post.faqs} />
      )}

      <article className="min-h-screen bg-black">
        <BlogPostHeader post={post} />
        <BlogPostBody htmlContent={post.htmlContent ?? ""} />
        {post.faqs && post.faqs.length > 0 && <BlogFAQ faqs={post.faqs} />}
        <BlogPostCTA />
        <RelatedPosts posts={related} />
      </article>

      <NavigationDock />
      <Footer />
    </>
  );
}
