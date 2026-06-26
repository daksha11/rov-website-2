import { FAQPageSchema } from "@/components/FAQPageSchema";

// Case-study FAQ — a full-width editorial band matching the testimonial style.
// Emits FAQPage structured data (AEO / featured snippets) AND renders every
// answer in the DOM (always visible, no click-gating) so crawlers and AI answer
// engines can read them. Optionally shows a named project-lead credit (E-E-A-T).

export function CaseStudyFAQ({
  faqs,
  accentColor = "#EA9A61",
  leadName,
  leadRole,
}: {
  faqs: { question: string; answer: string }[];
  accentColor?: string;
  leadName?: string;
  leadRole?: string;
}) {
  if (!faqs.length) return null;

  return (
    <section className="relative bg-black px-6 md:px-12 lg:px-16 pb-20 md:pb-28">
      <FAQPageSchema faqs={faqs} />
      <div className="max-w-4xl mx-auto">
        <div className="pt-12 md:pt-16" style={{ borderTop: `1px solid ${accentColor}33` }}>
          <p
            className="text-[0.6875rem] md:text-xs uppercase mb-8 md:mb-10"
            style={{ fontFamily: "'Roboto', sans-serif", letterSpacing: "0.22em", color: accentColor }}
          >
            Frequently asked
          </p>

          <dl className="space-y-9 md:space-y-10">
            {faqs.map((f) => (
              <div key={f.question}>
                <dt
                  className="text-lg md:text-2xl leading-snug"
                  style={{ fontFamily: "Norwige, sans-serif", color: "#FFF4E3" }}
                >
                  {f.question}
                </dt>
                <dd
                  className="mt-3 text-base md:text-lg leading-relaxed"
                  style={{ fontFamily: "'Roboto', sans-serif", color: "#9ca3af" }}
                >
                  {f.answer}
                </dd>
              </div>
            ))}
          </dl>

          {leadName ? (
            <p
              className="mt-12 text-sm md:text-base"
              style={{ fontFamily: "'Roboto', sans-serif", color: "#9ca3af" }}
            >
              Project led by{" "}
              <a href="/about" className="hover:underline" style={{ color: accentColor }}>
                {leadName}
              </a>
              {leadRole ? `, ${leadRole}` : ""} at Range of View Studios.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
