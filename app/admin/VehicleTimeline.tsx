"use client";

import { useMemo } from "react";
import { ChevronLeft, ChevronRight, Truck } from "lucide-react";
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

type VehicleTimelineProps = {
  requests: ScheduleRequest[];
  vehicleOptions: string[];
  vehicleMap: VehicleMap;
  statusMap: VehicleStatusMap;
  date: string;
  onDateChange: (date: string) => void;
  toPHDate: (isoDate: string | null) => string | null;
  onSelectRequest: (request: ScheduleRequest) => void;
};

function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export default function VehicleTimeline({
  requests,
  vehicleOptions,
  vehicleMap,
  statusMap,
  date,
  onDateChange,
  toPHDate,
  onSelectRequest,
}: VehicleTimelineProps) {
  const conflicts = useMemo(() => getConflicts(requests, vehicleMap), [requests, vehicleMap]);

  const rows = useMemo(() => {
    return vehicleOptions.map((vehicle) => {
      const trips = requests
        .filter((r) => r.pick_up_date === date && splitVehicles(r.assigned_vehicle).includes(vehicle))
        .sort((a, b) => (a.pick_up_time || "").localeCompare(b.pick_up_time || ""));

      const availability = getVehicleAvailability(vehicle, date, requests, conflicts, statusMap);

      return { vehicle, trips, availability };
    });
  }, [vehicleOptions, requests, date, conflicts, statusMap]);

  return (
    <div className="vtPanel">
      <div className="vtHeader">
        <span className="vtTitle">
          <Truck size={16} /> Vehicle Timeline
        </span>
        <div className="vtNav">
          <button className="vtNavBtn" onClick={() => onDateChange(addDays(date, -1))}>
            <ChevronLeft size={14} />
          </button>
          <span className="vtDateLabel">{toPHDate(date) || date}</span>
          <button className="vtNavBtn" onClick={() => onDateChange(addDays(date, 1))}>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="vtList">
        {rows.map(({ vehicle, trips, availability }) => (
          <div key={vehicle} className="vtRow">
            <div className="vtVehicleCol">
              <span className="vtVehicleName">{vehicle.split(" - ")[0]}</span>
              <span className="vtAvailability" style={{ color: AVAILABILITY_COLOR[availability] }}>
                {AVAILABILITY_LABEL[availability]}
              </span>
            </div>
            <div className="vtTripsCol">
              {trips.length === 0 ? (
                <span className="vtNoTrips">No trips scheduled</span>
              ) : (
                trips.map((r) => {
                  const win = getTripWindow(r);
                  const hasConflict = conflicts.has(r.id);
                  return (
                    <button
                      key={r.id}
                      className={`vtChip ${hasConflict ? "vtChipConflict" : ""}`}
                      onClick={() => onSelectRequest(r)}
                    >
                      <span className="vtChipTime">
                        {win ? `${minutesToTime(win.start)}–${minutesToTime(win.end)}` : r.pick_up_time || "—"}
                      </span>
                      <span className="vtChipLabel">
                        {r.pickup_location || "?"} → {r.destination || "?"}
                      </span>
                      {hasConflict && <span className="vtChipWarn">⚠</span>}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .vtPanel {
          background: white;
          border-radius: 16px;
          padding: 16px;
          box-shadow: 0 8px 18px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .vtHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
        }

        .vtTitle {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          color: #0f172a;
          font-size: 14px;
        }

        .vtNav {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .vtNavBtn {
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 8px;
          padding: 5px;
          cursor: pointer;
          display: flex;
        }

        .vtDateLabel {
          font-size: 12.5px;
          font-weight: 700;
          color: #475569;
          white-space: nowrap;
        }

        .vtList {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-height: 420px;
          overflow-y: auto;
        }

        .vtRow {
          display: flex;
          gap: 12px;
          border-bottom: 1px dashed #eef2f7;
          padding-bottom: 10px;
        }

        .vtVehicleCol {
          flex: 0 0 160px;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .vtVehicleName {
          font-size: 12.5px;
          font-weight: 700;
          color: #111827;
        }

        .vtAvailability {
          font-size: 11px;
          font-weight: 700;
        }

        .vtTripsCol {
          flex: 1;
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          align-content: flex-start;
        }

        .vtNoTrips {
          font-size: 11.5px;
          color: #cbd5e1;
          font-weight: 600;
        }

        .vtChip {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 999px;
          padding: 5px 10px;
          font-size: 11px;
          cursor: pointer;
          font-family: inherit;
        }

        .vtChip:hover {
          background: #eef2ff;
        }

        .vtChipConflict {
          background: #fef2f2;
          border-color: #fecaca;
        }

        .vtChipTime {
          font-weight: 800;
          color: #a61e22;
        }

        .vtChipLabel {
          color: #475569;
          font-weight: 600;
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .vtChipWarn {
          color: #b91c1c;
        }

        @media (max-width: 768px) {
          .vtRow {
            flex-direction: column;
            gap: 6px;
          }
          .vtVehicleCol {
            flex: none;
          }
        }
      `}</style>
    </div>
  );
}
