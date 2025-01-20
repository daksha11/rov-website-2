export default function Footer() {
    return (
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
    );
  }