"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomePage() {
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [agreed, setAgreed] = useState(false);

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
              padding: 35,
              boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
              animation: "fadeIn 0.3s ease",
            }}
          >
            <h1
              style={{
                color: "#0B3D91",
                fontSize: 34,
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
                fontSize: 15,
                lineHeight: 1.8,
                marginTop: 15,
                textAlign: "justify",
              }}
            >
              Welcome to the official transportation management system of
              the Regional Science, Technology, and Innovation Week
              (RSTW) in Camiguin.
              <br />
              <br />
              This platform helps manage transportation requests,
              attendee coordination, and mobility services to ensure a
              smooth and organized event experience for everyone.
            </p>

            <div
              style={{
                marginTop: 22,
                background: "#EFF6FF",
                padding: 18,
                borderRadius: 16,
                border: "1px solid #BFDBFE",
              }}
            >
              <h3
                style={{
                  marginBottom: 10,
                  color: "#1D4ED8",
                  fontSize: 18,
                }}
              >
                Data Privacy Notice
              </h3>

              <p
                style={{
                  fontSize: 14,
                  color: "#475569",
                  lineHeight: 1.7,
                  textAlign: "justify",
                }}
              >
                Your personal information will be collected and processed
                solely for transportation coordination, attendance
                management, and official event-related purposes in
                accordance with the Data Privacy Act of 2012.
                <br />
                <br />
                All submitted information will be treated with strict
                confidentiality and protected through appropriate
                security measures.
              </p>
            </div>

            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                marginTop: 22,
                fontSize: 14,
                color: "#334155",
                cursor: "pointer",
                lineHeight: 1.5,
              }}
            >
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                style={{
                  marginTop: 4,
                  transform: "scale(1.1)",
                }}
              />

              I have read and understood the Data Privacy Notice and
              voluntarily consent to the collection and processing of my
              information.
            </label>

            <button
              disabled={!agreed}
              onClick={() => {
                sessionStorage.setItem("privacyAccepted", "true");
                setShowModal(false);
              }}
              style={{
                width: "100%",
                marginTop: 28,
                padding: 15,
                borderRadius: 14,
                border: "none",
                background: agreed
                  ? "linear-gradient(135deg, #0B3D91, #2563EB)"
                  : "#94A3B8",
                color: "white",
                fontSize: 16,
                fontWeight: "bold",
                cursor: agreed ? "pointer" : "not-allowed",
                transition: "0.25s ease",
                boxShadow: agreed
                  ? "0 10px 25px rgba(37,99,235,0.35)"
                  : "none",
              }}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* MAIN PAGE */}
      <main
        style={{
          minHeight: "100vh",
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.55)), url('/camiguin.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
          fontFamily: "Segoe UI, sans-serif",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.25)",
            padding: 40,
            borderRadius: 28,
            maxWidth: 520,
            width: "100%",
            textAlign: "center",
            boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
            animation: "fadeIn 0.5s ease",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(36px, 8vw, 64px)",
              color: "white",
              marginBottom: 10,
              fontWeight: "800",
              letterSpacing: 1,
              lineHeight: 1.1,
            }}
          >
            ISLA-TRANSPO
          </h1>

          <p
            style={{
              color: "#E2E8F0",
              marginBottom: 35,
              fontSize: 16,
              lineHeight: 1.6,
            }}
          >
            Regional Science, Technology, and Innovation Week
            Transportation Management System
          </p>

          <button
            style={buttonStyle}
            onClick={() => router.push("/request")}
          >
            Request for Trasportation
          </button>

          <button
            style={buttonStyle}
            onClick={() => router.push("/attendee")}
          >
            Barge Schedule & Trips
          </button>

          <button
            style={buttonStyle}
            onClick={() => router.push("/feedback")}
          >
            Feedback & Suggestions
          </button>
        </div>
      </main>
    </>
  );
}

const buttonStyle = {
  width: "100%",
  padding: "15px",
  marginTop: 16,
  borderRadius: 14,
  border: "none",
  background: "linear-gradient(135deg, #0B3D91, #2563EB)",
  color: "white",
  fontSize: 16,
  fontWeight: "bold",
  cursor: "pointer",
  transition: "0.25s ease",
  boxShadow: "0 10px 25px rgba(37,99,235,0.35)",
};