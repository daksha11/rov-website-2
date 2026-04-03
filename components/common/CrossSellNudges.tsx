import React from "react";

type ServiceId = "video-production" | "web" | "ai" | "ai-automation" | "sound";

interface CardData {
  id: ServiceId;
  href: string;
  label: string;
  headline: string;
  subtext: string;
  ctaText: string;
  icon: React.ReactNode;
}

const ICON_CLASS = "w-5 h-5 text-[#EA9A61] shrink-0";

const CARDS: Record<ServiceId, CardData> = {
  "video-production": {
    id: "video-production",
    href: "/video-production",
    label: "Video Production",
    headline: "Need content that actually stops the scroll?",
    subtext:
      "From concept reels to full productions \u2014 we shoot what your brand needs to say.",
    ctaText: "See our video work",
    icon: (
      <svg className={ICON_CLASS} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
    ),
  },
  web: {
    id: "web",
    href: "/web",
    label: "Web Development",
    headline: "Losing RSVPs to a website that doesn\u2019t convert?",
    subtext:
      "Your content looks great on camera. Make sure it looks just as good where people actually book.",
    ctaText: "See our web solutions",
    icon: (
      <svg className={ICON_CLASS} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A8.966 8.966 0 0 1 3 12c0-1.264.26-2.467.73-3.418" />
      </svg>
    ),
  },
  ai: {
    id: "ai",
    href: "/ai-automation",
    label: "AI Systems",
    headline: "Ready to put AI behind the wheel?",
    subtext:
      "From content generation to intelligent assistants \u2014 we build AI systems tailored to your workflow.",
    ctaText: "Explore AI systems",
    icon: (
      <svg className={ICON_CLASS} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z" />
      </svg>
    ),
  },
  "ai-automation": {
    id: "ai-automation",
    href: "/ai-automation",
    label: "AI Automation",
    headline: "Still chasing clients through DMs and spreadsheets?",
    subtext:
      "Automate follow-ups, booking confirmations, and lead capture. So you can focus on creating.",
    ctaText: "Explore AI workflows",
    icon: (
      <svg className={ICON_CLASS} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
      </svg>
    ),
  },
  sound: {
    id: "sound",
    href: "/sound",
    label: "Sound Engineering",
    headline: "Your visuals are sharp \u2014 does your audio match?",
    subtext:
      "Professional mixing, mastering, and sound design that makes every project hit harder.",
    ctaText: "Hear our work",
    icon: (
      <svg className={ICON_CLASS} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" />
      </svg>
    ),
  },
};

const CROSS_SELL_MAP: Record<ServiceId, [ServiceId, ServiceId]> = {
  "video-production": ["web", "ai-automation"],
  web: ["video-production", "ai-automation"],
  ai: ["ai-automation", "web"],
  "ai-automation": ["ai", "web"],
  sound: ["video-production", "web"],
};

function Card({ card }: { card: CardData }) {
  return (
    <a
      href={card.href}
      className="group relative rounded-[20px] overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(234,154,97,0.08)]"
      style={{
        padding: 1,
        background:
          "linear-gradient(160deg, rgba(234,154,97,0.3) 0%, rgba(234,154,97,0.05) 40%, transparent 70%)",
      }}
    >
      <div
        className="relative rounded-[19px] overflow-hidden h-full"
        style={{
          background:
            "linear-gradient(160deg, rgba(30,26,23,1) 0%, rgba(15,12,10,1) 100%)",
        }}
      >
        {/* Top gradient accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background:
              "linear-gradient(90deg, #EA9A61 0%, #B16937 50%, transparent 100%)",
          }}
        />
        {/* Background glow */}
        <div
          className="absolute -top-20 -right-20 w-48 h-48 rounded-full opacity-20 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(234,154,97,0.3) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 p-8 md:p-10 flex flex-col min-h-[200px]">
          <div className="flex items-center gap-3 mb-5">
            {card.icon}
            <p
              className="text-[10px] font-medium tracking-[0.25em] uppercase"
              style={{
                fontFamily: "Norwige, sans-serif",
                background:
                  "linear-gradient(132deg, #EA9A61 4.77%, #B16937 50%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {card.label}
            </p>
          </div>
          <p
            className="text-[#FFF4E3] text-xl md:text-2xl font-semibold leading-snug mb-3"
            style={{ fontFamily: "Norwige, sans-serif", fontStyle: "italic" }}
          >
            {card.headline}
          </p>
          <p
            className="text-[#FFF4E3]/60 text-sm leading-relaxed max-w-xs mb-auto"
            style={{ fontFamily: "Norwige, sans-serif", fontStyle: "italic" }}
          >
            {card.subtext}
          </p>
          <div
            className="flex items-center gap-3 mt-6 pt-5"
            style={{ borderTop: "1px solid rgba(234,154,97,0.08)" }}
          >
            <span
              className="text-xs font-medium tracking-[0.15em] uppercase group-hover:tracking-[0.25em] transition-all duration-300"
              style={{
                fontFamily: "Norwige, sans-serif",
                background:
                  "linear-gradient(132deg, #EA9A61 0%, #B16937 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {card.ctaText}
            </span>
            <svg
              className="w-4 h-4 text-[#EA9A61] group-hover:translate-x-2 transition-transform duration-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </div>
        </div>
      </div>
    </a>
  );
}

export default function CrossSellNudges({
  currentService,
}: {
  currentService: ServiceId;
}) {
  const [first, second] = CROSS_SELL_MAP[currentService];
  const cards = [CARDS[first], CARDS[second]];

  return (
    <section className="relative bg-black py-20 md:py-28 px-6 md:px-12 lg:px-16 overflow-hidden">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        {cards.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </div>
    </section>
  );
}
