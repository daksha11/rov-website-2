import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import styled, { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'ProximaNovaBlack';
    src: url('/fonts/proximanova_black.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
  }
  body {
    font-family: 'ProximaNovaBlack', sans-serif;
  }
`;

const cards = [
  {
    id: 1,
    description:
      "What's the biggest obstacle stopping creatives and brands from reaching their full potential? \n\nFriction. \nWhether you're an artist struggling with mixing and mastering, a brand in need of standout visuals, or a creator looking to refine your online presence, the creative process can feel overwhelming without the right support. \nUntil now.",
    image: "/R.png",
    color: "#FF916E",
  },
  {
    id: 2,
    description:
      "For artists without a large team or substantial budget, finding the right engineer or spending hours mixing tracks themselves can be an uphill battle. \n\nThis is friction at its core—time lost, energy drained, and creativity dimmed. \n\nAt R.O.V, we bridge that gap by offering professional-grade mixing and mastering services tailored to your needs: all at a fraction of the cost.",
    image: "/O.png",
    color: "#ffc672",
  },
  {
    id: 3,
    description:
      "Cover art, visualizers, video editing—the visual side of artistry can feel like an endless challenge. But it's not just artists. \n\nBrands and creators alike struggle with crafting visuals that leave a lasting impact. Without a dedicated team, these critical steps often slow progress and limit growth. \n\nThat's where we come in. We simplify the process, delivering stunning designs, polished visuals, and seamless websites that elevate your brand. Cutting through the friction so you can create more, faster, and better.",
    image: "/V.png",
    color: "#90d0e3",
  },
  {
    id: 4,
    description:
      "Creativity shouldn't be held back by friction. At Range Of View, we're more than just a service—we're your partner in bringing ideas to life. \n\nWhether you're launching your next big project, refining your brand, or upgrading your website, we make sure nothing slows you down. \n\nYour vision, our expertise. Let's build something remarkable.",
    image: "/ROV.png",
    color: "linear-gradient(to right, #FF916E, #ffc672, #90d0e3)",
  },
];

export function Card({
  card,
  progress,
  index,
  totalCards,
}: {
  card: typeof cards[number];
  progress: any;
  index: number;
  totalCards: number;
}) {
  const segment = 1 / totalCards;
  const start = segment * index;
  const end = start + segment;

  const opacity = useTransform(
    progress,
    [Math.max(0, start - segment / 2), start, end, Math.min(1, end + segment / 2)],
    [0, 1, 1, 0]
  );

  const y = useTransform(progress, [start, end], ["0%", "-100%"]);

  const headings: { [key: number]: string } = {
    1: "FRICTION: THE HIDDEN BARRIER",
    2: "MIXING & MASTERING: ELIMINATING THE NOISE",
    3: "GRAPHIC DESIGN: BRINGING VISIONS TO LIFE",
    4: "YOUR VISION, OUR MISSION",
  };

  // Create gradient background for the image container if it's card 4
  const imageBackground = card.id === 4 
    ? { background: card.color }
    : { backgroundColor: card.color };

  return (
    <motion.div
      style={{ opacity, y, position: "absolute", width: "100%", height: "100%" }}
      className="flex items-center justify-center p-4 sm:p-6 md:p-8"
    >
      <div className="bg-white rounded-3xl w-full max-w-[90%] md:max-w-6xl min-h-[70vh] md:h-[80vh] p-8 sm:p-12 md:p-16 overflow-y-auto">
        {/* Mobile layout */}
        <div className="md:hidden flex flex-col h-full items-center">
          <div className="w-full mb-4 relative aspect-square max-w-[200px] flex items-center justify-center">
            <img
              src={card.image}
              alt={`Illustration ${card.id}`}
              className="w-full h-full object-cover rounded-xl"
              style={imageBackground}
            />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 uppercase tracking-tighter text-center w-full">
            <span style={card.id === 4 ? { backgroundImage: card.color, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } : { color: card.color }}>
              {headings[card.id]}
            </span>
          </h2>
          <div 
            className="text-gray-600 text-base sm:text-lg leading-relaxed whitespace-pre-line w-full"
            style={{ fontFamily: 'ProximaNovaBlack, sans-serif' }}
          >
            {card.description}
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden md:flex h-full gap-8 items-start">
          <div className="w-[400px] relative aspect-square flex-shrink-0">
            <img
              src={card.image}
              alt={`Illustration ${card.id}`}
              className="w-full h-full object-cover rounded-xl"
              style={imageBackground}
            />
          </div>
          <div className="flex flex-col gap-4 pt-4">
            <h2 className="text-4xl font-bold uppercase tracking-tighter leading-tight">
              <span style={card.id === 4 ? { backgroundImage: card.color, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } : { color: card.color }}>
                {headings[card.id]}
              </span>
            </h2>
            <div 
              className="text-gray-600 text-lg leading-relaxed whitespace-pre-line"
              style={{ fontFamily: 'ProximaNovaBlack, sans-serif' }}
            >
              {card.description}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function CardList() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  return (
    <main>
      <GlobalStyle />
      <div
        ref={containerRef}
        className="relative min-h-[400vh] bg-[#0]" 
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          {cards.map((card, index) => (
            <Card
              key={card.id}
              card={card}
              progress={scrollYProgress}
              index={index}
              totalCards={cards.length}
            />
          ))}
        </div>
      </div>
    </main>
  );
}