import Image from "next/image";

export default function LatestAlbum() {
  return (
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
  );
}