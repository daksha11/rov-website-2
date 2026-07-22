import type { Metadata } from "next";
import ATLPageContent from "./ATLPageContent";

export const metadata: Metadata = {
  title: "ATL Community — A Field Guide for Young Atlanta Creatives | CTRL-A",
  description:
    "Why Atlanta is a creative capital, the events worth leaving the house for, and cheap fuel for the work. A home base for young Atlanta creatives and students, from CTRL-A by Range of View Studios.",
  keywords: [
    "Atlanta creatives",
    "Atlanta creative scene",
    "Atlanta creative history",
    "young creatives Atlanta",
    "Atlanta college students",
    "Atlanta events 2026",
    "World Cup 2026 Atlanta",
    "CTRL-A",
    "Range of View Studios",
  ],
  alternates: { canonical: "https://www.rovstudios.com/ctrla/atl" },
  openGraph: {
    title: "ATL Community — For the Ones Coming Up in Atlanta | CTRL-A",
    description:
      "Where the city came from, what is on, and how to eat well on nothing. The local field guide for young Atlanta creatives.",
    url: "https://www.rovstudios.com/ctrla/atl",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ATL Community — For the Ones Coming Up in Atlanta | CTRL-A",
    description:
      "Why Atlanta is a creative capital, what is on, and cheap fuel for the work.",
  },
};

export default function ATLPage() {
  return <ATLPageContent />;
}
