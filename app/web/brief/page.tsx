// /web/brief — now the shared intake quiz rather than a bespoke web-only form.
//
// The old three-screen ProjectBriefForm asked budget in bands that went to
// $20,000+, which contradicts the $10,000 cap, and carried its own hardcoded
// price copy in scopeRead(). Both are gone: the quiz diagnoses which of the
// five moments are leaking and reads the tier and the real numbers from
// lib/pricing.ts, so this page can no longer drift from /pricing.

import type { Metadata } from "next";
import IntakePage from "@/components/intake/IntakePage";
import { getIntakeService } from "@/lib/intake";
import { FLOOR, CEILING, fmt } from "@/lib/pricing";

const service = getIntakeService("web")!;
const URL = "https://www.rovstudios.com/web/brief";

export const metadata: Metadata = {
  title: "Project Brief | Web Design & Development",
  description: `Paste your link and answer five questions. We read your site, show you which moments are losing customers, and tell you what fixing them costs. Projects run ${fmt(
    FLOOR
  )} to ${fmt(CEILING)}.`,
  alternates: { canonical: URL },
  openGraph: {
    title: "Project Brief | Range of View Studios",
    description:
      "Five questions and your link. We show you which moments are leaking and what it costs to fix them, before we ask for anything.",
    url: URL,
    images: [{ url: "/og/og-web.webp", width: 1200, height: 630, alt: "ROV Studios web development" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Project Brief | Range of View Studios",
    description: "Five questions. We show you what's leaking and what it costs to fix.",
    images: ["/og/og-web.webp"],
  },
};

export default function WebBriefPage() {
  return <IntakePage service={service} />;
}
