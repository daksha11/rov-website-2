export function CreativeWorkSchema({
  name,
  description,
  dateCreated,
  url,
  image,
  aboutName,
}: {
  name: string;
  description: string;
  dateCreated: string;
  url: string;
  image: string;
  aboutName: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name,
    description,
    creator: {
      "@type": "Organization",
      name: "Range of View Studios",
    },
    dateCreated,
    url: `https://www.rovstudios.com${url}`,
    image: `https://www.rovstudios.com${image}`,
    about: {
      "@type": "WebSite",
      name: aboutName,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
