// Client testimonial — renders the visible quote AND its Review structured data
// (itemReviewed -> the case study CreativeWork). Only use with a real, attributed
// client quote. Note: first-party testimonials are valid structured data but are
// not eligible for Google star-rating rich results, so no reviewRating is emitted.

export function Testimonial({
  quote,
  authorName,
  authorTitle,
  itemName,
  itemUrl,
  accentColor = "#EA9A61",
}: {
  quote: string;
  authorName: string;
  authorTitle: string;
  /** Name of the case study / work being reviewed (matches CreativeWorkSchema name). */
  itemName: string;
  /** Path of the case study, e.g. "/casestudy/ikna". */
  itemUrl: string;
  accentColor?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Review",
    reviewBody: quote,
    author: { "@type": "Person", name: authorName },
    itemReviewed: {
      "@type": "CreativeWork",
      name: itemName,
      url: `https://www.rovstudios.com${itemUrl}`,
    },
    publisher: {
      "@type": "Organization",
      name: "Range of View Studios",
      url: "https://www.rovstudios.com",
    },
  };

  return (
    <section className="py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <figure
        className="max-w-3xl mx-auto rounded-3xl px-7 py-10 md:px-12 md:py-14"
        style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${accentColor}40` }}
      >
        <span
          aria-hidden="true"
          className="block text-5xl leading-none mb-2"
          style={{ color: accentColor, fontFamily: "Georgia, serif" }}
        >
          &ldquo;
        </span>
        <blockquote
          className="text-xl md:text-2xl lg:text-3xl leading-relaxed text-white"
          style={{ fontFamily: "Norwige, sans-serif" }}
        >
          {quote}
        </blockquote>
        <figcaption className="mt-6 text-sm md:text-base">
          <span className="font-semibold text-white">{authorName}</span>
          <span className="text-white/60"> &middot; {authorTitle}</span>
        </figcaption>
      </figure>
    </section>
  );
}
