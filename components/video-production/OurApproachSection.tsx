import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

type ApproachStep = {
  title: string;
  points: string[];
  description?: string;
  expandableContent?: string[];
  accentColor: string;
  textColor: string;
  bgColor: string;
};

const approachSteps: ApproachStep[] = [
  {
    title: "PLAN",
    points: [],
    description: "A good video starts way before you press record. We get into it with you first — your goals, your audience, the story you actually want to tell.",
    expandableContent: [
      "A good video starts way before you press record. We get into it with you first — your goals, your audience, the story you actually want to tell. From there we scout the location, figure out the light, and put together a shot list that covers every moment worth capturing.",
      "By the time shoot day comes around, you know exactly what we're going after and why. No surprises, no winging it."
    ],
    accentColor: "#FFF4E3",
    textColor: "#FFF4E3",
    bgColor: "#1A1A1A"
  },
  {
    title: "SHOOT",
    points: [],
    description: "This is the part everyone sees. We show up with pro cameras, drones, and a full lighting kit, and we work through the shot list with focus.",
    expandableContent: [
      "This is the part everyone sees. We show up with pro cameras, drones, and a full lighting kit, and we work through the shot list with focus. But we're also paying attention to what's happening in the room, because sometimes the best stuff isn't on the list.",
      "We handle the capture start to finish, so nothing gets dropped or miscommunicated. You walk away with raw footage that's got range and actually holds up in the edit."
    ],
    accentColor: "linear-gradient(135deg, #EA9A61 0%, #B16937 50%, #A64D2B 100%)",
    textColor: "#FFF4E3",
    bgColor: "#2A2420"
  },
  {
    title: "ORGANIZE",
    points: [],
    description: "Not the exciting part, but it matters more than most people realize. Before we touch the timeline, every file gets named properly.",
    expandableContent: [
      "Not the exciting part, but it matters more than most people realize. Before we touch the timeline, every file gets named properly and sorted into a folder structure that makes sense.",
      "No hunting for clips, no mystery files, no chaos when the project gets big. Getting this right upfront means the actual edit goes faster and cleaner."
    ],
    accentColor: "#FFF4E3",
    textColor: "#FFF4E3",
    bgColor: "#1A1A1A"
  },
  {
    title: "EDIT",
    points: [],
    description: "Here's where it comes together. We pull the best takes, find the shape of the story, cut it to rhythm, and bring in music and sound.",
    expandableContent: [
      "Here's where it comes together. We pull the best takes, find the shape of the story, cut it to rhythm, and bring in music, sound, and any motion graphics the project needs.",
      "We send you cuts, you give us notes, we go back in. That loop keeps going until the pacing and the message both feel right. We're not done until it actually feels done."
    ],
    accentColor: "#FFF4E3",
    textColor: "#FFF4E3",
    bgColor: "#1A1A1A"
  },
  {
    title: "COLOR",
    points: [],
    description: "Color grade is what separates footage that looks fine from footage that looks like it belongs somewhere.",
    expandableContent: [
      "Color grade is what separates footage that looks fine from footage that looks like it belongs somewhere. We go through the whole piece deliberately, dialing in skin tones, managing the highlights, and building a look that holds together start to finish.",
      "It's not just a correction. It's the thing that makes the final product feel like it was made with intention."
    ],
    accentColor: "#FFF4E3",
    textColor: "#FFF4E3",
    bgColor: "#1A1A1A"
  },
  {
    title: "DELIVER",
    points: [],
    description: "You get the final cut in whatever formats you need, sized and compressed for wherever it's going.",
    expandableContent: [
      "You get the final cut in whatever formats you need, sized and compressed for wherever it's going. We take care of the specs so you don't have to think about codecs or aspect ratios.",
      "And we don't just hand you a folder and disappear. We walk you through what you've got, how to use it, and where it could go next, whether that's a cut-down for social media or the foundation for something bigger down the road."
    ],
    accentColor: "#FFF4E3",
    textColor: "#FFF4E3",
    bgColor: "#1A1A1A"
  }
];

export default function OurApproachSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
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

  useGSAP(() => {
    if (!containerRef.current) return;

    // Wrap animation logic in a function so it can be re-run
    const initAnimations = () => {
      // Kill all existing ScrollTriggers to prevent duplicates
      ScrollTrigger.getAll().forEach(t => t.kill());

      // Help with sync
      ScrollTrigger.normalizeScroll(true);
      ScrollTrigger.config({ limitCallbacks: true });

      const panels = gsap.utils.toArray<HTMLElement>(".card-panel");
      const lastPanel = panels[panels.length - 1];

      panels.forEach((panel, index) => {
        const isLast = index === panels.length - 1;
        if (isLast) return;

        const inner = panel.querySelector<HTMLElement>(".card-inner");
        if (!inner) return;

        const calculateLayout = () => {
          const panelHeight = inner.offsetHeight;
          const windowHeight = window.innerHeight;
          const difference = panelHeight - windowHeight;
          const fakeScrollRatio = difference > 0 ? difference / (difference + windowHeight) : 0;

          if (fakeScrollRatio) {
            panel.style.marginBottom = `${panelHeight * fakeScrollRatio}px`;
          } else {
            panel.style.marginBottom = "0px";
          }
          return { fakeScrollRatio, innerHeight: inner.offsetHeight, windowHeight };
        };

        const { fakeScrollRatio, windowHeight: wh } = calculateLayout();

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            start: "center center",
            end: fakeScrollRatio ? `+=${inner.offsetHeight}` : "bottom top",
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
            }
          },
        });

        if (fakeScrollRatio) {
          tl.to(inner, {
            yPercent: -100,
            y: wh,
            duration: 1 / (1 - fakeScrollRatio) - 1,
            ease: "none",
          });
        }

        tl.fromTo(
          panel,
          { scale: 1, opacity: 1 },
          {
            scale: 0.8,
            opacity: 0,
            duration: 0.5,
            ease: "power2.inOut"
          }
        );
      });

      // Special trigger for the last card to become active
      ScrollTrigger.create({
        trigger: lastPanel,
        start: "top 80%",
        end: "bottom center",
        onToggle: (self) => {
          if (self.isActive) {
            setActiveCardIndex(panels.length - 1);
          }
        }
      });
    };

    // Run animations immediately
    initAnimations();

    // Re-run animations after fonts are loaded to ensure correct height calculations
    document.fonts.ready.then(() => {
      initAnimations();
      ScrollTrigger.refresh();
    });

    // Fallback: Re-run animations after 500ms to ensure DOM is fully settled
    setTimeout(() => {
      initAnimations();
      ScrollTrigger.refresh();
    }, 500);

    return () => {
      ScrollTrigger.normalizeScroll(false);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, { scope: containerRef }); // Removed dependencies to avoid re-creating triggers

  useEffect(() => {
    // When active card index changes, the layout might shift after transition
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

  const toggleCard = (index: number) => {
    openModal(index);
  };

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
      { scale: 1, y: 0, opacity: 1, duration: 0.6, delay: 0.1, ease: "power3.out" }
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

  return (
    <section
      className="relative w-full bg-black py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8"
    >
      {/* Gradient Blobs */}
      <div
        className="absolute bottom-0 right-0 w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, rgba(234, 154, 97, 0.15) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div
        className="absolute top-1/4 left-0 w-[300px] h-[300px] rounded-full pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, rgba(177, 105, 55, 0.1) 0%, transparent 70%)",
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
            PHASE [01-06]
          </p>
        </div>

        {/* Stacked Cards */}
        <div className="relative flex flex-col items-center w-full">
          {approachSteps.map((step, index) => (
            <div
              key={index}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              onClick={() => toggleCard(index)}
              className="card-panel relative w-full rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] overflow-hidden cursor-pointer group mb-6 sm:mb-8 md:mb-10 lg:mb-12"
              style={{
                backgroundColor: activeCardIndex === index ? "#1E1A17" : "#111111",
                border: activeCardIndex === index
                  ? "1px solid rgba(234, 154, 97, 0.3)"
                  : "1px solid rgba(255, 255, 255, 0.08)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                minHeight: "clamp(400px, 55vh, 650px)",
                transition: "background-color 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease",
                zIndex: activeCardIndex === index ? 40 : 10 + index,
                boxShadow: activeCardIndex === index
                  ? "0 40px 100px -20px rgba(0, 0, 0, 0.8), 0 0 40px rgba(234, 154, 97, 0.1)"
                  : "none",
              }}
            >
              <div className="card-inner w-full flex flex-col justify-center p-6 sm:p-8 md:p-12 lg:p-16 xl:p-24 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                  {/* Left Side - Title */}
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
                          color: activeCardIndex === index ? "#EA9A61" : "#FFF4E3",
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

                  {/* Right Side - Content removed from card preview */}
                  {/* Description only shows in modal when clicked */}
                </div>
              </div>

              {/* Interaction Hint - Prominent with Shine Animation */}
              <div className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-auto md:bottom-8 md:right-8 lg:bottom-12 lg:right-12 z-20">
                <div className="relative group cursor-pointer">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-[#EA9A61] opacity-40 blur-xl rounded-full animate-pulse" />

                  {/* Main button */}
                  <div className="relative flex items-center space-x-2 sm:space-x-3 md:space-x-4 px-4 py-3 sm:px-6 sm:py-3 md:px-8 md:py-4 lg:px-10 lg:py-5 rounded-full border-2 border-[#EA9A61] bg-black/80 backdrop-blur-md hover:bg-[#EA9A61]/20 transition-all duration-300 overflow-hidden shadow-[0_0_30px_rgba(234,154,97,0.3)]">
                    {/* Shine animation overlay */}
                    <div className="absolute inset-0 w-full h-full">
                      <div className="absolute inset-0 -translate-x-full animate-shine bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                    </div>

                    {/* Icon */}
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#EA9A61] group-hover:scale-110 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>

                    {/* Text */}
                    <span className="relative text-[#EA9A61] font-mono text-xs sm:text-sm md:text-base tracking-[0.15em] sm:tracking-[0.2em] uppercase font-bold group-hover:text-[#FFF4E3] transition-colors whitespace-nowrap">
                      <span className="hidden sm:inline">CLICK TO EXPLORE</span>
                      <span className="sm:hidden">EXPLORE</span>
                    </span>

                    {/* Arrow */}
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#EA9A61] group-hover:translate-x-2 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Shine animation keyframes */}
              <style jsx>{`
                @keyframes shine {
                  0% {
                    transform: translateX(-100%);
                  }
                  100% {
                    transform: translateX(100%);
                  }
                }
                
                .animate-shine {
                  animation: shine 3s ease-in-out infinite;
                }
              `}</style>
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
                {approachSteps[modalIndex].title}
              </h2>
            </div>

            <div className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
              {approachSteps[modalIndex].expandableContent?.map((paragraph, index) => (
                <p
                  key={index}
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
