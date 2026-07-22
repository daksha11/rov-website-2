export function VideoSchema({
  name,
  description,
  thumbnailUrl,
  uploadDate,
  contentUrl,
  duration,
  pageUrl,
  baseUrl = "https://www.rovstudios.com",
}: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  contentUrl?: string;
  duration?: string;
  pageUrl?: string;
  baseUrl?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name,
    description,
    thumbnailUrl: `${baseUrl}${thumbnailUrl}`,
    uploadDate,
    ...(contentUrl && { contentUrl: `${baseUrl}${contentUrl}` }),
    ...(duration && { duration }),
    ...(pageUrl && { url: `${baseUrl}${pageUrl}` }),
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
