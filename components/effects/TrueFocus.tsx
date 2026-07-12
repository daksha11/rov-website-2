"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface TrueFocusProps {
    sentence?: string;
    manualMode?: boolean;
    blurAmount?: number;
    borderColor?: string;
    glowColor?: string;
    animationDuration?: number;
    pauseBetweenAnimations?: number;
    fontSize?: string | string[];
    fontFamily?: string;
    letterSpacing?: string;
    className?: string;
}

interface FocusRect {
    x: number;
    y: number;
    width: number;
    height: number;
}

const TrueFocus: React.FC<TrueFocusProps> = ({
    sentence = "True Focus",
    manualMode = false,
    blurAmount = 5,
    borderColor = "green",
    glowColor = "rgba(0, 255, 0, 0.6)",
    animationDuration = 0.5,
    pauseBetweenAnimations = 1,
    fontSize = "4rem",
    fontFamily = "'Futura', sans-serif",
    letterSpacing = "normal",
    className = "",
}) => {
    const words = sentence.split(" ");
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [lastActiveIndex, setLastActiveIndex] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const [focusRect, setFocusRect] = useState<FocusRect>({ x: 0, y: 0, width: 0, height: 0 });
    const [isMounted, setIsMounted] = useState(false);

    // Load font and set mounted state client-side
    useEffect(() => {
        setIsMounted(true);
        const style = document.createElement("style");
        style.textContent = `
            @font-face {
                font-family: 'Futura';
                src: local('Futura'), local('Futura-Medium');
            }
        `;
        document.head.appendChild(style);

        // Cleanup
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    // Handle automatic word cycling
    useEffect(() => {
        if (!isMounted || manualMode) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % words.length);
        }, (animationDuration + pauseBetweenAnimations) * 1000);

        return () => clearInterval(interval);
    }, [isMounted, manualMode, animationDuration, pauseBetweenAnimations, words.length]);

    // Update focus rectangle position
    useEffect(() => {
        if (!isMounted || currentIndex === null || currentIndex === -1) return;
        if (!wordRefs.current[currentIndex] || !containerRef.current) return;

        const parentRect = containerRef.current.getBoundingClientRect();
        const activeRect = wordRefs.current[currentIndex]!.getBoundingClientRect();

        setFocusRect({
            x: activeRect.left - parentRect.left,
            y: activeRect.top - parentRect.top,
            width: activeRect.width,
            height: activeRect.height,
        });
    }, [isMounted, currentIndex, words.length, fontSize]);

    const handleMouseEnter = (index: number) => {
        if (!isMounted || !manualMode) return;
        setLastActiveIndex(index);
        setCurrentIndex(index);
    };

    const handleMouseLeave = () => {
        if (!isMounted || !manualMode) return;
        if (lastActiveIndex !== null) {
            setCurrentIndex(lastActiveIndex);
        }
    };

    if (!isMounted) {
        // Render static content during SSR
        return (
            <div className={`relative flex gap-4 items-center flex-wrap ${className || "justify-center"}`}>
                {words.map((word, index) => (
                    <span
                        key={index}
                        className="relative font-black cursor-pointer"
                        style={{
                            fontSize: Array.isArray(fontSize) ? fontSize[index % fontSize.length] : fontSize,
                            fontFamily,
                            letterSpacing
                        }}
                    >
                        {word}
                    </span>
                ))}
            </div>
        );
    }

    return (
        <div
            className={`relative flex gap-4 items-center flex-wrap ${className || "justify-center"}`}
            ref={containerRef}
        >
            {words.map((word, index) => {
                const isActive = index === currentIndex;
                const currentFontSize = Array.isArray(fontSize) ? fontSize[index % fontSize.length] : fontSize;

                return (
                    <span
                        key={index}
                        ref={(el) => (wordRefs.current[index] = el)}
                        className="relative font-black cursor-pointer"
                        style={{
                            fontSize: currentFontSize,
                            fontFamily,
                            letterSpacing,
                            filter: isActive
                                ? `blur(0px)`
                                : `blur(${blurAmount}px)`,
                            transition: `filter ${animationDuration}s ease`,
                        } as React.CSSProperties}
                        onMouseEnter={() => handleMouseEnter(index)}
                        onMouseLeave={handleMouseLeave}
                    >
                        {word}
                    </span>
                );
            })}

            <motion.div
                className="absolute top-0 left-0 pointer-events-none box-border border-0"
                animate={{
                    x: focusRect.x,
                    y: focusRect.y,
                    width: focusRect.width,
                    height: focusRect.height,
                    opacity: currentIndex >= 0 ? 1 : 0,
                }}
                transition={{
                    duration: animationDuration,
                }}
                style={{
                    "--border-color": borderColor,
                    "--glow-color": glowColor,
                } as React.CSSProperties}
            >
                <span
                    className="absolute w-4 h-4 border-[3px] rounded-[3px] top-[-10px] left-[-10px] border-r-0 border-b-0"
                    style={{
                        borderColor: "var(--border-color)",
                        filter: "drop-shadow(0 0 4px var(--border-color))",
                    }}
                ></span>
                <span
                    className="absolute w-4 h-4 border-[3px] rounded-[3px] top-[-10px] right-[-10px] border-l-0 border-b-0"
                    style={{
                        borderColor: "var(--border-color)",
                        filter: "drop-shadow(0 0 4px var(--border-color))",
                    }}
                ></span>
                <span
                    className="absolute w-4 h-4 border-[3px] rounded-[3px] bottom-[-10px] left-[-10px] border-r-0 border-t-0"
                    style={{
                        borderColor: "var(--border-color)",
                        filter: "drop-shadow(0 0 4px var(--border-color))",
                    }}
                ></span>
                <span
                    className="absolute w-4 h-4 border-[3px] rounded-[3px] bottom-[-10px] right-[-10px] border-l-0 border-t-0"
                    style={{
                        borderColor: "var(--border-color)",
                        filter: "drop-shadow(0 0 4px var(--border-color))",
                    }}
                ></span>
            </motion.div>
        </div>
    );
};

export default TrueFocus;