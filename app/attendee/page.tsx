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
          "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.55)), url('/camiguin.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: 20,
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        {/* Back Button */}
        <button
          onClick={() => router.push("/")}
          style={{
            marginBottom: 20,
            padding: "10px 18px",
            border: "none",
            borderRadius: 12,
            background: "white",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          ← Back to Home
        </button>

        {/* Card */}
        <div
          style={{
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(16px)",
            borderRadius: 24,
            padding: 35,
            border: "1px solid rgba(255,255,255,0.2)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
          }}
        >
          <h1
            style={{
              color: "white",
              fontSize: "clamp(28px, 5vw, 48px)",
              marginBottom: 10,
              fontWeight: "800",
              textAlign: "center",
            }}
          >
            Fare & Barge Trips
          </h1>

          <p
            style={{
              textAlign: "center",
              color: "#E2E8F0",
              marginBottom: 30,
              fontSize: 16,
            }}
          >
            Camiguin Ferry Schedule & Fare Information for RSTW Participants
          </p>

          {/* Trip Cards */}
          <div
            style={{
              display: "grid",
              gap: 18,
            }}
          >
            {trips.map((trip, index) => (
              <div
                key={index}
                style={{
                  background: "rgba(255,255,255,0.95)",
                  borderRadius: 18,
                  padding: 20,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                }}
              >
                <h2
                  style={{
                    color: "#0B3D91",
                    marginBottom: 12,
                    fontSize: 20,
                    fontWeight: "bold",
                  }}
                >
                  {trip.route}
                </h2>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                    gap: 10,
                  }}
                >
                  <div>
                    <p style={{ color: "#64748B", fontSize: 13 }}>
                      Departure
                    </p>
                    <strong>{trip.departure}</strong>
                  </div>

                  <div>
                    <p style={{ color: "#64748B", fontSize: 13 }}>
                      Arrival
                    </p>
                    <strong>{trip.arrival}</strong>
                  </div>

                  <div>
                    <p style={{ color: "#64748B", fontSize: 13 }}>Fare</p>
                    <strong>{trip.fare}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Note */}
          <p
            style={{
              marginTop: 25,
              textAlign: "center",
              color: "#E2E8F0",
              fontSize: 13,
            }}
          >
            Schedules may change depending on weather and ferry availability.
          </p>
        </div>
      </div>
    </main>
  );
}