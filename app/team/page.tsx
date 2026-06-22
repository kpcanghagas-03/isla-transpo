"use client";

import { useRouter } from "next/navigation";

type Stop = {
  id: string;
  label: string;
  accent: string;
  members: string[];
};

const STOPS: Stop[] = [
  {
    id: "leadership",
    label: "Leadership & Coordination",
    accent: "#4C9FD6",
    members: ["John Paul T. Balistoy", "Junvee O. Barbadillo"],
  },
  {
    id: "finance",
    label: "Finance & Administration",
    accent: "#16A34A",
    members: ["Marc Mana"],
  },
  {
    id: "development",
    label: "System Development",
    accent: "#F27A35",
    members: ["Karen Canghagas", "Arjay A. Charcos"],
  },
  {
    id: "operations",
    label: "Transportation Operations",
    accent: "#A61E22",
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
  const stops = STOPS.map((stop) => ({
    ...stop,
    crew: stop.members.map((name) => ({ name, no: ++counter })),
  }));
  const totalCrew = counter;

  return (
    <main className="page">
      <style jsx>{CSS}</style>

      {/* ================= TERMINAL (dark header + roster) ================= */}
      <div className="terminal">
        <div className="terminalInner">
          <button className="backBtn" onClick={() => router.push("/")}>
            ← Back to Home
          </button>

          <div className="ticker">
            <span>CAMIGUIN ISLAND&nbsp;&nbsp;•&nbsp;&nbsp;RSTW 2026&nbsp;&nbsp;•&nbsp;&nbsp;GROUND TRANSPORT DIVISION&nbsp;&nbsp;•&nbsp;&nbsp;CREW MANIFEST&nbsp;&nbsp;•&nbsp;&nbsp;</span>
            <span aria-hidden="true">CAMIGUIN ISLAND&nbsp;&nbsp;•&nbsp;&nbsp;RSTW 2026&nbsp;&nbsp;•&nbsp;&nbsp;GROUND TRANSPORT DIVISION&nbsp;&nbsp;•&nbsp;&nbsp;CREW MANIFEST&nbsp;&nbsp;•&nbsp;&nbsp;</span>
          </div>

          <h1 className="title">Transportation Team</h1>

          <p className="subcopy">
            Behind every request, route, and pickup is a crew working the line.
            This is the roster keeping ISLA-TRANSPO moving for RSTW 2026 on
            Camiguin Island.
          </p>

          <div className="board">
            <div className="boardCell">
              <span className="boardDigit">{totalCrew}</span>
              <span className="boardLabel">Crew on roster</span>
            </div>
            <div className="boardCell">
              <span className="boardDigit">{stops.length}</span>
              <span className="boardLabel">Departments</span>
            </div>
            <div className="boardCell">
              <span className="boardDigit">1</span>
              <span className="boardLabel">Shared mission</span>
            </div>
            <div className="boardCell">
              <span className="boardDigit">∞</span>
              <span className="boardLabel">Commitment to service</span>
            </div>
          </div>

          {/* ================= ROUTE / ROSTER ================= */}
          <div className="route">
            {stops.map((stop, i) => (
              <section className="stop" key={stop.id}>
                <span className="stopDot" style={{ background: stop.accent }} />
                <div className="stopHead">
                  <span className="stopEyebrow" style={{ color: stop.accent }}>
                    STOP {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="stopTitle">{stop.label}</h2>
                </div>

                <div className="crewGrid">
                  {stop.crew.map((person) => (
                    <article className="badge" key={person.name}>
                      <div className="badgeTop">
                        <span
                          className="badgeSeal"
                          style={{ background: `${stop.accent}22`, color: stop.accent }}
                        >
                          {initials(person.name)}
                        </span>
                        <span className="badgeNo">
                          NO. {String(person.no).padStart(2, "0")}/{String(totalCrew).padStart(2, "0")}
                        </span>
                      </div>

                      <h3 className="badgeName">{person.name}</h3>

                      <div className="badgeFoot">
                        <span className="badgeRole">{stop.label}</span>
                        <span className="badgeBars" aria-hidden="true">
                          {Array.from({ length: 9 }).map((_, j) => (
                            <span key={j} style={{ height: 6 + ((j * 7) % 11) }} />
                          ))}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}

            <div className="endOfLine">
              <span className="endDot" />
              <span>END OF LINE — DEPOT</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= THANK YOU TICKET ================= */}
      <section className="ticketSection">
        <div className="ticket">
          <span className="stamp">VALIDATED</span>
          <h2 className="ticketTitle">Thank You</h2>
          <p className="ticketCopy">
            Every request fulfilled, every attendee assisted, and every trip
            coordinated reflects the work of the crew on this manifest.
            ISLA-TRANSPO runs because they showed up.
          </p>
          <div className="ticketStub">
            <span>ISLA-TRANSPO</span>
            <span>RSTW 2026</span>
          </div>
        </div>
      </section>
    </main>
  );
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap');

  .page {
    background: #F5F7FA;
    font-family: 'Inter', system-ui, sans-serif;
    color: #0F172A;
  }

  /* ── Terminal panel ── */
  .terminal {
    background: #0B2545;
    background-image: radial-gradient(circle at 15% 0%, rgba(76,159,214,0.18), transparent 55%),
      radial-gradient(circle at 85% 30%, rgba(242,122,53,0.10), transparent 50%);
  }
  .terminalInner {
    max-width: 1100px;
    margin: 0 auto;
    padding: 28px 20px 64px;
  }

  .backBtn {
    border: none;
    cursor: pointer;
    background: #fff;
    padding: 9px 18px;
    border-radius: 999px;
    color: #1F5AA6;
    font-weight: 700;
    font-size: 13px;
    box-shadow: 0 4px 14px rgba(0,0,0,.18);
  }
  .backBtn:focus-visible { outline: 2px solid #F27A35; outline-offset: 3px; }

  .ticker {
    margin-top: 28px;
    overflow: hidden;
    white-space: nowrap;
    border-top: 1px solid rgba(255,255,255,0.15);
    border-bottom: 1px solid rgba(255,255,255,0.15);
    padding: 9px 0;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.08em;
    color: #F2A35F;
  }
  .ticker span { display: inline-block; }
  @media (prefers-reduced-motion: no-preference) {
    .ticker { display: flex; }
    .ticker span { animation: ticker-scroll 22s linear infinite; }
    @keyframes ticker-scroll {
      from { transform: translateX(0); }
      to { transform: translateX(-100%); }
    }
  }

  .title {
    font-family: 'Oswald', sans-serif;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.01em;
    font-size: clamp(36px, 7vw, 64px);
    color: #fff;
    margin: 26px 0 14px;
    line-height: 1.05;
  }

  .subcopy {
    color: rgba(255,255,255,0.68);
    line-height: 1.75;
    font-size: 15px;
    max-width: 620px;
    margin: 0 0 32px;
  }

  .board {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 1px;
    background: rgba(255,255,255,0.1);
    border-radius: 14px;
    overflow: hidden;
    margin-bottom: 56px;
  }
  .boardCell {
    background: #102C54;
    padding: 18px 16px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .boardDigit {
    font-family: 'IBM Plex Mono', monospace;
    font-weight: 600;
    font-size: 26px;
    color: #F27A35;
  }
  .boardLabel {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: rgba(255,255,255,0.5);
  }

  /* ── Route / roster ── */
  .route {
    position: relative;
    margin-left: 9px;
    padding-left: 34px;
    border-left: 3px dashed rgba(255,255,255,0.22);
  }

  .stop { position: relative; margin-bottom: 56px; }
  .stop:last-of-type { margin-bottom: 32px; }

  .stopDot {
    position: absolute;
    left: -45px;
    top: 4px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    box-shadow: 0 0 0 5px #0B2545;
  }

  .stopHead { margin-bottom: 18px; }
  .stopEyebrow {
    display: block;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.12em;
    margin-bottom: 4px;
  }
  .stopTitle {
    font-family: 'Oswald', sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.01em;
    font-size: clamp(20px, 3vw, 26px);
    color: #fff;
    margin: 0;
  }

  .crewGrid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
    gap: 14px;
  }

  .badge {
    position: relative;
    background: #EFF3F8;
    border-radius: 12px;
    padding: 18px 16px 14px;
    overflow: hidden;
  }
  .badge::before {
    content: '';
    position: absolute;
    top: -1px;
    left: 0;
    right: 0;
    height: 9px;
    background-image: radial-gradient(circle, #0B2545 4px, transparent 4.5px);
    background-size: 16px 16px;
    background-position: 0 -4px;
  }

  .badgeTop {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }
  .badgeSeal {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Oswald', sans-serif;
    font-weight: 700;
    font-size: 14px;
  }
  .badgeNo {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    color: #64748B;
    letter-spacing: 0.02em;
  }

  .badgeName {
    font-size: 15px;
    font-weight: 600;
    color: #0F172A;
    margin: 0 0 14px;
    line-height: 1.4;
  }

  .badgeFoot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    border-top: 1px dashed #CBD5E1;
    padding-top: 10px;
  }
  .badgeRole {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #64748B;
    font-weight: 600;
  }
  .badgeBars {
    display: flex;
    align-items: flex-end;
    gap: 2px;
    flex-shrink: 0;
  }
  .badgeBars span {
    width: 2px;
    background: #94A3B8;
    display: block;
  }

  .endOfLine {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.12em;
    color: rgba(255,255,255,0.4);
  }
  .endDot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: transparent;
    border: 2px solid rgba(255,255,255,0.4);
    margin-left: -39px;
  }

  /* ── Thank-you ticket ── */
  .ticketSection {
    max-width: 1100px;
    margin: 0 auto;
    padding: 56px 20px 80px;
    display: flex;
    justify-content: center;
  }
  .ticket {
    position: relative;
    background: #fff;
    border: 1.5px dashed #CBD5E1;
    border-radius: 18px;
    padding: 40px 36px;
    max-width: 620px;
    text-align: center;
    box-shadow: 0 14px 40px rgba(15,23,42,0.08);
  }
  .stamp {
    position: absolute;
    top: 22px;
    right: 24px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.1em;
    color: #16A34A;
    border: 1.5px solid #16A34A;
    border-radius: 999px;
    padding: 4px 10px;
    transform: rotate(8deg);
  }
  .ticketTitle {
    font-family: 'Oswald', sans-serif;
    text-transform: uppercase;
    font-size: 28px;
    margin: 0 0 14px;
    color: #0F172A;
  }
  .ticketCopy {
    color: #475569;
    line-height: 1.75;
    margin: 0 0 24px;
    font-size: 15px;
  }
  .ticketStub {
    display: flex;
    justify-content: space-between;
    border-top: 1px dashed #CBD5E1;
    padding-top: 14px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.08em;
    color: #94A3B8;
  }

  /* ── Mobile ── */
  @media (max-width: 640px) {
    .terminalInner { padding: 22px 16px 48px; }
    .route { margin-left: 4px; padding-left: 26px; }
    .stopDot { left: -36px; width: 14px; height: 14px; }
    .endDot { margin-left: -31px; }
    .crewGrid { grid-template-columns: 1fr; }
    .board { grid-template-columns: repeat(2, 1fr); }
    .ticket { padding: 32px 22px; }
  }
`;
