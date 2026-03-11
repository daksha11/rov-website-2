import type { Metadata } from "next";
import HomeContent from "./HomeContent";

export const metadata: Metadata = {
  title: "Range of View Studios | Creative Production Agency in Atlanta",
  description:
    "Range of View Studios is an Atlanta-based creative production agency offering sound engineering, web development, video production, and custom AI automation services.",
  alternates: { canonical: "https://rovstudios.com" },
  openGraph: {
    title: "Range of View Studios | Creative Production Agency in Atlanta",
    description:
      "Sound engineering, web development, video production, and AI automation under one roof.",
    url: "https://rovstudios.com",
    images: [{ url: "/og/og-home.jpg", width: 1200, height: 630, alt: "Range of View Studios homepage" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Range of View Studios | Creative Production Agency in Atlanta",
    description:
      "Sound engineering, web development, video production, and AI automation under one roof.",
    images: ["/og/og-home.jpg"],
  },
};

export default function Home() {
  return <HomeContent />;
}
