"use client";

import { useState } from "react";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: "start" | "end" | "center";
  useOriginalCharsOnly?: boolean;
  characters?: string;
  className?: string; // Applied to revealed/normal letters
  encryptedClassName?: string; // Applied to encrypted letters
  parentClassName?: string; // Applied to the top-level span container
  animateOn?: "view" | "hover"; // Default: 'hover'
}

function DecryptedText({
  text,
  speed = 150, // Slower speed for a smoother effect
  maxIterations = 10,
  sequential = false,
  revealDirection = "start", // Changed to "start" for left-to-right reveal
  useOriginalCharsOnly = false, // Allow scrambling with any characters
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*()_+", // Include numbers and symbols
  className = "text-white", // Revealed text is white
  parentClassName = "",
  encryptedClassName = "text-white", // Encrypted text is also white
  animateOn = "view", // Trigger on view
  ...props
}: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState<string>(text);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [isScrambling, setIsScrambling] = useState<boolean>(false);
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
  const [hasAnimated, setHasAnimated] = useState<boolean>(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let currentIteration = 0;

    const getNextIndex = (revealedSet: Set<number>): number => {
      const textLength = text.length;
      switch (revealDirection) {
        case "start":
          return revealedSet.size; // Reveals from left to right
        case "end":
          return textLength - 1 - revealedSet.size; // Reveals from right to left
        case "center": {
          const middle = Math.floor(textLength / 2);
          const offset = Math.floor(revealedSet.size / 2);
          const nextIndex =
            revealedSet.size % 2 === 0
              ? middle + offset
              : middle - offset - 1;

          if (nextIndex >= 0 && nextIndex < textLength && !revealedSet.has(nextIndex)) {
            return nextIndex;
          }
          for (let i = 0; i < textLength; i++) {
            if (!revealedSet.has(i)) return i;
          }
          return 0;
        }
        default:
          return revealedSet.size;
      }
    };

    const availableChars = useOriginalCharsOnly
      ? Array.from(new Set(text.split(""))).filter((char) => char !== " ")
      : characters.split("");

    const shuffleText = (originalText: string, currentRevealed: Set<number>): string => {
      if (useOriginalCharsOnly) {
        const positions = originalText.split("").map((char, i) => ({
          char,
          isSpace: char === " ",
          index: i,
          isRevealed: currentRevealed.has(i),
        }));

        const nonSpaceChars = positions
          .filter((p) => !p.isSpace && !p.isRevealed)
          .map((p) => p.char);

        for (let i = nonSpaceChars.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [nonSpaceChars[i], nonSpaceChars[j]] = [nonSpaceChars[j], nonSpaceChars[i]];
        }

        let charIndex = 0;
        return positions
          .map((p) => {
            if (p.isSpace) return " ";
            if (p.isRevealed) return originalText[p.index];
            return nonSpaceChars[charIndex++];
          })
          .join("");
      } else {
        return originalText
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (currentRevealed.has(i)) return originalText[i];
            return availableChars[Math.floor(Math.random() * availableChars.length)];
          })
          .join("");
      }
    };

    if (isHovering) {
      setIsScrambling(true);
      interval = setInterval(() => {
        setRevealedIndices((prevRevealed) => {
          if (sequential) {
            if (prevRevealed.size < text.length) {
              const nextIndex = getNextIndex(prevRevealed);
              const newRevealed = new Set(prevRevealed);
              newRevealed.add(nextIndex);
              setDisplayText(shuffleText(text, newRevealed));
              return newRevealed;
            } else {
              clearInterval(interval);
              setIsScrambling(false);
              return prevRevealed;
            }
          } else {
            setDisplayText(shuffleText(text, prevRevealed));
            currentIteration++;
            if (currentIteration >= maxIterations) {
              clearInterval(interval);
              setIsScrambling(false);
              setDisplayText(text);
            }
            return prevRevealed;
          }
        });
      }, speed);
    } else {
      setDisplayText(text);
      setRevealedIndices(new Set());
      setIsScrambling(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    isHovering,
    text,
    speed,
    maxIterations,
    sequential,
    revealDirection,
    characters,
    useOriginalCharsOnly,
  ]);

  useEffect(() => {
    if (animateOn !== "view") return;

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsHovering(true);
          setHasAnimated(true);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [animateOn, hasAnimated]);

  const hoverProps =
    animateOn === "hover"
      ? {
          onMouseEnter: () => setIsHovering(true),
          onMouseLeave: () => setIsHovering(false),
        }
      : {};

  return (
    <motion.span
      ref={containerRef}
      className={`inline-block whitespace-pre-wrap relative ${parentClassName}`}
      {...hoverProps}
      {...props}
    >
      <span className="sr-only">{displayText}</span>

      <span aria-hidden="true">
        {displayText.split("").map((char, index) => {
          const isRevealedOrDone =
            revealedIndices.has(index) || !isScrambling || !isHovering;

          return (
            <span
              key={index}
              className={isRevealedOrDone ? className : encryptedClassName}
            >
              {char}
            </span>
          );
        })}
      </span>
    </motion.span>
  );
}

const Gallery = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Only five images
  const images = [
    "/cover1.png",
    "/cover2.png",
    "/cover1.png",
    "/cover2.png",
    "/cover1.png",
  ];

  return (
    <section
      style={{
        padding: "40px 20px",
        backgroundColor: "#000",
        color: "#fff",
        textAlign: "center",
        width: "100%", // Ensure the section covers the full viewport width
        marginLeft: "-50%", // Offset to account for default body padding/margin
        left: "50%",
        position: "relative",
      }}
    >
      <h2 className="text-4xl font-bold mb-12 text-center relative z-10">
        <DecryptedText
          text="GALLERY"
          speed={150} // Slower speed for a smoother effect
          maxIterations={10}
          characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*()_+"
          sequential={true}
          revealDirection="start" // Changed to "start" for left-to-right reveal
          useOriginalCharsOnly={false} // Allow scrambling with any characters
          className="text-white"
          encryptedClassName="text-white" // Keep encrypted text white
          animateOn="view"
        />
      </h2>
      <div
        style={{
          display: "flex",
          gap: "10px",
          width: "100%", // Ensure the container takes full width
          justifyContent: "center", // Center the images horizontally
          alignItems: "center", // Center the images vertically
          height: "calc(100vh - 200px)", // Fit to screen height minus padding and header
        }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            style={{
              flex: hoveredIndex === index ? "1 1 50%" : "1 1 10%", // Adjust flex values for smooth expansion
              height: "100%", // Full height of the container
              transition: "flex 0.5s ease-in-out", // Smoother transition
              overflow: "hidden",
              border: "2px solid rgba(255, 255, 255, 0.2)",
              position: "relative", // For positioning the image
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <img
              src={image}
              alt={`Gallery Image ${index + 1}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover", // Ensure the image fills the container
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Gallery;