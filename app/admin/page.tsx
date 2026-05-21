"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import LiveMap from "@/components/LiveMap";
import { request } from "http";

type Request = {
  id: number;

  requester_name: string;
  email: string;
  committee_unit: string;

  passengers: string;
  passenger_names: string;

  pickup_location: string;
  destination: string;

  flight_no: string;
  flight_arrival_date: string;
  flight_arrival_time: string;

  pickup_date: string;
  pickup_time: string;

  contact_person: string;
  contact_number: string;

  alternate_contact_person: string;
  alternate_contact_number: string;

  vehicle_type: string;
  notes_remarks: string;

  status: string;
  priority: string;
  assigned_vehicle: string;

  created_at: string;

  driver_lat?: number;
  driver_lng?: number;
};

export default function AdminPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

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

    setRequests(data || []);
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

  // ================= UPDATE FIELD =================
  const updateField = async (
    id: number,
    field: string,
    value: string
  ) => {
    // instant UI update
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, [field]: value } : r
      )
    );

    // database update
    const { error } = await supabase
      .from("transport_requests")
      .update({
        [field]: value,
      })
      .eq("id", id);

    if (error) {
      console.log("SUPABASE ERROR:", error);
      alert(error.message);
      fetchRequests();
      return;
    }

    console.log("UPDATED SUCCESSFULLY");
  };

  // ================= VEHICLE ICON =================
  const vehicleIcon = (vehicle: string) => {
    if (vehicle === "Van") return "🚐";
    if (vehicle === "Bus") return "🚌";
    if (vehicle === "Car") return "🚗";
    if (vehicle === "Pick-up") return "🛻";
    if (vehicle === "Motor Vehicle") return "🏍️";

    return "🚨";
  };

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

  // ================= SORTING =================
  const sortedRequests = [...requests].sort((a, b) => {
    const priorityWeight = (priority: string) => {
      if (priority === "VIP") return 3;
      if (priority === "Staff") return 2;
      return 1;
    };

    const priorityDiff =
      priorityWeight(b.priority) -
      priorityWeight(a.priority);

    if (priorityDiff !== 0) return priorityDiff;

    return (
      new Date(a.created_at).getTime() -
      new Date(b.created_at).getTime()
    );
  });

  // ================= ACTIVE REQUESTS =================
  const activeRequests = sortedRequests.filter((r) =>
    [
      "Pending",
      "Approved",
      "On the way",
      "Emergency",
    ].includes(r.status)
  );

  // ================= COMPLETED REQUESTS =================
  const completedRequests = sortedRequests.filter((r) =>
    ["Completed", "Disapproved"].includes(r.status)
  );

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
        <LiveMap
          requests={requests.map((req) => ({
            ...req,
            full_name: req.requester_name,
          }))}
        />
      </section>

      {/* ================= ACTIVE REQUESTS ================= */}
      <section className="section">
        <h2 className="sectionTitle">
          Active Transport Requests
        </h2>

        {loading ? (
          <p className="loading">Loading...</p>
        ) : (
          <div className="grid">
            {activeRequests.map((req) => {
              const emergency =
                req.status === "Emergency";

              return (
                <div
                  key={req.id}
                  className={`card ${
                    emergency ? "emergency" : ""
                  }`}
                  style={{
                    borderLeft:
                      req.priority === "VIP"
                        ? "6px solid #dc2626"
                        : req.priority === "Staff"
                        ? "6px solid #2563eb"
                        : "6px solid #9ca3af",
                  }}
                >
                  {/* NAME */}
                  <div className="nameRow">
                    <span className="name">
                      {req.requester_name}
                    </span>

                    {req.priority === "VIP" && (
                      <span className="vipBadge">
                        VIP
                      </span>
                    )}
                  </div>

                  {/* DETAILS */}
                  <div className="info">
                    🏢 {req.committee_unit || "N/A"}
                  </div>

                  <div className="info">
                    📧 {req.email || "N/A"}
                  </div>

                  <div className="info">
                    📞 {req.contact_number || "N/A"}
                  </div>

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

                  <div className="info">
                    📍 {req.pickup_location || "N/A"}
                  </div>

                  <div className="info">
                    🎯 {req.destination || "N/A"}
                  </div>

                  {/* FLIGHT DETAILS */}
                  {(req.flight_no ||
                    req.flight_arrival_date ||
                    req.flight_arrival_time) && (
                    <div className="info">
                      ✈️ Flight Details:
                      <br />
                      Flight No:{" "}
                      {req.flight_no || "N/A"}
                      <br />
                      Arrival:
                      {" "}
                      {req.flight_arrival_date
                        ? new Date(
                            req.flight_arrival_date
                          ).toLocaleDateString(
                            "en-PH",
                            {
                              year: "numeric",
                              month: "long",
                              day: "2-digit",
                            }
                          )
                        : "N/A"}
                      {req.flight_arrival_time
                        ? `, ${new Date(
                            `1970-01-01T${req.flight_arrival_time}`
                          ).toLocaleTimeString(
                            "en-PH",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            }
                          )}`
                        : ""}
                    </div>
                  )}

                  {/* PICKUP SCHEDULE */}
                  <div className="info">
                    🕒 Pickup Schedule:
                    <br />

                    {req.pickup_date
                      ? new Date(
                          req.pickup_date
                        ).toLocaleDateString(
                          "en-PH",
                          {
                            year: "numeric",
                            month: "long",
                            day: "2-digit",
                          }
                        )
                      : "N/A"}

                    {req.pickup_time
                      ? `, ${new Date(
                          `1970-01-01T${req.pickup_time}`
                        ).toLocaleTimeString(
                          "en-PH",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          }
                        )}`
                      : ""}
                  </div>

                  <div className="info">
                    🚗 Requested Vehicle:
                    <br />
                    {req.vehicle_type || "N/A"}
                  </div>

                  <div className="info">
                    📝 Notes / Remarks:
                    <br />
                    {req.notes_remarks || "None"}
                  </div>

                  <div className="info">
                    📅 Requested:
                    <br />
                    {new Date(
                      req.created_at
                    ).toLocaleString("en-PH", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                      timeZone: "Asia/Manila",
                    })}
                  </div>

                  {/* STATUS BADGE */}
                  <div
                    className="statusBadge"
                    style={{
                      background: statusColor(
                        req.status
                      ),
                    }}
                  >
                    {req.status}
                  </div>

                  {/* PRIORITY */}
                  <label className="label">
                    Priority
                  </label>

                  <select
                    value={req.priority || "Attendee"}
                    onChange={(e) =>
                      updateField(
                        req.id,
                        "priority",
                        e.target.value
                      )
                    }
                  >
                    <option>Attendee</option>
                    <option>Staff</option>
                    <option>VIP</option>
                  </select>

                  {/* STATUS */}
                  <label className="label">
                    Status
                  </label>

                  <select
                    value={req.status || "Pending"}
                    onChange={(e) =>
                      updateField(
                        req.id,
                        "status",
                        e.target.value
                      )
                    }
                  >
                    <option>Pending</option>
                    <option>Approved</option>
                    <option>On the way</option>
                    <option>Completed</option>
                    <option>Disapproved</option>
                    <option>Emergency</option>
                  </select>

                  {/* ASSIGNED VEHICLE */}
                  <label className="label">
                    Assigned Vehicle
                  </label>

                  <select
                    value={
                      req.assigned_vehicle || ""
                    }
                    onChange={(e) =>
                      updateField(
                        req.id,
                        "assigned_vehicle",
                        e.target.value
                      )
                    }
                  >
                    <option value="">
                      Unassigned
                    </option>

                    <option>Van</option>
                    <option>Bus</option>
                    <option>Car</option>
                    <option>Pick-up</option>
                    <option>
                      Motor Vehicle
                    </option>
                  </select>

                  {/* VEHICLE DISPLAY */}
                  <div className="vehicle">
                    {req.assigned_vehicle
                      ? `${vehicleIcon(
                          req.assigned_vehicle
                        )} ${
                          req.assigned_vehicle
                        }`
                      : "🚨 No Vehicle Assigned"}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ================= COMPLETED ================= */}
      <section className="section">
        <h2 className="sectionTitle">
          Completed / Disapproved
        </h2>

        <div className="grid">
          {completedRequests.map((req) => (
            <div
              key={req.id}
              className="card completedCard"
            >
              <div className="name">
                {req.requester_name}
              </div>

              <div className="info">
                📍 {req.pickup_location}
              </div>

              <div className="info">
                🎯 {req.destination}
              </div>

              <div
                className="statusBadge"
                style={{
                  background: statusColor(
                    req.status
                  ),
                }}
              >
                {req.status}
              </div>

              <button
                onClick={() =>
                  updateField(
                    req.id,
                    "status",
                    "Approved"
                  )
                }
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
        .container {
          min-height: 100vh;
          padding: 16px;
          font-family: Arial, sans-serif;
          color: white;
        }

        .bg {
          position: fixed;
          inset: 0;
          background-image: url("/camiguin.jpg");
          background-size: cover;
          background-position: center;
          z-index: -2;
        }

        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.55);
          z-index: -1;
        }

        .header {
          text-align: center;
          margin-bottom: 18px;
        }

        .header h1 {
          font-size: clamp(22px, 4vw, 36px);
          margin-bottom: 4px;
        }

        .header p {
          opacity: 0.9;
        }

        .mapSection {
          height: 320px;
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 20px;
          box-shadow: 0 8px 24px
            rgba(0, 0, 0, 0.25);
        }

        .section {
          margin-bottom: 28px;
        }

        .sectionTitle {
          margin-bottom: 12px;
          font-size: 24px;
          font-weight: bold;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(
            auto-fit,
            minmax(320px, 1fr)
          );
          gap: 14px;
        }

        .card {
          background: white;
          color: #111827;
          border-radius: 16px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          box-shadow: 0 6px 18px
            rgba(0, 0, 0, 0.15);
        }

        .completedCard {
          opacity: 0.85;
        }

        .emergency {
          animation:
            pulse 1s infinite,
            bounce 0.8s infinite;
          border: 2px solid #dc2626;
          box-shadow: 0 0 18px
            rgba(255, 0, 0, 0.5);
        }

        .nameRow {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .name {
          font-size: 18px;
          font-weight: bold;
        }

        .vipBadge {
          background: #dc2626;
          color: white;
          font-size: 11px;
          padding: 4px 8px;
          border-radius: 999px;
          font-weight: bold;
        }

        .info {
          font-size: 13px;
          line-height: 1.5;
        }

        .label {
          font-size: 12px;
          font-weight: bold;
          margin-top: 4px;
        }

        .statusBadge {
          color: white;
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 12px;
          width: fit-content;
          font-weight: bold;
        }

        .vehicle {
          font-weight: bold;
          font-size: 14px;
        }

        select {
          padding: 8px;
          border-radius: 8px;
          border: 1px solid #d1d5db;
          background: white;
          color: black;
        }

        .loading {
          text-align: center;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.02);
          }

          100% {
            transform: scale(1);
          }
        }

        @keyframes bounce {
          0% {
            transform: translateY(0);
          }

          30% {
            transform: translateY(-4px);
          }

          50% {
            transform: translateY(0);
          }

          70% {
            transform: translateY(-2px);
          }

          100% {
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .mapSection {
            height: 240px;
          }

          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}