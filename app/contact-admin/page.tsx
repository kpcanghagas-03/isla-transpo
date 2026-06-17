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
  <div style={{ padding: 20, maxWidth: 500 }}>
    <h2>Contact Admin</h2>

    <input
      placeholder="Request Code (e.g. ISLA-123456)"
      value={requestCode}
      onChange={(e) => setRequestCode(e.target.value)}
      style={{ width: "100%", padding: 10, marginBottom: 10 }}
    />

    <textarea
      placeholder="Your message"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      style={{ width: "100%", padding: 10, height: 120 }}
    />

    <button
      onClick={sendMessage}
      disabled={loading}
      style={{
        marginTop: 10,
        padding: 10,
        width: "100%",
      }}
    >
      {loading ? "Sending..." : "Send Message"}
    </button>

    {status && (
      <p style={{ marginTop: 10, fontSize: 14 }}>
        {status}
      </p>
    )}
  </div>
);
}