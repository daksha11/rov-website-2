import type { Metadata } from "next";
import WorksContent from "./WorksContent";

export const metadata: Metadata = {
  // Title template in app/layout.tsx appends " | Range of View Studios", so keep
  // this short to avoid the brand name appearing twice.
  title: "Our Work",
  description:
    "The full portfolio of websites, brands, and digital experiences built by Range of View Studios.",
  // Self-reference the canonical. Without this, the page inherits the global
  // default canonical (the homepage) set in app/layout.tsx, which tells search
  // engines /works is a duplicate of / and prevents it ranking on its own.
  alternates: { canonical: "https://www.rovstudios.com/works" },
};

export default function WorksPage() {
  return <WorksContent />;
}
