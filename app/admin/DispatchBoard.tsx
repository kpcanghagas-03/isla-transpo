"use client";

import { useMemo } from "react";
import { LayoutList } from "lucide-react";
import {
  ScheduleRequest,
  VehicleMap,
  VehicleStatusMap,
  splitVehicles,
  getTripWindow,
  minutesToTime,
  getConflicts,
  getVehicleAvailability,
  AVAILABILITY_LABEL,
  AVAILABILITY_COLOR,
} from "./types";

type DispatchBoardProps = {
  requests: ScheduleRequest[];
  vehicleOptions: string[];
  vehicleMap: VehicleMap;
  statusMap: VehicleStatusMap;
  toPHTime: (time: string | null) => string | null;
  onSelectRequest: (request: ScheduleRequest) => void;
};

function nowMinutes(): number {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function DispatchBoard({
  requests,
  vehicleOptions,
  vehicleMap,
  statusMap,
  toPHTime,
  onSelectRequest,
}: DispatchBoardProps) {
  const today = todayISO();
  const now = nowMinutes();
  const conflicts = useMemo(() => getConflicts(requests, vehicleMap), [requests, vehicleMap]);

  const rows = useMemo(() => {
    return vehicleOptions.map((vehicle) => {
      const driver = vehicleMap[vehicle]?.driver || "Unassigned";
      const trips = requests
        .filter((r) => r.pick_up_date === today && splitVehicles(r.assigned_vehicle).includes(vehicle))
        .map((r) => ({ r, win: getTripWindow(r) }))
        .filter((t): t is { r: ScheduleRequest; win: { start: number; end: number } } => t.win !== null)
        .sort((a, b) => a.win.start - b.win.start);

      const current = trips.find((t) => t.win.start <= now && now < t.win.end) || null;
      const next = trips.find((t) => t.win.start > now) || null;

      const availability = getVehicleAvailability(vehicle, today, requests, conflicts, statusMap);

      return { vehicle, driver, current, next, availability };
    });
  }, [vehicleOptions, vehicleMap, requests, today, now, conflicts, statusMap]);

  return (
    <div className="dbPanel">
      <div className="dbHeader">
        <LayoutList size={16} />
        <span>Dispatch Board — Today</span>
      </div>

      <div className="dbTableWrap">
        <table className="dbTable">
          <thead>
            <tr>
              <th>Driver</th>
              <th>Vehicle</th>
              <th>Current Trip</th>
              <th>Next Trip</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ vehicle, driver, current, next, availability }) => (
              <tr key={vehicle}>
                <td className="dbWrap">{driver}</td>
                <td className="dbWrap">{vehicle.split(" - ")[0]}</td>
                <td>
                  {current ? (
                    <button className="dbTripBtn" onClick={() => onSelectRequest(current.r)}>
                      {minutesToTime(current.win.start)}–{minutesToTime(current.win.end)} ·{" "}
                      {current.r.pickup_location || "?"} → {current.r.destination || "?"}
                    </button>
                  ) : (
                    <span className="dbNone">—</span>
                  )}
                </td>
                <td>
                  {next ? (
                    <button className="dbTripBtn" onClick={() => onSelectRequest(next.r)}>
                      {minutesToTime(next.win.start)} · {next.r.pickup_location || "?"} → {next.r.destination || "?"}
                    </button>
                  ) : (
                    <span className="dbNone">—</span>
                  )}
                </td>
                <td>
                  <span className="dbStatusBadge" style={{ color: AVAILABILITY_COLOR[availability] }}>
                    {AVAILABILITY_LABEL[availability]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .dbPanel {
          background: white;
          border-radius: 16px;
          padding: 16px;
          box-shadow: 0 8px 18px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .dbHeader {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          color: #0f172a;
          font-size: 14px;
        }

        .dbTableWrap {
          overflow-x: auto;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
        }

        .dbTable {
          border-collapse: collapse;
          width: 100%;
          min-width: 720px;
          font-size: 12.5px;
        }

        .dbTable thead th {
          background: #0f172a;
          color: white;
          text-align: left;
          padding: 10px 12px;
          font-weight: 700;
          font-size: 11.5px;
        }

        .dbTable tbody td {
          padding: 9px 12px;
          border-bottom: 1px solid #eef2f7;
          color: #111827;
          vertical-align: top;
        }

        .dbTable tbody tr:hover {
          background: #f8fafc;
        }

        .dbWrap {
          white-space: normal;
          word-break: break-word;
          font-weight: 600;
        }

        .dbTripBtn {
          background: #eef2ff;
          border: 1px solid #c7d7f5;
          color: #1f5aa6;
          font-weight: 600;
          border-radius: 8px;
          padding: 6px 10px;
          cursor: pointer;
          font-family: inherit;
          text-align: left;
          font-size: 12px;
        }

        .dbTripBtn:hover {
          background: #e0e9fb;
        }

        .dbNone {
          color: #cbd5e1;
          font-weight: 700;
        }

        .dbStatusBadge {
          font-weight: 700;
          font-size: 12px;
          white-space: nowrap;
        }

        @media (max-width: 768px) {
          .dbTable {
            min-width: 600px;
          }
        }
      `}</style>
    </div>
  );
}
