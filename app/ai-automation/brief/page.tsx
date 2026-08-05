import type { Metadata } from "next";
import IntakePage from "@/components/intake/IntakePage";
import { getIntakeService } from "@/lib/intake";
import { FLOOR, CEILING, fmt } from "@/lib/pricing";

const service = getIntakeService("ai-automation")!;
const URL = "https://www.rovstudios.com/ai-automation/brief";

export const metadata: Metadata = {
  title: "Automation Brief | Range of View Studios",
  description: `${service.intro.split(". ")[0]}. Five questions, a straight answer, and real numbers: projects run ${fmt(FLOOR)} to ${fmt(CEILING)}.`,
  alternates: { canonical: URL },
  openGraph: {
    title: "Automation Brief | Range of View Studios",
    description: service.intro,
    url: URL,
    siteName: "Range of View Studios",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Automation Brief | Range of View Studios",
    description: service.intro,
  },
};

export default function Page() {
  return <IntakePage service={service} />;
}
