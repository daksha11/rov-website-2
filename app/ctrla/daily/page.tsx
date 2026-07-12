import type { Metadata } from "next";
import DailyPageContent from "./DailyPageContent";

export const metadata: Metadata = {
  title: "The Daily Taste Test | CTRL-A by Range of View Studios",
  description:
    "One judgment call a day. Two options, one is sharper. Pick, see where the room landed, and read why the editors called it. Streaks pay CTRL-A credits.",
  alternates: { canonical: "https://www.rovstudios.com/ctrla/daily" },
  openGraph: {
    title: "The Daily Taste Test · CTRL-A",
    description: "Two options, one is sharper. Is your eye any good?",
    images: ["/api/og/daily"],
  },
};

export default function DailyPage() {
  return <DailyPageContent />;
}
