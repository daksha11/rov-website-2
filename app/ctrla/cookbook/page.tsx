import type { Metadata } from "next";
import CookbookPageContent from "./CookbookPageContent";

export const metadata: Metadata = {
  title: "The Galley — A Cookbook for Creatives on No Time | CTRL-A",
  description:
    "The galley fridge from CTRL-A by Range of View Studios. A fridge drifting in the void that always holds three things, one meal, one snack, one drink. Real food, few ingredients, done before your render finishes.",
  keywords: [
    "easy recipes for creatives",
    "cheap fast meals",
    "cookbook for makers",
    "CTRL-A",
    "Range of View Studios",
    "Gyeran Bap",
    "quick snack recipes",
  ],
  alternates: { canonical: "https://www.rovstudios.com/ctrla/cookbook" },
  openGraph: {
    title: "The Galley — Fuel for the Work | CTRL-A",
    description:
      "A fridge in the void with three things, always. One meal, one snack, one drink. Pull the handle and pick one.",
    url: "https://www.rovstudios.com/ctrla/cookbook",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Galley — Fuel for the Work | CTRL-A",
    description: "A fridge in the void with three things, always. Pull the handle and pick one.",
  },
};

export default function CookbookPage() {
  return <CookbookPageContent />;
}
