"use client";

import { useState } from "react";
import { Component as InteractiveGlobe, type GlobeLocation } from "@/components/ui/interactive-globe";

const LOCATIONS: GlobeLocation[] = [
  // HQ
  {
    lat: 33.749, lng: -84.388, city: "Atlanta", country: "US", type: "hq",
    members: [
      { name: "Ayush", role: "Creative Director" },
      { name: "Kavya", role: "Director of Design" },
      { name: "Vaishnavi", role: "Video Strategist" },
      { name: "Jasnoor", role: "Frontend Dev" },
      { name: "Suchet", role: "Systems Architect" },
      { name: "Sam Suen", role: "Artist Dev" },
    ],
  },
  // Team locations
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
    members: [
      { name: "Eshaal", role: "Illustrator" },
    ],
  },
  // Business reach
  { lat: 43.651, lng: -79.383, city: "Toronto", country: "CA", type: "business" },
  { lat: 6.524, lng: 3.379, city: "Lagos", country: "NG", type: "business" },
  { lat: 51.507, lng: -0.128, city: "London", country: "UK", type: "business" },
];


export function GlobalTeamGlobe() {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const selectedLoc = LOCATIONS.find((l) => l.city === selectedCity) ?? null;

  function handleCityClick(city: string) {
    setSelectedCity((prev) => (prev === city ? null : city));
  }

  return (
    <section
      style={{
        backgroundColor: "#2B1F14",
        padding: "clamp(60px, 10vw, 120px) clamp(20px, 5vw, 60px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
        <div style={{ width: "clamp(24px, 4vw, 48px)", height: "1px", backgroundColor: "rgba(196,98,45,0.5)" }} />
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            color: "#C4622D",
            fontSize: "clamp(11px, 1.5vw, 14px)",
            letterSpacing: "5px",
          }}
        >
          WORLDWIDE
        </span>
        <div style={{ width: "clamp(24px, 4vw, 48px)", height: "1px", backgroundColor: "rgba(196,98,45,0.5)" }} />
      </div>

      {/* Title */}
      <h2
        style={{
          fontSize: "clamp(2rem, 6vw, 3.5rem)",
          fontWeight: "900",
          color: "#F5EDD8",
          textAlign: "center",
          fontFamily: "'Thistora', Georgia, serif",
          fontStyle: "italic",
          marginBottom: 16,
          letterSpacing: "-0.5px",
        }}
      >
        One Vision,{" "}
        <span
          style={{
            background: "linear-gradient(132deg, #6B2318 4.77%, #C4622D 40%, #E0A44A 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Global Reach
        </span>
      </h2>

      {/* Subtitle */}
      <p
        style={{
          fontFamily: "'DM Sans', system-ui, sans-serif",
          fontWeight: 300,
          fontSize: "clamp(13px, 1.8vw, 16px)",
          color: "rgba(245,237,216,0.5)",
          textAlign: "center",
          maxWidth: 500,
          marginBottom: "clamp(40px, 6vw, 72px)",
        }}
      >
        Our team spans 4 continents — Atlanta roots, international perspective.
      </p>

      {/* Globe container */}
      <div
        style={{
          width: "min(90vw, 600px)",
          height: "min(90vw, 600px)",
          margin: "0 auto",
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

      {/* Location tag buttons */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          justifyContent: "center",
          marginTop: "clamp(24px, 4vw, 48px)",
        }}
      >
        {LOCATIONS.map((loc) => {
          const isHQ = loc.type === "hq";
          const isActive = selectedCity === loc.city;

          const baseStyle = isHQ
            ? {
                border: "1px solid transparent",
                background: "linear-gradient(132deg, #6B2318 4.77%, #C4622D 40%, #E0A44A 100%)",
                color: "#F5EDD8",
                boxShadow: isActive
                  ? "0 12px 32px -8px rgba(196,98,45,0.7)"
                  : "0 6px 20px -8px rgba(196,98,45,0.45)",
                transform: isActive ? "translateY(-2px)" : "translateY(0)",
              }
            : {
                border: isActive
                  ? "1px solid rgba(196,98,45,0.35)"
                  : "1px solid rgba(245,237,216,0.1)",
                background: isActive ? "rgba(196,98,45,0.08)" : "transparent",
                color: isActive ? "rgba(245,237,216,0.9)" : "rgba(245,237,216,0.45)",
                boxShadow: "none",
                transform: isActive ? "translateY(-1px)" : "translateY(0)",
              };

          return (
            <button
              key={loc.city}
              onClick={() => handleCityClick(loc.city)}
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "clamp(11px, 1.4vw, 13px)",
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

      {/* Selected city hint */}
      {selectedCity && (
        <p
          style={{
            marginTop: 16,
            fontFamily: "'DM Mono', monospace",
            fontSize: "clamp(10px, 1.2vw, 12px)",
            color: "rgba(196,98,45,0.5)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Focusing globe on {selectedCity} — drag to explore freely
        </p>
      )}
    </section>
  );
}
