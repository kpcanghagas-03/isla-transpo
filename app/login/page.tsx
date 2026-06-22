"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.replace("/admin");
  };

  return (
    <div className="login-shell">
      <style>{CSS}</style>
      <form className="login-card" onSubmit={handleLogin}>
        <div className="login-logo">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
        </div>
        <h1>ISLA-TRANSPO</h1>
        <p className="login-sub">Admin sign in</p>

        <label className="login-label">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@example.com"
        />

        <label className="login-label">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />

        {error && <p className="login-error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

const CSS = `
  .login-shell {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(180deg,#0B3D91 0%,#0a2f6e 100%);
    font-family: 'Segoe UI', system-ui, sans-serif;
    padding: 20px;
  }
  .login-card {
    background: white;
    border-radius: 20px;
    padding: 36px 32px;
    width: 100%;
    max-width: 360px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.25);
    display: flex;
    flex-direction: column;
  }
  .login-logo {
    width: 44px; height: 44px; border-radius: 12px;
    background: #0B3D91;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 14px;
  }
  .login-card h1 { margin: 0; font-size: 18px; font-weight: 800; color: #0F172A; }
  .login-sub { margin: 4px 0 20px; font-size: 13px; color: #64748B; }
  .login-label { font-size: 12px; font-weight: 600; color: #475569; margin-bottom: 6px; margin-top: 12px; }
  .login-card input {
    padding: 11px 13px; border-radius: 10px; border: 1.5px solid #CBD5E1;
    font-size: 14px; color: #0F172A; outline: none;
  }
  .login-card input:focus { border-color: #0B3D91; }
  .login-error { color: #DC2626; font-size: 12px; margin-top: 10px; }
  .login-card button {
    margin-top: 20px; padding: 12px; border-radius: 10px; border: none;
    background: #0B3D91; color: white; font-weight: 700; font-size: 14px; cursor: pointer;
  }
  .login-card button:disabled { opacity: 0.6; cursor: not-allowed; }
`;