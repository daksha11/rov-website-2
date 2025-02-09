"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const cards = [
  {
    id: 1,
    title: "CREATION",
    subtitle: {
      line1: "You have an idea?",
      line2: "We have the method.",
    },
    description:
      "There are a thousand and one ways to make a podcast. We help you find yours. Thanks to the editorial and technical expertise of our team, we help you choose the best sound format for your project: the one that will meet your goals, your desires, and that will make your message shine.",
    number: "1",
    color: "#FFB84C",
  },
  {
    id: 2,
    title: "PRODUCTION",
    description:
      "For each project, a team of passionate, selected and dedicated professionals intervenes at each stage and according to your needs:\n\nPre-production → writing the script, casting the voices, choosing the sound identity.\nRecording → in a studio in Toulouse, on site, or relocated to a mobile studio.\nPost-production → editing, sound design, mixing, mastering.",
    number: "2",
    color: "#83C5BE",
  },
  {
    id: 3,
    title: "DISTRIBUTION",
    description:
      "Get your content to the right audience through strategic distribution channels. Our team helps you:\n\nPlatform Selection → choosing the right hosting and streaming platforms\nOptimization → SEO and metadata optimization for maximum visibility\nAnalytics → tracking and analyzing performance metrics",
    number: "3",
    color: "#E07A5F",
  },
  {
    id: 4,
    title: "GROWTH",
    description:
      "Scale your podcast's reach and impact with our growth strategies:\n\nAudience Building → community engagement and listener retention\nMonetization → sponsorship opportunities and revenue streams\nBrand Development → establishing a strong podcast identity",
    number: "4",
    color: "#81B29A",
  },
];

export default function CardList() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"], // Adjusted to prevent extra gap
  });

  return (
    <main>
      <div
        ref={containerRef}
        className={`relative min-h-[${cards.length * 100}vh] bg-[#0]`} // Changed min height
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
      <div className="bg-white rounded-2xl w-full max-w-6xl h-[80vh] p-12">
        <div className="flex justify-between items-start h-full relative">
          <div className="space-y-8 max-w-2xl">
            <h2 className="text-6xl font-light tracking-tight">{card.title}</h2>
            {card.subtitle && (
              <div className="space-y-1">
                <p className="text-2xl font-medium">{card.subtitle.line1}</p>
                <p className="text-2xl font-medium">{card.subtitle.line2}</p>
              </div>
            )}
            <div className="text-gray-600 text-lg leading-relaxed whitespace-pre-line">
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
