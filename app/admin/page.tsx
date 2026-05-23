"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import dynamic from "next/dynamic";

const LiveMap = dynamic(() => import("@/components/LiveMap"), {
  ssr: false,
});
import { Users, Clock, CheckCircle, Truck, AlertTriangle, XCircle } from "lucide-react";

// Shape from DB (allow nulls to match reality)
type Request = {
  id: number;

  requester_name: string;
  email: string | null;
  staff_email?: string | null;

  committee_unit: string | null;

  passengers: string | null;
  passenger_names: string | null;

  pickup_location: string | null;
  destination: string | null;

  flight_no: string | null;
  flight_arrival_date: string | null; // YYYY-MM-DD
  flight_arrival_time: string | null; // HH:mm[:ss]
  pick_up_date: string | null;        // YYYY-MM-DD
  pick_up_time: string | null;        // HH:mm[:ss]

  contact_person: string | null;
  contact_number: string | null;

  alternate_contact_person: string | null;
  alternate_contact_number: string | null;

  notes_remarks: string | null;

  status: "Pending" | "Approved" | "On the way" | "Completed" | "Disapproved" | "Emergency";
  priority: "Attendee" | "Staff" | "VIP" | null;
  assigned_vehicle: string | null;

  created_at: string; // ISO timestamp

  driver_lat?: number | null;
  driver_lng?: number | null;
};

// LiveMap expects non-null strings. Create a derived type we pass to it.
type LiveMapRequest = Omit<Request, "priority" | "email" | "staff_email" | "committee_unit" | "passengers" | "passenger_names" | "pickup_location" | "destination" | "flight_no" | "flight_arrival_date" | "flight_arrival_time" | "pick_up_date" | "pick_up_time" | "contact_person" | "contact_number" | "alternate_contact_person" | "alternate_contact_number" | "notes_remarks" | "assigned_vehicle"> & {
  requester_name: string;
  priority: "Attendee" | "Staff" | "VIP";
  email: string;
  staff_email?: string;
  committee_unit: string;
  passengers: string;
  passenger_names: string;
  pickup_location: string;
  destination: string;
  flight_no: string;
  flight_arrival_date: string;
  flight_arrival_time: string;
  pick_up_date: string;
  pick_up_time: string;
  contact_person: string;
  contact_number: string;
  alternate_contact_person: string;
  alternate_contact_number: string;
  notes_remarks: string;
  assigned_vehicle: string;
};

export default function AdminPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | Request["status"]>("All");

  // ================= FETCH REQUESTS =================
  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from("transport_requests")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.log("FETCH ERROR:", error);
      setLoading(false);
      return;
    }

    setRequests((data as Request[]) || []);
    setLoading(false);
  };

  // ================= REALTIME =================
  useEffect(() => {
    fetchRequests();

    const channel = supabase
      .channel("admin-live")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "transport_requests",
        },
        () => {
          fetchRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ================= STATUS COLOR =================
  const statusColor = (status: string) => {
    if (status === "Pending") return "#facc15";
    if (status === "Approved") return "#22c55e";
    if (status === "On the way") return "#3b82f6";
    if (status === "Completed") return "#6b7280";
    if (status === "Disapproved") return "#ef4444";
    if (status === "Emergency") return "#dc2626";
    return "#d1d5db";
  };

  // ================= HELPERS =================
  const toPHDate = (isoDate: string | null) => {
    if (!isoDate) return null;
    const d = new Date(isoDate);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString("en-PH", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });
  };

  const toPHTime = (time: string | null) => {
    if (!time) return null;
    const d = new Date(`1970-01-01T${time}`);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleTimeString("en-PH", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // ================= UPDATE FIELD =================
  const updateField = async (id: number, field: keyof Request | string, value: string) => {
    const request = requests.find((r) => r.id === id);
    if (!request) return;

    // prevent unnecessary updates
    if ((request as any)[field] === value) return;

    // instant UI update
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? ({ ...r, [field]: value } as Request) : r))
    );

    // update database
    const { error } = await supabase
      .from("transport_requests")
      .update({ [field]: value })
      .eq("id", id);

    if (error) {
      alert(error.message);
      fetchRequests();
      return;
    }
    console.log("UPDATED SUCCESSFULLY");

    // ================= AUTO EMAIL =================
    const shouldEmail =
      field === "status" &&
      request.status !== value &&
      ["Pending", "Approved", "On the way", "Disapproved", "Completed", "Emergency"].includes(value);

    if (shouldEmail) {
      try {
        const res = await fetch("/api/send_email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: request.email || undefined, // allowlist check on server
            name: request.requester_name,
            status: value,
            pickup: request.pickup_location || "",
            destination: request.destination || "",
            schedule: `${toPHDate(request.pick_up_date) || ""}${
              request.pick_up_time ? `, ${toPHTime(request.pick_up_time) || ""}` : ""
            }`,
            vehicle: request.assigned_vehicle || "",
          }),
        });

        const data = await res.json();
        console.log("EMAIL RESPONSE:", data);
      } catch (err) {
        console.log("EMAIL ERROR:", err);
      }
    }
  };

  // ================= FILTERED + SORTED =================
  const sortedRequests = requests
    .filter((r) => {
      if (statusFilter !== "All" && r.status !== statusFilter) return false;
      const s = searchTerm.toLowerCase();
      return (
        (r.requester_name || "").toLowerCase().includes(s) ||
        (r.pickup_location || "").toLowerCase().includes(s) ||
        (r.destination || "").toLowerCase().includes(s)
      );
    })
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const activeRequests = sortedRequests.filter((r) =>
    ["Pending", "Approved", "On the way", "Emergency"].includes(r.status)
  );

  const completedRequests = sortedRequests.filter((r) =>
    ["Completed", "Disapproved"].includes(r.status)
  );

  // ================= COUNTS =================
  const pendingCount = requests.filter((r) => r.status === "Pending").length;
  const approvedCount = requests.filter((r) => r.status === "Approved").length;
  const onTheWayCount = requests.filter((r) => r.status === "On the way").length;
  const emergencyCount = requests.filter((r) => r.status === "Emergency").length;
  const disapprovedCount = requests.filter((r) => r.status === "Disapproved").length;
  const totalCount = requests.length;

  // Normalize shape for LiveMap (no nulls, no extra keys)
  const liveMapRequests: LiveMapRequest[] = requests.map((req) => ({
    id: req.id,
    requester_name: req.requester_name || "",
    email: req.email || "",
    staff_email: req.staff_email || "",
    committee_unit: req.committee_unit || "",
    passengers: req.passengers || "0",
    passenger_names: req.passenger_names || "",
    pickup_location: req.pickup_location || "",
    destination: req.destination || "",
    flight_no: req.flight_no || "",
    flight_arrival_date: req.flight_arrival_date || "",
    flight_arrival_time: req.flight_arrival_time || "",
    pick_up_date: req.pick_up_date || "",
    pick_up_time: req.pick_up_time || "",
    contact_person: req.contact_person || "",
    contact_number: req.contact_number || "",
    alternate_contact_person: req.alternate_contact_person || "",
    alternate_contact_number: req.alternate_contact_number || "",
    notes_remarks: req.notes_remarks || "",
    status: req.status,
    priority: req.priority || "Attendee",
    assigned_vehicle: req.assigned_vehicle || "",
    created_at: req.created_at,
    driver_lat: req.driver_lat ?? null,
    driver_lng: req.driver_lng ?? null,
  }));

  return (
    <main className="container">
      {/* ================= BACKGROUND ================= */}
      <div className="bg" />
      <div className="overlay" />

      {/* ================= HEADER ================= */}
      <header className="header">
        <h1>ISLA-TRANSPO ADMIN DASHBOARD</h1>
        <p>Live Dispatch & Transport Monitoring</p>
      </header>

      {/* ================= MAP ================= */}
      <section className="mapSection">
        <LiveMap requests={liveMapRequests} />
      </section>

      {/* ================= SUMMARY CARDS ================= */}
      <div className="statsGrid">
        <div className="statCard total">
          <div className="statIcon"><Users size={18} /></div>
          <div className="statNumber">{totalCount}</div>
          <div className="statLabel">Total Requests</div>
        </div>

        <div className="statCard pending">
          <div className="statIcon"><Clock size={18} /></div>
          <div className="statNumber">{pendingCount}</div>
          <div className="statLabel">Pending</div>
        </div>

        <div className="statCard approved">
          <div className="statIcon"><CheckCircle size={18} /></div>
          <div className="statNumber">{approvedCount}</div>
          <div className="statLabel">Approved</div>
        </div>

        <div className="statCard way">
          <div className="statIcon"><Truck size={18} /></div>
          <div className="statNumber">{onTheWayCount}</div>
          <div className="statLabel">On the Way</div>
        </div>

        <div className="statCard emergency">
          <div className="statIcon"><AlertTriangle size={18} /></div>
          <div className="statNumber">{emergencyCount}</div>
          <div className="statLabel">Emergency</div>
        </div>

        <div className="statCard disapproved">
          <div className="statIcon"><XCircle size={18} /></div>
          <div className="statNumber">{disapprovedCount}</div>
          <div className="statLabel">Disapproved</div>
        </div>
      </div>

      {/* ================= SEARCH & FILTER ================= */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Search requester, pickup, destination..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            minWidth: 250,
            padding: 14,
            borderRadius: 12,
            border: "2px solid #cbd5e1",
            fontSize: 14,
            color: "#111827",
            background: "white",
            outline: "none",
            boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
          }}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          style={{
            padding: 14,
            borderRadius: 12,
            border: "2px solid #cbd5e1",
            color: "#111827",
            minWidth: 180,
            background: "white",
            outline: "none",
            boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
          }}
        >
          <option>All</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>On the way</option>
          <option>Completed</option>
          <option>Disapproved</option>
          <option>Emergency</option>
        </select>
      </div>

      {/* ================= ACTIVE REQUESTS ================= */}
      <section className="section">
        <h2 className="sectionTitle">Active Transport Requests</h2>

        {loading ? (
          <p className="loading">Loading...</p>
        ) : (
          <div className="grid">
            {activeRequests.map((req) => {
              const emergency = req.status === "Emergency";

              return (
                <div
                  key={req.id}
                  className={`card ${emergency ? "emergency" : ""}`}
                  style={{
                    borderLeft:
                      req.priority === "VIP"
                        ? "6px solid #dc2626"
                        : req.priority === "Staff"
                        ? "6px solid #2563eb"
                        : "6px solid #9ca3af",
                  }}
                >
                  <div className="nameRow">
                    <span className="name">{req.requester_name}</span>
                    {req.priority === "VIP" && <span className="vipBadge">VIP</span>}
                  </div>

                  <div className="info">🏢 {req.committee_unit || "N/A"}</div>
                  <div className="info">📧 {req.email || "N/A"}</div>
                  <div className="info">📞 {req.contact_number || "N/A"}</div>

                  <div className="info">
                    👤 Contact Person:
                    <br />
                    {req.contact_person || "N/A"}
                  </div>

                  <div className="info">
                    👥 Passengers:
                    <br />
                    {req.passengers || "0"}
                  </div>

                  <div className="info">
                    🧍 Passenger Names:
                    <br />
                    {req.passenger_names || "N/A"}
                  </div>

                  <div className="info">📍 {req.pickup_location || "N/A"}</div>
                  <div className="info">🎯 {req.destination || "N/A"}</div>

                  {(req.flight_no || req.flight_arrival_date || req.flight_arrival_time) && (
                    <div className="info">
                      ✈️ Flight Details:
                      <br />
                      Flight No: {req.flight_no || "N/A"}
                      <br />
                      Arrival: {toPHDate(req.flight_arrival_date) || "N/A"}
                      {req.flight_arrival_time ? `, ${toPHTime(req.flight_arrival_time) || ""}` : ""}
                    </div>
                  )}

                  <div className="info">
                    🕒 Pickup Schedule:
                    <br />
                    {toPHDate(req.pick_up_date) || "N/A"}
                    {req.pick_up_time ? `, ${toPHTime(req.pick_up_time) || ""}` : ""}
                  </div>

                  <div className="info">
                    📝 Notes / Remarks:
                    <br />
                    {req.notes_remarks || "None"}
                  </div>

                  <div className="info">
                    📅 Requested:
                    <br />
                    {new Date(req.created_at).toLocaleString("en-PH", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                      timeZone: "Asia/Manila",
                    })}
                  </div>

                  <div className="statusBadge" style={{ background: statusColor(req.status) }}>
                    {req.status}
                  </div>

                  <label className="label">Priority</label>
                  <select
                    value={req.priority || "Attendee"}
                    onChange={(e) => updateField(req.id, "priority", e.target.value)}
                  >
                    <option>Attendee</option>
                    <option>Staff</option>
                    <option>VIP</option>
                  </select>

                  <label className="label">Status</label>
                  <select
                    value={req.status || "Pending"}
                    onChange={(e) => updateField(req.id, "status", e.target.value)}
                  >
                    <option>Pending</option>
                    <option>Approved</option>
                    <option>On the way</option>
                    <option>Completed</option>
                    <option>Disapproved</option>
                    <option>Emergency</option>
                  </select>

                  <label className="label">Assigned Vehicle</label>
                  <select
                    value={req.assigned_vehicle || ""}
                    onChange={async (e) => {
                      const vehicle = e.target.value;
                      await updateField(req.id, "assigned_vehicle", vehicle);
                      if (vehicle) await updateField(req.id, "status", "Approved");
                      else await updateField(req.id, "status", "Pending");
                    }}
                  >
                    <option value="">Unassigned</option>
                    <option value="Van 1 - ZAM 1023 - Driver 1">🚐 Van 1 - ZAM 1023 - Driver 1</option>
                    <option value="Van 2 - ZAM 1456 - Driver 2">🚐 Van 2 - ZAM 1456 - Driver 2</option>
                    <option value="SUV 1 - SUV 8831 - Driver 3">🚗 SUV 1 - SUV 8831 - Driver 3</option>
                    <option value="SUV 2 - SUV 1942 - Driver 4">🚗 SUV 2 - SUV 1942 - Driver 4</option>
                    <option value="Mini Bus 1 - BUS 1001 - Driver 5">🚌 Mini Bus 1 - BUS 1001 - Driver 5</option>
                    <option value="Service Car 1 - CAR 9921 - Driver 6">🚗 Service Car 1 - CAR 9921 - Driver 6</option>
                    <option value="Van 3 - VAN 5555 - Driver 7">🚐 Van 3 - VAN 5555 - Driver 7</option>
                    <option value="Backup Vehicle - BKP 7777 - Driver 8">🚨 Backup Vehicle - BKP 7777 - Driver 8</option>
                  </select>

                  <div className="vehicle">
                    {req.assigned_vehicle ? `✅ ${req.assigned_vehicle}` : "🚨 No Vehicle Assigned"}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ================= COMPLETED ================= */}
      <section className="section">
        <h2 className="sectionTitle">Completed / Disapproved</h2>

        <div className="grid">
          {completedRequests.map((req) => (
            <div key={req.id} className="card completedCard">
              <div className="name">{req.requester_name}</div>
              <div className="info">📍 {req.pickup_location || "N/A"}</div>
              <div className="info">🎯 {req.destination || "N/A"}</div>

              <div className="statusBadge" style={{ background: statusColor(req.status) }}>
                {req.status}
              </div>

              <button
                onClick={() => updateField(req.id, "status", "Approved")}
                style={{
                  marginTop: 10,
                  padding: "8px 10px",
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Restore to Active
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ================= STYLES ================= */}
      <style jsx>{`
        .container { min-height: 100vh; padding: 16px; font-family: Arial, sans-serif; color: white; }
        .bg { position: fixed; inset: 0; background-image: url("/camiguin.jpg"); background-size: cover; background-position: center; z-index: -2; }
        .overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.55); z-index: -1; }

        .header { text-align: center; margin-bottom: 18px; }
        .header h1 { font-size: clamp(22px, 4vw, 36px); margin-bottom: 4px; }
        .header p { opacity: 0.9; }

        .mapSection { height: 320px; border-radius: 16px; overflow: hidden; margin-bottom: 20px; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25); }

        .section { margin-bottom: 28px; }
        .sectionTitle { margin-bottom: 12px; font-size: 24px; font-weight: bold; }

        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 14px; }

        .statsGrid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; margin-bottom: 20px; }

        .card { background: white; color: #111827; border-radius: 16px; padding: 14px; display: flex; flex-direction: column; gap: 8px; box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15); }

        .statCard { background: #ffffff; border-radius: 14px; padding: 12px 14px; box-shadow: 0 8px 18px rgba(0, 0, 0, 0.12); border: 1px solid rgba(0, 0, 0, 0.05); display: flex; flex-direction: column; gap: 6px; min-height: 80px; transition: all 0.2s; }
        .statCard:hover { transform: translateY(-2px); box-shadow: 0 14px 30px rgba(0,0,0,0.18); }
        .statIcon { display: flex; justify-content: flex-end; color: #475569; }
        .statNumber { font-size: 22px; font-weight: 800; color: #0f172a; }
        .statLabel { font-size: 12px; font-weight: 600; color: #64748b; }

        .total { border-left: 5px solid #0ea5e9; }
        .pending { border-left: 5px solid #facc15; }
        .approved { border-left: 5px solid #22c55e; }
        .way { border-left: 5px solid #3b82f6; }
        .emergency { border-left: 5px solid #dc2626; }
        .disapproved { border-left: 5px solid #6b7280; }

        .completedCard { opacity: 0.85; }

        .emergency { border-left: 5px solid #dc2626; box-shadow: 0 0 18px rgba(255, 0, 0, 0.5); }

        .nameRow { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .name { font-size: 18px; font-weight: bold; }
        .vipBadge { background: #dc2626; color: white; font-size: 11px; padding: 4px 8px; border-radius: 999px; font-weight: bold; }
        .info { font-size: 13px; line-height: 1.5; }
        .label { font-size: 12px; font-weight: bold; margin-top: 4px; }
        .statusBadge { color: white; padding: 6px 10px; border-radius: 999px; font-size: 12px; width: fit-content; font-weight: bold; }
        .vehicle { font-weight: bold; font-size: 14px; }

        select { padding: 8px; border-radius: 8px; border: 1px solid #d1d5db; background: white; color: black; }

        .loading { text-align: center; }

        @media (max-width: 768px) {
          .mapSection { height: 240px; }
          .grid { grid-template-columns: 1fr; }
          .statsGrid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </main>
  );
}
