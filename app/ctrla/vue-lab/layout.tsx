import type { Metadata } from "next";

// The lab is a working bench, not a page. Keep it out of search while it is
// still in the tree; delete the route once Vue is settled.
export const metadata: Metadata = {
  title: "Vue lab",
  robots: { index: false, follow: false },
};

export default function VueLabLayout({ children }: { children: React.ReactNode }) {
  return children;
}
