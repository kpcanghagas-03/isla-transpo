"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/* =========================
   MOCK HOTEL DATA (CAMIGUIN)
========================= */
const hotels = [
  {
    name: "Nouveau Hotel Camiguin",
    icon: "🏨",
    type: "Premium Hotel",
    featured: true,
    rate: "₱3,500 - ₱4,800 / night",
    rating: 4.6,
    inclusions: [
      "Free Breakfast",
      "WiFi",
      "Air-conditioned Room",
      "Event Shuttle Access",
    ],
    description:
      "Premium hotel located near main event venues with full amenities and conference access.",
  },
  {
    name: "Paras Beach Resort",
    icon: "🌴",
    type: "Beach Resort",
    rate: "₱4,000 - ₱6,500 / night",
    rating: 4.7,
    inclusions: [
      "Beachfront View",
      "Free Breakfast",
      "Pool Access",
      "Island Tours",
    ],
    description:
      "Popular beachfront resort offering scenic views of White Island and sunset experience.",
  },
  {
    name: "GV Hotel Mambajao",
    icon: "🏨",
    type: "Budget Hotel",
    rate: "₱1,200 - ₱1,800 / night",
    rating: 3.8,
    inclusions: ["Basic Room", "Aircon", "WiFi (limited)"],
    description:
      "Affordable accommodation option located in the town proper.",
  },
  {
    name: "Camiguin Highland Resort",
    icon: "⛰️",
    type: "Mountain Resort",
    rate: "₱2,800 - ₱4,200 / night",
    rating: 4.5,
    inclusions: [
      "Mountain View",
      "Breakfast",
      "Nature Trails",
      "Quiet Environment",
    ],
    description:
      "Peaceful mountain resort ideal for delegates who prefer calm surroundings.",
  },
];

/* ========================= */

export default function AccomodationPage() {
  const router = useRouter();

  const [selectedHotel, setSelectedHotel] = useState<any | null>(null);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg,#ffffff 0%,#f8fafc 50%,#ffffff 100%)",
        padding: 14,
        fontFamily:
          "Segoe UI, Inter, system-ui, -apple-system, Arial, sans-serif",
        WebkitFontSmoothing: "antialiased",
        textRendering: "optimizeLegibility",
      }}
    >
      {/* SIDE DECOR (hidden on mobile feel) */}
      <div
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: 70,
          height: "100%",
          background:
            "linear-gradient(180deg,#F27A35,#A61E22,#1F5AA6)",
          opacity: 0.06,
        }}
      />
      <div
        style={{
          position: "fixed",
          right: 0,
          top: 0,
          width: 70,
          height: "100%",
          background:
            "linear-gradient(180deg,#1F5AA6,#F27A35,#A61E22)",
          opacity: 0.06,
        }}
      />

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* BACK BUTTON */}
        <button
          onClick={() => router.push("/")}
          style={{
            width: "100%",
            maxWidth: 220,
            marginBottom: 16,
            padding: "12px 14px",
            borderRadius: 12,
            border: "1px solid #E2E8F0",
            background: "#fff",
            color: "#1F5AA6",
            fontWeight: 700,
          }}
        >
          ← Back
        </button>

        {/* CONTAINER */}
        <div
          style={{
            background: "#fff",
            borderRadius: 22,
            padding: 16,
            border: "1px solid #E2E8F0",
          }}
        >
          {/* HEADER */}
          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <h1
              style={{
                fontSize: "clamp(22px,5vw,40px)",
                fontWeight: 900,
                background:
                  "linear-gradient(90deg,#F27A35,#A61E22,#1F5AA6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Camiguin Accommodation Guide
            </h1>

            <p style={{ color: "#475569", fontSize: 14 }}>
              Tap a hotel to view rates and inclusions
            </p>
          </div>

          {/* HOTEL GRID */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(240px,1fr))",
              gap: 12,
            }}
          >
            {hotels.map((h, i) => (
              <div
                key={i}
                onClick={() => setSelectedHotel(h)}
                style={{
                  background: h.featured ? "#FFF7ED" : "#fff",
                  border: h.featured
                    ? "2px solid #F27A35"
                    : "1px solid #E2E8F0",
                  borderRadius: 18,
                  padding: 14,
                  cursor: "pointer",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
                }}
              >
                <div style={{ fontSize: 30 }}>{h.icon}</div>

                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: "#0F172A",
                    marginTop: 6,
                  }}
                >
                  {h.name}
                </h3>

                <p style={{ fontSize: 13, color: "#475569" }}>
                  {h.type}
                </p>

                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#1F5AA6",
                  }}
                >
                  {h.rate}
                </p>

                <p style={{ fontSize: 12, color: "#64748B" }}>
                  ⭐ {h.rating} rating
                </p>
              </div>
            ))}
          </div>

          {/* MODAL */}
          {selectedHotel && (
            <div
              onClick={() => setSelectedHotel(null)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.6)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: 14,
              }}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: "#fff",
                  borderRadius: 18,
                  width: "100%",
                  maxWidth: 420,
                  padding: 18,
                }}
              >
                <div style={{ fontSize: 40 }}>
                  {selectedHotel.icon}
                </div>

                <h2
                  style={{
                    color: "#1F5AA6",
                    fontWeight: 900,
                  }}
                >
                  {selectedHotel.name}
                </h2>

                <p style={{ color: "#475569", fontSize: 14 }}>
                  {selectedHotel.description}
                </p>

                <p
                  style={{
                    fontWeight: 800,
                    color: "#A61E22",
                    marginTop: 10,
                  }}
                >
                  {selectedHotel.rate}
                </p>

                <p style={{ fontSize: 13 }}>
                  ⭐ Rating: {selectedHotel.rating}
                </p>

                <div style={{ marginTop: 10 }}>
                  <p style={{ fontWeight: 700 }}>Inclusions:</p>
                  <ul style={{ paddingLeft: 18, fontSize: 13 }}>
                    {selectedHotel.inclusions.map(
                      (item: string, i: number) => (
                        <li key={i}>{item}</li>
                      )
                    )}
                  </ul>
                </div>

                <button
                  onClick={() => setSelectedHotel(null)}
                  style={{
                    marginTop: 12,
                    width: "100%",
                    padding: 10,
                    borderRadius: 10,
                    background: "#F27A35",
                    color: "#fff",
                    fontWeight: 700,
                    border: "none",
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}