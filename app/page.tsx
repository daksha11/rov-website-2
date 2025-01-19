"use client";

import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import Image from "next/image";
import { AudioPlayer } from "@/components/ui/audio-player";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1500);
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
      {/* Hero Section */}
      <section className="relative h-screen">
        <Image
          src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3"
          alt="Band performing"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="text-6xl md:text-8xl font-bold mb-8">RANGE OF VIEW</h1>
          <button className="group flex items-center gap-2 bg-white text-black px-8 py-3 rounded-full hover:bg-gray-200 transition">
            <Play className="w-5 h-5" />
            <span>Latest Release</span>
          </button>
        </div>
      </section>

      {/* Tour Dates */}
      <section className="py-20 px-4 md:px-8">
        <h2 className="text-4xl font-bold mb-12 text-center">TOUR DATES</h2>
        <div className="max-w-4xl mx-auto space-y-6">
          {tourDates.map((date, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-zinc-900 hover:bg-zinc-800 transition cursor-pointer"
            >
              <div>
                <p className="text-xl font-bold">{date.date}</p>
                <p className="text-gray-400">{date.venue}</p>
                <p className="text-gray-400">{date.location}</p>
              </div>
              <button className="mt-4 md:mt-0 px-6 py-2 border border-white rounded-full hover:bg-white hover:text-black transition">
                TICKETS
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Music Player */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-black to-zinc-900">
        <h2 className="text-4xl font-bold mb-12 text-center">FEATURED TRACKS</h2>
        <AudioPlayer tracks={featuredTracks} />
      </section>

      {/* Latest Album */}
      <section className="py-20 px-4 md:px-8 bg-zinc-900">
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

const tourDates = [
  {
    date: "MAY 15, 2024",
    venue: "Madison Square Garden",
    location: "New York, NY",
  },
  {
    date: "MAY 18, 2024",
    venue: "The O2 Arena",
    location: "London, UK",
  },
  {
    date: "MAY 22, 2024",
    venue: "AccorHotels Arena",
    location: "Paris, FR",
  },
  {
    date: "MAY 25, 2024",
    venue: "Mercedes-Benz Arena",
    location: "Berlin, DE",
  },
];

const featuredTracks = [
  {
    title: "Midnight Echoes",
    artist: "Range of View",
    duration: "4:15",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    title: "Urban Dreams",
    artist: "Range of View",
    duration: "3:45",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    title: "Crystal Skies",
    artist: "Range of View",
    duration: "5:02",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  }
];