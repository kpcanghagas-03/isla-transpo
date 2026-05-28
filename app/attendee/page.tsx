"use client";

import { useRouter } from "next/navigation";

export default function AttendeePage() {
  const router = useRouter();

  const trips = [
    {
      route: "Balingoan → Benoni",
      departure: "5:00 AM",
      arrival: "7:00 AM",
      fare: "₱270",
    },
    {
      route: "Balingoan → Benoni",
      departure: "9:00 AM",
      arrival: "11:00 AM",
      fare: "₱270",
    },
    {
      route: "Benoni → Balingoan",
      departure: "1:00 PM",
      arrival: "3:00 PM",
      fare: "₱270",
    },
    {
      route: "Benoni → Balingoan",
      departure: "5:00 PM",
      arrival: "7:00 PM",
      fare: "₱270",
    },
  ];

  const program = [
    {
      day: "Day 1",
      title: "Opening Ceremony & Registration",
      time: "8:00 AM - 12:00 NN",
    },
    {
      day: "Day 1",
      title: "Exhibits & Innovation Showcase",
      time: "1:00 PM - 5:00 PM",
    },
    {
      day: "Day 2",
      title: "Technical Sessions & Workshops",
      time: "8:00 AM - 5:00 PM",
    },
    {
      day: "Day 3",
      title: "Competitions & Judging",
      time: "8:00 AM - 3:00 PM",
    },
    {
      day: "Day 4",
      title: "Awarding Ceremony & Closing",
      time: "9:00 AM - 12:00 NN",
    },
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.65)), url('/camiguin.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: 20,
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <div style={{ maxWidth: 950, margin: "0 auto" }}>
        {/* Back Button */}
        <button
          onClick={() => router.push("/")}
          style={{
            marginBottom: 18,
            padding: "10px 16px",
            borderRadius: 10,
            border: "none",
            color: "#0B3D91",
            background: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          ← Back to Home
        </button>

        {/* MAIN CARD */}
        <div
          style={{
            background: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(18px)",
            borderRadius: 26,
            padding: 35,
            border: "1px solid rgba(255,255,255,0.25)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
          }}
        >
          <h1
            style={{
              color: "white",
              fontSize: "clamp(30px, 5vw, 50px)",
              textAlign: "center",
              fontWeight: "800",
              marginBottom: 8,
            }}
          >
            Barge Schedule & Trips
          </h1>

          <p
            style={{
              textAlign: "center",
              color: "#E2E8F0",
              marginBottom: 25,
              fontSize: 15,
            }}
          >
            Camiguin Ferry Timetable for RSTW Participants
          </p>

          {/* PROGRAM OF ACTIVITIES */}
          <div
            style={{
              background: "rgba(255,255,255,0.92)",
              borderRadius: 18,
              padding: 20,
              marginBottom: 25,
            }}
          >
            <h2
              style={{
                color: "#0B3D91",
                fontSize: 20,
                fontWeight: "800",
                marginBottom: 15,
              }}
            >
              RSTW Program of Activities
            </h2>

            <div style={{ display: "grid", gap: 12 }}>
              {program.map((item, index) => (
                <div
                  key={index}
                  style={{
                    borderLeft: "4px solid #0B3D91",
                    paddingLeft: 12,
                  }}
                >
                  <p
                    style={{
                      fontSize: 13,
                      color: "#64748B",
                      marginBottom: 2,
                      fontWeight: 600,
                    }}
                  >
                    {item.day}
                  </p>

                  <p
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "#0F172A",
                    }}
                  >
                    {item.title}
                  </p>

                  <p
                    style={{
                      fontSize: 13,
                      color: "#334155",
                    }}
                  >
                    {item.time}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* TRIP LIST */}
          <div style={{ display: "grid", gap: 16 }}>
            {trips.map((trip, index) => (
              <div
                key={index}
                style={{
                  background: "white",
                  borderRadius: 18,
                  padding: 20,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                }}
              >
                <h2
                  style={{
                    color: "#0B3D91",
                    fontSize: 18,
                    fontWeight: "bold",
                    marginBottom: 12,
                  }}
                >
                  {trip.route}
                </h2>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                    gap: 12,
                  }}
                >
                  <div>
                    <p style={{ color: "#64748B", fontSize: 13 }}>
                      Departure
                    </p>
                    <p
                      style={{
                        color: "#0F172A",
                        fontSize: 16,
                        fontWeight: "700",
                      }}
                    >
                      {trip.departure}
                    </p>
                  </div>

                  <div>
                    <p style={{ color: "#64748B", fontSize: 13 }}>
                      Arrival
                    </p>
                    <p
                      style={{
                        color: "#0F172A",
                        fontSize: 16,
                        fontWeight: "700",
                      }}
                    >
                      {trip.arrival}
                    </p>
                  </div>

                  <div>
                    <p style={{ color: "#64748B", fontSize: 13 }}>Fare</p>
                    <p
                      style={{
                        color: "#0B3D91",
                        fontSize: 18,
                        fontWeight: "800",
                      }}
                    >
                      {trip.fare}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* FOOTNOTE */}
          <p
            style={{
              marginTop: 25,
              textAlign: "center",
              color: "#E2E8F0",
              fontSize: 13,
            }}
          >
            Schedule may change depending on weather and ferry operations.
          </p>
        </div>
      </div>
    </main>
  );
}