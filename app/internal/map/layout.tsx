import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "System Map · Internal",
  robots: { index: false, follow: false },
};

export default function InternalMapLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
