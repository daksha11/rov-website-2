"use client";

import { Component as InteractiveGlobe } from "@/components/ui/interactive-globe";

const TEAM_LOCATIONS = [
  { lat: 33.749, lng: -84.388, label: "Atlanta", isHQ: true },
  { lat: 32.081, lng: -81.091, label: "Savannah", isHQ: false },
  { lat: 43.651, lng: -79.383, label: "Toronto", isHQ: false },
  { lat: 6.524, lng: 3.379, label: "Lagos", isHQ: false },
  { lat: 51.507, lng: -0.128, label: "London", isHQ: false },
  { lat: 17.385, lng: 78.487, label: "Hyderabad", isHQ: false },
  { lat: 12.972, lng: 77.594, label: "Bangalore", isHQ: false },
];

const locationTags = TEAM_LOCATIONS.map((loc) => ({
  city: loc.label,
  isHQ: loc.isHQ,
}));

const hq = TEAM_LOCATIONS[0];
const connections = TEAM_LOCATIONS.filter((m) => !m.isHQ).map((m) => ({
  from: [hq.lat, hq.lng] as [number, number],
  to: [m.lat, m.lng] as [number, number],
}));

const globeMarkers = TEAM_LOCATIONS.map((loc) => ({
  lat: loc.lat,
  lng: loc.lng,
  label: loc.isHQ ? `${loc.label} (HQ)` : loc.label,
}));

export function GlobalTeamGlobe() {
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 12,
        }}
      >
        <div
          style={{
            width: "clamp(24px, 4vw, 48px)",
            height: "1px",
            backgroundColor: "rgba(234,154,97,0.5)",
          }}
        />
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
        <div
          style={{
            width: "clamp(24px, 4vw, 48px)",
            height: "1px",
            backgroundColor: "rgba(234,154,97,0.5)",
          }}
        />
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
            background:
              "linear-gradient(132deg, #EA9A61 4.77%, #B16937 27.26%, #A64D2B 50.09%, #42201C 76.74%)",
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
          markers={globeMarkers}
          connections={connections}
          dotColor="rgba(78, 205, 196, ALPHA)"
          arcColor="rgba(45, 212, 191, 0.5)"
          markerColor="rgba(78, 205, 196, 1)"
          autoRotateSpeed={0.002}
        />
      </div>

      {/* Location tags row */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          justifyContent: "center",
          marginTop: "clamp(24px, 4vw, 48px)",
        }}
      >
        {locationTags.map((loc) => (
          <span
            key={loc.city}
            style={{
              fontFamily: "Norwige, sans-serif",
              fontStyle: "italic",
              fontSize: "clamp(11px, 1.4vw, 13px)",
              padding: "6px 16px",
              borderRadius: 999,
              border: "1px solid rgba(234,154,97,0.15)",
              background: "transparent",
              color: loc.isHQ ? "#EA9A61" : "rgba(255,244,227,0.4)",
              letterSpacing: "0.06em",
            }}
          >
            {loc.city}
            {loc.isHQ ? " (HQ)" : ""}
          </span>
        ))}
      </div>
    </section>
  );
}
