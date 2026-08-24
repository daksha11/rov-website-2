import type { Metadata } from "next";
import StartContent from "./StartContent";

export const metadata: Metadata = {
  title: "Start Here | CTRL-A by Range of View Studios",
  description:
    "Four questions, about twenty seconds. Tell CTRL-A what you make and how far in you are, and it opens where you actually need it: the right toolkit, the brand kit generator, or the Atlanta scene.",
  alternates: { canonical: "https://www.rovstudios.com/ctrla/start" },
  // A personalization step has nothing to rank for and no content of its
  // own. Keep it out of the index and let /ctrla carry the entrance.
  robots: { index: false, follow: true },
  openGraph: {
    title: "Start Here · CTRL-A",
    description: "Four questions, and CTRL-A opens where you need it.",
    images: ["/og/og-ctrla.png"],
  },
};

export default function CtrlAStartPage() {
  return <StartContent />;
}
