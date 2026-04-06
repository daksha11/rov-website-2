import { BlogPost } from "@/lib/types";

export function BlogPostingSchema({ post }: { post: BlogPost }) {
  const wordCount = post.content.split(/\s+/).filter(Boolean).length;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.dateModified,
    wordCount,
    articleSection: post.category,
    image: post.coverImage
      ? `https://www.rovstudios.com${post.coverImage}`
      : "https://www.rovstudios.com/og/og-default.webp",
    author: {
      "@type": "Organization",
      name: "ROV Studios",
      url: "https://www.rovstudios.com",
    },
    publisher: {
      "@type": "Organization",
      name: "ROV Studios",
      url: "https://www.rovstudios.com",
      logo: {
        "@type": "ImageObject",
        url: "https://www.rovstudios.com/rov-logo.webp",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.rovstudios.com/blog/${post.slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
