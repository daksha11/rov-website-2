import Image from 'next/image'; // Import the Image component from Next.js

export default function Footer() {
  // Get the current year dynamically
  const currentYear = new Date().getFullYear();

  return (
    <footer className="pt-24 pb-12 px-4 md:px-8 bg-black">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
          {/* Logo Column - First Third */}
          <div className="flex justify-center md:justify-start items-center">
            <Image
              src="/rov-logo.png" // Path to the image in the public folder
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
                <a href="#" className="hover:text-gray-400 transition duration-300 text-lg">
                  Home
                </a>
                <a href="#" className="hover:text-gray-400 transition duration-300 text-lg">
                  Artists
                </a>
                <a href="#" className="hover:text-gray-400 transition duration-300 text-lg">
                  Careers
                </a>
              </nav>
            </div>

            {/* Follow Column */}
            <div>
              <h3 className="text-gray-400 mb-6 text-center md:text-left text-2xl">Follow</h3>
              <nav className="flex flex-col space-y-4 items-center md:items-start">
                <a href="#" className="hover:text-gray-400 transition duration-300 text-lg">
                  Twitter
                </a>
                <a href="#" className="hover:text-gray-400 transition duration-300 text-lg">
                  Instagram
                </a>
                <a href="#" className="hover:text-gray-400 transition duration-300 text-lg">
                  Facebook
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