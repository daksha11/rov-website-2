/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client"
import { useRef, useState, useEffect } from "react";
import { SkipBack, SkipForward, Play, Pause } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutBanner() {
  const [isAfter, setIsAfter] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const beforeSong = [
    {
      title: "MARTYR",
      artist: "DDK",
      src: "/audio/beforemp3/martyrbefore.mp3",
      coverl_img: "/assets/songCovers/01.webp"
    },
    {
      title: "BACK IN TIME",
      artist: "Sam Suen",
      src: "/audio/beforemp3/backintimebefore.mp3",
      coverl_img: "/assets/songCovers/02.webp"
    },
    {
      title: "YKWIW",
      artist: "Basu",
      src: "/audio/beforemp3/ykwiwbefore.mp3",
      coverl_img: "/assets/songCovers/03.webp"
    },
    {
      title: "GUAP",
      artist: "Sniper J",
      src: "/audio/beforemp3/guapbefore.mp3",
      coverl_img: "/assets/songCovers/07.webp"
    },
    {
      title: "GIMME YOUR LOVE",
      artist: "Basu",
      src: "/audio/beforemp3/gimmeyourlovebefore.mp3",
      coverl_img: "/assets/songCovers/13.webp"
    },
    {
      title: "TALK MY SHIT",
      artist: "DDK",
      src: "/audio/beforemp3/talkmyshitbefore.mp3",
      coverl_img: "/assets/songCovers/14.webp"
    },
  ];

  const afterSong = [
    {
      title: "MARTYR",
      artist: "DDK",
      src: "/audio/aftermp3/martyrafter.mp3",
      coverl_img: "/assets/songCovers/01.webp"
    },
    {
      title: "BACK IN TIME",
      artist: "Sam Suen",
      src: "/audio/aftermp3/backintimeafter.mp3",
      coverl_img: "/assets/songCovers/02.webp"
    },
    {
      title: "YKWIW",
      artist: "Basu",
      src: "/audio/aftermp3/ykwiwafter.mp3",
      coverl_img: "/assets/songCovers/03.webp"
    },
    {
      title: "GUAP",
      artist: "Sniper J",
      src: "/audio/aftermp3/guapafter.mp3",
      coverl_img: "/assets/songCovers/07.webp"
    },
    {
      title: "GIMME YOUR LOVE",
      artist: "Basu",
      src: "/audio/aftermp3/gimmeyourloveafter.mp3",
      coverl_img: "/assets/songCovers/13.webp"
    },
    {
      title: "TALK MY SHIT",
      artist: "DDK",
      src: "/audio/aftermp3/talkmyshitafter.mp3",
      coverl_img: "/assets/songCovers/14.webp"
    },
  ];

  const songList = isAfter ? afterSong : beforeSong;
  const currentSong = songList[currentIndex];

 useEffect(() => {
  const audio = audioRef.current;
  if (!audio) return;

  const updateMetadata = () => {
    setDuration(audio.duration || 0);
  };

  const updateTime = () => {
    setCurrentTime(audio.currentTime || 0);
    setProgress(((audio.currentTime || 0) / (audio.duration || 1)) * 100);
  };

  const handleEnded = () => {
    handleNext();
  };

  if (audio.readyState >= 1) {
    updateMetadata();
  } else {
    audio.addEventListener("loadedmetadata", updateMetadata);
  }

  audio.addEventListener("timeupdate", updateTime);
  audio.addEventListener("ended", handleEnded);

  return () => {
    audio.removeEventListener("loadedmetadata", updateMetadata);
    audio.removeEventListener("timeupdate", updateTime);
    audio.removeEventListener("ended", handleEnded);
  };
}, [currentIndex, isAfter]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1 < songList.length ? prev + 1 : 0));
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 >= 0 ? prev - 1 : songList.length - 1));
    setIsPlaying(true);
  };

const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (audioRef.current) {
    const newProgress = parseFloat(e.target.value);
    if (duration > 0) {
      const newTime = (newProgress / 100) * duration;
      audioRef.current.currentTime = newTime;
      setProgress(newProgress);
    } else {
      const audio = audioRef.current;
      const trySeek = () => {
        const newTime = (newProgress / 100) * (audio.duration || 0);
        audio.currentTime = newTime;
        setProgress(newProgress);
        audio.removeEventListener("loadedmetadata", trySeek);
      };
      audio.addEventListener("loadedmetadata", trySeek);
    }
  }
};

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const text = "HEAR THE DIFFERENCE";
  const letters = text.split("");

  return (
    <div
      role="img"
      aria-label="ROV Studios music production environment"
      className="relative h-auto py-24 w-full bg-cover bg-center flex flex-col md:flex-row items-center justify-between"
      style={{ backgroundImage: "url('/assets/background/1.webp')" }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="container mx-auto grid grid-cols-1 md:grid-cols-12 md:gap-0 gap-10 items-center relative">
        {/* Content Section */}
        <div className="relative text-white space-y-6 md:col-span-6  pl-8">
          {/* Heading */}
          <motion.h1
            style={{ fontFamily: "anton" }}
            className="text-4xl md:text-7xl leading-tight"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: false }}
          >
            <span className="text-[#ccc8be]">RAW.</span>{" "}
            <span className="text-[#6ebbcc]">REFINED.</span>
            <br />
            <span className="text-[#cb644b]">RELEASED.</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            style={{ fontFamily: "pagaki" }}
            className="text-2xl md:text-6xl  text-[#ccc8be]"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 }}
          >
            YOUR SOUND,<br /> UNLEASHED IN 48 <br /> HOURS.
          </motion.p>

          {/* Tagline */}
          <motion.p
            style={{ fontFamily: "Boke Rough" }}
            className="lg:ml-20 ml-0 text-lg md:text-5xl font-serif text-[#ccc8be]"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
            viewport={{ once: false }}
          >
            from bedroom demos to radio-ready hits
          </motion.p>
        </div>


        {/* Music Player Section */}
        <div className="relative w-full lg:p-0 p-3 md:ml-16 flex flex-col justify-center md:col-span-6">
          <div
            className="absolute xl:left-[103px] lg:left-10 top-80 -translate-y-1/2 rotate-[-90deg] origin-left text-3xl hidden md:flex"
            style={{ fontFamily: "futura" }}
          >
            {letters.map((char, i) => {
              const fillPoint = (i / letters.length) * 100;
              const nextPoint = ((i + 1) / letters.length) * 100;
              const color =
                progress >= nextPoint
                  ? "#695554"
                  : progress >= fillPoint
                    ? `color-mix(in srgb, white ${(nextPoint - progress) / (nextPoint - fillPoint) * 100}%, #695554 ${(progress - fillPoint) / (nextPoint - fillPoint) * 100}%)`
                    : "#ffffff";
              return (
                <span
                  key={i}
                  style={{
                    color,
                    transition: "color 0.2s linear",
                    display: char === " " ? "inline-block" : "inline",
                    width: char === " " ? "0.3em" : "auto",
                  }}
                >
                  {char}
                </span>
              );
            })}
          </div>

          {/* Toggle Buttons */}
          <div style={{ fontFamily: "Boke Rough" }} className="flex justify-center z-10 text-white">
            <div
              onClick={() => {
                if (isAfter) setIsAfter(false);
              }}
              className={`px-6 py-2 text-xl  rounded-l-full cursor-pointer ${!isAfter ? "bg-white text-[#302218]" : "bg-[#302218] text-white"
                }`}
            >
              Before
            </div>
            <div
              onClick={() => {
                if (!isAfter) setIsAfter(true);
              }}
              className={`px-6 py-2  text-xl rounded-r-full cursor-pointer ${isAfter ? "bg-white text-[#302218]" : "bg-[#302218] text-white"
                }`}
            >
              After
            </div>
          </div>

          {/* Music Card */}
          <div
            className="md:h-[530px] h-[470px] mx-auto -mt-[13px] rounded-4xl relative overflow-hidden lg:w-[430px] w-full flex flex-col items-center"
            style={{
              backgroundImage: "url('/assets/images/musicbg.webp')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Overlay*/}
            <div className="absolute inset-0 bg-[#d5cfcb]/20"></div>

            <div className="relative z-10 flex flex-col items-center w-full h-full">
              {/* Album Cover */}
              <div className="relative flex items-center justify-center w-full ">
                <button
                  onClick={handlePrev}
                  className="absolute left-2 md:left-4 text-[#302218] hover:scale-110 transition cursor-pointer z-20"
                >
                  <SkipBack size={23} />
                </button>
                <div className="w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] md:w-[340px] md:h-[340px] relative">
                  <img
                    src={currentSong?.coverl_img || "/assets/images/musicimg.webp"}
                    className="h-full w-full object-contain pt-6"
                    alt={currentSong?.title ? `${currentSong.title} album cover` : "Album cover"}
                  />
                </div>
                <button
                  onClick={handleNext}
                  className="absolute right-2 md:right-4 text-[#302218] hover:scale-110 transition cursor-pointer z-20"
                >
                  <SkipForward size={23} />
                </button>
              </div>

              {/* Song Title */}
              <p style={{ fontFamily: "pagaki" }} className="text-2xl lowercase text-center text-[#302218] mt-4">
                {currentSong.title}
              </p>

              <p style={{ fontFamily: "futura" }} className="text-2xl mt-1 lowercase text-[#302218] text-center">{currentSong.artist}</p>

              {/* Progress Bar */}
              <div className="w-full px-8  flex items-center gap-2">
                <span className="text-sm text-[#302218]">{formatTime(currentTime)}</span>
                <input
                  type="range"
                  value={progress}
                  onChange={handleSeek}
                  className="w-full accent-[#302218] cursor-pointer"
                />
                <span className="text-sm text-[#302218]">{formatTime(duration)}</span>
              </div>

              {/* Player Controls */}
              <div className="w-full flex items-center justify-center gap-6 px-10 my-4">
                <button onClick={handlePrev} className="text-[#302218] hover:scale-110 transition cursor-pointer">
                  <SkipBack size={28} strokeWidth={2} />
                </button>

                <button
                  onClick={togglePlayPause}
                  className="border border-[#302218] cursor-pointer text-transparent p-3 rounded-full hover:scale-110 transition"
                >
                  {isPlaying ? <Pause size={28} fill="#302218" /> : <Play size={28} fill="#302218" />}
                </button>

                <button onClick={handleNext} className="text-[#302218] cursor-pointer hover:scale-110 transition">
                  <SkipForward size={28} strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Hidden Audio Element */}
      <audio ref={audioRef} src={currentSong.src} autoPlay={isPlaying}></audio>
    </div>
  );
}