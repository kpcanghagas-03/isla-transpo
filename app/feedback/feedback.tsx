"use client";

import { useState } from "react";

export default function FeedbackPage() {
  const [driverRating, setDriverRating] = useState(0);
  const [serviceRating, setServiceRating] = useState(0);
  const [emojiRating, setEmojiRating] = useState("");
  const [feedback, setFeedback] = useState("");

  const submitFeedback = () => {
    alert("Thank you for your feedback!");
    setDriverRating(0);
    setServiceRating(0);
    setEmojiRating("");
    setFeedback("");
  };

  const pageStyle = {
    minHeight: "100vh",
    backgroundImage: "url('/camiguin.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    fontFamily: "Segoe UI, sans-serif",
  };

  const cardStyle = {
    background: "rgba(255,255,255,0.94)",
    backdropFilter: "blur(8px)",
    padding: 35,
    borderRadius: 24,
    maxWidth: 700,
    width: "100%",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
  };

  const sectionTitle = {
    color: "#0B3D91",
    marginBottom: 10,
    marginTop: 25,
    fontSize: 18,
    fontWeight: "bold",
  };

  const starStyle = (active: boolean) => ({
    fontSize: 38,
    cursor: "pointer",
    marginRight: 5,
    transition: "0.2s",
    color: active ? "#FACC15" : "#CBD5E1",
  });

  const emojiStyle = (selected: boolean) => ({
    fontSize: 38,
    cursor: "pointer",
    padding: 10,
    borderRadius: "50%",
    background: selected ? "#DBEAFE" : "transparent",
    transition: "0.2s",
  });

  return (
    <main style={pageStyle}>
      <div style={cardStyle}>
        <h1
          style={{
            color: "#0B3D91",
            textAlign: "center",
            fontSize: 36,
            marginBottom: 10,
          }}
        >
          Feedback & Suggestions
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#475569",
            marginBottom: 25,
          }}
        >
          Help us improve the RSTW Transportation Management System
          by sharing your experience.
        </p>

        {/* DRIVER RATING */}
        <div>
          <div style={sectionTitle}>
            Driver Performance Rating
          </div>

          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setDriverRating(star)}
              style={starStyle(star <= driverRating)}
            >
              ★
            </span>
          ))}
        </div>

        {/* SERVICE RATING */}
        <div>
          <div style={sectionTitle}>
            Transportation Management Rating
          </div>

          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setServiceRating(star)}
              style={starStyle(star <= serviceRating)}
            >
              ★
            </span>
          ))}
        </div>

        {/* EXPERIENCE EMOJI */}
        <div>
          <div style={sectionTitle}>
            Overall Experience
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 10,
              flexWrap: "wrap",
            }}
          >
            {[
              { emoji: "😡", label: "Very Bad" },
              { emoji: "😕", label: "Bad" },
              { emoji: "😐", label: "Okay" },
              { emoji: "😊", label: "Good" },
              { emoji: "😍", label: "Excellent" },
            ].map((item) => (
              <div
                key={item.label}
                onClick={() => setEmojiRating(item.label)}
                style={{
                  textAlign: "center",
                }}
              >
                <div
                  style={emojiStyle(
                    emojiRating === item.label
                  )}
                >
                  {item.emoji}
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: "#475569",
                    marginTop: 5,
                  }}
                >
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COMMENTS */}
        <div>
          <div style={sectionTitle}>
            Comments & Suggestions
          </div>

          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Share your experience, suggestions, or concerns..."
            style={{
              width: "100%",
              height: 140,
              padding: 15,
              borderRadius: 14,
              border: "1px solid #CBD5E1",
              marginTop: 10,
              resize: "none",
              fontSize: 15,
              outline: "none",
            }}
          />
        </div>

        {/* SUBMIT BUTTON */}
        <button
          onClick={submitFeedback}
          style={{
            width: "100%",
            marginTop: 30,
            padding: 15,
            border: "none",
            borderRadius: 14,
            background:
              "linear-gradient(135deg, #0B3D91, #2563EB)",
            color: "white",
            fontSize: 16,
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 5px 15px rgba(37,99,235,0.3)",
          }}
        >
          Submit Feedback
        </button>
      </div>
    </main>
  );
}