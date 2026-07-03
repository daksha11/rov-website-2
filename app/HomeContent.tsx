"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Loading from "@/components/Loading";
import HeroWithAnimation from "@/components/HeroWithAnimation";
import Services from "@/components/Services";
import ElevateSection from "@/components/ElevateSection";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import HomeTeamSection from "@/components/HomeTeamSection";
import { NavigationDock } from "@/components/NavDoc";
import ProjectStrip from "@/components/ProjectStrip";

// Lazy load heavy components to reduce initial memory usage
const DigiMag = dynamic(() => import("@/components/DigiMag"), {
  loading: () => <div className="min-h-[800px]" />,
  ssr: false
});

const AlbumCoverLoop = dynamic(() => import("@/components/AlbumCoverLoop"), {
  loading: () => <div className="min-h-[600px]" />,
  ssr: false
});

const albumCovers = [
  { src: "/albums/rov_album_4.webp", alt: "Album Cover 4" },
  { src: "/albums/rov_album_1.webp", alt: "Album Cover 1" },
  { src: "/albums/rov_album_2.webp", alt: "Album Cover 2" },
  { src: "/albums/rov_album_3.webp", alt: "Album Cover 3" },
  { src: "/albums/cover1.webp", alt: "Cover 1" },
  { src: "/albums/cover2.webp", alt: "Cover 2" },
  { src: "/albums/cover3.webp", alt: "Cover 3" },
];

export default function HomeContent() {
  const [isLoading, setIsLoading] = useState(true);

  // Reset scroll on mount (skip if navigating to a hash anchor)
  useEffect(() => {
    if (!window.location.hash) {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
    }
  }, []);

  // Lock scrolling only while the cosmetic loading overlay is visible.
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
    } else {
      document.body.style.overflow = '';
      document.body.style.height = '';
      // After loading finishes, scroll to hash anchor or reset to top
      setTimeout(() => {
        const hash = window.location.hash.slice(1);
        if (hash) {
          const el = document.getElementById(hash);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        } else {
          window.scrollTo(0, 0);
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        }
      }, 100);
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
  }, [isLoading]);

  // Dismiss the overlay once the window has loaded. A hard cap guarantees
  // it can never trap the view (or a crawler) if a resource hangs.
  useEffect(() => {
    const dismiss = () => setIsLoading(false);
    const cap = setTimeout(dismiss, 5000);

    if (document.readyState === "complete") {
      const t = setTimeout(dismiss, 500);
      return () => { clearTimeout(cap); clearTimeout(t); };
    }
    const onLoad = () => setTimeout(dismiss, 300);
    window.addEventListener("load", onLoad);
    return () => {
      clearTimeout(cap);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  useEffect(() => {
    if (!isLoading) {
      window.dispatchEvent(new Event("rov-home-loaded"));
    }
  }, [isLoading]);

  // The real page is ALWAYS rendered into the DOM so crawlers and AI
  // engines get the full content and every internal link. The loading
  // screen is a fixed overlay on top, removed once loading completes.
  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
        <h2 className="sr-only">Range of View Studios — Creative Production Agency in Atlanta</h2>

        <section id="hero-with-animation" style={{ margin: 0, padding: 0 }}>
          <HeroWithAnimation />
        </section>


        <section id="services" style={{ margin: 0, padding: 0 }}>
          <Services />
        </section>

        <ProjectStrip />

        <DigiMag />

        <ElevateSection />

        <HomeTeamSection />

        {/* <div className="py-20">
          <AlbumCoverLoop
            logos={albumCovers}
            speed={100}
            logoHeight={300}
            gap={20}
            direction="left"
          />
        </div> */}

        <Footer />

        <NavigationDock />

        {isLoading && <Loading onLoadingComplete={() => setIsLoading(false)} />}
      </main>
  );
}
