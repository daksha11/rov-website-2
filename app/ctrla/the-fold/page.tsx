import type { Metadata } from "next";
import TheFoldContent from "./TheFoldContent";

export const metadata: Metadata = {
  title: "The Fold — A Room to Work In | CTRL-A",
  description:
    "The Fold is an ambient creative space from CTRL-A by Range of View Studios. Soft social presence, a living stream of sound, and a quiet rhythm that reads the hour. You are not here to be productive. You are here because you belong somewhere.",
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
  return <TheFoldContent />;
}
