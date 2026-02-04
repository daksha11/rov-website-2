"use client";

import { Instagram, Linkedin, Mail, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

interface NavigationDockProps {
  className?: string;
}

export function NavigationDock({ className }: NavigationDockProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { title: "home", to: "/", isLink: true },
    { title: "services", to: "/#services", isLink: true },
    { title: "contact us", to: "https://calendly.com/rangeofviewmusic/30min", isLink: true },
  ];

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
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md px-8 py-2.5 rounded-full border border-white/10 z-[100] max-w-[90%] md:max-w-none transition-opacity duration-500 overflow-hidden group ${className || ""}`}
      >
        {/* Shimmer effect covering entire nav container */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300">
          <div className="shimmer-effect"></div>
        </div>

        <nav className="flex items-center space-x-0.5 md:space-x-2.5 justify-center relative z-10 w-full">
          {links.map((link, index) => (
            <div key={link.title} className="flex items-center">
              {link.isLink ? (
                <Link
                  href={link.to || "#"}
                  className="px-1.5 py-1.5 text-white/80 hover:text-white transition-colors cursor-pointer text-[10px] sm:text-[13px] md:text-[17px] uppercase tracking-wide whitespace-nowrap"
                  style={{ fontFamily: "Futura, sans-serif" }}
                >
                  {link.title}
                </Link>
              ) : (
                <button
                  onClick={() => link.to ? scrollToSection(link.to) : setModalOpen(true)}
                  className="px-1.5 py-1.5 text-white/80 hover:text-white transition-colors cursor-pointer text-[10px] sm:text-[13px] md:text-[17px] uppercase tracking-wide whitespace-nowrap"
                  style={{ fontFamily: "Futura, sans-serif" }}
                >
                  {link.title}
                </button>
              )}
              {index < links.length - 1 && (
                <span className="text-white/30 text-[10px] md:text-base mx-0.5">|</span>
              )}
            </div>
          ))}

          {/* Menu Button with Hamburger Icon */}
          <div className="flex items-center">
            <span className="text-white/30 text-[10px] md:text-base mx-0.5">|</span>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="px-1.5 py-1.5 text-white/80 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
              style={{ fontFamily: "Futura, sans-serif" }}
            >
              <Menu className="w-3 h-3 md:w-5 md:h-5" />
              <span className="text-[10px] sm:text-[13px] md:text-[17px] uppercase tracking-wide whitespace-nowrap">Menu</span>
            </button>
          </div>
        </nav>

        {/* Custom CSS for shimmer effect */}
        <style jsx>{`
          @keyframes shimmer {
            0% {
              transform: translateX(-150%) rotate(15deg);
            }
            100% {
              transform: translateX(250%) rotate(15deg);
            }
          }

          .shimmer-effect {
            position: absolute;
            top: -50%;
            left: -50%;
            width: 60%;
            height: 200%;
            background: linear-gradient(
              90deg,
              rgba(255, 255, 255, 0) 0%,
              rgba(255, 255, 255, 0.25) 50%,
              rgba(255, 255, 255, 0) 100%
            );
            filter: blur(10px);
            animation: shimmer 2.5s ease-in-out infinite;
          }

          @media (max-width: 768px) {
            .shimmer-effect {
              animation: shimmer 3.5s ease-in-out infinite;
              background: linear-gradient(
                90deg,
                rgba(255, 255, 255, 0) 0%,
                rgba(255, 255, 255, 0.15) 50%,
                rgba(255, 255, 255, 0) 100%
              );
            }
          }
        `}</style>
      </div>

      {/* Expanded Menu Glass Pane */}
      <div
        className={`fixed bottom-20 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md rounded-3xl border border-white/10 z-[99] overflow-hidden transition-all duration-500 ease-in-out ${menuOpen
          ? "w-[90%] md:w-[600px] h-[400px] opacity-100 scale-100"
          : "w-0 h-0 opacity-0 scale-95"
          }`}
      >
        <div className={`p-8 transition-opacity duration-300 ${menuOpen ? "opacity-100 delay-200" : "opacity-0"}`}>
          {/* Close Button */}
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Menu Content */}
          <div className="flex flex-col items-center justify-center h-full">
            <h2
              className="text-white/60 text-sm md:text-base uppercase tracking-widest mb-8"
              style={{ fontFamily: "futura" }}
            >
              R.O.V Services
            </h2>


            <ul className="space-y-4 w-full max-w-md">
              <li>
                <a
                  href="/#services"
                  className="block px-6 py-3 text-white/80 hover:text-white text-base md:text-lg transition-all hover:bg-white/5 rounded-xl border border-transparent hover:border-white/10 text-center"
                  style={{ fontFamily: "futura" }}
                >
                  • Sound Engineering
                </a>
              </li>
              <li>
                <a
                  href="/#services"
                  className="block px-6 py-3 text-white/80 hover:text-white text-base md:text-lg transition-all hover:bg-white/5 rounded-xl border border-transparent hover:border-white/10 text-center"
                  style={{ fontFamily: "futura" }}
                >
                  • Web Development
                </a>
              </li>
              <li>
                <a
                  href="/#services"
                  className="block px-6 py-3 text-white/80 hover:text-white text-base md:text-lg transition-all hover:bg-white/5 rounded-xl border border-transparent hover:border-white/10 text-center"
                  style={{ fontFamily: "futura" }}
                >
                  • Aerial Media Production
                </a>
              </li>
              <li>
                <a
                  href="/#services"
                  className="block px-6 py-3 text-white/80 hover:text-white text-base md:text-lg transition-all hover:bg-white/5 rounded-xl border border-transparent hover:border-white/10 text-center"
                  style={{ fontFamily: "futura" }}
                >
                  • Custom AI Automations
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modal with consistent font */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[101]">
          <div
            className="bg-black/50 backdrop-blur-md text-white p-8 rounded-3xl shadow-lg text-center w-96 relative border border-white/10 md:w-96 sm:w-full sm:p-6"
            style={{ fontFamily: "futura" }}
          >
            <button
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
              onClick={() => setModalOpen(false)}
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
