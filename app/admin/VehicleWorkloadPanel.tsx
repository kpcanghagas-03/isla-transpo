"use client";

import { useMemo } from "react";
import { Truck } from "lucide-react";
import { ScheduleRequest, splitVehicles } from "./types";

type VehicleWorkloadPanelProps = {
  requests: ScheduleRequest[];
  vehicleOptions: string[];
  activeVehicle: string | null;
  onSelectVehicle: (vehicle: string | null) => void;
};

export default function VehicleWorkloadPanel({
  requests,
  vehicleOptions,
  activeVehicle,
  onSelectVehicle,
}: VehicleWorkloadPanelProps) {
  const workload = useMemo(() => {
    const counts = new Map<string, number>();
    vehicleOptions.forEach((v) => counts.set(v, 0));

    requests.forEach((r) => {
      splitVehicles(r.assigned_vehicle).forEach((v) => {
        counts.set(v, (counts.get(v) || 0) + 1);
      });
    });

    const rows = Array.from(counts.entries()).map(([vehicle, count]) => ({
      vehicle,
      count,
    }));

    rows.sort((a, b) => b.count - a.count);

    const max = rows.reduce((m, r) => Math.max(m, r.count), 0);

    return { rows, max };
  }, [requests, vehicleOptions]);

  return (
    <div className="vwPanel">
      <div className="vwHeader">
        <Truck size={16} />
        <span>Vehicle Workload</span>
      </div>

      <div className="vwList">
        {workload.rows.map(({ vehicle, count }) => {
          const isActive = activeVehicle === vehicle;
          const pct = workload.max > 0 ? Math.round((count / workload.max) * 100) : 0;
          // Short label: "Toyota Van - SKB 5333" -> "Toyota Van"
          const shortLabel = vehicle.split(" - ")[0];

          return (
            <button
              key={vehicle}
              className={`vwRow ${isActive ? "vwRowActive" : ""}`}
              onClick={() => onSelectVehicle(isActive ? null : vehicle)}
              title={vehicle}
            >
              <div className="vwRowTop">
                <span className="vwName">{shortLabel}</span>
                <span className="vwCount">
                  {count === 0 ? "No Assignments" : `${count} Trip${count === 1 ? "" : "s"}`}
                </span>
              </div>
              <div className="vwBarTrack">
                <div
                  className="vwBarFill"
                  style={{
                    width: `${pct}%`,
                    background: count === 0 ? "#e2e8f0" : "#1f5aa6",
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>

      <style jsx>{`
        .vwPanel {
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

        .vwHeader {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          color: #0f172a;
          font-size: 14px;
        }

        .vwList {
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-height: 260px;
          overflow-y: auto;
        }

        .vwRow {
          text-align: left;
          background: #f8fafc;
          border: 1px solid transparent;
          border-radius: 10px;
          padding: 8px 10px;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s ease;
        }

        .vwRow:hover {
          background: #f1f5f9;
        }

        .vwRowActive {
          border-color: #1f5aa6;
          background: #eaf1fb;
        }

        .vwRowTop {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 6px;
        }

        .vwName {
          font-size: 13px;
          font-weight: 700;
          color: #111827;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .vwCount {
          font-size: 11px;
          font-weight: 600;
          color: #64748b;
          white-space: nowrap;
        }

        .vwBarTrack {
          height: 6px;
          border-radius: 999px;
          background: #e2e8f0;
          overflow: hidden;
        }

        .vwBarFill {
          height: 100%;
          border-radius: 999px;
          transition: width 0.3s ease;
        }
      `}</style>
    </div>
  );
}
