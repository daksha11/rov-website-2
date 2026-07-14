import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Profile · Range of View",
  robots: { index: false, follow: false },
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
