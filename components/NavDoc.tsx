"use client";

import { useState } from "react";

export function NavigationDock() {
  const links = [
    { title: "home", to: "hero" },
    { title: "mixes", to: "latest-album" },
    { title: "services", to: "services" },
    { title: "gallery", to: "gallery" },
    { title: "culture", to: "featured-artists" },
  ];

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      window.scrollTo({
        top: section.offsetTop , // Offset for sticky nav
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 z-50">
      <nav className="flex items-center space-x-2">
        {links.map((link, index) => (
          <div key={link.title} className="flex items-center">
            <button
              onClick={() => scrollToSection(link.to)}
              className="px-3 py-1 text-white/80 hover:text-white transition-colors cursor-pointer text-sm uppercase tracking-wider"
            >
              {link.title}
            </button>
            {index < links.length - 1 && (
              <span className="text-white/30">|</span>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}
