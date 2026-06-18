"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function ContactAdminPage() {
  const [requestCode, setRequestCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [activeCode, setActiveCode] = useState("");

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
    if (!activeCode) return;

    const channel = supabase
      .channel("admin_messages_realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "admin_messages",
          filter: `request_code=eq.${activeCode}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeCode]);

  const sendMessage = async () => {
    // ✅ Use activeCode consistently
    if (!activeCode.trim() || !message.trim()) {
      setStatus("Please fill all fields");
      return;
    }

    setLoading(true);
    setStatus("Sending...");

    const { data: requestData, error: requestError } = await supabase
      .from("transport_requests")
      .select("id")
      .eq("request_code", activeCode.trim()) // ✅ was requestCode, now activeCode
      .maybeSingle();

    if (requestError || !requestData) {
      setLoading(false);
      setStatus("Invalid request code ❌");
      return;
    }

    const { error } = await supabase.from("admin_messages").insert([
      {
        request_id: requestData.id,
        request_code: activeCode.trim(), // ✅ was requestCode, now activeCode
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
    setMessage(""); // ✅ Only clear message, NOT requestCode
  };

  return (
    <main style={pageStyle}>
      <div style={leftAccent} />
      <div style={rightAccent} />

      <div style={card}>
        <h1 style={title}>ISLA-TRANSPO</h1>
        <p style={subtitle}>Contact admin regarding your transport request</p>

        <input
          id="requestCode"
          name="requestCode"
          placeholder="Enter Request Code (ISLA-XXXXXX)"
          value={requestCode}
          onChange={(e) => setRequestCode(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const code = requestCode.trim();
              setActiveCode(code);
              loadMessages(code);
            }
          }}
          style={inputStyle}
        />
        <button
          onClick={() => {
            const code = requestCode.trim();
            setActiveCode(code);
            loadMessages(code);
          }}
          style={buttonStyle}
        >
          Load Conversation
        </button>

        {/* ✅ Status moved here, outside the conversation thread */}
        {status && (
          <p style={{ marginTop: 10, textAlign: "center", fontSize: 13 }}>
            {status}
          </p>
        )}

        <textarea
          id="message"
          name="message"
          placeholder="Write your concern..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ ...inputStyle, height: 120, resize: "none", marginTop: 12 }}
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
          {/* ✅ status block removed from here */}
        </div>
      </div>
    </main>
  );
}