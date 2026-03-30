export function ServiceSchema({
  name,
  description,
  serviceType,
  url,
  image,
  offerDescription,
}: {
  name: string;
  description: string;
  serviceType: string;
  url: string;
  image: string;
  offerDescription?: string;
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: {
      "@type": "Organization",
      name: "Range of View Studios",
      url: "https://www.rovstudios.com",
    },
    serviceType,
    areaServed: {
      "@type": "Place",
      name: "Atlanta, Georgia",
    },
    url: `https://www.rovstudios.com${url}`,
    image: `https://www.rovstudios.com${image}`,
  };

  if (offerDescription) {
    schema.offers = {
      "@type": "Offer",
      description: offerDescription,
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
