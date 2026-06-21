import type { Metadata } from "next";
import DreamAsiaFeatureContent from "./DreamAsiaFeatureContent";

export const metadata: Metadata = {
  title: "From the Bedroom to the Stage — DreamAsia Fest | CTRL-A",
  description:
    "How a small team produced a multi-city festival headline. Sam Suen headlines DreamAsia Fest across North Carolina and Georgia. The full behind-the-scenes story: fan experience, stage visuals, live sound, and the workflow, from Range of View Studios.",
  keywords: [
    "DreamAsia Fest",
    "Sam Suen",
    "Asian entertainment festival",
    "festival production",
    "behind the scenes festival",
    "Range of View Studios",
    "CTRL A magazine",
  ],
  alternates: { canonical: "https://www.rovstudios.com/ctrla/dreamasia" },
  openGraph: {
    title: "From the Bedroom to the Stage — DreamAsia Fest | CTRL-A",
    description:
      "The behind-the-scenes story of how a small team produced a multi-city festival headline. Sam Suen at DreamAsia Fest, across two states.",
    url: "https://www.rovstudios.com/ctrla/dreamasia",
    images: [{ url: "/ctrla/VOL1/dreamasiacover.webp", width: 1200, height: 630, alt: "Sam Suen mid-set at DreamAsia Fest" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "From the Bedroom to the Stage — DreamAsia Fest | CTRL-A",
    description: "How a small team produced a multi-city festival headline. The full behind-the-scenes story.",
    images: ["/ctrla/VOL1/dreamasiacover.webp"],
  },
};

export default function DreamAsiaFeaturePage() {
  return <DreamAsiaFeatureContent />;
}
