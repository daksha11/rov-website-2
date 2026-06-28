import type { Metadata } from "next";
import TheFoldBelt from "./_components/TheFoldBelt";

export const metadata: Metadata = {
  title: "The Fold — An All-Night Cafe for Creatives | CTRL-A",
  description:
    "The Fold is an ambient cafe from CTRL-A by Range of View Studios. Arrive into the Commons, blend the room's sound, and drift between focus rooms. Soft presence, a living stream, and a window onto a cosmic sunset. You are here because you belong somewhere.",
  keywords: [
    "ambient focus space",
    "creative focus room",
    "body doubling for creatives",
    "CTRL-A",
    "Range of View Studios",
    "lofi focus",
    "coworking ambience",
  ],
  alternates: { canonical: "https://www.rovstudios.com/ctrla/the-fold" },
  openGraph: {
    title: "The Fold — A Room to Work In | CTRL-A",
    description:
      "An ambient creative space. Soft presence, a living stream of sound, a rhythm that reads the hour. You are here because you belong somewhere.",
    url: "https://www.rovstudios.com/ctrla/the-fold",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Fold — A Room to Work In | CTRL-A",
    description:
      "An ambient creative space from CTRL-A. You are here because you belong somewhere.",
  },
};

export default function TheFoldPage() {
  return <TheFoldBelt />;
}
