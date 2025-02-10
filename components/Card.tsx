"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const cards = [
  {
    id: 1,
    //title: "Friction: The Hidden Barrier",
    description:
      "What’s the biggest obstacle stopping creatives and brands from reaching their full potential? \n\nFriction. \nWhether you're an artist struggling with mixing and mastering, a brand in need of standout visuals, or a creator looking to refine your online presence, the creative process can feel overwhelming without the right support. \nUntil now.",
    number: "1",
    color: "#FFB84C",
  },
  {
    id: 2,
    //title: "Mixing & Mastering: Eliminating the Noise",
    description:
      "For artists without a large team or substantial budget, finding the right engineer or spending hours mixing tracks themselves can be an uphill battle. \n\nThis is friction at its core—time lost, energy drained, and creativity dimmed. \n\nAt R.O.V, we bridge that gap by offering professional-grade mixing and mastering services tailored to your needs: all at a fraction of the cost.",
    number: "2",
    color: "#83C5BE",
  },
  {
    id: 3,
    //title: "Graphic Design: Bringing Visions to Life",
    description:
      "Cover art, visualizers, video editing—the visual side of artistry can feel like an endless challenge. But it’s not just artists. \n\nBrands and creators alike struggle with crafting visuals that leave a lasting impact. Without a dedicated team, these critical steps often slow progress and limit growth. \n\nThat’s where we come in. We simplify the process, delivering stunning designs, polished visuals, and seamless websites that elevate your brand. Cutting through the friction so you can create more, faster, and better.",
    number: "3",
    color: "#E07A5F",
  },
  {
    id: 4,
    //title: "Your Vision, Our Mission",
    description:
      "Creativity shouldn’t be held back by friction. At Range Of View, we’re more than just a service—we’re your partner in bringing ideas to life. \n\nWhether you’re launching your next big project, refining your brand, or upgrading your website, we make sure nothing slows you down. \n\nYour vision, our expertise. Let’s build something remarkable.",
    number: "4",
    color: "#81B29A",
  },
];

export default function CardList() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  return (
    <main>
      <div
        ref={containerRef}
        className="relative min-h-[400vh] bg-[#0]" // Adjusted min-height
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

  return (
    <motion.div
      style={{ opacity, y, position: "absolute", width: "100%", height: "100%" }}
      className="flex items-center justify-center p-8"
    >
      <div className="bg-white rounded-2xl w-full max-w-6xl h-[80vh] p-12 overflow-y-auto">
        <div className="flex justify-between items-start h-full relative">
          <div className="space-y-8 max-w-2xl">
            <h2 className="text-4xl font-light tracking-tight">{card.title}</h2>
            {card.subtitle && (
              <div className="space-y-1">
                <p className="text-2xl font-medium">{card.subtitle.line1}</p>
                <p className="text-2xl font-medium">{card.subtitle.line2}</p>
              </div>
            )}
            <div className="text-gray-600 text-lg leading-relaxed whitespace-pre-line overflow-y-auto">
              {card.description}
            </div>
          </div>
          <div
            style={{ color: card.color }}
            className="text-[20rem] font-bold leading-none absolute right-0 top-0 -mt-8"
          >
            {card.number}
          </div>
        </div>
      </div>
    </motion.div>
  );
}