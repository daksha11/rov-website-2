import type { Metadata } from "next";
import CookbookPageContent from "./CookbookPageContent";

export const metadata: Metadata = {
  title: "The Galley — Recipes and Kitchen Science for Creatives | CTRL-A",
  description:
    "The galley from CTRL-A by Range of View Studios. A fridge in the void with one meal, one snack, one drink, plus the kitchen science underneath: how emulsions work, the Maillard reaction, when to salt, why pasta water thickens sauce, and what acid actually does.",
  keywords: [
    "easy recipes for creatives",
    "cheap fast meals",
    "cookbook for makers",
    "food science basics",
    "how does an emulsion work",
    "Maillard reaction explained",
    "when to salt meat",
    "why save pasta water",
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
