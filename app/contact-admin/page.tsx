"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ContactAdminPage() {
  const [requestCode, setRequestCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!requestCode || !message) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("admin_messages").insert([
      {
        request_code: requestCode,
        sender: "requester",
        message: message,
      },
    ]);

    setLoading(false);

    if (error) {
      console.log(error);
      alert("Failed to send message");
      return;
    }

    alert("Message sent successfully");

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
    </div>
  );
}