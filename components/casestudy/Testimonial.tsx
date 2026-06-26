// Client testimonial — a full-width editorial closing band that matches the
// case-study design language (Norwige display, Roboto labels, accent rule).
// Renders the visible quote AND its Review structured data (itemReviewed -> the
// case study). Use only with a real, attributed client quote. Note: first-party
// testimonials are valid structured data but are not eligible for Google star
// rich results, so no reviewRating is emitted.

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
    <section className="relative bg-black px-6 md:px-12 lg:px-16 pb-20 md:pb-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="max-w-4xl mx-auto">
        <div className="pt-12 md:pt-16" style={{ borderTop: `1px solid ${accentColor}33` }}>
          <p
            className="text-[0.6875rem] md:text-xs uppercase mb-7 md:mb-9"
            style={{ fontFamily: "'Roboto', sans-serif", letterSpacing: "0.22em", color: accentColor }}
          >
            In their words
          </p>

          <figure className="m-0">
            <blockquote className="relative m-0">
              <span
                aria-hidden="true"
                className="absolute -top-8 -left-1 select-none leading-none"
                style={{
                  color: accentColor,
                  opacity: 0.22,
                  fontFamily: "Georgia, serif",
                  fontSize: "clamp(4.5rem, 11vw, 8rem)",
                }}
              >
                &ldquo;
              </span>
              <p
                className="relative text-2xl leading-snug sm:text-3xl md:text-4xl"
                style={{ fontFamily: "Norwige, sans-serif", color: "#FFF4E3" }}
              >
                {quote}
              </p>
            </blockquote>

            <figcaption className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span aria-hidden="true" className="h-px w-8" style={{ backgroundColor: accentColor }} />
              <span
                className="text-base md:text-lg font-semibold"
                style={{ fontFamily: "'Roboto', sans-serif", color: accentColor }}
              >
                {authorName}
              </span>
              <span
                className="text-sm md:text-base"
                style={{ fontFamily: "'Roboto', sans-serif", color: "#9ca3af" }}
              >
                {authorTitle}
              </span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
