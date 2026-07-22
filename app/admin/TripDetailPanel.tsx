"use client";

import { useEffect, useMemo, useState } from "react";
import { X, AlertTriangle, RefreshCcw, CheckCircle2, Pencil } from "lucide-react";
import {
  ScheduleRequest,
  VehicleMap,
  VehicleStatusMap,
  splitVehicles,
  lookupDriver,
  getConflicts,
  getVehicleAvailability,
  getDriverColor,
  getStatusBadge,
  getPassengerCount,
} from "./types";

type TripDetailPanelProps = {
  request: ScheduleRequest;
  requests: ScheduleRequest[];
  vehicleOptions: string[];
  vehicleMap: VehicleMap;
  statusMap: VehicleStatusMap;
  driverColorMap: Record<string, string>;
  toPHDate: (isoDate: string | null) => string | null;
  toPHTime: (time: string | null) => string | null;
  onClose: () => void;
  // All of the below are OPTIONAL on purpose: this panel renders fine
  // read-only if you haven't wired a handler yet, and each button simply
  // hides itself when its handler isn't supplied. Wire these to your
  // existing assignment/status logic in page.tsx (the same functions
  // already used by the vehicle-picker checkboxes / status dropdown on
  // the Dashboard tab) rather than duplicating that logic here.
  onSaveDropOffTime?: (id: number, dropOffTime: string) => void;
  // Selecting a vehicle from the dropdown also assigns its driver (vehicleMap
  // ties each vehicle to exactly one driver), so there's no separate
  // onAssignDriver -- one dropdown drives both, same as the Dashboard tab's
  // vehicle picker.
  onAssignVehicle?: (id: number, vehicleString: string) => void;
  onEditSchedule?: (request: ScheduleRequest) => void;
  onUpdateStatus?: (id: number, status: string) => void;
  onCompleteTrip?: (id: number) => void;
};

const STATUS_OPTIONS = ["Pending", "Approved", "On the way", "Completed", "Disapproved", "Emergency"];

const STATUS_FLOW = ["Pending", "Approved", "On the way", "Completed"];

export default function TripDetailPanel({
  request,
  requests,
  vehicleOptions,
  vehicleMap,
  statusMap,
  driverColorMap,
  toPHDate,
  toPHTime,
  onClose,
  onSaveDropOffTime,
  onAssignVehicle,
  onEditSchedule,
  onUpdateStatus,
  onCompleteTrip,
}: TripDetailPanelProps) {
  const [dropOffDraft, setDropOffDraft] = useState(request.drop_off_time || "");
  // Dropdown only supports assigning ONE vehicle at a time. Requests that
  // already have multiple vehicles joined with " | " (rare -- large-group
  // trips) keep showing here as their first vehicle; picking a new one
  // from the dropdown replaces the full list with just that selection.
  // For multi-vehicle assignment, use the checkboxes on the Dashboard tab.
  const [vehicleDraft, setVehicleDraft] = useState(splitVehicles(request.assigned_vehicle)[0] || "");

  // Re-sync drafts when the panel switches to a different request (e.g.
  // clicking another row/card while the panel is already open) so stale
  // values from the previous request don't linger in these controls.
  useEffect(() => {
    setDropOffDraft(request.drop_off_time || "");
    setVehicleDraft(splitVehicles(request.assigned_vehicle)[0] || "");
  }, [request.id, request.drop_off_time, request.assigned_vehicle]);

  const conflicts = useMemo(() => getConflicts(requests, vehicleMap), [requests, vehicleMap]);
  const myConflicts = conflicts.get(request.id) || [];

  const vehicles = splitVehicles(request.assigned_vehicle);
  const drivers = vehicles.map((v) => lookupDriver(v, vehicleMap)?.driver).filter(Boolean) as string[];
  const primaryDriver = drivers[0] || null;
  const driverColor = getDriverColor(primaryDriver, driverColorMap);

  const suggestions = useMemo(() => {
    if (myConflicts.length === 0) return [];
    return vehicleOptions
      .filter((v) => !vehicles.includes(v))
      .filter(
        (v) => getVehicleAvailability(v, request.pick_up_date, requests, conflicts, statusMap) === "available"
      )
      .slice(0, 4);
  }, [myConflicts.length, vehicleOptions, vehicles, request.pick_up_date, requests, conflicts, statusMap]);

  const passengerList = (request.passenger_names || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const statusIndex = STATUS_FLOW.indexOf(request.status);

  return (
    <div className="tdOverlay" onClick={onClose}>
      <div className="tdPanel" onClick={(e) => e.stopPropagation()}>
        <div className="tdHeader" style={{ borderLeftColor: driverColor }}>
          <div>
            <h3 className="tdTitle">{request.passenger_names || request.requester_name}</h3>
            <div className="tdSubRow">
              {request.request_code && <span className="tdCode">{request.request_code}</span>}
              <span className="tdBadge">{getStatusBadge(request.status)} {request.status}</span>
            </div>
          </div>
          <button className="tdCloseBtn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {myConflicts.length > 0 && (
          <div className="tdConflictBox">
            <div className="tdConflictTitle">
              <AlertTriangle size={15} />
              Scheduling conflict detected
            </div>
            {myConflicts.map((c) => (
              <div key={c.id} className="tdConflictLine">
                ⚠ Overlaps with {c.passenger_names || c.requester_name} (
                {toPHTime(c.pick_up_time) || c.pick_up_time || "no time"}
                {c.drop_off_time ? `–${toPHTime(c.drop_off_time)}` : ""})
              </div>
            ))}
            {suggestions.length > 0 && (
              <div className="tdSuggestWrap">
                <span className="tdSuggestLabel">Suggested available vehicles:</span>
                <div className="tdSuggestList">
                  {suggestions.map((v) => (
                    <span key={v} className="tdSuggestChip">
                      {v.split(" - ")[0]} ({vehicleMap[v]?.driver})
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ---- Status timeline ---- */}
        {statusIndex >= 0 && (
          <div className="tdTimeline">
            {STATUS_FLOW.map((s, i) => (
              <div key={s} className={`tdTimelineStep ${i <= statusIndex ? "tdTimelineStepDone" : ""}`}>
                <span className="tdTimelineDot" />
                <span className="tdTimelineLabel">{s}</span>
              </div>
            ))}
          </div>
        )}

        <div className="tdSection">
          <span className="tdSectionLabel">Passengers ({getPassengerCount(request)})</span>
          {passengerList.length > 0 ? (
            <ul className="tdPassengerList">
              {passengerList.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          ) : (
            <span className="tdValue">{request.requester_name || "N/A"}</span>
          )}
        </div>

        <div className="tdGrid">
          <div className="tdField">
            <span className="tdLabel">Pickup Date/Time</span>
            <span className="tdValue">
              {toPHDate(request.pick_up_date) || "N/A"} {toPHTime(request.pick_up_time) || ""}
            </span>
          </div>
          <div className="tdField">
            <span className="tdLabel">Flight No.</span>
            <span className="tdValue">{request.flight_no || "N/A"}</span>
          </div>
          <div className="tdField tdFieldWide">
            <span className="tdLabel">Drop-off Time</span>
            {onSaveDropOffTime ? (
              <div className="tdDropOffEdit">
                <input
                  type="time"
                  value={dropOffDraft || ""}
                  onChange={(e) => setDropOffDraft(e.target.value)}
                  className="tdTimeInput"
                />
                <button
                  className="tdSaveBtn"
                  onClick={() => dropOffDraft && onSaveDropOffTime(request.id, dropOffDraft)}
                >
                  Save
                </button>
              </div>
            ) : (
              <span className="tdValue">
                {toPHTime(request.drop_off_time || null) || "Not set (defaults to +60 min)"}
              </span>
            )}
          </div>
          <div className="tdField">
            <span className="tdLabel">Pickup Location</span>
            <span className="tdValue">{request.pickup_location || "N/A"}</span>
          </div>
          <div className="tdField">
            <span className="tdLabel">Destination</span>
            <span className="tdValue">{request.destination || "N/A"}</span>
          </div>
          <div className="tdField">
            <span className="tdLabel">Contact Person</span>
            <span className="tdValue">{request.contact_person || "N/A"}</span>
          </div>
          <div className="tdField tdFieldWide">
            <span className="tdLabel">Assigned Vehicle & Driver</span>
            {onAssignVehicle ? (
              <select
                className="tdSelect"
                value={vehicleDraft}
                onChange={(e) => {
                  const next = e.target.value;
                  setVehicleDraft(next);
                  onAssignVehicle(request.id, next);
                }}
              >
                <option value="">Unassigned</option>
                {vehicleOptions.map((v) => (
                  <option key={v} value={v}>
                    {v.split(" - ")[0]} — {vehicleMap[v]?.driver || "No driver on file"}
                  </option>
                ))}
              </select>
            ) : (
              <>
                <span className="tdValue">{vehicles.map((v) => v.split(" - ")[0]).join(", ") || "None"}</span>
                <span className="tdValue" style={{ color: driverColor, fontWeight: 700 }}>
                  {drivers.join(", ") || "Unassigned"}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="tdActions">
          {onEditSchedule && (
            <button className="tdActionBtn" onClick={() => onEditSchedule(request)}>
              <Pencil size={14} /> Edit Schedule
            </button>
          )}
          {onUpdateStatus && (
            <div className="tdStatusSelectWrap">
              <RefreshCcw size={14} />
              <select
                className="tdSelect"
                value={request.status}
                onChange={(e) => onUpdateStatus(request.id, e.target.value)}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          )}
          {onCompleteTrip && request.status !== "Completed" && (
            <button className="tdActionBtnPrimary" onClick={() => onCompleteTrip(request.id)}>
              <CheckCircle2 size={14} /> Complete Trip
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .tdOverlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.35);
          z-index: 200;
          display: flex;
          justify-content: flex-end;
        }

        .tdPanel {
          background: white;
          width: 420px;
          max-width: 100%;
          height: 100%;
          overflow-y: auto;
          padding: 22px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          box-shadow: -12px 0 40px rgba(0, 0, 0, 0.18);
          animation: tdSlideIn 0.22s ease;
        }

        @keyframes tdSlideIn {
          from {
            transform: translateX(24px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .tdHeader {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 10px;
          border-left: 4px solid #94a3b8;
          padding-left: 12px;
        }

        .tdTitle {
          margin: 0 0 4px;
          font-size: 17px;
          font-weight: 800;
          color: #0f172a;
        }

        .tdSubRow {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .tdCode {
          font-size: 11px;
          font-family: monospace;
          font-weight: 700;
          color: #64748b;
        }

        .tdBadge {
          font-size: 12px;
          font-weight: 700;
          color: #334155;
        }

        .tdCloseBtn {
          border: none;
          background: #f1f5f9;
          border-radius: 8px;
          padding: 6px;
          cursor: pointer;
          color: #475569;
          flex-shrink: 0;
        }

        .tdConflictBox {
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 12px;
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .tdConflictTitle {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 800;
          color: #b91c1c;
          font-size: 13px;
        }

        .tdConflictLine {
          font-size: 12px;
          color: #7f1d1d;
        }

        .tdSuggestWrap {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .tdSuggestLabel {
          font-size: 11.5px;
          font-weight: 700;
          color: #7f1d1d;
        }

        .tdSuggestList {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .tdSuggestChip {
          background: white;
          border: 1px solid #fca5a5;
          color: #991b1b;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 999px;
        }

        .tdTimeline {
          display: flex;
          justify-content: space-between;
          gap: 4px;
        }

        .tdTimelineStep {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          text-align: center;
        }

        .tdTimelineDot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: #e2e8f0;
        }

        .tdTimelineStepDone .tdTimelineDot {
          background: #1f5aa6;
        }

        .tdTimelineLabel {
          font-size: 9.5px;
          font-weight: 700;
          color: #94a3b8;
        }

        .tdTimelineStepDone .tdTimelineLabel {
          color: #1f5aa6;
        }

        .tdSection {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .tdSectionLabel {
          font-size: 11px;
          font-weight: 800;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }

        .tdPassengerList {
          margin: 0;
          padding-left: 18px;
          font-size: 13px;
          color: #111827;
          font-weight: 600;
        }

        .tdGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px 16px;
        }

        .tdField {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .tdFieldWide {
          grid-column: 1 / -1;
        }

        .tdLabel {
          font-size: 11px;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }

        .tdValue {
          font-size: 13.5px;
          font-weight: 600;
          color: #111827;
          word-break: break-word;
        }

        .tdDropOffEdit {
          display: flex;
          gap: 6px;
          align-items: center;
        }

        .tdTimeInput {
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 6px 8px;
          font-size: 13px;
          color: #111827;
        }

        .tdSaveBtn {
          background: #1f5aa6;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 6px 12px;
          font-weight: 700;
          font-size: 12px;
          cursor: pointer;
        }

        .tdSelect {
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 7px 8px;
          font-size: 13px;
          font-weight: 600;
          color: #111827;
          background: white;
          font-family: inherit;
          cursor: pointer;
        }

        .tdStatusSelectWrap {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #334155;
        }

        .tdActions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px solid #eef2f7;
        }

        .tdActionBtn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          color: #334155;
          font-weight: 700;
          font-size: 12px;
          padding: 8px 12px;
          border-radius: 9px;
          cursor: pointer;
          font-family: inherit;
        }

        .tdActionBtn:hover {
          background: #e2e8f0;
        }

        .tdActionBtnPrimary {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #16a34a;
          border: none;
          color: white;
          font-weight: 700;
          font-size: 12px;
          padding: 8px 12px;
          border-radius: 9px;
          cursor: pointer;
          font-family: inherit;
        }

        @media (max-width: 480px) {
          .tdPanel {
            width: 100%;
          }
          .tdGrid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
