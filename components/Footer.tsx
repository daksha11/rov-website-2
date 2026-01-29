"use client";
import { useEffect, useState } from "react";
import { Github, Instagram, Linkedin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const [isIndia, setIsIndia] = useState<boolean>(false);
  const [localTime, setLocalTime] = useState<string>("");

  const getTime = (zone: string): string => {
    return new Date().toLocaleTimeString("en-US", {
      timeZone: zone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  useEffect(() => {
    const updateTime = () => {
      const zone = isIndia ? "Asia/Kolkata" : "America/New_York";
      setLocalTime(getTime(zone));
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, [isIndia]);

  const handleToggle = (): void => {
    setIsIndia((prev) => !prev);
  };

  return (
    <footer className="relative w-full bg-black text-white overflow-hidden min-h-[600px]">
      {/* Top Section with Logo and Studios */}
      <div className="px-6 md:px-12 pl-6 md:pl-16 pt-10 pb-16">
        <div className="flex items-center gap-4 md:gap-6">
          <Link
            href="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="cursor-pointer"
          >
            <Image
              src="/assets/images/logokalam.png"
              alt="ROV Studios Logo"
              width={120}
              height={60}
              className="object-contain w-[80px] md:w-[120px]"
            />
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
            className="absolute right-0 -top-6 h-[80px] w-auto object-contain md:hidden"
          />
          <h3
            className="text-2xl md:text-4xl uppercase tracking-wider mb-2 font-bold"
            style={{ fontFamily: 'Norwige, sans-serif' }}
          >
            SERVICES
          </h3>
          <ul
            className="flex flex-col gap-1 text-base md:text-xl"
            style={{ fontFamily: 'Roboto, sans-serif' }}
          >
            <li>
              <a href="/#services" className="hover:text-gray-400 transition-colors duration-300">Sound</a>
            </li>
            <li>
              <a href="/#services" className="hover:text-gray-400 transition-colors duration-300">Web Optimization</a>
            </li>
            <li>
              <a href="/#services" className="hover:text-gray-400 transition-colors duration-300">Video Production</a>
            </li>
            <li>
              <a href="/#services" className="hover:text-gray-400 transition-colors duration-300">AI Integration</a>
            </li>
          </ul>
        </div>

        {/* Center Column - Follow Us */}
        <div className="flex flex-col gap-3">
          <h3
            className="text-2xl md:text-4xl uppercase tracking-wider mb-2 font-bold"
            style={{ fontFamily: 'Norwige, sans-serif' }}
          >
            FOLLOW US
          </h3>
          <div className="flex items-center gap-5">
            <a href="https://www.instagram.com/rangeofviewstudios/" target="_blank" rel="noopener noreferrer" className="transition hover:scale-110">
              <Instagram size={30} className="md:w-10 md:h-10" />
            </a>
            <a href="https://open.spotify.com/user/31uh2vy4lgdzfrp47tudxzn7bhuq" target="_blank" rel="noopener noreferrer" className="transition hover:scale-110">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 496 512"
                className="w-[30px] h-[30px] md:w-10 md:h-10"
              >
                <path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm113.7 364.7c-4.1 6.6-12.8 8.6-19.4 4.5-53.1-32.3-119.8-39.6-198.4-21.6-7.5 1.7-15-3.1-16.7-10.6-1.7-7.5 3.1-15 10.6-16.7 84.5-19.2 158.1-10.8 217.8 25.3 6.6 4.1 8.6 12.8 4.5 19.4zm26.6-58.6c-5.1 8.3-16 10.9-24.3 5.8-60.8-37.2-153.8-48-224.7-26.2-9.1 2.7-18.6-2.5-21.3-11.6-2.7-9.1 2.5-18.6 11.6-21.3 79.6-23.8 181.4-11.7 249.7 30.1 8.3 5.1 10.9 16 5.8 24.3z" />
              </svg>
            </a>
            <a href="https://discord.gg/GfzXdmu" target="_blank" rel="noopener noreferrer" className="transition hover:scale-110">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 640 512"
                className="w-[30px] h-[30px] md:w-10 md:h-10"
              >
                <path d="M524.5 69.5A1.5 1.5 0 0 0 523.7 69a485 485 0 0 0-120.4-37.2 1.8 1.8 0 0 0-1.9 1 337.2 337.2 0 0 0-15.1 31.2 447.4 447.4 0 0 0-134 0A309.4 309.4 0 0 0 237.2 33a1.9 1.9 0 0 0-1.9-1A483.6 483.6 0 0 0 116.4 69a1.7 1.7 0 0 0-.8.7C39.1 183.6 18.1 294.4 28.5 404.3a2.1 2.1 0 0 0 .8 1.3A487 487 0 0 0 177.2 480a1.9 1.9 0 0 0 2.1-.7 348.2 348.2 0 0 0 30-48.9 1.9 1.9 0 0 0-1-2.6 321.8 321.8 0 0 1-46-21.9 1.9 1.9 0 0 1-.2-3.2 251.7 251.7 0 0 0 9.1-7.1 1.9 1.9 0 0 1 2-.3c96.1 43.9 200.4 43.9 296 0a1.9 1.9 0 0 1 2 .3 235.5 235.5 0 0 0 9.1 7.1 1.9 1.9 0 0 1-.2 3.2 301 301 0 0 1-46 21.9 1.9 1.9 0 0 0-1 2.6 347.9 347.9 0 0 0 30 48.9 1.9 1.9 0 0 0 2.1.7A486.8 486.8 0 0 0 610.7 405a2 2 0 0 0 .8-1.3c10.4-109.8-10.6-220.6-87-334.2zM222.2 338.1c-23.4 0-42.6-21.5-42.6-47.8s18.9-47.8 42.6-47.8c23.7 0 42.9 21.5 42.6 47.8s-18.9 47.8-42.6 47.8zm195.6 0c-23.4 0-42.6-21.5-42.6-47.8s18.9-47.8 42.6-47.8 42.9 21.5 42.6 47.8-18.9 47.8-42.6 47.8z" />
              </svg>
            </a>
            <a href="https://www.linkedin.com/company/105545910/admin/dashboard/" target="_blank" rel="noopener noreferrer" className="transition hover:scale-110">
              <Linkedin size={30} className="md:w-10 md:h-10" />
            </a>
            <a href="https://github.com/rangeofviewstudios" target="_blank" rel="noopener noreferrer" className="transition hover:scale-110">
              <Github size={30} className="md:w-10 md:h-10" />
            </a>
          </div>
        </div>

        {/* Right Column - Local Time and Ring */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div
            className="flex flex-col gap-2 cursor-pointer select-none"
            onClick={handleToggle}
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
                  className="text-lg md:text-xl"
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
          </div>

          {/* Ring Video */}
          <video
            src="/video/ring_footer.webm"
            autoPlay
            loop
            muted
            playsInline
            className="hidden md:block md:h-[140px] w-auto object-contain md:ml-auto md:mr-16 md:-mt-4"
          />
        </div>
      </div>

      {/* Skylines - Positioned at bottom right */}
      <div className="absolute -bottom-10 md:-bottom-12 right-0 w-full h-[120px] md:h-[350px] pointer-events-none" style={{ filter: 'drop-shadow(0 -10px 50px rgba(255, 255, 255, 0.3))' }}>
        {/* Atlanta Skyline */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out will-change-opacity transform-gpu ${isIndia ? 'opacity-0' : 'opacity-100'}`}
        >
          <Image
            src="/atlskylinefooter.png"
            alt="Atlanta Skyline"
            fill
            priority
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
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out will-change-opacity transform-gpu ${isIndia ? 'opacity-100' : 'opacity-0'}`}
        >
          <Image
            src="/hydskyline.PNG"
            alt="Hyderabad Skyline"
            fill
            priority
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