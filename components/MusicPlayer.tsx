export default function MusicPlayer() {
  return (
    <section
      className="py-20 px-4 md:px-8 bg-gradient-to-b from-black to-zinc-900 relative"
      id="music"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255, 255, 255, 0.2) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.2) 1px, transparent 1px)
        `,
        backgroundSize: "150px 150px",
      }}
    >
      {/* Overlay to darken the grid lines */}
      <div className="absolute inset-0 bg-black/50 pointer-events-none"></div>

      <h2 className="text-4xl font-bold mb-12 text-center relative z-10">FEATURED TRACKS</h2>
      <div className="max-w-4xl mx-auto relative z-10">
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
  );
}