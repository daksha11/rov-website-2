import type { Metadata } from "next";
import CreditsPageContent from "./CreditsPageContent";

export const metadata: Metadata = {
  title: "CTRL-A Credits | Range of View Studios",
  description:
    "Earn CTRL-A credits by following and sharing, then spend them on brand kits, premium downloads, and course chapters. The engagement economy behind CTRL-A by Range of View Studios.",
  alternates: { canonical: "https://www.rovstudios.com/ctrla/credits" },
  robots: { index: false, follow: true },
};

export default function CreditsPage() {
  return <CreditsPageContent />;
}
