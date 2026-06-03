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
            background: "rgba(0,0,0,.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
            padding: 20,
            backdropFilter: "blur(5px)",
          }}
        >
          <div
            style={{
              background: "#fff",
              maxWidth: 600,
              width: "100%",
              borderRadius: 24,
              padding: 30,
              boxShadow: "0 25px 60px rgba(0,0,0,.25)",
            }}
          >
            <h1
              style={{
                color: "#A61E22",
                textAlign: "center",
                marginBottom: 15,
              }}
            >
              Data Privacy Notice
            </h1>

            <p
              style={{
                color: "#475569",
                lineHeight: 1.7,
                fontSize: 14,
                textAlign: "justify",
              }}
            >
              Welcome to the official transportation management system of the
              Regional Science, Technology and Innovation Week (RSTW) 2026.
              This platform manages transportation requests, mobility services,
              attendee transportation schedules, and event-related travel
              coordination.
            </p>

            <div
              style={{
                marginTop: 20,
                padding: 16,
                borderRadius: 14,
                background: "#FFF7ED",
                border: "1px solid #FDBA74",
              }}
            >
              <strong
                style={{
                  color: "#EA580C",
                }}
              >
                Important Notice
              </strong>

              <p
                style={{
                  marginTop: 10,
                  fontSize: 13,
                  color: "#475569",
                  lineHeight: 1.6,
                }}
              >
                Personal information collected through this system shall only
                be used for transportation coordination and official event
                purposes in accordance with the Data Privacy Act of 2012.
              </p>
            </div>

            <label
              style={{
                display: "flex",
                gap: 10,
                marginTop: 20,
                alignItems: "flex-start",
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />

              I agree to the Data Privacy Notice and consent to data
              processing.
            </label>

            <button
              disabled={!agreed}
              onClick={() => {
                sessionStorage.setItem("privacyAccepted", "true");
                setShowModal(false);
              }}
              style={{
                width: "100%",
                marginTop: 20,
                padding: 14,
                border: "none",
                borderRadius: 12,
                color: "#fff",
                fontWeight: "bold",
                cursor: agreed ? "pointer" : "not-allowed",
                background: agreed
                  ? "linear-gradient(135deg,#F27A35,#A61E22)"
                  : "#CBD5E1",
              }}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      <main
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(180deg,#ffffff 0%,#f8fafc 50%,#ffffff 100%)",
          fontFamily: "Segoe UI, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >

{/* Logos - Upper Left */}
        <div
        style={{
          position: "absolute",
          top: 0,
          left: 15,
          zIndex: 20,
          display: "flex",
          alignItems: "flex-end",
          gap: 12,
        }}
      >
        <img
    src="/bp_logo.png"
    alt="BP Logo"
    style={{
      width: 50,
      top: 10,
      height: "auto",
      objectFit: "contain",
    }}
  />
        <img
          src="/dost-normin.png"
          alt="DOST Logo"
          style={{
            width: 200,
            height: "auto",
            objectFit: "contain",
          }}
        />
</div>
        {/* LEFT DECORATION */}
        <div
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

            {/* RSTW BACKGROUND DESIGN */}
<div
  style={{
    position: "absolute",
    inset: 0,
    overflow: "hidden",
    pointerEvents: "none",
    zIndex: 0,
  }}
></div>

<div
  style={{
    position: "absolute",
    top: -80,
    right: -80,
    width: 320,
    height: 320,
    borderRadius: "50%",
    background:
      "conic-gradient(#F27A35,#A61E22,#1F5AA6,#F27A35)",
    opacity: 0.08,
  }}
/>

<div
  style={{
    position: "absolute",
    bottom: -120,
    left: -120,
    width: 350,
    height: 350,
    borderRadius: "50%",
    background:
      "conic-gradient(#1F5AA6,#F27A35,#A61E22,#1F5AA6)",
    opacity: 0.08,
  }}
/>

<div
  style={{
    position: "absolute",
    top: 220,
    left: 80,
    width: 120,
    height: 120,
    borderRadius: "0 100% 0 0",
    background: "#F27A35",
    opacity: 0.12,
  }}
/>

<div
  style={{
    position: "absolute",
    top: 380,
    right: 120,
    width: 140,
    height: 140,
    borderRadius: "100% 0 0 0",
    background: "#1F5AA6",
    opacity: 0.12,
  }}
/>

<div
  style={{
    position: "absolute",
    top: 150,
    right: 250,
    width: 90,
    height: 90,
    border: "8px solid #A61E22",
    transform: "rotate(45deg)",
    opacity: 0.1,
  }}
/>

<div
  style={{
    position: "absolute",
    bottom: 180,
    left: 220,
    width: 70,
    height: 70,
    border: "6px solid #1F5AA6",
    transform: "rotate(45deg)",
    opacity: 0.1,
  }}
/>

{[...Array(12)].map((_, i) => (
  <div
    key={i}
    style={{
      position: "absolute",
      width: 10,
      height: 10,
      borderRadius: "50%",
      background:
        i % 3 === 0
          ? "#F27A35"
          : i % 3 === 1
          ? "#A61E22"
          : "#1F5AA6",
      top: `${120 + i * 60}px`,
      right: `${40 + (i % 4) * 25}px`,
      opacity: 0.18,
    }}
  />
))}


        {/* HERO */}
        <section
          style={{
            textAlign: "center",
            padding: "70px 20px 50px",
            position: "relative",
            zIndex: 2,
          }}
        >
          <h1
            style={{
              fontSize: "clamp(48px,8vw,84px)",
              fontWeight: 900,
              marginBottom: 10,
              background:
                "linear-gradient(90deg,#F27A35,#A61E22,#1F5AA6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            <span style={{ color: "#1F5AA6" }}>ISLA</span>
            <span style={{ color: "#F27A35" }}>-</span>
            <span style={{ color: "#A61E22" }}>TRANSPO</span>
          </h1>

          <p
            style={{
              maxWidth: 800,
              margin: "auto",
              color: "#64748B",
              fontSize: 16,
            }}
          >
            Transportation Management System for Regional Science,Technology and Innovation Week 2026
          </p>
        </section>
            <div
              style={{
                maxWidth: 1100,
                margin: "0 auto 40px",
                padding: "20px 30px",
                background:
                  "linear-gradient(90deg,#1F5AA6,#4C9FD6)",
                color: "#fff",
                borderRadius: 20,
                position: "relative",
                zIndex: 2,
              }}
            >
              Welcome to the official transportation management system for
              Regional Science, Technology and Innovation Week 2026.
            </div>

        {/* CARDS */}
        <section
          style={{
            maxWidth: 1100,
            background:"linear-gradient(180deg,#ffffff,#fafafa)",
            transition: "all 0.3s ease",
            margin: "0 auto",
            padding: "20px",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(280px,1fr))",
            gap: 24,
            position: "relative",
            zIndex: 2,
          }}
        >
          <Card
            title="Transportation Request"
            text="Submit transportation requests and coordinate travel requirements."
            buttonText="Request Transportation"
            onClick={() => router.push("/request")}
            color="#F27A35"
          />

          <Card
            title="Barge Schedule & Trips"
            text="Check transportation schedules, arrivals, departures and updates."
            buttonText="View Schedule"
            onClick={() => router.push("/attendee")}
            color="#1F5AA6"
          />

          <Card
            title="Program of Activities"
            text="View official activities and event schedules for RSTW 2026."
            buttonText="Program Activities"
            onClick={() => router.push("/feedback")}
            color="#A61E22"
          />
        </section>

        {/* EVENT INFO */}
        <section
          style={{
            maxWidth: 1100,
            margin: "40px auto",
            padding: "0 20px",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 24,
              padding: 30,
              boxShadow: "0 10px 25px rgba(0,0,0,.08)",
            }}
          >
            <h2
              style={{
                color: "#1F2937",
                marginBottom: 20,
              }}
            >
              RSTW 2026 Information
            </h2>

            <p style={{ color: "#475569", lineHeight: 1.8 }}>
              Science, Technology and Digital Innovation:
              Driving Food Security, Sustainable Energy,
              and National Resilience.
            </p>

            <p style={{ color: "#475569" }}>
              📍 Camiguin Island
            </p>

            <p style={{ color: "#475569" }}>
              📅 July 22-24, 2026
            </p>
          </div>
        </section>

        <footer
  style={{
    marginTop: 60,
    padding: "40px 20px",
    background: "#fff",
    borderTop: "4px solid #F27A35",
    position: "relative",
    zIndex: 2,
  }}
>
  <div
    style={{
      textAlign: "center",
      marginBottom: 25,
    }}
  >
    <h2
      style={{
        color: "#1F5AA6",
        marginBottom: 10,
      }}
    >
      Regional Science, Technology and Innovation Week 2026
    </h2>

    <p
      style={{
        color: "#64748B",
      }}
    >
      Official Event Branding
    </p>
  </div>

  <div
    style={{
      maxWidth: 900,
      margin: "0 auto",
    }}
  >
    <img
      src="/rstw_2026.jpg"
      alt="RSTW 2026 Poster"
      style={{
        width: "100%",
        borderRadius: 24,
        boxShadow: "0 15px 40px rgba(0,0,0,.12)",
      }}
    />
  </div>
</footer>
      </main>
    </>
  );
}

function Card({
  title,
  text,
  buttonText,
  onClick,
  color,
}: {
  title: string;
  text: string;
  buttonText: string;
  onClick: () => void;
  color: string;
}) {
  return (
    <div
      style={{
        background: "#fff",
        padding: 30,
        borderRadius: 24,
        boxShadow: "0 12px 30px rgba(0,0,0,.08)",
        borderTop: `6px solid ${color}`,
      }}
    >
      <h2
        style={{
          marginBottom: 10,
          color: "#0F172A",
        }}
      >
        {title}
      </h2>

      <p
        style={{
          color: "#64748B",
          lineHeight: 1.6,
          marginBottom: 25,
        }}
      >
        {text}
      </p>

      <button
        onClick={onClick}
        style={{
          width: "100%",
          padding: 16,
          border: "none",
          borderRadius: 16,
          color: "#fff",
          fontWeight: 700,
          cursor: "pointer",
          background: color,
        }}
      >
        {buttonText}
      </button>
    </div>
  );
}