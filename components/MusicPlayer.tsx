"use client";

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Shuffle, Mail, Instagram, Linkedin } from 'lucide-react';
import { cn } from '@/lib/utils';
import styled from 'styled-components';

interface Track {
  id: number;
  title: string;
  artist: string;
  duration: string;
  cover: string;
  url: string;
}

// Before production tracks (raw versions)
const beforeTracks: Track[] = [
  {
    id: 1,
    title: "Martyr",
    artist: "DDK",
    duration: "2:39",
    cover: "/cover7.webp",
    url: "/tracks/before/MARTYR BEFORE.mp3"
  },
  {
    id: 2,
    title: "Be My Tine",
    artist: "Sam Suen",
    duration: "2:40",
    cover: "/cover10.webp",
    url: "/tracks/before/BE MY TINE BEFORE.mp3"
  },
  {
    id: 3,
    title: "you could be my woman",
    artist: "Basu",
    duration: "2:46",
    cover: "/cover1.webp",
    url: "/tracks/before/TOU COULD BE MY WOMAN BEFORE.mp3"
  },
  {
    id: 4,
    title: "Talk my shit",
    artist: "DDK",
    duration: "1:48",
    cover: "/cover11.webp",
    url: "/tracks/before/talk my shit before.mp3"
  },
  {
    id: 5,
    title: "maryland marauders",
    artist: "DDK",
    duration: "2:16",
    cover: "/cover11.webp",
    url: "/tracks/before/MARYLAND MARAUDERS BEFORE.mp3"
  },
  {
    id: 6,
    title: "WANNA KNOW",
    artist: "Adil Hasan",
    duration: "2:51",
    cover: "/cover4.webp",
    url: "/tracks/before/WANNA KNOW BEFORE.mp3"
  },
  {
    id: 7,
    title: "Kiss of Death",
    artist: "Sniper J",
    duration: "2:36",
    cover: "/cover8.webp",
    url: "/tracks/before/KOD BEFORE.mp3"
  },
];

// After production tracks (mastered versions)
const afterTracks: Track[] = [
  {
    id: 1,
    title: "Martyr",
    artist: "DDK",
    duration: "2:39",
    cover: "/cover7.webp",
    url: "/tracks/after/MARTYR AFTER.mp3"
  },
  {
    id: 2,
    title: "Be My Tine",
    artist: "Sam Suen",
    duration: "2:40",
    cover: "/cover10.webp",
    url: "/tracks/after/BE MY TINE AFTER.mp3"
  },
  {
    id: 3,
    title: "you could be my woman",
    artist: "Basu",
    duration: "2:46",
    cover: "/cover1.webp",
    url: "/tracks/after/YOU COULD BE MY WOMAN AFTER.mp3"
  },
  {
    id: 4,
    title: "Talk my shit",
    artist: "DDK",
    duration: "1:48",
    cover: "/cover11.webp",
    url: "/tracks/after/TALK MY SHIT AFTER.mp3"
  },
  {
    id: 5,
    title: "maryland marauders",
    artist: "DDK",
    duration: "2:16",
    cover: "/cover11.webp",
    url: "/tracks/after/MARYLAND MARAUDERS AFTER.mp3"
  },
  {
    id: 6,
    title: "WANNA KNOW",
    artist: "Adil Hasan",
    duration: "2:51",
    cover: "/cover4.webp",
    url: "/tracks/after/WANNA KNOW AFTER.mp3"
  },
  {
    id: 7,
    title: "Kiss of Death",
    artist: "Sniper J",
    duration: "2:36",
    cover: "/cover8.webp",
    url: "/tracks/after/KOD AFTER.mp3"
  },
];

const StyledToggleWrapper = styled.div`
  .toggle-border {
    border: 2px solid #f0ebeb;
    border-radius: 130px;
    margin-bottom: 45px;
    padding: 1px 2px;
    background: linear-gradient(to bottom right, white, rgba(220,220,220,.5)), white;
    box-shadow: 0 0 0 2px #fbfbfb;
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  .toggle-border:last-child {
    margin-bottom: 0;
  }

  .toggle-border input[type="checkbox"] {
    display: none;
  }

  .toggle-border label {
    position: relative;
    display: inline-block;
    width: 65px;
    height: 20px;
    background: #d13613;
    border-radius: 80px;
    cursor: pointer;
    box-shadow: inset 0 0 16px rgba(0,0,0,.3);
    transition: background .5s;
  }

  .toggle-border input[type="checkbox"]:checked + label {
    background: #13d162;
  }

  .handle {
    position: absolute;
    top: -8px;
    left: -10px;
    width: 35px;
    height: 35px;
    border: 1px solid #e5e5e5;
    background: repeating-radial-gradient(circle at 50% 50%, rgba(200,200,200,.2) 0%, rgba(200,200,200,.2) 2%, transparent 2%, transparent 3%, rgba(200,200,200,.2) 3%, transparent 3%), conic-gradient(white 0%, silver 10%, white 35%, silver 45%, white 60%, silver 70%, white 80%, silver 95%, white 100%);
    border-radius: 50%;
    box-shadow: 3px 5px 10px 0 rgba(0,0,0,.4);
    transition: left .4s;
  }

  .toggle-border input[type="checkbox"]:checked + label > .handle {
    left: calc(100% - 35px + 10px);
  }
`;

const CustomToggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => {
  return (
    <StyledToggleWrapper>
      <div className="toggle-border">
        <input 
          id="trackToggle" 
          type="checkbox" 
          checked={checked}
          onChange={onChange}
        />
        <label htmlFor="trackToggle">
          <div className="handle" />
        </label>
      </div>
    </StyledToggleWrapper>
  );
}

export default function MusicPlayer() {
  const [currentTrack, setCurrentTrack] = useState<Track>(beforeTracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTrackSet, setActiveTrackSet] = useState<'before' | 'after'>('before');

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Get the current active track set
  const getActiveTracks = () => activeTrackSet === 'before' ? beforeTracks : afterTracks;

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
    const currentTracks = getActiveTracks();
    const currentIndex = currentTracks.findIndex(track => track.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % currentTracks.length;
    setCurrentTrack(currentTracks[nextIndex]);
    setTimeout(startPlayback, 0);
  };

  const playPrevious = () => {
    const currentTracks = getActiveTracks();
    const currentIndex = currentTracks.findIndex(track => track.id === currentTrack.id);
    const previousIndex = (currentIndex - 1 + currentTracks.length) % currentTracks.length;
    setCurrentTrack(currentTracks[previousIndex]);
    setTimeout(startPlayback, 0);
  };

  const handleTrackSelect = (track: Track) => {
    if (track.id === currentTrack.id) {
      togglePlay();
    } else {
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

  const artistLinks: { [key: string]: string } = {
    "Basu": "https://open.spotify.com/artist/1jvWl3rF1B79uoLznEir6D?si=AsD_zCpcQHyW6n80fSb_qA",
    "Adil Hasan": "https://open.spotify.com/artist/7kx8kuU4Icm0YHB7JEUmk4?si=sLJb79zNS-qkes64mPHHEw",
    "DDK": "https://open.spotify.com/artist/7AfTMScTc5pSfjjxtatrIq?si=Qs5Tq616QYOM-1JI9Vz3lw",
    "mttw": "https://open.spotify.com/artist/2FgWKkYS4KdwS3ucQ5sllQ?si=z-5f3qsKSWqrC1oIzaJ1Pg"
  };

  const titleLinks: { [key: string]: string } = {
    "Come Thru": "https://open.spotify.com/track/2f8SxYTeN8QthJpOQ5JZWe?si=56ab33bbde704598",
    "you could be my woman": "https://open.spotify.com/track/78bezRj4TvB0XJhpsfOi48?si=97302401b91840b9",
    "Martyr": "https://open.spotify.com/track/7ymgwXU8OoCIMu6yoZwUiP?si=20a1d7f58db54682",
    "Kiss Of Death": "https://open.spotify.com/track/0Zb2kzvTZSonkLznRaUfLC?si=7cb9d071f9024613",
    "up late, up early": "https://open.spotify.com/track/53XXNcYJvxiUSYM98cai0U?si=d8f3936455e14e00",
    "ruin my life": "https://open.spotify.com/track/4zbcB7wvnDzwaliXiyfL9y?si=3e9fdd8318dc47da",
    "LAST TIME": "https://open.spotify.com/track/1ySQDN5qn1g6DofXjNVNQ3?si=c442fc17586f4b4e"
  };

  const renderArtistLinks = (artistString: string) => {
    const artists = artistString.split(',').map(artist => artist.trim());
    return artists.map((artist, index) => (
      <span key={artist}>
        <a 
          href={artistLinks[artist] || "#"}
          target="_blank" 
          rel="noopener noreferrer"
          className="text-zinc-400 hover:text-white transition-colors"
        >
          {artist}
        </a>
        {index < artists.length - 1 && <span>, </span>}
      </span>
    ));
  };

  const renderTitleLink = (title: string) => {
    return (
      <a
        href={titleLinks[title] || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="text-white hover:text-zinc-200 transition-colors"
      >
        {title}
      </a>
    );
  };

  const toggleTrackSet = () => {
    const newSet = activeTrackSet === 'before' ? 'after' : 'before';
    setActiveTrackSet(newSet);
    const newTracks = newSet === 'before' ? beforeTracks : afterTracks;
    setCurrentTrack(newTracks[0]);
    if (isPlaying) {
      setTimeout(startPlayback, 0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* TUNE IN Heading */}
      <div
        className="text-white text-4xl font-bold text-center mb-8"
        style={{ fontFamily: "Flight Maybe Maj, sans-serif" }}
      >
        <span>
          <em>Production </em> 
        </span>
        <span className="text-transparent [-webkit-text-stroke:1px_white]">
          Comparison
        </span>
      </div>

      <div className="bg-zinc-800/50 rounded-lg p-6 backdrop-blur-lg shadow-xl">
        {/* Track Set Toggle */}
        <div className="flex justify-end items-center mb-4 space-x-4">
          <span className="text-sm text-zinc-400">Before</span>
          <CustomToggle 
            checked={activeTrackSet === 'after'}
            onChange={toggleTrackSet}
          />
          <span className="text-sm text-zinc-400">After</span>
        </div>

        {/* Now Playing */}
        <div className="flex items-center justify-between space-x-6">
          <div className="flex items-center space-x-6">
            <img 
              src={currentTrack.cover} 
              alt={currentTrack.title}
              className="w-20 h-20 md:w-32 md:h-32 rounded-lg shadow-lg"
            />
            <div>
              <h2 className="text-lg md:text-2xl font-bold" style={{ fontFamily: 'Flight Maybe Maj, sans-serif' }}>
                {renderTitleLink(currentTrack.title)}
              </h2>
              <p 
                className="text-sm md:text-base"
                style={{ fontFamily: 'Proxima Nova, sans-serif' }}
              >
                {renderArtistLinks(currentTrack.artist)}
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                {activeTrackSet === 'before' ? 'Pre-Production Version' : 'Post-Production Master'}
              </p>
            </div>
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
          <span>{ formatTime(currentTime) }</span>
          <span>{ formatTime(duration) }</span>
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
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {getActiveTracks().map((track) => (
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
                  <p className="font-medium" style={{ fontFamily: 'Flight Maybe Maj, sans-serif' }}>
                    {track.title}
                  </p>
                  <p className="text-sm text-zinc-400" style={{ fontFamily: 'Proxima Nova, sans-serif' }}>
                    {track.artist}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {activeTrackSet === 'before' ? 'Pre-Production' : 'Post-Production'}
                  </p>
                </div>
                <span className="ml-auto text-sm text-zinc-400" style={{ fontFamily: 'Proxima Nova, sans-serif' }}>
                  {track.duration}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Us Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setModalOpen(true)}
            className="px-6 py-2 bg-white text-black rounded-full hover:bg-zinc-200 transition-colors uppercase tracking-wide text-sm md:text-base"
            style={{ fontFamily: "Flight Maybe Maj, sans-serif" }}
          >
            Contact Us
          </button>
        </div>

        <audio
          ref={audioRef}
          src={currentTrack.url}
          onTimeUpdate={handleTimeUpdate}
          onEnded={playNext}
          loop={isRepeating}
        />
      </div>

      {/* Contact Us Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div
            className="bg-black text-white p-8 rounded-lg shadow-lg text-center w-96 relative border border-gray-700"
            style={{ fontFamily: "Flight Maybe Maj, sans-serif" }}
          >
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
              onClick={() => setModalOpen(false)}
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <div className="flex flex-col gap-4">
              <a
                href="mailto:rangeofview@rovstudios.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Mail className="w-5 h-5 text-white" />
                Email
              </a>
              <a
                href="https://www.instagram.com/rangeofviewstudios/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Instagram className="w-5 h-5 text-pink-500" />
                Instagram
              </a>
              <a
                href="https://www.linkedin.com/company/range-of-view-studios/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Linkedin className="w-5 h-5 text-blue-500" />
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}