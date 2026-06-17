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
  <div className="min-h-screen flex items-center justify-center bg-background px-4">
    <div className="w-full max-w-lg bg-card text-foreground border border-border shadow-xl rounded-2xl p-6">
      
      {/* HEADER */}
      <h2 className="text-2xl font-semibold tracking-tight">
        Contact Admin
      </h2>

      <p className="text-sm text-muted-foreground mt-1 mb-6">
        Send concerns regarding your transport request (cancellation, changes, or issues).
      </p>

      {/* REQUEST CODE */}
      <label className="text-xs font-medium text-muted-foreground">
        Request Code
      </label>
      <input
        placeholder="e.g. ISLA-123456"
        value={requestCode}
        onChange={(e) => setRequestCode(e.target.value)}
        className="w-full mt-2 mb-4 px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
      />

      {/* MESSAGE */}
      <label className="text-xs font-medium text-muted-foreground">
        Message
      </label>
      <textarea
        placeholder="Write your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full mt-2 h-32 px-3 py-2 rounded-lg border border-border bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
      />

      {/* BUTTON */}
      <button
        onClick={sendMessage}
        disabled={loading}
        className="w-full mt-5 py-2 rounded-lg font-medium transition bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send Message"}
      </button>

      {/* STATUS */}
      {status && (
        <p className="text-sm text-center mt-4 text-muted-foreground">
          {status}
        </p>
      )}
    </div>
  </div>
);
}