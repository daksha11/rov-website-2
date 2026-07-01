import type { Metadata } from "next";
import TheFoldBelt from "./_components/TheFoldBelt";

export const metadata: Metadata = {
  title: "Vantage — A Cosmos of Working States | CTRL-A",
  description:
    "Vantage is a focus space from CTRL-A by Range of View Studios. Fly between five worlds, each with its own light, sound, and pace: Launchpad to start, The Drift to go wide, Full Burn to ship, Slow Orbit to wind down, Deep Field to go heads down. Scroll to travel, land where your head is, and work.",
  keywords: [
    "ambient focus space",
    "deep work space",
    "flow state",
    "creative focus",
    "CTRL-A",
    "Range of View Studios",
    "lofi focus",
    "pomodoro focus timer",
  ],
  alternates: { canonical: "https://www.rovstudios.com/ctrla/the-fold" },
  openGraph: {
    title: "Vantage — A Cosmos of Working States | CTRL-A",
    description:
      "Fly between five worlds, each with its own light, sound, and pace. Scroll to travel, land where your head is, and work.",
    url: "https://www.rovstudios.com/ctrla/the-fold",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vantage — A Cosmos of Working States | CTRL-A",
    description:
      "A focus space from CTRL-A. Five worlds, each with its own light, sound, and pace. Land where your head is.",
  },
};

export default function TheFoldPage() {
  return <TheFoldBelt />;
}
