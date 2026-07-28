// app/card/page.tsx
// Business card QR landing. Noindex — this link only exists on printed
// cards, not meant to surface in search.

import type { Metadata, Viewport } from "next";
import CardIntake from "@/components/sections/CardIntake";

export const metadata: Metadata = {
  title: "Let's continue the conversation",
  robots: { index: false, follow: false },
};

// Matches the page's black background so the mobile browser chrome
// (address bar / status bar) doesn't flash white when this loads straight
// off a QR scan.
export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function CardPage() {
  return <CardIntake />;
}
