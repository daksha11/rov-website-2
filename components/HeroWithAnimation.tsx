'use client';

import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const LoadingOverlay = styled.div<{ $isLoaded: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  transition: opacity 0.8s ease-in-out, visibility 0.8s;
  opacity: ${props => (props.$isLoaded ? 0 : 1)};
  visibility: ${props => (props.$isLoaded ? 'hidden' : 'visible')};
`;

const LoadingText = styled.div`
  color: #FFF4E3;
  font-family: 'Norwige', sans-serif;
  font-size: 1rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: 20px;
`;

const ProgressNumber = styled.div`
  color: #FFF4E3;
  font-family: 'Norwige', sans-serif;
  font-size: clamp(4rem, 15vw, 120px);
  font-weight: 800;
  line-height: 1;
`;

const AnimationSection = styled.section`
  position: relative;
  width: 100%;
  height: 100vh; /* Single viewport - will be pinned during scroll */
  background: black;
  margin-bottom: 0;
  z-index: 100; /* Stay on top of other content while pinned */
`;

const StickyContainer = styled.div`
  position: sticky;
  top: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

const CanvasElement = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
  display: block;

  @media (max-width: 767px) {
    display: none;
  }
`;

const VideoElement = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
  display: none;

  @media (max-width: 767px) {
    display: block;
    filter: blur(3px);
  }
`;

const DimOverlay = styled.div<{ $opacity: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: black;
  opacity: ${props => props.$opacity};
  z-index: 5;
  pointer-events: none;
  transition: opacity 0.1s linear;
`;

const HeroOverlay = styled.div<{ $isVisible: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: ${props => props.$isVisible ? 'flex' : 'none'};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  color: white;
  font-family: 'ProximaNovaBlack', sans-serif;
  pointer-events: none;
  z-index: 10;
  opacity: ${props => props.$isVisible ? 1 : 0};
  transition: opacity 0.5s ease-out;

  @media (min-width: 768px) {
    padding: 80px 20px;
  }
`;

const TextOverlay = styled.div<{ $isVisible: boolean }>`
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  transform: translateY(-50%);
  pointer-events: none;
  z-index: 3;
  display: ${props => props.$isVisible ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  flex-direction: column; 
  gap: 0.5rem; /* Reduced gap for stacking context on mobile */
  padding: 0 1rem;

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 15rem;
    padding: 0 5%;
  }
`;

const CreativeText = styled.div`
  color: #FFF4E3;
  font-family: 'NorwigeMedium_Hero', sans-serif;
  font-size: clamp(2.5rem, 12vw, 100px); /* Slightly smaller min-size for mobile */
  font-weight: normal;
  font-style: normal;
  letter-spacing: 0.02em;
  line-height: 110%;
  text-align: center;
  flex: 1;
  width: 100%;
  max-width: 100%;
  
  @media (min-width: 768px) {
    text-align: right;
    max-width: 50%;
    line-height: 150%;
    font-size: clamp(3rem, 10vw, 100px);
  }
`;

const ChangingWord = styled.div`
  color: #FFF4E3;
  font-family: 'NorwigeExtraBoldItalic_Hero', sans-serif;
  font-size: clamp(2.5rem, 12vw, 100px); /* Matching mobile size adjustment */
  font-weight: normal;
  font-style: normal;
  letter-spacing: -1px; /* Tighter letter spacing on mobile */
  line-height: 110%;
  text-align: center;
  flex: 1;
  width: 100%;
  max-width: 100%;
  
  @media (min-width: 768px) {
    text-align: left;
    max-width: 50%;
    line-height: 150%;
    letter-spacing: -2.2px;
    font-size: clamp(3rem, 10vw, 100px);
  }
`;

const Logo = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 20;
  pointer-events: auto;

  img {
    width: 100px;
    height: auto;
  }

  @media (max-width: 768px) {
    top: 10px;
    left: 10px;

    img {
      width: 60px;
    }
  }
`;

const Heading = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  text-align: right;
  font-family: 'Norwige Light', sans-serif;
  letter-spacing: 0.1em;
  z-index: 20;
  pointer-events: auto;

  @media (max-width: 768px) {
    top: 10px;
    right: 10px;

    div {
      font-size: 1.5rem !important;
    }
  }
`;

function imageSequence(config: {
  urls: string[],
  canvas: HTMLCanvasElement,
  container?: HTMLElement,
  scrollTrigger?: any,
  onUpdate?: () => void
  isMobile?: boolean; // Add isMobile flag
}) {
  if (config.isMobile) {
    // If mobile, just create a dummy tween to drive the scrolltrigger
    // The video plays independently
    return gsap.to({}, {
      scrollTrigger: config.scrollTrigger
    });
  }

  let playhead = { frame: 0 };
  let ctx = config.canvas.getContext("2d");
  let onUpdate = config.onUpdate;
  let images: HTMLImageElement[];
  let canvas = config.canvas;

  const updateImage = function () {
    const img = images[Math.round(playhead.frame)];
    if (!img || !ctx) return;

    // Use window dimensions if container not provided
    const containerWidth = config.container ? config.container.clientWidth : window.innerWidth;
    const containerHeight = config.container ? config.container.clientHeight : window.innerHeight;

    // Calculate aspect ratios
    const containerAspect = containerWidth / containerHeight;
    const imageAspect = img.width > 0 ? img.width / img.height : 16 / 9;

    let renderWidth, renderHeight, offsetX = 0, offsetY = 0;

    if (imageAspect > containerAspect) {
      // Image is wider than container - fit to height
      renderHeight = containerHeight;
      renderWidth = renderHeight * imageAspect;
      offsetX = (containerWidth - renderWidth) / 2;
    } else {
      // Image is taller than container - fit to width
      renderWidth = containerWidth;
      renderHeight = renderWidth / imageAspect;
      offsetY = (containerHeight - renderHeight) / 2;
    }

    // Clear and draw
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);

    if (onUpdate) onUpdate();
  };

  images = config.urls.map((url, i) => {
    let img = new Image();
    img.src = url;
    i || (img.onload = updateImage);
    return img;
  });

  return gsap.to(playhead, {
    frame: images.length - 1,
    ease: "none",
    onUpdate: updateImage,
    scrollTrigger: config.scrollTrigger
  });
}

const HeroWithAnimation: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const creativeRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);

  const isFirstRun = useRef(true);
  const [showHero, setShowHero] = useState(true);
  const [currentWord, setCurrentWord] = useState("Identity");
  const [dimOpacity, setDimOpacity] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // New loading states
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);

  // Resize handler for canvas
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initialize on mount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-rotate words on mobile
  useEffect(() => {
    if (!isMobile) return;

    const words = ["Identity", "Systems", "Strategy"];
    let currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % words.length;
      setCurrentWord(words[currentIndex]);
    }, 2000); // Change word every 2 seconds

    return () => clearInterval(interval);
  }, [isMobile]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !canvasRef.current || !stickyRef.current) return;

    // Setup Canvas
    canvasRef.current.width = dimensions.width;
    canvasRef.current.height = dimensions.height;

    // Generate image URLs
    const urls: string[] = [];
    const frameCount = 651; // 0 to 651

    for (let i = 0; i <= frameCount; i++) {
      const numStr = String(i).padStart(5, '0');
      urls.push(`/videoFrames/SpiralShotHorizontal60fpsV2_${numStr}.webp`);
    }

    // Preload Logic (Simulated for UX, GSAP loads images too)
    let loadedCount = 0;
    const totalFrames = urls.length;
    urls.forEach(url => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / totalFrames) * 100));
        // Start showing after enough frames are loaded (e.g. 15%)
        if (loadedCount > totalFrames * 0.15) setIsLoading(false);
      };
    });

    // Wrap animation logic in a function so it can be re-run
    const initAnimations = () => {
      // Kill all existing ScrollTriggers to prevent duplicates
      ScrollTrigger.getAll().forEach(t => t.kill());

      // Image Sequence Animation
      return imageSequence({
        urls,
        canvas: canvasRef.current!,
        container: stickyRef.current!,
        isMobile, // Pass isMobile flag
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: isMobile ? '+=100' : '+=3000', // Short scroll on mobile, long on desktop
          scrub: isMobile ? false : 0.5, // No scrub on mobile
          pin: isMobile ? false : true, // No pinning on mobile
          pinSpacing: isMobile ? false : true, // No pin spacing on mobile
          onUpdate: (self: any) => {
            const progress = self.progress;

            // Only update text based on scroll on desktop
            if (!isMobile) {
              // Update text based on progress
              if (progress < 0.3) {
                setCurrentWord("Identity");
                setDimOpacity(0);
                setShowHero(true);
              } else if (progress < 0.6) {
                setCurrentWord("Systems");
                setDimOpacity(0);
                setShowHero(true);
              } else if (progress < 0.9) {
                setCurrentWord("Strategy");
                setDimOpacity(0);
                setShowHero(true);
              } else {
                // Quick fade in final 5-10%
                const fadeProgress = Math.min((progress - 0.95) / 0.05, 1);
                setDimOpacity(fadeProgress);
                if (progress > 0.98) {
                  setShowHero(false);
                }
              }
            } else {
              // On mobile, just handle the fade/hero visibility
              if (progress < 0.9) {
                setDimOpacity(0);
                setShowHero(true);
              } else {
                const fadeProgress = Math.min((progress - 0.95) / 0.05, 1);
                setDimOpacity(fadeProgress);
                if (progress > 0.98) {
                  setShowHero(false);
                }
              }
            }
          }
        }
      });
    };

    // Run animations immediately
    let sequence = initAnimations();

    // Re-run animations after fonts are loaded to ensure correct height calculations
    document.fonts.ready.then(() => {
      sequence = initAnimations();
      ScrollTrigger.refresh();
    });

    // Fallback: Re-run animations after 500ms to ensure DOM is fully settled
    setTimeout(() => {
      sequence = initAnimations();
      ScrollTrigger.refresh();
    }, 500);

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      sequence.scrollTrigger?.kill();
    };
  }, [dimensions, isMobile]);

  // Animate the changing word
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    if (wordRef.current) {
      gsap.fromTo(wordRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );

      gsap.fromTo(wordRef.current,
        { backgroundPosition: "200% center" },
        { backgroundPosition: "-200% center", duration: 1, ease: "power2.inOut" }
      );
    }
  }, [currentWord]);

  return (
    <AnimationSection ref={sectionRef}>
      <LoadingOverlay $isLoaded={!isLoading}>
        <LoadingText>SYSTEM OPTIMIZING...</LoadingText>
        <ProgressNumber>{loadProgress}%</ProgressNumber>
      </LoadingOverlay>

      <StickyContainer ref={stickyRef}>
        <CanvasElement ref={canvasRef} />
        <VideoElement
          src="/SpiralShotHorizontal.mp4"
          autoPlay
          muted
          loop
          playsInline
          id="hero-video"
        />
        <DimOverlay $opacity={dimOpacity} />
        <HeroOverlay $isVisible={showHero}>
          <Logo>
            <img
              src="rov-logo.webp"
              alt="ROV Logo"
            />
          </Logo>
          <Heading>
            <div className="text-3xl md:text-5xl font-bold leading-tight md:leading-[1.2]">
              CREATIVE<br />STUDIO
            </div>
          </Heading>
        </HeroOverlay>

        <TextOverlay $isVisible={dimOpacity < 1}>
          <CreativeText ref={creativeRef}>Creative</CreativeText>
          <ChangingWord ref={wordRef}>{currentWord}</ChangingWord>
        </TextOverlay>
      </StickyContainer>
    </AnimationSection>
  );
};

export default HeroWithAnimation;

