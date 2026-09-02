import type { Metadata } from "next";

// Internal. Vue answers from the studio's own notes, so this route stays out
// of search whatever else happens to it.
export const metadata: Metadata = {
  title: "Ask Vue",
  robots: { index: false, follow: false },
};

export default function AskLayout({ children }: { children: React.ReactNode }) {
  return children;
}
