import BlogLeadForm from "@/components/blog/BlogLeadForm";

// Generic end-of-article lead form for markdown-based blog posts (the
// app/blog/[slug] template). Custom design-standard pages call BlogLeadForm
// directly with topic-tuned copy; this wraps it with a sensible default and
// tags the lead with the post slug so you know which article generated it.
export function BlogPostCTA({ slug }: { slug?: string }) {
  return (
    <section style={{ background: "#FFF4E3", padding: "16px 24px 80px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <BlogLeadForm
          source={slug ? `blog:${slug}` : "blog:post"}
          heading="Want to know where your business is leaking revenue?"
          subheading="We run free audits for Atlanta businesses. Tell us where to look and we'll show you exactly what to fix."
          messagePlaceholder="Your business, your website, and what you're trying to fix..."
          secondaryHref="https://cal.com/rov-studios-imhphw/15min"
          secondaryLabel="Prefer to talk? Book a free audit call"
        />
      </div>
    </section>
  );
}
