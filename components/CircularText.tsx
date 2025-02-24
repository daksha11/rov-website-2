import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";

interface CircularTextProps {
  text: string;
  spinDuration?: number;
  onHover?: "slowDown" | "speedUp" | "pause" | "goBonkers";
  className?: string;
  sizeClass?: string; // New prop for Tailwind size classes
}

const getRotationTransition = (
  duration: number,
  from: number,
  loop: boolean = true
): { from: number; to: number; ease: string; duration: number; type: string; repeat: number } => ({
  from,
  to: from + 360,
  ease: "linear",
  duration,
  type: "tween",
  repeat: loop ? Infinity : 0,
});

const getTransition = (duration: number, from: number) => ({
  rotate: getRotationTransition(duration, from),
  scale: {
    type: "spring",
    damping: 20,
    stiffness: 300,
  },
});

const CircularText: React.FC<CircularTextProps> = ({
  text,
  spinDuration = 20,
  onHover = "speedUp",
  className = "",
  sizeClass = "w-[clamp(100px,20vw,200px)] h-[clamp(100px,20vw,200px)]", // Default responsive size
}) => {
  const letters = Array.from(text);
  const controls = useAnimation();
  const [currentRotation, setCurrentRotation] = useState<number>(0);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    controls.start({
      rotate: currentRotation + 360,
      scale: 1,
      opacity: 1,
      transition: getTransition(spinDuration, currentRotation),
    });
  }, [spinDuration, controls, onHover, text]);

  const handleHoverStart = () => {
    if (!onHover) return;
    switch (onHover) {
      case "slowDown":
        controls.start({
          rotate: currentRotation + 360,
          scale: 1,
          transition: getTransition(spinDuration * 2, currentRotation),
        });
        break;
      case "speedUp":
        controls.start({
          rotate: currentRotation + 360,
          scale: 1,
          transition: getTransition(spinDuration / 4, currentRotation),
        });
        break;
      case "pause":
        controls.start({
          rotate: currentRotation,
          scale: 1,
          transition: {
            rotate: { type: "spring", damping: 20, stiffness: 300 },
            scale: { type: "spring", damping: 20, stiffness: 300 },
          },
        });
        break;
      case "goBonkers":
        controls.start({
          rotate: currentRotation + 360,
          scale: 0.8,
          transition: getTransition(spinDuration / 20, currentRotation),
        });
        break;
      default:
        break;
    }
  };

  const handleHoverEnd = () => {
    controls.start({
      rotate: currentRotation + 360,
      scale: 1,
      transition: getTransition(spinDuration, currentRotation),
    });
  };

  return (
    <motion.div
      initial={{ rotate: 0, opacity: 0 }}
      className={`mx-auto rounded-full text-white font-black text-center cursor-pointer origin-center ${sizeClass} ${className}`}
      animate={controls}
      onUpdate={(latest: any) => setCurrentRotation(Number(latest.rotate))}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
      style={{ visibility: isMounted ? "visible" : "hidden" }}
    >
      {letters.map((letter, i) => {
        const rotation = (360 / letters.length) * i;
        const factor = Number((Math.PI / letters.length).toFixed(0));
        const x = factor * i;
        const y = factor * i;
        const transform = `rotateZ(${rotation}deg) translate3d(${x}px, ${y}px, 0)`;

        return (
          <span
            key={i}
            className="absolute inline-block inset-0 text-[clamp(1rem,4vw,2rem)] transition-all duration-500 ease-[cubic-bezier(0,0,0,1)]"
            style={{ transform, WebkitTransform: transform }}
          >
            {letter}
          </span>
        );
      })}
    </motion.div>
  );
};

export default CircularText;