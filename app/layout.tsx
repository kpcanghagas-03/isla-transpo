"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// FIX ICON ISSUE (Next.js)
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type Request = {
  id: number;
  full_name: string;
  organization: string;
  contact_number: string;
  passengers: string;
  pickup_location: string;
  destination: string;
  travel_datetime: string;
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

  // ================= FETCH =================
  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from("transport_requests")
      .select("*");

    if (error) {
      console.log(error);
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
        { event: "*", schema: "public", table: "transport_requests" },
        () => fetchRequests()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ================= UPDATE =================
  const updateField = async (id: number, field: string, value: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, [field]: value } : r
      )
    );

    await supabase
      .from("transport_requests")
      .update({ [field]: value })
      .eq("id", id);
  };

  // ================= ICON =================
  const vehicleIcon = (v: string) => {
    if (v === "Van") return "🚐";
    if (v === "Bus") return "🚌";
    if (v === "Car") return "🚗";
    return "🚨";
  };

  // ================= SORT (VIP + FIFO) =================
  const sorted = [...requests].sort((a, b) => {
    const weight = (p: string) =>
      p === "VIP" ? 3 : p === "Staff" ? 2 : 1;

    if (weight(a.priority) !== weight(b.priority)) {
      return weight(b.priority) - weight(a.priority);
    }

    return (
      new Date(a.created_at).getTime() -
      new Date(b.created_at).getTime()
    );
  });

  // ================= MAP =================
  const center = { lat: 14.5995, lng: 120.9842 };

  return (
    <main style={{ minHeight: "100vh", position: "relative" }}>
      {/* BACKGROUND */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: "url('/camiguin.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: -2,
        }}
      />

      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.55)",
          zIndex: -1,
        }}
      />

      {/* CONTAINER */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "clamp(12px, 2vw, 24px)",
          fontFamily: "Segoe UI",
          color: "white",
        }}
      >
        <h1>ISLA-TRANSPO ADMIN DASHBOARD</h1>

        {/* ================= LIVE MAP ================= */}
        <div
          style={{
            height: 300,
            borderRadius: 12,
            overflow: "hidden",
            marginBottom: 20,
          }}
        >
          <MapContainer
            center={center}
            zoom={12}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="© OpenStreetMap contributors"
            />

            {requests
              .filter((r) => r.driver_lat && r.driver_lng)
              .map((r) => (
                <Marker
                  key={r.id}
                  position={[r.driver_lat!, r.driver_lng!]}
                >
                  <Popup>
                    <b>{r.full_name}</b>
                    <br />
                    {r.priority} - {r.status}
                    <br />
                    🚐 {r.assigned_vehicle || "No vehicle"}
                  </Popup>
                </Marker>
              ))}
          </MapContainer>
        </div>

        {/* ================= GRID ================= */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 12,
            }}
          >
            {sorted.map((req) => {
              const isEmergency = req.status === "Emergency";

              return (
                <div
                  key={req.id}
                  style={{
                    background: isEmergency
                      ? "linear-gradient(135deg,#ffe4e6,#fff)"
                      : "white",
                    color: "#111",
                    padding: 14,
                    borderRadius: 12,
                    boxShadow: isEmergency
                      ? "0 0 18px red"
                      : "0 4px 12px rgba(0,0,0,0.15)",
                    borderLeft:
                      req.priority === "VIP"
                        ? "6px solid #dc2626"
                        : req.priority === "Staff"
                        ? "6px solid #2563eb"
                        : "6px solid #9ca3af",

                    animation: isEmergency
                      ? "bounce 0.8s infinite, pulse 1.2s infinite"
                      : "none",

                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  <b>
                    {req.full_name}{" "}
                    {req.priority === "VIP" && (
                      <span style={{ color: "#dc2626" }}>
                        (VIP)
                      </span>
                    )}
                  </b>

                  <span>{req.pickup_location}</span>
                  <span>{req.destination}</span>

                  {/* PRIORITY */}
                  <select
                    value={req.priority}
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
                  <select
                    value={req.status}
                    onChange={(e) =>
                      updateField(req.id, "status", e.target.value)
                    }
                  >
                    <option>Pending</option>
                    <option>Approved</option>
                    <option>On the way</option>
                    <option>Completed</option>
                    <option>Disapproved</option>
                    <option>Emergency</option>
                  </select>

                  {/* VEHICLE */}
                  <select
                    value={req.assigned_vehicle || ""}
                    onChange={(e) =>
                      updateField(
                        req.id,
                        "assigned_vehicle",
                        e.target.value
                      )
                    }
                  >
                    <option value="">Unassigned</option>
                    <option>Van</option>
                    <option>Bus</option>
                    <option>Car</option>
                  </select>

                  <div>
                    {req.assigned_vehicle
                      ? `${vehicleIcon(req.assigned_vehicle)} ${req.assigned_vehicle}`
                      : "🚨 No Vehicle Assigned"}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ================= ANIMATIONS ================= */}
      <style>
        {`
          @keyframes bounce {
            0% { transform: translateY(0); }
            30% { transform: translateY(-6px); }
            50% { transform: translateY(0); }
            70% { transform: translateY(-3px); }
            100% { transform: translateY(0); }
          }

          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.02); }
            100% { transform: scale(1); }
          }
        `}
      </style>
    </main>
  );
}