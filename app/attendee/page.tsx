"use client";

import { useRouter } from "next/navigation";

export default function AttendeePage() {
  const router = useRouter();

  // Benoni → Balingoan trips
  const benoniToBalingoan = [
    { time: "3:00 AM", vessel: "FRANCISCA 7", arrival: "4:00 AM" },
    { time: "4:30 AM", vessel: "FRANCISCA 3", arrival: "5:45 AM" },
    { time: "7:40 AM", vessel: "FRANCISCA 5", arrival: "8:25 AM" },
    { time: "8:30 AM", vessel: "FRANCISCA 3", arrival: "9:45 AM" },
    { time: "10:25 AM", vessel: "FRANCISCA 7", arrival: "11:25 AM" },
    { time: "12:25 PM", vessel: "FRANCISCA 5", arrival: "1:40 PM" },
    { time: "12:55 PM", vessel: "FRANCISCA 3", arrival: "1:40 PM" },
    { time: "2:40 PM", vessel: "FRANCISCA 7", arrival: "3:40 PM" },
    { time: "4:40 PM", vessel: "FRANCISCA 5", arrival: "5:25 PM" },
  ];

  // Balingoan → Benoni trips
  const balingoanToBenoni = [
    { time: "4:00 AM", vessel: "FRANCISCA 5", arrival: "4:45 AM" },
    { time: "6:25 AM", vessel: "FRANCISCA 3", arrival: "7:40 AM" },
    { time: "8:10 AM", vessel: "FRANCISCA 7", arrival: "9:10 AM" },
    { time: "10:10 AM", vessel: "FRANCISCA 5", arrival: "10:55 AM" },
    { time: "10:40 AM", vessel: "FRANCISCA 3", arrival: "12:10 PM" },
    { time: "12:00 NN", vessel: "FRANCISCA 7", arrival: "1:00 PM" },
    { time: "2:10 PM", vessel: "FRANCISCA 5", arrival: "3:25 PM" },
    { time: "3:10 PM", vessel: "FRANCISCA 3", arrival: "3:55 PM" },
    { time: "4:40 PM", vessel: "FRANCISCA 7", arrival: "5:40 PM" },
  ];

  // Balingoan → Guinsiliban trips
  const balingoanToGuinsiliban = [
    { time: "5:30 AM", vessel: "FRANCISCA 9", arrival: "6:15 AM" },
    { time: "8:30 AM", vessel: "FRANCISCA 9", arrival: "9:15 AM" },
    { time: "1:30 PM", vessel: "FRANCISCA 9", arrival: "2:45 PM" },
  ];

  // Guinsiliban → Balingoan trips
  const guinsilibanToBalingoan = [
    { time: "7:00 AM", vessel: "FRANCISCA 9", arrival: "7:45 AM" },
    { time: "12:00 NN", vessel: "FRANCISCA 9", arrival: "12:45 PM" },
    { time: "4:15 PM", vessel: "FRANCISCA 9", arrival: "5:00 PM" },
  ];

  // Fare rates
  const passengerFares = [
    { type: "Regular", price: "₱330.00", color: "#0B3D91" },
    { type: "SP / PWD", price: "₱266.00", color: "#1E40AF" },
    { type: "Senior Citizen", price: "₱235.00", color: "#3B82F6" },
    { type: "Children (3-11 yrs)", price: "₱165.00", color: "#60A5FA" },
  ];

  // Vehicle rates
  const vehicleFares = [
    { type: "Motorcycle", price: "₱772.00" },
    { type: "Big Bike", price: "₱1,146.00" },
    { type: "Bicycle", price: "₱173.00" },
    { type: "Trisikad", price: "₱508.00" },
    { type: "Motorized Tricycle", price: "₱1,181.00" },
    { type: "Tricycle w/ Pump Boat Engine", price: "₱1,181.00" },
    { type: "Motorcycle with Side Car", price: "₱1,657.00" },
    { type: "Baja / Motorela", price: "₱1,602.00" },
    { type: "Multicab / Owner Jeep / Sedan", price: "₱1,780.00" },
    { type: "Pick-up / Van / SUV", price: "₱2,224.00" },
  ];

  const TripCard = ({
    route,
    trips,
    icon,
    gradientFrom,
    gradientTo,
  }: {
    route: string;
    trips: { time: string; vessel: string; arrival: string }[];
    icon: string;
    gradientFrom: string;
    gradientTo: string;
  }) => (
    <div
      style={{
        background: "white",
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
        marginBottom: 20,
      }}
    >
      {/* Header */}
      <div
        style={{
          background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
          padding: "18px 20px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span style={{ fontSize: 28 }}>{icon}</span>
        <h2
          style={{
            color: "white",
            fontSize: 18,
            fontWeight: "800",
            margin: 0,
            textShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
        >
          {route}
        </h2>
      </div>

      {/* Table Header */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 8,
          padding: "14px 20px",
          background: "#F8FAFC",
          borderBottom: "2px solid #E2E8F0",
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#64748B",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          🕐 Departure
        </span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#64748B",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          🚢 Vessel
        </span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#64748B",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          📍 Arrival
        </span>
      </div>

      {/* Trip Rows */}
      <div style={{ padding: "0 20px" }}>
        {trips.map((trip, index) => (
          <div
            key={index}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 8,
              padding: "14px 0",
              borderBottom:
                index < trips.length - 1 ? "1px solid #F1F5F9" : "none",
              transition: "background 0.2s",
            }}
          >
            <p
              style={{
                color: "#0F172A",
                fontSize: 15,
                fontWeight: "700",
                margin: 0,
              }}
            >
              {trip.time}
            </p>
            <p
              style={{
                color: "#475569",
                fontSize: 14,
                fontWeight: "600",
                margin: 0,
              }}
            >
              {trip.vessel}
            </p>
            <p
              style={{
                color: "#0F172A",
                fontSize: 15,
                fontWeight: "700",
                margin: 0,
              }}
            >
              {trip.arrival}
            </p>
          </div>
        ))}
      </div>

      {/* Trip Count Badge */}
      <div
        style={{
          padding: "12px 20px",
          background: "#F8FAFC",
          borderTop: "1px solid #E2E8F0",
        }}
      >
        <span
          style={{
            fontSize: 12,
            color: "#64748B",
            fontWeight: 600,
          }}
        >
          {trips.length} daily trips available
        </span>
      </div>
    </div>
  );

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.65)), url('/camiguin.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        padding: 20,
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        {/* Back Button */}
        <button
          onClick={() => router.push("/")}
          style={{
            marginBottom: 18,
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
            transition: "transform 0.2s",
          }}
        >
          ← Back to Home
        </button>

        {/* MAIN CARD */}
        <div
          style={{
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(20px)",
            borderRadius: 30,
            padding: "40px 35px",
            border: "1px solid rgba(255,255,255,0.25)",
            boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
          }}
        >
          {/* Header Section */}
          <div style={{ textAlign: "center", marginBottom: 35 }}>
            <div
              style={{
                display: "inline-block",
                background: "rgba(255,255,255,0.2)",
                borderRadius: 50,
                padding: "8px 20px",
                marginBottom: 15,
              }}
            >
              <span style={{ fontSize: 14, color: "white", fontWeight: 600 }}>
                🚢 St. Benedict Ocean Shipping Lines Corporation
              </span>
            </div>

            <h1
              style={{
                color: "white",
                fontSize: "clamp(32px, 6vw, 52px)",
                fontWeight: "900",
                marginBottom: 10,
                textShadow: "0 4px 20px rgba(0,0,0,0.3)",
                lineHeight: 1.1,
              }}
            >
              Barge Schedule & Trips
            </h1>

            <p
              style={{
                color: "#E2E8F0",
                fontSize: 16,
                marginBottom: 8,
              }}
            >
              Camiguin Ferry Timetable for RSTW Participants
            </p>

            <p
              style={{
                color: "#CBD5E1",
                fontSize: 14,
              }}
            >
              📞 0956 638 7141 | 📍 Benoni, Mahinog, Camiguin
            </p>
          </div>

          {/* PASSENGER FARE RATES */}
          <div
            style={{
              background: "rgba(255,255,255,0.95)",
              borderRadius: 22,
              padding: 25,
              marginBottom: 25,
              boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
            }}
          >
            <h2
              style={{
                color: "#0B3D91",
                fontSize: 20,
                fontWeight: "800",
                marginBottom: 20,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span
                style={{
                  background: "#0B3D91",
                  color: "white",
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                }}
              >
                🎫
              </span>
              Passenger Fare Rates (Benoni ↔ Balingoan)
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: 14,
              }}
            >
              {passengerFares.map((fare, index) => (
                <div
                  key={index}
                  style={{
                    background: `linear-gradient(135deg, ${fare.color}, ${fare.color}dd)`,
                    borderRadius: 16,
                    padding: 18,
                    textAlign: "center",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                    transition: "transform 0.2s",
                  }}
                >
                  <p
                    style={{
                      color: "rgba(255,255,255,0.85)",
                      fontSize: 12,
                      marginBottom: 6,
                      fontWeight: 600,
                    }}
                  >
                    {fare.type}
                  </p>
                  <p
                    style={{
                      color: "white",
                      fontSize: 22,
                      fontWeight: 800,
                      margin: 0,
                    }}
                  >
                    {fare.price}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* VEHICLE FARE RATES */}
          <div
            style={{
              background: "rgba(255,255,255,0.95)",
              borderRadius: 22,
              padding: 25,
              marginBottom: 25,
              boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
            }}
          >
            <h2
              style={{
                color: "#0B3D91",
                fontSize: 20,
                fontWeight: "800",
                marginBottom: 20,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span
                style={{
                  background: "#059669",
                  color: "white",
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                }}
              >
                🚗
              </span>
              Vehicle / Rolling Cargo Rates (RORO)
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 12,
              }}
            >
              {vehicleFares.map((fare, index) => (
                <div
                  key={index}
                  style={{
                    background: "#F8FAFC",
                    borderRadius: 12,
                    padding: "14px 16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    border: "1px solid #E2E8F0",
                  }}
                >
                  <span
                    style={{
                      color: "#334155",
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    {fare.type}
                  </span>
                  <span
                    style={{
                      color: "#059669",
                      fontSize: 15,
                      fontWeight: 800,
                    }}
                  >
                    {fare.price}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* TRIP SCHEDULES */}
          <div style={{ marginBottom: 10 }}>
            <h2
              style={{
                color: "white",
                fontSize: 24,
                fontWeight: "800",
                marginBottom: 20,
                textAlign: "center",
                textShadow: "0 2px 10px rgba(0,0,0,0.3)",
              }}
            >
              ⏰ Daily Trip Schedules
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: 20,
              }}
            >
              <TripCard
                route="Benoni → Balingoan"
                trips={benoniToBalingoan}
                icon="🏝️"
                gradientFrom="#0B3D91"
                gradientTo="#1E40AF"
              />

              <TripCard
                route="Balingoan → Benoni"
                trips={balingoanToBenoni}
                icon="⛴️"
                gradientFrom="#1E40AF"
                gradientTo="#3B82F6"
              />

              <TripCard
                route="Balingoan → Guinsiliban"
                trips={balingoanToGuinsiliban}
                icon="🌊"
                gradientFrom="#059669"
                gradientTo="#10B981"
              />

              <TripCard
                route="Guinsiliban → Balingoan"
                trips={guinsilibanToBalingoan}
                icon="🚤"
                gradientFrom="#047857"
                gradientTo="#059669"
              />
            </div>
          </div>

          {/* FOOTNOTE */}
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
              ⚠️ Schedule may change depending on weather and ferry operations.
            </p>
            <p
              style={{
                color: "#CBD5E1",
                fontSize: 13,
              }}
            >
              Contact St. Benedict Ocean Shipping Lines at{" "}
              <strong>0956 638 7141</strong> for updates.
            </p>
          </div>
        </div>

        {/* Footer */}
        <p
          style={{
            textAlign: "center",
            color: "rgba(255,255,255,0.6)",
            fontSize: 12,
            marginTop: 20,
          }}
        >
          © 2026 Regional Science & Technology Week — Camiguin
        </p>
      </div>
    </main>
  );
}
