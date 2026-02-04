"use client";

import React, { useEffect, useRef, useState } from "react";

interface CarouselItemProps {
  imageUrl: string;
}

const CarouselItem: React.FC<CarouselItemProps> = ({ imageUrl }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        flex: "0 0 300px", // Fixed width for each item
        position: "relative",
        height: "100%",
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
      }}
      className="carousel-item"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={imageUrl}
        alt="Carousel item"
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "cover",
          borderRadius: "10px",
          filter: isHovered ? "grayscale(10%)" : "none", // Apply grayscale on hover
          transition: "filter 0.3s ease-in-out",
        }}
      />
      {isHovered && (
        <>
          {/* Gray Overlay */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              borderRadius: "10px",
              transition: "opacity 0.3s ease-in-out",
              opacity: isHovered ? 1 : 0,
            }}
          />
          {/* Updated Rounded Button with Proxima Nova Font */}
          <a
            href="https://open.spotify.com/artist/1jvWl3rF1B79uoLznEir6D?si=jfP5_dYLQHG0oQxRymi17g"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#ffffff",
              color: "black",
              padding: "12px 32px",
              borderRadius: "50px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              textAlign: "center",
              transition: "all 0.3s ease-in-out",
              opacity: isHovered ? 1 : 0,
              textDecoration: "none",
              letterSpacing: "0.5px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
              fontFamily: "Proxima Nova, sans-serif", // Set the font to Proxima Nova
            }}
          >
            Play Now
          </a>
        </>
      )}
    </div>
  );
};

const Carousel: React.FC = () => {
  const items: CarouselItemProps[] = [
    { imageUrl: "/rov_album_4.webp" },
    { imageUrl: "/rov_album_1.webp" },
    { imageUrl: "/rov_album_2.webp" },
    { imageUrl: "/rov_album_3.webp" },
    { imageUrl: "/cover1.webp" },
    { imageUrl: "/cover2.webp" },
    { imageUrl: "/cover3.webp" },
  ];

  const carouselRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const currentTranslateX = useRef(-300); // Start at the first item's position

  // Clone the items to create a seamless loop
  const clonedItems = [...items, ...items, ...items];

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const itemWidth = 300; // Width of each item
    const gap = 20; // Gap between items
    const totalWidth = (itemWidth + gap) * items.length; // Total width of one set

    let animationFrameId: number;

    const animateCarousel = () => {
      if (!carousel) return;

      // Update the translateX value
      currentTranslateX.current -= isHovered ? 0.5 : 1; // Slow down animation on hover

      // Reset to create seamless infinite loop
      // When we've scrolled past one complete set, reset to the beginning
      if (Math.abs(currentTranslateX.current) >= totalWidth + 300) {
        currentTranslateX.current += totalWidth;
      }

      // Apply the translateX value to the carousel
      carousel.style.transform = `translateX(${currentTranslateX.current}px)`;

      // Request the next animation frame
      animationFrameId = requestAnimationFrame(animateCarousel);
    };

    // Start animation
    animationFrameId = requestAnimationFrame(animateCarousel);

    // Cleanup
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered, items.length]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        width: "100%",
        height: "400px",
        position: "relative",
        paddingTop: "100px",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Left Gradient Blob */}
      <div
        className="absolute top-0 left-0 rounded-full pointer-events-none z-0 blob-gradient"
        style={{
          transform: 'translate(-30%, -30%)'
        }}
      />
      {/* Bottom Right Gradient Blob */}
      <div
        className="absolute bottom-0 right-0 rounded-full pointer-events-none z-0 blob-gradient"
        style={{
          transform: 'translate(30%, 30%)'
        }}
      />
      <div
        ref={carouselRef}
        style={{
          display: "flex",
          gap: "20px",
          willChange: "transform",
        }}
      >
        {clonedItems.map((item, index) => (
          <CarouselItem key={index} {...item} />
        ))}
      </div>
      <style jsx>{`
        .blob-gradient {
          width: 300px;
          height: 300px;
          background: rgba(96, 62, 37, 0.30);
          filter: blur(60px);
        }
        @media (min-width: 768px) {
          .blob-gradient {
            width: 500px;
            height: 500px;
            background: rgba(96, 62, 37, 0.40);
            filter: blur(100px);
          }
        }
      `}</style>
    </div>
  );
};

export default Carousel;
