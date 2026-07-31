import React from "react";

type ServiceId = "video-production" | "web" | "ai" | "ai-automation" | "brand";

interface CardData {
  id: ServiceId;
  href: string;
  label: string;
  tagline: string;
  illustration: React.ReactNode;
}

const ILLO_STROKE = "#EA9A61";

// Video: clapperboard with slate lines
const VideoIllo = (
  <svg
    viewBox="0 0 96 96"
    fill="none"
    stroke={ILLO_STROKE}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-full h-full"
  >
    <rect x="12" y="36" width="72" height="48" rx="3" />
    <path d="M12 36 L18 18 L28 16 L32 32 Z" fill={ILLO_STROKE} fillOpacity="0.08" />
    <path d="M12 36 L18 18 L28 16 L32 32" />
    <path d="M32 32 L38 14 L48 12 L52 30" />
    <path d="M52 30 L58 12 L68 10 L72 28" />
    <path d="M72 28 L78 10 L84 9 L84 32" />
    <path d="M38 56 L48 66 L38 76" fill="none" />
    <circle cx="58" cy="66" r="2" fill={ILLO_STROKE} />
    <circle cx="66" cy="66" r="2" fill={ILLO_STROKE} />
    <circle cx="74" cy="66" r="2" fill={ILLO_STROKE} />
  </svg>
);

// Web: browser window with code brackets
const WebIllo = (
  <svg
    viewBox="0 0 96 96"
    fill="none"
    stroke={ILLO_STROKE}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-full h-full"
  >
    <rect x="10" y="18" width="76" height="60" rx="3" />
    <line x1="10" y1="32" x2="86" y2="32" />
    <circle cx="18" cy="25" r="1.8" fill={ILLO_STROKE} />
    <circle cx="26" cy="25" r="1.8" fill={ILLO_STROKE} />
    <circle cx="34" cy="25" r="1.8" fill={ILLO_STROKE} />
    <path d="M30 46 L22 56 L30 66" strokeWidth="2" />
    <path d="M66 46 L74 56 L66 66" strokeWidth="2" />
    <line x1="42" y1="68" x2="54" y2="44" strokeWidth="2" />
  </svg>
);

// AI Systems: neural network nodes
const AiIllo = (
  <svg
    viewBox="0 0 96 96"
    fill="none"
    stroke={ILLO_STROKE}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-full h-full"
  >
    <line x1="18" y1="22" x2="44" y2="44" />
    <line x1="18" y1="48" x2="44" y2="48" />
    <line x1="18" y1="74" x2="44" y2="52" />
    <line x1="52" y1="44" x2="78" y2="22" />
    <line x1="52" y1="48" x2="78" y2="48" />
    <line x1="52" y1="52" x2="78" y2="74" />
    <circle cx="16" cy="22" r="5" fill="#0F0C0A" />
    <circle cx="16" cy="48" r="5" fill="#0F0C0A" />
    <circle cx="16" cy="74" r="5" fill="#0F0C0A" />
    <circle cx="48" cy="48" r="7" fill="#0F0C0A" />
    <circle cx="80" cy="22" r="5" fill="#0F0C0A" />
    <circle cx="80" cy="48" r="5" fill="#0F0C0A" />
    <circle cx="80" cy="74" r="5" fill="#0F0C0A" />
    <circle cx="48" cy="48" r="2.5" fill={ILLO_STROKE} />
  </svg>
);

// AI Automation: interlocking gears
const AutomationIllo = (
  <svg
    viewBox="0 0 96 96"
    fill="none"
    stroke={ILLO_STROKE}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-full h-full"
  >
    {/* Big gear */}
    <circle cx="36" cy="38" r="14" />
    <circle cx="36" cy="38" r="5" />
    <line x1="36" y1="18" x2="36" y2="22" strokeWidth="2" />
    <line x1="36" y1="54" x2="36" y2="58" strokeWidth="2" />
    <line x1="16" y1="38" x2="20" y2="38" strokeWidth="2" />
    <line x1="52" y1="38" x2="56" y2="38" strokeWidth="2" />
    <line x1="22" y1="24" x2="25" y2="27" strokeWidth="2" />
    <line x1="47" y1="49" x2="50" y2="52" strokeWidth="2" />
    <line x1="22" y1="52" x2="25" y2="49" strokeWidth="2" />
    <line x1="47" y1="27" x2="50" y2="24" strokeWidth="2" />
    {/* Small gear */}
    <circle cx="66" cy="66" r="10" />
    <circle cx="66" cy="66" r="3.5" />
    <line x1="66" y1="52" x2="66" y2="55" strokeWidth="2" />
    <line x1="66" y1="77" x2="66" y2="80" strokeWidth="2" />
    <line x1="52" y1="66" x2="55" y2="66" strokeWidth="2" />
    <line x1="77" y1="66" x2="80" y2="66" strokeWidth="2" />
  </svg>
);

// Brand: an identity mark flowing out into the touchpoints it has to survive on.
const BrandIllo = (
  <svg
    viewBox="0 0 96 96"
    fill="none"
    stroke={ILLO_STROKE}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-full h-full"
  >
    {/* The mark */}
    <rect x="10" y="12" width="34" height="34" rx="8" fill={ILLO_STROKE} fillOpacity="0.08" />
    <circle cx="27" cy="29" r="9" />
    <circle cx="27" cy="29" r="3" fill={ILLO_STROKE} />
    {/* Flow into the touchpoints */}
    <path d="M44 29 C58 29 58 29 66 29" strokeDasharray="3 4" />
    <path d="M27 46 C27 62 27 62 27 70" strokeDasharray="3 4" />
    {/* Envelope touchpoint */}
    <rect x="60" y="18" width="28" height="22" rx="3" />
    <path d="M60 22 L74 32 L88 22" />
    {/* Card / receipt touchpoint */}
    <rect x="12" y="66" width="30" height="20" rx="3" />
    <line x1="18" y1="73" x2="34" y2="73" />
    <line x1="18" y1="79" x2="28" y2="79" />
    {/* Thank-you screen touchpoint */}
    <rect x="56" y="58" width="30" height="28" rx="3" />
    <path d="M63 72 L69 78 L79 66" strokeWidth="2" />
  </svg>
);

const CARDS: Record<ServiceId, CardData> = {
  "video-production": {
    id: "video-production",
    href: "/video-production",
    label: "Video Production",
    tagline: "Content that stops the scroll.",
    illustration: VideoIllo,
  },
  web: {
    id: "web",
    href: "/web",
    label: "Web Development",
    tagline: "Sites built to convert.",
    illustration: WebIllo,
  },
  ai: {
    id: "ai",
    href: "/ai-automation",
    label: "AI Systems",
    tagline: "Intelligent tools that work for you.",
    illustration: AiIllo,
  },
  "ai-automation": {
    id: "ai-automation",
    href: "/ai-automation",
    label: "AI Automation",
    tagline: "Workflows on autopilot.",
    illustration: AutomationIllo,
  },
  brand: {
    id: "brand",
    href: "/brand",
    label: "Brand & Experience",
    tagline: "Identity that survives the receipt.",
    illustration: BrandIllo,
  },
};

const CROSS_SELL_MAP: Record<ServiceId, [ServiceId, ServiceId]> = {
  "video-production": ["web", "brand"],
  web: ["brand", "ai-automation"],
  ai: ["ai-automation", "web"],
  "ai-automation": ["brand", "web"],
  brand: ["web", "ai-automation"],
};

function Card({ card }: { card: CardData }) {
  return (
    <a
      href={card.href}
      className="group relative rounded-[20px] overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(234,154,97,0.12)]"
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
        {/* Background glow */}
        <div
          className="absolute -top-20 -right-20 w-56 h-56 rounded-full opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity duration-500"
          style={{
            background:
              "radial-gradient(circle, rgba(234,154,97,0.35) 0%, transparent 70%)",
          }}
        />

        {/* Background illustration — large, ghostly, bottom-right */}
        <div
          className="absolute -right-4 -bottom-6 w-[140px] h-[140px] md:w-[170px] md:h-[170px] pointer-events-none opacity-[0.13] group-hover:opacity-25 transition-opacity duration-500"
          aria-hidden="true"
        >
          {card.illustration}
        </div>

        <div className="relative z-10 p-8 md:p-10 flex items-center gap-6 min-h-[180px]">
          {/* Left: small illustration chip */}
          <div
            className="shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-105"
            style={{
              border: "1px solid rgba(234,154,97,0.2)",
              background:
                "linear-gradient(160deg, rgba(234,154,97,0.08) 0%, rgba(234,154,97,0.02) 100%)",
            }}
          >
            <div className="w-8 h-8 md:w-9 md:h-9">{card.illustration}</div>
          </div>

          {/* Middle: label + service name + tagline */}
          <div className="flex-1 min-w-0">
            <p
              className="text-[10px] md:text-[11px] font-medium tracking-[0.3em] uppercase mb-3"
              style={{ color: "rgba(234,154,97,0.7)", fontFamily: "Norwige, sans-serif" }}
            >
              Next &middot; Service
            </p>
            <h3
              className="text-[#FFF4E3] text-2xl md:text-3xl lg:text-4xl font-bold leading-[1.05] mb-2 tracking-tight"
              style={{ fontFamily: "Norwige, sans-serif", fontStyle: "italic" }}
            >
              {card.label}
            </h3>
            <p
              className="text-sm leading-snug"
              style={{ color: "rgba(255,244,227,0.45)", fontFamily: "Norwige, sans-serif", fontStyle: "italic" }}
            >
              {card.tagline}
            </p>
          </div>

          {/* Right: big external-link arrow */}
          <div
            className="shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110"
            style={{
              border: "1px solid rgba(234,154,97,0.3)",
              background: "rgba(234,154,97,0.05)",
            }}
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6 text-[#EA9A61] transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.75}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 17L17 7M17 7H8M17 7v9"
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
      <div className="max-w-6xl mx-auto">
        <p
          className="text-xs uppercase tracking-[0.3em] text-center mb-10 md:mb-14"
          style={{ color: "rgba(255,244,227,0.3)", fontFamily: "Norwige, sans-serif" }}
        >
          Explore other services
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {cards.map((card) => (
            <Card key={card.id} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
