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
              Welcome to ISLA-TRANSPO
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
                Data Privacy Notice
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
                setShowModal(false);
                setShowRSTWWelcome(true);
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

{/* RSTW WELCOME MODAL */}
{showRSTWWelcome && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background:
        "linear-gradient(135deg,#001B4D,#003C8F,#0057D9)",
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