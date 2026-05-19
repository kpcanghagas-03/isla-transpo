export default function Home() {
  return (
    <main style={{ padding: 40, fontFamily: "sans serif", background: "#00AEEF", minHeight: "100vh" }}>
      <header style={{ marginBottom: 30 }}>
        <h1 style={{ fontSize: 40, fontWeight: "bold" }}>ISLA-Transpo</h1>
        <p>RSTW Transportation Management System</p>
      </header>

      <section style={{ background: "blue", padding: 20, borderRadius: 10, marginBottom: 20 }}>
        <h2>Welcome to CAMIGUIN!</h2>
        <p>
          This system manages transportation requests for Regional Science and Technology Week (RSTW).
        </p>
      </section>

      <section style={{ background: "blue", padding: 20, borderRadius: 10 }}>
        <h2>Quick Actions</h2>
        <ul>
          <li>Submit Transport Request</li>
          <li>View Schedules</li>
          <li>Barge Trips: Balingoan ↔ Benoni</li>
          <li>Airport Transfers: Laguindingan / Camiguin</li>
        </ul>
      </section>
    </main>
  );
}