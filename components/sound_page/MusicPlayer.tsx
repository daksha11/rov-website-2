"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Volume2,
    ListMusic,
    MessageSquare,
    MoreHorizontal
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const songData = [
    {
        title: "MARTYR",
        artist: "DDK",
        album: "Vision",
        beforeSrc: "/audio/before/09.wav",
        afterSrc: "/audio/after/09.wav",
        cover: "/assets/songCovers/01.webp"
    },
    {
        title: "BE MY TINE",
        artist: "Sam Suen",
        album: "Reflections",
        beforeSrc: "/audio/before/01.wav",
        afterSrc: "/audio/after/01.wav",
        cover: "/assets/songCovers/02.webp"
    },
    {
        title: "YOU COULD BE MY WOMEN",
        artist: "Basu",
        album: "Raw Soul",
        beforeSrc: "/audio/before/14.wav",
        afterSrc: "/audio/after/14.wav",
        cover: "/assets/songCovers/03.webp"
    },
    {
        title: "Kiss of Death",
        artist: "Sniper J",
        album: "Midnight",
        beforeSrc: "/audio/before/07.wav",
        afterSrc: "/audio/after/07.wav",
        cover: "/assets/songCovers/07.webp"
    },
    {
        title: "ONE AT A TIME",
        artist: "Basu",
        album: "Studio Sessions",
        beforeSrc: "/audio/before/08.wav",
        afterSrc: "/audio/after/08.wav",
        cover: "/assets/songCovers/13.webp"
    },
    {
        title: "UP LATE UP EARLY",
        artist: "Basu",
        album: "Dreamland",
        beforeSrc: "/audio/before/12.wav",
        afterSrc: "/audio/after/12.wav",
        cover: "/assets/songCovers/14.webp"
    }
];

export default function MusicPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isAfter, setIsAfter] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    // State for new features
    const [volume, setVolume] = useState(1);
    const [prevVolume, setPrevVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [showPlaylist, setShowPlaylist] = useState(false);
    const [showVolume, setShowVolume] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const carouselRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const toggleMute = () => {
        if (!audioRef.current) return;
        if (volume > 0) {
            setPrevVolume(volume);
            setVolume(0);
            setIsMuted(true);
            audioRef.current.volume = 0;
        } else {
            const restoreVol = prevVolume > 0 ? prevVolume : 0.5;
            setVolume(restoreVol);
            setIsMuted(false);
            audioRef.current.volume = restoreVol;
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        setVolume(val);
        if (audioRef.current) {
            audioRef.current.volume = val;
            setIsMuted(val === 0);
        }
    };

    const selectSong = (index: number) => {
        setCurrentIndex(index);
        setShowPlaylist(false);
        setIsPlaying(true);
    };

    const nextSong = () => {
        setCurrentIndex((prev) => (prev + 1) % songData.length);
    };

    const prevSong = () => {
        setCurrentIndex((prev) => (prev - 1 + songData.length) % songData.length);
    };

    // Audio Logic
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        // Initialize volume
        audio.volume = volume;
        audio.muted = isMuted;

        const updateProgress = () => {
            setCurrentTime(audio.currentTime);
            if (audio.duration) {
                setDuration(audio.duration);
                setProgress((audio.currentTime / audio.duration) * 100);
            }
        };

        const handleEnded = () => {
            nextSong();
        };

        const handleLoadedMetadata = () => {
            setDuration(audio.duration);
        };

        audio.addEventListener("timeupdate", updateProgress);
        audio.addEventListener("ended", handleEnded);
        audio.addEventListener("loadedmetadata", handleLoadedMetadata);

        if (isPlaying) {
            audio.play().catch(() => setIsPlaying(false));
        }

        return () => {
            audio.removeEventListener("timeupdate", updateProgress);
            audio.removeEventListener("ended", handleEnded);
            audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
        };
    }, [currentIndex, isAfter]);

    // Handle Play/Pause from state
    useEffect(() => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.play().catch(() => setIsPlaying(false));
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    // 3D Carousel Animation Logic
    useEffect(() => {
        if (!carouselRef.current) return;

        const cards = cardsRef.current;
        const total = cards.length;

        cards.forEach((card, i) => {
            if (!card) return;

            let diff = i - currentIndex;

            // Infinite loop logic logic handles wrapping
            if (diff > total / 2) diff -= total;
            if (diff < -total / 2) diff += total;

            const absDiff = Math.abs(diff);
            const isCenter = diff === 0;

            // Cover Flow Style: Active 0, others turned ~60deg inward
            let rotationY = 0;
            if (!isCenter) {
                rotationY = diff > 0 ? -60 : 60;
            }

            gsap.to(card, {
                x: diff * 200, // Tighter overlap
                z: isCenter ? 0 : -200, // Less deep z-space for tighter feel
                rotationY: rotationY,
                scale: isCenter ? 1.0 : 0.8,
                opacity: absDiff > 2 ? 0 : (isCenter ? 1 : 0.8),
                zIndex: 10 - absDiff,
                duration: 0.6,
                ease: "power2.out",
            });
        });
    }, [currentIndex]);

    const formatTime = (time: number) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, "0");
        return `${minutes}:${seconds}`;
    };

    return (
        <div className="w-full flex flex-col items-center bg-black">
            <div className="w-full max-w-[95%] md:max-w-7xl px-6 md:px-12 text-left py-12 md:py-16">
                <h2 className="text-[#FFF4E3] text-3xl md:text-4xl lg:text-5xl font-bold italic leading-tight" style={{ fontFamily: 'Norwige, sans-serif' }}>
                    Don't Believe Us.<br />
                    Hear the Difference.
                </h2>
            </div>

            <div className="w-full max-w-[95%] md:max-w-7xl px-6 md:px-12 pb-20">
                <section className="relative w-full min-h-[70vh] flex flex-col items-center justify-center pt-10 overflow-hidden font-sans rounded-[2.5rem] border border-white/5">
                    {/* Background Image - Clean, no full screen glass */}
                    <div
                        className="absolute inset-0 bg-cover bg-center blur-sm scale-110" // Added blur-sm and scale-110 to avoid blurred edges
                        style={{
                            backgroundImage: "url('/soundpage/pedromvimg.png')",
                        }}
                    />
                    {/* Calm dark overlay, not blurred */}
                    <div className="absolute inset-0 bg-black/40" />

                    <div className="container max-w-6xl mx-auto px-4 flex flex-col items-center relative z-10">

                        {/* Simple Top Toggle (No Glassmorphism headers) */}
                        <div className="flex bg-black/40 rounded-full p-1 mb-12 border border-white/10">
                            <button
                                onClick={() => setIsAfter(false)}
                                className={`px-8 py-2 rounded-full text-sm font-bold tracking-widest uppercase transition-all duration-300 ${!isAfter
                                    ? "bg-white/20 backdrop-blur-md text-white shadow-lg border border-white/10"
                                    : "text-white/60 hover:text-white"
                                    }`}
                            >
                                Before
                            </button>
                            <button
                                onClick={() => setIsAfter(true)}
                                className={`px-8 py-2 rounded-full text-sm font-bold tracking-widest uppercase transition-all duration-300 ${isAfter
                                    ? "bg-white/20 backdrop-blur-md text-white shadow-lg border border-white/10"
                                    : "text-white/60 hover:text-white"
                                    }`}
                            >
                                After
                            </button>
                        </div>

                        {/* 3D Carousel (Cover Flow) */}
                        <div className="relative w-full h-[380px] md:h-[420px] flex items-center justify-center mb-0" style={{ perspective: "1000px" }}>
                            <div ref={carouselRef} className="relative w-full h-full flex items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
                                {songData.map((song, i) => (
                                    <div
                                        key={i}
                                        ref={el => { cardsRef.current[i] = el; }}
                                        className="absolute w-[280px] md:w-[320px] aspect-square rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 bg-black"
                                    >
                                        <Image
                                            src={song.cover}
                                            alt={song.title}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 280px, 320px"
                                            priority={i === currentIndex}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Metadata Pill (Reference: Small, Dark, Below Active Card) */}
                        <div className="flex justify-center mb-12 relative z-20 mt-[-20px]">
                            <div className="px-8 py-2 rounded-full bg-[#000000]/60 backdrop-blur-xl border border-white/5 flex flex-col items-center shadow-lg transition-all hover:bg-[#000000]/80">
                                <h3 className="text-white text-sm font-bold tracking-wide leading-tight">{songData[currentIndex].title}</h3>
                                <p className="text-[#9CA3AF] text-[11px] font-medium leading-tight mt-0.5">{songData[currentIndex].artist}</p>
                            </div>
                        </div>

                        {/* Playlist Popover (Conditional) */}
                        <AnimatePresence>
                            {showPlaylist && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    className="absolute bottom-32 md:bottom-28 w-[20rem] bg-[#1A1A1A]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl z-[150]"
                                >
                                    <h4 className="text-white/60 text-xs font-bold uppercase tracking-widest mb-3 ml-1">Up Next</h4>
                                    <div className="flex flex-col gap-2 max-h-[15rem] overflow-y-auto custom-scrollbar">
                                        {songData.map((song, i) => (
                                            <button
                                                key={i}
                                                onClick={() => selectSong(i)}
                                                className={`flex items-center gap-3 p-2 rounded-lg transition-colors text-left ${i === currentIndex ? "bg-white/10" : "hover:bg-white/5"}`}
                                            >
                                                <img src={song.cover} className="w-8 h-8 rounded object-cover" alt="mini" />
                                                <div className="flex flex-col min-w-0">
                                                    <span className={`text-sm font-medium truncate ${i === currentIndex ? "text-[#EA9A61]" : "text-white"}`}>{song.title}</span>
                                                    <span className="text-xs text-white/40 truncate">{song.artist}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Exact Reference Dashboard Design */}
                        <div className="w-full max-w-[50rem] bg-[#2A2A2A]/90 backdrop-blur-2xl border border-white/5 rounded-full p-2 shadow-2xl relative z-[100]">

                            <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-2 w-full h-full">

                                {/* Left: Playback Controls (Simple Icons) */}
                                <div className="flex items-center gap-6 pl-6 pr-2 py-2 md:py-0 order-2 md:order-1">
                                    <button onClick={prevSong} className="text-white hover:text-white/70 transition">
                                        <SkipBack size={24} fill="currentColor" />
                                    </button>
                                    <button onClick={togglePlay} className="text-white hover:scale-110 transition">
                                        {isPlaying ? <Pause size={30} fill="currentColor" /> : <Play size={30} fill="currentColor" />}
                                    </button>
                                    <button onClick={nextSong} className="text-white hover:text-white/70 transition">
                                        <SkipForward size={24} fill="currentColor" />
                                    </button>
                                </div>

                                {/* Center: Inner Dark Pill (Metadata & Status) */}
                                <div className="flex-1 w-full md:w-auto bg-[#181818] rounded-full h-14 flex items-center px-2 pr-6 relative group overflow-hidden order-1 md:order-2">

                                    {/* Progress Bar Background (Subtle) */}
                                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5">
                                        <motion.div
                                            className="h-full bg-white/30"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                                            transition={{ ease: "linear", duration: 0.1 }}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between w-full gap-4">
                                        {/* Art + Info */}
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0 relative">
                                                <Image src={songData[currentIndex].cover} fill className="object-cover" alt="art" sizes="40px" priority />
                                                {/* Hover Overlay for Inner Pill */}
                                                <div className="absolute inset-0 bg-black/20 hidden group-hover:block" />
                                            </div>
                                            <div className="flex flex-col min-w-0 justify-center">
                                                <span className="text-white text-[13px] font-semibold truncate leading-tight">{songData[currentIndex].title}</span>
                                                <span className="text-[#9CA3AF] text-[11px] truncate leading-tight">{songData[currentIndex].artist} - {songData[currentIndex].album}</span>
                                            </div>
                                        </div>

                                        {/* Timer Status Icon (Pulse) */}
                                        <div className="flex items-center gap-3 flex-shrink-0">
                                            <span className="text-[#9CA3AF] text-xs font-mono tabular-nums">{formatTime(currentTime)}</span>
                                            <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                                                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Auxiliary Controls (Functional) */}
                                <div className="flex items-center gap-5 pr-6 pl-2 py-2 md:py-0 order-3 md:order-3 text-[#E5E7EB]">
                                    {/* Playlist Toggle */}
                                    <button
                                        onClick={() => setShowPlaylist(!showPlaylist)}
                                        className={`hover:text-white transition ${showPlaylist ? "text-[#EA9A61]" : ""}`}
                                    >
                                        <ListMusic size={22} className="stroke-[2.5]" />
                                    </button>

                                    {/* Volume Control with Stable Slider */}
                                    <div
                                        className="relative flex items-center"
                                        onMouseEnter={() => setShowVolume(true)}
                                        onMouseLeave={() => setShowVolume(false)}
                                    >
                                        <AnimatePresence>
                                            {showVolume && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 flex items-center justify-center bg-[#1A1A1A] p-2 rounded-lg border border-white/10 shadow-xl z-[160]"
                                                >
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max="1"
                                                        step="0.01"
                                                        value={volume}
                                                        onChange={handleVolumeChange}
                                                        className="h-24 w-1 appearance-none bg-white/20 rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                                                        style={{ writingMode: "vertical-lr", direction: "rtl" }}
                                                    />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                        <button onClick={toggleMute} className="hover:text-white transition w-8 flex justify-center">
                                            {volume === 0 ? <Volume2 size={22} className="stroke-[2.5] opacity-50" /> : <Volume2 size={22} className="stroke-[2.5]" />}
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Carousel Indicators */}
                        <div className="flex gap-2 mt-8">
                            {songData.map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentIndex ? "bg-white/40 w-6 shadow-[0_0_10px_rgba(255,255,255,0.3)]" : "bg-white/20"}`}
                                />
                            ))}
                        </div>

                    </div>

                    <audio
                        ref={audioRef}
                        src={isAfter ? songData[currentIndex].afterSrc : songData[currentIndex].beforeSrc}
                    />
                </section>
            </div>
        </div>
    );
}
