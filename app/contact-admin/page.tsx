"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

type Msg = {
  id: string;
  request_code: string;
  sender: "requester" | "admin";
  subject: string | null;
  message: string;
  created_at: string;
  status: string;
  request_id: string;
};

type Thread = {
  request_code: string;
  request_id: string;
  subject: string | null;
  messages: Msg[];
  lastAt: string;
  hasUnread: boolean;
};

export default function AdminMessagesPage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeCode, setActiveCode] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "open" | "cancel">("all");
  const bottomRef = useRef<HTMLDivElement>(null);

  const buildThreads = (msgs: Msg[]): Thread[] => {
    const map = new Map<string, Thread>();
    for (const m of msgs) {
      if (!map.has(m.request_code)) {
        map.set(m.request_code, {
          request_code: m.request_code,
          request_id: m.request_id,
          subject: m.subject,
          messages: [],
          lastAt: m.created_at,
          hasUnread: false,
        });
      }
      const t = map.get(m.request_code)!;
      t.messages.push(m);
      if (m.created_at > t.lastAt) t.lastAt = m.created_at;
      // mark unread if ANY requester message exists (not just status=open)
      if (m.sender === "requester") t.hasUnread = true;
      if (m.subject) t.subject = m.subject;
    }
    return Array.from(map.values()).sort((a, b) =>
      b.lastAt.localeCompare(a.lastAt)
    );
  };

  useEffect(() => {
    const load = async () => {
      setFetching(true);
      setFetchError(null);

      const { data, error } = await supabase
        .from("admin_messages")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Admin fetch error:", error);
        setFetchError(`Could not load messages: ${error.message}`);
        setFetching(false);
        return;
      }

      console.log("Fetched rows:", data?.length, data);
      setThreads(buildThreads((data as Msg[]) || []));
      setFetching(false);
    };

    load();

    const channel = supabase
  .channel("admin_all_messages")
  .on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "admin_messages",
    },
    (payload) => {
      const eventType = payload.eventType;

      setThreads((prev) => {
        // ========================
        // DELETE
        // ========================
        if (eventType === "DELETE") {
          const oldMsg = payload.old as Msg;

          return prev.map((t) => ({
            ...t,
            messages: t.messages.filter((m) => m.id !== oldMsg.id),
          }));
        }

        const msg = payload.new as Msg;

        if (!msg?.request_code) return prev;

        const targetCode = msg.request_code;

        const exists = prev.find((t) => t.request_code === targetCode);

        // ========================
        // INSERT
        // ========================
        if (eventType === "INSERT") {
          const msg = payload.new as Msg;

          if (!msg?.request_code) return prev;

          return prev.map((t) => {
            if (t.request_code !== msg.request_code) return t;

            const updatedMessages = [...t.messages, msg];

            return {
              ...t,
              messages: updatedMessages,
              lastAt: msg.created_at,
              subject: msg.subject || t.subject,
              hasUnread: msg.sender === "requester" ? true : t.hasUnread,
            };
          });
        }

          // NEW THREAD CASE (IMPORTANT FIX)
          return [
            {
              request_code: msg.request_code,
              request_id: msg.request_id,
              subject: msg.subject,
              messages: [msg],
              lastAt: msg.created_at,
              hasUnread: msg.sender === "requester",
            },
            ...prev,
          ];
        }

        // ========================
        // UPDATE
        // ========================
        if (eventType === "UPDATE") {
          return prev.map((t) =>
            t.request_code === targetCode
              ? {
                  ...t,
                  messages: t.messages.map((m) =>
                    m.id === msg.id ? msg : m
                  ),
                  subject: msg.subject || t.subject,
                }
              : t
          );
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

  const sendReply = async () => {
    if (!reply.trim() || !activeThread) return;
    setLoading(true);

    const { error } = await supabase.from("admin_messages").insert([
      {
        request_id: activeThread.request_id,
        request_code: activeThread.request_code,
        sender: "admin",
        subject: activeThread.subject,
        message: reply.trim(),
        status: "replied",
      },
    ]);

    if (error) {
      console.error("Reply error:", error);
      setLoading(false);
      return;
    }

    // Mark requester messages as replied
    await supabase
      .from("admin_messages")
      .update({ status: "replied" })
      .eq("request_code", activeThread.request_code)
      .eq("sender", "requester");

    setThreads((prev) =>
      prev.map((t) =>
        t.request_code === activeThread.request_code
          ? { ...t, hasUnread: false }
          : t
      )
    );

    setReply("");
    setLoading(false);
  };

  const filteredThreads = threads.filter((t) => {
    if (filter === "cancel")
      return t.subject?.toLowerCase().includes("cancel");
    if (filter === "open") return t.hasUnread;
    return true;
  });

  const timeLabel = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60_000) return "just now";
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
    if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
    return d.toLocaleDateString();
  };

  return (
    <div style={s.shell}>
      {/* Sidebar */}
      <aside style={s.sidebar}>
        <div style={s.sideHead}>
          <div style={s.sideLogo}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
            </svg>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "white" }}>ISLA-TRANSPO</p>
            <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.55)" }}>Admin — Messages</p>
          </div>
        </div>

        <div style={s.filterRow}>
          {(["all", "open", "cancel"] as const).map((f) => (
            <button
              key={f}
              style={{ ...s.filterBtn, ...(filter === f ? s.filterActive : {}) }}
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "All" : f === "open" ? "Unread" : "Cancels"}
            </button>
          ))}
        </div>

        <div style={s.threadList}>
          {/* ── Debug / status banners ── */}
          {fetching && (
            <p style={s.dimText}>Loading conversations…</p>
          )}

          {!fetching && fetchError && (
            <div style={s.errorBanner}>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 700 }}>⚠ Fetch failed</p>
              <p style={{ margin: "4px 0 0", fontSize: 11 }}>{fetchError}</p>
              <p style={{ margin: "6px 0 0", fontSize: 11, opacity: 0.8 }}>
                Check Supabase RLS — make sure the admin_messages table has a SELECT policy that allows reads. Open browser console for details.
              </p>
            </div>
          )}

          {!fetching && !fetchError && threads.length === 0 && (
            <div style={s.emptyBanner}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>No messages found</p>
              <p style={{ margin: "6px 0 0", fontSize: 11, color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>
                The table is empty, or RLS is blocking reads. Check browser console for the raw Supabase response.
              </p>
            </div>
          )}

          {!fetching && !fetchError && threads.length > 0 && filteredThreads.length === 0 && (
            <p style={s.dimText}>No results for this filter.</p>
          )}

          {filteredThreads.map((t) => (
            <button
              key={t.request_code}
              style={{
                ...s.threadItem,
                ...(activeCode === t.request_code ? s.threadActive : {}),
              }}
              onClick={() => setActiveCode(t.request_code)}
            >
              <div style={s.threadItemTop}>
                <span style={s.threadCode}>{t.request_code}</span>
                <span style={s.threadTime}>{timeLabel(t.lastAt)}</span>
              </div>
              <div style={s.threadItemBottom}>
                <span style={{
                  ...s.subjectBadge,
                  background: t.subject?.toLowerCase().includes("cancel") ? "#FEF2F2" : "#EFF6FF",
                  color: t.subject?.toLowerCase().includes("cancel") ? "#DC2626" : "#1D4ED8",
                }}>
                  {t.subject || "Concern"}
                </span>
                {t.hasUnread && <span style={s.unreadDot} />}
              </div>
              <p style={s.threadPreview}>
                {t.messages[t.messages.length - 1]?.message.slice(0, 60)}
                {(t.messages[t.messages.length - 1]?.message.length || 0) > 60 ? "…" : ""}
              </p>
            </button>
          ))}
        </div>
      </aside>

      {/* Main */}
      <main style={s.main}>
        {!activeCode && (
          <div style={s.emptyState}>
            <div style={s.emptyIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <p style={{ color: "#94A3B8", fontSize: 14 }}>Select a conversation to reply</p>
          </div>
        )}

        {activeCode && activeThread && (
          <>
            <div style={s.chatHead}>
              <div>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0F172A" }}>
                  {activeThread.request_code}
                </p>
                <p style={{ margin: 0, fontSize: 12, color: "#64748B" }}>
                  {activeThread.messages.length} message{activeThread.messages.length !== 1 ? "s" : ""}
                </p>
              </div>
              <span style={{
                ...s.subjectBadge,
                fontSize: 13,
                padding: "5px 14px",
                background: activeThread.subject?.toLowerCase().includes("cancel") ? "#FEF2F2" : "#EFF6FF",
                color: activeThread.subject?.toLowerCase().includes("cancel") ? "#DC2626" : "#1D4ED8",
              }}>
                {activeThread.subject || "Concern"}
              </span>
            </div>

            <div style={s.messages}>
              {activeThread.messages.map((msg) => (
                <div key={msg.id} style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: msg.sender === "admin" ? "flex-end" : "flex-start",
                  marginBottom: 14,
                }}>
                  <span style={{ fontSize: 11, color: "#94A3B8", marginBottom: 3 }}>
                    {msg.sender === "admin" ? "You (Admin)" : "Passenger"} · {timeLabel(msg.created_at)}
                  </span>
                  <div style={{
                    maxWidth: "70%",
                    padding: "11px 15px",
                    borderRadius: msg.sender === "admin" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    fontSize: 14,
                    lineHeight: 1.55,
                    background: msg.sender === "admin" ? "#0B3D91" : "#F1F5F9",
                    color: msg.sender === "admin" ? "white" : "#0F172A",
                  }}>
                    {msg.message}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <div style={s.replyBox}>
              <textarea
                style={s.replyInput}
                placeholder="Type your reply…"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey) sendReply(); }}
                rows={3}
              />
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8, gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "#94A3B8" }}>⌘ + Enter to send</span>
                <button
                  style={{ ...s.replyBtn, opacity: loading || !reply.trim() ? 0.5 : 1 }}
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

const s: Record<string, React.CSSProperties> = {
  shell: {
    display: "flex",
    height: "100vh",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    background: "#F8FAFC",
    overflow: "hidden",
  },
  sidebar: {
    width: 300,
    minWidth: 260,
    background: "#0B3D91",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  sideHead: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "20px 16px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
  sideLogo: {
    width: 34,
    height: 34,
    borderRadius: 9,
    background: "rgba(255,255,255,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  filterRow: {
    display: "flex",
    gap: 6,
    padding: "12px 14px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
  filterBtn: {
    flex: 1,
    padding: "6px 4px",
    borderRadius: 8,
    border: "none",
    background: "rgba(255,255,255,0.1)",
    color: "rgba(255,255,255,0.65)",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
  },
  filterActive: {
    background: "rgba(255,255,255,0.22)",
    color: "white",
  },
  threadList: {
    flex: 1,
    overflowY: "auto",
    padding: "8px 8px",
  },
  threadItem: {
    display: "block",
    width: "100%",
    padding: "12px 12px",
    borderRadius: 10,
    border: "none",
    background: "transparent",
    textAlign: "left",
    cursor: "pointer",
    marginBottom: 4,
  },
  threadActive: {
    background: "rgba(255,255,255,0.15)",
  },
  threadItemTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  threadCode: {
    fontSize: 13,
    fontWeight: 700,
    color: "white",
    letterSpacing: 0.3,
  },
  threadTime: {
    fontSize: 11,
    color: "rgba(255,255,255,0.45)",
  },
  threadItemBottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  subjectBadge: {
    fontSize: 11,
    fontWeight: 600,
    padding: "3px 9px",
    borderRadius: 20,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#F97316",
    flexShrink: 0,
  },
  threadPreview: {
    margin: 0,
    fontSize: 12,
    color: "rgba(255,255,255,0.45)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  dimText: {
    color: "rgba(255,255,255,0.35)",
    fontSize: 13,
    textAlign: "center",
    marginTop: 24,
  },
  errorBanner: {
    margin: "12px 8px",
    padding: "12px 14px",
    borderRadius: 10,
    background: "rgba(220,38,38,0.25)",
    border: "1px solid rgba(220,38,38,0.4)",
    color: "#FCA5A5",
  },
  emptyBanner: {
    margin: "12px 8px",
    padding: "12px 14px",
    borderRadius: 10,
    background: "rgba(255,255,255,0.07)",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  emptyState: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    background: "#F1F5F9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  chatHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px",
    borderBottom: "1px solid #E2E8F0",
    background: "white",
    flexShrink: 0,
  },
  messages: {
    flex: 1,
    overflowY: "auto",
    padding: "20px 24px",
    background: "#F8FAFC",
  },
  replyBox: {
    padding: "16px 24px",
    borderTop: "1px solid #E2E8F0",
    background: "white",
    flexShrink: 0,
  },
  replyInput: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: "1.5px solid #CBD5E1",
    fontSize: 14,
    color: "#0F172A",
    outline: "none",
    resize: "none",
    boxSizing: "border-box" as const,
    lineHeight: 1.5,
    fontFamily: "inherit",
  },
  replyBtn: {
    padding: "10px 22px",
    borderRadius: 10,
    border: "none",
    background: "#0B3D91",
    color: "white",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  },
};
