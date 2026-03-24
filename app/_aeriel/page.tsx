import dynamic from "next/dynamic";
import BookCall from "@/components/aerielPage/BookCall";
import FlightProcess from "@/components/aerielPage/FlightProcess";
import FAQSection from "@/components/aerielPage/VisionFaq";
import VisionImpact from "@/components/aerielPage/VisionImpact";
import MissingSection from "@/components/aerielPage/VisionMixing";
import WhoWeFlyWith from "@/components/aerielPage/WhoWeFlyWith";
import Footer from "@/components/Footer";
import OverlapSection from "@/components/OverlapSection";
import { NavigationDock } from "@/components/NavDoc";

const HeroSection = dynamic(() => import("@/components/aerielPage/HeroSection"), { ssr: false });
const TakeWork = dynamic(() => import("@/components/aerielPage/TakeWork"), { ssr: false });
export default function Page() {
  return (
    <>
      <OverlapSection index={1}>
        <HeroSection />
      </OverlapSection>

      <OverlapSection index={2}>
        <WhoWeFlyWith />
      </OverlapSection>

      <OverlapSection index={3}>
        <FlightProcess />
      </OverlapSection>

      <OverlapSection index={4}>
        <TakeWork />
      </OverlapSection>

      <OverlapSection index={5}>
        <MissingSection />
      </OverlapSection>

      <OverlapSection index={6}>
        <VisionImpact />
      </OverlapSection>

      <OverlapSection index={7}>
        <FAQSection />
      </OverlapSection>

      <OverlapSection index={8} isBook={true}>
        <BookCall />
      </OverlapSection>

      {/* LAST SECTION */}
      <OverlapSection index={9} >
        <Footer />
      </OverlapSection>

      <NavigationDock />
    </>
  );
}