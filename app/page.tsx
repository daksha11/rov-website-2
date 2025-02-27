"use client";

import { useEffect, useState } from "react";
import { createGlobalStyle } from "styled-components";
import Loading from "@/components/Loading";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import MusicPlayer from "@/components/MusicPlayer";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import Gallery from "@/components/Gallery";
import DigiMag from "@/components/DigiMag";
import Carousel from "@/components/Corousel";
import Card from "@/components/Card";
import DesignBreak from "@/components/DesignBreak";
import { NavigationDock } from "@/components/NavDoc";

// Global Styles for Custom Font
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: black;
    color: white;
    overflow-x: hidden;
    min-height: 100vh;
  }
`;

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Improved loading mechanism
    const handleLoad = () => {
      setIsLoading(false);
    };

    // Check if document is already loaded
    if (document.readyState === "complete") {
      setTimeout(() => setIsLoading(false), 500); // Minimum loading time for UX
    } else {
      window.addEventListener("load", handleLoad);
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  // Loading state with better transition
  if (isLoading) {
    return (
      <>
        <GlobalStyle />
        <Loading />
      </>
    );
  }

  return (
    <>
      <GlobalStyle />
      <main className="min-h-screen bg-black text-white">

        <section id="hero">
          <Hero />
        </section>

        <DesignBreak />

        <section id="latest-album">
          <MusicPlayer />
        </section>

        <section id="gallery">
          <Gallery />
        </section>

        {/* <div
          className="bg-[url('/backgroundimage.png')] bg-cover bg-center w-full"
          style={{ 
            height: "100vh",
          }}
        /> */}

        <img src="/backgroundimage.png" alt="Page Tear Image"/>

        <section id="services">
          <Services />
        </section>

        <DigiMag />

        <Card />

        <Carousel />

        <Footer />

        <NavigationDock className={isScrolled ? "scrolled" : ""} />
      </main>
    </>
  );
}