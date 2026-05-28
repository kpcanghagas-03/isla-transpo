"use client";

import { useRouter } from "next/navigation";

export default function ProgramPage() {
  const router = useRouter();

  const programDays = [
    {
      day: "Day 1",
      date: "June 2, 2025",
      theme: "Opening & Exhibits",
      color: "#0B3D91",
      events: [
        { time: "7:00 AM - 8:00 AM", title: "Registration & Welcome Kits", location: "Main Lobby", icon: "📝" },
        { time: "8:00 AM - 9:30 AM", title: "Opening Ceremony", location: "Main Auditorium", icon: "🎉", highlight: true },
        { time: "9:30 AM - 10:00 AM", title: "Ribbon Cutting & Photo Op", location: "Exhibit Hall Entrance", icon: "✂️" },
        { time: "10:00 AM - 12:00 NN", title: "Exhibits & Innovation Showcase Tour", location: "Exhibit Hall A & B", icon: "🔬" },
        { time: "12:00 NN - 1:00 PM", title: "Lunch Break", location: "Dining Area", icon: "🍽️" },
        { time: "1:00 PM - 5:00 PM", title: "Science Fair & Interactive Demos", location: "Exhibit Hall", icon: "🧪" },
        { time: "5:00 PM - 6:00 PM", title: "Networking Session", location: "Garden Pavilion", icon: "🤝" },
      ],
    },
    {
      day: "Day 2",
      date: "June 3, 2025",
      theme: "Technical Sessions",
      color: "#1E40AF",
      events: [
        { time: "8:00 AM - 8:30 AM", title: "Morning Assembly", location: "Main Auditorium", icon: "☀️" },
        { time: "8:30 AM - 10:00 AM", title: "Plenary Session: Future of Science in Region X", location: "Main Auditorium", icon: "🎤", highlight: true },
        { time: "10:00 AM - 10:30 AM", title: "Coffee Break", location: "Lobby", icon: "☕" },
        { time: "10:30 AM - 12:00 NN", title: "Parallel Technical Sessions", location: "Breakout Rooms 1-4", icon: "📊" },
        { time: "12:00 NN - 1:00 PM", title: "Lunch Break", location: "Dining Area", icon: "🍽️" },
        { time: "1:00 PM - 3:00 PM", title: "Workshop: Research Methodology", location: "Workshop Room A", icon: "📚" },
        { time: "3:00 PM - 5:00 PM", title: "Workshop: Data Visualization & Analysis", location: "Computer Lab", icon: "💻" },
      ],
    },
    {
      day: "Day 3",
      date: "June 4, 2025",
      theme: "Competitions & Judging",
      color: "#059669",
      events: [
        { time: "7:30 AM - 8:00 AM", title: "Participants Assembly", location: "Competition Venue", icon: "📋" },
        { time: "8:00 AM - 12:00 NN", title: "Science Quiz Bee - Elimination Round", location: "Main Auditorium", icon: "🧠", highlight: true },
        { time: "8:00 AM - 12:00 NN", title: "Research Paper Presentation", location: "Breakout Rooms 1-3", icon: "📄" },
        { time: "12:00 NN - 1:00 PM", title: "Lunch Break", location: "Dining Area", icon: "🍽️" },
        { time: "1:00 PM - 3:00 PM", title: "Science Quiz Bee - Finals", location: "Main Auditorium", icon: "🏆", highlight: true },
        { time: "1:00 PM - 4:00 PM", title: "Poster Judging", location: "Exhibit Hall", icon: "🖼️" },
        { time: "4:00 PM - 5:00 PM", title: "Judges Deliberation", location: "Conference Room", icon: "⚖️" },
      ],
    },
    {
      day: "Day 4",
      date: "June 5, 2025",
      theme: "Awarding & Closing",
      color: "#DC2626",
      events: [
        { time: "8:00 AM - 9:00 AM", title: "Assembly & Preparation", location: "Main Auditorium", icon: "👔" },
        { time: "9:00 AM - 11:30 AM", title: "Awarding Ceremony", location: "Main Auditorium", icon: "🏅", highlight: true },
        { time: "11:30 AM - 12:00 NN", title: "Closing Ceremony & Remarks", location: "Main Auditorium", icon: "🎊", highlight: true },
        { time: "12:00 NN - 1:00 PM", title: "Fellowship Lunch", location: "Dining Area", icon: "🥳" },
        { time: "1:00 PM onwards", title: "Departure / City Tour (Optional)", location: "Main Entrance", icon: "🚌" },
      ],
    },
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        // LIGHTER BACKGROUND: soft sky-to-sand gradient with a subtle texture overlay
        backgroundImage:
          "linear-gradient(160deg, #E0F2FE 0%, #F0F9FF 35%, #FFF7ED 100%), url('/noise.png')",
        backgroundBlendMode: "overlay",
        backgroundSize: "cover",
        backgroundPosition: "center",
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
            border: "1px solid rgba(15, 23, 42, 0.08)",
            color: "#0B3D91",
            background: "white",
            fontWeight: "bold",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            boxShadow: "0 4px 14px rgba(15,23,42,0.08)",
          }}
        >
          ← Back to Home
        </button>

        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 36,
            padding: "28px 20px",
            background: "rgba(255,255,255,0.8)",
            border: "1px solid rgba(15,23,42,0.06)",
            borderRadius: 24,
            backdropFilter: "blur(6px)",
            boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: "linear-gradient(90deg,#EFF6FF,#E0F2FE)",
              border: "1px solid rgba(15,23,42,0.06)",
              borderRadius: 50,
              padding: "8px 24px",
              marginBottom: 14,
            }}
          >
            <span style={{ fontSize: 14, color: "#0F172A", fontWeight: 700 }}>
              📅 June 2-5, 2025 | Camiguin Island
            </span>
          </div>

          <h1
            style={{
              color: "#0F172A",
              fontSize: "clamp(32px, 7vw, 56px)",
              fontWeight: "900",
              marginBottom: 10,
              lineHeight: 1.1,
            }}
          >
            Program of Activities
          </h1>

          <p
            style={{
              color: "#334155",
              fontSize: 18,
              maxWidth: 640,
              margin: "0 auto",
            }}
          >
            Regional Science & Technology Week 2025
          </p>
        </div>

        {/* Day Navigation Pills */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 30,
          }}
        >
          {programDays.map((day, index) => (
            <a
              key={index}
              href={`#${day.day.toLowerCase().replace(" ", "-")}`}
              style={{
                background: "white",
                color: day.color,
                padding: "12px 22px",
                borderRadius: 999,
                fontWeight: 800,
                fontSize: 14,
                textDecoration: "none",
                border: `2px solid ${day.color}`,
                boxShadow: "0 6px 18px rgba(15,23,42,0.06)",
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
            style={{ marginBottom: 28, scrollMarginTop: 20 }}
          >
            {/* Day Header */}
            <div
              style={{
                background: "white",
                border: "1px solid rgba(15,23,42,0.08)",
                borderRadius: "20px 20px 0 0",
                padding: "22px 26px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12,
                boxShadow: "0 8px 24px rgba(15,23,42,0.05)",
              }}
            >
              <div>
                <h2
                  style={{
                    color: "#0F172A",
                    fontSize: 26,
                    fontWeight: 900,
                    margin: 0,
                    marginBottom: 4,
                  }}
                >
                  {dayData.day}
                </h2>
                <p
                  style={{
                    color: "#334155",
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
                  background: dayData.color + "12",
                  color: dayData.color,
                  padding: "10px 16px",
                  borderRadius: 999,
                  fontWeight: 800,
                  border: `1px solid ${dayData.color}33`,
                }}
              >
                🎯 {dayData.theme}
              </div>
            </div>

            {/* Events List */}
            <div
              style={{
                background: "white",
                border: "1px solid rgba(15,23,42,0.08)",
                borderTop: "none",
                borderRadius: "0 0 20px 20px",
                padding: "8px 0",
                boxShadow: "0 16px 36px rgba(15,23,42,0.06)",
              }}
            >
              {dayData.events.map((event, eventIndex) => (
                <div
                  key={eventIndex}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    padding: "16px 22px",
                    borderBottom:
                      eventIndex < dayData.events.length - 1
                        ? "1px solid #E2E8F0"
                        : "none",
                    background: event.highlight ? dayData.color + "08" : "white",
                    borderLeft: event.highlight
                      ? `4px solid ${dayData.color}`
                      : "4px solid transparent",
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: event.highlight ? dayData.color : "#F1F5F9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 22,
                      marginRight: 16,
                      flexShrink: 0,
                      color: event.highlight ? "white" : "#0F172A",
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
                            fontWeight: 800,
                            textTransform: "uppercase",
                          }}
                        >
                          Highlight
                        </span>
                      )}
                    </div>

                    <h3
                      style={{
                        color: "#0F172A",
                        fontSize: 17,
                        fontWeight: 800,
                        margin: "6px 0 4px 0",
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
            background: "white",
            border: "1px solid rgba(15,23,42,0.08)",
            borderRadius: 18,
            padding: 24,
            marginBottom: 26,
            boxShadow: "0 12px 28px rgba(15,23,42,0.06)",
          }}
        >
          <h3
            style={{
              color: "#0F172A",
              fontSize: 20,
              fontWeight: 900,
              marginBottom: 14,
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
              gap: 14,
            }}
          >
            {[
              { icon: "👔", title: "Dress Code", text: "Smart casual for sessions; formal for ceremonies." },
              { icon: "🪪", title: "ID Required", text: "Always wear your event ID badge inside the venue." },
              { icon: "⏰", title: "Be Punctual", text: "Arrive 15 minutes before each session." },
              { icon: "📱", title: "Silent Mode", text: "Keep phones on silent during presentations." },
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  padding: 14,
                  background: "#F8FAFC",
                  borderRadius: 12,
                  border: "1px solid #E2E8F0",
                }}
              >
                <span style={{ fontSize: 26 }}>{item.icon}</span>
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
                  <p style={{ color: "#475569", margin: 0, fontSize: 14 }}>
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
            color: "#475569",
            fontSize: 13,
            marginTop: 16,
            paddingBottom: 16,
          }}
        >
          © 2025 Regional Science & Technology Week — Camiguin | Program schedule subject to change
        </p>
      </div>
    </main>
  );
}
