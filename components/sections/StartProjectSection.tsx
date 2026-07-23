"use client";

// Homepage conversion section: the only place on the homepage a visitor can
// actually start a conversation (the rest is case-study links + footer mailto).
// Dark espresso-gradient theme to sit on the black homepage bg. The service
// chips (Web / Video / AI) give us context on what they came for, folded into
// the emailed lead so the reply already knows the ask.

import BlogLeadForm from "@/components/blog/BlogLeadForm";

export default function StartProjectSection() {
  return (
    <section
      id="start-project"
      style={{
        background: "#000",
        padding: "clamp(48px, 8vw, 96px) clamp(16px, 5vw, 60px)",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <BlogLeadForm
          theme="dark"
          source="home:start-project"
          heading="Have something in mind? Let's build it."
          subheading="Tell us what you're working on. We'll tell you honestly whether we're the right studio for it, what it would take, and roughly what it costs. No pitch deck, just a conversation."
          topics={["Web", "Video", "AI Automation", "Not sure yet"]}
          topicsLabel="What do you need?"
          messagePlaceholder="What you're building, your rough timeline, and anything else we should know..."
          submitLabel="Start the conversation"
          secondaryHref="https://calendly.com/rangeofviewmusic/30min"
          secondaryLabel="Prefer to talk? Book a free call"
        />
      </div>
    </section>
  );
}
