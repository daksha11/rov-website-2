"use client";

import { useState } from "react";
import { motion } from "framer-motion";

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
          className="text-white"
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