import { NavigationDock } from "@/components/sections/NavDoc";
import Footer from "@/components/sections/Footer";
import StartProjectSection from "@/components/sections/StartProjectSection";

export default function ContactContent() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div style={{ paddingTop: "clamp(72px, 12vw, 120px)" }}>
        <StartProjectSection />
      </div>

      <NavigationDock />
      <Footer />
    </main>
  );
}
