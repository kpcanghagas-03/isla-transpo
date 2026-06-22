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
    id: "leadership",
    label: "Leadership & Coordination",
    accent: "#1F5AA6",
    members: ["John Paul T. Balistoy", "Junvee O. Barbadillo"],
  },
  {
    id: "finance",
    label: "Finance & Administration",
    accent: "#4C9FD6",
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
  const stops = DEPARTMENTS.map((d) => ({
    ...d,
    crew: d.members.map((name) => ({ name, no: ++counter })),
  }));
  const totalCrew = counter;

  return (
    <main className="tp-page">
      <style jsx>{CSS}</style>

      {/* faint corner color, borrowed straight from the homepage's decorations */}
      <div className="tp-blob tp-blob-tr" />
      <div className="tp-blob tp-blob-bl" />

      <div className="tp-wrap">
        <button className="tp-back" onClick={() => router.push("/")}>
          ← Back to Home
        </button>

        {/* ================= HERO TICKET ================= */}
        <div className="tp-ticket">
          <span className="tp-notchL" />
          <span className="tp-notchR" />

          <div className="tp-ticketMain">
            <span className="tp-eyebrow">CREW BOARDING PASS</span>
            <h1 className="tp-title">Transportation Team</h1>
            <p className="tp-subcopy">
              Behind every request, route, and pickup is a person working the
              line. Meet the crew keeping ISLA-TRANSPO moving for RSTW 2026
              on Camiguin Island.
            </p>
          </div>

          <div className="tp-stub">
            <div>
              <span className="tp-stubLabel">Route</span>
              <span className="tp-stubValue">CMG → RSTW26</span>
            </div>
            <div>
              <span className="tp-stubLabel">Dates</span>
              <span className="tp-stubValue">JUL 22–24, 2026</span>
            </div>
            <div>
              <span className="tp-stubLabel">Crew</span>
              <span className="tp-stubValue">{String(totalCrew).padStart(2, "0")} ABOARD</span>
            </div>
          </div>
        </div>

        {/* ================= GATE STATS ================= */}
        <div className="tp-gates">
          <div className="tp-gate">
            <span className="tp-gateVal" style={{ color: "#1F5AA6" }}>{totalCrew}</span>
            <span className="tp-gateLabel">Team members</span>
          </div>
          <div className="tp-gate">
            <span className="tp-gateVal" style={{ color: "#F27A35" }}>{stops.length}</span>
            <span className="tp-gateLabel">Departments</span>
          </div>
          <div className="tp-gate">
            <span className="tp-gateVal" style={{ color: "#A61E22" }}>1</span>
            <span className="tp-gateLabel">Shared mission</span>
          </div>
          <div className="tp-gate">
            <span className="tp-gateVal" style={{ color: "#1F5AA6" }}>∞</span>
            <span className="tp-gateLabel">Commitment</span>
          </div>
        </div>

        {/* ================= ROUTE / ROSTER ================= */}
        <div className="tp-routePanel">
          <div className="tp-route">
            {stops.map((stop, i) => (
              <section className="tp-stop" key={stop.id}>
                <span className="tp-stopDot" style={{ background: stop.accent }} />
                <span className="tp-stopEyebrow" style={{ color: stop.accent }}>
                  STOP {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="tp-stopTitle">{stop.label}</h2>

                <div className="tp-crewGrid">
                  {stop.crew.map((person) => (
                    <article className="tp-badge" key={person.name}>
                      <div className="tp-badgeTop">
                        <span className="tp-badgeSeal" style={{ background: `${stop.accent}1c`, color: stop.accent }}>
                          {initials(person.name)}
                        </span>
                        <span className="tp-badgeNo">
                          {String(person.no).padStart(2, "0")}/{String(totalCrew).padStart(2, "0")}
                        </span>
                      </div>
                      <h3 className="tp-badgeName">{person.name}</h3>
                      <div className="tp-badgeFoot">
                        <span style={{ color: stop.accent }}>{stop.label}</span>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}

            <div className="tp-endOfLine">
              <span className="tp-endDot" />
              <span>END OF LINE</span>
            </div>
          </div>
        </div>

        {/* ================= THANK YOU ================= */}
        <div className="tp-thanks">
          <span className="tp-stamp">VALIDATED</span>
          <h2 className="tp-thanksTitle">Thank You</h2>
          <p className="tp-thanksCopy">
            Every request fulfilled, every attendee assisted, and every trip
            coordinated reflects the work of the people on this roster.
            ISLA-TRANSPO runs because they showed up.
          </p>
        </div>
      </div>
    </main>
  );
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;700&family=IBM+Plex+Mono:wght@500;600&display=swap');

  .tp-page {
    position: relative;
    min-height: 100vh;
    overflow: hidden;
    background: linear-gradient(180deg,#ffffff 0%,#f8fafc 50%,#ffffff 100%);
    font-family: 'Segoe UI', system-ui, sans-serif;
  }

  .tp-blob {
    position: absolute;
    border-radius: 50%;
    opacity: 0.07;
    pointer-events: none;
  }
  .tp-blob-tr { top: -90px; right: -90px; width: 320px; height: 320px; background: conic-gradient(#F27A35,#A61E22,#1F5AA6,#F27A35); }
  .tp-blob-bl { bottom: -120px; left: -120px; width: 350px; height: 350px; background: conic-gradient(#1F5AA6,#F27A35,#A61E22,#1F5AA6); }

  .tp-wrap { max-width: 880px; margin: 0 auto; padding: 56px 20px 80px; position: relative; z-index: 2; }

  .tp-back {
    border: none; cursor: pointer; background: #fff;
    padding: 9px 18px; border-radius: 999px;
    color: #1F5AA6; font-weight: 700; font-size: 13px;
    box-shadow: 0 4px 14px rgba(0,0,0,.08);
    margin-bottom: 28px;
  }
  .tp-back:focus-visible { outline: 2px solid #F27A35; outline-offset: 3px; }

  /* ── Hero ticket ── */
  .tp-ticket {
    position: relative;
    background: #fff;
    border: 1.5px dashed #FDBA74;
    border-radius: 26px;
    box-shadow: 0 18px 44px rgba(0,0,0,.07);
    margin-bottom: 28px;
    overflow: hidden;
  }
  .tp-ticketMain { padding: 40px 36px 28px; }
  .tp-eyebrow {
    display: inline-block;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.14em;
    color: #EA580C;
    background: #FFF7ED;
    border: 1px solid #FDBA74;
    border-radius: 999px;
    padding: 4px 12px;
    margin-bottom: 18px;
  }
  .tp-title {
    font-family: 'Oswald', sans-serif;
    text-transform: uppercase;
    font-weight: 700;
    letter-spacing: 0.01em;
    font-size: clamp(32px, 6vw, 52px);
    line-height: 1.05;
    margin: 0 0 14px;
    background: linear-gradient(90deg,#F27A35,#A61E22,#1F5AA6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .tp-subcopy { color: #64748B; line-height: 1.75; font-size: 15px; max-width: 560px; margin: 0; }

  .tp-stub {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: space-between;
    background: #FFF7ED;
    border-top: 1.5px dashed #FDBA74;
    padding: 18px 36px;
  }
  .tp-stub > div { display: flex; flex-direction: column; gap: 3px; }
  .tp-stubLabel { font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: #C2783D; font-weight: 700; }
  .tp-stubValue { font-family: 'IBM Plex Mono', monospace; font-size: 13px; color: #EA580C; font-weight: 600; }

  .tp-notchL, .tp-notchR {
    position: absolute;
    width: 22px; height: 22px;
    border-radius: 50%;
    background: #f8fafc;
    z-index: 3;
  }
  .tp-notchL { left: -11px; }
  .tp-notchR { right: -11px; }

  /* ── Gate stats ── */
  .tp-gates {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 12px;
    margin-bottom: 36px;
  }
  .tp-gate {
    background: #FFF7ED;
    border: 1px dashed #FDBA74;
    border-radius: 16px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .tp-gateVal { font-family: 'IBM Plex Mono', monospace; font-weight: 600; font-size: 24px; }
  .tp-gateLabel { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #94806B; }

  /* ── Route panel ── */
  .tp-routePanel {
    background: #FFF7ED;
    border: 1px solid #FDBA74;
    border-radius: 28px;
    padding: 36px 32px;
    margin-bottom: 28px;
  }
  .tp-route {
    position: relative;
    margin-left: 6px;
    padding-left: 30px;
    border-left: 3px dashed #F2A35F;
  }
  .tp-stop { position: relative; margin-bottom: 48px; }
  .tp-stop:last-of-type { margin-bottom: 24px; }

  .tp-stopDot {
    position: absolute;
    left: -39px;
    top: 3px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    box-shadow: 0 0 0 5px #FFF7ED;
  }
  .tp-stopEyebrow {
    display: block;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.1em;
    margin-bottom: 4px;
  }
  .tp-stopTitle {
    font-family: 'Oswald', sans-serif;
    text-transform: uppercase;
    font-size: clamp(18px, 3vw, 22px);
    color: #1F2937;
    margin: 0 0 16px;
  }

  .tp-crewGrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; }

  .tp-badge {
    position: relative;
    background: #fff;
    border-radius: 14px;
    padding: 16px 16px 12px;
    box-shadow: 0 6px 16px rgba(0,0,0,.05);
  }
  .tp-badgeTop { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
  .tp-badgeSeal {
    width: 36px; height: 36px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Oswald', sans-serif; font-weight: 700; font-size: 13px;
  }
  .tp-badgeNo { font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: #94A3B8; }
  .tp-badgeName { font-size: 14px; font-weight: 600; color: #0F172A; margin: 0 0 8px; line-height: 1.4; }
  .tp-badgeFoot {
    font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em;
    border-top: 1px dashed #E5DACB; padding-top: 8px;
  }

  .tp-endOfLine {
    display: flex; align-items: center; gap: 10px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px; letter-spacing: 0.1em; color: #C2783D;
  }
  .tp-endDot {
    width: 11px; height: 11px; border-radius: 50%;
    border: 2px solid #F2A35F; margin-left: -34px;
  }

  /* ── Thank you ── */
  .tp-thanks {
    position: relative;
    background: #fff;
    border-radius: 24px;
    padding: 36px 32px;
    text-align: center;
    box-shadow: 0 10px 28px rgba(0,0,0,.07);
  }
  .tp-stamp {
    position: absolute; top: 20px; right: 22px;
    font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.1em;
    color: #1F5AA6; border: 1.5px solid #1F5AA6; border-radius: 999px;
    padding: 4px 10px; transform: rotate(8deg);
  }
  .tp-thanksTitle { font-family: 'Oswald', sans-serif; text-transform: uppercase; font-size: 24px; margin: 0 0 12px; color: #0F172A; }
  .tp-thanksCopy { color: #64748B; line-height: 1.75; max-width: 560px; margin: 0 auto; font-size: 14px; }

  /* ── Mobile ── */
  @media (max-width: 640px) {
    .tp-wrap { padding: 40px 14px 56px; }
    .tp-ticketMain { padding: 30px 22px 22px; }
    .tp-stub { padding: 16px 22px; }
    .tp-routePanel { padding: 26px 18px; }
    .tp-route { margin-left: 2px; padding-left: 22px; }
    .tp-stopDot { left: -31px; }
    .tp-endDot { margin-left: -26px; }
    .tp-crewGrid { grid-template-columns: 1fr; }
    .tp-gates { grid-template-columns: repeat(2, 1fr); }
  }
`;
