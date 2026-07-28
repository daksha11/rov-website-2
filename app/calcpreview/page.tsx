// Temporary local-only preview of the estimator result screen. Delete after QA.
import { getIndustryBySlug } from "@/lib/industries";
import IndustryCalculator from "@/components/industries/IndustryCalculator";

export default async function CalcPreview() {
  const page = await getIndustryBySlug("beltline-atlanta");
  if (!page?.calculator) return <div style={{ color: "#fff" }}>no calculator</div>;
  return (
    <main style={{ background: "#000", minHeight: "100vh", paddingTop: 40 }}>
      <IndustryCalculator calculator={page.calculator} icpSlug={page.slug} />
    </main>
  );
}
