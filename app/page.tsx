"use client";

import { useEffect, useState } from "react";
import { Play, Menu, X, AudioWaveform as Waveform, Palette } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1500);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black">
        <h1 className="text-white text-4xl font-bold animate-pulse">
          RANGE OF VIEW
        </h1>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-black/90 backdrop-blur-sm' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <a href="#" className="text-xl font-bold tracking-wider">
              RANGE OF VIEW
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#services"
                className="text-sm uppercase tracking-wider hover:text-gray-300 transition-colors"
              >
                Services
              </a>
              <a
                href="#music"
                className="text-sm uppercase tracking-wider hover:text-gray-300 transition-colors"
              >
                Music
              </a>
              <a
                href="#store"
                className="text-sm uppercase tracking-wider hover:text-gray-300 transition-colors"
              >
                Store
              </a>
              <button className="px-6 py-2 border border-white rounded-full hover:bg-white hover:text-black transition-colors">
                Latest Release
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          <div
            className={`md:hidden absolute top-20 left-0 right-0 bg-black/95 backdrop-blur-sm transition-all duration-300 ${
              isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
            }`}
          >
            <div className="px-4 py-6 space-y-4">
              <a
                href="#services"
                className="block text-sm uppercase tracking-wider hover:text-gray-300 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Services
              </a>
              <a
                href="#music"
                className="block text-sm uppercase tracking-wider hover:text-gray-300 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Music
              </a>
              <a
                href="#store"
                className="block text-sm uppercase tracking-wider hover:text-gray-300 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Store
              </a>
              <button className="w-full px-6 py-2 border border-white rounded-full hover:bg-white hover:text-black transition-colors">
                Latest Release
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3"
        >
          <source
            src="https://cdn.coverr.co/videos/coverr-a-concert-venue-with-purple-lights-2683/1080p.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black" />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="text-6xl md:text-8xl font-bold mb-8 text-center">
            RANGE OF VIEW
          </h1>
          <button className="group flex items-center gap-2 bg-white text-black px-8 py-3 rounded-full hover:bg-gray-200 transition">
            <Play className="w-5 h-5" />
            <span>Latest Release</span>
          </button>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-black to-zinc-900" id="services">
        <h2 className="text-4xl font-bold mb-16 text-center">OUR SERVICES</h2>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Mixing & Mastering Service */}
          <div className="group relative overflow-hidden rounded-2xl">
            <div className="aspect-square relative">
              <Image
                src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3"
                alt="Studio mixing console"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex items-center gap-3 mb-4">
                <Waveform className="w-8 h-8 text-purple-400" />
                <h3 className="text-2xl font-bold">Mixing & Mastering</h3>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Transform your raw tracks into professional, radio-ready productions. Our state-of-the-art studio and experienced engineers ensure your music sounds its absolute best across all platforms and devices.
              </p>
              <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-full transition-colors">
                Learn More
              </button>
            </div>
          </div>

          {/* Album Art Service */}
          <div className="group relative overflow-hidden rounded-2xl">
            <div className="aspect-square relative">
              <Image
                src="https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?ixlib=rb-4.0.3"
                alt="Album artwork design"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex items-center gap-3 mb-4">
                <Palette className="w-8 h-8 text-teal-400" />
                <h3 className="text-2xl font-bold">Album Artwork</h3>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Make a visual impact with stunning album artwork that captures the essence of your music. Our creative team crafts unique, eye-catching designs that help your release stand out in today's digital landscape.
              </p>
              <button className="px-6 py-2 bg-teal-600 hover:bg-teal-700 rounded-full transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Music Player */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-zinc-900 to-black" id="music">
        <h2 className="text-4xl font-bold mb-12 text-center">FEATURED TRACKS</h2>
        <div className="max-w-4xl mx-auto">
          <iframe
            src="https://open.spotify.com/embed/playlist/6itkDdZEJw54d6ppIlXjgg?utm_source=generator&theme=0"
            width="100%"
            height="500"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="rounded-lg"
          />
        </div>
      </section>

      {/* Latest Album */}
      <section className="py-20 px-4 md:px-8 bg-zinc-900" id="store">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <Image
              src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?ixlib=rb-4.0.3"
              alt="Album Cover"
              width={500}
              height={500}
              className="w-full"
            />
          </div>
          <div className="flex-1 space-y-6">
            <h2 className="text-4xl font-bold">NEW ALBUM OUT NOW</h2>
            <h3 className="text-2xl text-gray-400">Echoes of Tomorrow</h3>
            <p className="text-gray-300">
              Experience our latest album, a journey through sound and emotion.
              Available now on all major platforms.
            </p>
            <div className="flex gap-4">
              <button className="px-8 py-3 bg-white text-black rounded-full hover:bg-gray-200 transition">
                LISTEN NOW
              </button>
              <button className="px-8 py-3 border border-white rounded-full hover:bg-white hover:text-black transition">
                STORE
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 md:px-8 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <h2 className="text-2xl font-bold">RANGE OF VIEW</h2>
            <div className="flex gap-8">
              <a href="#" className="hover:text-gray-400 transition">
                SPOTIFY
              </a>
              <a href="#" className="hover:text-gray-400 transition">
                APPLE MUSIC
              </a>
              <a href="#" className="hover:text-gray-400 transition">
                INSTAGRAM
              </a>
              <a href="#" className="hover:text-gray-400 transition">
                TWITTER
              </a>
            </div>
          </div>
          <div className="mt-12 text-center text-gray-400">
            <p>© 2024 Range of View. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}