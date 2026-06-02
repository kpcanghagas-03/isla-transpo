"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomePage() {
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [showRSTWWelcome, setShowRSTWWelcome] = useState(false);

  useEffect(() => {
    const accepted = sessionStorage.getItem("privacyAccepted");

    if (!accepted) {
      setShowModal(true);
    }
  }, []);

  return (
    <>
      {/* RSTW WELCOME MODAL */}
{showRSTWWelcome && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.45)",
      backdropFilter: "blur(6px)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
      padding: 20,
    }}
  >
    <div
      style={{
        width: "100%",
        maxWidth: 700,
        background: "rgba(255,255,255,0.12)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.2)",
        borderRadius: 32,
        padding: "40px 30px",
        textAlign: "center",
        boxShadow: "0 25px 80px rgba(0,0,0,0.45)",
        animation: "fadeIn 0.4s ease",
      }}
    >
      {/* Optional Banner */}
      <img
        src="/rstw2026-banner.png"
        alt="RSTW 2026"
        style={{
          width: "100%",
          borderRadius: 20,
          marginBottom: 24,
          objectFit: "cover",
          maxHeight: 220,
        }}
      />

      <div
        style={{
          fontSize: 50,
          marginBottom: 10,
        }}
      >
        🌋
      </div>

      <h3
        style={{
          color: "#FCD34D",
          letterSpacing: 4,
          marginBottom: 8,
          fontSize: 14,
        }}
      >
        WELCOME TO
      </h3>

      <h1
        style={{
          fontSize: "clamp(36px,8vw,72px)",
          color: "white",
          margin: 0,
          fontWeight: 900,
          lineHeight: 1,
        }}
      >
        RSTW 2026
      </h1>

      <h2
        style={{
          marginTop: 12,
          color: "#E2E8F0",
          fontWeight: 500,
        }}
      >
        Camiguin Island
      </h2>

      <p
        style={{
          marginTop: 20,
          color: "#CBD5E1",
          lineHeight: 1.8,
          fontSize: 15,
        }}
      >
        Welcome to the Regional Science, Technology and Innovation Week 2026.
        Experience innovation, collaboration, and sustainable development in
        the Island Born of Fire.
      </p>

      <div
        style={{
          marginTop: 18,
          color: "#FCD34D",
          fontWeight: 700,
          fontSize: 15,
        }}
      >
        July 22–24, 2026
      </div>

      <button
        onClick={() => setShowRSTWWelcome(false)}
        style={{
          marginTop: 30,
          padding: "15px 36px",
          borderRadius: 50,
          border: "none",
          background:
            "linear-gradient(135deg,#F59E0B,#FBBF24)",
          color: "#0B3D91",
          fontWeight: "bold",
          fontSize: 15,
          cursor: "pointer",
          boxShadow: "0 10px 30px rgba(245,158,11,0.4)",
        }}
      >
        Enter ISLA-TRANSPO →
      </button>
    </div>
  </div>
)}

{/* RSTW WELCOME MODAL */}
{showRSTWWelcome && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(255,255,255,0.12)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(255,255,255,0.2)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
      padding: 20,
      overflow: "hidden",
    }}
  >
    <div
      style={{
        position: "absolute",
        width: 500,
        height: 500,
        background: "#38BDF8",
        borderRadius: "50%",
        filter: "blur(160px)",
        opacity: 0.25,
      }}
    />

    <div
      style={{
        textAlign: "center",
        color: "white",
        maxWidth: 700,
        zIndex: 2,
      }}
    >
      <h3
        style={{
          color: "#FBBF24",
          letterSpacing: 5,
          marginBottom: 10,
        }}
      >
        WELCOME TO
      </h3>

      <h1
        style={{
          fontSize: "clamp(42px,8vw,82px)",
          margin: 0,
          fontWeight: 900,
        }}
      >
        RSTW 2026
      </h1>

      <h2
        style={{
          marginTop: 10,
          color: "#E2E8F0",
        }}
      >
        Camiguin Island
      </h2>

      <p
        style={{
          marginTop: 20,
          color: "#CBD5E1",
          lineHeight: 1.8,
        }}
      >
        Regional Science, Technology and Innovation Week
      </p>

      <p
        style={{
          color: "#FCD34D",
          fontWeight: "bold",
        }}
      >
        Building Smart and Sustainable Communities
      </p>

      <button
        onClick={() => setShowRSTWWelcome(false)}
        style={{
          marginTop: 30,
          padding: "14px 34px",
          borderRadius: 50,
          border: "none",
          background:
            "linear-gradient(135deg,#F59E0B,#FBBF24)",
          color: "#001B4D",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Enter ISLA-TRANSPO →
      </button>
    </div>
  </div>
)}

      {/* MAIN PAGE */}
      <main
        style={{
          minHeight: "100vh",
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.65)), url('/cam_background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 16,
          fontFamily: "Segoe UI, sans-serif",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 520,
            background: "rgba(255,255,255,0.14)",
            backdropFilter: "blur(18px)",
            border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: 24,
            padding: "28px 18px",
            textAlign: "center",
            boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(28px, 7vw, 54px)",
              color: "white",
              marginBottom: 10,
              fontWeight: 800,
              lineHeight: 1.1,
            }}
          >
            ISLA-TRANSPO
          </h1>

          <p
            style={{
              color: "#E2E8F0",
              marginBottom: 25,
              fontSize: 14,
              lineHeight: 1.5,
            }}
          >
            RSTW Transportation Management System
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <button
              style={buttonStyle}
              onClick={() => router.push("/request")}
            >
              Request Transportation
            </button>

            <button
              style={buttonStyle}
              onClick={() => router.push("/attendee")}
            >
              Barge Schedule & Trips
            </button>

            <button
              style={{
                ...buttonStyle,
                background: "linear-gradient(135deg, #1D4ED8, #3B82F6)",
              }}
              onClick={() => router.push("/feedback")}
            >
              Program of Activities
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

const buttonStyle = {
  width: "100%",
  padding: "14px",
  borderRadius: 14,
  border: "none",
  background: "linear-gradient(135deg, #0B3D91, #2563EB)",
  color: "white",
  fontSize: 15,
  fontWeight: "bold",
  cursor: "pointer",
  minHeight: 48,
  boxShadow: "0 8px 20px rgba(37,99,235,0.35)",
};