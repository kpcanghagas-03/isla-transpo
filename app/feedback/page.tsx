"use client";

import { useRouter } from "next/navigation";

export default function ProgramPage() {
  const router = useRouter();

  const programDays = [
    {
      day: "Day 1",
      date: "July 22, 2026",
      theme: "Opening & Exhibits",
      color: "#0B3D91",
      events: [
        {
          time: "7:00 AM - 8:00 AM",
          title: "Registration & Welcome Kits",
          location: "Main Lobby",
          icon: "📝",
        },
        {
          time: "8:00 AM - 9:30 AM",
          title: "Opening Ceremony",
          location: "Main Auditorium",
          icon: "🎉",
          highlight: true,
        },
        {
          time: "9:30 AM - 10:00 AM",
          title: "Ribbon Cutting & Photo Op",
          location: "Exhibit Hall Entrance",
          icon: "✂️",
        },
        {
          time: "10:00 AM - 12:00 NN",
          title: "Exhibits & Innovation Showcase Tour",
          location: "Exhibit Hall A & B",
          icon: "🔬",
        },
        {
          time: "12:00 NN - 1:00 PM",
          title: "Lunch Break",
          location: "Dining Area",
          icon: "🍽️",
        },
        {
          time: "1:00 PM - 5:00 PM",
          title: "Science Fair & Interactive Demos",
          location: "Exhibit Hall",
          icon: "🧪",
        },
        {
          time: "5:00 PM - 6:00 PM",
          title: "Networking Session",
          location: "Garden Pavilion",
          icon: "🤝",
        },
      ],
    },
    {
      day: "Day 2",
      date: "July 23, 2026",
      theme: "Technical Sessions",
      color: "#1E40AF",
      events: [
        {
          time: "8:00 AM - 8:30 AM",
          title: "Morning Assembly",
          location: "Main Auditorium",
          icon: "☀️",
        },
        {
          time: "8:30 AM - 10:00 AM",
          title: "Plenary Session: Future of Science in Region X",
          location: "Main Auditorium",
          icon: "🎤",
          highlight: true,
        },
        {
          time: "10:00 AM - 10:30 AM",
          title: "Coffee Break",
          location: "Lobby",
          icon: "☕",
        },
        {
          time: "10:30 AM - 12:00 NN",
          title: "Parallel Technical Sessions",
          location: "Breakout Rooms 1-4",
          icon: "📊",
        },
        {
          time: "12:00 NN - 1:00 PM",
          title: "Lunch Break",
          location: "Dining Area",
          icon: "🍽️",
        },
        {
          time: "1:00 PM - 3:00 PM",
          title: "Workshop: Research Methodology",
          location: "Workshop Room A",
          icon: "📚",
        },
        {
          time: "3:00 PM - 5:00 PM",
          title: "Workshop: Data Visualization & Analysis",
          location: "Computer Lab",
          icon: "💻",
        },
      ],
    },
    {
      day: "Day 3",
      date: "July 23, 2026",
      theme: "Competitions & Judging",
      color: "#059669",
      events: [
        {
          time: "7:30 AM - 8:00 AM",
          title: "Participants Assembly",
          location: "Competition Venue",
          icon: "📋",
        },
        {
          time: "8:00 AM - 12:00 NN",
          title: "Science Quiz Bee - Elimination Round",
          location: "Main Auditorium",
          icon: "🧠",
          highlight: true,
        },
        {
          time: "8:00 AM - 12:00 NN",
          title: "Research Paper Presentation",
          location: "Breakout Rooms 1-3",
          icon: "📄",
        },
        {
          time: "12:00 NN - 1:00 PM",
          title: "Lunch Break",
          location: "Dining Area",
          icon: "🍽️",
        },
        {
          time: "1:00 PM - 3:00 PM",
          title: "Science Quiz Bee - Finals",
          location: "Main Auditorium",
          icon: "🏆",
          highlight: true,
        },
        {
          time: "1:00 PM - 4:00 PM",
          title: "Poster Judging",
          location: "Exhibit Hall",
          icon: "🖼️",
        },
        {
          time: "4:00 PM - 5:00 PM",
          title: "Judges Deliberation",
          location: "Conference Room",
          icon: "⚖️",
        },
      ],
    },
    {
      day: "Day 4",
      date: "July 24, 2026",
      theme: "Awarding & Closing",
      color: "#DC2626",
      events: [
        {
          time: "8:00 AM - 9:00 AM",
          title: "Assembly & Preparation",
          location: "Main Auditorium",
          icon: "👔",
        },
        {
          time: "9:00 AM - 11:30 AM",
          title: "Awarding Ceremony",
          location: "Main Auditorium",
          icon: "🏅",
          highlight: true,
        },
        {
          time: "11:30 AM - 12:00 NN",
          title: "Closing Ceremony & Remarks",
          location: "Main Auditorium",
          icon: "🎊",
          highlight: true,
        },
        {
          time: "12:00 NN - 1:00 PM",
          title: "Fellowship Lunch",
          location: "Dining Area",
          icon: "🥳",
        },
        {
          time: "1:00 PM onwards",
          title: "Departure / City Tour (Optional)",
          location: "Main Entrance",
          icon: "🚌",
        },
      ],
    },
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.60), rgba(0,0,0,0.72)), url('/camiguin.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        padding: 20,
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
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
            background: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(20px)",
            borderRadius: 30,
            padding: "40px 30px",
            border: "1px solid rgba(255,255,255,0.2)",
            boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
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
                background: "rgba(255,255,255,0.18)",
                borderRadius: 50,
                padding: "10px 24px",
                marginBottom: 18,
              }}
            >
              <span style={{ fontSize: 14, color: "white", fontWeight: 700 }}>
                📅 July 23–24, 2026 | Camiguin Island
              </span>
            </div>

            <h1
              style={{
                color: "white",
                fontSize: "clamp(36px, 7vw, 60px)",
                fontWeight: "900",
                marginBottom: 12,
                textShadow: "0 4px 20px rgba(0,0,0,0.4)",
                lineHeight: 1.1,
              }}
            >
              Program of Activities
            </h1>

            <p
              style={{
                color: "#E2E8F0",
                fontSize: 18,
                maxWidth: 650,
                margin: "0 auto",
                lineHeight: 1.6,
              }}
            >
              Explore the complete lineup of events, exhibits, workshops,
              competitions, and celebrations for the Regional Science &
              Technology Week 2026.
            </p>
          </div>

          {/* Navigation Pills */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: 12,
              marginBottom: 35,
            }}
          >
            {programDays.map((day, index) => (
              <a
                key={index}
                href={`#${day.day.toLowerCase().replace(" ", "-")}`}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(10px)",
                  color: "white",
                  padding: "12px 22px",
                  borderRadius: 50,
                  fontWeight: 700,
                  fontSize: 14,
                  textDecoration: "none",
                  border: "1px solid rgba(255,255,255,0.15)",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                }}
              >
                {day.day}
              </a>
            ))}
          </div>

          {/* Program Days */}
          {programDays.map((dayData, dayIndex) => (
            <div
              key={dayIndex}
              id={dayData.day.toLowerCase().replace(" ", "-")}
              style={{
                marginBottom: 35,
                scrollMarginTop: 20,
              }}
            >
              {/* Day Header */}
              <div
                style={{
                  background: `linear-gradient(135deg, ${dayData.color}, ${dayData.color}cc)`,
                  borderRadius: "24px 24px 0 0",
                  padding: "24px 28px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 15,
                }}
              >
                <div>
                  <h2
                    style={{
                      color: "white",
                      fontSize: 30,
                      fontWeight: 900,
                      margin: 0,
                      marginBottom: 5,
                    }}
                  >
                    {dayData.day}
                  </h2>

                  <p
                    style={{
                      color: "rgba(255,255,255,0.85)",
                      fontSize: 15,
                      margin: 0,
                      fontWeight: 600,
                    }}
                  >
                    {dayData.date}
                  </p>
                </div>

                <div
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    padding: "10px 18px",
                    borderRadius: 50,
                  }}
                >
                  <span
                    style={{
                      color: "white",
                      fontWeight: 700,
                      fontSize: 14,
                    }}
                  >
                    🎯 {dayData.theme}
                  </span>
                </div>
              </div>

              {/* Events */}
              <div
                style={{
                  background: "rgba(255,255,255,0.96)",
                  borderRadius: "0 0 24px 24px",
                  padding: "8px 0",
                  boxShadow: "0 15px 40px rgba(0,0,0,0.15)",
                }}
              >
                {dayData.events.map((event, eventIndex) => (
                  <div
                    key={eventIndex}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      padding: "20px 24px",
                      borderBottom:
                        eventIndex < dayData.events.length - 1
                          ? "1px solid #F1F5F9"
                          : "none",
                      background: event.highlight
                        ? `${dayData.color}08`
                        : "transparent",
                      borderLeft: event.highlight
                        ? `5px solid ${dayData.color}`
                        : "5px solid transparent",
                    }}
                  >
                    {/* Icon */}
                    <div
                      style={{
                        width: 55,
                        height: 55,
                        borderRadius: 16,
                        background: event.highlight
                          ? dayData.color
                          : "#F1F5F9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 26,
                        marginRight: 18,
                        flexShrink: 0,
                        boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                      }}
                    >
                      {event.icon}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: 10,
                          marginBottom: 8,
                        }}
                      >
                        <span
                          style={{
                            background: "#F1F5F9",
                            color: "#475569",
                            padding: "5px 12px",
                            borderRadius: 20,
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          🕐 {event.time}
                        </span>

                        {event.highlight && (
                          <span
                            style={{
                              background: dayData.color,
                              color: "white",
                              padding: "5px 10px",
                              borderRadius: 20,
                              fontSize: 11,
                              fontWeight: 700,
                              textTransform: "uppercase",
                            }}
                          >
                            ⭐ Highlight
                          </span>
                        )}
                      </div>

                      <h3
                        style={{
                          color: "#0F172A",
                          fontSize: 18,
                          fontWeight: 800,
                          margin: "6px 0",
                        }}
                      >
                        {event.title}
                      </h3>

                      <p
                        style={{
                          color: "#64748B",
                          fontSize: 14,
                          margin: 0,
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        📍 {event.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

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
                color: "#0B3D91",
                fontSize: 22,
                fontWeight: 900,
                marginBottom: 22,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              📌 Important Reminders
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
                  icon: "👔",
                  title: "Dress Code",
                  text: "Smart casual for sessions and formal attire for ceremonies.",
                },
                {
                  icon: "🪪",
                  title: "ID Required",
                  text: "Please wear your official event ID inside the venue.",
                },
                {
                  icon: "⏰",
                  title: "Be Punctual",
                  text: "Arrive at least 15 minutes before each activity.",
                },
                {
                  icon: "📱",
                  title: "Silent Mode",
                  text: "Keep devices on silent during talks and presentations.",
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
              background: "rgba(255,255,255,0.1)",
              borderRadius: 16,
              padding: 20,
            }}
          >
            <p
              style={{
                color: "#E2E8F0",
                fontSize: 14,
                marginBottom: 8,
              }}
            >
              🌴 Welcome to the Regional Science & Technology Week 2026 in
              beautiful Camiguin Island.
            </p>

            <p
              style={{
                color: "#CBD5E1",
                fontSize: 13,
                margin: 0,
              }}
            >
              Schedule and activities may change depending on event operations.
            </p>
          </div>
        </div>

        {/* Footer */}
        <p
          style={{
            textAlign: "center",
            color: "rgba(255,255,255,0.7)",
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