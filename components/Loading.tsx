'use client';
import { useState, useRef, useEffect } from 'react';

interface LoadingProps {
  onLoadingComplete?: () => void;
}

export default function Loading({ onLoadingComplete }: LoadingProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Check both sessionStorage and global flag
    const hasLoadedBefore =
      typeof window !== 'undefined' &&
      (sessionStorage.getItem('hasLoadedOnce') === 'true' ||
        (window as any).hasLoadedOnce === true);

    if (hasLoadedBefore) {
      setIsLoading(false);
      if (onLoadingComplete) onLoadingComplete();
      return;
    }

    // If first load, play video
    const video = videoRef.current;
    if (video) {
      video.play().catch(console.error);
    }

    // Simulate progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(progressInterval);
  }, [onLoadingComplete]);

  const finishLoading = () => {
    // Mark as loaded globally and in sessionStorage
    if (typeof window !== 'undefined') {
      (window as any).hasLoadedOnce = true;
      sessionStorage.setItem('hasLoadedOnce', 'true');
    }

    setIsLoading(false);
    if (onLoadingComplete) onLoadingComplete();
  };

  const handleVideoEnd = finishLoading;
  const handleVideoError = finishLoading;

  if (!isLoading) return null;

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-black relative z-[9999] fixed inset-0 overflow-hidden">
      {/* Background Video */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover absolute inset-0"
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnd}
        onError={handleVideoError}
        aria-label="Range of View Studios loading animation"
        title="ROV Studios"
      >
        <source src="/loading.mp4" type="video/mp4" />
      </video>

      {/* Loading Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        {/* Glassmorphic Container */}
        <div className="relative flex flex-col items-center gap-8 p-12 rounded-3xl backdrop-blur-md bg-black/30 border border-[#F99288]/20 shadow-2xl">
          {/* Animated Logo/Text */}
          <div className="relative">
            <h1
              className="text-white font-bold tracking-wider animate-pulse"
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontFamily: 'Norwige, sans-serif',
                textShadow: '0 0 30px rgba(234, 154, 97, 0.5)'
              }}
            >
              RANGE OF VIEW
            </h1>

            {/* Animated underline with gradient */}
            <div
              className="absolute -bottom-4 left-0 right-0 h-1 rounded-full opacity-60 animate-pulse"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(234, 154, 97, 1) 20%, rgba(177, 105, 55, 1) 50%, rgba(234, 154, 97, 1) 80%, transparent)'
              }}
            />
          </div>

          {/* Loading Text */}
          <p
            className="text-white/80 tracking-widest animate-pulse"
            style={{
              fontSize: 'clamp(0.875rem, 2vw, 1.125rem)',
              fontFamily: 'Norwige Light, sans-serif',
              letterSpacing: '0.3em'
            }}
          >
            LOADING EXPERIENCE
          </p>

          {/* Progress Bar Container */}
          <div className="w-full max-w-md">
            <div className="relative w-full h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-[#F99288]/10">
              {/* Progress Fill with website gradient */}
              <div
                className="absolute top-0 left-0 h-full rounded-full transition-all duration-300 ease-out"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, rgba(234, 154, 97, 1) 0%, rgba(177, 105, 55, 1) 50%, rgba(166, 77, 43, 1) 100%)',
                  boxShadow: '0 0 20px rgba(234, 154, 97, 0.6)'
                }}
              />

              {/* Shimmer Effect with matching colors */}
              <div
                className="absolute top-0 left-0 h-full w-full animate-shimmer"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(234, 154, 97, 0.4) 50%, transparent)',
                  backgroundSize: '200% 100%'
                }}
              />
            </div>

            {/* Progress Percentage */}
            <p
              className="text-white/60 text-center mt-3 tabular-nums"
              style={{
                fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                fontFamily: 'Norwige, sans-serif'
              }}
            >
              {progress}%
            </p>
          </div>

          {/* Animated Dots with gradient color */}
          <div className="flex gap-2">
            <div
              className="w-2 h-2 rounded-full animate-bounce"
              style={{
                animationDelay: '0ms',
                background: 'rgba(234, 154, 97, 0.8)'
              }}
            />
            <div
              className="w-2 h-2 rounded-full animate-bounce"
              style={{
                animationDelay: '150ms',
                background: 'rgba(177, 105, 55, 0.8)'
              }}
            />
            <div
              className="w-2 h-2 rounded-full animate-bounce"
              style={{
                animationDelay: '300ms',
                background: 'rgba(166, 77, 43, 0.8)'
              }}
            />
          </div>
        </div>
      </div>

      {/* Fallback for browsers that don't support video */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <noscript>
          <h1 className="text-white text-4xl font-bold">
            RANGE OF VIEW
          </h1>
        </noscript>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}
