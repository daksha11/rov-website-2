"use client";

import React, { useState, useCallback, useRef } from "react";
import Link from "next/link";
import StarBorder from "./StarBorder";
import Image from "next/image";
import GradientBlob from "./GradientBlob";

const darkenColor = (hex: string, percent: number): string => {
  let color = hex.startsWith('#') ? hex.slice(1) : hex;
  if (color.length === 3) {
    color = color
      .split('')
      .map(c => c + c)
      .join('');
  }
  const num = parseInt(color, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  r = Math.max(0, Math.min(255, Math.floor(r * (1 - percent))));
  g = Math.max(0, Math.min(255, Math.floor(g * (1 - percent))));
  b = Math.max(0, Math.min(255, Math.floor(b * (1 - percent))));
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

const InteractiveFolderIcon: React.FC<{ folderImages?: string[] }> = ({ folderImages }) => {
  const maxItems = 3;
  const [open, setOpen] = useState(false);
  const [paperOffsets, setPaperOffsets] = useState<{ x: number; y: number }[]>(
    Array.from({ length: maxItems }, () => ({ x: 0, y: 0 }))
  );
  const rafRef = useRef<number | null>(null);

  const defaultImages = ['/rov_album_1.webp', '/rov_album_2.webp', '/rov_album_3.webp'];
  const sourceImages = folderImages || defaultImages;

  // State to hold the currently displayed (shuffled) images
  const [displayImages, setDisplayImages] = useState<string[]>(sourceImages);

  // Effect to update default display if prop changes (though shuffle happens on hover)
  React.useEffect(() => {
    setDisplayImages(folderImages || defaultImages);
  }, [folderImages]);

  const handleMouseEnter = () => {
    // Shuffle images on hover
    const shuffled = [...sourceImages];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setDisplayImages(shuffled);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    setOpen(false);
    setPaperOffsets(Array.from({ length: maxItems }, () => ({ x: 0, y: 0 })));
    // Optional: Reset back to original order on leave, or keep last shuffle. 
    // Keeping last shuffle feels smoother.
  };

  const handlePaperMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
    if (!open) return;

    // Throttle with RAF to prevent lag
    if (rafRef.current !== null) return;

    // Capture values from the event before RAF (React events are pooled)
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;

    rafRef.current = requestAnimationFrame(() => {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const offsetX = (clientX - centerX) * 0.15;
      const offsetY = (clientY - centerY) * 0.15;
      setPaperOffsets(prev => {
        const newOffsets = [...prev];
        newOffsets[index] = { x: offsetX, y: offsetY };
        return newOffsets;
      });
      rafRef.current = null;
    });
  }, [open]);

  const handlePaperMouseLeave = (index: number) => {
    setPaperOffsets(prev => {
      const newOffsets = [...prev];
      newOffsets[index] = { x: 0, y: 0 };
      return newOffsets;
    });
  };

  const getOpenTransform = (index: number) => {
    if (index === 0) return 'translate(-110%, -60%) rotate(-15deg)';
    if (index === 1) return 'translate(15%, -60%) rotate(15deg)';
    if (index === 2) return 'translate(-50%, -80%) rotate(5deg)';
    return '';
  };



  return (
    <div className="relative mb-8 sm:mb-12 md:mb-20">
      <style jsx>{`
        .folder-container {
          transform: scale(0.85);
          transform-origin: center;
        }
        @media (min-width: 640px) {
          .folder-container {
            transform: scale(1.5);
          }
        }
        @media (min-width: 1024px) {
          .folder-container {
            transform: scale(2.5);
          }
        }
      `}</style>
      <div
        className="group relative cursor-pointer folder-container"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      // Removed inline transform to let CSS handle it
      >
        <div className="relative w-[100px] h-[80px]">
          {/* Folder Back - always visible (darker, behind) */}
          <div
            className="absolute inset-0"
            style={{
              zIndex: 5,
              pointerEvents: 'none',
              transform: 'translate3d(0,0,0)'
            }}
          >
            <Image
              src="/folderback.svg"
              alt="Folder Back"
              fill
              unoptimized
              className="object-contain"
              style={{ pointerEvents: 'none' }}
            />
          </div>

          {/* Images that pop out */}
          {displayImages.map((src, i) => {
            let sizeClasses = '';
            if (i === 0) sizeClasses = 'w-[50%] h-[45%]';
            if (i === 1) sizeClasses = 'w-[55%] h-[48%]';
            if (i === 2) sizeClasses = 'w-[60%] h-[50%]';

            const closedTransform = 'translate(-50%, 0%)';
            const openTransform = open
              ? `${getOpenTransform(i)} translate(${paperOffsets[i].x}px, ${paperOffsets[i].y}px)`
              : closedTransform;

            return (
              <div
                key={i}
                onMouseMove={e => handlePaperMouseMove(e, i)}
                onMouseLeave={() => handlePaperMouseLeave(i)}
                className={`absolute bottom-[15%] left-1/2 transition-all duration-300 ease-in-out overflow-hidden ${!open ? 'opacity-0' : 'opacity-100 hover:scale-105'
                  } ${sizeClasses}`}
                style={{
                  transform: `${openTransform} translate3d(0,0,0)`,
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                  zIndex: open ? 20 + i : 20 - i,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  willChange: open ? 'transform, opacity' : 'auto'
                }}
              >
                <Image
                  src={src}
                  alt={`Item ${i + 1}`}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="60px"
                />
              </div>
            );
          })}

          {/* View More Button - always visible */}
          <div
            className="absolute left-1/2 top-[65%] -translate-x-1/2 -translate-y-1/2"
            style={{ zIndex: 35, pointerEvents: 'none' }}
          >
            <button
              className="px-2 py-0.5 text-white font-light whitespace-nowrap"
              style={{
                borderRadius: '30px',
                background: 'rgba(255, 244, 227, 0.10)',
                border: '0.5px solid rgba(255, 244, 227, 0.3)',
                fontFamily: 'Roboto, sans-serif',
                fontSize: '7px',
                fontWeight: '300',
                letterSpacing: '0.2px',
                pointerEvents: 'auto'
              }}
            >
              View More
            </button>
          </div>

          {/* Folder Front - opens on hover */}
          <div
            className="absolute inset-0 z-30 origin-bottom transition-all duration-300 ease-in-out"
            style={{
              transform: open ? 'rotateX(65deg) translate3d(0,0,0)' : 'rotateX(0deg) translateY(8px) translate3d(0,0,0)',
              transformStyle: 'preserve-3d',
              willChange: 'transform'
            }}
          >
            <Image
              src="/folderfront.svg"
              alt="Folder Front"
              fill
              unoptimized
              className="object-contain"
              style={{ pointerEvents: 'none' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface ServiceCardProps {
  title: string;
  link?: string;
  previewImages?: string[];
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  link = "#",
  previewImages,
}) => {
  return (
    <Link href={link}>
      <div className="relative group cursor-pointer">
        {/* Main Card */}
        <div
          className="flex flex-col items-center justify-center gap-2.5 transition-all duration-300 hover:shadow-lg p-4 md:py-[60px] md:px-[80px] min-h-[280px] md:min-h-[500px]"
          style={{
            borderRadius: '28px',
            border: '1px solid #D0BEA5',
            background: '#110C09',
            boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
          }}
        >
          {/* Interactive Fggbolder Component */}
          <InteractiveFolderIcon folderImages={previewImages} />

          {/* Service Title - Inside the card */}
          <h3
            className="text-lg md:text-3xl text-center font-normal mt-4 md:mt-8"
            style={{ fontFamily: 'Roboto, sans-serif', color: '#FFF4E3' }}
          >
            {title}
          </h3>
        </div>


      </div>
    </Link>
  );
};

export default function Services() {
  const services = [
    {
      id: "web",
      title: "Web Optimization",
      link: "/web",
      previewImages: [
        '/heroassets/webfolder1.webp',
        '/heroassets/webfolder2.webp',
        '/heroassets/webfolder3.webp'
      ],
    },
    {
      id: "sound",
      title: "Sound Engineering",
      link: "/sound",
      previewImages: [
        '/thumbnails/studiothumbnail.webp',
        '/heroassets/flimage2.webp',
        '/heroassets/event_3.webp'
      ],
    },
    {
      id: "video",
      title: "Video Production",
      link: "/video-production",
      previewImages: [
        '/heroassets/hydvideoframe.webp',
        '/heroassets/ponceshowframe.webp',
        '/heroassets/samxbasuvid.webp'
      ],
    },
    {
      id: "ai",
      title: "AI Solutions",
      link: "/ai-automation",
      previewImages: [
        '/heroassets/codingframe.webp',
        '/heroassets/excelframe.webp',
        '/heroassets/n8nframe.webp'
      ],
    },
  ];

  return (
    <section className="min-h-screen bg-black py-20 w-full px-6 sm:px-12 md:px-16 relative flex flex-col justify-center overflow-hidden">
      <GradientBlob position="top-left" />
      <GradientBlob position="bottom-right" />

      {/* Top Gradient Fade - Blends with previous section */}
      <div
        className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent z-5 pointer-events-none"
      />

      {/* Bottom Gradient Fade - Blends with next section */}
      <div
        className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-5 pointer-events-none"
      />

      {/* Decorative stars - REMOVED */}

      <div className="w-full relative z-10">
        <style jsx>{`
          @keyframes float {
            0%,
            100% {
              transform: translate(-50%, 0px);
            }
            50% {
              transform: translate(-50%, -20px);
            }
          }

          .services-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
            min-height: auto;
          }

          @media (min-width: 768px) {
            .services-grid {
              grid-template-columns: repeat(2, 1fr);
              grid-template-rows: auto;
              height: auto;
              gap: 2rem;
            }
             /* Use larger min-height on desktop via explicit style override if needed, 
                but handling via className/style props is better. 
                Added style block for specific desktop min-height override on cards if needed,
                but inline styles on the card handle the base. Let's add a utility class or just rely on inline styles.
             */
          }

          .services-grid.has-expanded {
             /* Mobile behavior when expanded: Expanded card takes order -1 to go top, others show below or hide? 
                Actually, simpler to just stack them on mobile and expand in place. 
                The 'grid-column' logic below is desktop specific.
             */
             grid-template-columns: 1fr;
             grid-template-rows: auto;
          }

          @media (min-width: 768px) {
            .services-grid.has-expanded {
              grid-template-columns: 2fr 1fr;
              grid-template-rows: repeat(3, 1fr);
              height: 800px;
              max-height: 85vh;
            }

            .expanded-card {
              grid-column: 1 / 2;
              grid-row: 1 / 4;
            }

            .collapsed-card {
              grid-column: 2 / 3;
            }
          }

          .normal-card {
            /* Default positioning in 2x2 grid */
          }

        `}</style>

        <div className="mb-12">
          <h2
            className="text-4xl md:text-6xl lg:text-[10rem] text-white/90 uppercase tracking-wider mb-4 text-left"
            style={{ fontFamily: "Norwige, sans-serif" }}
          >
            SERVICES
          </h2>
        </div>

        {/* Dynamic grid */}
        <div className="services-grid">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              title={service.title}
              link={service.link}
              previewImages={service.previewImages}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
