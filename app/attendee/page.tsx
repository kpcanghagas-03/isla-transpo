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
              marginBottom: 30,
              fontSize: 15,
            }}
          >
            Camiguin Ferry Timetable for RSTW Participants
          </p>

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
                  {/* Departure */}
                  <div>
                    <p
                      style={{
                        color: "#64748B",
                        fontSize: 13,
                        marginBottom: 4,
                      }}
                    >
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

                  {/* Arrival */}
                  <div>
                    <p
                      style={{
                        color: "#64748B",
                        fontSize: 13,
                        marginBottom: 4,
                      }}
                    >
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

                  {/* Fare */}
                  <div>
                    <p
                      style={{
                        color: "#64748B",
                        fontSize: 13,
                        marginBottom: 4,
                      }}
                    >
                      Fare
                    </p>
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