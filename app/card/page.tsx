// app/card/page.tsx
// Business card QR landing. Noindex — this link only exists on printed
// cards, not meant to surface in search.

import type { Metadata } from "next";
import CardIntake from "@/components/sections/CardIntake";

export const metadata: Metadata = {
  title: "Let's continue the conversation",
  robots: { index: false, follow: false },
  // Matches the page's black background so the mobile browser chrome
  // (address bar / status bar) doesn't flash white when this loads straight
  // off a QR scan. Next 13.5's Page type doesn't recognize a separate
  // `viewport` export, so themeColor lives on metadata instead.
  themeColor: "#000000",
};

export default function CardPage() {
  return <CardIntake />;
}
