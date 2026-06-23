"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

// Keep this type identical in shape to the one used in the requester-facing
// contact page — both pages read/write the same admin_messages table.
type Msg = {
  id: string;
  request_code: string;
  request_id: string;
  sender: "requester" | "admin";
  sender_name: string | null;
  subject: string | null;
  message: string;
  created_at: string;
  status: string;
  read_by_admin: boolean;
};

type Thread = {
  request_code: string;
  request_id: string;
  subject: string | null;
  senderName: string | null;
  messages: Msg[];
  lastAt: string;
  hasUnread: boolean;
};

const PH_TIME_ZONE = "Asia/Manila";

function buildThreads(msgs: Msg[]): Thread[] {
  const map = new Map<string, Thread>();

  for (const m of msgs) {
    if (!map.has(m.request_code)) {
      map.set(m.request_code, {
        request_code: m.request_code,
        request_id: m.request_id,
        subject: m.subject,
        senderName: null,
        messages: [],
        lastAt: m.created_at,
        hasUnread: false,
      });
    }

    const t = map.get(m.request_code)!;
    t.messages.push(m);

    if (m.created_at > t.lastAt) t.lastAt = m.created_at;
    if (m.subject) t.subject = m.subject;
    // Always prefer the most recent name the requester gave us.
    if (m.sender === "requester" && m.sender_name) t.senderName = m.sender_name;
  }

  for (const t of map.values()) {
    t.messages.sort((a, b) => a.created_at.localeCompare(b.created_at));
    // The dot is on only if there's a requester message the admin hasn't read yet.
    t.hasUnread = t.messages.some((m) => m.sender === "requester" && !m.read_by_admin);
  }

  return Array.from(map.values()).sort((a, b) => b.lastAt.localeCompare(a.lastAt));
}

function timeLabel(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return d.toLocaleDateString("en-PH", { timeZone: PH_TIME_ZONE, month: "short", day: "numeric" });
}

function timeOfDay(iso: string) {
  return new Date(iso).toLocaleTimeString("en-PH", {
    timeZone: PH_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function App() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeCode, setActiveCode] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "open" | "cancel">("all");
  const [confirmDeleteCode, setConfirmDeleteCode] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  // INITIAL LOAD
  useEffect(() => {
    const load = async () => {
      setFetching(true);
      setFetchError(null);

      const { data, error } = await supabase.from("admin_messages").select("*");

      if (error) {
        setFetchError(error.message);
        setFetching(false);
        return;
      }

      setThreads(buildThreads((data as Msg[]) || []));
      setFetching(false);
    };

    load();
  }, []);

  // ================= SEED A DRAFT THREAD FROM THE DASHBOARD =================
  // When the admin clicks "Message Requester" on a request card, they land
  // here with ?code=...&id=...&name=... in the URL. If that request_code
  // doesn't have a thread yet (the requester never wrote in), this creates
  // an empty draft thread locally so the admin can type the first message
  // without the requester needing to contact support first. Nothing is
  // written to the DB until the admin actually hits "Send reply".
  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) return;

    setThreads((prev) => {
      if (prev.some((t) => t.request_code === code)) return prev;

      const draft: Thread = {
        request_code: code,
        request_id: searchParams.get("id") || "",
        subject: "Admin note",
        senderName: searchParams.get("name"),
        messages: [],
        lastAt: new Date().toISOString(),
        hasUnread: false,
      };

      return [draft, ...prev];
    });

    setActiveCode(code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // REALTIME SUBSCRIPTION
  useEffect(() => {
    const channel = supabase
      .channel("admin_all_messages")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "admin_messages" },
        (payload: any) => {
          const eventType = payload.eventType;
          const msg = payload.new as Msg;
          const old = payload.old as Msg;

          setThreads((prev) => {
            if (eventType === "DELETE") {
              return prev
                .map((t) =>
                  t.request_code === old.request_code
                    ? { ...t, messages: t.messages.filter((m) => m.id !== old.id) }
                    : t
                )
                .filter((t) => t.messages.length > 0);
            }

            if (eventType === "INSERT") {
              const exists = prev.some((t) => t.request_code === msg.request_code);

              if (!exists) {
                const newThread: Thread = {
                  request_code: msg.request_code,
                  request_id: msg.request_id,
                  subject: msg.subject,
                  senderName: msg.sender === "requester" ? msg.sender_name : null,
                  messages: [msg],
                  lastAt: msg.created_at,
                  hasUnread: msg.sender === "requester" && !msg.read_by_admin,
                };
                return [newThread, ...prev].sort((a, b) => b.lastAt.localeCompare(a.lastAt));
              }

              return prev
                .map((t) => {
                  if (t.request_code !== msg.request_code) return t;
                  if (t.messages.some((m) => m.id === msg.id)) return t; // avoid dupes
                  const messages = [...t.messages, msg];
                  return {
                    ...t,
                    messages,
                    lastAt: msg.created_at,
                    subject: msg.subject || t.subject,
                    senderName: msg.sender === "requester" && msg.sender_name ? msg.sender_name : t.senderName,
                    hasUnread: messages.some((m) => m.sender === "requester" && !m.read_by_admin),
                  };
                })
                .sort((a, b) => b.lastAt.localeCompare(a.lastAt));
            }

            if (eventType === "UPDATE") {
              return prev.map((t) => {
                if (t.request_code !== msg.request_code) return t;
                const messages = t.messages.map((m) => (m.id === msg.id ? msg : m));
                return {
                  ...t,
                  messages,
                  hasUnread: messages.some((m) => m.sender === "requester" && !m.read_by_admin),
                };
              });
            }

            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeCode, threads]);

  const activeThread = threads.find((t) => t.request_code === activeCode);

  // Mark a thread's requester messages as read the moment the admin opens it.
  const openThread = async (code: string) => {
    setActiveCode(code);

    const thread = threads.find((t) => t.request_code === code);
    if (!thread) return;

    const unreadIds = thread.messages
      .filter((m) => m.sender === "requester" && !m.read_by_admin)
      .map((m) => m.id);

    if (unreadIds.length === 0) return;

    // Optimistic local update so the dot disappears immediately.
    setThreads((prev) =>
      prev.map((t) =>
        t.request_code === code
          ? {
              ...t,
              hasUnread: false,
              messages: t.messages.map((m) =>
                unreadIds.includes(m.id) ? { ...m, read_by_admin: true } : m
              ),
            }
          : t
      )
    );

    const { error } = await supabase
      .from("admin_messages")
      .update({ read_by_admin: true })
      .in("id", unreadIds);

    if (error) {
      console.error("Failed to mark messages read:", error);
    }
  };

  const goBackToList = () => setActiveCode(null);

  const sendReply = async () => {
    if (!reply.trim() || !activeThread) return;
    setLoading(true);

    const tempId = crypto.randomUUID();
    const optimisticMsg: Msg = {
      id: tempId,
      request_code: activeThread.request_code,
      request_id: activeThread.request_id,
      sender: "admin",
      sender_name: "Admin",
      subject: activeThread.subject,
      message: reply.trim(),
      created_at: new Date().toISOString(),
      status: "replied",
      read_by_admin: true,
    };

    setThreads((prev) =>
      prev.map((t) =>
        t.request_code === activeThread.request_code
          ? { ...t, messages: [...t.messages, optimisticMsg], lastAt: optimisticMsg.created_at }
          : t
      )
    );

    const draft = reply.trim();
    setReply("");

    const { error } = await supabase.from("admin_messages").insert([
      {
        id: tempId,
        request_id: activeThread.request_id,
        request_code: activeThread.request_code,
        sender: "admin",
        sender_name: "Admin",
        subject: activeThread.subject,
        message: draft,
        status: "replied",
        read_by_admin: true,
      },
    ]);

    setLoading(false);

    if (error) {
      console.error("Reply error:", error);
      setReply(draft);
      setThreads((prev) =>
        prev.map((t) =>
          t.request_code === activeThread.request_code
            ? { ...t, messages: t.messages.filter((m) => m.id !== tempId) }
            : t
        )
      );
    }
  };

  // Deletes every message in a thread (the whole conversation for that request_code).
  const deleteThread = async (code: string) => {
    setDeleting(true);

    // Optimistic removal from the UI first.
    const snapshot = threads;
    setThreads((prev) => prev.filter((t) => t.request_code !== code));
    if (activeCode === code) setActiveCode(null);

    const { error } = await supabase.from("admin_messages").delete().eq("request_code", code);

    setDeleting(false);
    setConfirmDeleteCode(null);

    if (error) {
      console.error("Failed to delete thread:", error);
      // Roll back if it failed on the server.
      setThreads(snapshot);
      alert("Couldn't delete this conversation: " + error.message);
    }
  };

  const filteredThreads = threads.filter((t) => {
    if (filter === "cancel") return t.subject?.toLowerCase().includes("cancel");
    if (filter === "open") return t.hasUnread;
    return true;
  });

  return (
    <div className={`adm-shell ${activeCode ? "adm-has-active" : ""}`}>
      <style>{CSS}</style>

      {/* Sidebar / thread list */}
      <aside className="adm-sidebar">
        <div className="adm-side-head">
          <div className="adm-side-logo">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
          <div>
            <p className="adm-side-title">ISLA-TRANSPO</p>
            <p className="adm-side-subtitle">Admin — Messages</p>
          </div>
        </div>

        <div className="adm-filter-row">
          {(["all", "open", "cancel"] as const).map((f) => (
            <button
              key={f}
              className={`adm-filter-btn ${filter === f ? "adm-filter-active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "All" : f === "open" ? "Unread" : "Cancels"}
            </button>
          ))}
        </div>

        <div className="adm-thread-list">
          {fetching && <p className="adm-dim-text">Loading conversations…</p>}

          {!fetching && fetchError && (
            <div className="adm-error-banner">
              <p className="adm-error-title">⚠ Fetch failed</p>
              <p className="adm-error-detail">{fetchError}</p>
              <p className="adm-error-hint">
                Check Supabase RLS — make sure admin_messages has a SELECT policy
                that allows reads. Open the browser console for details.
              </p>
            </div>
          )}

          {!fetching && !fetchError && threads.length === 0 && (
            <div className="adm-empty-banner">
              <p className="adm-empty-title">No messages found</p>
              <p className="adm-empty-detail">
                The table is empty, or RLS is blocking reads. Check the browser
                console for the raw Supabase response.
              </p>
            </div>
          )}

          {!fetching && !fetchError && threads.length > 0 && filteredThreads.length === 0 && (
            <p className="adm-dim-text">No results for this filter.</p>
          )}

          {filteredThreads.map((t) => {
            const isCancel = t.subject?.toLowerCase().includes("cancel");
            const last = t.messages[t.messages.length - 1];
            const isConfirming = confirmDeleteCode === t.request_code;
            const isDraft = t.messages.length === 0;

            return (
              <div key={t.request_code} className="adm-thread-wrap">
                <button
                  className={`adm-thread-item ${activeCode === t.request_code ? "adm-thread-active" : ""}`}
                  onClick={() => openThread(t.request_code)}
                >
                  <div className="adm-thread-top">
                    <span className="adm-thread-identity">
                      {t.senderName ? `${t.senderName} · ${t.request_code}` : t.request_code}
                    </span>
                    <span className="adm-thread-time">
                      {isDraft ? "new" : timeLabel(t.lastAt)}
                    </span>
                  </div>
                  <div className="adm-thread-bottom">
                    <span
                      className="adm-subject-badge"
                      style={{
                        background: isCancel ? "#FEF2F2" : "#EFF6FF",
                        color: isCancel ? "#DC2626" : "#1D4ED8",
                      }}
                    >
                      {t.subject || "Concern"}
                    </span>
                    {t.hasUnread && <span className="adm-unread-dot" />}
                  </div>
                  <p className="adm-thread-preview">
                    {isDraft
                      ? "No messages yet — start the conversation"
                      : `${last?.message.slice(0, 60)}${
                          (last?.message.length || 0) > 60 ? "…" : ""
                        }`}
                  </p>
                </button>

                <button
                  className="adm-thread-delete-btn"
                  aria-label="Delete conversation"
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmDeleteCode(t.request_code);
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                  </svg>
                </button>

                {isConfirming && (
                  <div className="adm-confirm-popover">
                    <p className="adm-confirm-text">
                      Delete this entire conversation? This can't be undone.
                    </p>
                    <div className="adm-confirm-row">
                      <button
                        className="adm-confirm-cancel"
                        onClick={() => setConfirmDeleteCode(null)}
                        disabled={deleting}
                      >
                        Cancel
                      </button>
                      <button
                        className="adm-confirm-delete"
                        onClick={() => deleteThread(t.request_code)}
                        disabled={deleting}
                      >
                        {deleting ? "Deleting…" : "Delete"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>

      {/* Main / chat */}
      <main className="adm-main">
        {!activeCode && (
          <div className="adm-empty-state">
            <div className="adm-empty-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <p className="adm-empty-state-text">Select a conversation to reply</p>
          </div>
        )}

        {activeCode && activeThread && (
          <>
            <div className="adm-chat-head">
              <button className="adm-back-btn" onClick={goBackToList} aria-label="Back to list">
                ←
              </button>
              <div className="adm-chat-head-text">
                <p className="adm-chat-head-name">
                  {activeThread.senderName || "Unknown passenger"}
                </p>
                <p className="adm-chat-head-meta">
                  {activeThread.request_code} · {activeThread.messages.length} message
                  {activeThread.messages.length !== 1 ? "s" : ""}
                </p>
              </div>
              <span
                className="adm-subject-badge adm-subject-badge-lg"
                style={{
                  background: activeThread.subject?.toLowerCase().includes("cancel") ? "#FEF2F2" : "#EFF6FF",
                  color: activeThread.subject?.toLowerCase().includes("cancel") ? "#DC2626" : "#1D4ED8",
                }}
              >
                {activeThread.subject || "Concern"}
              </span>
              {activeThread.messages.length > 0 && (
                <button
                  className="adm-chat-delete-btn"
                  onClick={() => setConfirmDeleteCode(activeThread.request_code)}
                  aria-label="Delete conversation"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                  </svg>
                </button>
              )}
            </div>

            {confirmDeleteCode === activeThread.request_code && (
              <div className="adm-chat-confirm-bar">
                <span>Delete this entire conversation? This can't be undone.</span>
                <div className="adm-confirm-row">
                  <button
                    className="adm-confirm-cancel"
                    onClick={() => setConfirmDeleteCode(null)}
                    disabled={deleting}
                  >
                    Cancel
                  </button>
                  <button
                    className="adm-confirm-delete"
                    onClick={() => deleteThread(activeThread.request_code)}
                    disabled={deleting}
                  >
                    {deleting ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </div>
            )}

            <div className="adm-messages">
              {activeThread.messages.length === 0 && (
                <p className="adm-dim-text" style={{ marginTop: 12 }}>
                  No messages yet. Type below to start the conversation with{" "}
                  {activeThread.senderName || "this requester"}.
                </p>
              )}
              {activeThread.messages.map((msg) => (
                <div
                  key={msg.id}
                  className="adm-msg-row"
                  style={{ alignItems: msg.sender === "admin" ? "flex-end" : "flex-start" }}
                >
                  <span className="adm-msg-meta">
                    {msg.sender === "admin" ? "You (Admin)" : activeThread.senderName || "Passenger"} ·{" "}
                    {timeOfDay(msg.created_at)}
                  </span>
                  <div
                    className="adm-msg-bubble"
                    style={{
                      borderRadius: msg.sender === "admin" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                      background: msg.sender === "admin" ? "#0B3D91" : "#F1F5F9",
                      color: msg.sender === "admin" ? "white" : "#0F172A",
                    }}
                  >
                    {msg.message}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <div className="adm-reply-box">
              <textarea
                className="adm-reply-input"
                placeholder="Type your reply…"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.metaKey) sendReply();
                }}
                rows={3}
              />
              <div className="adm-reply-row">
                <span className="adm-reply-hint">⌘ + Enter to send</span>
                <button
                  className="adm-reply-btn"
                  style={{ opacity: loading || !reply.trim() ? 0.5 : 1 }}
                  onClick={sendReply}
                  disabled={loading || !reply.trim()}
                >
                  {loading ? "Sending…" : "Send reply"}
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

const CSS = `
  .adm-shell {
    display: flex;
    height: 100vh;
    font-family: 'Segoe UI', system-ui, sans-serif;
    background: #F8FAFC;
    overflow: hidden;
  }
  .adm-sidebar {
    width: 300px;
    min-width: 260px;
    background: #0B3D91;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .adm-side-head {
    display: flex; align-items: center; gap: 10px;
    padding: 20px 16px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }
  .adm-side-logo {
    width: 34px; height: 34px; border-radius: 9px;
    background: rgba(255,255,255,0.15);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .adm-side-title { margin: 0; font-size: 15px; font-weight: 800; color: white; }
  .adm-side-subtitle { margin: 0; font-size: 11px; color: rgba(255,255,255,0.55); }
  .adm-filter-row {
    display: flex; gap: 6px; padding: 12px 14px;
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }
  .adm-filter-btn {
    flex: 1; padding: 6px 4px; border-radius: 8px; border: none;
    background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.65);
    font-size: 12px; font-weight: 600; cursor: pointer;
  }
  .adm-filter-active { background: rgba(255,255,255,0.22); color: white; }
  .adm-thread-list { flex: 1; overflow-y: auto; padding: 8px; }
  .adm-thread-wrap { position: relative; margin-bottom: 4px; }
  .adm-thread-item {
    display: block; width: 100%; padding: 12px 38px 12px 12px; border-radius: 10px; border: none;
    background: transparent; text-align: left; cursor: pointer;
  }
  .adm-thread-item:hover { background: rgba(255,255,255,0.08); }
  .adm-thread-active { background: rgba(255,255,255,0.15) !important; }
  .adm-thread-delete-btn {
    position: absolute;
    top: 10px;
    right: 8px;
    width: 26px; height: 26px;
    border-radius: 7px;
    border: none;
    background: transparent;
    color: rgba(255,255,255,0.4);
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
  }
  .adm-thread-delete-btn:hover { background: rgba(220,38,38,0.25); color: #FCA5A5; }
  .adm-confirm-popover {
    margin: 4px 4px 8px;
    padding: 10px 12px;
    border-radius: 10px;
    background: #1E3A8A;
    border: 1px solid rgba(255,255,255,0.15);
  }
  .adm-confirm-text { margin: 0 0 8px; font-size: 12px; color: rgba(255,255,255,0.85); line-height: 1.4; }
  .adm-confirm-row { display: flex; gap: 8px; justify-content: flex-end; }
  .adm-confirm-cancel {
    padding: 6px 12px; border-radius: 7px; border: 1px solid rgba(255,255,255,0.3);
    background: transparent; color: white; font-size: 12px; font-weight: 600; cursor: pointer;
  }
  .adm-confirm-delete {
    padding: 6px 12px; border-radius: 7px; border: none;
    background: #DC2626; color: white; font-size: 12px; font-weight: 700; cursor: pointer;
  }
  .adm-confirm-cancel:disabled, .adm-confirm-delete:disabled { opacity: 0.6; cursor: not-allowed; }
  .adm-thread-top {
    display: flex; justify-content: space-between; align-items: baseline; gap: 8px; margin-bottom: 5px;
  }
  .adm-thread-identity {
    font-size: 13px; font-weight: 700; color: white; letter-spacing: 0.2px;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .adm-thread-time { font-size: 11px; color: rgba(255,255,255,0.45); flex-shrink: 0; }
  .adm-thread-bottom { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; }
  .adm-subject-badge { font-size: 11px; font-weight: 600; padding: 3px 9px; border-radius: 20px; white-space: nowrap; }
  .adm-subject-badge-lg { font-size: 13px; padding: 5px 14px; }
  .adm-unread-dot { width: 8px; height: 8px; border-radius: 50%; background: #F97316; flex-shrink: 0; }
  .adm-thread-preview {
    margin: 0; font-size: 12px; color: rgba(255,255,255,0.45);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .adm-dim-text { color: rgba(255,255,255,0.35); font-size: 13px; text-align: center; margin-top: 24px; }
  .adm-error-banner {
    margin: 12px 8px; padding: 12px 14px; border-radius: 10px;
    background: rgba(220,38,38,0.25); border: 1px solid rgba(220,38,38,0.4); color: #FCA5A5;
  }
  .adm-error-title { margin: 0; font-size: 12px; font-weight: 700; }
  .adm-error-detail { margin: 4px 0 0; font-size: 11px; }
  .adm-error-hint { margin: 6px 0 0; font-size: 11px; opacity: 0.8; }
  .adm-empty-banner { margin: 12px 8px; padding: 12px 14px; border-radius: 10px; background: rgba(255,255,255,0.07); }
  .adm-empty-title { margin: 0; font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.7); }
  .adm-empty-detail { margin: 6px 0 0; font-size: 11px; color: rgba(255,255,255,0.45); line-height: 1.5; }
  .adm-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
  .adm-empty-state {
    flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px;
  }
  .adm-empty-icon {
    width: 64px; height: 64px; border-radius: 16px; background: #F1F5F9;
    display: flex; align-items: center; justify-content: center;
  }
  .adm-empty-state-text { color: #94A3B8; font-size: 14px; }
  .adm-chat-head {
    display: flex; align-items: center; gap: 12px;
    padding: 16px 24px; border-bottom: 1px solid #E2E8F0; background: white; flex-shrink: 0;
  }
  .adm-back-btn {
    display: none;
    width: 32px; height: 32px; border-radius: 8px; border: none; background: #F1F5F9;
    color: #0F172A; font-size: 16px; cursor: pointer; flex-shrink: 0;
    align-items: center; justify-content: center;
  }
  .adm-chat-head-text { flex: 1; min-width: 0; }
  .adm-chat-head-name {
    margin: 0; font-size: 15px; font-weight: 700; color: #0F172A;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .adm-chat-head-meta { margin: 0; font-size: 12px; color: #64748B; }
  .adm-chat-delete-btn {
    width: 34px; height: 34px; border-radius: 9px; border: 1px solid #FCA5A5;
    background: #FEF2F2; color: #DC2626; cursor: pointer; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
  }
  .adm-chat-delete-btn:hover { background: #FEE2E2; }
  .adm-chat-confirm-bar {
    display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;
    padding: 10px 24px; background: #FEF2F2; border-bottom: 1px solid #FCA5A5;
    font-size: 13px; color: #991B1B; flex-shrink: 0;
  }
  .adm-messages { flex: 1; overflow-y: auto; padding: 20px 24px; background: #F8FAFC; }
  .adm-msg-row { display: flex; flex-direction: column; margin-bottom: 14px; }
  .adm-msg-meta { font-size: 11px; color: #94A3B8; margin-bottom: 3px; }
  .adm-msg-bubble { max-width: 70%; padding: 11px 15px; font-size: 14px; line-height: 1.55; word-break: break-word; }
  .adm-reply-box { padding: 16px 24px; border-top: 1px solid #E2E8F0; background: white; flex-shrink: 0; }
  .adm-reply-input {
    width: 100%; padding: 12px 14px; border-radius: 12px; border: 1.5px solid #CBD5E1;
    font-size: 16px; color: #0F172A; outline: none; resize: none;
    box-sizing: border-box; line-height: 1.5; font-family: inherit;
  }
  .adm-reply-input:focus { border-color: #0B3D91; }
  .adm-reply-row { display: flex; justify-content: flex-end; margin-top: 8px; gap: 10px; align-items: center; }
  .adm-reply-hint { font-size: 11px; color: #94A3B8; }
  .adm-reply-btn {
    padding: 10px 22px; border-radius: 10px; border: none; background: #0B3D91;
    color: white; font-size: 14px; font-weight: 700; cursor: pointer;
  }
  .adm-reply-btn:disabled { cursor: not-allowed; }

  /* ── Tablet: narrower sidebar ── */
  @media (max-width: 1024px) {
    .adm-sidebar { width: 260px; min-width: 220px; }
  }

  /* ── Phone / small tablet: list and chat become full-screen views ── */
  @media (max-width: 880px) {
    .adm-sidebar { width: 100%; min-width: 0; }
    .adm-main { display: none; }
    .adm-has-active .adm-sidebar { display: none; }
    .adm-has-active .adm-main { display: flex; }
    .adm-back-btn { display: flex; }
    .adm-msg-bubble { max-width: 85%; }
    .adm-chat-head { padding: 14px 16px; }
    .adm-messages { padding: 16px; }
    .adm-reply-box { padding: 12px 16px; }
  }
`;
