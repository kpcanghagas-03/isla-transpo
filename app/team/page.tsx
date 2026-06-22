"use client";

import { useRouter } from "next/navigation";

export default function TeamPage() {
  const router = useRouter();

  const leaders = [
    "John Paul T. Balistoy",
    "Junvee O. Barbadillo",
  ];

  const developers = [
    "Karen Canghagas",
    "Arjay A. Charcos",
  ];

  const finance = [
    "Marc Mana",
  ];

  const operations = [
    "Lino A. Gorres Jr.",
    "Ramil M. Cañeda",
    "Ernesto A. Soliva",
    "Pablito D. Murillo",
    "Francisco F. Talle Jr.",
    "Leonel V. Quidet",
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg,#ffffff 0%,#f8fafc 50%,#ffffff 100%)",
        fontFamily: "Segoe UI, system-ui, sans-serif",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Background Decorations */}
      <div
        style={{
          position: "absolute",
          top: -120,
          right: -120,
          width: 320,
          height: 320,
          borderRadius: "50%",
          background:
            "conic-gradient(#F27A35,#A61E22,#1F5AA6,#F27A35)",
          opacity: 0.06,
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: -120,
          left: -120,
          width: 350,
          height: 350,
          borderRadius: "50%",
          background:
            "conic-gradient(#1F5AA6,#F27A35,#A61E22,#1F5AA6)",
          opacity: 0.06,
        }}
      />

      {/* Header */}
      <section
        style={{
          textAlign: "center",
          padding: "70px 20px 30px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <button
          onClick={() => router.push("/")}
          style={{
            marginBottom: 30,
            border: "none",
            cursor: "pointer",
            background: "#fff",
            padding: "10px 18px",
            borderRadius: 999,
            color: "#1F5AA6",
            fontWeight: 700,
            boxShadow: "0 4px 14px rgba(0,0,0,.08)",
          }}
        >
          ← Back to Home
        </button>

        <h1
          style={{
            fontSize: "clamp(42px,8vw,72px)",
            fontWeight: 900,
            marginBottom: 16,
            background:
              "linear-gradient(90deg,#F27A35,#A61E22,#1F5AA6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Transportation Team
        </h1>

        <p
          style={{
            maxWidth: 750,
            margin: "0 auto",
            color: "#64748B",
            lineHeight: 1.8,
            fontSize: 16,
          }}
        >
          Behind every successful transportation request, schedule,
          route, and coordination effort is a dedicated team committed
          to delivering a seamless mobility experience during
          RSTW 2026 in Camiguin Island.
        </p>
      </section>

      {/* Recognition Banner */}
      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto 30px",
          padding: "0 16px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            borderRadius: 24,
            padding: "28px",
            background:
              "linear-gradient(135deg,#1F5AA6,#4C9FD6)",
            color: "white",
            textAlign: "center",
            boxShadow: "0 10px 30px rgba(31,90,166,.20)",
          }}
        >
          <h2
            style={{
              marginBottom: 12,
              fontSize: 24,
              fontWeight: 800,
            }}
          >
            The People Behind ISLA-TRANSPO
          </h2>

          <p
            style={{
              maxWidth: 800,
              margin: "0 auto",
              lineHeight: 1.8,
              opacity: 0.95,
            }}
          >
            ISLA-TRANSPO was made possible through collaboration,
            innovation, and service. We proudly recognize the
            individuals whose efforts contribute to transportation
            management, operations, and digital transformation
            for RSTW 2026.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto 35px",
          padding: "0 16px",
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: 16,
        }}
      >
        <StatCard title="11" subtitle="Team Members" />
        <StatCard title="1" subtitle="Transportation System" />
        <StatCard title="3" subtitle="Core Groups" />
        <StatCard title="∞" subtitle="Commitment to Service" />
      </section>

      {/* Team Sections */}
      <TeamSection
        title="Leadership & Coordination"
        color="#1F5AA6"
        members={leaders}
      />

      <TeamSection
        title="Finance & Administration"
        color="#16A34A"
        members={finance}
        />

      <TeamSection
        title="System Development"
        color="#F27A35"
        members={developers}
      />

      <TeamSection
        title="Transportation Operations"
        color="#A61E22"
        members={operations}
      />

      {/* Appreciation */}
      <section
        style={{
          maxWidth: 1100,
          margin: "40px auto",
          padding: "0 16px",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 24,
            padding: "32px",
            textAlign: "center",
            boxShadow: "0 10px 28px rgba(0,0,0,.08)",
          }}
        >
          <h2
            style={{
              color: "#1F2937",
              marginBottom: 12,
            }}
          >
            Thank You
          </h2>

          <p
            style={{
              color: "#64748B",
              lineHeight: 1.8,
              maxWidth: 800,
              margin: "0 auto",
            }}
          >
            Every transportation request fulfilled, every attendee
            assisted, and every successful trip coordinated reflects
            the teamwork and dedication of the individuals recognized
            on this page.
          </p>
        </div>
      </section>
    </main>
  );
}

function TeamSection({
  title,
  members,
  color,
}: {
  title: string;
  members: string[];
  color: string;
}) {
  return (
    <section
      style={{
        maxWidth: 1100,
        margin: "0 auto 28px",
        padding: "0 16px",
      }}
    >
      <h2
        style={{
          marginBottom: 18,
          color,
          fontSize: 24,
          fontWeight: 800,
        }}
      >
        {title}
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(240px,1fr))",
          gap: 16,
        }}
      >
        {members.map((member) => (
          <div
            key={member}
            style={{
              background: "#fff",
              borderRadius: 22,
              padding: "22px",
              boxShadow: "0 8px 24px rgba(0,0,0,.07)",
              borderTop: `5px solid ${color}`,
              transition: "transform .2s",
            }}
          >
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: "50%",
                margin: "0 auto 14px",
                background: `${color}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color,
                fontWeight: 800,
                fontSize: 20,
              }}
            >
              {member.charAt(0)}
            </div>

            <h3
              style={{
                textAlign: "center",
                color: "#0F172A",
                fontSize: 15,
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              {member}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}

function StatCard({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        padding: "24px",
        textAlign: "center",
        boxShadow: "0 8px 24px rgba(0,0,0,.07)",
      }}
    >
      <div
        style={{
          fontSize: 34,
          fontWeight: 900,
          color: "#1F5AA6",
          marginBottom: 6,
        }}
      >
        {title}
      </div>

      <div
        style={{
          color: "#64748B",
          fontSize: 14,
        }}
      >
        {subtitle}
      </div>
    </div>
  );
}