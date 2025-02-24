"use client";

import { useEffect, useState } from "react";

interface NavigationDockProps {
  className?: string; // Add className prop
}

export function NavigationDock({ className }: NavigationDockProps) {
  const [isVisible, setIsVisible] = useState(false);

  const links = [
    { title: "home", to: "hero" },
    { title: "mixes", to: "latest-album" },
    { title: "services", to: "services" },
    { title: "gallery", to: "digi-mag" },
    // Removed the commented-out object to prevent issues
  ];

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      window.scrollTo({
        top: section.offsetTop,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById("hero");
      if (heroSection) {
        const heroRect = heroSection.getBoundingClientRect();
        if (heroRect.bottom <= 0) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      }

      const footer = document.querySelector("footer");
      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        if (footerRect.top <= window.innerHeight) {
          setIsVisible(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 z-50 max-w-[90%] md:max-w-none transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0"} ${className || ""}`} // Apply className prop
    >
      <nav className="flex items-center space-x-2 justify-center">
        {links.map((link, index) => (
          <div key={link.title} className="flex items-center">
            <button
              onClick={() => link.to && scrollToSection(link.to)}
              className="px-2 py-1 text-white/80 hover:text-white transition-colors cursor-pointer text-[10px] md:text-sm uppercase tracking-wide"
              style={{ fontFamily: "Flight Maybe Maj, sans-serif" }} // Apply custom font
            >
              {link.title}
            </button>
            {index < links.length - 1 && (
              <span className="text-white/30 hidden md:inline">|</span>
            )}
          </div>
        ))}
      </nav>

      {/* Custom CSS for the font */}
      <style jsx>{`
        @font-face {
          font-family: "Flight Maybe Maj";
          src: url("/fonts/Flight Maybe Maj.ttf") format("truetype");
          font-weight: normal;
          font-style: normal;
        }
      `}</style>
    </div>
  );
}