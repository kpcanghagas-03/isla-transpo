"use client";

import { useMemo } from "react";
import { AlertTriangle } from "lucide-react";
import { Request } from "./types";

type UnassignedRequestsCardProps = {
  requests: Request[];
  toPHDate: (isoDate: string | null) => string | null;
  toPHTime: (time: string | null) => string | null;
  onFocusRequest: (requestCode: string) => void;
};

export default function UnassignedRequestsCard({
  requests,
  toPHDate,
  toPHTime,
  onFocusRequest,
}: UnassignedRequestsCardProps) {
  const unassigned = useMemo(() => {
    return requests
      .filter((r) => !r.assigned_vehicle && r.status !== "Completed" && r.status !== "Disapproved")
      .sort((a, b) => {
        const dateA = a.pick_up_date || "";
        const dateB = b.pick_up_date || "";
        const timeA = a.pick_up_time || "";
        const timeB = b.pick_up_time || "";
        return dateA.localeCompare(dateB) || timeA.localeCompare(timeB);
      });
  }, [requests]);

  return (
    <div className="urcPanel">
      <div className="urcHeader">
        <AlertTriangle size={16} color="#ef4444" />
        <span>Unassigned Requests</span>
        <span className="urcBadge">{unassigned.length}</span>
      </div>

      {unassigned.length === 0 ? (
        <p className="urcEmpty">Every active request has a vehicle assigned. 🎉</p>
      ) : (
        <div className="urcList">
          {unassigned.map((r) => (
            <button
              key={r.id}
              className="urcRow"
              onClick={() => onFocusRequest(r.request_code || r.requester_name)}
              title="Click to find in the Scheduling Board table"
            >
              <div className="urcTop">
                <span className="urcPassenger">
                  {r.passenger_names || r.requester_name || "Unnamed"}
                </span>
                {r.request_code && <span className="urcCode">{r.request_code}</span>}
              </div>
              <div className="urcMeta">
                <span>
                  {toPHDate(r.pick_up_date) || "No date"}
                  {r.pick_up_time ? `, ${toPHTime(r.pick_up_time)}` : ""}
                </span>
                <span className="urcLocation">📍 {r.pickup_location || "N/A"}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      <style jsx>{`
        .urcPanel {
          background: white;
          border-radius: 16px;
          padding: 16px;
          box-shadow: 0 8px 18px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.25);
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }

        .urcHeader {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          color: #0f172a;
          font-size: 14px;
        }

        .urcBadge {
          background: #ef4444;
          color: white;
          font-size: 11px;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 999px;
        }

        .urcEmpty {
          font-size: 12px;
          color: #64748b;
          font-weight: 600;
        }

        .urcList {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 8px;
          max-height: 300px;
          overflow-y: auto;
        }

        .urcRow {
          text-align: left;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 10px;
          padding: 10px 12px;
          cursor: pointer;
          font-family: inherit;
          display: flex;
          flex-direction: column;
          gap: 4px;
          transition: all 0.15s ease;
        }

        .urcRow:hover {
          background: #fee2e2;
        }

        .urcTop {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 8px;
        }

        .urcPassenger {
          font-size: 13px;
          font-weight: 700;
          color: #111827;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .urcCode {
          font-size: 10px;
          font-family: monospace;
          font-weight: 700;
          color: #991b1b;
          white-space: nowrap;
        }

        .urcMeta {
          display: flex;
          flex-direction: column;
          gap: 2px;
          font-size: 11.5px;
          color: #7f1d1d;
        }

        .urcLocation {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}
