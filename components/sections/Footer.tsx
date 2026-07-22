"use client";
import { useEffect, useRef, useState } from "react";
import { Github, Instagram, Linkedin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const [isIndia, setIsIndia] = useState<boolean>(false);
  const [localTime, setLocalTime] = useState<string>("");
  const footerRef = useRef<HTMLElement>(null);

  const getTime = (zone: string): string => {
    return new Date().toLocaleTimeString("en-US", {
      timeZone: zone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Only tick the timer when the footer is visible
  useEffect(() => {
    const updateTime = () => {
      const zone = isIndia ? "Asia/Kolkata" : "America/New_York";
      setLocalTime(getTime(zone));
    };

    updateTime();

    let timer: ReturnType<typeof setInterval> | null = null;
    const node = footerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          updateTime();
          timer = setInterval(updateTime, 1000);
        } else if (timer) {
          clearInterval(timer);
          timer = null;
        }
      },
      { threshold: 0 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (timer) clearInterval(timer);
    };
  }, [isIndia]);

  const handleToggle = (): void => {
    setIsIndia((prev) => !prev);
  };

  return (
    <footer ref={footerRef} className="relative w-full bg-black text-white overflow-hidden min-h-[600px]">
      {/* Top Section with Logo and Studios */}
      <div className="px-6 md:px-12 pl-6 md:pl-16 pt-10 pb-16">
        <div className="flex items-center gap-4 md:gap-6">
          <Link
            href="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="cursor-pointer"
          >
            <span className="relative block w-[80px] h-[40px] md:w-[120px] md:h-[60px]">
              <Image
                src="/brand/rov-logo.webp"
                alt="ROV Studios Logo"
                fill
                sizes="120px"
                className="object-contain"
              />
            </span>
          </Link>
          <h2
            className="text-3xl md:text-5xl uppercase tracking-wider font-bold"
            style={{ fontFamily: 'Norwige, sans-serif' }}
          >
            STUDIOS
          </h2>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-8 px-6 md:px-12 pb-20">
        {/* Left Column - Services */}
        <div className="relative flex flex-col gap-3 pl-0 md:pl-8">
          <video
            src="/video/ring_footer.webm"
            autoPlay
            loop
            muted
            playsInline
            preload="none"
            aria-hidden="true"
            className="absolute right-0 -top-6 h-[80px] w-auto object-contain md:hidden"
          />
          <h3
            className="text-2xl md:text-4xl uppercase tracking-wider mb-2 font-bold"
            style={{ fontFamily: 'Norwige, sans-serif' }}
          >
            SERVICES
          </h3>
          <div className="flex flex-col gap-8 sm:flex-row sm:gap-14">
            {/* What we do */}
            <div className="flex flex-col gap-3">
              <span
                className="text-[11px] uppercase tracking-[0.2em]"
                style={{ fontFamily: 'Roboto, sans-serif', color: '#C1936A' }}
              >
                What we do
              </span>
              <ul
                className="flex flex-col gap-2.5 text-base md:text-lg"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                <li>
                  <a href="/web" className="hover:text-gray-400 transition-colors duration-300">Web Optimization</a>
                </li>
                <li>
                  <a href="/video-production" className="hover:text-gray-400 transition-colors duration-300">Video Production</a>
                </li>
                <li>
                  <a href="/ai-automation" className="hover:text-gray-400 transition-colors duration-300">AI Solutions</a>
                </li>
              </ul>
            </div>

            {/* Explore */}
            <div className="flex flex-col gap-3">
              <span
                className="text-[11px] uppercase tracking-[0.2em]"
                style={{ fontFamily: 'Roboto, sans-serif', color: '#C1936A' }}
              >
                Explore
              </span>
              <ul
                className="flex flex-col gap-2.5 text-base md:text-lg"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                <li>
                  <a href="/works" className="hover:text-gray-400 transition-colors duration-300">Work</a>
                </li>
                <li>
                  <a href="/casestudy" className="hover:text-gray-400 transition-colors duration-300">Case Studies</a>
                </li>
                <li>
                  <a href="/blog" className="hover:text-gray-400 transition-colors duration-300">Blog</a>
                </li>
                <li>
                  <a href="/resources" className="hover:text-gray-400 transition-colors duration-300">Resources</a>
                </li>
                <li>
                  <a href="/about" className="hover:text-gray-400 transition-colors duration-300">About &amp; Team</a>
                </li>
                <li className="pt-2">
                  <a
                    href="/ctrla"
                    className="group inline-flex items-center gap-1.5 hover:text-gray-400 transition-colors duration-300"
                  >
                    CTRL·A
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="transition-transform duration-300 group-hover:translate-x-0.5" style={{ color: '#C1936A' }}>
                      <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.rovmusic.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 hover:text-gray-400 transition-colors duration-300"
                  >
                    Music
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" style={{ color: '#C1936A' }}>
                      <path d="M3 9L9 3M4 3h5v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Center Column - Follow Us */}
        <div className="flex flex-col gap-3">
          <h3
            className="text-2xl md:text-4xl uppercase tracking-wider mb-2 font-bold"
            style={{ fontFamily: 'Norwige, sans-serif' }}
          >
            FOLLOW US
          </h3>
          <a
            href="mailto:contact@rovstudios.com"
            className="text-base md:text-xl hover:text-gray-400 transition-colors duration-300 mb-1"
            style={{ fontFamily: 'Roboto, sans-serif' }}
          >
            contact@rovstudios.com
          </a>
          <div className="flex items-center gap-5">
            <a href="https://www.instagram.com/rangeofviewstudios/" target="_blank" rel="noopener noreferrer" aria-label="Follow ROV Studios on Instagram" className="transition hover:scale-110">
              <Instagram size={30} className="md:w-10 md:h-10" />
            </a>
            <a href="https://open.spotify.com/user/31uh2vy4lgdzfrp47tudxzn7bhuq" target="_blank" rel="noopener noreferrer" aria-label="Listen to ROV Studios on Spotify" className="transition hover:scale-110">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 496 512"
                className="w-[30px] h-[30px] md:w-10 md:h-10"
              >
                <path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm113.7 364.7c-4.1 6.6-12.8 8.6-19.4 4.5-53.1-32.3-119.8-39.6-198.4-21.6-7.5 1.7-15-3.1-16.7-10.6-1.7-7.5 3.1-15 10.6-16.7 84.5-19.2 158.1-10.8 217.8 25.3 6.6 4.1 8.6 12.8 4.5 19.4zm26.6-58.6c-5.1 8.3-16 10.9-24.3 5.8-60.8-37.2-153.8-48-224.7-26.2-9.1 2.7-18.6-2.5-21.3-11.6-2.7-9.1 2.5-18.6 11.6-21.3 79.6-23.8 181.4-11.7 249.7 30.1 8.3 5.1 10.9 16 5.8 24.3z" />
              </svg>
            </a>
            <a href="https://discord.gg/GfzXdmu" target="_blank" rel="noopener noreferrer" aria-label="Join ROV Studios on Discord" className="transition hover:scale-110">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 640 512"
                className="w-[30px] h-[30px] md:w-10 md:h-10"
              >
                <path d="M524.5 69.5A1.5 1.5 0 0 0 523.7 69a485 485 0 0 0-120.4-37.2 1.8 1.8 0 0 0-1.9 1 337.2 337.2 0 0 0-15.1 31.2 447.4 447.4 0 0 0-134 0A309.4 309.4 0 0 0 237.2 33a1.9 1.9 0 0 0-1.9-1A483.6 483.6 0 0 0 116.4 69a1.7 1.7 0 0 0-.8.7C39.1 183.6 18.1 294.4 28.5 404.3a2.1 2.1 0 0 0 .8 1.3A487 487 0 0 0 177.2 480a1.9 1.9 0 0 0 2.1-.7 348.2 348.2 0 0 0 30-48.9 1.9 1.9 0 0 0-1-2.6 321.8 321.8 0 0 1-46-21.9 1.9 1.9 0 0 1-.2-3.2 251.7 251.7 0 0 0 9.1-7.1 1.9 1.9 0 0 1 2-.3c96.1 43.9 200.4 43.9 296 0a1.9 1.9 0 0 1 2 .3 235.5 235.5 0 0 0 9.1 7.1 1.9 1.9 0 0 1-.2 3.2 301 301 0 0 1-46 21.9 1.9 1.9 0 0 0-1 2.6 347.9 347.9 0 0 0 30 48.9 1.9 1.9 0 0 0 2.1.7A486.8 486.8 0 0 0 610.7 405a2 2 0 0 0 .8-1.3c10.4-109.8-10.6-220.6-87-334.2zM222.2 338.1c-23.4 0-42.6-21.5-42.6-47.8s18.9-47.8 42.6-47.8c23.7 0 42.9 21.5 42.6 47.8s-18.9 47.8-42.6 47.8zm195.6 0c-23.4 0-42.6-21.5-42.6-47.8s18.9-47.8 42.6-47.8 42.9 21.5 42.6 47.8-18.9 47.8-42.6 47.8z" />
              </svg>
            </a>
            <a href="https://www.linkedin.com/company/range-of-view-studios/" target="_blank" rel="noopener noreferrer" aria-label="Connect with ROV Studios on LinkedIn" className="transition hover:scale-110">
              <Linkedin size={30} className="md:w-10 md:h-10" />
            </a>
            <a href="https://github.com/rangeofviewstudios" target="_blank" rel="noopener noreferrer" aria-label="View ROV Studios on GitHub" className="transition hover:scale-110">
              <Github size={30} className="md:w-10 md:h-10" />
            </a>
          </div>
        </div>

        {/* Right Column - Local Time and Ring */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <button
            type="button"
            className="flex flex-col gap-2 cursor-pointer select-none text-left"
            onClick={handleToggle}
            aria-label={isIndia ? "Showing Hyderabad time, click for Atlanta" : "Showing Atlanta time, click for Hyderabad"}
          >
            <h3
              className="text-2xl md:text-4xl uppercase tracking-wider mb-2 font-bold"
              style={{ fontFamily: 'Norwige, sans-serif' }}
            >
              LOCAL TIME
            </h3>
            <div className="min-w-[150px] md:min-w-[200px] relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={isIndia ? "india" : "usa"}
                  className="text-lg md:text-xl whitespace-nowrap"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  {localTime}, {isIndia ? "HYD IST" : "ATL EST"}
                </motion.p>
              </AnimatePresence>
            </div>
          </button>

          {/* Ring Video */}
          <video
            src="/video/ring_footer.webm"
            autoPlay
            loop
            muted
            playsInline
            preload="none"
            aria-hidden="true"
            className="hidden md:block md:h-[140px] w-auto object-contain md:ml-auto md:mr-36 md:-mt-4"
          />
        </div>
      </div>

      {/* Skylines - Positioned at bottom right */}
      <div className="absolute -bottom-10 md:-bottom-12 right-0 w-full h-[120px] md:h-[350px] pointer-events-none" style={{ filter: 'drop-shadow(0 -10px 50px rgba(255, 255, 255, 0.3))' }}>
        {/* Atlanta Skyline */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${isIndia ? 'opacity-0' : 'opacity-100'}`}
        >
          <Image
            src="/misc/atlskylinefooter.webp"
            alt="Atlanta Skyline"
            fill
            sizes="100vw"
            className="object-contain"
            style={{
              objectPosition: 'bottom right',
              transform: 'scale(1.4) translate(5%, 8%)',
              transformOrigin: 'bottom right'
            }}
          />
        </div>

        {/* Hyderabad Skyline - Enhanced visibility */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${isIndia ? 'opacity-100' : 'opacity-0'}`}
        >
          <Image
            src="/misc/hydskyline.webp"
            alt="Hyderabad Skyline"
            fill
            sizes="100vw"
            className="object-contain"
            style={{
              objectPosition: 'bottom right',
              transform: 'scale(1.4) translate(5%, 8%)',
              transformOrigin: 'bottom right',
              filter: 'brightness(1.25) contrast(1.15) saturate(1.1)'
            }}
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;