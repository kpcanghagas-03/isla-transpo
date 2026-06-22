"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
      if (!data.session) router.replace("/login");
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (!newSession) router.replace("/login");
    });

    return () => listener.subscription.unsubscribe();
  }, [router]);

  if (checking) {
    return (
      <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", color: "#64748B", fontFamily: "system-ui" }}>
        Checking session…
      </div>
    );
  }

  if (!session) return null; // redirect already triggered

  return (
    <>
      <AdminTopBar email={session.user.email || ""} pathname={pathname} />
      {children}
    </>
  );
}

function AdminTopBar({ email, pathname }: { email: string; pathname: string }) {
  const router = useRouter();
  const onMessages = pathname.startsWith("/contact-admin");

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        padding: "10px 16px",
        background: "#0B3D91",
        color: "white",
        fontFamily: "Segoe UI, system-ui, sans-serif",
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => router.push("/admin")}
          style={{
            padding: "7px 14px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: 13,
            background: !onMessages ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.1)",
            color: "white",
          }}
        >
          🚐 Dashboard
        </button>
        <button
          onClick={() => router.push("/contact-admin")}
          style={{
            padding: "7px 14px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: 13,
            background: onMessages ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.1)",
            color: "white",
          }}
        >
          💬 Messages
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 12, opacity: 0.75 }}>{email}</span>
        <button
          onClick={logout}
          style={{
            padding: "6px 12px",
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.4)",
            background: "transparent",
            color: "white",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          Log out
        </button>
      </div>
    </div>
  );
}