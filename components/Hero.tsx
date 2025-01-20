import { Play } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative h-screen overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        poster="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3"
      >
        <source src="https://cdn.coverr.co/videos/coverr-a-concert-venue-with-purple-lights-2683/1080p.mp4" type="video/mp4" />
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
  );
}