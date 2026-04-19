"use client";

import { Instagram, Linkedin, Mail, X } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import GoogleLoginButton from "@/components/GoogleLoginButton";

interface NavigationDockProps {
  className?: string;
}

export function NavigationDock({ className }: NavigationDockProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { title: "home", to: "/", isLink: true },
    { title: "services", to: null, isLink: false },
    { title: "contact us", to: "https://calendly.com/rangeofviewmusic/30min", isLink: true, external: true },
  ];

  useEffect(() => {
    if (!menuOpen && !modalOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [menuOpen, modalOpen]);

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      const yOffset = 0; // Adjust if you need offset from top
      const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <div
        className={`nav-dock-font fixed bottom-6 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-8 py-2.5 rounded-full border border-white/10 z-[999] max-w-[90%] md:max-w-none transition-opacity duration-500 group ${className || ""}`}
      >
        {/* Shimmer effect covering entire nav container */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 overflow-hidden rounded-full">
          <div className="shimmer-effect"></div>
        </div>

        <nav className="flex items-center space-x-0.5 md:space-x-2.5 justify-center relative z-10 w-full">
          {links.map((link, index) => (
            <div key={link.title} className="flex items-center">
              {link.isLink ? (
                <Link
                  href={link.to || "#"}
                  className="px-1.5 py-1.5 text-white/80 hover:text-white transition-colors cursor-pointer text-[10px] sm:text-[13px] md:text-[17px] uppercase tracking-wide whitespace-nowrap"
                  {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {link.title}
                </Link>
              ) : (
                <button
                  onClick={() => link.title === "services" ? setMenuOpen(true) : (link.to ? scrollToSection(link.to) : setModalOpen(true))}
                  className="px-1.5 py-1.5 text-white/80 hover:text-white transition-colors cursor-pointer text-[10px] sm:text-[13px] md:text-[17px] uppercase tracking-wide whitespace-nowrap"
                >
                  {link.title}
                </button>
              )}
              {index < links.length - 1 && (
                <span className="text-white/30 text-[10px] md:text-base mx-0.5">|</span>
              )}
            </div>
          ))}

          {/* Login */}
          <div className="flex items-center">
            <span className="text-white/30 text-[10px] md:text-base mx-0.5">|</span>
            <GoogleLoginButton />
          </div>
        </nav>

      </div>

      {/* Expanded Menu Glass Pane */}
      <div
        className={`nav-dock-font fixed bottom-20 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md rounded-3xl border border-white/10 z-[998] overflow-hidden transition-all duration-500 ease-in-out ${menuOpen
          ? "w-[90%] md:w-[600px] h-[400px] opacity-100 scale-100"
          : "w-0 h-0 opacity-0 scale-95"
          }`}
      >
        <div className={`p-8 transition-opacity duration-300 ${menuOpen ? "opacity-100 delay-200" : "opacity-0"}`}>
          {/* Close Button */}
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Menu Content */}
          <div className="flex flex-col items-center justify-center h-full">
            <h2
              className="text-white/60 text-sm md:text-base uppercase tracking-widest mb-8"
            >
              R.O.V Services
            </h2>


            <ul className="space-y-4 w-full max-w-md">
              <li>
                <Link
                  href="/sound"
                  className="block px-6 py-3 text-white/80 hover:text-white text-base md:text-lg transition-all hover:bg-white/5 rounded-xl border border-transparent hover:border-white/10 text-center"
    
                  onClick={() => setMenuOpen(false)}
                >
                  Sound Engineering
                </Link>
              </li>
              <li>
                <Link
                  href="/web"
                  className="block px-6 py-3 text-white/80 hover:text-white text-base md:text-lg transition-all hover:bg-white/5 rounded-xl border border-transparent hover:border-white/10 text-center"
    
                  onClick={() => setMenuOpen(false)}
                >
                  Web Development
                </Link>
              </li>
              <li>
                <Link
                  href="/video-production"
                  className="block px-6 py-3 text-white/80 hover:text-white text-base md:text-lg transition-all hover:bg-white/5 rounded-xl border border-transparent hover:border-white/10 text-center"
    
                  onClick={() => setMenuOpen(false)}
                >
                  Media Production
                </Link>
              </li>
              <li>
                <Link
                  href="/ai-automation"
                  className="block px-6 py-3 text-white/80 hover:text-white text-base md:text-lg transition-all hover:bg-white/5 rounded-xl border border-transparent hover:border-white/10 text-center"
    
                  onClick={() => setMenuOpen(false)}
                >
                  AI Solutions
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modal with consistent font */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[1000]">
          <div
            className="nav-dock-font bg-black/50 backdrop-blur-md text-white p-8 rounded-3xl shadow-lg text-center w-96 relative border border-white/10 md:w-96 sm:w-full sm:p-6"
          >
            <button
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
              onClick={() => setModalOpen(false)}
              aria-label="Close contact modal"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-bold mb-6 text-white/90">Contact Us</h3>
            <div className="flex flex-col gap-4">
              <a
                href="mailto:rangeofview@rovstudios.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 bg-white/5 backdrop-blur-sm rounded-2xl hover:bg-white/10 border border-white/10 transition-all"
              >
                <Mail className="w-5 h-5 text-white" />
                <span className="text-white/80">Email</span>
              </a>
              <a
                href="https://www.instagram.com/rangeofviewstudios/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 bg-white/5 backdrop-blur-sm rounded-2xl hover:bg-white/10 border border-white/10 transition-all"
              >
                <Instagram className="w-5 h-5 text-pink-400" />
                <span className="text-white/80">Instagram</span>
              </a>
              <a
                href="https://www.linkedin.com/company/range-of-view-studios/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 bg-white/5 backdrop-blur-sm rounded-2xl hover:bg-white/10 border border-white/10 transition-all"
              >
                <Linkedin className="w-5 h-5 text-blue-400" />
                <span className="text-white/80">LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
