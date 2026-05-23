"use client";

import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// IMPORTANT: Match your AdminPage Request type (flexible version)
export type LiveMapRequest = {
  id: number;
  requester_name: string;
  pickup_location: string | null;
  destination: string | null;

  status: "Pending" | "Approved" | "On the way" | "Completed" | "Disapproved" | "Emergency";

  driver_lat?: number | null;
  driver_lng?: number | null;
};

type Props = {requests: LiveMapRequest[];
};

export default function LiveMap({ requests }: Props) {
  useEffect(() => {
    // prevent multiple map instances
    const container = L.DomUtil.get("map");

    if (container != null) {
      (container as any)._leaflet_id = null;
    }

    const map = L.map("map").setView([6.9214, 122.079], 12); // Zamboanga default

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    // add markers
    requests.forEach((req) => {
      if (req.driver_lat && req.driver_lng) {
        const color =
          req.status === "Approved"
            ? "green"
            : req.status === "On the way"
            ? "blue"
            : req.status === "Emergency"
            ? "red"
            : "gray";

        const marker = L.circleMarker([req.driver_lat, req.driver_lng], {
          radius: 10,
          color,
          fillColor: color,
          fillOpacity: 0.8,
        }).addTo(map);

        marker.bindPopup(`
          <b>${req.requester_name}</b><br/>
          ${req.pickup_location || "No pickup"} → ${req.destination || "No destination"}<br/>
          Status: ${req.status}
        `);
      }
    });

    return () => {
      map.remove();
    };
  }, [requests]);

  return <div id="map" style={{ height: "100%", width: "100%" }} />;
}