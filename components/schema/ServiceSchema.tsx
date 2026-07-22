export function ServiceSchema({
  name,
  description,
  serviceType,
  url,
  image,
  offerDescription,
  baseUrl = "https://www.rovstudios.com",
  providerName = "Range of View Studios",
  providerUrl = "https://www.rovstudios.com",
}: {
  name: string;
  description: string;
  serviceType: string;
  url: string;
  image: string;
  offerDescription?: string;
  baseUrl?: string;
  providerName?: string;
  providerUrl?: string;
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: {
      "@type": "Organization",
      name: providerName,
      url: providerUrl,
    },
    serviceType,
    areaServed: {
      "@type": "Place",
      name: "Atlanta, Georgia",
    },
    url: `${baseUrl}${url}`,
    image: `${baseUrl}${image}`,
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
