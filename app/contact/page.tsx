import type { Metadata } from "next";
import ContactContent from "./ContactContent";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Range of View Studios. Tell us what you're building — web, video, or AI automation — and we'll follow up within a business day, or grab a 15-minute call directly.",
  alternates: { canonical: "https://www.rovstudios.com/contact" },
  openGraph: {
    title: "Contact | Range of View Studios",
    description: "Tell us what you're building and we'll follow up within a business day, or book a 15-minute call directly.",
    url: "https://www.rovstudios.com/contact",
    images: [{ url: "/og/og-default.webp", width: 1200, height: 630, alt: "Range of View Studios" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact | Range of View Studios",
    description: "Tell us what you're building and we'll follow up within a business day, or book a 15-minute call directly.",
    images: ["/og/og-default.webp"],
  },
};

export default function ContactPage() {
  return (
    <>
      <h1 className="sr-only">Contact Range of View Studios</h1>
      <ContactContent />
    </>
  );
}
