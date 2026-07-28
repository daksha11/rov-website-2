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
          <BlogLeadForm
            theme="dark"
            source="contact"
            heading="Let's talk."
            subheading="Tell us what you're working on. We reply within one business day, usually faster."
            messagePlaceholder="What are you trying to build or fix?"
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
