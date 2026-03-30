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
    author: {
      "@type": "Organization",
      name: "ROV Studios",
      url: "https://rovstudios.com",
    },
    publisher: {
      "@type": "Organization",
      name: "ROV Studios",
      url: "https://rovstudios.com",
      logo: {
        "@type": "ImageObject",
        url: "https://rovstudios.com/rov-logo.webp",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://rovstudios.com/blog/${post.slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
