import React, { useState } from "react";

interface ArtistCardProps {
  imageUrl: string;
  name: string;
  description: string;
  textPosition?: "above" | "below";
  padding?: string;
}

const ArtistCard: React.FC<ArtistCardProps> = ({
  imageUrl,
  name,
  description,
  textPosition = "below",
  padding = "20px",
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const cardStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: textPosition === "below" ? "column" : "column-reverse",
    alignItems: "center",
    textAlign: "center",
    overflow: "hidden",
    transition: "transform 0.2s ease",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    maxWidth: "100%",
    width: "100%",
    padding: padding,
  };

  const cardHoverStyle: React.CSSProperties = {
    transform: "translateY(-5px)",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  };

  const imageContainerStyle: React.CSSProperties = {
    overflow: "hidden",
    width: "100%",
    height: "auto",
    flexShrink: 0,
  };

  const imageStyle: React.CSSProperties = {
    width: "100%",
    height: "auto",
    display: "block",
    transition: "filter 0.3s ease",
    filter: isHovered ? "grayscale(0%)" : "grayscale(100%)",
  };

  const infoStyle: React.CSSProperties = {
    textAlign: "left",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
    padding: padding,
  };

  const infoHeadingStyle: React.CSSProperties = {
    marginBottom: "12px",
    fontSize: "24px",
    fontWeight: 600,
  };

  const infoParagraphStyle: React.CSSProperties = {
    fontSize: "16px",
    color: "#666",
  };

  return (
    <div
      style={isHovered ? { ...cardStyle, ...cardHoverStyle } : cardStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="artist-card"
    >
      <div style={imageContainerStyle}>
        <img src={imageUrl} alt={name} style={imageStyle} />
      </div>
      <div style={infoStyle}>
        <h3 style={infoHeadingStyle}>{name}</h3>
        <p style={infoParagraphStyle}>{description}</p>
      </div>

      <style>
        {`
          @media (max-width: 768px) {
            .artist-card {
              width: 100%;
              text-align: center;
              display: flex;
              flex-direction: column;
              align-items: center;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ArtistCard;
