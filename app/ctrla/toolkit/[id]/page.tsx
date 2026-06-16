import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { toolkitSections } from "../../data";
import ToolkitPageContent from "./ToolkitPageContent";

export function generateStaticParams() {
  return toolkitSections.map((s) => ({ id: s.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const section = toolkitSections.find((s) => s.id === params.id);
  if (!section) return { title: "Toolkit — CTRL A" };
  return {
    title: `${section.title} Toolkit — CTRL A`,
    description: section.intro,
    alternates: { canonical: `https://www.rovstudios.com/ctrla/toolkit/${section.id}` },
  };
}

export default function ToolkitPage({ params }: { params: { id: string } }) {
  const section = toolkitSections.find((s) => s.id === params.id);
  if (!section) notFound();
  return <ToolkitPageContent id={params.id} />;
}
