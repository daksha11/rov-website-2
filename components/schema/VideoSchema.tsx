export function VideoSchema({
  name,
  description,
  thumbnailUrl,
  uploadDate,
  contentUrl,
  duration,
  pageUrl,
}: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  contentUrl?: string;
  duration?: string;
  pageUrl?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name,
    description,
    thumbnailUrl: `https://www.rovstudios.com${thumbnailUrl}`,
    uploadDate,
    ...(contentUrl && { contentUrl: `https://www.rovstudios.com${contentUrl}` }),
    ...(duration && { duration }),
    ...(pageUrl && { url: `https://www.rovstudios.com${pageUrl}` }),
    isFamilyFriendly: true,
    inLanguage: "en",
    publisher: {
      "@type": "Organization",
      name: "Range of View Studios",
      logo: {
        "@type": "ImageObject",
        url: "https://www.rovstudios.com/brand/rov-logo.webp",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
