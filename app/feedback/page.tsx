"use client";

import { useRouter } from "next/navigation";

export default function AccomodationPage() {
  const router = useRouter();

 const activityVenues = [
  {
    name: "Cong PPR Gym",
    type: "Competition Venue",
    icon: "🏟️",
  },
  {
    name: "Convention Center",
    type: "Main Venue",
    icon: "🏛️",
    featured: true,
  },
  {
    name: "Mambajao Municipal Hall",
    type: "Government Venue",
    icon: "🏢",
  },
  {
    name: "Romualdos' Residence",
    type: "Special Venue",
    icon: "🏠",
  },
  {
    name: "Nouveau Hotel",
    type: "Event Venue",
    icon: "🏨",
  },
  {
    name: "Ugmad Activity Area",
    type: "Outdoor Venue",
    icon: "🌴",
  },
  {
    name: "CPSC",
    type: "Institutional Venue",
    icon: "🎓",
  },
];

const transportationHubs = [
  {
    name: "Benoni Port",
    icon: "⛴️",
  },
  {
    name: "Mambajao Airport",
    icon: "✈️",
  },
];

const keySites = [
  {
    name: "PSTO Camiguin",
    icon: "🔬",
  },
];

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg,#ffffff 0%,#f8fafc 50%,#ffffff 100%)",
        padding: 20,
        fontFamily: "Segoe UI, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* LEFT DECORATION */}
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
    clipPath:
      "polygon(0 0,100% 0,70% 50%,100% 100%,0 100%)",
  }}
/>

{/* RIGHT DECORATION */}
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
          clipPath:
            "polygon(30% 0,100% 0,100% 100%,0 100%,30% 50%)",
        }}
      />

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Back Button */}
        <button
          onClick={() => router.push("/")}
          style={{
            marginBottom: 20,
            padding: "12px 20px",
            borderRadius: 12,
            border: "none",
            color: "#0B3D91",
            background: "white",
            fontWeight: "bold",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            transition: "all 0.2s ease",
          }}
        >
          ← Back to Home
        </button>

        {/* MAIN GLASS CONTAINER */}
        <div
          style={{
          background: "#ffffff",
          borderRadius: 30,
          padding: "40px 35px",
          border: "1px solid #E2E8F0",
          boxShadow: "0 25px 60px rgba(0,0,0,0.12)",
        }}
        >
         {/* Header */}
<div
  style={{
    textAlign: "center",
    marginBottom: 40,
  }}
>
  <div
    style={{
      display: "inline-block",
      background:
        "linear-gradient(135deg,#F27A35,#A61E22)",
      borderRadius: 50,
      padding: "10px 24px",
      marginBottom: 18,
      boxShadow: "0 8px 20px rgba(166,30,34,0.25)",
    }}
  >
    <span
      style={{
        fontSize: 14,
        color: "#fff",
        fontWeight: 700,
      }}
    >
      🏨 Check Accommodation & Venue Here
    </span>
  </div>

  <h1
    style={{
      background:
        "linear-gradient(90deg,#F27A35,#A61E22,#1F5AA6)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      fontSize: "clamp(25px, 6vw, 50px)",
      fontWeight: "650",
      marginBottom: 12,
      lineHeight: 1.1,
    }}
  >
    Accommodation & Venue Directory
  </h1>

  <p
    style={{
      color: "#64748B",
      fontSize: 16,
      maxWidth: 600,
      margin: "0 auto",
      lineHeight: 1.6,
    }}
  >
    View activity venues, key locations, transportation hubs, and important event sites.
  </p>
</div>

<div
  style={{
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(180px,1fr))",
    gap: 16,
    marginBottom: 40,
  }}
>
  {[
    {
      icon: "🎯",
      value: "7",
      label: "Activity Venues",
    },
    {
      icon: "🚌",
      value: "2",
      label: "Transport Hubs",
    },
    {
      icon: "📍",
      value: "1",
      label: "Key Site",
    },
    {
      icon: "🏨",
      value: "Soon",
      label: "Accommodations",
    },
  ].map((item, index) => (
    <div
      key={index}
      style={{
        background: "#FFFFFF",
        padding: 20,
        borderRadius: 20,
        textAlign: "center",
        boxShadow:
          "0 8px 20px rgba(0,0,0,0.08)",
      }}
    >
      <div style={{ fontSize: 32 }}>
        {item.icon}
      </div>

      <h3
        style={{
          margin: "10px 0 5px",
          color: "#0F172A",
        }}
      >
        {item.value}
      </h3>

      <p
        style={{
          margin: 0,
          color: "#64748B",
          fontSize: 13,
        }}
      >
        {item.label}
      </p>
    </div>
  ))}
</div>

{/* Accommodation Section */}

<div style={{ marginBottom: 50 }}>
  <h2
    style={{
      color: "#1F5AA6",
      fontSize: 32,
      fontWeight: 900,
      marginBottom: 25,
    }}
  >
    🏨 Accommodations
  </h2>

  <div
    style={{
      background:"linear-gradient(135deg,#1F5AA6,#4C9FD6)",
      borderRadius: 24,
      padding: 24,
      border: "1px solid #E2E8F0",
      color: "#FFFFFF",
    }}
  >
    <p
      style={{
        margin: 0,
        fontSize: 15,
        lineHeight: 1.7,
      }}
    >
      Accommodation assignments, room allocations, and hotel information are currently being finalized.
      Once available, delegates may view their assigned hotel, accommodation details, and focal person information directly from this page.
    </p>
  </div>
</div>

{/* Activity Venues */}

<div style={{ marginBottom: 50 }}>
  <h2
    style={{
      color: "#1F5AA6",
      fontSize: 32,
      fontWeight: 900,
      marginBottom: 25,
    }}
  >
    🎯 Activity Venues
  </h2>

  <div
    style={{
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit,minmax(280px,1fr))",
      gap: 20,
    }}
  >
    {activityVenues.map((venue, index) => (
      <div
        key={index}
        style={{
          background: "#fff",
          borderRadius: 24,
          padding: 24,
          boxShadow:
            "0 10px 25px rgba(0,0,0,0.08)",
          border: venue.featured
          ? "2px solid #F27A35"
          : "1px solid #E2E8F0",

        background: venue.featured
          ? "#FFF7ED"
          : "#FFFFFF",
                }}
      >
        <div
          style={{
            fontSize: 40,
            marginBottom: 12,
          }}
        >
          {venue.icon}
        </div>

        <h3
        style={{
          color: "#0F172A",
          marginBottom: 12,
        }}
      >
        {venue.name}

        {venue.featured && (
          <span
            style={{
              marginLeft: 8,
              color: "#F27A35",
            }}
          >
            ⭐
          </span>
        )}
      </h3>

<span
  style={{
    background: "#EFF6FF",
    color: "#1F5AA6",
    padding: "6px 12px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
  }}
>
  {venue.type}
</span>
      </div>
    ))}
  </div>
</div>

{/* Transportation Hubs */}

<div style={{ marginBottom: 50 }}>
  <h2
    style={{
      color: "#1F5AA6",
      fontSize: 32,
      fontWeight: 900,
      marginBottom: 25,
    }}
  >
    🚌 Transportation Hubs
  </h2>

  <div
    style={{
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit,minmax(280px,1fr))",
      gap: 20,
    }}
  >
    {transportationHubs.map((site, index) => (
      <div
        key={index}
        style={{
          background: "#fff",
          borderRadius: 24,
          padding: 24,
          boxShadow:
            "0 10px 25px rgba(0,0,0,0.08)",
          border: "1px solid #E2E8F0",
        }}
      >
        <div
          style={{
            fontSize: 40,
            marginBottom: 12,
          }}
        >
          {site.icon}
        </div>

        <h3
          style={{
            color: "#0F172A",
            margin: 0,
          }}
        >
          {site.name}
        </h3>
      </div>
    ))}
  </div>
</div>

{/* Key Sites */}

<div style={{ marginBottom: 50 }}>
  <h2
    style={{
      color: "#A61E22",
      fontSize: 32,
      fontWeight: 900,
      marginBottom: 25,
    }}
  >
    📍 Key Sites
  </h2>

  <div
    style={{
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit,minmax(280px,1fr))",
      gap: 20,
    }}
  >
    {keySites.map((site, index) => (
      <div
        key={index}
        style={{
          background: "#fff",
          borderRadius: 24,
          padding: 24,
          boxShadow:
            "0 10px 25px rgba(0,0,0,0.08)",
          border: "1px solid #E2E8F0",
        }}
      >
        <div
          style={{
            fontSize: 40,
            marginBottom: 12,
          }}
        >
          {site.icon}
        </div>

        <h3
          style={{
            color: "#0F172A",
            margin: 0,
          }}
        >
          {site.name}
        </h3>
      </div>
    ))}
  </div>
</div>

<div
  style={{
    background:
      "linear-gradient(135deg,#F27A35,#A61E22)",
    borderRadius: 24,
    padding: 30,
    textAlign: "center",
    color: "white",
    marginBottom: 40,
  }}
>
  <h2 style={{ marginBottom: 10 }}>
    🏨 Accommodation Information
  </h2>

  <p
    style={{
      margin: 0,
      opacity: 0.9,
      fontSize: 16,
    }}
  >
    Hotel assignments and accommodation details
    will be posted once finalized by the organizing
    committee.
  </p>
</div>


          {/* Important Notes */}
          <div
            style={{
              background: "rgba(255,255,255,0.95)",
              borderRadius: 24,
              padding: 28,
              marginTop: 15,
              boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
            }}
          >
            <h3
              style={{
                color: "#1F5AA6",
                fontSize: 22,
                fontWeight: 900,
                marginBottom: 22,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              📌 Accommodation & Venue Notes
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 16,
              }}
            >
              {[
  {
    icon: "🏨",
    title: "Check-In Time",
    text: "Please coordinate with hotel management for check-in schedules.",
  },
  {
    icon: "🚌",
    title: "ISLA-Transpo",
    text: "Don't forget to utilize ISLA-Transpo for your transportation needs during the event.",
  },
  {
    icon: "📞",
    title: "Contact Person",
    text: "Keep your assigned focal person's contact information available.",
  },
  {
    icon: "📍",
    title: "Venue Transfers",
    text: "Allow extra travel time between venues and accommodations.",
  },
].map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 14,
                    padding: 18,
                    background: "#F8FAFC",
                    borderRadius: 16,
                    border: "1px solid #E2E8F0",
                  }}
                >
                  <span style={{ fontSize: 28 }}>{item.icon}</span>

                  <div>
                    <p
                      style={{
                        fontWeight: 800,
                        color: "#0F172A",
                        margin: "0 0 4px 0",
                        fontSize: 15,
                      }}
                    >
                      {item.title}
                    </p>

                    <p
                      style={{
                        color: "#64748B",
                        margin: 0,
                        fontSize: 14,
                        lineHeight: 1.5,
                      }}
                    >
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Footer */}
          <div
            style={{
              marginTop: 30,
              textAlign: "center",
              background: "#FFF7ED",
              borderRadius: 16,
              padding: 20,
            }}
          >
            <p
              style={{
                color: "#EA580C",
                fontSize: 14,
                marginBottom: 8,
              }}
            >
              🌴 Welcome to the Regional Science & Technology Week 2026 in
              beautiful Camiguin Island.
            </p>

            <p
              style={{
                color: "#475569",
                fontSize: 13,
                margin: 0,
              }}
            >
              Make yourself comfortable and enjoy the event!
            </p>
          </div>
        </div>

        {/* Footer */}
        <p
          style={{
            textAlign: "center",
            color: "#64748B",
            fontSize: 13,
            marginTop: 20,
            paddingBottom: 20,
          }}
        >
          © 2026 Regional Science & Technology Week — Camiguin
        </p>
      </div>
    </main>
  );
}