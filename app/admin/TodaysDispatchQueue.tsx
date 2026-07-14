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
  getStatusColor,
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
  // Optional: wire this up to jump the parent view to a full/table listing
  // of this day's trips. Omit and the footer button just hides itself.
  onViewAll?: () => void;
};

function fullDateLabel(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-PH", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

export default function TodaysDispatchQueue({
  requests,
  vehicleMap,
  driverColorMap,
  date,
  toPHDate,
  activeRequestId,
  onSelectRequest,
  onViewAll,
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
        <div className="tdqHeaderTop">
          <div className="tdqHeaderTitle">
            <ListOrdered size={16} />
            <span>Today's Trips</span>
          </div>
          <span className="tdqCountBadge">{queue.length}</span>
        </div>
        <span className="tdqDate">{fullDateLabel(date) || toPHDate(date) || date}</span>
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
                    {win ? `${minutesToTime(win.start)} – ${minutesToTime(win.end)}` : r.pick_up_time || "No time"}
                  </span>
                  <span className="tdqStatusPill" style={{ background: getStatusColor(r.status) }}>
                    {r.status}
                  </span>
                </div>
                <div className="tdqMetaRow">👥 {getPassengerCount(r)} pax</div>
                <div className="tdqMetaRow">🚐 {vehicles.map((v) => v.split(" - ")[0]).join(", ") || "No vehicle"}</div>
                <div className="tdqMetaRow">
                  <span className="tdqDot" style={{ background: color }} />
                  {driver || "Unassigned"}
                </div>
                {hasConflict && <div className="tdqConflict">⚠ Conflict</div>}
              </button>
            );
          })
        )}
      </div>

      {onViewAll && (
        <button className="tdqViewAllBtn" onClick={onViewAll}>
          View All Today's Trips
        </button>
      )}

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
          flex-direction: column;
          gap: 2px;
        }

        .tdqHeaderTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .tdqHeaderTitle {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 800;
          color: #0f172a;
          font-size: 14px;
        }

        .tdqCountBadge {
          background: #1f5aa6;
          color: white;
          font-size: 11px;
          font-weight: 800;
          min-width: 20px;
          height: 20px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 6px;
        }

        .tdqDate {
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
          background: white;
          border: 1px solid #e2e8f0;
          border-left: 4px solid #94a3b8;
          border-radius: 10px;
          padding: 10px 12px;
          cursor: pointer;
          font-family: inherit;
          display: flex;
          flex-direction: column;
          gap: 4px;
          box-shadow: 0 1px 4px rgba(15, 23, 42, 0.05);
          transition: box-shadow 0.15s ease;
        }

        .tdqCard:hover {
          box-shadow: 0 6px 14px rgba(15, 23, 42, 0.1);
        }

        .tdqCardActive {
          background: #eaf1fb;
          box-shadow: 0 0 0 1px #1f5aa6 inset;
        }

        .tdqTop {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 6px;
        }

        .tdqTime {
          font-size: 12px;
          font-weight: 800;
          color: #111827;
        }

        .tdqStatusPill {
          font-size: 9.5px;
          font-weight: 800;
          color: white;
          padding: 2px 8px;
          border-radius: 999px;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .tdqMetaRow {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 600;
          color: #475569;
        }

        .tdqDot {
          width: 7px;
          height: 7px;
          border-radius: 999px;
          flex-shrink: 0;
        }

        .tdqConflict {
          font-size: 10.5px;
          font-weight: 800;
          color: #b91c1c;
          margin-top: 2px;
        }

        .tdqViewAllBtn {
          border: 1px solid #1f5aa6;
          background: white;
          color: #1f5aa6;
          border-radius: 10px;
          padding: 9px 12px;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
        }

        .tdqViewAllBtn:hover {
          background: #eef2ff;
        }
      `}</style>
    </div>
  );
}
