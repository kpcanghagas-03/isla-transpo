"use client";

import { useRouter } from "next/navigation";

type Department = {
  id: string;
  label: string;
  accent: string;
  members: string[];
};

const DEPARTMENTS: Department[] = [
  {
    id: "Members",
    label: "Leadership & Coordination",
    accent: "#3b82f6", // Vibrant neon blue
    members: ["John Paul T. Balistoy", "Junvee O. Barbadillo", "Marc Mana"],
  },
  {
    id: "development",
    label: "System Development",
    accent: "#f97316", // Intense glowing orange
    members: ["Karen P. Canghagas", "Arjay A. Charcos"],
  },
  {
    id: "operations",
    label: "Transportation Operations",
    accent: "#ef4444", // Piercing warning red
    members: [
      "Lino A. Gorres Jr.",
      "Ramil M. Cañeda",
      "Ernesto A. Soliva",
      "Pablito D. Murillo",
      "Francisco F. Talle Jr.",
      "Leonel V. Quidet",
    ],
  },
];

function initials(name: string) {
  const stripped = name.replace(/\b(Jr\.?|Sr\.?|III|II|IV)\b/gi, "").trim();
  const parts = stripped.split(/\s+/).filter((p) => p.replace(".", "").length > 1);
  if (parts.length === 0) return name[0]?.toUpperCase() || "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function TeamPage() {
  const router = useRouter();

  let counter = 0;
  const stops = DEPARTMENTS.map((d) => ({
    ...d,
    crew: d.members.map((name) => ({ name, no: ++counter })),
  }));
  const totalCrew = counter;

  return (
    <main className="tp-page">
      <style jsx>{CSS}</style>

      {/* Dynamic Deep Ocean Glowing Elements */}
      <div className="tp-ocean-glow" />
      <div className="tp-radar-sweep" />

      <div className="tp-wrap">
        <button className="tp-back" onClick={() => router.push("/")}>
          ← Terminal Control
        </button>

        {/* ================= CYBER MANIFEST HEADER ================= */}
        <div className="tp-manifest-card">
          <div className="tp-manifest-main">
            <span className="tp-live-tag">
              <span className="tp-pulse-dot" /> LIVE DISPATCH SYSTEM
            </span>
            <h1 className="tp-title">Transportation Team</h1>
            <p className="tp-subcopy">
              Fleet operatives and system architects managing island transit pipelines 
              for RSTW 2026 across Camiguin coordinates.
            </p>
          </div>

          <div className="tp-manifest-sidebar">
            <div className="tp-meta-item">
              <span className="tp-meta-label">SECTOR</span>
              <span className="tp-meta-val">CMG // RSTW26</span>
            </div>
            <div className="tp-meta-item">
              <span className="tp-meta-label">TIMELINE</span>
              <span className="tp-meta-val">JUL 22-24, 2026</span>
            </div>
            <div className="tp-meta-item">
              <span className="tp-meta-label">MANIFEST</span>
              <span className="tp-meta-val text-neon">{String(totalCrew).padStart(2, "0")} ACTIVE</span>
            </div>
          </div>
        </div>

        {/* ================= SYSTEMS METRICS GATES ================= */}
        <div className="tp-grid-stats">
          <div className="tp-stat-gate border-blue">
            <span className="tp-stat-num text-blue">{totalCrew}</span>
            <span className="tp-stat-label">On-Duty Personnel</span>
          </div>
          <div className="tp-stat-gate border-orange">
            <span className="tp-stat-num text-orange">{stops.length}</span>
            <span className="tp-stat-label">Active Node Sectors</span>
          </div>
          <div className="tp-stat-gate border-red">
            <span className="tp-stat-num text-red">1.0</span>
            <span className="tp-stat-label">Centralized Network</span>
          </div>
          <div className="tp-stat-gate border-blue">
            <span className="tp-stat-num text-blue">99.9%</span>
            <span className="tp-stat-label">Uptime Allocation</span>
          </div>
        </div>

        {/* ================= TRANSIT PIPELINE TRACKER ================= */}
        <div className="tp-pipeline-container">
          <div className="tp-track-lane">
            {/* The active tracing transport pulse */}
            <div className="tp-ferry-pulse" />

            {stops.map((stop, i) => (
              <section className="tp-node-station" key={stop.id}>
                <span className="tp-node-indicator" style={{ '--node-color': stop.accent } as React.CSSProperties} />
                
                <span className="tp-station-eyebrow" style={{ color: stop.accent }}>
                  WAYPOINT KEY // 0{i + 1}
                </span>
                <h2 className="tp-station-title">{stop.label}</h2>

                <div className="tp-crew-deck">
                  {stop.crew.map((person) => (
                    <article className="tp-operative-card" key={person.name} style={{ '--hover-glow': stop.accent } as React.CSSProperties}>
                      <div className="tp-card-header">
                        <div className="tp-avatar-seal" style={{ background: `${stop.accent}15`, color: stop.accent, border: `1px solid ${stop.accent}40` }}>
                          {initials(person.name)}
                        </div>
                        <span className="tp-badge-id">
                          ID-{String(person.no).padStart(2, "0")} / 0{totalCrew}
                        </span>
                      </div>
                      
                      <h3 className="tp-operative-name">{person.name}</h3>
                      
                      <div className="tp-card-footer" style={{ borderTop: `1px dashed ${stop.accent}20` }}>
                        <span className="tp-sector-tag" style={{ color: stop.accent, background: `${stop.accent}0a` }}>
                          {stop.id.toUpperCase()}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}

            <div className="tp-terminal-node">
              <span className="tp-terminal-dot" />
              <span>PIPELINE TERMINAL SECURE</span>
            </div>
          </div>
        </div>

        {/* ================= FOOTER PROTOCOL ================= */}
        <div className="tp-auth-footer">
          <div className="tp-watermark">SECURE ENDPOINT</div>
          <h2 className="tp-auth-title">Operation Clearance</h2>
          <p className="tp-auth-desc">
            Every route synchronized, passenger logged, and dispatch movement executed 
            concludes a verified transport framework.
          </p>
        </div>
      </div>
    </main>
  );
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

  .tp-page {
    position: relative;
    min-height: 100vh;
    overflow: hidden;
    background: #020617; /* Deep midnight void */
    color: #f8fafc;
    font-family: system-ui, -apple-system, sans-serif;
  }

  /* Deep Neon Ocean & Volcanic Ambience */
  .tp-ocean-glow {
    position: absolute;
    inset: 0;
    background: 
      radial-gradient(circle at 10% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 40%),
      radial-gradient(circle at 90% 80%, rgba(249, 115, 22, 0.06) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(239, 68, 68, 0.04) 0%, transparent 60%);
    pointer-events: none;
  }

  .tp-radar-sweep {
    position: absolute;
    width: 200%;
    height: 200%;
    top: -50%;
    left: -50%;
    background: conic-gradient(from 0deg at 50% 50%, transparent 0%, rgba(59, 130, 246, 0.03) 30%, transparent 40%);
    animation: radarRotation 12s linear infinite;
    pointer-events: none;
  }

  @keyframes radarRotation {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .tp-wrap { 
    max-width: 960px; 
    margin: 0 auto; 
    padding: 60px 24px 100px; 
    position: relative; 
    z-index: 2; 
  }

  .tp-back {
    border: 1px solid rgba(255, 255, 255, 0.1); 
    cursor: pointer; 
    background: rgba(15, 23, 42, 0.6);
    backdrop-filter: blur(8px);
    padding: 10px 20px; 
    border-radius: 8px;
    color: #94a3b8; 
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    letter-spacing: 0.05em;
    transition: all 0.2s ease;
    margin-bottom: 32px;
  }
  .tp-back:hover {
    color: #3b82f6;
    border-color: rgba(59, 130, 246, 0.4);
    background: rgba(59, 130, 246, 0.05);
  }

  /* ── Cyber Manifest Header ── */
  .tp-manifest-card {
    position: relative;
    background: linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.5) 100%);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
    margin-bottom: 32px;
    display: flex;
    flex-wrap: wrap;
    overflow: hidden;
  }
  .tp-manifest-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.4), rgba(249, 115, 22, 0.4), transparent);
  }

  .tp-manifest-main { flex: 1; min-width: 280px; padding: 40px; }
  
  .tp-live-tag {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.1em;
    color: #3b82f6;
    background: rgba(59, 130, 246, 0.1);
    padding: 4px 12px;
    border-radius: 4px;
    margin-bottom: 20px;
    border: 1px solid rgba(59, 130, 246, 0.2);
  }
  
  .tp-pulse-dot {
    width: 6px; height: 6px; border-radius: 50%; background: #3b82f6;
    animation: beaconPulse 1.5s infinite;
  }
  @keyframes beaconPulse {
    0% { transform: scale(0.8); opacity: 0.5; box-shadow: 0 0 0 0 rgba(59,130,246,0.7); }
    70% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 6px transparent; }
    100% { transform: scale(0.8); opacity: 0.5; box-shadow: 0 0 0 0 transparent; }
  }

  .tp-title {
    font-family: 'Oswald', sans-serif;
    text-transform: uppercase;
    font-weight: 700;
    font-size: clamp(32px, 5vw, 48px);
    line-height: 1.1;
    margin: 0 0 16px;
    color: #ffffff;
    letter-spacing: -0.01em;
  }
  .tp-subcopy { color: #94a3b8; line-height: 1.6; font-size: 15px; max-width: 580px; margin: 0; }

  .tp-manifest-sidebar {
    background: rgba(2, 6, 17, 0.4);
    border-left: 1px solid rgba(255, 255, 255, 0.05);
    padding: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 24px;
    min-width: 240px;
  }
  .tp-meta-item { display: flex; flex-direction: column; gap: 4px; }
  .tp-meta-label { font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: #64748b; letter-spacing: 0.1em; }
  .tp-meta-val { font-family: 'IBM Plex Mono', monospace; font-size: 14px; color: #cbd5e1; font-weight: 500; }
  .text-neon { color: #f97316; text-shadow: 0 0 10px rgba(249,115,22,0.3); }

  /* ── System Metrics Gates ── */
  .tp-grid-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
    margin-bottom: 48px;
  }
  .tp-stat-gate {
    background: rgba(15, 23, 42, 0.4);
    border-radius: 12px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    transition: background 0.3s ease;
  }
  .tp-stat-gate:hover { background: rgba(15, 23, 42, 0.7); }
  
  .border-blue { border-left: 3px solid #3b82f6; border-top: 1px solid rgba(255,255,255,0.03); }
  .border-orange { border-left: 3px solid #f97316; border-top: 1px solid rgba(255,255,255,0.03); }
  .border-red { border-left: 3px solid #ef4444; border-top: 1px solid rgba(255,255,255,0.03); }
  
  .tp-stat-num { font-family: 'IBM Plex Mono', monospace; font-weight: 600; font-size: 26px; }
  .text-blue { color: #3b82f6; }
  .text-orange { color: #f97316; }
  .text-red { color: #ef4444; }
  .tp-stat-label { font-size: 12px; color: #64748b; font-weight: 500; }

  /* ── Transit Pipeline Tracker ── */
  .tp-pipeline-container {
    background: rgba(15, 23, 42, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 24px;
    padding: 44px 36px;
    margin-bottom: 40px;
  }
  .tp-track-lane {
    position: relative;
    margin-left: 8px;
    padding-left: 36px;
    border-left: 2px dashed rgba(255, 255, 255, 0.1);
  }

  /* Active Tracking Ferry Dot Animation */
  .tp-ferry-pulse {
    position: absolute;
    left: -6px;
    top: 0;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #f97316;
    box-shadow: 0 0 15px 4px #f97316, 0 0 4px #ffffff;
    animation: trackingVoyage 8s ease-in-out infinite;
  }
  @keyframes trackingVoyage {
    0% { transform: translateY(0); opacity: 0.2; }
    5% { opacity: 1; }
    95% { opacity: 1; }
    100% { transform: translateY(calc(100% - 10px)); opacity: 0.2; }
  }

  .tp-node-station { position: relative; margin-bottom: 56px; }
  .tp-node-station:last-of-type { margin-bottom: 32px; }

  .tp-node-indicator {
    position: absolute;
    left: -44px;
    top: 4px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #020617;
    border: 3px solid var(--node-color);
    box-shadow: 0 0 12px var(--node-color);
  }
  
  .tp-station-eyebrow {
    display: block;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.08em;
    margin-bottom: 6px;
  }
  .tp-station-title {
    font-family: 'Oswald', sans-serif;
    text-transform: uppercase;
    font-size: 22px;
    color: #f1f5f9;
    margin: 0 0 20px;
    letter-spacing: 0.02em;
  }

  .tp-crew-deck { 
    display: grid; 
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); 
    gap: 16px; 
  }

  /* Operative Profile Glassmorphism Cards */
  .tp-operative-card {
    position: relative;
    background: rgba(30, 41, 59, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 14px;
    padding: 20px;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .tp-operative-card:hover {
    transform: translateY(-4px);
    background: rgba(30, 41, 59, 0.5);
    border-color: var(--hover-glow);
    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.7), 0 0 15px -3px var(--hover-glow);
  }
  
  .tp-card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  
  .tp-avatar-seal {
    width: 38px; height: 38px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Oswald', sans-serif; font-weight: 700; font-size: 14px;
  }
  .tp-badge-id { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: #475569; }
  .tp-operative-name { font-size: 15px; font-weight: 600; color: #f8fafc; margin: 0 0 12px; }
  
  .tp-card-footer {
    padding-top: 12px;
    margin-top: 4px;
  }
  .tp-sector-tag {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 9px; font-weight: 600; letter-spacing: 0.04em;
    padding: 2px 6px; border-radius: 4px;
  }

  .tp-terminal-node {
    display: flex; align-items: center; gap: 12px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px; letter-spacing: 0.1em; color: #475569;
  }
  .tp-terminal-dot {
    width: 10px; height: 10px; border-radius: 50%;
    background: #020617; border: 2px solid rgba(255,255,255,0.2); margin-left: -42px;
  }

  /* ── Footer Protocol / Stamp ── */
  .tp-auth-footer {
    position: relative;
    background: linear-gradient(180deg, rgba(15, 23, 42, 0.5) 0%, rgba(2, 6, 17, 0.8) 100%);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    padding: 40px;
    text-align: center;
    overflow: hidden;
  }
  .tp-watermark {
    position: absolute; top: 16px; right: 20px;
    font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 0.05em;
    color: rgba(59, 130, 246, 0.7); border: 1px solid rgba(59, 130, 246, 0.3); 
    background: rgba(59, 130, 246, 0.05);
    padding: 4px 12px; border-radius: 4px;
  }
  .tp-auth-title { font-family: 'Oswald', sans-serif; text-transform: uppercase; font-size: 22px; margin: 0 0 12px; color: #f1f5f9; }
  .tp-auth-desc { color: #64748b; line-height: 1.6; max-width: 580px; margin: 0 auto; font-size: 14px; }

  /* ── Responsive Viewports ── */
  @media (max-width: 640px) {
    .tp-wrap { padding: 40px 16px 60px; }
    .tp-manifest-main, .tp-manifest-sidebar { padding: 28px; }
    .tp-manifest-sidebar { border-left: none; border-top: 1px solid rgba(255, 255, 255, 0.05); }
    .tp-pipeline-container { padding: 32px 16px; }
    .tp-track-lane { margin-left: 0px; padding-left: 24px; }
    .tp-node-indicator { left: -31px; }
    .tp-terminal-dot { margin-left: -29px; }
    .tp-crew-deck { grid-template-columns: 1fr; }
    .tp-grid-stats { grid-template-columns: repeat(2, 1fr); }
  }
`;