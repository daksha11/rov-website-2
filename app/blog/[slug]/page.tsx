import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { notFound, redirect } from "next/navigation";
import { getPostBySlug, getRelatedPosts, getAllPosts } from "@/lib/blog";
import { BlogPostHeader } from "@/components/blog/BlogPostHeader";
import { BlogPostBody } from "@/components/blog/BlogPostBody";
import { BlogPostCTA } from "@/components/blog/BlogPostCTA";
// import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { BlogPostingSchema } from "@/components/blog/BlogPostingSchema";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { FAQPageSchema } from "@/components/schema/FAQPageSchema";
import { BlogFAQ } from "@/components/blog/BlogFAQ";

const NavigationDock = dynamic(
  () =>
    import("@/components/sections/NavDoc").then((mod) => ({
      default: mod.NavigationDock,
    })),
  { ssr: false }
);

const Footer = dynamic(() => import("@/components/sections/Footer"), { ssr: false });

export async function generateStaticParams() {
  // Skip stub posts that only redirect to a /web page — no static page needed.
  return getAllPosts()
    .filter((post) => !post.externalUrl)
    .map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: "Post Not Found" };

  // Stub posts point their canonical at the real /web page they redirect to.
  if (post.externalUrl) {
    return {
      title: post.seoTitle ?? post.title,
      description: post.description,
      alternates: { canonical: `https://www.rovstudios.com${post.externalUrl}` },
    };
  }

  return {
    // seoTitle (if set) keeps the <title> short so it doesn't truncate in SERPs;
    // the long, keyword-rich post.title remains the on-page H1.
    title: post.seoTitle ?? post.title,
    description: post.description,
    alternates: {
      canonical: `https://www.rovstudios.com/blog/${post.slug}`,
    },
    openGraph: {
      title: `${post.title} | Range of View Studios`,
      description: post.description,
      url: `https://www.rovstudios.com/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.dateModified,
      authors: [post.author],
      images: [
        {
          url: post.coverImage || "/og/og-default.webp",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | Range of View Studios`,
      description: post.description,
      images: [post.coverImage || "/og/og-default.webp"],
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

  // Listing stubs for /web pages send the visitor to the real page.
  if (post.externalUrl) redirect(post.externalUrl);

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

      <article className="min-h-screen" style={{ background: "#FFF4E3" }}>
        <BlogPostHeader post={post} />
        <BlogPostBody htmlContent={post.htmlContent ?? ""} />
        {post.faqs && post.faqs.length > 0 && <BlogFAQ faqs={post.faqs} />}
        <BlogPostCTA slug={post.slug} />
        {/* TODO: Re-enable RelatedPosts when blog has 20+ posts */}
        {/* <RelatedPosts posts={related} /> */}
      </article>

      <NavigationDock />
      <Footer />
    </>
  );
}
