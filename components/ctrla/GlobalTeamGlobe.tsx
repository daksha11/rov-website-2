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

const tagColors: Record<GlobeLocation["type"], { color: string; border: string }> = {
  hq: { color: "#EA9A61", border: "rgba(234,154,97,0.3)" },
  team: { color: "rgba(247,242,228,0.7)", border: "rgba(247,242,228,0.15)" },
  business: { color: "rgba(177,105,55,0.6)", border: "rgba(177,105,55,0.15)" },
};

export function GlobalTeamGlobe() {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const selectedLoc = LOCATIONS.find((l) => l.city === selectedCity) ?? null;

  function handleCityClick(city: string) {
    setSelectedCity((prev) => (prev === city ? null : city));
  }

  return (
    <section
      style={{
        backgroundColor: "#000000",
        padding: "clamp(60px, 10vw, 120px) clamp(20px, 5vw, 60px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
        <div style={{ width: "clamp(24px, 4vw, 48px)", height: "1px", backgroundColor: "rgba(234,154,97,0.5)" }} />
        <span
          style={{
            fontFamily: "Norwige, sans-serif",
            fontStyle: "italic",
            color: "#EA9A61",
            fontSize: "clamp(11px, 1.5vw, 14px)",
            letterSpacing: "5px",
          }}
        >
          WORLDWIDE
        </span>
        <div style={{ width: "clamp(24px, 4vw, 48px)", height: "1px", backgroundColor: "rgba(234,154,97,0.5)" }} />
      </div>

      {/* Title */}
      <h2
        style={{
          fontSize: "clamp(2rem, 6vw, 3.5rem)",
          fontWeight: "900",
          color: "#FFFFFF",
          textAlign: "center",
          fontFamily: "Norwige, sans-serif",
          fontStyle: "italic",
          marginBottom: 16,
          letterSpacing: "-0.5px",
        }}
      >
        One Vision,{" "}
        <span
          style={{
            background: "linear-gradient(132deg, #EA9A61 4.77%, #B16937 27.26%, #A64D2B 50.09%, #42201C 76.74%)",
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
          fontFamily: "Norwige, sans-serif",
          fontStyle: "italic",
          fontSize: "clamp(13px, 1.8vw, 16px)",
          color: "rgba(255,244,227,0.5)",
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
          const isActive = selectedCity === loc.city;
          return (
            <button
              key={loc.city}
              onClick={() => handleCityClick(loc.city)}
              style={{
                fontFamily: "Norwige, sans-serif",
                fontStyle: "italic",
                fontSize: "clamp(11px, 1.4vw, 13px)",
                padding: "6px 16px",
                borderRadius: 999,
                border: isActive
                  ? "1px solid transparent"
                  : `1px solid ${tagColors[loc.type].border}`,
                background: isActive
                  ? "linear-gradient(132deg, #EA9A61 4.77%, #B16937 27.26%, #A64D2B 50.09%, #42201C 76.74%)"
                  : "transparent",
                color: isActive ? "#FFF4E3" : tagColors[loc.type].color,
                letterSpacing: "0.06em",
                cursor: "pointer",
                transition: "all 300ms cubic-bezier(0.32,0.72,0,1)",
                boxShadow: isActive
                  ? "0 8px 24px -8px rgba(177,105,55,0.55)"
                  : "none",
                transform: isActive ? "translateY(-1px)" : "none",
              }}
            >
              {loc.city}
              {loc.type === "hq" ? " (HQ)" : ""}
            </button>
          );
        })}
      </div>

      {/* Selected city hint */}
      {selectedCity && (
        <p
          style={{
            marginTop: 16,
            fontFamily: "'Roboto', sans-serif",
            fontSize: "clamp(10px, 1.2vw, 12px)",
            color: "rgba(234,154,97,0.5)",
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
