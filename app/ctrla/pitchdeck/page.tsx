import type { Metadata } from "next";
import PitchDeckDashboard from "./PitchDeckDashboard";

export const metadata: Metadata = {
    title: "ROV Studios — Market Research Dashboard",
    description: "Interactive pitch deck and market research data visualization for ROV Studios.",
    robots: { index: false, follow: false },
};

export default function PitchDeckPage() {
    return <PitchDeckDashboard />;
}
