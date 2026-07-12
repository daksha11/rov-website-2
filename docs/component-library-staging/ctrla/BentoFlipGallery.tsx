'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger, Flip, ScrollToPlugin, Observer } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger, Flip, ScrollToPlugin, Observer);

interface BentoGalleryProps {
    images?: string[];
}

const defaultImages = [
    'https://assets.codepen.io/16327/portrait-pattern-1.jpg',
    'https://assets.codepen.io/16327/portrait-image-12.jpg',
    'https://assets.codepen.io/16327/portrait-image-8.jpg',
    'https://assets.codepen.io/16327/portrait-pattern-2.jpg',
    'https://assets.codepen.io/16327/portrait-image-4.jpg',
    'https://assets.codepen.io/16327/portrait-image-3.jpg',
    'https://assets.codepen.io/16327/portrait-pattern-3.jpg',
    'https://assets.codepen.io/16327/portrait-image-1.jpg',
];

const projectInfo = [
    { title: "Visual Storytelling", desc: "Crafting narratives through cinematic motion." },
    { title: "Digital Systems", desc: "Building scalable and adaptive design languages." },
    { title: "Brand Identity", desc: "Defining the core essence of modern businesses." },
    { title: "Motion Theory", desc: "Exploring the rhythm of user interactions." },
    { title: "Creative Strategy", desc: "Connecting brand vision with technical execution." },
    { title: "Interface Design", desc: "Human-centric digital experiences that resonate." },
    { title: "Future Vision", desc: "Anticipating the next era of digital expression." },
    { title: "Pure Craft", desc: "Meticulous attention to every micro-interaction." },
];

const BentoFlipGallery: React.FC<BentoGalleryProps> = ({ images = defaultImages }) => {
    const galleryRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const ctxRef = useRef<gsap.Context>();
    const [activeProject, setActiveProject] = useState<number>(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const handleItemClick = (index: number) => {
        if (isFlipped || !galleryRef.current) return;

        setActiveProject(index);
        const gallery = galleryRef.current;
        const items = Array.from(gallery.querySelectorAll('.gallery__item'));
        const selectedItem = items[index];

        // Capture current state
        const state = Flip.getState(items);

        // Apply focused classes - immediately hide others to let Flip handle the transition
        gallery.classList.add('gallery--focused');
        selectedItem.classList.add('is-focused');

        items.forEach((item, i) => {
            if (i !== index) {
                // Instead of immediate opacity 0 class, we'll let Flip/GSAP handle it
                item.classList.add('not-focused');
            }
        });

        // Animate to focused state
        Flip.from(state, {
            duration: 1.2,
            ease: "expo.inOut",
            absolute: true, // Crucial for grid to single item transitions
            onStart: () => {
                setIsFlipped(true);
                // Fade out non-selected items cleanly
                gsap.to(items.filter((_, i) => i !== index), {
                    opacity: 0,
                    duration: 0.6,
                    ease: "power2.inOut"
                });
            },
            onComplete: () => {
                // Fade in text
                gsap.to(textRef.current, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power2.out"
                });
            }
        });
    };

    const revertFlip = () => {
        if (!isFlipped || !galleryRef.current) return;

        const gallery = galleryRef.current;
        const items = Array.from(gallery.querySelectorAll('.gallery__item'));

        // Fade out text first
        gsap.to(textRef.current, {
            opacity: 0,
            y: 20,
            duration: 0.3,
            onComplete: () => {
                const state = Flip.getState(items);

                // Remove focused classes
                gallery.classList.remove('gallery--focused');
                items.forEach(item => {
                    item.classList.remove('is-focused', 'not-focused');
                });

                // Animate back
                Flip.from(state, {
                    duration: 1.2,
                    ease: "expo.inOut",
                    absolute: true,
                    onStart: () => {
                        // Fade in items back
                        gsap.to(items, {
                            opacity: 1,
                            duration: 0.8,
                            ease: "power2.inOut"
                        });
                    },
                    onComplete: () => {
                        setIsFlipped(false);
                    }
                });
            }
        });
    };

    useEffect(() => {
        const galleryElement = galleryRef.current;
        const wrapperElement = wrapperRef.current;
        if (!galleryElement || !wrapperElement) return;

        ctxRef.current = gsap.context(() => {
            // Create ScrollTrigger to handle pinning and reversion
            ScrollTrigger.create({
                trigger: galleryElement,
                start: "top top",
                end: "+=150%",
                pin: wrapperElement,
                onEnterBack: () => {
                    // Revert if we scroll back to the beginning while flipped
                    revertFlip();
                },
                onLeaveBack: () => {
                    // Revert if we scroll above the section
                    revertFlip();
                }
            });

            // Use Observer to catch upward scroll gesture even at the top of the page
            if (isFlipped) {
                Observer.create({
                    target: window,
                    type: "wheel,touch,pointer",
                    onDown: () => {
                        // onDown triggers on wheel up or swipe down (intended for scrolling up)
                        revertFlip();
                    },
                    tolerance: 10,
                    preventDefault: false
                });
            }
        });

        return () => ctxRef.current?.revert();
    }, [isFlipped]); // Re-run when isFlipped changes to update ST callbacks if needed

    return (
        <>
            <style>{`
        .gallery--bento {
          display: grid;
          gap: 1.5vh;
          grid-template-columns: repeat(3, 30vw);
          grid-template-rows: repeat(4, 22vh);
          justify-content: center;
          align-content: center;
          transition: transform 0.3s ease-out;
        }
        
        /* Initial bento item layout */
        .gallery--bento .gallery__item:nth-child(1) { grid-area: 1 / 1 / 3 / 2; }
        .gallery--bento .gallery__item:nth-child(2) { grid-area: 1 / 2 / 2 / 3; }
        .gallery--bento .gallery__item:nth-child(3) { grid-area: 2 / 2 / 4 / 3; }
        .gallery--bento .gallery__item:nth-child(4) { grid-area: 1 / 3 / 3 / 3; }
        .gallery--bento .gallery__item:nth-child(5) { grid-area: 3 / 1 / 3 / 2; }
        .gallery--bento .gallery__item:nth-child(6) { grid-area: 3 / 3 / 5 / 4; }
        .gallery--bento .gallery__item:nth-child(7) { grid-area: 4 / 1 / 5 / 2; }
        .gallery--bento .gallery__item:nth-child(8) { grid-area: 4 / 2 / 5 / 3; }

        /* Focused styles */
        .gallery--focused {
          grid-template-columns: 100vw !important;
          grid-template-rows: 100vh !important;
          gap: 0 !important;
        }

        .gallery__item {
          cursor: pointer;
          overflow: hidden;
          will-change: transform, opacity;
        }

        .gallery__item.is-focused {
          grid-area: 1 / 1 / 2 / 2 !important;
          width: 100vw;
          height: 100vh;
          z-index: 50;
        }

        .gallery__item.not-focused {
          pointer-events: none;
        }

        .gallery__item:hover:not(.is-focused) {
          filter: brightness(1.2);
          z-index: 10;
        }

        .text-overlay {
          pointer-events: none;
          z-index: 60;
          mix-blend-mode: exclusion;
        }
      `}</style>

            <div
                ref={wrapperRef}
                className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black"
            >
                <div
                    ref={galleryRef}
                    className="gallery--bento gallery relative w-full h-full flex-none"
                >
                    {images.map((src, index) => (
                        <div
                            key={index}
                            className="gallery__item relative bg-cover bg-center flex-none"
                            onClick={() => handleItemClick(index)}
                        >
                            <img
                                src={src}
                                alt={`Gallery image ${index + 1}`}
                                className="object-cover w-full h-full"
                            />
                        </div>
                    ))}
                </div>

                {/* Text content that appears on focus */}
                <div
                    ref={textRef}
                    className="text-overlay absolute inset-0 flex flex-col items-center justify-center opacity-0 translate-y-10 text-center px-10"
                >
                    <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter mb-4">
                        {projectInfo[activeProject].title}
                    </h2>
                    <p className="text-lg md:text-xl text-white/90 max-w-2xl font-light tracking-wide uppercase">
                        {projectInfo[activeProject].desc}
                    </p>
                    <div className="mt-8 w-12 h-[1px] bg-white/50" />
                </div>

                {/* Scroll back indicator */}
                {isFlipped && (
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/40 text-xs uppercase tracking-[0.3em] animate-pulse">
                        Scroll up to return
                    </div>
                )}
            </div>

            <div className="section px-6 md:px-20 py-24 bg-white text-black">
                <h2 className="text-4xl md:text-6xl font-bold mb-12 tracking-tighter">THE NEW STANDARDS</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="border-t border-black/10 pt-6">
                            <span className="text-sm font-bold mb-4 block">0{i + 1}</span>
                            <p className="text-xl md:text-2xl leading-tight">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default BentoFlipGallery;