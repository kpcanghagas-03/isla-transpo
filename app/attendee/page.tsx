"use client";

import { useRouter } from "next/navigation";

export default function AttendeePage() {
  const router = useRouter();

  const pageStyle = {
    minHeight: "100vh",
    backgroundImage: "url('/camiguin.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    fontFamily: "Segoe UI, sans-serif",
  };

  const cardStyle = {
    background: "rgba(255,255,255,0.95)",
    padding: "35px 25px",
    borderRadius: 20,
    maxWidth: 650,
    width: "100%",
    boxShadow: "0 15px 40px rgba(0,0,0,0.25)",
    backdropFilter: "blur(8px)",
  };

  const buttonStyle = {
    width: "100%",
    padding: "14px",
    marginTop: 15,
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(135deg, #0B3D91, #2563EB)",
    color: "white",
    fontSize: 16,
    fontWeight: "bold" as const,
    cursor: "pointer",
  };

  return (
    <main style={pageStyle}>
      <div style={cardStyle}>
        <h1
          style={{
            fontSize: "clamp(28px, 5vw, 48px)",
            color: "#0B3D91",
            marginBottom: 10,
            textAlign: "center" as const,
            fontWeight: "bold",
          }}
        >
          ATTENDEE TRANSPORT
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#475569",
            marginBottom: 25,
            fontSize: 16,
          }}
        >
          Transportation Coordination for RSTW Attendees
        </p>

        {/* Supported Pickup Locations */}
        <div
          style={{
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            borderRadius: 14,
            padding: 20,
            marginBottom: 20,
          }}
        >
          <h3 style={{ color: "#0B3D91", marginBottom: 10 }}>
            Supported Pickup Locations
          </h3>

          <ul
            style={{
              paddingLeft: 20,
              color: "#334155",
              lineHeight: 1.8,
            }}
          >
            <li>Binoni Port</li>
            <li>Camiguin Airport</li>
          </ul>
        </div>

        {/* Important Notice */}
        <div
          style={{
            background: "#fff7ed",
            border: "1px solid #fdba74",
            borderRadius: 14,
            padding: 20,
            marginBottom: 25,
          }}
        >
          <h3 style={{ color: "#c2410c", marginBottom: 10 }}>
            Important Travel Notice
          </h3>

          <p
            style={{
              color: "#7c2d12",
              lineHeight: 1.7,
              fontSize: 15,
            }}
          >
            Passengers arriving at Laguindingan Airport must travel to
            Balingoan Port and ride a ferry to Binoni Port before transport
            pickup can be provided.
          </p>
        </div>

        {/* Buttons */}
        <button
          style={buttonStyle}
          onClick={() => router.push("/request")}
        >
          Continue to Vehicle Request
        </button>

        <button
          onClick={() => router.push("/")}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: 12,
            borderRadius: 12,
            border: "2px solid #0B3D91",
            background: "white",
            color: "#0B3D91",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Back to Home
        </button>
      </div>
    </main>
  );
}