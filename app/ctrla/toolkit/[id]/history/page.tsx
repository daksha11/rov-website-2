import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { toolkitSections } from "../../../data";
import ToolkitHistoryContent from "./ToolkitHistoryContent";

export function generateStaticParams() {
  return toolkitSections.filter((s) => s.history).map((s) => ({ id: s.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const section = toolkitSections.find((s) => s.id === params.id);
  if (!section?.history) return { title: "A History — CTRL A" };
  return {
    title: `${section.title}: A History — CTRL A`,
    description: section.history.lede,
    alternates: { canonical: `https://www.rovstudios.com/ctrla/toolkit/${section.id}/history` },
  };
}

export default function ToolkitHistoryPage({ params }: { params: { id: string } }) {
  const section = toolkitSections.find((s) => s.id === params.id);
  if (!section?.history) notFound();
  return <ToolkitHistoryContent id={params.id} />;
}
