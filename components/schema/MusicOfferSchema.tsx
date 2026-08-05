// Structured pricing for rovmusic.com/pricing.
//
// Generated from data/soundPricing.ts rather than hand-written, so the schema
// and the visible table cannot drift. Answer engines and rich results lean on
// priced Offers, and a rate card with no machine-readable prices is the single
// most quotable thing on the site left unquotable.

import { checkout, type CheckoutKey } from "@/data/soundPricing";
import { FOUNDATION_PRICE } from "@/data/artistReadiness";

const CATALOG: { key: CheckoutKey; name: string; description: string }[] = [
  { key: "mix_first", name: "First mix & master", description: "One song mixed and mastered, 48-hour turnaround, 2 revisions. One per artist." },
  { key: "mix_single", name: "Mix & master, single song", description: "Mix and master with 2 revisions, 48-hour turnaround." },
  { key: "mix_3", name: "Mix & master 3-pack", description: "Three songs at $55 each, prepaid, no expiry." },
  { key: "mix_6", name: "Mix & master 6-pack", description: "Six songs at $45 each, prepaid, no expiry." },
  { key: "mix_12", name: "Mix & master 12-pack", description: "Twelve songs at $40 each, the lowest per-song rate." },
  { key: "rec_hour", name: "Atlanta studio session, hourly", description: "Room, engineer, and every stem. Full mix and master included." },
  { key: "rec_2hr", name: "Atlanta studio session, 2-hour block", description: "Two hours at $60 an hour. Mix and master included." },
  { key: "rec_4hr", name: "Atlanta studio session, 4-hour block", description: "Four hours at $50 an hour, the lowest studio rate. Mix and master included." },
  { key: "cover_system", name: "Cover art system + first cover", description: "A repeatable art rule plus your first cover, so a catalog reads as one body of work." },
  { key: "cover_extra", name: "Additional cover art", description: "Each cover after the system exists." },
  { key: "shorts", name: "Content run", description: "20 short-form videos plus 5 lyric videos, planned and edited." },
];

export function MusicOfferSchema({ baseUrl }: { baseUrl: string }) {
  const offers = CATALOG.map((entry) => {
    const item = checkout[entry.key];
    return {
      "@type": "Offer",
      name: entry.name,
      description: entry.description,
      price: String(item.amount),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${baseUrl}/pricing`,
    };
  });

  offers.push({
    "@type": "Offer",
    name: "Foundation, artist backend build",
    description:
      "Artist website, EPK, release hub with email capture, lead and booking forms, metadata master sheet, split sheet system, tech rider, and a session and stem vault. One time, yours forever.",
    price: String(FOUNDATION_PRICE),
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: `${baseUrl}/pricing`,
  });

  const prices = offers.map((o) => Number(o.price));

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Mixing, Mastering, Recording & Artist Development",
    serviceType: "Music production and artist development",
    provider: {
      "@type": "Organization",
      name: "Range of View Music",
      url: baseUrl,
    },
    areaServed: { "@type": "Place", name: "Atlanta, Georgia" },
    url: `${baseUrl}/pricing`,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: String(Math.min(...prices)),
      highPrice: String(Math.max(...prices)),
      offerCount: String(offers.length),
      offers,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
