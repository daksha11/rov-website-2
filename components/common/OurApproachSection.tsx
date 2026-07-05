"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

export interface ApproachStep {
  title: string;
  description?: string;
  expandableContent?: string[];
  accentColor: string;
  textColor: string;
  bgColor: string;
}

interface OurApproachSectionProps {
  steps: ApproachStep[];
  /** "default" = black bg + orange border, "gradient" = ROV gradient bg */
  buttonVariant?: "default" | "gradient";
}

export default function OurApproachSection({
  steps,
  buttonVariant = "default",
}: OurApproachSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const initDoneRef = useRef(false);

  useEffect(() => {
    // Mobile / reduced-motion gate: never hijack native touch scrolling.
    if (typeof window === "undefined") return;
    const isSmallScreen = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (isSmallScreen || prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      lerp: 0.1,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", () => {
      ScrollTrigger.update();
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      // Mobile / reduced-motion gate: skip pinned/scrubbed timelines and
      // normalizeScroll so cards render as normal stacked sections and native
      // touch scrolling is untouched.
      if (typeof window !== "undefined") {
        const isSmallScreen = window.innerWidth < 768;
        const prefersReducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;
        if (isSmallScreen || prefersReducedMotion) {
          return () => {
            ScrollTrigger.getAll().forEach((t) => t.kill());
          };
        }
      }

      const initAnimations = () => {
        ScrollTrigger.getAll().forEach((t) => t.kill());

        ScrollTrigger.normalizeScroll(true);
        ScrollTrigger.config({ limitCallbacks: true });

        const panels = gsap.utils.toArray<HTMLElement>(".card-panel");
        const lastPanel = panels[panels.length - 1];

        panels.forEach((panel, index) => {
          const isLast = index === panels.length - 1;
          if (isLast) return;

          const inner = panel.querySelector<HTMLElement>(".card-inner");
          if (!inner) return;

          const panelHeight = inner.offsetHeight;
          const windowHeight = window.innerHeight;
          const difference = panelHeight - windowHeight;
          const fakeScrollRatio =
            difference > 0 ? difference / (difference + windowHeight) : 0;

          if (fakeScrollRatio) {
            panel.style.marginBottom = `${panelHeight * fakeScrollRatio}px`;
          } else {
            panel.style.marginBottom = "0px";
          }

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: panel,
              start: "center center",
              end: fakeScrollRatio
                ? `+=${inner.offsetHeight}`
                : "bottom top",
              pin: true,
              pinSpacing: false,
              scrub: 1,
              anticipatePin: 1,
              fastScrollEnd: true,
              preventOverlaps: true,
              invalidateOnRefresh: true,
              onToggle: (self) => {
                if (self.isActive) {
                  setActiveCardIndex(index);
                }
              },
            },
          });

          if (fakeScrollRatio) {
            tl.to(inner, {
              yPercent: -100,
              y: windowHeight,
              duration: 1 / (1 - fakeScrollRatio) - 1,
              ease: "none",
            });
          }

          tl.fromTo(
            panel,
            { scale: 1, opacity: 1 },
            { scale: 0.8, opacity: 0, duration: 0.5, ease: "power2.inOut" }
          );
        });

        ScrollTrigger.create({
          trigger: lastPanel,
          start: "top 80%",
          end: "bottom center",
          onToggle: (self) => {
            if (self.isActive) {
              setActiveCardIndex(panels.length - 1);
            }
          },
        });
      };

      // Single init after fonts are ready (fixes P13: triple-init)
      document.fonts.ready.then(() => {
        initAnimations();
        initDoneRef.current = true;
        ScrollTrigger.refresh();
      });

      return () => {
        ScrollTrigger.normalizeScroll(false);
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    },
    { scope: containerRef }
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 700);
    return () => clearTimeout(timer);
  }, [activeCardIndex]);

  useEffect(() => {
    if (modalIndex !== null) {
      document.documentElement.classList.add("lenis-stopped");
      document.body.classList.add("lenis-stopped");
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      lenisRef.current?.stop();
    } else {
      document.documentElement.classList.remove("lenis-stopped");
      document.body.classList.remove("lenis-stopped");
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      lenisRef.current?.start();
    }
  }, [modalIndex]);

  const openModal = (index: number) => {
    setModalIndex(index);

    gsap.fromTo(
      modalRef.current,
      { opacity: 0, visibility: "hidden" },
      { opacity: 1, visibility: "visible", duration: 0.4, ease: "power2.out" }
    );

    gsap.fromTo(
      modalContentRef.current,
      { scale: 0.9, y: 40, opacity: 0 },
      {
        scale: 1,
        y: 0,
        opacity: 1,
        duration: 0.6,
        delay: 0.1,
        ease: "power3.out",
      }
    );
  };

  const closeModal = () => {
    gsap.to(modalContentRef.current, {
      scale: 0.9,
      y: 40,
      opacity: 0,
      duration: 0.4,
      ease: "power3.in",
    });

    gsap.to(modalRef.current, {
      opacity: 0,
      visibility: "hidden",
      duration: 0.4,
      delay: 0.2,
      ease: "power2.in",
      onComplete: () => {
        setModalIndex(null);
      },
    });
  };

  const isGradient = buttonVariant === "gradient";

  return (
    <section className="relative w-full bg-black py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
      {/* Gradient Blobs */}
      <div
        className="absolute bottom-0 right-0 w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle, rgba(234, 154, 97, 0.15) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div
        className="absolute top-1/4 left-0 w-[300px] h-[300px] rounded-full pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle, rgba(177, 105, 55, 0.1) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10" ref={containerRef}>
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-16 lg:mb-24">
          <h2
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold"
            style={{
              fontFamily: "Norwige, sans-serif",
              fontStyle: "italic",
              color: "#FFF4E3",
            }}
          >
            Our Approach
          </h2>
          <p className="text-[#FFF4E3]/40 font-mono text-xs sm:text-sm tracking-widest mt-4 md:mt-0 md:mb-4">
            PHASE [01-0{steps.length}]
          </p>
        </div>

        {/* Stacked Cards */}
        <div className="relative flex flex-col items-center w-full">
          {steps.map((step, index) => (
            <div
              key={index}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              onClick={() => openModal(index)}
              className="card-panel relative w-full rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] overflow-hidden cursor-pointer group mb-6 sm:mb-8 md:mb-10 lg:mb-12"
              style={{
                backgroundColor:
                  activeCardIndex === index ? "#1E1A17" : "#111111",
                border:
                  activeCardIndex === index
                    ? "1px solid rgba(234, 154, 97, 0.3)"
                    : "1px solid rgba(255, 255, 255, 0.08)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                minHeight: "clamp(400px, 55vh, 650px)",
                transition:
                  "background-color 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease",
                zIndex: activeCardIndex === index ? 40 : 10 + index,
                boxShadow:
                  activeCardIndex === index
                    ? "0 40px 100px -20px rgba(0, 0, 0, 0.8), 0 0 40px rgba(234, 154, 97, 0.1)"
                    : "none",
              }}
            >
              <div className="card-inner w-full flex flex-col justify-center p-6 sm:p-8 md:p-12 lg:p-16 xl:p-24 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                  <div className="flex items-center">
                    <div className="relative w-full">
                      <span className="absolute -top-6 sm:-top-8 md:-top-12 left-0 sm:left-1 text-[#EA9A61] font-mono text-2xl sm:text-3xl md:text-4xl lg:text-5xl opacity-80">
                        0{index + 1}
                      </span>
                      <h3
                        className="step-title text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[11rem] font-bold leading-tight tracking-tighter"
                        style={{
                          fontFamily: "Norwige, sans-serif",
                          fontStyle: "italic",
                          color:
                            activeCardIndex === index ? "#EA9A61" : "#FFF4E3",
                          transition: "color 0.6s ease",
                          wordBreak: "keep-all",
                          overflowWrap: "normal",
                          hyphens: "none",
                        }}
                      >
                        {step.title}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Explore Button */}
              <div className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-auto md:bottom-8 md:right-8 lg:bottom-12 lg:right-12 z-20">
                <div className="relative group cursor-pointer">
                  <div className="absolute inset-0 bg-[#EA9A61] opacity-40 blur-xl rounded-full animate-pulse" />

                  <div
                    className={`relative flex items-center space-x-2 sm:space-x-3 md:space-x-4 px-4 py-3 sm:px-6 sm:py-3 md:px-8 md:py-4 lg:px-10 lg:py-5 rounded-full border-2 backdrop-blur-md transition-all duration-300 overflow-hidden shadow-[0_0_30px_rgba(234,154,97,0.3)] ${
                      isGradient
                        ? "border-[#EA9A61]/40 hover:border-[#EA9A61]"
                        : "border-[#EA9A61] bg-black/80 hover:bg-[#EA9A61]/20"
                    }`}
                    style={
                      isGradient
                        ? {
                            background:
                              "linear-gradient(132deg, #EA9A61 4.77%, #B16937 27.26%, #A64D2B 50.09%, #42201C 76.74%)",
                          }
                        : undefined
                    }
                  >
                    <div className="absolute inset-0 w-full h-full">
                      <div className="absolute inset-0 -translate-x-full animate-shine bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                    </div>

                    <svg
                      className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform ${
                        isGradient ? "text-[#FFF4E3]" : "text-[#EA9A61]"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>

                    <span
                      className={`relative font-mono text-xs sm:text-sm md:text-base tracking-[0.15em] sm:tracking-[0.2em] uppercase font-bold transition-colors whitespace-nowrap ${
                        isGradient
                          ? "text-[#FFF4E3]"
                          : "text-[#EA9A61] group-hover:text-[#FFF4E3]"
                      }`}
                    >
                      <span className="hidden sm:inline">CLICK TO EXPLORE</span>
                      <span className="sm:hidden">EXPLORE</span>
                    </span>

                    <svg
                      className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:translate-x-2 transition-transform ${
                        isGradient ? "text-[#FFF4E3]" : "text-[#EA9A61]"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Overlay */}
      <div
        ref={modalRef}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-xl invisible opacity-0"
        onClick={closeModal}
        data-lenis-prevent
      >
        {modalIndex !== null && (
          <div
            ref={modalContentRef}
            className="relative w-full max-w-5xl rounded-xl sm:rounded-2xl md:rounded-3xl lg:rounded-[3rem] p-5 sm:p-6 md:p-10 lg:p-14 xl:p-20 overflow-y-auto max-h-[85vh] sm:max-h-[90vh]"
            style={{
              backgroundColor: "#1E1A17",
              border: "1px solid rgba(234, 154, 97, 0.3)",
              boxShadow: "0 40px 100px rgba(0, 0, 0, 1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 lg:top-8 lg:right-8 text-[#FFF4E3]/40 hover:text-[#EA9A61] transition-colors font-mono text-[10px] sm:text-xs md:text-sm tracking-wider sm:tracking-widest flex items-center space-x-1 sm:space-x-2 group/close"
            >
              <span>CLOSE</span>
              <span className="w-4 sm:w-6 md:w-10 h-[1px] bg-[#FFF4E3]/20 group-hover/close:w-6 sm:group-hover/close:w-10 md:group-hover/close:w-16 group-hover/close:bg-[#EA9A61] transition-all duration-300" />
            </button>

            <div className="relative mb-6 sm:mb-8 md:mb-10 lg:mb-12 pt-6 sm:pt-0">
              <span className="absolute -top-4 sm:-top-6 md:-top-8 lg:-top-12 left-0 text-[#EA9A61] font-mono text-xs sm:text-sm md:text-base lg:text-xl opacity-50">
                0{modalIndex + 1}
              </span>
              <h2
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold italic pr-12 sm:pr-0"
                style={{
                  fontFamily: "Norwige, sans-serif",
                  color: "#EA9A61",
                  wordBreak: "keep-all",
                  overflowWrap: "normal",
                  hyphens: "none",
                  lineHeight: "1.1",
                }}
              >
                {steps[modalIndex].title}
              </h2>
            </div>

            <div className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
              {steps[modalIndex].expandableContent?.map((paragraph, pIdx) => (
                <p
                  key={pIdx}
                  className="text-[#FFF4E3] text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed sm:leading-relaxed md:leading-loose font-light opacity-95"
                  style={{ fontFamily: "Roboto, sans-serif" }}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
