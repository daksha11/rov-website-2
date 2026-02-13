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
        title: "GIVE ME YOUR LOVE",
        artist: "Lorenzo Barns",
        album: "Single",
        beforeSrc: "/audio/beforemp3/gimmeyourlovebefore.mp3",
        afterSrc: "/audio/aftermp3/gimmeyourloveafter.mp3",
        cover: "/audio/covers/gimmeyourlovecober.webp",
        spotifyUrl: "https://open.spotify.com/track/38SRgJ4K6R1KaeX9YHRZVn?si=3082b3830a2c4c67"
    },
    {
        title: "TALK MY SHIT",
        artist: "DDK",
        album: "Single",
        beforeSrc: "/audio/beforemp3/talkmyshitbefore.mp3",
        afterSrc: "/audio/aftermp3/talkmyshitafter.mp3",
        cover: "/audio/covers/talkmyshitcover.webp",
        spotifyUrl: "https://open.spotify.com/track/5Wdqmd6QqHFivymlHbMWg7?si=3d15de75aa1b4b78"
    },
    {
        title: "MARTYR",
        artist: "DDK",
        album: "Single",
        beforeSrc: "/audio/beforemp3/martyrbefore.mp3",
        afterSrc: "/audio/aftermp3/martyrafter.mp3",
        cover: "/audio/covers/martyrcover.webp",
        spotifyUrl: "https://open.spotify.com/track/2CDURlegHo60zais4SyNbN?si=257a4a94facc48d2"
    },
    {
        title: "YKWIW",
        artist: "Basu",
        album: "Single",
        beforeSrc: "/audio/beforemp3/ykwiwbefore.mp3",
        afterSrc: "/audio/aftermp3/ykwiwafter.mp3",
        cover: "/audio/covers/ykwiwcover.png",
        spotifyUrl: "https://open.spotify.com/track/5lsskTv7eUZYIbLTEtq1cz?si=4b9532cacbf24733"
    },
    {
        title: "GUAP",
        artist: "Dafes",
        album: "Single",
        beforeSrc: "/audio/beforemp3/guapbefore.mp3",
        afterSrc: "/audio/aftermp3/guapafter.mp3",
        cover: "/audio/covers/guapcover.jpg",
        spotifyUrl: "https://open.spotify.com/track/0xVvZTr5prKOC6Fv9aIfwU?si=59e9ab9eaba94806"
    },
    {
        title: "BACK IN TIME",
        artist: "Sam Suen",
        album: "Single",
        beforeSrc: "/audio/beforemp3/backintimebefore.mp3",
        afterSrc: "/audio/aftermp3/backintimeafter.mp3",
        cover: "/audio/covers/backintimecover.jpg",
        spotifyUrl: "https://open.spotify.com/track/7MC8JAS25hJWvFXClSzFND?si=17a6d47209d14fd6"
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
    const savedTimeRef = useRef<number>(0);

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

    const toggleBeforeAfter = (newValue: boolean) => {
        // Save current playback position before switching
        if (audioRef.current && audioRef.current.currentTime > 0) {
            savedTimeRef.current = audioRef.current.currentTime;
        }
        setIsAfter(newValue);
    };

    // Audio Logic
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const wasPlaying = isPlaying;

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

        const handleLoadedData = () => {
            setDuration(audio.duration);

            // Restore playback position after new audio loads
            if (savedTimeRef.current > 0) {
                audio.currentTime = savedTimeRef.current;
            }

            // Resume playback if it was playing before
            if (wasPlaying) {
                audio.play().catch(() => setIsPlaying(false));
            }
        };

        audio.addEventListener("timeupdate", updateProgress);
        audio.addEventListener("ended", handleEnded);
        audio.addEventListener("loadeddata", handleLoadedData);

        return () => {
            audio.removeEventListener("timeupdate", updateProgress);
            audio.removeEventListener("ended", handleEnded);
            audio.removeEventListener("loadeddata", handleLoadedData);
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

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = parseFloat(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
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
                <section className="relative w-full min-h-[60vh] md:min-h-[70vh] flex flex-col items-center justify-center pt-6 md:pt-10 overflow-hidden font-sans rounded-[2.5rem] border border-white/5">
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
                        <div className="flex bg-black/40 rounded-full p-1 mb-6 md:mb-12 border border-white/10 scale-90 md:scale-100 origin-top">
                            <button
                                onClick={() => toggleBeforeAfter(false)}
                                className={`px-6 md:px-8 py-2 rounded-full text-xs md:text-sm font-bold tracking-widest uppercase transition-all duration-300 ${!isAfter
                                    ? "bg-white/20 backdrop-blur-md text-white shadow-lg border border-white/10"
                                    : "text-white/60 hover:text-white"
                                    }`}
                            >
                                Before
                            </button>
                            <button
                                onClick={() => toggleBeforeAfter(true)}
                                className={`px-6 md:px-8 py-2 rounded-full text-xs md:text-sm font-bold tracking-widest uppercase transition-all duration-300 ${isAfter
                                    ? "bg-white/20 backdrop-blur-md text-white shadow-lg border border-white/10"
                                    : "text-white/60 hover:text-white"
                                    }`}
                            >
                                After
                            </button>
                        </div>

                        {/* 3D Carousel (Cover Flow) */}
                        <div className="relative w-full h-[320px] md:h-[420px] flex items-center justify-center mb-0" style={{ perspective: "1000px" }}>
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
                            <a
                                href={songData[currentIndex].spotifyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-8 py-2 rounded-full bg-[#000000]/60 backdrop-blur-xl border border-white/5 flex items-center gap-3 shadow-lg transition-all hover:bg-[#000000]/80 group hover:scale-105 cursor-pointer"
                            >
                                <div className="flex flex-col items-center">
                                    <h3 className="text-white text-sm font-bold tracking-wide leading-tight group-hover:text-[#1DB954] transition-colors">{songData[currentIndex].title}</h3>
                                    <p className="text-[#9CA3AF] text-[11px] font-medium leading-tight mt-0.5">{songData[currentIndex].artist}</p>
                                </div>
                            </a>
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

                            <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-y-4 md:gap-2 w-full h-full">

                                {/* Left: Playback Controls (Simple Icons) */}
                                <div className="flex items-center justify-center md:justify-start gap-6 pl-2 md:pl-6 pr-2 py-2 md:py-0 order-2 md:order-1 w-1/2 md:w-auto border-r border-white/5 md:border-none">
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
                                <div className="flex-1 w-full md:w-auto h-16 md:h-20 relative group order-1 md:order-2">

                                    {/* 1. Background & Visual Track Layer - CLIPPED to shape */}
                                    <div className="absolute inset-0 rounded-[1.5rem] bg-[#181818] overflow-hidden">
                                        {/* Track Background */}
                                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/10 w-full">
                                            {/* Progress Fill */}
                                            <div
                                                className="absolute h-full bg-gradient-to-r from-[#EA9A61] to-[#B16937] transition-all duration-100 ease-linear"
                                                style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* 2. Interactive Slider Layer - UNCLIPPED for Thumb */}
                                    <div className="absolute top-0 left-0 right-0 h-1.5 w-full cursor-pointer group/slider z-20 rounded-[1.5rem]">
                                        {/* Interactive Hover Area & Input */}
                                        <div className="absolute -top-2 -bottom-2 inset-x-0 flex items-center group-hover/slider:h-4 transition-all">
                                            <input
                                                type="range"
                                                min="0"
                                                max={duration || 0}
                                                step="0.1"
                                                value={currentTime}
                                                onChange={handleSeek}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                        </div>

                                        {/* Thumb indicator */}
                                        <div
                                            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover/slider:opacity-100 transition-opacity pointer-events-none"
                                            style={{ left: `${(currentTime / (duration || 1)) * 100}%`, transform: 'translate(-50%, -50%)' }}
                                        />
                                    </div>

                                    {/* 3. Content Layer - Relative to sit above background */}
                                    <div className="relative h-full flex flex-col justify-center px-4 z-10 pointer-events-none">
                                        <div className="flex items-center justify-between w-full gap-4 mt-2 pointer-events-auto">
                                            {/* Art + Info (Link to Spotify) */}
                                            <a
                                                href={songData[currentIndex].spotifyUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 min-w-0 group/info cursor-pointer hover:opacity-80 transition-opacity"
                                            >
                                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-md overflow-hidden flex-shrink-0 relative">
                                                    <Image src={songData[currentIndex].cover} fill className="object-cover" alt="art" sizes="40px" priority />
                                                </div>
                                                <div className="flex flex-col min-w-0 justify-center text-left">
                                                    <span className="text-white text-xs md:text-[13px] font-semibold truncate leading-tight group-hover/info:text-[#1DB954] transition-colors">{songData[currentIndex].title}</span>
                                                    <span className="text-[#9CA3AF] text-[10px] md:text-[11px] truncate leading-tight">{songData[currentIndex].artist} - {songData[currentIndex].album}</span>
                                                </div>
                                            </a>

                                            {/* Timer Status Icon (Pulse) */}
                                            <div className="flex items-center gap-3 flex-shrink-0">
                                                <span className="text-[#9CA3AF] text-[10px] md:text-xs font-mono tabular-nums">{formatTime(currentTime)} / {formatTime(duration)}</span>
                                                <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-white/10 flex items-center justify-center">
                                                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white animate-pulse" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Auxiliary Controls (Functional) */}
                                <div className="flex items-center justify-center md:justify-end gap-5 pr-2 pl-2 md:pl-2 md:pr-6 py-2 md:py-0 order-3 md:order-3 text-[#E5E7EB] w-1/2 md:w-auto">
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
