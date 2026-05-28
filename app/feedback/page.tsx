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
        background:
          "radial-gradient(circle at top, #0B3D91 0%, #020617 55%, #000000 100%)",
        padding: 20,
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* BACK */}
        <button
          onClick={() => router.push("/")}
          style={{
            marginBottom: 20,
            padding: "12px 18px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#0B3D91",
            background: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          ← Back to Home
        </button>

        {/* HEADER */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 40,
            padding: 30,
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(20px)",
            borderRadius: 26,
            border: "1px solid rgba(255,255,255,0.15)",
            boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
          }}
        >
          <h1
            style={{
              color: "white",
              fontSize: "clamp(34px, 6vw, 60px)",
              fontWeight: 900,
            }}
          >
            Program of Activities
          </h1>

          <p style={{ color: "#E2E8F0", fontSize: 16 }}>
            Regional Science & Technology Week 2025 • Camiguin Island
          </p>
        </div>

        {/* DAYS */}
        {programDays.map((dayData, i) => (
          <div key={i} style={{ marginBottom: 30 }}>
            {/* DAY HEADER */}
            <div
              style={{
                background: "rgba(255,255,255,0.95)",
                padding: 22,
                borderRadius: 18,
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
              }}
            >
              <div>
                <h2 style={{ margin: 0, color: "#0F172A", fontWeight: 900 }}>
                  {dayData.day}
                </h2>
                <p style={{ margin: 0, color: "#475569" }}>{dayData.date}</p>
              </div>

              <div
                style={{
                  background: dayData.color,
                  color: "white",
                  padding: "8px 14px",
                  borderRadius: 999,
                  fontWeight: 800,
                  marginTop: 8,
                }}
              >
                {dayData.theme}
              </div>
            </div>

            {/* EVENTS */}
            <div
              style={{
                background: "white",
                borderRadius: "0 0 18px 18px",
                padding: 10,
              }}
            >
              {dayData.events.map((event, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: 16,
                    borderBottom: "1px solid #eee",
                    display: "flex",
                    gap: 12,
                  }}
                >
                  <div style={{ fontSize: 22 }}>{event.icon}</div>

                  <div>
                    <p style={{ margin: 0, fontWeight: 800 }}>
                      {event.title}
                    </p>
                    <p style={{ margin: 0, fontSize: 13, color: "#64748B" }}>
                      {event.time} • {event.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}