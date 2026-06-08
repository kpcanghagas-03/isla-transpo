"use client";

import { useRouter } from "next/navigation";
import { useState, CSSProperties } from "react";

const activityVenues = [
  {
    name: "Cong PPR Gym",
    type: "Competition Venue",
    icon: "🏟️",
    description:
      "Venue for competitions, sports-related activities, and large group gatherings.",
  },
  {
    name: "Convention Center",
    type: "Main Venue",
    icon: "🏛️",
    featured: true,
    description:
      "Primary venue for opening ceremonies, exhibits, and major RSTW activities.",
  },
  {
    name: "Mambajao Municipal Hall",
    type: "Government Venue",
    icon: "🏢",
    description:
      "Official government venue for meetings and special engagements.",
  },
  {
    name: "Romualdos' Residence",
    type: "Special Venue",
    icon: "🏠",
    description:
      "Special event venue for selected delegates and guests.",
  },
  {
    name: "Nouveau Hotel",
    type: "Event Venue",
    icon: "🏨",
    description:
      "Venue for meetings, briefings, and event-related functions.",
  },
  {
    name: "Ugmad Activity Area",
    type: "Outdoor Venue",
    icon: "🌴",
    description:
      "Open-air venue for outdoor activities and community events.",
  },
  {
    name: "CPSC",
    type: "Institutional Venue",
    icon: "🎓",
    description:
      "Educational venue hosting selected RSTW activities.",
  },
];

const transportationHubs = [
  { name: "Benoni Port", icon: "⛴️" },
  { name: "Mambajao Airport", icon: "✈️" },
];

const keySites = [{ name: "PSTO Camiguin", icon: "🔬" }];

export default function AccomodationPage() {
  const router = useRouter();
  const [selectedVenue, setSelectedVenue] = useState<
    (typeof activityVenues)[number] | null
  >(null);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // 🔥 GLOBAL TEXT STYLE FIX (THIS FIXES YOUR BLUR ISSUE)
  const textBase: CSSProperties = {
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
    textRendering: "optimizeLegibility",
    fontFamily:
      "Segoe UI, Inter, system-ui, -apple-system, Arial, sans-serif",
    color: "#0F172A",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg,#ffffff 0%,#f8fafc 50%,#ffffff 100%)",
        padding: 20,
        position: "relative",
        overflow: "hidden",
        ...textBase,
      }}
    >
      {/* DECOR */}
      <div
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: 120,
          height: "100%",
          background:
            "linear-gradient(180deg,#F27A35,#A61E22,#1F5AA6)",
          opacity: 0.08,
          clipPath: "polygon(0 0,100% 0,70% 50%,100% 100%,0 100%)",
        }}
      />

      <div
        style={{
          position: "fixed",
          right: 0,
          top: 0,
          width: 120,
          height: "100%",
          background:
            "linear-gradient(180deg,#1F5AA6,#F27A35,#A61E22)",
          opacity: 0.08,
          clipPath: "polygon(30% 0,100% 0,100% 100%,0 100%,30% 50%)",
        }}
      />

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* BACK */}
        <button
          onClick={() => router.push("/")}
          style={{
            marginBottom: 20,
            padding: "12px 20px",
            borderRadius: 12,
            border: "1px solid #E2E8F0",
            color: "#1F5AA6",
            background: "#fff",
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
          }}
        >
          ← Back to Home
        </button>

        {/* CONTAINER */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: 30,
            padding: "40px 35px",
            border: "1px solid #E2E8F0",
            boxShadow: "0 25px 60px rgba(0,0,0,0.10)",
          }}
        >
          {/* HEADER */}
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div
              style={{
                display: "inline-block",
                background:
                  "linear-gradient(135deg,#F27A35,#A61E22)",
                borderRadius: 50,
                padding: "10px 24px",
                marginBottom: 18,
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  color: "#fff",
                  fontWeight: 800,
                }}
              >
                🏨 Check Accommodation & Venue Here
              </span>
            </div>

            {/* NAV */}
            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                justifyContent: "center",
                marginBottom: 30,
              }}
            >
              {[
                "Accommodations",
                "Activity Venues",
                "Transportation Hubs",
                "Key Sites",
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(item)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 999,
                    border: "1px solid #E2E8F0",
                    background: "#fff",
                    fontWeight: 600,
                    color: "#1F5AA6",
                    cursor: "pointer",
                  }}
                >
                  {item}
                </button>
              ))}
            </div>

            <h1
              style={{
                background:
                  "linear-gradient(90deg,#F27A35,#A61E22,#1F5AA6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: "clamp(26px, 5vw, 52px)",
                fontWeight: 800,
                marginBottom: 12,
              }}
            >
              Accommodation & Venue Directory
            </h1>

            <p
              style={{
                color: "#475569",
                fontSize: 16,
                maxWidth: 650,
                margin: "0 auto",
                lineHeight: 1.6,
              }}
            >
              View activity venues, transport hubs, and key event locations.
            </p>
          </div>

          {/* SECTIONS */}
          <section id="Accommodations" style={{ marginBottom: 60 }}>
            <h2 style={{ color: "#1F5AA6", fontSize: 30, fontWeight: 900 }}>
              🏨 Accommodations
            </h2>

            <div
              style={{
                marginTop: 15,
                background: "linear-gradient(135deg,#1F5AA6,#4C9FD6)",
                padding: 24,
                borderRadius: 24,
                color: "#fff",
                lineHeight: 1.7,
                fontWeight: 500,
              }}
            >
              Accommodation assignments are being finalized.
            </div>
          </section>

          {/* VENUES */}
          <section id="Activity Venues" style={{ marginBottom: 60 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                alignItems: "center",
                marginBottom: 25,
              }}
            >
              <h2 style={{ color: "#1F5AA6", fontSize: 30, fontWeight: 900 }}>
                🎯 Activity Venues
              </h2>

              <span
                style={{
                  background:
                    "linear-gradient(135deg,#F27A35,#A61E22)",
                  color: "#fff",
                  padding: "8px 14px",
                  borderRadius: 999,
                  fontSize: 13,
                  fontWeight: 800,
                }}
              >
                ⭐ Main Venue: Convention Center
              </span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(280px,1fr))",
                gap: 20,
              }}
            >
              {activityVenues.map((v, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedVenue(v)}
                  style={{
                    background: v.featured ? "#FFF7ED" : "#fff",
                    borderRadius: 24,
                    padding: 24,
                    border: v.featured
                      ? "2px solid #F27A35"
                      : "1px solid #E2E8F0",
                    cursor: "pointer",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
                  }}
                >
                  <div style={{ fontSize: 40 }}>{v.icon}</div>

                  <h3 style={{ color: "#0F172A", fontWeight: 800 }}>
                    {v.name}
                  </h3>

                  <p style={{ color: "#475569", lineHeight: 1.5 }}>
                    {v.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* TRANSPORT */}
          <section id="Transportation Hubs" style={{ marginBottom: 60 }}>
            <h2 style={{ color: "#1F5AA6", fontSize: 30, fontWeight: 900 }}>
              🚌 Transportation Hubs
            </h2>

            <div style={{ marginTop: 20 }}>
              {transportationHubs.map((t, i) => (
                <div
                  key={i}
                  style={{
                    padding: 16,
                    border: "1px solid #E2E8F0",
                    borderRadius: 12,
                    marginBottom: 10,
                    background: "#fff",
                    color: "#0F172A",
                    fontWeight: 600,
                  }}
                >
                  {t.icon} {t.name}
                </div>
              ))}
            </div>
          </section>

          {/* KEY SITES */}
          <section id="Key Sites" style={{ marginBottom: 60 }}>
            <h2 style={{ color: "#A61E22", fontSize: 30, fontWeight: 900 }}>
              📍 Key Sites
            </h2>

            {keySites.map((k, i) => (
              <div
                key={i}
                style={{
                  padding: 16,
                  fontWeight: 600,
                  color: "#0F172A",
                }}
              >
                {k.icon} {k.name}
              </div>
            ))}
          </section>

          {/* MODAL */}
          {selectedVenue && (
            <div
              onClick={() => setSelectedVenue(null)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.55)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: "#fff",
                  padding: 30,
                  borderRadius: 20,
                  maxWidth: 520,
                }}
              >
                <h2 style={{ color: "#1F5AA6", fontWeight: 800 }}>
                  {selectedVenue.name}
                </h2>

                <p style={{ color: "#475569", lineHeight: 1.6 }}>
                  {selectedVenue.description}
                </p>

                <button
                  onClick={() => setSelectedVenue(null)}
                  style={{
                    marginTop: 12,
                    padding: "10px 14px",
                    borderRadius: 10,
                    background: "#F27A35",
                    color: "#fff",
                    border: "none",
                    fontWeight: 700,
                    cursor: "pointer",
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