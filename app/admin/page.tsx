"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import dynamic from "next/dynamic";

const LiveMap = dynamic(() => import("@/components/LiveMap"), {
  ssr: false,
});
import { Users, Clock, CheckCircle, Truck, AlertTriangle, XCircle } from "lucide-react";
import { request } from "https";

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
  driver_number: string | null;

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
  const [activeTab, setActiveTab] = useState<"All" | "Pending" | "Approved" | "On the way" | "Completed">("All");
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [vehicleExpanded, setVehicleExpanded] = useState<number | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [highlightedId, setHighlightedId] = useState<number | null>(null);

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

  // ================= DRIVER NUMBERS =================
  const vehicleMap: Record<string, { driver: string; phone: string }> = {
  "Toyota Hilux - SAA 6987": {
    driver: "Mr. Lino A. Gorres Jr.",
    phone: "09178048369",
  },
  "Toyota Van - SKB 5333": {
    driver: "Mr. Ramil M. Caneda",
    phone: "09178036974",
  },
  "Toyota Innova - SHZ 943": {
    driver: "Mr. Ernesto A. Soliva",
    phone: "09178579321",
  },
  "Toyota Innova - SJS 302": {
    driver: "Mr. Pablito D. Murillo",
    phone: "09654661221",
  },
  "Isuzu Pick-up - SKB 3028": {
    driver: "Mr. Francisco F. Talle Jr.",
    phone: "09177097523",
  },
  "Isuzu Pick-up - SKB 3030": {
    driver: "Mr. Leonel Quidet",
    phone: "09178579197",
  },
  "Isuzu Pick-up - SKB 3029": {
    driver: "Mr. Junve O. Barbadillo",
    phone: "09178579129",
  },
  "Backup Vehicle - BKP 7777": {
    driver: "Driver 8",
    phone: "09999999999",
  },
};

const vehicleOptions = [
  "Toyota Hilux - SAA 6987 - Lino A. Gorres Jr. (09178048369)",
  "Toyota Van - SKB 5333 - Ramil M. Caneda (09178036974)",
  "Toyota Innova - SHZ 943 - Ernesto A. Soliva (09178579321)",
  "Toyota Innova - SJS 302 - Pablito D. Murillo (09654661221)",
  "Isuzu Pick-up - SKB 3028 - Francisco F. Talle Jr. (09177097523)",
  "Isuzu Pick-up - SKB 3030 - Leonel Quidet (09178579197)",
  "Isuzu Pick-up - SKB 3029 - Junve O. Barbadillo (09178579129)",
  "Backup Vehicle - BKP 7777",
];


  // ================= UPDATE FIELD =================
  const updateField = async (
  id: number,
  field: keyof Request | string,
  value: string
) => {
  const request = requests.find((r) => r.id === id);

  if (!request) return;

  // prevent unnecessary updates
  if ((request as any)[field] === value) return;

  // instant UI update
  setRequests((prev) =>
    prev.map((r) =>
      r.id === id ? ({ ...r, [field]: value } as Request) : r
    )
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

  setHighlightedId(id);

setTimeout(() => {
  setHighlightedId(null);
}, 4000);

  // ================= AUTO EMAIL =================
  const shouldEmail =
    field === "status" &&
    request.status !== value &&
    [
      "Pending",
      "Approved",
      "On the way",
      "Disapproved",
      "Completed",
      "Emergency",
    ].includes(value);

  if (shouldEmail) {
    try {
      const vehicles = (request.assigned_vehicle || "")
      .split(" | ")
      .map((v) => {
        const key = Object.keys(vehicleMap).find((k) =>
          v.startsWith(k)
        );

        return key ? vehicleMap[key] : null;
      })
      .filter(
        (v): v is { driver: string; phone: string } => v !== null
      );

      const driverNames = vehicles.map((v) => v.driver).join(", ");
      const driverPhones = vehicles.map((v) => v.phone).join(", ");

      console.log("Vehicles:", vehicles);
      console.log("Driver Names:", driverNames);
      console.log("Driver Phones:", driverPhones);
      
      const res = await fetch("/api/send_email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        
        body: JSON.stringify({
          email: request.email || undefined,
          name: request.requester_name,
          status: value,

          pickup: request.pickup_location || "",
          destination: request.destination || "",

          schedule: `${toPHDate(request.pick_up_date) || ""}${
            request.pick_up_time
              ? `, ${toPHTime(request.pick_up_time) || ""}`
              : ""
          }`,

          vehicle: request.assigned_vehicle
            ? `🚐 ${request.assigned_vehicle} - ${driverNames}`
            : "",

          driver_number: driverPhones,

          request_id: request.id,
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

  const activeRequests = sortedRequests.filter((r) => {
  const isActiveStatus = [
    "Pending",
    "Approved",
    "On the way",
    "Emergency",
  ].includes(r.status);

  if (!isActiveStatus) return false;

  if (activeTab === "All") return true;

  if (activeTab === "Completed") return r.status === "Completed";

  return r.status === activeTab;
});

  const completedRequests = sortedRequests.filter((r) =>
    ["Completed", "Disapproved"].includes(r.status)
  );

  // ================= COUNTS =================
  const pendingCount = requests.filter((r) => r.status === "Pending").length;
  const approvedCount = requests.filter((r) => r.status === "Approved").length;
  const onTheWayCount = requests.filter((r) => r.status === "On the way").length;
  const emergencyCount = requests.filter((r) => r.status === "Emergency").length;
  const disapprovedCount = requests.filter((r) => r.status === "Disapproved").length;
  const completedCount = requests.filter(
  (r) => r.status === "Completed"
    ).length;
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
    driver_number: vehicleMap[req.assigned_vehicle || ""]?.phone || "",
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
        <h1
        style={{
          background:
            "linear-gradient(90deg,#F27A35,#A61E22,#1F5AA6), color:#F27A35",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "#F27A35",
          color: "#475569",
          fontWeight: 900,
          fontSize: "clamp(28px,5vw,48px)",
        }}
      >
        ISLA-TRANSPO ADMIN DASHBOARD

      </h1>
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
            {/* ACTIVE TABS */}
<div
  style={{
    display: "flex",
    gap: 8,
    overflowX: "auto",
    marginBottom: 15,
    paddingBottom: 5,
  }}
>
  {["All", "Pending", "Approved", "On the way", "Completed"].map(
    (tab) => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab as any)}
        style={{
          padding: "8px 14px",
          borderRadius: 999,
          border: "none",
          whiteSpace: "nowrap",
          cursor: "pointer",
          fontWeight: 600,
          background:
            activeTab === tab ? "#F27A35" : "#E2E8F0",
          color: activeTab === tab ? "white" : "#334155",
        }}
      >
        {tab}
      </button>
    )
  )}
</div>

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
            <div
        style={{
          position: "sticky",
          top: 10,
          zIndex: 100,
          background: "white",
          color:"#475569",
          padding: "10px 14px",
          borderRadius: 12,
          marginBottom: 15,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <strong>⏳ {pendingCount} Pending</strong>
        <strong>🚐 {approvedCount} Approved</strong>
        <strong>✅ {completedCount} Completed</strong>
      </div>
      <section className="section">
       <h2 className="sectionTitle" style={{ color: "#475569" }}>
         Active Transport Requests
       </h2>


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

                    transition: "all 0.5s ease",
                    boxShadow:
                      highlightedId === req.id
                        ? "0 0 0 3px #F27A35, 0 8px 20px rgba(0,0,0,0.2)"
                        : undefined,
                  }}
                >
                  <div className="nameRow">
                    <span className="name">{req.requester_name}</span>
                    {req.priority === "VIP" && <span className="vipBadge">VIP</span>}
                  </div>

                  <div className="info">🏢 {req.committee_unit || "N/A"}</div>
                  {expandedCard === req.id && (
                    <>
                  <div className="infoRow">
                  <span className="infoLabel">📧 Email</span>
                  <span className="infoValue">{req.email || "N/A"}</span>
                  </div>
                  
                  <div className="infoRow">
                 <span className="infoLabel">👤 Contact Person</span>
                  <span className="infoValue">{req.contact_person || "N/A"}</span>
                  </div>

                  <div className="infoRow">
                  <span className= "infoLabel">📞 Contact</span>
                  <span className="infoValue">{req.contact_number || "N/A"}</span>
                  </div>

                  <div className="infoRow">
                  <span className="infoLabel">📞 Alternate Contact Person</span>
                  <span className="infoValue">{req.alternate_contact_person || "N/A"}
                  </span>
                </div>

                <div className="infoRow">
                  <span className="infoLabel">📱 Alternate Contact Number</span>
                  <span className="infoValue">{req.alternate_contact_number || "N/A"}
                  </span>
                </div>

                  <div className="infoRow">
                    <span className="infoLabel"> 👥 Passengers </span>
                    <span className="infoValue">{req.passengers || "0"} </span>
                  </div>

                  <div className="infoRow">
                      <span className="infoLabel">🧍 Passenger Names</span>

                      <div
                        style={{
                          flex: 1,
                          maxHeight: 80,
                          overflowY: "auto",
                          background: "#f8fafc",
                          padding: 8,
                          borderRadius: 8,
                          border: "1px solid #e2e8f0",
                          fontSize: 12,
                          textAlign: "left",
                        }}
                      >
                        {req.passenger_names || "N/A"}
                      </div>
                    </div>

                  <div className="infoRow">
                    <span className="infoLabel">📍Location </span>
                  <span className="infoValue">{req.pickup_location || "N/A"}</span>  </div>

                  <div className="infoRow">
                    <span className="infoLabel">🎯Destination </span>
                  <span className="infoValue">{req.destination || "N/A"} </span>
                  </div>

                     {(req.flight_no || req.flight_arrival_date || req.flight_arrival_time) && (
                    <div className="info">✈️ Flight Details:
                      Flight No: {req.flight_no || "N/A"}
                      <br />
                      Arrival: {toPHDate(req.flight_arrival_date) || "N/A"}
                      {req.flight_arrival_time ? `, ${toPHTime(req.flight_arrival_time) || ""}` : ""}
                    </div>
                  )}

                  <div className="infoRow">
                    <span className="infoLabel"> 🕒 Pickup Schedule:</span>
                  <span className="infoValue">
                    {toPHDate(req.pick_up_date) || "N/A"}{req.pick_up_time ? `, ${toPHTime(req.pick_up_time) || ""}` : ""}</span>
                  </div>

                  <div className="infoRow">
                      <span className="infoLabel">📝 Notes / Remarks:</span>
                  <span className="infoValue">{req.notes_remarks || "None"}</span>

                  </div>

                  <div className="infoRow">
                    <span className="infoLabel">📅 Requested: </span>
                  <span className="infoValue">

                    {new Date(req.created_at).toLocaleString("en-PH", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                      timeZone: "Asia/Manila",
                    })} </span>
                        </div>
                      </>
                    )}
                  <div className="statusBadge" style={{ background: statusColor(req.status) }}>
                    {req.status}
                  </div>

                  <button
                      onClick={() =>
                        setExpandedCard(
                          expandedCard === req.id ? null : req.id
                        )
                      }
                      style={{
                        marginTop: 10,
                        padding: "8px 12px",
                        borderRadius: 8,
                        border: "none",
                        background: "#e2e8f0",
                        color: "#111827",
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      {expandedCard === req.id
                        ? "▲ Hide Details"
                        : "▼ Show Details"}
                    </button>

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

                  <button
                      onClick={() =>
                        setVehicleExpanded(
                          vehicleExpanded === req.id
                            ? null
                            : req.id
                        )
                      }
                      style={{
                        marginTop: 8,
                        padding: "10px",
                        borderRadius: 8,
                        border: "none",
                        background: "#dbeafe",
                        color: "#1e3a8a",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {vehicleExpanded === req.id
                        ? "🚐 Hide Vehicle Assignment"
                        : "🚐 Assign Vehicle"}
                    </button>
                    {vehicleExpanded === req.id && (
                    <>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                      marginBottom: "10px",
                    }}
                  >
  {vehicleOptions.map((vehicle) => {
    const selectedVehicles =
      req.assigned_vehicle?.split(" | ") || [];

    return (
      <label
        key={vehicle}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "13px",
        }}
      >
        <input
          type="checkbox"
          checked={selectedVehicles.includes(vehicle)}
          onChange={async (e) => {
            let updatedVehicles = [...selectedVehicles];

            if (e.target.checked) {
              updatedVehicles.push(vehicle);
            } else {
              updatedVehicles = updatedVehicles.filter(
                (v) => v !== vehicle
              );
            }

            const vehicleString =
              updatedVehicles.join(" | ");

            await updateField(
              req.id,
              "assigned_vehicle",
              vehicleString
            );

            if (vehicleString) {
              await updateField(
                req.id,
                "status",
                "Approved"
              );
            } else {
              await updateField(
                req.id,
                "status",
                "Pending"
              );
            }
          }}
        />

        {vehicle}
      </label>
    );
  })}
</div>
  </>
)}
                  </div>
                );
              })}
            </div>
          )}
      </section>

      {/* ================= COMPLETED ================= */}
      <section className="section">
        <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#475569",
    marginBottom: 12,
  }}
>
  <h2 className="sectionTitle">Completed / Disapproved</h2>

  <button
    onClick={() => setShowCompleted((prev) => !prev)}
    style={{
      padding: "6px 12px",
      borderRadius: 8,
      border: "none",
      background: "#e2e8f0",
      fontWeight: 600,
      cursor: "pointer",
      color: "#475569",
    }}
  >
    {showCompleted ? "Hide" : "Show"}
  </button>
</div>

        <div className="grid">
          {showCompleted && (
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
          )}
        </div>
      </section>

      {/* ================= STYLES ================= */}
      <style jsx>{`
        .container {
  min-height: 100vh;
  padding: 16px;
  max-width: 1400px;
  margin: 0 auto;
  font-family: "Segoe UI", sans-serif;
}
        .bg {
  position: fixed;
  inset: 0;
  background:
    linear-gradient(
      180deg,
      #ffffff 0%,
      #f8fafc 50%,
      #ffffff 100%
    );
  z-index: -2;
}

.overlay {
  display: none;
}

  .header {
  text-align: center;
  margin-bottom: 24px;
  background: white;
  padding: 24px;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0,0,0,.08);
}

  .mapSection {
  height: clamp(250px, 40vw, 450px);
  border-radius: 24px;
  overflow: hidden;
  margin-bottom: 24px;
  box-shadow: 0 10px 30px rgba(0,0,0,.08);
}

.section { margin-bottom: 28px; }
.sectionTitle { margin-bottom: 12px; font-size: 24px; font-weight: bold; }

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit,minmax(280px,1fr));
  gap: 16px;
}

.statsGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit,minmax(180px,1fr));
  gap: 14px;
  margin-bottom: 24px;
}

        .card { background: white; color: #111827; border-radius: 16px; padding: 14px; display: flex; flex-direction: column; gap: 8px; box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15); }

        .statCard { background: #ffffff; border-radius: 14px; padding: 12px 14px; box-shadow: 0 8px 18px rgba(0, 0, 0, 0.12); border: 1px solid rgba(0, 0, 0, 0.05); display: flex; flex-direction: column; gap: 6px; min-height: 80px; transition: all 0.2s; }
        .statCard:hover { transform: translateY(-2px); box-shadow: 0 14px 30px rgba(0,0,0,0.18); }
        .statIcon { display: flex; justify-content: flex-end; color: #5c646f; }
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
        .info {
          font-size: 13px;
          line-height: 1.4;
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          color: #111827;
        }
          .infoRow {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 10px;
          font-size: 12.5px;
          padding: 4px 0;
          border-bottom: 1px dashed #e5e7eb;
        }

        .infoLabel {
          font-weight: 600;
          color: #64748b;
          min-width: 110px;
        }

        .infoValue {
          flex: 1;
          text-align: right;
          word-break: break-word;
          color: #111827;
        }
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

