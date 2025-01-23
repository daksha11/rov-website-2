"use client";

import ArtistCard from "@/components/ArtistCard";
import { motion, useAnimation, useInView } from "framer-motion";
import { useRef, useEffect } from "react";

interface DecryptedTextProps {
  text: string;
  className?: string; // Applied to the text
  parentClassName?: string; // Applied to the top-level span container
}

function DecryptedText({
  text,
  className = "text-white",
  parentClassName = "",
  ...props
}: DecryptedTextProps) {
  return (
    <motion.span
      className={`inline-block whitespace-pre-wrap relative ${parentClassName}`}
      {...props}
    >
      <span className={className}>{text}</span>
    </motion.span>
  );
}

export default function FeaturedArtists() {
  const ref = useRef(null);
  const controls = useAnimation();
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.5, ease: "easeOut" } },
  };

  return (
    <motion.section
      ref={ref}
      style={{ paddingTop: "30px" }}
      initial="hidden"
      animate={controls}
      variants={sectionVariants}
    >
      <motion.h2
        className="text-4xl font-bold text-center mb-8 relative z-10"
        variants={sectionVariants}
      >
        <DecryptedText text="FEATURED ARTISTS" className="text-white" />
      </motion.h2>
      <motion.div
        style={{
          display: "flex",
          overflowX: "auto", // Enable horizontal scrolling
          padding: "10px 0",
          scrollbarWidth: "none", // Hide scrollbar
        }}
        variants={sectionVariants}
      >
        {[
          {
            imageUrl: "/cover1.png",
            name: "Gibran Alcocer",
            description:
              "Gibran Alcocer, A Pianist From Mexico, Gaining 5 Million Monthly Listeners On Spotify With His Captivating Melodies, Including His Viral Hit “Idea 10”.",
          },
          {
            imageUrl: "/cover2.png",
            name: "Izzamuzzic",
            description:
              "Vadim Pavlyuchenko, Known Professionally As “Izzamuzzic,” Is An Electronic Music Artist And Accomplished Music Producer Originating From Kazakhstan.",
          },
          {
            imageUrl: "/cover1.png",
            name: "Gibran Alcocer",
            description:
              "Gibran Alcocer, A Pianist From Mexico, Gaining 5 Million Monthly Listeners On Spotify With His Captivating Melodies, Including His Viral Hit “Idea 10”.",
          },
        ].map((artist, index) => (
          <motion.div
            key={index}
            style={{
              flex: "0 0 33.33%",
              border: "2px solid rgba(255, 255, 255, 0.2)",
              overflow: "hidden",
              marginRight: "-2px",
              borderRadius: "8px",
            }}
            whileHover={{ scale: 1 }}
          >
            <ArtistCard
              imageUrl={artist.imageUrl}
              name={artist.name}
              description={artist.description}
              textPosition={index % 2 === 0 ? "below" : "above"}
              padding="20px"
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}
