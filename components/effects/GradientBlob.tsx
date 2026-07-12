import React from "react";

interface GradientBlobProps {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  opacity?: number;
  size?: string;
  blur?: string;
}

const positionMap = {
  "top-left": { className: "top-0 left-0", transform: "translate(-30%, -30%)" },
  "top-right": { className: "top-0 right-0", transform: "translate(20%, -20%)" },
  "bottom-left": { className: "bottom-0 left-0", transform: "translate(-20%, 20%)" },
  "bottom-right": { className: "bottom-0 right-0", transform: "translate(30%, 30%)" },
};

const GradientBlob: React.FC<GradientBlobProps> = ({
  position,
  opacity = 0.6,
  size = "800px",
  blur = "200px",
}) => {
  const { className, transform } = positionMap[position];

  return (
    <div
      className={`absolute ${className} rounded-full pointer-events-none z-0`}
      style={{
        width: size,
        height: size,
        background: `rgba(96, 62, 37, ${opacity})`,
        filter: `blur(${blur})`,
        transform,
      }}
    />
  );
};

export default GradientBlob;
