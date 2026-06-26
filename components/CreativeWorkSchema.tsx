export function CreativeWorkSchema({
  name,
  description,
  dateCreated,
  url,
  image,
  aboutName,
  lead,
  clientUrl,
}: {
  name: string;
  description: string;
  dateCreated: string;
  url: string;
  image: string;
  aboutName: string;
  /** Named project lead — adds a Person author for E-E-A-T / GEO authority. */
  lead?: { name: string; role?: string };
  /** The client's own website — upgrades the `about` subject to a real
   *  Organization entity with sameAs, strengthening the entity graph. */
  clientUrl?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name,
    description,
    creator: {
      "@type": "Organization",
      name: "Range of View Studios",
      url: "https://www.rovstudios.com",
    },
    // Named human lead behind the work (stronger E-E-A-T signal than org alone).
    ...(lead
      ? {
          author: {
            "@type": "Person",
            name: lead.name,
            ...(lead.role ? { jobTitle: lead.role } : {}),
            url: "https://www.rovstudios.com/about",
            worksFor: {
              "@type": "Organization",
              name: "Range of View Studios",
              url: "https://www.rovstudios.com",
            },
          },
        }
      : {}),
    dateCreated,
    datePublished: dateCreated,
    url: `https://www.rovstudios.com${url}`,
    image: `https://www.rovstudios.com${image}`,
    // The client as a real, linkable Organization entity.
    about: {
      "@type": "Organization",
      name: aboutName,
      ...(clientUrl ? { url: clientUrl, sameAs: [clientUrl] } : {}),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
