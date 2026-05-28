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
  const fareRates = {
    regular: "₱330.00",
    seniorPWD: "₱266.00",
    seniorCitizen: "₱235.00",
    children: "₱165.00",
  };

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

  const TripCard = ({
    route,
    trips,
    bgColor = "#0B3D91",
  }: {
    route: string;
    trips: { time: string; vessel: string; arrival: string }[];
    bgColor?: string;
  }) => (
    <div
      style={{
        background: "white",
        borderRadius: 18,
        padding: 20,
        boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
        marginBottom: 16,
      }}
    >
      <h2
        style={{
          color: bgColor,
          fontSize: 18,
          fontWeight: "bold",
          marginBottom: 15,
          borderBottom: `3px solid ${bgColor}`,
          paddingBottom: 10,
        }}
      >
        {route}
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 8,
          fontSize: 12,
          fontWeight: 700,
          color: "#64748B",
          marginBottom: 10,
          textTransform: "uppercase",
        }}
      >
        <span>Departure</span>
        <span>Vessel</span>
        <span>Arrival</span>
      </div>

      {trips.map((trip, index) => (
        <div
          key={index}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 8,
            padding: "10px 0",
            borderBottom:
              index < trips.length - 1 ? "1px solid #E2E8F0" : "none",
          }}
        >
          <p
            style={{
              color: "#0F172A",
              fontSize: 14,
              fontWeight: "700",
            }}
          >
            {trip.time}
          </p>
          <p
            style={{
              color: "#334155",
              fontSize: 14,
              fontWeight: "600",
            }}
          >
            {trip.vessel}
          </p>
          <p
            style={{
              color: "#0F172A",
              fontSize: 14,
              fontWeight: "700",
            }}
          >
            {trip.arrival}
          </p>
        </div>
      ))}
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
              marginBottom: 10,
              fontSize: 15,
            }}
          >
            St. Benedict Ocean Shipping Lines Corporation
          </p>

          <p
            style={{
              textAlign: "center",
              color: "#CBD5E1",
              marginBottom: 25,
              fontSize: 13,
            }}
          >
            Contact: 0956 638 7141 | Benoni, Mahinog, Camiguin
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

          {/* FARE RATES */}
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
              Passenger Fare Rates (Benoni ↔ Balingoan)
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: 12,
              }}
            >
              <div
                style={{
                  background: "#0B3D91",
                  borderRadius: 12,
                  padding: 15,
                  textAlign: "center",
                }}
              >
                <p style={{ color: "#CBD5E1", fontSize: 12, marginBottom: 4 }}>
                  Regular
                </p>
                <p style={{ color: "white", fontSize: 20, fontWeight: 800 }}>
                  {fareRates.regular}
                </p>
              </div>

              <div
                style={{
                  background: "#1E40AF",
                  borderRadius: 12,
                  padding: 15,
                  textAlign: "center",
                }}
              >
                <p style={{ color: "#CBD5E1", fontSize: 12, marginBottom: 4 }}>
                  SP / PWD
                </p>
                <p style={{ color: "white", fontSize: 20, fontWeight: 800 }}>
                  {fareRates.seniorPWD}
                </p>
              </div>

              <div
                style={{
                  background: "#3B82F6",
                  borderRadius: 12,
                  padding: 15,
                  textAlign: "center",
                }}
              >
                <p style={{ color: "#E0E7FF", fontSize: 12, marginBottom: 4 }}>
                  Senior Citizen
                </p>
                <p style={{ color: "white", fontSize: 20, fontWeight: 800 }}>
                  {fareRates.seniorCitizen}
                </p>
              </div>

              <div
                style={{
                  background: "#60A5FA",
                  borderRadius: 12,
                  padding: 15,
                  textAlign: "center",
                }}
              >
                <p style={{ color: "#1E3A8A", fontSize: 12, marginBottom: 4 }}>
                  Children (3-11 yrs)
                </p>
                <p style={{ color: "#1E3A8A", fontSize: 20, fontWeight: 800 }}>
                  {fareRates.children}
                </p>
              </div>
            </div>
          </div>

          {/* TRIP SCHEDULES */}
          <TripCard route="Benoni → Balingoan" trips={benoniToBalingoan} />

          <TripCard
            route="Balingoan → Benoni"
            trips={balingoanToBenoni}
            bgColor="#1E40AF"
          />

          <TripCard
            route="Balingoan → Guinsiliban"
            trips={balingoanToGuinsiliban}
            bgColor="#059669"
          />

          <TripCard
            route="Guinsiliban → Balingoan"
            trips={guinsilibanToBalingoan}
            bgColor="#047857"
          />

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
            <br />
            Daily trips available. Contact St. Benedict Ocean Shipping Lines for
            updates.
          </p>
        </div>
      </div>
    </main>
  );
}
