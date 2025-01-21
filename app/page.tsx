"use client";

import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import MusicPlayer from "@/components/MusicPlayer";
import LatestAlbum from "@/components/LatestAlbum";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import FeaturedArtists from "@/components/FeaturedArtists";
import Gallery from "@/components/Gallery";

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

      {/* Navbar */}
      <Navbar isScrolled={isScrolled} />

      {/* Hero Section */}
      <Hero />

      {/* Services Section */}
      <Services />

      {/* Music Player Section */}
      <MusicPlayer />

      {/* Latest Album Section */}
      <LatestAlbum />

      {/* Featured Artists Section */}
      <FeaturedArtists />

      {/* Gallery Section */}
      <Gallery />

      {/* Footer */}
      <Footer />
    </main>
  );
}
