"use client";

import { useRouter } from "next/navigation";

export default function ProgramPage() {
  const router = useRouter();

  const programDays = [
    {
      day: "Day 1",
      date: "June 2, 2026",
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
      date: "June 3, 2026",
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
      date: "June 4, 2026",
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
      date: "June 5, 2026",
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
          "linear-gradient(135deg, #0B3D91 0%, #1E40AF 50%, #3B82F6 100%)",
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
          }}
        >
          ← Back to Home
        </button>

        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 40,
            padding: "30px 20px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: 24,
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: "rgba(255,255,255,0.2)",
              borderRadius: 50,
              padding: "8px 24px",
              marginBottom: 15,
            }}
          >
            <span style={{ fontSize: 14, color: "white", fontWeight: 600 }}>
              📅 June 2-5, 2026 | Camiguin Island
            </span>
          </div>

          <h1
            style={{
              color: "white",
              fontSize: "clamp(32px, 7vw, 56px)",
              fontWeight: "900",
              marginBottom: 12,
              textShadow: "0 4px 20px rgba(0,0,0,0.3)",
              lineHeight: 1.1,
            }}
          >
            Program of Activities
          </h1>

          <p
            style={{
              color: "rgba(255,255,255,0.9)",
              fontSize: 18,
              maxWidth: 600,
              margin: "0 auto",
            }}
          >
            Regional Science & Technology Week 2026
          </p>
        </div>

        {/* Day Navigation Pills */}
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
                background: day.color,
                color: "white",
                padding: "12px 24px",
                borderRadius: 50,
                fontWeight: 700,
                fontSize: 14,
                textDecoration: "none",
                boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                transition: "transform 0.2s",
              }}
            >
              {day.day}: {day.theme}
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
                padding: "25px 30px",
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
                    fontSize: 28,
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
                    fontSize: 16,
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
                  padding: "10px 20px",
                  borderRadius: 50,
                }}
              >
                <span
                  style={{ color: "white", fontWeight: 700, fontSize: 14 }}
                >
                  🎯 {dayData.theme}
                </span>
              </div>
            </div>

            {/* Events List */}
            <div
              style={{
                background: "white",
                borderRadius: "0 0 24px 24px",
                padding: "10px 0",
                boxShadow: "0 15px 40px rgba(0,0,0,0.15)",
              }}
            >
              {dayData.events.map((event, eventIndex) => (
                <div
                  key={eventIndex}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    padding: "18px 25px",
                    borderBottom:
                      eventIndex < dayData.events.length - 1
                        ? "1px solid #F1F5F9"
                        : "none",
                    background: event.highlight
                      ? `${dayData.color}08`
                      : "transparent",
                    borderLeft: event.highlight
                      ? `4px solid ${dayData.color}`
                      : "4px solid transparent",
                    transition: "background 0.2s",
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 14,
                      background: event.highlight
                        ? dayData.color
                        : "#F1F5F9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 24,
                      marginRight: 18,
                      flexShrink: 0,
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
                        marginBottom: 6,
                      }}
                    >
                      <span
                        style={{
                          background: "#F1F5F9",
                          color: "#475569",
                          padding: "4px 12px",
                          borderRadius: 20,
                          fontSize: 13,
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
                            padding: "4px 10px",
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
                        fontSize: 17,
                        fontWeight: 700,
                        margin: "8px 0 4px 0",
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
            borderRadius: 20,
            padding: 28,
            marginBottom: 30,
            boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
          }}
        >
          <h3
            style={{
              color: "#0B3D91",
              fontSize: 20,
              fontWeight: 800,
              marginBottom: 18,
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
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 16,
            }}
          >
            {[
              {
                icon: "👔",
                title: "Dress Code",
                text: "Smart casual for regular sessions; formal attire for ceremonies",
              },
              {
                icon: "🪪",
                title: "ID Required",
                text: "Always wear your event ID badge inside the venue",
              },
              {
                icon: "⏰",
                title: "Be Punctual",
                text: "Please arrive 15 minutes before each session",
              },
              {
                icon: "📱",
                title: "Silent Mode",
                text: "Keep phones on silent during presentations",
              },
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 14,
                  padding: 16,
                  background: "#F8FAFC",
                  borderRadius: 14,
                  border: "1px solid #E2E8F0",
                }}
              >
                <span style={{ fontSize: 28 }}>{item.icon}</span>
                <div>
                  <p
                    style={{
                      fontWeight: 700,
                      color: "#0F172A",
                      margin: "0 0 4px 0",
                      fontSize: 15,
                    }}
                  >
                    {item.title}
                  </p>
                  <p style={{ color: "#64748B", margin: 0, fontSize: 14 }}>
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
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
          © 2026 Regional Science & Technology Week — Camiguin | Program
          schedule subject to change
        </p>
      </div>
    </main>
  );
}
