"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

// Keep this type identical in shape to the one used in the admin page —
// both pages read/write the same admin_messages table.
type MessageType = {
  id: string;
  request_id: string;
  request_code: string;
  sender: "requester" | "admin";
  sender_name: string | null;
  subject: string | null;
  message: string;
  created_at: string;
  status: string;
  read_by_admin: boolean;
};

const PH_TIME_ZONE = "Asia/Manila";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-PH", {
    timeZone: PH_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ContactPage() {
  const [step, setStep] = useState<"enter-code" | "choose-type" | "chat">("enter-code");
  const [inputCode, setInputCode] = useState("");
  const [inputName, setInputName] = useState("");
  const [activeCode, setActiveCode] = useState("");
  const [senderName, setSenderName] = useState("");
  const [messageType, setMessageType] = useState<"concern" | "cancel" | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [restoring, setRestoring] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [requestId, setRequestId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const hasRestored = useRef(false);

  // RESTORE ON PAGE LOAD — now also re-fetches the actual conversation,
  // not just the localStorage breadcrumbs. This is what fixes the
  // "conversation disappears on refresh" bug.
  useEffect(() => {
    const restore = async () => {
      const savedCode = localStorage.getItem("activeCode");
      const savedStep = localStorage.getItem("step") as typeof step | null;
      const savedId = localStorage.getItem("requestId");
      const savedType = localStorage.getItem("messageType") as typeof messageType | null;
      const savedName = localStorage.getItem("contactName");

      if (savedName) {
        setSenderName(savedName);
        setInputName(savedName);
      }

      if (savedCode) {
        setActiveCode(savedCode);
        if (savedId) setRequestId(savedId);
        if (savedType) setMessageType(savedType);

        const { data: msgs, error: fetchErr } = await supabase
          .from("admin_messages")
          .select("*")
          .eq("request_code", savedCode)
          .order("created_at", { ascending: true });

        if (!fetchErr) {
          setMessages(msgs || []);
          if (savedStep) setStep(savedStep);
        } else {
          // Couldn't restore the thread — fall back to asking for the code again.
          localStorage.removeItem("activeCode");
          localStorage.removeItem("step");
          localStorage.removeItem("requestId");
          localStorage.removeItem("messageType");
        }
      }

      hasRestored.current = true;
      setRestoring(false);
    };

    restore();
  }, []);

  // REALTIME SUBSCRIPTION — fires once activeCode is set, whether that's
  // from a fresh code entry or from the restore above.
  useEffect(() => {
    if (!activeCode) return;

    const channel = supabase
      .channel("contact_realtime_" + activeCode)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "admin_messages",
          filter: `request_code=eq.${activeCode}`,
        },
        (payload) => {
          const msg = payload.new as MessageType;
          const old = payload.old as MessageType;

          setMessages((prev) => {
            if (payload.eventType === "DELETE") {
              return prev.filter((m) => m.id !== old.id);
            }
            if (payload.eventType === "UPDATE") {
              return prev.map((m) => (m.id === msg.id ? msg : m));
            }
            // Avoid duplicating our own optimistic message once the real row arrives
            if (prev.some((m) => m.id === msg.id)) return prev;
            return [...prev, msg];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeCode]);

  // SAVE STEP
  useEffect(() => {
    if (!hasRestored.current) return;
    localStorage.setItem("step", step);
  }, [step]);

  // SAVE ACTIVE CODE
  useEffect(() => {
    if (!hasRestored.current || !activeCode) return;
    localStorage.setItem("activeCode", activeCode);
  }, [activeCode]);

  // SAVE REQUEST ID
  useEffect(() => {
    if (!hasRestored.current || !requestId) return;
    localStorage.setItem("requestId", requestId);
  }, [requestId]);

  // SAVE MESSAGE TYPE
  useEffect(() => {
    if (!hasRestored.current || !messageType) return;
    localStorage.setItem("messageType", messageType);
  }, [messageType]);

  // SAVE NAME
  useEffect(() => {
    if (!hasRestored.current || !senderName) return;
    localStorage.setItem("contactName", senderName);
  }, [senderName]);

  // SCROLL TO BOTTOM ON NEW MESSAGES
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const verifyCode = async () => {
    const code = inputCode.trim().toUpperCase();
    const name = inputName.trim();

    if (!name) {
      setError("Please enter your name.");
      return;
    }
    if (!code) {
      setError("Please enter your request code.");
      return;
    }

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
    setSenderName(name);
    setMessages(msgs || []);
    setStep("choose-type");
  };

  const startChat = (type: "concern" | "cancel") => {
    setMessageType(type);
    setStep("chat");
  };

  const sendMessage = async () => {
    if (!message.trim()) {
      setError("Please write a message first.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    const tempId = crypto.randomUUID();
    const tempMessage: MessageType = {
      id: tempId,
      request_id: requestId || "",
      request_code: activeCode,
      sender: "requester",
      sender_name: senderName,
      subject: messageType === "cancel" ? "Cancel Request" : "Concern",
      message: message.trim(),
      created_at: new Date().toISOString(),
      status: "open",
      read_by_admin: false,
    };

    setMessages((prev) => [...prev, tempMessage]);
    const draft = message.trim();
    setMessage("");

    const { error: err } = await supabase.from("admin_messages").insert([
      {
        id: tempId,
        request_id: requestId,
        request_code: activeCode,
        sender: "requester",
        sender_name: senderName,
        subject: messageType === "cancel" ? "Cancel Request" : "Concern",
        message: draft,
        status: "open",
        read_by_admin: false,
      },
    ]);

    setLoading(false);

    if (err) {
      setError("Failed to send. Please try again.");
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      setMessage(draft);
      return;
    }

    setSuccess("Sent!");
    setTimeout(() => setSuccess(""), 2000);
  };

  const changeCode = () => {
    setStep("enter-code");
    setInputCode("");
    setActiveCode("");
    setMessages([]);
    localStorage.removeItem("activeCode");
    localStorage.removeItem("step");
    localStorage.removeItem("requestId");
    localStorage.removeItem("messageType");
  };

  if (restoring) {
    return (
      <main className="ct-page">
        <style>{CSS}</style>
        <div className="ct-card">
          <div className="ct-section" style={{ textAlign: "center", color: "#94A3B8", fontSize: 13 }}>
            Loading your conversation…
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="ct-page">
      <style>{CSS}</style>

      <div className="ct-side ct-side-left" />
      <div className="ct-side ct-side-right" />

      <div className="ct-card">
        {/* Header */}
        <div className="ct-header">
          <div className="ct-logo-row">
            <div className="ct-logo-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <span className="ct-logo-text">ISLA-TRANSPO</span>
          </div>
          <p className="ct-tagline">Passenger Support</p>
        </div>

        {/* Step 1: Enter Name + Code */}
        {step === "enter-code" && (
          <div className="ct-section">
            <p className="ct-label">Enter your name and request code to view or continue a conversation with our team.</p>

            <label className="ct-field-label">Your name</label>
            <input
              className="ct-input ct-input-name"
              placeholder="e.g. Juan Dela Cruz"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && verifyCode()}
            />

            <label className="ct-field-label">Request code</label>
            <input
              className="ct-input"
              placeholder="e.g. ISLA-7530407"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && verifyCode()}
            />

            {error && <p className="ct-error">{error}</p>}
            <button className="ct-btn-primary" onClick={verifyCode} disabled={verifying}>
              {verifying ? "Verifying…" : "Continue →"}
            </button>
          </div>
        )}

        {/* Step 2: Choose type */}
        {step === "choose-type" && (
          <div className="ct-section">
            <div className="ct-code-tag">
              <span className="ct-code-tag-text">{senderName} · {activeCode}</span>
              <button className="ct-change-link" onClick={changeCode}>
                Change
              </button>
            </div>

            <p className="ct-label">What do you need help with?</p>

            <div className="ct-choice-grid">
              <button className="ct-choice-card" onClick={() => startChat("concern")}>
                <div className="ct-choice-icon" style={{ background: "#EBF3FF" }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1D4ED8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <span className="ct-choice-title">Submit a concern</span>
                <span className="ct-choice-desc">Questions, issues, or feedback about your request</span>
              </button>

              <button className="ct-choice-card ct-choice-card-danger" onClick={() => startChat("cancel")}>
                <div className="ct-choice-icon" style={{ background: "#FEF2F2" }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                </div>
                <span className="ct-choice-title">Cancel my request</span>
                <span className="ct-choice-desc">Ask admin to cancel your transport booking</span>
              </button>
            </div>

            {messages.length > 0 && (
              <button className="ct-btn-secondary" onClick={() => setStep("chat")}>
                View existing conversation ({messages.length})
              </button>
            )}
          </div>
        )}

        {/* Step 3: Chat */}
        {step === "chat" && (
          <div className="ct-section">
            <div className="ct-chat-header">
              <button className="ct-back-btn" onClick={() => setStep("choose-type")}>
                ← Back
              </button>
              <div className="ct-code-tag ct-code-tag-compact">
                <span className="ct-code-tag-text">{activeCode}</span>
              </div>
              {messageType && (
                <span
                  className="ct-type-badge"
                  style={{
                    background: messageType === "cancel" ? "#FEF2F2" : "#EBF3FF",
                    color: messageType === "cancel" ? "#DC2626" : "#1D4ED8",
                    border: `1px solid ${messageType === "cancel" ? "#FCA5A5" : "#BFDBFE"}`,
                  }}
                >
                  {messageType === "cancel" ? "Cancel Request" : "Concern"}
                </span>
              )}
            </div>

            {/* Thread */}
            <div className="ct-thread">
              {messages.length === 0 ? (
                <div className="ct-empty-thread">
                  <p>No messages yet. Send your first message below.</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="ct-msg-row"
                    style={{ alignItems: msg.sender === "requester" ? "flex-end" : "flex-start" }}
                  >
                    <span className="ct-msg-meta">
                      {msg.sender === "requester" ? "You" : "Admin"} · {formatTime(msg.created_at)}
                    </span>
                    <div
                      className="ct-msg-bubble"
                      style={{
                        borderRadius: msg.sender === "requester" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                        background: msg.sender === "requester" ? "#1D4ED8" : "#F1F5F9",
                        color: msg.sender === "requester" ? "white" : "#0F172A",
                      }}
                    >
                      {msg.message}
                    </div>
                  </div>
                ))
              )}
              <div ref={bottomRef} />
            </div>

            {/* Compose */}
            <div className="ct-compose">
              <textarea
                className="ct-compose-input"
                placeholder={
                  messageType === "cancel"
                    ? "Explain why you'd like to cancel…"
                    : "Describe your concern in detail…"
                }
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
              />
              {error && <p className="ct-error">{error}</p>}
              <div className="ct-compose-row">
                {success && <span className="ct-success">{success}</span>}
                {!success && <span style={{ flex: 1 }} />}
                <button
                  className="ct-send-btn"
                  style={{ background: messageType === "cancel" ? "#DC2626" : "#1D4ED8" }}
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

const CSS = `
  .ct-page {
    min-height: 100vh;
    background: linear-gradient(160deg, #FFF7ED 0%, #FFF 60%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 16px;
    font-family: 'Segoe UI', system-ui, sans-serif;
    position: relative;
    box-sizing: border-box;
  }
  .ct-side {
    position: fixed;
    top: 0;
    width: 100px;
    height: 100%;
    opacity: 0.07;
    pointer-events: none;
  }
  .ct-side-left {
    left: 0;
    background: linear-gradient(180deg,#F27A35,#A61E22,#1F5AA6);
    clip-path: polygon(0 0,100% 0,65% 50%,100% 100%,0 100%);
  }
  .ct-side-right {
    right: 0;
    background: linear-gradient(180deg,#1F5AA6,#F27A35,#A61E22);
    clip-path: polygon(35% 0,100% 0,100% 100%,0 100%,35% 50%);
  }
  .ct-card {
    width: 100%;
    max-width: 480px;
    background: white;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.12);
    overflow: hidden;
  }
  .ct-header {
    background: linear-gradient(135deg, #0B3D91 0%, #1D4ED8 100%);
    padding: clamp(18px, 5vw, 24px) clamp(18px, 6vw, 28px) 20px;
  }
  .ct-logo-row { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; }
  .ct-logo-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: rgba(255,255,255,0.15);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .ct-logo-text { color: white; font-size: clamp(18px, 5vw, 22px); font-weight: 800; letter-spacing: 0.5px; }
  .ct-tagline { color: rgba(255,255,255,0.65); font-size: 13px; margin: 0; }
  .ct-section { padding: clamp(18px, 5vw, 24px) clamp(18px, 6vw, 28px); }
  .ct-label { font-size: 14px; color: #475569; margin: 0 0 14px; line-height: 1.5; }
  .ct-field-label { display: block; font-size: 12px; font-weight: 600; color: #64748B; margin-bottom: 6px; }
  .ct-input {
    width: 100%;
    padding: 13px 16px;
    border-radius: 12px;
    border: 1.5px solid #CBD5E1;
    font-size: 16px;
    color: #0F172A;
    outline: none;
    box-sizing: border-box;
    margin-bottom: 14px;
    font-weight: 600;
  }
  .ct-input-name { letter-spacing: normal; text-transform: none; }
  .ct-input:not(.ct-input-name) { letter-spacing: 1px; }
  .ct-input:focus { border-color: #1D4ED8; }
  .ct-btn-primary {
    width: 100%; padding: 13px; border-radius: 12px; border: none;
    background: #1D4ED8; color: white; font-size: 15px; font-weight: 700;
    cursor: pointer; margin-top: 4px;
  }
  .ct-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
  .ct-btn-secondary {
    width: 100%; padding: 11px; border-radius: 12px; border: 1.5px solid #CBD5E1;
    background: white; color: #1D4ED8; font-size: 14px; font-weight: 600;
    cursor: pointer; margin-top: 16px;
  }
  .ct-code-tag {
    display: inline-flex; align-items: center; gap: 8px; max-width: 100%;
    background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 8px;
    padding: 5px 12px; margin-bottom: 18px;
  }
  .ct-code-tag-compact { margin-bottom: 0; }
  .ct-code-tag-text {
    font-size: 13px; font-weight: 700; color: #1D4ED8; letter-spacing: 0.5px;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .ct-change-link {
    font-size: 12px; color: #64748B; background: none; border: none;
    cursor: pointer; text-decoration: underline; padding: 0; flex-shrink: 0;
  }
  .ct-choice-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .ct-choice-card {
    display: flex; flex-direction: column; align-items: flex-start; gap: 8px;
    padding: 16px 14px; border-radius: 14px; border: 1.5px solid #E2E8F0;
    background: white; cursor: pointer; text-align: left; transition: border-color 0.15s;
  }
  .ct-choice-card:hover { border-color: #93C5FD; }
  .ct-choice-card-danger { border-color: #FCA5A5; }
  .ct-choice-card-danger:hover { border-color: #FCA5A5; }
  .ct-choice-icon {
    width: 44px; height: 44px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
  }
  .ct-choice-title { font-size: 14px; font-weight: 700; color: #0F172A; }
  .ct-choice-desc { font-size: 12px; color: #64748B; line-height: 1.4; }
  .ct-chat-header { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; }
  .ct-back-btn {
    font-size: 13px; color: #64748B; background: none; border: none;
    cursor: pointer; padding: 0; margin-right: 4px;
  }
  .ct-type-badge {
    font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 20px;
    margin-left: auto; white-space: nowrap;
  }
  .ct-thread {
    border: 1px solid #E2E8F0; border-radius: 14px; padding: 14px;
    height: clamp(200px, 40vh, 320px); overflow-y: auto;
    background: #F8FAFC; margin-bottom: 12px;
  }
  .ct-empty-thread {
    display: flex; align-items: center; justify-content: center; height: 100%;
  }
  .ct-empty-thread p { color: #94A3B8; font-size: 13px; text-align: center; margin: 0; }
  .ct-msg-row { display: flex; flex-direction: column; margin-bottom: 12px; }
  .ct-msg-meta { font-size: 11px; color: #94A3B8; margin-bottom: 3px; padding: 0 4px; }
  .ct-msg-bubble { max-width: 78%; padding: 10px 14px; font-size: 14px; line-height: 1.5; word-break: break-word; }
  .ct-compose { border-top: 1px solid #E2E8F0; padding-top: 14px; }
  .ct-compose-input {
    width: 100%; padding: 12px 14px; border-radius: 12px; border: 1.5px solid #CBD5E1;
    font-size: 16px; color: #0F172A; outline: none; resize: none;
    box-sizing: border-box; line-height: 1.5; font-family: inherit;
  }
  .ct-compose-input:focus { border-color: #1D4ED8; }
  .ct-compose-row { display: flex; align-items: center; gap: 10px; margin-top: 8px; flex-wrap: wrap; }
  .ct-success { font-size: 13px; color: #16A34A; flex: 1; }
  .ct-send-btn {
    padding: 10px 20px; border-radius: 10px; border: none; color: white;
    font-size: 14px; font-weight: 700; cursor: pointer;
  }
  .ct-send-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .ct-error { font-size: 12px; color: #DC2626; margin: 4px 0 0; }

  /* ── Tablet ── */
  @media (max-width: 880px) {
    .ct-side { width: 60px; }
  }

  /* ── Phone: hide the decorative side panels so they never overlap content ── */
  @media (max-width: 640px) {
    .ct-page { padding: 0; align-items: stretch; }
    .ct-side { display: none; }
    .ct-card {
      max-width: 100%;
      width: 100%;
      min-height: 100vh;
      border-radius: 0;
      box-shadow: none;
    }
    .ct-choice-grid { grid-template-columns: 1fr; }
    .ct-msg-bubble { max-width: 88%; }
  }

  @media (max-width: 360px) {
    .ct-logo-text { font-size: 17px; }
  }
`;