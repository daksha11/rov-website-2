// Simple, single-step contact page: name + email + message, posts to the
// shared /api/leads route (emails the team + subscribes to the "ROV web
// leads" Klaviyo list — the website list, not the /card "From Cards" one),
// with a straight-to-booking link for anyone who'd rather just grab time.

import { NavigationDock } from "@/components/sections/NavDoc";
import Footer from "@/components/sections/Footer";
import BlogLeadForm from "@/components/blog/BlogLeadForm";

export default function ContactContent() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section
        style={{
          padding: "clamp(100px, 14vw, 160px) clamp(16px, 5vw, 60px) clamp(56px, 9vw, 110px)",
        }}
      >
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          {/* Topic chips only here. Every other placement already knows what
              the reader came for (the article or service page scopes it), but
              /contact is the one page that catches everyone, so a lead can
              otherwise arrive with no indication of which practice area it
              belongs to. The pick rides into the source tag and the email. */}
          <BlogLeadForm
            theme="dark"
            source="contact"
            heading="Let's talk."
            subheading="Tell us what you're working on. We reply within one business day, usually faster."
            messagePlaceholder="What are you trying to build or fix?"
            topics={["Web", "Video", "AI Automation", "Brand", "Not sure yet"]}
            topicsLabel="What do you need?"
            submitLabel="Send a message instead"
            secondaryHref="https://cal.com/rov-studios-imhphw/15min"
            secondaryLabel="Book a 15-minute call"
            secondaryVariant="primary"
          />
        </div>
      </section>

      <NavigationDock />
      <Footer />
    </main>
  );
}
