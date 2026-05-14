import type { Metadata } from "next";
import WorksContent from "./WorksContent";

export const metadata: Metadata = {
  title: "Our Work | Range of View Studios",
  description:
    "The full portfolio of websites, brands, and digital experiences built by Range of View Studios.",
};

export default function WorksPage() {
  return <WorksContent />;
}
