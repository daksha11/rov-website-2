export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://www.rovstudios.com/#organization",
    name: "Range of View Studios",
    alternateName: "ROV Studios",
    url: "https://www.rovstudios.com",
    logo: "https://www.rovstudios.com/rov-logo.webp",
    description:
      "Creative production agency specializing in sound engineering, web development, video production, and AI automation.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Atlanta",
      addressRegion: "GA",
      addressCountry: "US",
    },
    sameAs: [
      "https://www.instagram.com/rangeofviewstudios/",
      "https://www.linkedin.com/company/range-of-view-studios/",
      "https://discord.gg/GfzXdmu",
      "https://www.reddit.com/user/rangeofviewstudios/",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "rangeofview@rovstudios.com",
      contactType: "customer service",
      url: "https://calendly.com/rangeofviewmusic/30min",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
