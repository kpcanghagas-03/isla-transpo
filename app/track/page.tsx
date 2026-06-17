"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TrackPage() {
  const [code, setCode] = useState("");
  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const searchRequest = async () => {
    if (!code) {
      alert("Please enter request code");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("transport_requests")
      .select("*")
      .eq("request_code", code)
      .maybeSingle();

    setLoading(false);

    if (error) {
      console.log(error);
      alert("Error fetching request");
      setRequest(null);
      return;
    }

    if (!data) {
      setRequest(null);
      return;
    }

    setRequest(data);
  };

  return (
    <main style={pageStyle}>
      {/* Background accents */}
      <div style={leftAccent} />
      <div style={rightAccent} />

      <div style={card}>
        <h1 style={title}>ISLA-TRANSPO</h1>
        <p style={subtitle}>Track your transportation request in real time</p>

        <input
          placeholder="Enter Request Code (ISLA-XXXXXX)"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={inputStyle}
        />

        <button onClick={searchRequest} disabled={loading} style={buttonStyle}>
          {loading ? "Searching..." : "Track Request"}
        </button>

        {request && (
          <div style={resultBox}>
            <h3 style={{ marginBottom: 10, color: "#0B3D91" }}>
              Request Details
            </h3>

            <Info label="Name" value={request.requester_name} />
            <Info label="Status" value={request.status} highlight />
            <Info label="Pickup" value={request.pickup_location} />
            <Info label="Destination" value={request.destination} />
            <Info
              label="Schedule"
              value={`${request.pick_up_date || ""} ${request.pick_up_time || ""}`}
            />
          </div>
        )}

        {request === null && !loading && (
          <p style={{ marginTop: 20, color: "#64748b", fontSize: 13 }}>
            No request found
          </p>
        )}
      </div>
    </main>
  );
}

/* ===== UI COMPONENT ===== */
function Info({
  label,
  value,
  highlight,
}: {
  label: string;
  value: any;
  highlight?: boolean;
}) {
  return (
    <div style={infoRow}>
      <span style={infoLabel}>{label}</span>
      <span
        style={{
          ...infoValue,
          color: highlight ? "#0B3D91" : "#111827",
          fontWeight: highlight ? 700 : 500,
        }}
      >
        {value || "N/A"}
      </span>
    </div>
  );
}

/* ===== STYLES ===== */

const pageStyle = {
  minHeight: "100vh",
  padding: "30px 16px",
  fontFamily: "Segoe UI, sans-serif",
  background:
    "linear-gradient(180deg, #FFF7ED 0%, #FFE7D1 40%, #FFFFFF 100%)",
  position: "relative" as const,
};

const leftAccent = {
  position: "fixed" as const,
  left: 0,
  top: 0,
  width: 120,
  height: "100%",
  background: "linear-gradient(180deg,#F27A35,#A61E22,#1F5AA6)",
  opacity: 0.08,
  clipPath: "polygon(0 0,100% 0,70% 50%,100% 100%,0 100%)",
};

const rightAccent = {
  position: "fixed" as const,
  right: 0,
  top: 0,
  width: 120,
  height: "100%",
  background: "linear-gradient(180deg,#1F5AA6,#F27A35,#A61E22)",
  opacity: 0.08,
  clipPath: "polygon(30% 0,100% 0,100% 100%,0 100%,30% 50%)",
};

const card = {
  maxWidth: 520,
  margin: "0 auto",
  background: "rgba(255,255,255,0.95)",
  padding: 25,
  borderRadius: 16,
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  backdropFilter: "blur(8px)",
};

const title = {
  color: "#0B3D91",
  fontSize: 28,
  fontWeight: 900,
  marginBottom: 5,
};

const subtitle = {
  color: "#475569",
  fontSize: 13,
  marginBottom: 20,
};

const inputStyle = {
  width: "100%",
  padding: 12,
  borderRadius: 10,
  border: "1px solid #cbd5e1",
  marginBottom: 10,
  fontSize: 14,
};

const buttonStyle = {
  width: "100%",
  padding: 12,
  borderRadius: 10,
  border: "none",
  background: "linear-gradient(135deg, #0B3D91, #2563EB)",
  color: "white",
  fontWeight: 700,
  cursor: "pointer",
};

const resultBox = {
  marginTop: 20,
  padding: 15,
  borderRadius: 12,
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
};

const infoRow = {
  display: "flex",
  justifyContent: "space-between",
  padding: "6px 0",
  borderBottom: "1px dashed #e2e8f0",
};

const infoLabel = {
  fontSize: 12,
  color: "#64748b",
  fontWeight: 600,
};

const infoValue = {
  fontSize: 13,
  textAlign: "right" as const,
};