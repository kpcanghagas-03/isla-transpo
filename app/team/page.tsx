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
    accent: "#0ea5e9", // Bright Ocean Blue
    members: ["John Paul T. Balistoy", "Junvee O. Barbadillo", "Marc Mana"],
  },
  {
    id: "development",
    label: "System Development",
    accent: "#f97316", // Hibiscus/Sunset Orange
    members: ["Karen P. Canghagas", "Arjay A. Charcos"],
  },
  {
    id: "operations",
    label: "Transportation Operations",
    accent: "#ef4444", // Camiguin Volcano Red
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

      {/* Island Horizon Gradient Elements */}
      <div className="tp-island-sky" />
      <div className="tp-island-sea" />

      <div className="tp-wrap">
        {/* ================= NAVIGATION HEADER ================= */}
        <header className="tp-navbar">
          <div className="tp-logo-zone">
            <span className="tp-logo-icon">🌋</span>
            <span className="tp-logo-text">ISLA-TRANSPO</span>
          </div>
          <div className="tp-nav-links">
            <span className="tp-nav-item active"> Members </span>
            <button className="tp-terminal-btn" onClick={() => router.push("/")}>
              ⚙️ Home
            </button>
          </div>
        </header>

        <span className="tp-section-tagline">TRANSIT OPERATIONS MANIFEST</span>

        {/* ================= HERO MANIFEST TICKET ================= */}
        <div className="tp-manifest-card">
          <div className="tp-manifest-main">
            <span className="tp-live-tracker">
              <span className="tp-pulse-dot" /> LIVE NETWORK TRACKER
            </span>
            <h1 className="tp-title">Transportation Team</h1>
            <p className="tp-subcopy">
              Welcome aboard! Meet the incredible team keeping our island transit network alive and buzzing for RSTW 2026. 
              Whether we're optimizing routes or welcoming you at the terminal, we are thrilled to guide your adventure across Camiguin. 
              Your journey is our priority!
            </p>
          </div>

          <div className="tp-manifest-ticket-stub">
            <div className="tp-meta-item">
              <span className="tp-meta-label">ROUTE</span>
              <span className="tp-meta-val">CMG // RSTW26 📍</span>
            </div>
            <div className="tp-meta-item">
              <span className="tp-meta-label">DATES</span>
              <span className="tp-meta-val">JUL 22–24, 2026 📅</span>
            </div>
            <div className="tp-meta-item">
              <span className="tp-meta-label">ABOARD</span>
              <span className="tp-meta-val highlights">{String(totalCrew).padStart(2, "0")} TEAM 👥</span>
            </div>
          </div>
        </div>

        {/* ================= TRANSIT PIPELINE TRACKER ================= */}
        <h3 className="tp-block-heading">TRANSIT PIPELINE TRACKER</h3>
        <div className="tp-pipeline-panel">
          
          {/* Island Pipeline Visual Map Line */}
          <div className="tp-map-track">
            <div className="tp-track-station active"><span>CMG Terminal</span></div>
            <div className="tp-track-line-segment"><div className="tp-boat-emoji">🚢</div></div>
            <div className="tp-track-station"><span>Midway</span></div>
            <div className="tp-track-line-segment" />
            <div className="tp-track-station active-end"><span>RSTW26 Hub</span></div>
          </div>

          <div className="tp-departments-stack">
            {stops.map((stop, i) => (
              <section className="tp-dept-section" key={stop.id}>
                <div className="tp-dept-banner" style={{ background: stop.accent }}>
                  <span className="tp-dept-badge-title">
                    {stop.id === "Members" ? "ADMIN" : stop.id === "development" ? "DEVELOPER" : "PILOT"}
                  </span>
                  <h4 className="tp-dept-name">{stop.label}</h4>
                </div>

                <div className="tp-crew-rows">
                  {stop.crew.map((person) => (
                    <div className="tp-crew-row" key={person.name}>
                      <div className="tp-crew-avatar" style={{ background: `${stop.accent}18`, color: stop.accent }}>
                        {initials(person.name)}
                      </div>
                      <div className="tp-crew-info">
                        <span className="tp-crew-name">{person.name}</span>
                        <span className="tp-crew-role">Transpo Member</span>
                      </div>
                      <span className="tp-crew-number">#{String(person.no).padStart(2, "0")}</span>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>

        {/* ================= FOOTER CLEARANCE ================= */}
        <div className="tp-footer-protocol">
          <div className="tp-stamp-row">
            <div className="tp-digital-stamp">
              <span className="tp-stamp-icon">🛡️</span>
              <div>
                <strong> TRANSPO SA ISLA</strong>
                <p>RSTW 2026</p>
              </div>
            </div>
            <div className="tp-island-icon">🌋</div>
          </div>
          <p className="tp-protocol-text">
           Navigating the island, elevating the experience. Welcome aboard with ISLA-TRANSPO
          </p>
        </div>

      </div>
    </main>
  );
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=IBM+Plex+Mono:wght@500;600&display=swap');

  .tp-page {
    position: relative;
    min-height: 100vh;
    background: #eef2f5; 
    color: #1e293b;
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
    overflow-x: hidden;
  }

  /* Camiguin Sunset Sky and Sea Background Aesthetics */
  .tp-island-sky {
    position: absolute;
    top: 0; left: 0; right: 0; height: 420px;
    background: linear-gradient(180deg, #bae6fd 0%, #ffedd5 70%, #ffddd2 100%);
    z-index: 1;
  }
  .tp-island-sea {
    position: absolute;
    top: 420px; left: 0; right: 0; bottom: 0;
    background: linear-gradient(180deg, #e0f2fe 0%, #f1f5f9 100%);
    z-index: 1;
  }

  .tp-wrap {
    max-width: 1040px;
    margin: 0 auto;
    padding: 24px 20px 80px;
    position: relative;
    z-index: 2;
  }

  /* ── Navigation Bar ── */
  .tp-navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(255, 255, 255, 0.75);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.5);
    padding: 14px 24px;
    border-radius: 16px;
    margin-bottom: 32px;
    box-shadow: 0 4px 20px rgba(14, 165, 233, 0.05);
  }
  .tp-logo-zone { display: flex; align-items: center; gap: 8px; }
  .tp-logo-icon { font-size: 20px; }
  .tp-logo-text { font-weight: 800; tracking: 0.02em; color: #0f172a; font-size: 16px; }
  .tp-nav-links { display: flex; align-items: center; gap: 24px; }
  .tp-nav-item { font-size: 14px; font-weight: 600; color: #64748b; cursor: pointer; }
  .tp-nav-item.active { color: #0ea5e9; }
  
  .tp-terminal-btn {
    background: #0ea5e9; color: #fff; border: none;
    padding: 8px 16px; font-weight: 600; font-size: 13px;
    border-radius: 10px; cursor: pointer; box-shadow: 0 4px 12px rgba(14, 165, 233, 0.25);
    transition: transform 0.2s;
  }
  .tp-terminal-btn:hover { transform: translateY(-1px); background: #0284c7; }

  .tp-section-tagline {
    display: block; font-family: 'IBM Plex Mono', monospace;
    font-size: 11px; font-weight: 600; color: #0369a1;
    margin-bottom: 12px; letter-spacing: 0.05em; padding-left: 4px;
  }

  /* ── Manifest Ticket Card ── */
  .tp-manifest-card {
    background: #ffffff;
    border-radius: 20px;
    border: 1px solid rgba(14, 165, 233, 0.15);
    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);
    display: flex;
    flex-wrap: wrap;
    overflow: hidden;
    margin-bottom: 32px;
  }
  .tp-manifest-main { flex: 1; min-width: 300px; padding: 36px; }
  
  .tp-live-tracker {
    display: inline-flex; align-items: center; gap: 6px;
    background: #e0f2fe; color: #0369a1; font-weight: 700;
    font-size: 11px; padding: 4px 10px; border-radius: 6px;
    margin-bottom: 16px; letter-spacing: 0.02em;
  }
  .tp-pulse-dot {
    width: 6px; height: 6px; background: #0ea5e9; border-radius: 50%;
    animation: flash 2s infinite;
  }
  @keyframes flash { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }

  .tp-title { font-size: clamp(28px, 4vw, 38px); font-weight: 800; color: #0f172a; margin: 0 0 12px; letter-spacing: -0.02em; }
  .tp-subcopy { color: #64748b; font-size: 14.5px; line-height: 1.6; margin: 0; max-width: 620px; }

  .tp-manifest-ticket-stub {
    background: #f8fafc;
    border-left: 2px dashed #e2e8f0;
    padding: 36px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 20px;
    min-width: 240px;
    position: relative;
  }
  /* Decorative Ticket Cutouts */
  .tp-manifest-ticket-stub::before, .tp-manifest-ticket-stub::after {
    content: ''; position: absolute; left: -10px; width: 20px; height: 20px; background: #ffedd5; border-radius: 50%;
  }
  .tp-manifest-ticket-stub::before { top: -10px; }
  .tp-manifest-ticket-stub::after { bottom: -10px; }

  .tp-meta-item { display: flex; flex-direction: column; gap: 2px; }
  .tp-meta-label { font-size: 10px; font-weight: 700; color: #94a3b8; letter-spacing: 0.05em; }
  .tp-meta-val { font-size: 13px; font-weight: 700; color: #334155; }
  .tp-meta-val.highlights { color: #f97316; }

  /* ── Block Headings ── */
  .tp-block-heading {
    font-size: 12px; font-weight: 800; color: #475569;
    letter-spacing: 0.06em; margin: 0 0 16px 4px;
  }

  /* ── Metrics Row ── */
  .tp-metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 36px;
  }
  .tp-metric-box {
    background: rgba(255, 255, 255, 0.8);
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.01);
  }
  .tp-metric-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
  .tp-metric-num { font-size: 26px; font-weight: 800; color: #0f172a; }
  .tp-metric-icon { font-size: 18px; }
  .tp-metric-label { font-size: 12.5px; font-weight: 600; color: #64748b; }

  /* ── Transit Pipeline Tracker Panel ── */
  .tp-pipeline-panel {
    background: #ffffff;
    border-radius: 20px;
    border: 1px solid #e2e8f0;
    padding: 32px;
    margin-bottom: 40px;
    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.02);
  }

  /* Map Progress Track CSS */
  .tp-map-track {
    background: #f0fdf4;
    border: 1px dashed #bbf7d0;
    border-radius: 14px;
    padding: 16px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 36px;
  }
  .tp-track-station { background: #fff; border: 1px solid #cbd5e1; padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 700; color: #475569; }
  .tp-track-station.active { border-color: #0ea5e9; color: #0ea5e9; background: #f0f9ff; }
  .tp-track-station.active-end { border-color: #ef4444; color: #ef4444; background: #fef2f2; }
  
  .tp-track-line-segment {
    flex: 1; height: 4px; background: linear-gradient(90deg, #0ea5e9, #f97316, #ef4444);
    margin: 0 12px; position: relative; border-radius: 2px;
  }
  .tp-boat-emoji { position: absolute; top: -14px; left: 40%; font-size: 14px; animation: waveFloat 3s ease-in-out infinite; }
  @keyframes waveFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }

  /* Departments Stack Elements */
  .tp-departments-stack {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
  }
  .tp-dept-section {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    overflow: hidden;
  }
  .tp-dept-banner {
    padding: 12px 18px;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .tp-dept-badge-title { font-family: 'IBM Plex Mono', monospace; font-size: 9px; font-weight: 600; opacity: 0.85; letter-spacing: 0.05em; }
  .tp-dept-name { margin: 0; font-size: 14px; font-weight: 700; }

  .tp-crew-rows { padding: 12px; display: flex; flex-direction: column; gap: 8px; }
  
  .tp-crew-row {
    display: flex; align-items: center; background: #ffffff;
    border: 1px solid #e2e8f0; padding: 10px 14px; border-radius: 10px;
    transition: transform 0.2s, border-color 0.2s;
  }
  .tp-crew-row:hover { transform: translateX(2px); border-color: #cbd5e1; }
  
  .tp-crew-avatar {
    width: 34px; height: 34px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; margin-right: 12px;
  }
  .tp-crew-info { flex: 1; display: flex; flex-direction: column; }
  .tp-crew-name { font-size: 13px; font-weight: 700; color: #1e293b; }
  .tp-crew-role { font-size: 11px; color: #94a3b8; font-weight: 500; }
  .tp-crew-number { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: #94a3b8; font-weight: 600; }

  /* ── Footer Clearance Protocol ── */
  .tp-footer-protocol {
    background: rgba(255, 255, 255, 0.6);
    border: 1px solid rgba(226, 232, 240, 0.8);
    backdrop-filter: blur(8px);
    border-radius: 16px;
    padding: 24px;
  }
  .tp-stamp-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
  .tp-digital-stamp { display: flex; align-items: center; gap: 12px; }
  .tp-stamp-icon { font-size: 24px; }
  .tp-digital-stamp strong { display: block; font-size: 12px; color: #334155; font-weight: 800; }
  .tp-digital-stamp p { margin: 0; font-size: 11px; color: #94a3b8; font-weight: 500; }
  .tp-island-icon { font-size: 22px; filter: grayscale(0.2); }
  
  .tp-protocol-text { margin: 0; font-size: 12px; color: #64748b; line-height: 1.6; }

  /* ── Responsive Optimization ── */
  @media (max-width: 640px) {
    .tp-manifest-main, .tp-manifest-ticket-stub { padding: 24px; }
    .tp-manifest-ticket-stub { border-left: none; border-top: 2px dashed #e2e8f0; }
    .tp-manifest-ticket-stub::before, .tp-manifest-ticket-stub::after { left: auto; top: -10px; }
    .tp-manifest-ticket-stub::before { left: -10px; }
    .tp-manifest-ticket-stub::after { right: -10px; }
    .tp-pipeline-panel { padding: 16px; }
    .tp-map-track { display: none; }
    .tp-metrics-grid { grid-template-columns: repeat(2, 1fr); }
  }
`;