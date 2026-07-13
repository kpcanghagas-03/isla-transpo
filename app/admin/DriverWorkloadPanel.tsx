"use client";

import { useMemo } from "react";
import { User } from "lucide-react";
import { Request, VehicleMap, splitVehicles, lookupDriver } from "./types";

type DriverWorkloadPanelProps = {
  requests: Request[];
  vehicleMap: VehicleMap;
  activeDriver: string | null;
  onSelectDriver: (driver: string | null) => void;
};

export default function DriverWorkloadPanel({
  requests,
  vehicleMap,
  activeDriver,
  onSelectDriver,
}: DriverWorkloadPanelProps) {
  const workload = useMemo(() => {
    const counts = new Map<string, number>();

    // Seed every known driver at 0 so drivers with no current
    // assignments still show up (mirrors the Vehicle Workload panel).
    Object.values(vehicleMap).forEach((info) => {
      if (!counts.has(info.driver)) counts.set(info.driver, 0);
    });

    requests.forEach((r) => {
      splitVehicles(r.assigned_vehicle).forEach((v) => {
        const info = lookupDriver(v, vehicleMap);
        if (info) {
          counts.set(info.driver, (counts.get(info.driver) || 0) + 1);
        }
      });
    });

    const rows = Array.from(counts.entries()).map(([driver, count]) => ({
      driver,
      count,
    }));

    rows.sort((a, b) => b.count - a.count);

    const max = rows.reduce((m, r) => Math.max(m, r.count), 0);

    return { rows, max };
  }, [requests, vehicleMap]);

  return (
    <div className="dwPanel">
      <div className="dwHeader">
        <User size={16} />
        <span>Driver Workload</span>
      </div>

      <div className="dwList">
        {workload.rows.length === 0 ? (
          <p className="dwEmpty">No drivers configured yet.</p>
        ) : (
          workload.rows.map(({ driver, count }) => {
            const isActive = activeDriver === driver;
            const pct = workload.max > 0 ? Math.round((count / workload.max) * 100) : 0;

            return (
              <button
                key={driver}
                className={`dwRow ${isActive ? "dwRowActive" : ""}`}
                onClick={() => onSelectDriver(isActive ? null : driver)}
                title={driver}
              >
                <div className="dwRowTop">
                  <span className="dwName">{driver}</span>
                  <span className="dwCount">
                    {count === 0 ? "No Trips" : `${count} Trip${count === 1 ? "" : "s"}`}
                  </span>
                </div>
                <div className="dwBarTrack">
                  <div
                    className="dwBarFill"
                    style={{
                      width: `${pct}%`,
                      background: count === 0 ? "#e2e8f0" : "#a61e22",
                    }}
                  />
                </div>
              </button>
            );
          })
        )}
      </div>

      <style jsx>{`
        .dwPanel {
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

        .dwHeader {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          color: #0f172a;
          font-size: 14px;
        }

        .dwList {
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-height: 260px;
          overflow-y: auto;
        }

        .dwEmpty {
          font-size: 12px;
          color: #94a3b8;
          font-weight: 600;
        }

        .dwRow {
          text-align: left;
          background: #f8fafc;
          border: 1px solid transparent;
          border-radius: 10px;
          padding: 8px 10px;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s ease;
        }

        .dwRow:hover {
          background: #f1f5f9;
        }

        .dwRowActive {
          border-color: #a61e22;
          background: #fbeaec;
        }

        .dwRowTop {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 6px;
        }

        .dwName {
          font-size: 13px;
          font-weight: 700;
          color: #111827;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .dwCount {
          font-size: 11px;
          font-weight: 600;
          color: #64748b;
          white-space: nowrap;
        }

        .dwBarTrack {
          height: 6px;
          border-radius: 999px;
          background: #e2e8f0;
          overflow: hidden;
        }

        .dwBarFill {
          height: 100%;
          border-radius: 999px;
          transition: width 0.3s ease;
        }
      `}</style>
    </div>
  );
}
