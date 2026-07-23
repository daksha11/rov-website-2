"use client";

// Closing lead form for the service landing pages (/web, /video-production,
// /ai-automation). Sits after the FAQ, before the footer — the moment a
// visitor has read pricing + process and is deciding. Dark espresso theme to
// match the black service pages. The page already scopes the service, so no
// chips: the source tag carries it (e.g. services:web).

import BlogLeadForm from "@/components/blog/BlogLeadForm";

type Props = {
  source: string;
  heading: string;
  subheading: string;
  messagePlaceholder?: string;
  submitLabel?: string;
};

export default function ServiceLeadSection({
  source,
  heading,
  subheading,
  messagePlaceholder,
  submitLabel = "Start the conversation",
}: Props) {
  return (
    <section
      style={{
        background: "#000",
        padding: "clamp(40px, 7vw, 88px) clamp(16px, 5vw, 60px)",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <BlogLeadForm
          theme="dark"
          source={source}
          heading={heading}
          subheading={subheading}
          messagePlaceholder={messagePlaceholder}
          submitLabel={submitLabel}
          secondaryHref="https://calendly.com/rangeofviewmusic/30min"
          secondaryLabel="Prefer to talk? Book a free call"
        />
      </div>
    </section>
  );
}
