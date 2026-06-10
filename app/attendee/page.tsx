"use client";

import React, { FC } from "react";
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

  const routes = [
  {
    route: "Benoni → Balingoan",
    trips: benoniToBalingoan,
    icon: "🏝️",
    gradientFrom: "#F27A35",
    gradientTo: "#A61E22",
  },
  {
    route: "Balingoan → Benoni",
    trips: balingoanToBenoni,
    icon: "⛴️",
    gradientFrom: "#1F5AA6",
    gradientTo: "#4C9FD6",
  },
  {
    route: "Balingoan → Guinsiliban",
    trips: balingoanToGuinsiliban,
    icon: "🌊",
    gradientFrom: "#A61E22",
    gradientTo: "#F27A35",
  },
  {
    route: "Guinsiliban → Balingoan",
    trips: guinsilibanToBalingoan,
    icon: "🚤",
    gradientFrom: "#1F5AA6",
    gradientTo: "#A61E22",
  },
];

const [activeTab, setActiveTab] = React.useState(0);
const [startX, setStartX] = React.useState(0);
const [currentX, setCurrentX] = React.useState(0);
const [isDragging, setIsDragging] = React.useState(false);

const handleTouchStart = (e: React.TouchEvent) => {
  setStartX(e.touches[0].clientX);
  setIsDragging(true);
};

const handleTouchMove = (e: React.TouchEvent) => {
  if (!isDragging) return;

  setCurrentX(e.touches[0].clientX - startX);
};

const handleTouchEnd = () => {
  setIsDragging(false);

  const threshold = 60;

  if (currentX < -threshold && activeTab < routes.length - 1) {
    setActiveTab((prev) => prev + 1);
  }

  if (currentX > threshold && activeTab > 0) {
    setActiveTab((prev) => prev - 1);
  }

  setCurrentX(0);
};

  // Fare rates
  const passengerFares = [
  { type: "Regular", price: "₱330.00", color: "#F27A35" },
  { type: "SP / PWD", price: "₱266.00", color: "#A61E22" },
  { type: "Senior Citizen", price: "₱235.00", color: "#1F5AA6" },
  { type: "Children (3-11 yrs)", price: "₱165.00", color: "#4C9FD6" },
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

  interface TripCardProps {
    route: string;
    trips: { time: string; vessel: string; arrival: string }[];
    icon: React.ReactNode;
    gradientFrom: string;
    gradientTo: string;
  }

  const TripCard: FC<TripCardProps> = ({ route, trips, icon, gradientFrom, gradientTo }) => (
  <div
    style={{
      background: "white",
      borderRadius: 18,
      overflow: "hidden",
      boxShadow: "0 10px 35px rgba(0,0,0,0.12)",
      marginBottom: 18,
    }}
  >
    {/* Header */}
    <div
      style={{
        background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
        padding: "16px 18px",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <span style={{ fontSize: 26 }}>{icon}</span>
      <h2
        style={{
          color: "white",
          fontSize: 16,
          fontWeight: 800,
          margin: 0,
        }}
      >
        {route}
      </h2>
    </div>

    {/* Cards Stack */}
    <div style={{ padding: "12px" }}>
      {trips.map((trip, index) => (
        <div
          key={index}
          style={{
            background: "#F8FAFC",
            border: "1px solid #E2E8F0",
            borderRadius: 14,
            padding: 12,
            marginBottom: index === trips.length - 1 ? 0 : 10,
          }}
        >
          {/* Top Row */}
          <div style={{ marginBottom: 6 }}>
            <p style={{ fontSize: 11, color: "#64748B", margin: 0 }}>
              Departure
            </p>
            <p style={{ fontSize: 15, fontWeight: 700, margin: 0, color: "#0F172A" }}>
              🕐 {trip.time}
            </p>
          </div>

          {/* Middle Row */}
          <div style={{ marginBottom: 6 }}>
            <p style={{ fontSize: 11, color: "#64748B", margin: 0 }}>
              Vessel
            </p>
            <p style={{ fontSize: 14, fontWeight: 600, margin: 0, color: "#475569" }}>
              🚢 {trip.vessel}
            </p>
          </div>

          {/* Bottom Row */}
          <div>
            <p style={{ fontSize: 11, color: "#64748B", margin: 0 }}>
              Arrival
            </p>
            <p style={{ fontSize: 15, fontWeight: 700, margin: 0, color: "#0F172A" }}>
              📍 {trip.arrival}
            </p>
          </div>
        </div>
      ))}
    </div>

    {/* Footer */}
    <div
      style={{
        padding: "10px 14px",
        background: "#F8FAFC",
        borderTop: "1px solid #E2E8F0",
        fontSize: 12,
        color: "#64748B",
        fontWeight: 600,
      }}
    >
      {trips.length} trips available
    </div>
  </div>
);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg,#ffffff 0%,#f8fafc 50%,#ffffff 100%)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        padding: "clamp(12px, 3vw, 20px)",
        fontFamily: "Segoe UI, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* LEFT DECORATION */}
<div
className="hide-on-mobile"
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
className="hide-on-mobile"
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
    background: "#ffffff",
    borderRadius: 30,
    padding: "clamp(18px, 4vw, 40px)",
    boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
  }}
>
          
          {/* Header Section */}
<div style={{ textAlign: "center", marginBottom: 35 }}>
  <div
    style={{
      display: "inline-block",
      background: "linear-gradient(135deg,#F27A35,#A61E22)",
      borderRadius: 50,
      padding: "8px 20px",
      marginBottom: 15,
    }}
  >
    <span
      style={{
        fontSize: 14,
        color: "#fff",
        fontWeight: 600,
      }}
    >
      🚢 St. Benedict Ocean Shipping Lines Corporation
    </span>
  </div>

  <h1
    style={{
      background: "linear-gradient(90deg,#F27A35,#A61E22,#1F5AA6)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      fontSize: "clamp(32px, 6vw, 52px)",
      fontWeight: "900",
      marginBottom: 10,
      lineHeight: 1.1,
    }}
  >
    Barge Schedule & Trips
  </h1>

  <p
    style={{
      color: "#64748B",
      fontSize: 16,
      marginBottom: 8,
    }}
  >
    Camiguin Ferry Timetable for RSTW Participants
  </p>

  <p
    style={{
      color: "#475569",
      fontSize: 14,
    }}
  >
    📞 0956 638 7141 | 📍 Benoni, Mahinog, Camiguin
  </p>
</div>

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

            <div>
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
                    wordBreak: "break-word",  
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
              
          {/* TRIP SCHEDULES */}
          <div style={{ marginBottom: 10 }}>
            <h2
              style={{
                color: "#1F2937",
                fontSize: 24,
                fontWeight: "800",
                marginBottom: 20,
                textAlign: "center",
              }}
            >
              ⏰ Daily Trip Schedules
            </h2>
            
               <div style={{ display: "flex", overflowX: "auto", gap: 8 }}>
    {routes.map((r, i) => (
      <button
        key={i}
        onClick={() => setActiveTab(i)}
        style={{
          padding: "8px 12px",
          borderRadius: 20,
          border: "none",
          fontSize: 12,
          fontWeight: 700,
          background: i === activeTab ? "#F27A35" : "#E2E8F0",
          color: i === activeTab ? "white" : "#475569",
        }}
      >
        {
          i === 0 ? "🏝️ Benoni-Balingoan" :
          i === 1 ? "⛴️ Balingoan-Benoni" :
          i === 2 ? "🌊 Balingoan-Guinsiliban" :
          "🚤 Guinsiliban-Balingoan"
        }
      </button>
    ))}
  </div>

<div
  onTouchStart={handleTouchStart}
  onTouchMove={handleTouchMove}
  onTouchEnd={handleTouchEnd}
  style={{
    overflow: "hidden",
    borderRadius: 18,
    cursor: "grab",
    userSelect: "none",
    WebkitUserSelect: "none",
    touchAction: "pan-y",
  }}
>
  <div
    style={{
      display: "flex",
      transform: `translateX(calc(-${activeTab * 100}% + ${currentX}px))`,
      transition: isDragging
        ? "none"
        : "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
    }}
  >
    {routes.map((r, i) => (
      <div
        key={i}
        style={{
          minWidth: "100%",
          flexShrink: 0,
          padding: "0 6px",
        }}
      >
        <TripCard
          route={r.route}
          trips={r.trips}
          icon={r.icon}
          gradientFrom={r.gradientFrom}
          gradientTo={r.gradientTo}
        />
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
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 16,
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
    </div>
    </main>
  );
}

