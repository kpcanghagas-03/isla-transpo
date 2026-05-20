"use client";

import { useRouter } from "next/navigation";
import {useEffect, useState } from "react";

export default function HomePage() {
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("privacyAccepted");

    if (!accepted) {
      setShowModal(true);
    }
  }, []);

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
    <>
      {/* WELCOME MODAL */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
            padding: 20,
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.96)",
              backdropFilter: "blur(10px)",
              borderRadius: 24,
              maxWidth: 520,
              width: "100%",
              padding: 35,
              boxShadow: "0 10px 40px rgba(0,0,0,0.35)",
              animation: "fadeIn 0.3s ease",
            }}
          >
            <h1
              style={{
                color: "#0B3D91",
                fontSize: 32,
                marginBottom: 10,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Welcome to RSTW
            </h1>

            <p
              style={{
                color: "#334155",
                fontSize: 15,
                lineHeight: 1.7,
                marginTop: 15,
              }}
            >
              Welcome to the ISLA-TRANSPO Transportation Management
              System of the Regional Science, Technology, and Innovation
              Week (RSTW). 
            </p>

            <div
              style={{
                marginTop: 20,
                background: "#EFF6FF",
                padding: 18,
                borderRadius: 14,
                border: "1px solid #BFDBFE",
              }}
            >
              <h3
                style={{
                  marginBottom: 10,
                  color: "#1D4ED8",
                }}
              >
                Data Privacy Notice
              </h3>

              <p
                style={{
                  fontSize: 14,
                  color: "#475569",
                  lineHeight: 1.6,
                }}
              >
                Your personal information will be collected and processed
                solely for transportation coordination, attendance
                management, and official event-related purposes in
                accordance with the Data Privacy Act of 2012.
                <br />
                <br />
                All information submitted will be treated with
                confidentiality and protected through appropriate
                security measures.
              </p>
            </div>

            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                marginTop: 20,
                fontSize: 14,
                color: "#334155",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                style={{
                  marginTop: 4,
                }}
              />

              I have read and understood the Data Privacy Notice and
              voluntarily consent to the collection and processing of my
              information.
            </label>

            <button
              disabled={!agreed}
              onClick={() => {
                localStorage.setItem("privacyAccepted", "true");
                setShowModal(false);
              }}  
              style={{
                width: "100%",
                marginTop: 25,
                padding: 14,
                borderRadius: 12,
                border: "none",
                background: agreed
                  ? "linear-gradient(135deg, #0B3D91, #2563EB)"
                  : "#94A3B8",
                color: "white",
                fontSize: 16,
                fontWeight: "bold",
                cursor: agreed ? "pointer" : "not-allowed",
                transition: "0.2s",
              }}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* MAIN PAGE */}
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
    </>
  );
}