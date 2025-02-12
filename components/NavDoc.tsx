"use client";

import { useEffect, useState } from "react";

export function NavigationDock() {
  const [isVisible, setIsVisible] = useState(false);

  const links = [
    { title: "home", to: "hero" },
    { title: "services", to: "services" },
    { title: "mixes", to: "latest-album" },
    { title: "gallery", to: "digi-mag" },
    {/*{ title: "culture", to: "featured-artists" },*/}
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
        // Check if the hero section is out of view (scrolled past)
        if (heroRect.bottom <= 0) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      }

      // Additional logic to hide the dock when footer is in view
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
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 z-50 max-w-[90%] md:max-w-none transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}
    >
      <nav className="flex items-center space-x-2 justify-center">
        {links.map((link, index) => (
          <div key={link.title} className="flex items-center">
            <button
              onClick={() => scrollToSection(link.to)}
              className="px-2 py-1 text-white/80 hover:text-white transition-colors cursor-pointer text-[10px] md:text-sm uppercase tracking-wide"
            >
              {link.title}
            </button>
            {index < links.length - 2 && (
              <span className="text-white/30 hidden md:inline">|</span>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}