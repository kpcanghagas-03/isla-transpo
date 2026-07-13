"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, User } from "lucide-react";
import {
  ScheduleRequest,
  VehicleMap,
  VehicleStatusMap,
  splitVehicles,
  lookupDriver,
  getTripWindow,
  minutesToTime,
  getConflicts,
  getDriverAvailability,
  AVAILABILITY_LABEL,
  AVAILABILITY_COLOR,
} from "./types";

type DriverTimelineProps = {
  requests: ScheduleRequest[];
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

export default function DriverTimeline({
  requests,
  vehicleMap,
  statusMap,
  date,
  onDateChange,
  toPHDate,
  onSelectRequest,
}: DriverTimelineProps) {
  const conflicts = useMemo(() => getConflicts(requests, vehicleMap), [requests, vehicleMap]);

  const drivers = useMemo(() => {
    const set = new Set<string>();
    Object.values(vehicleMap).forEach((info) => set.add(info.driver));
    return Array.from(set).sort();
  }, [vehicleMap]);

  const rows = useMemo(() => {
    return drivers.map((driver) => {
      const trips = requests
        .filter(
          (r) =>
            r.pick_up_date === date &&
            splitVehicles(r.assigned_vehicle).some((v) => lookupDriver(v, vehicleMap)?.driver === driver)
        )
        .sort((a, b) => (a.pick_up_time || "").localeCompare(b.pick_up_time || ""));

      const availability = getDriverAvailability(driver, date, requests, vehicleMap, conflicts, statusMap);

      return { driver, trips, availability };
    });
  }, [drivers, requests, date, vehicleMap, conflicts, statusMap]);

  return (
    <div className="dtPanel">
      <div className="dtHeader">
        <span className="dtTitle">
          <User size={16} /> Driver Timeline
        </span>
        <div className="dtNav">
          <button className="dtNavBtn" onClick={() => onDateChange(addDays(date, -1))}>
            <ChevronLeft size={14} />
          </button>
          <span className="dtDateLabel">{toPHDate(date) || date}</span>
          <button className="dtNavBtn" onClick={() => onDateChange(addDays(date, 1))}>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="dtList">
        {rows.map(({ driver, trips, availability }) => (
          <div key={driver} className="dtRow">
            <div className="dtDriverCol">
              <span className="dtDriverName">{driver}</span>
              <span className="dtAvailability" style={{ color: AVAILABILITY_COLOR[availability] }}>
                {AVAILABILITY_LABEL[availability]}
              </span>
            </div>
            <div className="dtTripsCol">
              {trips.length === 0 ? (
                <span className="dtNoTrips">No trips scheduled</span>
              ) : (
                trips.map((r) => {
                  const win = getTripWindow(r);
                  const hasConflict = conflicts.has(r.id);
                  return (
                    <button
                      key={r.id}
                      className={`dtChip ${hasConflict ? "dtChipConflict" : ""}`}
                      onClick={() => onSelectRequest(r)}
                    >
                      <span className="dtChipTime">
                        {win ? `${minutesToTime(win.start)}–${minutesToTime(win.end)}` : r.pick_up_time || "—"}
                      </span>
                      <span className="dtChipLabel">
                        {r.pickup_location || "?"} → {r.destination || "?"}
                      </span>
                      {hasConflict && <span className="dtChipWarn">⚠</span>}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .dtPanel {
          background: white;
          border-radius: 16px;
          padding: 16px;
          box-shadow: 0 8px 18px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .dtHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
        }

        .dtTitle {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          color: #0f172a;
          font-size: 14px;
        }

        .dtNav {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .dtNavBtn {
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 8px;
          padding: 5px;
          cursor: pointer;
          display: flex;
        }

        .dtDateLabel {
          font-size: 12.5px;
          font-weight: 700;
          color: #475569;
          white-space: nowrap;
        }

        .dtList {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-height: 420px;
          overflow-y: auto;
        }

        .dtRow {
          display: flex;
          gap: 12px;
          border-bottom: 1px dashed #eef2f7;
          padding-bottom: 10px;
        }

        .dtDriverCol {
          flex: 0 0 160px;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .dtDriverName {
          font-size: 12.5px;
          font-weight: 700;
          color: #111827;
        }

        .dtAvailability {
          font-size: 11px;
          font-weight: 700;
        }

        .dtTripsCol {
          flex: 1;
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          align-content: flex-start;
        }

        .dtNoTrips {
          font-size: 11.5px;
          color: #cbd5e1;
          font-weight: 600;
        }

        .dtChip {
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

        .dtChip:hover {
          background: #eef2ff;
        }

        .dtChipConflict {
          background: #fef2f2;
          border-color: #fecaca;
        }

        .dtChipTime {
          font-weight: 800;
          color: #1f5aa6;
        }

        .dtChipLabel {
          color: #475569;
          font-weight: 600;
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .dtChipWarn {
          color: #b91c1c;
        }

        @media (max-width: 768px) {
          .dtRow {
            flex-direction: column;
            gap: 6px;
          }
          .dtDriverCol {
            flex: none;
          }
        }
      `}</style>
    </div>
  );
}
