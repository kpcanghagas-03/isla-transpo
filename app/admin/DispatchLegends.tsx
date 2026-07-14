"use client";

import { VehicleMap, STATUS_BADGE, getDriverColor } from "./types";

type DispatchLegendsProps = {
  vehicleMap: VehicleMap;
  driverColorMap: Record<string, string>;
};

const STATUS_ORDER = ["Pending", "Approved", "On the way", "Completed", "Disapproved", "Emergency"];

export default function DispatchLegends({ vehicleMap, driverColorMap }: DispatchLegendsProps) {
  const drivers = Array.from(new Set(Object.values(vehicleMap).map((v) => v.driver))).sort();

  return (
    <div className="dlWrap">
      <div className="dlBlock">
        <span className="dlLabel">Driver Legend</span>
        <div className="dlChips">
          {drivers.map((d) => (
            <span key={d} className="dlChip">
              <span className="dlDot" style={{ background: getDriverColor(d, driverColorMap) }} />
              {d}
            </span>
          ))}
          <span className="dlChip">
            <span className="dlDot" style={{ background: "#94a3b8" }} />
            Unassigned
          </span>
        </div>
      </div>

      <div className="dlBlock">
        <span className="dlLabel">Status Legend</span>
        <div className="dlChips">
          {STATUS_ORDER.map((s) => (
            <span key={s} className="dlChip">
              {STATUS_BADGE[s]} {s}
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        .dlWrap {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          background: white;
          border-radius: 14px;
          padding: 12px 16px;
          box-shadow: 0 8px 18px rgba(0, 0, 0, 0.06);
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .dlBlock {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .dlLabel {
          font-size: 11px;
          font-weight: 800;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }

        .dlChips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .dlChip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          color: #334155;
        }

        .dlDot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
}
