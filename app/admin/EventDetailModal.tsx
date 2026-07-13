"use client";

import { useMemo, useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import {
  ScheduleRequest,
  VehicleMap,
  VehicleStatusMap,
  splitVehicles,
  lookupDriver,
  getConflicts,
  getVehicleAvailability,
  getDriverAvailability,
} from "./types";

type EventDetailModalProps = {
  request: ScheduleRequest;
  requests: ScheduleRequest[];
  vehicleOptions: string[];
  vehicleMap: VehicleMap;
  statusMap: VehicleStatusMap;
  toPHDate: (isoDate: string | null) => string | null;
  toPHTime: (time: string | null) => string | null;
  statusColor: (status: string) => string;
  onClose: () => void;
  // Optional: wire this up to your existing update logic (e.g. a
  // supabase.from("transport_requests").update({ drop_off_time }) call)
  // to let dispatchers set the trip's end time from here.
  onSaveDropOffTime?: (id: number, dropOffTime: string) => void;
};

export default function EventDetailModal({
  request,
  requests,
  vehicleOptions,
  vehicleMap,
  statusMap,
  toPHDate,
  toPHTime,
  statusColor,
  onClose,
  onSaveDropOffTime,
}: EventDetailModalProps) {
  const [dropOffDraft, setDropOffDraft] = useState(request.drop_off_time || "");

  const conflicts = useMemo(() => getConflicts(requests, vehicleMap), [requests, vehicleMap]);
  const myConflicts = conflicts.get(request.id) || [];

  const vehicles = splitVehicles(request.assigned_vehicle);
  const drivers = vehicles.map((v) => lookupDriver(v, vehicleMap)?.driver).filter(Boolean) as string[];

  // Suggested alternatives: vehicles that are "available" on this pickup
  // date and not already on this request.
  const suggestions = useMemo(() => {
    if (myConflicts.length === 0) return [];
    return vehicleOptions
      .filter((v) => !vehicles.includes(v))
      .filter(
        (v) => getVehicleAvailability(v, request.pick_up_date, requests, conflicts, statusMap) === "available"
      )
      .slice(0, 4);
  }, [myConflicts.length, vehicleOptions, vehicles, request.pick_up_date, requests, conflicts, statusMap]);

  return (
    <div className="edmOverlay" onClick={onClose}>
      <div className="edmModal" onClick={(e) => e.stopPropagation()}>
        <div className="edmHeader">
          <div>
            <h3 className="edmTitle">{request.passenger_names || request.requester_name}</h3>
            {request.request_code && <span className="edmCode">{request.request_code}</span>}
          </div>
          <button className="edmCloseBtn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <span className="edmStatusBadge" style={{ background: statusColor(request.status) }}>
          {request.status}
        </span>

        {myConflicts.length > 0 && (
          <div className="edmConflictBox">
            <div className="edmConflictTitle">
              <AlertTriangle size={15} />
              Scheduling conflict detected
            </div>
            {myConflicts.map((c) => (
              <div key={c.id} className="edmConflictLine">
                ⚠ Overlaps with {c.passenger_names || c.requester_name} (
                {toPHTime(c.pick_up_time) || c.pick_up_time || "no time"}
                {c.drop_off_time ? `–${toPHTime(c.drop_off_time)}` : ""})
              </div>
            ))}
            {suggestions.length > 0 && (
              <div className="edmSuggestWrap">
                <span className="edmSuggestLabel">Suggested available vehicles:</span>
                <div className="edmSuggestList">
                  {suggestions.map((v) => (
                    <span key={v} className="edmSuggestChip">
                      {v.split(" - ")[0]} ({vehicleMap[v]?.driver})
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="edmGrid">
          <div className="edmField">
            <span className="edmLabel">Pickup Time</span>
            <span className="edmValue">{toPHTime(request.pick_up_time) || "N/A"}</span>
          </div>
          <div className="edmField">
            <span className="edmLabel">Drop-off Time</span>
            {onSaveDropOffTime ? (
              <div className="edmDropOffEdit">
                <input
                  type="time"
                  value={dropOffDraft || ""}
                  onChange={(e) => setDropOffDraft(e.target.value)}
                  className="edmTimeInput"
                />
                <button
                  className="edmSaveBtn"
                  onClick={() => dropOffDraft && onSaveDropOffTime(request.id, dropOffDraft)}
                >
                  Save
                </button>
              </div>
            ) : (
              <span className="edmValue">{toPHTime(request.drop_off_time || null) || "Not set (defaults to +60 min)"}</span>
            )}
          </div>
          <div className="edmField">
            <span className="edmLabel">Pickup Date</span>
            <span className="edmValue">{toPHDate(request.pick_up_date) || "N/A"}</span>
          </div>
          <div className="edmField">
            <span className="edmLabel">Driver(s)</span>
            <span className="edmValue">{drivers.join(", ") || "Unassigned"}</span>
          </div>
          <div className="edmField">
            <span className="edmLabel">Vehicle(s)</span>
            <span className="edmValue">{vehicles.map((v) => v.split(" - ")[0]).join(", ") || "None"}</span>
          </div>
          <div className="edmField">
            <span className="edmLabel">Origin</span>
            <span className="edmValue">{request.pickup_location || "N/A"}</span>
          </div>
          <div className="edmField">
            <span className="edmLabel">Destination</span>
            <span className="edmValue">{request.destination || "N/A"}</span>
          </div>
          {request.flight_no && (
            <div className="edmField">
              <span className="edmLabel">Flight No.</span>
              <span className="edmValue">{request.flight_no}</span>
            </div>
          )}
          {request.contact_person && (
            <div className="edmField">
              <span className="edmLabel">Contact</span>
              <span className="edmValue">{request.contact_person}</span>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .edmOverlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          z-index: 200;
        }

        .edmModal {
          background: white;
          border-radius: 18px;
          padding: 22px;
          max-width: 560px;
          width: 100%;
          max-height: 85vh;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 14px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
        }

        .edmHeader {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 10px;
        }

        .edmTitle {
          margin: 0;
          font-size: 18px;
          font-weight: 800;
          color: #0f172a;
        }

        .edmCode {
          font-size: 11px;
          font-family: monospace;
          font-weight: 700;
          color: #64748b;
        }

        .edmCloseBtn {
          border: none;
          background: #f1f5f9;
          border-radius: 8px;
          padding: 6px;
          cursor: pointer;
          color: #475569;
          flex-shrink: 0;
        }

        .edmStatusBadge {
          color: white;
          padding: 5px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          width: fit-content;
        }

        .edmConflictBox {
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 12px;
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .edmConflictTitle {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 800;
          color: #b91c1c;
          font-size: 13px;
        }

        .edmConflictLine {
          font-size: 12px;
          color: #7f1d1d;
        }

        .edmSuggestWrap {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .edmSuggestLabel {
          font-size: 11.5px;
          font-weight: 700;
          color: #7f1d1d;
        }

        .edmSuggestList {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .edmSuggestChip {
          background: white;
          border: 1px solid #fca5a5;
          color: #991b1b;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 999px;
        }

        .edmGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px 16px;
        }

        .edmField {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .edmLabel {
          font-size: 11px;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }

        .edmValue {
          font-size: 13.5px;
          font-weight: 600;
          color: #111827;
          word-break: break-word;
        }

        .edmDropOffEdit {
          display: flex;
          gap: 6px;
          align-items: center;
        }

        .edmTimeInput {
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 6px 8px;
          font-size: 13px;
          color: #111827;
        }

        .edmSaveBtn {
          background: #1f5aa6;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 6px 12px;
          font-weight: 700;
          font-size: 12px;
          cursor: pointer;
        }

        @media (max-width: 480px) {
          .edmGrid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
