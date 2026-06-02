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
      {/* PRIVACY MODAL */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.65)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
            padding: 20,
            backdropFilter: "blur(6px)",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.96)",
              borderRadius: 28,
              maxWidth: 550,
              width: "100%",
              padding: 30,
              boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
              animation: "fadeIn 0.3s ease",
            }}
          >
            <h1
              style={{
                color: "#0B3D91",
                fontSize: 30,
                marginBottom: 12,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Data Privacy Notice
            </h1>

            <p
              style={{
                color: "#334155",
                fontSize: 14,
                lineHeight: 1.7,
                marginTop: 10,
                textAlign: "justify",
              }}
            >
              Welcome to the official transportation management system of the
              Regional Science, Technology, and Innovation Week (RSTW) in
              Camiguin.
              <br />
              <br />
              This platform helps manage transportation requests, attendee
              coordination, and mobility services to ensure a smooth and
              organized event experience for everyone.
            </p>

            <div
              style={{
                marginTop: 20,
                background: "#EFF6FF",
                padding: 16,
                borderRadius: 14,
                border: "1px solid #BFDBFE",
              }}
            >
              <h3
                style={{
                  marginBottom: 8,
                  color: "#1D4ED8",
                  fontSize: 16,
                }}
              >
                Important Notice
              </h3>

              <p
                style={{
                  fontSize: 13,
                  color: "#475569",
                  lineHeight: 1.6,
                  textAlign: "justify",
                }}
              >
                Your personal information will be collected and processed solely
                for transportation coordination, attendance management, and
                official event-related purposes in accordance with the Data
                Privacy Act of 2012.
                <br />
                <br />
                All information will be kept confidential and protected.
              </p>
            </div>

            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                marginTop: 18,
                fontSize: 13,
                color: "#334155",
                cursor: "pointer",
                lineHeight: 1.5,
              }}
            >
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                style={{ marginTop: 3 }}
              />
              I agree to the Data Privacy Notice and consent to data collection.
            </label>

            <button
              disabled={!agreed}
              onClick={() => {
                sessionStorage.setItem("privacyAccepted", "true");

                const seenPoster = sessionStorage.getItem("seenPoster");

                setShowModal(false);

                if (!seenPoster) {
                  sessionStorage.setItem("seenPoster", "true");
                  setShowRSTWWelcome(true);
                }
              }}
              
              style={{
                width: "100%",
                marginTop: 22,
                padding: 14,
                borderRadius: 12,
                border: "none",
                background: agreed
                  ? "linear-gradient(135deg, #0B3D91, #2563EB)"
                  : "#94A3B8",
                color: "white",
                fontSize: 15,
                fontWeight: "bold",
                cursor: agreed ? "pointer" : "not-allowed",
              }}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* RSTW WELCOME POSTER */}
{showRSTWWelcome && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.75)",
      backdropFilter: "blur(8px)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
      padding: 20,
    }}
  >
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 1100,
      }}
    >
      {/* Poster */}
      <img
        src="/cam_background.png"
        alt="RSTW 2026 Camiguin"
        style={{
          width: "100%",
          borderRadius: 24,
          boxShadow: "0 25px 80px rgba(0,0,0,0.6)",
          display: "block",
          margin: "0 auto",
        }}
      />

      {/* Close Button */}
      <button
        onClick={() => setShowRSTWWelcome(false)}
        style={{
          position: "absolute",
          top: 15,
          right: 15,
          width: 42,
          height: 42,
          borderRadius: "50%",
          border: "none",
          background: "rgba(0,0,0,0.6)",
          color: "white",
          fontSize: 20,
          cursor: "pointer",
        }}
      >
        ✕
      </button>
    </div>
  </div>
)}

            {/* MAIN PAGE */}
          <main
        style={{
          minHeight: "100vh",
          backgroundImage:
           "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.65)), url('/camiguin.jpg')",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 16,
          fontFamily: "Segoe UI, sans-serif",
        }}
>
<div
  style={{
    position: "absolute",
    bottom: 124,
    left: "50%",
    transform: "translateX(-50%)",
    width: 240,
    height: 2,
    background: "rgba(255,255,255,0.2)",
    pointerEvents: "none",
  }}
/>
<div
  style={{
    position: "absolute",
    bottom: 80,
    right: "12%",
    fontSize: 40,
    opacity: 0.15,
    pointerEvents: "none",
  }}
>
  ⛴️
</div>

<div
  style={{
    position: "absolute",
    top: 30,
    width: "100%",
    textAlign: "center",
    color: "rgba(255,255,255,0.8)",
    letterSpacing: 2,
    fontSize: 13,
    fontWeight: 600,
  }}
>
  REGIONAL SCIENCE, TECHNOLOGY AND INNOVATION WEEK 2026
</div>

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
            zIndex: 2,
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