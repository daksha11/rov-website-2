"use client";

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Shuffle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Track {
  id: number;
  title: string;
  artist: string;
  duration: string;
  cover: string;
  url: string;
}

const tracks: Track[] = [
  {
    id: 1,
    title: "Come Thru",
    artist: "Basu",
    duration: "2:17",
    cover: "cover2.png", // Updated path to the image in the public folder
    url: "/tracks/come thru master(go first).wav" // Updated to .wav
  },
  {
    id: 2,
    title: "LAST TIME",
    artist: "Adil Hasan",
    duration: "2:40",
    cover: "cover4.png",
    url: "/tracks/last time master.wav" // Updated to .wav 
  },
  {
    id: 3,
    title: "Martyr",
    artist: "DDK",
    duration: "2:40",
    cover: "cover7.png",
    url: "/tracks/martry new new master.wav" // Updated to .wav
  },
  {
    id: 4,
    title: "KOD",
    artist: "Basu",
    duration: "2:36",
    cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=300&fit=crop",
    url: "/tracks/master kod.wav" // Updated to .wav
  },
  {
    id: 5,
    title: "up late, up early",
    artist: "DDK",
    duration: "3:12",
    cover: "cover5.png",
    url: "/tracks/master up late final.wav" // Updated to .wav
  },
  {
    id: 6,
    title: "ruin my life",
    artist: "mttw, Basu",
    duration: "2:10",
    cover: "cover6.png",
    url: "/tracks/ruin my life master.wav" // Updated to .wav
  },
  {
    id: 7,
    title: "you could be my woman",
    artist: "Basu",
    duration: "2:46",
    cover: "cover1.png",
    url: "/tracks/you could be my woman.wav" // Updated to .wav
  }
];

export default function MusicPlayer() {
  const [currentTrack, setCurrentTrack] = useState<Track>(tracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const startPlayback = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const playNext = () => {
    const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    setCurrentTrack(tracks[nextIndex]);
    // Automatically start playing for next/previous
    setTimeout(startPlayback, 0);
  };

  const playPrevious = () => {
    const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
    const previousIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrack(tracks[previousIndex]);
    // Automatically start playing for next/previous
    setTimeout(startPlayback, 0);
  };

  const handleTrackSelect = (track: Track) => {
    if (track.id === currentTrack.id) {
      // If selecting the current track, toggle play/pause
      togglePlay();
    } else {
      // If selecting a different track, change track and start playing
      setCurrentTrack(track);
      setTimeout(startPlayback, 0);
    }
  };

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

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current && audioRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      audioRef.current.currentTime = pos * audioRef.current.duration;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-zinc-800/50 rounded-lg p-6 backdrop-blur-lg shadow-xl">
        {/* Now Playing */}
        <div className="flex items-center space-x-6">
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title}
            className="w-32 h-32 rounded-lg shadow-lg"
          />
          <div>
            <h2 className="text-2xl font-bold">{currentTrack.title}</h2>
            <p className="text-zinc-400">{currentTrack.artist}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div 
          ref={progressBarRef}
          className="mt-6 h-1 bg-zinc-600 rounded-full cursor-pointer"
          onClick={handleProgressBarClick}
        >
          <div 
            className="h-full bg-white rounded-full"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>
        
        <div className="flex justify-between text-sm mt-1 text-zinc-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        {/* Controls */}
        <div className="mt-6 flex items-center justify-center space-x-6">
          <button 
            onClick={() => setIsShuffled(!isShuffled)}
            className={cn(
              "p-2 rounded-full hover:bg-zinc-700 transition",
              isShuffled && "text-green-500"
            )}
          >
            <Shuffle size={20} />
          </button>
          <button 
            onClick={playPrevious}
            className="p-2 rounded-full hover:bg-zinc-700 transition"
          >
            <SkipBack size={24} />
          </button>
          <button 
            onClick={togglePlay}
            className="p-4 bg-white text-black rounded-full hover:bg-zinc-200 transition"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <button 
            onClick={playNext}
            className="p-2 rounded-full hover:bg-zinc-700 transition"
          >
            <SkipForward size={24} />
          </button>
          <button 
            onClick={() => setIsRepeating(!isRepeating)}
            className={cn(
              "p-2 rounded-full hover:bg-zinc-700 transition",
              isRepeating && "text-green-500"
            )}
          >
            <Repeat size={20} />
          </button>
        </div>

        {/* Volume Control */}
        <div className="mt-6 flex items-center space-x-2">
          <button onClick={toggleMute} className="p-2 hover:bg-zinc-700 rounded-full transition">
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-24 accent-white"
          />
        </div>

        {/* Playlist */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Up Next</h3>
          <div className="space-y-2">
            {tracks.map((track) => (
              <div 
                key={track.id}
                onClick={() => handleTrackSelect(track)}
                className={cn(
                  "flex items-center p-2 rounded-lg hover:bg-zinc-700/50 cursor-pointer transition",
                  currentTrack.id === track.id && "bg-zinc-700/50"
                )}
              >
                <img 
                  src={track.cover} 
                  alt={track.title}
                  className="w-12 h-12 rounded"
                />
                <div className="ml-4">
                  <p className="font-medium">{track.title}</p>
                  <p className="text-sm text-zinc-400">{track.artist}</p>
                </div>
                <span className="ml-auto text-sm text-zinc-400">{track.duration}</span>
              </div>
            ))}
          </div>
        </div>

        <audio
          ref={audioRef}
          src={currentTrack.url}
          onTimeUpdate={handleTimeUpdate}
          onEnded={playNext}
          loop={isRepeating}
        />
      </div>
    </div>
  );
}