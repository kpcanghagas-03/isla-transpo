"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

type MessageType = {
  id: string;
  request_code: string;
  sender: "requester" | "admin";
  message: string;
  created_at: string;
  status: string;
};

export default function ContactPage() {
  const [step, setStep] = useState<"enter-code" | "choose-type" | "chat">("enter-code");
  const [inputCode, setInputCode] = useState("");
  const [activeCode, setActiveCode] = useState("");
  const [messageType, setMessageType] = useState<"concern" | "cancel" | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [requestId, setRequestId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
  if (!activeCode) return;

  const channel = supabase
    .channel("contact_realtime_" + activeCode)
    .on(
      "postgres_changes",
      {
        event: "*", // 👈 IMPORTANT CHANGE
        schema: "public",
        table: "admin_messages",
        filter: `request_code=eq.${activeCode}`,
      },
      (payload) => {
        const msg = payload.new as MessageType;
        const old = payload.old as MessageType;

        setMessages((prev) => {
          // DELETE
          if (payload.eventType === "DELETE") {
            return prev.filter((m) => m.id !== old.id);
          }

          // UPDATE
          if (payload.eventType === "UPDATE") {
            return prev.map((m) => (m.id === msg.id ? msg : m));
          }

          // INSERT
          return [...prev, msg];
        });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [activeCode]);

  const verifyCode = async () => {
    const code = inputCode.trim().toUpperCase();
    if (!code) { setError("Please enter your request code."); return; }
    setVerifying(true);
    setError("");

    const { data, error: err } = await supabase
      .from("transport_requests")
      .select("id")
      .eq("request_code", code)
      .maybeSingle();

    setVerifying(false);

    if (err || !data) {
      setError("Request code not found. Please double-check and try again.");
      return;
    }

    const { data: msgs } = await supabase
      .from("admin_messages")
      .select("*")
      .eq("request_code", code)
      .order("created_at", { ascending: true });

    setRequestId(data.id);
    setActiveCode(code);
    setMessages(msgs || []);
    setStep("choose-type");
  };

  const startChat = (type: "concern" | "cancel") => {
    setMessageType(type);
    setStep("chat");
  };

  const sendMessage = async () => {
    if (!message.trim()) { setError("Please write a message first."); return; }
    setLoading(true);
    setError("");
    setSuccess("");

    const { error: err } = await supabase.from("admin_messages").insert([{
      request_id: requestId,
      request_code: activeCode,
      sender: "requester",
      subject: messageType === "cancel" ? "Cancel Request" : "Concern",
      message: message.trim(),
      status: "open",
    }]);

    setLoading(false);
    if (err) { setError("Failed to send. Please try again."); return; }
    setMessage("");
    setSuccess("Sent!");
    setTimeout(() => setSuccess(""), 2000);
  };

  return (
    <main style={styles.page}>
      <div style={styles.sideLeft} />
      <div style={styles.sideRight} />

      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logoRow}>
            <div style={styles.logoIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <span style={styles.logoText}>ISLA-TRANSPO</span>
          </div>
          <p style={styles.tagline}>Passenger Support</p>
        </div>

        {/* Step 1: Enter Code */}
        {step === "enter-code" && (
          <div style={styles.section}>
            <p style={styles.label}>Enter your request code to view or continue a conversation with our team.</p>
            <input
              style={styles.input}
              placeholder="e.g. ISLA-7530407"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && verifyCode()}
              autoFocus
            />
            {error && <p style={styles.errorText}>{error}</p>}
            <button style={styles.btnPrimary} onClick={verifyCode} disabled={verifying}>
              {verifying ? "Verifying…" : "Continue →"}
            </button>
          </div>
        )}

        {/* Step 2: Choose type */}
        {step === "choose-type" && (
          <div style={styles.section}>
            <div style={styles.codeTag}>
              <span style={styles.codeTagText}>{activeCode}</span>
              <button style={styles.changeLinkBtn} onClick={() => { setStep("enter-code"); setInputCode(""); setActiveCode(""); setMessages([]); }}>
                Change
              </button>
            </div>

            <p style={styles.label}>What do you need help with?</p>

            <div style={styles.choiceGrid}>
              <button style={styles.choiceCard} onClick={() => startChat("concern")}>
                <div style={{ ...styles.choiceIcon, background: "#EBF3FF" }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1D4ED8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <span style={styles.choiceTitle}>Submit a concern</span>
                <span style={styles.choiceDesc}>Questions, issues, or feedback about your request</span>
              </button>

              <button style={{ ...styles.choiceCard, borderColor: "#FCA5A5" }} onClick={() => startChat("cancel")}>
                <div style={{ ...styles.choiceIcon, background: "#FEF2F2" }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                </div>
                <span style={styles.choiceTitle}>Cancel my request</span>
                <span style={styles.choiceDesc}>Ask admin to cancel your transport booking</span>
              </button>
            </div>

            {messages.length > 0 && (
              <button style={styles.btnSecondary} onClick={() => setStep("chat")}>
                View existing conversation ({messages.length})
              </button>
            )}
          </div>
        )}

        {/* Step 3: Chat */}
        {step === "chat" && (
          <div style={styles.section}>
            <div style={styles.chatHeader}>
              <button style={styles.backBtn} onClick={() => setStep("choose-type")}>
                ← Back
              </button>
              <div style={styles.codeTag}>
                <span style={styles.codeTagText}>{activeCode}</span>
              </div>
              {messageType && (
                <span style={{
                  ...styles.typeBadge,
                  background: messageType === "cancel" ? "#FEF2F2" : "#EBF3FF",
                  color: messageType === "cancel" ? "#DC2626" : "#1D4ED8",
                  border: `1px solid ${messageType === "cancel" ? "#FCA5A5" : "#BFDBFE"}`,
                }}>
                  {messageType === "cancel" ? "Cancel Request" : "Concern"}
                </span>
              )}
            </div>

            {/* Thread */}
            <div style={styles.thread}>
              {messages.length === 0 ? (
                <div style={styles.emptyThread}>
                  <p style={{ color: "#94A3B8", fontSize: 13, textAlign: "center" }}>
                    No messages yet. Send your first message below.
                  </p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: msg.sender === "requester" ? "flex-end" : "flex-start",
                    marginBottom: 12,
                  }}>
                    <span style={{
                      fontSize: 11,
                      color: "#94A3B8",
                      marginBottom: 3,
                      paddingLeft: 4,
                      paddingRight: 4,
                    }}>
                      {msg.sender === "requester" ? "You" : "Admin"} · {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <div style={{
                      maxWidth: "78%",
                      padding: "10px 14px",
                      borderRadius: msg.sender === "requester" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                      fontSize: 14,
                      lineHeight: 1.5,
                      background: msg.sender === "requester" ? "#1D4ED8" : "#F1F5F9",
                      color: msg.sender === "requester" ? "white" : "#0F172A",
                    }}>
                      {msg.message}
                    </div>
                  </div>
                ))
              )}
              <div ref={bottomRef} />
            </div>

            {/* Compose */}
            <div style={styles.compose}>
              <textarea
                style={styles.composeInput}
                placeholder={messageType === "cancel"
                  ? "Explain why you'd like to cancel…"
                  : "Describe your concern in detail…"}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
              />
              {error && <p style={styles.errorText}>{error}</p>}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
                {success && <span style={{ fontSize: 13, color: "#16A34A", flex: 1 }}>{success}</span>}
                {!success && <span style={{ flex: 1 }} />}
                <button
                  style={{ ...styles.sendBtn, background: messageType === "cancel" ? "#DC2626" : "#1D4ED8" }}
                  onClick={sendMessage}
                  disabled={loading}
                >
                  {loading ? "Sending…" : "Send message"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(160deg, #FFF7ED 0%, #FFF 60%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px 16px",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    position: "relative",
  },
  sideLeft: {
    position: "fixed", left: 0, top: 0, width: 100, height: "100%",
    background: "linear-gradient(180deg,#F27A35,#A61E22,#1F5AA6)",
    opacity: 0.07,
    clipPath: "polygon(0 0,100% 0,65% 50%,100% 100%,0 100%)",
  },
  sideRight: {
    position: "fixed", right: 0, top: 0, width: 100, height: "100%",
    background: "linear-gradient(180deg,#1F5AA6,#F27A35,#A61E22)",
    opacity: 0.07,
    clipPath: "polygon(35% 0,100% 0,100% 100%,0 100%,35% 50%)",
  },
  card: {
    width: "100%",
    maxWidth: 480,
    background: "white",
    borderRadius: 20,
    boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
    overflow: "hidden",
  },
  header: {
    background: "linear-gradient(135deg, #0B3D91 0%, #1D4ED8 100%)",
    padding: "24px 28px 20px",
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 4,
  },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: "rgba(255,255,255,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    color: "white",
    fontSize: 22,
    fontWeight: 800,
    letterSpacing: 0.5,
  },
  tagline: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 13,
    margin: 0,
  },
  section: {
    padding: "24px 28px",
  },
  label: {
    fontSize: 14,
    color: "#475569",
    marginBottom: 16,
    lineHeight: 1.5,
  },
  input: {
    width: "100%",
    padding: "13px 16px",
    borderRadius: 12,
    border: "1.5px solid #CBD5E1",
    fontSize: 15,
    color: "#0F172A",
    outline: "none",
    boxSizing: "border-box",
    marginBottom: 10,
    letterSpacing: 1,
    fontWeight: 600,
  },
  btnPrimary: {
    width: "100%",
    padding: "13px",
    borderRadius: 12,
    border: "none",
    background: "#1D4ED8",
    color: "white",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    marginTop: 4,
  },
  btnSecondary: {
    width: "100%",
    padding: "11px",
    borderRadius: 12,
    border: "1.5px solid #CBD5E1",
    background: "white",
    color: "#1D4ED8",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    marginTop: 16,
  },
  codeTag: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: "#EFF6FF",
    border: "1px solid #BFDBFE",
    borderRadius: 8,
    padding: "5px 12px",
    marginBottom: 18,
  },
  codeTagText: {
    fontSize: 13,
    fontWeight: 700,
    color: "#1D4ED8",
    letterSpacing: 0.5,
  },
  changeLinkBtn: {
    fontSize: 12,
    color: "#64748B",
    background: "none",
    border: "none",
    cursor: "pointer",
    textDecoration: "underline",
    padding: 0,
  },
  choiceGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },
  choiceCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 8,
    padding: "18px 16px",
    borderRadius: 14,
    border: "1.5px solid #E2E8F0",
    background: "white",
    cursor: "pointer",
    textAlign: "left",
    transition: "border-color 0.15s",
  },
  choiceIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  choiceTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: "#0F172A",
  },
  choiceDesc: {
    fontSize: 12,
    color: "#64748B",
    lineHeight: 1.4,
  },
  chatHeader: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  backBtn: {
    fontSize: 13,
    color: "#64748B",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    marginRight: 4,
  },
  typeBadge: {
    fontSize: 12,
    fontWeight: 600,
    padding: "4px 10px",
    borderRadius: 20,
    marginLeft: "auto",
  },
  thread: {
    border: "1px solid #E2E8F0",
    borderRadius: 14,
    padding: 14,
    minHeight: 200,
    maxHeight: 320,
    overflowY: "auto",
    background: "#F8FAFC",
    marginBottom: 12,
  },
  emptyThread: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 160,
  },
  compose: {
    borderTop: "1px solid #E2E8F0",
    paddingTop: 14,
  },
  composeInput: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: "1.5px solid #CBD5E1",
    fontSize: 14,
    color: "#0F172A",
    outline: "none",
    resize: "none",
    boxSizing: "border-box",
    lineHeight: 1.5,
    fontFamily: "inherit",
  },
  sendBtn: {
    padding: "10px 20px",
    borderRadius: 10,
    border: "none",
    color: "white",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  },
  errorText: {
    fontSize: 12,
    color: "#DC2626",
    margin: "4px 0 0",
  },
};
