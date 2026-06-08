"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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
const hotels = [
  {
    name: "Nouveau Resort",
    icon: "🏨",
    rate: "₱3,500 / night",
    capacity: "2 Guests",
    distance: "5 mins from Convention Center",
    amenities: ["WiFi", "Restaurant", "Pool"],
  },
  {
    name: "Paras Beach Resort",
    icon: "🌊",
    rate: "₱4,800 / night",
    capacity: "2-4 Guests",
    distance: "8 mins from Convention Center",
    amenities: ["Beachfront", "Pool", "Restaurant"],
  },
  {
    name: "Bintana sa Paraiso",
    icon: "🌅",
    rate: "₱6,500 / night",
    capacity: "2 Guests",
    distance: "15 mins from Convention Center",
    amenities: ["Infinity Pool", "Sea View", "WiFi"],
  },
  {
    name: "GV Hotel Camiguin",
    icon: "🏠",
    rate: "₱1,200 / night",
    capacity: "2 Guests",
    distance: "10 mins from Convention Center",
    amenities: ["WiFi", "Aircon"],
  },
];


export default function AccomodationPage() {
  const router = useRouter();
  const [selectedVenue, setSelectedVenue] = useState<
    (typeof activityVenues)[number] | null
  >(null);
  const [selectedHotel, setSelectedHotel] = useState<
    (typeof hotels)[number] | null
  >(null);

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
        padding: 16,
        fontFamily:
          "Segoe UI, Inter, system-ui, -apple-system, Arial, sans-serif",
        WebkitFontSmoothing: "antialiased",
        textRendering: "optimizeLegibility",
        overflowX: "hidden",
      }}
    >
      {/* DECOR (hidden slightly on mobile feel) */}
      <div
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: 80,
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
          width: 80,
          height: "100%",
          background:
            "linear-gradient(180deg,#1F5AA6,#F27A35,#A61E22)",
          opacity: 0.06,
        }}
      />

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        {/* BACK BUTTON (mobile full width) */}
        <button
          onClick={() => router.push("/")}
          style={{
            marginBottom: 16,
            padding: "12px 16px",
            borderRadius: 12,
            border: "1px solid #E2E8F0",
            color: "#1F5AA6",
            background: "#fff",
            fontWeight: 700,
            cursor: "pointer",
            width: "100%",
            maxWidth: 220,
          }}
        >
          ← Back to Home
        </button>

        {/* CONTAINER */}
        <div
          style={{
            background: "#fff",
            borderRadius: 24,
            padding: 18,
            border: "1px solid #E2E8F0",
            boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
          }}
        >
          {/* HEADER */}
          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <div
              style={{
                display: "inline-block",
                background:
                  "linear-gradient(135deg,#F27A35,#A61E22)",
                borderRadius: 999,
                padding: "8px 18px",
                marginBottom: 12,
              }}
            >
              <span style={{ fontSize: 13, color: "#fff", fontWeight: 800 }}>
                🏨 Venue Directory
              </span>
            </div>

            <h1
              style={{
                fontSize: "clamp(20px, 6vw, 42px)",
                fontWeight: 900,
                marginBottom: 10,
                background:
                  "linear-gradient(90deg,#F27A35,#A61E22,#1F5AA6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Accommodation & Venues
            </h1>

            <p
              style={{
                color: "#1E293B",
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              Explore venues, transport hubs, and key sites for the event.
            </p>
          </div>

          {/* NAV BUTTONS (STACK ON MOBILE) */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              justifyContent: "center",
              marginBottom: 30,
            }}
          >
            {[
              "Accommodations",
              "Activity Venues",
              "Transportation Hubs",
              "Key Sites",
            ].map((item) => (
              <button
                key={item}
                onClick={() => scrollTo(item)}
                style={{
                  padding: "8px 12px",
                  borderRadius: 999,
                  border: "1px solid #E2E8F0",
                  background: "#fff",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#1F5AA6",
                  flex: "1 1 45%",
                  minWidth: 140,
                }}
              >
                {item}
              </button>
            ))}
          </div>

          {/* ACCOMMODATION */}
          <section id="Accommodations" style={{ marginBottom: 40 }}>
            <h2 style={{ color: "#1F5AA6", fontSize: 24, fontWeight: 900 }}>
              🏨 Accommodations
            </h2>
            
            <div
  style={{
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(240px,1fr))",
    gap: 14,
    marginTop: 20,
  }}
>
  {hotels.map((hotel, index) => (
    <div
      key={index}
      onClick={() => setSelectedHotel(hotel)}
      style={{
        background: "#fff",
        borderRadius: 18,
        padding: 18,
        border: "1px solid #E2E8F0",
        cursor: "pointer",
        boxShadow:
          "0 8px 20px rgba(0,0,0,0.05)",
      }}
    >
      <div style={{ fontSize: 36 }}>
        {hotel.icon}
      </div>

      <h3
        style={{
          color: "#0F172A",
          fontWeight: 800,
        }}
      >
        {hotel.name}
      </h3>

      <p
        style={{
          color: "#F27A35",
          fontWeight: 700,
        }}
      >
        {hotel.rate}
      </p>

      <p
        style={{
          color: "#334155",
          fontSize: 13,
        }}
      >
        Tap to view details
      </p>
    </div>
  ))}
</div>
          </section>

          {/* VENUES */}
          <section id="Activity Venues" style={{ marginBottom: 40 }}>
            <h2 style={{ color: "#1F5AA6", fontSize: 24, fontWeight: 900 }}>
              🎯 Activity Venues
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
                gap: 12,
                marginTop: 15,
              }}
            >
              {activityVenues.map((v, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedVenue(v)}
                  style={{
                    background: v.featured ? "#FFF7ED" : "#fff",
                    borderRadius: 18,
                    padding: 16,
                    border: v.featured
                      ? "2px solid #F27A35"
                      : "1px solid #E2E8F0",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ fontSize: 30 }}>{v.icon}</div>

                  <h3 style={{ fontSize: 16, fontWeight: 800 }}>
                    {v.name}
                  </h3>

                  <p style={{ fontSize: 13,color: "#1E293B" }}>
                    {v.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* TRANSPORT */}
          <section id="Transportation Hubs" style={{ marginBottom: 40 }}>
            <h2 style={{ color: "#1F5AA6", fontSize: 24, fontWeight: 900 }}>
              🚌 Transportation Hubs
            </h2>

            <div style={{ marginTop: 10 }}>
              {transportationHubs.map((t, i) => (
                <div
                  key={i}
                  style={{
                    padding: 14,
                    border: "1px solid #E2E8F0",
                    borderRadius: 12,
                    marginBottom: 8,
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  {t.icon} {t.name}
                </div>
              ))}
            </div>
          </section>

          {/* KEY SITES */}
          <section id="Key Sites" style={{ marginBottom: 40 }}>
            <h2 style={{ color: "#A61E22", fontSize: 24, fontWeight: 900 }}>
              📍 Key Sites
            </h2>

            {keySites.map((k, i) => (
              <div
                key={i}
                style={{
                  padding: 12,
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                {k.icon} {k.name}
              </div>
            ))}
          </section>

          {/* MODAL (MOBILE FIXED) */}
          {selectedVenue && (
            <div
              onClick={() => setSelectedVenue(null)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.6)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: 16,
              }}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: "#fff",
                  padding: 18,
                  borderRadius: 16,
                  width: "100%",
                  maxWidth: 420,
                }}
              >
                <h2 style={{ color: "#1F5AA6" }}>{selectedVenue.name}</h2>
                <p style={{ color: "#1E293B", fontSize: 14 }}>
                  {selectedVenue.description}
                </p>

                <button
                  onClick={() => setSelectedVenue(null)}
                  style={{
                    marginTop: 10,
                    width: "100%",
                    padding: 10,
                    borderRadius: 10,
                    background: "#F27A35",
                    color: "#fff",
                    border: "none",
                    fontWeight: 700,
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* HOTEL MODAL */}
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
      padding: 16,
      zIndex: 9999,
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        background: "#fff",
        borderRadius: 20,
        padding: 24,
        width: "100%",
        maxWidth: 450,
      }}
    >
      <div
        style={{
          fontSize: 48,
          textAlign: "center",
        }}
      >
        {selectedHotel.icon}
      </div>

      <h2
        style={{
          color: "#1F5AA6",
          textAlign: "center",
        }}
      >
        {selectedHotel.name}
      </h2>

      <p><b>💰 Rate:</b> {selectedHotel.rate}</p>
      <p><b>👥 Capacity:</b> {selectedHotel.capacity}</p>
      <p><b>📍 Distance:</b> {selectedHotel.distance}</p>
      <p>
        <b>✨ Amenities:</b>{" "}
        {selectedHotel.amenities.join(", ")}
      </p>

      <button
        onClick={() => setSelectedHotel(null)}
        style={{
          marginTop: 15,
          width: "100%",
          padding: 12,
          border: "none",
          borderRadius: 10,
          background: "#F27A35",
          color: "#0B3D91",
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