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
    accent: "#1F5AA6",
    members: ["John Paul T. Balistoy", "Junvee O. Barbadillo", "Marc Mana"],
  },
  {
    id: "development",
    label: "System Development",
    accent: "#F27A35",
    members: ["Karen P. Canghagas", "Arjay A. Charcos"],
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

      {/* Camiguin ambient layers */}
      <div className="tp-sea" />
      <div className="tp-volcanoGlow" />

      <div className="tp-wrap">
        <button className="tp-back" onClick={() => router.push("/")}>
          ← Return to Home
        </button>

        {/* HERO PASS */}
        <div className="tp-ticket">
          <span className="tp-notchL" />
          <span className="tp-notchR" />

          <div className="tp-ticketMain">
            <span className="tp-eyebrow">TRANSPO SA ISLA • CAMIGUIN ROUTE PASS</span>
            <h1 className="tp-title">Transportation Team</h1>
            <p className="tp-subcopy">
              A coordinated island expedition network built for RSTW 2026.
              Every member here is part of the movement behind Camiguin’s transport flow.
            </p>
          </div>

          <div className="tp-stub">
            <div>
              <span className="tp-stubLabel">Route</span>
              <span className="tp-stubValue">Camiguin → RSTW 2026</span>
            </div>
            <div>
              <span className="tp-stubLabel">Window</span>
              <span className="tp-stubValue">JUL 22–24</span>
            </div>
            <div>
              <span className="tp-stubLabel">Crew</span>
              <span className="tp-stubValue">{String(totalCrew).padStart(2, "0")} OPERATIVES</span>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="tp-gates">
          <div className="tp-gate">
            <span className="tp-gateVal c-blue">{totalCrew}</span>
            <span className="tp-gateLabel">Team members</span>
          </div>
          <div className="tp-gate">
            <span className="tp-gateVal c-orange">{stops.length}</span>
            <span className="tp-gateLabel">Departments</span>
          </div>
          <div className="tp-gate">
            <span className="tp-gateVal c-red">1</span>
            <span className="tp-gateLabel">Unified system</span>
          </div>
          <div className="tp-gate">
            <span className="tp-gateVal c-blue">∞</span>
            <span className="tp-gateLabel">Commitment</span>
          </div>
        </div>

        {/* ROUTE */}
        <div className="tp-routePanel">
          <div className="tp-route">
            {stops.map((stop, i) => (
              <section className="tp-stop" key={stop.id}>
                <span className="tp-stopDot" style={{ background: stop.accent }} />

                <span className="tp-stopEyebrow" style={{ color: stop.accent }}>
                  STATION {String(i + 1).padStart(2, "0")}
                </span>

                <h2 className="tp-stopTitle">{stop.label}</h2>

                <div className="tp-crewGrid">
                  {stop.crew.map((person) => (
                    <article className="tp-badge" key={person.name}>
                      <div className="tp-badgeTop">
                        <span
                          className="tp-badgeSeal"
                          style={{
                            background: `${stop.accent}22`,
                            color: stop.accent,
                            boxShadow: `0 0 0 6px ${stop.accent}10`,
                          }}
                        >
                          {initials(person.name)}
                        </span>

                        <span className="tp-badgeNo">
                          {String(person.no).padStart(2, "0")} / {String(totalCrew).padStart(2, "0")}
                        </span>
                      </div>

                      <h3 className="tp-badgeName">{person.name}</h3>

                      <div className="tp-badgeFoot" style={{ color: stop.accent }}>
                        {stop.label}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}

            <div className="tp-endOfLine">END OF LINE</div>
          </div>
        </div>

        {/* THANK YOU */}
        <div className="tp-thanks">
          <span className="tp-stamp">CAMIGUIN VERIFIED</span>
          <h2 className="tp-thanksTitle">Thank You Crew</h2>
          <p className="tp-thanksCopy">
            Every route coordinated, every passenger assisted, and every operation executed
            is part of a unified island transport effort.
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
  background: radial-gradient(circle at top, #ffffff 0%, #f6fbff 40%, #ffffff 100%);
  font-family: system-ui, sans-serif;
}

/* Camiguin atmosphere */
.tp-sea {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 20% 10%, rgba(31,90,166,0.12), transparent 40%),
              radial-gradient(circle at 80% 90%, rgba(242,122,53,0.10), transparent 45%);
  pointer-events: none;
}

.tp-volcanoGlow {
  position: absolute;
  width: 500px;
  height: 500px;
  top: -200px;
  right: -200px;
  background: conic-gradient(#F27A35,#A61E22,#1F5AA6,#F27A35);
  opacity: 0.05;
  filter: blur(40px);
}

/* layout */
.tp-wrap {
  max-width: 900px;
  margin: 0 auto;
  padding: 56px 20px;
  position: relative;
  z-index: 2;
}

.tp-back {
  background: white;
  border: 1px solid #e5e7eb;
  padding: 10px 16px;
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 24px;
}

/* HERO */
.tp-ticket {
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(10px);
  border: 1px solid #f0d7c3;
  border-radius: 26px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.08);
  overflow: hidden;
}

.tp-ticketMain {
  padding: 42px 36px 24px;
}

.tp-eyebrow {
  font-family: IBM Plex Mono;
  font-size: 11px;
  letter-spacing: .14em;
  color: #EA580C;
}

.tp-title {
  font-family: Oswald;
  font-size: 46px;
  margin: 12px 0;
  background: linear-gradient(90deg,#1F5AA6,#F27A35,#A61E22);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.tp-subcopy {
  color: #64748B;
  max-width: 600px;
  line-height: 1.7;
}

/* stub */
.tp-stub {
  display: flex;
  justify-content: space-between;
  padding: 18px 36px;
  background: #fff4e8;
  border-top: 1px dashed #f2b38a;
}

.tp-stubLabel {
  font-size: 10px;
  color: #b45309;
}

.tp-stubValue {
  font-family: IBM Plex Mono;
  color: #ea580c;
}

/* stats */
.tp-gates {
  display: grid;
  grid-template-columns: repeat(4,1fr);
  gap: 12px;
  margin: 28px 0;
}

.tp-gate {
  background: white;
  border: 1px dashed #e5e7eb;
  padding: 14px;
  border-radius: 14px;
}

.tp-gateVal {
  font-family: IBM Plex Mono;
  font-size: 22px;
}

.c-blue { color:#1F5AA6 }
.c-orange { color:#F27A35 }
.c-red { color:#A61E22 }

.tp-gateLabel {
  font-size: 11px;
  color: #6b7280;
}

/* route */
.tp-routePanel {
  background: #fffaf5;
  border-radius: 26px;
  padding: 34px;
  border: 1px solid #f2c9a8;
}

.tp-route {
  border-left: 3px dashed #f2a35f;
  padding-left: 26px;
}

.tp-stop {
  margin-bottom: 42px;
  position: relative;
}

.tp-stopDot {
  position: absolute;
  left: -34px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.tp-stopTitle {
  font-family: Oswald;
  text-transform: uppercase;
}

.tp-crewGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill,minmax(220px,1fr));
  gap: 12px;
  margin-top: 14px;
}

.tp-badge {
  background: white;
  border-radius: 14px;
  padding: 14px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.06);
  transition: 0.25s ease;
}

.tp-badge:hover {
  transform: translateY(-3px);
}

.tp-badgeSeal {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display:flex;
  align-items:center;
  justify-content:center;
  font-weight:700;
}

.tp-badgeName {
  font-size: 14px;
  font-weight: 600;
}

.tp-endOfLine {
  text-align:center;
  margin-top: 20px;
  font-family: IBM Plex Mono;
  color: #c2410c;
}

/* thanks */
.tp-thanks {
  margin-top: 26px;
  text-align: center;
  padding: 30px;
  background: white;
  border-radius: 22px;
}

.tp-stamp {
  font-family: IBM Plex Mono;
  border: 1px solid #1F5AA6;
  padding: 4px 10px;
  font-size: 11px;
  position: absolute;
  right: 30px;
  top: 20px;
}

.tp-thanksTitle {
  font-family: Oswald;
}

/* mobile */
@media (max-width:640px){
  .tp-gates{grid-template-columns:1fr 1fr}
}
`;