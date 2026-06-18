"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

export default function ContactAdminPage() {
  const [requestCode, setRequestCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [messages, setMessages] = useState<any[]>([]);

  const loadMessages = async (code: string) => {
  const { data, error } = await supabase
    .from("admin_messages")
    .select("*")
    .eq("request_code", code)
    .order("created_at", { ascending: true });

  if (error) {
    console.log("LOAD ERROR:", error);
    return;
  }

  setMessages(data || []);
};

useEffect(() => {
  if (!requestCode) return;

  const channel = supabase
    .channel("admin_messages_realtime")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "admin_messages",
        filter: `request_code=eq.${requestCode}`,
      },
      (payload) => {
        setMessages((prev) => [...prev, payload.new]);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [requestCode]);

 const sendMessage = async () => {
  if (!requestCode.trim() || !message.trim()) {
    setStatus("Please fill all fields");
    return;
  }

  setLoading(true);
  setStatus("Sending...");

  // 🔥 STEP 1: get real request ID
  const { data: requestData, error: requestError } = await supabase
    .from("transport_requests")
    .select("id")
    .eq("request_code", requestCode.trim())
    .maybeSingle();

  if (requestError || !requestData) {
    setLoading(false);
    setStatus("Invalid request code ❌");
    return;
  }

  // 🔥 STEP 2: insert message with request_id
  const { error } = await supabase.from("admin_messages").insert([
    {
      request_id: requestData.id,
      request_code: requestCode.trim(),
      sender: "requester",
      subject: null,
      message: message.trim(),
      status: "open",
    },
  ]);

  setLoading(false);

 if (error) {
  console.log("INSERT ERROR:", error);
  setStatus(error.message || "Failed to send message ❌");
  return;
}

  setStatus("Message sent successfully ✅");

  setRequestCode("");
  setMessage("");
};

  return (
    <main style={pageStyle}>
      <div style={leftAccent} />
      <div style={rightAccent} />

      <div style={card}>
        <h1 style={title}>ISLA-TRANSPO</h1>
        <p style={subtitle}>
          Contact admin regarding your transport request
        </p>

        <input
          id="requestCode"
          name="requestCode"
          placeholder="Enter Request Code (ISLA-XXXXXX)"
          value={requestCode}
          onChange={(e) => setRequestCode(e.target.value)}
          style={inputStyle}
        />

        <textarea
          id="message"
          name="message"
          placeholder="Write your concern..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ ...inputStyle, height: 120, resize: "none" }}
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          style={{
            ...buttonStyle,
            background: "linear-gradient(135deg, #F27A35, #0B3D91)",
          }}
        >
          {loading ? "Sending..." : "Send to Admin"}
        </button>

        <div
  style={{
    marginTop: 25,
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    padding: 12,
    height: 300,
    overflowY: "auto",
    background: "#fff",
  }}
>
    <p style={{ marginBottom: 10, fontSize: 12, color: "#64748b" }}>
  Conversation Thread
</p>

{messages.length === 0 ? (
  <p style={{ fontSize: 12, color: "#94a3b8" }}>
    No messages yet. Enter your request code and start chatting.
  </p>
) : (
  messages.map((msg) => (
    <div
      key={msg.id}
      style={{
        display: "flex",
        justifyContent:
          msg.sender === "requester" ? "flex-end" : "flex-start",
        marginBottom: 10,
      }}
    >
      <div
        style={{
          maxWidth: "75%",
          padding: "10px 14px",
          borderRadius: 14,
          fontSize: 14,
          background:
            msg.sender === "requester"
              ? "linear-gradient(135deg, #0B3D91, #2563EB)"
              : "#E2E8F0",
          color: msg.sender === "requester" ? "white" : "#0f172a",
        }}
      >
        {msg.message}
      </div>
    </div>
  ))
)}

        {status && (
          <p style={{ marginTop: 15, textAlign: "center", fontSize: 13 }}>
            {status}
          </p>
        )}
      </div>
      </div>
    </main>
  );
}

/* ================= STYLES (OUTSIDE FUNCTION) ================= */

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
  padding: 14,
  borderRadius: 12,
  border: "2px solid #cbd5e1",
  marginBottom: 12,
  fontSize: 15,
  color: "#0f172a",
  backgroundColor: "#ffffff",
  outline: "none",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
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
