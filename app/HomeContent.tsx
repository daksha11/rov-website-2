"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Loading from "@/components/Loading";
import HeroWithAnimation from "@/components/HeroWithAnimation";
import Services from "@/components/Services";
import ElevateSection from "@/components/ElevateSection";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import TeamSection from "@/components/TeamSection";
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
  { src: "/rov_album_4.webp", alt: "Album Cover 4" },
  { src: "/rov_album_1.webp", alt: "Album Cover 1" },
  { src: "/rov_album_2.webp", alt: "Album Cover 2" },
  { src: "/rov_album_3.webp", alt: "Album Cover 3" },
  { src: "/cover1.webp", alt: "Cover 1" },
  { src: "/cover2.webp", alt: "Cover 2" },
  { src: "/cover3.webp", alt: "Cover 3" },
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

  useEffect(() => {
    // Prevent scrolling during loading
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

    const handleLoad = () => {
      setIsLoading(false);
    };

    if (document.readyState === "complete") {
      // Page already loaded — show content after brief transition
      setTimeout(() => setIsLoading(false), 500);
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => {
      window.removeEventListener("load", handleLoad);
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading) {
      window.dispatchEvent(new Event("rov-home-loaded"));
    }
  }, [isLoading]);

  if (isLoading) {
    return <Loading />;
  }

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

        <TeamSection />

        <div className="py-20">
          <AlbumCoverLoop
            logos={albumCovers}
            speed={100}
            logoHeight={300}
            gap={20}
            direction="left"
          />
        </div>

        <Footer />

        <NavigationDock />
      </main>
  );
}
