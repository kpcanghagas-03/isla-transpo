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
  <div className="min-h-screen bg-slate-50 dark:bg-slate-900 px-4 py-10 flex justify-center">
    
    <div className="w-full max-w-2xl">

      {/* PAGE HEADER (SYSTEM STYLE) */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">
          Contact Admin
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          ISLA-Transpo Support System — submit concerns regarding your transport request.
        </p>
      </div>

      {/* CARD */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">

        {/* REQUEST CODE */}
        <div>
          <label className="text-xs font-medium text-muted-foreground">
            REQUEST CODE
          </label>

          <input
            placeholder="ISLA-123456"
            value={requestCode}
            onChange={(e) => setRequestCode(e.target.value)}
            className="w-full mt-2 px-3 py-2 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700
                       focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* MESSAGE */}
        <div>
          <label className="text-xs font-medium text-muted-foreground">
            MESSAGE
          </label>

          <textarea
            placeholder="Describe your concern (cancellation, delay, vehicle issue, etc.)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full mt-2 h-36 px-3 py-2 rounded-lg border border-border bg-background text-foreground
                       resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* ACTION BUTTON */}
        <button
          onClick={sendMessage}
          disabled={loading}
          className="w-full py-2.5 rounded-lg font-medium transition
                     bg-blue-600 hover:bg-blue-700 text-white hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Sending request..." : "Send to Admin"}
        </button>

        {/* STATUS BAR (SYSTEM FEEDBACK STYLE) */}
        {status && (
          <div className="text-center">
            <span
              className={`text-sm px-3 py-1 rounded-full border ${
                status.includes("success")
                  ? "text-green-600 border-green-200 bg-green-50"
                  : status.includes("Failed")
                  ? "text-red-600 border-red-200 bg-red-50"
                  : "text-muted-foreground border-border bg-muted/20"
              }`}
            >
              {status}
            </span>
          </div>
        )}
      </div>

      {/* FOOTER NOTE (SYSTEM FEEL) */}
      <p className="text-xs text-muted-foreground text-center mt-6">
        All messages are logged under your request code for tracking and support.
      </p>

    </div>
  </div>
);
}