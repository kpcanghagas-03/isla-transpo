"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import type { LatLngExpression } from "leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ================= FIX LEAFLET ICONS =================
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ================= MAP CENTER =================
const center: LatLngExpression = [
  14.5995,
  120.9842,
];

// ================= COMPONENT =================
export default function LiveMap({
  requests,
}: any) {
  return (
    <MapContainer
      center={center}
      zoom={12}
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />

      {requests
        ?.filter(
          (r: any) =>
            r.driver_lat && r.driver_lng
        )
        .map((r: any) => (
          <Marker
            key={r.id}
            position={[
              Number(r.driver_lat),
              Number(r.driver_lng),
            ]}
          >
            <Popup>
              <b>{r.full_name}</b>

              <br />

              {r.priority} - {r.status}

              <br />

              🚐{" "}
              {r.assigned_vehicle ||
                "No vehicle"}
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}