"use client";
import React from "react";
import Image from "next/image";
import type { SpringOptions } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface TiltedCardProps {
  imageSrc: React.ComponentProps<"img">["src"];
  posterSrc?: string;
  altText?: string;
  captionText?: string;
  containerHeight?: React.CSSProperties["height"];
  containerWidth?: React.CSSProperties["width"];
  imageHeight?: React.CSSProperties["height"];
  imageWidth?: React.CSSProperties["width"];
  scaleOnHover?: number;
  rotateAmplitude?: number;
  showMobileWarning?: boolean;
  showTooltip?: boolean;
  overlayContent?: React.ReactNode;
  displayOverlayContent?: boolean;
}

const springValues: SpringOptions = {
  damping: 30,
  stiffness: 100,
  mass: 2,
};

export default function TiltedCard({
  imageSrc,
  posterSrc,
  altText = "Tilted card image",
  captionText = "",
  containerHeight = "300px",
  containerWidth = "100%",
  imageHeight = "300px",
  imageWidth = "300px",
  scaleOnHover = 1,
  rotateAmplitude = 14,
  showMobileWarning = true,
  showTooltip = true,
  overlayContent = null,
  displayOverlayContent = false,
}: TiltedCardProps) {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);
  const opacity = useSpring(0);
  const hoverTextOpacity = useSpring(0);
  const rotateFigcaption = useSpring(0, {
    stiffness: 350,
    damping: 30,
    mass: 1,
  });

  const [lastY, setLastY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTouching, setIsTouching] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  function handleMouse(e: React.MouseEvent<HTMLElement>) {
    if (!ref.current || isMobile) return;

    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

    rotateX.set(rotationX);
    rotateY.set(rotationY);

    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);

    const velocityY = offsetY - lastY;
    rotateFigcaption.set(-velocityY * 0.6);
    setLastY(offsetY);
  }

  function handleMouseEnter() {
    if (isMobile) return;
    scale.set(scaleOnHover);
    opacity.set(1);
    hoverTextOpacity.set(1);
  }

  function handleMouseLeave() {
    if (isMobile) return;
    opacity.set(0);
    hoverTextOpacity.set(0);
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
    rotateFigcaption.set(0);
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLElement>) => {
    if (!isMobile) return;
    setIsTouching(true);
    hoverTextOpacity.set(1);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLElement>) => {
    if (!isMobile || !isTouching) return;
  };

  const handleTouchEnd = () => {
    if (!isMobile) return;
    setIsTouching(false);
    hoverTextOpacity.set(0);
  };

  const isVideo = typeof imageSrc === "string" && imageSrc.endsWith(".mp4");

  // Only play the (potentially heavy) video while it is in the viewport.
  // Below-the-fold videos stay paused and, with preload="none", are not
  // eagerly downloaded until the user scrolls them into view.
  useEffect(() => {
    if (!isVideo) return;
    const node = videoRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          node.play().catch(() => {});
        } else {
          node.pause();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isVideo]);

  return (
    <figure
      ref={ref}
      className="relative w-full h-full [perspective:800px] flex flex-col items-center justify-center"
      style={{
        height: containerHeight,
        width: containerWidth,
        minHeight: "100px",
        touchAction: isMobile ? "auto" : "none",
      }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {showMobileWarning && (
        <div className="absolute top-2 text-center text-xs block sm:hidden text-white/50">
          Tilt effect disabled on mobile
        </div>
      )}

      <motion.div
        className="relative [transform-style:preserve-3d]"
        style={{
          width: imageWidth,
          height: imageHeight,
          rotateX: isMobile ? 0 : rotateX,
          rotateY: isMobile ? 0 : rotateY,
          scale: isMobile ? 1 : scale,
        }}
      >
        {isVideo ? (
          <motion.video
            ref={videoRef}
            loop
            muted
            playsInline
            preload="none"
            poster={posterSrc}
            className="absolute top-0 left-0 object-cover rounded-[15px] [transform:translateZ(0)] w-full h-full"
          >
            <source src={imageSrc as string} type="video/mp4" />
          </motion.video>
        ) : (
          <Image
            src={imageSrc as string}
            alt={altText}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover rounded-[15px] [transform:translateZ(0)]"
          />
        )}

        {/* Removed the Hover Text Overlay div entirely to ensure no white/gray strip appears */}

        {displayOverlayContent && overlayContent && (
          <motion.div
            className="absolute bottom-0 left-0 z-[2] w-full [transform:translateZ(30px)]"
          >
            {overlayContent}
          </motion.div>
        )}
      </motion.div>

      {/* Logic check: only render figcaption if captionText actually exists */}
      {showTooltip && !isMobile && captionText && (
        <motion.figcaption
          className="pointer-events-none absolute bottom-0 left-0 rounded-[4px] bg-white px-[10px] py-[4px] text-[10px] text-[#2d2d2d] z-[3] hidden sm:block"
          style={{
            x,
            y,
            opacity,
            rotate: rotateFigcaption,
          }}
        >
          {captionText}
        </motion.figcaption>
      )}
    </figure>
  );
} 