import type { Metadata } from "next";

export const metadata: Metadata = {
  // Flagship tool — allow search + AI crawlers to index it. Inherits the
  // site's canonical/OG defaults; only the robots override is set here.
  robots: { index: true, follow: true },
};

export default function BrandKitLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
