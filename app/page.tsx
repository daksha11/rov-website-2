"use client";

import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import MusicPlayer from "@/components/MusicPlayer";
import LatestAlbum from "@/components/LatestAlbum";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import FeaturedArtists from "@/components/FeaturedArtists";
import Gallery from "@/components/Gallery";
import GlassBack from "@/components/GlassComponent";
import Cards from "@/components/Cards";
import { NavigationDock } from "@/components/NavDoc";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1500);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Custom Cursor */}
      <CustomCursor />

      {/* Hero Section */}
      <section id="hero">
        <Hero />
      </section>

      {/* Glass Back */}
      <GlassBack />

      {/* Cards Section */}
      <Cards />
      
      {/* Services Section */}
      <section id="services">
        <Services />
      </section>

      

      {/* Latest Album Section */}
      <section id="latest-album">
        {/* Music Player Section */}
      <MusicPlayer />
      </section>
      <LatestAlbum />
      {/* Featured Artists Section */}
      <section id="featured-artists">
        <FeaturedArtists />
      </section>

      {/* Gallery Section */}
      <section id="gallery">
        <Gallery />
      </section>

      {/* Footer */}
      <Footer />

      {/* Navigation Dock */}
      <NavigationDock />
    </main>
  );
}