import BlogLeadForm from "@/components/blog/BlogLeadForm";

// Generic end-of-article lead form for markdown-based blog posts (the
// app/blog/[slug] template). Custom design-standard pages call BlogLeadForm
// directly with topic-tuned copy; this wraps it with a sensible default and
// tags the lead with the post slug so you know which article generated it.
// The music blog runs the same template against a different offer, so the copy
// is overridable. Defaults are unchanged, which keeps every studios post as-is.
export function BlogPostCTA({
  slug,
  sourcePrefix = "blog",
  heading = "Want to know where your business is leaking revenue?",
  subheading = "We run free audits for Atlanta businesses. Tell us where to look and we'll show you exactly what to fix.",
  messagePlaceholder = "Your business, your website, and what you're trying to fix...",
  secondaryHref = "https://cal.com/rov-studios-imhphw/15min",
  secondaryLabel = "Prefer to talk? Book a free audit call",
}: {
  slug?: string;
  sourcePrefix?: string;
  heading?: string;
  subheading?: string;
  messagePlaceholder?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <section style={{ background: "#FFF4E3", padding: "16px 24px 80px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <BlogLeadForm
          source={slug ? `${sourcePrefix}:${slug}` : `${sourcePrefix}:post`}
          heading={heading}
          subheading={subheading}
          messagePlaceholder={messagePlaceholder}
          secondaryHref={secondaryHref}
          secondaryLabel={secondaryLabel}
        />
      </div>
    </section>
  );
}
