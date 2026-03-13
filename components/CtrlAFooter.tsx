"use client";

import Link from "next/link";
import { Instagram } from "lucide-react";

const CtrlAFooter = () => {
    return (
        <>
            <style jsx global>{`
                @font-face {
                    font-family: 'Sarina';
                    src: url('/font/Sarina/Sarina-Regular.ttf') format('truetype');
                    font-weight: normal;
                    font-style: normal;
                }
            `}</style>
            <footer className="relative w-full bg-[#2A2A2A] text-white overflow-hidden" style={{ maxWidth: '100vw' }}>
                {/* Main Content */}
                <div className="relative z-10 px-6 md:px-12 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8">
                        {/* Left Column - Services */}
                        <Link href="/#services" className="flex flex-col gap-4 group">
                            <div className="inline-block">
                                <span
                                    className="text-sm md:text-base px-4 py-2 rounded-full border-2 border-white uppercase tracking-wide"
                                    style={{ fontFamily: 'Norwige, sans-serif' }}
                                >
                                    Let's make it happen
                                </span>
                            </div>
                            <h3
                                className="text-3xl md:text-5xl font-bold group-hover:text-[#EA9A61] transition-colors duration-300"
                                style={{ fontFamily: 'Norwige, sans-serif' }}
                            >
                                Check our<br />Services!
                            </h3>
                        </Link>

                        {/* Center Column - About Us */}
                        <Link href="/#team-members" className="flex flex-col gap-4 group">
                            <div className="inline-block">
                                <span
                                    className="text-sm md:text-base px-4 py-2 rounded-full border-2 border-white uppercase tracking-wide"
                                    style={{ fontFamily: 'Norwige, sans-serif' }}
                                >
                                    Get to know about us
                                </span>
                            </div>
                            <h3
                                className="text-3xl md:text-5xl font-bold group-hover:text-[#EA9A61] transition-colors duration-300"
                                style={{ fontFamily: 'Norwige, sans-serif' }}
                            >
                                About Us
                            </h3>
                        </Link>

                        {/* Right Column - Calendly */}
                        <div className="flex flex-col gap-4">
                            <div className="inline-block">
                                <span
                                    className="text-sm md:text-base px-4 py-2 rounded-full border-2 border-white uppercase tracking-wide"
                                    style={{ fontFamily: 'Norwige, sans-serif' }}
                                >
                                    contact
                                </span>
                            </div>
                            <a
                                href="https://calendly.com/rangeofviewmusic/30min"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group"
                            >
                                <h3
                                    className="text-3xl md:text-5xl font-bold mb-2 group-hover:text-[#EA9A61] transition-colors duration-300"
                                    style={{ fontFamily: 'Norwige, sans-serif' }}
                                >
                                    Calendly
                                </h3>
                            </a>
                            <a
                                href="https://calendly.com/rangeofviewmusic/30min"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm md:text-base hover:text-[#EA9A61] transition-colors duration-300 w-fit"
                                style={{ fontFamily: 'Roboto, sans-serif' }}
                            >
                                Book a call!
                            </a>
                            <p
                                className="text-xs md:text-sm text-gray-300"
                                style={{ fontFamily: 'Roboto, sans-serif' }}
                            >
                                *we're millennials and gen-z please do not call us.
                            </p>

                            {/* Social Icons */}
                            <div className="flex items-center gap-4 mt-2">
                                <a
                                    href="https://discord.gg/GfzXdmu"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Join ROV Studios on Discord"
                                    className="w-10 h-10 rounded-full bg-[#4A4A4A] flex items-center justify-center hover:bg-[#5A5A5A] transition-colors"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 640 512"
                                        className="w-5 h-5"
                                    >
                                        <path d="M524.5 69.5A1.5 1.5 0 0 0 523.7 69a485 485 0 0 0-120.4-37.2 1.8 1.8 0 0 0-1.9 1 337.2 337.2 0 0 0-15.1 31.2 447.4 447.4 0 0 0-134 0A309.4 309.4 0 0 0 237.2 33a1.9 1.9 0 0 0-1.9-1A483.6 483.6 0 0 0 116.4 69a1.7 1.7 0 0 0-.8.7C39.1 183.6 18.1 294.4 28.5 404.3a2.1 2.1 0 0 0 .8 1.3A487 487 0 0 0 177.2 480a1.9 1.9 0 0 0 2.1-.7 348.2 348.2 0 0 0 30-48.9 1.9 1.9 0 0 0-1-2.6 321.8 321.8 0 0 1-46-21.9 1.9 1.9 0 0 1-.2-3.2 251.7 251.7 0 0 0 9.1-7.1 1.9 1.9 0 0 1 2-.3c96.1 43.9 200.4 43.9 296 0a1.9 1.9 0 0 1 2 .3 235.5 235.5 0 0 0 9.1 7.1 1.9 1.9 0 0 1-.2 3.2 301 301 0 0 1-46 21.9 1.9 1.9 0 0 0-1 2.6 347.9 347.9 0 0 0 30 48.9 1.9 1.9 0 0 0 2.1.7A486.8 486.8 0 0 0 610.7 405a2 2 0 0 0 .8-1.3c10.4-109.8-10.6-220.6-87-334.2zM222.2 338.1c-23.4 0-42.6-21.5-42.6-47.8s18.9-47.8 42.6-47.8c23.7 0 42.9 21.5 42.6 47.8s-18.9 47.8-42.6 47.8zm195.6 0c-23.4 0-42.6-21.5-42.6-47.8s18.9-47.8 42.6-47.8 42.9 21.5 42.6 47.8-18.9 47.8-42.6 47.8z" />
                                    </svg>
                                </a>
                                <a
                                    href="https://www.instagram.com/rangeofviewstudios/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Follow ROV Studios on Instagram"
                                    className="w-10 h-10 rounded-full bg-[#4A4A4A] flex items-center justify-center hover:bg-[#5A5A5A] transition-colors"
                                >
                                    <Instagram size={20} />
                                </a>
                                <a
                                    href="https://www.reddit.com/user/rangeofviewstudios/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Follow ROV Studios on Reddit"
                                    className="w-10 h-10 rounded-full bg-[#4A4A4A] flex items-center justify-center hover:bg-[#5A5A5A] transition-colors"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 512 512"
                                        className="w-5 h-5"
                                    >
                                        <path d="M201.5 305.5c-13.8 0-24.9-11.1-24.9-24.6 0-13.8 11.1-24.9 24.9-24.9 13.6 0 24.6 11.1 24.6 24.9 0 13.6-11.1 24.6-24.6 24.6zM504 256c0 137-111 248-248 248S8 393 8 256 119 8 256 8s248 111 248 248zm-132.3-41.2c-9.4 0-17.7 3.9-23.8 10-22.4-15.5-52.6-25.5-86.1-26.6l17.4-78.3 55.4 12.5c0 13.6 11.1 24.6 24.6 24.6 13.8 0 24.9-11.3 24.9-24.9s-11.1-24.9-24.9-24.9c-9.7 0-18 5.8-22.1 13.8l-61.2-13.6c-3-.8-6.1 1.4-6.9 4.4l-19.1 86.4c-33.2 1.4-63.1 11.3-85.5 26.8-6.1-6.4-14.7-10.2-24.1-10.2-34.9 0-46.3 46.9-14.4 62.8-1.1 5-1.7 10.2-1.7 15.5 0 52.6 59.2 95.2 132 95.2 73.1 0 132.3-42.6 132.3-95.2 0-5.3-.6-10.8-1.9-15.8 31.3-16 19.8-62.5-14.9-62.5zM302.8 331c-18.2 18.2-76.1 17.9-93.6 0-2.2-2.2-6.1-2.2-8.3 0-2.5 2.5-2.5 6.4 0 8.6 22.8 22.8 87.3 22.8 110.2 0 2.5-2.2 2.5-6.1 0-8.6-2.2-2.2-6.1-2.2-8.3 0zm7.7-75c-13.6 0-24.6 11.1-24.6 24.9 0 13.6 11.1 24.6 24.6 24.6 13.8 0 24.9-11.1 24.9-24.6 0-13.8-11-24.9-24.9-24.9z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* ROV Text Section */}
                    <div className="relative mt-16 md:mt-24">
                        {/* Main ROV Text */}
                        <div className="relative w-full flex items-center justify-center py-8">
                            <h1
                                className="text-white text-center w-full"
                                style={{
                                    fontFamily: 'Sarina, cursive',
                                    fontSize: '20vw',
                                    letterSpacing: '0.05em',
                                    margin: 0,
                                    lineHeight: 0.8,
                                }}
                            >
                                R.O.V.
                            </h1>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};
export default CtrlAFooter;
