"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TrackPage() {
  const [code, setCode] = useState("");
  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const searchRequest = async () => {
  if (!code) {
    alert("Please enter request code");
    return;
  }

  setLoading(true);

  const { data, error } = await supabase
    .from("transport_requests")
    .select("*")
    .eq("request_code", code)
    .maybeSingle(); // ✅ SAFE instead of .single()

  setLoading(false);

  if (error) {
    console.log(error);
    alert("Error fetching request");
    setRequest(null);
    return;
  }

  if (!data) {
    alert("Request not found");
    setRequest(null);
    return;
  }

  setRequest(data);
};

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: "0 auto" }}>
      <h2>Track My Request</h2>

      <input
        placeholder="Enter Request Code (ISLA-XXXXXX)"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />

      <button
        onClick={searchRequest}
        disabled={loading}
        style={{ padding: 10, width: "100%" }}
      >
        {loading ? "Searching..." : "Track Request"}
      </button>

      {request && (
        <div style={{ marginTop: 20, padding: 10, border: "1px solid #ccc" }}>
          <p><b>Name:</b> {request.requester_name}</p>
          <p><b>Status:</b> {request.status}</p>
          <p><b>Pickup:</b> {request.pickup_location}</p>
          <p><b>Destination:</b> {request.destination}</p>
          <p><b>Schedule:</b> {request.pick_up_date} {request.pick_up_time}</p>
        </div>
      )}
      {request === null && !loading && (
        <p style={{ marginTop: 20, color: "#64748b" }}>
            No request found
        </p>
        )}
    </div>
  );
}