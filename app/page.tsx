"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
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
    background: "rgba(255,255,255,0.94)",
    padding: 40,
    borderRadius: 20,
    maxWidth: 500,
    width: "100%",
    textAlign: "center" as const,
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
  };

  const buttonStyle = {
    width: "100%",
    padding: "14px",
    marginTop: 15,
    borderRadius: 10,
    border: "none",
    background: "linear-gradient(135deg, #0B3D91, #2563EB)",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    cursor: "pointer",
  };

  return (
    <main style={pageStyle}>
      <div style={cardStyle}>
        <h1
          style={{
            fontSize: "clamp(30px, 6vw, 60px)",
            color: "#0B3D91",
            marginBottom: 10,
            whiteSpace: "nowrap",
          }}
        >
          ISLA-TRANSPO
        </h1>

        <p
          style={{
            color: "#475569",
            marginBottom: 30,
            fontSize: 16,
          }}
        >
          RSTW Transportation Management System
        </p>

        <button
          style={buttonStyle}
          onClick={() => router.push("/request")}
        >
          Staff Vehicle Request
        </button>

        <button
          style={buttonStyle}
          onClick={() => router.push("/attendee")}
        >
          Attendee Transport
        </button>

        <button
          style={buttonStyle}
          onClick={() => router.push("/feedback")}
        >
          Feedback & Suggestions
        </button>
      </div>
    </main>
  );
}