import { useState } from "react";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  isScrolled: boolean;
}

export default function Navbar({ isScrolled }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Function to handle smooth scrolling
  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false); // Close mobile menu after clicking a link
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/90 backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo/Link to Hero Section */}
          <a
            href="#hero"
            className="text-xl font-bold tracking-wider"
            onClick={(e) => {
              e.preventDefault();
              handleScroll("hero"); // Scroll to the hero section
            }}
          >
            RANGE OF VIEW
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#services"
              className="text-sm uppercase tracking-wider hover:text-gray-300 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                handleScroll("services"); // Scroll to the services section
              }}
            >
              Services
            </a>
            <a
              href="#music"
              className="text-sm uppercase tracking-wider hover:text-gray-300 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                handleScroll("music"); // Scroll to the music section
              }}
            >
              Music
            </a>
            <a
              href="#store"
              className="text-sm uppercase tracking-wider hover:text-gray-300 transition-colors"
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
          className={`md:hidden absolute top-20 left-0 right-0 bg-black/95 backdrop-blur-sm transition-all duration-300 ${
            isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <div className="px-4 py-6 space-y-4">
            <a
              href="#services"
              className="block text-sm uppercase tracking-wider hover:text-gray-300 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                handleScroll("services"); // Scroll to the services section
              }}
            >
              Services
            </a>
            <a
              href="#music"
              className="block text-sm uppercase tracking-wider hover:text-gray-300 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                handleScroll("music"); // Scroll to the music section
              }}
            >
              Music
            </a>
            <a
              href="#store"
              className="block text-sm uppercase tracking-wider hover:text-gray-300 transition-colors"
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
  );
}