import { BlogPost } from "@/lib/types";

export function BlogPostingSchema({ post }: { post: BlogPost }) {
  const wordCount = post.content.split(/\s+/).filter(Boolean).length;

  // Each host publishes under its own identity. A music post that named
  // rovstudios as its publisher and mainEntityOfPage would hand the credit for
  // rovmusic.com content to the wrong domain, which is the whole point of the split.
  const isMusic = post.site === "music";
  const baseUrl = isMusic
    ? "https://www.rovmusic.com"
    : "https://www.rovstudios.com";
  const orgName = isMusic ? "Range of View Music" : "ROV Studios";
  const defaultAuthorUrl = isMusic ? `${baseUrl}/authors` : `${baseUrl}/about`;

  // Prefer a named Person author (stronger E-E-A-T signal for Google and AI
  // answer engines). Fall back to the Organization when no person is credited.
  const isPerson = post.author && post.author.toLowerCase() !== "rov studios";
  const author = isPerson
    ? {
        "@type": "Person",
        name: post.author,
        ...(post.authorRole ? { jobTitle: post.authorRole } : {}),
        url: post.authorUrl ?? defaultAuthorUrl,
        worksFor: {
          "@type": "Organization",
          name: isMusic ? "Range of View Music" : "Range of View Studios",
          url: baseUrl,
        },
      }
    : {
        "@type": "Organization",
        name: orgName,
        url: baseUrl,
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
      ? `${baseUrl}${post.coverImage}`
      : `${baseUrl}${isMusic ? "/og/og-sound.webp" : "/og/og-default.webp"}`,
    author,
    publisher: {
      "@type": "Organization",
      name: orgName,
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/brand/rov-logo.webp`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${post.slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
