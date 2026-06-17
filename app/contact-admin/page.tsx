"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ContactAdminPage() {
  const [requestCode, setRequestCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const sendMessage = async () => {
  if (!requestCode.trim() || !message.trim()) {
    setStatus("Please fill all fields");
    return;
  }

  setLoading(true);
  setStatus("Sending...");

  const { error } = await supabase.from("admin_messages").insert([
    {
      request_code: requestCode.trim(),
      sender: "requester",
      message: message.trim(),
      status: "open",
      created_at: new Date().toISOString(),
    },
  ]);

  setLoading(false);

  if (error) {
    console.log(error);
    setStatus("Failed to send message ❌");
    return;
  }

  setStatus("Message sent successfully ✅");

  setRequestCode("");
  setMessage("");
};

  return (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      background:
        "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
    }}
  >
    <div
      style={{
        width: "100%",
        maxWidth: 520,
        background: "rgba(255, 255, 255, 0.08)",
        backdropFilter: "blur(12px)",
        borderRadius: 16,
        padding: 24,
        boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
        border: "1px solid rgba(255,255,255,0.1)",
        color: "white",
      }}
    >
      {/* HEADER */}
      <h2
        style={{
          fontSize: 22,
          fontWeight: "bold",
          marginBottom: 6,
        }}
      >
        Contact Admin
      </h2>

      <p style={{ fontSize: 13, opacity: 0.7, marginBottom: 20 }}>
        Send a message regarding your transport request (cancellation, issues, or updates).
      </p>

      {/* REQUEST CODE */}
      <label style={{ fontSize: 12, opacity: 0.8 }}>Request Code</label>
      <input
        placeholder="e.g. ISLA-123456"
        value={requestCode}
        onChange={(e) => setRequestCode(e.target.value)}
        style={{
          width: "100%",
          padding: 12,
          marginTop: 6,
          marginBottom: 16,
          borderRadius: 10,
          border: "1px solid rgba(255,255,255,0.15)",
          background: "rgba(255,255,255,0.07)",
          color: "white",
          outline: "none",
        }}
      />

      {/* MESSAGE */}
      <label style={{ fontSize: 12, opacity: 0.8 }}>Message</label>
      <textarea
        placeholder="Write your concern here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{
          width: "100%",
          padding: 12,
          marginTop: 6,
          height: 140,
          borderRadius: 10,
          border: "1px solid rgba(255,255,255,0.15)",
          background: "rgba(255,255,255,0.07)",
          color: "white",
          outline: "none",
          resize: "none",
        }}
      />

      {/* BUTTON */}
      <button
        onClick={sendMessage}
        disabled={loading}
        style={{
          marginTop: 18,
          width: "100%",
          padding: 12,
          borderRadius: 10,
          border: "none",
          fontWeight: "bold",
          cursor: "pointer",
          background: loading
            ? "rgba(59,130,246,0.5)"
            : "linear-gradient(90deg, #3b82f6, #2563eb)",
          color: "white",
          transition: "0.2s",
        }}
      >
        {loading ? "Sending..." : "Send Message"}
      </button>

      {/* STATUS */}
      {status && (
        <p
          style={{
            marginTop: 14,
            fontSize: 13,
            opacity: 0.85,
            textAlign: "center",
          }}
        >
          {status}
        </p>
      )}
    </div>
  </div>
);
}