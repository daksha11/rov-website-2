import { BlogPost } from "@/lib/types";

export function BlogPostingSchema({ post }: { post: BlogPost }) {
  const wordCount = post.content.split(/\s+/).filter(Boolean).length;

  // Prefer a named Person author (stronger E-E-A-T signal for Google and AI
  // answer engines). Fall back to the Organization when no person is credited.
  const isPerson = post.author && post.author.toLowerCase() !== "rov studios";
  const author = isPerson
    ? {
        "@type": "Person",
        name: post.author,
        ...(post.authorRole ? { jobTitle: post.authorRole } : {}),
        url: post.authorUrl ?? "https://www.rovstudios.com/about",
        worksFor: {
          "@type": "Organization",
          name: "Range of View Studios",
          url: "https://www.rovstudios.com",
        },
      }
    : {
        "@type": "Organization",
        name: "ROV Studios",
        url: "https://www.rovstudios.com",
      };

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
    author,
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
