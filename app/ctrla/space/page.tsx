import type { Metadata } from "next";
import SpaceClient from "./SpaceClient";

// The space view is an alternate door into the magazine, never the canonical
// home of anything. Crawlers can't see inside a canvas, so it stays out of
// the index and every stop links back to a real, indexed page.
export const metadata: Metadata = {
  title: "CTRL·A · Space",
  description: "Fly the CTRL·A system. Every planet is a part of the magazine.",
  robots: { index: false, follow: true },
};

export default function SpacePage() {
  return <SpaceClient />;
}
