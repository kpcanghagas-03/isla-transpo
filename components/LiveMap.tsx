"use client";

import dynamic from "next/dynamic";

const MapContainer = dynamic(
  () =>
    import("react-leaflet").then(
      (mod) => mod.MapContainer
    ),
  {
    ssr: false,
  }
);

const TileLayer = dynamic(
  () =>
    import("react-leaflet").then(
      (mod) => mod.TileLayer
    ),
  {
    ssr: false,
  }
);

const Marker = dynamic(
  () =>
    import("react-leaflet").then(
      (mod) => mod.Marker
    ),
  {
    ssr: false,
  }
);

const Popup = dynamic(
  () =>
    import("react-leaflet").then(
      (mod) => mod.Popup
    ),
  {
    ssr: false,
  }
);

type Request = {
  id: number;
  full_name: string;
  priority: string;
  status: string;
  assigned_vehicle?: string;
  driver_lat?: number;
  driver_lng?: number;
};

export default function LiveMap({
  requests,
}: {
  requests: Request[];
}) {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <MapContainer
        center={[14.5995, 120.9842]}
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

        {requests?.map((r) => {
          if (
            !r.driver_lat ||
            !r.driver_lng
          ) {
            return null;
          }

          return (
            <Marker
              key={r.id}
              position={[
                Number(r.driver_lat),
                Number(r.driver_lng),
              ]}
            >
              <Popup>
                <div>
                  <b>{r.full_name}</b>

                  <br />

                  {r.priority} - {r.status}

                  <br />

                  🚐{" "}
                  {r.assigned_vehicle ||
                    "No vehicle"}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}