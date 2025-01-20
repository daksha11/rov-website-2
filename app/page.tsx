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
import ArtistCard from "@/components/ArtistCard"; // Import the ArtistCard component

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

      {/* Artist Cards Section */}
      <section style={{ paddingTop: "30px" }}>
        <h2 className="text-3xl font-bold text-center mb-8">Featured Artists</h2>
        <div
          style={{
            display: "flex",
            overflowX: "auto", // Enable horizontal scrolling
            padding: "10px 0", // Add some padding for better spacing
            scrollbarWidth: "none", // Hide scrollbar for a cleaner look (optional)
          }}
        >
          {/* Wrap each ArtistCard in a div with flex: 0 0 auto and add semi-transparent white border */}
          <div style={{ flex: "0 0 33.33%", border: "2px solid rgba(255, 255, 255, 0.2)", overflow: "hidden", marginRight: "-2px" }}>
            <ArtistCard
              imageUrl="/cover1.png"
              name="Gibran Alcocer"
              description="Gibran Alcocer, A Pianist From Mexico, Gaining 5 Million Monthly Listeners On Spotify With His Captivating Melodies, Including His Viral Hit “Idea 10”."
              textPosition="below"
              padding="20px" // Increased padding
            />
          </div>
          <div style={{ flex: "0 0 33.33%", border: "2px solid rgba(255, 255, 255, 0.2)", overflow: "hidden", marginRight: "-2px" }}>
            <ArtistCard
              imageUrl="/cover2.png"
              name="Izzamuzzic"
              description="Vadim Pavlyuchenko, Known Professionally As “Izzamuzzic,” Is An Electronic Music Artist And Accomplished Music Producer Originating From Kazakhstan."
              textPosition="above"
              padding="20px" // Increased padding
            />
          </div>
          <div style={{ flex: "0 0 33.33%", border: "2px solid rgba(255, 255, 255, 0.2)", overflow: "hidden", marginRight: "-2px" }}>
            <ArtistCard
              imageUrl="/cover1.png"
              name="Gibran Alcocer"
              description="Gibran Alcocer, A Pianist From Mexico, Gaining 5 Million Monthly Listeners On Spotify With His Captivating Melodies, Including His Viral Hit “Idea 10”."
              textPosition="below"
              padding="20px" // Increased padding
            />
          </div>
          <div style={{ flex: "0 0 33.33%", border: "2px solid rgba(255, 255, 255, 0.2)", overflow: "hidden", marginRight: "-2px" }}>
            <ArtistCard
              imageUrl="/cover2.png"
              name="Izzamuzzic"
              description="Vadim Pavlyuchenko, Known Professionally As “Izzamuzzic,” Is An Electronic Music Artist And Accomplished Music Producer Originating From Kazakhstan."
              textPosition="above"
              padding="20px" // Increased padding
            />
          </div>
          <div style={{ flex: "0 0 33.33%", border: "2px solid rgba(255, 255, 255, 0.2)", overflow: "hidden", marginRight: "-2px" }}>
            <ArtistCard
              imageUrl="/cover1.png"
              name="Gibran Alcocer"
              description="Gibran Alcocer, A Pianist From Mexico, Gaining 5 Million Monthly Listeners On Spotify With His Captivating Melodies, Including His Viral Hit “Idea 10”."
              textPosition="below"
              padding="20px" // Increased padding
            />
          </div>
          <div style={{ flex: "0 0 33.33%", border: "2px solid rgba(255, 255, 255, 0.2)", borderRadius: "8px", overflow: "hidden", marginRight: "-2px" }}>
            <ArtistCard
              imageUrl="/cover2.png"
              name="Izzamuzzic"
              description="Vadim Pavlyuchenko, Known Professionally As “Izzamuzzic,” Is An Electronic Music Artist And Accomplished Music Producer Originating From Kazakhstan."
              textPosition="above"
              padding="20px" // Increased padding
            />
          </div>
          {/* Add as many ArtistCard components as you need */}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}