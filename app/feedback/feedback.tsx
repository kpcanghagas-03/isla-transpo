"use client";

import { useState } from "react";

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState("");

  const submitFeedback = () => {
    alert("Feedback submitted!");
    setFeedback("");
  };

  return (
    <main style={{ padding: 30, fontFamily: "Arial" }}>
      <h1>Feedback & Suggestions</h1>

      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Enter your feedback here..."
        style={{
          width: "100%",
          height: 150,
          padding: 10,
          borderRadius: 10,
          marginTop: 20,
        }}
      />

      <button
        onClick={submitFeedback}
        style={{
          marginTop: 20,
          padding: 12,
          border: "none",
          borderRadius: 10,
          background: "#0B3D91",
          color: "white",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Submit Feedback
      </button>
    </main>
  );
}