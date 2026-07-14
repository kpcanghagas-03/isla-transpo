"use client";

import { useMemo } from "react";
import { ListOrdered } from "lucide-react";
import {
  ScheduleRequest,
  VehicleMap,
  splitVehicles,
  lookupDriver,
  getTripWindow,
  minutesToTime,
  getConflicts,
  getDriverColor,
  getStatusBadge,
  getPassengerCount,
} from "./types";

type TodaysDispatchQueueProps = {
  requests: ScheduleRequest[];
  vehicleMap: VehicleMap;
  driverColorMap: Record<string, string>;
  date: string;
  toPHDate: (isoDate: string | null) => string | null;
  activeRequestId: number | null;
  onSelectRequest: (request: ScheduleRequest) => void;
};

export default function TodaysDispatchQueue({
  requests,
  vehicleMap,
  driverColorMap,
  date,
  toPHDate,
  activeRequestId,
  onSelectRequest,
}: TodaysDispatchQueueProps) {
  const conflicts = useMemo(() => getConflicts(requests, vehicleMap), [requests, vehicleMap]);

  const queue = useMemo(
    () =>
      requests
        .filter((r) => r.pick_up_date === date)
        .sort((a, b) => (a.pick_up_time || "").localeCompare(b.pick_up_time || "")),
    [requests, date]
  );

  return (
    <div className="tdqPanel">
      <div className="tdqHeader">
        <ListOrdered size={16} />
        <span>Today's Dispatch Queue</span>
        <span className="tdqDate">{toPHDate(date) || date}</span>
      </div>

      <div className="tdqList">
        {queue.length === 0 ? (
          <p className="tdqEmpty">No trips scheduled for this day.</p>
        ) : (
          queue.map((r) => {
            const win = getTripWindow(r);
            const vehicles = splitVehicles(r.assigned_vehicle);
            const driver = vehicles.map((v) => lookupDriver(v, vehicleMap)?.driver).find(Boolean) || null;
            const color = getDriverColor(driver, driverColorMap);
            const hasConflict = conflicts.has(r.id);
            const isActive = activeRequestId === r.id;

            return (
              <button
                key={r.id}
                className={`tdqCard ${isActive ? "tdqCardActive" : ""}`}
                style={{ borderLeftColor: color }}
                onClick={() => onSelectRequest(r)}
              >
                <div className="tdqTop">
                  <span className="tdqTime">
                    {win ? `${minutesToTime(win.start)}–${minutesToTime(win.end)}` : r.pick_up_time || "No time"}
                  </span>
                  <span className="tdqBadge">{getStatusBadge(r.status)}</span>
                </div>
                <div className="tdqMetaRow">👥 {getPassengerCount(r)} Passenger{getPassengerCount(r) === 1 ? "" : "s"}</div>
                <div className="tdqMetaRow">🚐 {vehicles.map((v) => v.split(" - ")[0]).join(", ") || "No vehicle"}</div>
                <div className="tdqMetaRow" style={{ color }}>
                  👨 {driver || "Unassigned"}
                </div>
                {hasConflict && <div className="tdqConflict">⚠ Conflict</div>}
              </button>
            );
          })
        )}
      </div>

      <style jsx>{`
        .tdqPanel {
          background: white;
          border-radius: 16px;
          padding: 16px;
          box-shadow: 0 8px 18px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
          gap: 12px;
          height: 100%;
        }

        .tdqHeader {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          color: #0f172a;
          font-size: 14px;
          flex-wrap: wrap;
        }

        .tdqDate {
          margin-left: auto;
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
        }

        .tdqList {
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-height: 560px;
          overflow-y: auto;
        }

        .tdqEmpty {
          font-size: 12px;
          color: #94a3b8;
          font-weight: 600;
        }

        .tdqCard {
          text-align: left;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-left: 4px solid #94a3b8;
          border-radius: 10px;
          padding: 9px 11px;
          cursor: pointer;
          font-family: inherit;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .tdqCard:hover {
          background: #f1f5f9;
        }

        .tdqCardActive {
          background: #eaf1fb;
          box-shadow: 0 0 0 1px #1f5aa6 inset;
        }

        .tdqTop {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .tdqTime {
          font-size: 12px;
          font-weight: 800;
          color: #111827;
        }

        .tdqBadge {
          font-size: 13px;
        }

        .tdqMetaRow {
          font-size: 11px;
          font-weight: 600;
          color: #475569;
        }

        .tdqConflict {
          font-size: 10.5px;
          font-weight: 800;
          color: #b91c1c;
          margin-top: 2px;
        }
      `}</style>
    </div>
  );
}
