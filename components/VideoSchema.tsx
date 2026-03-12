export function VideoSchema({
  name,
  description,
  thumbnailUrl,
  uploadDate,
  contentUrl,
  duration,
}: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  contentUrl?: string;
  duration?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name,
    description,
    thumbnailUrl: `https://rovstudios.com${thumbnailUrl}`,
    uploadDate,
    ...(contentUrl && { contentUrl: `https://rovstudios.com${contentUrl}` }),
    ...(duration && { duration }),
    publisher: {
      "@type": "Organization",
      name: "Range of View Studios",
      logo: {
        "@type": "ImageObject",
        url: "https://rovstudios.com/rov-logo.webp",
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
