import ArtistCard from "@/components/ArtistCard";
import { useEffect, useState, useRef } from "react";
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

export default function FeaturedArtists() {
  return (
    <section style={{ paddingTop: "30px" }}>
      <h2 className="text-4xl font-bold text-center mb-8 relative z-10">
        <DecryptedText
          text="FEATURED ARTISTS"
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
          overflowX: "auto", // Enable horizontal scrolling
          padding: "10px 0", // Add some padding for better spacing
          scrollbarWidth: "none", // Hide scrollbar for a cleaner look (optional)
        }}
      >
        {/* Wrap each ArtistCard in a div with flex: 0 0 auto and add semi-transparent white border */}
        <div style={{ flex: "0 0 33.33%", border: "2px solid rgba(255, 255, 255, 0.2)", overflow: "hidden", marginRight: "-2px" }}>
          <ArtistCard
            imageUrl="/cover1.png"
            name="Gibran Alcocer"
            description="Gibran Alcocer, A Pianist From Mexico, Gaining 5 Million Monthly Listeners On Spotify With His Captivating Melodies, Including His Viral Hit “Idea 10”."
            textPosition="below"
            padding="20px" // Increased padding
          />
        </div>
        <div style={{ flex: "0 0 33.33%", border: "2px solid rgba(255, 255, 255, 0.2)", overflow: "hidden", marginRight: "-2px" }}>
          <ArtistCard
            imageUrl="/cover2.png"
            name="Izzamuzzic"
            description="Vadim Pavlyuchenko, Known Professionally As “Izzamuzzic,” Is An Electronic Music Artist And Accomplished Music Producer Originating From Kazakhstan."
            textPosition="above"
            padding="20px" // Increased padding
          />
        </div>
        <div style={{ flex: "0 0 33.33%", border: "2px solid rgba(255, 255, 255, 0.2)", overflow: "hidden", marginRight: "-2px" }}>
          <ArtistCard
            imageUrl="/cover1.png"
            name="Gibran Alcocer"
            description="Gibran Alcocer, A Pianist From Mexico, Gaining 5 Million Monthly Listeners On Spotify With His Captivating Melodies, Including His Viral Hit “Idea 10”."
            textPosition="below"
            padding="20px" // Increased padding
          />
        </div>
        <div style={{ flex: "0 0 33.33%", border: "2px solid rgba(255, 255, 255, 0.2)", overflow: "hidden", marginRight: "-2px" }}>
          <ArtistCard
            imageUrl="/cover2.png"
            name="Izzamuzzic"
            description="Vadim Pavlyuchenko, Known Professionally As “Izzamuzzic,” Is An Electronic Music Artist And Accomplished Music Producer Originating From Kazakhstan."
            textPosition="above"
            padding="20px" // Increased padding
          />
        </div>
        <div style={{ flex: "0 0 33.33%", border: "2px solid rgba(255, 255, 255, 0.2)", overflow: "hidden", marginRight: "-2px" }}>
          <ArtistCard
            imageUrl="/cover1.png"
            name="Gibran Alcocer"
            description="Gibran Alcocer, A Pianist From Mexico, Gaining 5 Million Monthly Listeners On Spotify With His Captivating Melodies, Including His Viral Hit “Idea 10”."
            textPosition="below"
            padding="20px" // Increased padding
          />
        </div>
        <div style={{ flex: "0 0 33.33%", border: "2px solid rgba(255, 255, 255, 0.2)", borderRadius: "8px", overflow: "hidden", marginRight: "-2px" }}>
          <ArtistCard
            imageUrl="/cover2.png"
            name="Izzamuzzic"
            description="Vadim Pavlyuchenko, Known Professionally As “Izzamuzzic,” Is An Electronic Music Artist And Accomplished Music Producer Originating From Kazakhstan."
            textPosition="above"
            padding="20px" // Increased padding
          />
        </div>
      </div>
    </section>
  );
}