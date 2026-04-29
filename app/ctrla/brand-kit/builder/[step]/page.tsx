import { notFound } from "next/navigation";
import BrandInfoStep from "@/components/brand-kit/builder/steps/BrandInfoStep";
import LogoStep from "@/components/brand-kit/builder/steps/LogoStep";
import ColorPaletteStep from "@/components/brand-kit/builder/steps/ColorPaletteStep";
import TypographyStep from "@/components/brand-kit/builder/steps/TypographyStep";
import GradientsStep from "@/components/brand-kit/builder/steps/GradientsStep";
import BrandVoiceStep from "@/components/brand-kit/builder/steps/BrandVoiceStep";
import SectionsConfigStep from "@/components/brand-kit/builder/steps/SectionsConfigStep";
import ExportStep from "@/components/brand-kit/builder/steps/ExportStep";

const STEPS: Record<string, React.ComponentType> = {
  "brand-info": BrandInfoStep,
  "logo": LogoStep,
  "colors": ColorPaletteStep,
  "typography": TypographyStep,
  "gradients": GradientsStep,
  "voice": BrandVoiceStep,
  "sections": SectionsConfigStep,
  "export": ExportStep,
};

export default function BrandKitStepPage({
  params,
}: {
  params: { step: string };
}) {
  const StepComponent = STEPS[params.step];
  if (!StepComponent) notFound();
  return <StepComponent />;
}

export function generateStaticParams() {
  return Object.keys(STEPS).map((step) => ({ step }));
}
