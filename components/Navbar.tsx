import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";

interface NavbarProps {
  isScrolled: boolean;
}

export default function Navbar({ isScrolled }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);

  // Function to handle smooth scrolling
  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false); // Close mobile menu after clicking a link
  };

  const services = [
    { name: "Web Optimization", path: "/web" },
    { name: "Sound Engineering", path: "/sound" },
    { name: "Video Production", path: "/video-production" },
    { name: "AI Solutions", path: "/ai-automation" },
  ];

  return (
    <>
      {/* Navbar Component */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? "bg-black/90 backdrop-blur-sm" : "bg-transparent"
          } transform translate-y-[-100%] opacity-0 animate-navbar`}
        style={{ fontFamily: 'Norwige, sans-serif' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo/Link to Hero Section */}
            <a
              href="#hero"
              className="text-xl font-bold tracking-widest"
              onClick={(e) => {
                e.preventDefault();
                handleScroll("hero"); // Scroll to the hero section
              }}
            >
              RANGE OF VIEW
            </a>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {/* Services Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsServicesDropdownOpen(true)}
                onMouseLeave={() => setIsServicesDropdownOpen(false)}
              >
                <button className="flex items-center gap-1 text-sm uppercase tracking-widest hover:text-gray-300 transition-colors">
                  Services
                  <ChevronDown className={`w-4 h-4 transition-transform ${isServicesDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isServicesDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-black/95 backdrop-blur-sm border border-white/20 rounded-lg overflow-hidden">
                    {services.map((service) => (
                      <Link
                        key={service.path}
                        href={service.path}
                        className="block px-4 py-3 text-sm tracking-wide hover:bg-white/10 transition-colors"
                      >
                        {service.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <a
                href="#music"
                className="text-sm uppercase tracking-widest hover:text-gray-300 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  handleScroll("music"); // Scroll to the music section
                }}
              >
                Music
              </a>
              <a
                href="#store"
                className="text-sm uppercase tracking-widest hover:text-gray-300 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  handleScroll("store"); // Scroll to the store section
                }}
              >
                Store
              </a>
              <button
                className="px-6 py-2 border border-white rounded-full hover:bg-white hover:text-black transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  handleScroll("latest-album"); // Scroll to the latest album section
                }}
              >
                Latest Release
              </button>
            </div>

            {/* Mobile Menu Toggle Button */}
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

          {/* Mobile Menu */}
          <div
            className={`md:hidden absolute top-20 left-0 right-0 bg-black/95 backdrop-blur-sm transition-all duration-300 ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
              }`}
          >
            <div className="px-4 py-6 space-y-4">
              {/* Services with expandable submenu */}
              <div>
                <button
                  className="flex items-center gap-1 text-sm uppercase tracking-widest hover:text-gray-300 transition-colors w-full"
                  onClick={() => setIsServicesDropdownOpen(!isServicesDropdownOpen)}
                >
                  Services
                  <ChevronDown className={`w-4 h-4 transition-transform ${isServicesDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isServicesDropdownOpen && (
                  <div className="pl-4 mt-2 space-y-2">
                    {services.map((service) => (
                      <Link
                        key={service.path}
                        href={service.path}
                        className="block text-sm tracking-wide hover:text-gray-300 transition-colors py-1"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {service.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <a
                href="#music"
                className="block text-sm uppercase tracking-widest hover:text-gray-300 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  handleScroll("music"); // Scroll to the music section
                }}
              >
                Music
              </a>
              <a
                href="#store"
                className="block text-sm uppercase tracking-widest hover:text-gray-300 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  handleScroll("store"); // Scroll to the store section
                }}
              >
                Store
              </a>
              <button
                className="w-full px-6 py-2 border border-white rounded-full hover:bg-white hover:text-black transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  handleScroll("latest-album"); // Scroll to the latest album section
                }}
              >
                Latest Release
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* CSS for animation */}
      <style jsx>{`
        @keyframes navbar-animation {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-navbar {
          animation: navbar-animation 1s ease-out forwards;
        }
      `}</style>
    </>
  );
}
