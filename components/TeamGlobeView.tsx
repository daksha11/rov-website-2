"use client";

import { useState } from "react";
import { Component as InteractiveGlobe, type GlobeLocation } from "@/components/ui/interactive-globe";

// Team roster by location — Atlanta HQ, team hubs, business reach.
const LOCATIONS: GlobeLocation[] = [
  {
    lat: 33.749, lng: -84.388, city: "Atlanta", country: "US", type: "hq",
    members: [
      { name: "Ayush", role: "Creative Director" },
      { name: "Kavya", role: "Director of Design" },
      { name: "Vaishnavi", role: "Video Strategist" },
      { name: "Suchet", role: "Systems Architect" },
      { name: "Sam Suen", role: "Artist Dev" },
    ],
  },
  {
    lat: 32.081, lng: -81.091, city: "Savannah", country: "US", type: "team",
    members: [
      { name: "Jiwon", role: "UI/UX Designer" },
      { name: "Anish", role: "Web Designer" },
    ],
  },
  {
    lat: 17.385, lng: 78.487, city: "Hyderabad", country: "IN", type: "team",
    members: [
      { name: "Tanvi", role: "Design Strategist" },
      { name: "Daksha", role: "Head of Dev" },
    ],
  },
  {
    lat: 12.972, lng: 77.594, city: "Bangalore", country: "IN", type: "team",
    members: [
      { name: "Jahnavi", role: "Design Assistant" },
      { name: "Chaman", role: "Motion Designer" },
    ],
  },
  {
    lat: 52.483, lng: -1.894, city: "Birmingham", country: "UK", type: "team",
    members: [{ name: "Eshaal", role: "Illustrator" }],
  },
  { lat: 43.651, lng: -79.383, city: "Toronto", country: "CA", type: "business" },
  { lat: 6.524, lng: 3.379, city: "Lagos", country: "NG", type: "business" },
  { lat: 51.507, lng: -0.128, city: "London", country: "UK", type: "business" },
];

const HQ_GRADIENT = "linear-gradient(132deg, #6B2318 4.77%, #C4622D 45%, #E0A44A 100%)";

export default function TeamGlobeView() {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const selectedLoc = LOCATIONS.find((l) => l.city === selectedCity) ?? null;

  const handleCityClick = (city: string) =>
    setSelectedCity((prev) => (prev === city ? null : city));

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "0 clamp(16px, 4vw, 48px)",
      }}
    >
      {/* Eyebrow */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
        <div style={{ width: "clamp(24px,4vw,48px)", height: 1, background: "rgba(224,164,74,0.5)" }} />
        <span style={{ fontFamily: "Roboto, sans-serif", color: "#E0A44A", fontSize: "clamp(11px,1.5vw,13px)", letterSpacing: "0.32em" }}>
          WORLDWIDE
        </span>
        <div style={{ width: "clamp(24px,4vw,48px)", height: 1, background: "rgba(224,164,74,0.5)" }} />
      </div>

      {/* Subtitle */}
      <p
        style={{
          fontFamily: "Roboto, sans-serif",
          fontWeight: 300,
          fontSize: "clamp(13px,1.8vw,16px)",
          color: "rgba(247,242,228,0.6)",
          textAlign: "center",
          maxWidth: 460,
          margin: "0 0 clamp(28px,5vw,48px)",
        }}
      >
        Atlanta roots, international perspective — our team spans four continents.
      </p>

      {/* Globe */}
      <div
        style={{
          width: "min(82vw, 520px)",
          height: "min(82vw, 520px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <InteractiveGlobe
          locations={LOCATIONS}
          autoRotateSpeed={0.002}
          focusedLocation={selectedLoc ? { lat: selectedLoc.lat, lng: selectedLoc.lng } : null}
          onInteract={() => setSelectedCity(null)}
        />
      </div>

      {/* Location tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: "clamp(24px,4vw,40px)", maxWidth: 720 }}>
        {LOCATIONS.map((loc) => {
          const isHQ = loc.type === "hq";
          const isActive = selectedCity === loc.city;
          const baseStyle = isHQ
            ? {
                border: "1px solid transparent",
                background: HQ_GRADIENT,
                color: "#FFF4E3",
                boxShadow: isActive ? "0 12px 32px -8px rgba(196,98,45,0.7)" : "0 6px 20px -8px rgba(196,98,45,0.45)",
                transform: isActive ? "translateY(-2px)" : "translateY(0)",
              }
            : {
                border: isActive ? "1px solid rgba(224,164,74,0.45)" : "1px solid rgba(247,242,228,0.14)",
                background: isActive ? "rgba(224,164,74,0.1)" : "transparent",
                color: isActive ? "rgba(247,242,228,0.92)" : "rgba(247,242,228,0.5)",
                boxShadow: "none",
                transform: isActive ? "translateY(-1px)" : "translateY(0)",
              };
          return (
            <button
              key={loc.city}
              onClick={() => handleCityClick(loc.city)}
              style={{
                fontFamily: "Roboto, sans-serif",
                fontSize: "clamp(11px,1.4vw,13px)",
                padding: isHQ ? "7px 20px" : "6px 16px",
                borderRadius: 999,
                letterSpacing: "0.06em",
                cursor: "pointer",
                transition: "all 250ms cubic-bezier(0.32,0.72,0,1)",
                ...baseStyle,
              }}
            >
              {loc.city}
              {isHQ ? " (HQ)" : ""}
            </button>
          );
        })}
      </div>

      {selectedCity && (
        <p
          style={{
            marginTop: 16,
            fontFamily: "Roboto, sans-serif",
            fontSize: "clamp(10px,1.2vw,12px)",
            color: "rgba(224,164,74,0.6)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Focusing on {selectedCity} — drag to explore freely
        </p>
      )}
    </div>
  );
}
