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
import Cards from "@/components/Card";
import { NavigationDock } from "@/components/NavDoc";
import DigiMag from "@/components/DigiMag";
import Carousel from "@/components/Corousel";
import Card from "@/components/Card";
import DesignBreak from "@/components/DesignBreak";
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

      <Card />
      
      {/* Services Section */}
      <section id="services">
        <Services />
      </section>

      
      <div className="bg-[url('/backgroundimage.jpg')] bg-cover bg-center" style={{height: "100vh"}}></div>
      {/* Latest Album Section */}
      <section id="latest-album">
        {/* Music Player Section */}
      <MusicPlayer />
      </section>
      {/*<LatestAlbum />*/}
      <DesignBreak />
      {/* Cards Section */}
      {/* Featured Artists Section */}
      <section id="featured-artists">
        <FeaturedArtists />
      </section>

      {/* Gallery Section */}
      <section id="gallery">
        <Gallery />
      </section>
      <DigiMag />
      <Carousel />
      {/* Footer */}
      <Footer />
      {/* Navigation Dock */}
      <NavigationDock />
    </main>
  );
}