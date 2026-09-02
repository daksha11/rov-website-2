import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FinishContent from "./FinishContent";
import { FIRST_PIECE, CRAFT_LABEL } from "@/lib/ctrla/path";
import type { CraftSlug } from "@/lib/ctrla/profile";

const CRAFTS: CraftSlug[] = ["music", "design", "web-dev", "video"];

export function generateStaticParams() {
  return CRAFTS.map((craft) => ({ craft }));
}

export function generateMetadata({ params }: { params: { craft: string } }): Metadata {
  const craft = params.craft as CraftSlug;
  if (!CRAFTS.includes(craft)) return {};
  return {
    title: `${FIRST_PIECE[craft].title} · Finish · CTRL-A`,
    description: `The finish line for ${CRAFT_LABEL[craft].toLowerCase()} on CTRL-A: the checklist for your first finished piece, and where to put it when it is done.`,
    robots: { index: false, follow: true },
  };
}

export default function FinishPage({ params }: { params: { craft: string } }) {
  const craft = params.craft as CraftSlug;
  if (!CRAFTS.includes(craft)) notFound();
  return <FinishContent craft={craft} />;
}
