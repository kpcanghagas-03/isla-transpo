"use client";

import { useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();

  return (
    <aside
  className="sidebar"
  style={{
    position: "fixed",
    left: 16,
    top: 90,
    width: 220,
    padding: 16,
    borderRadius: 20,
    background: "rgba(255,255,255,0.75)",
    backdropFilter: "blur(12px)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    border: "1px solid rgba(31,90,166,0.15)",
    zIndex: 50,
  }}
>
      {/* HEADER */}
      <div
        style={{
          fontWeight: 800,
          fontSize: 14,
          marginBottom: 14,
          background: "linear-gradient(90deg,#F27A35,#A61E22,#1F5AA6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Quick Navigation
      </div>

      {/* BUTTONS */}
      <NavButton label="Home" onClick={() => router.push("/")} />
      <NavButton label="Transportation Request" onClick={() => router.push("/request")} />
      <NavButton label="Barge Schedule & Trips" onClick={() => router.push("/attendee")} />
      <NavButton label="Accommodation & Venues" onClick={() => router.push("/feedback")} />
    </aside>
  );
}

function NavButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        textAlign: "left",
        padding: "10px 12px",
        marginBottom: 8,
        borderRadius: 12,
        border: "none",
        background: "transparent",
        color: "#334155",
        fontSize: 13,
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
      onMouseOver={(e) => {
        (e.currentTarget.style.background = "#F8FAFC"),
          (e.currentTarget.style.color = "#1F5AA6");
      }}
      onMouseOut={(e) => {
        (e.currentTarget.style.background = "transparent"),
          (e.currentTarget.style.color = "#334155");
      }}
    >
      {label}
    </button>
  );
}