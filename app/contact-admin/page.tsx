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
  <main style={pageStyle}>
    {/* Background accents (same as Track page) */}
    <div style={leftAccent} />
    <div style={rightAccent} />

    <div style={card}>
      <h1 style={title}>ISLA-TRANSPO</h1>
      <p style={subtitle}>
        Contact admin regarding your transport request
      </p>

      {/* REQUEST CODE */}
      <input
        placeholder="Enter Request Code (ISLA-XXXXXX)"
        value={requestCode}
        onChange={(e) => setRequestCode(e.target.value)}
        style={inputStyle}
      />

      {/* MESSAGE */}
      <textarea
        placeholder="Write your concern (cancellation, change schedule, issue, etc.)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{
          ...inputStyle,
          height: 120,
          resize: "none",
        }}
      />

      {/* BUTTON */}
      <button
        onClick={sendMessage}
        disabled={loading}
        style={{
          ...buttonStyle,
          background: "linear-gradient(135deg, #F27A35, #0B3D91)",
          marginTop: 5,
        }}
      >
        {loading ? "Sending..." : "Send to Admin"}
      </button>

      {/* STATUS */}
      {status && (
        <p
          style={{
            marginTop: 15,
            textAlign: "center",
            fontSize: 13,
            color:
              status.includes("success")
                ? "#16a34a"
                : status.includes("Failed")
                ? "#dc2626"
                : "#64748b",
            fontWeight: 600,
          }}
        >
          {status}
        </p>
      )}
    </div>
  </main>
);
}