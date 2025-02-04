"use client";

import ArtistCard from "@/components/ArtistCard";
import { motion, useAnimation, useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import DecryptedText from "@/components/DecryptedText";

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
      className="featured-section"
      initial="hidden"
      animate={controls}
      variants={sectionVariants}
    >
      {/* Featured Artists Heading with Animated Text */}
      <motion.h2
        className="text-4xl font-bold text-center mb-8 relative z-10"
        variants={sectionVariants}
      >
        <DecryptedText text="FEATURED ARTISTS" className="text-white" />
      </motion.h2>

      {/* Artist Cards with Responsive Layout */}
      <motion.div className="artists-container" variants={sectionVariants}>
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
          <motion.div key={index} className="artist-card-wrapper">
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

      <style>
        {`
          .featured-section {
            padding-top: 30px;
          }

          .artists-container {
            display: flex;
            overflow-x: auto;
            padding: 10px 0;
            scrollbar-width: none;
            -ms-overflow-style: none;
            scroll-snap-type: x mandatory;
            scroll-padding: 10px;
            -webkit-overflow-scrolling: touch;
          }

          .artists-container::-webkit-scrollbar {
            display: none;
          }

          .artist-card-wrapper {
            flex: 0 0 33.33%;
            border: 2px solid rgba(255, 255, 255, 0.2);
            overflow: hidden;
            margin-right: -2px;
            transition: transform 0.3s ease;
            scroll-snap-align: center;
          }

          /* Tablet View: 2 columns */
          @media (max-width: 1024px) {
            .artist-card-wrapper {
              flex: 0 0 50%;
            }
          }

          /* Mobile View: 1 column */
          @media (max-width: 768px) {
            .artist-card-wrapper {
              flex: 0 0 100%;
            }
          }
        `}
      </style>
    </motion.section>
  );
}
