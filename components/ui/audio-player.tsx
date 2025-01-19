"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface Track {
  title: string;
  artist: string;
  duration: string;
  url: string;
}

interface AudioPlayerProps {
  tracks: Track[];
}

export function AudioPlayer({ tracks }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState([0.8]);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0];
    }
  }, [volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleTrackChange = (direction: "next" | "prev") => {
    const newTrack = direction === "next" 
      ? (currentTrack + 1) % tracks.length 
      : (currentTrack - 1 + tracks.length) % tracks.length;
    setCurrentTrack(newTrack);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.load();
      audioRef.current.play();
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-zinc-900 p-6 rounded-lg">
      <audio
        ref={audioRef}
        src={tracks[currentTrack].url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => handleTrackChange("next")}
      />
      
      <div className="mb-4">
        <h3 className="text-xl font-bold">{tracks[currentTrack].title}</h3>
        <p className="text-gray-400">{tracks[currentTrack].artist}</p>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => handleTrackChange("prev")}
          className="p-2 hover:bg-zinc-800 rounded-full transition"
        >
          <SkipBack className="w-6 h-6" />
        </button>
        
        <button
          onClick={togglePlay}
          className="p-4 bg-white text-black rounded-full hover:bg-gray-200 transition"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6" />
          )}
        </button>

        <button
          onClick={() => handleTrackChange("next")}
          className="p-2 hover:bg-zinc-800 rounded-full transition"
        >
          <SkipForward className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-400 w-12">
          {formatTime(currentTime)}
        </span>
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={1}
          className="flex-1"
          onValueChange={(value) => {
            if (audioRef.current) {
              audioRef.current.currentTime = value[0];
              setCurrentTime(value[0]);
            }
          }}
        />
        <span className="text-sm text-gray-400 w-12">
          {formatTime(duration)}
        </span>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <Volume2 className="w-4 h-4 text-gray-400" />
        <Slider
          value={volume}
          max={1}
          step={0.01}
          className="w-24"
          onValueChange={setVolume}
        />
      </div>
    </div>
  );
}