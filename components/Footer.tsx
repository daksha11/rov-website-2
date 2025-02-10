import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      window.scrollTo({
        top: section.offsetTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <footer className="pt-24 pb-12 px-4 md:px-8 bg-black">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
          {/* Logo Column - First Third */}
          <div className="flex justify-center md:justify-start items-center">
            <Image
              src="/rov-logo.png"
              alt="ROV Logo"
              width={300}
              height={200}
              className="object-contain"
            />
          </div>

          {/* Empty Middle Column */}
          <div></div>

          {/* Navigation Columns - Last Third */}
          <div className="grid grid-cols-2 gap-8 md:gap-12">
            {/* Explore Column */}
            <div>
              <h3 className="text-gray-400 mb-6 text-center md:text-left text-2xl">Explore</h3>
              <nav className="flex flex-col space-y-4 items-center md:items-start">
                <button
                  onClick={() => scrollToSection("hero")}
                  className="hover:text-gray-400 transition duration-300 text-lg cursor-pointer"
                >
                  Home
                </button>
                <button
                  onClick={() => scrollToSection("services")}
                  className="hover:text-gray-400 transition duration-300 text-lg cursor-pointer"
                >
                  Services
                </button>
                <button
                  onClick={() => scrollToSection("featured-artists")}
                  className="hover:text-gray-400 transition duration-300 text-lg cursor-pointer"
                >
                  Artists
                </button>
              </nav>
            </div>

            {/* Follow Column */}
            <div>
              <h3 className="text-gray-400 mb-6 text-center md:text-left text-2xl">Reach Us</h3>
              <nav className="flex flex-col space-y-4 items-center md:items-start">
                <div className="relative group">
                  <div className="hover:text-gray-400 transition duration-300 text-lg cursor-pointer">
                    Email
                  </div>
                  {/* Mobile-responsive tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 md:px-3 py-1 md:py-2 bg-gray-800 text-white text-xs md:text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-normal md:whitespace-nowrap w-auto max-w-[200px] md:max-w-none text-center break-words md:break-normal">
                    rangeofviewmusic@gmail.com
                  </div>
                </div>
                <a href="https://www.instagram.com/rangeofviewmusic/?hl=en" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition duration-300 text-lg">
                  Instagram
                </a>
                <a href="https://www.linkedin.com/company/range-of-view-music/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition duration-300 text-lg">
                  LinkedIn
                </a>
              </nav>
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="pt-8 border-t border-gray-800">
          <p className="text-gray-400 text-center">© {currentYear} Range of View. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}